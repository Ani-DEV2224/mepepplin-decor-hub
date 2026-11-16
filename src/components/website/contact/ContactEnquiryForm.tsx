
"use client";

import {
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  LoaderCircle,
  LockKeyhole,
  MapPin,
  MessageSquareText,
  UserRound,
} from "lucide-react";

type Enquiry = {
  name: string;
  email: string;
  phone: string;
  location: string;
  service: string;
  budget: string;
  timeline: string;
  details: string;
  website: string;
};

type SubmissionState =
  | "idle"
  | "loading"
  | "success"
  | "error";

const services = [
  "Interior Décor & Home Enhancements",
  "Architectural Finishes & Construction",
  "Outdoor Living & Landscaping",
  "Pools & Water Features",
  "Technical Installations & Procurement",
  "Property & Project Services",
] as const;

const budgets = [
  "Not sure yet",
  "Under ₦1 million",
  "₦1 million – ₦5 million",
  "₦5 million – ₦20 million",
  "Above ₦20 million",
];

const timelines = [
  "As soon as possible",
  "Within 1–3 months",
  "Within 3–6 months",
  "Flexible / exploring",
];

const emptyForm: Enquiry = {
  name: "",
  email: "",
  phone: "",
  location: "",
  service: "",
  budget: "",
  timeline: "",
  details: "",
  website: "",
};

