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
          transform-origin: 50% 50%;
          /* base rotation + a gentle head sway so it feels alive */
          animation: bgCatPeekSway 2.6s ease-in-out infinite;
        }
        @keyframes bgCatPeekSway {
          0%, 100% { transform: rotate(-92.4deg); }
          50% { transform: rotate(-87.6deg); }
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
