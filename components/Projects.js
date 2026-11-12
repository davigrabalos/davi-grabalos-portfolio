'use client';

import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, FINE_POINTER } from '@/lib/gsap';
import { projects } from '@/lib/content';
import { rooms, pieceCount, featured } from '@/lib/showroom';
import SplitHeading from './SplitHeading';
import TransitionLink from './PageTransition';
import Fan from './Fan';
import styles from './Projects.module.css';

const pad = (n) => String(n).padStart(2, '0');

export default function Projects() {
  const root = useRef(null);
  const follow = useRef(null);
  const [fanOpen, setFanOpen] = useState(false);

  const { contextSafe } = useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const rows = q('[data-row]');
        gsap.set(rows, { y: 60, autoAlpha: 0 });
        ScrollTrigger.batch(rows, {
          start: 'top 92%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1, ease: 'expo.out' }),
        });

        // Showroom entrance opens up like a door as it scrolls in, and its prints rise into the band
        const door = q('[data-showroom]');
        gsap.fromTo(
          door,
          { clipPath: 'inset(0% 12% 0% 12% round 48px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 20px)',
            ease: 'none',
            scrollTrigger: { trigger: door, start: 'top 95%', end: 'top 45%', scrub: 1 },
          },
        );
        gsap.from(q('[data-showroom-fan]'), {
          yPercent: 35,
          ease: 'none',
          scrollTrigger: { trigger: door, start: 'top bottom', end: 'bottom 60%', scrub: 1 },
        });
      });

      // Floating preview that follows the cursor over the list
      mm.add(FINE_POINTER, () => {
        const preview = q('[data-preview]');
        gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });
        const xTo = gsap.quickTo(preview, 'x', { duration: 0.6, ease: 'power3.out' });
        const yTo = gsap.quickTo(preview, 'y', { duration: 0.6, ease: 'power3.out' });
        follow.current = (e) => {
          const box = root.current.getBoundingClientRect();
          xTo(e.clientX - box.left);
          yTo(e.clientY - box.top);
        };
        return () => {
          follow.current = null;
        };
      });
    },
    { scope: root },
  );

  const onMove = (e) => follow.current?.(e);

  // Selector strings resolve inside the section because contextSafe runs in its GSAP context.
  const showPreview = contextSafe((on) => {
    if (!window.matchMedia(FINE_POINTER).matches) return;
    gsap.to('[data-preview]', {
      scale: on ? 1 : 0,
      autoAlpha: on ? 1 : 0,
      duration: on ? 0.5 : 0.35,
      ease: on ? 'back.out(1.6)' : 'power2.in',
      overwrite: 'auto',
    });
  });

  const enterRow = contextSafe((e, i) => {
    const row = e.currentTarget;
    gsap.to('[data-track]', { yPercent: -100 * i, duration: 0.6, ease: 'expo.out', overwrite: 'auto' });
    gsap.to(row.querySelector('[data-fill]'), {
      scaleY: 1,
      transformOrigin: 'bottom center',
      duration: 0.45,
      ease: 'expo.out',
      overwrite: 'auto',
    });
    gsap.to(row.querySelector('[data-link]'), { color: '#f9f6ea', duration: 0.3, overwrite: 'auto' });
    gsap.to(row.querySelector('[data-title]'), { x: 24, duration: 0.5, ease: 'expo.out', overwrite: 'auto' });
    gsap.to(row.querySelector('[data-arrow]'), { rotation: -45, duration: 0.5, ease: 'expo.out', overwrite: 'auto' });
  });

  const hoverShowroom = contextSafe((on) => {
    setFanOpen(on);
    gsap.to('[data-showroom-arrow]', { x: on ? 12 : 0, duration: 0.5, ease: 'expo.out', overwrite: 'auto' });
    gsap.to('[data-showroom-title]', { x: on ? 16 : 0, duration: 0.6, ease: 'expo.out', overwrite: 'auto' });
  });

  const leaveRow = contextSafe((e) => {
    const row = e.currentTarget;
    gsap.to(row.querySelector('[data-fill]'), {
      scaleY: 0,
      transformOrigin: 'top center',
      duration: 0.45,
      ease: 'expo.out',
      overwrite: 'auto',
    });
    gsap.to(row.querySelector('[data-link]'), { color: '#010101', duration: 0.3, overwrite: 'auto' });
    gsap.to(row.querySelector('[data-title]'), { x: 0, duration: 0.5, ease: 'expo.out', overwrite: 'auto' });
    gsap.to(row.querySelector('[data-arrow]'), { rotation: 0, duration: 0.5, ease: 'expo.out', overwrite: 'auto' });
  });

  return (
    <section ref={root} id="work" className={styles.section} onPointerMove={onMove}>
      <header className={styles.head}>
        <p className="label">(01) Selected projects</p>
        <SplitHeading className={styles.heading}>Selected Work</SplitHeading>
      </header>

      <ul
        className={styles.list}
        onPointerEnter={() => showPreview(true)}
        onPointerLeave={() => showPreview(false)}
      >
        {projects.map((p, i) => (
          <li
            key={p.title}
            data-row
            className={styles.row}
            onPointerEnter={(e) => enterRow(e, i)}
            onPointerLeave={leaveRow}
          >
            <span data-fill className={styles.fill} aria-hidden />
            <a data-link href={p.href} className={styles.link}>
              <span className={`label ${styles.index}`}>{pad(i + 1)}</span>
              <span data-title className={styles.title}>
                {p.title}
              </span>
              <span className={styles.role}>{p.role}</span>
              <span className={`label ${styles.stack}`}>{p.stack.join(' · ')}</span>
              <span className={`label ${styles.year}`}>{p.when}</span>
              <span data-arrow className={styles.arrow} aria-hidden>
                →
              </span>
            </a>
          </li>
        ))}
      </ul>

      <TransitionLink
        href="/showroom"
        label="Showroom"
        data-showroom
        className={styles.showroom}
        onPointerEnter={() => hoverShowroom(true)}
        onPointerLeave={() => hoverShowroom(false)}
        onFocus={() => hoverShowroom(true)}
        onBlur={() => hoverShowroom(false)}
      >
        <span className={styles.showroomText}>
          <span className="label">
            Visual work · {rooms.length} rooms · {pieceCount} pieces
          </span>
          <span data-showroom-title className={styles.showroomTitle}>
            Design Showroom
          </span>
          <span className={styles.showroomLead}>
            Posters, cover art and art direction, hung in a room of their own.
          </span>
          <span className={`label ${styles.showroomCta}`}>
            Enter the showroom{' '}
            <span data-showroom-arrow className={styles.showroomArrow}>
              →
            </span>
          </span>
        </span>
        <span data-showroom-fan className={styles.showroomFan}>
          <Fan pieces={featured} spread={fanOpen} sizes="(max-width: 760px) 40vw, 18vw" />
        </span>
      </TransitionLink>

      <div data-preview className={styles.preview} aria-hidden>
        <div data-track className={styles.track}>
          {projects.map((p) => (
            <div key={p.title} className={styles.slide} style={{ background: p.color }}>
              <span>{p.short}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
