'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '@/lib/gsap';
import ScrambleLink from './ScrambleLink';
import TransitionLink from './PageTransition';
import styles from './Nav.module.css';

// Absolute hrefs so the same nav works on every page: hash links scroll on the home page
// and play the page transition from anywhere else.
const links = [
  { label: 'Work', href: '/#work' },
  { label: 'Showroom', href: '/showroom' },
  { label: 'Background', href: '/#background' },
  { label: 'Contact', href: '/#contact' },
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

  return (
    <>
      <div ref={bar} className={styles.progress} aria-hidden />
      <header ref={nav} className={styles.nav}>
        <TransitionLink href="/#top" label="Portfolio" className={styles.logo} aria-label="Davi Grabalos, home">
          DG
        </TransitionLink>
        <span className={`label ${styles.status}`}>
          <span className={styles.dot} aria-hidden />
          Available
        </span>
        <nav className={styles.links}>
          {links.map((l) => (
            <ScrambleLink
              key={l.href}
              as={TransitionLink}
              href={l.href}
              label={l.label}
              text={l.label}
              className={`label ${styles.link}`}
            />
          ))}
        </nav>
      </header>
    </>
  );
}
