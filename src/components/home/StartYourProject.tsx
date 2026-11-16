
"use client";

import { FormEvent, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";

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

const services = [
  "Interior Décor & Home Enhancements",
  "Architectural Finishes & Construction",
  "Outdoor Living & Landscaping",
  "Pools & Water Features",
  "Technical Installations & Procurement",
  "Property & Project Services",
];

const blank: Enquiry = {
  name: "", email: "", phone: "", location: "", service: "",
  budget: "", timeline: "", details: "", website: "",
};

export default function StartYourProject() {
  const [form, setForm] = useState<Enquiry>(blank);
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [serviceError, setServiceError] = useState(false);
  const reduceMotion = useReducedMotion();

  function change<K extends keyof Enquiry>(key: K, value: Enquiry[K]) {
    setForm((old) => ({ ...old, [key]: value }));
    if (key === "service") setServiceError(false);
    if (state !== "loading") { setState("idle"); setFeedback(""); }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "loading") return;
    if (!form.service) {
      setServiceError(true);
      document.getElementById("mdh-service-choices")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setState("loading");
    setFeedback("");
    try {
      const response = await fetch("/api/project-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result: { message?: string } = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to send your enquiry.");
      setState("success");
      setFeedback(result.message || "Your enquiry has been received. We'll be in touch.");
      setForm(blank);
    } catch (error) {
      setState("error");
      setFeedback(error instanceof Error ? error.message : "Unable to send your enquiry. Please try again.");
    }
  }

  return (
    <section className="mdh-contact" id="start-your-project" aria-labelledby="mdh-contact-title">
      <div className="mdh-contact-container">
        <div className="mdh-contact-overline"><span>07 / START YOUR PROJECT</span><span>MEPPEPLIN DECOR HUB</span></div>
        <div className="mdh-contact-layout">
          <motion.div className="mdh-contact-intro" initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <p className="mdh-contact-eyebrow">YOUR VISION. OUR NEXT CONVERSATION.</p>
            <h2 id="mdh-contact-title">Have a space <em>in mind?</em></h2>
            <p className="mdh-contact-description">Whether you&apos;re imagining a new space or rethinking an existing one, tell us about your project. We&apos;re ready to listen.</p>
            <div className="mdh-contact-intro-bottom"><span className="mdh-contact-asterisk" aria-hidden="true">✳</span><p>THOUGHTFUL SPACES<br />BEGIN WITH A CONVERSATION.</p></div>
          </motion.div>

          <motion.div className="mdh-contact-panel" initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.12 }}>
            <div className="mdh-contact-panel-heading"><div><p>PROJECT ENQUIRY</p><h3>Tell us about your project.</h3></div><ArrowUpRight aria-hidden="true" size={24} /></div>
            <form onSubmit={submit} className="mdh-contact-form">
              <fieldset className="mdh-contact-fieldset" id="mdh-service-choices" aria-describedby={serviceError ? "mdh-service-error" : undefined}>
                <legend><span>01</span> Choose a service <b>*</b></legend>
                <div className="mdh-contact-service-list">
                  {services.map((service) => (
                    <button type="button" key={service} className={`mdh-contact-service ${form.service === service ? "selected" : ""}`} onClick={() => change("service", service)} aria-pressed={form.service === service}>
                      <span>{service}</span><span className="mdh-contact-service-icon">{form.service === service ? <Check size={16} /> : <ArrowUpRight size={16} />}</span>
                    </button>
                  ))}
                </div>
                {serviceError && <p id="mdh-service-error" className="mdh-contact-error" role="alert">Please select the service you&apos;re interested in.</p>}
              </fieldset>

              <fieldset className="mdh-contact-fieldset">
                <legend><span>02</span> Your contact details</legend>
                <div className="mdh-contact-grid">
                  <label>Full name <b>*</b><input name="name" value={form.name} onChange={(e) => change("name", e.target.value)} placeholder="Your full name" autoComplete="name" maxLength={120} required /></label>
                  <label>Email address <b>*</b><input name="email" type="email" value={form.email} onChange={(e) => change("email", e.target.value)} placeholder="you@example.com" autoComplete="email" maxLength={254} required /></label>
                  <label>Phone number <b>*</b><input name="phone" type="tel" value={form.phone} onChange={(e) => change("phone", e.target.value)} placeholder="Your phone number" autoComplete="tel" minLength={7} maxLength={35} required /></label>
                  <label>Project location <b>*</b><input name="location" value={form.location} onChange={(e) => change("location", e.target.value)} placeholder="City / State" maxLength={180} required /></label>
                </div>
              </fieldset>

              <fieldset className="mdh-contact-fieldset">
                <legend><span>03</span> Project information</legend>
                <div className="mdh-contact-grid">
                  <label>Estimated budget <small>OPTIONAL</small><select name="budget" value={form.budget} onChange={(e) => change("budget", e.target.value)}><option value="">Select a budget</option><option>Not sure yet</option><option>Under ₦1 million</option><option>₦1 million – ₦5 million</option><option>₦5 million – ₦20 million</option><option>Above ₦20 million</option></select></label>
                  <label>Preferred timeline <small>OPTIONAL</small><select name="timeline" value={form.timeline} onChange={(e) => change("timeline", e.target.value)}><option value="">Select a timeline</option><option>As soon as possible</option><option>Within 1–3 months</option><option>Within 3–6 months</option><option>Flexible / exploring</option></select></label>
                  <label className="mdh-contact-wide">Tell us about your project <b>*</b><textarea name="details" value={form.details} onChange={(e) => change("details", e.target.value)} rows={5} minLength={10} maxLength={3000} placeholder="What would you like us to create, design, renovate or improve?" required /></label>
                </div>
              </fieldset>
              <div className="mdh-contact-trap" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => change("website", e.target.value)} /></label></div>
              <p className="mdh-contact-consent">By submitting this form, you agree to be contacted regarding your project enquiry.</p>
              {feedback && <p className={`mdh-contact-feedback ${state}`} role={state === "error" ? "alert" : "status"}>{feedback}</p>}
              <button type="submit" className="mdh-contact-submit" disabled={state === "loading"}><span>{state === "loading" ? "SENDING ENQUIRY..." : "SEND PROJECT ENQUIRY"}</span>{state === "loading" ? <LoaderCircle className="mdh-contact-spinner" size={20} /> : <ArrowUpRight size={22} />}</button>
            </form>
          </motion.div>
        </div>
        <div className="mdh-contact-footer"><span>MEPPEPLIN DECOR HUB</span><span>LET&apos;S CREATE SOMETHING MEANINGFUL</span></div>
      </div>
    </section>
  );
}
