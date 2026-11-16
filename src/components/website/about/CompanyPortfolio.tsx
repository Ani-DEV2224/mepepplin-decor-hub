
import Link from "next/link";
import {
  ArrowUpRight,
  Download,
  FileText,
} from "lucide-react";
import Reveal from "./Reveal";

const portfolioUrl =
  "/documents/meppeplin-company-portfolio.pdf";

export default function CompanyPortfolio() {
  return (
    <section
      id="company-portfolio"
      className="mdh-about-section mdh-about-portfolio"
      aria-labelledby="mdh-portfolio-title"
    >
      <div className="mdh-about-container">
        <Reveal className="mdh-about-section-label">
          <span>06 / COMPANY PORTFOLIO</span>
          <span>EXPLORE OUR WORK</span>
        </Reveal>

        <div className="mdh-about-portfolio-grid">
          <Reveal className="mdh-about-portfolio-copy">
            <span className="mdh-about-eyebrow">
              THE MEPPEPLIN PORTFOLIO
            </span>

            <h2 id="mdh-portfolio-title">
              Explore the work.
              <br />
              <em>Discover the detail.</em>
            </h2>

            <p>
              Explore our company portfolio, featuring
              our capabilities, services, project
              photographs, geographical footprint
              and client relationships.
            </p>

            <div className="mdh-about-portfolio-actions">
              <Link
                href="/about/portfolio"
                className="mdh-about-portfolio-primary"
              >
                VIEW PORTFOLIO
                <ArrowUpRight size={17} />
              </Link>

              <a
                href={portfolioUrl}
                download="Meppeplin-Decor-Hub-Portfolio.pdf"
                className="mdh-about-portfolio-secondary"
              >
                DOWNLOAD PDF
                <Download size={17} />
              </a>
            </div>

            <span className="mdh-about-portfolio-meta">
              COMPANY PROFILE / 31 PAGES / PDF
            </span>
          </Reveal>

          <Reveal className="mdh-about-portfolio-preview">
            <div className="mdh-about-portfolio-preview-top">
              <span>M&PCO. MEPEPPLIN</span>
              <FileText size={21} strokeWidth={1.2} />
            </div>

            <div className="mdh-about-portfolio-document">
              <div className="mdh-about-portfolio-document-brand">
                <span>M&PCO.</span>
                <strong>MEPEPPLIN</strong>
                <small>DECOR HUB</small>
              </div>

              <div className="mdh-about-portfolio-document-bottom">
                <span>COMPANY PORTFOLIO</span>
                <span>2002 — PRESENT</span>
              </div>
            </div>

            <div className="mdh-about-portfolio-preview-bottom">
              <span>COMPANY PROFILE</span>
              <span>31 PAGES</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
