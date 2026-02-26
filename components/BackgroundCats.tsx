"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Edge = "left" | "right";

type PeekabooCat = {
  id: string;
  edge: Edge;
  offset: number; // percentage along the edge
};

export default function BackgroundCats() {
  const [activeCat, setActiveCat] = useState<PeekabooCat | null>(null);

  useEffect(() => {
    // Randomly spawn a peekaboo cat every few seconds
    const interval = setInterval(() => {
      // Pick a random edge - no "top" to avoid distracting header
      const edges: Edge[] = ["left", "right"];
      const edge = edges[Math.floor(Math.random() * edges.length)];
      
      // Keep offset safely inside screen bounds (20% to 80%)
      const offset = 20 + Math.random() * 60;
      
      setActiveCat({ id: Math.random().toString(), edge, offset });
      
      // Hide the cat after a random amount of time (4 to 6 seconds)
      setTimeout(() => {
        setActiveCat((prev) => null);
      }, 4000 + Math.random() * 2000);
      
    }, 8000 + Math.random() * 5000); // 8-13s interval

    return () => clearInterval(interval);
  }, []);

  // Clean, modern, Mac-like white solid SVG cat head with paws, blinking eyes
  const CatFace = () => (
    <svg width="84" height="60" viewBox="0 0 84 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Paws grabbing the edge */}
      <rect x="18" y="46" width="14" height="18" rx="7" fill="#ffffff" />
      <rect x="52" y="46" width="14" height="18" rx="7" fill="#ffffff" />
      
      {/* Main Head Silhouette */}
      <path d="M42 50 C20 50 16 34 16 24 C16 12 28 8 42 8 C56 8 68 12 68 24 C68 34 64 50 42 50 Z" fill="#ffffff" />
      
      {/* Ears */}
      <polygon points="18,24 10,2 32,10" fill="#ffffff" />
      <polygon points="66,24 74,2 52,10" fill="#ffffff" />
      
      {/* Inner Ear Highlights (Very subtle) */}
      <polygon points="19,19 14,6 29,12" fill="#000000" opacity="0.10" />
      <polygon points="65,19 70,6 55,12" fill="#000000" opacity="0.10" />

      {/* Eyes with blinking animation class */}
      <g className="catverse-blink" style={{ transformOrigin: "center 26px" }}>
        <path d="M26 26 Q 30 22 34 26 Q 30 28 26 26 Z" fill="#000000" />
        <path d="M50 26 Q 54 22 58 26 Q 54 28 50 26 Z" fill="#000000" />
        <circle cx="28" cy="25" r="1.5" fill="#ffffff" />
        <circle cx="52" cy="25" r="1.5" fill="#ffffff" />
      </g>
      
      {/* Tiny Nose */}
      <polygon points="42,33 40,31 44,31" fill="#000000" opacity="0.6" className="catverse-nose-twitch" />
      
      {/* Paw Claws */}
      <line x1="22" y1="56" x2="22" y2="60" stroke="#000" strokeWidth="1" opacity="0.2" strokeLinecap="round" />
      <line x1="25" y1="56" x2="25" y2="60" stroke="#000" strokeWidth="1" opacity="0.2" strokeLinecap="round" />
      <line x1="28" y1="56" x2="28" y2="60" stroke="#000" strokeWidth="1" opacity="0.2" strokeLinecap="round" />
      
      <line x1="56" y1="56" x2="56" y2="60" stroke="#000" strokeWidth="1" opacity="0.2" strokeLinecap="round" />
      <line x1="59" y1="56" x2="59" y2="60" stroke="#000" strokeWidth="1" opacity="0.2" strokeLinecap="round" />
      <line x1="62" y1="56" x2="62" y2="60" stroke="#000" strokeWidth="1" opacity="0.2" strokeLinecap="round" />
    </svg>
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <AnimatePresence>
        {activeCat && (
          <motion.div
            key={activeCat.id}
            initial={getInitialStyle(activeCat.edge)}
            animate={getAnimateStyle(activeCat.edge)}
            exit={getInitialStyle(activeCat.edge)}
            transition={{ type: "spring", stiffness: 90, damping: 22, mass: 1.2 }}
            className="absolute opacity-90"
            style={getPositionStyle(activeCat)}
          >
            {/* Soft, premium beautiful glowing drop-shadow */}
            <div className="drop-shadow-[0_12px_24px_rgba(255,255,255,0.35)]">
               <CatFace />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        @keyframes catverseBlink {
          0%, 8%, 100% { transform: scaleY(1); }
          4% { transform: scaleY(0.1); }
        }
        .catverse-blink {
          animation: catverseBlink 4s infinite;
        }
        @keyframes catverseNoseTwitch {
          0%, 90%, 100% { transform: translateY(0); }
          95% { transform: translateY(-1px); }
        }
        .catverse-nose-twitch {
          animation: catverseNoseTwitch 3s infinite;
        }
      `}</style>
    </div>
  );
}

function getInitialStyle(edge: Edge) {
  // Start offscreen
  switch (edge) {
    case "left": return { x: -30, rotate: 90, scale: 0.9 };
    case "right": return { x: 30, rotate: -90, scale: 0.9 };
  }
}

function getAnimateStyle(edge: Edge) {
  // Slide into view gracefully
  switch (edge) {
    case "left": return { x: 56, rotate: 90, scale: 1 };
    case "right": return { x: -56, rotate: -90, scale: 1 };
  }
}

function getPositionStyle(cat: PeekabooCat) {
  switch (cat.edge) {
    case "left": return { left: -70, top: `${cat.offset}%`, marginTop: -30 };
    case "right": return { right: -70, top: `${cat.offset}%`, marginTop: -30 };
  }
}
