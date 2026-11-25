
import Reveal from "./Reveal";

export default function MeetOurCEO() {
  return (
    <section
      className="mdh-about-section mdh-about-ceo"
      aria-labelledby="mdh-about-ceo-title"
    >
      <div className="mdh-about-container">
        <Reveal className="mdh-about-section-label">
          <span>03 / LEADERSHIP</span>
          <span>THE PERSON BEHIND THE VISION</span>
        </Reveal>

        <div className="mdh-about-ceo-grid">
          <Reveal className="mdh-about-ceo-portrait">
            <img
              src="/images/about/about-ceo-mercy-pepple.png"
              alt="Mercy Pepple, Chief Executive Officer of Meppeplin Decor Hub"
              loading="lazy"
            />

            <span className="mdh-about-ceo-photo-label">
              MERCY PEPPLE / CEO
            </span>
          </Reveal>

          <Reveal
            className="mdh-about-ceo-copy"
            delay={0.1}
          >
            <span className="mdh-about-eyebrow">
              MEET OUR CEO
            </span>

            <h2 id="mdh-about-ceo-title">
              Mercy
              <br />
              <em>Pepple.</em>
            </h2>

            <span className="mdh-about-ceo-role">
              CHIEF EXECUTIVE OFFICER
            </span>

            <div className="mdh-about-ceo-rule" />

            <p className="mdh-about-lead">
              The leadership behind Meppeplin Decor Hub.
            </p>

            <p>
              As Chief Executive Officer, Mercy Pepple
              represents the studio&apos;s leadership and
              direction. This space is reserved for her
              verified professional background, the story
              behind the company and her vision for its
              future.
            </p>

            <div className="mdh-about-ceo-quote">
              <span>IN HER OWN WORDS</span>

              <p>
                MepepplinDecorHub&apos;s portfolio ranges from mixed-use to residential, retail, hospitality, commercial, industrial and private developments. Our design practice presents a refined and custom approach to design and development. We create interiors that impress, inspire and excite. We combine Timeless built design details with hand-finished artisan elements, all styled and matched with custom pieces of furniture locally made and imported, fabrics, artworks, accessories and lighting. Our bespoke designs brew inspiration into spaces made for connection and comfort. At MepepplinDecorHub, it&apos;s not just design we do... we create spaces that reflect your personality!
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
