import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug: z.string().trim().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  summary: z.string().max(600).default(""),
  description: z.string().max(15000).default(""),
  location: z.string().max(180).default(""),
  completion_date: z
    .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal("")])
    .default(""),
  status: z.enum(["draft", "published"]),
  project_type: z.enum(["standard", "before_after"]).default("standard"),
  featured: z.boolean().default(false),
  display_order: z.number().int().min(0).max(100000).default(0),
  categories: z.array(z.string().trim().min(1).max(80)).max(15).default([]),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export const BUCKET = "meppeplin-projects";