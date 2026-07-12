"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BrainCircuit, Clock3, Code2, Cog, Cpu, DatabaseZap, Download, Eye, FlaskConical, HeartPulse, Layers3, MessageSquareText, Plane, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import IdentityStatus from "@/components/IdentityStatus";
import PageShell from "@/components/PageShell";

const heroContainer = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.44,
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.36 } },
};

const informationContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.06,
    },
  },
};

const informationItem = {
  hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.42, ease: "easeOut" as const },
  },
};

const subscribe = () => () => {};
const digitalGlyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const informationBootMessages = [
  "Loading full-stack profile",
  "Checking project evidence",
  "Mounting CV and contact routes",
  "Verifying engineering signals",
];

const getDigitalDecodeGlyph = (
  target: string,
  characterIndex: number,
  stepIndex: number,
) => {
  const targetOffset = target.charCodeAt(0) - 65;
  let glyph =
    digitalGlyphs[
      (targetOffset + characterIndex * 11 + stepIndex * 7) %
        digitalGlyphs.length
    ] ?? "0";

  if (glyph === target) {
    glyph =
      digitalGlyphs[
        (digitalGlyphs.indexOf(glyph) + 1) % digitalGlyphs.length
      ] ?? "1";
  }

  return glyph;
};

const tuneAlpha = (color: string, alpha: string) =>
  color.replace(/0\.\d+\)/, `${alpha})`);

const heroCapabilities = [
  {
    label: "MEDLINK",
    value: "Patient Management",
    detail: "Auth | roles | analytics | workflows",
    icon: HeartPulse,
    tone: "medlink",
  },
  {
    label: "IFS + Maintenix",
    value: "Enterprise + Supply Chain",
    detail: "Java | PL-SQL | migration | modules",
    icon: Plane,
    tone: "ifs",
  },
  {
    label: "TRANSPOMATE",
    value: "Transport Management",
    detail: "Automation | maps | approvals | reports",
    icon: Truck,
    tone: "transpomate",
  },
];

const capabilityRows = [
  {
    number: "SDLC",
    title: "Product Engineering",
    detail: "Requirements to maintenance",
    meta: "APIs | UI | QA | release",
    icon: Cog,
    tone: "medlink",
  },
  {
    number: "AI",
    title: "AI Delivery",
    detail: "Automation-assisted",
    meta: "Faster workflows | tooling",
    icon: Cpu,
    tone: "ifs",
  },
  {
    number: "R&D",
    title: "Research Intelligence",
    detail: "Analysis | Applied AI",
    meta: "Forecasting | explainability",
    icon: FlaskConical,
    tone: "transpomate",
  },
];
const achievementSignals = [
  { metric: "2+", label: "Experience", note: "software engineering" },
  { metric: "10+", label: "Automation", note: "workflow tasks" },
  { metric: "3", label: "Domains", note: "health | aviation | transport" },
  { metric: "ML", label: "Research", note: "forecasting models" },
  { metric: "API", label: "Backend", note: "secure integrations" },
  { metric: "ART", label: "Digital Drawing", note: "Illustrator | Photoshop | Figma | XD" },
];

const codeRain = [
  { glyph: "build.fullstack()", left: "8%", delay: 0.2, duration: 17, icon: Code2, color: "rgba(34,211,238,0.86)" },
  { glyph: "await api.secure()", left: "20%", delay: 4.8, duration: 19, icon: ShieldCheck, color: "rgba(251,191,36,0.88)" },
  { glyph: "return <Product />", left: "35%", delay: 2.2, duration: 16.5, icon: Code2, color: "rgba(34,211,238,0.86)" },
  { glyph: "db.migrate()", left: "51%", delay: 7.4, duration: 21, icon: DatabaseZap, color: "rgba(163,230,53,0.88)" },
  { glyph: "test('quality')", left: "66%", delay: 1.1, duration: 18, icon: Sparkles, color: "rgba(251,191,36,0.88)" },
  { glyph: "design.system", left: "79%", delay: 5.9, duration: 20, icon: Layers3, color: "rgba(192,132,252,0.86)" },
  { glyph: "npm run build", left: "14%", delay: 10.1, duration: 22, icon: Code2, color: "rgba(34,211,238,0.86)" },
  { glyph: "ship.product()", left: "60%", delay: 12.7, duration: 20, icon: BrainCircuit, color: "rgba(163,230,53,0.88)" },
];

