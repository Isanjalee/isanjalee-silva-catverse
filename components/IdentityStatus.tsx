"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";

const LOAD_DURATION_S = 5.2;
const BADGE_DURATION_MS = 30000;
const SCRATCH_COUNT = 12;

function buildScratchMarks(progress: number) {
  const marks: { x: number; opacity: number }[] = [];
  const filled = Math.floor(progress * SCRATCH_COUNT);
  for (let i = 0; i < filled; i++) {
    marks.push({
      x: (i / SCRATCH_COUNT) * 100,
      opacity: 0.3 + (i % 3) * 0.12,
    });
  }
  return marks;
}

export default function IdentityStatus() {
  const [phase, setPhase] = useState<"loading" | "badges">("loading");
  const [cycle, setCycle] = useState(0);
  const [progress, setProgress] = useState(0);
  const [scratchMarks, setScratchMarks] = useState<
    { x: number; opacity: number }[]
  >([]);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const animate = useCallback((timestamp: number) => {
    if (!startRef.current) startRef.current = timestamp;
    const elapsed = (timestamp - startRef.current) / 1000;
    const t = Math.min(elapsed / LOAD_DURATION_S, 1);
    const eased = 1 - Math.pow(1 - t, 2.6);

    setProgress(eased);
    setScratchMarks(buildScratchMarks(eased));

    if (t < 1) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      // finished — switch to badges after a short pause
      setTimeout(() => setPhase("badges"), 600);
    }
  }, []);

  /* start / restart the scratch animation */
  useEffect(() => {
    if (phase !== "loading") return;
    startRef.current = null;
    setProgress(0);
    setScratchMarks([]);
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, cycle, animate]);

  /* badge → loading cycle */
  useEffect(() => {
    if (phase !== "badges") return;
    const timeout = window.setTimeout(() => {
      setCycle((v) => v + 1);
      setPhase("loading");
    }, BADGE_DURATION_MS);
    return () => window.clearTimeout(timeout);
  }, [phase]);

  const isDone = progress >= 0.99;
  const pawX = progress * 100;

  /* ── Badges phase ── */
  if (phase === "badges") {
    return (
      <motion.div
        className="identity-badges"
        aria-label="Profile badges"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="identity-badge identity-badge--neutral">
          Enterprise Software
        </span>
        <span className="identity-badge identity-badge--blue">
          IFS Cloud Experience
        </span>
        <span className="identity-badge identity-badge--neutral">
          Production Systems
        </span>
        <span className="identity-badge identity-badge--green">
          Open to Remote Roles
        </span>
        <span className="identity-badge identity-badge--amber">
          Open to Collaboration
        </span>
        <span className="identity-badge identity-badge--neutral">
          Sri Lanka
        </span>
        <span className="identity-badge identity-badge--blue">GMT +5:30</span>
      </motion.div>
    );
  }

  /* ── Loading phase — cat scratch ── */
  return (
    <div
      key={cycle}
      className="identity-loader"
      role="img"
      aria-label="Cat scratching progress bar"
    >
      {/* Track with paw */}
      <div className="identity-loader__stage">
        {/* ── Horizontal Cat Paw ── */}
        <motion.div
          className="identity-loader__paw"
          style={{ left: `${pawX}%` }}
          animate={
            isDone
              ? { x: 12, opacity: 0 }
              : {
                  x: [0, 3, -2, 3, 0],
                  y: [0, -1, 1, -1, 0],
                }
          }
          transition={
            isDone
              ? { duration: 0.45, ease: "easeOut" }
              : { duration: 0.18, repeat: Infinity, ease: "linear" }
          }
        >
          <svg
            width="82"
            height="36"
            viewBox="0 0 82 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="identity-loader__paw-svg"
            style={{ transform: "scaleX(-1)" }}
          >
            {/* Arm — horizontal foreleg reaching right */}
            <rect
              x="0"
              y="8"
              width="50"
              height="20"
              rx="10"
              fill="var(--cat-scratch-paw)"
            />
            {/* Fur stripes on arm */}
            <line
              x1="12" y1="13" x2="12" y2="23"
              stroke="var(--cat-scratch-fur)"
              strokeWidth="0.7" strokeLinecap="round" opacity="0.2"
            />
            <line
              x1="24" y1="12" x2="24" y2="24"
              stroke="var(--cat-scratch-fur)"
              strokeWidth="0.7" strokeLinecap="round" opacity="0.18"
            />
            <line
              x1="36" y1="13" x2="36" y2="23"
              stroke="var(--cat-scratch-fur)"
              strokeWidth="0.7" strokeLinecap="round" opacity="0.15"
            />

            {/* Main paw pad */}
            <ellipse cx="62" cy="18" rx="14" ry="13" fill="var(--cat-scratch-paw)" />

            {/* Toe beans — three toes */}
            <ellipse cx="72" cy="10" rx="7" ry="6.5" fill="var(--cat-scratch-paw)" />
            <ellipse cx="72" cy="26" rx="7" ry="6.5" fill="var(--cat-scratch-paw)" />
            <ellipse cx="76" cy="18" rx="6" ry="6" fill="var(--cat-scratch-paw)" />

            {/* Pink paw pad (central) */}
            <ellipse cx="62" cy="18" rx="6.5" ry="5.5" fill="var(--cat-scratch-pad)" />

            {/* Pink toe pads */}
            <ellipse cx="72" cy="10.5" rx="3.2" ry="3" fill="var(--cat-scratch-pad)" />
            <ellipse cx="72" cy="25.5" rx="3.2" ry="3" fill="var(--cat-scratch-pad)" />
            <ellipse cx="76" cy="18" rx="2.8" ry="2.8" fill="var(--cat-scratch-pad)" />

            {/* Claws — extending right from toes */}
            <motion.g
              animate={isDone ? { opacity: 0 } : { opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.22, repeat: Infinity }}
            >
              <line x1="78" y1="8" x2="82" y2="5" stroke="var(--cat-scratch-claw)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="82" y1="18" x2="82" y2="18" stroke="var(--cat-scratch-claw)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="78" y1="28" x2="82" y2="31" stroke="var(--cat-scratch-claw)" strokeWidth="1.5" strokeLinecap="round" />
            </motion.g>
          </svg>
        </motion.div>

        {/* Track bar */}
        <div className="identity-loader__track" aria-hidden="true">
          {/* Scratch marks */}
          {scratchMarks.map((mark, i) => (
            <div
              key={i}
              className="identity-loader__scratch"
              style={{ left: `${mark.x}%`, opacity: mark.opacity }}
            />
          ))}

          {/* Fill */}
          <div
            className="identity-loader__fill identity-loader__fill--live"
            style={{ width: `${pawX}%` }}
          />
        </div>
      </div>

      {/* Label */}
      <div className="identity-loader__label">
        {isDone ? "PURRFECT! ✨" : "SCRATCHING..."}
      </div>
    </div>
  );
}
