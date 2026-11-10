"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { TransitionLink } from "@/components/UI/TransitionProvider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./projects.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsGrid({ entries }) {
  const gridRef = useRef(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(`.${styles.card}`);

    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
          },
          delay: (i % 3) * 0.07,
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <main className={styles.root}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>
          Selected Work &mdash; {entries.length} collections
        </p>
        <h1 className={styles.title}>
          Projects<span className={styles.titleAccent}>.</span>
        </h1>
      </header>

      <div ref={gridRef} className={styles.grid}>
        {entries.map(({ collection, season, href }, index) => {
          const count = season.projects.length;
          const cover = season.projects[0].cover;
          const num = String(index + 1).padStart(3, "0");

          return (
            <TransitionLink key={href} href={href} className={styles.card}>
              <div className={styles.cardMedia}>
                <Image
                  src={cover}
                  alt={collection.title}
                  fill
                  style={{ objectFit: "cover" }}
                  quality={85}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className={styles.cardOverlay} />
              </div>
              <div className={styles.cardBody}>
                <span className={styles.cardNum}>{num}</span>
                <div className={styles.cardText}>
                  <span className={styles.cardTitle}>{collection.title}</span>
                  <span className={styles.cardMeta}>
                    {season.title}&ensp;·&ensp;
                    {count} {count === 1 ? "piece" : "pieces"}
                  </span>
                </div>
                <span className={styles.cardArrow}>↗</span>
              </div>
            </TransitionLink>
          );
        })}
      </div>
    </main>
  );
}
