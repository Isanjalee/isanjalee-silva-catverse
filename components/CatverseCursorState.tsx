"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const LOADING_CLASS = "catverse-route-loading";

const isInternalNavigation = (anchor: HTMLAnchorElement) => {
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#")) return false;

  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return false;
  if (url.pathname === window.location.pathname && url.hash) return false;

  return true;
};

export default function CatverseCursorState() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.remove(LOADING_CLASS);
  }, [pathname]);

  useEffect(() => {
    let loadingTimer = 0;

    const clearLoading = () => {
      window.clearTimeout(loadingTimer);
      document.body.classList.remove(LOADING_CLASS);
    };

    const setLoading = () => {
      document.body.classList.add(LOADING_CLASS);
      window.clearTimeout(loadingTimer);
      loadingTimer = window.setTimeout(clearLoading, 1200);
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (!isInternalNavigation(anchor)) return;

      setLoading();
    };

    const handleBeforeUnload = () => {
      document.body.classList.add(LOADING_CLASS);
    };

    document.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
      capture: true,
    });
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearLoading();
      document.removeEventListener("pointerdown", handlePointerDown, {
        capture: true,
      });
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null;
}
