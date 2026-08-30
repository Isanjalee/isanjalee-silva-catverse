"use client";

import { useEffect, useState } from "react";

// One splash screen per real page load (not per client-side route change --
// this lives in the root layout, which App Router keeps mounted across
// navigations, so it only remounts on an actual browser reload). Hides
// itself the moment the page has actually finished loading (or after a
// generous cap, in case "load" never fires for some reason) so it never
// blocks the site longer than it has to.
const MAX_VISIBLE_MS = 2200;
const FADE_MS = 480;

export default function SiteLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let hideTimer = 0;
    const startFadeOut = () => {
      window.clearTimeout(hideTimer);
      setFading(true);
      hideTimer = window.setTimeout(() => setVisible(false), FADE_MS);
    };

    if (document.readyState === "complete") {
      startFadeOut();
      return;
    }

    const maxTimer = window.setTimeout(startFadeOut, MAX_VISIBLE_MS);
    window.addEventListener("load", startFadeOut, { once: true });

    return () => {
      window.clearTimeout(maxTimer);
      window.clearTimeout(hideTimer);
      window.removeEventListener("load", startFadeOut);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`site-loader${fading ? " site-loader--fade" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="site-loader__cat" aria-hidden="true" />
      <p className="site-loader__label">
        Loading<span className="site-loader__dots" aria-hidden="true" />
      </p>

      <style>{`
        .site-loader {
          position: fixed;
          inset: 0;
          z-index: 2147483000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(0.75rem, 2.5vh, 1.5rem);
          background: #0b0b0d;
          opacity: 1;
          transition: opacity ${FADE_MS}ms ease;
        }
        .site-loader--fade {
          opacity: 0;
          pointer-events: none;
        }
        .site-loader__cat {
          width: clamp(9rem, 32vw, 18rem);
          aspect-ratio: 1024 / 1536;
          background: url("/loading-cat-scratch.svg") center / contain no-repeat;
          animation: siteLoaderScratch 1.3s ease-in-out infinite;
        }
        @keyframes siteLoaderScratch {
          0%, 100% { transform: translateY(-6%); }
          50% { transform: translateY(6%); }
        }
        .site-loader__label {
          font-family: "Cascadia Code", "JetBrains Mono", ui-monospace, monospace;
          font-size: clamp(0.7rem, 1.6vw, 0.9rem);
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #e0fbff;
          margin: 0;
        }
        .site-loader__dots::after {
          content: "";
          animation: siteLoaderDots 1.3s steps(4, end) infinite;
        }
        @keyframes siteLoaderDots {
          0% { content: ""; }
          25% { content: "."; }
          50% { content: ".."; }
          75% { content: "..."; }
          100% { content: ""; }
        }
        @media (prefers-reduced-motion: reduce) {
          .site-loader__cat { animation: none; }
          .site-loader__dots::after { animation: none; content: "..."; }
        }
      `}</style>
    </div>
  );
}
