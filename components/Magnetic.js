'use client';

import { useRef } from 'react';
import { gsap, useGSAP, FINE_POINTER } from '@/lib/gsap';

// Wrapper that pulls its child toward the cursor while hovered.
export default function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const el = ref.current;
      const mm = gsap.matchMedia();

      mm.add(FINE_POINTER, () => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });

        const move = (e) => {
          const r = el.getBoundingClientRect();
          // Subtract the current offset so the pull is measured from the resting position.
          const cx = r.left + r.width / 2 - gsap.getProperty(el, 'x');
          const cy = r.top + r.height / 2 - gsap.getProperty(el, 'y');
          xTo((e.clientX - cx) * strength);
          yTo((e.clientY - cy) * strength);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };

        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        return () => {
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerleave', leave);
        };
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className="magnetic">
      {children}
    </span>
  );
}
