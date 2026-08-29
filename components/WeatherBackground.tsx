"use client";

import { useEffect, useState, type CSSProperties } from "react";
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

const seasonalParticles = Array.from({ length: 16 }, (_, index) => ({
  x: `${4 + ((index * 29) % 91)}%`,
  delay: `${-((index * 1.37) % 12)}s`,
  duration: `${10 + (index % 6) * 1.6}s`,
  drift: `${-22 + ((index * 17) % 45)}px`,
}));

const snowflakes = Array.from({ length: 22 }, (_, index) => ({
  x: `${2 + ((index * 23) % 96)}%`,
  delay: `${-((index * 1.05) % 14)}s`,
  duration: `${11 + (index % 7) * 1.9}s`,
  drift: `${-30 + ((index * 19) % 60)}px`,
  scale: 0.42 + (index % 5) * 0.16,
}));

const winterStars = Array.from({ length: 22 }, (_, index) => ({
  top: `${4 + ((index * 17) % 55)}%`,
  left: `${(index * 13) % 100}%`,
  delay: `${-((index * 0.9) % 6)}s`,
}));

function WinterStars() {
  return (
    <div className="winter-stars" aria-hidden="true">
      {winterStars.map((star, index) => (
        <span
          key={`star-${index}`}
          style={
            {
              "--star-top": star.top,
              "--star-left": star.left,
              animationDelay: star.delay,
            } as CSSProperties & { "--star-top"?: string; "--star-left"?: string }
          }
        />
      ))}
    </div>
  );
}

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

