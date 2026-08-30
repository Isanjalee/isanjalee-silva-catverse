"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const subscribe = () => () => {};

// Fake-progress tuning: creeps toward CAP while waiting on the real page,
// then races the rest of the way to 1 once it's actually ready. This is
// what "not a fixed timer" means in practice for a single page load --
// there's no browser API for a true 0-100% "page ready" percentage, so the
// curve is shaped to *feel* like real progress while still being gated on
// an actual readiness signal, not an arbitrary duration.
const CAP = 0.92;
const CREEP_TAU_MS = 650;
const FINISH_MS = 420;
const HOLD_AFTER_DONE_MS = 220;

export default function SiteLoader() {
  const hasHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const { resolvedTheme } = useTheme();
  const isDark = !hasHydrated || resolvedTheme === "dark";

  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  // One-time synchronous read of a browser API on mount, not a subscription
  // to something that changes -- a lazy initializer is the idiomatic way to
  // do that (matches the pattern already used elsewhere in this codebase).
  const [reduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const readyRef = useRef(false);
  const progressRef = useRef(0);

  useEffect(() => {
    if (reduceMotion) {
      // Still show something, but skip the sweeping motion entirely --
      // a brief hold then a plain fade, matching how the rest of the site
      // handles reduced motion elsewhere.
      const t = window.setTimeout(() => setVisible(false), 380);
      return () => window.clearTimeout(t);
    }

    let raf = 0;
    const start = performance.now();
    let finishStart: number | null = null;

    const markReady = () => {
      readyRef.current = true;
    };
    if (document.readyState === "complete") {
      markReady();
    } else {
      window.addEventListener("load", markReady, { once: true });
    }

    const tick = (now: number) => {
      if (!readyRef.current) {
        const elapsed = now - start;
        const next = CAP * (1 - Math.exp(-elapsed / CREEP_TAU_MS));
        progressRef.current = next;
        setProgress(next);
        raf = requestAnimationFrame(tick);
        return;
      }

      if (finishStart === null) finishStart = now;
      const t = Math.min(1, (now - finishStart) / FINISH_MS);
      const next = progressRef.current + (1 - progressRef.current) * t;
      setProgress(next);

      if (t >= 1) {
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
  // initializer already reads the real system preference on the client's
  // very first render, before hasHydrated flips true, which would mismatch
  // whatever the server rendered (always "no preference detected"). Using
  // the effects to branch on the raw value is fine -- those only ever run
  // post-mount -- but anything affecting JSX output has to wait.
  const reduceMotionEffective = hasHydrated && reduceMotion;

  // The scrim covers the not-yet-revealed part of the screen, anchored to
  // the bottom and shrinking as progress advances -- its top edge (where
  // the cat sits) is the actual reveal line. Everything above it is the
  // real page with nothing drawn over it at all, so "revealed" always
  // means genuinely, fully visible, not just faded in.
  const scrimHeightPct = reduceMotionEffective ? 0 : (1 - progress) * 100;
  const bg = isDark ? "10, 10, 12" : "253, 251, 247";
  const fg = isDark ? "#e0fbff" : "#164e63";

  return (
    <div className="site-loader" aria-hidden="true">
      <div
        className="site-loader__scrim"
        style={{
          height: `${scrimHeightPct}%`,
          background: `linear-gradient(to bottom, rgba(${bg},0) 0px, rgba(${bg},0.86) 48px, rgba(${bg},0.86) 100%)`,
        }}
      >
        {!reduceMotionEffective ? (
          <div className="site-loader__cat-wrap">
            <div className="site-loader__cat" style={{ color: fg }} />
          </div>
        ) : null}
      </div>

      <style>{`
        .site-loader {
          position: fixed;
          inset: 0;
          z-index: 2147483000;
          pointer-events: none;
        }
        .site-loader__scrim {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: visible;
        }
        .site-loader__cat-wrap {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translate(-50%, -52%);
          animation: siteLoaderClaw 0.34s ease-in-out infinite;
        }
        .site-loader__cat {
          width: clamp(6rem, 20vw, 11rem);
          aspect-ratio: 1024 / 1536;
          background: url("/loading-cat-scratch.svg") center / contain no-repeat;
          filter: drop-shadow(0 0 1.4rem currentColor) drop-shadow(0 6px 14px rgba(0,0,0,0.45));
          opacity: 0.98;
        }
        @keyframes siteLoaderClaw {
          0%, 100% { transform: translate(-50%, -52%) rotate(-3deg); }
          50% { transform: translate(-50%, -52%) rotate(3deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .site-loader__scrim { transition: none; }
        }
      `}</style>
    </div>
  );
}
