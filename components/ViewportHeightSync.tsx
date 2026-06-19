"use client";

import { useEffect } from "react";

export default function ViewportHeightSync() {
  useEffect(() => {
    const root = document.documentElement;

    const syncViewportHeight = () => {
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      root.style.setProperty("--app-height", `${viewportHeight}px`);
    };

    syncViewportHeight();
    window.addEventListener("resize", syncViewportHeight);
    window.visualViewport?.addEventListener("resize", syncViewportHeight);
    window.visualViewport?.addEventListener("scroll", syncViewportHeight);

    return () => {
      window.removeEventListener("resize", syncViewportHeight);
      window.visualViewport?.removeEventListener("resize", syncViewportHeight);
      window.visualViewport?.removeEventListener("scroll", syncViewportHeight);
      root.style.removeProperty("--app-height");
    };
  }, []);

  return null;
}
