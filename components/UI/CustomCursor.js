"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./CustomCursor.module.css";

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Movimentação suave com GSAP quickTo
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3" });

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

    window.addEventListener("mousemove", handleMouseMove);

    // Adiciona o efeito de expansão ao passar por links ou botões
    const interactives = document.querySelectorAll("a, button, [role='button'], .clickable");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnterInteractive);
      el.addEventListener("mouseleave", handleMouseLeaveInteractive);
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnterInteractive);
        el.removeEventListener("mouseleave", handleMouseLeaveInteractive);
      });
    };
  }, []);

  return <div ref={cursorRef} className={styles.cursor} />;
}
