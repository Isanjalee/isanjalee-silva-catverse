"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type WeatherMode = "sunny" | "rain" | "storm";
export type SeasonMode = "tropical" | "autumn" | "spring" | "winter";

type WeatherContextValue = {
  weather: WeatherMode;
  season: SeasonMode;
  isRainy: boolean;
  windStrength: "breeze" | "windy" | "strong";
  windDirection: "ltr" | "rtl";
  seasonInstant: boolean;
  nextSeason: () => void;
};

const weatherSequence: Array<{ mode: WeatherMode; duration: number }> = [
  { mode: "sunny", duration: 30_000 },
  { mode: "rain", duration: 30_000 },
  { mode: "sunny", duration: 30_000 },
  { mode: "storm", duration: 30_000 },
];

// Season order for the manual toggle button. Spring is the default landing
// season; seasons ONLY change when the user clicks the season control.
const seasonSequence: SeasonMode[] = ["spring", "tropical", "autumn", "winter"];
const DEFAULT_SEASON_INDEX = 0; // spring

const WeatherContext = createContext<WeatherContextValue>({
  weather: "sunny",
  season: "tropical",
  isRainy: false,
  windStrength: "breeze",
  windDirection: "ltr",
  seasonInstant: false,
  nextSeason: () => {},
});

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [seasonIndex, setSeasonIndex] = useState(DEFAULT_SEASON_INDEX);
  const [windDirection, setWindDirection] = useState<"ltr" | "rtl">("ltr");
  const [pageVisible, setPageVisible] = useState(true);
  const [seasonInstant, setSeasonInstant] = useState(false);

  useEffect(() => {
    if (!seasonInstant) return;
    const timer = window.setTimeout(() => setSeasonInstant(false), 80);
    return () => window.clearTimeout(timer);
  }, [seasonInstant]);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () =>
      document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  const season = seasonSequence[seasonIndex];
  const isWinter = season === "winter";

  // Weather (rain/storm) auto-cycles for the lively seasons, but winter is a
  // calm, still, snowy scene — it never gets rain or storm mixed in.
  useEffect(() => {
    if (!pageVisible || isWinter) return;

    const timer = window.setTimeout(() => {
      setSequenceIndex((current) => (current + 1) % weatherSequence.length);
    }, weatherSequence[sequenceIndex].duration);

    return () => window.clearTimeout(timer);
  }, [pageVisible, sequenceIndex, isWinter]);

  useEffect(() => {
    if (!pageVisible || isWinter) return;

    const timer = window.setInterval(() => {
      setWindDirection((current) => (current === "ltr" ? "rtl" : "ltr"));
    }, 18_000);

    return () => window.clearInterval(timer);
  }, [pageVisible, isWinter]);

  // Winter forces a calm, sunny (rain-free) base so no rain/storm VFX layer in.
  const weather = isWinter ? "sunny" : weatherSequence[sequenceIndex].mode;
  const value = useMemo<WeatherContextValue>(
    () => ({
      weather,
      season,
      isRainy: weather !== "sunny",
      windStrength:
        weather === "storm" ? "strong" : weather === "rain" ? "windy" : "breeze",
      windDirection,
      seasonInstant,
      // Seasons change ONLY when the user clicks the season control.
      nextSeason: () => {
        setSeasonIndex((current) => (current + 1) % seasonSequence.length);
        setSeasonInstant(true);
      },
    }),
    [season, weather, windDirection, seasonInstant],
  );

  return (
    <WeatherContext.Provider value={value}>
      <div
        className="weather-state-bridge contents"
        data-weather={weather}
        data-season={season}
        data-wind={value.windStrength}
        data-wind-direction={value.windDirection}
        data-season-instant={seasonInstant ? "true" : "false"}
      >
        {children}
      </div>
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  return useContext(WeatherContext);
}
