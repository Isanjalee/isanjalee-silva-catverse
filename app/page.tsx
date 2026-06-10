"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
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
    accent: string;
    cueA: string;
    cueB: string;
  }
> = {
  About: {
    index: "01",
    glow: "radial-gradient(circle at top right, rgba(255,176,78,0.18), transparent 48%)",
    numberTint: "rgba(255,176,78,0.82)",
    accent: "Purrsonal",
    cueA: "UI Systems",
    cueB: "Human-first Flow",
  },
  Work: {
    index: "02",
    glow: "radial-gradient(circle at top right, rgba(45,212,191,0.16), transparent 48%)",
    numberTint: "rgba(45,212,191,0.82)",
    accent: "Build Mode",
    cueA: "Production Cases",
    cueB: "Code + Outcomes",
  },
  Break: {
    index: "03",
    glow: "radial-gradient(circle at top right, rgba(167,139,250,0.18), transparent 48%)",
    numberTint: "rgba(167,139,250,0.82)",
    accent: "Cat Reset",
    cueA: "Quick Recharge",
    cueB: "Playful Focus",
  },
};

export default function HomePage() {
  const { resolvedTheme } = useTheme();
  const hasHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const isLight = hasHydrated && resolvedTheme !== "dark";

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
                  style={{ alignItems: "flex-start", justifyContent: "flex-start" }}
                  whileHover={{ y: -2 }}
                >
                  <motion.div
                    className="identity-content"
                    style={{ gap: "1rem", width: "min(100%, 920px)" }}
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
                          className="home-stat-chip rounded-full border border-black/14 bg-white/88 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#43392f] dark:border-white/12 dark:bg-white/5 dark:text-white/64"
                          style={
                            isLight
                              ? {
                                  color: "#3f342a",
                                  borderColor: "rgba(73,57,41,0.14)",
                                  background: "rgba(255,255,255,0.9)",
                                }
                              : undefined
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
                        className="home-card-link card page-light-card group relative block h-full overflow-hidden rounded-2xl p-3 md:p-3.5"
                        style={
                          isLight
                            ? {
                                background:
                                  "linear-gradient(180deg, rgba(255,251,245,0.98), rgba(250,245,237,0.98))",
                                borderColor: "rgba(90,68,41,0.11)",
                              }
                            : undefined
                        }
                      >
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
                                      borderColor: "rgba(73,57,41,0.14)",
                                      background: "rgba(255,255,255,0.9)",
                                    }
                                  : undefined
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
                                      borderColor: "rgba(73,57,41,0.14)",
                                      background: "rgba(255,255,255,0.9)",
                                    }
                                  : undefined
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
