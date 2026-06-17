"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, BrainCircuit, Code2, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import IdentityStatus from "@/components/IdentityStatus";
import PageShell from "@/components/PageShell";
import { siteData } from "@/lib/siteData";

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

const subscribe = () => () => {};

const heroStats = [
  "2Y Product Engineering",
  "Enterprise Delivery",
  "AI-Ready Architectures",
  "Secure API Design",
];

const highlightMeta: Record<
  string,
  {
    index: string;
    glow: string;
    numberTint: string;
    color: string;
    icon: typeof Sparkles;
    accent: string;
    cueA: string;
    cueB: string;
  }
> = {
  About: {
    index: "01",
    glow: "radial-gradient(circle at top right, rgba(255,176,78,0.18), transparent 48%)",
    numberTint: "rgba(255,176,78,0.82)",
    color: "rgba(255,176,78,0.88)",
    icon: ShieldCheck,
    accent: "Purrsonal",
    cueA: "UI Systems",
    cueB: "Human-first Flow",
  },
  Work: {
    index: "02",
    glow: "radial-gradient(circle at top right, rgba(45,212,191,0.16), transparent 48%)",
    numberTint: "rgba(45,212,191,0.82)",
    color: "rgba(45,212,191,0.84)",
    icon: Layers3,
    accent: "Build Mode",
    cueA: "Production Cases",
    cueB: "Code + Outcomes",
  },
  Break: {
    index: "03",
    glow: "radial-gradient(circle at top right, rgba(167,139,250,0.18), transparent 48%)",
    numberTint: "rgba(167,139,250,0.82)",
    color: "rgba(167,139,250,0.86)",
    icon: BrainCircuit,
    accent: "Cat Reset",
    cueA: "Quick Recharge",
    cueB: "Playful Focus",
  },
};

