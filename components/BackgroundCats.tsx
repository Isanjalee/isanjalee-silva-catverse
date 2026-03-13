"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type PeekabooCat = {
  id: string;
  offset: number;
};

function CatFace() {
  return (
    <svg width="160" height="133" viewBox="0 0 84 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="46" width="14" height="18" rx="7" style={{ fill: "var(--cat-color)" }} />
      <rect x="52" y="46" width="14" height="18" rx="7" style={{ fill: "var(--cat-color)" }} />
      <path d="M42 50 C20 50 16 34 16 24 C16 12 28 8 42 8 C56 8 68 12 68 24 C68 34 64 50 42 50 Z" style={{ fill: "var(--cat-color)" }} />
      <polygon points="18,24 10,2 32,10" style={{ fill: "var(--cat-color)" }} />
      <polygon points="66,24 74,2 52,10" style={{ fill: "var(--cat-color)" }} />
      <polygon points="19,19 14,6 29,12" fill="var(--color-bg)" opacity="0.10" />
      <polygon points="65,19 70,6 55,12" fill="var(--color-bg)" opacity="0.10" />
      <g className="catverse-blink" style={{ transformOrigin: "center 26px" }}>
        <path d="M26 26 Q 30 22 34 26 Q 30 28 26 26 Z" fill="var(--color-bg)" />
        <path d="M50 26 Q 54 22 58 26 Q 54 28 50 26 Z" fill="var(--color-bg)" />
        <circle cx="28" cy="25" r="1.5" style={{ fill: "var(--cat-color)" }} />
        <circle cx="52" cy="25" r="1.5" style={{ fill: "var(--cat-color)" }} />
      </g>
      <polygon
        points="42,33 40,31 44,31"
        fill="var(--color-bg)"
        opacity="0.6"
        className="catverse-nose-twitch"
      />
      <line x1="22" y1="56" x2="22" y2="60" stroke="var(--color-bg)" strokeWidth="1" opacity="0.2" strokeLinecap="round" />
      <line x1="25" y1="56" x2="25" y2="60" stroke="var(--color-bg)" strokeWidth="1" opacity="0.2" strokeLinecap="round" />
      <line x1="28" y1="56" x2="28" y2="60" stroke="var(--color-bg)" strokeWidth="1" opacity="0.2" strokeLinecap="round" />
      <line x1="56" y1="56" x2="56" y2="60" stroke="var(--color-bg)" strokeWidth="1" opacity="0.2" strokeLinecap="round" />
      <line x1="59" y1="56" x2="59" y2="60" stroke="var(--color-bg)" strokeWidth="1" opacity="0.2" strokeLinecap="round" />
      <line x1="62" y1="56" x2="62" y2="60" stroke="var(--color-bg)" strokeWidth="1" opacity="0.2" strokeLinecap="round" />
    </svg>
  );
}

export default function BackgroundCats() {
  const [activeCat, setActiveCat] = useState<PeekabooCat | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const offset = 20 + Math.random() * 60;
      setActiveCat({ id: Math.random().toString(), offset });

      setTimeout(() => {
        setActiveCat(null);
      }, 4500 + Math.random() * 1500);
    }, 12000 + Math.random() * 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <AnimatePresence>
        {activeCat ? (
          <motion.div
            key={activeCat.id}
            initial={{ x: 100, rotate: -90 }}
            animate={{ x: -72, rotate: -90 }}
            exit={{ x: 100, rotate: -90 }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="absolute right-[-100px] opacity-90"
            style={{ top: `${activeCat.offset}%`, marginTop: -65 }}
          >
            <div className="drop-shadow-[0_12px_32px_rgba(0,0,0,0.3)]">
              <CatFace />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <style>{`
        @keyframes catverseBlink {
          0%, 8%, 100% { transform: scaleY(1); }
          4% { transform: scaleY(0.1); }
        }
        .catverse-blink { animation: catverseBlink 4s infinite; }
        @keyframes catverseNoseTwitch {
          0%, 90%, 100% { transform: translateY(0); }
          95% { transform: translateY(-1px); }
        }
        .catverse-nose-twitch { animation: catverseNoseTwitch 3s infinite; }
      `}</style>
    </div>
  );
}
