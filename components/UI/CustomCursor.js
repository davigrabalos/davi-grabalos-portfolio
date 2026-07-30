"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./CustomCursor.module.css";

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Movimentação ultra-suave e responsiva com GSAP quickTo
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.04, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.04, ease: "power3" });

    const handleMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handleMouseEnterInteractive = () => {
      gsap.to(cursor, { scale: 3, duration: 0.2 });
    };

    const handleMouseLeaveInteractive = () => {
      gsap.to(cursor, { scale: 1, duration: 0.2 });
    };

    const handleMouseOver = (e) => {
      if (e.target.closest("a, button, [role='button'], .clickable")) {
        gsap.to(cursor, { scale: 3, duration: 0.2 });
      }
    };

    const handleMouseOut = (e) => {
      // Quando sai de um elemento interativo, verificamos se não está entrando em outro
      const leftElement = e.target.closest("a, button, [role='button'], .clickable");
      if (leftElement) {
        const enteringElement = e.relatedTarget?.closest?.("a, button, [role='button'], .clickable");
        if (!enteringElement) {
          gsap.to(cursor, { scale: 1, duration: 0.2 });
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

  return <div ref={cursorRef} className={styles.cursor} />;
}
