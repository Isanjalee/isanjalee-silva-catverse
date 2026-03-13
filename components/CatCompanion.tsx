"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

type Mode = "run" | "sit" | "pounce" | "sleep";

type PawPrint = {
  id: number;
  x: number;
  y: number;
  flip: boolean;
};

type GrassSpec = {
  id: number;
  x: number;
  height: number;
  delay: number;
  duration: number;
};

type FlowerSpec = {
  id: number;
  x: number;
  height: number;
  delay: number;
  duration: number;
};

const emptyScenery = {
  grass: [] as GrassSpec[],
  flowers: [] as FlowerSpec[],
};

const subscribe = () => () => {};

function createScenery() {
  return {
    grass: Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      height: 10 + Math.random() * 25,
      delay: Math.random() * 2,
      duration: 4 + Math.random() * 3,
    })),
    flowers: Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: 2 + Math.random() * 96,
      height: 15 + Math.random() * 20,
      delay: Math.random() * 2,
      duration: 4 + Math.random() * 3,
    })),
  };
}

// Grass blade component swaying in the breeze
const GrassBlade = ({
  x,
  height,
  delay,
  duration,
}: {
  x: number;
  height: number;
  delay: number;
  duration: number;
}) => (
  <svg
    className="absolute bottom-0"
    style={{
      left: `${x}%`,
      animation: `sway ${duration}s ease-in-out infinite alternate ${delay}s`,
      color: "var(--nature-grass)",
    }}
    width="10"
    height={height}
    viewBox={`0 0 10 ${height}`}
    preserveAspectRatio="none"
  >
    <path
      d={`M5 ${height} Q 5 ${height / 2} 5 0 Q 5 ${height / 2} 5 ${height}`}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

// Abstract flower
const Flower = ({
  x,
  height,
  delay,
  duration,
}: {
  x: number;
  height: number;
  delay: number;
  duration: number;
}) => (
  <div
    className="absolute bottom-0"
    style={{
      left: `${x}%`,
      height: `${height}px`,
      transformOrigin: "bottom center",
      animation: `sway ${duration}s ease-in-out infinite alternate ${delay}s`,
      color: "var(--nature-flower)",
    }}
  >
    {/* Stem */}
    <div
      className="absolute bottom-0 left-[4px] w-[2px] h-full rounded-full"
      style={{ backgroundColor: "var(--nature-stem)" }}
    />
    {/* Head */}
    <svg
      className="absolute -top-3 -left-[4px]"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="currentColor"
    >
      <circle cx="5" cy="2" r="2" />
      <circle cx="8" cy="5" r="2" />
      <circle cx="5" cy="8" r="2" />
      <circle cx="2" cy="5" r="2" />
      <circle
        cx="5"
        cy="5"
        r="1.5"
        style={{ color: "var(--nature-flower-center)" }}
      />
    </svg>
  </div>
);

// Dynamic Chase Butterfly (light theme)
const ChaseButterfly = ({
  x,
  y,
  active,
  className = "",
}: {
  x: number;
  y: number;
  active: boolean;
  className?: string;
}) => {
  if (!active) return null;
  return (
    <div
      className={`fixed z-50 pointer-events-none drop-shadow-[0_0_8px_rgba(59,130,246,0.3)] ${className}`}
      style={{
        left: x,
        top: y,
        transition: "transform 0.1s linear",
        color: "var(--butterfly-color)",
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 12 Q 10 4 2 6 Q 6 14 12 12"
          fill="currentColor"
          opacity="0.9"
          className="animate-ping"
          style={{ animationDuration: "0.3s" }}
        />
        <path
          d="M12 12 Q 14 4 22 6 Q 18 14 12 12"
          fill="currentColor"
          opacity="0.9"
          className="animate-ping"
          style={{ animationDuration: "0.3s" }}
        />
        <path
          d="M12 12 Q 10 20 2 18 Q 6 10 12 12"
          fill="currentColor"
          opacity="0.7"
        />
        <path
          d="M12 12 Q 14 20 22 18 Q 18 10 12 12"
          fill="currentColor"
          opacity="0.7"
        />
      </svg>
    </div>
  );
};

// Dark theme fireflies (visual replacement for butterfly)
const Fireflies = ({
  x,
  y,
  active,
  className = "",
}: {
  x: number;
  y: number;
  active: boolean;
  className?: string;
}) => {
  if (!active) return null;
  return (
    <div
      className={`fixed z-50 pointer-events-none ${className}`}
      style={{ left: x, top: y, transition: "transform 0.3s linear" }}
    >
      <div className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-yellow-300/68 blur-[1.4px] animate-pulse [animation-duration:3.6s]" />
      <div className="absolute -left-4 -top-4 h-6 w-6 rounded-full bg-yellow-200/18 blur-[6px]" />
    </div>
  );
};

export default function CatCompanion() {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const { resolvedTheme } = useTheme();
  const size = 66;
  const [mode, setMode] = useState<Mode>("run");
  const [flip, setFlip] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: 0 }); // start offscreen
  const [paws, setPaws] = useState<PawPrint[]>([]);
  const [bflyPos, setBflyPos] = useState({ active: false, x: 0, y: 0 });

  const modeRef = useRef<Mode>(mode);
  const posRef = useRef(pos);
  const flipRef = useRef(flip);
  const target = useRef<number | null>(null);
  const vx = useRef(1.5);
  const lastInteract = useRef(0);
  const pawCounter = useRef(0);
  const lastPawX = useRef(-100);

  // Butterfly mechanics
  const bflyRef = useRef({
    active: false,
    x: 0,
    hoverY: 0,
    y: 0,
    timeAlive: 0,
    vx: 0,
  });

  const scenery = useMemo(
    () => (hydrated ? createScenery() : emptyScenery),
    [hydrated],
  );

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    posRef.current = pos;
  }, [pos]);
  useEffect(() => {
    flipRef.current = flip;
  }, [flip]);

  useEffect(() => {
    const darkFlightFactor = resolvedTheme === "dark" ? 0.4 : 1;
    target.current = window.innerWidth / 2;
    lastInteract.current = Date.now();

    const getGround = () => window.innerHeight - size;

    const onMove = (e: MouseEvent) => {
      target.current = e.clientX - size / 2;
      lastInteract.current = Date.now();
      if (modeRef.current !== "pounce") setMode("run");
    };

    // On double click we can also force a butterfly!
    const onClick = (e: MouseEvent) => {
      target.current = e.clientX - size / 2;
      setMode("pounce");
      lastInteract.current = Date.now();

      // Fun bonus: Clicking spawns a butterfly if there isn't one
      if (!bflyRef.current.active) {
        bflyRef.current = {
          active: true,
          x: e.clientX,
          hoverY: getGround() - 80,
          y: getGround() - 80,
          timeAlive: 0,
          vx:
            (Math.random() < 0.5 ? 1 : -1) *
            (1.5 + Math.random()) *
            darkFlightFactor,
        };
      }

      setTimeout(() => setMode("run"), 400);
    };

    const onScroll = () => {
      lastInteract.current = Date.now();
      if (modeRef.current === "sleep" || modeRef.current === "sit") {
        setMode("run");
      } else if (modeRef.current === "run" && Math.random() > 0.95) {
        setMode("pounce");
        setTimeout(() => setMode("run"), 400);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("dblclick", onClick);
    window.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf = 0;
    const tick = () => {
      const maxX = Math.max(0, window.innerWidth - size - 10);
      const idle = Date.now() - lastInteract.current;
      const groundY = getGround();

      // --- BUTTERFLY CHASE LOGIC ---
      if (!bflyRef.current.active) {
        if (Math.random() < 0.005) {
          bflyRef.current = {
            active: true,
            x: Math.random() < 0.5 ? -30 : window.innerWidth + 30,
            hoverY: groundY - 60 - Math.random() * 40,
            y: 0,
            timeAlive: 0,
            vx:
              (Math.random() < 0.5 ? 1 : -1) *
              (2 + Math.random()) *
              darkFlightFactor,
          };
          if (bflyRef.current.x < 0)
            bflyRef.current.vx = Math.abs(bflyRef.current.vx);
          else bflyRef.current.vx = -Math.abs(bflyRef.current.vx);
        }
      } else {
        bflyRef.current.timeAlive++;
        bflyRef.current.x += bflyRef.current.vx;
        // Float up and down smoothly
        bflyRef.current.y =
          bflyRef.current.hoverY +
          Math.sin(bflyRef.current.timeAlive * 0.03) *
            (resolvedTheme === "dark" ? 20 : 40);

        if (
          bflyRef.current.x < -100 ||
          bflyRef.current.x > window.innerWidth + 100
        ) {
          bflyRef.current.active = false;
        }
      }

      setBflyPos({
        active: bflyRef.current.active,
        x: bflyRef.current.x,
        y: bflyRef.current.y,
      });
      // -----------------------------

      let desired = posRef.current.x;
      let distToBfly = 9999;
      if (bflyRef.current.active) {
        distToBfly = Math.abs(posRef.current.x + size / 2 - bflyRef.current.x);
      }

      if (idle > 15000 && distToBfly > 300) {
        setMode("sleep");
        desired = posRef.current.x;
      } else if (idle > 5000 && distToBfly > 300) {
        setMode("sit");
        desired = posRef.current.x;
      } else {
        // Active logic!
        if (modeRef.current === "sit" || modeRef.current === "sleep")
          setMode("run");

        if (bflyRef.current.active && distToBfly < 600) {
          // CHASE THE BUTTERFLY! Ignore mouse target until caught
          desired = bflyRef.current.x - size / 2;

          // Catch logic! Cat jumps up to catch it
          if (distToBfly < 50 && bflyRef.current.y > groundY - 120) {
            if (modeRef.current !== "pounce") {
              setMode("pounce");
              // Despawn shortly after
              setTimeout(() => {
                bflyRef.current.active = false;
                setMode("sit");
                lastInteract.current = Date.now(); // reset time to sit comfortably
              }, 200);
            }
          }
        } else if (target.current != null) {
          // Follow Mouse
          desired = Math.min(maxX, Math.max(0, target.current));
          if (Math.abs(desired - posRef.current.x) < 2) {
            target.current = null; // reached target
          }
        } else {
          // Just wander slowly
          desired = posRef.current.x + vx.current;
        }
      }

      const dx = desired - posRef.current.x;
      const speed =
        modeRef.current === "pounce" ? 3.2 : bflyRef.current.active ? 2.5 : 1.2;
      const step = Math.sign(dx) * Math.min(Math.abs(dx), speed);

      const nx = Math.min(maxX, Math.max(0, posRef.current.x + step));

      if (Math.abs(step) > 0.3) setFlip(step < 0);

      if (
        target.current == null &&
        !bflyRef.current.active &&
        (nx <= 0 || nx >= maxX)
      ) {
        vx.current *= -1; // bounce off walls smoothly when wandering
      }

      setPos({ x: nx, y: groundY });

      // Add paw prints explicitly while running
      if (modeRef.current === "run" && Math.abs(nx - lastPawX.current) > 25) {
        lastPawX.current = nx;
        pawCounter.current += 1;
        const newPaw = {
          id: pawCounter.current,
          x: nx + size / 2 - 4,
          y: groundY + size - 8,
          flip: flipRef.current,
        };
        setPaws((prev) => [...prev.slice(-12), newPaw]);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    const onResize = () => {
      setPos((p) => ({ ...p, y: getGround() }));
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("dblclick", onClick);
      window.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [resolvedTheme]);

  return (
    <>
      <style>{`
        @keyframes sway {
          0% { transform: rotate(-4deg); }
          100% { transform: rotate(4deg); }
        }
        @keyframes fadePaw {
          0% { opacity: 0.3; transform: scale(0.8); }
          100% { opacity: 0; transform: scale(1.1); }
        }
        .paw-print { animation: fadePaw 4s forwards; }
        
        /* Correct transform-box allows the SVG legs to properly rotate at their joints */
        .cat-leg-f { transform-origin: center top; transform-box: fill-box; animation: walkF 0.42s infinite alternate ease-in-out; }
        .cat-leg-b { transform-origin: center top; transform-box: fill-box; animation: walkB 0.42s infinite alternate ease-in-out; }
        
        @keyframes walkF { 0% { transform: rotate(-30deg); } 100% { transform: rotate(30deg); } }
        @keyframes walkB { 0% { transform: rotate(30deg); } 100% { transform: rotate(-30deg); } }
      `}</style>

      {/* Scenery Layer: Grass, Flowers */}
      <div className="pointer-events-none fixed bottom-0 left-0 w-full h-[60px] z-30 overflow-hidden">
        {scenery.grass.map((g) => (
          <GrassBlade key={`g-${g.id}`} {...g} />
        ))}
        {scenery.flowers.map((f) => (
          <Flower key={`f-${f.id}`} {...f} />
        ))}
        {/* Subtle ground gradient/line to place the cat on */}
        <div className="absolute bottom-0 w-full h-[10px] bg-gradient-to-t from-black/5 dark:from-white/10 to-transparent" />
      </div>

      {/* Light: butterfly / Dark: fireflies */}
      {resolvedTheme === "dark" ? (
        <Fireflies x={bflyPos.x} y={bflyPos.y} active={bflyPos.active} />
      ) : (
        <ChaseButterfly x={bflyPos.x} y={bflyPos.y} active={bflyPos.active} />
      )}

      {/* Paw Prints Layer */}
      <div className="pointer-events-none fixed left-0 top-0 z-40 w-full h-full">
        {paws.map((p) => (
          <div
            key={p.id}
            className="absolute text-black/15 dark:text-white/20 paw-print"
            style={{
              left: p.x,
              top: p.y,
              transform: `scaleX(${p.flip ? -1 : 1})`,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 16 C8 16 6 18 6 20 C6 22 8 24 12 24 C16 24 18 22 18 20 C18 18 16 16 12 16 Z" />
              <circle cx="8" cy="12" r="2.5" />
              <circle cx="12" cy="10" r="3" />
              <circle cx="16" cy="12" r="2.5" />
            </svg>
          </div>
        ))}
      </div>

      {/* Cat Companion */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-50 flex items-end"
        animate={{
          x: pos.x,
          y: mode === "pounce" ? pos.y - 45 : pos.y, // Jumps much higher to catch butterfly
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{ width: size, height: size }}
      >
        <div
          style={{
            transform: `scaleX(${flip ? -1 : 1})`,
            transformOrigin: "center",
          }}
          className="w-full relative"
        >
          {/* Shadow underneath the cat directly */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-2 bg-black/40 blur-[4px] rounded-[100%]"
            style={{
              opacity: mode === "pounce" ? 0.2 : 0.8,
              transform:
                mode === "pounce"
                  ? "translateX(-50%) scale(0.6)"
                  : "translateX(-50%) scale(1)",
            }}
          />

          <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            style={{ color: "var(--cat-color)" }}
          >
            {mode === "sleep" ? (
              // SLEEPING CAT
              <g fill="currentColor">
                <path d="M14 46 C14 34 26 30 36 30 C50 30 52 40 52 46 C52 52 38 54 32 54 C20 54 14 52 14 46 Z" />
                <path
                  d="M52 46 C56 46 60 42 60 36 C60 30 54 28 50 28"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M24 40 Q 26 42 28 40"
                  stroke="var(--color-bg)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M34 40 Q 36 42 38 40"
                  stroke="var(--color-bg)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <text
                  x="40"
                  y="24"
                  fill="currentColor"
                  fontSize="8"
                  className="animate-pulse opacity-50 font-bold"
                >
                  Z
                </text>
                <text
                  x="48"
                  y="16"
                  fill="currentColor"
                  fontSize="10"
                  className="animate-pulse opacity-70 font-bold"
                  style={{ animationDelay: "0.5s" }}
                >
                  Z
                </text>
              </g>
            ) : mode === "sit" ? (
              // SITTING CAT
              <g fill="currentColor">
                {/* Tail behind body */}
                <path
                  d="M44 48 Q 56 52 54 34"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Full sitting body */}
                <path d="M20 52 C20 38 27 33 34 33 C41 33 48 38 48 52 Z" />
                <rect x="25" y="48" width="7" height="8" rx="3.5" />
                <rect x="36" y="48" width="7" height="8" rx="3.5" />

                {/* Background-cat-style head */}
                <path d="M34 38 C24 38 21 31 21 26 C21 20 26 17 34 17 C42 17 47 20 47 26 C47 31 44 38 34 38 Z" />
                <polygon points="23,26 19,15 30,19" />
                <polygon points="45,26 49,15 38,19" />

                {/* Eyes (same language as background cat) */}
                <g>
                  <path d="M27 27 Q 29 25 31 27 Q 29 28 27 27 Z" fill="var(--color-bg)" />
                  <path d="M37 27 Q 39 25 41 27 Q 39 28 37 27 Z" fill="var(--color-bg)" />
                  <circle cx="28.2" cy="26.6" r="0.8" fill="currentColor" />
                  <circle cx="38.2" cy="26.6" r="0.8" fill="currentColor" />
                </g>

                {/* Nose */}
                <polygon points="34,30.8 33,29.8 35,29.8" fill="var(--color-bg)" opacity="0.65" />
              </g>
            ) : (
              // RUNNING / POUNCING CAT (background-cat-style face)
              <g fill="currentColor">
                {/* Main Body */}
                <rect x="12" y="31" width="36" height="16" rx="8" />

                {/* 4 Independently Moving Legs */}
                {/* Back Left */}
                <rect
                  x="17"
                  y="44"
                  width="4"
                  height="12"
                  rx="2"
                  className={mode === "run" ? "cat-leg-b" : ""}
                  opacity="0.6"
                />
                {/* Back Right */}
                <rect
                  x="24"
                  y="44"
                  width="4"
                  height="12"
                  rx="2"
                  className={mode === "run" ? "cat-leg-f" : ""}
                />

                {/* Front Left */}
                <rect
                  x="36"
                  y="44"
                  width="4"
                  height="12"
                  rx="2"
                  className={mode === "run" ? "cat-leg-b" : ""}
                  opacity="0.6"
                />
                {/* Front Right */}
                <rect
                  x="43"
                  y="44"
                  width="4"
                  height="12"
                  rx="2"
                  className={mode === "run" ? "cat-leg-f" : ""}
                />

                {/* Head + ears (same language as background cat) */}
                <path d="M48 40 C38 40 35 33 35 28 C35 22 40 19 48 19 C56 19 61 22 61 28 C61 33 58 40 48 40 Z" />
                <polygon points="37,28 33,17 44,21" />
                <polygon points="59,28 63,17 52,21" />

                {/* Tail */}
                <path
                  d="M14 38 Q 2 36 7 21"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Eyes + nose (background cat style) */}
                <g>
                  <path d="M43 29 Q 45 27 47 29 Q 45 30 43 29 Z" fill="var(--color-bg)" />
                  <path d="M52 29 Q 54 27 56 29 Q 54 30 52 29 Z" fill="var(--color-bg)" />
                  <circle cx="44.2" cy="28.7" r="0.75" fill="currentColor" />
                  <circle cx="53.2" cy="28.7" r="0.75" fill="currentColor" />
                  <polygon points="48,32 47,31 49,31" fill="var(--color-bg)" opacity="0.65" />
                </g>
              </g>
            )}
          </svg>
        </div>
      </motion.div>
    </>
  );
}
