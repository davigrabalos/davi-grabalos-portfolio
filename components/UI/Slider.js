"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import Footer from "@/components/Layout/Footer";
import styles from "@/app/page.module.css";

export default function Slider({ projects }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const imageWrapperRef = useRef(null);
  const redOffsetRef = useRef(null);
  const blueOffsetRef = useRef(null);
  const touchStartY = useRef(null);
  const touchStartX = useRef(null);
  const lastScrollTime = useRef(0);

  // --- RGB Glitch transition (lightweight, CSS-SVG only) ---
  const triggerGlitchTransition = useCallback((direction, onMidpoint) => {
    if (isAnimating) return;
    setIsAnimating(true);

    gsap.set(imageWrapperRef.current, { filter: "url(#rgb-glitch)" });

    const mag = 35;
    const yMag = 12;
    const dx = direction === 1 ? mag : -mag;
    const dy = direction === 1 ? -yMag : yMag;

    gsap.to(redOffsetRef.current, {
      attr: { dx, dy },
      duration: 0.1,
      ease: "power4.in",
    });

    gsap.to(blueOffsetRef.current, {
      attr: { dx: -dx, dy: -dy },
      duration: 0.1,
      ease: "power4.in",
      onComplete: () => {
        onMidpoint();

        gsap.set(redOffsetRef.current, { attr: { dx: -dx, dy: -dy } });
        gsap.set(blueOffsetRef.current, { attr: { dx: dx, dy: dy } });

        gsap.to(redOffsetRef.current, {
          attr: { dx: 0, dy: 0 },
          duration: 0.15,
          ease: "power4.out",
        });
        gsap.to(blueOffsetRef.current, {
          attr: { dx: 0, dy: 0 },
          duration: 0.15,
          ease: "power4.out",
          onComplete: () => {
            gsap.set(imageWrapperRef.current, { filter: "none" });
            setIsAnimating(false);
          },
        });
      },
    });
  }, [isAnimating]);

  const navigate = useCallback((direction) => {
    const now = Date.now();
    if (now - lastScrollTime.current < 600) return;
    lastScrollTime.current = now;

    triggerGlitchTransition(direction, () => {
      setCurrentIndex((prev) => {
        if (direction === 1) return (prev + 1) % projects.length;
        return (prev - 1 + projects.length) % projects.length;
      });
    });
  }, [triggerGlitchTransition, projects.length]);

  // --- Wheel ---
  useEffect(() => {
    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > 20) {
        navigate(e.deltaY > 0 ? 1 : -1);
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [navigate]);

  // --- Touch swipe (up/down) ---
  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e) => {
      if (touchStartY.current === null) return;
      const dy = touchStartY.current - e.changedTouches[0].clientY;
      const dx = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 40) {
        navigate(dy > 0 ? 1 : -1);
      }
      touchStartY.current = null;
      touchStartX.current = null;
    };
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [navigate]);

  if (!projects || projects.length === 0) {
    return (
      <main className={styles.main}>
        <p>No projects found.</p>
      </main>
    );
  }

  const totalProjects = String(projects.length).padStart(3, "0");
  const currentProjectNum = String(currentIndex + 1).padStart(3, "0");
  const activeProject = projects[currentIndex];
  const nextProjectIndex = (currentIndex + 1) % projects.length;
  const nextProject = projects[nextProjectIndex];

  return (
    <>
      {/* SVG Filters */}
      <svg
        style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
        aria-hidden="true"
      >
        <filter id="rgb-glitch" colorInterpolationFilters="sRGB">
          <feFlood floodColor="#d10026" result="floodRed" />
          <feComposite in="floodRed" in2="SourceGraphic" operator="in" result="solidRed" />
          <feOffset ref={redOffsetRef} dx="0" dy="0" in="solidRed" result="redShift" />
          <feFlood floodColor="#0022FF" result="floodBlue" />
          <feComposite in="floodBlue" in2="SourceGraphic" operator="in" result="solidBlue" />
          <feOffset ref={blueOffsetRef} dx="0" dy="0" in="solidBlue" result="blueShift" />
          <feMerge>
            <feMergeNode in="blueShift" />
            <feMergeNode in="redShift" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </svg>

      <main className={styles.main}>
        {/* Counter */}
        <div className={styles.counter}>
          <span className={styles.total}>{totalProjects}</span>
          <span className={styles.current}>{currentProjectNum}</span>
        </div>

        {/* Project image */}
        <div className={styles.imageContainer}>
          <div
            ref={imageWrapperRef}
            style={{ width: "100%", height: "100%", position: "relative" }}
          >
            <Image
              src={activeProject.image}
              alt={activeProject.brand}
              fill
              style={{ objectFit: "contain" }}
              quality={100}
              priority
            />
          </div>
        </div>

        {/* Project title overlay — bottom left */}
        <div className={styles.projectInfo}>
          <h2 className={styles.projectBrand}>{activeProject.brand}</h2>
          <p className={styles.projectCollection}>{activeProject.collection}</p>
        </div>

        {/* Scroll hint arrows */}
        <div className={styles.navArrows}>
          <button
            className={styles.arrowBtn}
            onClick={() => navigate(-1)}
            aria-label="Previous project"
          >
            ↑
          </button>
          <button
            className={styles.arrowBtn}
            onClick={() => navigate(1)}
            aria-label="Next project"
          >
            ↓
          </button>
        </div>

        {/* Invisible preloader for next image */}
        <div style={{ display: "none" }} aria-hidden="true">
          <Image
            src={nextProject.image}
            alt="preload"
            fill
            quality={100}
            priority
          />
        </div>
      </main>

      <Footer project={activeProject} />
    </>
  );
}
