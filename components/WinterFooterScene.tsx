"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useWeather } from "@/components/WeatherProvider";

type Style = CSSProperties & Record<`--${string}`, string | number>;

// ---------- Falling snow: real crystal variety across 3 depth layers ----------
const flakeTypes = [
  "dot",
  "dendrite",
  "dot",
  "plate",
  "sparkle",
  "needle",
  "dot",
  "dendrite",
  "column",
  "rimed",
  "dot",
  "capped-column",
  "sparkle",
  "spatial",
] as const;
const flakeMotions = ["straight", "zigzag", "spin", "straight", "zigzag"] as const;
const flakeHues = ["#ffffff", "#dbeafe", "#ffffff", "#ede9fe", "#e0f2fe"] as const;

const fullSnowflakes = Array.from({ length: 40 }, (_, index) => {
  const depth = index % 3 === 0 ? "bg" : index % 3 === 1 ? "mid" : "fg";
  const type = flakeTypes[index % flakeTypes.length];
  const isSpecial = index === 21;
  const baseScale =
    depth === "bg" ? 0.22 + (index % 4) * 0.08 : depth === "mid" ? 0.4 + (index % 5) * 0.1 : 0.64 + (index % 4) * 0.14;
  const baseDuration =
    depth === "bg" ? 7 + (index % 6) * 0.7 : depth === "mid" ? 10 + (index % 7) * 0.9 : 13 + (index % 6) * 1.2;
  return {
    x: `${(index * 2.5) % 100}%`,
    delay: `${-((index * 0.67) % 16)}s`,
    duration: `${baseDuration}s`,
    drift: `${-36 + ((index * 21) % 72)}px`,
    scale: type === "sparkle" ? 0.5 + (index % 4) * 0.15 : baseScale,
    opacity: isSpecial ? 1 : depth === "bg" ? 0.32 + (index % 4) * 0.1 : depth === "mid" ? 0.5 + (index % 4) * 0.1 : 0.72 + (index % 3) * 0.1,
    type: isSpecial ? "special" : type,
    motion: flakeMotions[index % flakeMotions.length],
    hue: flakeHues[index % flakeHues.length],
    depth,
  };
});

function WinterSnowfall() {
  return (
    <div className="winter-snowfall" aria-hidden="true">
      {fullSnowflakes.map((flake, index) => (
        <span
          className={`winter-snowfall__flake winter-snowfall__flake--${flake.type} winter-snowfall__flake--motion-${flake.motion} winter-snowfall__flake--${flake.depth}`}
          key={`full-flake-${index}`}
          style={
            {
              "--x": flake.x,
              "--delay": flake.delay,
              "--duration": flake.duration,
              "--drift": flake.drift,
              "--scale": flake.scale,
              "--flake-opacity": flake.opacity,
              "--flake-hue": flake.hue,
            } as Style
          }
        >
          <span className="winter-snowfall__flake-core" />
        </span>
      ))}
    </div>
  );
}

function WindGust() {
  return (
    <div className="winter-wind-gust" aria-hidden="true">
      <span />
      <span />
    </div>
  );
}

// ---------- Ground: one continuous, gently undulating snow strip ----------
const groundSparkles = Array.from({ length: 16 }, (_, index) => ({
  x: `${2 + ((index * 23) % 96)}%`,
  delay: `${(index % 6) * 0.5}s`,
}));

const groundPatches = [
  { x: "38%", width: 22, delay: 0 },
  { x: "58%", width: 18, delay: 0.8 },
  { x: "74%", width: 24, delay: 1.4 },
] as const;

