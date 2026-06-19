"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowUpRight,
  BrainCircuit,
  CloudCog,
  Code2,
  DatabaseZap,
  ExternalLink,
  FolderKanban,
  Gauge,
  Github,
  Globe,
  Layers3,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import PageShell from "@/components/PageShell";
import { siteData } from "@/lib/siteData";

const subscribe = () => () => {};

const projectMeta = [
  {
    shortTitle: "Transpomate",
    role: "Frontend Engineer",
    impact: "Ride approvals, fleet allocation, reporting, maps, and faster load paths",
    contribution:
      "At Inivos, worked as a frontend engineer on Transpomate. Built ride request, approval, vehicle allocation, HR and finance reporting interfaces; integrated Google Maps location flows; and improved initial load performance with lazy loading and code splitting.",
    skills: ["React", "Next.js", "NestJS", "Maps"],
    color: "rgba(56,189,248,0.86)",
    glow: "rgba(56,189,248,0.18)",
    visual: ["RIDES", "MAPS", "REPORTS"],
    image: "/projects/transpomate.png",
    icon: DatabaseZap,
  },
  {
    shortTitle: "IFS Cloud",
    role: "Software Engineer (Java)",
    impact: "IFS Cloud modules, Maintenix migration, PL/SQL jobs, tests, and KT",
    contribution:
      "At IFS R&D, developed and customised IFS Cloud backend business logic and UI modules for aviation clients. Built Maintenix to IFS Cloud migration pipelines using SQL views, PL/SQL scripts, and upgrade-job sequences; added automated tests, documentation, and knowledge-transfer support.",
    skills: ["Java", "PL/SQL", "IFS Cloud", "JUnit"],
    color: "rgba(129,140,248,0.86)",
    glow: "rgba(129,140,248,0.18)",
    visual: ["CLOUD", "MRO", "MIGRATE"],
    image: "/projects/ifs.png",
    icon: CloudCog,
  },
  {
    shortTitle: "Med Link",
    role: "Full Stack Developer",
    impact: "Authentication, clinical workflows, analytics, resilient APIs",
    contribution:
      "Worked across the Med Link platform as a full stack developer, building secure authentication, clinical workflow features, analytics surfaces, and resilient API architecture.",
    skills: ["Next.js", "API Design", "Auth", "Analytics"],
    color: "rgba(255,176,78,0.86)",
    glow: "rgba(255,176,78,0.2)",
    visual: ["AUTH", "API", "DATA"],
    image: "/projects/medlink.png",
    icon: ShieldCheck,
  },
  {
    shortTitle: "Calm Agent",
    role: "AI Engineer",
    impact: "Private daily planning with Ollama-powered task orchestration",
    contribution:
      "Designed and built a local-first AI planning agent for private daily task orchestration, focused productivity, and Ollama-powered personal workflow support.",
    skills: ["Python", "Ollama", "Agents", "Privacy"],
    color: "rgba(45,212,191,0.84)",
    glow: "rgba(45,212,191,0.18)",
    visual: ["LOCAL", "PLAN", "AI"],
    image: "/projects/calmdayagent.png",
    icon: BrainCircuit,
  },
  {
    shortTitle: "Posh AI",
    role: "Full Stack Developer",
    impact: "Captions, hashtags, replies, and design ideas for apparel sellers",
    contribution:
      "Built an AI-assisted apparel business workflow for generating social captions, hashtags, customer replies, and design ideas in a practical seller-focused interface.",
    skills: ["TypeScript", "AI UX", "Content Tools", "Automation"],
    color: "rgba(167,139,250,0.84)",
    glow: "rgba(167,139,250,0.18)",
    visual: ["PROMPT", "SOCIAL", "IDEAS"],
    image: "/projects/posh.png",
    icon: Sparkles,
  },
  {
    shortTitle: "Servicr",
    role: "Frontend Engineer",
    impact: "Flutter UI, scheduling, notifications, admin and database support",
    contribution:
      "Contributed Flutter mobile UI, scheduling flows, notification workflows, admin panel support, and database-backed features for the home services platform.",
    skills: ["Flutter", "Scheduling", "Notifications", "Admin"],
    color: "rgba(96,165,250,0.86)",
    glow: "rgba(96,165,250,0.16)",
    visual: ["MOBILE", "BOOK", "SYNC"],
    image: "/projects/servicr.png",
    icon: Layers3,
  },
  {
    shortTitle: "Flappy Bird",
    role: "Software Engineer",
    impact: "Obstacle timing, collision handling, scoring, and game loops",
    contribution:
      "Implemented the core C# gameplay loop, including obstacle timing, collision handling, score tracking, and responsive player movement.",
    skills: ["C#", "Game Loops", "Collision", "Scoring"],
    color: "rgba(251,113,133,0.86)",
    glow: "rgba(251,113,133,0.16)",
    visual: ["LOOP", "COLLIDE", "SCORE"],
    image: "/projects/flappybird.png",
    icon: Gauge,
  },
  {
    shortTitle: "DevTrio",
    role: "Frontend Engineer",
    impact: "Company website for web, digital design, and mobile services",
    contribution:
      "Created frontend presentation and web presence for a digital solutions team, highlighting web development, digital design, mobile app services, and remote delivery capability.",
    skills: ["Web Design", "Frontend", "Remote Team", "Delivery"],
    color: "rgba(52,211,153,0.84)",
    glow: "rgba(52,211,153,0.16)",
    visual: ["WEB", "BRAND", "SHIP"],
    image: "/projects/devtrio.png",
    icon: Code2,
  },
];

