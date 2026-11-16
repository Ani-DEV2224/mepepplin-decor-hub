
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import MepepplinLoader from "./MepepplinLoader";

const SESSION_KEY = "mepepplin-prelude-seen";

export default function LoaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [initialized, setInitialized] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (initialized) return;

    if (pathname.startsWith("/admin")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInitialized(true);
      return;
    }

    let hasSeenLoader = false;

    try {
      hasSeenLoader =
        sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // Session storage may be unavailable.
    }

    if (!hasSeenLoader) {
      setShowLoader(true);
    }

    setInitialized(true);
  }, [initialized, pathname]);

  useEffect(() => {
    if (!showLoader || exiting) return;

    const timer = window.setTimeout(() => {
      setExiting(true);
    }, 3000);

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
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Continue even when session storage is unavailable.
    }

    setShowLoader(false);
    setExiting(false);
  };

  return (
    <>
      <div className="mepepplin-new-site-content">
        {children}
      </div>

      {initialized && showLoader && (
        <MepepplinLoader
          exiting={exiting}
          onComplete={finishLoader}
        />
      )}
    </>
  );
}
