
import type { Metadata } from "next";

import ContactHero from "@/components/website/contact/ContactHero";
import ContactDetails from "@/components/website/contact/ContactDetails";
import ContactEnquiryForm from "@/components/website/contact/ContactEnquiryForm";
import ContactLocation from "@/components/website/contact/ContactLocation";
import ContactFAQ from "@/components/website/contact/ContactFAQ";
import ContactCTA from "@/components/website/contact/ContactCTA";
import SiteFooter from "@/components/layout/SiteFooter";

import "../contact.css";

export const metadata: Metadata = {
  title: "Contact Us | Meppeplin Decor Hub",
  description:
    "Contact Meppeplin Decor Hub for construction, interior design, home improvement and project enquiries in Nigeria.",
};

export default function ContactPage() {
  return (
    <div className="mdh-contact-page">
      <ContactHero />

      <section
        className="mdh-cp-section mdh-cp-enquiry-section"
        id="send-an-enquiry"
      >
        <div className="mdh-cp-container">
          <div className="mdh-cp-section-label">
            <span>01 / GET IN TOUCH</span>
            <span>LET&apos;S TALK ABOUT YOUR PROJECT</span>
          </div>

          <div className="mdh-cp-enquiry-grid">
            <ContactDetails />
            <ContactEnquiryForm />
          </div>
        </div>
      </section>

      <ContactLocation />
      <ContactFAQ />
      <ContactCTA />
      <SiteFooter />
    </div>
  );
}
