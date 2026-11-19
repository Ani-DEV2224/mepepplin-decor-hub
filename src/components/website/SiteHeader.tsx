
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import { serviceCategories } from "@/lib/site-navigation";

const mainLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Expertise", href: "/expertise" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const expertiseGroups = serviceCategories;

const totalServices = expertiseGroups.reduce(
  (total, group) => total + group.services.length,
  0
);

export default function SiteHeader() {
  const pathname = usePathname();
  const reducedMotion = Boolean(useReducedMotion());

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cinematic, setCinematic] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<
    string[]
  >([]);

  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const y = window.scrollY;
      const hero = document.querySelector(".mh-hero");

      setScrolled(y > 28);

      if (!hero || pathname !== "/") {
        setCinematic(false);
        return;
      }

      const rect = hero.getBoundingClientRect();

      setCinematic(
        hero.classList.contains("mh-hero-1") &&
          rect.bottom > 120 &&
          y < 28
      );
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();

    window.addEventListener("scroll", schedule, {
      passive: true,
    });
    window.addEventListener("resize", schedule);

    const observer = new MutationObserver(schedule);
    const hero = document.querySelector(".mh-hero");

    if (hero) {
      observer.observe(hero, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
    setExpandedGroups([]);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    firstLinkRef.current?.focus();

    const onPointer = (event: PointerEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const toggleGroup = (id: string) => {
    setExpandedGroups((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const transparent =
    cinematic && !scrolled && !menuOpen;

  return (
    <>
      <header
        className={[
          "mdh-cinematic-header",
          transparent ? "is-transparent" : "is-solid",
          scrolled ? "is-scrolled" : "",
          menuOpen ? "is-menu-open" : "",
        ].join(" ")}
      >
        <div className="mdh-header-inner">
          <div className="mdh-header-left">
            <Link
              href="/contact"
              className="mdh-header-enquiry"
            >
              <span className="mdh-header-enquiry-label">
                START A PROJECT
              </span>
              <ArrowUpRight
                size={15}
                strokeWidth={1.4}
              />
            </Link>
          </div>

          <Link
            href="/"
            className="mdh-header-brand"
            aria-label="Meppeplin Decor Hub homepage"
          >
            <span className="mdh-brand-image">
              <Image
                src="/images/brand/mepepplin-logo.png"
                alt="Meppeplin Decor Hub"
                width={158}
                height={65}
                priority
                className="mdh-brand-logo"
              />
            </span>
          </Link>

          <div className="mdh-header-right">


            <button
              ref={triggerRef}
              type="button"
              className="mdh-header-menu-trigger"
              onClick={() =>
                setMenuOpen((value) => !value)
              }
              aria-expanded={menuOpen}
              aria-controls="mdh-compact-menu"
              aria-label={
                menuOpen
                  ? "Close navigation"
                  : "Open navigation"
              }
            >
              <span>MENU</span>
              {menuOpen ? (
                <X size={20} strokeWidth={1.4} />
              ) : (
                <Menu size={20} strokeWidth={1.4} />
              )}
            </button>
          </div>
        </div>

        <div
          className="mdh-header-bottom-line"
          aria-hidden="true"
        />
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            id="mdh-compact-menu"
            className="mdh-compact-menu mdh-expertise-menu"
            initial={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -12 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -8 }
            }
            transition={{
              duration: reducedMotion ? 0.1 : 0.22,
            }}
          >
            <div className="mdh-compact-menu-inner">
              {/* MAIN NAVIGATION */}
              <div className="mdh-compact-menu-row">
                <span className="mdh-compact-menu-caption">
                  EXPLORE
                </span>

                <nav
                  className="mdh-compact-menu-links"
                  aria-label="Main navigation"
                >
                  {mainLinks.map((item, index) => (
                    <Link
                      key={item.href}
                      ref={
                        index === 0
                          ? firstLinkRef
                          : undefined
                      }
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={
                        pathname === item.href
                          ? "page"
                          : undefined
                      }
                      className={
                        pathname === item.href
                          ? "is-current"
                          : ""
                      }
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* EXPERTISE DIRECTORY */}
              <div className="mdh-expertise-menu-section">
                <div className="mdh-expertise-menu-heading">
                  <div>
                    <span className="mdh-compact-menu-caption">
                      OUR SERVICES
                    </span>

                    <h2>
                      Our <em>Expertise.</em>
                    </h2>
                  </div>

                  <p>
                    {totalServices} SERVICES
                    <span aria-hidden="true"> / </span>
                    {expertiseGroups.length} CATEGORIES
                  </p>
                </div>

                <div className="mdh-expertise-menu-grid">
                  {expertiseGroups.map(
                    (group, index) => {
                      const expanded =
                        expandedGroups.includes(group.id);

                      return (
                        <section
                          key={group.id}
                          className="mdh-expertise-menu-group"
                        >
                          <h3 className="mdh-expertise-menu-group-title">
                            <button
                              type="button"
                              className="mdh-expertise-menu-group-toggle"
                              onClick={() =>
                                toggleGroup(group.id)
                              }
                              aria-expanded={expanded}
                              aria-controls={`mdh-services-${group.id}`}
                            >
                              <span className="mdh-expertise-menu-group-number">
                                {String(index + 1).padStart(
                                  2,
                                  "0"
                                )}
                              </span>

                              <span className="mdh-expertise-menu-group-name">
                                {group.title}
                              </span>

                              <ChevronDown
                                size={17}
                                strokeWidth={1.4}
                                className={
                                  expanded
                                    ? "is-expanded"
                                    : ""
                                }
                                aria-hidden="true"
                              />
                            </button>
                          </h3>

                          <div
                            id={`mdh-services-${group.id}`}
                            className={[
                              "mdh-expertise-menu-group-content",
                              expanded
                                ? "is-expanded"
                                : "",
                            ].join(" ")}
                          >
                            <ul>
                              {group.services.map(
                                (service) => (
                                  <li key={service}>
                                    {service}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </section>
                      );
                    }
                  )}
                </div>

                <div className="mdh-expertise-menu-bottom">
                  <p>
                    A comprehensive approach to
                    property, design, construction
                    and installation.
                  </p>

                  <Link
                    href="/expertise"
                    onClick={closeMenu}
                    className="mdh-expertise-menu-view-all"
                  >
                    VIEW ALL EXPERTISE
                    <ArrowUpRight
                      size={18}
                      strokeWidth={1.5}
                    />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
