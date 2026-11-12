'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap, useGSAP, motionOK } from '@/lib/gsap';
import styles from './Fan.module.css';

// A small stack of pieces, fanned like prints in a hand. `spread` opens the fan (driven by the parent's hover).
export default function Fan({ pieces, spread = false, sizes = '20vw', className = '' }) {
  const root = useRef(null);
  const ready = useRef(false);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray('[data-fan-card]', root.current);
      const mid = (cards.length - 1) / 2;
      cards.forEach((card, i) => {
        const o = i - mid;
        const vars = spread
          ? { xPercent: o * 38, yPercent: -6 + Math.abs(o) * 6, rotation: o * 11, scale: 1.04 }
          : { xPercent: o * 18, yPercent: Math.abs(o) * 3, rotation: o * 5, scale: 1 };
        if (!ready.current || !motionOK()) gsap.set(card, vars);
        else gsap.to(card, { ...vars, duration: 0.8, ease: 'expo.out', overwrite: 'auto', delay: Math.abs(o) * 0.04 });
      });
      ready.current = true;
    },
    { scope: root, dependencies: [spread] },
  );

  return (
    <div ref={root} data-fan className={`${styles.fan} ${className}`} aria-hidden>
      {pieces.map((p) => (
        <div key={p.src} data-fan-card className={styles.card} style={{
            aspectRatio: `${p.w} / ${p.h}`,
            // Landscape pieces (slides, tickets) get a wider card so they read at the same visual weight
            width: p.w > p.h * 1.2 ? 'var(--fan-card-wide, 72%)' : undefined,
          }}>
          <Image src={p.src} alt="" fill sizes={sizes} style={{ objectFit: 'cover' }} />
        </div>
      ))}
    </div>
  );
}
