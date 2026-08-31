"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { useWeather } from "@/components/WeatherProvider";

type Particle = {
  type: "paw" | "ripple" | "frost" | "snowburst";
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  flip: boolean;
  size: number;
  color: string;
  rim?: string;
  age: number;
  life: number;
};

const accentCycle = [
  "34,211,238", // cyan
  "251,191,36", // gold
  "163,230,53", // lime
  "192,132,252", // violet
];

const subscribe = () => () => {};

export default function CatCursor() {
  const { resolvedTheme } = useTheme();
  const { season } = useWeather();
  const hasHydrated = useSyncExternalStore(subscribe, () => true, () => false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastSpawnRef = useRef(0);
  const stepRef = useRef(0);
  const accentIndexRef = useRef(0);
  const isLightRef = useRef(true);
  const isWinterRef = useRef(false);
  const enabledRef = useRef(true);

  useEffect(() => {
    isLightRef.current = resolvedTheme !== "dark";
  }, [resolvedTheme]);

  useEffect(() => {
    isWinterRef.current = season === "winter";
  }, [season]);

  useEffect(() => {
    if (!hasHydrated) return;

    // Touch devices never get real mousemove streams from a finger, but
    // many do synthesize one mousemove + click per tap — which used to spawn
    // a full particle burst and kick off this component's animation loop on
    // every tap, on top of whatever the page itself was doing. This effect
    // is decorative chrome for a mouse pointer; skip it entirely on touch.
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return;

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const storedPref = localStorage.getItem("catverse-cursor-fx");
    const enabled = storedPref !== "off" && !reducedMotionQuery.matches;
    enabledRef.current = enabled;
    if (reducedMotionQuery.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const ensureLoop = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(tick);
    };

    const spawnPaw = (x: number, y: number) => {
      stepRef.current += 1;
      const flip = stepRef.current % 2 === 0;
      const color = isWinterRef.current
        ? "191,219,254"
        : isLightRef.current
          ? "28,28,30"
          : "255,255,255";
      // Each print in the little walking trail picks up the next colour in
      // the site's own accent rotation — small, but reads as a cat pawing
      // its way across in more than one flat tone.
      const rim = isWinterRef.current
        ? "125,211,252"
        : accentCycle[stepRef.current % accentCycle.length];
      particlesRef.current.push({
        type: isWinterRef.current ? "frost" : "paw",
        x: x + (flip ? 6 : -6),
        y: y + 4,
        vx: 0,
        vy: 0,
        rotation: (Math.random() - 0.5) * 30,
        flip,
        size: 7 + Math.random() * 2,
        color,
        rim,
        age: 0,
        life: 600,
      });
      ensureLoop();
    };

    const spawnClick = (x: number, y: number) => {
      if (isWinterRef.current) {
        const count = 9;
        for (let i = 0; i < count; i += 1) {
          const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
          const speed = 1.1 + Math.random() * 1.6;
          particlesRef.current.push({
            type: "snowburst",
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.4,
            rotation: 0,
            flip: false,
            size: 2 + Math.random() * 2.4,
            color: "224,242,254",
            age: 0,
            life: 480,
          });
        }
      } else {
        const color = accentCycle[accentIndexRef.current % accentCycle.length];
        accentIndexRef.current += 1;
        particlesRef.current.push({
          type: "ripple",
          x,
          y,
          vx: 0,
          vy: 0,
          rotation: 0,
          flip: false,
          size: 4,
          color,
          age: 0,
          life: 420,
        });
      }
      ensureLoop();
    };

    let lastFrame = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(48, now - lastFrame);
      lastFrame = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const alive: Particle[] = [];
      for (const p of particlesRef.current) {
        p.age += dt;
        if (p.age >= p.life) continue;
        const t = p.age / p.life;

        if (p.type === "paw") {
          ctx.save();
          ctx.globalAlpha = 0.34 * (1 - t);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.scale(p.flip ? -1 : 1, 1);
          ctx.fillStyle = `rgb(${p.color})`;
          ctx.strokeStyle = `rgb(${p.rim ?? p.color})`;
          drawPaw(ctx, p.size * (1 + t * 0.35));
          ctx.restore();
        } else if (p.type === "frost") {
          ctx.save();
          ctx.globalAlpha = 0.4 * (1 - t);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.scale(p.flip ? -1 : 1, 1);
          ctx.fillStyle = `rgb(${p.color})`;
          ctx.shadowColor = "rgba(191,219,254,0.9)";
          ctx.shadowBlur = 4;
          drawPaw(ctx, p.size * (1 + t * 0.35));
          ctx.restore();
        } else if (p.type === "ripple") {
          const radius = 4 + t * 26;
          ctx.save();
          ctx.globalAlpha = 0.5 * (1 - t);
          ctx.strokeStyle = `rgba(${p.color},1)`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        } else if (p.type === "snowburst") {
          p.x += p.vx * (dt / 16);
          p.y += p.vy * (dt / 16);
          p.vy += 0.02 * (dt / 16);
          ctx.save();
          ctx.globalAlpha = 0.85 * (1 - t);
          ctx.fillStyle = `rgb(${p.color})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 - t * 0.4), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        alive.push(p);
      }
      particlesRef.current = alive;

      if (alive.length > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    // The paw trail / click ripple should not fire over the chrome controls
    // (navbar, side dock, floating badges) — it clutters the small icons.
    const isOverChrome = (target: EventTarget | null) =>
      target instanceof Element &&
      target.closest(
        ".site-navbar, .site-side-dock, .floating-copyright, .navbar-mobile-menu",
      ) != null;

    const onMove = (e: MouseEvent) => {
      if (!enabledRef.current) return;
      if (isOverChrome(e.target)) return;
      const now = performance.now();
      if (now - lastSpawnRef.current < 95) return;
      lastSpawnRef.current = now;
      spawnPaw(e.clientX, e.clientY);
    };

    const onClick = (e: MouseEvent) => {
      if (!enabledRef.current) return;
      if (isOverChrome(e.target)) return;
      spawnClick(e.clientX, e.clientY);
    };

    const onStorage = () => {
      const pref = localStorage.getItem("catverse-cursor-fx");
      enabledRef.current = pref !== "off";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick);
    window.addEventListener("catverse-cursor-fx-change", onStorage);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("catverse-cursor-fx-change", onStorage);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      particlesRef.current = [];
    };
  }, [hasHydrated]);

  if (!hasHydrated) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[200]"
    />
  );
}

function drawPaw(ctx: CanvasRenderingContext2D, size: number) {
  const s = size / 10;
  ctx.lineWidth = 0.35 * s;
  const pad = (cx: number, cy: number, rx: number, ry: number) => {
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  };
  pad(0, 3.5 * s, 3.2 * s, 2.6 * s);
  pad(-2.6 * s, -1.1 * s, 1.15 * s, 1.15 * s);
  pad(-0.9 * s, -2.1 * s, 1.25 * s, 1.25 * s);
  pad(0.9 * s, -2.1 * s, 1.25 * s, 1.25 * s);
  pad(2.6 * s, -1.1 * s, 1.15 * s, 1.15 * s);
}
