
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/layout/SiteFooter";

import {
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  Check,
} from "lucide-react";
import "./expertise.css";

export const metadata: Metadata = {
  title: "Our Expertise | Meppeplin Decor Hub",
  description:
    "Explore Meppeplin Decor Hub's expertise in property improvements and maintenance, property transactions, procurement, installations, interiors, construction, landscaping and water features.",
};

const imageBase = "/images/expertise";

const groups = [
  {
    id: "property-maintenance",
    number: "01",
    title: "Property Improvements & Maintenance",
    short: "Property Care",
    image: "property-maintenance.jpg",
    eyebrow: "PRESERVE · RESTORE · IMPROVE",
    description:
      "Thoughtful solutions for improving, repairing and maintaining residential and commercial properties, with particular attention to the condition, appearance and long-term usability of buildings.",
    services: [
      "Property Improvements",
      "General Property Maintenance",
      "Fungus Treatment",
      "Damp Treatment",
      "Building Restoration",
      "Property Renovations",
    ],
  },
  {
    id: "property-transactions",
    number: "02",
    title: "Property Lease, Buying & Selling",
    short: "Property Transactions",
    image: "property-real-estate.jpg",
    eyebrow: "PROPERTY · OPPORTUNITY · CONNECTION",
    description:
      "Property-related services covering leasing, buying and selling. Whether exploring a property opportunity or seeking assistance with a transaction, clients can begin the conversation with our team.",
    services: [
      "Property Leasing",
      "Property Buying",
      "Property Selling",
    ],
  },
  {
    id: "procurement-installation",
    number: "03",
    title: "Procurement & Installation Services",
    short: "Procurement",
    image: "procurement-installation.jpg",
    eyebrow: "SOURCE · SUPPLY · INSTALL",
    description:
      "A coordinated approach to sourcing materials, supplying products and carrying out installations that support construction, interior improvement and property projects.",
    services: [
      "Materials Procurement",
      "Building Materials Supply",
      "Fixtures Procurement",
      "Equipment Installation",
      "Fittings Installation",
    ],
  },
  {
    id: "interior-decor",
    number: "04",
    title: "Interior Décor & Enhancements",
    short: "Interior Décor",
    image: "interior-decor.jpg",
    eyebrow: "ATMOSPHERE · DETAIL · CHARACTER",
    description:
      "Interior enhancements that bring together finishes, furnishings, craftsmanship and decorative elements to create spaces with purpose and personality.",
    services: [
      "Interior Decoration",
      "Wallpaper Installation",
      "Creative Wall Painting",
      "3D Wall Panels",
      "Curtains & Blinds",
      "Cabinetry & Woodwork",
      "Epoxy Finishes",
    ],
  },
  {
    id: "construction-finishes",
    number: "05",
    title: "Construction & Architectural Finishes",
    short: "Construction",
    image: "construction-finishes.jpg",
    eyebrow: "STRUCTURE · MATERIAL · CRAFT",
    description:
      "Construction and architectural finishing services that bring together functional requirements, careful workmanship and considered material choices.",
    services: [
      "Construction Works",
      "POP Ceiling Installation",
      "Tiling Works",
      "HDF & Customized Doors",
      "Stone & Brick Finishes",
      "Stamped Concrete",
      "Interlocking Paving",
    ],
  },
  {
    id: "outdoor-landscaping",
    number: "06",
    title: "Outdoor Living & Landscaping",
    short: "Outdoor Spaces",
    image: "outdoor-landscaping.jpg",
    eyebrow: "LANDSCAPE · NATURE · LIVING",
    description:
      "Outdoor improvements that extend the experience of a property beyond its interior, bringing practical function and visual character to open spaces.",
    services: [
      "Landscaping",
      "Horticulture",
      "Pergolas",
      "Thatch Huts",
      "Barbecue Installations",
    ],
  },
  {
    id: "pools-water-features",
    number: "07",
    title: "Pools & Water Features",
    short: "Water Features",
    image: "pools-water-features.jpg",
    eyebrow: "WATER · FORM · EXPERIENCE",
    description:
      "Swimming pools and decorative water installations that contribute to the atmosphere and experience of residential, hospitality and outdoor environments.",
    services: [
      "Swimming Pools",
      "Fountains",
    ],
  },
] as const;