function WinterGroundStrip() {
  return (
    <div className="winter-ground-strip" aria-hidden="true">
      <svg
        className="winter-ground-strip__svg"
        viewBox="0 0 1000 60"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* the right end rises into a small hill — the corner snowmen stand
            on it, lifted clear of the floating copyright badge below */}
        <path
          className="winter-ground-strip__fill"
          d="M0 30 C 90 14, 170 40, 260 24 C 350 10, 430 36, 520 22 C 600 10, 660 22, 720 16 C 800 6, 900 6, 1000 2 L1000 60 L0 60 Z"
        />
        <path
          className="winter-ground-strip__line"
          d="M0 30 C 90 14, 170 40, 260 24 C 350 10, 430 36, 520 22 C 600 10, 660 22, 720 16 C 800 6, 900 6, 1000 2"
          fill="none"
        />
        {/* soft rounded drift mounds for an illustrated, piled-up feel */}
        <ellipse className="winter-ground-strip__mound" cx="150" cy="34" rx="46" ry="12" />
        <ellipse className="winter-ground-strip__mound" cx="470" cy="38" rx="58" ry="14" />
        <ellipse className="winter-ground-strip__mound" cx="830" cy="32" rx="50" ry="12" />
      </svg>
      <div className="winter-ground-strip__sparkles">
        {groundSparkles.map((sparkle, index) => (
          <span
            key={`ground-sparkle-${index}`}
            className="winter-ground-strip__sparkle"
            style={{ left: sparkle.x, animationDelay: sparkle.delay }}
          />
        ))}
      </div>
      <div className="winter-ground-strip__patches">
        {groundPatches.map((patch, index) => (
          <span
            key={`ground-patch-${index}`}
            className="winter-ground-strip__patch"
            style={{ left: patch.x, width: `${patch.width}px`, animationDelay: `${patch.delay}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// ---------- House with chimney smoke ----------
const smokePuffs = [0, 1, 2, 3] as const;

function WinterHouse() {
  return (
    <div className="winter-house" aria-hidden="true">
      <div className="winter-house__smoke">
        {smokePuffs.map((puff) => (
          <span key={`smoke-${puff}`} style={{ animationDelay: `${puff * 1.1}s` }} />
        ))}
      </div>
      <svg
        className="winter-house__figure"
        viewBox="0 0 110 100"
        preserveAspectRatio="xMidYMax meet"
        fill="none"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <defs>
          <pattern id="winterHouseBrick" width="12" height="7" patternUnits="userSpaceOnUse">
            <rect width="12" height="7" className="winter-house__brick-mortar" />
            <rect x="0.5" y="0.5" width="5" height="2.6" className="winter-house__brick" />
            <rect x="6.5" y="0.5" width="5" height="2.6" className="winter-house__brick" />
            <rect x="3.5" y="3.6" width="5" height="2.6" className="winter-house__brick" />
            <rect x="-2.5" y="3.6" width="5" height="2.6" className="winter-house__brick" />
            <rect x="9.5" y="3.6" width="5" height="2.6" className="winter-house__brick" />
          </pattern>
        </defs>

        <ellipse className="winter-house__shadow" cx="55" cy="96" rx="42" ry="5" />
        <rect className="winter-house__chimney" x="72" y="12" width="12" height="26" />
        <polygon className="winter-house__roof" points="8,46 55,10 102,46" />
        {/* Festive string lights along the roofline */}
        <g className="winter-house__lights">
          {[0.12, 0.24, 0.36, 0.48, 0.62, 0.74, 0.86].map((t, i) => {
            const x = t < 0.5 ? 8 + (55 - 8) * (t / 0.5) : 55 + (102 - 55) * ((t - 0.5) / 0.5);
            const y = t < 0.5 ? 46 - (46 - 10) * (t / 0.5) : 10 + (46 - 10) * ((t - 0.5) / 0.5);
            return (
              <circle
                key={`light-${i}`}
                className="winter-house__light"
                cx={x}
                cy={y + 3}
                r="1.5"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            );
          })}
        </g>
        <path className="winter-house__roof-snow" d="M8 46 L55 10 L102 46 L96 46 L55 18 L14 46 Z" />
        <rect className="winter-house__wall" x="16" y="46" width="78" height="46" fill="url(#winterHouseBrick)" />
        {/* icicles hanging off the eave, catching a slow glint */}
        <g className="winter-house__icicles">
          {[16, 25, 34, 76, 85, 94].map((x, i) => {
            const len = 4.5 + (i % 3) * 2.2;
            return (
              <path
                key={`icicle-${i}`}
                className="winter-house__icicle"
                d={`M${x - 1.3} 46 L${x + 1.3} 46 L${x} ${46 + len} Z`}
                style={{ animationDelay: `${i * 0.45}s` }}
              />
            );
          })}
        </g>
        <rect className="winter-house__door" x="48" y="64" width="14" height="28" rx="1.5" />
        {/* Wreath on the door */}
        <g className="winter-house__wreath">
          <circle cx="55" cy="72" r="4.6" className="winter-house__wreath-ring" />
          <path
            d="M52.4 75.6 L51 78.4 L53.4 77.4 L55 79.6 L56.6 77.4 L59 78.4 L57.6 75.6"
            className="winter-house__wreath-bow"
          />
        </g>
        <rect className="winter-house__window winter-house__window--left" x="26" y="56" width="16" height="16" rx="1" />
        <rect className="winter-house__window winter-house__window--right" x="68" y="56" width="16" height="16" rx="1" />
        <path
          className="winter-house__window-cross"
          d="M34 56 L34 72 M26 64 L42 64 M76 56 L76 72 M68 64 L84 64"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path className="winter-house__snowdrift" d="M10 92 Q30 82 55 90 Q80 82 100 92 L100 96 L10 96 Z" />
      </svg>
    </div>
  );
}

// ---------- Big snowman: detailed, characterful ----------
const snowmanPatches = [
  { x: "6%", w: 30, delay: 0 },
  { x: "58%", w: 22, delay: 0.5 },
  { x: "82%", w: 26, delay: 1.1 },
] as const;

function Snowman() {
  return (
    <div className="weather-snowman" aria-hidden="true">
      <div className="weather-snowman__glow" />
      <div className="weather-snowman__patches">
        {snowmanPatches.map((patch, index) => (
          <span
            key={`snowman-patch-${index}`}
            className="weather-snowman__patch"
            style={{ left: patch.x, width: `${patch.w}px`, animationDelay: `${patch.delay}s` }}
          />
        ))}
      </div>
      <svg
        className="weather-snowman__figure"
        viewBox="0 0 90 122"
        preserveAspectRatio="xMidYMax meet"
        fill="none"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <ellipse className="weather-snowman__shadow" cx="45" cy="115" rx="32" ry="5.5" />

        <path
          className="weather-snowman__scarf-tail"
          d="M55 43 C 66 50, 64 62, 74 68 C 66 63, 60 66, 58 60 Z"
        />

        <g className="weather-snowman__sway">
          {/* Left arm: a branch stick with two small twigs forking outward near the tip */}
          <path
            className="weather-snowman__arm"
            d="M26 58 L3 47 M8 50 L0 43 M9 52 L1 57"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <g className="weather-snowman__arm-wave">
            {/* Right arm: mirrored twig branch */}
            <path
              className="weather-snowman__arm"
              d="M64 58 L87 47 M82 50 L90 43 M81 52 L89 57"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </g>

          <circle className="weather-snowman__body" cx="45" cy="92" r="27" />
          <circle className="weather-snowman__body" cx="45" cy="53" r="20" />

          <path
            className="weather-snowman__scarf"
            d="M28 39 Q45 49 62 39 L62 45 Q45 55 28 45 Z"
          />

          <circle className="weather-snowman__head" cx="45" cy="22" r="15.5" />

          <polygon className="weather-snowman__nose" points="45,23 63,26.5 45,30" />
          <g className="weather-snowman__blink">
            <circle className="weather-snowman__eye" cx="38" cy="18" r="1.9" />
            <circle className="weather-snowman__eye" cx="52" cy="18" r="1.9" />
          </g>
          <path
            className="weather-snowman__mouth weather-snowman__mouth--idle"
            d="M37 27 Q45 31.5 53 27"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            className="weather-snowman__mouth weather-snowman__mouth--smile"
            d="M35 26 Q45 36 55 26"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle className="weather-snowman__button" cx="45" cy="48" r="1.9" />
          <circle className="weather-snowman__button" cx="45" cy="57" r="1.9" />
          <circle className="weather-snowman__button" cx="45" cy="66" r="1.9" />

          {/* cold breath puffs — only visible on hover, drift up and fade */}
          <g className="weather-snowman__breath">
            <circle className="weather-snowman__breath-puff" cx="59" cy="25" r="2.2" />
            <circle className="weather-snowman__breath-puff" cx="64" cy="21" r="1.6" />
            <circle className="weather-snowman__breath-puff" cx="68" cy="24" r="1.1" />
          </g>

          <path
            className="weather-snowman__hat-brim"
            d="M27 8 Q45 3 63 8 L63 11 Q45 6.5 27 11 Z"
          />
          <rect className="weather-snowman__hat-top" x="33" y="-9" width="24" height="18" rx="2" />
        </g>
      </svg>
    </div>
  );
}

// ---------- Mini snowman: extra-cute, earmuffs + rosy cheeks ----------
// ---------- Mini snowman #1 "Cozy Earmuffs" — pairs with the big snowman ----------
function SnowmanEarmuffs() {
  return (
    <div className="weather-snowman-mini weather-snowman-mini--right" aria-hidden="true">
      <div className="weather-snowman-mini__glow" />
      <svg
        viewBox="0 0 60 76"
        preserveAspectRatio="xMidYMax meet"
        fill="none"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <ellipse className="weather-snowman__shadow" cx="30" cy="72" rx="20" ry="3.6" />
        <g className="weather-snowman-mini__bob">
          <circle className="weather-snowman__body" cx="30" cy="56" r="17" />
          <circle className="weather-snowman__head" cx="30" cy="28" r="13" />
          <circle className="weather-snowman-mini__cheek" cx="21" cy="31" r="2.4" />
          <circle className="weather-snowman-mini__cheek" cx="39" cy="31" r="2.4" />
          <path className="weather-snowman-mini__band" d="M18 22 Q30 12 42 22" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <circle className="weather-snowman-mini__muff" cx="17.5" cy="24" r="3.4" />
          <circle className="weather-snowman-mini__muff" cx="42.5" cy="24" r="3.4" />
          <g className="weather-snowman__blink">
            <circle className="weather-snowman__eye" cx="25" cy="27" r="1.7" />
            <circle className="weather-snowman__eye" cx="35" cy="27" r="1.7" />
          </g>
          <polygon className="weather-snowman__nose" points="30,30 40,32.5 30,35" />
          <path className="weather-snowman__mouth" d="M25 37 Q30 40.5 35 37" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
          <circle className="weather-snowman__button" cx="30" cy="52" r="1.5" />
          <circle className="weather-snowman__button" cx="30" cy="59" r="1.5" />
        </g>
      </svg>
    </div>
  );
}

// ---------- Mini snowman #2 "Beanie & Scarf" — stands by the house ----------
function SnowmanBeanie() {
  return (
    <div className="weather-snowman-beanie" aria-hidden="true">
      <div className="weather-snowman-beanie__glow" />
      <svg
        viewBox="0 0 58 78"
        preserveAspectRatio="xMidYMax meet"
        fill="none"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <ellipse className="weather-snowman__shadow" cx="29" cy="74" rx="19" ry="3.4" />
        <g className="weather-snowman-beanie__sway">
          {/* stubby twig arms, held close to the body */}
          <path
            className="weather-snowman-beanie__arm"
            d="M13 54 L2 58 M45 54 L56 58"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle className="weather-snowman__body" cx="29" cy="58" r="16" />
          <circle className="weather-snowman__head" cx="29" cy="30" r="12.5" />
          {/* knit striped scarf, looped to one side */}
          <path className="weather-snowman-beanie__scarf" d="M17 41 Q29 49 41 41 L41 46 Q29 54 17 46 Z" />
          <path className="weather-snowman-beanie__scarf-stripe" d="M19 43 L19 47 M25 45.4 L25 50.6 M33 45.4 L33 50.6 M39 43 L39 47" stroke="currentColor" strokeWidth="1.3" />
          <path className="weather-snowman-beanie__scarf-tail" d="M38 44 C 46 48, 46 58, 40 62 C 44 55, 41 49, 35 47 Z" />
          <g className="weather-snowman__blink">
            <circle className="weather-snowman__eye" cx="24.5" cy="29" r="1.6" />
            <circle className="weather-snowman__eye" cx="33.5" cy="29" r="1.6" />
          </g>
          <polygon className="weather-snowman__nose" points="29,31.5 37,34 29,37" />
          <path className="weather-snowman__mouth" d="M24.5 39.5 Q29 42.5 33.5 39.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <circle className="weather-snowman__button" cx="29" cy="55" r="1.5" />
          <circle className="weather-snowman__button" cx="29" cy="61" r="1.5" />
          {/* knit beanie with a pom-pom */}
          <path className="weather-snowman-beanie__hat" d="M17 20 Q29 6 41 20 Q41 24 29 24 Q17 24 17 20 Z" />
          <path className="weather-snowman-beanie__hat-band" d="M16.5 20.5 L41.5 20.5 L41.5 24 L16.5 24 Z" />
          <circle className="weather-snowman-beanie__pompom" cx="29" cy="7" r="3" />
        </g>
      </svg>
    </div>
  );
}

// ---------- Mini snowman #3 "Baby Snowball" — the smallest, right at the house door ----------
function SnowmanBaby() {
  return (
    <div className="weather-snowman-baby" aria-hidden="true">
      <svg
        viewBox="0 0 34 40"
        preserveAspectRatio="xMidYMax meet"
        fill="none"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <ellipse className="weather-snowman__shadow" cx="17" cy="38" rx="11" ry="2.2" />
        <g className="weather-snowman-baby__hop">
          <path
            className="weather-snowman-baby__arm"
            d="M9 28 L2 24 M25 28 L32 24"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle className="weather-snowman__body" cx="17" cy="28" r="9.5" />
          <circle className="weather-snowman__head" cx="17" cy="13" r="7.4" />
          <g className="weather-snowman__blink">
            <circle className="weather-snowman__eye" cx="14" cy="12.4" r="1" />
            <circle className="weather-snowman__eye" cx="20" cy="12.4" r="1" />
          </g>
          <circle className="weather-snowman-baby__nose" cx="17" cy="14.6" r="1.1" />
          <path className="weather-snowman__mouth" d="M14.4 17 Q17 19 19.6 17" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" fill="none" />
          <circle className="weather-snowman__button" cx="17" cy="26" r="1" />
          <circle className="weather-snowman__button" cx="17" cy="30.4" r="1" />
          {/* a single sprig on top instead of a hat */}
          <path className="weather-snowman-baby__sprig" d="M17 5.6 L17 1.4 M17 3 L14.6 1 M17 3 L19.4 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

/**
 * The whole winter footer scene — ground strip, pines, house, snowmen, and
 * ambient falling snow — as a single fixed, non-flow layer. Mounted once at
 * the app root (SiteChrome) so every page gets it automatically; renders
 * nothing outside the winter season.
 */
export default function WinterFooterScene() {
  const { season, weather } = useWeather();
  const [gustActive, setGustActive] = useState(false);
  const [firstSnow, setFirstSnow] = useState(false);

  useEffect(() => {
    if (season !== "winter") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let active = true;
    const scheduleGust = () => {
      const delay = 20_000 + Math.random() * 10_000;
      return window.setTimeout(() => {
        if (!active) return;
        setGustActive(true);
        window.setTimeout(() => {
          if (active) setGustActive(false);
        }, 2200);
        scheduleGust();
      }, delay);
    };
    const firstTimer = scheduleGust();

    return () => {
      active = false;
      window.clearTimeout(firstTimer);
    };
  }, [season]);

  useEffect(() => {
    if (season !== "winter") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (localStorage.getItem("catverse-first-snow-seen") === "true") return;

    localStorage.setItem("catverse-first-snow-seen", "true");
    const startTimer = window.setTimeout(() => setFirstSnow(true), 0);
    const endTimer = window.setTimeout(() => setFirstSnow(false), 2600);
    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(endTimer);
    };
  }, [season]);

  if (season !== "winter") return null;

  return (
    <div
      className="winter-footer-scene pointer-events-none fixed inset-0"
      data-season={season}
      data-weather={weather}
      data-gust={gustActive ? "true" : "false"}
      data-first-snow={firstSnow ? "true" : "false"}
      aria-hidden="true"
    >
      <WinterGroundStrip />
      <WinterHouse />
      <SnowmanBeanie />
      <SnowmanBaby />
      <Snowman />
      <SnowmanEarmuffs />
      <WinterSnowfall />
      <WindGust />
    </div>
  );
}
