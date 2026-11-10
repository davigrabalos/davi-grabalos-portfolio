'use client';

import { useRef } from 'react';
import { gsap, SplitText, ScrollTrigger, useGSAP, fontsReady, MOTION_OK } from '@/lib/gsap';
import { profile, experience, skills } from '@/lib/content';
import SplitHeading from './SplitHeading';
import Magnetic from './Magnetic';
import styles from './About.module.css';

export default function About() {
  const root = useRef(null);
  const bio = useRef(null);

  useGSAP(
    (context, contextSafe) => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      let live = true;

      // Bio lights up word by word as it scrolls through the viewport
      fontsReady().then(
        contextSafe(() => {
          if (!live) return;
          const { words } = SplitText.create(bio.current, { type: 'words' });
          gsap.set(bio.current, { autoAlpha: 1 });
          mm.add(MOTION_OK, () => {
            gsap.from(words, {
              opacity: 0.12,
              ease: 'none',
              stagger: 0.1,
              scrollTrigger: { trigger: bio.current, start: 'top 80%', end: 'bottom 45%', scrub: true },
            });
          });
        }),
      );

      mm.add(MOTION_OK, () => {
        // Timeline line draws itself, entries slide in beside it
        gsap.from(q('[data-track]'), {
          scaleY: 0,
          transformOrigin: 'top center',
          ease: 'none',
          scrollTrigger: { trigger: q('[data-timeline]')[0], start: 'top 75%', end: 'bottom 60%', scrub: true },
        });
        q('[data-exp]').forEach((item) => {
          gsap.from(item, {
            x: -30,
            autoAlpha: 0,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: item, start: 'top 85%', once: true },
          });
        });

        q('[data-group]').forEach((group) => {
          gsap.from(group.querySelectorAll('[data-chip]'), {
            scale: 0.6,
            autoAlpha: 0,
            duration: 0.6,
            ease: 'back.out(2)',
            stagger: 0.05,
            scrollTrigger: { trigger: group, start: 'top 88%', once: true },
          });
        });

        ScrollTrigger.create({
          trigger: q('[data-cv]')[0],
          start: 'top 90%',
          once: true,
          onEnter: () =>
            gsap.from(q('[data-cv]'), { y: 40, autoAlpha: 0, duration: 1, ease: 'elastic.out(1, 0.6)' }),
        });
      });

      return () => {
        live = false;
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="background" className={styles.section}>
      <header className={styles.head}>
        <p className="label">(02) Background &amp; CV</p>
        <SplitHeading className={styles.heading}>Background</SplitHeading>
      </header>

      <p ref={bio} className={`split-init ${styles.bio}`}>
        {profile.bio}
      </p>

      <div className={styles.grid}>
        <div>
          <h3 className={`label ${styles.sub}`}>Experience</h3>
          <div data-timeline className={styles.timeline}>
            <span data-track className={styles.track} aria-hidden />
            <ol>
              {experience.map((e) => (
                <li key={e.role} data-exp className={styles.item}>
                  <span className={`label ${styles.period}`}>{e.period}</span>
                  <p className={styles.role}>{e.role}</p>
                  <p className={styles.company}>{e.company}</p>
                  <p className={styles.summary}>{e.summary}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div>
          <h3 className={`label ${styles.sub}`}>Toolkit</h3>
          <div className={styles.groups}>
            {skills.map((g) => (
              <div key={g.label} data-group className={styles.group}>
                <p className={styles.groupLabel}>{g.label}</p>
                <ul className={styles.chips}>
                  {g.items.map((item) => (
                    <li key={item} data-chip className={`label ${styles.chip}`}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div data-cv className={styles.cvWrap}>
            <Magnetic>
              <a href={profile.cv} className={styles.cv} download>
                Download CV <span aria-hidden>↓</span>
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
