
import Image from "next/image";
import Reveal from "./Reveal";

export default function WhoWeAre() {
  return (
    <section
      id="who-we-are"
      className="mdh-about-section mdh-about-who"
      aria-labelledby="mdh-about-who-title"
    >
      <div
        className="mdh-about-who-watermark"
        aria-hidden="true"
      >
        <Image
          src="/images/brand/mepepplin-logo.png"
          alt=""
          fill
          sizes="(max-width: 700px) 100vw, 70vw"
          className="mdh-about-watermark-image"
        />
      </div>

      <div className="mdh-about-container mdh-about-who-inner">
        <Reveal className="mdh-about-section-label">
          <span>01 / WHO WE ARE</span>
          <span>ESTABLISHED 2002</span>
        </Reveal>

        <Reveal className="mdh-about-who-copy">
          <span className="mdh-about-eyebrow">
            MEPPEPLIN DECOR HUB
          </span>

          <h2 id="mdh-about-who-title">
            Rooted in experience.
            <br />
            <em>Driven by excellence.</em>
          </h2>

          <p className="mdh-about-lead">
            Founded in 2002, Meppeplin Decor Hub is a
            proudly indigenous Nigerian enterprise
            specialising in comprehensive construction,
            interior design and home improvement services.
          </p>

          <p>
            With over two decades of experience, we have
            successfully executed projects across Nigeria,
            including Rivers State, Abia, Enugu, Lagos,
            Delta and beyond.
          </p>

          <p>
            Our team of seasoned experts brings innovation,
            craftsmanship and reliability to every project,
            delivering solutions for residential,
            commercial and government clients.
          </p>
        </Reveal>

        <div className="mdh-about-who-footer">
          <span>EST. 2002 / NIGERIA</span>
          <span>DESIGN / CONSTRUCTION / IMPROVEMENT</span>
        </div>
      </div>
    </section>
  );
}
