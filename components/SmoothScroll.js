'use client';

import { gsap, ScrollSmoother, ScrollTrigger, useGSAP, fontsReady, MOTION_OK } from '@/lib/gsap';

export default function SmoothScroll() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.1,
        effects: true, // enables data-speed / data-lag parallax attributes
      });
      return () => smoother.kill();
    });

    // Sections build their ScrollTriggers once fonts load; re-measure after all of them.
    let live = true;
    fontsReady().then(() => {
      requestAnimationFrame(() => live && ScrollTrigger.refresh());
    });
    return () => {
      live = false;
    };
  });

  return null;
}
