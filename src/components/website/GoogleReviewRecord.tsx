"use client";

import { useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";

const STORAGE_BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://casgljuedpcafffwdpgi.supabase.co"}/storage/v1/object/public/meppeplin-projects/testimonials`;
const TESTIMONIALS = [
  `${STORAGE_BASE}/testimonial-01.mp4`,
  `${STORAGE_BASE}/testimonial-02.mp4`,
  `${STORAGE_BASE}/testimonial-03.mp4`,
];

const VIDEO_SRC = "https://media.githubusercontent.com/media/Ani-DEV2224/mepepplin-decor-hub/main/public/videos/Mepepplin-review-record.mp4";

export default function GoogleReviewRecord() {
  const [open, setOpen] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState<number | null>(null);
  const [testimonialError, setTestimonialError] = useState(false);
  const testimonialRef = useRef<HTMLVideoElement>(null);
  const [playbackMessage, setPlaybackMessage] = useState("");
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
    if (player) {
      player.muted = true;
      void player.play().catch(() => setPlaybackMessage("Tap play to start this video."));
    }
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
        {TESTIMONIALS.length > 0 && (
          <section style={{marginTop:"2rem"}} aria-label="Client video testimonials">
            <span className="mdh-review-eyebrow">CLIENT STORIES / VIDEO TESTIMONIALS</span>
            <h3 style={{fontSize:"clamp(1.25rem,3vw,2rem)",margin:"0.75rem 0 1.25rem"}}>Real experiences. In their own words.</h3>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:"0.85rem"}}>
              {TESTIMONIALS.map((url,index) => (
                <button type="button" key={url} onClick={() => {setTestimonialError(false);setPlaybackMessage("");setActiveTestimonial(index);videoRef.current?.pause();}} style={{background:"#171717",color:"#fff",padding:0,border:"1px solid #777",cursor:"pointer",overflow:"hidden",textAlign:"left"}}>
                  <div style={{position:"relative",aspectRatio:"9/12",background:"#111"}}>
                    <video src={url} muted autoPlay loop playsInline preload="metadata" aria-hidden="true" style={{width:"100%",height:"100%",objectFit:"cover",pointerEvents:"none"}} onError={(event) => {event.currentTarget.style.display="none";}} />
                    <span style={{position:"absolute",inset:0,display:"grid",placeItems:"center",pointerEvents:"none"}}><Play size={34} fill="white" /></span>
                  </div>
                  <span style={{display:"block",padding:"0.85rem"}}>Client testimonial {String(index+1).padStart(2,"0")}</span>
                </button>
              ))}
            </div>
            {activeTestimonial !== null && <div style={{marginTop:"1rem"}}>
              <button type="button" onClick={() => setActiveTestimonial(null)} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><X size={18}/> Close video</button>
              <video key={activeTestimonial} ref={testimonialRef} src={TESTIMONIALS[activeTestimonial]} controls autoPlay muted playsInline preload="auto" onError={() => setTestimonialError(true)} onLoadedData={() => setTestimonialError(false)} style={{width:"100%",maxHeight:"65vh",background:"#000"}} />
              {testimonialError && <p role="alert">Video could not load. Please check the uploaded file and its public Supabase URL.</p>}
              {playbackMessage && <p role="status">{playbackMessage}</p>}
              <p style={{fontSize:12,opacity:0.75,marginTop:8}}>Video starts muted for mobile browser compatibility. Tap the speaker control to hear the testimonial.</p>
            </div>}
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
