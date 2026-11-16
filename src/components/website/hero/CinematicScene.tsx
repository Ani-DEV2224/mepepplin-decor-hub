
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type CinematicSceneProps = {
  active: boolean;
};

export default function CinematicScene({
  active,
}: CinematicSceneProps) {
  const reducedMotion = Boolean(useReducedMotion());

  const reveal = (delay = 0) => ({
    initial: false as const,
    animate: {
      opacity: active ? 1 : 0,
      y: active ? 0 : 24,
    },
    transition: {
      duration: reducedMotion ? 0 : 0.75,
      delay: active && !reducedMotion ? delay : 0,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  });

  return (
    <div className="mh-cinematic">
      <div className="mh-cinematic-media">
        <Image
          src="/images/home/cinematic-hero.jpg"
          alt="Architectural interior design showcase"
          fill
          priority
          sizes="100vw"
          className="mh-cover-image"
        />
      </div>

      <div className="mh-cinematic-overlay" />

      <div className="mh-cinematic-content">
        <motion.p className="mh-eyebrow" {...reveal(0.15)}>
          MEPPEPLIN DECOR HUB
          <span className="mh-cinematic-eyebrow-divider"> / </span>
          THE ART OF LIVING BEAUTIFULLY
        </motion.p>

        <h1 className="mh-cinematic-heading">
          <span className="mh-line-mask">
            <motion.span
              initial={false}
              animate={{
                y: active ? "0%" : "110%",
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.9,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              Spaces with
            </motion.span>
          </span>

          <span className="mh-line-mask">
            <motion.em
              initial={false}
              animate={{
                y: active ? "0%" : "110%",
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.95,
                delay: active && !reducedMotion ? 0.12 : 0,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              purpose.
            </motion.em>
          </span>
        </h1>

        <motion.div
          className="mh-cinematic-bottom"
          {...reveal(0.35)}
        >
          <p>
            Thoughtfully considered interiors, refined finishes,
            and distinctive environments shaped around the
            way you live.
          </p>

          <div className="mh-cinematic-actions">
            <Link
              href="/contact"
              className="mh-cinematic-primary-action"
            >
              <span>START YOUR PROJECT</span>
              <ArrowUpRight size={17} strokeWidth={1.5} />
            </Link>

            <Link
              href="/projects"
              className="mh-cinematic-secondary-action"
            >
              <span>EXPLORE OUR WORK</span>
              <ArrowDownRight size={17} strokeWidth={1.5} />
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="mh-cinematic-side-label" aria-hidden="true">
        DESIGN / FORM / EXPERIENCE
      </div>
    </div>
  );
}
