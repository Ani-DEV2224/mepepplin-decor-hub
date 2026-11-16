
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
} from "lucide-react";

import SiteFooter from "@/components/layout/SiteFooter";
import {
  getPublishedProjects,
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

  const activeCategories = PROJECT_CATEGORIES.filter(
    (category) =>
      projects.some((project) =>
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
            {projects.length}{" "}
            {projects.length === 1
              ? "PUBLISHED PROJECT"
              : "PUBLISHED PROJECTS"}
          </span>
        </div>

        <ProjectsGallery
          projects={projects}
          categories={activeCategories}
        />
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