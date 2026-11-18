import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getAdministrator,
  createAdminDatabaseClient,
} from "@/lib/supabase/admin";
import { BUCKET } from "@/lib/admin/project";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ id: string }>;
};

const schema = z.object({
  storage_path: z.string().min(1).max(500),
  media_type: z.enum(["image", "video"]),
  phase: z.enum(["general", "before", "after"]).default("general"),
  alt_text: z.string().max(300).default(""),
  caption: z.string().max(500).default(""),
});

export async function POST(
  request: Request,
  { params }: Context
) {
  if (!(await getAdministrator())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const parsed = schema.safeParse(
    await request.json().catch(() => null)
  );

  if (
    !parsed.success ||
    !parsed.data.storage_path.startsWith(id + "/")
  ) {
    return NextResponse.json(
      { error: "Invalid media" },
      { status: 400 }
    );
  }

  const db = createAdminDatabaseClient();

  const { data: project } = await db
    .from("projects")
    .select("id,cover_image_path")
    .eq("id", id)
    .single();

  if (!project) {
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404 }
    );
  }

  const { data: last } = await db
    .from("project_media")
    .select("display_order")
    .eq("project_id", id)
    .order("display_order", { ascending: false })
    .limit(1);

  const { data, error } = await db
    .from("project_media")
    .insert({
      project_id: id,
      ...parsed.data,
      display_order:
        (last?.[0]?.display_order ?? -1) + 1,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  if (
    parsed.data.media_type === "image" &&
    !project.cover_image_path
  ) {
    await db
      .from("projects")
      .update({
        cover_image_path: parsed.data.storage_path,
      })
      .eq("id", id);
  }

  return NextResponse.json(
    { id: data.id },
    { status: 201 }
  );
}

export async function DELETE(
  request: Request,
  { params }: Context
) {
  if (!(await getAdministrator())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const mediaId = new URL(request.url).searchParams.get("mediaId");

  if (!mediaId) {
    return NextResponse.json(
      { error: "Missing mediaId" },
      { status: 400 }
    );
  }

  const db = createAdminDatabaseClient();

  const { data: media } = await db
    .from("project_media")
    .select("storage_path")
    .eq("id", mediaId)
    .eq("project_id", id)
    .single();

  if (!media) {
    return NextResponse.json(
      { error: "Media not found" },
      { status: 404 }
    );
  }

  const { error } = await db
    .from("project_media")
    .delete()
    .eq("id", mediaId)
    .eq("project_id", id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  const { data: project } = await db
    .from("projects")
    .select("cover_image_path")
    .eq("id", id)
    .single();

  if (project?.cover_image_path === media.storage_path) {
    await db
      .from("projects")
      .update({ cover_image_path: null })
      .eq("id", id);
  }

  await db.storage
    .from(BUCKET)
    .remove([media.storage_path]);

  return NextResponse.json({ ok: true });
}

export async function PATCH(
  request: Request,
  { params }: Context
) {
  if (!(await getAdministrator())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  const parsed = z.object({
    orderedIds: z.array(z.string().uuid()).max(100),
    coverId: z.string().uuid().nullable(),
    phases: z.record(z.string().uuid(), z.enum(["general", "before", "after"])).default({}),
  }).safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid media arrangement" },
      { status: 400 }
    );
  }

  const { orderedIds, coverId, phases } = parsed.data;

  if (new Set(orderedIds).size !== orderedIds.length) {
    return NextResponse.json(
      { error: "Duplicate media IDs" },
      { status: 400 }
    );
  }

  const db = createAdminDatabaseClient();

  const { data: existing, error: readError } = await db
    .from("project_media")
    .select("id,media_type,storage_path")
    .eq("project_id", id);

  if (readError) {
    return NextResponse.json(
      { error: readError.message },
      { status: 500 }
    );
  }

  const all = existing ?? [];
  const existingIds = new Set(all.map((item) => item.id));

  if (
    orderedIds.length !== all.length ||
    orderedIds.some((mediaId) => !existingIds.has(mediaId))
  ) {
    return NextResponse.json(
      { error: "Media arrangement does not match project files" },
      { status: 400 }
    );
  }

  const cover = coverId
    ? all.find(
        (item) =>
          item.id === coverId && item.media_type === "image"
      )
    : null;

  if (coverId && !cover) {
    return NextResponse.json(
      { error: "Invalid cover image" },
      { status: 400 }
    );
  }

  for (const [index, mediaId] of orderedIds.entries()) {
    const { error } = await db
      .from("project_media")
      .update({ display_order: index, phase: phases[mediaId] ?? "general" })
      .eq("id", mediaId)
      .eq("project_id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  }

  const { error: projectError } = await db
    .from("projects")
    .update({
      cover_image_path: cover?.storage_path ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (projectError) {
    return NextResponse.json(
      { error: projectError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}