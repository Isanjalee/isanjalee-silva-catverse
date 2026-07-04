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

type WeatherContextValue = {
  weather: WeatherMode;
  isRainy: boolean;
  windStrength: "breeze" | "windy" | "strong";
  windDirection: "ltr" | "rtl";
};

const weatherSequence: Array<{ mode: WeatherMode; duration: number }> = [
  { mode: "sunny", duration: 30_000 },
  { mode: "rain", duration: 30_000 },
  { mode: "sunny", duration: 30_000 },
  { mode: "storm", duration: 30_000 },
];

const WeatherContext = createContext<WeatherContextValue>({
  weather: "sunny",
  isRainy: false,
  windStrength: "breeze",
  windDirection: "ltr",
});

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [sequenceIndex, setSequenceIndex] = useState(0);
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

  const weather = weatherSequence[sequenceIndex].mode;
  const value = useMemo<WeatherContextValue>(
    () => ({
      weather,
      isRainy: weather !== "sunny",
      windStrength:
        weather === "storm" ? "strong" : weather === "rain" ? "windy" : "breeze",
      windDirection: sequenceIndex === 2 ? "rtl" : "ltr",
    }),
    [sequenceIndex, weather],
  );

  return (
    <WeatherContext.Provider value={value}>
      <div
        className="weather-state-bridge contents"
        data-weather={weather}
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