function HeroTechScene({ isLight }: { isLight: boolean }) {
  const nodes = [
    { x: "14%", y: "22%", color: "rgba(56,189,248,0.86)", label: "API" },
    { x: "78%", y: "18%", color: "rgba(255,176,78,0.88)", label: "AI" },
    { x: "20%", y: "76%", color: "rgba(52,211,153,0.84)", label: "UX" },
    { x: "82%", y: "72%", color: "rgba(167,139,250,0.86)", label: "DB" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute left-1/2 top-1/2 h-[17rem] w-[17rem] -translate-x-1/2 -translate-y-1/2 rounded-full border"
        style={{
          borderColor: isLight ? "rgba(90,68,41,0.08)" : "rgba(255,255,255,0.08)",
          background: isLight
            ? "radial-gradient(circle, rgba(255,176,78,0.08), transparent 62%)"
            : "radial-gradient(circle, rgba(255,176,78,0.1), transparent 62%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[12rem] w-[12rem] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border"
        style={{
          borderColor: isLight ? "rgba(45,212,191,0.18)" : "rgba(45,212,191,0.2)",
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateX: [58, 64, 58], rotateZ: [-12, 8, -12], y: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          d="M14 22 C34 36 54 36 78 18 M20 76 C42 61 62 60 82 72 M14 22 C18 45 18 58 20 76 M78 18 C82 40 82 54 82 72"
          fill="none"
          stroke={isLight ? "rgba(80,67,52,0.12)" : "rgba(255,255,255,0.12)"}
          strokeWidth="0.45"
          strokeDasharray="3 3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0.45, 1, 0.45] }}
          transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      {nodes.map((node, index) => (
        <motion.div
          key={node.label}
          className="absolute flex h-10 w-10 items-center justify-center rounded-xl border text-[0.56rem] font-black uppercase tracking-[0.12em]"
          style={{
            left: node.x,
            top: node.y,
            marginLeft: "-1.25rem",
            marginTop: "-1.25rem",
            borderColor: node.color,
            color: node.color,
            background: isLight ? "rgba(255,255,255,0.68)" : "rgba(0,0,0,0.22)",
            boxShadow: `0 0 22px ${node.color.replace(/0\.\d+\)/, "0.16)")}`,
          }}
          animate={{ y: [0, index % 2 ? 4 : -4, 0], opacity: [0.72, 1, 0.72] }}
          transition={{ duration: 3 + index * 0.24, repeat: Infinity, ease: "easeInOut" }}
        >
          {node.label}
        </motion.div>
      ))}
    </div>
  );
}

function HomeCardMotif({
  color,
  icon: Icon,
  index,
  isLight,
}: {
  color: string;
  icon: typeof Sparkles;
  index: number;
  isLight: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-3 top-3 h-14 overflow-hidden rounded-xl">
      <motion.div
        className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-lg border"
        style={{
          borderColor: color,
          background: isLight ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.07)",
        }}
        animate={{ y: [0, -3, 0], rotateZ: [0, 3, 0] }}
        transition={{ duration: 3.2 + index * 0.25, repeat: Infinity, ease: "easeInOut" }}
      >
        <Icon size={16} color={color} />
      </motion.div>
      <motion.div
        className="absolute right-12 top-3 h-8 w-14 rounded-lg border"
        style={{
          borderColor: color.replace(/0\.\d+\)/, "0.2)"),
          background: isLight ? "rgba(255,255,255,0.44)" : "rgba(255,255,255,0.045)",
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateX: [52, 64, 52], rotateZ: [-12, -4, -12], y: [0, -4, 0] }}
        transition={{ duration: 4.4 + index * 0.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-2 top-7 h-px w-[72%]"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
        animate={{ opacity: [0.18, 0.68, 0.18], x: [-16, 16, -16] }}
        transition={{ duration: 3.8 + index * 0.3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export default function HomePage() {
  const { resolvedTheme } = useTheme();
  const hasHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const isLight = hasHydrated && resolvedTheme !== "dark";
  const tuneAlpha = (color: string, alpha: string) =>
    color.replace(/0\.\d+\)/, `${alpha})`);
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

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyHeight = document.body.style.height;
    const previousHtmlHeight = document.documentElement.style.height;
    const previousBodyMaxHeight = document.body.style.maxHeight;
    const previousHtmlMaxHeight = document.documentElement.style.maxHeight;
    const previousBodyOverflowY = document.body.style.overflowY;
    const previousHtmlOverflowY = document.documentElement.style.overflowY;
    const mainElement = document.querySelector("main");
    const previousMainStyle = mainElement?.getAttribute("style");

    document.body.style.overflow = "clip";
    document.documentElement.style.overflow = "clip";
    document.body.style.overflowY = "clip";
    document.documentElement.style.overflowY = "clip";
    document.body.style.height = "100dvh";
    document.documentElement.style.height = "100dvh";
    document.body.style.maxHeight = "100dvh";
    document.documentElement.style.maxHeight = "100dvh";

    if (mainElement instanceof HTMLElement) {
      mainElement.style.overflow = "hidden";
      mainElement.style.paddingBottom = "0";
      mainElement.style.minHeight = "calc(100dvh - 8.5rem)";
    }

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflowY = previousBodyOverflowY;
      document.documentElement.style.overflowY = previousHtmlOverflowY;
      document.body.style.height = previousBodyHeight;
      document.documentElement.style.height = previousHtmlHeight;
      document.body.style.maxHeight = previousBodyMaxHeight;
      document.documentElement.style.maxHeight = previousHtmlMaxHeight;

      if (mainElement instanceof HTMLElement) {
        if (previousMainStyle) {
          mainElement.setAttribute("style", previousMainStyle);
        } else {
          mainElement.removeAttribute("style");
        }
      }
    };
  }, []);

  return (
    <PageShell>
      <div className="flex h-[calc(100dvh-12.5rem)] min-h-0 items-start">
        <section className="home-page-shell card page-light-card h-full w-full overflow-hidden p-0">
          <motion.div
            className="relative h-full px-5 py-4 md:px-7 md:py-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42 }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(255,176,78,0.15),transparent_38%)] dark:bg-[radial-gradient(circle_at_10%_0%,rgba(255,176,78,0.1),transparent_42%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_100%,rgba(45,212,191,0.12),transparent_36%)] dark:bg-[radial-gradient(circle_at_90%_100%,rgba(167,139,250,0.1),transparent_40%)]" />

            <div className="relative flex h-full min-h-0 flex-col">
              <motion.div
                className="home-kicker-pill self-start inline-flex items-center gap-2 rounded-full border border-black/14 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#5a4d3f] dark:border-white/12 dark:bg-white/6 dark:text-white/58"
                style={
                  isLight
                    ? {
                        color: "#5d4c3a",
                        borderColor: "rgba(73,57,41,0.16)",
                        background: "rgba(255,255,255,0.92)",
                      }
                    : undefined
                }
                variants={heroItem}
                initial="hidden"
                animate="show"
              >
                <Sparkles size={13} />
                Catverse Identity
              </motion.div>

              <section className="mt-2 min-h-0 flex-[1.34]">
                <motion.div
                  className="card identity-card page-light-card relative h-full overflow-hidden rounded-2xl border border-black/10 p-4 dark:border-white/10 md:p-5"
                  style={{
                    ...accentCardStyle("rgba(255,176,78,0.88)"),
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                  }}
                  whileHover={{ y: -2 }}
                >
                  <motion.span
                    className="pointer-events-none absolute right-8 top-8 h-32 w-32 rounded-full bg-[#ffb04e] blur-3xl"
                    animate={{ opacity: [0.1, 0.22, 0.1], scale: [0.92, 1.08, 0.92] }}
                    transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <HeroTechScene isLight={isLight} />
                  <motion.div
                    className="identity-content"
                    style={{ gap: "0.82rem", width: "min(100%, 920px)" }}
                    variants={heroContainer}
                    initial="hidden"
                    animate="show"
                  >
                    <h1
                      className="identity-heading identity-heading--animated"
                      aria-label="Isanjalee Silva"
                    >
                      <motion.span
                        className="identity-line identity-line--glow"
                        variants={heroItem}
                      >
                        ISANJALEE
                      </motion.span>
                      <motion.span
                        className="identity-line identity-line--glow"
                        variants={heroItem}
                      >
                        SILVA
                      </motion.span>
                    </h1>

                    <motion.p className="identity-roles" variants={heroItem}>
                      <motion.span
                        className="inline-block"
                        animate={{ opacity: [0.65, 1, 0.65] }}
                        transition={{ duration: 2.6, repeat: Infinity }}
                      >
                        AI ENGINEER
                      </motion.span>{" "}
                      <span>|</span>{" "}
                      <motion.span
                        className="inline-block"
                        animate={{ opacity: [0.65, 1, 0.65] }}
                        transition={{ duration: 2.6, repeat: Infinity, delay: 0.2 }}
                      >
                        FULLSTACK DEVELOPER
                      </motion.span>{" "}
                      <span>|</span>{" "}
                      <motion.span
                        className="inline-block"
                        animate={{ opacity: [0.65, 1, 0.65] }}
                        transition={{ duration: 2.6, repeat: Infinity, delay: 0.4 }}
                      >
                        RESEARCHER
                      </motion.span>{" "}
                      <span>|</span>{" "}
                      <motion.span
                        className="inline-block"
                        animate={{ opacity: [0.65, 1, 0.65] }}
                        transition={{ duration: 2.6, repeat: Infinity, delay: 0.6 }}
                      >
                        DESIGNER
                      </motion.span>
                    </motion.p>

                    <motion.p
                      className="home-hero-desc max-w-3xl text-sm font-medium leading-7 text-[#3f352d] dark:text-[#f5ece1]/66 md:text-[0.95rem]"
                      style={isLight ? { color: "#3a3027" } : undefined}
                      variants={heroItem}
                    >
                      Building thoughtful enterprise-grade software with AI intelligence,
                      clean system architecture, and human-centered product decisions.
                    </motion.p>

                    <motion.div
                      className="flex flex-wrap items-center justify-center gap-2"
                      variants={heroItem}
                    >
                      {heroStats.map((stat, i) => (
                        <motion.span
                          key={stat}
                          className="home-stat-chip relative overflow-hidden rounded-full border border-black/14 bg-white/88 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#43392f] dark:border-white/12 dark:bg-white/5 dark:text-white/64"
                          style={
                            isLight
                              ? {
                                  color: "#3f342a",
                                  borderColor: tuneAlpha(["rgba(56,189,248,0.86)", "rgba(167,139,250,0.86)", "rgba(52,211,153,0.84)", "rgba(255,176,78,0.88)"][i], "0.28"),
                                  background: "rgba(255,255,255,0.9)",
                                }
                              : {
                                  borderColor: tuneAlpha(["rgba(56,189,248,0.86)", "rgba(167,139,250,0.86)", "rgba(52,211,153,0.84)", "rgba(255,176,78,0.88)"][i], "0.3"),
                                }
                          }
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.32, delay: 0.14 + i * 0.05 }}
                        >
                          {stat}
                        </motion.span>
                      ))}
                    </motion.div>

                    <motion.div
                      variants={heroItem}
                      className="flex h-[4.15rem] w-full items-center justify-center"
                    >
                      <IdentityStatus />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </section>

              <motion.section
                className="mt-2 grid min-h-0 flex-[0.66] auto-rows-fr gap-2.5 md:grid-cols-3"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: { staggerChildren: 0.1, delayChildren: 0.18 },
                  },
                }}
              >
                {siteData.highlights.map((item) => {
                  const meta = highlightMeta[item.kicker] ?? {
                    index: "--",
                    glow: "radial-gradient(circle at top right, rgba(255,176,78,0.18), transparent 46%)",
                    numberTint: "rgba(255,176,78,0.82)",
                    color: "rgba(255,176,78,0.88)",
                    icon: Code2,
                    accent: "Explore",
                    cueA: "Modern Craft",
                    cueB: "Explore More",
                  };

                  return (
                    <motion.div
                      key={item.title}
                      variants={{
                        hidden: { opacity: 0, y: 16 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.38 } },
                      }}
                      whileHover={{ y: -4, scale: 1.008 }}
                      whileTap={{ scale: 0.992 }}
                    >
                      <Link
                        href={item.href}
                        className="home-card-link card page-light-card group relative block h-full overflow-hidden rounded-2xl p-3 pt-[4.35rem] md:p-3.5 md:pt-[4.45rem]"
                        style={accentCardStyle(meta.color)}
                      >
                        <HomeCardMotif
                          color={meta.color}
                          icon={meta.icon}
                          index={Number(meta.index) || 0}
                          isLight={isLight}
                        />
                        <motion.span
                          className="pointer-events-none absolute -right-8 top-0 h-24 w-24 rounded-full blur-2xl"
                          style={{ background: meta.color }}
                          animate={{ opacity: [0.12, 0.28, 0.12], scale: [0.9, 1.08, 0.9] }}
                          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
                          style={{ background: meta.glow }}
                        />
                        <motion.div
                          className="pointer-events-none absolute left-4 top-4 h-1 w-10 rounded-full bg-black/14 dark:bg-white/14"
                          animate={{ width: [40, 56, 40], opacity: [0.45, 0.9, 0.45] }}
                          transition={{ duration: 3.2, repeat: Infinity }}
                        />

                        <div className="relative flex h-full flex-col">
                          <div className="flex items-center justify-between">
                            <div
                              className="home-card-kicker text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-[#5a4d40] dark:text-white/46"
                              style={isLight ? { color: "#5f5143" } : undefined}
                            >
                              {item.kicker}
                            </div>
                            <div
                              className="text-[0.68rem] font-black tracking-[0.16em]"
                              style={{ color: meta.numberTint }}
                            >
                              {meta.index}
                            </div>
                          </div>

                          <div
                            className="home-card-accent mt-1.5 text-[0.56rem] font-semibold uppercase tracking-[0.2em] text-[#6a5a48] dark:text-white/42"
                            style={isLight ? { color: "#6f5e4c" } : undefined}
                          >
                            {meta.accent}
                          </div>

                          <motion.div
                            className="home-card-title mt-2 text-[1.04rem] font-black tracking-[-0.04em] text-[#2d2720] dark:text-[#f5ece1]/90"
                            style={isLight ? { color: "#2f281f" } : undefined}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.34, delay: 0.08 }}
                          >
                            {item.title}
                          </motion.div>

                          <motion.p
                            className="home-card-desc mt-1.5 text-[0.8rem] leading-relaxed text-[#4d4136] dark:text-[#f5ece1]/66"
                            style={isLight ? { color: "#4b3f33" } : undefined}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.34, delay: 0.12 }}
                          >
                            {item.desc}
                          </motion.p>

                          <motion.div
                            className="mt-2 flex flex-wrap gap-1.5"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.34, delay: 0.14 }}
                          >
                            <span
                              className="home-card-cue rounded-full border border-black/14 bg-white/88 px-2 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.13em] text-[#4a3f34] dark:border-white/10 dark:bg-white/5 dark:text-white/60"
                              style={
                                isLight
                                  ? {
                                      color: "#4a3d31",
                                      borderColor: tuneAlpha(meta.color, "0.3"),
                                      background: "rgba(255,255,255,0.9)",
                                    }
                                  : { borderColor: tuneAlpha(meta.color, "0.26") }
                              }
                            >
                              {meta.cueA}
                            </span>
                            <span
                              className="home-card-cue rounded-full border border-black/14 bg-white/88 px-2 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.13em] text-[#4a3f34] dark:border-white/10 dark:bg-white/5 dark:text-white/60"
                              style={
                                isLight
                                  ? {
                                      color: "#4a3d31",
                                      borderColor: tuneAlpha(meta.color, "0.3"),
                                      background: "rgba(255,255,255,0.9)",
                                    }
                                  : { borderColor: tuneAlpha(meta.color, "0.26") }
                              }
                            >
                              {meta.cueB}
                            </span>
                          </motion.div>

                          <motion.div
                            className="home-card-cta mt-auto inline-flex items-center gap-2 pt-2.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[#4e4338] dark:text-white/58"
                            style={isLight ? { color: "#4f4337" } : undefined}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.34, delay: 0.16 }}
                          >
                            Explore
                            <ArrowUpRight size={12} />
                          </motion.div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.section>
            </div>
          </motion.div>
        </section>
      </div>
    </PageShell>
  );
}
