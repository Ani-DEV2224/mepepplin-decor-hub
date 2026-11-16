
import {
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const contacts = [
  {
    label: "EMAIL US",
    value: "meppeplindecorhub@gmail.com",
    href: "mailto:meppeplindecorhub@gmail.com",
    Icon: Mail,
  },
  {
    label: "CALL US",
    value: "+234 806 383 8209",
    href: "tel:+2348063838209",
    Icon: Phone,
  },
  {
    label: "WHATSAPP",
    value: "Chat with our team",
    href: "https://wa.me/2348063838209",
    Icon: Phone,
  },
];

export default function ContactDetails() {
  return (
    <div className="mdh-cp-details">
      <span className="mdh-cp-eyebrow">
        DIRECT CONTACT
      </span>

      <h2>
        Let&apos;s make
        <br />
        something <em>exceptional.</em>
      </h2>

      <p className="mdh-cp-details-intro">
        Whether you&apos;re planning a new space,
        upgrading an existing property or
        exploring a specific service, reach
        out to discuss your requirements.
      </p>

      <div className="mdh-cp-contact-list">
        {contacts.map(({ label, value, href, Icon }) => (
          <a
            key={label}
            href={href}
            className="mdh-cp-contact-item"
            target={
              href.startsWith("https://")
                ? "_blank"
                : undefined
            }
            rel={
              href.startsWith("https://")
                ? "noopener noreferrer"
                : undefined
            }
          >
            <span className="mdh-cp-contact-icon">
              <Icon size={19} strokeWidth={1.4} />
            </span>

            <span className="mdh-cp-contact-copy">
              <small>{label}</small>
              <strong>{value}</strong>
            </span>

            <ArrowUpRight size={18} />
          </a>
        ))}
      </div>

      <div className="mdh-cp-address-block">
        <MapPin size={22} strokeWidth={1.3} />

        <div>
          <span>OUR STUDIO</span>

          <p>
            Uyo Street, Rumuomasi,
            <br />
            Port Harcourt, Rivers State,
            <br />
            Nigeria.
          </p>
        </div>
      </div>

      <div className="mdh-cp-response-note">
        <Clock3 size={17} strokeWidth={1.4} />

        <span>
          Send an enquiry at any time. Our team
          will follow up when available.
        </span>
      </div>
    </div>
  );
}
