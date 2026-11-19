
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

import { gsap, useGSAP } from "@/lib/gsap";
import Magnetic from "@/components/interactions/Magnetic";

const ease = [0.22, 1, 0.36, 1] as const;

const principles = [
  {
    number: "01",
    title: "Beauty",
    text: "Spaces with presence, character and considered detail.",
  },
  {
    number: "02",
    title: "Function",
    text: "Design decisions shaped around how a space is actually used.",
  },
  {
    number: "03",
    title: "Precision",
    text: "Careful attention from material selection through execution.",
  },
];

export default function ArchitecturalIntroduction() {
  const sectionRef = useRef<HTMLElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const mainImageInnerRef = useRef<HTMLDivElement>(null);
  const detailImageRef = useRef<HTMLDivElement>(null);
  const secondaryImageRef = useRef<HTMLDivElement>(null);
  const secondaryImageInnerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLDivElement>(null);

  const reducedMotion = Boolean(useReducedMotion());
  const [mainImageFailed, setMainImageFailed] = useState(false);

  const inView = useInView(sectionRef, {
    once: true,
    amount: 0.08,
  });

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section || reducedMotion) return;

      if (mainImageInnerRef.current) {
        gsap.fromTo(
          mainImageInnerRef.current,
          { yPercent: -8, scale: 1.12 },
          {
            yPercent: 8,
            scale: 1.04,
            ease: "none",
            scrollTrigger: {
              trigger: mainImageRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      }

      if (detailImageRef.current) {
        gsap.fromTo(
          detailImageRef.current,
          { y: 60 },
          {
            y: -45,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.3,
            },
          }
        );
      }

      if (secondaryImageInnerRef.current) {
        gsap.fromTo(
          secondaryImageInnerRef.current,
          { yPercent: -10, scale: 1.14 },
          {
            yPercent: 10,
            scale: 1.03,
            ease: "none",
            scrollTrigger: {
              trigger: secondaryImageRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.25,
            },
          }
        );
      }

      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: 24 },
          {
            y: -22,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              end: "bottom 15%",
              scrub: 1.3,
            },
          }
        );
      }

      if (closingRef.current) {
        gsap.fromTo(
          closingRef.current,
          { y: 30 },
          {
            y: -12,
            ease: "none",
            scrollTrigger: {
              trigger: closingRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      }
    },
    {
      scope: sectionRef,
      dependencies: [reducedMotion],
      revertOnUpdate: true,
    }
  );

  return (
    <section
      ref={sectionRef}
      id="our-approach"
      className="mdh-intro"
      aria-labelledby="mdh-intro-heading"
    >
      <div className="mdh-intro-container">
        <div className="mdh-intro-topline">
          <motion.div
            className="mdh-intro-section-label"
            initial={reducedMotion ? false : { opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{
              duration: reducedMotion ? 0 : 0.8,
              ease,
            }}
          >
            <span className="mdh-intro-label-line" />
            <span>01 / OUR PHILOSOPHY</span>
          </motion.div>

          <span className="mdh-intro-topline-right">
            DESIGN / DETAIL / EXPERIENCE
          </span>
        </div>

        <div className="mdh-intro-opening">
          <div ref={headingRef} className="mdh-intro-heading-wrap">
            <motion.p
              className="mdh-intro-overline"
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: reducedMotion ? 0 : 0.8,
                delay: 0.1,
              }}
            >
              AN APPROACH ROOTED IN PURPOSE
            </motion.p>

            <h2 id="mdh-intro-heading" className="mdh-intro-heading">
              <span className="mdh-intro-line-mask">
                <motion.span
                  initial={reducedMotion ? false : { y: "110%" }}
                  animate={inView ? { y: "0%" } : undefined}
                  transition={{
                    duration: reducedMotion ? 0 : 1.05,
                    delay: reducedMotion ? 0 : 0.12,
                    ease,
                  }}
                >
                  Beyond
                </motion.span>
              </span>

              <span className="mdh-intro-line-mask mdh-intro-heading-offset">
                <motion.em
                  initial={reducedMotion ? false : { y: "110%" }}
                  animate={inView ? { y: "0%" } : undefined}
                  transition={{
                    duration: reducedMotion ? 0 : 1.05,
                    delay: reducedMotion ? 0 : 0.23,
                    ease,
                  }}
                >
                  spaces.
                </motion.em>
              </span>

              <span className="mdh-intro-line-mask">
                <motion.span
                  initial={reducedMotion ? false : { y: "110%" }}
                  animate={inView ? { y: "0%" } : undefined}
                  transition={{
                    duration: reducedMotion ? 0 : 1.05,
                    delay: reducedMotion ? 0 : 0.34,
                    ease,
                  }}
                >
                  We create
                </motion.span>
              </span>

              <span className="mdh-intro-line-mask mdh-intro-heading-final">
                <motion.em
                  initial={reducedMotion ? false : { y: "110%" }}
                  animate={inView ? { y: "0%" } : undefined}
                  transition={{
                    duration: reducedMotion ? 0 : 1.05,
                    delay: reducedMotion ? 0 : 0.45,
                    ease,
                  }}
                >
                  experiences.
                </motion.em>
              </span>
            </h2>
          </div>

          <motion.div
            className="mdh-intro-opening-aside"
            initial={reducedMotion ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: reducedMotion ? 0 : 0.9,
              ease,
            }}
          >
            <span className="mdh-intro-small-index">
              THE MEPPEPLIN PERSPECTIVE
            </span>

            <p>
              We believe exceptional spaces are not simply seen.
              They are experienced, remembered, and lived in.
            </p>
          </motion.div>
        </div>

        <div className="mdh-intro-composition">
          <div className="mdh-intro-visual-column">
            <motion.div
              ref={mainImageRef}
              className="mdh-intro-main-image"
              initial={false}
              style={{
                opacity: 1,
                clipPath: "inset(0 0 0 0)",
              }}
            >
              <div
                ref={mainImageInnerRef}
                className="mdh-intro-image-inner"
              >
                {!mainImageFailed ? (
                  <Image
                    src="/images/introduction/introduction-main.png"
                    alt="Contemporary interior with refined architectural design"
                    fill
                    sizes="(max-width: 900px) 100vw, 55vw"
                    className="mdh-intro-image"
                    onError={() => setMainImageFailed(true)}
                  />
                ) : (
                  <div
                    role="status"
                    className="absolute inset-0 flex items-center justify-center bg-[var(--studio-surface,#eae3d8)] px-6 text-center text-sm text-[var(--studio-ink,#332b27)]"
                  >
                    Main photograph unavailable. Check
                    public/images/introduction/introduction-main.png
                  </div>
                )}
              </div>

              <div className="mdh-intro-image-caption">
                <span>FORM / LIGHT / MATERIAL</span>
                <span>01 — 03</span>
              </div>
            </motion.div>

            <div
              ref={detailImageRef}
              className="mdh-intro-detail-position"
            >
              <motion.div
                className="mdh-intro-detail-image"
                initial={
                  reducedMotion
                    ? false
                    : { opacity: 0, scale: 1.08, y: 24 }
                }
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: reducedMotion ? 0 : 1.1,
                  ease,
                }}
              >
                <Image
                  src="/images/introduction/introduction-detail.jpg"
                  alt="Close-up architectural details and natural materials"
                  fill
                  sizes="(max-width: 900px) 42vw, 24vw"
                  className="mdh-intro-image"
                />
              </motion.div>

              <span className="mdh-intro-detail-caption">
                BEAUTY IN THE DETAILS
              </span>
            </div>
          </div>

          <div className="mdh-intro-story-column">
            <motion.div
              className="mdh-intro-story"
              initial={reducedMotion ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: reducedMotion ? 0 : 0.95,
                ease,
              }}
            >
              <span className="mdh-intro-small-index">
                A THOUGHTFUL APPROACH
              </span>

              <h3>
                Every detail
                <br />
                <em>has meaning.</em>
              </h3>

              <p>
                Every environment should feel intentional.
                Meppeplin brings together interior décor,
                architectural finishes, outdoor environments,
                technical installations, and property services
                to create spaces that work beautifully as a whole.
              </p>

              <p>
                Our approach balances visual character with
                practical purpose, placing people, materials,
                and the experience of a space at the centre
                of every decision.
              </p>

              <Magnetic strength={0.15}>
                <Link
                  href="/about"
                  className="mdh-intro-story-link"
                >
                  <span data-magnetic-inner>
                    DISCOVER OUR STUDIO
                  </span>
                  <ArrowUpRight
                    size={18}
                    strokeWidth={1.4}
                  />
                </Link>
              </Magnetic>
            </motion.div>

            <div
              ref={secondaryImageRef}
              className="mdh-intro-secondary-image"
            >
              <div
                ref={secondaryImageInnerRef}
                className="mdh-intro-image-inner"
              >
                <Image
                  src="/images/introduction/introduction-secondary.jpg"
                  alt="Warm modern living space with architectural detailing"
                  fill
                  sizes="(max-width: 900px) 100vw, 37vw"
                  className="mdh-intro-image"
                />
              </div>

              <span className="mdh-intro-secondary-caption">
                SPACES TO LIVE BEAUTIFULLY
              </span>
            </div>
          </div>
        </div>

        <div className="mdh-intro-principles">
          <div className="mdh-intro-principles-heading">
            <span className="mdh-intro-small-index">
              OUR DESIGN PRINCIPLES
            </span>

            <p>Considered in every detail.</p>
          </div>

          <div className="mdh-intro-principles-list">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.number}
                className="mdh-intro-principle"
                initial={
                  reducedMotion
                    ? false
                    : { opacity: 0, y: 25 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.7,
                  delay: reducedMotion ? 0 : index * 0.1,
                  ease,
                }}
              >
                <span className="mdh-intro-principle-number">
                  {principle.number}
                </span>

                <h4>{principle.title}</h4>
                <p>{principle.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div
          ref={closingRef}
          className="mdh-intro-closing"
        >
          <span>PHILOSOPHY INTO PRACTICE</span>

          <a href="#services-explorer">
            02 / EXPLORE OUR EXPERTISE
            <ArrowDownRight
              size={16}
              strokeWidth={1.4}
            />
          </a>
        </div>
      </div>
    </section>
  );
}
