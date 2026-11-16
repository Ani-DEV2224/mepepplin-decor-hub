
import {
  BarChart3,
  FolderKanban,
  Inbox,
  TrendingUp,
} from "lucide-react";
import {
  requireAdministrator,
  createAdminDatabaseClient,
} from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function IntelligencePage() {
  await requireAdministrator();

  const db = createAdminDatabaseClient();

  const [projectsResult, enquiriesResult] = await Promise.all([
    db
      .from("projects")
      .select("id,status,featured,created_at"),
    db
      .from("project_enquiries")
      .select(
        "id,service,location,budget,timeline,status,created_at"
      ),
  ]);

  if (projectsResult.error || enquiriesResult.error) {
    return (
      <section className="intelligence-page">
        <h1>Data Intelligence</h1>
        <p role="alert">
          Unable to load analytics. Check your Supabase connection.
        </p>
      </section>
    );
  }

  const projects = projectsResult.data ?? [];
  const enquiries = enquiriesResult.data ?? [];

  const published = projects.filter(
    (project) => project.status === "published"
  ).length;

  const newLeads = enquiries.filter(
    (item) => item.status === "new"
  ).length;

  const followedUp = enquiries.filter(
    (item) => item.status !== "new"
  ).length;

  const followUpRate = enquiries.length
    ? Math.round((followedUp / enquiries.length) * 100)
    : 0;

  const services = Object.entries(
    enquiries.reduce<Record<string, number>>(
      (accumulator, item) => {
        const name = item.service?.trim() || "Unspecified";
        accumulator[name] = (accumulator[name] ?? 0) + 1;
        return accumulator;
      },
      {}
    )
  ).sort((a, b) => b[1] - a[1]);

  const now = new Date();

  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth() - 5 + index,
        1
      )
    );

    return {
      key: date.toISOString().slice(0, 7),
      label: date.toLocaleDateString("en", {
        month: "short",
        timeZone: "UTC",
      }),
    };
  });

  const monthly = months.map((month) => ({
    ...month,
    count: enquiries.filter(
      (item) => item.created_at?.slice(0, 7) === month.key
    ).length,
  }));

  const maxMonthly = Math.max(
    1,
    ...monthly.map((item) => item.count)
  );

  const maxService = Math.max(
    1,
    ...services.map((item) => item[1])
  );

  const metrics = [
    {
      label: "Total Enquiries",
      value: enquiries.length,
      icon: Inbox,
    },
    {
      label: "New Enquiries",
      value: newLeads,
      icon: TrendingUp,
    },
    {
      label: "Published Projects",
      value: published,
      icon: FolderKanban,
    },
    {
      label: "Follow-up Rate",
      value: `${followUpRate}%`,
      icon: BarChart3,
    },
  ];

  return (
    <section className="intelligence-page">
      <header className="intelligence-heading">
        <div>
          <span className="intelligence-kicker">
            STUDIO ANALYTICS
          </span>
          <h1>Data Intelligence</h1>
          <p>
            Understand your studio performance through actual
            project records and customer enquiries.
          </p>
        </div>

        <span className="intelligence-live">
          ● Database analytics
        </span>
      </header>

      <div className="intelligence-metrics">
        {metrics.map(({ label, value, icon: Icon }) => (
          <article className="intelligence-metric" key={label}>
            <Icon size={22} />
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>

      <div className="intelligence-columns">
        <article className="intelligence-panel">
          <h2>Enquiry Trends</h2>
          <p>Submissions across the last six calendar months.</p>

          <div className="intelligence-chart">
            {monthly.map((month) => (
              <div
                className="intelligence-bar-column"
                key={month.key}
              >
                <strong>{month.count}</strong>

                <div className="intelligence-bar-track">
                  <div
                    className="intelligence-bar"
                    style={{
                      height: `${
                        (month.count / maxMonthly) * 100
                      }%`,
                    }}
                  />
                </div>

                <span>{month.label}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="intelligence-panel">
          <h2>Service Demand</h2>
          <p>Services most frequently requested by clients.</p>

          {services.length === 0 ? (
            <div className="intelligence-empty">
              No enquiries yet. Service demand will appear
              after the first submission.
            </div>
          ) : (
            <div className="intelligence-service-list">
              {services.map(([service, count]) => (
                <div key={service}>
                  <div className="intelligence-service-label">
                    <span>{service}</span>
                    <strong>{count}</strong>
                  </div>

                  <div className="intelligence-progress">
                    <div
                      style={{
                        width: `${
                          (count / maxService) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>

      <article className="intelligence-panel">
        <h2>Business Insights</h2>

        {enquiries.length === 0 ? (
          <div className="intelligence-empty">
            Insights will become available when real customer
            enquiries are recorded.
          </div>
        ) : (
          <div className="intelligence-insights">
            <p>
              <strong>{newLeads}</strong> enquiries are still
              marked as new.
            </p>

            <p>
              <strong>{followUpRate}%</strong> of enquiries have
              moved beyond the new stage.
            </p>

            <p>
              Most requested service:{" "}
              <strong>
                {services[0]?.[0] ?? "Not available"}
              </strong>
            </p>
          </div>
        )}
      </article>
    </section>
  );
}
