"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Cat, Heart, Play, RotateCcw, Sparkles, Trophy, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import DigitalSectionTitle from "@/components/DigitalSectionTitle";
import PageShell from "@/components/PageShell";

const subscribe = () => () => {};
const BEST_SCORE_KEY = "cat-butterfly-best-score";
const START_LIVES = 3;
const CATCH_Y = 84;
const CATCH_BAND = 12;
const CAT_HALF_WIDTH = 11;
const GOLD_CHANCE = 0.14;

type Butterfly = {
  id: number;
  x: number;
  y: number;
  driftPhase: number;
  speed: number;
  hue: "cyan" | "gold" | "lime" | "violet";
  size: number;
  gold: boolean;
};

type Sparkle = {
  id: number;
  x: number;
  y: number;
  hue: Butterfly["hue"];
};

type Callout = {
  id: number;
  text: string;
};

type Phase = "idle" | "playing" | "over";

const hueColors: Record<Butterfly["hue"], { wing: string; body: string; glow: string }> = {
  cyan: { wing: "rgba(34,211,238,0.92)", body: "rgba(14,116,144,0.95)", glow: "rgba(34,211,238,0.5)" },
  gold: { wing: "rgba(251,191,36,0.96)", body: "rgba(146,64,14,0.95)", glow: "rgba(251,191,36,0.65)" },
  lime: { wing: "rgba(163,230,53,0.94)", body: "rgba(63,98,18,0.95)", glow: "rgba(163,230,53,0.5)" },
  violet: { wing: "rgba(192,132,252,0.94)", body: "rgba(88,28,135,0.95)", glow: "rgba(192,132,252,0.5)" },
};

const hues: Butterfly["hue"][] = ["cyan", "lime", "violet"];
const streakCallouts = ["Nice!", "Great!", "Amazing!", "Unstoppable!", "Legendary!"];

function getStoredBestScore() {
  if (typeof window === "undefined") return 0;
  const saved = window.localStorage.getItem(BEST_SCORE_KEY);
  const parsed = saved ? Number(saved) : 0;
  return Number.isNaN(parsed) ? 0 : parsed;
}

