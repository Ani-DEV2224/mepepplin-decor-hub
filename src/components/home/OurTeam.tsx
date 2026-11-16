
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

type TeamMember = {
  name: string;
  role: string;
  image: string;
  number: string;
};

const leader: TeamMember = {
  name: "Mercy Pepple",
  role: "CEO",
  image: "/images/team/team-6.png",
  number: "01",
};

const members: TeamMember[] = [
  {
    name: "Clement",
    role: "Chief Architect",
    image: "/images/team/team-02.png",
    number: "02",
  },
  {
    name: "Henry Obiora",
    role: "Chief Project Manager",
    image: "/images/team/team-04.png",
    number: "03",
  },
  {
    name: "Isaac",
    role: "Chief Lead Work/Furniture",
    image: "/images/team/team-03.png",
    number: "04",
  },
  {
    name: "Achionye Victor",
    role: "Team Lead Glass/GMP Profile Supervisor",
    image: "/images/team/team-05.png",
    number: "05",
  },
  {
    name: "Clinton",
    role: "Plumber",
    image: "/images/team/team-01.png",
    number: "06",
  },
];

const workforce = [
  "Civil engineers",
  "Architects",
  "Interior designers",
  "Project managers",
  "Skilled artisans and technicians",
];

export default function OurTeam() {
  const [selected, setSelected] = useState(0);

  const [imageErrors, setImageErrors] = useState<
    Record<string, boolean>
  >({});

  const reduced = useReducedMotion() === true;
  const active = members[selected];

  const reveal = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 35 },
        whileInView: { opacity: 1, y: 0 },
        viewport: {
          once: true,
          amount: 0.12,
        },
        transition: {
          duration: 0.85,
          ease,
        },
      };

  const change = (direction: number) => {
    setSelected(
      (current) =>
        (current + direction + members.length) %
        members.length
    );
  };

  const portrait = (
    person: TeamMember,
    className: string
  ) => (
    <div className={className}>
      {!imageErrors[person.image] ? (
        <img
          src={person.image}
          alt={`${person.name}, ${person.role}`}
          loading="lazy"
          draggable={false}
          onError={() =>
            setImageErrors((previous) => ({
              ...previous,
              [person.image]: true,
            }))
          }
        />
      ) : (
        <div className="mdh-people-image-fallback">
          <span>{person.name}</span>
          <small>Portrait unavailable</small>
        </div>
      )}
    </div>
  );

  return (
    <section
      id="our-team"
      className="mdh-people"
      aria-labelledby="mdh-people-heading"
    >
      <div className="mdh-people-shell">

        {/* SECTION INTRODUCTION */}

        <motion.div
          className="mdh-people-top"
          {...reveal}
        >
          <div className="mdh-people-eyebrow">
            <span className="mdh-people-line" />
            04 / OUR TEAM
          </div>

          <span className="mdh-people-top-right">
            THE PEOPLE BEHIND MEPPEPLIN
          </span>
        </motion.div>

        <motion.div
          className="mdh-people-heading"
          {...reveal}
        >
          <div>
            <span className="mdh-people-overline">
              A COLLECTIVE OF CREATIVE MINDS
            </span>

            <h2 id="mdh-people-heading">
              Meet the
              <br />
              <em>people.</em>
            </h2>
          </div>

          <p>
            Behind every considered space is a team
            of people who bring ideas, expertise,
            craftsmanship and attention to detail
            together.
          </p>
        </motion.div>

        {/* LEADERSHIP */}

        <motion.div
          className="mdh-people-leadership"
          {...reveal}
        >
          <div className="mdh-people-leader-copy">
            <div className="mdh-people-leader-top">
              <span>01 / LEADERSHIP</span>
              <span>MEPPEPLIN DECOR HUB</span>
            </div>

            <div className="mdh-people-leader-main">
              <span className="mdh-people-small">
                THE PERSON LEADING THE VISION
              </span>

              <h3>
                Mercy
                <br />
                <em>Pepple.</em>
              </h3>

              <div className="mdh-people-leader-role">
                <span />
                <p>Chief Executive Officer</p>
              </div>
            </div>

            <div className="mdh-people-leader-bottom">
              <span>VISION / LEADERSHIP</span>
              <span>01 — 06</span>
            </div>
          </div>

          <div className="mdh-people-leader-visual">
            <span className="mdh-people-visual-index">
              01
            </span>

            {portrait(
              leader,
              "mdh-people-leader-portrait"
            )}

            <div className="mdh-people-visual-caption">
              <span>MEPPEPLIN / LEADERSHIP</span>
              <span>CEO</span>
            </div>
          </div>
        </motion.div>

        {/* TEAM DIRECTORY */}

        <motion.div
          className="mdh-people-directory-intro"
          {...reveal}
        >
          <div>
            <span className="mdh-people-overline">
              THE PEOPLE WHO MAKE IT HAPPEN
            </span>

            <h3>
              One vision.
              <br />
              <em>Many disciplines.</em>
            </h3>
          </div>

          <p>
            Explore the people responsible for
            architecture, project coordination,
            furniture, technical works and
            on-site execution.
          </p>
        </motion.div>

        <div className="mdh-people-directory">

          {/* INTERACTIVE TEAM LIST */}

          <div className="mdh-people-list">
            {members.map((member, index) => (
              <button
                key={member.number}
                type="button"
                className={`mdh-people-list-item ${
                  selected === index
                    ? "is-active"
                    : ""
                }`}
                onClick={() => setSelected(index)}
                aria-pressed={selected === index}
              >
                <span className="mdh-people-list-number">
                  {member.number}
                </span>

                <span className="mdh-people-list-content">
                  <strong>{member.name}</strong>
                  <small>{member.role}</small>
                </span>

                <ArrowUpRight
                  size={21}
                  strokeWidth={1.4}
                />
              </button>
            ))}
          </div>

          {/* FEATURED MEMBER */}

          <div className="mdh-people-feature">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.number}
                className="mdh-people-feature-inner"
                initial={
                  reduced
                    ? { opacity: 1 }
                    : { opacity: 0, y: 22 }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -15,
                }}
                transition={{
                  duration: reduced ? 0 : 0.35,
                  ease,
                }}
              >
                <div className="mdh-people-feature-top">
                  <span>
                    THE COLLECTIVE / {active.number}
                  </span>

                  <span>
                    {selected + 1} OF {members.length}
                  </span>
                </div>

                {portrait(
                  active,
                  "mdh-people-feature-portrait"
                )}

                <div className="mdh-people-feature-info">
                  <span>MEET THE TEAM</span>
                  <h4>{active.name}</h4>
                  <p>{active.role}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mdh-people-feature-controls">
              <button
                type="button"
                onClick={() => change(-1)}
                aria-label="Previous team member"
              >
                <ArrowLeft size={20} />
              </button>

              <span>
                {String(selected + 1).padStart(2, "0")}
                {" / "}
                {String(members.length).padStart(
                  2,
                  "0"
                )}
              </span>

              <button
                type="button"
                onClick={() => change(1)}
                aria-label="Next team member"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* WORKFORCE */}

        <motion.div
          className="mdh-people-workforce"
          {...reveal}
        >
          <div className="mdh-people-workforce-intro">
            <div>
              <span className="mdh-people-overline">
                OUR PROFESSIONAL DISCIPLINES
              </span>

              <h3>
                Our
                <br />
                <em>workforce.</em>
              </h3>
            </div>

            <p>
              Our workforce includes specialists
              across the built environment, design
              and hands-on execution.
            </p>
          </div>

          <div className="mdh-people-workforce-grid">
            <div className="mdh-people-workforce-aside">
              <span>THE EXPERTISE BEHIND THE WORK</span>

              <span
                className="mdh-people-workforce-symbol"
                aria-hidden="true"
              >
                ✳
              </span>

              <span>MEPPEPLIN / PROFESSIONALS</span>
            </div>

            <ol className="mdh-people-workforce-list">
              {workforce.map((discipline, index) => (
                <li key={discipline}>
                  <span>
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <strong>{discipline}</strong>

                  <ArrowUpRight
                    size={18}
                    strokeWidth={1.3}
                    aria-hidden="true"
                  />
                </li>
              ))}
            </ol>
          </div>

          <div className="mdh-people-workforce-statement">
            <span>OUR COMMITMENT</span>

            <p>
              Each team member is committed to
              delivering excellence through
              <em> collaboration, technical expertise,</em>
              {" "}and attention to detail.
            </p>
          </div>
        </motion.div>

        {/* CLOSING */}

        <motion.div
          className="mdh-people-closing"
          {...reveal}
        >
          <div>
            <span className="mdh-people-overline">
              PEOPLE / PURPOSE / PRECISION
            </span>

            <h3>
              Great spaces begin
              <br />
              <em>with great people.</em>
            </h3>
          </div>

          <Link
            href="/contact"
            className="mdh-people-contact"
          >
            <span>WORK WITH OUR TEAM</span>

            <ArrowUpRight
              size={22}
              strokeWidth={1.3}
            />
          </Link>
        </motion.div>

        <div className="mdh-people-bottom">
          <span>MEPPEPLIN DECOR HUB / OUR TEAM</span>

          <a href="#main-content">
            BACK TO TOP
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
