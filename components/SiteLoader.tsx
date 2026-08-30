"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const subscribe = () => () => {};

// Fake-progress tuning: creeps toward CAP while waiting on the real page,
// then races the rest of the way to 1 once it's actually ready. This is
// what "not a fixed timer" means in practice for a single page load --
// there's no browser API for a true 0-100% "page ready" percentage, so the
// curve is shaped to *feel* like real progress while still being gated on
// an actual readiness signal, not an arbitrary duration.
//
// MIN_CREEP_MS exists because on a fast load (very common on a warm cache
// or a static page) `document.readyState` can already be "complete" by the
// time this effect even runs -- without a floor, that skips straight to
// the finish phase and the whole scratch-down motion collapses into a
// flash. This guarantees the reveal always plays for at least a beat,
// regardless of how fast the page actually loaded.
const CAP = 0.9;
const CREEP_TAU_MS = 950;
const MIN_CREEP_MS = 1150;
const FINISH_MS = 700;
const HOLD_AFTER_DONE_MS = 240;

export default function SiteLoader() {
  const hasHydrated = useSyncExternalStore(subscribe, () => true, () => false);

  const [visible, setVisible] = useState(true);
  // One-time synchronous read of a browser API on mount, not a subscription
  // to something that changes -- a lazy initializer is the idiomatic way to
  // do that (matches the pattern already used elsewhere in this codebase).
  const [reduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const panelRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(false);

  useEffect(() => {
    if (reduceMotion) {
      const t = window.setTimeout(() => setVisible(false), 380);
      return () => window.clearTimeout(t);
    }

    let raf = 0;
    const start = performance.now();
    let finishStart: number | null = null;
    let progressAtFinish = 0;

    const markReady = () => {
      readyRef.current = true;
    };
    if (document.readyState === "complete") {
      markReady();
    } else {
      window.addEventListener("load", markReady, { once: true });
    }

    // The whole reveal is driven by writing the panel's transform straight
    // to the DOM inside the rAF loop -- no React state changes per frame,
    // so there are no re-renders during the animation. Sliding a
    // position:fixed panel with translate3d is GPU-composited (no layout,
    // no per-frame paint of page content), which is what actually makes it
    // smooth on both mobile and desktop; the earlier version animated
    // `height`, which forces paint every frame and was the source of jank.
    const apply = (progress: number) => {
      const panel = panelRef.current;
      if (panel) {
        panel.style.transform = `translate3d(0, ${(progress * 100).toFixed(3)}%, 0)`;
      }
    };

    const tick = (now: number) => {
      const elapsed = now - start;
      if (!readyRef.current || elapsed < MIN_CREEP_MS) {
        const p = CAP * (1 - Math.exp(-elapsed / CREEP_TAU_MS));
        progressAtFinish = p;
        apply(p);
        raf = requestAnimationFrame(tick);
        return;
      }

      if (finishStart === null) finishStart = now;
      // ease-in-out on the finishing stretch so the cat accelerates off the
      // bottom instead of stopping dead
      const raw = Math.min(1, (now - finishStart) / FINISH_MS);
      const eased = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
      const p = progressAtFinish + (1 - progressAtFinish) * eased;
      apply(p);

      if (raw >= 1) {
        window.setTimeout(() => setVisible(false), HOLD_AFTER_DONE_MS);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", markReady);
    };
  }, [reduceMotion]);

  if (!visible) return null;

  // Gate the *rendered* value on hydration, not the raw state: the lazy
  // initializer already reads the real preference on the client's first
  // render, before hasHydrated flips true, which would mismatch whatever
  // the server rendered. Branching on the raw value inside effects is fine
  // (they only run post-mount); anything affecting JSX output must wait.
  const reduceMotionEffective = hasHydrated && reduceMotion;

  // Panel colours come entirely from CSS custom properties switched on the
  // theme class (which next-themes stamps on <html> in a blocking head
  // script, before first paint) -- NOT computed in JS. That's deliberate:
  // computing them here would depend on hydration, so a light-mode visitor
  // would get a one-frame dark-panel flash before the theme resolved. The
  // CSS-var approach paints the right colour from the very first frame,
  // with no flash and no hydration dependency at all.
  return (
    <div className="site-loader" aria-hidden="true">
      <div
        ref={panelRef}
        className={`site-loader__panel${reduceMotionEffective ? " site-loader__panel--static" : ""}`}
      >
        {!reduceMotionEffective ? (
          <div className="site-loader__cat-wrap">
            <div className="site-loader__cat" />
          </div>
        ) : null}
      </div>

      <style>{`
        .site-loader {
          /* Dark is the default theme; light overrides below. */
          --sl-panel: 10, 10, 12;
          --sl-glow: #e0fbff;
          position: fixed;
          inset: 0;
          z-index: 2147483000;
          pointer-events: none;
          overflow: hidden;
        }
        /* Light theme: a warm CREAM panel (not white) so it reads as a
           distinct surface over the site's off-white background, with the
           black cat kept high-contrast against it. */
        html.light .site-loader {
          --sl-panel: 244, 236, 218;
          --sl-glow: #4a3a26;
        }

        .site-loader__panel {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 100%;
          transform: translate3d(0, 0, 0);
          will-change: transform;
          backface-visibility: hidden;
          background: linear-gradient(
            to bottom,
            rgba(var(--sl-panel), 0) 0px,
            rgba(var(--sl-panel), 0.92) 56px,
            rgba(var(--sl-panel), 0.97) 100%
          );
        }
        .site-loader__panel--static { animation: siteLoaderStaticFade 0.38s ease forwards; }
        @keyframes siteLoaderStaticFade { to { opacity: 0; } }

        /* The cat rides the reveal edge with its front (upraised) legs at the
           line. translateY here is how far the cat's own top sits ABOVE the
           edge, as a fraction of its height: a smaller value keeps more of
           the cat below the edge (on the panel) with only the top -- the
           front-paw area -- crossing the line, so it reads as the cat
           gripping and clawing the top edge with its body hanging below,
           rather than the edge cutting across its back legs (which -50%,
           i.e. mid-body, did). */
        .site-loader__cat-wrap {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translate(-50%, -25%);
          animation: siteLoaderClaw 0.62s ease-in-out infinite;
        }
        .site-loader__cat {
          width: clamp(6.5rem, 21vw, 12rem);
          aspect-ratio: 1024 / 1536;
          background: url("/loading-cat-scratch.svg") center / contain no-repeat;
          filter: drop-shadow(0 0 0.55rem var(--sl-glow)) drop-shadow(0 5px 12px rgba(0,0,0,0.4));
          opacity: 0.99;
        }
        @keyframes siteLoaderClaw {
          0%, 100% { transform: translate(-50%, -25%) rotate(-2.4deg); }
          50% { transform: translate(-50%, -25%) rotate(2.4deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .site-loader__cat-wrap { animation: none; }
        }
      `}</style>
    </div>
  );
}
