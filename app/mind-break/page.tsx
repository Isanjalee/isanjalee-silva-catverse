"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Cat,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useTheme } from "next-themes";
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

function TileScene({
  tileId,
  active,
  isLight,
}: {
  tileId: TileId;
  active: boolean;
  isLight: boolean;
}) {
  const palette =
    tileId === "nap"
      ? {
          line: isLight ? "rgba(217, 119, 6, 0.45)" : "rgba(255, 206, 122, 0.72)",
          lineSoft: isLight ? "rgba(217, 119, 6, 0.22)" : "rgba(255, 206, 122, 0.3)",
          fill: isLight ? "rgba(251, 191, 36, 0.12)" : "rgba(255, 206, 122, 0.12)",
          glow: isLight ? "rgba(255,176,78,0.28)" : "rgba(255,176,78,0.18)",
          dot: isLight ? "bg-amber-500/55" : "bg-amber-200/42",
          dotSoft: isLight ? "bg-orange-400/34" : "bg-orange-200/28",
        }
      : tileId === "pounce"
        ? {
            line: isLight ? "rgba(2, 132, 199, 0.44)" : "rgba(103, 232, 249, 0.68)",
            lineSoft: isLight ? "rgba(2, 132, 199, 0.22)" : "rgba(103, 232, 249, 0.28)",
            fill: isLight ? "rgba(56, 189, 248, 0.12)" : "rgba(103, 232, 249, 0.12)",
            glow: isLight ? "rgba(56,189,248,0.26)" : "rgba(34,211,238,0.18)",
            dot: isLight ? "bg-sky-500/56" : "bg-cyan-200/44",
            dotSoft: isLight ? "bg-cyan-500/34" : "bg-sky-200/28",
          }
        : tileId === "stretch"
          ? {
              line: isLight ? "rgba(101, 163, 13, 0.42)" : "rgba(190, 242, 100, 0.66)",
              lineSoft: isLight ? "rgba(101, 163, 13, 0.22)" : "rgba(190, 242, 100, 0.26)",
              fill: isLight ? "rgba(132, 204, 22, 0.12)" : "rgba(190, 242, 100, 0.12)",
              glow: isLight ? "rgba(132,204,22,0.24)" : "rgba(132,204,22,0.16)",
              dot: isLight ? "bg-lime-600/48" : "bg-lime-200/38",
              dotSoft: isLight ? "bg-emerald-500/28" : "bg-lime-200/24",
            }
          : {
              line: isLight ? "rgba(225, 29, 72, 0.4)" : "rgba(244, 114, 182, 0.66)",
              lineSoft: isLight ? "rgba(225, 29, 72, 0.2)" : "rgba(244, 114, 182, 0.26)",
              fill: isLight ? "rgba(244, 114, 182, 0.12)" : "rgba(244, 114, 182, 0.12)",
              glow: isLight ? "rgba(244,114,182,0.26)" : "rgba(244,114,182,0.18)",
              dot: isLight ? "bg-pink-500/52" : "bg-pink-200/40",
              dotSoft: isLight ? "bg-rose-500/30" : "bg-pink-200/24",
            };

  const line = palette.line;
  const lineSoft = palette.lineSoft;
  const glow = active ? palette.glow : isLight ? "rgba(28,28,30,0.04)" : "rgba(255,255,255,0.05)";
  const catFill = isLight ? "#77777f" : "#f5ece1";
  const catDetail = isLight ? "#fffaf2" : "#17171c";
  const catPatch = isLight ? "#98989f" : "#ded3c6";
  const catSoft = isLight ? "rgba(34,34,40,0.18)" : "rgba(245,236,225,0.18)";
  const catBlush = isLight ? "#8a8a91" : "#eadfd2";
  const bgPanel = isLight ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)";

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 overflow-hidden">
      <div
        className="absolute right-3 top-4 h-32 w-32 rounded-full blur-2xl"
        style={{ backgroundColor: glow }}
      />
      <div
        className="absolute right-4 top-4 h-[104px] w-[154px] rounded-[28px] border"
        style={{
          borderColor: lineSoft,
          background: bgPanel,
        }}
      />
      {tileId === "nap" ? (
        <motion.div
          className="absolute right-0 top-2 z-10"
          animate={{
            y: active ? [0, -3, 0] : [0, -1, 0],
            opacity: active ? [0.72, 1, 0.72] : [0.45, 0.72, 0.45],
          }}
          transition={{ repeat: Infinity, duration: active ? 1.8 : 3.2 }}
        >
          <svg width="162" height="116" viewBox="0 0 142 102" fill="none">
            <rect x="22" y="64" width="92" height="10" rx="5" fill={catSoft} />
            <motion.path
              d="M37 62 C42 42 61 34 80 41 C96 47 105 56 111 65 C92 74 61 76 37 62 Z"
              fill={catFill}
              animate={{ d: active ? [
                "M37 62 C42 42 61 34 80 41 C96 47 105 56 111 65 C92 74 61 76 37 62 Z",
                "M37 62 C42 45 62 38 81 43 C96 48 105 57 111 65 C92 74 61 76 37 62 Z",
                "M37 62 C42 42 61 34 80 41 C96 47 105 56 111 65 C92 74 61 76 37 62 Z",
              ] : undefined }}
              transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
            />
            <path d="M81 43 Q91 19 100 49 Z" fill={catFill} />
            <path d="M99 50 Q123 35 113 62 Z" fill={catFill} />
            <path
              d="M37 61 C20 57 21 39 35 38"
              stroke={catFill}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <motion.path
              d="M101 55 Q106 57 111 55"
              stroke={isLight ? "rgba(255,251,245,0.88)" : "rgba(7,8,12,0.86)"}
              strokeWidth="2"
              strokeLinecap="round"
              animate={{ scaleY: [1, 0.18, 1] }}
              style={{ transformOrigin: "106px 55px" }}
              transition={{ repeat: Infinity, duration: 4.2, repeatDelay: 1.2 }}
            />
            <motion.text
              x="22"
              y="25"
              fill={line}
              fontSize="12"
              fontWeight="800"
              animate={{ y: [25, 18, 25], opacity: [0.16, 0.58, 0.16] }}
              transition={{ repeat: Infinity, duration: 2.6 }}
            >
              z z z
            </motion.text>
          </svg>
        </motion.div>
      ) : null}

      {tileId === "pounce" ? (
        <motion.div
          className="absolute right-4 top-4 z-10 h-[104px] w-[154px] overflow-hidden rounded-[28px]"
          animate={{
            opacity: active ? [0.72, 1, 0.72] : [0.42, 0.7, 0.42],
          }}
          transition={{ repeat: Infinity, duration: active ? 1.1 : 2.2 }}
        >
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 142 102" fill="none">
            <path d="M21 80 C45 70 82 68 121 75" stroke={lineSoft} strokeWidth="2.2" strokeLinecap="round" strokeDasharray="5 7" />
            <motion.g
              animate={{
                x: active ? [-2, 11, -2] : [0, 3, 0],
                y: active ? [3, -13, 3] : [0, -3, 0],
                rotate: active ? [-4, 5, -4] : [-1, 1, -1],
              }}
              transition={{ repeat: Infinity, duration: active ? 1.05 : 2.2, ease: "easeInOut" }}
            >
              <ellipse cx="69" cy="79" rx="43" ry="6" fill={catSoft} />
              <ellipse cx="73" cy="66" rx="24" ry="20" fill={catFill} />
              <circle cx="76" cy="42" r="19" fill={catFill} />
              <path d="M61 33 L66 12 L76 31 Z" fill={catFill} />
              <path d="M81 31 L96 13 L94 39 Z" fill={catFill} />
              <path d="M66 30 L69 21 L73 32 Z" fill={catPatch} />
              <path d="M85 30 L91 22 L90 36 Z" fill={catPatch} />
              <motion.path
                d="M53 69 C25 85 18 54 42 47"
                stroke={catFill}
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                animate={{ d: active ? [
                  "M53 69 C25 85 18 54 42 47",
                  "M53 68 C27 78 23 55 45 45",
                  "M53 69 C25 85 18 54 42 47",
                ] : undefined }}
                transition={{ repeat: Infinity, duration: 1.05, ease: "easeInOut" }}
              />
              <ellipse cx="69" cy="40" rx="2.7" ry="3.7" fill={catDetail} />
              <ellipse cx="82" cy="40" rx="2.7" ry="3.7" fill={catDetail} />
              <circle cx="70" cy="38.5" r="1.15" fill={catFill} />
              <circle cx="83" cy="38.5" r="1.15" fill={catFill} />
              <circle cx="64" cy="48" r="2.4" fill={catBlush} />
              <circle cx="88" cy="48" r="2.4" fill={catBlush} />
              <path d="M76 47 L74 49.5 L78 49.5 Z" fill={catDetail} />
              <path d="M65 50 C58 49 53 50 48 53" stroke={lineSoft} strokeWidth="1.35" strokeLinecap="round" />
              <path d="M87 50 C94 49 100 50 105 53" stroke={lineSoft} strokeWidth="1.35" strokeLinecap="round" />
              <motion.path
                d="M68 61 C59 58 52 54 45 49"
                stroke={catFill}
                strokeWidth="8"
                strokeLinecap="round"
                animate={{ d: active ? [
                  "M68 61 C59 58 52 54 45 49",
                  "M68 60 C60 56 54 50 48 44",
                  "M68 61 C59 58 52 54 45 49",
                ] : undefined }}
                transition={{ repeat: Infinity, duration: 1.05, ease: "easeInOut" }}
              />
              <motion.path
                d="M80 61 C91 59 101 55 108 50"
                stroke={catFill}
                strokeWidth="8"
                strokeLinecap="round"
                animate={{ d: active ? [
                  "M80 61 C91 59 101 55 108 50",
                  "M80 60 C91 57 99 50 104 45",
                  "M80 61 C91 59 101 55 108 50",
                ] : undefined }}
                transition={{ repeat: Infinity, duration: 1.05, ease: "easeInOut" }}
              />
              <motion.path
                d="M68 75 C64 81 59 86 55 90"
                stroke={catFill}
                strokeWidth="8"
                strokeLinecap="round"
                animate={{ d: active ? [
                  "M68 75 C64 81 59 86 55 90",
                  "M68 75 C68 81 68 86 68 90",
                  "M68 75 C64 81 59 86 55 90",
                ] : undefined }}
                transition={{ repeat: Infinity, duration: 1.05, ease: "easeInOut" }}
              />
              <motion.path
                d="M79 75 C86 82 92 87 96 90"
                stroke={catFill}
                strokeWidth="8"
                strokeLinecap="round"
                animate={{ d: active ? [
                  "M79 75 C86 82 92 87 96 90",
                  "M79 75 C80 81 79 86 79 90",
                  "M79 75 C86 82 92 87 96 90",
                ] : undefined }}
                transition={{ repeat: Infinity, duration: 1.05, ease: "easeInOut" }}
              />
              <motion.ellipse
                cx="45"
                cy="49"
                rx="5.8"
                ry="3"
                fill={catFill}
                animate={{ cx: active ? [45, 48, 45] : [45, 46, 45], cy: active ? [49, 44, 49] : [49, 48, 49] }}
                transition={{ repeat: Infinity, duration: active ? 1.05 : 2.2, ease: "easeInOut" }}
              />
              <motion.ellipse
                cx="108"
                cy="50"
                rx="5.8"
                ry="3"
                fill={catFill}
                animate={{ cx: active ? [108, 104, 108] : [108, 107, 108], cy: active ? [50, 45, 50] : [50, 49, 50] }}
                transition={{ repeat: Infinity, duration: active ? 1.05 : 2.2, ease: "easeInOut" }}
              />
              <motion.ellipse
                cx="55"
                cy="90"
                rx="7"
                ry="3"
                fill={catFill}
                animate={{ cx: active ? [55, 68, 55] : [55, 58, 55] }}
                transition={{ repeat: Infinity, duration: active ? 1.05 : 2.2, ease: "easeInOut" }}
              />
              <motion.ellipse
                cx="96"
                cy="90"
                rx="7"
                ry="3"
                fill={catFill}
                animate={{ cx: active ? [96, 79, 96] : [96, 93, 96] }}
                transition={{ repeat: Infinity, duration: active ? 1.05 : 2.2, ease: "easeInOut" }}
              />
            </motion.g>
            <motion.circle
              cx="112"
              cy="38"
              r="5"
              fill={line}
              animate={{ scale: [0.8, 1.25, 0.8], opacity: [0.35, 0.9, 0.35] }}
              transition={{ repeat: Infinity, duration: 1.3 }}
            />
          </svg>
        </motion.div>
      ) : null}

      {tileId === "stretch" ? (
        <motion.div
          className="absolute right-4 top-4 z-10 h-[104px] w-[154px] overflow-hidden rounded-[28px]"
          animate={{
            opacity: active ? [0.72, 1, 0.72] : [0.42, 0.68, 0.42],
          }}
          transition={{ repeat: Infinity, duration: active ? 1.5 : 2.6 }}
        >
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 142 102" fill="none">
            <rect x="23" y="82" width="96" height="8" rx="4" fill={catSoft} />
            <motion.g
              animate={{ scaleX: active ? [0.96, 1.08, 0.96] : [0.98, 1.02, 0.98], y: active ? [0, -2, 0] : [0, -1, 0] }}
              style={{ transformOrigin: "72px 64px" }}
              transition={{ repeat: Infinity, duration: active ? 1.35 : 2.7, ease: "easeInOut" }}
            >
              <motion.ellipse
                cx="66"
                cy="68"
                rx="36"
                ry="20"
                fill={catFill}
                animate={{
                  cx: active ? [66, 68, 66] : [66, 67, 66],
                  rx: active ? [34, 40, 34] : [35, 37, 35],
                  ry: active ? [20, 18, 20] : [20, 19, 20],
                }}
                transition={{ repeat: Infinity, duration: active ? 1.35 : 2.7, ease: "easeInOut" }}
              />
              <motion.path
                d="M42 64 C56 55 79 55 96 64"
                stroke={catPatch}
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                opacity="0.38"
                animate={{ d: active ? [
                  "M42 64 C56 55 79 55 96 64",
                  "M41 63 C57 52 85 53 101 64",
                  "M42 64 C56 55 79 55 96 64",
                ] : undefined }}
                transition={{ repeat: Infinity, duration: 1.35, ease: "easeInOut" }}
              />
              <motion.g
                animate={{ x: active ? [0, 4, 0] : [0, 1, 0], y: active ? [0, -2, 0] : [0, -1, 0], rotate: active ? [-2, 2, -2] : [-1, 1, -1] }}
                style={{ transformOrigin: "103px 63px" }}
                transition={{ repeat: Infinity, duration: active ? 1.35 : 2.7, ease: "easeInOut" }}
              >
                <circle cx="103" cy="63" r="16" fill={catFill} />
                <path d="M90 56 L96 35 L106 56 Z" fill={catFill} />
                <path d="M106 55 L121 39 L118 64 Z" fill={catFill} />
                <path d="M96 55 L99 46 L103 56 Z" fill={catPatch} />
                <path d="M110 55 L116 48 L115 60 Z" fill={catPatch} />
                <ellipse cx="98" cy="62" rx="2.5" ry="3.5" fill={catDetail} />
                <ellipse cx="109" cy="61" rx="2.5" ry="3.5" fill={catDetail} />
                <circle cx="99" cy="60.5" r="1.1" fill={catFill} />
                <circle cx="110" cy="59.5" r="1.1" fill={catFill} />
                <circle cx="94" cy="69" r="2.2" fill={catBlush} />
                <circle cx="113" cy="68" r="2.2" fill={catBlush} />
                <path d="M104 67 L102 69.5 L106 69.5 Z" fill={catDetail} />
              </motion.g>
              <motion.path
                d="M89 76 L108 89"
                stroke={catFill}
                strokeWidth="6"
                strokeLinecap="round"
                animate={{ d: active ? ["M89 76 L108 89", "M90 76 L122 88", "M89 76 L108 89"] : undefined }}
                transition={{ repeat: Infinity, duration: 1.35, ease: "easeInOut" }}
              />
              <motion.path
                d="M54 78 L34 90"
                stroke={catFill}
                strokeWidth="6"
                strokeLinecap="round"
                animate={{ d: active ? ["M54 78 L34 90", "M53 78 L22 88", "M54 78 L34 90"] : undefined }}
                transition={{ repeat: Infinity, duration: 1.35, ease: "easeInOut" }}
              />
              <path d="M73 80 L64 91" stroke={catFill} strokeWidth="5.5" strokeLinecap="round" opacity="0.96" />
              <motion.ellipse
                cx="104"
                cy="88"
                rx="7"
                ry="3"
                fill={catFill}
                animate={{ cx: active ? [104, 122, 104] : [104, 108, 104] }}
                transition={{ repeat: Infinity, duration: active ? 1.35 : 2.7, ease: "easeInOut" }}
              />
              <motion.ellipse
                cx="34"
                cy="90"
                rx="7"
                ry="3"
                fill={catFill}
                animate={{ cx: active ? [34, 22, 34] : [34, 31, 34] }}
                transition={{ repeat: Infinity, duration: active ? 1.35 : 2.7, ease: "easeInOut" }}
              />
              <ellipse cx="64" cy="91" rx="6" ry="2.7" fill={catFill} opacity="0.96" />
              <motion.path
                d="M35 69 C14 58 18 34 40 39"
                stroke={catFill}
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                animate={{ d: active ? [
                  "M35 69 C14 58 18 34 40 39",
                  "M34 70 C13 62 13 47 31 43",
                  "M35 69 C14 58 18 34 40 39",
                ] : undefined }}
                transition={{ repeat: Infinity, duration: 1.35, ease: "easeInOut" }}
              />
            </motion.g>
            <motion.path
              d="M48 36 C58 25 78 24 88 36"
              stroke={line}
              strokeWidth="2.4"
              strokeLinecap="round"
              animate={{ opacity: [0.18, 0.7, 0.18], y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </svg>
        </motion.div>
      ) : null}

      {tileId === "zoomies" ? (
        <motion.div
          className="absolute right-4 top-4 z-10 h-[104px] w-[154px] overflow-hidden rounded-[28px]"
          animate={{
            opacity: active ? [0.76, 1, 0.76] : [0.42, 0.72, 0.42],
          }}
          transition={{ repeat: Infinity, duration: active ? 0.95 : 1.8 }}
        >
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 142 102" fill="none">
            <motion.g
              animate={{ x: active ? [-12, 16, -12] : [-4, 6, -4], y: active ? [1, -3, 1] : [0, -1, 0], rotate: active ? [-4, 6, -4] : [-1, 2, -1] }}
              transition={{ repeat: Infinity, duration: active ? 0.72 : 1.45, ease: "easeInOut" }}
            >
              <path d="M15 59 H43" stroke={lineSoft} strokeWidth="3.4" strokeLinecap="round" />
              <path d="M10 72 H38" stroke={lineSoft} strokeWidth="2.8" strokeLinecap="round" />
              <path d="M22 84 H56" stroke={lineSoft} strokeWidth="2.2" strokeLinecap="round" />
              <ellipse cx="70" cy="80" rx="42" ry="6" fill={catSoft} opacity="0.8" />
              <ellipse cx="65" cy="66" rx="31" ry="16" fill={catFill} />
              <circle cx="103" cy="59" r="16" fill={catFill} />
              <path d="M90 52 L96 28 L108 51 Z" fill={catFill} />
              <path d="M107 50 L126 32 L119 63 Z" fill={catFill} />
              <path d="M97 50 L100 40 L104 51 Z" fill={catPatch} />
              <path d="M112 50 L119 43 L117 58 Z" fill={catPatch} />
              <ellipse cx="98" cy="59" rx="2.6" ry="3.5" fill={catDetail} />
              <ellipse cx="109" cy="58" rx="2.6" ry="3.5" fill={catDetail} />
              <circle cx="99" cy="57.5" r="1.1" fill={catFill} />
              <circle cx="110" cy="56.5" r="1.1" fill={catFill} />
              <circle cx="94" cy="66" r="2.2" fill={catBlush} />
              <circle cx="113" cy="65" r="2.2" fill={catBlush} />
              <path d="M104 64 L102 66.5 L106 66.5 Z" fill={catDetail} />
              <path d="M115 63 C123 63 129 66 134 70" stroke={lineSoft} strokeWidth="1.35" strokeLinecap="round" />
              <path d="M96 65 C89 63 83 63 77 65" stroke={lineSoft} strokeWidth="1.35" strokeLinecap="round" />
              <motion.path
                d="M39 64 C24 42 12 61 31 78"
                stroke={catFill}
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                animate={{ d: active ? [
                  "M39 64 C24 42 12 61 31 78",
                  "M39 64 C19 51 15 69 36 79",
                  "M39 64 C24 42 12 61 31 78",
                ] : undefined }}
                transition={{ repeat: Infinity, duration: 0.72, ease: "easeInOut" }}
              />
              <motion.path
                d="M52 74 L35 87"
                stroke={catFill}
                strokeWidth="6"
                strokeLinecap="round"
                animate={{ d: active ? ["M52 74 L35 87", "M52 74 L65 87", "M52 74 L35 87"] : undefined }}
                transition={{ repeat: Infinity, duration: 0.72, ease: "easeInOut" }}
              />
              <motion.path
                d="M78 75 L99 86"
                stroke={catFill}
                strokeWidth="6"
                strokeLinecap="round"
                animate={{ d: active ? ["M78 75 L99 86", "M78 75 L70 89", "M78 75 L99 86"] : undefined }}
                transition={{ repeat: Infinity, duration: 0.72, ease: "easeInOut" }}
              />
              <motion.path
                d="M91 72 L111 82"
                stroke={catFill}
                strokeWidth="5.5"
                strokeLinecap="round"
                animate={{ d: active ? ["M91 72 L111 82", "M91 72 L84 86", "M91 72 L111 82"] : undefined }}
                transition={{ repeat: Infinity, duration: 0.72, ease: "easeInOut", delay: 0.08 }}
              />
              <ellipse cx="35" cy="87" rx="7" ry="3" fill={catFill} />
              <ellipse cx="99" cy="86" rx="7" ry="3" fill={catFill} />
              <ellipse cx="111" cy="82" rx="6" ry="2.7" fill={catFill} />
            </motion.g>
            <motion.path
              d="M29 31 C48 24 68 26 88 20"
              stroke={line}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="5 7"
              animate={{ strokeDashoffset: [0, -24], opacity: [0.22, 0.65, 0.22] }}
              transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
            />
          </svg>
        </motion.div>
      ) : null}

      <div className="absolute inset-y-0 right-0 w-[38%] bg-gradient-to-l from-black/[0.02] to-transparent dark:from-white/[0.018]" />
    </div>
  );
}

