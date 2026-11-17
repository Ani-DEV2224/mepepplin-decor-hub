"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import MepepplinLoader from "./MepepplinLoader";

export default function LoaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Render the prelude on the very first paint, rather than waiting for an effect.
  // A full page load gets the intro; client-side navigation does not replay it.
  const [showLoader, setShowLoader] = useState(() => !pathname.startsWith("/admin"));
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!showLoader || exiting) return;

    const timer = window.setTimeout(() => setExiting(true), 3000);
    return () => window.clearTimeout(timer);
  }, [showLoader, exiting]);

  useEffect(() => {
    if (!showLoader) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showLoader]);

  const finishLoader = () => {
    setShowLoader(false);
    setExiting(false);
  };

  return (
    <>
      <div className="mepepplin-new-site-content">{children}</div>
      {showLoader && (
        <MepepplinLoader exiting={exiting} onComplete={finishLoader} />
      )}
    </>
  );
}
