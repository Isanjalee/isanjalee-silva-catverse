"use client";

import { useEffect, useState } from "react";
import PrivateSignalVault from "@/components/PrivateSignalVault";
import VaultViewportNotice from "@/components/VaultViewportNotice";

const VAULT_VIEWPORT_QUERY = "(min-width: 768px)";

export default function IsanjaleeViewportGate() {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const viewport = window.matchMedia(VAULT_VIEWPORT_QUERY);
    const updateViewport = () => setIsSupported(viewport.matches);

    updateViewport();
    viewport.addEventListener("change", updateViewport);
    return () => viewport.removeEventListener("change", updateViewport);
  }, []);

  if (isSupported === null) {
    return <div className="min-h-dvh bg-[var(--color-bg)]" aria-hidden="true" />;
  }

  if (!isSupported) {
    return <VaultViewportNotice mode="page" />;
  }

  return <PrivateSignalVault initialOpen />;
}
