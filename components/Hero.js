'use client';

import { useRef } from 'react';
import { gsap, SplitText, useGSAP, fontsReady, MOTION_OK, SCRAMBLE_CHARS } from '@/lib/gsap';
import { profile } from '@/lib/content';
import styles from './Hero.module.css';

const BASE_WEIGHT = 300;
const MAX_WEIGHT = 900;

export default function Hero() {
  const root = useRef(null);
  const title = useRef(null);

  useGSAP(
    (context, contextSafe) => {
      let live = true;

      fontsReady().then(
        contextSafe(() => {
          if (!live) return;
          const q = gsap.utils.selector(root);
          const lines = q('[data-line]');
          const { chars } = SplitText.create(lines, { type: 'chars', charsClass: styles.char });
          gsap.set(title.current, { autoAlpha: 1 });

          const mm = gsap.matchMedia();

          mm.add(MOTION_OK, () => {
            // Intro: letters rise out of the line masks while gaining weight
            const intro = gsap.timeline({ delay: 0.15 });
            intro
              .from(chars, {
                yPercent: 115,
                fontWeight: 100,
                duration: 1.3,
                ease: 'expo.out',
                stagger: { each: 0.06, from: 'random' },
              })
              .from(q('[data-fade]'), { y: 24, autoAlpha: 0, stagger: 0.08 }, '-=0.9')
              // Release the masks so letters can fly free on scroll
              .set(lines, { overflow: 'visible' });

            // Role line decodes into the next role, holds, repeats
            const roleEl = q('[data-role]')[0];
            const cycle = [...profile.roles.slice(1), profile.roles[0]];
            const roles = gsap.timeline({ repeat: -1, delay: 2.4 });
            cycle.forEach((role) => {
              roles
                .to(roleEl, {
                  duration: 1.2,
                  ease: 'none',
                  scrambleText: { text: role, chars: SCRAMBLE_CHARS, speed: 0.5 },
                })
                .to({}, { duration: 2.2 });
            });

            // Scroll: the name breaks apart as the hero leaves
            gsap.to(chars, {
              xPercent: () => gsap.utils.random(-140, 140),
              yPercent: () => gsap.utils.random(-220, 80),
              rotation: () => gsap.utils.random(-60, 60),
              opacity: 0,
              ease: 'none',
              stagger: { each: 0.02, from: 'random' },
              scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1 },
            });

            gsap.to(q('[data-scroll-dot]'), {
              y: 14,
              duration: 0.8,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            });
          });

          // Desktop: letters near the cursor are pulled toward it and get heavier
          mm.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
            let setters = [];
            let centers = [];

            const measure = () => {
              const box = root.current.getBoundingClientRect();
              centers = chars.map((c) => {
                const r = c.getBoundingClientRect();
                return {
                  x: r.left + r.width / 2 - box.left - gsap.getProperty(c, 'x'),
                  y: r.top + r.height / 2 - box.top - gsap.getProperty(c, 'y'),
                };
              });
            };

            const enable = () => {
              setters = chars.map((c) => ({
                x: gsap.quickTo(c, 'x', { duration: 0.7, ease: 'power3.out' }),
                y: gsap.quickTo(c, 'y', { duration: 0.7, ease: 'power3.out' }),
                w: gsap.quickTo(c, 'fontWeight', { duration: 0.5, ease: 'power2.out' }),
              }));
              measure();
            };

            const move = (e) => {
              if (!setters.length) return;
              const box = root.current.getBoundingClientRect();
              const radius = Math.max(window.innerWidth * 0.22, 200);
              const px = e.clientX - box.left;
              const py = e.clientY - box.top;

              setters.forEach((s, i) => {
                const dx = px - centers[i].x;
                const dy = py - centers[i].y;
                const falloff = Math.max(0, 1 - Math.hypot(dx, dy) / radius);
                const pull = falloff * falloff;
                s.x(dx * pull * 0.22);
                s.y(dy * pull * 0.22);
                s.w(BASE_WEIGHT + (MAX_WEIGHT - BASE_WEIGHT) * pull);
              });
            };

            const leave = () => {
              setters.forEach((s) => {
                s.x(0);
                s.y(0);
                s.w(BASE_WEIGHT);
              });
            };

            // Wait for the intro so the hover tweens don't fight it
            const ready = gsap.delayedCall(2, enable);
            const el = root.current;
            el.addEventListener('pointermove', move);
            el.addEventListener('pointerleave', leave);
            window.addEventListener('resize', measure);
            return () => {
              ready.kill();
              el.removeEventListener('pointermove', move);
              el.removeEventListener('pointerleave', leave);
              window.removeEventListener('resize', measure);
            };
          });

          // Touch: a weight wave keeps rolling through the name instead
          mm.add('(pointer: coarse) and (prefers-reduced-motion: no-preference)', () => {
            gsap.to(chars, {
              fontWeight: 800,
              duration: 0.7,
              ease: 'sine.inOut',
              delay: 2,
              stagger: { each: 0.09, repeat: -1, yoyo: true, repeatDelay: 0.6 },
            });
          });
        }),
      );

      return () => {
        live = false;
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className={styles.hero}>
      <div className={styles.top}>
        <p data-fade className="label">
          Portfolio ©2026
        </p>
        <p data-fade className="label">
          {profile.availability}
        </p>
      </div>

      <h1 ref={title} className={`split-init ${styles.title}`}>
        <span data-line className={styles.line}>
          {profile.first}
        </span>
        <span data-line className={styles.line}>
          {profile.last}
        </span>
      </h1>

      <div className={styles.bottom}>
        <p data-fade className={styles.role}>
          <span className="label">Currently</span>
          <span data-role className={styles.roleText}>
            {profile.roles[0]}
          </span>
        </p>
        <p data-fade className={styles.tagline} data-speed="0.9">
          {profile.tagline}
        </p>
        <p data-fade className={`label ${styles.scroll}`}>
          Scroll
          <span className={styles.scrollTrack}>
            <span data-scroll-dot className={styles.scrollDot} />
          </span>
        </p>
      </div>
    </section>
  );
}
