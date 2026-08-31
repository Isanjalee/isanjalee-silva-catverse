"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeather } from "@/components/WeatherProvider";

type PeekabooCat = {
  id: string;
  // vertical anchor as a percentage of viewport height; the cat peeks in
  // from the RIGHT edge at this height
  top: number;
};

export default function BackgroundCats() {
  const [activeCat, setActiveCat] = useState<PeekabooCat | null>(null);
  const { isRainy } = useWeather();

  useEffect(() => {
    if (isRainy) {
      return;
    }

    const interval = setInterval(() => {
      // Keep it in the upper-to-middle band so it never overlaps the fixed
      // copyright badge in the bottom-right corner.
      const top = 16 + Math.random() * 40;
      setActiveCat({ id: Math.random().toString(), top });

      setTimeout(() => {
        setActiveCat(null);
      }, 4200 + Math.random() * 1600);
    }, 12000 + Math.random() * 8000);

    return () => clearInterval(interval);
  }, [isRainy]);

  return (
    <div className="background-cats pointer-events-none fixed inset-0 z-[25] overflow-hidden">
      <AnimatePresence>
        {activeCat && !isRainy ? (
          <motion.div
            key={activeCat.id}
            // Peeks in from the RIGHT edge: the cat art is rotated -90deg so
            // its head (originally pointing up) points LEFT into the page,
            // and it slides in horizontally from off-screen right, holds,
            // then slides back out.
            initial={{ x: 190 }}
            animate={{ x: 0 }}
            exit={{ x: 190 }}
            transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.9 }}
            className="background-cats__peek"
            style={{ top: `${activeCat.top}%` }}
          >
            <div className="background-cats__peek-img" />
          </motion.div>
        ) : null}
      </AnimatePresence>
      <style>{`
        .background-cats__peek {
          position: absolute;
          /* nudged off the right edge so only the head/front peeks in; the
             parent's overflow-hidden clips the rest cleanly */
          right: -2.2rem;
          filter: drop-shadow(-6px 0 22px rgba(0, 0, 0, 0.28));
        }
        .background-cats__peek-img {
          width: clamp(8rem, 16vw, 12rem);
          aspect-ratio: 892 / 486;
          background: url("/peek-cat.svg") center / contain no-repeat;
          /* pivot near the front paws (which point up-left of the box once
             rotated) so the wiggle reads as the cat pawing at the edge, not
             just tilting its whole self */
          transform-origin: 38% 62%;
          /* base rotation (peek in from the right) + a hand-authored
             scratch-then-peek loop: a quick clawing flurry on entry, then it
             settles into a slow idle sway. Duration ~ the on-screen dwell, so
             it mostly plays once per appearance. */
          animation: bgCatScratchPeek 4.6s ease-in-out infinite;
        }
        @keyframes bgCatScratchPeek {
          /* --- scratch flurry (first ~26%) --- */
          0%   { transform: rotate(-90deg); }
          5%   { transform: rotate(-95.5deg); }
          10%  { transform: rotate(-85.5deg); }
          15%  { transform: rotate(-94deg); }
          20%  { transform: rotate(-87deg); }
          26%  { transform: rotate(-90.5deg); }
          /* --- settle into a slow idle sway --- */
          32%  { transform: rotate(-90deg); }
          55%  { transform: rotate(-92deg); }
          80%  { transform: rotate(-88.4deg); }
          100% { transform: rotate(-90deg); }
        }
        /* The art is solid black. That reads on the LIGHT theme (dark ink on
           the cream bg), but on the default DARK theme a black cat would
           vanish -- so invert it to white there, matching --cat-color. */
        .dark .background-cats__peek-img { filter: invert(1); }

        @media (prefers-reduced-motion: reduce) {
          .background-cats__peek-img { animation: none; transform: rotate(-90deg); }
        }
      `}</style>
    </div>
  );
}
