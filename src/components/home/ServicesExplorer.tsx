"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MoveUpRight } from "lucide-react";
import { serviceCategories } from "@/lib/site-navigation";

const imagery: Record<string, string> = {
  "property-maintenance": "/images/expertise/property-maintenance.jpg",
  "property-transactions": "/images/expertise/property-real-estate.jpg",
  "procurement-installation": "/images/expertise/procurement-installation.png",
  "interior-decor": "/images/expertise/interior-decor.jpg",
  "construction-finishes": "/images/expertise/construction-finishes.jpg",
  "outdoor-landscaping": "/images/expertise/outdoor-landscaping.jpg",
  "pools-water-features": "/images/expertise/pools-water-features.jpg",
};

const number = (value: number) => String(value).padStart(2, "0");

export default function ServicesExplorer() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = Boolean(useReducedMotion());
  const selected = serviceCategories[active];

  useEffect(() => {
    if (reducedMotion || paused || serviceCategories.length < 2) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((current) => (current + 1) % serviceCategories.length);
    }, 8000);
    return () => window.clearInterval(timer);
  }, [reducedMotion, paused]);

  return (
    <section id="services-explorer" className="mdh-showcase" aria-labelledby="mdh-showcase-heading">
      <div className="mdh-showcase-shell">
        <div className="mdh-showcase-topline">
          <span><i aria-hidden="true" /> 02 / WHAT WE DO</span>
          <span>MEPPEPLIN DECOR HUB — EXPERTISE</span>
        </div>

        <div className="mdh-showcase-heading">
          <div>
            <p className="mdh-showcase-kicker">DESIGNED WITH INTENTION. BUILT TO LAST.</p>
            <h2 id="mdh-showcase-heading">Spaces, <em>reimagined.</em></h2>
          </div>
          <p>From thoughtful interiors to complete property solutions, we bring every element of a space together with purpose and precision.</p>
        </div>

        <div className="mdh-showcase-layout" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
          <div className="mdh-showcase-categories" aria-label="Explore our service categories">
            <div className="mdh-showcase-category-label">OUR DISCIPLINES <span>{number(serviceCategories.length)} CATEGORIES</span></div>
            {serviceCategories.map((category, index) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={index === active}
                aria-controls="mdh-showcase-feature"
                className={`mdh-showcase-category ${index === active ? "is-selected" : ""}`}
              >
                <span className="mdh-showcase-category-number">{number(index + 1)}</span>
                <span className="mdh-showcase-category-title">{category.title}</span>
                <span className="mdh-showcase-category-arrow"><ArrowUpRight size={19} strokeWidth={1.5} /></span>
              </button>
            ))}
            <Link href="/expertise" className="mdh-showcase-all-link">VIEW ALL OUR SERVICES <ArrowUpRight size={18} /></Link>
          </div>

          <div className="mdh-showcase-feature" id="mdh-showcase-feature">
            <div className="mdh-showcase-photo">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected.id}
                  className="mdh-showcase-photo-frame"
                  initial={reducedMotion ? false : { opacity: 0, scale: 1.055 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.65 }}
                >
                  <Image
                    src={imagery[selected.id]}
                    alt={selected.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 55vw"
                    className="mdh-showcase-image"
                  />
                </motion.div>
              </AnimatePresence>
              <div className="mdh-showcase-photo-top"><span>FEATURED DISCIPLINE</span><span>{number(active + 1)} / {number(serviceCategories.length)}</span></div>
              <div className="mdh-showcase-photo-bottom"><span>MEPPEPLIN / CRAFT & SPACE</span><MoveUpRight size={22} strokeWidth={1.2} /></div>
            </div>

            <div className="mdh-showcase-detail" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected.id}
                  initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: reducedMotion ? 0 : 0.3 }}
                >
                  <div className="mdh-showcase-detail-head">
                    <span>THE DISCIPLINE / {number(active + 1)}</span>
                    <span>WHAT WE DELIVER</span>
                  </div>
                  <h3>{selected.title}</h3>
                  <p className="mdh-showcase-description">{selected.description}</p>
                  <div className="mdh-showcase-services">
                    {selected.services.map((service) => <span key={service}>{service}</span>)}
                  </div>
                  <Link className="mdh-showcase-detail-link" href={`/expertise#${selected.id}`}>
                    EXPLORE THIS DISCIPLINE <ArrowUpRight size={18} />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="mdh-showcase-footer"><span>FORM. FUNCTION. FINISH.</span><span>CONSIDERED FROM CONCEPT TO COMPLETION.</span></div>
      </div>
    </section>
  );
}
