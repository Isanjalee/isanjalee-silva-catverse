"use client";

import { useEffect, useRef, useState } from "react";

type Obstacle = { x: number; w: number; h: number };

export default function MindBreakPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [status, setStatus] = useState<"ready" | "playing" | "gameover">(
    "ready",
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    const resize = () => {
      const w = Math.min(980, window.innerWidth - 40);
      const h = 280;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Game state
    let catY = 0;
    let catV = 0;
    const ground = 210;
    const catX = 70;

    let obstacles: Obstacle[] = [];
    let speed = 4.2;
    let t = 0;
    let localScore = 0;
    let running = false;

    const reset = () => {
      catY = ground;
      catV = 0;
      obstacles = [];
      speed = 4.2;
      t = 0;
      localScore = 0;
      setScore(0);
    };

    const spawn = () => {
      const w = 16 + Math.random() * 24;
      const h = 18 + Math.random() * 28;
      obstacles.push({ x: 1000, w, h });
    };

    const jump = () => {
      if (!running) {
        running = true;
        setStatus("playing");
      }
      if (catY >= ground) catV = -11.5;
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") jump();
      if (e.code === "Enter" && status === "gameover") {
        setStatus("ready");
        running = false;
        reset();
      }
    };

    const onPointer = () => {
      if (status === "gameover") {
        setStatus("ready");
        running = false;
        reset();
        return;
      }
      jump();
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);

    const collide = (o: Obstacle) => {
      const catW = 28;
      const catH = 22;
      const cx1 = catX;
      const cy1 = catY - catH;
      const cx2 = catX + catW;
      const cy2 = catY;

      const ox1 = o.x;
      const oy1 = ground - o.h;
      const ox2 = o.x + o.w;
      const oy2 = ground;

      return cx1 < ox2 && cx2 > ox1 && cy1 < oy2 && cy2 > oy1;
    };

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      ctx.clearRect(0, 0, w, h);

      // background
      ctx.fillStyle = "rgba(255,255,255,0.03)";
      ctx.fillRect(0, 0, w, h);

      // ground line
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.beginPath();
      ctx.moveTo(20, ground);
      ctx.lineTo(w - 20, ground);
      ctx.stroke();

      // cat (simple)
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.fillRect(catX, catY - 22, 28, 22);

      // obstacles
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      for (const o of obstacles) {
        ctx.fillRect(o.x, ground - o.h, o.w, o.h);
      }

      // HUD
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.font = "12px ui-sans-serif";
      ctx.fillText(`Score: ${Math.floor(localScore)}`, 24, 24);
      ctx.fillText(`Best: ${best}`, 24, 42);

      if (status === "ready") {
        ctx.fillStyle = "rgba(255,255,255,0.80)";
        ctx.font = "14px ui-sans-serif";
        ctx.fillText("Tap / Space to jump. Relax and play.", 24, 78);
      }

      if (status === "gameover") {
        ctx.fillStyle = "rgba(255,255,255,0.90)";
        ctx.font = "16px ui-sans-serif";
        ctx.fillText("Game Over — tap to restart", 24, 78);
      }
    };

    const step = () => {
      t += 1;

      if (running && status === "playing") {
        // physics
        catV += 0.65;
        catY += catV;
        if (catY > ground) {
          catY = ground;
          catV = 0;
        }

        // spawn
        if (t % 65 === 0) spawn();

        // move obstacles
        obstacles = obstacles
          .map((o) => ({ ...o, x: o.x - speed }))
          .filter((o) => o.x + o.w > 0);

        // collision
        for (const o of obstacles) {
          if (collide(o)) {
            setStatus("gameover");
            running = false;
            break;
          }
        }

        // score + difficulty
        localScore += 0.18;
        if (Math.floor(localScore) % 80 === 0) speed += 0.05;

        setScore(Math.floor(localScore));
      }

      draw();
      rafRef.current = requestAnimationFrame(step);
    };

    reset();
    rafRef.current = requestAnimationFrame(step);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, best]);

  useEffect(() => {
    setBest((b) => Math.max(b, score));
  }, [score]);

  return (
    <div className="mx-auto w-full max-w-5xl px-5 pb-16 pt-10">
      <div className="card p-6">
        <div className="text-sm text-white/70">Mind Break</div>
        <div className="mt-2 text-xl font-semibold">Cat Jump</div>
        <div className="mt-2 text-sm text-white/70">
          Tap / Space to jump. This is designed to be simple and relaxing.
        </div>

        <div className="mt-6 flex justify-center">
          <canvas
            ref={canvasRef}
            className="rounded-xl border border-white/10"
          />
        </div>

        <div className="mt-5 text-sm text-white/70">
          Score: <span className="text-white/90">{score}</span> • Best:{" "}
          <span className="text-white/90">{best}</span>
        </div>
      </div>
    </div>
  );
}