function ButterflySprite({ hue, size, flutter, gold }: { hue: Butterfly["hue"]; size: number; flutter: boolean; gold: boolean }) {
  const c = hueColors[hue];
  return (
    <motion.svg
      viewBox="0 0 40 32"
      width={size}
      height={size * 0.8}
      className="pointer-events-none"
      style={{ filter: `drop-shadow(0 0 ${gold ? 10 : 6}px ${c.glow})` }}
      animate={gold ? { scale: [1, 1.08, 1] } : undefined}
      transition={gold ? { duration: 0.6, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      <motion.g
        style={{ transformOrigin: "20px 16px" }}
        animate={flutter ? { scaleX: [1, 0.55, 1] } : undefined}
        transition={{ duration: 0.32, repeat: Infinity, ease: "easeInOut" }}
      >
        <ellipse cx="10" cy="10" rx="9" ry="7" fill={c.wing} opacity="0.92" />
        <ellipse cx="10" cy="21" rx="7" ry="5.4" fill={c.wing} opacity="0.78" />
        <ellipse cx="30" cy="10" rx="9" ry="7" fill={c.wing} opacity="0.92" />
        <ellipse cx="30" cy="21" rx="7" ry="5.4" fill={c.wing} opacity="0.78" />
      </motion.g>
      <rect x="18.6" y="6" width="2.8" height="20" rx="1.4" fill={c.body} />
      <circle cx="20" cy="6" r="2.2" fill={c.body} />
    </motion.svg>
  );
}

function CatPlayer({ isLight, catching }: { isLight: boolean; catching: boolean }) {
  return (
    <motion.div
      className="mind-cat-player relative z-30 flex items-center justify-center"
      animate={catching ? { y: [0, -10, 0], rotate: [0, -8, 8, 0], scale: [1, 1.12, 1] } : { y: [0, -2, 0] }}
      transition={catching ? { duration: 0.34 } : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <span
        className="mind-cat-glow absolute inset-0 rounded-full blur-xl"
        style={{ background: isLight ? "rgba(251,191,36,0.3)" : "rgba(251,191,36,0.24)" }}
      />
      <Cat
        size={46}
        strokeWidth={2.2}
        className="relative z-10 scale-x-[-1]"
        color={isLight ? "#3a3027" : "#f5ece1"}
        fill={isLight ? "rgba(255,251,245,0.6)" : "rgba(30,26,22,0.55)"}
      />
    </motion.div>
  );
}

type GameState = {
  butterflies: Butterfly[];
  score: number;
  combo: number;
  bestCombo: number;
  lives: number;
  catX: number;
};

function createInitialState(): GameState {
  return { butterflies: [], score: 0, combo: 0, bestCombo: 0, lives: START_LIVES, catX: 50 };
}

export default function MindBreakPage() {
  const { resolvedTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const hasHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const isLight = hasHydrated ? resolvedTheme !== "dark" : false;

  const [phase, setPhase] = useState<Phase>("idle");
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [callouts, setCallouts] = useState<Callout[]>([]);
  const [catching, setCatching] = useState(false);
  const storedBest = useSyncExternalStore(subscribe, getStoredBestScore, () => 0);
  const [sessionBest, setSessionBest] = useState(0);
  const best = Math.max(storedBest, sessionBest);

  const gameRef = useRef<GameState>(createInitialState());
  const [display, setDisplay] = useState<GameState>(() => createInitialState());
  const publishState = useCallback(() => {
    const g = gameRef.current;
    setDisplay({ ...g, butterflies: [...g.butterflies] });
  }, []);

  const boardRef = useRef<HTMLDivElement | null>(null);
  const nextId = useRef(1);
  const calloutId = useRef(1);
  const spawnTimer = useRef(0);
  const elapsed = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTick = useRef(0);

  const tuneAlpha = (color: string, alpha: string) => color.replace(/0\.\d+\)/, `${alpha})`);

  const finalizeRun = useCallback(() => {
    setPhase("over");
    const finalScore = gameRef.current.score;
    setSessionBest((currentBest) => {
      if (finalScore > currentBest) {
        window.localStorage.setItem(BEST_SCORE_KEY, String(finalScore));
        return finalScore;
      }
      return currentBest;
    });
  }, []);

  const startGame = useCallback(() => {
    gameRef.current = createInitialState();
    setSparkles([]);
    setCallouts([]);
    elapsed.current = 0;
    spawnTimer.current = 0;
    nextId.current = 1;
    publishState();
    setPhase("playing");
  }, [publishState]);

  useEffect(() => {
    if (phase !== "playing") {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    lastTick.current = performance.now();

    const step = (now: number) => {
      const dt = Math.min(48, now - lastTick.current);
      lastTick.current = now;
      elapsed.current += dt;
      spawnTimer.current += dt;

      const state = gameRef.current;
      const difficultyT = Math.min(1, elapsed.current / 42000);
      const spawnInterval = 1150 - difficultyT * 620;
      const fallSpeed = 0.03 + difficultyT * 0.036;

      if (spawnTimer.current >= spawnInterval && state.butterflies.length < 7) {
        spawnTimer.current = 0;
        const gold = Math.random() < GOLD_CHANCE;
        const hue: Butterfly["hue"] = gold ? "gold" : hues[Math.floor(Math.random() * hues.length)] ?? "cyan";
        state.butterflies.push({
          id: nextId.current++,
          x: 8 + Math.random() * 84,
          y: -6,
          driftPhase: Math.random() * Math.PI * 2,
          speed: fallSpeed * (0.82 + Math.random() * 0.4),
          hue,
          size: gold ? 34 : 28 + Math.random() * 12,
          gold,
        });
      }

      let missedThisTick = 0;
      const caughtThisTick: Butterfly[] = [];
      const survivors: Butterfly[] = [];

      for (const b of state.butterflies) {
        const nextY = b.y + b.speed * dt;
        const nextX = b.x + Math.sin(b.driftPhase + nextY * 0.05) * 0.16;
        const withinCatchBand = nextY >= CATCH_Y - CATCH_BAND && nextY <= CATCH_Y + CATCH_BAND;
        const withinCatchX = Math.abs(nextX - state.catX) <= CAT_HALF_WIDTH;

        if (withinCatchBand && withinCatchX) {
          caughtThisTick.push({ ...b, x: nextX, y: nextY });
          continue;
        }

        if (nextY >= 102) {
          missedThisTick += 1;
          continue;
        }

        survivors.push({ ...b, x: nextX, y: nextY });
      }

      state.butterflies = survivors;

      if (caughtThisTick.length > 0) {
        for (const b of caughtThisTick) {
          state.combo += 1;
          const multiplier = 1 + Math.floor(state.combo / 5) * 0.5;
          const points = Math.round((b.gold ? 3 : 1) * multiplier);
          state.score += points;
        }
        if (state.combo > state.bestCombo) state.bestCombo = state.combo;

        setCatching(true);
        window.setTimeout(() => setCatching(false), 280);
        setSparkles((current) => [
          ...current,
          ...caughtThisTick.map((b) => ({ id: b.id, x: b.x, y: b.y, hue: b.hue })),
        ]);
        window.setTimeout(() => {
          setSparkles((current) => current.filter((s) => !caughtThisTick.some((b) => b.id === s.id)));
        }, 480);

        if (state.combo > 0 && state.combo % 5 === 0) {
          const label = streakCallouts[Math.min(streakCallouts.length - 1, Math.floor(state.combo / 5) - 1)] ?? "Amazing!";
          const id = calloutId.current++;
          setCallouts((current) => [...current, { id, text: label }]);
          window.setTimeout(() => {
            setCallouts((current) => current.filter((c) => c.id !== id));
          }, 900);
        }
      }

      if (missedThisTick > 0) {
        state.combo = 0;
        state.lives = Math.max(0, state.lives - missedThisTick);
        if (state.lives <= 0) {
          rafRef.current = null;
          finalizeRun();
          publishState();
          return;
        }
      }

      publishState();
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, finalizeRun, publishState]);

  const moveCatToClientX = useCallback((clientX: number) => {
    const board = boardRef.current;
    if (!board) return;
    const rect = board.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    gameRef.current.catX = Math.min(100 - CAT_HALF_WIDTH, Math.max(CAT_HALF_WIDTH, ratio * 100));
    publishState();
  }, [publishState]);

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (phase !== "playing") return;
      moveCatToClientX(event.clientX);
    },
    [phase, moveCatToClientX],
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (phase !== "playing") return;
      moveCatToClientX(event.clientX);
    },
    [phase, moveCatToClientX],
  );

  useEffect(() => {
    if (phase !== "playing") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        gameRef.current.catX = Math.max(CAT_HALF_WIDTH, gameRef.current.catX - 6);
        publishState();
      }
      if (event.key === "ArrowRight") {
        gameRef.current.catX = Math.min(100 - CAT_HALF_WIDTH, gameRef.current.catX + 6);
        publishState();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, publishState]);

  const accentCardStyle = useCallback(
    (color: string) =>
      isLight
        ? {
            borderColor: tuneAlpha(color, "0.34"),
            background: "linear-gradient(180deg, rgba(255,251,245,0.98), rgba(250,245,237,0.98))",
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.44), 0 14px 28px ${tuneAlpha(color, "0.13")}`,
          }
        : {
            borderColor: tuneAlpha(color, "0.34"),
            background: `radial-gradient(circle at 88% 16%, ${tuneAlpha(color, "0.18")}, transparent 42%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.025))`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.09), 0 16px 30px ${tuneAlpha(color, "0.08")}`,
          },
    [isLight],
  );

  const helperTitleStyle = { color: isLight ? "rgba(84,72,60,0.62)" : "rgba(245,236,225,0.62)" };
  const helperBodyStyle = { color: isLight ? "rgba(50,46,42,0.72)" : "rgba(245,236,225,0.78)" };

  const comboMultiplier = useMemo(() => 1 + Math.floor(display.combo / 5) * 0.5, [display.combo]);

  return (
    <PageShell>
      <div className="mind-break-viewport app-viewport-frame flex h-[calc(var(--app-height)-12.5rem)] w-full min-h-[560px] flex-col">
        <div className="flex h-full min-h-0 w-full flex-col">
          <section className="card page-light-card relative flex h-full min-h-0 flex-col overflow-hidden p-4 md:p-5">
            <div className="mind-break-game-shell relative flex h-full min-h-0 flex-col">
              <motion.div
                className="mind-kicker inline-flex w-fit items-center gap-2 rounded-full border border-black/14 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#5a4d3f] dark:border-white/12 dark:bg-white/6 dark:text-white/58"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Sparkles size={13} />
                Cat Mini-Game
              </motion.div>

              <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
                <h1 className="text-2xl font-black tracking-[-0.04em] md:text-3xl" style={{ color: isLight ? "rgba(34,34,40,0.94)" : "rgba(255,255,255,0.92)" }}>
                  <DigitalSectionTitle label="catch.butterflies" />
                </h1>

                <div className="mind-hud flex flex-wrap items-center gap-2">
                  <span className="mind-hud-pill" style={accentCardStyle("rgba(251,191,36,0.88)")}>
                    <Trophy size={13} />
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={display.score}
                        initial={{ y: -6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.16 }}
                      >
                        {display.score}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className="mind-hud-pill" style={accentCardStyle("rgba(34,211,238,0.86)")}>
                    Best {best}
                  </span>
                  <span className="mind-hud-pill" style={accentCardStyle("rgba(192,132,252,0.86)")}>
                    <Zap size={13} />
                    x{comboMultiplier.toFixed(1)}
                  </span>
                  <span className="mind-hud-pill mind-hud-lives" style={accentCardStyle("rgba(251,113,133,0.86)")}>
                    {Array.from({ length: START_LIVES }).map((_, i) => (
                      <Heart
                        key={i}
                        size={13}
                        fill={i < display.lives ? "#fb7185" : "transparent"}
                        color={i < display.lives ? "#fb7185" : isLight ? "rgba(50,46,42,0.32)" : "rgba(245,236,225,0.32)"}
                      />
                    ))}
                  </span>
                </div>
              </div>

              <div
                ref={boardRef}
                className="mind-break-game-board relative mt-3 min-h-0 flex-1 touch-none overflow-hidden rounded-[28px] border"
                style={{
                  borderColor: isLight ? "rgba(90,68,41,0.14)" : "rgba(255,255,255,0.1)",
                  background: isLight
                    ? "radial-gradient(circle at 20% 10%, rgba(34,211,238,0.1), transparent 40%), radial-gradient(circle at 84% 82%, rgba(251,191,36,0.1), transparent 42%), linear-gradient(180deg, rgba(255,251,245,0.85), rgba(240,253,255,0.6))"
                    : "radial-gradient(circle at 20% 10%, rgba(34,211,238,0.12), transparent 40%), radial-gradient(circle at 84% 82%, rgba(251,191,36,0.1), transparent 42%), linear-gradient(180deg, rgba(10,12,16,0.7), rgba(6,7,10,0.85))",
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
              >
                {display.butterflies.map((b) => (
                  <div
                    key={b.id}
                    className="absolute"
                    style={{
                      left: `${b.x}%`,
                      top: `${b.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <ButterflySprite hue={b.hue} size={b.size} flutter={!prefersReducedMotion} gold={b.gold} />
                  </div>
                ))}

                <AnimatePresence>
                  {sparkles.map((s) => (
                    <motion.span
                      key={s.id}
                      className="pointer-events-none absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{
                        left: `${s.x}%`,
                        top: `${s.y}%`,
                        background: `radial-gradient(circle, ${hueColors[s.hue].glow}, transparent 68%)`,
                      }}
                      initial={{ scale: 0.3, opacity: 0.9 }}
                      animate={{ scale: 2.1, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.46, ease: "easeOut" }}
                    />
                  ))}
                </AnimatePresence>

                <AnimatePresence>
                  {callouts.map((c) => (
                    <motion.div
                      key={c.id}
                      className="pointer-events-none absolute left-1/2 top-[30%] z-30 -translate-x-1/2 text-2xl font-black uppercase tracking-[0.05em]"
                      style={{
                        color: isLight ? "rgba(202,138,4,0.94)" : "#facc15",
                        textShadow: "0 2px 12px rgba(251,191,36,0.5)",
                      }}
                      initial={{ opacity: 0, y: 8, scale: 0.7 }}
                      animate={{ opacity: 1, y: -6, scale: 1.08 }}
                      exit={{ opacity: 0, y: -18, scale: 0.9 }}
                      transition={{ duration: 0.32 }}
                    >
                      {c.text}
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div
                  className="mind-cat-track absolute bottom-2 left-0 z-20 w-full"
                  style={{ top: `${CATCH_Y}%` }}
                >
                  <div
                    className="absolute"
                    style={{ left: `${display.catX}%`, transform: "translate(-50%, -55%)" }}
                  >
                    <CatPlayer isLight={isLight} catching={catching} />
                  </div>
                </div>

                <AnimatePresence>
                  {phase !== "playing" ? (
                    <motion.div
                      className="mind-overlay absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 text-center"
                      style={{
                        background: isLight ? "rgba(255,251,245,0.72)" : "rgba(6,7,10,0.72)",
                        backdropFilter: "blur(6px)",
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {phase === "over" ? (
                        <>
                          <div className="text-sm font-black uppercase tracking-[0.2em]" style={helperTitleStyle}>
                            Run Complete
                          </div>
                          <div className="text-4xl font-black tracking-[-0.05em]" style={{ color: isLight ? "rgba(34,34,40,0.92)" : "rgba(255,255,255,0.94)" }}>
                            {display.score} caught
                          </div>
                          {display.score >= best && display.score > 0 ? (
                            <div className="text-xs font-bold uppercase tracking-[0.18em] text-amber-500">New Best!</div>
                          ) : null}
                        </>
                      ) : (
                        <>
                          <Cat size={40} color={isLight ? "#3a3027" : "#f5ece1"} />
                          <div className="text-lg font-black" style={{ color: isLight ? "rgba(34,34,40,0.92)" : "rgba(255,255,255,0.94)" }}>
                            Catch the butterflies
                          </div>
                          <p className="max-w-xs text-sm leading-6" style={helperBodyStyle}>
                            Move the cat with your mouse, finger, or arrow keys. Gold butterflies
                            are worth triple — chain catches for a bigger multiplier.
                          </p>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={startGame}
                        className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.03] active:scale-95 dark:bg-white dark:text-black"
                      >
                        {phase === "over" ? <RotateCcw size={16} /> : <Play size={16} />}
                        {phase === "over" ? "Play Again" : "Start Game"}
                      </button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </section>
        </div>

        <aside className="fixed right-6 top-[10.5rem] z-20 hidden w-[264px] 2xl:block">
          <motion.div
            className="card page-light-card relative z-10 overflow-hidden p-4 opacity-[0.9]"
            style={accentCardStyle("rgba(34,211,238,0.86)")}
            whileHover={{ y: -2 }}
          >
            <motion.span
              className="pointer-events-none absolute -right-8 top-0 h-20 w-20 rounded-full bg-sky-400 blur-2xl"
              animate={{ opacity: [0.12, 0.24, 0.12], scale: [0.9, 1.08, 0.9] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative grid gap-3">
              <div className="mind-help-group">
                <div className="mind-help-head" style={{ color: "#22d3ee" }}>
                  <Play size={11} />
                  How To Play
                </div>
                <ol className="mind-help-steps">
                  <li><b>1</b><span>Press <strong>Start</strong> to begin.</span></li>
                  <li><b>2</b><span>Move the cat left / right.</span></li>
                  <li><b>3</b><span>Catch falling butterflies.</span></li>
                  <li><b>4</b><span>Chain catches for a bonus.</span></li>
                  <li><b>5</b><span>Three misses ends the run.</span></li>
                </ol>
              </div>

              <span className="mind-help-divider" />

              <div className="mind-help-group">
                <div className="mind-help-head" style={{ color: "#c084fc" }}>
                  <Trophy size={11} />
                  Scoring
                </div>
                <ul className="mind-help-list">
                  <li><span><b style={{ color: "#facc15" }}>Gold</b> butterflies are worth 3x.</span></li>
                  <li><span><b style={{ color: "#a3e635" }}>Streaks</b> raise your multiplier every 5.</span></li>
                </ul>
              </div>

              <span className="mind-help-divider" />

              <div className="mind-help-group">
                <div className="mind-help-head" style={{ color: "#a3e635" }}>
                  <Zap size={11} />
                  Tip
                </div>
                <p className="mind-help-tip" style={helperBodyStyle}>
                  It speeds up the longer you last — stay near the centre so you can
                  reach either side fast.
                </p>
              </div>
            </div>
          </motion.div>
        </aside>
      </div>

      <style>{`
        .mind-break-game-board {
          cursor: pointer;
        }

        .mind-hud-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.32rem;
          border-radius: 999px;
          border: 1px solid transparent;
          padding: 0.32rem 0.68rem;
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          color: ${isLight ? "rgba(34,34,40,0.84)" : "rgba(245,236,225,0.88)"};
        }

        .mind-hud-lives {
          gap: 0.18rem;
        }

        .mind-help-head {
          display: flex;
          align-items: center;
          gap: 0.36rem;
          font-family: inherit;
          font-size: 0.62rem;
          font-weight: 900;
          letter-spacing: 0.14em;
          line-height: 1;
          text-transform: uppercase;
        }

        .mind-help-steps {
          margin: 0.62rem 0 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 0.4rem;
        }

        .mind-help-steps li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .mind-help-steps li b {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          width: 1.1rem;
          height: 1.1rem;
          margin-top: 0.05rem;
          border-radius: 999px;
          background: color-mix(in srgb, #22d3ee 26%, transparent);
          color: ${isLight ? "#0e7490" : "#67e8f9"};
          font-size: 0.58rem;
          font-weight: 900;
          line-height: 1;
        }

        .mind-help-steps li span {
          flex: 1 1 auto;
          font-size: 0.72rem;
          font-weight: 500;
          line-height: 1.4;
          color: ${isLight ? "rgba(50,46,42,0.8)" : "rgba(245,236,225,0.82)"};
        }

        .mind-help-steps li strong {
          color: ${isLight ? "rgba(34,34,40,0.94)" : "rgba(255,255,255,0.94)"};
          font-weight: 800;
        }

        .mind-help-list {
          margin: 0.62rem 0 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 0.36rem;
        }

        .mind-help-list li span {
          display: block;
          font-size: 0.72rem;
          font-weight: 500;
          line-height: 1.4;
          color: ${isLight ? "rgba(50,46,42,0.8)" : "rgba(245,236,225,0.82)"};
        }

        .mind-help-list li b {
          font-weight: 900;
        }

        .mind-help-tip {
          margin: 0.62rem 0 0;
          font-size: 0.72rem;
          font-weight: 450;
          line-height: 1.5;
          text-align: justify;
          text-justify: inter-word;
        }

        .mind-help-divider {
          display: block;
          height: 1px;
          margin: 0.1rem 0;
          background: ${isLight ? "rgba(90,68,41,0.14)" : "rgba(255,255,255,0.1)"};
        }

        @media (max-width: 767px) {
          .mind-break-viewport {
            height: auto !important;
            min-height: 0 !important;
          }

          .mind-break-game-board {
            min-height: 22rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .mind-cat-player {
            animation: none !important;
          }
        }
      `}</style>
    </PageShell>
  );
}
