
import { ArrowUpRight, Compass, Target } from "lucide-react";
import Reveal from "./Reveal";

export default function MissionVision() {
  return (
    <section
      id="mission-vision"
      className="mdh-about-section mdh-about-mission"
      aria-labelledby="mdh-mission-title"
    >
      <div className="mdh-about-container">
        <Reveal className="mdh-about-section-label">
          <span>02 / OUR DIRECTION</span>
          <span>MISSION & VISION</span>
        </Reveal>

        <Reveal className="mdh-about-mission-heading">
          <span className="mdh-about-eyebrow">
            WHAT DEFINES OUR PURPOSE
          </span>

          <h2 id="mdh-mission-title">
            Our mission.
            <br />
            <em>Our vision.</em>
          </h2>

          <p>
            The principles that guide our work and the
            ambition that shapes our future.
          </p>
        </Reveal>

        <div className="mdh-about-mission-grid">
          <Reveal className="mdh-about-mission-card">
            <div className="mdh-about-mission-card-top">
              <Target size={29} strokeWidth={1.2} />
              <span>01 / MISSION</span>
            </div>

            <div>
              <h3>Our Mission</h3>
              <p>
                To deliver exceptional construction and
                interior solutions that enhance living and
                working environments, while upholding the
                highest standards of quality, safety, and
                customer satisfaction.
              </p>
            </div>

            <ArrowUpRight
              className="mdh-about-mission-corner"
              size={22}
              strokeWidth={1.2}
              aria-hidden="true"
            />
          </Reveal>

          <Reveal
            className="mdh-about-mission-card"
            delay={0.12}
          >
            <div className="mdh-about-mission-card-top">
              <Compass size={29} strokeWidth={1.2} />
              <span>02 / VISION</span>
            </div>

            <div>
              <h3>Our Vision</h3>
              <p>
                To be Nigeria&apos;s leading provider of
                integrated construction and interior
                services, known for creativity,
                professionalism, and sustainable practices.
              </p>
            </div>

            <ArrowUpRight
              className="mdh-about-mission-corner"
              size={22}
              strokeWidth={1.2}
              aria-hidden="true"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
