"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./CustomCursor.module.css";

export default function CustomCursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    // Slightly lagged ring + instant dot for depth
    const ringXTo = gsap.quickTo(ring, "x", { duration: 0.25, ease: "power3" });
    const ringYTo = gsap.quickTo(ring, "y", { duration: 0.25, ease: "power3" });
    const dotXTo = gsap.quickTo(dot, "x", { duration: 0.04, ease: "power3" });
    const dotYTo = gsap.quickTo(dot, "y", { duration: 0.04, ease: "power3" });

    const handleMouseMove = (e) => {
      ringXTo(e.clientX);
      ringYTo(e.clientY);
      dotXTo(e.clientX);
      dotYTo(e.clientY);
    };

    const handleMouseOver = (e) => {
      if (e.target.closest("a, button, [role='button'], .clickable")) {
        gsap.to(ring, { scale: 2.2, opacity: 0.9, duration: 0.25 });
        gsap.to(dot, { scale: 0, duration: 0.2 });
      }
    };

    const handleMouseOut = (e) => {
      const leftEl = e.target.closest("a, button, [role='button'], .clickable");
      if (leftEl) {
        const entering = e.relatedTarget?.closest?.("a, button, [role='button'], .clickable");
        if (!entering) {
          gsap.to(ring, { scale: 1, opacity: 0.6, duration: 0.25 });
          gsap.to(dot, { scale: 1, duration: 0.2 });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <>
      {/* Glow ring — follows with lag */}
      <div ref={ringRef} className={styles.ring} />
      {/* Sharp center dot — follows instantly */}
      <div ref={dotRef} className={styles.dot} />
    </>
  );
}