export default function ContactEnquiryForm() {
  const [form, setForm] = useState<Enquiry>(emptyForm);
  const [status, setStatus] =
    useState<SubmissionState>("idle");
  const [feedback, setFeedback] = useState("");
  const [serviceError, setServiceError] = useState(false);

  const serviceRef = useRef<HTMLFieldSetElement>(null);

  function change<K extends keyof Enquiry>(
    key: K,
    value: Enquiry[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));

    if (key === "service") {
      setServiceError(false);
    }

    if (status !== "loading") {
      setStatus("idle");
      setFeedback("");
    }
  }

  async function submit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (status === "loading") return;

    if (!form.service) {
      setServiceError(true);

      serviceRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      return;
    }

    setStatus("loading");
    setFeedback("");

    try {
      // Same request schema as the homepage form.
      const response = await fetch(
        "/api/project-enquiries",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const result: { message?: string } =
        await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to send your enquiry."
        );
      }

      setStatus("success");
      setFeedback(
        result.message ||
          "Your enquiry has been received."
      );
      setForm(emptyForm);
      setServiceError(false);
    } catch (error) {
      setStatus("error");

      setFeedback(
        error instanceof Error
          ? error.message
          : "Unable to send your enquiry. Please try again."
      );
    }
  }

  if (status === "success") {
    return (
      <div
        className="mdh-cp-form-panel mdh-cp-form-success"
        role="status"
      >
        <div className="mdh-cp-success-symbol">
          <CheckCircle2
            size={43}
            strokeWidth={1.2}
          />
        </div>

        <span className="mdh-cp-eyebrow">
          ENQUIRY RECEIVED
        </span>

        <h3>
          Thank you for
          <br />
          <em>reaching out.</em>
        </h3>

        <p>{feedback}</p>

        <p>
          Your project enquiry has been submitted
          successfully. Our team will review it.
        </p>

        <button
          type="button"
          className="mdh-cp-submit"
          onClick={() => {
            setStatus("idle");
            setFeedback("");
          }}
        >
          <span>SEND ANOTHER ENQUIRY</span>
          <ArrowUpRight size={19} />
        </button>
      </div>
    );
  }

  return (
    <div className="mdh-cp-form-panel mdh-cp-premium-form">
      <div className="mdh-cp-form-topline">
        <span>MEPPEPLIN / PROJECT CONSULTATION</span>
        <span>ENQUIRY FORM — 001</span>
      </div>

      <div className="mdh-cp-form-heading">
        <div>
          <span className="mdh-cp-eyebrow">
            BEGIN YOUR PROJECT
          </span>

          <h3>
            Tell us about
            <br />
            <em>your vision.</em>
          </h3>

          <p>
            Share the details below so we can
            understand your project and how
            Meppeplin can assist.
          </p>
        </div>

        <ArrowUpRight
          size={29}
          strokeWidth={1.1}
          aria-hidden="true"
        />
      </div>

      <form
        onSubmit={submit}
        className="mdh-cp-premium-form-inner"
      >
        {/* SECTION 01 — CONTACT DETAILS */}
        <fieldset className="mdh-cp-form-section">
          <legend>
            <span className="mdh-cp-section-number">
              01
            </span>

            <UserRound size={18} strokeWidth={1.5} />

            <span>Your contact details</span>
          </legend>

          <div className="mdh-cp-form-grid">
            <label className="mdh-cp-field">
              <span>FULL NAME *</span>
              <input
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                maxLength={120}
                required
                value={form.name}
                onChange={(event) =>
                  change("name", event.target.value)
                }
              />
            </label>

            <label className="mdh-cp-field">
              <span>EMAIL ADDRESS *</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                maxLength={254}
                required
                value={form.email}
                onChange={(event) =>
                  change("email", event.target.value)
                }
              />
            </label>

            <label className="mdh-cp-field">
              <span>PHONE NUMBER *</span>
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+234..."
                minLength={7}
                maxLength={35}
                required
                value={form.phone}
                onChange={(event) =>
                  change("phone", event.target.value)
                }
              />
            </label>

            <label className="mdh-cp-field">
              <span>PROJECT LOCATION *</span>
              <span className="mdh-cp-input-wrap">
                <input
                  name="location"
                  type="text"
                  placeholder="City / State"
                  maxLength={180}
                  required
                  value={form.location}
                  onChange={(event) =>
                    change(
                      "location",
                      event.target.value
                    )
                  }
                />

                <MapPin
                  size={17}
                  strokeWidth={1.4}
                  aria-hidden="true"
                />
              </span>
            </label>
          </div>
        </fieldset>

        {/* SECTION 02 — SERVICE */}
        <fieldset
          ref={serviceRef}
          className="mdh-cp-form-section"
          aria-describedby={
            serviceError
              ? "mdh-cp-service-error"
              : undefined
          }
        >
          <legend>
            <span className="mdh-cp-section-number">
              02
            </span>

            <span>What service do you need?</span>
          </legend>

          <p className="mdh-cp-section-description">
            Select the service that best describes
            your project.
          </p>

          <div className="mdh-cp-service-grid">
            {services.map((service, index) => {
              const selected =
                form.service === service;

              return (
                <button
                  key={service}
                  type="button"
                  className={`mdh-cp-service-card ${
                    selected ? "is-selected" : ""
                  }`}
                  aria-pressed={selected}
                  onClick={() =>
                    change("service", service)
                  }
                >
                  <span className="mdh-cp-service-card-top">
                    <small>
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </small>

                    <span className="mdh-cp-service-check">
                      {selected && (
                        <Check
                          size={14}
                          strokeWidth={2}
                        />
                      )}
                    </span>
                  </span>

                  <span className="mdh-cp-service-name">
                    {service}
                  </span>
                </button>
              );
            })}
          </div>

          {serviceError && (
            <p
              id="mdh-cp-service-error"
              className="mdh-cp-form-error"
              role="alert"
            >
              Please select a service before
              submitting your enquiry.
            </p>
          )}
        </fieldset>

        {/* SECTION 03 — PROJECT INFORMATION */}
        <fieldset className="mdh-cp-form-section">
          <legend>
            <span className="mdh-cp-section-number">
              03
            </span>

            <MessageSquareText
              size={18}
              strokeWidth={1.5}
            />

            <span>Project information</span>
          </legend>

          <div className="mdh-cp-form-grid">
            <label className="mdh-cp-field">
              <span>
                ESTIMATED BUDGET
                <small>OPTIONAL</small>
              </span>

              <select
                name="budget"
                value={form.budget}
                onChange={(event) =>
                  change(
                    "budget",
                    event.target.value
                  )
                }
              >
                <option value="">
                  Select a budget
                </option>

                {budgets.map((budget) => (
                  <option
                    key={budget}
                    value={budget}
                  >
                    {budget}
                  </option>
                ))}
              </select>
            </label>

            <label className="mdh-cp-field">
              <span>
                PREFERRED TIMELINE
                <small>OPTIONAL</small>
              </span>

              <select
                name="timeline"
                value={form.timeline}
                onChange={(event) =>
                  change(
                    "timeline",
                    event.target.value
                  )
                }
              >
                <option value="">
                  Select a timeline
                </option>

                {timelines.map((timeline) => (
                  <option
                    key={timeline}
                    value={timeline}
                  >
                    {timeline}
                  </option>
                ))}
              </select>
            </label>

            <label className="mdh-cp-field mdh-cp-field-full">
              <span>
                TELL US ABOUT YOUR PROJECT *
              </span>

              <textarea
                name="details"
                rows={6}
                minLength={10}
                maxLength={3000}
                required
                placeholder="Describe the space, your ideas, requirements and what you would like us to create..."
                value={form.details}
                onChange={(event) =>
                  change(
                    "details",
                    event.target.value
                  )
                }
              />

              <small className="mdh-cp-character-count">
                {form.details.length} / 3000
              </small>
            </label>
          </div>
        </fieldset>

        {/* HONEYPOT — SAME AS HOMEPAGE */}
        <div
          className="mdh-cp-honeypot"
          aria-hidden="true"
        >
          <label>
            Leave this field empty
            <input
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(event) =>
                change(
                  "website",
                  event.target.value
                )
              }
            />
          </label>
        </div>

        {status === "error" && (
          <p
            className="mdh-cp-form-error"
            role="alert"
          >
            {feedback}
          </p>
        )}

        <div className="mdh-cp-form-submit-area">
          <div className="mdh-cp-form-privacy">
            <LockKeyhole
              size={18}
              strokeWidth={1.4}
            />

            <p>
              Your information will be used to
              respond to your project enquiry.
              By submitting, you agree to be
              contacted by our team.
            </p>
          </div>

          <button
            type="submit"
            className="mdh-cp-submit"
            disabled={status === "loading"}
          >
            <span>
              {status === "loading"
                ? "SENDING ENQUIRY..."
                : "SEND PROJECT ENQUIRY"}
            </span>

            {status === "loading" ? (
              <LoaderCircle
                size={20}
                className="mdh-cp-spinner"
              />
            ) : (
              <ArrowUpRight size={21} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