const featured = groups.slice(0, 3);
const remaining = groups.slice(3);

function EditorialImage({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`mdh-exp-image ${className}`}>
      <Image
        src={`${imageBase}/${src}`}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 760px) 100vw, 55vw"
        className="mdh-exp-image-element"
      />
    </div>
  );
}

export default function ExpertisePage() {
  return (
    <div className="mdh-exp-page">
      {/* 01 — HERO */}
      <section
        className="mdh-exp-hero"
        aria-labelledby="mdh-exp-title"
      >
        <EditorialImage
          src="expertise-hero.jpg"
          alt="Architectural interior illustrating Meppeplin's multidisciplinary expertise"
          className="mdh-exp-hero-image"
          priority
        />

        <div className="mdh-exp-hero-shade" />

        <div className="mdh-exp-hero-content">
          <div className="mdh-exp-hero-top">
            <span>MEPPEPLIN DECOR HUB</span>
            <span>OUR CAPABILITIES / EXPERTISE</span>
          </div>

          <div className="mdh-exp-hero-bottom">
            <p className="mdh-exp-overline mdh-exp-overline-light">
              BUILT ON EXPERIENCE. DEFINED BY DETAIL.
            </p>

            <h1 id="mdh-exp-title">
              More than
              <br />
              <em>design.</em>
            </h1>

            <div className="mdh-exp-hero-caption">
              <p>
                From property care to architectural
                finishes, procurement and outdoor
                environments — our expertise extends
                across the spaces we create and improve.
              </p>

              <a
                href="#our-expertise"
                className="mdh-exp-round-link"
                aria-label="Explore our expertise"
              >
                <ArrowDown size={23} strokeWidth={1.4} />
              </a>
            </div>
          </div>
        </div>

        <span className="mdh-exp-hero-side">
          SPACES / PROPERTY / POSSIBILITIES
        </span>
      </section>

      {/* 02 — INTRODUCTION */}
      <section className="mdh-exp-intro mdh-exp-shell">
        <div className="mdh-exp-section-label">
          <span>01 / OUR PERSPECTIVE</span>
          <span>AN INTEGRATED APPROACH</span>
        </div>

        <div className="mdh-exp-intro-layout">
          <div className="mdh-exp-intro-copy">
            <p className="mdh-exp-overline">
              A BROADER VIEW OF WHAT WE DO
            </p>

            <h2>
              Every space
              <br />
              deserves
              <br />
              <em>consideration.</em>
            </h2>

            <p className="mdh-exp-body">
              Our work brings together property
              improvements, maintenance, construction,
              interior enhancements, procurement,
              installations and outdoor solutions.
            </p>

            <p className="mdh-exp-body">
              Each discipline contributes to a
              shared objective: helping clients
              create, maintain and improve the
              environments that matter to them.
            </p>

            <a
              href="#our-expertise"
              className="mdh-exp-text-link"
            >
              EXPLORE OUR CAPABILITIES
              <ArrowDownRight size={19} />
            </a>
          </div>

          <div className="mdh-exp-intro-visual">
            <EditorialImage
              src="expertise-introduction.jpg"
              alt="Architectural materials and interior detailing"
              className="mdh-exp-intro-image"
            />

            <div className="mdh-exp-image-note">
              <span>THE DETAILS</span>
              <span>MAKE THE DIFFERENCE.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — CATEGORY DIRECTORY */}
      <section
        className="mdh-exp-directory mdh-exp-shell"
        id="our-expertise"
      >
        <div className="mdh-exp-section-label">
          <span>02 / DISCOVER OUR EXPERTISE</span>
          <span>SEVEN AREAS OF SERVICE</span>
        </div>

        <div className="mdh-exp-directory-heading">
          <div>
            <p className="mdh-exp-overline">
              A COMPLETE VIEW
            </p>
            <h2>
              What we <em>do.</em>
            </h2>
          </div>

          <p>
            Explore the disciplines behind our
            work. Every service is presented
            here on one page.
          </p>
        </div>

        <div className="mdh-exp-directory-list">
          {groups.map((group) => (
            <a
              href={`#${group.id}`}
              className="mdh-exp-directory-row"
              key={group.id}
            >
              <span className="mdh-exp-directory-number">
                {group.number}
              </span>

              <span className="mdh-exp-directory-name">
                {group.title}
              </span>

              <span className="mdh-exp-directory-count">
                {String(group.services.length).padStart(
                  2,
                  "0"
                )}{" "}
                SERVICES
              </span>

              <ArrowDownRight
                size={22}
                strokeWidth={1.3}
              />
            </a>
          ))}
        </div>
      </section>

      {/* 04 — THREE PRIORITY SERVICES */}
      <section className="mdh-exp-featured">
        <div className="mdh-exp-shell">
          <div className="mdh-exp-section-label">
            <span>03 / KEY CAPABILITIES</span>
            <span>PROPERTY / PROCUREMENT / INSTALLATION</span>
          </div>

          <div className="mdh-exp-featured-heading">
            <p className="mdh-exp-overline">
              THREE DISTINCT DISCIPLINES
            </p>

            <h2>
              Expertise that
              <br />
              goes <em>further.</em>
            </h2>

            <p>
              Beyond design and construction,
              our services also address property
              maintenance, property transactions,
              and the sourcing and installation
              of materials and fittings.
            </p>
          </div>
        </div>

        {featured.map((group, index) => (
          <article
            className={`mdh-exp-feature ${
              index % 2 === 1
                ? "mdh-exp-feature-reverse"
                : ""
            }`}
            id={group.id}
            key={group.id}
          >
            <div className="mdh-exp-feature-media">
              <EditorialImage
                src={group.image}
                alt={`Illustration of ${group.title}`}
                className="mdh-exp-feature-image"
              />

              <span className="mdh-exp-feature-media-index">
                MEPPEPLIN / {group.number}
              </span>
            </div>

            <div className="mdh-exp-feature-content">
              <div className="mdh-exp-feature-top">
                <span>EXPERTISE / {group.number}</span>
                <span>FEATURED DISCIPLINE</span>
              </div>

              <div>
                <p className="mdh-exp-overline">
                  {group.eyebrow}
                </p>

                <h3>{group.title}</h3>

                <p className="mdh-exp-feature-description">
                  {group.description}
                </p>

                <div className="mdh-exp-service-list">
                  {group.services.map((service, i) => (
                    <div
                      className="mdh-exp-service-item"
                      key={service}
                    >
                      <span>
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <span>{service}</span>

                      <Check
                        size={15}
                        strokeWidth={1.3}
                        aria-hidden="true"
                      />
                    </div>
                  ))}
                </div>

                <Link
                  href="/contact#send-an-enquiry"
                  className="mdh-exp-text-link"
                >
                  ENQUIRE ABOUT THIS SERVICE
                  <ArrowUpRight size={19} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* 05 — OTHER CAPABILITIES */}
      <section className="mdh-exp-catalogue mdh-exp-shell">
        <div className="mdh-exp-section-label">
          <span>04 / ADDITIONAL CAPABILITIES</span>
          <span>CRAFT / CONSTRUCTION / ENVIRONMENT</span>
        </div>

        <div className="mdh-exp-catalogue-heading">
          <p className="mdh-exp-overline">
            THE FULL PICTURE
          </p>

          <h2>
            Every discipline.
            <br />
            <em>Every detail.</em>
          </h2>

          <p>
            A broad collection of services
            supporting the design, development
            and improvement of spaces.
          </p>
        </div>

        <div className="mdh-exp-catalogue-grid">
          {remaining.map((group) => (
            <article
              className="mdh-exp-catalogue-card"
              id={group.id}
              key={group.id}
            >
              <EditorialImage
                src={group.image}
                alt={`Illustration of ${group.title}`}
                className="mdh-exp-catalogue-image"
              />

              <div className="mdh-exp-catalogue-card-heading">
                <span>EXPERTISE / {group.number}</span>

                <h3>{group.title}</h3>

                <p>{group.description}</p>
              </div>

              <div className="mdh-exp-catalogue-services">
                {group.services.map((service) => (
                  <div key={service}>
                    <span>{service}</span>
                    <ArrowUpRight
                      size={15}
                      strokeWidth={1.3}
                      aria-hidden="true"
                    />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 06 — IMAGE / DETAIL STATEMENT */}
      <section className="mdh-exp-detail">
        <EditorialImage
          src="architectural-details.png"
          alt="Architectural craftsmanship and finishing details"
          className="mdh-exp-detail-image"
        />

        <div className="mdh-exp-detail-shade" />

        <div className="mdh-exp-detail-content">
          <p className="mdh-exp-overline mdh-exp-overline-light">
            THE VALUE OF THE DETAILS
          </p>

          <h2>
            Considered
            <br />
            from every
            <br />
            <em>angle.</em>
          </h2>

          <p>
            From the smallest finishing detail
            to the wider requirements of a property,
            each aspect deserves attention.
          </p>
        </div>
      </section>

      {/* 07 — PROJECT SERVICES / APPROACH */}
      <section className="mdh-exp-approach mdh-exp-shell">
        <div className="mdh-exp-section-label">
          <span>05 / PROJECT SERVICES</span>
          <span>COORDINATION & DELIVERY</span>
        </div>

        <div className="mdh-exp-approach-grid">
          <div>
            <p className="mdh-exp-overline">
              FROM PLANNING TO PROGRESS
            </p>

            <h2>
              Bringing the
              <br />
              pieces <em>together.</em>
            </h2>

            <p className="mdh-exp-body">
              Projects often involve more than
              one service. Planning, supervision,
              procurement and execution must
              work together to support the
              intended outcome.
            </p>

            <p className="mdh-exp-body">
              Our project-related capabilities
              include site supervision,
              construction coordination and
              property improvement planning.
            </p>

            <Link
              href="/projects"
              className="mdh-exp-text-link"
            >
              EXPLORE OUR PROJECTS
              <ArrowUpRight size={19} />
            </Link>
          </div>

          <EditorialImage
            src="project-supervision.png"
            alt="Construction planning and project supervision"
            className="mdh-exp-approach-image"
          />
        </div>
      </section>

      {/* 08 — PROJECTS LINK */}
      <section className="mdh-exp-projects-strip mdh-exp-shell">
        <div className="mdh-exp-section-label">
          <span>06 / EXPERTISE IN PRACTICE</span>
          <span>OUR PROJECTS</span>
        </div>

        <div className="mdh-exp-projects-strip-content">
          <div>
            <p className="mdh-exp-overline">
              BEYOND THE SERVICE LIST
            </p>

            <h2>
              See the work
              <br />
              behind the <em>words.</em>
            </h2>

            <p>
              Explore our Projects page for
              published project stories,
              photographs and videos as
              they become available.
            </p>
          </div>

          <Link
            href="/projects"
            className="mdh-exp-projects-button"
          >
            <span>VIEW PROJECTS</span>
            <ArrowUpRight size={23} />
          </Link>
        </div>
      </section>

      {/* 09 — FINAL CTA */}
      <section className="mdh-exp-cta">
        <EditorialImage
          src="expertise-cta.jpg"
          alt="Architectural environment representing a new project"
          className="mdh-exp-cta-image"
        />

        <div className="mdh-exp-cta-shade" />

        <div className="mdh-exp-cta-content">
          <span className="mdh-exp-overline mdh-exp-overline-light">
            YOUR NEXT PROJECT STARTS HERE
          </span>

          <h2>
            Have something
            <br />
            <em>in mind?</em>
          </h2>

          <p>
            Tell us what you are planning,
            creating, maintaining or improving.
            We would be glad to hear about it.
          </p>

          <Link
            href="/contact#send-an-enquiry"
            className="mdh-exp-cta-button"
          >
            <span>START A CONVERSATION</span>
            <ArrowUpRight size={21} />
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
