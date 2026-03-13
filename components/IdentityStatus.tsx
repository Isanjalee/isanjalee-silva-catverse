"use client";

import { useEffect, useState } from "react";

const LOAD_DURATION_MS = 5800;
const BADGE_DURATION_MS = 30000;

export default function IdentityStatus() {
  const [phase, setPhase] = useState<"loading" | "badges">("loading");
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (phase === "loading") {
        setPhase("badges");
        return;
      }

      setCycle((value) => value + 1);
      setPhase("loading");
    }, phase === "loading" ? LOAD_DURATION_MS : BADGE_DURATION_MS);

    return () => window.clearTimeout(timeout);
  }, [phase]);

  if (phase === "badges") {
    return (
      <div className="identity-badges" aria-label="Profile badges">
        <span className="identity-badge identity-badge--neutral">
          Enterprise Software
        </span>
        <span className="identity-badge identity-badge--blue">
          IFS Cloud Experience
        </span>
        <span className="identity-badge identity-badge--neutral">
          Production Systems
        </span>
        <span className="identity-badge identity-badge--green">
          Open to Remote Roles
        </span>
        <span className="identity-badge identity-badge--amber">
          Open to Collaboration
        </span>
        <span className="identity-badge identity-badge--neutral">
          Sri Lanka
        </span>
        <span className="identity-badge identity-badge--blue">GMT +5:30</span>
      </div>
    );
  }

  return (
    <div
      key={cycle}
      className="identity-loader"
      role="img"
      aria-label="Loading progress bar"
    >
      <div className="identity-loader__track" aria-hidden="true">
        <div className="identity-loader__fill" />
      </div>
      <div className="identity-loader__label">LOADING...</div>
    </div>
  );
}
