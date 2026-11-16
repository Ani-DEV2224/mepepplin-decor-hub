
export const PROJECT_CATEGORIES = [
  {
    id: "property-maintenance",
    title: "Property Improvements & Maintenance",
  },
  {
    id: "property-transactions",
    title: "Property Lease, Buying & Selling",
  },
  {
    id: "procurement-installation",
    title: "Procurement & Installation Services",
  },
  {
    id: "interior-decor",
    title: "Interior Décor & Enhancements",
  },
  {
    id: "construction-finishes",
    title: "Construction & Architectural Finishes",
  },
  {
    id: "outdoor-landscaping",
    title: "Outdoor Living & Landscaping",
  },
  {
    id: "pools-water-features",
    title: "Pools & Water Features",
  },
] as const;

export type ProjectMedia = {
  id: string;
  media_type: "image" | "video";
  storage_path: string;
  alt_text: string | null;
  caption: string | null;
  display_order: number;
};

export type ProjectCategory = {
  category_id: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  location: string | null;
  completion_date: string | null;
  cover_image_path: string | null;
  featured: boolean;
  display_order: number;
  published_at: string | null;
  project_categories: ProjectCategory[];
  project_media: ProjectMedia[];
};

const PROJECT_SELECT = [
  "id",
  "slug",
  "title",
  "summary",
  "description",
  "location",
  "completion_date",
  "cover_image_path",
  "featured",
  "display_order",
  "published_at",
  "project_categories(category_id)",
  "project_media(id,media_type,storage_path,alt_text,caption,display_order)",
].join(",");

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase URL or publishable key is missing. Check your .env.local file."
    );
  }

  return {
    url: url.replace(/\/$/, ""),
    key,
  };
}

async function queryProjects(
  query: Record<string, string>
): Promise<Project[]> {
  const { url, key } = getSupabaseConfig();

  const params = new URLSearchParams({
    select: PROJECT_SELECT,
    status: "eq.published",
    ...query,
  });

  const response = await fetch(
    `${url}/rest/v1/projects?${params.toString()}`,
    {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Accept: "application/json",
      },
      next: {
        revalidate: 60,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Unable to load projects (${response.status}).`
    );
  }

  const projects = (await response.json()) as Project[];

  return projects.map((project) => ({
    ...project,
    project_categories: project.project_categories ?? [],
    project_media: [...(project.project_media ?? [])].sort(
      (a, b) => a.display_order - b.display_order
    ),
  }));
}

export async function getPublishedProjects() {
  return queryProjects({
    order: "display_order.asc,published_at.desc",
  });
}

export async function getPublishedProject(
  slug: string
): Promise<Project | null> {
  const projects = await queryProjects({
    slug: `eq.${slug}`,
    limit: "1",
  });

  return projects[0] ?? null;
}

export async function getFeaturedProjects(
  limit = 4
) {
  return queryProjects({
    featured: "eq.true",
    order: "display_order.asc,published_at.desc",
    limit: String(limit),
  });
}

export function getProjectCategoryTitle(id: string) {
  return (
    PROJECT_CATEGORIES.find(
      (category) => category.id === id
    )?.title ?? id
  );
}

export function getProjectMediaUrl(
  path: string | null | undefined
): string | null {
  if (!path) return null;

  const { url } = getSupabaseConfig();

  return (
    `${url}/storage/v1/object/public/` +
    `project-media/${path.split("/").map(encodeURIComponent).join("/")}`
  );
}