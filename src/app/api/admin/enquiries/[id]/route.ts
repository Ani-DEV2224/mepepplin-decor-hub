
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getAdministrator,
  createAdminDatabaseClient,
} from "@/lib/supabase/admin";

type Context = {
  params: Promise<{ id: string }>;
};

const schema = z.object({
  status: z.enum([
    "new",
    "contacted",
    "in_progress",
    "closed",
  ]),
  internal_notes: z.string().max(10000),
});

export async function PATCH(
  request: NextRequest,
  context: Context
) {
  const administrator = await getAdministrator();

  if (!administrator) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json(
      { error: "Invalid enquiry ID" },
      { status: 400 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid enquiry update" },
      { status: 400 }
    );
  }

  const db = createAdminDatabaseClient();

  const { data, error } = await db
    .from("project_enquiries")
    .update(parsed.data)
    .eq("id", id)
    .select(
      "id,name,email,phone,location,service,details,budget,timeline,status,internal_notes,created_at"
    )
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Unable to update enquiry" },
      { status: 500 }
    );
  }

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "private, no-store",
    },
  });
}
