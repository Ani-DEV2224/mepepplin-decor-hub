"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Check,
  ImagePlus,
  Film,
  X,
  UploadCloud,
  Save,
  Send,
  Trash2,
  MapPin,
  CalendarDays,
  FolderOpen,
} from "lucide-react";
import type { ProjectInput } from "@/lib/admin/project";
import { createClient } from "@/lib/supabase/client";
import { BUCKET } from "@/lib/admin/project";
import ProjectCategorySelect from "./ProjectCategorySelect";

type StoredMedia = {
  id: string;
  media_type: "image" | "video";
  storage_path: string;
  alt_text: string | null;
  caption: string | null;
  phase: "general" | "before" | "after";
};

type LocalMedia = {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video";
};

type EditorMedia =
  | {
      kind: "stored";
      id: string;
      media: StoredMedia;
    }
  | {
      kind: "local";
      id: string;
      media: LocalMedia;
    };

type Props = {
  projectId?: string;
  initial?: ProjectInput;
  initialMedia?: StoredMedia[];
  storageBase: string;
};

const blank: ProjectInput = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  location: "",
  completion_date: "",
  status: "draft",
  featured: false,
  display_order: 0,
  categories: [],
  project_type: "standard",
};

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
]);

const MAX_FILE_SIZE = 50 * 1024 * 1024;

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getMediaType(item: EditorMedia): "image" | "video" {
  return item.kind === "local"
    ? item.media.type
    : item.media.media_type;
}

function getMediaUrl(item: EditorMedia, storageBase: string) {
  if (item.kind === "local") {
    return item.media.preview;
  }

  return `${storageBase.replace(/\/$/, "")}/${item.media.storage_path}`;
}

async function requestJson(url: string, options: RequestInit) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      typeof data.error === "string"
        ? data.error
        : `Request failed (${response.status})`
    );
  }

  return data;
}

