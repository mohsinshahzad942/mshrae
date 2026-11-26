import { useEffect, useRef, useState } from "react";

const PHONE = "(max-width: 700px)";

/** On phones a 3D ring is too wide to read, so the same cards become a swipeable row that snaps. */
function SnapRow({ items, renderItem, label }) {
  return (
    <div className="ring-snap" role="region" aria-label={label} tabIndex={0}>
      {items.map((item, i) => (
        <div
          key={i}
          className="ring-card"
          role="group"
          aria-label={`${i + 1} of ${items.length}`}
        >
          {renderItem(item, i)}
        </div>
      ))}
    </div>
  );
}

export function RingCarousel(props) {
  const [phone, setPhone] = useState(() => matchMedia(PHONE).matches);
  useEffect(() => {
    const mq = matchMedia(PHONE);
    const on = () => setPhone(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return phone ? <SnapRow {...props} /> : <Ring {...props} />;
}

/**
 * Cards arranged on a 3D ring that slowly turns, so they read like a rotating circle of glass panels.
 * - Pauses while the pointer is over it or a card has keyboard focus, so text can be read.
 * - Drag or swipe to spin it; it settles on the nearest card. Arrow buttons and ←/→ keys step one card.
 * - Cards fade with their angle, so the one facing you is fully readable and the back ones stay faint.
 * - Reduced motion: no auto-turn and no easing; buttons and keys still step instantly.
 * All motion is written straight to the DOM each frame, so React never re-renders while it turns.
 */
function Ring({ items, renderItem, label, animate = true, speed = 6 }) {
  const stageRef = useRef(null);
  const ringRef = useRef(null);
  const state = useRef({
    angle: 0,
    target: null,
    paused: false,
    drag: null,
    velocity: 0,
  });
  const [active, setActive] = useState(0);
  const n = items.length;
  const step = 360 / n;

  useEffect(() => {
    const ring = ringRef.current;
    const cards = Array.from(ring.children);
    const s = state.current;
    let frame;
    let last = performance.now();

    const paint = () => {
      ring.style.transform = `translateZ(calc(var(--ring-r) * -1)) rotateY(${s.angle}deg)`;
      let front = 0;
      let best = -2;
      cards.forEach((card, i) => {
        const a = ((s.angle - i * step) * Math.PI) / 180;
        const facing = Math.cos(a);
        const t = Math.max(0, facing);
        // Facing cards are crisp; side cards fade; cards turned away disappear so their text never shows through.
        card.style.opacity =
          facing <= 0.05 ? "0" : (0.12 + 0.88 * Math.pow(t, 2.2)).toFixed(3);
        card.style.pointerEvents = facing > 0.6 ? "auto" : "none";
        card.toggleAttribute("inert", facing < 0.6);
        if (facing > best) {
          best = facing;
          front = i;
        }
      });
      setActive((p) => (p === front ? p : front));
    };

    const tick = (t) => {
      const dt = Math.min(64, t - last) / 1000;
      last = t;
      if (s.drag) {
        // follow the pointer directly
      } else if (s.target != null) {
        const d = s.target - s.angle;
        s.angle += animate ? d * Math.min(1, dt * 7) : d;
        if (Math.abs(d) < 0.05) {
          s.angle = s.target;
          s.target = null;
        }
      } else if (Math.abs(s.velocity) > 0.5) {
        s.angle += s.velocity * dt;
        s.velocity *= Math.pow(0.04, dt);
        if (Math.abs(s.velocity) <= 0.5)
          s.target = Math.round(s.angle / step) * step;
      } else if (animate && !s.paused && !document.hidden) {
        s.angle += speed * dt;
      }
      paint();
      frame = requestAnimationFrame(tick);
    };

    paint();
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(frame);
      if (e.isIntersecting) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    });
    io.observe(stageRef.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [animate, speed, step]);

  const goTo = (delta) => {
    const s = state.current;
    const base = s.target ?? Math.round(s.angle / step) * step;
    s.velocity = 0;
    s.target = base + delta * step;
  };

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    const s = state.current;
    s.drag = {
      x: e.clientX,
      angle: s.angle,
      t: performance.now(),
      lastX: e.clientX,
    };
    s.target = null;
    s.velocity = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    const s = state.current;
    if (!s.drag) return;
    const now = performance.now();
    const dx = e.clientX - s.drag.x;
    s.angle = s.drag.angle - dx * 0.25;
    const dt = Math.max(1, now - s.drag.t);
    s.velocity = (-(e.clientX - s.drag.lastX) * 0.25 * 1000) / dt;
    s.drag.t = now;
    s.drag.lastX = e.clientX;
  };
  const onPointerUp = () => {
    const s = state.current;
    if (!s.drag) return;
    s.drag = null;
    if (!animate || Math.abs(s.velocity) < 30) {
      s.velocity = 0;
      s.target = Math.round(s.angle / step) * step;
    }
  };
  const setPaused = (v) => {
    state.current.paused = v;
  };

  return (
    <div
      className="hl-ring"
      role="region"
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") (e.preventDefault(), goTo(1));
        if (e.key === "ArrowLeft") (e.preventDefault(), goTo(-1));
      }}
    >
      <div
        ref={stageRef}
        className="ring-stage"
        style={{ "--ring-n": n }}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div ref={ringRef} className="ring-track">
          {items.map((item, i) => (
            <div
              key={i}
              className="ring-card"
              style={{
                transform: `rotateY(${-i * step}deg) translateZ(var(--ring-r))`,
              }}
              aria-label={`${i + 1} of ${n}`}
              role="group"
            >
              {renderItem(item, i)}
            </div>
          ))}
        </div>
      </div>
      <div className="ring-controls">
        <button
          type="button"
          className="ring-btn"
          onClick={() => goTo(-1)}
          aria-label="Previous highlight"
        >
          ←
        </button>
        <span className="ring-count" aria-live="polite">
          {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </span>
        <button
          type="button"
          className="ring-btn"
          onClick={() => goTo(1)}
          aria-label="Next highlight"
        >
          →
        </button>
      </div>
    </div>
  );
}
