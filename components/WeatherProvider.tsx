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
export type SeasonMode = "tropical" | "autumn" | "spring";

type WeatherContextValue = {
  weather: WeatherMode;
  season: SeasonMode;
  isRainy: boolean;
  windStrength: "breeze" | "windy" | "strong";
  windDirection: "ltr" | "rtl";
  nextSeason: () => void;
};

const weatherSequence: Array<{ mode: WeatherMode; duration: number }> = [
  { mode: "sunny", duration: 30_000 },
  { mode: "rain", duration: 30_000 },
  { mode: "sunny", duration: 30_000 },
  { mode: "storm", duration: 30_000 },
];

const seasonSequence: Array<{ mode: SeasonMode; duration: number }> = [
  { mode: "tropical", duration: 90_000 },
  { mode: "autumn", duration: 90_000 },
  { mode: "spring", duration: 90_000 },
];

const WeatherContext = createContext<WeatherContextValue>({
  weather: "sunny",
  season: "tropical",
  isRainy: false,
  windStrength: "breeze",
  windDirection: "ltr",
  nextSeason: () => {},
});

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [seasonIndex, setSeasonIndex] = useState(0);
  const [seasonRevision, setSeasonRevision] = useState(0);
  const [windDirection, setWindDirection] = useState<"ltr" | "rtl">("ltr");
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () =>
      document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    if (!pageVisible) return;

    const timer = window.setTimeout(() => {
      setSequenceIndex((current) => (current + 1) % weatherSequence.length);
    }, weatherSequence[sequenceIndex].duration);

    return () => window.clearTimeout(timer);
  }, [pageVisible, sequenceIndex]);

  useEffect(() => {
    if (!pageVisible) return;

    const timer = window.setInterval(() => {
      setWindDirection((current) => (current === "ltr" ? "rtl" : "ltr"));
    }, 18_000);

    return () => window.clearInterval(timer);
  }, [pageVisible]);

  useEffect(() => {
    if (!pageVisible) return;

    const timer = window.setTimeout(() => {
      setSeasonIndex((current) => (current + 1) % seasonSequence.length);
    }, seasonSequence[seasonIndex].duration);

    return () => window.clearTimeout(timer);
  }, [pageVisible, seasonIndex, seasonRevision]);

  const season = seasonSequence[seasonIndex].mode;
  const weather = weatherSequence[sequenceIndex].mode;
  const value = useMemo<WeatherContextValue>(
    () => ({
      weather,
      season,
      isRainy: weather !== "sunny",
      windStrength:
        weather === "storm" ? "strong" : weather === "rain" ? "windy" : "breeze",
      windDirection,
      nextSeason: () => {
        setSeasonIndex((current) => (current + 1) % seasonSequence.length);
        setSeasonRevision((current) => current + 1);
      },
    }),
    [season, weather, windDirection],
  );

  return (
    <WeatherContext.Provider value={value}>
      <div
        className="weather-state-bridge contents"
        data-weather={weather}
        data-season={season}
        data-wind={value.windStrength}
        data-wind-direction={value.windDirection}
      >
        {children}
      </div>
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  return useContext(WeatherContext);
}
