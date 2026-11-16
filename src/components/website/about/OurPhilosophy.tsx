
import Reveal from "./Reveal";

const principles = [
  {
    number: "01",
    title: "Purposeful design",
    description:
      "Every choice begins with how a space should feel, function and serve its people.",
  },
  {
    number: "02",
    title: "Considered detail",
    description:
      "From materials to finishing touches, the small decisions shape the whole experience.",
  },
  {
    number: "03",
    title: "Lasting value",
    description:
      "We favour thoughtful solutions that remain useful and relevant beyond the first impression.",
  },
];

export default function OurPhilosophy() {
  return (
    <section
      className="mdh-about-section mdh-about-philosophy"
      aria-labelledby="mdh-about-philosophy-title"
    >
      <div className="mdh-about-container">
        <Reveal className="mdh-about-section-label">
          <span>02 / OUR PHILOSOPHY</span>
          <span>WHAT GUIDES US</span>
        </Reveal>

        <div className="mdh-about-philosophy-grid">
          <Reveal className="mdh-about-philosophy-heading">
            <span className="mdh-about-eyebrow">
              OUR APPROACH
            </span>

            <h2 id="mdh-about-philosophy-title">
              Designed with intention.
              <br />
              <em>Delivered with care.</em>
            </h2>

            <p>
              Good spaces are more than beautiful images.
              They are the result of purposeful decisions,
              a clear brief and respect for the details.
            </p>
          </Reveal>

          <Reveal className="mdh-about-philosophy-visual">
            <img
              src="/images/about/about-philosophy.jpg"
              alt="Architectural materials and design details representing the studio's philosophy"
              loading="lazy"
            />
          </Reveal>
        </div>

        <div className="mdh-about-principles">
          {principles.map((item) => (
            <Reveal
              className="mdh-about-principle"
              key={item.number}
            >
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
