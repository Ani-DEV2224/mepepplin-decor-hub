
"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import CinematicScene from "./CinematicScene";
import SelectedProjectsScene from "./SelectedProjectsScene";
import ServicesScene from "./ServicesScene";
import HeroControls from "./HeroControls";

const SCENE_DURATION = 7000;
const TRANSITION_SECONDS = 0.85;
const SCENE_COUNT = 3;

export default function LandingHero() {
  const reducedMotion = Boolean(useReducedMotion());

  const heroRef = useRef<HTMLElement>(null);
  const elapsedRef = useRef(0);
  const lastTickRef = useRef<number | null>(null);

  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [controlsFocused, setControlsFocused] = useState(false);

  const canPlay =
    !reducedMotion &&
    !paused &&
    !controlsFocused &&
    inView &&
    tabVisible;

  const selectScene = useCallback((index: number) => {
    setActive(
      ((index % SCENE_COUNT) + SCENE_COUNT) % SCENE_COUNT
    );

    elapsedRef.current = 0;
    lastTickRef.current = null;
    setProgress(0);
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      setTabVisible(!document.hidden);
    };

    onVisibilityChange();

    document.addEventListener(
      "visibilitychange",
      onVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        onVisibilityChange
      );
    };
  }, []);

  useEffect(() => {
    const element = heroRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!canPlay) {
      lastTickRef.current = null;
      return;
    }

    let frame = 0;

    const tick = (timestamp: number) => {
      if (lastTickRef.current === null) {
        lastTickRef.current = timestamp;
      }

      const delta = Math.min(
        timestamp - lastTickRef.current,
        100
      );

      lastTickRef.current = timestamp;
      elapsedRef.current += delta;

      if (elapsedRef.current >= SCENE_DURATION) {
        elapsedRef.current = 0;
        setProgress(0);

        setActive(
          (current) => (current + 1) % SCENE_COUNT
        );
      } else {
        setProgress(
          (elapsedRef.current / SCENE_DURATION) * 100
        );
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      lastTickRef.current = null;
    };
  }, [canPlay]);

  const next = () => selectScene(active + 1);
  const previous = () => selectScene(active - 1);

  const scenes = [
    <CinematicScene key="cinematic" active />,
    <SelectedProjectsScene key="collage" active />,
    <ServicesScene key="services" active />,
  ];

  return (
    <section
      ref={heroRef}
      className={`mh-hero mh-hero-${active + 1}`}
      id="home"
      aria-label="Meppeplin Decor Hub featured introduction"
      aria-roledescription="carousel"
    >
      <div className="mh-stage">
        <AnimatePresence initial={false}>
          <motion.div
            key={active}
            className="mh-stage-slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${active + 1} of ${SCENE_COUNT}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: reducedMotion
                ? 0
                : TRANSITION_SECONDS,
              ease: "easeInOut",
            }}
          >
            {scenes[active]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        onFocusCapture={() => setControlsFocused(true)}
        onBlurCapture={(event) => {
          if (
            !event.currentTarget.contains(
              event.relatedTarget as Node
            )
          ) {
            setControlsFocused(false);
          }
        }}
      >
        <HeroControls
          active={active}
          progress={progress}
          paused={paused}
          reducedMotion={reducedMotion}
          onSelect={selectScene}
          onPrevious={previous}
          onNext={next}
          onTogglePause={() =>
            setPaused((current) => !current)
          }
        />
      </div>
    </section>
  );
}
