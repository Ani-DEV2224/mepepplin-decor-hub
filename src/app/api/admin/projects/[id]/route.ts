import { NextResponse } from "next/server";
import {
  getAdministrator,
  createAdminDatabaseClient,
} from "@/lib/supabase/admin";
import { projectSchema, BUCKET } from "@/lib/admin/project";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ id: string }>;
};

const unauthorized = () =>
  NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );

export async function PATCH(request: Request, { params }: Context) {
  if (!(await getAdministrator())) return unauthorized();

  const { id } = await params;

  const parsed = projectSchema.safeParse(
    await request.json().catch(() => null)
  );

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid project details",
        issues: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const db = createAdminDatabaseClient();

  const { data: old, error: readError } = await db
    .from("projects")
    .select("status,published_at")
    .eq("id", id)
    .single();

  if (readError || !old) {
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404 }
    );
  }

  const { categories, completion_date, ...fields } = parsed.data;

  const published_at =
    fields.status === "published"
      ? old.published_at ?? new Date().toISOString()
      : null;

  const { error } = await db
    .from("projects")
    .update({
      ...fields,
      completion_date: completion_date || null,
      published_at,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  const { error: clearError } = await db
    .from("project_categories")
    .delete()
    .eq("project_id", id);

  if (clearError) {
    return NextResponse.json(
      {
        error:
          "Project updated, but categories could not be synchronized: " +
          clearError.message,
      },
      { status: 500 }
    );
  }

  if (categories.length) {
    const { error: catError } = await db
      .from("project_categories")
      .insert(
        [...new Set(categories)].map((category_id) => ({
          project_id: id,
          category_id,
        }))
      );

    if (catError) {
      return NextResponse.json(
        {
          error:
            "Project updated, but categories could not be synchronized: " +
            catError.message,
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: Context
) {
  if (!(await getAdministrator())) return unauthorized();

  const { id } = await params;
  const db = createAdminDatabaseClient();

  const { data: media, error: mediaError } = await db
    .from("project_media")
    .select("storage_path")
    .eq("project_id", id);

  if (mediaError) {
    return NextResponse.json(
      { error: mediaError.message },
      { status: 500 }
    );
  }

  const { error: catError } = await db
    .from("project_categories")
    .delete()
    .eq("project_id", id);

  if (catError) {
    return NextResponse.json(
      { error: catError.message },
      { status: 500 }
    );
  }

  const { error: mediaDeleteError } = await db
    .from("project_media")
    .delete()
    .eq("project_id", id);

  if (mediaDeleteError) {
    return NextResponse.json(
      { error: mediaDeleteError.message },
      { status: 500 }
    );
  }

  const { error } = await db
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  if (media?.length) {
    await db.storage
      .from(BUCKET)
      .remove(media.map((m) => m.storage_path));
  }

  return NextResponse.json({ ok: true });
}