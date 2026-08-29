"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const subscribe = () => () => {};

const INTERACTIVE_SELECTOR =
  "a, button, summary, select, label, [role='button'], [role='link'], [tabindex]:not([tabindex='-1']), .home-hero-panel, .home-capability-card";
const TEXT_SELECTOR = "input, textarea, [contenteditable='true'], [role='textbox']";
const DISABLED_SELECTOR = ":disabled, [aria-disabled='true'], [disabled]";

const BURST_DOTS = [0, 1, 2, 3, 4, 5];

/**
 * The on-screen cursor: a small cat-paw pad (one big centre pad + three
 * round toe pads + a small inner heel-pad circle) with soft radial-gradient
 * shading for a puffy, slightly 3D look, tracking the mouse 1:1 — position
 * is set straight from the mousemove event, no lerp, no per-frame loop.
 * The paw body swaps between a pale off-white (dark theme) and charcoal
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

    const onMove = (event: MouseEvent) => {
      // Set directly from the event — no lerp, no per-frame loop, so the
      // paw sits exactly where the real pointer is on every single move.
      el.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      el.style.opacity = isOverText(event.target) ? "0" : "1";
      const disabled = isOverDisabled(event.target);
      el.classList.toggle("cursor-follower--disabled", disabled);
      el.classList.toggle(
        "cursor-follower--hover",
        !disabled && isOverInteractive(event.target),
      );
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
      {/* Paw-print stamp — one big centre pad (with a small pink inner
          heel-pad circle) + three round toe pads, soft radial shading for
          a puffy, slightly 3D read instead of a flat silhouette. */}
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
        <ellipse className="cursor-follower__pad" cx="16" cy="19.6" rx="6.4" ry="5.6" />
        <circle className="cursor-follower__pad-inner" cx="15.3" cy="18.6" r="2" />
        <circle className="cursor-follower__bean" cx="9.9" cy="12.6" r="2.9" />
        <circle className="cursor-follower__bean" cx="16" cy="9.8" r="3.15" />
        <circle className="cursor-follower__bean" cx="22.1" cy="12.6" r="2.9" />
      </svg>
      <div ref={burstRef} className="cursor-follower__burst">
        {BURST_DOTS.map((i) => (
          <span key={i} className="cursor-follower__burst-dot" />
        ))}
      </div>
    </div>
  );
}
