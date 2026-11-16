
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import "./glass-bubble-cursor.css";

const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "[role='button']",
  "[data-cursor-hover]",
].join(", ");

const SETTINGS = {
  magnetStrength: 0.32,
  normalFollow: 0.16,
  magneticFollow: 0.11,

  // Elastic deformation
  stretchSensitivity: 0.012,
  maxStretch: 0.55,
  stretchSmoothing: 0.16,
  recoverySpeed: 0.09,
};

export default function GlassBubbleCursor() {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bubble = bubbleRef.current;
    const surface = surfaceRef.current;

    if (!bubble || !surface) return;

    const pointerQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );

    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    let enabled = false;
    let visible = false;
    let pressed = false;
    let activeElement: Element | null = null;

    const pointer = { x: 0, y: 0 };
    const position = { x: 0, y: 0 };
    const previousPosition = { x: 0, y: 0 };

    let stretch = 0;
    let angle = 0;

    const setX = gsap.quickSetter(bubble, "x", "px");
    const setY = gsap.quickSetter(bubble, "y", "px");

    const setScaleX = gsap.quickSetter(
      surface,
      "scaleX"
    );

    const setScaleY = gsap.quickSetter(
      surface,
      "scaleY"
    );

    const setRotation = gsap.quickSetter(
      surface,
      "rotation",
      "deg"
    );

    gsap.set(bubble, {
      xPercent: -50,
      yPercent: -50,
      scale: 0.65,
      autoAlpha: 0,
      transformOrigin: "50% 50%",
    });

    gsap.set(surface, {
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      transformOrigin: "50% 50%",
    });

    const setBubbleScale = () => {
      const targetScale = pressed
        ? 0.82
        : activeElement
          ? 1.2
          : 1;

      gsap.to(bubble, {
        scale: targetScale,
        duration: pressed ? 0.18 : 0.5,
        ease: pressed
          ? "power2.out"
          : "elastic.out(1, 0.65)",
        overwrite: "auto",
      });
    };

    const show = () => {
      if (visible) return;

      visible = true;

      gsap.to(bubble, {
        autoAlpha: 1,
        duration: 0.3,
        overwrite: "auto",
      });

      setBubbleScale();
    };

    const hide = () => {
      visible = false;
      activeElement = null;
      pressed = false;
      stretch = 0;

      bubble.classList.remove("is-interactive");

      gsap.to(bubble, {
        autoAlpha: 0,
        scale: 0.65,
        duration: 0.25,
        overwrite: "auto",
      });

      gsap.to(surface, {
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const tick = () => {
      if (!enabled || !visible) return;

      let targetX = pointer.x;
      let targetY = pointer.y;

      if (activeElement) {
        if (!activeElement.isConnected) {
          activeElement = null;
          bubble.classList.remove("is-interactive");
          setBubbleScale();
        } else {
          const rect =
            activeElement.getBoundingClientRect();

          const centerX =
            rect.left + rect.width / 2;

          const centerY =
            rect.top + rect.height / 2;

          targetX +=
            (centerX - targetX) *
            SETTINGS.magnetStrength;

          targetY +=
            (centerY - targetY) *
            SETTINGS.magnetStrength;
        }
      }

      const followStrength = activeElement
        ? SETTINGS.magneticFollow
        : SETTINGS.normalFollow;

      previousPosition.x = position.x;
      previousPosition.y = position.y;

      position.x +=
        (targetX - position.x) * followStrength;

      position.y +=
        (targetY - position.y) * followStrength;

      setX(position.x);
      setY(position.y);

      // Calculate bubble movement.
      const dx =
        position.x - previousPosition.x;

      const dy =
        position.y - previousPosition.y;

      // Normalize against GSAP's ticker delta
      // so the effect is less frame-rate dependent.
      const frameRatio = Math.max(
        0.25,
        gsap.ticker.deltaRatio(60)
      );

      const velocity =
        Math.hypot(dx, dy) / frameRatio;

      const targetStretch = Math.min(
        velocity * SETTINGS.stretchSensitivity,
        SETTINGS.maxStretch
      );

      const smoothing =
        targetStretch > stretch
          ? SETTINGS.stretchSmoothing
          : SETTINGS.recoverySpeed;

      stretch +=
        (targetStretch - stretch) * smoothing;

      if (velocity > 0.3) {
        const targetAngle =
          Math.atan2(dy, dx) * (180 / Math.PI);

        // The same ellipse looks identical when
        // rotated 180 degrees. This avoids large
        // rotational jumps when direction reverses.
        const normalizedAngle =
          ((targetAngle % 180) + 180) % 180;

        const difference =
          ((normalizedAngle - angle + 90 + 180) %
            180) -
          90;

        angle += difference * 0.18;
      }

      // Stretch horizontally along movement,
      // compress vertically to preserve
      // approximately the same area.
      const scaleX = 1 + stretch;
      const scaleY = 1 / scaleX;

      setScaleX(scaleX);
      setScaleY(scaleY);
      setRotation(angle);
    };

    const onMove = (event: PointerEvent) => {
      if (
        !enabled ||
        event.pointerType !== "mouse"
      ) {
        return;
      }

      pointer.x = event.clientX;
      pointer.y = event.clientY;

      if (!visible) {
        position.x = pointer.x;
        position.y = pointer.y;

        previousPosition.x = pointer.x;
        previousPosition.y = pointer.y;

        setX(position.x);
        setY(position.y);

        show();
      }

      const target = event.target;

      const interactive =
        target instanceof Element
          ? target.closest(INTERACTIVE_SELECTOR)
          : null;

      if (interactive !== activeElement) {
        activeElement = interactive;

        bubble.classList.toggle(
          "is-interactive",
          Boolean(interactive)
        );

        setBubbleScale();
      }
    };

    const onDown = (event: PointerEvent) => {
      if (
        !enabled ||
        event.pointerType !== "mouse"
      ) {
        return;
      }

      pressed = true;
      setBubbleScale();
    };

    const onUp = (event: PointerEvent) => {
      if (
        !enabled ||
        event.pointerType !== "mouse"
      ) {
        return;
      }

      pressed = false;
      setBubbleScale();
    };

    const onLeave = () => {
      if (enabled) hide();
    };

    const enable = () => {
      if (enabled) return;

      enabled = true;

      window.addEventListener(
        "pointermove",
        onMove,
        { passive: true }
      );

      window.addEventListener(
        "pointerdown",
        onDown,
        { passive: true }
      );

      window.addEventListener(
        "pointerup",
        onUp,
        { passive: true }
      );

      window.addEventListener("blur", onLeave);
      document.addEventListener(
        "mouseleave",
        onLeave
      );

      gsap.ticker.add(tick);
    };

    const disable = () => {
      enabled = false;
      visible = false;
      activeElement = null;
      pressed = false;
      stretch = 0;

      window.removeEventListener(
        "pointermove",
        onMove
      );

      window.removeEventListener(
        "pointerdown",
        onDown
      );

      window.removeEventListener(
        "pointerup",
        onUp
      );

      window.removeEventListener(
        "blur",
        onLeave
      );

      document.removeEventListener(
        "mouseleave",
        onLeave
      );

      gsap.ticker.remove(tick);

      gsap.killTweensOf(bubble);
      gsap.killTweensOf(surface);

      gsap.set(bubble, {
        autoAlpha: 0,
        scale: 0.65,
      });

      gsap.set(surface, {
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
      });
    };

    const updateAvailability = () => {
      if (
        pointerQuery.matches &&
        !motionQuery.matches
      ) {
        enable();
      } else {
        disable();
      }
    };

    pointerQuery.addEventListener(
      "change",
      updateAvailability
    );

    motionQuery.addEventListener(
      "change",
      updateAvailability
    );

    updateAvailability();

    return () => {
      pointerQuery.removeEventListener(
        "change",
        updateAvailability
      );

      motionQuery.removeEventListener(
        "change",
        updateAvailability
      );

      disable();
    };
  }, []);

  return (
    <div
      ref={bubbleRef}
      className="mdh-glass-cursor"
      aria-hidden="true"
    >
      <div
        ref={surfaceRef}
        className="mdh-glass-cursor-surface"
      >
        <span className="mdh-glass-cursor-highlight" />
        <span className="mdh-glass-cursor-reflection" />
        <span className="mdh-glass-cursor-bottom-light" />
      </div>
    </div>
  );
}
