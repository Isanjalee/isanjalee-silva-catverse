"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Cat, Brain, RotateCcw, Sparkles } from "lucide-react";
import PageShell from "@/components/PageShell";

type TileId = "nap" | "pounce" | "stretch" | "zoomies";
type Phase = "idle" | "showing" | "player" | "success" | "fail";

type Tile = {
  id: TileId;
  name: string;
  hint: string;
  accent: string;
  glow: string;
};

const tiles: Tile[] = [
  {
    id: "nap",
    name: "Nap",
    hint: "Soft reset",
    accent: "from-amber-200 via-orange-200 to-rose-200",
    glow: "shadow-[0_0_30px_rgba(251,191,36,0.22)]",
  },
  {
    id: "pounce",
    name: "Pounce",
    hint: "Fast focus",
    accent: "from-sky-200 via-cyan-200 to-teal-200",
    glow: "shadow-[0_0_30px_rgba(34,211,238,0.24)]",
  },
  {
    id: "stretch",
    name: "Stretch",
    hint: "Breathe out",
    accent: "from-lime-200 via-emerald-200 to-green-200",
    glow: "shadow-[0_0_30px_rgba(132,204,22,0.22)]",
  },
  {
    id: "zoomies",
    name: "Zoomies",
    hint: "Chaotic energy",
    accent: "from-fuchsia-200 via-pink-200 to-rose-200",
    glow: "shadow-[0_0_30px_rgba(244,114,182,0.22)]",
  },
];

const BEST_ROUND_KEY = "cat-mind-break-best-round";
const FLASH_MS = 520;
const GAP_MS = 190;

const subscribe = () => () => {};

function randomTileId(): TileId {
  return tiles[Math.floor(Math.random() * tiles.length)]!.id;
}

function getStoredBestRound() {
  if (typeof window === "undefined") return 0;

  const savedBest = window.localStorage.getItem(BEST_ROUND_KEY);
  const parsed = savedBest ? Number(savedBest) : 0;
  return Number.isNaN(parsed) ? 0 : parsed;
}

