"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const subscribe = () => () => {};

const INTERACTIVE_SELECTOR =
  "a, button, summary, select, label, [role='button'], [role='link'], [tabindex]:not([tabindex='-1']), .home-hero-panel, .home-capability-card";
const TEXT_SELECTOR = "input, textarea, [contenteditable='true'], [role='textbox']";
const DISABLED_SELECTOR = ":disabled, [aria-disabled='true'], [disabled]";

const BURST_DOTS = [0, 1, 2, 3, 4, 5];

/**
 * The on-screen cursor: a small cat-paw pad (one shield-shaped centre pad +
 * four round toe pads + a small inner heel-pad circle) with soft
 * radial-gradient shading for a puffy, slightly 3D look, tracking the mouse
 * 1:1 — no lerp,
 * no lag. Position writes are batched to one per animation frame (the
 * latest mousemove is captured immediately, the actual DOM update happens
 * on the next paint) so a high-poll-rate mouse can't flood the main thread
 * with more style recalculations than the screen can even show. The paw
 * body swaps between a pale off-white (dark theme) and charcoal
 * (light theme) via a plain `.dark` CSS selector; toe pads and the inner
 * heel pad stay soft pink in both. Hover layers the radar ping, the two
 * sparkle marks, and the cyan glow together; pressing swaps all of that
 * out for the existing small burst. Falls back to the native cursor over
 * text fields, touch devices, and reduced motion.
 */
export default function CursorFollower() {
  const hasHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const elRef = useRef<HTMLDivElement | null>(null);
  const burstRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;

    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const el = elRef.current;
    const burst = burstRef.current;
    if (!el || !burst) return;

    const isOverText = (target: EventTarget | null) =>
      target instanceof Element && target.closest(TEXT_SELECTOR) != null;
    const isOverInteractive = (target: EventTarget | null) =>
      target instanceof Element && target.closest(INTERACTIVE_SELECTOR) != null;
    const isOverDisabled = (target: EventTarget | null) =>
      target instanceof Element && target.closest(DISABLED_SELECTOR) != null;

    // High-poll-rate mice/trackpads can fire far more mousemove events than
    // the screen can paint. Writing style/class changes on every single one
    // was flooding the main thread with style recalculation and reading
    // like stutter site-wide. Latest event data is captured synchronously,
    // but the actual DOM write happens at most once per animation frame —
    // still visually 1:1 with the pointer, just not redone dozens of extra
    // times between paints.
    let pendingEvent: MouseEvent | null = null;
    let raf = 0;

    const flush = () => {
      raf = 0;
      const event = pendingEvent;
      if (!event) return;
      el.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      el.style.opacity = isOverText(event.target) ? "0" : "1";
      const disabled = isOverDisabled(event.target);
      el.classList.toggle("cursor-follower--disabled", disabled);
      el.classList.toggle(
        "cursor-follower--hover",
        !disabled && isOverInteractive(event.target),
      );
    };

    const onMove = (event: MouseEvent) => {
      pendingEvent = event;
      if (!raf) raf = requestAnimationFrame(flush);
    };
    const onDown = () => {
      el.classList.add("cursor-follower--press");
      if (!reducedQuery.matches) {
        burst.classList.remove("cursor-follower__burst--active");
        void burst.offsetWidth;
        burst.classList.add("cursor-follower__burst--active");
      }
    };
    const onUp = () => el.classList.remove("cursor-follower--press");
    const onLeaveWindow = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeaveWindow);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeaveWindow);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [hasHydrated]);

  if (!hasHydrated) return null;

  return (
    <div ref={elRef} className="cursor-follower" aria-hidden="true">
      <span className="cursor-follower__ping" />
      <div className="cursor-follower__sparkles">
        <span className="cursor-follower__sparkle cursor-follower__sparkle--a" />
        <span className="cursor-follower__sparkle cursor-follower__sparkle--b" />
      </div>
      {/* Paw-print stamp — one paw-shaped centre pad (with a small pink
          inner heel-pad circle) + four round toe pads, soft radial shading
          for a puffy, slightly 3D read instead of a flat silhouette. */}
      <svg viewBox="0 0 32 32" className="cursor-follower__paw">
        <defs>
          <radialGradient id="cursorPadDark" cx="38%" cy="30%" r="75%">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.55" stopColor="#eef2f6" />
            <stop offset="1" stopColor="#cbd5e1" />
          </radialGradient>
          <radialGradient id="cursorPadLight" cx="38%" cy="30%" r="75%">
            <stop offset="0" stopColor="#71717a" />
            <stop offset="0.55" stopColor="#3f3f46" />
            <stop offset="1" stopColor="#27272a" />
          </radialGradient>
          <radialGradient id="cursorBeanGrad" cx="35%" cy="30%" r="75%">
            <stop offset="0" stopColor="#fecdd3" />
            <stop offset="0.6" stopColor="#f9a8d4" />
            <stop offset="1" stopColor="#ec4899" />
          </radialGradient>
        </defs>
        <path
          className="cursor-follower__pad"
          d="M9.5 18 C9.1 15 12 12.6 16 12.6 C20 12.6 22.9 15 22.5 18 C23 22 19.8 25.6 16 25.6 C12.2 25.6 9 22 9.5 18 Z"
        />
        <circle className="cursor-follower__pad-inner" cx="15.3" cy="18.6" r="2.6" />
        <circle className="cursor-follower__bean" cx="7.9" cy="14.6" r="2.5" />
        <circle className="cursor-follower__bean" cx="12.6" cy="10.6" r="2.8" />
        <circle className="cursor-follower__bean" cx="19.4" cy="10.6" r="2.8" />
        <circle className="cursor-follower__bean" cx="24.1" cy="14.6" r="2.5" />
      </svg>
      <div ref={burstRef} className="cursor-follower__burst">
        {BURST_DOTS.map((i) => (
          <span key={i} className="cursor-follower__burst-dot" />
        ))}
      </div>
    </div>
  );
}
