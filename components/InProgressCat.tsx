"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const MESSAGES = [
  "Refactoring in progress...",
  "Optimizing architecture...",
  "Training neural mice...",
  "Polishing pixel perfection...",
  "Syncing paws with production...",
  "Calibrating whisker logic...",
];

const CODE_PARTICLES = [
  { x: -170, duration: 5.4, delay: 0 },
  { x: -130, duration: 6.2, delay: 0.65 },
  { x: -90, duration: 5.7, delay: 1.3 },
  { x: -45, duration: 6.6, delay: 1.95 },
  { x: -5, duration: 5.1, delay: 2.6 },
  { x: 35, duration: 6.1, delay: 3.25 },
  { x: 75, duration: 5.8, delay: 3.9 },
  { x: 115, duration: 6.5, delay: 4.55 },
  { x: 150, duration: 5.3, delay: 5.2 },
  { x: 180, duration: 6.7, delay: 5.85 },
];

export default function InProgressCat() {
  const [bubble, setBubble] = useState<string | null>(null);
  const [isReacting, setIsReacting] = useState(false);
  const [typedText, setTypedText] = useState("");
  const prompt = 'const page = "coming soon";';

  useEffect(() => {
    let charIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const tick = () => {
      if (charIndex <= prompt.length) {
        setTypedText(prompt.slice(0, charIndex));
        charIndex += 1;
        timeoutId = setTimeout(tick, 85);
      } else {
        timeoutId = setTimeout(() => {
          charIndex = 0;
          tick();
        }, 950);
      }
    };

    tick();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const handleTap = () => {
    const randomMsg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    setBubble(randomMsg);
    setIsReacting(true);
    setTimeout(() => setBubble(null), 2400);
    setTimeout(() => setIsReacting(false), 700);
  };

  return (
    <div className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {CODE_PARTICLES.map((particle, i) => (
          <motion.div
            key={i}
            initial={{ y: 140, x: particle.x, opacity: 0 }}
            animate={{
              y: -170,
              opacity: [0, 0.32, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
            className="absolute left-1/2 bottom-10 select-none font-mono text-[10px] text-zinc-400/50"
          >
            {
              [
                "{ }",
                "()=>{}",
                "const",
                "if()",
                "< />",
                "return",
                "let",
                "npm",
                "&&",
                ";",
              ][i % 10]
            }
          </motion.div>
        ))}
      </div>
      <motion.button
        type="button"
        onClick={handleTap}
        animate={isReacting ? { rotate: [0, 2, -2, 0], y: [0, -2, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="group relative cursor-pointer rounded-3xl p-2"
        aria-label="Tap the cat"
      >
        <AnimatePresence>
          {bubble && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: -18, scale: 1 }}
              exit={{ opacity: 0, y: -28, scale: 0.86 }}
              className="absolute -top-12 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-[var(--color-border)] bg-[var(--color-bg)]/95 px-3 py-1.5 text-xs text-[var(--color-fg)] shadow-2xl"
            >
              {bubble}
              <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-[var(--color-border)] bg-[var(--color-bg)]/95" />
            </motion.div>
          )}
        </AnimatePresence>

        <svg
          width="280"
          height="220"
          viewBox="0 0 280 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_24px_60px_rgba(0,0,0,0.65)]"
        >
          <rect
            x="24"
            y="180"
            width="232"
            height="8"
            rx="4"
            fill="var(--color-fg)"
            opacity="0.35"
          />

          {/* Theme sky detail: top-right of laptop */}
          <g>
            <circle cx="246" cy="58" r="14" fill="#fbbf24" style={{ opacity: "calc(var(--inprogress-sun-opacity) * 0.95)" }} />
            <circle cx="246" cy="58" r="20" fill="#facc15" style={{ opacity: "calc(var(--inprogress-sun-opacity) * 0.25)" }} />
          </g>
          <g>
            <circle cx="246" cy="58" r="14" fill="#f6f1c4" style={{ opacity: "calc(var(--inprogress-moon-opacity) * 0.9)" }} />
            <circle cx="251" cy="54" r="12" fill="var(--color-bg)" style={{ opacity: "var(--inprogress-moon-opacity)" }} />
          </g>

          {/* Laptop */}
          <rect
            x="144"
            y="99"
            width="95"
            height="72"
            rx="8"
            fill="var(--color-fg)"
          />
          <rect
            x="148"
            y="103"
            width="87"
            height="64"
            rx="6"
            fill="var(--color-fg)"
            opacity="0.45"
          />
          <motion.rect
            x="153"
            y="108"
            width="77"
            height="53"
            rx="5"
            fill="url(#screenGlow)"
            animate={{ opacity: [0.78, 1, 0.78] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle
            cx="191.5"
            cy="106"
            r="1.2"
            fill="var(--color-bg)"
            opacity="0.75"
          />
          <rect
            x="132"
            y="171"
            width="125"
            height="8.5"
            rx="4.25"
            fill="var(--color-fg)"
            opacity="0.8"
          />
          <rect
            x="173"
            y="172.5"
            width="40"
            height="3.6"
            rx="1.8"
            fill="var(--color-bg)"
            opacity="0.22"
          />
          <rect
            x="167"
            y="179.5"
            width="7"
            height="5.5"
            rx="2.5"
            fill="var(--color-bg)"
            opacity="0.9"
          />

          <text
            x="191.5"
            y="132"
            textAnchor="middle"
            className="fill-cyan-100/90 font-mono text-[5.2px]"
          >
            {typedText}
          </text>
          <motion.rect
            x={154 + Math.min(typedText.length * 2.95, 72)}
            y="128.5"
            width="2"
            height="6"
            rx="1"
            fill="#b9ffff"
            animate={{ opacity: [0.1, 1, 0.1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />

          <defs>
            <linearGradient id="screenGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#55d2ff" stopOpacity="0.56" />
              <stop offset="45%" stopColor="#3d7ff4" stopOpacity="0.34" />
              <stop offset="100%" stopColor="#182849" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Cat */}
          <path d="M44 178 C44 111 116 111 116 178 Z" fill="var(--cat-color)" />
          <g>
            <path
              d="M94 131 C67 131 62 111 62 100 C62 84 77 80 94 80 C111 80 126 84 126 100 C126 111 121 131 94 131 Z"
              fill="var(--cat-color)"
            />
            <polygon points="65,101 56,75 81,84" fill="var(--cat-color)" />
            <polygon points="123,101 132,75 107,84" fill="var(--cat-color)" />
            <polygon
              points="66,97 61,83 75,88"
              fill="var(--color-bg)"
              opacity="0.12"
            />
            <polygon
              points="122,97 127,83 113,88"
              fill="var(--color-bg)"
              opacity="0.12"
            />

            <motion.g
              animate={{ scaleY: [1, 1, 0.12, 1, 1] }}
              transition={{
                duration: 4.4,
                repeat: Infinity,
                times: [0, 0.83, 0.88, 1],
              }}
              style={{ transformOrigin: "94px 102px" }}
            >
              <path
                d="M76 102 Q 81 97 86 102 Q 81 104 76 102 Z"
                fill="var(--color-bg)"
              />
              <path
                d="M102 102 Q 107 97 112 102 Q 107 104 102 102 Z"
                fill="var(--color-bg)"
              />
              <circle cx="79.5" cy="101.1" r="1.3" fill="var(--cat-color)" />
              <circle cx="105.5" cy="101.1" r="1.3" fill="var(--cat-color)" />
            </motion.g>

            <polygon
              points="94,111 92,109 96,109"
              fill="var(--color-bg)"
              opacity="0.65"
            />
          </g>

          <motion.path
            d="M55 172 Q 14 191 31 146"
            stroke="var(--cat-color)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            animate={{ rotate: [-5, 7, -5] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "55px 172px" }}
          />
        </svg>
      </motion.button>
    </div>
  );
}