export default function MindBreakPage() {
  const { resolvedTheme } = useTheme();
  const hasHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const isLight = hasHydrated && resolvedTheme !== "dark";
  const [phase, setPhase] = useState<Phase>("idle");
  const [sequence, setSequence] = useState<TileId[]>([]);
  const [playerStep, setPlayerStep] = useState(0);
  const [activeTile, setActiveTile] = useState<TileId | null>(null);
  const [lastHitTile, setLastHitTile] = useState<TileId | null>(null);
  const [celebrationKey, setCelebrationKey] = useState(0);
  const storedBestRound = useSyncExternalStore(subscribe, getStoredBestRound, () => 0);
  const [bestRound, setBestRound] = useState(0);
  const [message, setMessage] = useState(
    "Watch the glowing tiles carefully, then tap them back in the same order.",
  );

  const timeoutsRef = useRef<number[]>([]);

  const round = sequence.length;
  const remaining = Math.max(0, round - playerStep);
  const canPressTiles = phase === "player";
  const accentColors = [
    "rgba(255,176,78,0.88)",
    "rgba(56,189,248,0.86)",
    "rgba(52,211,153,0.84)",
    "rgba(244,114,182,0.86)",
  ];
  const tuneAlpha = (color: string, alpha: string) =>
    color.replace(/0\.\d+\)/, `${alpha})`);
  const accentCardStyle = (color: string) =>
    isLight
      ? {
          borderColor: tuneAlpha(color, "0.32"),
          background:
            "linear-gradient(180deg, rgba(255,251,245,0.98), rgba(250,245,237,0.98))",
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.48), 0 14px 28px ${tuneAlpha(color, "0.13")}`,
        }
      : {
          borderColor: tuneAlpha(color, "0.34"),
          background: `radial-gradient(circle at 88% 16%, ${tuneAlpha(color, "0.18")}, transparent 42%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.025))`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.09), 0 16px 30px ${tuneAlpha(color, "0.08")}`,
        };
  const helperTitleStyle = {
    color: isLight ? "rgba(50,46,42,0.62)" : "rgba(245,236,225,0.52)",
  };
  const helperBodyStyle = {
    color: isLight ? "rgba(50,46,42,0.74)" : "rgba(245,236,225,0.68)",
  };

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
    document.body.style.height = "var(--app-height)";
    document.documentElement.style.height = "var(--app-height)";
    document.body.style.maxHeight = "var(--app-height)";
    document.documentElement.style.maxHeight = "var(--app-height)";

    if (mainElement instanceof HTMLElement) {
      mainElement.style.overflow = "hidden";
      mainElement.style.paddingBottom = "0";
      mainElement.style.minHeight = "calc(var(--app-height) - 7.5rem)";
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
    setLastHitTile(null);
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
    setCelebrationKey((key) => key + 1);
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
    setLastHitTile(null);
    setMessage(
      sequence.length <= 1
        ? "Wrong tile. Press Start Game and try again."
        : `You reached round ${sequence.length}. Press Start Game to try again.`,
    );
  }

  function handleTilePress(tileId: TileId) {
    if (!canPressTiles) return;

    setActiveTile(tileId);
    setLastHitTile(tileId);
    const releaseTimer = window.setTimeout(() => {
      setActiveTile((current) => (current === tileId ? null : current));
      setLastHitTile((current) => (current === tileId ? null : current));
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
      <div className="flex h-[calc(var(--app-height)-12.5rem)] w-full min-h-[620px] flex-col">
        <div className="h-full">
          <section className="card page-light-card flex h-full min-h-0 overflow-hidden p-0">
            <div
              className="relative isolate flex min-h-0 flex-1 flex-col overflow-hidden rounded-[20px] px-5 py-5 md:px-7 md:py-6"
              style={
                isLight
                  ? {
                      background: "linear-gradient(180deg, rgba(255,251,245,0.96), rgba(247,242,235,0.94))",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.5), 0 16px 34px rgba(106,82,52,0.12)",
                    }
                  : {
                      background:
                        "radial-gradient(circle at top left, rgba(255,176,78,0.16), transparent 28%), radial-gradient(circle at top right, rgba(34,211,238,0.12), transparent 32%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                    }
              }
            >
              <div
                className="absolute inset-0 -z-10"
                style={
                  isLight
                    ? {
                        background:
                          "linear-gradient(135deg, rgba(255,220,168,0.08), transparent 46%, rgba(194,232,247,0.08))",
                      }
                    : {
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.12), transparent 40%, rgba(255,255,255,0.08))",
                    }
                }
              />
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-2xl">
                  <div
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]"
                    style={
                      isLight
                        ? {
                            color: "rgba(84,72,60,0.56)",
                            background: "rgba(255,255,255,0.55)",
                            borderColor: "rgba(90,68,41,0.08)",
                          }
                        : {
                            color: "rgba(255,255,255,0.6)",
                            background: "rgba(255,255,255,0.06)",
                            borderColor: "rgba(255,255,255,0.1)",
                          }
                    }
                  >
                    <Brain size={14} />
                    Interactive Reset
                  </div>
                  <h1
                    className="mt-3 text-4xl font-black tracking-[-0.06em] md:text-5xl"
                    style={{ color: isLight ? "rgba(34,34,40,0.96)" : "rgba(255,255,255,0.92)" }}
                  >
                    Mind Break Lab
                  </h1>
                  <p
                    className="mt-3 max-w-xl text-sm leading-6 md:text-base"
                    style={{ color: isLight ? "rgba(50,46,42,0.76)" : "rgba(255,255,255,0.68)" }}
                  >
                    A calm memory game built to show timed animation, state handling, feedback, and playful UI thinking.
                  </p>
                </div>

                <div className="grid w-full gap-3 sm:grid-cols-3 xl:max-w-[320px]">
                  {stats.map((stat, index) => {
                    const color = accentColors[index % accentColors.length]!;
                    return (
                    <motion.div
                      key={stat.label}
                      className="relative overflow-hidden rounded-[24px] border p-4"
                      style={accentCardStyle(color)}
                      whileHover={{ y: -2 }}
                    >
                      <motion.span
                        className="pointer-events-none absolute -right-6 top-0 h-16 w-16 rounded-full blur-2xl"
                        style={{ background: color }}
                        animate={{ opacity: [0.12, 0.28, 0.12], scale: [0.9, 1.08, 0.9] }}
                        transition={{ duration: 3.2 + index * 0.25, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: isLight ? "rgba(50,46,42,0.5)" : "rgba(255,255,255,0.45)" }}>
                        {stat.label}
                      </div>
                      <div className="relative mt-2 text-3xl font-black tracking-[-0.05em]" style={{ color: isLight ? "rgba(34,34,40,0.92)" : color }}>
                        {stat.value}
                      </div>
                    </motion.div>
                    );
                  })}
                </div>
              </div>

              <motion.div
                className="relative mt-4 overflow-hidden rounded-[24px] border p-4 text-sm"
                style={{
                  ...accentCardStyle("rgba(255,176,78,0.88)"),
                  color: isLight ? "rgba(50,46,42,0.76)" : "rgba(255,255,255,0.7)",
                }}
                whileHover={{ y: -2 }}
              >
                <motion.span
                  className="pointer-events-none absolute -right-8 top-0 h-20 w-20 rounded-full bg-[#ffb04e] blur-2xl"
                  animate={{ opacity: [0.12, 0.28, 0.12], scale: [0.9, 1.08, 0.9] }}
                  transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="flex items-start gap-3">
                  <Sparkles
                    size={18}
                    className="mt-0.5 shrink-0 text-amber-500 dark:text-amber-300"
                  />
                  <div>
                    <div className="font-semibold" style={{ color: isLight ? "rgba(34,34,40,0.9)" : "rgba(255,255,255,0.88)" }}>
                      {message}
                    </div>
                    <div className="mt-1" style={{ color: isLight ? "rgba(50,46,42,0.68)" : "rgba(255,255,255,0.55)" }}>
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
              </motion.div>

              <motion.div
                className="relative mt-4 grid min-h-0 flex-1 gap-4 overflow-hidden rounded-[32px] border p-3 md:grid-cols-2"
                style={{
                  borderColor: isLight ? "rgba(90,68,41,0.12)" : "rgba(255,255,255,0.1)",
                  background: isLight
                    ? "radial-gradient(circle at 18% 14%, rgba(255,176,78,0.13), transparent 34%), radial-gradient(circle at 86% 20%, rgba(56,189,248,0.12), transparent 36%), linear-gradient(180deg, rgba(255,255,255,0.42), rgba(255,255,255,0.18))"
                    : "radial-gradient(circle at 18% 14%, rgba(255,176,78,0.1), transparent 34%), radial-gradient(circle at 86% 20%, rgba(56,189,248,0.11), transparent 36%), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
                  boxShadow: isLight
                    ? "inset 0 1px 0 rgba(255,255,255,0.62), 0 18px 34px rgba(106,82,52,0.1)"
                    : "inset 0 1px 0 rgba(255,255,255,0.08), 0 18px 36px rgba(0,0,0,0.24)",
                }}
                animate={phase === "fail" ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
                transition={{ duration: 0.34, ease: "easeInOut" }}
              >
                <motion.span
                  className="pointer-events-none absolute inset-y-0 left-[-30%] z-0 w-[30%] rotate-12 blur-md"
                  style={{
                    background: isLight
                      ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.38), transparent)"
                      : "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                  }}
                  animate={{ x: ["0%", "520%"] }}
                  transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.8 }}
                />
                {phase === "success" ? (
                  <div key={celebrationKey} className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-[28px]">
                    {Array.from({ length: 14 }).map((_, burstIndex) => {
                      const color = accentColors[burstIndex % accentColors.length]!;
                      return (
                        <motion.span
                          key={burstIndex}
                          className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
                          style={{ background: color, boxShadow: `0 0 16px ${tuneAlpha(color, "0.38")}` }}
                          initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                          animate={{
                            x: Math.cos((burstIndex / 14) * Math.PI * 2) * (72 + (burstIndex % 4) * 20),
                            y: Math.sin((burstIndex / 14) * Math.PI * 2) * (42 + (burstIndex % 5) * 18),
                            opacity: [0, 0.85, 0],
                            scale: [0.4, 1.15, 0.7],
                          }}
                          transition={{ duration: 0.9, ease: "easeOut" }}
                        />
                      );
                    })}
                  </div>
                ) : null}
                {tiles.map((tile, index) => {
                  const isActive = activeTile === tile.id;
                  const isDisabled = !canPressTiles;
                  const isHit = lastHitTile === tile.id;
                  const tileColor = accentColors[index % accentColors.length]!;

                  return (
                    <motion.button
                      key={tile.id}
                      type="button"
                      onClick={() => handleTilePress(tile.id)}
                      disabled={isDisabled}
                      className={`group relative z-10 min-h-[148px] overflow-hidden rounded-[26px] border p-5 text-left transition duration-200 ${
                        isActive ? "scale-[1.01]" : "hover:-translate-y-1"
                      } ${isDisabled ? "cursor-default" : "cursor-pointer"}`}
                      style={
                        isActive
                          ? isLight
                            ? {
                                borderColor: tuneAlpha(tileColor, "0.56"),
                                background: `radial-gradient(circle at 82% 18%, ${tuneAlpha(tileColor, "0.38")}, transparent 44%), linear-gradient(135deg, rgba(255,251,245,0.98), rgba(250,245,237,0.9))`,
                                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.62), 0 0 34px ${tuneAlpha(tileColor, "0.28")}`,
                              }
                            : {
                                borderColor: tuneAlpha(tileColor, "0.62"),
                                background: `radial-gradient(circle at 82% 18%, ${tuneAlpha(tileColor, "0.42")}, transparent 44%), linear-gradient(135deg, rgba(22,22,28,0.98), rgba(7,8,12,0.94))`,
                                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 0 36px ${tuneAlpha(tileColor, "0.28")}`,
                              }
                          : isLight
                            ? {
                                borderColor: tuneAlpha(tileColor, "0.32"),
                                background: `radial-gradient(circle at 86% 18%, ${tuneAlpha(tileColor, "0.14")}, transparent 42%), linear-gradient(180deg, rgba(255,251,245,0.98), rgba(250,245,237,0.98))`,
                                boxShadow:
                                  `inset 0 1px 0 rgba(255,255,255,0.55), 0 12px 24px ${tuneAlpha(tileColor, "0.13")}`,
                              }
                            : {
                                borderColor: tuneAlpha(tileColor, "0.34"),
                                background: `radial-gradient(circle at 88% 16%, ${tuneAlpha(tileColor, "0.18")}, transparent 42%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.025))`,
                              }
                      }
                      whileHover={isDisabled ? undefined : { y: -4, scale: 1.008 }}
                      animate={
                        isActive
                          ? {
                              y: [0, -5, 0],
                              boxShadow: [
                                `0 0 0 ${tuneAlpha(tileColor, "0")}`,
                                `0 0 34px ${tuneAlpha(tileColor, "0.32")}`,
                                `0 0 0 ${tuneAlpha(tileColor, "0")}`,
                              ],
                            }
                          : undefined
                      }
                      transition={{ duration: isActive ? 0.52 : 0.2, ease: "easeInOut" }}
                    >
                      <TileScene tileId={tile.id} active={isActive} isLight={isLight} />
                      <motion.span
                        className="pointer-events-none absolute bottom-0 left-0 h-1 rounded-r-full"
                        style={{ background: tileColor }}
                        animate={{ width: isActive ? ["18%", "82%", "18%"] : ["14%", "32%", "14%"], opacity: isActive ? [0.55, 1, 0.55] : [0.28, 0.48, 0.28] }}
                        transition={{ duration: isActive ? 0.8 : 4.2, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                      />
                      {isHit ? (
                        <motion.span
                          className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                          style={{
                            borderColor: tuneAlpha(tileColor, "0.48"),
                            background: `radial-gradient(circle, ${tuneAlpha(tileColor, "0.18")}, transparent 64%)`,
                          }}
                          initial={{ scale: 0.2, opacity: 0.72 }}
                          animate={{ scale: 1.65, opacity: 0 }}
                          transition={{ duration: 0.45, ease: "easeOut" }}
                        />
                      ) : null}
                      <motion.span
                        className="pointer-events-none absolute inset-x-4 top-4 h-px rounded-full"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${tuneAlpha(tileColor, isActive ? "0.76" : "0.28")}, transparent)`,
                        }}
                        animate={{
                          x: ["-115%", "115%"],
                          opacity: isActive ? [0, 1, 0] : [0, 0.42, 0],
                        }}
                        transition={{
                          duration: isActive ? 0.85 : 3.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.2,
                        }}
                      />
                      <motion.span
                        className="pointer-events-none absolute right-7 top-8 h-16 w-16 rounded-full border"
                        style={{ borderColor: tuneAlpha(tileColor, isActive ? "0.28" : "0.12") }}
                        animate={{
                          scale: isActive ? [0.72, 1.45, 0.72] : [0.9, 1.14, 0.9],
                          opacity: isActive ? [0.08, 0.42, 0.08] : [0.04, 0.16, 0.04],
                        }}
                        transition={{ duration: isActive ? 1.05 : 4.2, repeat: Infinity, ease: "easeInOut" }}
                      />

                      <div
                        className="absolute right-4 top-4 rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.22em]"
                        style={{
                          background: "transparent",
                          color: isActive ? tileColor : isLight ? "rgba(50,46,42,0.45)" : "rgba(245,236,225,0.45)",
                        }}
                      >
                        {`0${index + 1}`}
                      </div>

                      <div className="relative z-10 flex h-full max-w-[12.5rem] flex-col justify-between">
                        <div>
                        <div className="text-3xl font-black tracking-[-0.06em]" style={{ color: isLight ? "rgba(34,34,40,0.94)" : "rgba(255,255,255,0.92)" }}>
                          {tile.name}
                        </div>
                        <div className="mt-2 text-sm font-semibold" style={{ color: isLight ? "rgba(50,46,42,0.62)" : "rgba(255,255,255,0.6)" }}>
                          {tile.hint}
                        </div>
                        </div>

                        <div
                        className="inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-[0.2em]"
                        style={{
                          borderColor: tuneAlpha(tileColor, isActive ? "0.42" : "0.2"),
                          background: isLight ? "rgba(255,255,255,0.44)" : "rgba(255,255,255,0.045)",
                          color: isActive
                            ? isLight
                              ? "rgba(34,34,40,0.78)"
                              : "rgba(255,255,255,0.82)"
                            : isLight
                              ? "rgba(50,46,42,0.45)"
                              : "rgba(245,236,225,0.42)",
                        }}
                      >
                        {isActive
                          ? "Active"
                          : canPressTiles
                            ? "Tap now"
                            : "Watch first"}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>

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
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-5 py-3 text-sm font-semibold transition hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:text-white/74 dark:hover:bg-white/10"
                  style={isLight ? { color: "rgba(34,34,40,0.72)", background: "rgba(255,255,255,0.72)", borderColor: "rgba(90,68,41,0.1)" } : undefined}
                >
                  <RotateCcw size={16} />
                  Fresh Pattern
                </button>
              </div>
            </div>
          </section>
        </div>

        <aside className="fixed right-6 top-[10.5rem] z-20 hidden w-[280px] gap-4 2xl:grid">
          <motion.div className="card page-light-card relative z-10 overflow-hidden p-5 opacity-[0.82]" style={accentCardStyle("rgba(56,189,248,0.86)")} whileHover={{ y: -2 }}>
            <motion.span
              className="pointer-events-none absolute -right-8 top-0 h-20 w-20 rounded-full bg-sky-400 blur-2xl"
              animate={{ opacity: [0.12, 0.26, 0.12], scale: [0.9, 1.08, 0.9] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              className="text-xs font-semibold uppercase tracking-[0.24em]"
              style={helperTitleStyle}
            >
              How To Play
            </div>
            <div className="mt-4 grid gap-2 text-sm leading-6" style={helperBodyStyle}>
              <p>1. Press <strong>Start Game</strong>.</p>
              <p>2. Watch the tiles glow in order.</p>
              <p>3. Wait for <strong>Your turn</strong>.</p>
              <p>4. Tap the same tiles back.</p>
              <p>5. One mistake ends the run.</p>
            </div>
          </motion.div>

          <motion.div className="card page-light-card relative z-10 overflow-hidden p-5 opacity-[0.82]" style={accentCardStyle("rgba(167,139,250,0.86)")} whileHover={{ y: -2 }}>
            <motion.span
              className="pointer-events-none absolute -right-8 top-0 h-20 w-20 rounded-full bg-[#a78bfa] blur-2xl"
              animate={{ opacity: [0.12, 0.26, 0.12], scale: [0.9, 1.08, 0.9] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              className="text-xs font-semibold uppercase tracking-[0.24em]"
              style={helperTitleStyle}
            >
              Score Guide
            </div>
            <div className="mt-4 grid gap-2 text-sm leading-6" style={helperBodyStyle}>
              <p><strong>Round</strong>: current level.</p>
              <p><strong>Best</strong>: highest saved level.</p>
              <p><strong>Left</strong>: taps left this round.</p>
            </div>
          </motion.div>

          <motion.div className="card page-light-card relative z-10 overflow-hidden p-5 opacity-[0.82]" style={accentCardStyle("rgba(52,211,153,0.84)")} whileHover={{ y: -2 }}>
            <motion.span
              className="pointer-events-none absolute -right-8 top-0 h-20 w-20 rounded-full bg-emerald-400 blur-2xl"
              animate={{ opacity: [0.12, 0.26, 0.12], scale: [0.9, 1.08, 0.9] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              className="text-xs font-semibold uppercase tracking-[0.24em]"
              style={helperTitleStyle}
            >
              Quick Tip
            </div>
            <p className="mt-4 text-sm leading-6" style={helperBodyStyle}>
              Read the tile names in your head while they glow. That makes the
              pattern easier to remember.
            </p>
          </motion.div>
        </aside>
      </div>
    </PageShell>
  );
}
