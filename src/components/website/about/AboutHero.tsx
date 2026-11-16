
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";

export default function AboutHero() {
  return (
    <section
      className="mdh-about-hero"
      aria-labelledby="mdh-about-title"
    >
      <div
        className="mdh-about-hero-image"
        aria-hidden="true"
      />
      <div
        className="mdh-about-hero-shade"
        aria-hidden="true"
      />

      <div className="mdh-about-hero-content mdh-about-container">
        <div className="mdh-about-hero-top">
          <span>MEPPEPLIN DECOR HUB</span>
          <span>ABOUT THE STUDIO / 001</span>
        </div>

        <div className="mdh-about-hero-main">
          <span className="mdh-about-eyebrow mdh-about-hero-eyebrow">
            THE STUDIO & THE VISION
          </span>

          <h1 id="mdh-about-title">
            Beyond spaces.
            <br />
            <em>Into experiences.</em>
          </h1>

          <p>
            A closer look at the thinking, craft and
            leadership behind Meppeplin Decor Hub.
          </p>
        </div>

        <div className="mdh-about-hero-bottom">
          <span>PORT HARCOURT · NIGERIA</span>

          <Link
            href="#who-we-are"
            aria-label="Explore the About page"
          >
            EXPLORE OUR STORY
            <ArrowDownRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
