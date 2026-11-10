"use client";

import { useEffect, useRef } from "react";
import { TransitionLink } from "@/components/UI/TransitionProvider";
import Image from "next/image";
import gsap from "gsap";
import styles from "./about.module.css";

const SERVICES = [
  "Art Direction",
  "Creative Web Development",
  "Brand Identity Design",
  "Digital Editorial Design",
  "Interactive Motion & GSAP",
];

const LINKS = [
  { label: "Email", href: "mailto:davigrabalos@gmail.com" },
  { label: "Instagram", href: "https://instagram.com/davigrabalos", external: true },
  { label: "GitHub", href: "https://github.com/davigrabalos", external: true },
];

export default function AboutPage() {
  const bgRef = useRef(null);
  const contentRef = useRef(null);

  // Parallax bg
  useEffect(() => {
    const move = (e) => {
      if (!bgRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 36;
      const y = (e.clientY / window.innerHeight - 0.5) * 36;
      gsap.to(bgRef.current, { x, y, duration: 1.5, ease: "power2.out" });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Stagger-in on mount
  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(
      contentRef.current.querySelectorAll(`.${styles.animIn}`),
      { y: 32, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.9, ease: "power3.out", delay: 0.15 }
    );
  }, []);

  return (
    <main className={styles.root}>
      {/* Background portrait */}
      <div className={styles.bgWrap}>
        <div ref={bgRef} className={styles.bgInner}>
          <Image
            src="/images/background.jpg?v=6"
            alt=""
            fill
            style={{ objectFit: "cover" }}
            quality={90}
            unoptimized
            priority
          />
        </div>
        <div className={styles.bgVeil} />
      </div>

      {/* Content */}
      <div ref={contentRef} className={styles.content}>
        {/* Name heading */}
        <div className={`${styles.nameBlock} ${styles.animIn}`}>
          <TransitionLink href="/" className={styles.nameLink}>
            <h1 className={styles.name}>
              Davi<br />
              <em>Grabalos.</em>
            </h1>
          </TransitionLink>
        </div>

        {/* Bio */}
        <p className={`${styles.bio} ${styles.animIn}`}>
          Art Director &amp; Web Developer crafting high-end digital experiences,
          visual identities, and interactive storytelling.
        </p>

        {/* Grid */}
        <div className={styles.grid}>
          {/* Services */}
          <section className={`${styles.col} ${styles.animIn}`}>
            <h2 className={styles.colLabel}>Services</h2>
            <ul className={styles.list}>
              {SERVICES.map((s) => (
                <li key={s} className={styles.listItem}>
                  <span className={styles.listBullet}>—</span>
                  {s}
                </li>
              ))}
            </ul>
          </section>

          {/* Approach */}
          <section className={`${styles.col} ${styles.animIn}`}>
            <h2 className={styles.colLabel}>Approach</h2>
            <p className={styles.colText}>
              Blending minimalist aesthetics, bold typography, and fluid
              interactive animations to build unforgettable web experiences
              that elevate brands and creative productions.
            </p>
          </section>

          {/* Contact */}
          <section className={`${styles.col} ${styles.animIn}`}>
            <h2 className={styles.colLabel}>Contact &amp; Social</h2>
            <ul className={styles.list}>
              {LINKS.map(({ label, href, external }) => (
                <li key={label} className={styles.listItem}>
                  <a
                    href={href}
                    className={styles.contactLink}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Back */}
        <div className={`${styles.footer} ${styles.animIn}`}>
          <TransitionLink href="/" className={styles.backLink}>
            ← Back to work
          </TransitionLink>
          <span className={styles.copyright}>© {new Date().getFullYear()} Davi Grabalos</span>
        </div>
      </div>
    </main>
  );
}
