'use client';

import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { gsap, Draggable, Flip, Observer, ScrollSmoother, useGSAP, motionOK, SCRAMBLE_CHARS } from '@/lib/gsap';
import styles from './Gallery.module.css';

const pad = (n) => String(n).padStart(2, '0');
const SIZES = '(max-width: 760px) 90vw, 45vw';

// Clip-path that matches a viewport rect, so the gallery can grow out of the room's print stack.
const insetFrom = (r) => {
  const t = Math.max(0, r.top);
  const right = Math.max(0, window.innerWidth - r.right);
  const b = Math.max(0, window.innerHeight - r.bottom);
  const l = Math.max(0, r.left);
  return `inset(${t}px ${right}px ${b}px ${l}px round 24px)`;
};
const FULL = 'inset(0px 0px 0px 0px round 0px)';

// Full-screen room. Pieces hang on a curved wall: drag (with inertia), scroll or use the arrow keys
// to walk along it; click the piece in front of you to take it off the wall (Flip) and see it up close.
export default function Gallery({ room, number, origin, onClose }) {
  const root = useRef(null);
  const api = useRef({});
  const [active, setActive] = useState(0);
  const [detail, setDetail] = useState(false);
  const total = room.pieces.length;
  const piece = room.pieces[active];

  useGSAP(
    () => {
      const el = root.current;
      const q = gsap.utils.selector(el);
      const track = q('[data-track]')[0];
      const viewport = q('[data-viewport]')[0];
      const figures = q('[data-piece]');
      const motion = motionOK();
      const state = { active: 0, snaps: [], centers: [], width: 0, busy: false, moved: false, detail: false };

      // Freeze the page behind the room
      const smoother = ScrollSmoother.get();
      smoother?.paused(true);
      const page = document.getElementById('smooth-wrapper');
      if (page) page.inert = true;
      const html = document.documentElement;
      const prevOverflow = html.style.overflow;
      html.style.overflow = 'hidden';

      const measure = () => {
        state.width = viewport.clientWidth;
        state.centers = figures.map((f) => f.offsetLeft + f.offsetWidth / 2);
        state.snaps = state.centers.map((c) => state.width / 2 - c);
      };

      // Pieces turn toward the visitor as they reach the middle of the wall
      const update = () => {
        const x = gsap.getProperty(track, 'x');
        let nearest = 0;
        figures.forEach((f, i) => {
          const off = (state.centers[i] + x - state.width / 2) / state.width;
          const a = Math.min(Math.abs(off) * 1.5, 1);
          gsap.set(f, {
            rotationY: motion ? gsap.utils.clamp(-40, 40, -off * 60) : 0,
            scale: 1 - a * 0.22,
            opacity: 1 - a * 0.55,
          });
          if (Math.abs(off) < Math.abs((state.centers[nearest] + x - state.width / 2) / state.width)) nearest = i;
        });
        if (nearest !== state.active) {
          state.active = nearest;
          setActive(nearest);
        }
      };

      measure();
      gsap.set(track, { x: state.snaps[0] });
      update();

      const drag = Draggable.create(track, {
        type: 'x',
        inertia: true,
        dragClickables: true,
        edgeResistance: 0.8,
        bounds: { minX: state.snaps.at(-1), maxX: state.snaps[0] },
        snap: (v) => gsap.utils.snap(state.snaps, v),
        onPress: () => {
          state.moved = false;
          gsap.killTweensOf(track);
        },
        onDragStart: () => {
          state.moved = true;
        },
        onDrag: update,
        onThrowUpdate: update,
        onThrowComplete: update,
      })[0];

      const goTo = (i) => {
        const index = gsap.utils.clamp(0, total - 1, i);
        gsap.to(track, {
          x: state.snaps[index],
          duration: motion ? 1.1 : 0,
          ease: 'expo.out',
          overwrite: true,
          onUpdate: update,
          onComplete: () => {
            update();
            drag.update();
          },
        });
      };
      const step = (dir) => {
        if (state.detail || state.busy) return;
        state.busy = true;
        gsap.delayedCall(0.55, () => (state.busy = false));
        goTo(state.active + dir);
      };

      // Wheel / trackpad: one notch, one piece
      const wheel = Observer.create({
        target: viewport,
        type: 'wheel',
        tolerance: 12,
        preventDefault: true,
        onDown: () => step(1),
        onUp: () => step(-1),
        onRight: () => step(1),
        onLeft: () => step(-1),
      });

      // Take the front piece off the wall: Flip it from its frame to the detail view
      const openDetail = () => {
        const i = state.active;
        const frame = figures[i].querySelector('[data-frame]');
        const box = q('[data-detail-box]')[0];
        state.detail = true;
        setDetail(true);
        box.dataset.flipId = frame.dataset.flipId;
        const from = Flip.getState(frame);
        gsap.set(q('[data-detail]'), { autoAlpha: 1 });
        gsap.set(frame, { opacity: 0 });
        if (!motion) return;
        Flip.from(from, { targets: box, duration: 0.9, ease: 'expo.inOut', scale: true });
        gsap.fromTo(q('[data-detail-bg]'), { opacity: 0 }, { opacity: 1, duration: 0.6 });
        gsap.from(q('[data-detail-caption]'), { y: 24, autoAlpha: 0, duration: 0.7, delay: 0.5, ease: 'expo.out' });
      };

      const closeDetail = () => {
        const frame = figures[state.active].querySelector('[data-frame]');
        const box = q('[data-detail-box]')[0];
        const done = () => {
          gsap.set(q('[data-detail]'), { autoAlpha: 0 });
          gsap.set(box, { clearProps: 'transform' });
          gsap.set(frame, { opacity: 1 });
          state.detail = false;
          setDetail(false);
        };
        if (!motion) return done();
        gsap.to(q('[data-detail-bg]'), { opacity: 0, duration: 0.6 });
        gsap.to(q('[data-detail-caption]'), { autoAlpha: 0, duration: 0.25 });
        Flip.fit(box, frame, { duration: 0.8, ease: 'expo.inOut', scale: true, onComplete: done });
      };

      const pick = (i) => {
        if (state.moved) return;
        if (i === state.active) openDetail();
        else goTo(i);
      };

      // Leaving: the wall slides away and the room shrinks back into its print stack
      const close = () => {
        if (state.detail) return closeDetail();
        if (!motion) return onClose();
        gsap
          .timeline({ onComplete: onClose })
          .to(figures, { autoAlpha: 0, y: 40, duration: 0.4, stagger: 0.04, ease: 'power2.in' })
          .to(q('[data-ui]'), { autoAlpha: 0, duration: 0.3 }, 0)
          .to(el, { clipPath: insetFrom(origin), duration: 0.8, ease: 'expo.inOut' }, 0.2);
      };

      const onKey = (e) => {
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowRight') step(1);
        else if (e.key === 'ArrowLeft') step(-1);
        else state.moved = false; // keyboard activation of a frame is never a drag
      };
      window.addEventListener('keydown', onKey);

      const onResize = () => {
        measure();
        drag.applyBounds({ minX: state.snaps.at(-1), maxX: state.snaps[0] });
        gsap.set(track, { x: state.snaps[state.active] });
        update();
        drag.update();
      };
      window.addEventListener('resize', onResize);

      api.current = { pick, close, closeDetail, step };

      // Entering: the room grows out of the stack you clicked, then the pieces swing onto the wall
      if (motion) {
        gsap
          .timeline()
          .fromTo(el, { clipPath: insetFrom(origin) }, { clipPath: FULL, duration: 1, ease: 'expo.inOut' })
          // Only the first few are on screen; cap the stagger so long rooms (20 slides) don't drag on
          .from(figures, { x: '45vw', rotationY: -70, autoAlpha: 0, duration: 1.4, stagger: { each: 0.08, amount: Math.min(0.5, 0.08 * figures.length) }, ease: 'expo.out' }, 0.45)
          .from(q('[data-ui]'), { y: -16, autoAlpha: 0, duration: 0.7, stagger: 0.06, ease: 'expo.out' }, 0.6)
          .to(
            q('[data-room-name]'),
            { duration: 0.8, ease: 'none', scrambleText: { text: room.title, chars: SCRAMBLE_CHARS, speed: 0.7 } },
            0.6,
          );
      }
      q('[data-close]')[0].focus({ preventScroll: true });

      return () => {
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('resize', onResize);
        wheel.kill();
        drag.kill();
        smoother?.paused(false);
        if (page) page.inert = false;
        html.style.overflow = prevOverflow;
      };
    },
    { scope: root },
  );

  // Progress bar follows the piece in front
  useGSAP(
    () => {
      gsap.to('[data-progress]', { scaleX: (active + 1) / total, duration: 0.6, ease: 'expo.out' });
    },
    { scope: root, dependencies: [active] },
  );

  const detailW = `min(92vw, calc(80svh * ${piece.w / piece.h}))`;

  return createPortal(
    <div ref={root} className={styles.gallery} role="dialog" aria-modal="true" aria-label={`${room.title} gallery`}>
      <header className={styles.bar}>
        <p data-ui className={`label ${styles.roomName}`}>
          Room {pad(number)} · <span data-room-name>{room.title}</span>
        </p>
        <p data-ui className={`label ${styles.counter}`} aria-live="polite">
          {pad(active + 1)} / {pad(total)}
        </p>
        <button data-ui data-close type="button" className={`label ${styles.close}`} onClick={() => api.current.close()}>
          Close <span aria-hidden>✕</span>
        </button>
      </header>

      <div data-viewport className={styles.viewport}>
        <div data-track className={styles.track}>
          {room.pieces.map((p, i) => (
            <figure key={p.src} data-piece className={styles.piece}>
              <button
                type="button"
                data-frame
                data-flip-id={`piece-${i}`}
                className={styles.frame}
                style={{ aspectRatio: `${p.w} / ${p.h}`, height: `min(58svh, calc(72vw * ${p.h / p.w}))` }}
                onClick={() => api.current.pick(i)}
                aria-label={i === active ? `Enlarge ${p.title}` : `Go to ${p.title}`}
              >
                <Image src={p.src} alt={`${p.title}, ${p.medium.toLowerCase()} for ${room.title}`} fill sizes={SIZES} draggable={false} style={{ objectFit: 'cover' }} />
              </button>
              <figcaption className={styles.placard}>
                <span className="label">{pad(i + 1)}</span>
                <strong className={styles.placardTitle}>{p.title}</strong>
                <span className="label">
                  {p.medium} · {room.year}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <footer className={styles.foot}>
        <div data-ui className={styles.nav}>
          <button type="button" className={`label ${styles.navBtn}`} onClick={() => api.current.step(-1)} disabled={active === 0}>
            ← Prev
          </button>
          <button type="button" className={`label ${styles.navBtn}`} onClick={() => api.current.step(1)} disabled={active === total - 1}>
            Next →
          </button>
        </div>
        <div data-ui className={styles.progressTrack} aria-hidden>
          <span data-progress className={styles.progress} />
        </div>
        <p data-ui className={`label ${styles.hint}`}>Drag · Scroll · ← → · Click to enlarge</p>
      </footer>

      <div data-detail className={styles.detail} aria-hidden={!detail}>
        <button type="button" data-detail-bg className={styles.detailBg} onClick={() => api.current.closeDetail()} aria-label="Back to the wall" tabIndex={detail ? 0 : -1} />
        <div data-detail-box className={styles.detailBox} style={{ width: detailW, aspectRatio: `${piece.w} / ${piece.h}` }}>
          <Image key={piece.src} src={piece.src} alt="" fill sizes={SIZES} loading="eager" style={{ objectFit: 'cover' }} />
        </div>
        <p data-detail-caption className={styles.detailCaption}>
          <strong>{piece.title}</strong>
          <span className="label">
            {piece.medium} · {room.title} · {room.year}
          </span>
        </p>
      </div>
    </div>,
    document.body,
  );
}
