'use client';

import { useRef } from 'react';
import { gsap, useGSAP, SCRAMBLE_CHARS } from '@/lib/gsap';

// Link whose label re-decodes itself on hover. `as` swaps the anchor for a link component (e.g. TransitionLink).
export default function ScrambleLink({ as: Tag = 'a', text, children, onPointerEnter, ...rest }) {
  const root = useRef(null);
  const { contextSafe } = useGSAP({ scope: root });

  const scramble = contextSafe((e) => {
    onPointerEnter?.(e);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.to('[data-label]', {
      duration: 0.6,
      ease: 'none',
      overwrite: true,
      scrambleText: { text, chars: SCRAMBLE_CHARS, speed: 0.8 },
    });
  });

  return (
    <Tag ref={root} {...rest} onPointerEnter={scramble}>
      <span data-label>{text}</span>
      {children}
    </Tag>
  );
}
