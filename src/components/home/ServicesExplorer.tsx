
"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

import { serviceCategories } from "@/lib/site-navigation";
import { gsap, useGSAP } from "@/lib/gsap";

const ease = [0.22, 1, 0.36, 1] as const;

const pad = (value: number) => String(value).padStart(2, "0");

export default function ServicesExplorer() {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const reducedMotion = Boolean(useReducedMotion());

  const count = serviceCategories.length;
  const activeCategory = serviceCategories[activeIndex];

  const selectCategory = useCallback(
    (index: number) => {
      if (
        index === activeIndex ||
        index < 0 ||
        index >= count
      ) {
        return;
      }

      setDirection(index > activeIndex ? 1 : -1);
      setActiveIndex(index);
    },
    [activeIndex, count]
  );

  const navigate = useCallback(
    (step: number) => {
      if (!count) return;

      setDirection(step);

      setActiveIndex(
        (current) => (current + step + count) % count
      );
    },
    [count]
  );

  // Preserve the existing subtle parallax effect
  // on the selected service detail panel.
  useGSAP(
    () => {
      if (
        reducedMotion ||
        !sectionRef.current ||
        !visualRef.current
      ) {
        return;
      }

      gsap.fromTo(
        visualRef.current,
        { y: 36 },
        {
          y: -28,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        }
      );
    },
    {
      scope: sectionRef,
      dependencies: [reducedMotion],
      revertOnUpdate: true,
    }
  );

  if (!count || !activeCategory) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      id="services-explorer"
      className="mdh-expertise"
      aria-labelledby="mdh-expertise-title"
    >
      <div className="mdh-expertise-container">
        {/* SECTION LABEL */}

        <div className="mdh-expertise-eyebrow">
          <span className="mdh-expertise-eyebrow-left">
            <span
              className="mdh-expertise-rule"
              aria-hidden="true"
            />
            02 / WHAT WE DO
          </span>

          <span className="mdh-expertise-eyebrow-right">
            MEPPEPLIN / EXPERTISE
          </span>
        </div>

        {/* INTRODUCTION */}

        <div className="mdh-expertise-intro">
          <div>
            <motion.p
              className="mdh-expertise-kicker"
              initial={
                reducedMotion
                  ? false
                  : { opacity: 0, y: 18 }
              }
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.4,
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.65,
                ease,
              }}
            >
              ONE STUDIO. MULTIPLE DISCIPLINES.
            </motion.p>

            {/*
              FIXED HEADING

              The previous version animated both heading
              lines from y: "105%" inside overflow-hidden
              masks.

              That could leave the text clipped or invisible
              when the reveal animation did not complete.

              The new heading is always visible, while the
              remaining section animations are preserved.
            */}

            <h2
              id="mdh-expertise-title"
              className="mdh-expertise-title"
            >
              <span className="mdh-expertise-title-line">
                What we do,
              </span>

              <span
                className="
                  mdh-expertise-title-line
                  mdh-expertise-title-indent
                "
              >
                <em>beautifully.</em>
              </span>
            </h2>
          </div>

          <motion.p
            className="mdh-expertise-intro-copy"
            initial={
              reducedMotion
                ? false
                : { opacity: 0, y: 24 }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: reducedMotion ? 0 : 0.8,
              delay: reducedMotion ? 0 : 0.2,
              ease,
            }}
          >
            From interiors and architectural finishes to
            outdoor environments, technical installations
            and property solutions — explore the disciplines
            that shape our approach.
          </motion.p>
        </div>

        {/* INTERACTIVE SERVICE EXPLORER */}

        <div className="mdh-expertise-body">
          {/* SERVICE CATEGORY LIST */}

          <div
            className="mdh-expertise-list"
            aria-label="Service categories"
          >
            {serviceCategories.map((category, index) => {
              const selected = index === activeIndex;

              return (
                <motion.button
                  key={category.id}
                  type="button"
                  className={`mdh-expertise-row${
                    selected ? " is-active" : ""
                  }`}
                  onClick={() => selectCategory(index)}
                  aria-pressed={selected}
                  aria-controls="mdh-expertise-detail"
                  initial={
                    reducedMotion
                      ? false
                      : { opacity: 0, y: 20 }
                  }
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.3,
                  }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.65,
                    delay: reducedMotion
                      ? 0
                      : index * 0.055,
                    ease,
                  }}
                >
                  <span className="mdh-expertise-row-number">
                    {pad(index + 1)}
                  </span>

                  <span className="mdh-expertise-row-name">
                    {category.title}
                  </span>

                  <span
                    className="mdh-expertise-row-icon"
                    aria-hidden="true"
                  >
                    <ArrowUpRight
                      size={21}
                      strokeWidth={1.3}
                    />
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* SELECTED SERVICE DETAILS */}

          <div
            className="mdh-expertise-panel-wrap"
            ref={visualRef}
          >
            <div
              className="mdh-expertise-panel"
              id="mdh-expertise-detail"
              aria-live="polite"
              aria-atomic="true"
            >
              {/* PANEL HEADER */}

              <div className="mdh-expertise-panel-top">
                <span>SELECTED DISCIPLINE</span>

                <span>
                  {pad(activeIndex + 1)} / {pad(count)}
                </span>
              </div>

              {/* DECORATIVE MONOGRAM */}

              <div
                className="mdh-expertise-panel-monogram"
                aria-hidden="true"
              >
                M
              </div>

              {/* ANIMATED CATEGORY CONTENT */}

              <AnimatePresence
                mode="wait"
                custom={direction}
              >
                <motion.div
                  key={activeCategory.id}
                  custom={direction}
                  className="mdh-expertise-panel-content"
                  initial={
                    reducedMotion
                      ? false
                      : {
                          opacity: 0,
                          x: direction * 28,
                        }
                  }
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: reducedMotion
                      ? 0
                      : -direction * 20,
                  }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.42,
                    ease,
                  }}
                >
                  <span className="mdh-expertise-panel-index">
                    DISCIPLINE {pad(activeIndex + 1)}
                  </span>

                  <h3>{activeCategory.title}</h3>

                  <p>
                    {activeCategory.description ??
                      "Explore the services available in this category."}
                  </p>

                  {/* INCLUDED SERVICES */}

                  <div className="mdh-expertise-includes">
                    <span className="mdh-expertise-includes-heading">
                      SERVICES INCLUDED
                    </span>

                    <ul>
                      {activeCategory.services.map(
                        (service) => (
                          <li key={service}>
                            {service}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* EXPLORE LINK */}

                  <Link
                    className="mdh-expertise-panel-link"
                    href={`/expertise#${activeCategory.id}`}
                  >
                    EXPLORE THIS DISCIPLINE

                    <ArrowUpRight
                      size={18}
                      strokeWidth={1.4}
                    />
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* PANEL FOOTER */}

              <div className="mdh-expertise-panel-bottom">
                <span>
                  DESIGN / BUILD / ENHANCE
                </span>

                <div className="mdh-expertise-controls">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    aria-label="Previous service category"
                  >
                    <ArrowLeft
                      size={19}
                      strokeWidth={1.4}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(1)}
                    aria-label="Next service category"
                  >
                    <ArrowRight
                      size={19}
                      strokeWidth={1.4}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION FOOTER */}

        <div className="mdh-expertise-footer">
          <span>
            CONSIDERED FROM CONCEPT TO COMPLETION
          </span>

          <Link href="/expertise">
            VIEW ALL EXPERTISE

            <ArrowUpRight
              size={17}
              strokeWidth={1.4}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
