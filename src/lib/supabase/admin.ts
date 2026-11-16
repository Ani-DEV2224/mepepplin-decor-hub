
import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { createClient } from "./server";

export async function getAdministrator() {
  const supabase = await createClient();

  const { data, error } =
    await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  const adminId = process.env.ADMIN_USER_ID;

  if (!adminId || data.user.id !== adminId) {
    return null;
  }

  return data.user;
}

export async function requireAdministrator() {
  const administrator = await getAdministrator();

  if (!administrator) {
    redirect("/admin/login");
  }

  return administrator;
}

export function createAdminDatabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secret) {
    throw new Error(
      "Supabase server configuration is missing."
    );
  }

  return createSupabaseClient(url, secret, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
