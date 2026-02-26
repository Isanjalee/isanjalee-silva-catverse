"use client";

import { useEffect, useState } from "react";

type Star = {
  id: string;
  left: string;
  top: string;
  size: number;
  opacity: number;
  dur: number;
  delay: number;
};

export default function FloatingStars() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // generate only on client to avoid SSR mismatch
    const arr: Star[] = Array.from({ length: 24 }).map((_, i) => ({
      id: `s-${i}`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 70}%`,
      size: 1 + Math.random() * 2,
      opacity: 0.15 + Math.random() * 0.25,
      dur: 6 + Math.random() * 8,
      delay: Math.random() * 3,
    }));
    setStars(arr);
  }, []);

  // IMPORTANT: render nothing until stars are generated on client
  if (stars.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white catverse-float"
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
