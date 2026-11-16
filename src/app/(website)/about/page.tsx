
import type { Metadata } from "next";

import AboutHero from "@/components/website/about/AboutHero";
import WhoWeAre from "@/components/website/about/WhoWeAre";
import MissionVision from "@/components/website/about/MissionVision";
import OurPhilosophy from "@/components/website/about/OurPhilosophy";
import MeetOurCEO from "@/components/website/about/MeetOurCeo";
import AboutExpertise from "@/components/website/about/AboutExpertise";
import CompanyPortfolio from "@/components/website/about/CompanyPortfolio";
import AboutCTA from "@/components/website/about/AboutCTA";
import SiteFooter from "@/components/layout/SiteFooter";

import "../about.css";

export const metadata: Metadata = {
  title: "About Us | Meppeplin Decor Hub",
  description:
    "Learn about Meppeplin Decor Hub, established in 2002, our mission, vision, leadership, services and company portfolio.",
};

export default function AboutPage() {
  return (
    <div className="mdh-about">
      <AboutHero />
      <WhoWeAre />
      <MissionVision />
      <OurPhilosophy />
      <MeetOurCEO />
      <AboutExpertise />
      <CompanyPortfolio />
      <AboutCTA />
      <SiteFooter />
    </div>
  );
}