export default function ProjectEditor({
  projectId,
  initial,
  initialMedia = [],
  storageBase,
}: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadPhaseRef = useRef<"general" | "before" | "after">("general");

  const [form, setForm] = useState<ProjectInput>(
    initial ?? blank
  );



  const [media, setMedia] = useState<EditorMedia[]>(() =>
    initialMedia.map((item) => ({
      kind: "stored" as const,
      id: item.id,
      media: item,
    }))
  );

  const [phases, setPhases] = useState<Record<string, "general" | "before" | "after">>(() => Object.fromEntries(initialMedia.map(item => [item.id, item.phase ?? "general"])));
  const [coverId, setCoverId] = useState<string | null>(
    initialMedia.find((item) => item.media_type === "image")?.id ??
      null
  );

  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dragging, setDragging] = useState(false);

  const mediaRef = useRef(media);

  useEffect(() => {
    mediaRef.current = media;
  }, [media]);

  useEffect(() => {
    return () => {
      for (const item of mediaRef.current) {
        if (item.kind === "local") {
          URL.revokeObjectURL(item.media.preview);
        }
      }
    };
  }, []);

  function updateField<K extends keyof ProjectInput>(
    key: K,
    value: ProjectInput[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function addFiles(files: FileList | File[]) {
    const selected = Array.from(files);
    const valid: EditorMedia[] = [];
    let rejected = 0;

    for (const file of selected) {
      if (
        !allowedTypes.has(file.type) ||
        file.size === 0 ||
        file.size > MAX_FILE_SIZE
      ) {
        rejected++;
        continue;
      }

      const local: LocalMedia = {
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith("video/") ? "video" : "image",
      };

      valid.push({
        kind: "local",
        id: local.id,
        media: local,
      });
    }

    setMedia((current) => [...current, ...valid]);
    setPhases(current => ({...current, ...Object.fromEntries(valid.map(item => [item.id, uploadPhaseRef.current]))}));

    setCoverId((currentCover) => {
      if (currentCover) return currentCover;

      const firstImage = valid.find(
        (item) => getMediaType(item) === "image"
      );

      return firstImage?.id ?? null;
    });

    if (rejected > 0) {
      setError(
        `${rejected} file(s) were skipped. Allowed formats: JPG, PNG, WebP, AVIF, MP4 and WebM. Maximum size: 50 MB per file.`
      );
    } else {
      setError("");
    }

    setSuccess("");
  }

  function chooseMedia(phase: "general" | "before" | "after") {
    uploadPhaseRef.current = phase;
    fileInputRef.current?.click();
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    if (event.target.files) {
      addFiles(event.target.files);
    }

    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);

    if (!busy) {
      uploadPhaseRef.current = "general";
      addFiles(event.dataTransfer.files);
    }
  }

  function moveMedia(index: number, direction: -1 | 1) {
    setMedia((current) => {
      const next = [...current];
      const target = index + direction;

      if (target < 0 || target >= next.length) {
        return current;
      }

      [next[index], next[target]] = [
        next[target],
        next[index],
      ];

      return next;
    });
  }

  async function removeMedia(item: EditorMedia) {
    if (busy) return;

    if (item.kind === "local") {
      setMedia((current) =>
        current.filter((existing) => existing.id !== item.id)
      );

      setCoverId((current) =>
        current === item.id ? null : current
      );

      URL.revokeObjectURL(item.media.preview);
      return;
    }

    if (!projectId) return;

    const confirmed = window.confirm(
      "Permanently remove this image or video?"
    );

    if (!confirmed) return;

    setBusy(true);
    setError("");
    setSuccess("");

    try {
      await requestJson(
        `/api/admin/projects/${projectId}/media?mediaId=${encodeURIComponent(item.id)}`,
        {
          method: "DELETE",
        }
      );

      setMedia((current) =>
        current.filter((existing) => existing.id !== item.id)
      );

      setCoverId((current) =>
        current === item.id ? null : current
      );

      setSuccess("Media removed successfully.");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to remove media."
      );
    } finally {
      setBusy(false);
    }
  }

  async function uploadPendingMedia(
    savedProjectId: string,
    items: EditorMedia[]
  ) {
    const registeredIds = new Map<string, string>();

    const pending = items.filter(
      (
        item
      ): item is Extract<EditorMedia, { kind: "local" }> =>
        item.kind === "local"
    );

    for (const [index, item] of pending.entries()) {
      setProgress(
        `Uploading media ${index + 1} of ${pending.length}...`
      );

      const uploaded = await requestJson("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: savedProjectId, file: { type: item.media.file.type, size: item.media.file.size } }),
      });
      const { error: uploadError } = await createClient().storage.from(BUCKET).uploadToSignedUrl(uploaded.storage_path, uploaded.token, item.media.file, { contentType: item.media.file.type });
      if (uploadError) throw new Error(`Upload failed for ${item.media.file.name}: ${uploadError.message}`);

      const registered = await requestJson(
        `/api/admin/projects/${savedProjectId}/media`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            storage_path: uploaded.storage_path,
            media_type: uploaded.media_type,
            alt_text: form.title,
            caption: "",
            phase: phases[item.id] ?? "general",
          }),
        }
      );

      registeredIds.set(item.id, registered.id);
    }

    return registeredIds;
  }

  async function save(
    event: FormEvent<HTMLFormElement>,
    status: "draft" | "published"
  ) {
    event.preventDefault();

    if (busy) return;

    setBusy(true);
    setError("");
    setSuccess("");
    setProgress("Saving project details...");

    let savedProjectId = projectId;

    try {
      const payload = {
        ...form,
        status: projectId ? form.status : "draft",
        categories: form.categories,
      };

      const projectResult = await requestJson(
        savedProjectId
          ? `/api/admin/projects/${savedProjectId}`
          : "/api/admin/projects",
        {
          method: savedProjectId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!savedProjectId) {
        savedProjectId = projectResult.id;
      }

      if (!savedProjectId) {
        throw new Error("The project ID was not returned.");
      }

      const registeredIds = await uploadPendingMedia(
        savedProjectId,
        media
      );

      const orderedIds = media.map((item) =>
        item.kind === "stored"
          ? item.id
          : registeredIds.get(item.id)
      );

      if (orderedIds.some((id) => !id)) {
        throw new Error(
          "One or more uploaded files could not be registered."
        );
      }

      const savedCoverId = coverId
        ? registeredIds.get(coverId) ?? coverId
        : null;

      setProgress(
        "Saving media arrangement and cover image..."
      );

      await requestJson(
        `/api/admin/projects/${savedProjectId}/media`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderedIds,
            coverId: savedCoverId,
            phases: Object.fromEntries(media.map(item => [item.kind === "stored" ? item.id : registeredIds.get(item.id), phases[item.id] ?? "general"])),
          }),
        }
      );

      await requestJson(`/api/admin/projects/${savedProjectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status }),
      });
      setProgress("Project saved successfully.");

      setSuccess(
        status === "published"
          ? "Project published successfully."
          : "Project saved as draft."
      );

      router.push(`/admin/projects/${savedProjectId}`);
      router.refresh();
    } catch (cause) {
      const reason =
        cause instanceof Error
          ? cause.message
          : "Unable to save the project.";

      setError(
        savedProjectId
          ? `${reason} The project may already be saved. Project ID: ${savedProjectId}. Open it from the Projects page before trying again to avoid duplicate records.`
          : reason
      );

      setProgress("");
    } finally {
      setBusy(false);
    }
  }

  async function deleteProject() {
    if (!projectId || busy) return;

    const confirmed = window.confirm(
      "Permanently delete this project and its media? This cannot be undone."
    );

    if (!confirmed) return;

    setBusy(true);
    setError("");

    try {
      await requestJson(
        `/api/admin/projects/${projectId}`,
        {
          method: "DELETE",
        }
      );

      router.push("/admin/projects");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to delete project."
      );

      setBusy(false);
    }
  }

  const imageCount = media.filter(
    (item) => getMediaType(item) === "image"
  ).length;

  const videoCount = media.length - imageCount;

  return (
    <section className="atelier-page atelier-editor-page">
      <Link
        href="/admin/projects"
        className="atelier-back"
      >
        <ArrowLeft size={16} />
        Back to Projects
      </Link>

      <div className="atelier-editor-heading">
        <div>
          <span className="atelier-eyebrow">
            PORTFOLIO / PROJECT EDITOR
          </span>

          <h1>
            {projectId
              ? "Edit Project"
              : "Create New Project"}
          </h1>

          <p>
            Curate your architectural work with thoughtful
            details, imagery and video.
          </p>
        </div>
      </div>

      <form
        className="atelier-editor-grid"
        onSubmit={(event) => {
          const nativeEvent =
            event.nativeEvent as SubmitEvent;

          const submitter =
            nativeEvent.submitter as HTMLButtonElement | null;

          const status =
            submitter?.value === "published"
              ? "published"
              : "draft";

          void save(event, status);
        }}
      >
        <div className="atelier-editor-left">
          <section className="atelier-panel atelier-form-panel">
            <div className="atelier-section-heading">
              <span className="atelier-section-number">
                01
              </span>

              <div>
                <h2>Project Details</h2>
                <p>
                  Tell the story behind the design.
                </p>
              </div>
            </div>

            <div className="atelier-fields">
              <label className="atelier-field">
                <span>Portfolio Section</span>
                <select value={form.project_type} onChange={(event) => updateField("project_type", event.target.value as "standard" | "before_after")}>
                  <option value="standard">Regular Projects</option>
                  <option value="before_after">Before & After Transformations</option>
                </select>
                <small>Before & After projects appear in a dedicated public portfolio section.</small>
              </label>

              <label className="atelier-field">
                <span>Project Title *</span>

                <input
                  required
                  minLength={2}
                  maxLength={160}
                  value={form.title}
                  placeholder="Enter the project title"
                  onChange={(event) => {
                    updateField(
                      "title",
                      event.target.value
                    );

                    if (!projectId) {
                      updateField(
                        "slug",
                        slugify(event.target.value)
                      );
                    }
                  }}
                />
              </label>

              <label className="atelier-field">
                <span>Project URL Slug *</span>

                <input
                  required
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  value={form.slug}
                  onChange={(event) =>
                    updateField(
                      "slug",
                      slugify(event.target.value)
                    )
                  }
                />
              </label>

              <label className="atelier-field">
                <span>Project Description</span>

                <textarea
                  rows={3}
                  maxLength={600}
                  value={form.summary}
                  placeholder="Describe the project..."
                  onChange={(event) =>
                    updateField(
                      "summary",
                      event.target.value
                    )
                  }
                />

                <small>
                  {form.summary.length}/600 characters
                </small>
              </label>

              <div className="atelier-field-row">
                <label className="atelier-field">
                  <span>
                    <MapPin size={14} /> Location
                  </span>

                  <input
                    value={form.location}
                    placeholder="City, State"
                    onChange={(event) =>
                      updateField(
                        "location",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label className="atelier-field">
                  <span>
                    <CalendarDays size={14} /> Completion Date
                  </span>

                  <input
                    type="date"
                    value={form.completion_date}
                    onChange={(event) =>
                      updateField(
                        "completion_date",
                        event.target.value
                      )
                    }
                  />
                </label>
              </div>

              <div className="atelier-field">
                <span className="flex items-center gap-2">
                  <FolderOpen size={14} /> Project Categories
                </span>

                <ProjectCategorySelect
                  value={form.categories}
                  onChange={(categories) =>
                    updateField("categories", categories)
                  }
                  disabled={busy}
                />

                <small>
                  Select one or more categories that describe this project.
                </small>
              </div>
            </div>
          </section>

          <section className="atelier-panel atelier-form-panel">
            <div className="atelier-section-heading">
              <span className="atelier-section-number">
                03
              </span>

              <div>
                <h2>Publishing Settings</h2>
                <p>
                  Decide how your project appears on
                  the website.
                </p>
              </div>
            </div>

            <div className="atelier-field-row">
              <label className="atelier-field">
                <span>Publication Status</span>

                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField(
                      "status",
                      event.target.value as
                        | "draft"
                        | "published"
                    )
                  }
                >
                  <option value="draft">
                    Draft
                  </option>
                  <option value="published">
                    Published
                  </option>
                </select>
              </label>

              <label className="atelier-field">
                <span>Display Order</span>

                <input
                  type="number"
                  min={0}
                  max={100000}
                  value={form.display_order}
                  onChange={(event) =>
                    updateField(
                      "display_order",
                      Number(event.target.value)
                    )
                  }
                />
              </label>
            </div>

            <label className="atelier-toggle-row">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) =>
                  updateField(
                    "featured",
                    event.target.checked
                  )
                }
              />

              <span>
                <strong>Featured Project</strong>

                <small>
                  Highlight this project in featured
                  portfolio sections.
                </small>
              </span>
            </label>
          </section>
        </div>

        <div className="atelier-editor-right">
          <section className="atelier-panel atelier-form-panel">
            <div className="atelier-section-heading">
              <span className="atelier-section-number">
                02
              </span>

              <div>
                <h2>Project Media</h2>
                <p>
                  Upload photographs and videos
                  before saving.
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              hidden
              disabled={busy}
              accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
              onChange={handleFileChange}
            />

            {form.project_type === "before_after" && (
              <div className="atelier-comparison-uploads" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"1rem",marginBottom:"1.5rem"}}>
                {(["before","after"] as const).map(phase => <section key={phase} className="atelier-panel" style={{padding:"1.25rem",border:"1px solid currentColor",borderRadius:12}}>
                  <span className="atelier-eyebrow">{phase === "before" ? "01 / ORIGINAL CONDITION" : "02 / FINISHED RESULT"}</span>
                  <h3 style={{fontSize:"1.5rem",margin:"0.5rem 0"}}>{phase === "before" ? "Before Project" : "After Project"}</h3>
                  <p style={{marginBottom:"1rem",opacity:0.75}}>{phase === "before" ? "Upload images and videos showing the space before work began." : "Upload images and videos showing the completed transformation."}</p>
                  <button type="button" className="atelier-add-media" disabled={busy} onClick={() => chooseMedia(phase)}><ImagePlus size={16}/> Add {phase === "before" ? "Before" : "After"} Media</button>
                  <small style={{display:"block",marginTop:"0.75rem"}}>{media.filter(item => (phases[item.id] ?? "general") === phase).length} files selected</small>
                </section>)}
              </div>
            )}
            <div
              className={`atelier-dropzone ${
                dragging
                  ? "atelier-dropzone-active"
                  : ""
              }`}
              role="button"
              tabIndex={busy ? -1 : 0}
              aria-disabled={busy}
              onClick={() => {
                if (!busy) {
                  fileInputRef.current?.click();
                }
              }}
              onKeyDown={(event) => {
                if (
                  !busy &&
                  (event.key === "Enter" ||
                    event.key === " ")
                ) {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragOver={(event) => {
                event.preventDefault();

                if (!busy) {
                  setDragging(true);
                }
              }}
              onDragLeave={() =>
                setDragging(false)
              }
              onDrop={handleDrop}
            >
              <UploadCloud
                size={38}
                strokeWidth={1.3}
              />

              <strong>
                {form.project_type === "before_after" ? "Additional / cover media" : "Drop your images & videos here"}
              </strong>

              <span>
                or <u>browse files</u>
              </span>

              <small>
                JPG, PNG, WebP, AVIF, MP4, WebM
                <br />
                Maximum 50 MB per file
              </small>
            </div>

            <div className="atelier-media-heading">
              <div>
                <strong>
                  {media.length}{" "}
                  {media.length === 1
                    ? "file"
                    : "files"}{" "}
                  selected
                </strong>

                <span>
                  {imageCount} images ·{" "}
                  {videoCount} videos
                </span>
              </div>

              <button
                type="button"
                disabled={busy}
                className="atelier-add-media"
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >
                <ImagePlus size={16} />
                Add Media
              </button>
            </div>

            {form.project_type === "before_after" && <p style={{fontSize:13,opacity:0.75,marginBottom:12}}>Media below are grouped by stage. Use the stage selector to move any file between Before, After and General.</p>}
            {media.length === 0 ? (
              <div className="atelier-media-empty">
                <ImagePlus
                  size={30}
                  strokeWidth={1.2}
                />
                <p>No media selected yet.</p>
              </div>
            ) : (
              <div className="atelier-media-grid">
                {media.map((item, index) => {
                  const type =
                    getMediaType(item);
                  const url =
                    getMediaUrl(
                      item,
                      storageBase
                    );
                  const isCover =
                    coverId === item.id;

                  return (
                    <div
                      style={{order: form.project_type === "before_after" ? (phases[item.id] === "before" ? 0 : phases[item.id] === "after" ? 1 : 2) : 0}}
                      className="atelier-media-card"
                      key={item.id}
                    >
                      <div className="atelier-media-preview">
                        {type === "video" ? (
                          <video
                            src={url}
                            controls
                            preload="metadata"
                          />
                        ) : (
                          <img
                            src={url}
                            alt={
                              item.kind ===
                              "local"
                                ? item.media
                                    .file.name
                                : item.media
                                    .alt_text ??
                                  "Project image"
                            }
                          />
                        )}

                        {isCover && (
                          <span className="atelier-cover-badge">
                            <Check size={12} />
                            Cover
                          </span>
                        )}

                        {type === "video" && (
                          <span className="atelier-video-badge">
                            <Film size={13} />
                          </span>
                        )}
                      </div>

                      {form.project_type === "before_after" && (
                        <label className="atelier-field" style={{padding:"0.5rem"}}>
                          <span>Transformation Stage</span>
                          <select value={phases[item.id] ?? "general"} onChange={(event) => setPhases(current => ({...current, [item.id]: event.target.value as "general" | "before" | "after"}))} disabled={busy}>
                            <option value="general">General / Cover</option>
                            <option value="before">Before</option>
                            <option value="after">After</option>
                          </select>
                        </label>
                      )}
                      <div className="atelier-media-controls">
                        {type === "image" && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              setCoverId(
                                item.id
                              )
                            }
                            title="Set as cover image"
                          >
                            Cover
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={
                            busy ||
                            index === 0
                          }
                          onClick={() =>
                            moveMedia(
                              index,
                              -1
                            )
                          }
                          title="Move earlier"
                          aria-label="Move media earlier"
                        >
                          <ArrowUp
                            size={14}
                          />
                        </button>

                        <button
                          type="button"
                          disabled={
                            busy ||
                            index ===
                              media.length -
                                1
                          }
                          onClick={() =>
                            moveMedia(
                              index,
                              1
                            )
                          }
                          title="Move later"
                          aria-label="Move media later"
                        >
                          <ArrowDown
                            size={14}
                          />
                        </button>

                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            void removeMedia(
                              item
                            )
                          }
                          title="Remove file"
                          aria-label="Remove media"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="atelier-media-note">
              <Check size={16} />

              <span>
                Select multiple images and videos,
                arrange their order, and choose a
                cover image. All changes are saved
                when you save the project.
              </span>
            </div>
          </section>

          <section className="atelier-panel atelier-save-panel">
            <span className="atelier-eyebrow">
              PROJECT WORKFLOW
            </span>

            <h2>Ready to save?</h2>

            <p>
              Save your project privately as a draft
              or publish it to your portfolio.
            </p>

            <div className="atelier-save-actions">
              <button
                type="submit"
                name="projectStatus"
                value="draft"
                disabled={busy}
                className="atelier-button atelier-button-outline"
              >
                <Save size={17} />
                Save as Draft
              </button>

              <button
                type="submit"
                name="projectStatus"
                value="published"
                disabled={busy}
                className="atelier-button atelier-button-dark"
              >
                <Send size={17} />
                Publish Project
              </button>
            </div>

            {busy && (
              <p
                className="atelier-progress"
                role="status"
              >
                {progress || "Processing..."}
              </p>
            )}

            {error && (
              <p
                className="atelier-form-error"
                role="alert"
              >
                {error}
              </p>
            )}

            {success && (
              <p
                className="atelier-media-note"
                role="status"
              >
                <Check size={16} />
                {success}
              </p>
            )}
          </section>

          {projectId && (
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                void deleteProject()
              }
              className="atelier-delete-project"
            >
              <Trash2 size={16} />
              Permanently delete this project
            </button>
          )}
        </div>
      </form>
    </section>
  );
}