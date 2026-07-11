"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CircuitBoard, Cpu } from "lucide-react";
import { useEffect, useState } from "react";

const FIRST_NAME = "ISANJALEE";
const LAST_NAME = "SILVA";
const CHARACTER_COUNT = FIRST_NAME.length + LAST_NAME.length;
const BOOT_DURATION_MS = 1850;
const READY_DURATION_MS = 280;
const SESSION_KEY = "catverse-circuit-boot-complete";
const BOOT_STEPS = [
  "Wake cat core",
  "Map circuit grid",
  "Sync neon paws",
  "Decode first name",
  "Resolve surname",
  "Verify UX signals",
  "Mount project data",
  "Link CV channel",
  "Prime contact route",
  "Open Catverse",
];

export default function IdentityStatus({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<"booting" | "ready" | "complete">("booting");
  const [visibleCharacters, setVisibleCharacters] = useState(0);

  useEffect(() => {
    const alreadyBooted = sessionStorage.getItem(SESSION_KEY) === "true";
    let animationFrame = 0;
    let readyTimer = 0;

    if (alreadyBooted || prefersReducedMotion) {
      sessionStorage.setItem(SESSION_KEY, "true");
      animationFrame = requestAnimationFrame(() => {
        setVisibleCharacters(CHARACTER_COUNT);
        setPhase("complete");
        onComplete();
      });
      return () => cancelAnimationFrame(animationFrame);
    }

    const startedAt = performance.now();
    const advanceBoot = (now: number) => {
      const progress = Math.min((now - startedAt) / BOOT_DURATION_MS, 1);
      setVisibleCharacters(Math.ceil(progress * CHARACTER_COUNT));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(advanceBoot);
        return;
      }

      sessionStorage.setItem(SESSION_KEY, "true");
      setPhase("ready");
      readyTimer = window.setTimeout(() => {
        setPhase("complete");
        onComplete();
      }, READY_DURATION_MS);
    };

    animationFrame = requestAnimationFrame(advanceBoot);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(readyTimer);
    };
  }, [onComplete, prefersReducedMotion]);

  if (phase === "complete") return null;

  const firstNameCharacterCount = Math.min(visibleCharacters, FIRST_NAME.length);
  const lastNameCharacterCount = Math.max(
    0,
    visibleCharacters - FIRST_NAME.length,
  );
  const progress = Math.round((visibleCharacters / CHARACTER_COUNT) * 100);
  const activeStepIndex =
    phase === "ready"
      ? BOOT_STEPS.length - 1
      : Math.min(
          BOOT_STEPS.length - 1,
          Math.floor((progress / 100) * BOOT_STEPS.length),
        );

  return (
    <motion.div
      className="identity-circuit-boot identity-circuit-boot--overlay"
      data-phase={phase}
      role="status"
      aria-live="polite"
      aria-label={
        phase === "ready"
          ? "Catverse Circuit Boot. System ready."
          : `Catverse Circuit Boot. Initializing identity, ${progress} percent.`
      }
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <svg
        className="identity-circuit-boot__board"
        viewBox="0 0 760 320"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          d="M0 68 H142 L190 116 H300 L346 70 H520 L566 116 H760"
          initial={{ pathLength: 0, opacity: 0.2 }}
          animate={{ pathLength: 1, opacity: [0.24, 0.78, 0.42] }}
          transition={{ duration: 1.05, ease: "easeInOut" }}
        />
        <motion.path
          className="identity-circuit-boot__path--violet"
          d="M0 256 H126 L176 206 H284 L334 254 H478 L528 204 H760"
          initial={{ pathLength: 0, opacity: 0.16 }}
          animate={{ pathLength: 1, opacity: [0.2, 0.68, 0.38] }}
          transition={{ duration: 1.2, delay: 0.1, ease: "easeInOut" }}
        />
        <motion.path
          className="identity-circuit-boot__path--amber"
          d="M92 0 V48 L142 98 V156 L204 218 V320 M650 0 V56 L600 106 V166 L544 222 V320"
          initial={{ pathLength: 0, opacity: 0.16 }}
          animate={{ pathLength: 1, opacity: [0.18, 0.7, 0.36] }}
          transition={{ duration: 1.25, delay: 0.18, ease: "easeInOut" }}
        />
        {[
          [142, 68],
          [300, 116],
          [520, 70],
          [176, 206],
          [478, 254],
          [600, 106],
        ].map(([cx, cy], index) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="4"
            initial={{ scale: 0.4, opacity: 0.15 }}
            animate={{ scale: [0.5, 1.5, 0.8], opacity: [0.2, 1, 0.5] }}
            transition={{
              duration: 0.8,
              delay: 0.16 + index * 0.09,
              ease: "easeOut",
            }}
          />
        ))}
      </svg>

      <div className="identity-circuit-boot__terminal">
        <div className="identity-circuit-boot__terminal-top">
          <span>
            <CircuitBoard size={13} aria-hidden="true" />
            Catverse Circuit Boot
          </span>
          <span>{phase === "ready" ? "100%" : `${progress}%`}</span>
        </div>

        <div className="identity-circuit-boot__command">
          <Cpu size={13} aria-hidden="true" />
          {phase === "ready" ? "SYSTEM READY" : "INITIALIZING IDENTITY…"}
          <span className="identity-circuit-boot__cursor" aria-hidden="true" />
        </div>

        <div className="identity-circuit-boot__name" aria-hidden="true">
          <span>
            <b>{FIRST_NAME.slice(0, firstNameCharacterCount)}</b>
            <i>{FIRST_NAME.slice(firstNameCharacterCount)}</i>
          </span>
          <span>
            <b>{LAST_NAME.slice(0, lastNameCharacterCount)}</b>
            <i>{LAST_NAME.slice(lastNameCharacterCount)}</i>
          </span>
        </div>

        <div className="identity-circuit-boot__rail" aria-hidden="true">
          <motion.span
            className="identity-circuit-boot__signal"
            style={{ width: `${phase === "ready" ? 100 : progress}%` }}
          />
          <span className="identity-circuit-boot__node identity-circuit-boot__node--one" />
          <span className="identity-circuit-boot__node identity-circuit-boot__node--two" />
          <span className="identity-circuit-boot__node identity-circuit-boot__node--three" />
        </div>

        <div className="identity-circuit-boot__steps" aria-hidden="true">
          {BOOT_STEPS.map((step, index) => (
            <span
              key={step}
              className={
                index <= activeStepIndex
                  ? "identity-circuit-boot__step identity-circuit-boot__step--active"
                  : "identity-circuit-boot__step"
              }
            >
              <b>{String(index + 1).padStart(2, "0")}</b>
              {step}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
