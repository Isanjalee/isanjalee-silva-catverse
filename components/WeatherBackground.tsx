"use client";

import type { CSSProperties } from "react";
import { useWeather } from "@/components/WeatherProvider";

type WeatherStyle = CSSProperties & {
  "--x"?: string;
  "--y"?: string;
  "--delay"?: string;
  "--duration"?: string;
  "--scale"?: number;
  "--drift"?: string;
};

const leaves = [
  ["12%", "58%", "0s", "44s", 0.82],
  ["72%", "64%", "-0.35s", "44s", 0.62],
  ["38%", "71%", "-0.7s", "44s", 0.7],
  ["82%", "78%", "-1.05s", "44s", 0.9],
  ["18%", "84%", "-1.4s", "44s", 0.56],
  ["58%", "61%", "-1.75s", "44s", 0.74],
] as const;

const rainDrops = Array.from({ length: 24 }, (_, index) => ({
  x: `${4 + ((index * 37) % 92)}%`,
  delay: `${-((index * 0.31) % 2.8)}s`,
  duration: `${0.72 + (index % 5) * 0.1}s`,
  scale: 0.62 + (index % 4) * 0.13,
}));

function Cloud({ variant }: { variant: "one" | "two" | "three" }) {
  return (
    <div className={`weather-cloud weather-cloud--${variant}`}>
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

function Birds() {
  return (
    <svg
      className="weather-birds"
      viewBox="0 0 120 50"
      fill="none"
      aria-hidden="true"
    >
      <path d="M7 20 Q17 10 27 20 Q37 10 47 20" />
      <path d="M67 34 Q75 26 83 34 Q91 26 99 34" />
    </svg>
  );
}

function BreezeLines() {
  return (
    <svg
      className="weather-breeze-lines"
      viewBox="0 0 220 130"
      fill="none"
      aria-hidden="true"
    >
      <path d="M5 32 C48 5 111 7 166 29 C196 41 211 25 198 12" />
      <path d="M15 55 C65 27 128 31 169 52 C188 62 205 54 202 41" />
      <path d="M3 82 C45 55 101 59 139 78 C159 88 181 84 183 68" />
      <path d="M44 103 C83 82 121 88 151 101 C171 110 192 103 191 88" />
      <path d="M166 29 C184 21 198 29 193 42 C189 54 171 54 168 43" />
      <path className="weather-breeze-leaf" d="M54 19 Q65 6 78 17 Q65 24 54 19 Z M65 10 L66 20" />
      <path className="weather-breeze-leaf" d="M120 68 Q132 56 145 67 Q132 75 120 68 Z M131 60 L133 71" />
      <path className="weather-breeze-leaf" d="M83 95 Q94 82 107 93 Q95 101 83 95 Z M94 86 L95 97" />
    </svg>
  );
}

function Kite() {
  return (
    <div className="weather-kite-rig" aria-hidden="true">
      <svg
        className="weather-kite-tether"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
        }}
      >
        <path
          className="weather-kite-tether__halo"
          d="M10.73 26.67 C9 45 5 72 0 100"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.8"
          vectorEffect="non-scaling-stroke"
          style={{
            stroke: "rgba(255,255,255,0.35)",
            strokeWidth: 1.8,
            vectorEffect: "non-scaling-stroke",
          }}
        />
        <path
          className="weather-kite-tether__line"
          d="M10.73 26.67 C9 45 5 72 0 100"
          stroke="rgba(88,28,135,0.55)"
          strokeWidth="0.9"
          vectorEffect="non-scaling-stroke"
          style={{
            stroke: "rgba(88,28,135,0.55)",
            strokeWidth: 0.9,
            vectorEffect: "non-scaling-stroke",
          }}
        />
      </svg>
      <svg
        className="weather-kite"
        viewBox="0 0 120 180"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        style={{
          position: "absolute",
          top: "26.67%",
          left: "10.73%",
          width: "clamp(2rem, 2.4vw, 2.4rem)",
          height: "auto",
          aspectRatio: "2 / 3",
          overflow: "visible",
          opacity: 0.44,
          transform: "translate(-53.33%, -27.78%)",
        }}
      >
        <g className="weather-kite__body">
          <path className="weather-kite__panel weather-kite__panel--purple" d="M24 18 L88 12 L64 50 Z" />
          <path className="weather-kite__panel weather-kite__panel--yellow" d="M88 12 L102 66 L64 50 Z" />
          <path className="weather-kite__panel weather-kite__panel--purple" d="M102 66 L38 92 L64 50 Z" />
          <path className="weather-kite__panel weather-kite__panel--yellow" d="M38 92 L24 18 L64 50 Z" />
          <path className="weather-kite__outline" d="M24 18 L88 12 L102 66 L38 92 Z" />
          <path className="weather-kite__spine" d="M24 18 L102 66 M88 12 L38 92" />
          <g className="weather-kite__tail">
            <path
              className="weather-kite__tail-ribbon weather-kite__tail-ribbon--purple"
              d="M38 92 C61 104 51 126 112 136"
            />
            <path
              className="weather-kite__tail-ribbon weather-kite__tail-ribbon--yellow"
              d="M40 90 C70 101 70 121 116 118"
            />
            <path
              className="weather-kite__tail-ribbon weather-kite__tail-ribbon--purple"
              d="M36 94 C51 117 38 144 98 166"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

function WeatherZone({
  side,
  quiet = false,
}: {
  side: "left" | "right" | "center";
  quiet?: boolean;
}) {
  return (
    <div
      className={`weather-zone weather-zone--${side}${quiet ? " weather-zone--quiet" : ""}`}
    >
      <div className="weather-cloud-field">
        <Cloud variant="one" />
        <Cloud variant="two" />
        <Cloud variant="three" />
      </div>

      <Birds />
      <BreezeLines />

      <div className="weather-leaves">
        {leaves.map(([x, y, delay, duration, scale], index) => (
          <span
            className="weather-leaf"
            key={`${side}-leaf-${index}`}
            style={
              {
                "--x": x,
                "--y": y,
                "--delay": delay,
                "--duration": duration,
                "--scale": scale,
              } as WeatherStyle
            }
          />
        ))}
      </div>

      <div className="weather-rain">
        {rainDrops.map((drop, index) => (
          <span
            className="weather-raindrop"
            key={`${side}-rain-${index}`}
            style={
              {
                "--x": drop.x,
                "--delay": drop.delay,
                "--duration": drop.duration,
                "--scale": drop.scale,
              } as WeatherStyle
            }
          />
        ))}
      </div>

      <svg
        className="weather-lightning"
        viewBox="0 0 70 150"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={`${side}-bolt-white`}
            x1="43"
            y1="6"
            x2="25"
            y2="49"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#ffffff" />
            <stop offset="0.48" stopColor="#dff5ff" />
            <stop offset="1" stopColor="#fff8cf" />
          </linearGradient>
          <linearGradient
            id={`${side}-bolt-yellow`}
            x1="25"
            y1="49"
            x2="31"
            y2="94"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fffdf2" />
            <stop offset="0.42" stopColor="#fff36b" />
            <stop offset="1" stopColor="#ffc72f" />
          </linearGradient>
          <linearGradient
            id={`${side}-bolt-orange`}
            x1="31"
            y1="94"
            x2="24"
            y2="146"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#ffe45c" />
            <stop offset="0.52" stopColor="#ff9f2f" />
            <stop offset="1" stopColor="#ff5a1f" />
          </linearGradient>
        </defs>
        <circle className="weather-lightning__origin" cx="43" cy="7" r="7" />
        <path
          className="weather-lightning__line weather-lightning__line--white"
          d="M43 6 L25 49"
          stroke={`url(#${side}-bolt-white)`}
        />
        <path
          className="weather-lightning__line weather-lightning__line--yellow"
          d="M25 49 L43 49 L31 94"
          stroke={`url(#${side}-bolt-yellow)`}
        />
        <path
          className="weather-lightning__line weather-lightning__line--orange"
          d="M31 94 L50 94 L24 146"
          stroke={`url(#${side}-bolt-orange)`}
        />
      </svg>
    </div>
  );
}

export default function WeatherBackground() {
  const { weather, windDirection } = useWeather();

  return (
    <div
      className="weather-background pointer-events-none fixed inset-0"
      data-weather={weather}
      data-wind-direction={windDirection}
      aria-hidden="true"
    >
      <div className="weather-atmosphere" />
      <WeatherZone side="left" />
      <WeatherZone side="center" quiet />
      <WeatherZone side="right" />
      <Kite />
      <div className="weather-storm-flash" />
    </div>
  );
}
