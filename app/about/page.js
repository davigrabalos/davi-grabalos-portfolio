"use client";

import { useEffect, useRef } from "react";
import { TransitionLink } from "@/components/UI/TransitionProvider";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./about.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const bgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!bgRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      gsap.to(bgRef.current, { x, y, duration: 1.2, ease: "power2.out" });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <main ref={containerRef} className={styles.container}>
      {/* Background Image com sangria para parallax limpo sem zoom nas bordas */}
      <div className={styles.bgWrapper}>
        <div ref={bgRef} className={styles.bgImageContainer}>
          <Image
            src="/images/background.jpg?v=6"
            alt="Background"
            fill
            style={{ objectFit: "cover" }}
            quality={100}
            unoptimized={true}
            priority
          />
        </div>
      </div>

      <div className={styles.content}>
        <header className={styles.hero}>
          <TransitionLink href="/" className={styles.logoLink}>
            <h1 className={styles.aboutLogoTitle}>
              <span className={styles.word}>DAVI</span> <span className={styles.word}>GRABALOS.</span>
            </h1>
          </TransitionLink>
          <p className={styles.subtitle}>
            Art Director & Web Developer crafting high-end digital experiences, visual identities, and interactive storytelling.
          </p>
        </header>

        <section className={styles.grid}>
          <div className={styles.column}>
            <h2 className={styles.heading}>Services</h2>
            <ul className={styles.list}>
              <li>Art Direction</li>
              <li>Creative Web Development</li>
              <li>Brand Identity Design</li>
              <li>Digital Editorial Design</li>
              <li>Interactive Motion & GSAP Animations</li>
            </ul>
          </div>

          <div className={styles.column}>
            <h2 className={styles.heading}>Approach</h2>
            <p className={styles.text}>
              Blending minimalist aesthetics, bold typography, and fluid interactive animations to build unforgettable web experiences that elevate brands and creative productions.
            </p>
          </div>

          <div className={styles.column}>
            <h2 className={styles.heading}>Contact & Social</h2>
            <ul className={styles.list}>
              <li>
                <a href="mailto:davigrabalos@gmail.com" className={styles.link}>
                  Email ↗
                </a>
              </li>
              <li>
                <a href="https://instagram.com/davigrabalos" target="_blank" rel="noopener noreferrer" className={styles.link}>
                  Instagram ↗
                </a>
              </li>
              <li>
                <a href="https://github.com/davigrabalos" target="_blank" rel="noopener noreferrer" className={styles.link}>
                  GitHub ↗
                </a>
              </li>
            </ul>
          </div>
        </section>

        <footer className={styles.footer}>
          <TransitionLink href="/" className={styles.backLink}>
            ← Back to Homepage
          </TransitionLink>
        </footer>
      </div>
    </main>
  );
}
