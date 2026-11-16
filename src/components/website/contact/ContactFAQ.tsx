
"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

const faqs = [
  {
    question: "How do I start a project with Meppeplin?",
    answer:
      "Complete the enquiry form on this page or contact our team by phone, email or WhatsApp. Share your project location, requirements and any relevant details so we can discuss the next steps.",
  },
  {
    question: "What services does Meppeplin provide?",
    answer:
      "Our services include construction, interior design, home improvement, architectural finishes, woodwork, tiling, landscaping, pools, decorative installations and other property-related solutions.",
  },
  {
    question: "Does Meppeplin work outside Port Harcourt?",
    answer:
      "Yes. Our company portfolio documents projects across Rivers, Abia, Enugu, Lagos, Delta and other locations in Nigeria. Contact us to discuss availability for your specific project location.",
  },
  {
    question: "Can I request a quotation?",
    answer:
      "Yes. Submit your project requirements through the enquiry form. The team can discuss the information needed to prepare an appropriate quotation. Pricing depends on the scope and specifications.",
  },
  {
    question: "Can I view previous projects?",
    answer:
      "Yes. Visit our Projects page or view the company portfolio through the About page to explore examples of our work and capabilities.",
  },
];

export default function ContactFAQ() {
  const [active, setActive] =
    useState<number | null>(0);

  return (
    <section className="mdh-cp-section mdh-cp-faq">
      <div className="mdh-cp-container">
        <div className="mdh-cp-section-label">
          <span>03 / GOOD TO KNOW</span>
          <span>FREQUENTLY ASKED QUESTIONS</span>
        </div>

        <div className="mdh-cp-faq-grid">
          <div className="mdh-cp-faq-heading">
            <span className="mdh-cp-eyebrow">
              QUESTIONS & ANSWERS
            </span>

            <h2>
              A few things
              <br />
              <em>worth knowing.</em>
            </h2>

            <p>
              Find answers to common questions
              about working with Meppeplin Decor Hub.
            </p>
          </div>

          <div className="mdh-cp-faq-list">
            {faqs.map((faq, index) => {
              const open = active === index;

              return (
                <div
                  key={faq.question}
                  className={`mdh-cp-faq-item ${
                    open ? "is-open" : ""
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() =>
                      setActive(open ? null : index)
                    }
                  >
                    <span className="mdh-cp-faq-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span>{faq.question}</span>

                    {open ? (
                      <Minus size={19} />
                    ) : (
                      <Plus size={19} />
                    )}
                  </button>

                  {open && (
                    <div className="mdh-cp-faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
