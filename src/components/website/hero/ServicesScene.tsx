
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const services = [
  {
    number: "01",
    title: "Interior Design & Décor",
  },
  {
    number: "02",
    title: "Architectural Finishes",
  },
  {
    number: "03",
    title: "Landscaping",
  },
  {
    number: "04",
    title: "Installations & Project Management",
  },
];

type ServicesSceneProps = {
  active: boolean;
};

export default function ServicesScene({
  active,
}: ServicesSceneProps) {
  const reducedMotion = Boolean(useReducedMotion());

  return (
    <div className="mh-services">
      <div className="mh-services-left">
        <motion.span
          className="mh-dark-eyebrow"
          initial={false}
          animate={{
            opacity: active ? 1 : 0,
            y: active ? 0 : 18,
          }}
          transition={{
            duration: reducedMotion ? 0 : 0.6,
          }}
        >
          03 / THE ART OF WHAT WE DO
        </motion.span>

        <motion.h2
          initial={false}
          animate={{
            opacity: active ? 1 : 0,
            y: active ? 0 : 25,
          }}
          transition={{
            duration: reducedMotion ? 0 : 0.75,
            delay: active && !reducedMotion ? 0.1 : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          Design.
          <br />
          Detail.
          <br />
          <em>Distinction.</em>
        </motion.h2>

        <div className="mh-services-list">
          {services.map((service, index) => (
            <motion.div
              key={service.number}
              initial={false}
              animate={{
                opacity: active ? 1 : 0,
                x: active ? 0 : -24,
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.6,
                delay:
                  active && !reducedMotion
                    ? 0.2 + index * 0.09
                    : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link href="/expertise">
                <span>{service.number}</span>
                <strong>{service.title}</strong>
                <ArrowUpRight
                  size={17}
                  strokeWidth={1.4}
                />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={false}
          animate={{
            opacity: active ? 1 : 0,
            y: active ? 0 : 15,
          }}
          transition={{
            duration: reducedMotion ? 0 : 0.6,
            delay: active && !reducedMotion ? 0.6 : 0,
          }}
        >
          <Link href="/expertise" className="mh-dark-link">
            DISCOVER OUR EXPERTISE
            <ArrowUpRight size={17} strokeWidth={1.4} />
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="mh-services-right"
        initial={false}
        animate={{
          opacity: active ? 1 : 0,
          scale: active ? 1 : 1.06,
        }}
        transition={{
          duration: reducedMotion ? 0 : 1.1,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <Image
          src="/images/home/hero-section-3.jpg"
          alt="Meppeplin Decor Hub architectural design and finishes"
          fill
          sizes="(max-width: 800px) 100vw, 48vw"
          className="mh-services-image"
        />

        <div className="mh-services-image-caption">
          <span>THE BEAUTY IS IN THE DETAILS</span>
          <span>MEPPEPLIN DECOR HUB</span>
        </div>
      </motion.div>
    </div>
  );
}
