
import LandingHero from "@/components/website/hero/LandingHero";

import ArchitecturalIntroduction from "@/components/home/ArchitecturalIntroduction";
import ServicesExplorer from "@/components/home/ServicesExplorer";
import SelectedWork from "@/components/home/SelectedWork";
import OurTeam from "@/components/home/OurTeam";
import OurClients from "@/components/home/OurClients";
import OurProcess from "@/components/home/OurProcess";
import StartYourProject from "@/components/home/StartYourProject";
import SiteFooter from "@/components/layout/SiteFooter";

export default function HomePage() {
  return (
    <>
      <LandingHero />

      <ArchitecturalIntroduction />

      <ServicesExplorer />

      <SelectedWork />

      <OurTeam />
      <OurClients />
      <OurProcess />
      <StartYourProject />
      <SiteFooter />
    </>
  );
}
