
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, ImageOff } from "lucide-react";

import type { Project } from "@/lib/projects";
import { getProjectMediaUrl } from "@/lib/projects";

type Category = {
  id: string;
  title: string;
};

type Props = {
  projects: Project[];
  categories: Category[];
};

export default function ProjectsGallery({
  projects,
  categories,
}: Props) {
  const [activeCategory, setActiveCategory] =
    useState("all");

  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") {
      return projects;
    }

    return projects.filter((project) =>
      project.project_categories.some(
        (category) =>
          category.category_id === activeCategory
      )
    );
  }, [projects, activeCategory]);

  if (projects.length === 0) {
    return (
      <div className="mdh-projects-empty">
        <ImageOff size={35} strokeWidth={1} />

        <span>PORTFOLIO / COMING TOGETHER</span>

        <h3>
          Our work is
          <br />
          <em>being curated.</em>
        </h3>

        <p>
          Our online project portfolio is being
          prepared. In the meantime, you can
          explore our expertise or get in touch
          to discuss your project.
        </p>

        <Link href="/expertise">
          EXPLORE OUR EXPERTISE
          <ArrowUpRight size={17} />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div
        className="mdh-projects-filters"
        role="group"
        aria-label="Filter projects by service"
      >
        <button
          type="button"
          className={
            activeCategory === "all"
              ? "is-active"
              : ""
          }
          onClick={() => setActiveCategory("all")}
          aria-pressed={activeCategory === "all"}
        >
          All Projects
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={
              activeCategory === category.id
                ? "is-active"
                : ""
            }
            onClick={() =>
              setActiveCategory(category.id)
            }
            aria-pressed={
              activeCategory === category.id
            }
          >
            {category.title}
          </button>
        ))}
      </div>

      <div
        className="mdh-projects-grid"
        aria-live="polite"
      >
        {filteredProjects.map((project, index) => {
          const firstImage = project.project_media.find(item => item.media_type === "image");
          const firstVideo = project.project_media.find(item => item.media_type === "video");
          const imageUrl = getProjectMediaUrl(project.cover_image_path || firstImage?.storage_path);
          const videoUrl = getProjectMediaUrl(firstVideo?.storage_path);

          return (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className={[
                "mdh-project-card",
                index % 5 === 0
                  ? "mdh-project-card-large"
                  : "",
              ].join(" ")}
            >
              <div className="mdh-project-card-media">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={project.title}
                    width={1200}
                    height={800}
                    loading="lazy"
                    unoptimized
                  />
                ) : videoUrl ? (
                  <video src={videoUrl} muted playsInline preload="metadata" style={{width:"100%",height:"100%",objectFit:"cover"}} aria-label={`Video preview of ${project.title}`} />
                ) : (
                  <div className="mdh-project-card-no-image">
                    <ImageOff
                      size={28}
                      strokeWidth={1}
                    />
                    <span>
                      PROJECT MEDIA NOT AVAILABLE
                    </span>
                  </div>
                )}

                <span className="mdh-project-card-arrow">
                  <ArrowUpRight
                    size={20}
                    strokeWidth={1.4}
                  />
                </span>
              </div>

              <div className="mdh-project-card-details">
                <div>
                  <span className="mdh-project-card-label">
                    {project.location ||
                      "MEPPEPLIN PROJECT"}
                  </span>

                  <h3>{project.title}</h3>

                  {project.summary && (
                    <p>{project.summary}</p>
                  )}
                </div>

                <ArrowUpRight
                  size={19}
                  strokeWidth={1.4}
                />
              </div>
            </Link>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <p className="mdh-projects-filter-empty">
          No published projects in this category yet.
        </p>
      )}
    </>
  );
}

function unusedGetPublicMediaUrl(path: string) {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!url) return "";

  return (
    `${url.replace(/\/$/, "")}` +
    "/storage/v1/object/public/project-media/" +
    path
      .split("/")
      .map(encodeURIComponent)
      .join("/")
  );
}