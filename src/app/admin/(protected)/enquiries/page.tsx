
import EnquiriesManager from "@/components/admin/EnquiriesManager";
import {
  requireAdministrator,
  createAdminDatabaseClient,
} from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function EnquiriesPage() {
  await requireAdministrator();

  const db = createAdminDatabaseClient();

  const { data, error } = await db
    .from("project_enquiries")
    .select(
      "id,name,email,phone,location,service,details,budget,timeline,status,internal_notes,created_at"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return (
      <section className="atelier-page">
        <h1>Client Enquiries</h1>
        <p role="alert">
          Unable to load enquiries: {error.message}
        </p>
      </section>
    );
  }

  return <EnquiriesManager initialEnquiries={data ?? []} />;
}
