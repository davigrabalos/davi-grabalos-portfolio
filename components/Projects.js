'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, FINE_POINTER } from '@/lib/gsap';
import { projects } from '@/lib/content';
import SplitHeading from './SplitHeading';
import styles from './Projects.module.css';

const pad = (n) => String(n).padStart(2, '0');

export default function Projects() {
  const root = useRef(null);
  const preview = useRef(null);
  const track = useRef(null);
  const follow = useRef(null);

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
      });

      // Floating preview that follows the cursor over the list
      mm.add(FINE_POINTER, () => {
        gsap.set(preview.current, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });
        const xTo = gsap.quickTo(preview.current, 'x', { duration: 0.6, ease: 'power3.out' });
        const yTo = gsap.quickTo(preview.current, 'y', { duration: 0.6, ease: 'power3.out' });
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

  const showPreview = contextSafe((on) => {
    if (!follow.current) return;
    gsap.to(preview.current, {
      scale: on ? 1 : 0,
      autoAlpha: on ? 1 : 0,
      duration: on ? 0.5 : 0.35,
      ease: on ? 'back.out(1.6)' : 'power2.in',
      overwrite: 'auto',
    });
  });

  const enterRow = contextSafe((e, i) => {
    const row = e.currentTarget;
    gsap.to(track.current, { yPercent: -100 * i, duration: 0.6, ease: 'expo.out', overwrite: 'auto' });
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
              <span className={`label ${styles.year}`}>{p.year}</span>
              <span data-arrow className={styles.arrow} aria-hidden>
                →
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div ref={preview} className={styles.preview} aria-hidden>
        <div ref={track} className={styles.track}>
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
