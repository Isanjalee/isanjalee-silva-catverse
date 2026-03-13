"use client";

import { useMemo, useSyncExternalStore } from "react";

type Star = {
  id: string;
  left: string;
  top: string;
  size: number;
  opacity: number;
  dur: number;
  delay: number;
};

const subscribe = () => () => {};

function createStars(): Star[] {
  return Array.from({ length: 24 }, (_, i) => ({
    id: `s-${i}`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 70}%`,
    size: 1 + Math.random() * 2,
    opacity: 0.15 + Math.random() * 0.25,
    dur: 6 + Math.random() * 8,
    delay: Math.random() * 3,
  }));
}

export default function FloatingStars() {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const stars = useMemo(() => (hydrated ? createStars() : []), [hydrated]);

  if (!hydrated) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {stars.map((s) => (
        <div
          key={s.id}
          className="catverse-float absolute rounded-full bg-white"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
