
"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

type MepepplinLoaderProps = {
  onComplete: () => void;
  exiting: boolean;
};

const ease = [0.76, 0, 0.24, 1] as const;

export default function MepepplinLoader({
  onComplete,
  exiting,
}: MepepplinLoaderProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="prelude"
      role="status"
      aria-label="Opening Meppeplin Decor Hub"
      initial={false}
      animate={
        exiting
          ? reducedMotion
            ? { opacity: 0 }
            : { y: "-100%" }
          : { y: "0%", opacity: 1 }
      }
      transition={{
        duration: reducedMotion ? 0.15 : 1.05,
        ease,
      }}
      onAnimationComplete={() => {
        if (exiting) onComplete();
      }}
    >
      <div className="prelude-top">
        <span>MEPPEPLIN DECOR HUB</span>
        <span>DESIGN &amp; CRAFT</span>
      </div>

      <div className="prelude-center">
        {/* Official company logo */}
        <motion.div
          className="prelude-brand-logo"
          initial={
            reducedMotion
              ? { opacity: 1 }
              : {
                  opacity: 0,
                  y: 30,
                  scale: 0.82,
                  filter: "blur(12px)",
                }
          }
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          }}
          transition={{
            delay: reducedMotion ? 0 : 0.12,
            duration: reducedMotion ? 0 : 1.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Image
            src="/images/brand/mepepplin-logo.png"
            alt="Meppeplin Decor Hub official logo"
            width={240}
            height={160}
            priority
            className="prelude-brand-image"
          />
        </motion.div>

        {/* Architectural descriptor */}
        <motion.div
          className="prelude-eyebrow"
          initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: reducedMotion ? 0 : 0.35,
            duration: reducedMotion ? 0 : 0.65,
          }}
        >
          INTERIORS · ARCHITECTURE · DESIGN
        </motion.div>

        {/* Animated company name */}
        <div className="prelude-wordmark" aria-hidden="true">
          {"MEPPEPLIN".split("").map((letter, index) => (
            <span className="prelude-letter-mask" key={index}>
              <motion.span
                className="prelude-letter"
                initial={
                  reducedMotion
                    ? { y: "0%" }
                    : { y: "115%", rotate: 4 }
                }
                animate={{ y: "0%", rotate: 0 }}
                transition={{
                  delay: reducedMotion ? 0 : 0.48 + index * 0.065,
                  duration: reducedMotion ? 0 : 0.85,
                  ease,
                }}
              >
                {letter}
              </motion.span>
            </span>
          ))}
        </div>

        {/* Subtitle */}
        <motion.div
          className="prelude-subtitle"
          initial={{
            opacity: reducedMotion ? 1 : 0,
            letterSpacing: reducedMotion ? "0.42em" : "0.7em",
          }}
          animate={{
            opacity: 1,
            letterSpacing: "0.42em",
          }}
          transition={{
            delay: reducedMotion ? 0 : 1.0,
            duration: reducedMotion ? 0 : 0.7,
          }}
        >
          DECOR HUB
        </motion.div>

        {/* Architectural line */}
        <motion.div
          className="prelude-line"
          initial={{ scaleX: reducedMotion ? 1 : 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            delay: reducedMotion ? 0 : 1.15,
            duration: reducedMotion ? 0 : 0.9,
            ease,
          }}
        />

        {/* Closing tagline */}
        <motion.p
          className="prelude-tagline"
          initial={{
            opacity: reducedMotion ? 1 : 0,
            y: reducedMotion ? 0 : 12,
          }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: reducedMotion ? 0 : 1.35,
            duration: reducedMotion ? 0 : 0.6,
          }}
        >
          SPACES, THOUGHTFULLY CREATED.
        </motion.p>
      </div>

      <div className="prelude-bottom">
        <span>A DESIGN EXPERIENCE</span>
        <span>PLEASE WAIT</span>
      </div>
    </motion.div>
  );
}
