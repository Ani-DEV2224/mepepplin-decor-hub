import { NextResponse } from "next/server";
import {
  getAdministrator,
  createAdminDatabaseClient,
} from "@/lib/supabase/admin";
import { BUCKET } from "@/lib/admin/project";

export const runtime = "nodejs";

const types: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

export async function POST(request: Request) {
  if (!(await getAdministrator())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);
  const projectId = body?.projectId;
  const file = body?.file;

  if (
    !file || typeof file.type !== "string" || typeof file.size !== "number" ||
    typeof projectId !== "string" ||
    !/^[0-9a-f-]{36}$/i.test(projectId)
  ) {
    return NextResponse.json(
      { error: "Invalid upload" },
      { status: 400 }
    );
  }

  const ext = types[file.type];

  if (
    !ext ||
    file.size > 50 * 1024 * 1024 ||
    !Number.isFinite(file.size) || file.size <= 0
  ) {
    return NextResponse.json(
      {
        error:
          "Use JPG, PNG, WebP, AVIF, MP4 or WebM, up to 50 MB",
      },
      { status: 400 }
    );
  }

  const db = createAdminDatabaseClient();

  const { data: project } = await db
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .single();

  if (!project) {
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404 }
    );
  }

  const storage_path =
    `${projectId}/${crypto.randomUUID()}.${ext}`;

  const { data: signed, error } = await db.storage
    .from(BUCKET)
    .createSignedUploadUrl(storage_path);

  if (error || !signed) {
    return NextResponse.json(
      { error: error?.message ?? "Could not authorize upload" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    storage_path,
    token: signed.token,
    media_type: file.type.startsWith("video/")
      ? "video"
      : "image",
  });
}