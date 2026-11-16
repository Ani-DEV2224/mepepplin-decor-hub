
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export const runtime = "nodejs";

const services = [
  "Interior Décor & Home Enhancements",
  "Architectural Finishes & Construction",
  "Outdoor Living & Landscaping",
  "Pools & Water Features",
  "Technical Installations & Procurement",
  "Property & Project Services",
] as const;

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(35),
  location: z.string().trim().min(2).max(180),
  service: z.enum(services),
  budget: z.string().max(80).optional().default(""),
  timeline: z.string().max(80).optional().default(""),
  details: z.string().trim().min(10).max(3000),
  website: z.string().max(300).optional().default(""),
});

export async function POST(request: NextRequest) {
  const type = request.headers.get("content-type") || "";

  if (!type.includes("application/json")) {
    return NextResponse.json(
      { message: "Expected JSON." },
      { status: 415 }
    );
  }

  const length = Number(
    request.headers.get("content-length") || 0
  );

  if (length > 16000) {
    return NextResponse.json(
      { message: "Request is too large." },
      { status: 413 }
    );
  }

  let body: unknown;

  try {
    const raw = await request.text();

    if (raw.length > 16000) {
      return NextResponse.json(
        { message: "Request is too large." },
        { status: 413 }
      );
    }

    body = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 }
    );
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message:
          "Please check the required fields and try again.",
      },
      { status: 400 }
    );
  }

  if (parsed.data.website) {
    // Do not store obvious automated submissions.
    return NextResponse.json({
      message: "Your enquiry has been received.",
    });
  }

  const url =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error(
      "Project enquiries: Supabase server configuration is missing."
    );

    return NextResponse.json(
      {
        message:
          "Enquiries are temporarily unavailable. Please try again later.",
      },
      { status: 503 }
    );
  }

  const supabase = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { website: _honeypot, ...enquiry } = parsed.data;

  const { error } = await supabase
    .from("project_enquiries")
    .insert(enquiry);

  if (error) {
    console.error(
      "Project enquiry insert failed:",
      error.code
    );

    return NextResponse.json(
      {
        message:
          "We could not save your enquiry. Please try again.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Your enquiry has been received." },
    { status: 201 }
  );
}