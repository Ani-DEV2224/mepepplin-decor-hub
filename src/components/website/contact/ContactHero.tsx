
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";

export default function ContactHero() {
  return (
    <section
      className="mdh-cp-hero"
      aria-labelledby="mdh-cp-hero-title"
    >
      <div
        className="mdh-cp-hero-image"
        aria-hidden="true"
      />

      <div
        className="mdh-cp-hero-overlay"
        aria-hidden="true"
      />

      <div className="mdh-cp-container mdh-cp-hero-inner">
        <div className="mdh-cp-hero-top">
          <span>MEPPEPLIN DECOR HUB</span>
          <span>CONTACT / 001</span>
        </div>

        <div className="mdh-cp-hero-content">
          <span className="mdh-cp-eyebrow">
            LET&apos;S START A CONVERSATION
          </span>

          <h1 id="mdh-cp-hero-title">
            Every remarkable space
            <br />
            begins with a <em>conversation.</em>
          </h1>

          <p>
            Tell us what you have in mind. From
            construction and interiors to finishing
            details and outdoor spaces, we&apos;re ready
            to hear about your project.
          </p>
        </div>

        <div className="mdh-cp-hero-bottom">
          <span>PORT HARCOURT / NIGERIA</span>

          <Link href="#send-an-enquiry">
            START YOUR ENQUIRY
            <ArrowDownRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
