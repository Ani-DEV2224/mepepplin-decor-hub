
"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const VIDEO_SOURCE = "/videos/home/project-preview.mp4";

export default function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const manuallyPausedRef = useRef(false);
  const visibleRef = useRef(false);

  const reducedMotion = useReducedMotion() === true;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [videoUnavailable, setVideoUnavailable] =
    useState(false);

  const playVideo = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      await video.play();
    } catch (error) {
      console.warn("Video playback was blocked:", error);
    }
  }, []);

  // Automatically play when visible, unless manually paused.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        visibleRef.current = visible;

        const video = videoRef.current;
        if (!video) return;

        if (!visible) {
          video.pause();
        } else if (
          !manuallyPausedRef.current &&
          !reducedMotion
        ) {
          void playVideo();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [playVideo, reducedMotion]);

  // Pause playback when the browser tab is hidden.
  useEffect(() => {
    const handleVisibility = () => {
      const video = videoRef.current;
      if (!video) return;

      if (document.hidden) {
        video.pause();
      } else if (
        visibleRef.current &&
        !manuallyPausedRef.current &&
        !reducedMotion
      ) {
        void playVideo();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, [playVideo, reducedMotion]);

  // Manual play/pause always takes priority.
  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      manuallyPausedRef.current = false;
      await playVideo();
    } else {
      manuallyPausedRef.current = true;
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVideoError = () => {
    const video = videoRef.current;

    console.error("Meppeplin video error:", {
      source: VIDEO_SOURCE,
      code: video?.error?.code,
      message: video?.error?.message,
    });

    setVideoUnavailable(true);
    setVideoReady(false);
    setIsPlaying(false);
  };

  return (
    <section
      ref={sectionRef}
      id="selected-work"
      className="mdh-work-editorial"
      aria-labelledby="mdh-work-heading"
    >
      <div className="mdh-work-shell">
        {/* SECTION LABEL */}

        <motion.div
          className="mdh-work-kicker"
          initial={
            reducedMotion
              ? false
              : { opacity: 0, y: 15 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="mdh-work-kicker-left">
            <span className="mdh-work-line" />
            03 / SELECTED WORK
          </span>

          <span className="mdh-work-kicker-right">
            THE ART OF TRANSFORMATION
          </span>
        </motion.div>

        {/* INTRODUCTION */}

        <div className="mdh-work-heading-grid">
          <div>
            <span className="mdh-work-overline">
              A CLOSER LOOK AT OUR APPROACH
            </span>

            <h2
              id="mdh-work-heading"
              className="mdh-work-title"
            >
              <span className="mdh-work-title-mask">
                <motion.span
                  initial={
                    reducedMotion
                      ? false
                      : { y: "110%" }
                  }
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease }}
                >
                  Spaces that
                </motion.span>
              </span>

              <span className="mdh-work-title-mask mdh-work-title-indent">
                <motion.em
                  initial={
                    reducedMotion
                      ? false
                      : { y: "110%" }
                  }
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1.1,
                    delay: 0.12,
                    ease,
                  }}
                >
                  tell a story.
                </motion.em>
              </span>
            </h2>
          </div>

          <motion.div
            className="mdh-work-intro-aside"
            initial={
              reducedMotion
                ? false
                : { opacity: 0, y: 25 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
          >
            <span className="mdh-work-micro">
              DESIGN / DETAIL / EXPERIENCE
            </span>

            <p>
              Explore the thinking behind carefully
              considered interiors, architectural
              finishes and environments designed
              to be lived in.
            </p>

            <Link
              href="/projects"
              className="mdh-work-text-link"
            >
              EXPLORE PROJECTS
              <ArrowUpRight
                size={17}
                strokeWidth={1.4}
              />
            </Link>
          </motion.div>
        </div>

        {/* CINEMATIC FILM */}

        <motion.div
          className="mdh-work-film-frame"
          initial={
            reducedMotion
              ? false
              : {
                  opacity: 0,
                  y: 65,
                  clipPath: "inset(8% 0 0 0)",
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
            clipPath: "inset(0 0 0 0)",
          }}
          viewport={{
            once: true,
            amount: 0.1,
          }}
          transition={{ duration: 1.15, ease }}
        >
          {!videoUnavailable && (
            <video
              ref={videoRef}
              className="mdh-work-video"
              src={VIDEO_SOURCE}
              muted
              loop
              playsInline
              preload="none"
              onLoadedData={() => {
                setVideoReady(true);
              }}
              onCanPlay={() => {
                setVideoReady(true);
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onVolumeChange={(event) => {
                setIsMuted(event.currentTarget.muted);
              }}
              onError={handleVideoError}
              aria-label="Meppeplin design film"
              style={{
                pointerEvents: "none",
              }}
            />
          )}

          <div
            className="mdh-work-film-shade"
            aria-hidden="true"
            style={{
              pointerEvents: "none",
            }}
          />

          {/* TOP LABELS */}

          <div className="mdh-work-film-top">
            <span>MEPPEPLIN / VISUAL JOURNAL</span>

            <span aria-live="polite">
              {videoUnavailable
                ? "FILM UNAVAILABLE"
                : isPlaying
                  ? "NOW PLAYING"
                  : videoReady
                    ? "READY TO PLAY"
                    : "LOADING FILM"}
            </span>
          </div>

          {/* FILM CONTENT */}

          <div
            className="mdh-work-film-content"
            style={{
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            <div>
              <span className="mdh-work-film-eyebrow">
                THE STUDIO PERSPECTIVE
              </span>

              <h3>
                Every detail <em>matters.</em>
              </h3>

              <p>
                {videoUnavailable
                  ? "Our studio film will appear here once a valid video has been uploaded."
                  : "A moving perspective on spaces, materials and the details that bring them together."}
              </p>
            </div>

            {/* WORKING VIDEO CONTROLS */}

            <div
              className="mdh-work-film-actions"
              style={{
                position: "relative",
                zIndex: 30,
                pointerEvents: "auto",
              }}
            >
              <button
                type="button"
                className="mdh-work-film-button"
                onClick={togglePlayback}
                disabled={videoUnavailable}
                aria-label={
                  isPlaying
                    ? "Pause film"
                    : "Play film"
                }
                aria-pressed={isPlaying}
                title={
                  isPlaying
                    ? "Pause film"
                    : "Play film"
                }
                style={{
                  position: "relative",
                  zIndex: 31,
                  pointerEvents: "auto",
                  cursor: "pointer",
                }}
              >
                {isPlaying ? (
                  <Pause
                    size={22}
                    fill="currentColor"
                  />
                ) : (
                  <Play
                    size={22}
                    fill="currentColor"
                  />
                )}
              </button>

              <button
                type="button"
                className="mdh-work-sound-button"
                onClick={toggleMute}
                disabled={videoUnavailable}
                aria-label={
                  isMuted
                    ? "Unmute film"
                    : "Mute film"
                }
                aria-pressed={!isMuted}
                title={
                  isMuted
                    ? "Unmute film"
                    : "Mute film"
                }
                style={{
                  position: "relative",
                  zIndex: 31,
                  pointerEvents: "auto",
                  cursor: "pointer",
                }}
              >
                {isMuted ? (
                  <VolumeX size={19} />
                ) : (
                  <Volume2 size={19} />
                )}
              </button>
            </div>
          </div>

          {/* PLAYBACK INDICATOR */}

          <div
            className="mdh-work-film-progress"
            aria-hidden="true"
            style={{ pointerEvents: "none" }}
          >
            {isPlaying && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>
        </motion.div>

        {/* PROJECT ARCHIVE */}

        <div className="mdh-work-archive-grid">
          <motion.div
            className="mdh-work-archive-intro"
            initial={
              reducedMotion
                ? false
                : { opacity: 0, y: 24 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
          >
            <span className="mdh-work-micro">
              THE PROJECT ARCHIVE
            </span>

            <p>
              Real places. Real details.{" "}
              <em>Considered outcomes.</em>
            </p>
          </motion.div>

          <motion.div
            className="mdh-work-archive-card"
            initial={
              reducedMotion
                ? false
                : { opacity: 0, y: 38 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{ duration: 0.9, ease }}
          >
            <div className="mdh-work-archive-top">
              <span>01 / PROJECT COLLECTION</span>
              <span>PORTFOLIO</span>
            </div>

            <div className="mdh-work-archive-main">
              <span
                className="mdh-work-archive-mark"
                aria-hidden="true"
              >
                M.
              </span>

              <span className="mdh-work-micro">
                A COLLECTION IN PROGRESS
              </span>

              <h3>
                Good work deserves{" "}
                <em>its own story.</em>
              </h3>

              <p>
                Our completed project photography
                and details will be presented here
                as they become available. We only
                showcase verified work.
              </p>
            </div>

            <Link
              className="mdh-work-archive-link"
              href="/projects"
            >
              <span>VIEW THE PROJECT ARCHIVE</span>
              <ArrowUpRight
                size={20}
                strokeWidth={1.5}
              />
            </Link>
          </motion.div>
        </div>

        {/* NEXT SECTION */}

        <div className="mdh-work-bottom">
          <span>
            MEPPEPLIN DECOR HUB / SELECTED WORK
          </span>

          <a href="#our-team">
            04 / MEET OUR TEAM
            <ArrowDownRight
              size={17}
              strokeWidth={1.4}
            />
          </a>
        </div>
      </div>
    </section>
  );
}