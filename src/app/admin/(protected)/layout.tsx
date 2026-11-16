
import type { ReactNode } from "react";

import { requireAdministrator } from
  "@/lib/supabase/admin";

import AdminShell from
  "@/components/admin/AdminShell";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdministrator();

  return (
    <AdminShell>
      {children}
    </AdminShell>
  );
}