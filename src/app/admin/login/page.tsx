
import { redirect } from "next/navigation";

import { getAdministrator } from
  "@/lib/supabase/admin";

import AdminLoginForm from
  "@/components/admin/AdminLoginForm";

export default async function AdminLoginPage() {
  const administrator = await getAdministrator();

  if (administrator) {
    redirect("/admin");
  }

  return <AdminLoginForm />;
}