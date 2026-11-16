import Link from "next/link";
import {
  requireAdministrator,
  createAdminDatabaseClient,
} from "@/lib/supabase/admin";

export default async function ProjectsPage() {
  await requireAdministrator();

  const db = createAdminDatabaseClient();

  const { data: projects, error } = await db
    .from("projects")
    .select("id,title,slug,status,featured,created_at")
    .order("created_at", { ascending: false });

  return (
    <section className="mp-editor">
      <div className="mp-page-head">
        <div>
          <h1>Projects</h1>
          <p className="mp-muted">
            Create, edit and publish your portfolio.
          </p>
        </div>

        <Link href="/admin/projects/new" className="mp-primary">
          + Create new project
        </Link>
      </div>

      <div className="mp-panel">
        {error ? (
          <p role="alert">
            Could not load projects: {error.message}
          </p>
        ) : !projects?.length ? (
          <div className="mp-empty">
            <h2>No projects yet</h2>
            <p className="mp-muted">
              Your portfolio is empty. Create your first project.
            </p>
            <Link href="/admin/projects/new" className="mp-primary">
              Create first project
            </Link>
          </div>
        ) : (
          <div className="mp-list">
            {projects.map((project) => (
              <Link
                className="mp-list-item"
                href={`/admin/projects/${project.id}`}
                key={project.id}
              >
                <span>
                  <strong>{project.title}</strong>
                  <small>/{project.slug}</small>
                </span>
                <span className="mp-muted">
                  {project.status}
                  {project.featured ? " · Featured" : ""}
                  {" →"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}