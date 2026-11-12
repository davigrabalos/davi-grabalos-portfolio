'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { Flip } from 'gsap/Flip';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { Observer } from 'gsap/Observer';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  ScrollSmoother,
  SplitText,
  ScrambleTextPlugin,
  Flip,
  Draggable,
  InertiaPlugin,
  Observer,
);

gsap.defaults({ ease: 'power3.out', duration: 0.8 });

// Split text only after the web fonts load, otherwise char/word sizes are measured on the fallback font.
export const fontsReady = () =>
  typeof document !== 'undefined' && document.fonts ? document.fonts.ready : Promise.resolve();

export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const FINE_POINTER = '(pointer: fine) and (prefers-reduced-motion: no-preference)';

export const SCRAMBLE_CHARS = '01<>/{}[]=+*#_';

// Scroll to an anchor, through ScrollSmoother when it is running.
export function scrollToTarget(target, smooth = true) {
  const smoother = ScrollSmoother.get();
  if (smoother) {
    smoother.scrollTo(target, smooth, 'top top');
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' });
}

export const motionOK = () => typeof window !== 'undefined' && window.matchMedia(MOTION_OK).matches;

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, Flip, Draggable, Observer, useGSAP };
