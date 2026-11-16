import { NextResponse } from "next/server";
import {
  getAdministrator,
  createAdminDatabaseClient,
} from "@/lib/supabase/admin";
import { projectSchema } from "@/lib/admin/project";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await getAdministrator())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = projectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid project details",
        issues: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const { categories, completion_date, ...fields } = parsed.data;
  const db = createAdminDatabaseClient();

  const { data, error } = await db
    .from("projects")
    .insert({
      ...fields,
      completion_date: completion_date || null,
      published_at:
        fields.status === "published"
          ? new Date().toISOString()
          : null,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  if (categories.length) {
    const { error: categoryError } = await db
      .from("project_categories")
      .insert(
        [...new Set(categories)].map((category_id) => ({
          project_id: data.id,
          category_id,
        }))
      );

    if (categoryError) {
      return NextResponse.json(
        {
          id: data.id,
          warning:
            "Project saved but categories could not be saved: " +
            categoryError.message,
        },
        { status: 201 }
      );
    }
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}