function SeasonDetails({ side }: { side: "left" | "right" | "center" }) {
  return (
    <div className="season-details">
      <div className="season-autumn-glow" />
      <div className="season-autumn-leaves">
        {seasonalParticles.map((particle, index) => (
          <span
            className="season-autumn-leaf"
            key={`${side}-autumn-${index}`}
            style={
              {
                "--x": particle.x,
                "--delay": particle.delay,
                "--duration": particle.duration,
                "--drift": particle.drift,
              } as WeatherStyle
            }
          />
        ))}
      </div>

      <div className="season-spring-glow" />
      <div className="season-spring-petals">
        {seasonalParticles.slice(0, 12).map((particle, index) => (
          <span
            className="season-spring-petal"
            key={`${side}-spring-${index}`}
            style={
              {
                "--x": particle.x,
                "--delay": particle.delay,
                "--duration": `${12 + (index % 5) * 1.8}s`,
                "--drift": particle.drift,
              } as WeatherStyle
            }
          />
        ))}
      </div>

      <div className="season-winter-glow" />
      <div className="season-winter-snow">
        {snowflakes.map((flake, index) => (
          <span
            className="season-winter-flake"
            key={`${side}-winter-${index}`}
            style={
              {
                "--x": flake.x,
                "--delay": flake.delay,
                "--duration": flake.duration,
                "--drift": flake.drift,
                "--scale": flake.scale,
              } as WeatherStyle
            }
          />
        ))}
      </div>
    </div>
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
  season,
}: {
  side: "left" | "right" | "center";
  quiet?: boolean;
  season: string;
}) {
  const isWinter = season === "winter";
  return (
    <div
      className={`weather-zone weather-zone--${side}${quiet ? " weather-zone--quiet" : ""}`}
    >
      <div className="weather-cloud-field">
        <Cloud variant="one" />
        <Cloud variant="two" />
        <Cloud variant="three" />
      </div>

      {isWinter ? null : <Birds />}
      <BreezeLines />
      <SeasonDetails side={side} />

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
  const { weather, windDirection, season, seasonInstant } = useWeather();
  const [smallStrikeSide, setSmallStrikeSide] = useState<
    "left" | "center" | "right"
  >("left");
  const [outagePhase, setOutagePhase] = useState<
    "idle" | "flash" | "blackout" | "restore"
  >("idle");
  useEffect(() => {
    if (weather !== "storm") return;

    const sides = ["left", "center", "right"] as const;
    let sideIndex = sides.indexOf(smallStrikeSide);
    const timer = window.setInterval(() => {
      sideIndex = (sideIndex + 1) % sides.length;
      setSmallStrikeSide(sides[sideIndex]);
    }, 11_000);

    return () => window.clearInterval(timer);
  }, [weather, smallStrikeSide]);

  useEffect(() => {
    const timers: number[] = [];

    if (
      weather !== "storm" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      timers.push(window.setTimeout(() => setOutagePhase("idle"), 0));
      return () => timers.forEach((timer) => window.clearTimeout(timer));
    }

    const triggerDelay = 8_000 + Math.random() * 10_000;
    const blackoutDuration = 5_000 + Math.random() * 2_000;
    timers.push(
      window.setTimeout(() => {
        setOutagePhase("flash");

        timers.push(
          window.setTimeout(() => {
            window.dispatchEvent(new CustomEvent("catverse-power-blast"));
            setOutagePhase("blackout");
          }, 420),
        );
        timers.push(
          window.setTimeout(
            () => setOutagePhase("restore"),
            420 + blackoutDuration,
          ),
        );
        timers.push(
          window.setTimeout(
            () => setOutagePhase("idle"),
            1_320 + blackoutDuration,
          ),
        );
      }, triggerDelay),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [weather]);

  return (
    <>
      <div
        className="weather-background pointer-events-none fixed inset-0"
        data-weather={weather}
        data-season={season}
        data-wind-direction={windDirection}
        data-small-strike={smallStrikeSide}
        data-season-instant={seasonInstant ? "true" : "false"}
        aria-hidden="true"
      >
        <div className="weather-atmosphere" />
        {season === "winter" ? (
          <>
            <div className="winter-bg-tint" aria-hidden="true" />
            <div className="winter-moon-glow" aria-hidden="true" />
            <WinterStars />
          </>
        ) : null}
        <div className="weather-mist">
          <span />
          <span />
          <span />
        </div>
        <WeatherZone side="left" season={season} />
        <WeatherZone side="center" quiet season={season} />
        <WeatherZone side="right" season={season} />
        {season === "winter" || season === "spring" ? null : <Kite />}
        {season === "winter" ? (
          <div className="winter-whiteout" aria-hidden="true" />
        ) : null}
        <div className="weather-storm-flash" />
      </div>

      <div
        className="power-outage-effect pointer-events-none fixed inset-0"
        data-phase={outagePhase}
        aria-hidden="true"
      >
        <div className="power-outage-flash" />
        <svg
          className="power-outage-lightning"
          viewBox="0 0 1000 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <path
            className="power-outage-lightning__main"
            d="M245 -20 L305 118 L278 190 L365 286 L332 366 L428 468 L397 555 L505 690 L478 790 L570 930"
          />
          <path
            className="power-outage-lightning__branch"
            d="M307 120 L415 150 L486 226"
          />
          <path
            className="power-outage-lightning__branch"
            d="M364 287 L500 304 L596 380"
          />
          <path
            className="power-outage-lightning__branch"
            d="M333 367 L221 430 L150 520"
          />
          <path
            className="power-outage-lightning__branch"
            d="M428 469 L560 500 L670 590"
          />
          <path
            className="power-outage-lightning__branch"
            d="M397 555 L305 648 L274 742"
          />
          <path
            className="power-outage-lightning__branch"
            d="M278 190 L195 238 L112 326"
          />
          <path
            className="power-outage-lightning__branch"
            d="M365 286 L438 242 L535 214"
          />
          <path
            className="power-outage-lightning__branch"
            d="M332 366 L422 398 L512 454"
          />
          <path
            className="power-outage-lightning__branch"
            d="M500 304 L572 282 L655 300"
          />
          <path
            className="power-outage-lightning__branch"
            d="M221 430 L168 404 L94 418"
          />
          <path
            className="power-outage-lightning__branch"
            d="M505 690 L604 714 L708 790"
          />
          <path
            className="power-outage-lightning__branch"
            d="M478 790 L399 834 L350 902"
          />
        </svg>
        <div className="power-outage-blackout" />
      </div>
    </>
  );
}
