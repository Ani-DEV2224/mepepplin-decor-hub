
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
} from "lucide-react";

import SiteFooter from "@/components/layout/SiteFooter";
import {
  getPublishedProjects,
  getProjectMediaUrl,
  PROJECT_CATEGORIES,
} from "@/lib/projects";
import ProjectsGallery from "./ProjectsGallery";

import "./projects.css";

export const metadata: Metadata = {
  title: "Our Projects | Meppeplin Decor Hub",
  description:
    "Explore completed projects by Meppeplin Decor Hub, spanning interiors, construction, property improvements, installations and outdoor spaces.",
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  const regularProjects = projects.filter(project => project.project_type !== "before_after");
  const transformations = projects.filter(project => project.project_type === "before_after");
  const activeCategories = PROJECT_CATEGORIES.filter(
    (category) =>
      regularProjects.some((project) =>
        project.project_categories.some(
          (item) => item.category_id === category.id
        )
      )
  );

  return (
    <main className="mdh-projects-page">
      <section className="mdh-projects-hero">
        <div className="mdh-projects-hero-content">
          <span className="mdh-projects-eyebrow">
            MEPPEPLIN DECOR HUB / PORTFOLIO
          </span>

          <h1>
            Spaces.
            <br />
            Stories.
            <br />
            <em>Transformations.</em>
          </h1>

          <div className="mdh-projects-hero-bottom">
            <p>
              A considered collection of our work
              across design, construction, property
              improvements and specialist installations.
            </p>

            <a
              href="#projects-gallery"
              aria-label="Explore projects"
              className="mdh-projects-scroll"
            >
              <ArrowDown size={21} strokeWidth={1.3} />
            </a>
          </div>
        </div>
      </section>

      <section className="mdh-projects-intro">
        <div className="mdh-projects-intro-label">
          <span>01 / OUR WORK</span>
        </div>

        <div>
          <h2>
            Every project
            <br />
            tells a <em>story.</em>
          </h2>

          <p>
            From individual architectural details
            to complete property transformations,
            our portfolio brings together the spaces,
            materials and practical solutions that
            define our work.
          </p>
        </div>
      </section>

      <section
        id="projects-gallery"
        className="mdh-projects-collection"
      >
        <div className="mdh-projects-collection-heading">
          <div>
            <span className="mdh-projects-eyebrow">
              02 / SELECTED PROJECTS
            </span>

            <h2>
              Explore our <em>portfolio.</em>
            </h2>
          </div>

          <span className="mdh-projects-count">
            {regularProjects.length}{" "}
            {regularProjects.length === 1
              ? "PUBLISHED PROJECT"
              : "PUBLISHED PROJECTS"}
          </span>
        </div>

        <ProjectsGallery
          projects={regularProjects}
          categories={activeCategories}
        />
      </section>

      <section id="before-after" className="mdh-projects-collection" style={{paddingTop:"4rem"}}>
        <div className="mdh-projects-collection-heading">
          <div>
            <span className="mdh-projects-eyebrow">03 / BEFORE & AFTER</span>
            <h2>Remarkable <em>transformations.</em></h2>
            <p>Explore the spaces before our work began and the results after completion.</p>
          </div>
          <span className="mdh-projects-count">{transformations.length} TRANSFORMATIONS</span>
        </div>
        <div className="mdh-comparison-section-headings" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",margin:"2rem 0 1rem",textAlign:"center"}}>
          <div style={{padding:"1.5rem",borderTop:"1px solid currentColor"}}><span className="mdh-projects-eyebrow">01 / BEFORE</span><h3 style={{fontSize:"clamp(1.4rem,3vw,2.5rem)",marginTop:"0.5rem"}}>The starting point.</h3><p>Spaces before the transformation.</p></div>
          <div style={{padding:"1.5rem",borderTop:"1px solid currentColor"}}><span className="mdh-projects-eyebrow">02 / AFTER</span><h3 style={{fontSize:"clamp(1.4rem,3vw,2.5rem)",marginTop:"0.5rem"}}>The final reveal.</h3><p>Spaces after the work is complete.</p></div>
        </div>
        {transformations.length === 0 ? (
          <div className="mdh-projects-empty"><h3>Transformations <em>coming soon.</em></h3><p>Before-and-after project stories will appear here once published.</p></div>
        ) : (
          <div className="mdh-projects-grid">
            {transformations.map(project => {
              const before = project.project_media.find(item => item.phase === "before");
              const after = project.project_media.find(item => item.phase === "after");
              return <Link key={project.id} href={`/projects/${project.slug}`} className="mdh-project-card">
                <div className="mdh-project-card-media" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {([before,after] as const).map((item,index) => <div key={index} style={{position:"relative",minHeight:240,overflow:"hidden",background:"#e9e5e1"}}>
                    {item ? (item.media_type === "video" ? <video src={getProjectMediaUrl(item.storage_path) ?? ""} muted playsInline preload="metadata" style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute"}}/> : <img src={getProjectMediaUrl(item.storage_path) ?? ""} alt={`${index===0?"Before":"After"} — ${project.title}`} style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute"}}/>) : <span style={{display:"grid",placeItems:"center",height:"100%",fontSize:12}}>No {index===0?"before":"after"} photo</span>}
                    <span style={{position:"absolute",top:12,left:12,background:"#fff",color:"#222",padding:"5px 12px",fontSize:11,fontWeight:700}}>{index===0?"BEFORE":"AFTER"}</span>
                  </div>)}
                </div>
                <div className="mdh-project-card-details"><div><span className="mdh-project-card-label">{project.location || "TRANSFORMATION"}</span><h3>{project.title}</h3>{project.summary && <p>{project.summary}</p>}</div><ArrowUpRight size={19}/></div>
              </Link>;
            })}
          </div>
        )}
      </section>

      <section className="mdh-projects-closing">
        <span className="mdh-projects-eyebrow">
          03 / YOUR PROJECT
        </span>

        <div className="mdh-projects-closing-main">
          <h2>
            Your vision.
            <br />
            <em>Our next project.</em>
          </h2>

          <Link
            href="/contact#send-an-enquiry"
            className="mdh-projects-cta-link"
          >
            START A PROJECT
            <ArrowUpRight
              size={19}
              strokeWidth={1.4}
            />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}