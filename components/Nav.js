'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, scrollToTarget, MOTION_OK } from '@/lib/gsap';
import ScrambleLink from './ScrambleLink';
import styles from './Nav.module.css';

const links = [
  { label: 'Work', href: '#work' },
  { label: 'Background', href: '#background' },
  { label: 'Contact', href: '#contact' },
];

export default function Nav() {
  const nav = useRef(null);
  const bar = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(nav.current, { yPercent: -100, autoAlpha: 0, duration: 1, delay: 1.2 });

      // Hide while scrolling down, reveal on scroll up.
      ScrollTrigger.create({
        start: 'top -120',
        end: 'max',
        onUpdate: (self) =>
          gsap.to(nav.current, {
            yPercent: self.direction === 1 ? -110 : 0,
            duration: 0.45,
            overwrite: 'auto',
          }),
      });

      gsap.to(bar.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
      });
    });

    // Availability dot pulse
    gsap.to(`.${styles.dot}`, {
      scale: 1.8,
      opacity: 0.25,
      duration: 0.9,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  });

  const go = (e, href) => {
    e.preventDefault();
    scrollToTarget(href);
  };

  return (
    <>
      <div ref={bar} className={styles.progress} aria-hidden />
      <header ref={nav} className={styles.nav}>
        <a href="#top" className={styles.logo} onClick={(e) => go(e, '#top')} aria-label="Back to top">
          DG
        </a>
        <span className={`label ${styles.status}`}>
          <span className={styles.dot} aria-hidden />
          Available
        </span>
        <nav className={styles.links}>
          {links.map((l) => (
            <ScrambleLink
              key={l.href}
              href={l.href}
              text={l.label}
              className={`label ${styles.link}`}
              onClick={(e) => go(e, l.href)}
            />
          ))}
        </nav>
      </header>
    </>
  );
}
