'use client';

import { useRef } from 'react';
import { gsap, useGSAP, scrollToTarget, MOTION_OK, SCRAMBLE_CHARS } from '@/lib/gsap';
import { profile, socials } from '@/lib/content';
import SplitHeading from './SplitHeading';
import Magnetic from './Magnetic';
import ScrambleLink from './ScrambleLink';
import styles from './Contact.module.css';

export default function Contact() {
  const root = useRef(null);

  const { contextSafe } = useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(q('[data-reveal]'), {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: { trigger: q('[data-reveal]')[0], start: 'top 88%', once: true },
        });

        // Underline draws in under the email
        gsap.from(q('[data-underline]'), {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.2,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: q('[data-email]')[0], start: 'top 90%', once: true },
        });
      });
    },
    { scope: root },
  );

  const scrambleEmail = contextSafe(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.to('[data-text]', {
      duration: 0.9,
      ease: 'none',
      overwrite: true,
      scrambleText: { text: profile.email, chars: SCRAMBLE_CHARS, speed: 0.6 },
    });
  });

  return (
    <section ref={root} id="contact" className={styles.section}>
      <p className="label">(03) Contact</p>
      <SplitHeading className={styles.heading}>Let&apos;s talk</SplitHeading>

      <p data-reveal className={styles.lead}>
        Open to internships, junior roles and freelance projects in software development, product engineering and UI/UX. Based in {profile.location}, working remotely.
      </p>

      <div data-reveal>
        <Magnetic strength={0.2}>
          <a data-email href={`mailto:${profile.email}`} className={styles.email} onPointerEnter={scrambleEmail}>
            <span data-text>{profile.email}</span>
            <span data-underline className={styles.underline} aria-hidden />
          </a>
        </Magnetic>
      </div>

      <ul data-reveal className={styles.socials}>
        {socials.map((s) => (
          <li key={s.label}>
            <ScrambleLink href={s.href} text={s.label} className={`label ${styles.social}`} target="_blank" rel="noreferrer">
              <span aria-hidden> ↗</span>
            </ScrambleLink>
          </li>
        ))}
      </ul>

      <footer className={styles.footer}>
        <span className="label">© 2026 {profile.fullName}</span>
        <span className="label">Built with Next.js + GSAP</span>
        <button type="button" className="label" onClick={() => scrollToTarget('#top')}>
          Back to top ↑
        </button>
      </footer>
    </section>
  );
}
