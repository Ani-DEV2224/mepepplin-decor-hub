
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowUpRight,
  Pause,
  Play,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

type SelectedProjectsSceneProps = {
  active: boolean;
};

type MediaItem = {
  id: string;
  src: string;
  type: "image" | "video";
};

const media: MediaItem[] = [
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `image-${i + 1}`,
    src: `/images/home/hero-section-image-${i + 1}.jpeg`,
    type: "image" as const,
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `video-${i + 1}`,
    src: `/videos/home/hero-section-video-${i + 1}.mp4`,
    type: "video" as const,
  })),
];

const fallbackImages = [
  "/images/home/hero-section-image-1.jpeg",
  "/images/home/hero-section-image-2.jpeg",
  "/images/home/hero-section-image-3.jpeg",
  "/images/home/hero-section-image-4.jpeg",
];

const positions = [
  { x: 3, y: 15, w: 17, h: 26, r: -5 },
  { x: 23, y: 5, w: 18, h: 23, r: 4 },
  { x: 47, y: 13, w: 16, h: 30, r: -3 },
  { x: 76, y: 8, w: 18, h: 24, r: 5 },
  { x: 8, y: 57, w: 18, h: 24, r: 3 },
  { x: 31, y: 63, w: 16, h: 27, r: -5 },
  { x: 52, y: 58, w: 19, h: 25, r: 4 },
  { x: 76, y: 56, w: 17, h: 29, r: -4 },
  { x: 65, y: 32, w: 12, h: 18, r: 2 },
];

function shuffle(previous: number[]) {
  const result = [...previous];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  // Avoid repeating the exact same arrangement.
  if (result.every((value, index) => value === previous[index])) {
    result.push(result.shift()!);
  }

  return result;
}

export default function SelectedProjectsScene({
  active,
}: SelectedProjectsSceneProps) {
  const reducedMotion = Boolean(useReducedMotion());

  const [arrangement, setArrangement] = useState(
    media.map((_, index) => index)
  );
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!active || paused || reducedMotion) return;

    const interval = window.setInterval(() => {
      setArrangement((current) => shuffle(current));
    }, 2000);

    return () => window.clearInterval(interval);
  }, [active, paused, reducedMotion]);

  return (
    <div className="mh-collage-scene">
      <div className="mh-collage-background">
        <Image
          src="/images/home/hero-section-2.jpg"
          alt=""
          fill
          sizes="100vw"
          className="mh-collage-bg-image"
        />
      </div>

      <div className="mh-collage-shade" />

      <div className="mh-collage-heading">
        <span>02 / SELECTED VISUALS</span>
        <h2>
          An eye for
          <br />
          <em>the extraordinary.</em>
        </h2>
        <Link href="/projects">
          EXPLORE OUR WORK
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="mh-collage-canvas">
        {media.map((item, index) => {
          const position = positions[arrangement[index]];

          return (
            <motion.div
              key={item.id}
              className="mh-collage-tile"
              initial={false}
              animate={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                width: `${position.w}%`,
                height: `${position.h}%`,
                rotate: position.r,
              }}
              transition={{
                duration: reducedMotion ? 0 : 1.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ zIndex: index + 1 }}
            >
              {item.type === "video" ? (
                <div className="relative h-full w-full">
                  <Image
                    src={fallbackImages[index - 5]}
                    alt={`Meppeplin architectural showcase ${index + 1}`}
                    fill
                    sizes="(max-width: 700px) 45vw, 22vw"
                    className="mh-collage-media"
                  />
                  <video
                    src={item.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onError={(event) => { event.currentTarget.style.display = "none"; }}
                    onLoadedData={(event) => { event.currentTarget.style.display = ""; }}
                    className="mh-collage-media absolute inset-0 h-full w-full object-cover"
                    aria-label={`Architectural showcase video ${index + 1}`}
                  />
                </div>
              ) : (
                <Image
                  src={item.src}
                  alt={`Meppeplin visual showcase ${index + 1}`}
                  fill
                  sizes="(max-width: 700px) 45vw, 22vw"
                  className="mh-collage-media"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      <button
        type="button"
        className="mh-collage-pause"
        onClick={() => setPaused((value) => !value)}
        aria-label={
          paused ? "Resume media reshuffling" : "Pause media reshuffling"
        }
      >
        {paused ? <Play size={14} /> : <Pause size={14} />}
        <span>{paused ? "RESUME MOTION" : "PAUSE MOTION"}</span>
      </button>
    </div>
  );
}