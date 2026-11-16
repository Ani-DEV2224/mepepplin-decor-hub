
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";

export default function ProjectVideoShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;

    if (!section || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        const visible = entry.intersectionRatio >= 0.35;
        setIsVisible(visible);

        if (visible) {
          video.muted = true;

          const playPromise = video.play();

          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Browser may restrict autoplay.
            });
          }
        } else {
          video.pause();
          video.currentTime = 0;
        }
      },
      {
        threshold: [0, 0.35, 0.6, 1],
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="project-showcase"
      className="relative overflow-hidden bg-[#f8f5fa] px-4 py-20 md:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* SECTION HEADING */}
        <motion.div
          initial={{
            opacity: reduceMotion ? 1 : 0,
            y: reduceMotion ? 0 : 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-12 flex flex-col justify-between gap-7 md:flex-row md:items-end"
        >
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-[1px] w-10 bg-[#70409c]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#70409c]">
                The Meppeplin Experience
              </span>
            </div>

            <h2 className="max-w-[800px] font-serif text-[clamp(42px,6vw,86px)] leading-[1.05] tracking-[-0.045em] text-[#302238]">
              Spaces worth
              <br />
              <span className="italic text-[#8556a5]">
                experiencing.
              </span>
            </h2>
          </div>

          <p className="max-w-[330px] text-[14px] leading-8 text-[#776a80]">
            Discover the details, materials, and environments
            that shape our approach to beautiful spaces.
          </p>
        </motion.div>

        {/* CINEMATIC VIDEO FRAME */}
        <motion.div
          initial={{
            opacity: reduceMotion ? 1 : 0,
            y: reduceMotion ? 0 : 70,
            scale: reduceMotion ? 1 : 0.96,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 1.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative overflow-hidden rounded-[30px] bg-[#241b2c] shadow-[0_35px_100px_rgba(42,20,58,0.16)] md:rounded-[42px]"
        >
          <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/8]">
            <video
              ref={videoRef}
              src="/videos/home/project-preview.mp4"
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Meppeplin Decor Hub design showcase"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* GRADIENT OVERLAY */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#130f18]/80 via-transparent to-black/20" />

            {/* TOP GLASS LABEL */}
            <div className="absolute left-5 top-5 flex items-center gap-3 rounded-full border border-white/30 bg-white/15 px-5 py-3 backdrop-blur-2xl md:left-10 md:top-10">
              <span
                className={`h-2 w-2 rounded-full ${
                  isVisible
                    ? "animate-pulse bg-[#d6b0ee]"
                    : "bg-white/50"
                }`}
              />

              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white">
                Meppeplin / Motion
              </span>
            </div>

            {/* BOTTOM CONTENT */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col justify-between gap-6 p-6 md:flex-row md:items-end md:p-12">
              <div className="max-w-[650px]">
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/65">
                  Design in Motion
                </span>

                <h3 className="mt-3 font-serif text-[clamp(30px,4vw,58px)] leading-[1.1] text-white">
                  Every space tells a story.
                </h3>

                <p className="mt-4 max-w-[430px] text-[13px] leading-7 text-white/70">
                  Thoughtful spaces, exceptional details,
                  and environments created for living.
                </p>
              </div>

              <Link
                href="/projects"
                className="group inline-flex h-14 w-fit items-center gap-5 rounded-full border border-white/40 bg-white/15 px-6 text-[12px] font-medium text-white backdrop-blur-xl transition-all hover:bg-white hover:text-[#302238]"
              >
                Explore Projects

                <ArrowUpRight
                  size={17}
                  className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* BELOW VIDEO LABEL */}
        <div className="mt-7 flex items-center justify-between gap-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#8b7a95]">
            Meppeplin Decor Hub
          </span>

          <div className="flex items-center gap-2 text-[#70409c]">
            <Play size={12} fill="currentColor" />
            <span className="text-[10px] uppercase tracking-[0.15em]">
              Silent Film
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
