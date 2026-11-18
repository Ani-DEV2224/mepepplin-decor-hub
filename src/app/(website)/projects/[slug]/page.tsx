
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import SiteFooter from "@/components/layout/SiteFooter";
import {
  getPublishedProject,
  getProjectCategoryTitle,
  getProjectMediaUrl,
} from "@/lib/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProject(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} | Meppeplin Decor Hub`,
    description:
      project.summary ??
      `Explore ${project.title}, a project by Meppeplin Decor Hub.`,
  };
}

export default async function ProjectDetailPage({
  params,
}: Props) {
  const { slug } = await params;
  const project = await getPublishedProject(slug);

  if (!project) {
    notFound();
  }

  const media = [...project.project_media];

  // Show the cover image first, if one exists.
  if (
    project.cover_image_path &&
    !media.some(
      (item) =>
        item.storage_path === project.cover_image_path
    )
  ) {
    media.unshift({
      id: "cover",
      media_type: "image",
      storage_path: project.cover_image_path,
      alt_text: project.title,
      caption: null,
      display_order: -1,
      phase: "general",
    });
  }

  return (
    <main className="mdh-projects-page">
      <article className="mdh-project-detail">
        <Link
          href="/projects"
          className="mdh-project-detail-back"
        >
          <ArrowLeft size={17} />
          BACK TO ALL PROJECTS
        </Link>

        <span className="mdh-projects-eyebrow">
          MEPPEPLIN / PROJECT PORTFOLIO
        </span>

        <h1>{project.title}</h1>

        {project.summary && (
          <p className="mdh-project-detail-summary">
            {project.summary}
          </p>
        )}

        <div className="mdh-project-detail-meta">
          {project.location && (
            <div>
              <span>LOCATION</span>
              <strong>{project.location}</strong>
            </div>
          )}

          {project.completion_date && (
            <div>
              <span>COMPLETED</span>
              <strong>
                {new Date(
                  `${project.completion_date}T12:00:00Z`
                ).toLocaleDateString("en-GB", {
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </strong>
            </div>
          )}

          {project.project_categories.length > 0 && (
            <div>
              <span>SERVICES</span>
              <strong>
                {project.project_categories
                  .map((category) =>
                    getProjectCategoryTitle(
                      category.category_id
                    )
                  )
                  .join(" · ")}
              </strong>
            </div>
          )}
        </div>

        {project.description && (
          <div className="mdh-project-detail-description">
            {project.description}
          </div>
        )}

        {project.project_type === "before_after" ? (
          <div className="mdh-transformation-detail" style={{marginTop:"3rem"}}>
            {(["before", "after"] as const).map((phase, index) => {
              const items = media.filter(item => item.phase === phase);
              return <section key={phase} style={{marginBottom:"4rem"}}>
                <span className="mdh-projects-eyebrow">{index === 0 ? "01 / THE ORIGINAL SPACE" : "02 / THE COMPLETED SPACE"}</span>
                <h2 style={{fontSize:"clamp(2rem,5vw,4rem)",margin:"0.75rem 0 2rem"}}>{phase === "before" ? "Before the transformation." : "After the transformation."}</h2>
                <div className="mdh-project-detail-gallery">
                  {items.map(item => {
                    const url = getProjectMediaUrl(item.storage_path);
                    if (!url) return null;
                    return <figure key={item.id}>
                      {item.media_type === "video" ? <video src={url} controls playsInline preload="metadata" /> : <img src={url} alt={item.alt_text ?? `${phase} — ${project.title}`} loading="lazy" />}
                      {item.caption && <figcaption>{item.caption}</figcaption>}
                    </figure>;
                  })}
                  {items.length === 0 && <p>No {phase} media has been published for this project yet.</p>}
                </div>
              </section>;
            })}
            {media.some(item => item.phase === "general") && <section><h2>Additional project details</h2><div className="mdh-project-detail-gallery">{media.filter(item => item.phase === "general").map(item => {const url=getProjectMediaUrl(item.storage_path);return url ? <figure key={item.id}>{item.media_type === "video" ? <video src={url} controls playsInline preload="metadata"/> : <img src={url} alt={item.alt_text ?? project.title} loading="lazy"/>}</figure> : null;})}</div></section>}
          </div>
        ) : (
          media.length > 0 && (
          <div className="mdh-project-detail-gallery">
            {media.map((item) => {
              const url = getProjectMediaUrl(
                item.storage_path
              );

              if (!url) return null;

              return (
                <figure key={item.id}>
                  {project.project_type === "before_after" && item.phase !== "general" && <figcaption style={{fontWeight:700,letterSpacing:"0.12em",padding:"0.75rem"}}>{item.phase.toUpperCase()}</figcaption>}
                  {item.media_type === "video" ? (
                    <video
                      src={url}
                      controls
                      preload="metadata"
                      playsInline
                    />
                  ) : (
                    <img
                      src={url}
                      alt={
                        item.alt_text ??
                        project.title
                      }
                      loading="lazy"
                    />
                  )}

                  {item.caption && (
                    <figcaption>
                      {item.caption}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        )}

        )}
      </article>

      <section className="mdh-projects-closing">
        <span className="mdh-projects-eyebrow">
          YOUR PROJECT
        </span>

        <div className="mdh-projects-closing-main">
          <h2>
            Have something
            <br />
            <em>in mind?</em>
          </h2>

          <Link
            href="/contact#send-an-enquiry"
            className="mdh-projects-cta-link"
          >
            DISCUSS YOUR PROJECT
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}