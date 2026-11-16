"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  useRef,
  type MouseEvent,
} from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

import {
  gsap,
  ScrollTrigger,
  useGSAP,
} from "@/lib/gsap";

import Magnetic from "@/components/interactions/Magnetic";

const ease = [0.22, 1, 0.36, 1] as const;

const links = [
  {
    number: "01",
    title: "Our Expertise",
    href: "/expertise",
  },
  {
    number: "02",
    title: "Our Projects",
    href: "/projects",
  },
  {
    number: "03",
    title: "Start a Project",
    href: "/contact",
  },
];

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const imageDepthRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const bottomNavRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  const reduced = useReducedMotion() === true;

  useGSAP(
    () => {
      const section = heroRef.current;
      const canvas = canvasRef.current;
      const image = imageRef.current;
      const imageDepth = imageDepthRef.current;
      const content = contentRef.current;
      const detail = detailRef.current;
      const bottomNav = bottomNavRef.current;

      if (
        !section ||
        !canvas ||
        !image ||
        !imageDepth ||
        !content
      ) {
        return;
      }

      if (reduced) {
        gsap.set(
          [
            image,
            imageDepth,
            content,
            detail,
            bottomNav,
          ].filter(Boolean),
          {
            clearProps: "transform",
          }
        );

        return;
      }

      /*
       * Scroll choreography.
       *
       * GSAP owns the continuous scroll transforms.
       * Framer Motion remains responsible for entrance/UI states.
       */

      gsap.to(imageDepth, {
        yPercent: 12,
        scale: 1.055,
        ease: "none",

        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1.1,
        },
      });

      gsap.to(content, {
        y: -52,
        opacity: 0.55,
        ease: "none",

        scrollTrigger: {
          trigger: section,
          start: "32% top",
          end: "bottom top",
          scrub: 1,
        },
      });

      if (detail) {
        gsap.to(detail, {
          y: -68,
          rotate: -1.2,
          ease: "none",

          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 1.25,
          },
        });
      }

      if (bottomNav) {
        gsap.to(bottomNav, {
          y: 30,
          opacity: 0.72,
          ease: "none",

          scrollTrigger: {
            trigger: section,
            start: "55% top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      /*
       * Canvas itself contracts very slightly as the visitor
       * leaves the Hero.
       */
      gsap.fromTo(
        canvas,
        {
          scale: 1,
          borderRadius: 18,
        },
        {
          scale: 0.982,
          borderRadius: 28,
          ease: "none",

          scrollTrigger: {
            trigger: section,
            start: "55% top",
            end: "bottom top",
            scrub: 1.1,
          },
        }
      );

      ScrollTrigger.refresh();
    },
    {
      scope: heroRef,
      dependencies: [reduced],
      revertOnUpdate: true,
    }
  );

  /*
   * Pointer depth.
   *
   * We animate a DIFFERENT wrapper from the ScrollTrigger
   * image wrapper. That prevents competing transforms.
   */
  const handlePointerMove = (
    event: MouseEvent<HTMLDivElement>
  ) => {
    if (
      reduced ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const canvas = canvasRef.current;
    const image = imageRef.current;
    const detail = detailRef.current;

    if (!canvas || !image) return;

    const rect = canvas.getBoundingClientRect();

    const normalizedX =
      (event.clientX - rect.left) / rect.width - 0.5;

    const normalizedY =
      (event.clientY - rect.top) / rect.height - 0.5;

    gsap.to(image, {
      xPercent: normalizedX * 2.4,
      yPercent: normalizedY * 1.8,
      duration: 1.15,
      ease: "power3.out",
      overwrite: "auto",
    });

    if (detail) {
      gsap.to(detail, {
        x: normalizedX * -13,
        rotateY: normalizedX * -2.2,
        rotateX: normalizedY * 2,
        duration: 0.9,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
  };

  const handlePointerLeave = () => {
    if (reduced) return;

    if (imageRef.current) {
      gsap.to(imageRef.current, {
        xPercent: 0,
        yPercent: 0,
        duration: 1.2,
        ease: "power3.out",
        overwrite: "auto",
      });
    }

    if (detailRef.current) {
      gsap.to(detailRef.current, {
        x: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 1,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
  };

  return (
    <section
      ref={heroRef}
      id="home"
      className="mdh-crystal-hero relative min-h-screen overflow-hidden px-3 pb-6 pt-[86px] sm:px-5 lg:px-6 lg:pt-[88px]"
    >
      <div className="mx-auto max-w-[1650px]">
        {/* COMPACT SECTION HEADER */}
        <motion.div
          initial={
            reduced
              ? false
              : {
                  opacity: 0,
                  y: 18,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: reduced ? 0 : 0.75,
            delay: reduced ? 0 : 0.15,
            ease,
          }}
          className="mb-3 flex items-center justify-between gap-3 px-1"
        >
          <div className="flex items-center gap-2.5">
            <span className="h-px w-5 bg-[#70409c]" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] opacity-65">
              Architectural & Interior Solutions
            </span>
          </div>

          <span className="hidden text-[9px] uppercase tracking-[0.17em] opacity-45 sm:block">
            Meppeplin Decor Hub
          </span>
        </motion.div>

        {/* CINEMATIC IMAGE CANVAS */}
        <div
          ref={canvasRef}
          onMouseMove={handlePointerMove}
          onMouseLeave={handlePointerLeave}
          className="relative min-h-[720px] overflow-hidden rounded-[18px] bg-[#3d353a] sm:min-h-[750px] lg:min-h-[720px]"
          style={{
            transformOrigin: "center top",
          }}
        >
          {/* IMAGE REVEAL */}
          <motion.div
            initial={
              reduced
                ? false
                : {
                    clipPath: "inset(0 0 100% 0)",
                    scale: 1.1,
                  }
            }
            animate={{
              clipPath: "inset(0 0 0% 0)",
              scale: 1,
            }}
            transition={{
              duration: reduced ? 0 : 1.45,
              delay: reduced ? 0 : 0.1,
              ease,
            }}
            className="absolute inset-0"
          >
            {/* GSAP scroll wrapper */}
            <div
              ref={imageDepthRef}
              className="absolute -inset-y-[12%] inset-x-0"
            >
              {/* GSAP pointer wrapper */}
              <div
                ref={imageRef}
                className="absolute -inset-[2.5%]"
              >
                <Image
                  src="/images/home/hero-interior.jpg"
                  alt="Meppeplin Decor Hub architectural interior"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 85vw"
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#151015]/75 via-[#151015]/25 to-transparent" />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#151015]/75 via-transparent to-black/15" />

          {/* CINEMATIC LIGHT PASS */}
          {!reduced && (
            <motion.div
              ref={lightRef}
              initial={{
                x: "-140%",
                opacity: 0,
              }}
              animate={{
                x: ["-140%", "170%"],
                opacity: [0, 0.22, 0],
              }}
              transition={{
                duration: 2.1,
                delay: 0.65,
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute inset-y-0 w-[30%] -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-2xl"
            />
          )}

          {/* TOP GLASS STATUS */}
          <motion.div
            initial={
              reduced
                ? false
                : {
                    opacity: 0,
                    y: -20,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: reduced ? 0 : 0.8,
              delay: reduced ? 0 : 0.9,
              ease,
            }}
            className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3 sm:left-7 sm:right-7 sm:top-7"
          >
            <div className="mdh-hero-glass flex h-[34px] items-center gap-2 rounded-[9px] px-3">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d8c2e6] opacity-40" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-[#b99ed0]" />
              </span>

              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white">
                The Art of Living
              </span>
            </div>

            <span className="mdh-hero-glass flex h-[34px] items-center rounded-[9px] px-3 text-[9px] font-medium tracking-[0.14em] text-white">
              M / 01
            </span>
          </motion.div>

          {/* MAIN EDITORIAL CONTENT */}
          <div
            ref={contentRef}
            className="absolute inset-x-5 top-[19%] z-10 sm:inset-x-10 sm:top-[23%] lg:left-12 lg:right-[38%] lg:top-[25%]"
          >
            <div className="overflow-hidden">
              <motion.p
                initial={
                  reduced
                    ? false
                    : {
                        opacity: 0,
                        y: 25,
                      }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: reduced ? 0 : 0.7,
                  delay: reduced ? 0 : 0.55,
                  ease,
                }}
                className="mb-5 text-[9px] font-semibold uppercase tracking-[0.26em] text-white/80"
              >
                Beyond Interiors. Beyond Expectations.
              </motion.p>
            </div>

            <div className="overflow-hidden pb-3">
              <motion.h1
                initial={
                  reduced
                    ? false
                    : {
                        y: "110%",
                        opacity: 0,
                      }
                }
                animate={{
                  y: "0%",
                  opacity: 1,
                }}
                transition={{
                  duration: reduced ? 0 : 1.05,
                  delay: reduced ? 0 : 0.7,
                  ease,
                }}
                className="font-serif text-[clamp(63px,7vw,122px)] leading-[0.84] tracking-[-0.045em] text-white"
              >
                Spaces beyond
              </motion.h1>
            </div>

            <div className="overflow-hidden pb-3">
              <motion.div
                initial={
                  reduced
                    ? false
                    : {
                        y: "110%",
                        opacity: 0,
                      }
                }
                animate={{
                  y: "0%",
                  opacity: 1,
                }}
                transition={{
                  duration: reduced ? 0 : 1.1,
                  delay: reduced ? 0 : 0.86,
                  ease,
                }}
              >
                <span className="block font-serif text-[clamp(63px,7vw,122px)] italic leading-[0.9] tracking-[-0.045em] text-[#e7d7ed]">
                  the ordinary.
                </span>
              </motion.div>
            </div>

            <motion.p
              initial={
                reduced
                  ? false
                  : {
                      opacity: 0,
                      y: 25,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: reduced ? 0 : 0.9,
                delay: reduced ? 0 : 1.1,
                ease,
              }}
              className="mt-5 max-w-[450px] text-[12px] leading-[1.95] text-white/85 sm:text-[13px]"
            >
              Thoughtfully designed interiors, architectural
              finishes, outdoor spaces, installations and
              property solutions — brought together with
              purpose and precision.
            </motion.p>

            <motion.div
              initial={
                reduced
                  ? false
                  : {
                      opacity: 0,
                      y: 20,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: reduced ? 0 : 0.8,
                delay: reduced ? 0 : 1.28,
                ease,
              }}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <Magnetic strength={0.18}>
                <Link
                  href="/expertise"
                  className="mdh-hero-primary group inline-flex h-[39px] items-center gap-4 rounded-[9px] px-4 text-[10px] font-semibold"
                >
                  <span data-magnetic-inner>
                    Explore Our Expertise
                  </span>

                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </Magnetic>

              <Magnetic strength={0.14}>
                <Link
                  href="/about"
                  className="mdh-hero-glass group inline-flex h-[39px] items-center gap-3 rounded-[9px] px-4 text-[10px] font-semibold text-white"
                >
                  <span data-magnetic-inner>
                    Our Approach
                  </span>

                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </Magnetic>
            </motion.div>
          </div>

          {/* FLOATING DETAIL CARD */}
          <motion.div
            ref={detailRef}
            initial={
              reduced
                ? false
                : {
                    opacity: 0,
                    x: 45,
                    scale: 0.94,
                  }
            }
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={{
              duration: reduced ? 0 : 1.05,
              delay: reduced ? 0 : 1.05,
              ease,
            }}
            className="mdh-hero-glass absolute bottom-[110px] right-7 hidden w-[240px] overflow-hidden rounded-[14px] p-2 lg:block xl:right-10 xl:w-[265px]"
            style={{
              transformPerspective: 900,
            }}
          >
            <div className="group relative h-[150px] overflow-hidden rounded-[9px]">
              <Image
                src="/images/home/hero-detail.jpeg"
                alt="Interior design details"
                fill
                sizes="265px"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.065]"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>

            <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-3">
              <div>
                <p className="text-[9px] uppercase tracking-[0.14em] text-white/60">
                  Considered Details
                </p>

                <h2 className="mt-1 font-serif text-[25px] leading-none text-white">
                  Crafted with care.
                </h2>
              </div>

              <Magnetic strength={0.25}>
                <Link
                  href="/projects"
                  aria-label="View projects"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-white/25 text-white transition-colors hover:bg-white/20"
                >
                  <ArrowUpRight
                    data-magnetic-inner
                    size={16}
                  />
                </Link>
              </Magnetic>
            </div>
          </motion.div>

          {/* BOTTOM GLASS NAVIGATION */}
          <motion.div
            ref={bottomNavRef}
            initial={
              reduced
                ? false
                : {
                    opacity: 0,
                    y: 45,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: reduced ? 0 : 0.9,
              delay: reduced ? 0 : 1.4,
              ease,
            }}
            className="absolute bottom-4 left-4 right-4 z-10 sm:bottom-7 sm:left-7 sm:right-7"
          >
            <div className="mdh-hero-glass grid grid-cols-3 gap-0 overflow-hidden rounded-[12px]">
              {links.map((item, index) => (
                <Link
                  key={item.number}
                  href={item.href}
                  className={`group relative flex min-h-[69px] items-center justify-between gap-2 overflow-hidden px-3 py-3 transition-colors duration-300 hover:bg-white/15 sm:px-5 ${
                    index > 0
                      ? "border-l border-white/20"
                      : ""
                  }`}
                >
                  <div className="relative z-10">
                    <span className="block text-[9px] text-white/55">
                      {item.number}
                    </span>

                    <span className="mt-1 block text-[10px] font-semibold text-white sm:text-[12px]">
                      {item.title}
                    </span>
                  </div>

                  <ArrowUpRight
                    size={15}
                    className="relative z-10 hidden shrink-0 text-white/75 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block"
                  />

                  <span className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-white/70 transition-[width] duration-500 ease-out group-hover:w-full" />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* BELOW-HERO EDITORIAL STRIP */}
        <div className="mt-4 flex items-center justify-between border-b border-current/10 px-1 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-semibold uppercase tracking-[0.16em] opacity-55">
              Design / Build / Enhance
            </span>
          </div>

          <a
            href="#our-approach"
            className="group flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] opacity-65 transition-opacity hover:opacity-100"
          >
            Explore Further

            <ArrowDown
              size={14}
              className="transition-transform duration-300 group-hover:translate-y-1"
            />
          </a>
        </div>
      </div>
    </section>
  );
}