function TileScene({ tileId, active }: { tileId: TileId; active: boolean }) {
  const line = "rgba(28,28,30,0.18)";
  const lineSoft = "rgba(28,28,30,0.08)";
  const fill = "rgba(28,28,30,0.03)";
  const glow = active ? "rgba(255,176,78,0.16)" : "rgba(28,28,30,0.04)";

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 overflow-hidden">
      {tileId === "nap" ? (
        <motion.div
          className="absolute right-8 top-7"
          animate={{
            y: active ? [0, -2, 0] : [0, -1, 0],
            opacity: active ? [0.45, 0.7, 0.45] : [0.28, 0.42, 0.28],
          }}
          transition={{ repeat: Infinity, duration: active ? 1.8 : 3.2 }}
        >
          <svg width="122" height="86" viewBox="0 0 122 86" fill="none">
            <circle cx="66" cy="36" r="21" fill={fill} stroke={lineSoft} />
            <path
              d="M74 18 C65 21 60 31 62 40 C64 49 73 54 82 52 C91 50 98 42 97 32 C96 23 87 17 78 18 C78 18 79 21 79 25 C79 32 76 38 70 42 C66 45 61 46 57 45"
              stroke={line}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <motion.div
            className="absolute right-12 top-1 h-1.5 w-1.5 rounded-full bg-black/16 dark:bg-white/18"
            animate={{ opacity: [0.12, 0.38, 0.12], y: [0, -8, -15] }}
            transition={{ repeat: Infinity, duration: 2.4 }}
          />
          <motion.div
            className="absolute right-4 top-6 h-1 w-1 rounded-full bg-black/10 dark:bg-white/12"
            animate={{ opacity: [0.08, 0.25, 0.08], y: [0, -6, -12] }}
            transition={{ repeat: Infinity, duration: 2.9, delay: 0.4 }}
          />
        </motion.div>
      ) : null}

      {tileId === "pounce" ? (
        <motion.div
          className="absolute right-8 top-7"
          animate={{
            opacity: active ? [0.34, 0.62, 0.34] : [0.22, 0.36, 0.22],
          }}
          transition={{ repeat: Infinity, duration: active ? 1.1 : 2.2 }}
        >
          <svg width="126" height="84" viewBox="0 0 126 84" fill="none">
            <path
              d="M24 55 C44 43 58 31 78 29 C92 28 101 33 107 42"
              stroke={line}
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <path
              d="M24 55 C31 58 37 63 40 69"
              stroke={lineSoft}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M107 42 C109 36 113 31 118 28"
              stroke={lineSoft}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle cx="23" cy="55" r="3.5" fill="rgba(28,28,30,0.14)" />
            <circle cx="108" cy="42" r="3.5" fill="rgba(28,28,30,0.14)" />
          </svg>
          <motion.div
            className="absolute left-[17px] top-[51px] h-2.5 w-2.5 rounded-full bg-black/28 dark:bg-white/38"
            animate={{
              x: active ? [0, 20, 42, 67, 82] : [0, 18, 36, 54, 72],
              y: active ? [0, -6, -14, -23, -13] : [0, -5, -10, -15, -9],
              opacity: [0.28, 0.5, 0.62, 0.44, 0.24],
            }}
            transition={{ repeat: Infinity, duration: active ? 1 : 1.8 }}
          />
        </motion.div>
      ) : null}

      {tileId === "stretch" ? (
        <motion.div
          className="absolute right-8 top-7"
          animate={{
            opacity: active ? [0.34, 0.58, 0.34] : [0.22, 0.34, 0.22],
          }}
          transition={{ repeat: Infinity, duration: active ? 1.5 : 2.6 }}
        >
          <svg width="126" height="84" viewBox="0 0 126 84" fill="none">
            <motion.path
              d="M24 47 C37 43 52 42 64 42 C76 42 91 43 104 47"
              stroke={line}
              strokeWidth="2.6"
              strokeLinecap="round"
              animate={{ scaleX: active ? [0.88, 1.02, 0.88] : [0.92, 0.98, 0.92] }}
              style={{ originX: 0.5, originY: 0.5 }}
              transition={{ repeat: Infinity, duration: active ? 1.4 : 2.5 }}
            />
            <path d="M24 47 C20 45 18 41 18 36" stroke={lineSoft} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M104 47 C108 45 110 41 110 36" stroke={lineSoft} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M44 50 L44 63" stroke={lineSoft} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M56 50 L56 63" stroke={lineSoft} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M72 50 L72 63" stroke={lineSoft} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M84 50 L84 63" stroke={lineSoft} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M64 19 L64 34" stroke="rgba(28,28,30,0.08)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M60 22 L64 18 L68 22" stroke="rgba(28,28,30,0.14)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M60 30 L64 34 L68 30" stroke="rgba(28,28,30,0.14)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      ) : null}

      {tileId === "zoomies" ? (
        <motion.div
          className="absolute right-8 top-7"
          animate={{
            opacity: active ? [0.34, 0.66, 0.34] : [0.22, 0.36, 0.22],
          }}
          transition={{ repeat: Infinity, duration: active ? 0.95 : 1.8 }}
        >
          <svg width="126" height="84" viewBox="0 0 126 84" fill="none">
            <path d="M28 42 H54" stroke={lineSoft} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M22 50 H45" stroke="rgba(28,28,30,0.06)" strokeWidth="2" strokeLinecap="round" />
            <path d="M34 34 H50" stroke="rgba(28,28,30,0.07)" strokeWidth="2" strokeLinecap="round" />
            <path
              d="M65 25 C79 25 90 36 90 49 C90 58 84 63 77 63"
              stroke={line}
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <path
              d="M61 29 C71 29 79 37 79 46 C79 51 76 56 72 59"
              stroke={lineSoft}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="66" cy="24" r="3.5" fill="rgba(28,28,30,0.14)" />
            <motion.circle
              cx="78"
              cy="63"
              r="3.2"
              fill="rgba(28,28,30,0.2)"
              animate={{ x: active ? [0, 6, -2, 0] : [0, 4, 0], y: active ? [0, -3, 2, 0] : [0, -1, 0] }}
              transition={{ repeat: Infinity, duration: active ? 0.8 : 1.4 }}
            />
          </svg>
        </motion.div>
      ) : null}

      <div
        className="absolute right-6 top-5 h-24 w-24 rounded-full blur-2xl"
        style={{ backgroundColor: glow }}
      />
      <div className="absolute inset-y-0 right-0 w-[38%] bg-gradient-to-l from-black/[0.02] to-transparent dark:from-white/[0.018]" />
    </div>
  );
}

export default function MindBreakPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [sequence, setSequence] = useState<TileId[]>([]);
  const [playerStep, setPlayerStep] = useState(0);
  const [activeTile, setActiveTile] = useState<TileId | null>(null);
  const storedBestRound = useSyncExternalStore(subscribe, getStoredBestRound, () => 0);
  const [bestRound, setBestRound] = useState(0);
  const [message, setMessage] = useState(
    "Watch the glowing tiles carefully, then tap them back in the same order.",
  );

  const timeoutsRef = useRef<number[]>([]);

  const round = sequence.length;
  const remaining = Math.max(0, round - playerStep);
  const canPressTiles = phase === "player";

  const stats = useMemo(
    () => [
      { label: "Round", value: round || 0 },
      { label: "Best", value: bestRound },
      { label: "Left", value: phase === "player" ? remaining : "--" },
    ],
    [bestRound, phase, remaining, round],
  );

  useEffect(() => {
    setBestRound(storedBestRound);
  }, [storedBestRound]);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyHeight = document.body.style.height;
    const previousHtmlHeight = document.documentElement.style.height;
    const previousBodyMaxHeight = document.body.style.maxHeight;
    const previousHtmlMaxHeight = document.documentElement.style.maxHeight;
    const previousBodyOverflowY = document.body.style.overflowY;
    const previousHtmlOverflowY = document.documentElement.style.overflowY;
    const mainElement = document.querySelector("main");
    const previousMainOverflow = mainElement?.getAttribute("style") ?? null;

    document.body.style.overflow = "clip";
    document.documentElement.style.overflow = "clip";
    document.body.style.overflowY = "clip";
    document.documentElement.style.overflowY = "clip";
    document.body.style.height = "100dvh";
    document.documentElement.style.height = "100dvh";
    document.body.style.maxHeight = "100dvh";
    document.documentElement.style.maxHeight = "100dvh";

    if (mainElement instanceof HTMLElement) {
      mainElement.style.overflow = "hidden";
      mainElement.style.paddingBottom = "0";
      mainElement.style.minHeight = "calc(100dvh - 7.5rem)";
    }

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflowY = previousBodyOverflowY;
      document.documentElement.style.overflowY = previousHtmlOverflowY;
      document.body.style.height = previousBodyHeight;
      document.documentElement.style.height = previousHtmlHeight;
      document.body.style.maxHeight = previousBodyMaxHeight;
      document.documentElement.style.maxHeight = previousHtmlMaxHeight;

      if (mainElement instanceof HTMLElement) {
        if (previousMainOverflow) {
          mainElement.setAttribute("style", previousMainOverflow);
        } else {
          mainElement.removeAttribute("style");
        }
      }

      for (const timeout of timeoutsRef.current) {
        window.clearTimeout(timeout);
      }
    };
  }, []);

  function clearTimers() {
    for (const timeout of timeoutsRef.current) {
      window.clearTimeout(timeout);
    }
    timeoutsRef.current = [];
  }

  function persistBest(nextRound: number) {
    setBestRound((current) => {
      const updated = Math.max(current, nextRound);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(BEST_ROUND_KEY, String(updated));
      }
      return updated;
    });
  }

  function showSequence(nextSequence: TileId[]) {
    clearTimers();
    setPhase("showing");
    setPlayerStep(0);
    setActiveTile(null);
    setMessage(
      nextSequence.length === 1
        ? "Round 1. One tile will glow. Remember it."
        : `Round ${nextSequence.length}. Memorize the full glowing pattern.`,
    );

    nextSequence.forEach((tileId, index) => {
      const startAt = index * (FLASH_MS + GAP_MS);
      const flashTimer = window.setTimeout(() => {
        setActiveTile(tileId);
      }, startAt);
      const clearTimer = window.setTimeout(() => {
        setActiveTile(null);
      }, startAt + FLASH_MS);

      timeoutsRef.current.push(flashTimer, clearTimer);
    });

    const readyTimer = window.setTimeout(() => {
      setActiveTile(null);
      setPhase("player");
      setMessage("Your turn. Tap the same tiles in the same order.");
    }, nextSequence.length * (FLASH_MS + GAP_MS));

    timeoutsRef.current.push(readyTimer);
  }

  function startGame() {
    const firstSequence = [randomTileId()];
    setSequence(firstSequence);
    showSequence(firstSequence);
  }

  function handleSuccess(nextSequence: TileId[]) {
    setPhase("success");
    persistBest(nextSequence.length);
    setMessage("Correct. A new tile will be added for the next round.");

    const nextTimer = window.setTimeout(() => {
      const expandedSequence = [...nextSequence, randomTileId()];
      setSequence(expandedSequence);
      showSequence(expandedSequence);
    }, 900);

    timeoutsRef.current.push(nextTimer);
  }

  function handleFailure() {
    setPhase("fail");
    persistBest(sequence.length);
    setActiveTile(null);
    setMessage(
      sequence.length <= 1
        ? "Wrong tile. Press Start Game and try again."
        : `You reached round ${sequence.length}. Press Start Game to try again.`,
    );
  }

  function handleTilePress(tileId: TileId) {
    if (!canPressTiles) return;

    setActiveTile(tileId);
    const releaseTimer = window.setTimeout(() => {
      setActiveTile((current) => (current === tileId ? null : current));
    }, 180);
    timeoutsRef.current.push(releaseTimer);

    const expectedTile = sequence[playerStep];
    if (tileId !== expectedTile) {
      handleFailure();
      return;
    }

    const nextStep = playerStep + 1;
    setPlayerStep(nextStep);

    if (nextStep === sequence.length) {
      handleSuccess(sequence);
    }
  }

  return (
    <PageShell>
      <div className="flex h-[calc(100dvh-12.5rem)] w-full min-h-[620px] flex-col">
        <div className="h-full">
          <section className="card page-light-card flex h-full min-h-0 overflow-hidden p-0">
            <div className="mindbreak-light-shell relative isolate flex min-h-0 flex-1 flex-col overflow-hidden rounded-[20px] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,176,78,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] dark:shadow-none px-5 py-5 md:px-7 md:py-6">
              <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(255,220,168,0.12),transparent_46%,rgba(194,232,247,0.12))] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_40%,rgba(255,255,255,0.08))]" />

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-2xl">
                  <div className="mindbreak-light-kicker inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-black/60 dark:border-white/10 dark:bg-white/6 dark:text-white/60">
                    <Brain size={14} />
                    Mind Break
                  </div>
                  <h1 className="mindbreak-light-heading mt-3 text-4xl font-black tracking-[-0.06em] text-black/85 dark:text-white/92 md:text-5xl">
                    Cat Mind Break
                  </h1>
                  <p className="mindbreak-light-copy mt-3 max-w-xl text-sm leading-6 text-black/65 dark:text-white/68 md:text-base">
                    Memorize the glowing order, then tap the same tiles back.
                  </p>
                </div>

                <div className="grid w-full gap-3 sm:grid-cols-3 xl:max-w-[320px]">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="mindbreak-light-tile rounded-[24px] border border-black/8 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.34)] dark:border-white/10 dark:bg-white/5 dark:shadow-none"
                    >
                      <div className="mindbreak-light-stat-label text-[11px] uppercase tracking-[0.22em] text-black/45 dark:text-white/45">
                        {stat.label}
                      </div>
                      <div className="mindbreak-light-stat-value mt-2 text-3xl font-black tracking-[-0.05em] text-black/80 dark:text-white/90">
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mindbreak-light-tile mindbreak-light-message mt-4 rounded-[24px] border border-black/8 p-4 text-sm text-black/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.32)] dark:border-white/10 dark:bg-white/[0.03] dark:text-white/70 dark:shadow-none">
                <div className="flex items-start gap-3">
                  <Sparkles
                    size={18}
                    className="mt-0.5 shrink-0 text-amber-500 dark:text-amber-300"
                  />
                  <div>
                    <div className="mindbreak-light-message-strong font-semibold text-black/82 dark:text-white/88">
                      {message}
                    </div>
                    <div className="mindbreak-light-message mt-1 text-black/55 dark:text-white/55">
                      {phase === "idle" &&
                        "Press Start Game, watch the glowing order, then repeat it."}
                      {phase === "showing" &&
                        "Watch only. The tiles are showing you the pattern now."}
                      {phase === "player" &&
                        "Your turn. Tap the tiles in exactly the same order."}
                      {phase === "success" &&
                        "Correct. Get ready for one extra tile in the next round."}
                      {phase === "fail" &&
                        "Wrong tile. Start a new run and try to beat your best."}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid min-h-0 flex-1 gap-4 md:grid-cols-2">
                {tiles.map((tile, index) => {
                  const isActive = activeTile === tile.id;
                  const isDisabled = !canPressTiles;

                  return (
                    <button
                      key={tile.id}
                      type="button"
                      onClick={() => handleTilePress(tile.id)}
                      disabled={isDisabled}
                      className={`group relative min-h-[140px] overflow-hidden rounded-[32px] border p-6 text-left transition duration-200 ${
                        isActive
                          ? `scale-[1.01] border-black/12 bg-gradient-to-br ${tile.accent} ${tile.glow} dark:border-white/20`
                          : "mindbreak-light-tile border-black/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] hover:-translate-y-1 hover:brightness-[1.02] dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:hover:bg-white/8"
                      } ${isDisabled ? "cursor-default" : "cursor-pointer"}`}
                    >
                      <TileScene tileId={tile.id} active={isActive} />

                      <div className="absolute right-4 top-4 rounded-full border border-black/8 bg-black/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-black/45 dark:border-white/10 dark:bg-white/5 dark:text-white/45">
                        {`0${index + 1}`}
                      </div>

                      <div className="relative z-10 max-w-[12rem]">
                        <div className="mindbreak-light-tile-title text-2xl font-black tracking-[-0.05em] text-black/85 dark:text-white/92">
                          {tile.name}
                        </div>
                        <div className="mindbreak-light-tile-copy mt-2 text-sm text-black/58 dark:text-white/60">
                          {tile.hint}
                        </div>
                      </div>

                      <div className="mindbreak-light-tile-meta relative z-10 mt-12 text-xs uppercase tracking-[0.24em] text-black/35 dark:text-white/35">
                        {isActive
                          ? "Active"
                          : canPressTiles
                            ? "Tap now"
                            : "Watch first"}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={startGame}
                  className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] dark:bg-white dark:text-black"
                >
                  <Cat size={16} />
                  {phase === "idle" || phase === "fail"
                    ? "Start Game"
                    : "Restart Run"}
                </button>

                <button
                  type="button"
                  onClick={startGame}
                  className="mindbreak-light-button-secondary inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-5 py-3 text-sm font-semibold text-black/70 transition hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:text-white/74 dark:hover:bg-white/10"
                >
                  <RotateCcw size={16} />
                  Fresh Pattern
                </button>
              </div>
            </div>
          </section>
        </div>

        <aside className="fixed right-6 top-[10.5rem] z-20 hidden w-[280px] gap-4 2xl:grid">
          <div className="card page-light-card mindbreak-light-aside shadow-[inset_0_1px_0_rgba(255,255,255,0.32)] dark:bg-white/[0.03] dark:shadow-none p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/45 dark:text-white/45">
              How To Play
            </div>
            <div className="mt-4 grid gap-2 text-sm leading-6 text-black/65 dark:text-white/68">
              <p>1. Press <strong>Start Game</strong>.</p>
              <p>2. Watch the tiles glow in order.</p>
              <p>3. Wait for <strong>Your turn</strong>.</p>
              <p>4. Tap the same tiles back.</p>
              <p>5. One mistake ends the run.</p>
            </div>
          </div>

          <div className="card page-light-card mindbreak-light-aside shadow-[inset_0_1px_0_rgba(255,255,255,0.32)] dark:bg-white/[0.03] dark:shadow-none p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/45 dark:text-white/45">
              Score Guide
            </div>
            <div className="mt-4 grid gap-2 text-sm leading-6 text-black/65 dark:text-white/68">
              <p><strong>Round</strong>: current level.</p>
              <p><strong>Best</strong>: highest saved level.</p>
              <p><strong>Left</strong>: taps left this round.</p>
            </div>
          </div>

          <div className="card page-light-card mindbreak-light-aside shadow-[inset_0_1px_0_rgba(255,255,255,0.32)] dark:bg-white/[0.03] dark:shadow-none p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/45 dark:text-white/45">
              Quick Tip
            </div>
            <p className="mt-4 text-sm leading-6 text-black/65 dark:text-white/68">
              Read the tile names in your head while they glow. That makes the
              pattern easier to remember.
            </p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
