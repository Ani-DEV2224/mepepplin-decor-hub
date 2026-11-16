
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowUp,
  MapPin,
} from "lucide-react";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://share.google/GVTnQmlihs0pe03of",
    icon: "/images/socials/instagram-icon.jpg",
  },
  {
    name: "Facebook",
    href: "https://share.google/Up54exRwkbI2PsP0S",
    icon: "/images/socials/facebook-icon.jpg",
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/2348063838209",
    icon: "/images/socials/whatsapp-icon.jpg",
  },
  {
    name: "Email",
    href: "mailto:meppeplindecorhub@gmail.com",
    icon: "/images/socials/email-icon.png",
  },
];

const navigation = [
  { label: "Home", href: "/#home" },
  { label: "Our Services", href: "/#services-explorer" },
  { label: "Selected Work", href: "/#selected-work" },
  { label: "Our Team", href: "/#our-team" },
  { label: "Our Clients", href: "/#our-clients" },
  { label: "Our Process", href: "/#our-process" },
];

const address =
  "Uyo Street, Rumuomasi, Port Harcourt 500101, Rivers State, Nigeria";

const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(address);

export default function SiteFooter() {
  const reducedMotion = useReducedMotion();

  const reveal = {
    initial: reducedMotion ? false : { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.75 },
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "instant" : "smooth",
    });
  };

  return (
    <footer className="mdh-footer" id="footer">
      <div className="mdh-footer-container">
        {/* Top label */}
        <div className="mdh-footer-topbar">
          <span className="mdh-footer-topbar-brand">
            <span className="mdh-footer-dot" />
            MEPPEPLIN DECOR HUB
          </span>

          <span>DESIGN · BUILD · TRANSFORM</span>
        </div>

        {/* Main call to action */}
        <motion.div
          className="mdh-footer-hero"
          {...reveal}
        >
          <div className="mdh-footer-hero-copy">
            <p className="mdh-footer-eyebrow">
              YOUR SPACE. OUR CRAFT.
            </p>

            <h2>
              Let&apos;s create
              <br />
              something <em>remarkable.</em>
            </h2>

            <p className="mdh-footer-description">
              From the first idea to the finishing detail,
              every meaningful space begins with a conversation.
              Tell us what you have in mind.
            </p>

            <Link
              href="/#start-your-project"
              className="mdh-footer-cta"
            >
              <span>START YOUR PROJECT</span>
              <ArrowUpRight size={21} strokeWidth={1.5} />
            </Link>
          </div>

          <div className="mdh-footer-hero-art" aria-hidden="true">
            <div className="mdh-footer-art-ring mdh-footer-art-ring-one" />
            <div className="mdh-footer-art-ring mdh-footer-art-ring-two" />
            <div className="mdh-footer-art-line" />
            <span className="mdh-footer-art-star">✳</span>
            <span className="mdh-footer-art-caption">
              FORM
              <br />
              FUNCTION
              <br />
              FEELING
            </span>
          </div>
        </motion.div>

        {/* Navigation and contact information */}
        <div className="mdh-footer-content">
          <div className="mdh-footer-about">
            <h3>MEPPEPLIN<span>.</span></h3>

            <p>
              Meppeplin Decor Hub brings together design,
              craftsmanship and technical expertise to create
              thoughtfully considered spaces.
            </p>

            <span className="mdh-footer-location-tag">
              <MapPin size={15} strokeWidth={1.5} />
              PORT HARCOURT, NIGERIA
            </span>

            <div className="mt-7">
              <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.19em] text-[#927e5e]">
                OUR STORE LOCATIONS
              </h4>
              <p className="mb-3 text-sm leading-relaxed text-[#514b43]">
                Stores at
              </p>
              <ul className="flex flex-wrap gap-x-3 gap-y-2 text-sm leading-relaxed text-[#514b43]">
                {["Lagos", "Port Harcourt", "Abia State", "Akwa Ibom", "Abuja"].map(
                  (location, index) => (
                    <li key={location} className="inline-flex items-center gap-3">
                      {index > 0 && <span className="text-[#b09a78]" aria-hidden="true">·</span>}
                      <span>{location}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          <nav className="mdh-footer-nav" aria-label="Footer navigation">
            <h4>EXPLORE</h4>

            <ul>
              {navigation.map((item) => (
                <li key={item.label}>
                  <Link href={item.href}>
                    <span>{item.label}</span>
                    <ArrowUpRight
                      size={14}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mdh-footer-contact">
            <h4>GET IN TOUCH</h4>

            <a
              className="mdh-footer-email"
              href="mailto:meppeplindecorhub@gmail.com"
            >
              meppeplindecorhub@gmail.com
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>

            <a
              className="mdh-footer-phone"
              href="https://wa.me/2348063838209"
              target="_blank"
              rel="noopener noreferrer"
            >
              +234 806 383 8209
            </a>

            <a
              className="mdh-footer-address"
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPin size={18} strokeWidth={1.5} />
              <span>
                Uyo Street, Rumuomasi,
                <br />
                Port Harcourt 500101,
                <br />
                Rivers State, Nigeria
              </span>
            </a>

            <div className="mdh-footer-socials">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="mdh-footer-social"
                  aria-label={`Visit Meppeplin on ${social.name}`}
                  title={social.name}
                  target={
                    social.name === "Email"
                      ? undefined
                      : "_blank"
                  }
                  rel={
                    social.name === "Email"
                      ? undefined
                      : "noopener noreferrer"
                  }
                >
                  <Image
                    src={social.icon}
                    alt=""
                    width={22}
                    height={22}
                    className="mdh-footer-social-image"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Oversized wordmark */}
        <div className="mdh-footer-wordmark" aria-label="Meppeplin">
          MEPPEPLIN<span>.</span>
        </div>

        {/* Bottom strip */}
        <div className="mdh-footer-bottom">
          <p>
            © {new Date().getFullYear()} MEPPEPLIN DECOR HUB.
            ALL RIGHTS RESERVED.
          </p>

          <span className="mdh-footer-bottom-middle">
            DESIGNED WITH PURPOSE.
          </span>

          <button
            type="button"
            onClick={scrollToTop}
            className="mdh-footer-backtop"
            aria-label="Back to top"
          >
            BACK TO TOP
            <span>
              <ArrowUp size={16} strokeWidth={1.6} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
