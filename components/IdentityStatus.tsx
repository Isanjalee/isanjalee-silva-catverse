"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const LOAD_DURATION_S = 5.2;
const BADGE_DURATION_MS = 30000;

export default function IdentityStatus() {
  const [phase, setPhase] = useState<"loading" | "badges">("loading");
  const [cycle, setCycle] = useState(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const completionTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== "loading") return;
    completionTimeoutRef.current = null;
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = (timestamp - start) / 1000;
      const t = Math.min(elapsed / LOAD_DURATION_S, 1);
      const eased = 1 - Math.pow(1 - t, 2.6);

      setProgress(eased);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else if (!completionTimeoutRef.current) {
        completionTimeoutRef.current = window.setTimeout(() => {
          setPhase("badges");
        }, 460);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (completionTimeoutRef.current) {
        window.clearTimeout(completionTimeoutRef.current);
      }
    };
  }, [phase, cycle]);

  useEffect(() => {
    if (phase !== "badges") return;
    const timeout = window.setTimeout(() => {
      setProgress(0);
      setCycle((v) => v + 1);
      setPhase("loading");
    }, BADGE_DURATION_MS);
    return () => window.clearTimeout(timeout);
  }, [phase]);

  const percent = Math.round(progress * 100);
  const isDone = percent >= 99;
  const markerLeft = Math.min(percent, 100);
  const statusLabel =
    percent < 34
      ? "Mapping profile signals"
      : percent < 68
        ? "Calibrating experience graph"
        : "Finalizing identity status";

  if (phase === "badges") {
    return (
      <motion.div
        className="identity-badges"
        aria-label="Profile badges"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <span className="identity-badge identity-badge--neutral">
          Clean Architecture
        </span>
        <span className="identity-badge identity-badge--blue">
          AI Product Focus
        </span>
        <span className="identity-badge identity-badge--neutral">
          Full-Stack Ownership
        </span>
        <span className="identity-badge identity-badge--green">
          Performance Tuning
        </span>
        <span className="identity-badge identity-badge--amber">
          Secure API Design
        </span>
      </motion.div>
    );
  }

  return (
    <div
      key={cycle}
      className="identity-loader identity-loader--modern"
      role="img"
      aria-label="Profile loading progress"
    >
      <div className="identity-loader-modern__rail" aria-hidden="true">
        <motion.div
          className="identity-loader-modern__fill"
          style={{ width: `${percent}%` }}
        />
        <motion.div
          className="identity-loader-modern__orb"
          style={{ left: `calc(${markerLeft}% - 9px)` }}
          animate={isDone ? { scale: 0.84, opacity: 0 } : { scale: [1, 1.14, 1] }}
          transition={isDone ? { duration: 0.4 } : { duration: 0.9, repeat: Infinity }}
        />
      </div>

      <div className="identity-loader-modern__meta">
        <div className="identity-loader__label">
          {isDone ? "READY TO BUILD" : statusLabel}
        </div>
        <div className="identity-loader-modern__pct">{percent}%</div>
      </div>

      <div className="identity-loader-modern__dots" aria-hidden="true">
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            className="identity-loader-modern__dot"
            animate={{ opacity: [0.28, 1, 0.28], y: [0, -1.5, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: dot * 0.12 }}
          />
        ))}
      </div>
    </div>
  );
}