const filters = ["All", "AI", "Enterprise", "Mobile", "Game", "Web"];

function filterProject(projectTag: string, filter: string) {
  if (filter === "All") return true;
  return projectTag.toLowerCase().includes(filter.toLowerCase());
}

function ProjectLinkIcon({ label }: { label: string }) {
  if (label.toLowerCase().includes("github")) {
    return <Github size={13} />;
  }

  if (label.toLowerCase().includes("live")) {
    return <Globe size={13} />;
  }

  return <ExternalLink size={13} />;
}

function ProjectVisual({
  index,
  meta,
  title,
  isLight,
  large = false,
}: {
  index: number;
  meta: (typeof projectMeta)[number];
  title: string;
  isLight: boolean;
  large?: boolean;
}) {
  const Icon = meta.icon;
  const shortTitle = large ? title.replace(/\s*\([^)]*\)/g, "") : meta.shortTitle;
  const baseText = isLight ? "rgba(34,34,40,0.9)" : "rgba(245,236,225,0.92)";
  const mutedText = isLight ? "rgba(58,46,34,0.62)" : "rgba(255,255,255,0.58)";

  return (
    <motion.div
      className="relative h-full min-h-[5.8rem] overflow-hidden rounded-xl border p-3"
      style={{
        borderColor: isLight ? "rgba(90,68,41,0.13)" : "rgba(255,255,255,0.12)",
        background: `radial-gradient(circle at 18% 18%, ${meta.glow}, transparent 42%), radial-gradient(circle at 86% 82%, ${meta.color}, transparent 38%), linear-gradient(145deg, rgba(255,255,255,0.13), rgba(255,255,255,0.035))`,
        perspective: "760px",
      }}
      animate={{ rotateX: large ? [0, 1.2, 0] : [0, 0.8, 0] }}
      transition={{ duration: 4.6, repeat: Infinity, delay: index * 0.12 }}
    >
      <motion.div
        className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full blur-2xl"
        style={{ background: meta.color, opacity: 0.2 }}
        animate={{ scale: [1, 1.28, 1], opacity: [0.12, 0.28, 0.12] }}
        transition={{ duration: 3.4, repeat: Infinity, delay: index * 0.14 }}
      />
      <motion.div
        className={
          large
            ? "pointer-events-none absolute bottom-3 right-4 h-12 w-12 rounded-lg border border-white/18 bg-white/10 shadow-[0_16px_28px_rgba(0,0,0,0.18)]"
            : "pointer-events-none absolute right-5 top-12 h-7 w-7 rounded-lg border border-white/10 bg-white/6 shadow-[0_12px_22px_rgba(0,0,0,0.14)]"
        }
        style={{ transformStyle: "preserve-3d" }}
        animate={{
          rotateX: [58, 64, 58],
          rotateZ: [-18, -9, -18],
          y: [0, -5, 0],
        }}
        transition={{ duration: 3.8, repeat: Infinity, delay: index * 0.1 }}
      />
      <motion.div
        className={
          large
            ? "pointer-events-none absolute bottom-7 right-16 h-9 w-9 rounded-md border border-white/16 bg-white/8"
            : "pointer-events-none absolute right-12 top-14 h-5 w-5 rounded-md border border-white/10 bg-white/5"
        }
        animate={{
          rotateX: [48, 56, 48],
          rotateZ: [16, 25, 16],
          y: [0, 4, 0],
        }}
        transition={{ duration: 4.2, repeat: Infinity, delay: 0.18 + index * 0.1 }}
      />

      <div className="relative flex h-full flex-col justify-between gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex min-w-0 items-center gap-2">
            <span
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
              style={{
                borderColor: meta.color,
                background: isLight ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.07)",
              }}
            >
              <Icon size={16} color={meta.color} />
            </span>
            {large ? (
              <span
                className="truncate text-[0.58rem] font-semibold uppercase tracking-[0.16em]"
                style={{ color: mutedText }}
              >
                {meta.role}
              </span>
            ) : null}
          </div>
          <span className="h-8 w-8 shrink-0" aria-hidden="true" />
        </div>

        <motion.div
          className={
            large
              ? "text-3xl font-black tracking-[-0.055em]"
              : "absolute left-12 right-12 top-3 z-20 flex h-8 items-center justify-center text-center text-[1.05rem] font-black leading-none tracking-[-0.035em] md:text-[1.16rem]"
          }
          style={{
            color: baseText,
            textShadow: large
              ? `0 0 22px ${meta.glow}`
              : "0 2px 10px rgba(0,0,0,0.42)",
          }}
          animate={{ x: [0, 3, 0], y: large ? [0, -2, 0] : [0, 0, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, delay: index * 0.08 }}
        >
          <span className="block max-w-full truncate">{shortTitle}</span>
        </motion.div>

        <div className={large ? "grid grid-cols-3 gap-2" : "relative z-10 grid grid-cols-3 gap-1"}>
          {(large ? meta.visual : meta.skills.slice(0, 3)).map((label, labelIndex) => (
            <motion.div
              key={label}
              className={
                large
                  ? "rounded-lg border px-2 py-1.5 text-center text-[0.52rem] font-black uppercase tracking-[0.12em]"
                  : "truncate rounded-md border px-1.5 py-1 text-center text-[0.46rem] font-black uppercase tracking-[0.08em]"
              }
              style={{
                borderColor: isLight ? "rgba(90,68,41,0.13)" : "rgba(255,255,255,0.12)",
                background: isLight ? "rgba(255,255,255,0.68)" : "rgba(255,255,255,0.07)",
                color: labelIndex === 1 ? meta.color : mutedText,
              }}
              animate={{ y: [0, labelIndex % 2 ? 2 : -2, 0] }}
              transition={{ duration: 2.6 + labelIndex * 0.25, repeat: Infinity }}
            >
              {label}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsPage() {
  const { resolvedTheme } = useTheme();
  const hasHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const isLight = hasHydrated ? resolvedTheme !== "dark" : false;
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
  const selectedProject =
    selectedProjectIndex === null ? null : siteData.projects[selectedProjectIndex] ?? null;
  const selectedMeta =
    selectedProjectIndex === null ? null : projectMeta[selectedProjectIndex] ?? projectMeta[0];

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
    document.body.style.height = "var(--app-height)";
    document.documentElement.style.height = "var(--app-height)";
    document.body.style.maxHeight = "var(--app-height)";
    document.documentElement.style.maxHeight = "var(--app-height)";

    if (mainElement instanceof HTMLElement) {
      mainElement.style.overflow = "hidden";
      mainElement.style.paddingBottom = "0";
      mainElement.style.minHeight = "calc(var(--app-height) - 8.5rem)";
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

  useEffect(() => {
    if (selectedProjectIndex === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedProjectIndex(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProjectIndex]);

  const filteredProjects = useMemo(
    () =>
      siteData.projects
        .map((project, index) => ({ project, index, meta: projectMeta[index] ?? projectMeta[0] }))
        .filter(({ project }) => filterProject(project.tag, selectedFilter)),
    [selectedFilter],
  );

  const allSkills = useMemo(
    () => Array.from(new Set(projectMeta.flatMap((meta) => meta.skills))).length,
    [],
  );
  const projectCount = siteData.projects.length;
  const externalLinks = useMemo(
    () =>
      siteData.projects.reduce(
        (acc, project) =>
          acc + project.links.filter((link) => link.href.startsWith("http")).length,
        0,
      ),
    [],
  );

  const surfaceStyle = isLight
    ? {
        background: "linear-gradient(180deg, rgba(255,251,245,0.97), rgba(247,242,235,0.95))",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.48), 0 12px 28px rgba(106,82,52,0.1)",
      }
    : {
        background:
          "radial-gradient(circle at 16% 12%, rgba(255,176,78,0.14), transparent 30%), radial-gradient(circle at 86% 84%, rgba(45,212,191,0.1), transparent 36%), linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.02))",
      };

  const panelStyle = isLight
    ? {
        borderColor: "rgba(90,68,41,0.1)",
        background:
          "linear-gradient(180deg, rgba(255,251,245,0.98), rgba(250,245,237,0.98))",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.4), 0 9px 20px rgba(106,82,52,0.08)",
      }
    : undefined;

  const chipStyle = isLight
    ? {
        borderColor: "rgba(90,68,41,0.13)",
        background: "rgba(255,255,255,0.82)",
        color: "rgba(58,46,34,0.8)",
      }
    : undefined;
  const tuneAlpha = (color: string, alpha: string) =>
    color.replace(/0\.\d+\)/, `${alpha})`);
  const projectCardStyle = (color: string, glow: string) =>
    isLight
      ? {
          borderColor: tuneAlpha(color, "0.36"),
          background:
            "linear-gradient(180deg, rgba(255,251,245,0.98), rgba(250,245,237,0.98))",
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.44), 0 14px 26px ${tuneAlpha(color, "0.13")}`,
        }
      : {
          borderColor: tuneAlpha(color, "0.42"),
          background: `radial-gradient(circle at 86% 14%, ${glow}, transparent 38%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.024))`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.09), 0 16px 30px ${tuneAlpha(color, "0.08")}`,
        };

  return (
    <PageShell>
      <div className="flex h-[calc(var(--app-height)-12.5rem)] min-h-0 items-start">
        <section className="card page-light-card relative h-full w-full overflow-hidden p-0">
          <div className="relative h-full px-4 py-4 md:px-7 md:py-5" style={surfaceStyle}>
            <motion.div
              className="pointer-events-none absolute -right-20 top-8 h-48 w-48 rounded-full blur-3xl"
              style={{ background: isLight ? "rgba(255,176,78,0.16)" : "rgba(255,176,78,0.1)" }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.45, 0.75, 0.45] }}
              transition={{ duration: 5, repeat: Infinity }}
            />

            <div className="relative flex h-full min-h-0 flex-col">
              <motion.div
                className="relative grid items-start gap-3 overflow-hidden md:grid-cols-[minmax(0,1fr)_17rem]"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="relative z-10">
                  <div
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]"
                    style={
                      isLight
                        ? {
                            color: "rgba(84,72,60,0.58)",
                            background: "rgba(255,255,255,0.58)",
                            borderColor: "rgba(90,68,41,0.09)",
                          }
                        : {
                            color: "rgba(255,255,255,0.62)",
                            background: "rgba(255,255,255,0.06)",
                            borderColor: "rgba(255,255,255,0.1)",
                          }
                    }
                  >
                    <Sparkles size={13} />
                    Project Lab
                  </div>
                  <h1
                    className="mt-2 text-3xl font-black tracking-[-0.05em] md:text-[2.45rem]"
                    style={{
                      color: isLight ? "rgba(34,34,40,0.95)" : "rgba(245,236,225,0.94)",
                    }}
                  >
                    Selected Projects
                  </h1>
                </div>

                <div className="relative z-10 grid w-full max-w-[17rem] grid-cols-3 gap-2 justify-self-start md:justify-self-end">
                  {[
                    [`${projectCount}`, "Projects"],
                    [`${allSkills}`, "Skills"],
                    [`${externalLinks}`, "Links"],
                  ].map(([value, label], index) => (
                    <div
                      key={label}
                      className="relative flex h-[3.8rem] min-w-0 flex-col items-center justify-center overflow-hidden rounded-2xl border px-2 text-center"
                      style={panelStyle}
                    >
                      <motion.span
                        className="pointer-events-none absolute inset-0"
                        animate={{
                          opacity: [0.18, 0.42, 0.18],
                        }}
                        transition={{ duration: 3 + index * 0.35, repeat: Infinity }}
                        style={{
                          background:
                            "radial-gradient(circle at 50% 20%, rgba(255,176,78,0.18), transparent 58%)",
                        }}
                      />
                      <div
                        className="relative text-lg font-black"
                        style={{
                          color: isLight ? "rgba(34,34,40,0.92)" : "rgba(245,236,225,0.92)",
                        }}
                      >
                        {value}
                      </div>
                      <div
                        className="relative text-[0.58rem] font-semibold uppercase tracking-[0.16em]"
                        style={{
                          color: isLight ? "rgba(84,72,60,0.56)" : "rgba(255,255,255,0.48)",
                        }}
                      >
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="mt-2 hidden h-8 items-center overflow-hidden rounded-xl border border-black/10 bg-white/45 px-3 dark:border-white/10 dark:bg-white/5 md:flex"
                style={isLight ? { borderColor: "rgba(90,68,41,0.1)" } : undefined}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.08 }}
              >
                <motion.div
                  className="flex min-w-full items-center gap-2"
                  animate={{ x: ["0%", "-38%"] }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                >
                  {[...projectMeta, ...projectMeta].map((meta, index) => {
                    const Icon = meta.icon;
                    return (
                      <span
                        key={`${meta.role}-${index}`}
                        className="inline-flex shrink-0 items-center gap-2 rounded-lg border px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.12em]"
                        style={{
                          borderColor: isLight ? "rgba(90,68,41,0.11)" : "rgba(255,255,255,0.1)",
                          background: isLight ? "rgba(255,255,255,0.58)" : "rgba(255,255,255,0.05)",
                          color: isLight ? "rgba(58,46,34,0.66)" : "rgba(255,255,255,0.58)",
                        }}
                      >
                        <Icon size={11} color={meta.color} />
                        {meta.role}
                      </span>
                    );
                  })}
                </motion.div>
              </motion.div>

              <motion.div
                className="mt-3 flex flex-wrap gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.08 }}
              >
                {filters.map((filter) => {
                  const isActive = selectedFilter === filter;
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setSelectedFilter(filter)}
                      className="rounded-full border px-3 py-1.5 text-[0.64rem] font-semibold uppercase tracking-[0.14em] transition"
                      style={
                        isActive
                          ? {
                              borderColor: "rgba(255,176,78,0.54)",
                              background: "rgba(255,176,78,0.18)",
                              color: isLight ? "rgba(64,48,28,0.94)" : "rgba(255,238,208,0.94)",
                            }
                          : chipStyle
                      }
                    >
                      {filter}
                    </button>
                  );
                })}
              </motion.div>

              <motion.div
                className="mt-4 min-h-0 flex-1 overflow-hidden pb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.1 }}
              >
                <motion.div
                  className="grid h-full min-h-0 auto-rows-[16.4rem] gap-2.5 overflow-y-auto py-2 pr-1 md:grid-cols-2 xl:grid-cols-3"
                  layout
                >
                  <AnimatePresence mode="popLayout">
                    {filteredProjects.map(({ project, index, meta }) => {
                      return (
                        <motion.article
                          key={project.title}
                          layout
                          className="group relative h-[16.6rem] cursor-pointer overflow-hidden rounded-2xl border p-3"
                          style={projectCardStyle(meta.color, meta.glow)}
                          initial={{ opacity: 0, y: 18, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 12, scale: 0.98 }}
                          transition={{ duration: 0.28 }}
                          whileHover={{ y: -4 }}
                          role="button"
                          tabIndex={0}
                          onClick={() => setSelectedProjectIndex(index)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setSelectedProjectIndex(index);
                            }
                          }}
                        >
                          <motion.span
                            className="pointer-events-none absolute -right-8 top-0 h-24 w-24 rounded-full blur-2xl"
                            style={{ background: meta.color }}
                            animate={{
                              opacity: [0.1, 0.24, 0.1],
                              scale: [0.9, 1.08, 0.9],
                            }}
                            transition={{
                              duration: 3.5 + index * 0.08,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                          <div className="flex h-full min-h-0 flex-col">
                            <button
                              type="button"
                              aria-label={`Open details for ${project.title}`}
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelectedProjectIndex(index);
                              }}
                              className="absolute right-5 top-5 z-10 inline-flex h-7 w-7 items-center justify-center rounded-lg border text-black/70 transition hover:bg-white dark:text-white/78 dark:hover:bg-white/10"
                              style={{
                                borderColor: tuneAlpha(meta.color, "0.36"),
                                background: isLight ? "rgba(255,255,255,0.72)" : "rgba(0,0,0,0.26)",
                                boxShadow: `0 0 14px ${tuneAlpha(meta.color, "0.12")}`,
                              }}
                            >
                              <ArrowUpRight size={13} />
                            </button>
                            <div className="mb-2.5 h-[6.25rem] shrink-0">
                              <ProjectVisual
                                index={index}
                                meta={meta}
                                title={project.title}
                                isLight={isLight}
                              />
                            </div>

                            <div className="flex items-start justify-between gap-2">
                              <div
                                className="line-clamp-2 min-h-[1.55rem] text-[0.54rem] font-semibold uppercase tracking-[0.15em]"
                                style={{
                                  color: isLight ? "rgba(84,72,60,0.58)" : "rgba(255,255,255,0.45)",
                                }}
                              >
                                {project.tag}
                              </div>
                              <div className="text-[0.68rem] font-black tracking-[0.16em]" style={{ color: meta.color }}>
                                {String(index + 1).padStart(2, "0")}
                              </div>
                            </div>

                            <p
                              className="mt-1 line-clamp-2 min-h-[2rem] text-[0.7rem] leading-relaxed"
                              style={{
                                color: isLight ? "rgba(50,46,42,0.7)" : "rgba(245,236,225,0.66)",
                              }}
                            >
                              {meta.impact}
                            </p>

                            <div className="mt-2 flex h-[1.75rem] shrink-0 items-center gap-1.5 overflow-hidden">
                              {meta.skills.slice(0, 3).map((skill) => (
                                <span
                                  key={skill}
                                  className="inline-flex h-7 shrink-0 items-center rounded-full border px-2 text-[0.48rem] font-semibold uppercase tracking-[0.075em]"
                                  style={{
                                    ...(chipStyle ?? {}),
                                    borderColor: tuneAlpha(meta.color, isLight ? "0.28" : "0.32"),
                                    background: isLight ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.055)",
                                    color: skill === meta.skills[1] ? meta.color : chipStyle?.color,
                                  }}
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>

                            <div className="mt-auto flex items-center justify-between gap-2 pt-2.5">
                              <div className="flex min-w-0 flex-1 items-center gap-1.5">
                                {project.links.slice(0, 2).map((link) => (
                                  <a
                                    key={link.label}
                                    aria-label={link.label}
                                    title={link.label}
                                    href={link.href}
                                    target={link.href.startsWith("http") ? "_blank" : undefined}
                                    rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                                    onClick={(event) => event.stopPropagation()}
                                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-black/62 transition hover:bg-black/[0.06] dark:text-white/70 dark:hover:bg-white/8"
                                  >
                                    <ProjectLinkIcon label={link.label} />
                                  </a>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.article>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              </motion.div>

              <div
                className="mt-2 inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em]"
                style={{
                  color: isLight ? "rgba(84,72,60,0.54)" : "rgba(255,255,255,0.46)",
                }}
              >
                <FolderKanban size={12} />
                Click a project to inspect tools, role, links, and delivery notes
              </div>
            </div>
          </div>

          <AnimatePresence>
            {selectedProject && selectedMeta ? (
              <motion.div
                className="absolute inset-0 z-30 flex items-center justify-center bg-black/55 px-4 py-4 backdrop-blur-[2px] md:px-8 md:py-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProjectIndex(null)}
              >
                <motion.div
                  className="relative grid h-full max-h-[46rem] w-full max-w-5xl overflow-hidden rounded-2xl border border-white/18 bg-[linear-gradient(180deg,rgba(17,17,19,0.98),rgba(11,11,13,0.96))] text-white shadow-[0_30px_80px_rgba(0,0,0,0.55)] md:grid-cols-[0.95fr_1.05fr]"
                  initial={{ y: 18, opacity: 0, scale: 0.98 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 14, opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedProjectIndex(null)}
                    className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-white/90 transition hover:bg-black/60"
                  >
                    <X size={13} />
                    Close
                  </button>

                  <div
                    className="relative min-h-0 border-b border-white/12 p-4 md:border-b-0 md:border-r md:p-5"
                    style={{
                      background: `radial-gradient(circle at 30% 24%, ${selectedMeta.glow}, transparent 48%), linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))`,
                    }}
                  >
                    <div className="flex h-full min-h-0 flex-col">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/42">
                            Stack Snapshot
                          </div>
                          <div className="mt-1 text-lg font-black tracking-[-0.04em] text-white/90">
                            {selectedMeta.role}
                          </div>
                        </div>
                        <selectedMeta.icon size={30} color={selectedMeta.color} />
                      </div>

                      <div className="mt-4 shrink-0 grid gap-2">
                        {selectedMeta.skills.map((skill, index) => (
                          <div key={skill}>
                            <div className="mb-1 flex justify-between text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/58">
                              <span>{skill}</span>
                              <span style={{ color: selectedMeta.color }}>
                                {84 + index * 4}%
                              </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-white/10">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ background: selectedMeta.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${84 + index * 4}%` }}
                                transition={{ duration: 0.65, delay: index * 0.08 }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <motion.div
                        className="relative mt-5 min-h-[18rem] flex-1 overflow-hidden rounded-2xl border border-white/14 bg-black/24"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28, delay: 0.12 }}
                      >
                        <motion.div
                          className="absolute inset-0"
                          initial={{ scale: 1.03, opacity: 0.86 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.45 }}
                        >
                          <Image
                            src={selectedMeta.image}
                            alt={`${selectedProject.title} project visual`}
                            fill
                            sizes="(max-width: 768px) 100vw, 480px"
                            className="object-contain p-2"
                            priority
                          />
                        </motion.div>
                        <div
                          className="pointer-events-none absolute inset-0 rounded-2xl"
                          style={{
                            boxShadow: `inset 0 0 42px ${selectedMeta.glow}, inset 0 0 0 1px rgba(255,255,255,0.08)`,
                          }}
                        />
                      </motion.div>
                    </div>
                  </div>

                  <div className="min-h-0 overflow-y-auto px-4 py-5 md:px-6 md:py-6">
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/55">
                      {selectedProject.tag}
                    </div>
                    <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white/95 md:text-[2rem]">
                      {selectedProject.title}
                    </h2>
                    <p className="mt-3 text-justify text-sm leading-7 text-white/78 md:text-[0.98rem]">
                      {selectedProject.desc}
                    </p>

                    <div className="mt-5 grid gap-2">
                      <div className="grid gap-2 sm:grid-cols-2">
                        {[
                          ["Role", selectedMeta.role],
                          ["Stack", selectedMeta.skills.join(" / ")],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-2xl border border-white/12 bg-white/6 p-3">
                            <div className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-white/42">
                              {label}
                            </div>
                            <div className="mt-1 text-sm font-semibold leading-6 text-white/82">
                              {value}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-2xl border border-white/12 bg-white/6 p-3">
                        <div className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-white/42">
                          What I Did
                        </div>
                        <div className="mt-1 text-justify text-sm font-semibold leading-6 text-white/82">
                          {selectedMeta.contribution}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2.5">
                      {selectedProject.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target={link.href.startsWith("http") ? "_blank" : undefined}
                          rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                          className="inline-flex items-center gap-1 rounded-full border border-white/22 bg-white/8 px-3.5 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-white/88 transition hover:bg-white/14"
                        >
                          {link.label}
                          <ExternalLink size={11} />
                        </a>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </section>
      </div>
    </PageShell>
  );
}
