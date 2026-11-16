import ProjectEditor from "@/components/admin/ProjectEditor";
import { requireAdministrator } from "@/lib/supabase/admin";

export default async function NewProjectPage() {
  await requireAdministrator();

  return (
    <ProjectEditor
      storageBase={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/meppeplin-projects`}
    />
  );
}