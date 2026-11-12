'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { gsap, useGSAP, scrollToTarget, motionOK, SCRAMBLE_CHARS } from '@/lib/gsap';
import styles from './PageTransition.module.css';

const CURTAIN_ID = 'page-curtain';

// Ink curtain that covers the screen between pages. Lives in the root layout, so it survives navigation:
// a TransitionLink raises it, and the route change lowers it once the new page has rendered.
export function Curtain() {
  const root = useRef(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const el = root.current;
      if (el.dataset.covered !== '1') {
        gsap.set(el, { yPercent: 100 });
        return;
      }
      delete el.dataset.covered;
      gsap.to(el, {
        yPercent: -100,
        duration: 0.9,
        delay: 0.15,
        ease: 'expo.inOut',
        onComplete: () => gsap.set(el, { yPercent: 100, visibility: 'hidden' }),
      });
    },
    { dependencies: [pathname] },
  );

  return (
    <div ref={root} id={CURTAIN_ID} className={styles.curtain} aria-hidden>
      <span data-curtain-label className={styles.label} />
    </div>
  );
}

function coverAndGo(router, href, label) {
  const el = document.getElementById(CURTAIN_ID);
  const options = { scroll: !href.includes('#') };
  if (!el || !motionOK()) {
    router.push(href, options);
    return;
  }
  el.dataset.covered = '1';
  const text = el.querySelector('[data-curtain-label]');
  text.textContent = '';
  gsap
    .timeline()
    .fromTo(el, { yPercent: 100, visibility: 'visible' }, { yPercent: 0, duration: 0.75, ease: 'expo.inOut' })
    .to(text, { duration: 0.6, ease: 'none', scrambleText: { text: label, chars: SCRAMBLE_CHARS, speed: 0.8 } }, 0.3)
    .call(() => router.push(href, options));
  // Safety net: never leave the curtain down if the route somehow does not change
  gsap.delayedCall(5, () => {
    if (el.dataset.covered === '1') {
      delete el.dataset.covered;
      gsap.to(el, { yPercent: -100, duration: 0.6, onComplete: () => gsap.set(el, { visibility: 'hidden' }) });
    }
  });
}

// next/link that plays the curtain when it changes page, and smooth-scrolls when it only changes the hash.
export default function TransitionLink({ href, label = '', onClick, ref, children, ...rest }) {
  const router = useRouter();
  const pathname = usePathname();

  const go = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const [path, hash] = href.split('#');
    if ((path || pathname) === pathname) {
      if (hash) {
        e.preventDefault();
        scrollToTarget(`#${hash}`);
      }
      return;
    }
    e.preventDefault();
    coverAndGo(router, href, label);
  };

  return (
    <Link ref={ref} href={href} scroll={!href.includes('#')} onClick={go} {...rest}>
      {children}
    </Link>
  );
}
