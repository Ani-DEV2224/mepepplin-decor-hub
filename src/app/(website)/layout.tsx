
import type { ReactNode } from "react";

import SiteHeader from "@/components/website/SiteHeader";
import { StudioThemeProvider } from "@/components/website/StudioThemeProvider";
import GlassBubbleCursor from "@/components/effects/GlassBubbleCursor";

import "./website.css";
import "./hero.css";
import "./navbar.css";
import "./introduction.css";
import "./services-explorer.css";
import "./selected-work.css";
import "./our-team.css";
import "./our-clients.css";
import "./our-process.css";
import "./start-your-project.css";
import "./site-footer.css";
import "./homepage-fixes.css";

export default function WebsiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <StudioThemeProvider>
      <div className="studio-site">
        {/* Global website navigation */}
        <SiteHeader />

        {/* Main website content */}
        <main id="main-content">{children}</main>

        {/* Global GSAP crystal-glass cursor */}
        <GlassBubbleCursor />
      </div>
    </StudioThemeProvider>
  );
}
