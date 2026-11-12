'use client';

import { gsap, ScrollSmoother, ScrollTrigger, useGSAP, fontsReady, scrollToTarget, MOTION_OK } from '@/lib/gsap';

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
      requestAnimationFrame(() => {
        if (!live) return;
        ScrollTrigger.refresh();
        // Arriving from another page on a hash link (e.g. /#work): jump to it once layout is final
        const { hash } = window.location;
        if (hash.length > 1 && document.querySelector(hash)) scrollToTarget(hash, false);
      });
    });
    return () => {
      live = false;
    };
  });

  return null;
}
