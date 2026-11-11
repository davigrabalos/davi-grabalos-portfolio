'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap, SplitText, ScrollTrigger, useGSAP, fontsReady, MOTION_OK } from '@/lib/gsap';
import { profile, experience, skills } from '@/lib/content';
import SplitHeading from './SplitHeading';
import Magnetic from './Magnetic';
import PixelIcon from './PixelIcon';
import styles from './About.module.css';

export default function About() {
  const root = useRef(null);
  const bio = useRef(null);

  const { contextSafe } = useGSAP(
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
        // Portrait opens as an expanding circle, then drifts inside its frame while scrolling
        const photo = q('[data-photo]')[0];
        gsap.from(photo, {
          clipPath: 'circle(0% at 50% 50%)',
          rotation: -12,
          duration: 1.6,
          ease: 'expo.out',
          scrollTrigger: { trigger: photo, start: 'top 85%', once: true },
        });
        gsap.fromTo(
          photo.querySelector('img'),
          { yPercent: -6, scale: 1.15 },
          {
            yPercent: 6,
            scale: 1.15,
            ease: 'none',
            scrollTrigger: { trigger: photo, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );

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
          // Pixel icons snap in frame by frame (steps ease), like a sprite
          gsap.from(group.querySelector('[data-icon]'), {
            scale: 0,
            rotation: -90,
            duration: 0.5,
            ease: 'steps(5)',
            scrollTrigger: { trigger: group, start: 'top 88%', once: true },
          });
          gsap.from(group.querySelectorAll('[data-chip]'), {
            scale: 0.6,
            autoAlpha: 0,
            duration: 0.6,
            ease: 'back.out(2)',
            stagger: 0.05,
            scrollTrigger: { trigger: group, start: 'top 88%', once: true },
          });
        });

        gsap.from(q('[data-exp-icon]'), {
          y: -16,
          duration: 0.6,
          ease: 'steps(4)',
          scrollTrigger: { trigger: q('[data-timeline]')[0], start: 'top 85%', once: true },
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

  // Download icon drops in pixel steps while the button is hovered
  const bounceIcon = contextSafe((on) => {
    gsap.killTweensOf('[data-cv-icon]');
    gsap.to('[data-cv-icon]', on
      ? { y: 4, duration: 0.3, ease: 'steps(2)', repeat: -1, yoyo: true }
      : { y: 0, duration: 0.15, ease: 'steps(1)' });
  });

  return (
    <section ref={root} id="background" className={styles.section}>
      <header className={styles.head}>
        <p className="label">(02) Background &amp; CV</p>
        <SplitHeading className={styles.heading}>Background</SplitHeading>
      </header>

      <div className={styles.intro}>
        <div data-photo className={styles.photo}>
          <Image
            src="/davi-grabalos.jpg"
            alt={`Portrait of ${profile.name}`}
            fill
            sizes="(max-width: 860px) 60vw, 30vw"
            className={styles.photoImg}
          />
        </div>
        <p ref={bio} className={`split-init ${styles.bio}`}>
          {profile.bio}
        </p>
      </div>

      <div className={styles.grid}>
        <div>
          <h3 className={`label ${styles.sub}`}>
            <PixelIcon name="briefcase" data-exp-icon className={styles.subIcon} />
            Experience
          </h3>
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
                <p className={styles.groupLabel}>
                  <PixelIcon name={g.icon} data-icon size="1.25em" />
                  {g.label}
                </p>
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
              <a href={profile.cv} className={styles.cv}
                download
                onPointerEnter={() => bounceIcon(true)}
                onPointerLeave={() => bounceIcon(false)}
              >
                Download CV <PixelIcon name="download" data-cv-icon size="1.4em" />
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
