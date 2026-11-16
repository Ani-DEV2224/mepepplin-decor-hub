"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

import {
  navigation,
  serviceCategories,
} from "@/lib/site-navigation";

import ThemeToggle from "@/components/theme/ThemeToggle";

import {
  gsap,
  ScrollTrigger,
  useGSAP,
} from "@/lib/gsap";

const ease = [0.22, 1, 0.36, 1] as const;

const sidebarWide = 212;
const sidebarNarrow = 68;

export default function Navbar() {
  const pathname = usePathname();
  const reduced = useReducedMotion() === true;

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [mobileServicesOpen, setMobileServicesOpen] =
    useState(false);

  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /*
   * ---------------------------------------------------------
   * REFS
   * ---------------------------------------------------------
   */

  const mobileCloseRef =
    useRef<HTMLButtonElement>(null);

  const menuTriggerRef =
    useRef<HTMLButtonElement>(null);

  const servicesTriggerRef =
    useRef<HTMLButtonElement>(null);

  const sidebarRef =
    useRef<HTMLElement>(null);

  const headerRef =
    useRef<HTMLElement>(null);

  const logoRef =
    useRef<HTMLAnchorElement>(null);

  const headerLabelRef =
    useRef<HTMLDivElement>(null);

  const desktopActionsRef =
    useRef<HTMLDivElement>(null);

  /*
   * ---------------------------------------------------------
   * HELPERS
   * ---------------------------------------------------------
   */

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileServicesOpen(false);
  };

  const closeServices = () => {
    setServicesOpen(false);
  };

  const active = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    if (href.includes("#")) {
      return false;
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  /*
   * ---------------------------------------------------------
   * GSAP — NAVIGATION CHOREOGRAPHY
   * ---------------------------------------------------------
   */

  useGSAP(
    () => {
      const header = headerRef.current;
      const sidebar = sidebarRef.current;
      const logo = logoRef.current;
      const label = headerLabelRef.current;
      const actions = desktopActionsRef.current;

      if (!header) return;

      /*
       * Reduced motion:
       * ensure everything remains fully visible.
       */
      if (reduced) {
        gsap.set(
          [
            header,
            sidebar,
            logo,
            label,
            actions,
          ].filter(Boolean),
          {
            clearProps: "transform,opacity",
          }
        );

        return;
      }

      /*
       * Initial navigation entrance.
       */
      const intro = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      intro.fromTo(
        header,
        {
          y: -38,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
        },
        0
      );

      if (sidebar) {
        intro.fromTo(
          sidebar,
          {
            x: -28,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
          },
          0.08
        );
      }

      if (logo) {
        intro.fromTo(
          logo,
          {
            y: -8,
            opacity: 0,
            scale: 0.94,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.75,
          },
          0.3
        );
      }

      if (label) {
        intro.fromTo(
          label.children,
          {
            x: -10,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.07,
          },
          0.35
        );
      }

      if (actions) {
        intro.fromTo(
          actions.children,
          {
            y: -8,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.065,
          },
          0.4
        );
      }

      /*
       * Scroll response.
       *
       * Navbar remains visible but becomes slightly tighter
       * once the visitor moves away from the top of the page.
       */
      gsap.to(header, {
        y: -1,
        scale: 0.992,
        transformOrigin: "center top",
        ease: "none",

        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "+=220",
          scrub: 0.7,
        },
      });

      if (logo) {
        gsap.to(logo, {
          scale: 0.94,
          ease: "none",

          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "+=220",
            scrub: 0.7,
          },
        });
      }

      ScrollTrigger.refresh();
    },
    {
      scope: headerRef,
      dependencies: [reduced],
      revertOnUpdate: true,
    }
  );

  /*
   * ---------------------------------------------------------
   * SIDEBAR WIDTH → CSS VARIABLE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const width = collapsed
      ? sidebarNarrow
      : sidebarWide;

    document.documentElement.style.setProperty(
      "--mdh-sidebar-width",
      `${width}px`
    );

    return () => {
      document.documentElement.style.removeProperty(
        "--mdh-sidebar-width"
      );
    };
  }, [collapsed]);

  /*
   * ---------------------------------------------------------
   * NAVBAR SCROLL STATE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
    };

    onScroll();

    window.addEventListener(
      "scroll",
      onScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        onScroll
      );
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * CLOSE MENUS AFTER ROUTE CHANGE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
    setMobileServicesOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  /*
   * ---------------------------------------------------------
   * ESCAPE KEY
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!mobileOpen && !servicesOpen) {
      return;
    }

    const onEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key !== "Escape") {
        return;
      }

      if (mobileOpen) {
        setMobileOpen(false);
        setMobileServicesOpen(false);

        menuTriggerRef.current?.focus();
      }

      if (servicesOpen) {
        setServicesOpen(false);

        servicesTriggerRef.current?.focus();
      }
    };

    document.addEventListener(
      "keydown",
      onEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        onEscape
      );
    };
  }, [mobileOpen, servicesOpen]);

  /*
   * ---------------------------------------------------------
   * MOBILE BODY SCROLL LOCK
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!mobileOpen) return;

    const previous =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    mobileCloseRef.current?.focus();

    return () => {
      document.body.style.overflow =
        previous;
    };
  }, [mobileOpen]);

  /*
   * ---------------------------------------------------------
   * SIDEBAR POINTER INTERACTION
   * ---------------------------------------------------------
   */

  const handleNavMove = (
    event: MouseEvent<HTMLAnchorElement>
  ) => {
    if (
      reduced ||
      window.matchMedia(
        "(pointer: coarse)"
      ).matches
    ) {
      return;
    }

    const element =
      event.currentTarget;

    const rect =
      element.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) /
        rect.width -
      0.5;

    const y =
      (event.clientY - rect.top) /
        rect.height -
      0.5;

    gsap.to(element, {
      x: x * 4,
      y: y * 2.5,
      duration: 0.45,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const handleNavLeave = (
    event: MouseEvent<HTMLAnchorElement>
  ) => {
    if (reduced) return;

    gsap.to(event.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.45)",
      overwrite: "auto",
    });
  };

  /*
   * ---------------------------------------------------------
   * HEADER GLASS POINTER LIGHT
   * ---------------------------------------------------------
   */

  const handleHeaderPointerMove = (
    event: MouseEvent<HTMLElement>
  ) => {
    if (
      reduced ||
      window.matchMedia(
        "(pointer: coarse)"
      ).matches
    ) {
      return;
    }

    const header =
      headerRef.current;

    if (!header) return;

    const rect =
      header.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) /
        rect.width) *
      100;

    const y =
      ((event.clientY - rect.top) /
        rect.height) *
      100;

    header.style.setProperty(
      "--mdh-nav-pointer-x",
      `${x}%`
    );

    header.style.setProperty(
      "--mdh-nav-pointer-y",
      `${y}%`
    );
  };

  return (
    <>
      {/* =====================================
          DESKTOP FLOATING SIDEBAR
      ====================================== */}

      <motion.aside
        ref={sidebarRef}
        initial={false}
        animate={{
          width: collapsed
            ? sidebarNarrow
            : sidebarWide,
        }}
        transition={{
          duration: reduced ? 0 : 0.55,
          ease,
        }}
        className="mdh-crystal-sidebar fixed bottom-3 left-3 top-3 z-[70] hidden flex-col overflow-hidden rounded-[18px] lg:flex"
      >
        {/* SIDEBAR HEADER */}

        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-current/10 px-3">
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{
                  opacity: 0,
                  x: -8,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -8,
                }}
                transition={{
                  duration: reduced
                    ? 0
                    : 0.2,
                }}
                className="pl-2"
              >
                <span className="block text-[10px] font-bold uppercase tracking-[0.18em]">
                  Meppeplin
                </span>

                <span className="mt-1 block text-[9px] uppercase tracking-[0.16em] opacity-45">
                  Decor Hub
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() =>
              setCollapsed(
                (value) => !value
              )
            }
            aria-label={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            className="mdh-crystal-control flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]"
          >
            {collapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>
        </div>

        {/* SIDEBAR NAVIGATION */}

        <nav
          aria-label="Desktop navigation"
          className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-5"
        >
          {!collapsed && (
            <p className="mb-4 px-3 text-[9px] font-medium uppercase tracking-[0.2em] opacity-40">
              Explore
            </p>
          )}

          <div className="space-y-1">
            {navigation.map(
              (item, index) => {
                const selected =
                  active(item.href);

                return (
                  <motion.div
                    key={item.label}
                    initial={
                      reduced
                        ? false
                        : {
                            opacity: 0,
                            x: -12,
                          }
                    }
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      duration: reduced
                        ? 0
                        : 0.45,

                      delay: reduced
                        ? 0
                        : index * 0.055,

                      ease,
                    }}
                  >
                    <Link
                      href={item.href}
                      title={
                        collapsed
                          ? item.label
                          : undefined
                      }
                      aria-current={
                        selected
                          ? "page"
                          : undefined
                      }
                      onMouseMove={
                        handleNavMove
                      }
                      onMouseLeave={
                        handleNavLeave
                      }
                      className={`mdh-crystal-navlink group relative flex h-[39px] items-center rounded-[10px] ${
                        collapsed
                          ? "justify-center"
                          : "gap-3 px-3"
                      } ${
                        selected
                          ? "mdh-crystal-active"
                          : ""
                      }`}
                    >
                      {selected && (
                        <motion.span
                          layoutId="mdh-sidebar-active"
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 35,
                          }}
                          className="mdh-active-glass absolute inset-0 rounded-[10px]"
                        />
                      )}

                      <span className="relative z-10 text-[10px] font-semibold tabular-nums opacity-60">
                        {String(
                          index + 1
                        ).padStart(2, "0")}
                      </span>

                      {!collapsed && (
                        <>
                          <span className="relative z-10 min-w-0 flex-1 truncate text-[11px] font-medium">
                            {item.label}
                          </span>

                          <ArrowUpRight
                            size={13}
                            className="relative z-10 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-80"
                          />
                        </>
                      )}
                    </Link>
                  </motion.div>
                );
              }
            )}
          </div>
        </nav>

        {/* SIDEBAR FOOTER */}

        <div className="shrink-0 border-t border-current/10 p-3">
          <div
            className={`flex items-center ${
              collapsed
                ? "justify-center"
                : "justify-between"
            }`}
          >
            {!collapsed && (
              <span className="text-[9px] uppercase tracking-[0.12em] opacity-55">
                Theme
              </span>
            )}

            <ThemeToggle />
          </div>

          {!collapsed && (
            <Link
              href="/contact"
              className="mdh-crystal-primary group mt-3 flex h-[37px] items-center justify-between rounded-[9px] px-3 text-[10px] font-semibold"
            >
              Start a Project

              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          )}
        </div>
      </motion.aside>

      {/* =====================================
          FLOATING TOP NAVBAR
      ====================================== */}

      <motion.header
        ref={headerRef}
        initial={false}
        onMouseMove={
          handleHeaderPointerMove
        }
        className={`mdh-crystal-header fixed left-3 right-3 top-3 z-[65] h-[60px] rounded-[15px] sm:left-5 sm:right-5 lg:left-[calc(var(--mdh-sidebar-width)+24px)] lg:right-4 ${
          scrolled
            ? "mdh-crystal-header-scrolled"
            : ""
        }`}
      >
        <div className="relative flex h-full items-center justify-between px-3 sm:px-5">
          {/* MOBILE MENU */}

          <button
            ref={menuTriggerRef}
            type="button"
            onClick={() =>
              setMobileOpen(true)
            }
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mdh-crystal-mobile-menu"
            className="mdh-crystal-control flex h-8 w-8 items-center justify-center rounded-[9px] lg:hidden"
          >
            <Menu
              size={18}
              strokeWidth={1.7}
            />
          </button>

          {/* DESKTOP LABEL */}

          <div
            ref={headerLabelRef}
            className="hidden items-center gap-3 lg:flex"
          >
            <span className="h-px w-5 bg-[#70409c]" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.17em] opacity-60">
              Spaces / Experiences
            </span>
          </div>

          {/* CENTER LOGO */}

          <Link
            ref={logoRef}
            href="/"
            aria-label="Meppeplin Decor Hub home"
            className="absolute left-1/2 -translate-x-1/2"
          >
            <Image
              src="/images/brand/mepepplin-logo.png"
              alt="Meppeplin Decor Hub"
              width={150}
              height={60}
              priority
              className="mdh-crystal-logo h-auto w-[94px] object-contain sm:w-[110px] lg:w-[118px]"
            />
          </Link>

          {/* DESKTOP ACTIONS */}

          <div
            ref={desktopActionsRef}
            className="ml-auto hidden items-center gap-2 lg:flex"
          >
            <button
              ref={servicesTriggerRef}
              type="button"
              onClick={() =>
                setServicesOpen(
                  (value) => !value
                )
              }
              aria-expanded={
                servicesOpen
              }
              aria-controls="mdh-crystal-services"
              className="mdh-crystal-control flex h-8 items-center gap-2 rounded-[9px] px-3 text-[10px] font-semibold"
            >
              Services

              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${
                  servicesOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            <ThemeToggle />

            <Link
              href="/contact"
              className="mdh-crystal-primary group flex h-8 items-center gap-2 rounded-[9px] px-3 text-[10px] font-semibold"
            >
              Let&apos;s Talk

              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {/* MOBILE ACTIONS */}

          <div className="ml-auto flex items-center gap-1.5 lg:hidden">
            <ThemeToggle />

            <Link
              href="/contact"
              className="mdh-crystal-primary flex h-8 items-center gap-1 rounded-[9px] px-2.5 text-[10px] font-semibold"
            >
              Contact

              <ArrowUpRight
                size={13}
              />
            </Link>
          </div>
        </div>
      </motion.header>

      {/* =====================================
          DESKTOP SERVICES DIRECTORY
      ====================================== */}

      <AnimatePresence>
        {servicesOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close services directory"
              onClick={closeServices}
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="fixed inset-0 z-[58] hidden bg-black/10 backdrop-blur-[2px] lg:block"
            />

            <motion.div
              id="mdh-crystal-services"
              initial={{
                opacity: 0,
                y: reduced
                  ? 0
                  : -14,
                scale: reduced
                  ? 1
                  : 0.975,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: reduced
                  ? 0
                  : -10,
                scale: reduced
                  ? 1
                  : 0.98,
              }}
              transition={{
                duration: reduced
                  ? 0
                  : 0.35,
                ease,
              }}
              className="mdh-crystal-directory fixed right-4 top-[82px] z-[64] hidden max-h-[calc(100vh-100px)] w-[min(840px,calc(100vw-var(--mdh-sidebar-width)-40px))] overflow-y-auto rounded-[17px] p-6 lg:block"
            >
              {/* DIRECTORY HEADER */}

              <div className="mb-6 flex items-start justify-between border-b border-current/10 pb-5">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.2em] opacity-55">
                    Our Disciplines
                  </span>

                  <h2 className="mt-2 font-serif text-[43px] leading-none">
                    Explore our expertise.
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={
                    closeServices
                  }
                  aria-label="Close services"
                  className="mdh-crystal-control flex h-8 w-8 items-center justify-center rounded-[9px]"
                >
                  <X size={17} />
                </button>
              </div>

              {/* SERVICE CATEGORIES */}

              <div className="grid grid-cols-2 gap-x-8 gap-y-6 xl:grid-cols-3">
                {serviceCategories.map(
                  (
                    category,
                    index
                  ) => (
                    <motion.div
                      key={
                        category.id
                      }
                      initial={
                        reduced
                          ? false
                          : {
                              opacity: 0,
                              y: 12,
                            }
                      }
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration:
                          reduced
                            ? 0
                            : 0.45,

                        delay:
                          reduced
                            ? 0
                            : 0.08 +
                              index *
                                0.055,

                        ease,
                      }}
                    >
                      <Link
                        href={`/expertise#${category.id}`}
                        onClick={
                          closeServices
                        }
                        className="group flex items-start gap-2.5"
                      >
                        <span className="pt-0.5 text-[9px] font-semibold text-[#70409c]">
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <span className="flex-1 text-[11px] font-semibold leading-[1.5]">
                          {
                            category.title
                          }
                        </span>

                        <ArrowUpRight
                          size={14}
                          className="shrink-0 opacity-45 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </Link>

                      <div className="ml-6 mt-3 space-y-1.5">
                        {category.services.map(
                          (
                            service
                          ) => (
                            <p
                              key={
                                service
                              }
                              className="text-[10px] leading-[1.65] opacity-60 transition-all duration-300 hover:translate-x-1 hover:opacity-100"
                            >
                              {
                                service
                              }
                            </p>
                          )
                        )}
                      </div>
                    </motion.div>
                  )
                )}
              </div>

              {/* DIRECTORY FOOTER */}

              <Link
                href="/expertise"
                onClick={
                  closeServices
                }
                className="group mt-7 flex items-center justify-between border-t border-current/10 pt-4 text-[11px] font-semibold"
              >
                View All Services

                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* =====================================
          MOBILE CRYSTAL DRAWER
      ====================================== */}

      <AnimatePresence>
        {mobileOpen && (
          <div
            id="mdh-crystal-mobile-menu"
            className="fixed inset-0 z-[100] lg:hidden"
          >
            {/* MOBILE OVERLAY */}

            <motion.button
              type="button"
              aria-label="Close menu"
              onClick={closeMobile}
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: reduced
                  ? 0
                  : 0.3,
              }}
              className="absolute inset-0 bg-[#151119]/15 backdrop-blur-[3px]"
            />

            {/* MOBILE PANEL */}

            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{
                x: reduced
                  ? 0
                  : "-110%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: reduced
                  ? 0
                  : "-110%",

                opacity: reduced
                  ? 0
                  : 1,
              }}
              transition={
                reduced
                  ? {
                      duration: 0,
                    }
                  : {
                      type: "spring",
                      stiffness: 260,
                      damping: 31,
                      mass: 0.9,
                    }
              }
              className="mdh-crystal-drawer absolute bottom-2 left-2 top-2 flex w-[min(330px,78vw)] flex-col overflow-hidden rounded-[18px]"
            >
              {/* MOBILE PANEL HEADER */}

              <div className="flex h-[67px] shrink-0 items-center justify-between border-b border-current/10 px-5">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.15em]">
                    Meppeplin
                  </span>

                  <span className="mt-1 block text-[9px] uppercase tracking-[0.16em] opacity-50">
                    Navigation
                  </span>
                </div>

                <button
                  ref={
                    mobileCloseRef
                  }
                  type="button"
                  onClick={() => {
                    closeMobile();

                    menuTriggerRef.current?.focus();
                  }}
                  aria-label="Close mobile menu"
                  className="mdh-crystal-control flex h-8 w-8 items-center justify-center rounded-[9px]"
                >
                  <X size={17} />
                </button>
              </div>

              {/* MOBILE NAVIGATION */}

              <nav
                aria-label="Mobile navigation"
                className="mdh-mobile-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-4 pr-3"
              >
                {navigation.map(
                  (
                    item,
                    index
                  ) => {
                    const selected =
                      active(
                        item.href
                      );

                    const isServices =
                      item.label ===
                      "Services";

                    return (
                      <motion.div
                        key={
                          item.label
                        }
                        initial={
                          reduced
                            ? false
                            : {
                                opacity: 0,
                                x: -22,
                              }
                        }
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          duration:
                            reduced
                              ? 0
                              : 0.42,

                          delay:
                            reduced
                              ? 0
                              : 0.09 +
                                index *
                                  0.055,

                          ease,
                        }}
                        className="border-b border-current/10"
                      >
                        <div className="flex items-center">
                          <Link
                            href={
                              item.href
                            }
                            onClick={
                              closeMobile
                            }
                            aria-current={
                              selected
                                ? "page"
                                : undefined
                            }
                            className={`flex min-h-[46px] flex-1 items-center gap-3 text-[12px] font-medium ${
                              selected
                                ? "text-[#70409c]"
                                : ""
                            }`}
                          >
                            <span className="w-5 text-[9px] opacity-45">
                              {String(
                                index +
                                  1
                              ).padStart(
                                2,
                                "0"
                              )}
                            </span>

                            {
                              item.label
                            }
                          </Link>

                          {isServices && (
                            <button
                              type="button"
                              onClick={() =>
                                setMobileServicesOpen(
                                  (
                                    value
                                  ) =>
                                    !value
                                )
                              }
                              aria-expanded={
                                mobileServicesOpen
                              }
                              aria-label="Toggle service categories"
                              className="mdh-crystal-control flex h-7 w-7 items-center justify-center rounded-[8px]"
                            >
                              <ChevronDown
                                size={
                                  15
                                }
                                className={`transition-transform duration-300 ${
                                  mobileServicesOpen
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </button>
                          )}
                        </div>

                        {/* MOBILE SERVICE CATEGORIES */}

                        {isServices && (
                          <AnimatePresence
                            initial={
                              false
                            }
                          >
                            {mobileServicesOpen && (
                              <motion.div
                                initial={{
                                  height: 0,
                                  opacity: 0,
                                }}
                                animate={{
                                  height:
                                    "auto",
                                  opacity: 1,
                                }}
                                exit={{
                                  height: 0,
                                  opacity: 0,
                                }}
                                transition={{
                                  duration:
                                    reduced
                                      ? 0
                                      : 0.32,

                                  ease,
                                }}
                                className="overflow-hidden"
                              >
                                <div className="mb-3 ml-8 border-l border-current/15 pl-3">
                                  {serviceCategories.map(
                                    (
                                      category
                                    ) => (
                                      <Link
                                        key={
                                          category.id
                                        }
                                        href={`/expertise#${category.id}`}
                                        onClick={
                                          closeMobile
                                        }
                                        className="block py-2 text-[10px] leading-[1.6] opacity-70 transition-all duration-300 hover:translate-x-1 hover:opacity-100"
                                      >
                                        {
                                          category.title
                                        }
                                      </Link>
                                    )
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}
                      </motion.div>
                    );
                  }
                )}
              </nav>

              {/* MOBILE FOOTER */}

              <div className="shrink-0 border-t border-current/10 px-4 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-[0.15em] opacity-50">
                    Appearance
                  </span>

                  <ThemeToggle />
                </div>

                <Link
                  href="/contact"
                  onClick={
                    closeMobile
                  }
                  className="mdh-crystal-primary group flex h-[38px] items-center justify-between rounded-[9px] px-3 text-[10px] font-semibold"
                >
                  Discuss Your
                  Project

                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}