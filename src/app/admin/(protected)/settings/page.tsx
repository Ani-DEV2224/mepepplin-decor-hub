import { requireAdministrator } from "@/lib/supabase/admin";
import AdminBrand from "@/components/admin/AdminBrand";
import AdminPasswordForm from "@/components/admin/AdminPasswordForm";

export default async function SettingsPage() {
  const admin = await requireAdministrator();

  return (
    <section className="mp-editor">
      <div className="mp-page-head">
        <div>
          <h1>Settings</h1>
          <p className="mp-muted">
            Branding and administrator account.
          </p>
        </div>
      </div>

      <div className="mp-panel mp-form">
        <h2>Website identity</h2>
        <AdminBrand href="/" />

        <p className="mp-muted">
          The dashboard uses the existing logo at{" "}
          <code>
            /images/brand/mepepplin-logo.png
          </code>
          . Replace that file in your project to
          update the brand image everywhere.
        </p>
      </div>

      <div className="mp-panel mp-form">
        <h2>Administrator</h2>

        <label>
          Signed-in email
          <input
            value={admin.email ?? ""}
            readOnly
          />
        </label>

        <AdminPasswordForm />
      </div>
    </section>
  );
}