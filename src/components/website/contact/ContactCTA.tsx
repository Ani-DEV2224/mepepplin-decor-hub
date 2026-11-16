
import Link from "next/link";
import {
  ArrowUpRight,
  MessageCircle,
} from "lucide-react";

export default function ContactCTA() {
  return (
    <section className="mdh-cp-cta">
      <div className="mdh-cp-container">
        <div className="mdh-cp-section-label">
          <span>04 / THE NEXT STEP</span>
          <span>LET&apos;S CREATE TOGETHER</span>
        </div>

        <span className="mdh-cp-eyebrow">
          YOUR VISION, OUR CONVERSATION
        </span>

        <h2>
          Your vision deserves
          <br />
          <em>thoughtful execution.</em>
        </h2>

        <p>
          Start with a conversation. Tell us what
          you&apos;re imagining and let&apos;s explore
          what&apos;s possible.
        </p>

        <div className="mdh-cp-cta-actions">
          <Link
            href="#send-an-enquiry"
            className="mdh-cp-cta-primary"
          >
            START A PROJECT
            <ArrowUpRight size={18} />
          </Link>

          <a
            href="https://wa.me/2348063838209"
            target="_blank"
            rel="noopener noreferrer"
            className="mdh-cp-cta-secondary"
          >
            CHAT ON WHATSAPP
            <MessageCircle size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
