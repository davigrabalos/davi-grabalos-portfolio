'use client';

import { useRef } from 'react';
import { gsap, useGSAP, SCRAMBLE_CHARS } from '@/lib/gsap';

// Link whose label re-decodes itself on hover.
export default function ScrambleLink({ text, children, onPointerEnter, ...rest }) {
  const label = useRef(null);
  const { contextSafe } = useGSAP();

  const scramble = contextSafe((e) => {
    onPointerEnter?.(e);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.to(label.current, {
      duration: 0.6,
      ease: 'none',
      overwrite: true,
      scrambleText: { text, chars: SCRAMBLE_CHARS, speed: 0.8 },
    });
  });

  return (
    <a {...rest} onPointerEnter={scramble}>
      <span ref={label}>{text}</span>
      {children}
    </a>
  );
}
