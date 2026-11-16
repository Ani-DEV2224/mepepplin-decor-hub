
import type { ReactNode } from "react";

import "./admin.css";
import "./admin-upgrade.css";
import "./intelligence.css";
import "./enquiries.css";
import "./atelier.css";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mdh-admin-root">
      {children}
    </div>
  );
}