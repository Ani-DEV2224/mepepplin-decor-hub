
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";

export default function AboutCTA() {
  return (
    <section
      className="mdh-about-cta"
      aria-labelledby="mdh-about-cta-title"
    >
      <div className="mdh-about-container">
        <Reveal className="mdh-about-section-label">
          <span>05 / THE NEXT CHAPTER</span>
          <span>LET&apos;S CREATE TOGETHER</span>
        </Reveal>

        <Reveal className="mdh-about-cta-content">
          <span className="mdh-about-eyebrow">
            HAVE A PROJECT IN MIND?
          </span>

          <h2 id="mdh-about-cta-title">
            The next remarkable space{" "}
            <em>could be yours.</em>
          </h2>

          <Link
            href="/contact"
            className="mdh-about-cta-link"
          >
            START YOUR PROJECT
            <ArrowUpRight size={18} />
          </Link>

          <p>
            Tell us what you have in mind.
            We&apos;ll take it from there.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
