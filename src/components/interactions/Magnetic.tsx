"use client";

import {
  cloneElement,
  isValidElement,
  useRef,
  type MouseEvent,
  type ReactElement,
} from "react";

import { gsap } from "@/lib/gsap";

type MagneticProps = {
  children: ReactElement<{
    ref?: React.Ref<HTMLElement>;
    onMouseMove?: (event: MouseEvent<HTMLElement>) => void;
    onMouseLeave?: (event: MouseEvent<HTMLElement>) => void;
  }>;
  strength?: number;
  innerStrength?: number;
};

export default function Magnetic({
  children,
  strength = 0.22,
  innerStrength = 0.08,
}: MagneticProps) {
  const elementRef = useRef<HTMLElement | null>(null);

  if (!isValidElement(children)) return children;

  const handleMove = (event: MouseEvent<HTMLElement>) => {
    const element = elementRef.current;
    if (!element) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const rect = element.getBoundingClientRect();

    const x =
      event.clientX -
      rect.left -
      rect.width / 2;

    const y =
      event.clientY -
      rect.top -
      rect.height / 2;

    gsap.to(element, {
      x: x * strength,
      y: y * strength,
      duration: 0.55,
      ease: "power3.out",
      overwrite: "auto",
    });

    const inner = element.querySelector<HTMLElement>(
      "[data-magnetic-inner]"
    );

    if (inner) {
      gsap.to(inner, {
        x: x * innerStrength,
        y: y * innerStrength,
        duration: 0.55,
        ease: "power3.out",
        overwrite: "auto",
      });
    }

    children.props.onMouseMove?.(event);
  };

  const handleLeave = (event: MouseEvent<HTMLElement>) => {
    const element = elementRef.current;
    if (!element) return;

    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.4)",
      overwrite: "auto",
    });

    const inner = element.querySelector<HTMLElement>(
      "[data-magnetic-inner]"
    );

    if (inner) {
      gsap.to(inner, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.4)",
        overwrite: "auto",
      });
    }

    children.props.onMouseLeave?.(event);
  };

  // eslint-disable-next-line react-hooks/refs
  return cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      elementRef.current = node;
    },
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
  });
}