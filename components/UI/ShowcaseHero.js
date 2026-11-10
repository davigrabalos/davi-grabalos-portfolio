"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTransition } from "@/components/UI/TransitionProvider";
import Image from "next/image";
import gsap from "gsap";
import styles from "./ShowcaseHero.module.css";

export default function ShowcaseHero({ projects }) {
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragDelta = useRef(0);
  const animating = useRef(false);
  const { navigate } = useTransition();

  const total = projects.length;

  const goTo = useCallback(
    (index, instant = false) => {
      if (!trackRef.current) return;
      const items = Array.from(trackRef.current.children);
      const normalised = ((index % total) + total) % total;
      setActiveIndex(normalised);
      animating.current = true;

      items.forEach((el, i) => {
        const offset = i - normalised;
        // Wrap around: pick shortest path
        let d = offset;
        if (d > total / 2) d -= total;
        if (d < -total / 2) d += total;

        const absD = Math.abs(d);
        const isActive = d === 0;

        const x = d * 260;
        const rotY = d === 0 ? 0 : d > 0 ? -28 : 28;
        const z = isActive ? 0 : -Math.min(absD * 180, 480);
        const scale = isActive ? 1 : Math.max(0.6 - absD * 0.08, 0.3);
        const opacity = isActive ? 1 : Math.max(0.9 - absD * 0.22, 0);

        const duration = instant ? 0 : 0.65;
        gsap.to(el, {
          x,
          rotateY: rotY,
          z,
          scale,
          opacity,
          duration,
          ease: "power3.out",
          transformOrigin: "center center",
          onComplete: () => {
            if (i === normalised) animating.current = false;
          },
        });

        // Card glow on active
        const inner = el.querySelector(`.${styles.cardInner}`);
        if (inner) {
          gsap.to(inner, {
            boxShadow: isActive
              ? "0 40px 100px rgba(0,0,0,0.9), 0 0 60px rgba(240,237,232,0.04)"
              : "0 10px 30px rgba(0,0,0,0.5)",
            duration,
            ease: "power3.out",
          });
        }
      });
    },
    [total]
  );

  useEffect(() => {
    // Initial layout
    goTo(0, true);
  }, [goTo]);

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") goTo(activeIndex + 1);
      if (e.key === "ArrowLeft") goTo(activeIndex - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, goTo]);

  // Drag / swipe
  const onPointerDown = (e) => {
    setIsDragging(true);
    dragStartX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    dragDelta.current = 0;
  };
  const onPointerMove = (e) => {
    if (!isDragging) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    dragDelta.current = dragStartX.current - x;
  };
  const onPointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (Math.abs(dragDelta.current) > 60) {
      goTo(activeIndex + (dragDelta.current > 0 ? 1 : -1));
    }
  };

  const active = projects[activeIndex] ?? projects[0];

  return (
    <div className={styles.root}>
      {/* Background: blurred ghost of active image */}
      <div className={styles.bgGhost} aria-hidden="true">
        {projects.map((p, i) => (
          <div
            key={p.id}
            className={`${styles.bgGhostImg} ${i === activeIndex ? styles.bgGhostImgVisible : ""}`}
          >
            <Image src={p.image} alt="" fill style={{ objectFit: "cover" }} quality={20} unoptimized />
          </div>
        ))}
      </div>

      {/* Stage */}
      <div
        ref={containerRef}
        className={styles.stage}
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onMouseLeave={onPointerUp}
        onTouchStart={onPointerDown}
        onTouchMove={onPointerMove}
        onTouchEnd={onPointerUp}
      >
        <div
          ref={trackRef}
          className={styles.track}
          style={{ perspective: "1200px" }}
        >
          {projects.map((project, i) => (
            <div
              key={project.id}
              className={`${styles.card} ${i === activeIndex ? styles.cardActive : ""}`}
              onClick={() => {
                if (animating.current) return;
                if (i !== activeIndex) {
                  goTo(i);
                } else {
                  navigate(project.href);
                }
              }}
            >
              <div className={styles.cardInner}>
                <Image
                  src={project.image}
                  alt={project.brand}
                  fill
                  style={{ objectFit: "cover" }}
                  quality={90}
                  sizes="(max-width: 768px) 80vw, 420px"
                  priority={i === 0}
                />
                <div className={styles.cardGradient} />
                {i === activeIndex && (
                  <div className={styles.cardLabel}>
                    <span className={styles.cardIndex}>
                      {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                    </span>
                    <span className={styles.cardBrand}>{project.brand}</span>
                    <span className={styles.cardCollection}>{project.collection}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero text */}
      <div className={styles.heroText} aria-hidden="true">
        <span className={styles.heroTitle}>DAVI GRABALOS</span>
        <span className={styles.heroSub}>Art Director &amp; Web Developer</span>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button
          className={styles.arrow}
          aria-label="Previous"
          onClick={() => goTo(activeIndex - 1)}
        >
          ←
        </button>
        <div className={styles.dots}>
          {projects.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to project ${i + 1}`}
            />
          ))}
        </div>
        <button
          className={styles.arrow}
          aria-label="Next"
          onClick={() => goTo(activeIndex + 1)}
        >
          →
        </button>
      </div>

      {/* View project CTA */}
      <button
        className={styles.viewCta}
        onClick={() => active && navigate(active.href)}
        aria-label="View project"
      >
        View Project ↗
      </button>
    </div>
  );
}
