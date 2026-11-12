'use client';

import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, SplitText, useGSAP, fontsReady, MOTION_OK } from '@/lib/gsap';
import { rooms, pieceCount } from '@/lib/showroom';
import { profile } from '@/lib/content';
import TransitionLink from '../PageTransition';
import Fan from '../Fan';
import Gallery from './Gallery';
import styles from './Showroom.module.css';

const pad = (n) => String(n).padStart(2, '0');

export default function Showroom() {
  const root = useRef(null);
  const opener = useRef(null);
  const [hover, setHover] = useState(-1);
  const [open, setOpen] = useState(null); // { index, rect } of the room being viewed

  const { contextSafe } = useGSAP(
    (context, contextSafe) => {
      let live = true;
      const q = gsap.utils.selector(root);

      fontsReady().then(
        contextSafe(() => {
          if (!live) return;
          const title = q('[data-title]')[0];
          const split = SplitText.create(title, { type: 'chars', mask: 'chars' });
          gsap.set(title, { autoAlpha: 1 });

          const mm = gsap.matchMedia();
          mm.add(MOTION_OK, () => {
            gsap
              .timeline({ delay: 0.2 })
              .from(split.chars, {
                yPercent: 110,
                fontWeight: 100,
                duration: 1.3,
                ease: 'expo.out',
                stagger: { each: 0.05, from: 'center' },
              })
              .from(q('[data-fade]'), { y: 20, autoAlpha: 0, stagger: 0.07 }, '-=0.9');

            // Title thins out and drifts as you walk into the rooms
            gsap.to(split.chars, {
              fontWeight: 100,
              yPercent: (i) => (i % 2 ? -18 : 18),
              ease: 'none',
              stagger: { each: 0.02, from: 'center' },
              scrollTrigger: { trigger: title, start: 'top 20%', end: 'bottom top', scrub: 1 },
            });

            // Rooms: each one slides in, its prints rise at their own pace
            q('[data-room]').forEach((room) => {
              gsap.from(room.querySelectorAll('[data-reveal]'), {
                y: 50,
                autoAlpha: 0,
                duration: 1.1,
                ease: 'expo.out',
                stagger: 0.08,
                scrollTrigger: { trigger: room, start: 'top 80%', once: true },
              });
              gsap.fromTo(
                room.querySelector('[data-room-fan]'),
                { yPercent: 18, rotation: -4 },
                {
                  yPercent: -12,
                  rotation: 3,
                  ease: 'none',
                  scrollTrigger: { trigger: room, start: 'top bottom', end: 'bottom top', scrub: 1 },
                },
              );
            });
          });
          ScrollTrigger.refresh();
        }),
      );

      return () => {
        live = false;
      };
    },
    { scope: root },
  );

  const hoverRoom = contextSafe((e, i) => {
    setHover(i);
    const on = i !== -1;
    gsap.to(e.currentTarget.querySelector('[data-room-title]'), {
      x: on ? 20 : 0,
      duration: 0.6,
      ease: 'expo.out',
      overwrite: 'auto',
    });
    gsap.to(e.currentTarget.querySelector('[data-room-arrow]'), {
      x: on ? 10 : 0,
      rotation: on ? -45 : 0,
      duration: 0.5,
      ease: 'expo.out',
      overwrite: 'auto',
    });
  });

  const enter = (e, index) => {
    opener.current = e.currentTarget;
    setOpen({ index, rect: e.currentTarget.querySelector('[data-fan]').getBoundingClientRect() });
  };

  const close = () => {
    setOpen(null);
    opener.current?.focus({ preventScroll: true });
  };

  return (
    <main ref={root} className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.top}>
          <TransitionLink data-fade href="/#work" label="Portfolio" className={`label ${styles.back}`}>
            ← Back to work
          </TransitionLink>
          <p data-fade className="label">
            (02) Design Showroom
          </p>
          <p data-fade className={`label ${styles.count}`}>
            {pad(rooms.length)} rooms · {pad(pieceCount)} pieces
          </p>
        </div>

        <h1 data-title className={`split-init ${styles.title}`}>
          Showroom
        </h1>

        <div className={styles.intro}>
          <p data-fade className={styles.lead}>
            Posters, cover art and art direction. Pick a room and walk through it.
          </p>
          <p data-fade className={`label ${styles.hint}`}>
            Drag · Scroll · Arrow keys
          </p>
        </div>
      </section>

      <section className={styles.rooms} aria-label="Rooms">
        {rooms.map((room, i) => (
          <button
            key={room.slug}
            type="button"
            data-room
            className={styles.room}
            onClick={(e) => enter(e, i)}
            onPointerEnter={(e) => hoverRoom(e, i)}
            onPointerLeave={(e) => hoverRoom(e, -1)}
            onFocus={(e) => hoverRoom(e, i)}
            onBlur={(e) => hoverRoom(e, -1)}
            aria-label={`Enter room ${i + 1}: ${room.title}, ${room.pieces.length} pieces`}
          >
            <span className={styles.roomText}>
              <span data-reveal className={`label ${styles.roomIndex}`}>
                Room {pad(i + 1)}
              </span>
              <span data-reveal className={styles.roomTitleWrap}>
                <span data-room-title className={styles.roomTitle}>
                  {room.title}
                </span>
              </span>
              <span data-reveal className={styles.roomMeta}>
                <span className="label">{room.discipline}</span>
                <span className="label">{room.year}</span>
                <span className="label">
                  {room.pieces.length} {room.pieces.length === 1 ? 'piece' : 'pieces'}
                </span>
              </span>
              <span data-reveal className={styles.roomDesc}>
                {room.description}
              </span>
              <span data-reveal className={`label ${styles.roomCta}`}>
                Enter room{' '}
                <span data-room-arrow className={styles.arrow}>
                  →
                </span>
              </span>
            </span>
            <span data-room-fan className={styles.roomFan}>
              <Fan pieces={room.pieces.slice(0, 3)} spread={hover === i} sizes="(max-width: 760px) 50vw, 22vw" />
            </span>
          </button>
        ))}
      </section>

      <footer className={styles.footer}>
        <span className="label">© 2026 {profile.fullName}</span>
        <TransitionLink href="/#contact" label="Contact" className={`label ${styles.footerLink}`}>
          Like what you see? Let&apos;s talk →
        </TransitionLink>
      </footer>

      {open && <Gallery room={rooms[open.index]} number={open.index + 1} origin={open.rect} onClose={close} />}
    </main>
  );
}
