
"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

type MepepplinMarkProps = {
  className?: string;
};

export default function MepepplinMark({
  className = "",
}: MepepplinMarkProps) {
  const reduceMotion = useReducedMotion();
  const reduced = reduceMotion === true;

  return (
    <div
      className={`relative isolate w-full ${className}`}
    >
      {/* SOFT PURPLE BACKGROUND ILLUMINATION */}
      <motion.div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-[15%]
          -z-10
          rounded-full
          bg-[#a778c8]/20
          blur-[60px]
        "
        initial={{
          opacity: reduced ? 0.4 : 0,
          scale: reduced ? 1 : 0.7,
        }}
        animate={{
          opacity: reduced
            ? 0.4
            : [0.15, 0.45, 0.25],
          scale: reduced
            ? 1
            : [0.8, 1.1, 0.95],
        }}
        transition={{
          duration: reduced ? 0 : 2.5,
          ease: "easeInOut",
        }}
      />

      {/* OFFICIAL MEPPEPLIN DECOR HUB LOGO */}
      <motion.div
        className="relative z-10 w-full"
        initial={{
          opacity: reduced ? 1 : 0,
          scale: reduced ? 1 : 0.85,
          filter: reduced
            ? "blur(0px)"
            : "blur(12px)",
        }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
        }}
        transition={{
          duration: reduced ? 0 : 1.4,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <Image
          src="/images/brand/mepepplin-logo.png"
          alt="Meppeplin Decor Hub"
          width={800}
          height={400}
          priority
          draggable={false}
          className="
            h-auto
            w-full
            select-none
            object-contain
          "
        />
      </motion.div>

      {/* SUBTLE MOVING GLASS REFLECTION */}
      {!reduced && (
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            z-20
            overflow-hidden
          "
        >
          <motion.div
            className="
              absolute
              -top-1/2
              h-[200%]
              w-[18%]
              rotate-[18deg]
              bg-gradient-to-r
              from-transparent
              via-white/35
              to-transparent
              blur-lg
            "
            initial={{
              left: "-40%",
            }}
            animate={{
              left: "130%",
            }}
            transition={{
              delay: 0.55,
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
        </div>
      )}
    </div>
  );
}
