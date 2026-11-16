import { notFound } from "next/navigation";
import ProjectEditor from "@/components/admin/ProjectEditor";
import {
  requireAdministrator,
  createAdminDatabaseClient,
} from "@/lib/supabase/admin";
import type { ProjectInput } from "@/lib/admin/project";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: Props) {
  await requireAdministrator();

  const { id } = await params;
  const db = createAdminDatabaseClient();

  const [
    { data: project },
    { data: categories },
    { data: media },
  ] = await Promise.all([
    db.from("projects").select("*").eq("id", id).single(),
    db
      .from("project_categories")
      .select("category_id")
      .eq("project_id", id),
    db
      .from("project_media")
      .select("id,media_type,storage_path,alt_text,caption")
      .eq("project_id", id)
      .order("display_order"),
  ]);

  if (!project) notFound();

  const initial: ProjectInput = {
    title: project.title,
    slug: project.slug,
    summary: project.summary ?? "",
    description: project.description ?? "",
    location: project.location ?? "",
    completion_date: project.completion_date ?? "",
    status: project.status,
    featured: project.featured,
    display_order: project.display_order,
    categories: (categories ?? []).map((x) => x.category_id),
  };

  return (
    <ProjectEditor
      projectId={id}
      initial={initial}
      initialMedia={media ?? []}
      storageBase={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/meppeplin-projects`}
    />
  );
}