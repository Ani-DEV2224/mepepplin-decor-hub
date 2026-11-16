import Link from "next/link";
import {
  FolderOpen,
  Layers3,
  Mail,
  ArrowUpRight,
  Plus,
  ChartNoAxesCombined,
  CalendarDays,
} from "lucide-react";
import {
  requireAdministrator,
  createAdminDatabaseClient,
} from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  await requireAdministrator();

  const db = createAdminDatabaseClient();

  const [
    projectsResult,
    publishedResult,
    enquiriesResult,
    recentResult,
  ] = await Promise.all([
    db.from("projects").select("*", { count: "exact", head: true }),
    db
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    db
      .from("project_enquiries")
      .select("*", { count: "exact", head: true }),
    db
      .from("project_enquiries")
      .select("id,name,service,status,created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const error =
    projectsResult.error ||
    publishedResult.error ||
    enquiriesResult.error ||
    recentResult.error;

  if (error) {
    return (
      <section className="atelier-page">
        <h1>Studio overview</h1>
        <div className="atelier-panel" role="alert">
          Unable to load dashboard data: {error.message}
        </div>
      </section>
    );
  }

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { count: monthlyCount, error: monthlyError } = await db
    .from("project_enquiries")
    .select("*", { count: "exact", head: true })
    .gte("created_at", monthStart.toISOString());

  const metrics = [
    {
      label: "Total Projects",
      value: projectsResult.count ?? 0,
      detail: "Portfolio records",
      icon: FolderOpen,
    },
    {
      label: "Published",
      value: publishedResult.count ?? 0,
      detail: "Live portfolio projects",
      icon: Layers3,
    },
    {
      label: "Enquiries",
      value: enquiriesResult.count ?? 0,
      detail: "Total submissions",
      icon: Mail,
    },
    {
      label: "This Month",
      value: monthlyError ? "—" : monthlyCount ?? 0,
      detail: "New enquiries",
      icon: CalendarDays,
    },
  ];

  return (
    <section className="atelier-page">
      <div className="atelier-hero">
        <div className="atelier-hero-copy">
          <span className="atelier-eyebrow">STUDIO OVERVIEW</span>
          <h1>
            Welcome to
            <br />
            <em>Meppeplin Decor Hub.</em>
          </h1>
          <p>
            A considered space to manage your portfolio, client
            enquiries, and studio performance.
          </p>
          <Link
            href="/admin/projects/new"
            className="atelier-button atelier-button-dark"
          >
            <Plus size={17} />
            Create Project
          </Link>
        </div>

        <div className="atelier-hero-decoration" aria-hidden="true">
          <span>DESIGN</span>
          <span>BUILD</span>
          <span>REFINE</span>
        </div>
      </div>

      <div className="atelier-metrics">
        {metrics.map(({ label, value, detail, icon: Icon }) => (
          <article className="atelier-metric" key={label}>
            <div className="atelier-metric-top">
              <span>{label}</span>
              <Icon size={21} strokeWidth={1.5} />
            </div>
            <strong>{value}</strong>
            <small>{detail}</small>
          </article>
        ))}
      </div>

      <div className="atelier-dashboard-grid">
        <article className="atelier-panel">
          <div className="atelier-panel-heading">
            <div>
              <span className="atelier-eyebrow">CLIENT RELATIONS</span>
              <h2>Recent Enquiries</h2>
            </div>
            <Link href="/admin/enquiries" className="atelier-text-link">
              View all <ArrowUpRight size={16} />
            </Link>
          </div>

          {!recentResult.data?.length ? (
            <div className="atelier-empty">
              <Mail size={34} strokeWidth={1.2} />
              <h3>No enquiries yet</h3>
              <p>
                Customer submissions will appear here once your
                contact forms start receiving enquiries.
              </p>
            </div>
          ) : (
            <div className="atelier-enquiry-list">
              {recentResult.data.map((item) => (
                <div className="atelier-enquiry-row" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.service}</span>
                  </div>
                  <span className="atelier-status">{item.status}</span>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="atelier-panel">
          <div className="atelier-panel-heading">
            <div>
              <span className="atelier-eyebrow">PERFORMANCE</span>
              <h2>Data Intelligence</h2>
            </div>
            <ChartNoAxesCombined size={22} strokeWidth={1.5} />
          </div>

          <div className="atelier-intelligence-promo">
            <div className="atelier-intelligence-symbol">
              <ChartNoAxesCombined size={38} strokeWidth={1.1} />
            </div>
            <h3>Understand your studio.</h3>
            <p>
              Explore enquiry trends, service demand, and project
              performance using real business records.
            </p>
            <Link
              href="/admin/intelligence"
              className="atelier-text-link"
            >
              Open Intelligence <ArrowUpRight size={17} />
            </Link>
          </div>
        </article>
      </div>

      <div className="atelier-project-banner">
        <div>
          <span className="atelier-eyebrow">PORTFOLIO MANAGEMENT</span>
          <h2>Make your next project part of the story.</h2>
          <p>
            Upload photography, videos, and project details in
            one seamless workflow.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="atelier-button atelier-button-light"
        >
          <Plus size={17} />
          New Project
        </Link>
      </div>
    </section>
  );
}