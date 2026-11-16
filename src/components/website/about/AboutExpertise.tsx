
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { serviceCategories } from "@/lib/site-navigation";
import Reveal from "./Reveal";

export default function AboutExpertise() {
  return (
    <section
      className="mdh-about-section mdh-about-expertise"
      aria-labelledby="mdh-about-expertise-title"
    >
      <div className="mdh-about-container">
        <Reveal className="mdh-about-section-label">
          <span>04 / OUR EXPERTISE</span>
          <span>THE WORK WE DO</span>
        </Reveal>

        <Reveal className="mdh-about-expertise-heading">
          <span className="mdh-about-eyebrow">
            MULTIPLE DISCIPLINES. ONE VISION.
          </span>

          <h2 id="mdh-about-expertise-title">
            A considered approach to{" "}
            <em>every space.</em>
          </h2>

          <p>
            Explore the services and specialisms that
            come together across our work.
          </p>
        </Reveal>

        <div className="mdh-about-expertise-grid">
          <Reveal className="mdh-about-expertise-image">
            <img
              src="/images/about/about-expertise.jpg"
              alt="A contemporary architectural space showcasing design and finishing details"
              loading="lazy"
            />
          </Reveal>

          <div className="mdh-about-service-list">
            {serviceCategories.map((service, index) => (
              <Link
                key={service.id}
                href={`/expertise#${service.id}`}
                className="mdh-about-service"
              >
                <span className="mdh-about-service-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span>{service.title}</span>

                <ArrowUpRight
                  size={18}
                  strokeWidth={1.4}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
