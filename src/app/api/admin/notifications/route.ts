
import { NextResponse } from "next/server";
import {
  getAdministrator,
  createAdminDatabaseClient,
} from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const administrator = await getAdministrator();

  if (!administrator) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const db = createAdminDatabaseClient();

  const [countResult, recentResult] = await Promise.all([
    db
      .from("project_enquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),

    db
      .from("project_enquiries")
      .select("id,name,service,created_at")
      .eq("status", "new")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  if (countResult.error || recentResult.error) {
    return NextResponse.json(
      { error: "Unable to load notifications" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      count: countResult.count ?? 0,
      items: recentResult.data ?? [],
    },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    }
  );
}
