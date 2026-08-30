"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeather } from "@/components/WeatherProvider";

type PeekabooCat = {
  id: string;
  // horizontal anchor as a percentage of the viewport width; the cat peeks
  // up from the bottom edge at this position
  left: number;
};

export default function BackgroundCats() {
  const [activeCat, setActiveCat] = useState<PeekabooCat | null>(null);
  const { isRainy } = useWeather();

  useEffect(() => {
    if (isRainy) {
      return;
    }

    const interval = setInterval(() => {
      // Favour the right-of-centre area (where the peeking cat used to live)
      // but let it wander a little; kept left of ~80% so it never collides
      // with the fixed copyright badge in the bottom-right corner.
      const left = 46 + Math.random() * 32;
      setActiveCat({ id: Math.random().toString(), left });

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
            // Peeks UP from the bottom edge in its natural upright
            // orientation: starts fully below the fold, springs up so the
            // head/ears/eyes clear the edge, holds, then slips back down.
            initial={{ y: "104%" }}
            animate={{ y: "30%" }}
            exit={{ y: "104%" }}
            transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.9 }}
            className="background-cats__peek absolute bottom-0"
            style={{
              left: `${activeCat.left}%`,
              transform: "translateX(-50%)",
            }}
          >
            <motion.img
              src="/peek-cat.svg"
              alt=""
              aria-hidden="true"
              className="background-cats__peek-img"
              // a soft settle wobble once it's popped up, so it feels alive
              animate={{ rotate: [0, -2.4, 1.6, -1, 0] }}
              transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
      <style>{`
        .background-cats__peek {
          filter: drop-shadow(0 -6px 22px rgba(0, 0, 0, 0.28));
        }
        .background-cats__peek-img {
          display: block;
          width: clamp(7rem, 15vw, 12rem);
          height: auto;
          transform-origin: 50% 100%;
        }
        /* The art is solid black. That reads fine on the LIGHT theme (dark
           ink on the site's cream bg, matching --cat-color: #1c1c1e), but on
           the default DARK theme a black cat would vanish -- so invert it to
           white there, matching --cat-color: #ffffff. */
        .dark .background-cats__peek-img {
          filter: invert(1);
        }
      `}</style>
    </div>
  );
}
