
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  ExternalLink,
} from "lucide-react";

import "../../about.css";

const pdfUrl =
  "/documents/meppeplin-company-portfolio.pdf";

export const metadata: Metadata = {
  title: "Company Portfolio | Meppeplin Decor Hub",
  description:
    "View and download the official Meppeplin Decor Hub company portfolio.",
};

export default function PortfolioPage() {
  return (
    <main className="mdh-about mdh-portfolio-page">
      <div className="mdh-about-container">
        <div className="mdh-portfolio-page-top">
          <Link
            href="/about"
            className="mdh-portfolio-back"
          >
            <ArrowLeft size={17} />
            BACK TO ABOUT
          </Link>

          <span>MEPPEPLIN DECOR HUB / PORTFOLIO</span>
        </div>

        <div className="mdh-portfolio-page-heading">
          <div>
            <span className="mdh-about-eyebrow">
              OUR COMPANY PROFILE
            </span>

            <h1>
              Company <em>Portfolio.</em>
            </h1>

            <p>
              Explore our services, selected project
              photographs, company background and
              capabilities.
            </p>
          </div>

          <div className="mdh-portfolio-page-actions">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mdh-portfolio-open"
            >
              OPEN PDF
              <ExternalLink size={16} />
            </a>

            <a
              href={pdfUrl}
              download="Meppeplin-Decor-Hub-Portfolio.pdf"
              className="mdh-portfolio-download"
            >
              DOWNLOAD
              <Download size={16} />
            </a>
          </div>
        </div>

        <div className="mdh-portfolio-viewer">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=0&view=FitH`}
            title="Meppeplin Decor Hub Company Portfolio"
            loading="lazy"
          />
        </div>

        <p className="mdh-portfolio-viewer-note">
          If your browser cannot display the PDF,
          use Open PDF or Download above.
        </p>
      </div>
    </main>
  );
}
