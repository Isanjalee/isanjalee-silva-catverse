"use client";

import { useEffect } from "react";

export default function ViewportHeightSync() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;

    const syncViewportHeight = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
        root.style.setProperty("--app-height", `${Math.round(viewportHeight)}px`);
      });
    };

    syncViewportHeight();
    window.addEventListener("resize", syncViewportHeight);
    window.visualViewport?.addEventListener("resize", syncViewportHeight);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", syncViewportHeight);
      window.visualViewport?.removeEventListener("resize", syncViewportHeight);
      root.style.removeProperty("--app-height");
    };
  }, []);

  return null;
}
