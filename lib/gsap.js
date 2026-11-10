'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText, ScrambleTextPlugin);

gsap.defaults({ ease: 'power3.out', duration: 0.8 });

// Split text only after the web fonts load, otherwise char/word sizes are measured on the fallback font.
export const fontsReady = () =>
  typeof document !== 'undefined' && document.fonts ? document.fonts.ready : Promise.resolve();

export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const FINE_POINTER = '(pointer: fine) and (prefers-reduced-motion: no-preference)';

export const SCRAMBLE_CHARS = '01<>/{}[]=+*#_';

// Smooth-scroll to an anchor, through ScrollSmoother when it is running.
export function scrollToTarget(target) {
  const smoother = ScrollSmoother.get();
  if (smoother) {
    smoother.scrollTo(target, true, 'top top');
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: 'smooth' });
}

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, useGSAP };