function DigitalIdentityLetter({
  target,
  index,
  active,
}: {
  target: string;
  index: number;
  active: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [displayedGlyph, setDisplayedGlyph] = useState(() =>
    getDigitalDecodeGlyph(target, index, 0),
  );
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!active || prefersReducedMotion) return;

    const totalSteps = 18 + (index % 4) * 2;
    let stepIndex = 1;
    let timer = 0;

    const decodeNextGlyph = () => {
      if (stepIndex >= totalSteps) {
        setDisplayedGlyph(target);
        setSettled(true);
        return;
      }

      setDisplayedGlyph(getDigitalDecodeGlyph(target, index, stepIndex));
      stepIndex += 1;
      timer = window.setTimeout(decodeNextGlyph, 64);
    };

    timer = window.setTimeout(decodeNextGlyph, 70 + index * 30);
    return () => window.clearTimeout(timer);
  }, [active, index, prefersReducedMotion, target]);

  const hasSettled = settled || !!prefersReducedMotion;

  return (
    <motion.span
      className={`identity-letter--digital ${
        hasSettled
          ? "identity-letter--settled"
          : "identity-letter--decoding"
      }`}
      initial={{ opacity: 0, y: 10, scale: 0.86 }}
      animate={
        active
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 10, scale: 0.86 }
      }
      transition={{
        duration: 0.24,
        delay: 0.03 + index * 0.018,
        ease: "easeOut",
      }}
      style={{ animationDelay: `${index * 95}ms` }}
    >
      {prefersReducedMotion ? target : displayedGlyph}
    </motion.span>
  );
}
function HeroTechScene({ isLight }: { isLight: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: isLight
            ? "radial-gradient(circle, rgba(66,52,38,0.14) 1px, transparent 1px)"
            : "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          opacity: isLight ? 0.18 : 0.16,
        }}
        animate={{ backgroundPosition: ["0px 0px", "24px 24px"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -left-1/3 top-0 h-full w-1/3 rotate-12 blur-sm"
        style={{
          background: isLight
            ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.26), transparent)"
            : "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
          opacity: isLight ? 0.34 : 0.42,
        }}
        animate={{ x: ["0%", "430%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
      />
      {codeRain.map((item) => {
        const RainIcon = item.icon;

        return (
        <motion.span
          key={`${item.glyph}-${item.left}`}
          className="absolute inline-flex select-none items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[0.5rem] font-black tracking-[0.07em] backdrop-blur-md"
          style={{
            left: item.left,
            top: "-12%",
            color: isLight ? "rgba(40,34,29,0.7)" : "rgba(245,236,225,0.72)",
            borderColor: tuneAlpha(item.color, isLight ? "0.26" : "0.28"),
            background: isLight
              ? `linear-gradient(135deg, rgba(255,255,255,0.72), ${tuneAlpha(item.color, "0.13")})`
              : `linear-gradient(135deg, rgba(255,255,255,0.07), ${tuneAlpha(item.color, "0.11")})`,
            boxShadow: `0 0 20px ${tuneAlpha(item.color, isLight ? "0.13" : "0.16")}`,
          }}
          animate={{
            top: ["-12%", "112%"],
            opacity: [0, isLight ? 0.72 : 0.62, isLight ? 0.5 : 0.46, 0],
            x: [0, 10, -8, 0],
            rotate: [-6, 4, -3],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "linear",
            delay: item.delay,
          }}
        >
          <RainIcon size={10} color={item.color} strokeWidth={2.3} />
          {item.glyph}
        </motion.span>
        );
      })}
      <motion.div
        className="absolute left-[18%] top-[14%] h-10 w-36 rounded-full border"
        style={{
          borderColor: isLight ? "rgba(66,52,38,0.08)" : "rgba(255,255,255,0.08)",
          background: isLight ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.026)",
        }}
        animate={{ x: [0, 14, 0], y: [0, -5, 0], opacity: [0.18, 0.34, 0.18] }}
        transition={{ duration: 8.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[18%] left-[24%] h-9 w-28 rounded-full border"
        style={{
          borderColor: isLight ? "rgba(66,52,38,0.08)" : "rgba(255,255,255,0.08)",
          background: isLight ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.024)",
        }}
        animate={{ x: [0, -12, 0], y: [0, 5, 0], opacity: [0.14, 0.3, 0.14] }}
        transition={{ duration: 9.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[9%] top-[20%] h-24 w-24 rounded-[1.8rem] border opacity-40"
        style={{
          borderColor: isLight ? "rgba(34,211,238,0.12)" : "rgba(34,211,238,0.12)",
          background: isLight ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.026)",
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateX: [54, 58, 54], rotateZ: [-12, -7, -12], y: [0, -4, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[13%] right-[11%] h-28 w-28 rounded-[2rem] border opacity-35"
        style={{
          borderColor: isLight ? "rgba(192,132,252,0.12)" : "rgba(192,132,252,0.12)",
          background: isLight ? "rgba(255,255,255,0.11)" : "rgba(255,255,255,0.024)",
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateX: [58, 62, 58], rotateZ: [10, 5, 10], y: [0, 5, 0] }}
        transition={{ duration: 9.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full border opacity-50"
        style={{
          borderColor: isLight ? "rgba(251,191,36,0.06)" : "rgba(251,191,36,0.08)",
          background: isLight
            ? "radial-gradient(circle, rgba(251,191,36,0.07), transparent 64%)"
            : "radial-gradient(circle, rgba(251,191,36,0.08), transparent 64%)",
        }}
        animate={{ scale: [0.98, 1.02, 0.98], opacity: [0.28, 0.48, 0.28] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[12rem] w-[12rem] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border opacity-25"
        style={{
          borderColor: isLight ? "rgba(20,241,196,0.1)" : "rgba(20,241,196,0.12)",
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateX: [58, 61, 58], rotateZ: [-8, 5, -8], y: [0, -3, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[17%] top-[23%] h-2 w-2 rounded-full"
        style={{ background: isLight ? "rgba(66,52,38,0.22)" : "rgba(245,236,225,0.2)" }}
        animate={{ scale: [1, 1.8, 1], opacity: [0.18, 0.42, 0.18] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[25%] right-[28%] h-2 w-2 rounded-full"
        style={{ background: isLight ? "rgba(66,52,38,0.18)" : "rgba(245,236,225,0.18)" }}
        animate={{ scale: [1, 1.7, 1], opacity: [0.16, 0.36, 0.16] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
      />
    </div>
  );
}
export default function HomePage() {
  const { resolvedTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [identityReady, setIdentityReady] = useState(false);
  const [nameDecoded, setNameDecoded] = useState(false);
  const [informationBootStep, setInformationBootStep] = useState(0);
  const [sriLankaTime, setSriLankaTime] = useState("--:--:--");
  const handleIdentityReady = useCallback(() => setIdentityReady(true), []);
  const hasHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const isLight = hasHydrated && resolvedTheme !== "dark";

  useEffect(() => {
    const sriLankaClock = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Colombo",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const updateSriLankaTime = () => {
      setSriLankaTime(sriLankaClock.format(new Date()));
    };

    updateSriLankaTime();
    const timer = window.setInterval(updateSriLankaTime, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!identityReady) return;
    const timer = window.setTimeout(
      () => setNameDecoded(true),
      prefersReducedMotion ? 0 : 1550,
    );
    return () => window.clearTimeout(timer);
  }, [identityReady, prefersReducedMotion]);

  useEffect(() => {
    if (!identityReady || nameDecoded || prefersReducedMotion) return;
    const interval = window.setInterval(() => {
      setInformationBootStep(
        (currentStep) => (currentStep + 1) % informationBootMessages.length,
      );
    }, 520);
    return () => window.clearInterval(interval);
  }, [identityReady, nameDecoded, prefersReducedMotion]);

  useEffect(() => {
    const shouldShowLoadingRat =
      identityReady && !nameDecoded && !prefersReducedMotion;
    document.body.classList.toggle("catverse-name-loading", shouldShowLoadingRat);
    return () => document.body.classList.remove("catverse-name-loading");
  }, [identityReady, nameDecoded, prefersReducedMotion]);

  useEffect(() => {
    const playMouseClick = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest(".home-page-shell")) return;
      if (
        !target.closest(
          "a, button, [role='button'], [role='link'], summary, select",
        )
      ) {
        return;
      }

      if (!prefersReducedMotion) {
        const burst = document.createElement("span");
        burst.className = "catverse-click-burst";
        burst.style.left = `${event.clientX}px`;
        burst.style.top = `${event.clientY}px`;
        document.body.appendChild(burst);
        window.setTimeout(() => burst.remove(), 620);
      }

      const AudioContextCtor =
        window.AudioContext ||
        (window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }).webkitAudioContext;

      if (!AudioContextCtor) return;

      const audioContext = new AudioContextCtor();
      const startedAt = audioContext.currentTime;
      const masterGain = audioContext.createGain();
      const squeakOscillator = audioContext.createOscillator();
      const tickOscillator = audioContext.createOscillator();
      const squeakGain = audioContext.createGain();
      const tickGain = audioContext.createGain();

      masterGain.gain.setValueAtTime(0.045, startedAt);
      masterGain.gain.exponentialRampToValueAtTime(0.001, startedAt + 0.14);

      squeakOscillator.type = "triangle";
      squeakOscillator.frequency.setValueAtTime(760, startedAt);
      squeakOscillator.frequency.exponentialRampToValueAtTime(
        1180,
        startedAt + 0.055,
      );
      squeakOscillator.frequency.exponentialRampToValueAtTime(
        620,
        startedAt + 0.14,
      );

      tickOscillator.type = "square";
      tickOscillator.frequency.setValueAtTime(1800, startedAt);
      tickOscillator.frequency.exponentialRampToValueAtTime(
        960,
        startedAt + 0.038,
      );

      squeakGain.gain.setValueAtTime(0.55, startedAt);
      squeakGain.gain.exponentialRampToValueAtTime(0.001, startedAt + 0.14);
      tickGain.gain.setValueAtTime(0.18, startedAt);
      tickGain.gain.exponentialRampToValueAtTime(0.001, startedAt + 0.045);

      squeakOscillator.connect(squeakGain);
      tickOscillator.connect(tickGain);
      squeakGain.connect(masterGain);
      tickGain.connect(masterGain);
      masterGain.connect(audioContext.destination);

      squeakOscillator.start(startedAt);
      tickOscillator.start(startedAt);
      squeakOscillator.stop(startedAt + 0.145);
      tickOscillator.stop(startedAt + 0.05);

      window.setTimeout(() => void audioContext.close(), 190);
    };

    document.addEventListener("pointerdown", playMouseClick, { passive: true });
    return () => document.removeEventListener("pointerdown", playMouseClick);
  }, [prefersReducedMotion]);

  const accentCardStyle = (color: string) =>
    isLight
      ? {
          borderColor: tuneAlpha(color, "0.34"),
          background:
            "linear-gradient(180deg, rgba(255,251,245,0.98), rgba(250,245,237,0.98))",
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.44), 0 14px 28px ${tuneAlpha(color, "0.13")}`,
        }
      : {
          borderColor: tuneAlpha(color, "0.34"),
          background: `radial-gradient(circle at 88% 16%, ${tuneAlpha(color, "0.18")}, transparent 42%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.025))`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.09), 0 16px 30px ${tuneAlpha(color, "0.08")}`,
        };

  return (
    <PageShell>
      <div className="app-viewport-frame home-viewport-frame flex h-[calc(var(--app-height)-12.5rem)] min-h-0 items-start">
        <section className="home-page-shell card page-light-card h-full w-full overflow-hidden p-0">
          <motion.div
            className="relative h-full px-5 py-4 md:px-7 md:py-5"
            style={{
              display: "flex",
              minHeight: 0,
              flexDirection: "column",
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42 }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(251,191,36,0.15),transparent_38%)] dark:bg-[radial-gradient(circle_at_10%_0%,rgba(251,191,36,0.1),transparent_42%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_100%,rgba(20,241,196,0.12),transparent_36%)] dark:bg-[radial-gradient(circle_at_90%_100%,rgba(192,132,252,0.1),transparent_40%)]" />

            <div
              className="relative flex h-full min-h-0 flex-col"
              style={{
                alignItems: "stretch",
                width: "100%",
              }}
            >
              <motion.div
                className="home-kicker-pill self-start inline-flex items-center gap-2 rounded-full border border-black/14 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#5a4d3f] dark:border-white/12 dark:bg-white/6 dark:text-white/58"
                style={
                  isLight
                    ? {
                        flex: "0 0 auto",
                        color: "#5d4c3a",
                        borderColor: "rgba(73,57,41,0.16)",
                        background: "rgba(255,255,255,0.92)",
                      }
                    : { flex: "0 0 auto" }
                }
                variants={heroItem}
                initial="hidden"
                animate="show"
              >
                <Sparkles size={13} />
                Digital Home Console
              </motion.div>

              <section
                className="home-identity-section mt-2 flex-1"
                style={{
                  display: "flex",
                  minHeight: 0,
                  flex: "1 1 0",
                  width: "100%",
                  maxWidth: "none",
                  alignSelf: "stretch",
                }}
              >
                <motion.div
                  className="card identity-card page-light-card relative h-full w-full max-w-none self-stretch overflow-hidden rounded-2xl border border-black/10 p-4 dark:border-white/10 md:p-5"
                  style={{
                    ...accentCardStyle("rgba(251,191,36,0.88)"),
                    display: "grid",
                    flex: "1 1 0",
                    width: "100%",
                    maxWidth: "none",
                    height: "100%",
                    minHeight: 0,
                    aspectRatio: "auto",
                    alignSelf: "stretch",
                    justifySelf: "stretch",
                    alignItems: "stretch",
                    justifyContent: "stretch",
                  }}
                  whileHover={{ y: -2 }}
                >
                  <motion.span
                    className="pointer-events-none absolute right-8 top-8 h-32 w-32 rounded-full bg-[#fbbf24] blur-3xl"
                    animate={{ opacity: [0.1, 0.22, 0.1], scale: [0.92, 1.08, 0.92] }}
                    transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <HeroTechScene isLight={isLight} />
                  <IdentityStatus onComplete={handleIdentityReady} />
                  {identityReady && !nameDecoded && !prefersReducedMotion ? (
                    <motion.div
                      className="home-loading-rat"
                      role="status"
                      aria-live="polite"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                    >
                      <span className="home-loading-rat__sprite" aria-hidden="true" />
                      <span>Loading profile signals</span>
                    </motion.div>
                  ) : null}
                  <motion.div
                    className="identity-content relative z-10"
                    style={{
                      display: "grid",
                      height: "100%",
                      minHeight: 0,
                      width: "100%",
                      maxWidth: "none",
                      alignSelf: "stretch",
                      justifySelf: "stretch",
                      boxSizing: "border-box",
                      padding: "clamp(0.78rem, 1vw, 1rem)",
                      gridTemplateRows:
                        "max-content minmax(13.2rem, 1fr) max-content",
                      gap: "clamp(0.52rem, 0.86vh, 0.72rem)",
                      alignItems: "stretch",
                    }}
                    variants={heroContainer}
                    initial="hidden"
                    animate={identityReady ? "show" : "hidden"}
                    aria-hidden={!identityReady}
                    inert={!identityReady}
                  >
                    <div
                      className="home-identity-stage"
                      style={{
                        display: "grid",
                        minHeight: 0,
                        alignContent: "start",
                        justifyItems: "center",
                        gap: "clamp(0.28rem, 0.5vh, 0.42rem)",
                      }}
                    >
                      <h1
                        className="identity-heading identity-heading--animated identity-heading--digital"
                        aria-label="Isanjalee Silva"
                      >
                        {["ISANJALEE", "SILVA"].map((line, lineIndex) => (
                          <motion.span
                            key={line}
                            className="identity-line identity-line--digital"
                            variants={heroItem}
                            aria-hidden="true"
                          >
                            {line.split("").map((letter, letterIndex) => (
                              <DigitalIdentityLetter
                                key={`${line}-${letterIndex}`}
                                target={letter}
                                index={lineIndex * 9 + letterIndex}
                                active={identityReady}
                              />
                            ))}
                          </motion.span>
                        ))}
                      </h1>

                      {!nameDecoded ? (
                        <motion.div
                          key={informationBootStep}
                          className="home-information-boot"
                          role="status"
                          aria-live="polite"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span>{`MODULE 0${informationBootStep + 1}`}</span>
                          <b>{informationBootMessages[informationBootStep]}</b>
                          <i aria-hidden="true">
                            <em />
                            <em />
                            <em />
                          </i>
                        </motion.div>
                      ) : null}

                      <motion.div
                        className="home-identity-copy"
                        variants={informationContainer}
                        initial="hidden"
                        animate={nameDecoded ? "show" : "hidden"}
                        aria-hidden={!nameDecoded}
                        inert={!nameDecoded}
                        style={{
                          display: nameDecoded ? "grid" : "none",
                          width: "min(100%, 50rem)",
                          justifyItems: "center",
                        }}
                      >
                        <motion.p className="identity-roles" variants={informationItem}>
                          <span>Full-stack Systems</span>
                          <span>Enterprise Software</span>
                          <span>Applied AI</span>
                          <span>Explainable Models</span>
                        </motion.p>

                        <motion.p
                          className="home-hero-desc max-w-3xl text-sm font-medium leading-7 text-[#3f352d] dark:text-[#f5ece1]/66 md:text-[0.95rem]"
                          style={isLight ? { color: "#3a3027" } : undefined}
                          variants={informationItem}
                        >
                          Software Engineer and Applied AI Researcher turning
                          complex problems into secure products, scalable
                          platforms, and explainable data-driven outcomes.
                        </motion.p>
                      </motion.div>
                    </div>

                    <motion.div
                      className="home-hero-body"
                      variants={informationContainer}
                      initial="hidden"
                      animate={nameDecoded ? "show" : "hidden"}
                      aria-hidden={!nameDecoded}
                      inert={!nameDecoded}
                      style={{
                        display: nameDecoded ? "grid" : "none",
                        minHeight: 0,
                        width: "100%",
                        height: "100%",
                        gridTemplateColumns:
                          "minmax(0, 1fr) minmax(18rem, 1.35fr) minmax(0, 1fr)",
                        gap: "clamp(0.58rem, 0.9vw, 0.78rem)",
                        alignItems: "stretch",
                        overflow: "hidden",
                      }}
                    >
                      <motion.section
                        className="home-hero-panel home-hero-panel--focus"
                        variants={informationItem}
                        aria-label="Current focus"
                        style={{ minHeight: 0, overflow: "hidden" }}
                      >
                        <div className="home-hero-panel__top">
                          <Code2 size={16} aria-hidden="true" />
                          <span className="home-hero-panel__eyebrow">Engineering capability</span>
                        </div>
                        <div className="home-signal-stack" aria-label="Working flow">
                          {capabilityRows.map((row) => {
                            const RowIcon = row.icon;
                            return (
                              <div
                                key={row.number}
                                className={`home-capability-card home-capability-card--${row.tone}`}
                              >
                                <div className="home-capability-card__copy">
                                  <div className="home-capability-card__top">
                                    <span className="home-capability-card__skill">
                                      <RowIcon size={12} strokeWidth={2.45} />
                                      {row.number}
                                    </span>
                                  </div>
                                  <b>{row.title}</b>
                                  <em>{row.detail}</em>
                                  <small>{row.meta}</small>
                                  </div>
                                  <span className="home-capability-card__icon" aria-hidden="true">
                                    <RowIcon size={21} strokeWidth={2.3} />
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                      </motion.section>

                      <motion.section
                        className="home-hero-panel home-hero-panel--capabilities"
                        variants={informationItem}
                        aria-label="Core capabilities"
                        style={{ minHeight: 0, overflow: "hidden" }}
                        >
                        <div className="home-hero-panel__top">
                          <Layers3 size={16} aria-hidden="true" />
                          <span className="home-hero-panel__eyebrow">Industrial projects</span>
                        </div>
                        <div
                          className="home-capability-grid"
                          aria-label="Core portfolio capabilities"
                        >
                          {heroCapabilities.map((capability) => (
                            <div
                              key={capability.label}
                              className={`home-capability-card home-capability-card--${capability.tone}`}
                            >
                              <div className="home-capability-card__copy">
                                <div className="home-capability-card__top">
                                  <span>{capability.label}</span>
                                </div>
                                <b>{capability.value}</b>
                                <em>{capability.detail}</em>
                              </div>
                              <span className="home-capability-card__icon" aria-hidden="true">
                                <capability.icon size={21} strokeWidth={2.3} />
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.section>

                      <motion.section
                        className="home-hero-panel home-hero-panel--proof"
                        variants={informationItem}
                        aria-label="Proof and status"
                        style={{ minHeight: 0, overflow: "hidden" }}
                      >
                        <div className="home-hero-panel__top">
                          <ShieldCheck size={16} aria-hidden="true" />
                          <span className="home-hero-panel__eyebrow">Achievements + research</span>
                        </div>
                        <div className="home-achievement-grid" aria-label="Achievement signals">
                          {achievementSignals.map((item) => (
                            <span key={item.label}>
                              <b>{item.metric}</b>
                              <em>{item.label}</em>
                              <small>{item.note}</small>
                            </span>
                          ))}
                        </div>
                      </motion.section>
                    </motion.div>

                    <motion.div
                      className="home-action-bar"
                      variants={informationContainer}
                      initial="hidden"
                      animate={nameDecoded ? "show" : "hidden"}
                      aria-hidden={!nameDecoded}
                      inert={!nameDecoded}
                      style={{
                        display: nameDecoded ? "flex" : "none",
                        flex: "0 0 auto",
                        width: "100%",
                      }}
                    >
                      <motion.div
                        className="home-primary-actions flex flex-wrap items-center justify-center gap-2"
                        variants={informationItem}
                        aria-label="Portfolio actions"
                      >
                        <div className="home-action-bar__links" aria-label="Primary action group">
                          <Link
                            href="/projects"
                            className="home-primary-action home-primary-action--strong"
                          >
                            <ArrowUpRight size={14} />
                            Explore Projects
                          </Link>
                          <a
                            href="/Isanjalee-Silva-CV.pdf"
                            target="_blank"
                            rel="noreferrer"
                            className="home-primary-action"
                          >
                            <Eye size={14} />
                            View CV
                          </a>
                          <a
                            href="/Isanjalee-Silva-CV.pdf"
                            download="Isanjalee-Silva-CV.pdf"
                            className="home-primary-action"
                          >
                            <Download size={14} />
                            Download CV
                          </a>
                          <Link href="/contact" className="home-primary-action">
                            <MessageSquareText size={14} />
                            Send Message
                          </Link>
                        </div>
                        <div className="home-sl-clock" aria-label="Sri Lanka current time">
                          <span className="home-sl-clock__icon" aria-hidden="true">
                            <Clock3 size={15} strokeWidth={2.4} />
                          </span>
                          <span className="home-sl-clock__copy">
                            <b>{sriLankaTime}</b>
                            <em>SL TIME · UTC +5:30</em>
                          </span>
                        </div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </section>
            </div>
          </motion.div>
        </section>
      </div>
    </PageShell>
  );
}
