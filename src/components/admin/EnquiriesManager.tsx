
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Inbox,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  X,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";

type Status = "new" | "contacted" | "in_progress" | "closed";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  service: string;
  details: string;
  budget: string;
  timeline: string;
  status: Status;
  internal_notes: string;
  created_at: string;
};

const statuses: { value: Status; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "in_progress", label: "In Progress" },
  { value: "closed", label: "Closed" },
];

function dateLabel(value: string) {
  return new Date(value).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusLabel(value: Status) {
  return statuses.find((item) => item.value === value)?.label ?? value;
}

export default function EnquiriesManager({
  initialEnquiries,
}: {
  initialEnquiries: Enquiry[];
}) {
  const router = useRouter();

  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("new");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const selected = enquiries.find(
    (item) => item.id === selectedId
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return enquiries.filter((item) => {
      const matchesStatus =
        filter === "all" || item.status === filter;

      const matchesSearch =
        !term ||
        [
          item.name,
          item.email,
          item.phone,
          item.service,
          item.location,
          item.details,
        ].some((value) =>
          (value ?? "").toLowerCase().includes(term)
        );

      return matchesStatus && matchesSearch;
    });
  }, [enquiries, search, filter]);

  const newCount = enquiries.filter(
    (item) => item.status === "new"
  ).length;

  const progressCount = enquiries.filter(
    (item) => item.status === "in_progress"
  ).length;

  function openEnquiry(item: Enquiry) {
    setSelectedId(item.id);
    setStatus(item.status);
    setNotes(item.internal_notes ?? "");
    setError("");
    setMessage("");
  }

  async function saveEnquiry() {
    if (!selected || saving) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/enquiries/${selected.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            internal_notes: notes,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to save changes"
        );
      }

      setEnquiries((current) =>
        current.map((item) =>
          item.id === selected.id ? result : item
        )
      );

      setMessage("Enquiry updated successfully.");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to update enquiry."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="atelier-enquiries-page">
      <header className="atelier-enquiries-heading">
        <div>
          <span className="atelier-eyebrow">
            STUDIO / CLIENT RELATIONS
          </span>
          <h1>Client Enquiries</h1>
          <p>
            Manage conversations, project requests and client
            follow-ups from one workspace.
          </p>
        </div>

        <button
          type="button"
          className="atelier-enquiries-refresh"
          onClick={() => router.refresh()}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </header>

      <div className="atelier-enquiries-stats">
        <article>
          <span>Total Enquiries</span>
          <strong>{enquiries.length}</strong>
        </article>
        <article>
          <span>New Enquiries</span>
          <strong>{newCount}</strong>
        </article>
        <article>
          <span>In Progress</span>
          <strong>{progressCount}</strong>
        </article>
      </div>

      <div className="atelier-enquiries-panel">
        <div className="atelier-enquiries-toolbar">
          <label className="atelier-enquiries-search">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search clients, services, locations..."
            />
          </label>

          <select
            aria-label="Filter enquiries by status"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">All statuses</option>
            {statuses.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="atelier-enquiries-empty">
            <Inbox size={36} strokeWidth={1.3} />
            <h3>
              {enquiries.length === 0
                ? "No enquiries yet"
                : "No matching enquiries"}
            </h3>
            <p>
              {enquiries.length === 0
                ? "Customer submissions will appear here when received."
                : "Try a different search or status filter."}
            </p>
          </div>
        ) : (
          <div className="atelier-enquiries-table-wrap">
            <table className="atelier-enquiries-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Received</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.name}</strong>
                      <small>{item.email}</small>
                    </td>
                    <td>{item.service || "Not specified"}</td>
                    <td>{dateLabel(item.created_at)}</td>
                    <td>
                      <span
                        className={`atelier-enquiry-status status-${item.status}`}
                      >
                        {statusLabel(item.status)}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="atelier-enquiry-open"
                        onClick={() => openEnquiry(item)}
                        aria-label={`Open enquiry from ${item.name}`}
                      >
                        <ArrowUpRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="atelier-enquiry-modal-backdrop">
          <div
            className="atelier-enquiry-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Enquiry from ${selected.name}`}
          >
            <header className="atelier-enquiry-modal-header">
              <div>
                <span className="atelier-eyebrow">
                  CLIENT ENQUIRY
                </span>
                <h2>{selected.name}</h2>
                <p>Received {dateLabel(selected.created_at)}</p>
              </div>
              <button
                type="button"
                aria-label="Close enquiry"
                onClick={() => setSelectedId(null)}
              >
                <X size={20} />
              </button>
            </header>

            <div className="atelier-enquiry-modal-body">
              <div className="atelier-enquiry-contact">
                <a href={`mailto:${selected.email}`}>
                  <Mail size={16} />
                  {selected.email}
                </a>

                {selected.phone && (
                  <a href={`tel:${selected.phone}`}>
                    <Phone size={16} />
                    {selected.phone}
                  </a>
                )}

                {selected.location && (
                  <span>
                    <MapPin size={16} />
                    {selected.location}
                  </span>
                )}
              </div>

              <div className="atelier-enquiry-details-grid">
                <div>
                  <span>Requested Service</span>
                  <strong>{selected.service || "Not specified"}</strong>
                </div>
                <div>
                  <span>Budget</span>
                  <strong>{selected.budget || "Not specified"}</strong>
                </div>
                <div>
                  <span>Timeline</span>
                  <strong>{selected.timeline || "Not specified"}</strong>
                </div>
                <div>
                  <span>Submitted</span>
                  <strong>
                    <Calendar size={14} />
                    {dateLabel(selected.created_at)}
                  </strong>
                </div>
              </div>

              <div className="atelier-enquiry-description">
                <h3>Project Requirements</h3>
                <p>
                  {selected.details ||
                    "No additional project details provided."}
                </p>
              </div>

              <label className="atelier-enquiry-field">
                <span>Enquiry Status</span>
                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as Status)
                  }
                >
                  {statuses.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="atelier-enquiry-field">
                <span>Internal Notes</span>
                <textarea
                  rows={6}
                  maxLength={10000}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Record follow-up details, meeting notes or next actions..."
                />
                <small>
                  These notes are for administrators only.
                </small>
              </label>

              {error && (
                <p className="atelier-enquiry-error" role="alert">
                  {error}
                </p>
              )}

              {message && (
                <p className="atelier-enquiry-success" role="status">
                  {message}
                </p>
              )}
            </div>

            <footer className="atelier-enquiry-modal-footer">
              <button
                type="button"
                className="atelier-enquiry-cancel"
                onClick={() => setSelectedId(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="atelier-enquiry-save"
                disabled={saving}
                onClick={() => void saveEnquiry()}
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </footer>
          </div>
        </div>
      )}
    </section>
  );
}
