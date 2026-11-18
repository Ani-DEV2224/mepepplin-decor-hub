"use client";

import { useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";

const TESTIMONIALS = [
  process.env.NEXT_PUBLIC_TESTIMONIAL_VIDEO_1,
  process.env.NEXT_PUBLIC_TESTIMONIAL_VIDEO_2,
  process.env.NEXT_PUBLIC_TESTIMONIAL_VIDEO_3,
].filter((url): url is string => Boolean(url));

const VIDEO_SRC = "https://media.githubusercontent.com/media/Ani-DEV2224/mepepplin-decor-hub/main/public/videos/Mepepplin-review-record.mp4";

export default function GoogleReviewRecord() {
  const [open, setOpen] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState<number | null>(null);
  const testimonialRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) setActiveTestimonial(null);
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
    if (activeTestimonial === null) return;
    const player = testimonialRef.current;
    if (player) void player.play().catch(() => {});
  }, [activeTestimonial]);

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
        <section style={{marginTop:"2rem"}} aria-label="Client video testimonials">
          <span className="mdh-review-eyebrow">CLIENT STORIES / VIDEO TESTIMONIALS</span>
          {TESTIMONIALS.length === 0 && <p role="status" style={{margin:"0.75rem 0 1.5rem",opacity:0.8}}>Our client testimonial videos are being prepared for publication.</p>}
        </section>
        {TESTIMONIALS.length > 0 && (
          <section style={{marginTop:"2rem"}} aria-label="Client video testimonials">
            <span className="mdh-review-eyebrow">CLIENT STORIES / VIDEO TESTIMONIALS</span>
            <h3 style={{fontSize:"clamp(1.25rem,3vw,2rem)",margin:"0.75rem 0 1.25rem"}}>Real experiences. In their own words.</h3>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:"0.85rem"}}>
              {TESTIMONIALS.map((url,index) => <button type="button" key={url} onClick={() => setActiveTestimonial(index)} style={{background:"#171717",color:"#fff",padding:"1.5rem 0.75rem",border:"1px solid #777",cursor:"pointer",minHeight:120}}><Play size={24} style={{margin:"0 auto 0.8rem"}}/><span>Client testimonial {String(index+1).padStart(2,"0")}</span></button>)}
            </div>
            {activeTestimonial !== null && <div style={{marginTop:"1rem"}}><button type="button" onClick={() => setActiveTestimonial(null)} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><X size={18}/> Close video</button><video key={activeTestimonial} ref={testimonialRef} src={TESTIMONIALS[activeTestimonial]} controls autoPlay playsInline preload="metadata" style={{width:"100%",maxHeight:"65vh",background:"#000"}}/></div>}
          </section>
        )}
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
