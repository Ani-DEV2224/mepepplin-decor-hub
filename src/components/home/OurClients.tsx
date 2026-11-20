
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type Client = {
  name: string;
  logo: string;
};

const clients: Client[] = [
  {
    name: "Abia State Government",
    logo: "/images/clients/abia-state-government.png",
  },
  {
    name: "Shell",
    logo: "/images/clients/shell.png",
  },
  {
    name: "Rivers State Government",
    logo: "/images/clients/rivers-state-government.png",
  },
  {
    name: "Suncity Gardens Estate",
    logo: "/images/clients/suncity-gardens-estate.png",
  },
  {
    name: "Next Air and Gas",
    logo: "/images/clients/next-air-and-gas.png",
  },
  {
    name: "Bonny Local Government",
    logo: "/images/clients/bonny-local-government.png",
  },
  {
    name: "Lesukaa",
    logo: "/images/clients/lesukaa.png",
  },
  {
    name: "Golf Real Estate",
    logo: "/images/clients/golf-real-estate.png",
  },
  {
    name: "Chicken Xpress",
    logo: "/images/clients/chicken-xpress.png",
  },
  {
    name: "COZA",
    logo: "/images/clients/coza.png",
  },
  {
    name: "Loveworld",
    logo: "/images/clients/loveworld.png",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function OurClients() {
  const reducedMotion = useReducedMotion() === true;

  return (
    <section
      id="our-clients"
      className="mdh-clients"
      aria-labelledby="mdh-clients-heading"
    >
      <div className="mdh-clients-shell">
        {/* TOP LABEL */}

        <div className="mdh-clients-topline">
          <span className="mdh-clients-section-number">
            <span className="mdh-clients-line" />
            05 / OUR CLIENTS
          </span>

          <span>MEPPEPLIN DECOR HUB</span>
        </div>

        {/* EDITORIAL INTRO */}

        <div className="mdh-clients-intro">
          <motion.div
            initial={
              reducedMotion
                ? false
                : { opacity: 0, y: 35 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease }}
          >
            <span className="mdh-clients-eyebrow">
              THE PEOPLE & ORGANISATIONS WE SERVE
            </span>

            <h2 id="mdh-clients-heading">
              Relationships
              <br />
              <em>that matter.</em>
            </h2>
          </motion.div>

          <motion.div
            className="mdh-clients-intro-aside"
            initial={
              reducedMotion
                ? false
                : { opacity: 0, y: 25 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease,
            }}
          >
            <span>OUR CLIENT NETWORK</span>

            <p>
              Our work brings us into contact with
              organisations across different sectors.
              Every relationship is an opportunity
              to deliver thoughtful solutions,
              careful execution and lasting value.
            </p>

            <div className="mdh-clients-aside-bottom">
              <span>BUILT ON COLLABORATION</span>
              <ArrowDownRight
                size={20}
                strokeWidth={1.3}
              />
            </div>
          </motion.div>
        </div>

        {/* CLIENT LOGO GRID */}

        <div className="mdh-clients-grid-header">
          <span>SELECTED CLIENTS</span>
          <span>
            {String(clients.length).padStart(2, "0")}
            {" / "}ORGANISATIONS
          </span>
        </div>

        <div className="mdh-clients-grid">
          {clients.map((client, index) => (
            <motion.div
              key={client.logo}
              className="mdh-clients-cell"
              initial={
                reducedMotion
                  ? false
                  : { opacity: 0, y: 20 }
              }
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.1,
              }}
              transition={{
                duration: 0.65,
                delay: reducedMotion
                  ? 0
                  : (index % 4) * 0.07,
                ease,
              }}
            >
              <div className="mdh-clients-cell-top">
                <span>
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </span>

                <span>MEPPEPLIN / CLIENTS</span>
              </div>

              <div className="mdh-clients-logo-area">
                <img
                  src={client.logo}
                  alt={`${client.name} logo`}
                  loading="lazy"
                  draggable={false}
                />
              </div>

              <div className="mdh-clients-cell-bottom">
                <span>{client.name}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CLOSING STATEMENT */}

        <motion.div
          className="mdh-clients-closing"
          initial={
            reducedMotion
              ? false
              : { opacity: 0, y: 30 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease }}
        >
          <div className="mdh-clients-closing-symbol">
            <span aria-hidden="true">✳</span>
            <small>THE VALUE OF CONNECTION</small>
          </div>

          <div className="mdh-clients-closing-copy">
            <span>EVERY RELATIONSHIP COUNTS</span>

            <p>
              Different industries.
              <br />
              <em>One commitment to excellence.</em>
            </p>
          </div>
        </motion.div>

        <div className="mdh-clients-bottom">
          <span>
            MEPPEPLIN DECOR HUB / OUR CLIENTS
          </span>

          <a href="#main-content">
            BACK TO TOP
            <ArrowUpRight
              size={15}
              strokeWidth={1.4}
            />
          </a>
        </div>
      </div>
    </section>
  );
}
