'use client';

import { useRef } from 'react';
import { gsap, SplitText, useGSAP, fontsReady, MOTION_OK } from '@/lib/gsap';

// Heading whose letters fly in from scattered positions and settle as it scrolls into view,
// the reverse of the hero title breaking apart.
export default function SplitHeading({ as: Tag = 'h2', className = '', children }) {
  const ref = useRef(null);

  useGSAP(
    (context, contextSafe) => {
      let live = true;

      fontsReady().then(
        contextSafe(() => {
          if (!live) return;
          const split = SplitText.create(ref.current, { type: 'chars' });
          gsap.set(ref.current, { autoAlpha: 1 });

          const mm = gsap.matchMedia();
          mm.add(MOTION_OK, () => {
            gsap.from(split.chars, {
              xPercent: () => gsap.utils.random(-160, 160),
              yPercent: () => gsap.utils.random(-260, 260),
              rotation: () => gsap.utils.random(-90, 90),
              fontWeight: 100,
              opacity: 0,
              ease: 'power2.out',
              stagger: { each: 0.03, from: 'random' },
              scrollTrigger: {
                trigger: ref.current,
                start: 'top 95%',
                end: 'top 55%',
                scrub: 1,
              },
            });
          });
        }),
      );

      return () => {
        live = false;
      };
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={`split-init ${className}`}>
      {children}
    </Tag>
  );
}
