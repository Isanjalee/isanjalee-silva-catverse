"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const MESSAGES = [
  "Refactoring in progress...",
  "Optimizing architecture...",
  "Training neural mice...",
  "Squashing bugs (gently)...",
  "Brewing digital catnip...",
  "Perfecting the purr-fect UI...",
];

export default function InProgressCat() {
  const [bubble, setBubble] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTap = () => {
    const randomMsg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    setBubble(randomMsg);
    // Auto-hide bubble after 3 seconds
    setTimeout(() => setBubble(null), 3000);
  };

  if (!mounted) return null;

  return (
    <div className="relative flex flex-col items-center justify-center py-12">
      {/* Code Bits Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 100, x: Math.random() * 200 - 100, opacity: 0, scale: 0.5 }}
            animate={{ 
              y: -150, 
              opacity: [0, 0.4, 0],
              scale: [0.5, 1, 0.8]
            }}
            transition={{ 
              duration: 4 + Math.random() * 4, 
              repeat: Infinity, 
              delay: i * 1.5 
            }}
            className="absolute left-1/2 bottom-1/2 text-primary/20 font-mono text-sm select-none"
          >
            {["{ }", "=>", "()", ";", "import", "const"][i % 6]}
          </motion.div>
        ))}
      </div>

      <div className="relative cursor-pointer group" onClick={handleTap}>
        {/* Interaction Bubble */}
        <AnimatePresence>
          {bubble && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: -20, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.8 }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-full shadow-xl"
            >
              {bubble}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 border-r border-b border-zinc-800 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Coding Cat SVG - Harmonized with BackgroundCats Style */}
        <svg width="240" height="200" viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
          {/* Desk Base */}
          <rect x="20" y="170" width="200" height="6" rx="3" fill="#2d2d2d" />
          
          {/* Laptop Side View */}
          <path d="M140 170 L210 170 L195 100 L135 100 Z" fill="#1a1a1a" stroke="#333" strokeWidth="2" />
          {/* Laptop Screen (Glow) */}
          <motion.path 
            d="M140 110 L190 110 L200 165 L145 165 Z" 
            fill="url(#screenGlow)"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="screenGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Cat Body (Original Style) */}
          <path d="M35 170 C35 110 95 110 95 170 Z" fill="var(--cat-color)" />
          
          {/* Cat Head (Official Background Cat Silhouette) */}
          <g>
            <path d="M92 120 C70 120 66 104 66 94 C66 82 78 78 92 78 C106 78 118 82 118 94 C118 104 114 120 92 120 Z" fill="var(--cat-color)" />
            {/* Ears (Pointy Original Style) */}
            <polygon points="68,94 60,72 82,80" fill="var(--cat-color)" />
            <polygon points="116,94 124,72 102,80" fill="var(--cat-color)" />
            
            {/* Blinking Eyes (Official Alignment) */}
            <motion.g 
              animate={{ scaleY: [1, 1, 0.1, 1, 1] }} 
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.85, 0.9, 1] }}
              style={{ transformOrigin: "92px 96px" }}
            >
              <circle cx="82" cy="96" r="2.2" fill="var(--color-bg)" />
              <circle cx="102" cy="96" r="2.2" fill="var(--color-bg)" />
            </motion.g>

            {/* Nose (Subtle) */}
            <polygon points="92,104 90,102 94,102" fill="var(--color-bg)" opacity="0.6" />
          </g>

          {/* Paws (Official Pill-Style from BackgroundCats) */}
          <rect x="120" y="155" width="16" height="20" rx="8" fill="var(--cat-color)" />
          <rect x="135" y="162" width="16" height="20" rx="8" fill="var(--cat-color)" />

          {/* Tail wagging */}
          <motion.path 
            d="M45 165 Q 10 180 25 145" 
            stroke="var(--cat-color)" 
            strokeWidth="5" 
            strokeLinecap="round" 
            fill="none"
            animate={{ rotate: [-6, 6, -6] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "45px 165px" }}
          />
        </svg>

        {/* Floating Code Bits Emitting from Laptop */}
        <div className="absolute top-24 right-12 w-16 h-16 pointer-events-none">
          <motion.div
            animate={{ 
              opacity: [0, 1, 0],
              y: [0, -30],
              x: [0, 10]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[10px] font-mono text-indigo-400 opacity-60"
          >
            typing...
          </motion.div>
        </div>
      </div>
    </div>
  );
}
