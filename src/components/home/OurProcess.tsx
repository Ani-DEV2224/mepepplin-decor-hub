
"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

type ProcessStage = {
  number: string;
  label: string;
  title: string;
  accent: string;
  description: string;
  image: string;
  details: string[];
};

const stages: ProcessStage[] = [
  {
    number: "01",
    label: "DISCOVER",
    title: "Discovery &",
    accent: "Consultation.",
    description:
      "Every remarkable space begins with a conversation. We take the time to understand your vision, the character of your space, your priorities, and what you want to achieve.",
    image: "/images/process/discovery.jpg",
    details: [
      "Client consultation",
      "Project requirements",
      "Vision and budget alignment",
    ],
  },
  {
    number: "02",
    label: "ENVISION",
    title: "Concept &",
    accent: "Design.",
    description:
      "Ideas begin to take shape through thoughtful planning, design exploration, and material selection. Every decision is guided by functionality, aesthetics, and your project objectives.",
    image: "/images/process/design.jpg",
    details: [
      "Design development",
      "Spatial planning",
      "Materials and finishes",
    ],
  },
  {
    number: "03",
    label: "CREATE",
    title: "Planning &",
    accent: "Execution.",
    description:
      "The vision moves from drawings to reality. Through coordinated project activities, skilled craftsmanship, and attention to detail, the approved design is brought to life.",
    image: "/images/process/execution.jpg",
    details: [
      "Project coordination",
      "Technical implementation",
      "Craftsmanship and quality checks",
    ],
  },
  {
    number: "04",
    label: "DELIVER",
    title: "Completion &",
    accent: "Handover.",
    description:
      "The final details come together. We focus on finishing, reviewing the completed work, and preparing the space for its next chapter.",
    image: "/images/process/completion.jpg",
    details: [
      "Finishing details",
      "Final inspection",
      "Project handover",
    ],
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function OurProcess() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<
    Record<string, boolean>
  >({});

  const reducedMotion = useReducedMotion() === true;
  const active = stages[activeIndex];

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActiveIndex(current => (current + 1) % stages.length);
    }, 8000);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  const goTo = (index: number) => {
    setActiveIndex(
      Math.max(0, Math.min(stages.length - 1, index))
    );
  };

  const reveal = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.8, ease },
      };

  return (
    <section
      id="our-process"
      className="mdh-process"
      aria-labelledby="mdh-process-heading"
    >
      <div className="mdh-process-shell">
        {/* SECTION LABEL */}

        <motion.div
          className="mdh-process-topline"
          {...reveal}
        >
          <span className="mdh-process-section-label">
            <span className="mdh-process-line" />
            06 / OUR PROCESS
          </span>

          <span>MEPPEPLIN DECOR HUB</span>
        </motion.div>

        {/* INTRODUCTION */}

        <motion.div
          className="mdh-process-intro"
          {...reveal}
        >
          <div>
            <span className="mdh-process-overline">
              THE JOURNEY BEHIND EVERY SPACE
            </span>

            <h2 id="mdh-process-heading">
              From vision
              <br />
              <em>to reality.</em>
            </h2>
          </div>

          <div className="mdh-process-intro-aside">
            <span>DESIGNED WITH PURPOSE</span>

            <p>
              A thoughtful journey from the first
              conversation to the final details.
              Explore the stages that guide a project
              from concept to completion.
            </p>

            <span className="mdh-process-intro-index">
              01 — 04
            </span>
          </div>
        </motion.div>

        {/* INTERACTIVE STAGE NAVIGATION */}

        <div
          className="mdh-process-navigation"
          aria-label="Project process stages"
        >
          {stages.map((stage, index) => (
            <button
              key={stage.number}
              type="button"
              className={`mdh-process-nav-item ${
                activeIndex === index ? "is-active" : ""
              }`}
              onClick={() => goTo(index)}
              aria-pressed={activeIndex === index}
            >
              <span className="mdh-process-nav-top">
                <span>{stage.number}</span>
                <span>{stage.label}</span>
              </span>

              <span className="mdh-process-nav-track">
                <motion.span
                  className="mdh-process-nav-fill"
                  initial={false}
                  animate={{
                    scaleX:
                      index <= activeIndex ? 1 : 0,
                  }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.45,
                    ease,
                  }}
                />
              </span>
            </button>
          ))}
        </div>

        {/* MAIN CINEMATIC VIEW */}

        <div className="mdh-process-stage">
          <div className="mdh-process-visual">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.number}
                className="mdh-process-image-wrap"
                initial={
                  reducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, scale: 1.055 }
                }
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: reducedMotion ? 0 : 0.65,
                  ease,
                }}
              >
                {!failedImages[active.image] ? (
                  <img
                    src={active.image}
                    alt={`${active.title} ${active.accent} — project process`}
                    draggable={false}
                    onError={() =>
                      setFailedImages((previous) => ({
                        ...previous,
                        [active.image]: true,
                      }))
                    }
                  />
                ) : (
                  <div className="mdh-process-image-fallback">
                    <span>{active.number}</span>
                    <p>
                      Add your photograph at
                      <br />
                      {active.image}
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mdh-process-image-overlay" />

            <div className="mdh-process-image-top">
              <span>MEPPEPLIN / THE PROCESS</span>
              <ArrowUpRight
                size={19}
                strokeWidth={1.2}
              />
            </div>

            <div className="mdh-process-image-bottom">
              <span>
                {active.number} / {active.label}
              </span>
              <span>FROM IDEA TO EXECUTION</span>
            </div>
          </div>

          <div className="mdh-process-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.number}
                className="mdh-process-content-inner"
                initial={
                  reducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, y: 24 }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -18,
                }}
                transition={{
                  duration: reducedMotion ? 0 : 0.4,
                  ease,
                }}
              >
                <div className="mdh-process-content-top">
                  <span>STAGE / {active.number}</span>
                  <span>{active.label}</span>
                </div>

                <div className="mdh-process-content-main">
                  <span className="mdh-process-stage-count">
                    {active.number}
                    <small> / 04</small>
                  </span>

                  <h3>
                    {active.title}
                    <br />
                    <em>{active.accent}</em>
                  </h3>

                  <p className="mdh-process-description">
                    {active.description}
                  </p>

                  <div className="mdh-process-details">
                    {active.details.map((detail, index) => (
                      <div
                        key={detail}
                        className="mdh-process-detail"
                      >
                        <span>
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>
                        <p>{detail}</p>
                        <ArrowUpRight
                          size={15}
                          strokeWidth={1.2}
                          aria-hidden="true"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* CONTROLS */}

            <div className="mdh-process-controls">
              <div className="mdh-process-control-count">
                <span>{active.number}</span>
                <span>/</span>
                <span>04</span>
              </div>

            </div>
          </div>
        </div>

        {/* CLOSING */}

        <motion.div
          className="mdh-process-closing"
          {...reveal}
        >
          <div>
            <span className="mdh-process-overline">
              THE FINER DETAILS MATTER
            </span>

            <p>
              Every exceptional space begins
              <br />
              with a <em>thoughtful process.</em>
            </p>
          </div>

          <Link
            href="/contact"
            className="mdh-process-cta"
          >
            <span>START YOUR PROJECT</span>
            <ArrowUpRight
              size={21}
              strokeWidth={1.4}
            />
          </Link>
        </motion.div>

        <div className="mdh-process-footer">
          <span>
            MEPPEPLIN DECOR HUB / OUR PROCESS
          </span>

          <span>VISION / DESIGN / EXECUTION</span>
        </div>
      </div>
    </section>
  );
}
