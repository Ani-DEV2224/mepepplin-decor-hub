"use client";

import { useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";

const VIDEO_SRC = "https://media.githubusercontent.com/media/Ani-DEV2224/mepepplin-decor-hub/main/public/videos/Mepepplin-review-record.mp4";

export default function GoogleReviewRecord() {
  const [open, setOpen] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) {
      videoRef.current?.pause();
      if (videoRef.current) videoRef.current.currentTime = 0;
      return;
    }

    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    void video.play().catch(() => {
      // Some browsers require a second user gesture to start sound.
      // The native video controls remain available.
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="mdh-review-widget">
      <div
        id="mdh-review-panel"
        className={`mdh-review-panel ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="mdh-review-panel-heading">
          <div>
            <span className="mdh-review-eyebrow">GOOGLE REVIEWS</span>
            <h2>What our clients say about us</h2>
          </div>
          <button
            type="button"
            className="mdh-review-close"
            onClick={() => setOpen(false)}
            aria-label="Close review video"
          >
            <X size={19} />
          </button>
        </div>
        <div className="mdh-review-video-wrap">
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            controls
            loop
            playsInline
            preload="none"
            onError={() => setVideoError(true)}
            onLoadedData={() => setVideoError(false)}
            aria-label="Meppeplin client reviews video"
          />
          {videoError && (
            <p className="mdh-review-video-error" role="status">
              Review video is temporarily unavailable. Please try again later.
            </p>
          )}
        </div>
        <p className="mdh-review-footnote">
          Hear directly from our clients.
        </p>
      </div>

      <button
        type="button"
        className={`mdh-review-trigger ${open ? "is-open" : ""}`}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="mdh-review-panel"
        aria-label={open ? "Close client review video" : "Watch client reviews"}
        title={open ? "Close reviews" : "Watch client reviews"}
      >
        {open ? <X size={18} /> : <Play size={16} fill="currentColor" />}
        <span>{open ? "CLOSE" : "REVIEWS"}</span>
      </button>
    </div>
  );
}
