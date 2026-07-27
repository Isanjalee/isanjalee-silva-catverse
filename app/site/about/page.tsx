"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useTheme } from "next-themes";
import PageShell from "@/components/PageShell";
import {
  BrainCircuit,
  BriefcaseBusiness,
  ChevronDown,
  Clock3,
  Code2,
  Compass,
  Download,
  Eye,
  GraduationCap,
  HeartHandshake,
  Linkedin,
  MapPin,
  Palette,
  PenLine,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

const subscribe = () => () => {};
const CV_PATH = "/Isanjalee-Silva-CV.pdf";
const LINKEDIN_URL = "https://www.linkedin.com/in/isanjalee-silva/";

type Tone = "cyan" | "lime" | "gold" | "violet";

type FiveWItem = {
  key: string;
  word: string;
  tab: string;
  question: string;
  line: string;
  detail: string;
  readout: string[];
  tone: Tone;
  icon: typeof UserRound;
};

type AboutScrollControllerStyle = CSSProperties & {
  "--about-scroll-thumb-size": string;
  "--about-scroll-thumb-top": string;
};

const fiveWItems: FiveWItem[] = [
  {
    key: "who",
    word: "Who",
    tab: "Who",
    question: "Identity",
    line: "A software engineer who blends technology, creativity, and problem-solving to build meaningful digital experiences.",
    detail: "Technology + creativity + problem-solving",
    readout: ["Software Engineer", "First Class Honours", "Creative Thinker"],
    tone: "gold",
    icon: UserRound,
  },
  {
    key: "what",
    word: "What",
    tab: "Build",
    question: "Craft",
    line: "I create reliable full-stack products, enterprise solutions, cloud systems, and intelligent applications.",
    detail: "Reliable products + intelligent applications",
    readout: ["Full-Stack", "Cloud & Enterprise", "AI Solutions"],
    tone: "cyan",
    icon: Code2,
  },
  {
    key: "why",
    word: "Why",
    tab: "Drive",
    question: "Purpose",
    line: "I build technology to simplify real problems, improve experiences, and create lasting value for people.",
    detail: "Useful systems with human value",
    readout: ["Solve Real Problems", "Human-Centred", "Meaningful Impact"],
    tone: "lime",
    icon: HeartHandshake,
  },
  {
    key: "where",
    word: "Where",
    tab: "Base",
    question: "Base",
    line: "My work connects healthcare, aviation, transportation, and enterprise technology across local and global teams.",
    detail: "Domain-aware local + global delivery",
    readout: ["Healthcare", "Aviation & Transport", "Global Collaboration"],
    tone: "cyan",
    icon: MapPin,
  },
  {
    key: "when",
    word: "When",
    tab: "Now",
    question: "Timeline",
    line: "My journey began with software development in 2021 and grew into professional engineering experience from 2023.",
    detail: "Development since 2021, professional since 2023",
    readout: ["Since 2021", "Professional Since 2023", "Always Learning"],
    tone: "violet",
    icon: Clock3,
  },
];

const portraitRails = [
  {
    label: "Profile signals",
    items: [
      "Global-ready IT",
      "Product + AI",
      "Panadura, Sri Lanka",
      "Engineer",
      "Researcher",
      "Artist",
      "Blog Writer",
      "Human-first systems",
    ],
  },
  {
    label: "Impact signals",
    items: [
      "2Y build experience",
      "GPA 3.72",
      "90% peak model accuracy",
      "30-50% workflow gain",
      "Healthcare platform",
      "Aviation systems",
      "Forecasting research",
      "Creative portfolio",
    ],
  },
];

const skillStack = [
  "Framer Motion",
  "JavaScript",
  "HTML5",
  "CSS3",
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind",
  "Express",
  "Java",
  "Spring Boot",
  "Python",
  "PostgreSQL",
  "Redis",
  "OpenSearch",
  "Prisma",
  "TensorFlow",
  "SHAP",
  "Docker",
];

const skillStackRows = [
  skillStack.slice(0, 9),
  skillStack.slice(9),
];

const craftItems = [
  {
    title: "Full-stack Product Build",
    detail: "Secure flows, calm UX, APIs, releases",
    icon: Code2,
    tone: "cyan",
  },
  {
    title: "Creative Interface Systems",
    detail: "Motion, illustration, responsive polish",
    icon: Palette,
    tone: "lime",
  },
  {
    title: "Applied AI Research",
    detail: "Forecasting, explainability, analytics",
    icon: BrainCircuit,
    tone: "violet",
  },
];

const timelineItems = [
  {
    label: "Now",
    value: "Healthcare Products",
    note: "Med Link platform, auth, analytics",
    tone: "cyan",
    icon: ShieldCheck,
  },
  {
    label: "IFS",
    value: "Aviation Enterprise",
    note: "supply chain, PL/SQL, cloud migration",
    tone: "gold",
    icon: BriefcaseBusiness,
  },
  {
    label: "Inivos",
    value: "Transport Automation",
    note: "maps, approvals, frontend delivery",
    tone: "violet",
    icon: MapPin,
  },
];

const studySignals = [
  {
    title: "Moratuwa First Class",
    detail: "B.Sc. IT & Management | GPA 3.72",
    icon: GraduationCap,
    tone: "violet",
  },
  {
    title: "Explainable Forecasting",
    detail: "SHAP/LIME demand analytics",
    icon: ShieldCheck,
    tone: "cyan",
  },
  {
    title: "Creative Voice",
    detail: "Digital art, blog writing, storytelling",
    icon: PenLine,
    tone: "gold",
  },
];

function toneClass(tone: Tone) {
  return `about-5w-tone-${tone}`;
}

export default function AboutPage() {
  const { resolvedTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const hasHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const isLight = hasHydrated ? resolvedTheme !== "dark" : false;
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingScrollRef = useRef(false);
  const [activeKey, setActiveKey] = useState(fiveWItems[0].key);
  const [isFiveWMenuOpen, setIsFiveWMenuOpen] = useState(false);
  const [scrollController, setScrollController] = useState({
    progress: 0,
    scrollable: false,
    thumbSize: 1,
  });
  const activeItem =
    fiveWItems.find((item) => item.key === activeKey) ?? fiveWItems[0];
  const ActiveIcon = activeItem.icon;
  const [typedCount, setTypedCount] = useState(0);
  const typingLimit = activeItem.line.length;
  const typedLine = activeItem.line.slice(0, typedCount);

  useEffect(() => {
    const resetTimeout = window.setTimeout(() => {
      setTypedCount(prefersReducedMotion ? typingLimit : 0);
    }, 0);

    if (prefersReducedMotion) {
      return () => window.clearTimeout(resetTimeout);
    }

    const interval = window.setInterval(() => {
      setTypedCount((current) => {
        if (current >= typingLimit) {
          window.clearInterval(interval);
          return typingLimit;
        }

        return current + 1;
      });
    }, 16);

    return () => {
      window.clearTimeout(resetTimeout);
      window.clearInterval(interval);
    };
  }, [activeKey, prefersReducedMotion, typingLimit]);

  const updateScrollController = useCallback(() => {
    const surface = surfaceRef.current;

    if (!surface) {
      return;
    }

    const maxScroll = Math.max(0, surface.scrollHeight - surface.clientHeight);
    const scrollable = maxScroll > 6;
    const progress = scrollable ? surface.scrollTop / maxScroll : 0;
    const thumbSize = scrollable
      ? Math.min(0.72, Math.max(0.18, surface.clientHeight / surface.scrollHeight))
      : 1;

    setScrollController((current) => {
      const next = { progress, scrollable, thumbSize };

      if (
        current.scrollable === next.scrollable &&
        Math.abs(current.progress - next.progress) < 0.003 &&
        Math.abs(current.thumbSize - next.thumbSize) < 0.003
      ) {
        return current;
      }

      return next;
    });
  }, []);

  useEffect(() => {
    const surface = surfaceRef.current;

    if (!surface) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(updateScrollController);
    const resizeObserver =
      "ResizeObserver" in window
        ? new ResizeObserver(updateScrollController)
        : null;

    resizeObserver?.observe(surface);
    surface.addEventListener("scroll", updateScrollController, { passive: true });
    window.addEventListener("resize", updateScrollController);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      surface.removeEventListener("scroll", updateScrollController);
      window.removeEventListener("resize", updateScrollController);
    };
  }, [activeKey, updateScrollController]);

  const setScrollFromPointer = useCallback((clientY: number) => {
    const surface = surfaceRef.current;
    const controller = controllerRef.current;

    if (!surface || !controller) {
      return;
    }

    const rect = controller.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    surface.scrollTop = ratio * (surface.scrollHeight - surface.clientHeight);
  }, []);

  const handleScrollPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!scrollController.scrollable) {
        return;
      }

      isDraggingScrollRef.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setScrollFromPointer(event.clientY);
    },
    [scrollController.scrollable, setScrollFromPointer],
  );

  const handleScrollPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDraggingScrollRef.current) {
        return;
      }

      setScrollFromPointer(event.clientY);
    },
    [setScrollFromPointer],
  );

  const handleScrollPointerEnd = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDraggingScrollRef.current) {
        return;
      }

      isDraggingScrollRef.current = false;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    [],
  );

  const handleScrollKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      const surface = surfaceRef.current;

      if (!surface) {
        return;
      }

      const step = Math.max(88, surface.clientHeight * 0.38);

      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        surface.scrollBy({
          top: event.key === "PageDown" ? surface.clientHeight * 0.82 : step,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      }

      if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        surface.scrollBy({
          top: event.key === "PageUp" ? -surface.clientHeight * 0.82 : -step,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      }

      if (event.key === "Home") {
        event.preventDefault();
        surface.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
      }

      if (event.key === "End") {
        event.preventDefault();
        surface.scrollTo({
          top: surface.scrollHeight,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      }
    },
    [prefersReducedMotion],
  );

  return (
    <PageShell>
      <div className="app-viewport-frame about-5w-frame flex h-[calc(var(--app-height)-12.5rem)] min-h-0 items-start">
        <section
          className={`about-5w-shell card page-light-card h-full w-full p-0 ${
            isLight ? "about-5w-light" : "about-5w-dark"
          }`}
        >
          <motion.div
            ref={surfaceRef}
            id="about-5w-scroll-surface"
            className="about-5w-surface"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34 }}
          >
            <span className="about-5w-glow about-5w-glow-a" aria-hidden="true" />
            <span className="about-5w-glow about-5w-glow-b" aria-hidden="true" />

            <div className="about-5w-layout">
              <motion.div
                className="about-5w-kicker"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
              >
                <Sparkles size={13} aria-hidden="true" />
                <span>Digital Profile Console</span>
              </motion.div>

              <div className="about-5w-stage">
                <motion.section
                  className="about-5w-card about-5w-main"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, delay: 0.04 }}
                >
                  <div className="about-5w-topline">
                    <div>
                      <span className="about-5w-watermark" aria-hidden="true">
                        Profile Compass
                      </span>
                      <h1 className="about-5w-title-word" aria-label="human.exe">
                        {"human.exe".split("").map((letter, index) => (
                          <span
                            key={`${letter}-${index}`}
                            className="about-5w-title-letter"
                            style={{ animationDelay: `${index * 80}ms` }}
                          >
                            {letter}
                          </span>
                        ))}
                      </h1>
                    </div>

                    <nav className="about-5w-actions" aria-label="Profile actions">
                      <a href={CV_PATH} target="_blank" rel="noreferrer">
                        <Eye size={13} aria-hidden="true" />
                        View CV
                      </a>
                      <a href={CV_PATH} download="Isanjalee-Silva-CV.pdf">
                        <Download size={13} aria-hidden="true" />
                        PDF
                      </a>
                      <a
                        href={LINKEDIN_URL}
                        target="_blank"
                        rel="me noopener noreferrer"
                        className="about-5w-linkedin-action"
                        aria-label="LinkedIn profile"
                        title="LinkedIn"
                      >
                        <Linkedin size={13} aria-hidden="true" />
                      </a>
                    </nav>
                  </div>

                  <div
                    className={`about-5w-tabs-wrap ${
                      isFiveWMenuOpen ? "is-open" : ""
                    }`}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") {
                        setIsFiveWMenuOpen(false);
                      }
                    }}
                  >
                    <button
                      type="button"
                      className={`about-5w-tab-trigger ${toneClass(activeItem.tone)}`}
                      aria-expanded={isFiveWMenuOpen}
                      aria-controls="about-5w-tabs-list"
                      onClick={() => setIsFiveWMenuOpen((open) => !open)}
                    >
                      <ActiveIcon size={14} aria-hidden="true" />
                      <span>{activeItem.tab}</span>
                      <ChevronDown size={14} aria-hidden="true" />
                    </button>

                    <div
                      id="about-5w-tabs-list"
                      className="about-5w-tabs"
                      role="tablist"
                      aria-label="Five W profile tabs"
                    >
                      {fiveWItems.map((item, index) => {
                        const ItemIcon = item.icon;
                        const selected = item.key === activeItem.key;
                        return (
                          <button
                            key={item.key}
                            type="button"
                            role="tab"
                            aria-selected={selected}
                            aria-controls="about-5w-panel"
                            id={`about-5w-tab-${item.key}`}
                            className={`${toneClass(item.tone)} ${
                              selected ? "is-active" : ""
                            }`}
                            data-signal={String(index + 1).padStart(2, "0")}
                            onClick={() => {
                              setActiveKey(item.key);
                              setIsFiveWMenuOpen(false);
                            }}
                          >
                            <ItemIcon size={14} aria-hidden="true" />
                            <span data-label={item.tab}>{item.tab}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div
                      className="about-5w-mobile-accordion"
                      aria-label="Five W profile sections"
                    >
                      {fiveWItems.map((item, index) => {
                        const ItemIcon = item.icon;
                        const selected = item.key === activeItem.key;

                        return (
                          <div
                            key={`mobile-${item.key}`}
                            className={`about-5w-mobile-item ${
                              selected ? "is-active" : ""
                            }`}
                          >
                            <button
                              type="button"
                              className={`about-5w-mobile-tab ${toneClass(item.tone)}`}
                              aria-expanded={selected}
                              data-signal={String(index + 1).padStart(2, "0")}
                              onClick={() => {
                                setActiveKey(item.key);
                                setIsFiveWMenuOpen(false);
                              }}
                            >
                              <ItemIcon size={14} aria-hidden="true" />
                              <span>{item.word.toUpperCase()}</span>
                              <ChevronDown size={14} aria-hidden="true" />
                            </button>

                            <AnimatePresence initial={false}>
                              {selected ? (
                                <motion.article
                                  key={`mobile-answer-${item.key}`}
                                  className={`about-5w-mobile-answer ${toneClass(
                                    item.tone,
                                  )}`}
                                  initial={
                                    prefersReducedMotion
                                      ? { opacity: 1 }
                                      : { opacity: 0, height: 0, y: -6 }
                                  }
                                  animate={{ opacity: 1, height: "auto", y: 0 }}
                                  exit={
                                    prefersReducedMotion
                                      ? { opacity: 0 }
                                      : { opacity: 0, height: 0, y: -6 }
                                  }
                                  transition={{ duration: 0.18 }}
                                >
                                  <div
                                    className="about-5w-mobile-word"
                                    aria-hidden="true"
                                  >
                                    {item.word
                                      .toUpperCase()
                                      .split("")
                                      .map((letter, letterIndex) => (
                                        <span
                                          key={`${item.key}-mobile-${letter}-${letterIndex}`}
                                          className="about-5w-typeletter"
                                          style={{
                                            animationDelay: `${letterIndex * 95}ms`,
                                          }}
                                        >
                                          {letter}
                                        </span>
                                      ))}
                          </div>
                          <div className="about-5w-mobile-copy">
                            <p aria-label={item.line}>
                              {selected ? typedLine : item.line}
                            </p>
                          </div>
                                  <div
                                    className="about-5w-mobile-readout"
                                    aria-label={`${item.word} profile details`}
                                  >
                                    {item.readout.map((readout, readoutIndex) => (
                                      <b key={readout}>
                                        {String(readoutIndex + 1).padStart(2, "0")}{" "}
                                        {readout}
                                      </b>
                                    ))}
                                  </div>
                                </motion.article>
                              ) : null}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.article
                      key={activeItem.key}
                      id="about-5w-panel"
                      role="tabpanel"
                      aria-labelledby={`about-5w-tab-${activeItem.key}`}
                      className={`about-5w-answer ${toneClass(activeItem.tone)}`}
                      initial={
                        prefersReducedMotion
                          ? { opacity: 1 }
                          : { opacity: 0, y: 8, scale: 0.985 }
                      }
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={
                        prefersReducedMotion
                          ? { opacity: 1 }
                          : { opacity: 0, y: -8, scale: 0.985 }
                      }
                      transition={{ duration: 0.2 }}
                    >
                      <div className="about-5w-answer-line">
                        <div className="about-5w-typeword" aria-hidden="true">
                          {activeItem.word
                            .toUpperCase()
                            .split("")
                            .map((letter, index) => (
                              <span
                                key={`${activeItem.key}-${letter}-${index}`}
                                className="about-5w-typeletter"
                                style={{ animationDelay: `${index * 95}ms` }}
                              >
                                {letter}
                              </span>
                            ))}
                        </div>

                        <div className="about-5w-answer-copy">
                          <p aria-label={activeItem.line}>{typedLine}</p>
                        </div>
                      </div>

                      <div className="about-5w-readout" aria-label={`${activeItem.word} profile details`}>
                        {activeItem.readout.map((item, index) => (
                          <span key={item}>
                            <b>{String(index + 1).padStart(2, "0")}</b>
                            {item}
                          </span>
                        ))}
                      </div>
                    </motion.article>
                  </AnimatePresence>

                  <div className="about-5w-skill-stack" aria-label="Skill stack">
                    <strong>Skill Stack</strong>
                    <div className="about-5w-skill-rails">
                      {skillStackRows.map((row, rowIndex) => (
                        <div
                          key={`skill-row-${rowIndex}`}
                          className="about-5w-skill-row"
                        >
                          <span className="about-5w-skill-track">
                            {[...row, ...row].map((skill, skillIndex) => (
                              <b key={`${skill}-${skillIndex}`}>{skill}</b>
                            ))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </motion.section>

                <motion.section
                  className="about-5w-portrait"
                  initial={{ opacity: 0, y: 8, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.32, delay: 0.08 }}
                  whileHover={
                    prefersReducedMotion ? undefined : { y: -3, scale: 1.008 }
                  }
                >
                  <Image
                    src={isLight ? "/about/profile-light.png" : "/about/profile-dark.png"}
                    alt="Portrait illustration for the profile page"
                    fill
                    sizes="(max-width: 768px) 100vw, 38vw"
                    className="about-5w-portrait-image"
                    priority
                  />
                  <span className="about-5w-portrait-shine" aria-hidden="true" />
                  <div className="about-portrait-rails" aria-label="Profile and impact signals">
                    {portraitRails.map((rail, railIndex) => (
                      <div
                        key={rail.label}
                        className={`about-portrait-rail about-portrait-rail-${railIndex + 1}`}
                      >
                        <span className="about-portrait-track">
                          {[...rail.items, ...rail.items].map((item, itemIndex) => (
                            <b key={`${rail.label}-${item}-${itemIndex}`}>{item}</b>
                          ))}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.section>
              </div>

              <div className="about-5w-bottom">
                <motion.section
                  className="about-5w-card about-5w-craft"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, delay: 0.12 }}
                >
                  <h2>
                    <Compass size={14} aria-hidden="true" />
                    Engineering Capability
                  </h2>
                  <div>
                    {craftItems.map((item) => {
                      const CraftIcon = item.icon;
                      return (
                        <article key={item.title} className={toneClass(item.tone as Tone)}>
                          <span className="about-5w-mini-icon" aria-hidden="true">
                            <CraftIcon size={16} />
                          </span>
                          <span className="about-5w-mini-copy">
                            <strong>{item.title}</strong>
                            <em>{item.detail}</em>
                          </span>
                        </article>
                      );
                    })}
                  </div>
                </motion.section>

                <motion.section
                  className="about-5w-card about-5w-timeline"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, delay: 0.16 }}
                >
                  <h2>
                    <BriefcaseBusiness size={14} aria-hidden="true" />
                    Industry Path
                  </h2>
                  <div>
                    {timelineItems.map((item) => {
                      const TimelineIcon = item.icon;
                      return (
                        <article key={item.value} className={toneClass(item.tone as Tone)}>
                          <span className="about-5w-mini-icon" aria-hidden="true">
                            <TimelineIcon size={16} />
                          </span>
                          <span className="about-5w-mini-copy">
                            <small>{item.label}</small>
                            <strong>{item.value}</strong>
                            <em>{item.note}</em>
                          </span>
                        </article>
                      );
                    })}
                  </div>
                </motion.section>

                <motion.section
                  className="about-5w-card about-5w-study"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, delay: 0.2 }}
                >
                  <h2>
                    <GraduationCap size={14} aria-hidden="true" />
                    Achievements + Research
                  </h2>
                  <div className="about-5w-study-grid" aria-label="Education and research signals">
                    {studySignals.map((item) => {
                      const StudyIcon = item.icon;
                      return (
                        <article key={item.title} className={toneClass(item.tone as Tone)}>
                          <span className="about-5w-mini-icon" aria-hidden="true">
                            <StudyIcon size={16} />
                          </span>
                          <span className="about-5w-mini-copy">
                            <strong>{item.title}</strong>
                            <em>{item.detail}</em>
                          </span>
                        </article>
                      );
                    })}
                  </div>
                  <span className="about-5w-rolebar">
                    <Palette size={13} aria-hidden="true" />
                    Engineer | Researcher | Artist | Writer
                  </span>
                </motion.section>
              </div>
            </div>
          </motion.div>
          <div
            ref={controllerRef}
            className="about-mobile-scroll-controller"
            data-visible={scrollController.scrollable ? "true" : "false"}
            role="scrollbar"
            aria-label="Scroll about console"
            aria-controls="about-5w-scroll-surface"
            aria-orientation="vertical"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(scrollController.progress * 100)}
            tabIndex={scrollController.scrollable ? 0 : -1}
            onPointerDown={handleScrollPointerDown}
            onPointerMove={handleScrollPointerMove}
            onPointerUp={handleScrollPointerEnd}
            onPointerCancel={handleScrollPointerEnd}
            onKeyDown={handleScrollKeyDown}
            style={
              {
                "--about-scroll-thumb-size": `${scrollController.thumbSize * 100}%`,
                "--about-scroll-thumb-top": `${
                  scrollController.progress *
                  (1 - scrollController.thumbSize) *
                  100
                }%`,
              } as AboutScrollControllerStyle
            }
          >
            <span className="about-mobile-scroll-controller__thumb" />
          </div>
        </section>
      </div>

      <style>{`
        .about-5w-frame {
          width: 100%;
          overflow: visible;
        }

        .about-5w-shell {
          --about-cyan: rgba(34, 211, 238, 0.88);
          --about-lime: rgba(163, 230, 53, 0.88);
          --about-gold: rgba(251, 191, 36, 0.9);
          --about-violet: rgba(192, 132, 252, 0.84);
          --about-text: rgba(245, 236, 225, 0.92);
          --about-muted: rgba(245, 236, 225, 0.64);
          --about-soft: rgba(255, 255, 255, 0.05);
          --about-panel: rgba(255, 255, 255, 0.04);
          --about-border: rgba(255, 255, 255, 0.12);
          position: relative;
          overflow: hidden;
          border-radius: 20px;
        }

        .about-5w-light {
          --about-cyan: rgb(8, 145, 178);
          --about-lime: rgb(101, 163, 13);
          --about-gold: rgb(202, 138, 4);
          --about-violet: rgb(8, 145, 178);
          --about-text: rgba(36, 42, 48, 0.9);
          --about-muted: rgba(54, 61, 68, 0.68);
          --about-soft: rgba(240, 253, 255, 0.9);
          --about-panel: rgba(240, 253, 255, 0.76);
          --about-border: rgba(14, 165, 233, 0.24);
        }

        .about-5w-surface {
          position: relative;
          height: 100%;
          min-height: 0;
          overflow: hidden;
          padding: clamp(0.82rem, 1.35vw, 1.08rem);
          color: var(--about-text);
          background:
            radial-gradient(circle at 9% 8%, rgba(34, 211, 238, 0.11), transparent 34%),
            radial-gradient(circle at 88% 12%, rgba(251, 191, 36, 0.13), transparent 34%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.018));
        }

        .about-mobile-scroll-controller {
          display: none;
        }

        .about-5w-light .about-5w-surface {
          background:
            radial-gradient(circle at 10% 8%, rgba(34, 211, 238, 0.15), transparent 34%),
            radial-gradient(circle at 84% 10%, rgba(163, 230, 53, 0.11), transparent 36%),
            radial-gradient(circle at 92% 78%, rgba(251, 191, 36, 0.09), transparent 35%),
            linear-gradient(180deg, rgba(248, 253, 255, 0.94), rgba(239, 251, 250, 0.88));
        }

        .about-5w-glow {
          pointer-events: none;
          position: absolute;
          border-radius: 999px;
          filter: blur(40px);
          opacity: 0.3;
        }

        .about-5w-glow-a {
          right: 12%;
          top: 8%;
          width: 10rem;
          height: 10rem;
          background: var(--about-gold);
        }

        .about-5w-glow-b {
          bottom: 9%;
          left: 9%;
          width: 9rem;
          height: 9rem;
          background: var(--about-cyan);
        }

        .about-5w-layout {
          position: relative;
          display: grid;
          height: 100%;
          min-height: 0;
          grid-template-rows: auto minmax(0, 1.25fr) minmax(11rem, 0.75fr);
          gap: clamp(0.55rem, 0.9vw, 0.72rem);
        }

        .about-5w-kicker {
          display: inline-flex;
          flex: 0 0 auto;
          width: fit-content;
          align-items: center;
          gap: 0.5rem;
          align-self: start;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          padding: 0.25rem 0.75rem;
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.58);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          line-height: 1;
          text-transform: uppercase;
          transition:
            transform 0.18s ease,
            border-color 0.18s ease,
            background 0.18s ease,
            color 0.18s ease;
        }

        .about-5w-kicker svg {
          flex: 0 0 auto;
          transition:
            transform 0.18s ease,
            filter 0.18s ease,
            color 0.18s ease;
        }

        .about-5w-kicker:hover,
        .about-5w-kicker:focus-within {
          border-color: rgba(255, 255, 255, 0.22);
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.74);
          transform: translateY(-1px);
        }

        .about-5w-kicker:hover svg,
        .about-5w-kicker:focus-within svg {
          transform: rotate(-8deg) scale(1.08);
        }

        .about-5w-stage {
          display: grid;
          min-height: 0;
          grid-template-columns: minmax(0, 1.28fr) minmax(18rem, 0.92fr);
          gap: clamp(0.55rem, 0.9vw, 0.72rem);
        }

        .about-5w-bottom {
          display: grid;
          min-height: 0;
          grid-template-columns: minmax(0, 1.18fr) minmax(0, 0.92fr) minmax(0, 0.95fr);
          gap: clamp(0.55rem, 0.9vw, 0.72rem);
        }

        .about-5w-card,
        .about-5w-portrait {
          position: relative;
          min-width: 0;
          min-height: 0;
          overflow: hidden;
          border: 1px solid var(--about-border);
          border-radius: 14px;
          background:
            radial-gradient(circle at 94% 12%, rgba(251, 191, 36, 0.12), transparent 38%),
            radial-gradient(circle at 8% 92%, rgba(34, 211, 238, 0.09), transparent 42%),
            linear-gradient(180deg, var(--about-panel), rgba(255, 255, 255, 0.024));
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            0 14px 28px rgba(0, 0, 0, 0.18);
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .about-5w-card::before {
          content: "";
          pointer-events: none;
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background:
            linear-gradient(115deg, rgba(34, 211, 238, 0.08), transparent 36%, rgba(251, 191, 36, 0.08)),
            radial-gradient(circle at 14% 20%, rgba(255, 255, 255, 0.055), transparent 30%);
          opacity: 0.76;
        }

        .about-5w-card > * {
          position: relative;
          z-index: 1;
        }

        .about-5w-card:hover,
        .about-5w-portrait:hover,
        .about-5w-card:focus-within {
          border-color: rgba(251, 191, 36, 0.42);
          box-shadow:
            inset 0 0 22px rgba(251, 191, 36, 0.08),
            0 16px 30px rgba(251, 191, 36, 0.1);
          transform: translateY(-2px);
        }

        .about-5w-main {
          display: grid;
          align-content: stretch;
          grid-template-rows: auto auto minmax(0, 1fr) auto;
          gap: clamp(0.5rem, 0.82vw, 0.66rem);
          padding: clamp(0.72rem, 1.12vw, 0.98rem);
          border-color: rgba(251, 191, 36, 0.3);
          background:
            radial-gradient(circle at 12% 14%, rgba(34, 211, 238, 0.16), transparent 36%),
            radial-gradient(circle at 84% 10%, rgba(251, 191, 36, 0.18), transparent 38%),
            radial-gradient(circle at 76% 90%, rgba(192, 132, 252, 0.1), transparent 42%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.024));
        }

        .about-5w-main::after {
          content: "";
          pointer-events: none;
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background:
            linear-gradient(90deg, transparent 0 11%, rgba(34, 211, 238, 0.08) 11.2% 11.45%, transparent 11.7% 100%),
            linear-gradient(180deg, transparent 0 22%, rgba(251, 191, 36, 0.07) 22.2% 22.5%, transparent 22.8% 100%);
          opacity: 0.46;
          animation: about-5w-surface-pulse 5.8s ease-in-out infinite;
        }

        .about-5w-topline {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: clamp(0.5rem, 0.86vw, 0.74rem);
          align-items: center;
        }

        .about-5w-topline > div {
          position: relative;
          min-width: 0;
        }

        .about-5w-watermark {
          pointer-events: none;
          position: absolute;
          left: -0.06rem;
          top: -0.32rem;
          color: rgba(255, 255, 255, 0.055);
          font-size: clamp(1.55rem, 4.2vw, 3.6rem);
          font-weight: 950;
          line-height: 0.9;
          white-space: nowrap;
        }

        .about-5w-light .about-5w-watermark {
          color: rgba(60, 48, 38, 0.06);
        }

        .about-5w-topline h1 {
          position: relative;
          display: inline-flex;
          flex-wrap: nowrap;
          align-items: baseline;
          margin: 0;
          color: var(--about-text);
          font-size: clamp(2rem, 3.45vw, 3rem);
          font-weight: 950;
          letter-spacing: 0;
          line-height: 0.95;
          white-space: nowrap;
        }

        .about-5w-title-word {
          isolation: isolate;
        }

        .about-5w-title-letter {
          position: relative;
          display: inline-block;
          padding-inline: 0.012em;
          color: #e6fbff;
          -webkit-text-fill-color: currentColor;
          -webkit-text-stroke: 0.035em rgba(9, 13, 18, 0.36);
          paint-order: stroke fill;
          text-shadow:
            0 0 2px color-mix(in srgb, currentColor 34%, transparent),
            0 0 11px color-mix(in srgb, #22d3ee 16%, transparent),
            0 1px 0 rgba(0, 0, 0, 0.18);
          animation: about-5w-letter-pulse 3.4s ease-in-out infinite;
          will-change: filter, transform, opacity;
        }

        .about-5w-title-letter:nth-child(3n + 2) {
          color: #b8f3ff;
        }

        .about-5w-title-letter:nth-child(3n) {
          color: #d9ff6a;
        }

        .about-5w-title-letter:nth-child(4n) {
          color: #f8fafc;
        }

        .about-5w-typeletter {
          position: relative;
          display: inline-block;
          padding-inline: 0.012em;
          color: color-mix(in srgb, var(--tone) 88%, #fff7cc);
          -webkit-text-fill-color: currentColor;
          -webkit-text-stroke: 0.035em color-mix(in srgb, var(--tone) 34%, rgba(8, 13, 18, 0.34));
          paint-order: stroke fill;
          text-shadow:
            0 0 3px color-mix(in srgb, currentColor 40%, transparent),
            0 0 13px color-mix(in srgb, var(--tone) 28%, transparent),
            0 1px 0 rgba(0, 0, 0, 0.18);
          animation: about-5w-letter-pulse 3.4s ease-in-out infinite;
          will-change: filter, transform, opacity;
        }

        .about-5w-typeletter:nth-child(2n) {
          color: color-mix(in srgb, var(--tone) 72%, #fefce8);
        }

        .about-5w-typeletter:nth-child(3n) {
          color: color-mix(in srgb, var(--tone) 68%, #d9f99d);
        }

        .about-5w-light .about-5w-title-word {
          border: 0;
          background: none;
          box-shadow: none;
        }

        .about-5w-light .about-5w-title-letter {
          color: #f8fdff;
          -webkit-text-stroke-color: rgba(15, 23, 42, 0.62);
          text-shadow:
            0 0 1px rgba(15, 23, 42, 0.46),
            0 0 9px rgba(34, 211, 238, 0.2),
            0 1px 0 rgba(255, 255, 255, 0.86);
        }

        .about-5w-light .about-5w-title-letter:nth-child(3n + 2) {
          color: #67e8f9;
        }

        .about-5w-light .about-5w-title-letter:nth-child(3n) {
          color: #bef264;
        }

        .about-5w-light .about-5w-title-letter:nth-child(4n) {
          color: #ffffff;
        }

        .about-5w-light .about-5w-typeletter {
          color: color-mix(in srgb, var(--tone) 88%, #fff7ed);
          -webkit-text-stroke-color: color-mix(in srgb, var(--tone) 46%, rgba(31, 41, 55, 0.24));
          text-shadow:
            0 0 2px rgba(255, 255, 255, 0.9),
            0 0 10px color-mix(in srgb, var(--tone) 24%, transparent),
            0 1px 0 rgba(255, 255, 255, 0.7);
        }

        .about-5w-light .about-5w-typeletter:nth-child(2n) {
          color: color-mix(in srgb, var(--tone) 72%, #fef3c7);
        }

        .about-5w-light .about-5w-typeletter:nth-child(3n) {
          color: color-mix(in srgb, var(--tone) 70%, #dcfce7);
        }

        .about-5w-topline p {
          position: relative;
          margin: 0.34rem 0 0;
          color: var(--about-muted);
          font-size: clamp(0.78rem, 0.98vw, 0.92rem);
          font-weight: 850;
          line-height: 1.2;
        }

        .about-5w-actions {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: flex-end;
          gap: 0.34rem;
          justify-self: end;
          max-width: none;
          padding-top: 0;
          white-space: nowrap;
        }

        .about-5w-actions a,
        .about-5w-tabs button,
        .about-5w-tab-trigger {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          border: 1px solid rgba(34, 211, 238, 0.28);
          border-radius: 999px;
          background: rgba(34, 211, 238, 0.08);
          color: var(--about-text);
          font-weight: 900;
          line-height: 1;
          text-decoration: none;
          transition:
            transform 0.18s ease,
            border-color 0.18s ease,
            background 0.18s ease,
            box-shadow 0.18s ease;
        }

        .about-5w-actions a {
          flex: 0 0 auto;
          min-height: 1.86rem;
          padding: 0.42rem 0.56rem;
          font-size: 0.6rem;
        }

        .about-5w-actions .about-5w-linkedin-action {
          width: 1.86rem;
          padding-inline: 0;
        }

        .about-5w-actions a:hover,
        .about-5w-actions a:focus-visible,
        .about-5w-tabs button:hover,
        .about-5w-tabs button:focus-visible,
        .about-5w-tab-trigger:hover,
        .about-5w-tab-trigger:focus-visible {
          border-color: rgba(251, 191, 36, 0.52);
          background: rgba(251, 191, 36, 0.13);
          box-shadow: 0 8px 18px rgba(251, 191, 36, 0.08);
          outline: none;
          transform: translateY(-2px);
        }

        .about-5w-tabs-wrap {
          display: grid;
          min-width: 0;
          gap: 0.4rem;
        }

        .about-5w-tab-trigger {
          display: none;
          width: 100%;
          min-height: 2.1rem;
          padding: 0.42rem 0.58rem;
          color: var(--tone);
          cursor: pointer;
          font-size: 0.66rem;
          text-transform: uppercase;
        }

        .about-5w-tab-trigger svg:last-child {
          margin-left: auto;
          transition: transform 0.18s ease;
        }

        .about-5w-tabs-wrap.is-open .about-5w-tab-trigger svg:last-child {
          transform: rotate(180deg);
        }

        .about-5w-tabs {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 0.4rem;
        }

        .about-5w-mobile-accordion {
          display: none;
        }

        .about-5w-tabs button {
          position: relative;
          min-width: 0;
          min-height: 2.28rem;
          overflow: hidden;
          padding: 0.42rem 0.34rem;
          color: var(--tone);
          cursor: pointer;
          font-size: 0.68rem;
          text-transform: uppercase;
        }

        .about-5w-tabs button::before {
          content: attr(data-signal);
          position: absolute;
          right: 0.48rem;
          top: 0.34rem;
          color: color-mix(in srgb, var(--tone) 38%, transparent);
          font-size: 0.48rem;
          font-weight: 950;
          line-height: 1;
          opacity: 0;
          transform: translateY(-0.2rem);
          transition:
            opacity 0.18s ease,
            transform 0.18s ease;
        }

        .about-5w-tabs button span {
          position: relative;
          display: inline-block;
          min-width: 0;
          text-shadow: 0 0 10px color-mix(in srgb, var(--tone) 16%, transparent);
        }

        .about-5w-tabs button span::after {
          content: attr(data-label);
          pointer-events: none;
          position: absolute;
          inset: 0;
          color: var(--tone);
          opacity: 0;
          transform: translateX(0.08rem);
        }

        .about-5w-tabs button svg {
          transition:
            transform 0.2s ease,
            filter 0.2s ease;
        }

        .about-5w-tabs button.is-active {
          border-color: color-mix(in srgb, var(--tone) 68%, transparent);
          background:
            radial-gradient(circle at 92% 10%, color-mix(in srgb, var(--tone) 22%, transparent), transparent 50%),
            color-mix(in srgb, var(--tone) 13%, transparent);
          box-shadow:
            inset 0 0 18px color-mix(in srgb, var(--tone) 10%, transparent),
            0 10px 20px color-mix(in srgb, var(--tone) 8%, transparent);
        }

        .about-5w-tabs button:hover::before,
        .about-5w-tabs button:focus-visible::before,
        .about-5w-tabs button.is-active::before {
          opacity: 0.82;
          transform: translateY(0);
        }

        .about-5w-tabs button:hover svg,
        .about-5w-tabs button:focus-visible svg,
        .about-5w-tabs button.is-active svg {
          filter: drop-shadow(0 0 8px color-mix(in srgb, var(--tone) 42%, transparent));
          transform: rotate(-8deg) scale(1.08);
        }

        .about-5w-tabs button:hover span::after,
        .about-5w-tabs button:focus-visible span::after,
        .about-5w-tabs button.is-active span::after {
          animation: about-5w-tab-glitch 0.72s steps(2, end) infinite;
          opacity: 0.46;
        }

        .about-5w-tabs button:hover span,
        .about-5w-tabs button:focus-visible span,
        .about-5w-tabs button.is-active span {
          animation: about-5w-tab-name-pulse 1.5s ease-in-out infinite;
        }

        .about-5w-answer {
          --about-console-gap: clamp(0.48rem, 0.78vw, 0.64rem);
          position: relative;
          display: grid;
          grid-template-rows: minmax(0, 1fr) auto;
          align-items: stretch;
          gap: var(--about-console-gap);
          align-self: stretch;
          height: auto;
          min-height: clamp(9rem, 18vh, 10.65rem);
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--tone) 34%, transparent);
          border-radius: 13px;
          padding: clamp(0.56rem, 0.9vw, 0.74rem);
          background:
            linear-gradient(90deg, rgba(255, 255, 255, 0.04) 0 1px, transparent 1px 100%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.035) 0 1px, transparent 1px 100%),
            repeating-linear-gradient(90deg, transparent 0 19px, color-mix(in srgb, var(--tone) 7%, transparent) 20px 21px, transparent 22px 42px),
            repeating-linear-gradient(180deg, rgba(255, 255, 255, 0.035) 0 1px, transparent 1px 7px),
            radial-gradient(circle at 12% 20%, color-mix(in srgb, var(--tone) 16%, transparent) 0 0.16rem, transparent 0.18rem),
            radial-gradient(circle at 18% 72%, rgba(255, 255, 255, 0.1) 0 0.12rem, transparent 0.14rem),
            radial-gradient(circle at 88% 74%, color-mix(in srgb, var(--tone) 12%, transparent) 0 0.14rem, transparent 0.16rem),
            radial-gradient(circle at 92% 14%, color-mix(in srgb, var(--tone) 18%, transparent), transparent 42%),
            linear-gradient(135deg, color-mix(in srgb, var(--tone) 10%, transparent), rgba(255, 255, 255, 0.038));
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            inset 0 0 28px color-mix(in srgb, var(--tone) 7%, transparent),
            0 12px 22px rgba(0, 0, 0, 0.14);
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .about-5w-answer:hover {
          border-color: color-mix(in srgb, var(--tone) 56%, transparent);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.13),
            inset 0 0 30px color-mix(in srgb, var(--tone) 10%, transparent),
            0 14px 26px color-mix(in srgb, var(--tone) 8%, transparent);
          transform: translateY(-1px);
        }

        .about-5w-answer::before {
          content: "";
          pointer-events: none;
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background:
            linear-gradient(90deg, transparent, color-mix(in srgb, var(--tone) 14%, transparent), transparent),
            radial-gradient(circle at 74% 72%, color-mix(in srgb, var(--tone) 16%, transparent), transparent 28%);
          opacity: 0.52;
        }

        .about-5w-answer::after {
          content: "";
          pointer-events: none;
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background:
            linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--tone) 18%, transparent) 48%, transparent 100%),
            radial-gradient(circle at 16% 26%, color-mix(in srgb, var(--tone) 32%, transparent) 0 0.12rem, transparent 0.14rem),
            radial-gradient(circle at 24% 74%, rgba(255, 255, 255, 0.16) 0 0.1rem, transparent 0.12rem),
            radial-gradient(circle at 86% 34%, color-mix(in srgb, var(--tone) 24%, transparent) 0 0.11rem, transparent 0.13rem);
          mix-blend-mode: screen;
          opacity: 0.38;
          transform: translateX(-38%);
          animation: about-5w-panel-scan 4.6s ease-in-out infinite;
        }

        .about-5w-answer > * {
          position: relative;
          z-index: 1;
        }

        .about-5w-answer-line {
          display: grid;
          min-height: 0;
          min-width: 0;
          grid-template-columns: clamp(6.1rem, 9.2vw, 7.8rem) minmax(0, 1fr);
          align-items: stretch;
          gap: var(--about-console-gap);
        }

        .about-5w-typeword {
          display: inline-flex;
          position: relative;
          min-width: 0;
          max-width: 100%;
          min-height: 100%;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--tone) 32%, transparent);
          border-radius: 11px;
          background:
            radial-gradient(circle at 50% 18%, color-mix(in srgb, var(--tone) 22%, transparent), transparent 46%),
            repeating-linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0 1px, transparent 1px 6px),
            color-mix(in srgb, var(--tone) 8%, transparent);
          color: var(--tone);
          font-size: clamp(1.3rem, 2.52vw, 2.2rem);
          font-weight: 950;
          line-height: 0.92;
          text-align: center;
          text-transform: uppercase;
          text-shadow:
            0 0 16px color-mix(in srgb, var(--tone) 30%, transparent),
            0 0 34px color-mix(in srgb, var(--tone) 18%, transparent);
          transition:
            transform 0.18s ease,
            border-color 0.18s ease,
            box-shadow 0.18s ease,
            filter 0.18s ease;
          animation: about-5w-word-hum 3.8s ease-in-out infinite;
        }

        .about-5w-typeword::before,
        .about-5w-typeword::after {
          content: "";
          pointer-events: none;
          position: absolute;
          inset: 0;
          border-radius: inherit;
        }

        .about-5w-typeword::before {
          background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--tone) 22%, transparent), transparent);
          opacity: 0.52;
          transform: translateX(-48%);
          animation: about-5w-word-scan 3.1s ease-in-out infinite;
        }

        .about-5w-typeword::after {
          border: 1px solid color-mix(in srgb, var(--tone) 20%, transparent);
          opacity: 0.7;
          transform: scale(0.94);
        }

        .about-5w-answer:hover .about-5w-typeword,
        .about-5w-answer:focus-within .about-5w-typeword {
          border-color: color-mix(in srgb, var(--tone) 58%, transparent);
          box-shadow:
            inset 0 0 22px color-mix(in srgb, var(--tone) 18%, transparent),
            0 0 22px color-mix(in srgb, var(--tone) 18%, transparent),
            0 0 34px rgba(255, 255, 255, 0.1);
          filter: brightness(1.22) saturate(1.12);
          transform: translateY(-1px) rotate(-0.35deg);
          animation:
            about-5w-word-hum 3.8s ease-in-out infinite,
            about-5w-diamond-shake 0.42s ease-in-out;
        }

        .about-5w-answer:hover .about-5w-typeletter,
        .about-5w-answer:focus-within .about-5w-typeletter,
        .about-5w-mobile-item.is-active:hover .about-5w-typeletter,
        .about-5w-mobile-item.is-active:focus-within .about-5w-typeletter {
          animation:
            about-5w-letter-pulse 1.4s ease-in-out infinite,
            about-5w-letter-pop 0.48s ease-out;
          filter: brightness(1.18) saturate(1.14);
        }

        .about-5w-answer:active .about-5w-typeword {
          filter: brightness(1.34) saturate(1.16);
          transform: translateY(0) scale(0.988);
        }

        .about-5w-answer:hover .about-5w-typeword::before,
        .about-5w-answer:focus-within .about-5w-typeword::before {
          opacity: 0.86;
          animation:
            about-5w-word-scan 1.35s ease-in-out infinite,
            about-5w-diamond-sparkle 0.92s ease-out;
        }

        .about-5w-answer-copy {
          display: grid;
          min-height: 0;
          min-width: 0;
          align-self: stretch;
          grid-template-rows: minmax(3.8rem, 1fr);
          align-content: center;
          border: 1px solid color-mix(in srgb, var(--tone) 24%, transparent);
          border-radius: 11px;
          padding: calc(var(--about-console-gap) + 0.1rem) var(--about-console-gap);
          background:
            linear-gradient(90deg, color-mix(in srgb, var(--tone) 9%, transparent), transparent 32%),
            repeating-linear-gradient(180deg, rgba(255, 255, 255, 0.045) 0 1px, transparent 1px 8px),
            rgba(0, 0, 0, 0.08);
        }

        .about-5w-answer-mark {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          gap: 0.42rem;
          color: var(--tone);
          font-size: 0.64rem;
          font-weight: 950;
          letter-spacing: 0;
          line-height: 1;
          text-transform: uppercase;
        }

        .about-5w-answer h2 {
          margin: 0.42rem 0 0;
          max-width: 40rem;
          color: var(--about-text);
          font-size: clamp(1.22rem, 2.25vw, 2rem);
          font-weight: 950;
          letter-spacing: 0;
          line-height: 1.04;
        }

        .about-5w-answer p {
          position: relative;
          display: -webkit-box;
          overflow: hidden;
          align-self: center;
          margin: 0;
          width: min(100%, 38rem);
          min-height: calc(1.32em * 2);
          max-height: calc(1.32em * 3);
          color: var(--about-muted);
          font-size: clamp(0.78rem, 0.92vw, 0.86rem);
          font-weight: 820;
          line-height: 1.32;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          font-variant-numeric: tabular-nums;
          text-shadow:
            0 0 10px color-mix(in srgb, var(--tone) 18%, transparent),
            0 0 24px rgba(34, 211, 238, 0.08);
          animation:
            about-5w-text-signal 0.44s steps(2, end) infinite,
            about-5w-text-glow 2.8s ease-in-out infinite;
        }

        .about-5w-answer p::after {
          content: "";
          display: inline-block;
          width: 0.5rem;
          height: 0.78em;
          margin-left: 0.18rem;
          border-radius: 999px;
          background: var(--tone);
          animation: about-5w-caret 0.82s steps(2, start) infinite;
        }

        .about-5w-readout {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: var(--about-console-gap);
          margin-top: 0;
        }

        .about-5w-readout span {
          display: inline-flex;
          min-width: 0;
          align-items: center;
          gap: 0.28rem;
          border: 1px solid color-mix(in srgb, var(--tone) 28%, transparent);
          border-radius: 10px;
          padding: 0.38rem 0.46rem;
          background:
            radial-gradient(circle at 90% 16%, color-mix(in srgb, var(--tone) 16%, transparent), transparent 42%),
            color-mix(in srgb, var(--tone) 8%, transparent);
          color: var(--about-muted);
          font-size: 0.55rem;
          font-weight: 850;
          line-height: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          animation: about-5w-readout-pulse 3.2s ease-in-out infinite;
        }

        .about-5w-readout span:nth-child(2) {
          animation-delay: 0.18s;
        }

        .about-5w-readout span:nth-child(3) {
          animation-delay: 0.36s;
        }

        .about-5w-readout b {
          color: var(--tone);
          font-size: 0.5rem;
          font-weight: 950;
        }

        .about-5w-skill-stack {
          position: relative;
          display: grid;
          min-height: 0;
          min-width: 0;
          gap: 0.42rem;
          border: 1px solid rgba(163, 230, 53, 0.28);
          border-radius: 14px;
          padding: 0.58rem 0.72rem 0.62rem;
          background:
            radial-gradient(circle at 8% 0%, rgba(163, 230, 53, 0.12), transparent 34%),
            radial-gradient(circle at 92% 100%, rgba(192, 132, 252, 0.1), transparent 40%),
            rgba(10, 18, 24, 0.18);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            0 10px 18px rgba(0, 0, 0, 0.14);
          transform: translateY(-0.08rem);
          transition:
            transform 0.18s ease,
            border-color 0.18s ease,
            box-shadow 0.18s ease;
        }

        .about-5w-skill-stack::before {
          content: "";
          pointer-events: none;
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background:
            radial-gradient(circle at 4% 50%, rgba(163, 230, 53, 0.22), transparent 18%),
            linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.1), transparent);
          opacity: 0.5;
          animation: about-5w-stack-glow 4.8s ease-in-out infinite;
        }

        .about-5w-skill-stack:hover {
          border-color: rgba(163, 230, 53, 0.4);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 12px 22px rgba(163, 230, 53, 0.08);
          transform: translateY(-0.18rem);
        }

        .about-5w-skill-stack strong {
          color: var(--about-lime);
          font-size: 0.64rem;
          font-weight: 950;
          line-height: 1;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .about-5w-skill-rails {
          display: grid;
          min-width: 0;
          gap: 0.36rem;
        }

        .about-5w-skill-row {
          position: relative;
          display: block;
          min-width: 0;
          min-height: 1.72rem;
          overflow: hidden;
          border: 1px solid rgba(34, 211, 238, 0.28);
          border-radius: 999px;
          padding: 0.22rem 0;
          background:
            linear-gradient(90deg, rgba(163, 230, 53, 0.1), transparent 18%, transparent 82%, rgba(192, 132, 252, 0.11)),
            rgba(4, 13, 18, 0.22);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }

        .about-5w-skill-track {
          display: inline-flex;
          width: max-content;
          min-width: max-content;
          align-items: center;
          gap: 0.5rem;
          padding-inline: 0.55rem;
          animation: about-5w-skill-marquee 18s linear infinite;
        }

        .about-5w-skill-row:nth-child(2) {
          border-color: rgba(163, 230, 53, 0.28);
        }

        .about-5w-skill-row:nth-child(2) .about-5w-skill-track {
          animation-direction: reverse;
          animation-duration: 17s;
        }

        .about-5w-skill-stack:hover .about-5w-skill-track,
        .about-5w-skill-stack:focus-within .about-5w-skill-track {
          animation-play-state: paused;
        }

        .about-5w-skill-stack b {
          flex: 0 0 auto;
          border: 1px solid rgba(34, 211, 238, 0.24);
          border-radius: 999px;
          padding: 0.32rem 0.68rem;
          background:
            radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.12), transparent 42%),
            rgba(34, 211, 238, 0.12);
          color: var(--about-text);
          font-size: 0.64rem;
          font-weight: 900;
          line-height: 1;
          text-transform: uppercase;
          white-space: nowrap;
          transition:
            transform 0.18s ease,
            border-color 0.18s ease,
            color 0.18s ease,
            background 0.18s ease;
          animation: about-5w-chip-float 2.8s ease-in-out infinite;
        }

        .about-5w-skill-stack b:nth-child(3n + 2) {
          animation-delay: 0.16s;
        }

        .about-5w-skill-stack b:nth-child(3n + 3) {
          animation-delay: 0.32s;
        }

        .about-5w-skill-stack b:hover {
          border-color: rgba(251, 191, 36, 0.46);
          background: rgba(251, 191, 36, 0.1);
          color: var(--about-gold);
          transform: translateY(-1px) scale(1.035);
        }

        .about-5w-proof-strip {
          display: grid;
          gap: 0.42rem;
        }

        .about-5w-proof-strip {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .about-5w-proof-strip span {
          display: grid;
          align-content: center;
          min-width: 0;
          border: 1px solid color-mix(in srgb, var(--tone) 36%, transparent);
          border-radius: 11px;
          padding: 0.44rem 0.38rem;
          background:
            radial-gradient(circle at 92% 8%, color-mix(in srgb, var(--tone) 22%, transparent), transparent 48%),
            linear-gradient(135deg, color-mix(in srgb, var(--tone) 12%, transparent), rgba(255, 255, 255, 0.035));
          text-align: center;
          transition:
            transform 0.18s ease,
            border-color 0.18s ease,
            box-shadow 0.18s ease;
        }

        .about-5w-proof-strip span:hover {
          border-color: color-mix(in srgb, var(--tone) 62%, transparent);
          box-shadow: 0 10px 18px color-mix(in srgb, var(--tone) 9%, transparent);
          transform: translateY(-2px) scale(1.035);
        }

        .about-5w-proof-strip b {
          color: var(--tone);
          font-size: clamp(1rem, 1.65vw, 1.36rem);
          font-weight: 950;
          line-height: 1;
        }

        .about-5w-proof-strip em {
          margin-top: 0.24rem;
          color: var(--about-muted);
          font-size: 0.54rem;
          font-style: normal;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1.1;
          text-transform: uppercase;
        }

        .about-5w-portrait {
          border-color: rgba(34, 211, 238, 0.32);
        }

        .about-5w-portrait-image {
          object-fit: cover;
          object-position: center 20%;
          transition: transform 0.42s ease;
        }

        .about-5w-portrait:hover .about-5w-portrait-image {
          transform: scale(1.032);
        }

        .about-5w-portrait-shine {
          pointer-events: none;
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(0, 0, 0, 0.04), transparent 45%, rgba(0, 0, 0, 0.54)),
            linear-gradient(115deg, transparent 28%, rgba(255, 255, 255, 0.14) 46%, transparent 62%);
          background-size: auto, 220% 220%;
          animation: about-5w-shine 5.4s ease-in-out infinite;
        }

        .about-portrait-rails {
          pointer-events: none;
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-rows: auto minmax(0, 1fr) auto;
          padding: 0.72rem;
        }

        .about-portrait-rail {
          position: relative;
          display: block;
          min-width: 0;
          overflow: hidden;
          border: 1px solid rgba(34, 211, 238, 0.3);
          border-radius: 999px;
          padding: 0.22rem 0;
          background:
            linear-gradient(90deg, rgba(0, 0, 0, 0.46), rgba(34, 211, 238, 0.12), rgba(0, 0, 0, 0.42)),
            rgba(0, 0, 0, 0.22);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.14),
            0 12px 24px rgba(0, 0, 0, 0.24);
          backdrop-filter: blur(12px);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }

        .about-portrait-rail-1 {
          grid-row: 1;
        }

        .about-portrait-rail-2 {
          grid-row: 3;
          border-color: rgba(251, 191, 36, 0.34);
          background:
            linear-gradient(90deg, rgba(0, 0, 0, 0.5), rgba(251, 191, 36, 0.13), rgba(192, 132, 252, 0.12), rgba(0, 0, 0, 0.42)),
            rgba(0, 0, 0, 0.22);
        }

        .about-portrait-track {
          display: inline-flex;
          width: max-content;
          min-width: max-content;
          align-items: center;
          gap: 0.48rem;
          padding-inline: 0.54rem;
          animation: about-5w-skill-marquee 18s linear infinite;
        }

        .about-portrait-rail-2 .about-portrait-track {
          animation-direction: reverse;
          animation-duration: 20s;
        }

        .about-5w-portrait:hover .about-portrait-track,
        .about-5w-portrait:focus-within .about-portrait-track {
          animation-play-state: paused;
        }

        .about-portrait-track b {
          flex: 0 0 auto;
          border: 1px solid rgba(34, 211, 238, 0.26);
          border-radius: 999px;
          padding: 0.34rem 0.62rem;
          background:
            radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.14), transparent 42%),
            rgba(34, 211, 238, 0.12);
          color: rgba(255, 255, 255, 0.88);
          font-size: 0.58rem;
          font-weight: 950;
          line-height: 1;
          text-transform: uppercase;
          white-space: nowrap;
          text-shadow: 0 0 10px rgba(34, 211, 238, 0.22);
        }

        .about-portrait-rail-2 b {
          border-color: rgba(251, 191, 36, 0.32);
          background:
            radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.14), transparent 42%),
            rgba(251, 191, 36, 0.13);
          color: rgba(255, 246, 220, 0.92);
          text-shadow: 0 0 10px rgba(251, 191, 36, 0.22);
        }

        .about-5w-card h2 {
          display: inline-flex;
          align-items: center;
          gap: 0.48rem;
          margin: 0;
          color: var(--about-cyan);
          font-size: 0.62rem;
          font-weight: 950;
          letter-spacing: 0;
          line-height: 1;
          text-transform: uppercase;
        }

        .about-5w-card h2 svg {
          flex: 0 0 auto;
          filter: drop-shadow(0 0 9px rgba(34, 211, 238, 0.32));
          transition:
            transform 0.18s ease,
            color 0.18s ease,
            filter 0.18s ease;
        }

        .about-5w-card:hover h2 svg,
        .about-5w-card:focus-within h2 svg {
          color: var(--about-gold);
          filter: drop-shadow(0 0 12px rgba(251, 191, 36, 0.34));
          transform: rotate(-8deg) scale(1.08);
        }

        .about-5w-craft,
        .about-5w-timeline,
        .about-5w-study {
          display: flex;
          flex-direction: column;
          padding: clamp(0.58rem, 0.86vw, 0.74rem);
          transform-style: preserve-3d;
        }

        .about-5w-craft {
          border-color: rgba(34, 211, 238, 0.42);
          background:
            linear-gradient(rgba(34, 211, 238, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(45, 212, 191, 0.035) 1px, transparent 1px),
            radial-gradient(circle at 16% 18%, rgba(34, 211, 238, 0.18), transparent 36%),
            radial-gradient(circle at 88% 82%, rgba(163, 230, 53, 0.1), transparent 38%),
            linear-gradient(145deg, rgba(8, 47, 73, 0.44), rgba(15, 23, 42, 0.3));
          background-size: 16px 16px, 16px 16px, auto, auto, auto;
        }

        .about-5w-timeline {
          border-color: rgba(251, 191, 36, 0.4);
          background:
            linear-gradient(rgba(251, 191, 36, 0.032) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.03) 1px, transparent 1px),
            radial-gradient(circle at 88% 16%, rgba(251, 191, 36, 0.18), transparent 38%),
            radial-gradient(circle at 16% 88%, rgba(34, 211, 238, 0.1), transparent 42%),
            linear-gradient(145deg, rgba(67, 20, 7, 0.38), rgba(15, 23, 42, 0.34));
          background-size: 16px 16px, 16px 16px, auto, auto, auto;
        }

        .about-5w-study {
          border-color: rgba(192, 132, 252, 0.42);
          background:
            linear-gradient(rgba(192, 132, 252, 0.034) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.028) 1px, transparent 1px),
            radial-gradient(circle at 86% 12%, rgba(192, 132, 252, 0.2), transparent 40%),
            radial-gradient(circle at 12% 90%, rgba(34, 211, 238, 0.12), transparent 44%),
            linear-gradient(145deg, rgba(46, 16, 101, 0.34), rgba(15, 23, 42, 0.34));
          background-size: 16px 16px, 16px 16px, auto, auto, auto;
        }

        .about-5w-craft::before,
        .about-5w-timeline::before,
        .about-5w-study::before {
          background:
            radial-gradient(circle at 14% 28%, rgba(34, 211, 238, 0.16), transparent 22%),
            radial-gradient(circle at 78% 68%, rgba(163, 230, 53, 0.08), transparent 26%);
          opacity: 0.62;
          animation: about-5w-panel-aura 6s ease-in-out infinite;
        }

        .about-5w-study::after,
        .about-5w-craft::after,
        .about-5w-timeline::after {
          content: "";
          pointer-events: none;
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(115deg, transparent 20%, rgba(255, 255, 255, 0.08) 42%, transparent 62%);
          opacity: 0;
          transform: translateX(-42%);
          transition: opacity 0.18s ease;
        }

        .about-5w-study:hover::after,
        .about-5w-craft:hover::after,
        .about-5w-timeline:hover::after {
          opacity: 0.66;
          animation: about-5w-panel-shine 0.92s ease-out 1;
        }

        .about-5w-craft > div,
        .about-5w-timeline > div,
        .about-5w-study-grid {
          display: grid;
          flex: 1 1 auto;
          align-content: stretch;
          gap: clamp(0.4rem, 0.58vh, 0.5rem);
          margin-top: 0.56rem;
        }

        .about-5w-craft article,
        .about-5w-timeline article,
        .about-5w-study-grid article {
          position: relative;
          display: grid;
          min-width: 0;
          min-height: clamp(3.04rem, 5.25vh, 3.52rem);
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          gap: clamp(0.48rem, 0.72vw, 0.62rem);
          border: 1px solid color-mix(in srgb, var(--tone) 34%, transparent);
          border-radius: 0.9rem;
          padding:
            clamp(0.48rem, 0.66vw, 0.58rem)
            clamp(0.54rem, 0.72vw, 0.66rem);
          background:
            radial-gradient(circle at 92% 12%, color-mix(in srgb, var(--tone) 18%, transparent), transparent 48%),
            linear-gradient(135deg, color-mix(in srgb, var(--tone) 16%, transparent), rgba(255, 255, 255, 0.04));
          transition:
            transform 0.18s ease,
            border-color 0.18s ease,
            background 0.18s ease,
            box-shadow 0.18s ease;
        }

        .about-5w-craft article:hover,
        .about-5w-timeline article:hover,
        .about-5w-study-grid article:hover {
          border-color: color-mix(in srgb, var(--tone) 62%, transparent);
          background:
            radial-gradient(circle at 92% 12%, color-mix(in srgb, var(--tone) 26%, transparent), transparent 48%),
            rgba(255, 255, 255, 0.055);
          box-shadow:
            inset 0 0 18px color-mix(in srgb, var(--tone) 10%, transparent),
            0 14px 26px color-mix(in srgb, var(--tone) 10%, transparent);
          transform: translateY(-2px) translateZ(0.2rem) scale(1.01);
        }

        .about-5w-mini-copy {
          display: grid;
          grid-column: 1;
          grid-row: 1;
          min-width: 0;
          gap: 0.12rem;
          padding-left: 0;
        }

        .about-5w-mini-icon {
          display: inline-flex;
          grid-column: 2;
          grid-row: 1;
          align-items: center;
          justify-content: center;
          justify-self: end;
          width: clamp(2.04rem, 2.44vw, 2.3rem);
          height: clamp(2.04rem, 2.44vw, 2.3rem);
          border: 1px solid color-mix(in srgb, var(--tone) 26%, transparent);
          border-radius: 0.74rem;
          background:
            radial-gradient(circle at 34% 22%, rgba(255, 255, 255, 0.18), transparent 38%),
            linear-gradient(135deg, color-mix(in srgb, var(--tone) 22%, transparent), rgba(255, 255, 255, 0.04));
          color: var(--tone);
          transition:
            transform 0.18s ease,
            filter 0.18s ease,
            border-color 0.18s ease;
        }

        .about-5w-mini-icon svg,
        .about-5w-timeline article small {
          transition:
            transform 0.18s ease,
            filter 0.18s ease;
        }

        .about-5w-craft article:hover .about-5w-mini-icon,
        .about-5w-timeline article:hover .about-5w-mini-icon,
        .about-5w-study-grid article:hover .about-5w-mini-icon {
          border-color: color-mix(in srgb, var(--tone) 48%, transparent);
          filter: drop-shadow(0 0 8px color-mix(in srgb, var(--tone) 45%, transparent));
          transform: rotate(-8deg) scale(1.08);
        }

        .about-5w-timeline article:hover small {
          filter: drop-shadow(0 0 8px color-mix(in srgb, var(--tone) 45%, transparent));
          transform: translateX(0.12rem);
        }

        .about-5w-craft strong,
        .about-5w-craft em,
        .about-5w-timeline small,
        .about-5w-timeline strong,
        .about-5w-timeline em,
        .about-5w-study-grid strong,
        .about-5w-study-grid em {
          display: block;
          min-width: 0;
        }

        .about-5w-craft strong,
        .about-5w-timeline strong,
        .about-5w-study-grid strong {
          color: var(--about-text);
          font-size: clamp(0.68rem, 0.82vw, 0.78rem);
          font-weight: 950;
          line-height: 1.08;
        }

        .about-5w-craft em,
        .about-5w-timeline em,
        .about-5w-study-grid em {
          margin-top: 0.14rem;
          color: var(--about-muted);
          font-size: clamp(0.48rem, 0.58vw, 0.55rem);
          font-style: normal;
          font-weight: 740;
          line-height: 1.15;
        }

        .about-5w-timeline small {
          color: var(--tone);
          font-size: 0.5825rem;
          font-weight: 950;
          letter-spacing: 0;
          line-height: 1;
          text-transform: uppercase;
        }

        .about-5w-study > .about-5w-rolebar {
          display: inline-flex;
          width: 100%;
          align-items: center;
          justify-content: center;
          gap: 0.38rem;
          margin-top: 0.56rem;
          border: 1px solid rgba(192, 132, 252, 0.3);
          border-radius: 999px;
          padding: 0.38rem 0.52rem;
          background:
            linear-gradient(90deg, rgba(34, 211, 238, 0.08), rgba(251, 191, 36, 0.07), rgba(192, 132, 252, 0.08)),
            rgba(192, 132, 252, 0.06);
          color: var(--about-violet);
          font-size: 0.58rem;
          font-weight: 900;
          line-height: 1;
          transition:
            transform 0.18s ease,
            border-color 0.18s ease,
            background 0.18s ease;
        }

        .about-5w-study > .about-5w-rolebar:hover {
          border-color: rgba(192, 132, 252, 0.54);
          background: rgba(192, 132, 252, 0.13);
          transform: translateY(-1px);
        }

        .about-5w-light .about-5w-card,
        .about-5w-light .about-5w-portrait {
          border-color: rgba(14, 165, 233, 0.2);
          background:
            radial-gradient(circle at 92% 12%, rgba(163, 230, 53, 0.09), transparent 38%),
            radial-gradient(circle at 8% 92%, rgba(34, 211, 238, 0.1), transparent 42%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(241, 253, 253, 0.74));
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.72),
            0 14px 28px rgba(8, 145, 178, 0.08);
        }

        .about-5w-light .about-5w-card::before {
          background:
            linear-gradient(115deg, rgba(34, 211, 238, 0.1), transparent 36%, rgba(163, 230, 53, 0.08)),
            radial-gradient(circle at 14% 20%, rgba(255, 255, 255, 0.52), transparent 30%);
          opacity: 0.82;
        }

        .about-5w-light .about-5w-main {
          border-color: rgba(14, 165, 233, 0.26);
          background:
            linear-gradient(rgba(34, 211, 238, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(163, 230, 53, 0.045) 1px, transparent 1px),
            radial-gradient(circle at 12% 14%, rgba(34, 211, 238, 0.13), transparent 36%),
            radial-gradient(circle at 84% 10%, rgba(250, 204, 21, 0.075), transparent 38%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(240, 253, 250, 0.72));
          background-size: 16px 16px, 16px 16px, auto, auto, auto;
        }

        .about-5w-light .about-5w-actions a,
        .about-5w-light .about-5w-tabs button,
        .about-5w-light .about-5w-tab-trigger {
          border-color: rgba(14, 165, 233, 0.3);
          background:
            linear-gradient(135deg, rgba(224, 247, 250, 0.78), rgba(255, 255, 255, 0.66));
          color: rgba(41, 49, 54, 0.88);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.68);
        }

        .about-5w-light .about-5w-tabs button.is-active {
          border-color: color-mix(in srgb, var(--tone) 74%, rgba(255, 255, 255, 0.08));
          background:
            radial-gradient(circle at 90% 10%, color-mix(in srgb, var(--tone) 20%, transparent), transparent 48%),
            color-mix(in srgb, var(--tone) 13%, rgba(255, 255, 255, 0.68));
          box-shadow:
            inset 0 0 0 1px color-mix(in srgb, var(--tone) 14%, transparent),
            0 8px 16px color-mix(in srgb, var(--tone) 14%, transparent);
        }

        .about-5w-light .about-5w-kicker {
          border-color: rgba(73, 57, 41, 0.16);
          background: rgba(255, 255, 255, 0.92);
          color: rgb(93, 76, 58);
          box-shadow: none;
        }

        .about-5w-light .about-5w-answer,
        .about-5w-light .about-5w-answer-copy {
          border-color: color-mix(in srgb, var(--tone) 38%, rgba(14, 165, 233, 0.16));
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.62),
            0 10px 20px rgba(8, 145, 178, 0.07);
        }

        .about-5w-light .about-5w-answer-copy {
          background:
            linear-gradient(90deg, color-mix(in srgb, var(--tone) 13%, transparent), transparent 36%),
            repeating-linear-gradient(180deg, rgba(14, 165, 233, 0.052) 0 1px, transparent 1px 8px),
            rgba(255, 255, 255, 0.72);
        }

        .about-5w-light .about-5w-typeword {
          border-color: color-mix(in srgb, var(--tone) 44%, rgba(14, 165, 233, 0.12));
          background:
            radial-gradient(circle at 50% 18%, color-mix(in srgb, var(--tone) 22%, transparent), transparent 46%),
            repeating-linear-gradient(180deg, rgba(14, 165, 233, 0.055) 0 1px, transparent 1px 6px),
            rgba(255, 255, 255, 0.74);
          text-shadow:
            0 0 12px color-mix(in srgb, var(--tone) 24%, transparent),
            0 0 24px rgba(255, 255, 255, 0.54);
        }

        .about-5w-light .about-5w-answer p {
          color: rgba(29, 38, 46, 0.86);
          text-shadow:
            0 0 10px rgba(255, 255, 255, 0.72),
            0 0 12px color-mix(in srgb, var(--tone) 10%, transparent);
        }

        .about-5w-light .about-5w-answer-mark,
        .about-5w-light .about-5w-readout b {
          color: color-mix(in srgb, var(--tone) 88%, #1f2933);
        }

        .about-5w-light .about-5w-skill-stack {
          border-color: rgba(163, 230, 53, 0.42);
          background:
            radial-gradient(circle at 8% 0%, rgba(163, 230, 53, 0.18), transparent 34%),
            radial-gradient(circle at 92% 100%, rgba(192, 132, 252, 0.12), transparent 40%),
            rgba(240, 253, 250, 0.7);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.52),
            0 10px 18px rgba(8, 145, 178, 0.07);
        }

        .about-5w-light .about-5w-skill-row {
          border-color: rgba(14, 165, 233, 0.34);
          background:
            linear-gradient(90deg, rgba(163, 230, 53, 0.14), transparent 18%, transparent 82%, rgba(192, 132, 252, 0.11)),
            rgba(255, 255, 255, 0.58);
        }

        .about-5w-light .about-5w-skill-stack b,
        .about-5w-light .about-5w-readout span {
          border-color: rgba(14, 165, 233, 0.34);
          background: rgba(224, 247, 250, 0.78);
          color: rgba(25, 45, 50, 0.9);
        }

        .about-5w-light .about-portrait-rail {
          background:
            linear-gradient(90deg, rgba(255, 255, 255, 0.76), rgba(34, 211, 238, 0.22), rgba(255, 255, 255, 0.68)),
            rgba(255, 255, 255, 0.46);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.46),
            0 12px 24px rgba(109, 86, 54, 0.12);
        }

        .about-5w-light .about-portrait-rail-2 {
          background:
            linear-gradient(90deg, rgba(255, 255, 255, 0.76), rgba(250, 204, 21, 0.18), rgba(192, 132, 252, 0.14), rgba(255, 255, 255, 0.68)),
            rgba(255, 255, 255, 0.46);
        }

        .about-5w-light .about-portrait-track b {
          color: rgba(34, 34, 40, 0.86);
          background: rgba(255, 255, 255, 0.7);
          text-shadow: none;
        }

        .about-5w-light .about-5w-craft,
        .about-5w-light .about-5w-timeline,
        .about-5w-light .about-5w-study {
          border-color: rgba(14, 165, 233, 0.24);
          background:
            linear-gradient(rgba(34, 211, 238, 0.052) 1px, transparent 1px),
            linear-gradient(90deg, rgba(163, 230, 53, 0.04) 1px, transparent 1px),
            radial-gradient(circle at 18% 16%, rgba(34, 211, 238, 0.15), transparent 36%),
            radial-gradient(circle at 88% 82%, rgba(250, 204, 21, 0.1), transparent 38%),
            linear-gradient(145deg, rgba(255, 255, 255, 0.82), rgba(236, 253, 245, 0.64));
          background-size: 16px 16px, 16px 16px, auto, auto, auto;
        }

        .about-5w-light .about-5w-craft article,
        .about-5w-light .about-5w-timeline article,
        .about-5w-light .about-5w-study-grid article {
          border-color: color-mix(in srgb, var(--tone) 42%, rgba(14, 165, 233, 0.12));
          background:
            radial-gradient(circle at 92% 12%, color-mix(in srgb, var(--tone) 18%, transparent), transparent 48%),
            linear-gradient(135deg, color-mix(in srgb, var(--tone) 13%, transparent), rgba(255, 255, 255, 0.62));
          color: rgba(30, 32, 34, 0.92);
        }

        .about-5w-light .about-5w-mini-icon {
          border-color: color-mix(in srgb, var(--tone) 38%, rgba(14, 165, 233, 0.1));
          background:
            radial-gradient(circle at 34% 22%, rgba(255, 255, 255, 0.58), transparent 38%),
            linear-gradient(135deg, color-mix(in srgb, var(--tone) 22%, transparent), rgba(255, 255, 255, 0.66));
        }

        .about-5w-light .about-5w-rolebar {
          background:
            linear-gradient(90deg, rgba(34, 211, 238, 0.12), rgba(163, 230, 53, 0.1), rgba(192, 132, 252, 0.12)),
            rgba(255, 255, 255, 0.58);
          color: rgba(76, 29, 149, 0.82);
        }

        .about-5w-tone-cyan {
          --tone: var(--about-cyan);
        }

        .about-5w-tone-lime {
          --tone: var(--about-lime);
        }

        .about-5w-tone-gold {
          --tone: var(--about-gold);
        }

        .about-5w-tone-violet {
          --tone: var(--about-violet);
        }

        @keyframes about-5w-shine {
          0%,
          42% {
            background-position: 0 0, 0% 0%;
          }
          100% {
            background-position: 0 0, 100% 100%;
          }
        }

        @keyframes about-5w-panel-aura {
          0%,
          100% {
            opacity: 0.42;
            transform: translate3d(0, 0, 0);
          }
          50% {
            opacity: 0.72;
            transform: translate3d(0.18rem, -0.14rem, 0);
          }
        }

        @keyframes about-5w-surface-pulse {
          0%,
          100% {
            opacity: 0.34;
            transform: translate3d(0, 0, 0);
          }
          50% {
            opacity: 0.62;
            transform: translate3d(0.22rem, -0.16rem, 0);
          }
        }

        @keyframes about-5w-word-hum {
          0%,
          100% {
            filter: brightness(1);
            transform: translateY(0);
          }
          50% {
            filter: brightness(1.18);
            transform: translateY(-0.08rem);
          }
        }

        @keyframes about-5w-letter-pulse {
          0%,
          100% {
            filter: brightness(1);
            transform: translateY(0);
          }
          50% {
            filter: brightness(1.16);
            transform: translateY(-0.035em);
          }
        }

        @keyframes about-5w-letter-pop {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          32% {
            transform: translateY(-0.09em) scale(1.08) rotate(-1deg);
          }
          62% {
            transform: translateY(0.02em) scale(0.98) rotate(0.6deg);
          }
        }

        @keyframes about-5w-word-scan {
          0%,
          100% {
            opacity: 0.24;
            transform: translateX(-54%);
          }
          50% {
            opacity: 0.72;
            transform: translateX(54%);
          }
        }

        @keyframes about-5w-diamond-shake {
          0%,
          100% {
            transform: translateY(-1px) rotate(-0.35deg) scale(1);
          }
          18% {
            transform: translateY(-1px) rotate(0.85deg) scale(1.012);
          }
          36% {
            transform: translateY(-2px) rotate(-0.75deg) scale(1.018);
          }
          58% {
            transform: translateY(-1px) rotate(0.45deg) scale(1.01);
          }
          78% {
            transform: translateY(-1px) rotate(-0.25deg) scale(1.006);
          }
        }

        @keyframes about-5w-diamond-sparkle {
          0% {
            filter: brightness(1);
            transform: translateX(-68%) scale(0.96);
          }
          34% {
            filter: brightness(1.75);
            transform: translateX(-18%) scale(1.02);
          }
          100% {
            filter: brightness(1.1);
            transform: translateX(62%) scale(1);
          }
        }

        @keyframes about-5w-tab-glitch {
          0%,
          100% {
            clip-path: inset(0 0 0 0);
            transform: translateX(0.08rem);
          }
          38% {
            clip-path: inset(0 0 54% 0);
            transform: translateX(-0.08rem);
          }
          62% {
            clip-path: inset(48% 0 0 0);
            transform: translateX(0.12rem);
          }
        }

        @keyframes about-5w-tab-name-pulse {
          0%,
          100% {
            filter: brightness(1);
            transform: translateX(0);
          }
          46% {
            filter: brightness(1.16);
            transform: translateX(0.04rem);
          }
          52% {
            transform: translateX(-0.035rem);
          }
        }

        @keyframes about-5w-text-signal {
          0%,
          100% {
            transform: translateX(0);
            filter: brightness(1);
          }
          50% {
            transform: translateX(0.035rem);
            filter: brightness(1.08);
          }
        }

        @keyframes about-5w-text-glow {
          0%,
          100% {
            color: var(--about-muted);
          }
          50% {
            color: color-mix(in srgb, var(--about-text) 74%, var(--tone));
          }
        }

        @keyframes about-5w-readout-pulse {
          0%,
          100% {
            border-color: color-mix(in srgb, var(--tone) 24%, transparent);
            filter: brightness(1);
          }
          50% {
            border-color: color-mix(in srgb, var(--tone) 48%, transparent);
            filter: brightness(1.08);
          }
        }

        @keyframes about-5w-chip-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-0.05rem);
          }
        }

        @keyframes about-5w-stack-glow {
          0%,
          100% {
            opacity: 0.34;
            transform: translateX(-18%);
          }
          50% {
            opacity: 0.72;
            transform: translateX(18%);
          }
        }

        @keyframes about-5w-panel-shine {
          to {
            transform: translateX(42%);
          }
        }

        @keyframes about-5w-mobile-word-shine {
          0% {
            opacity: 0;
            transform: translateX(-110%);
          }
          18% {
            opacity: 0.72;
          }
          100% {
            opacity: 0;
            transform: translateX(110%);
          }
        }

        @keyframes about-5w-caret {
          0%,
          48% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }

        @keyframes about-5w-panel-scan {
          0%,
          100% {
            opacity: 0.2;
            transform: translateX(-42%);
          }
          50% {
            opacity: 0.52;
            transform: translateX(42%);
          }
        }

        @keyframes about-5w-skill-marquee {
          0%,
          8% {
            transform: translateX(0);
          }
          92%,
          100% {
            transform: translateX(-50%);
          }
        }

        @media (min-width: 1441px) {
          .about-5w-surface {
            padding: clamp(0.95rem, 1.12vw, 1.25rem);
          }

          .about-5w-layout,
          .about-5w-stage,
          .about-5w-bottom {
            gap: clamp(0.7rem, 0.86vw, 0.95rem);
          }

          .about-5w-stage {
            grid-template-columns: minmax(0, 1.24fr) minmax(22rem, 0.88fr);
          }

          .about-5w-bottom {
            grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr) minmax(0, 0.98fr);
          }

          .about-5w-topline h1 {
            font-size: clamp(2.6rem, 3.2vw, 3.35rem);
          }

          .about-5w-answer {
            min-height: clamp(9.8rem, 17.8vh, 11rem);
          }

          .about-5w-portrait {
            min-height: 0;
          }
        }

        @media (max-width: 1240px) {
          .about-5w-surface {
            padding: 0.78rem;
          }

          .about-5w-layout {
            grid-template-rows: auto minmax(0, 1.18fr) minmax(9.8rem, 0.72fr);
          }

          .about-5w-layout,
          .about-5w-stage,
          .about-5w-bottom {
            gap: 0.55rem;
          }

          .about-5w-topline h1 {
            font-size: clamp(1.7rem, 2.9vw, 2.5rem);
          }

          .about-5w-main,
          .about-5w-craft,
          .about-5w-timeline,
          .about-5w-study {
            padding: 0.64rem;
          }

          .about-5w-answer {
            padding: 0.64rem 0.72rem;
            min-height: 9rem;
          }

          .about-5w-answer-line {
            grid-template-columns: clamp(5.2rem, 8vw, 6.4rem) minmax(0, 1fr);
          }

          .about-5w-typeword {
            font-size: clamp(1rem, 1.95vw, 1.62rem);
          }

          .about-5w-answer h2 {
            font-size: clamp(1.16rem, 2.15vw, 1.8rem);
          }

          .about-5w-answer p {
            font-size: 0.8rem;
            line-height: 1.34;
          }

          .about-5w-readout span {
            font-size: 0.5rem;
            padding: 0.28rem 0.34rem;
          }

          .about-5w-proof-strip span {
            padding: 0.42rem 0.34rem;
          }

          .about-5w-skill-stack {
            padding: 0.5rem 0.58rem 0.54rem;
          }

          .about-5w-skill-track {
            gap: 0.34rem;
            animation-duration: 15s;
          }

          .about-5w-skill-stack b {
            font-size: 0.56rem;
            padding: 0.28rem 0.48rem;
          }

          .about-portrait-rails {
            padding: 0.64rem;
          }

          .about-portrait-track b {
            font-size: 0.52rem;
            padding: 0.3rem 0.5rem;
          }
        }

        @media (max-width: 1024px) {
          .about-5w-stage {
            grid-template-columns: minmax(0, 1.04fr) minmax(13.8rem, 0.96fr);
          }

          .about-5w-main {
            gap: 0.48rem;
          }

          .about-5w-actions a {
            min-height: 1.72rem;
            padding: 0.36rem 0.46rem;
            font-size: 0.54rem;
          }

          .about-5w-bottom {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .about-5w-tabs button {
            font-size: 0.62rem;
            min-height: 2rem;
            padding-inline: 0.28rem;
          }

          .about-5w-answer-line {
            grid-template-columns: clamp(4.8rem, 7vw, 5.8rem) minmax(0, 1fr);
          }

          .about-5w-readout {
            gap: 0.28rem;
          }

          .about-5w-topline h1 {
            font-size: clamp(1.82rem, 3.2vw, 2.55rem);
          }

          .about-5w-skill-stack {
            padding-inline: 0.48rem;
          }

          .about-5w-skill-stack b {
            font-size: 0.54rem;
            padding-inline: 0.42rem;
          }

          .about-5w-craft strong,
          .about-5w-timeline strong {
            font-size: 0.7rem;
          }

          .about-5w-craft em,
          .about-5w-timeline em,
          .about-5w-study-grid em {
            font-size: 0.6rem;
          }

          .about-5w-craft article,
          .about-5w-timeline article,
          .about-5w-study-grid article {
            min-height: 3rem;
            padding: 0.46rem 0.5rem;
          }
        }

        @media (max-width: 768px) {
          .about-5w-frame {
            height: calc(var(--app-height) - 11.9rem);
            min-height: 0;
            align-items: stretch;
            overflow: hidden;
          }

          .about-5w-shell {
            height: 100%;
            min-height: 0;
            overflow: hidden;
          }

          .about-5w-surface {
            height: 100%;
            min-height: 0;
            overflow-x: hidden;
            overflow-y: auto;
            overscroll-behavior: contain;
            padding: 0.72rem 1.05rem 0.78rem 0.72rem;
            scrollbar-width: none;
          }

          .about-5w-surface::-webkit-scrollbar {
            display: none;
            width: 0;
          }

          .about-mobile-scroll-controller[data-visible="true"] {
            position: absolute;
            top: 1rem;
            right: 0.34rem;
            bottom: 1rem;
            z-index: 28;
            display: block;
            width: 0.46rem;
            overflow: hidden;
            border: 1px solid rgba(34, 211, 238, 0.2);
            border-radius: 999px;
            background: color-mix(in srgb, var(--color-bg) 86%, #164e63);
            box-shadow:
              inset 0 0 0 1px rgba(34, 211, 238, 0.06),
              0 0 0.32rem rgba(34, 211, 238, 0.08);
            cursor: ns-resize;
            opacity: 0.58;
            touch-action: none;
            transition:
              opacity 160ms ease,
              border-color 160ms ease,
              box-shadow 160ms ease;
          }

          .about-mobile-scroll-controller__thumb {
            position: absolute;
            top: var(--about-scroll-thumb-top);
            right: 0.06rem;
            left: 0.06rem;
            display: block;
            height: var(--about-scroll-thumb-size);
            min-height: 2.15rem;
            max-height: 18%;
            border-radius: 999px;
            background: linear-gradient(180deg, #67e8f9 0%, #38bdf8 52%, #a3e635 100%);
            box-shadow:
              inset 0 0 0 1px rgba(255, 255, 255, 0.24),
              0 0 0.28rem rgba(34, 211, 238, 0.28);
            pointer-events: none;
            transition:
              top 90ms linear,
              box-shadow 170ms ease,
              filter 170ms ease;
          }

          .about-mobile-scroll-controller:hover,
          .about-mobile-scroll-controller:focus-visible {
            border-color: rgba(34, 211, 238, 0.34);
            opacity: 0.86;
            outline: none;
            box-shadow:
              inset 0 0 0 1px rgba(34, 211, 238, 0.12),
              0 0 0.42rem rgba(34, 211, 238, 0.16);
          }

          .about-mobile-scroll-controller:hover .about-mobile-scroll-controller__thumb,
          .about-mobile-scroll-controller:focus-visible .about-mobile-scroll-controller__thumb {
            filter: brightness(1.08) saturate(1.08);
            box-shadow:
              inset 0 0 0 1px rgba(255, 255, 255, 0.3),
              0 0 0.38rem rgba(34, 211, 238, 0.4);
          }

          .about-5w-light .about-mobile-scroll-controller[data-visible="true"] {
            border-color: rgba(8, 145, 178, 0.3);
            background: rgba(224, 247, 250, 0.72);
            box-shadow:
              inset 0 0 0 1px rgba(255, 255, 255, 0.72),
              0 0 0.3rem rgba(8, 145, 178, 0.1);
          }

          .about-5w-layout {
            height: auto;
            min-height: 100%;
            gap: 0.62rem;
          }

          .about-5w-layout,
          .about-5w-stage,
          .about-5w-bottom {
            grid-template-columns: minmax(0, 1fr);
            grid-template-rows: none;
          }

          .about-5w-portrait {
            min-height: clamp(17.5rem, 48vw, 22rem);
            order: -1;
          }

          .about-5w-answer {
            height: auto;
            min-height: 10.25rem;
          }

          .about-5w-answer-line {
            grid-template-columns: minmax(0, 1fr);
          }

          .about-5w-typeword {
            font-size: 2.15rem;
            min-height: 4.4rem;
          }

          .about-5w-answer-copy {
            min-height: 6.1rem;
          }

          .about-5w-readout {
            grid-template-columns: minmax(0, 1fr);
          }

          .about-5w-skill-row {
            mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
            -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
          }

          .about-portrait-rails {
            padding: 0.62rem;
          }

          .about-portrait-rail {
            mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
            -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
          }

          .about-5w-topline {
            grid-template-columns: minmax(0, 1fr) auto;
          }

          .about-5w-actions {
            justify-content: flex-end;
            flex-wrap: nowrap;
            justify-self: end;
            max-width: none;
            padding-top: 0;
          }

          .about-5w-main,
          .about-5w-craft,
          .about-5w-timeline,
          .about-5w-study {
            padding: 0.68rem;
          }

          .about-5w-bottom {
            gap: 0.58rem;
          }

          .about-5w-craft article,
          .about-5w-timeline article,
          .about-5w-study-grid article {
            min-height: 3.15rem;
          }
        }

        @media (max-width: 425px) {
          .about-5w-surface {
            padding: 0.58rem 0.82rem 0.68rem 0.58rem;
          }

          .about-5w-layout,
          .about-5w-stage,
          .about-5w-bottom {
            gap: 0.5rem;
          }

          .about-5w-kicker {
            max-width: 100%;
            padding: 0.32rem 0.62rem;
            font-size: 0.56rem;
          }

          .about-5w-main {
            gap: 0.42rem;
          }

          .about-5w-topline {
            grid-template-columns: minmax(0, 1fr);
            gap: 0.42rem;
          }

          .about-5w-topline h1 {
            font-size: 2rem;
          }

          .about-5w-topline h1 {
            white-space: normal;
          }

          .about-5w-actions {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 0.28rem;
            justify-self: stretch;
          }

          .about-5w-actions a {
            width: 100%;
            min-height: 1.88rem;
            padding-inline: 0.34rem;
          }

          .about-5w-actions .about-5w-linkedin-action {
            width: 100%;
          }

          .about-5w-tabs-wrap {
            position: relative;
            z-index: 12;
            gap: 0;
          }

          .about-5w-tab-trigger {
            display: none;
          }

          .about-5w-tabs {
            display: none;
          }

          .about-5w-answer {
            display: none;
          }

          .about-5w-mobile-accordion {
            display: grid;
            gap: 0.36rem;
          }

          .about-5w-mobile-item {
            display: grid;
            min-width: 0;
            gap: 0.34rem;
          }

          .about-5w-mobile-tab {
            display: grid;
            grid-template-columns: auto minmax(0, 1fr) auto auto;
            align-items: center;
            min-height: 2.16rem;
            gap: 0.42rem;
            border: 1px solid rgba(34, 211, 238, 0.28);
            border-radius: 999px;
            padding: 0.48rem 0.62rem;
            background:
              linear-gradient(135deg, rgba(34, 211, 238, 0.13), rgba(163, 230, 53, 0.06)),
              rgba(255, 255, 255, 0.035);
            color: var(--tone);
            cursor: pointer;
            font-size: 0.62rem;
            font-weight: 950;
            letter-spacing: 0.06em;
            line-height: 1;
            text-align: left;
            text-transform: uppercase;
            transition:
              transform 0.18s ease,
              border-color 0.18s ease,
              background 0.18s ease,
              box-shadow 0.18s ease;
          }

          .about-5w-mobile-tab::after {
            content: attr(data-signal);
            justify-self: end;
            color: color-mix(in srgb, var(--tone) 54%, transparent);
            font-size: 0.48rem;
            font-weight: 950;
            line-height: 1;
          }

          .about-5w-mobile-tab svg:last-child {
            transition: transform 0.18s ease;
          }

          .about-5w-mobile-item.is-active .about-5w-mobile-tab {
            border-color: color-mix(in srgb, var(--tone) 72%, transparent);
            background:
              radial-gradient(circle at 12% 50%, color-mix(in srgb, var(--tone) 22%, transparent), transparent 48%),
              linear-gradient(135deg, rgba(34, 211, 238, 0.18), rgba(251, 191, 36, 0.12));
            box-shadow:
              inset 0 0 0 1px color-mix(in srgb, var(--tone) 16%, transparent),
              0 0.7rem 1.4rem color-mix(in srgb, var(--tone) 12%, transparent);
          }

          .about-5w-mobile-item.is-active .about-5w-mobile-tab svg:last-child {
            transform: rotate(180deg);
          }

          .about-5w-light .about-5w-mobile-tab {
            border-color: rgba(14, 165, 233, 0.38);
            background:
              linear-gradient(135deg, rgba(224, 247, 250, 0.92), rgba(240, 253, 244, 0.82)),
              rgba(255, 255, 255, 0.84);
            color: color-mix(in srgb, var(--tone) 86%, #1f2933);
          }

          .about-5w-mobile-tab:hover,
          .about-5w-mobile-tab:focus-visible {
            border-color: color-mix(in srgb, var(--tone) 74%, transparent);
            outline: none;
            transform: translateY(-1px);
          }

          .about-5w-mobile-answer {
            overflow: hidden;
            border: 1px solid color-mix(in srgb, var(--tone) 42%, transparent);
            border-radius: 16px;
            padding: 0.5rem;
            background:
              linear-gradient(90deg, color-mix(in srgb, var(--tone) 12%, transparent) 1px, transparent 1px),
              linear-gradient(180deg, color-mix(in srgb, var(--tone) 10%, transparent) 1px, transparent 1px),
              radial-gradient(circle at 10% 20%, color-mix(in srgb, var(--tone) 18%, transparent), transparent 42%),
              rgba(255, 255, 255, 0.04);
            background-size:
              1.1rem 1.1rem,
              1.1rem 1.1rem,
              auto,
              auto;
            box-shadow:
              inset 0 0 0 1px rgba(255, 255, 255, 0.045),
              0 0.8rem 1.5rem rgba(0, 0, 0, 0.18);
          }

          .about-5w-light .about-5w-mobile-answer {
            border-color: color-mix(in srgb, var(--tone) 46%, rgba(14, 165, 233, 0.12));
            background:
              linear-gradient(90deg, color-mix(in srgb, var(--tone) 13%, transparent) 1px, transparent 1px),
              linear-gradient(180deg, color-mix(in srgb, var(--tone) 11%, transparent) 1px, transparent 1px),
              radial-gradient(circle at 10% 20%, color-mix(in srgb, var(--tone) 20%, transparent), transparent 42%),
              rgba(248, 253, 255, 0.9);
            background-size:
              1.1rem 1.1rem,
              1.1rem 1.1rem,
              auto,
              auto;
            box-shadow:
              inset 0 0 0 1px rgba(255, 255, 255, 0.72),
              0 0.8rem 1.35rem rgba(44, 36, 28, 0.12);
          }

          .about-5w-mobile-word {
            display: flex;
            position: relative;
            min-height: 2.88rem;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            border: 1px solid color-mix(in srgb, var(--tone) 34%, transparent);
            border-radius: 12px;
            color: var(--tone);
            font-size: 1.56rem;
            font-weight: 950;
            letter-spacing: 0.04em;
            text-shadow: 0 0 1rem color-mix(in srgb, var(--tone) 34%, transparent);
            transition:
              transform 0.18s ease,
              border-color 0.18s ease,
              box-shadow 0.18s ease,
              filter 0.18s ease;
            animation: about-5w-typeword-flicker 2.4s ease-in-out infinite;
          }

          .about-5w-mobile-word::before,
          .about-5w-mobile-word::after {
            content: "";
            pointer-events: none;
            position: absolute;
            inset: 0;
            border-radius: inherit;
          }

          .about-5w-mobile-word::before {
            background:
              radial-gradient(circle at 22% 34%, color-mix(in srgb, var(--tone) 72%, transparent) 0 0.07rem, transparent 0.09rem),
              radial-gradient(circle at 78% 28%, rgba(255, 255, 255, 0.78) 0 0.06rem, transparent 0.08rem),
              radial-gradient(circle at 62% 76%, color-mix(in srgb, var(--tone) 58%, transparent) 0 0.06rem, transparent 0.08rem);
            opacity: 0;
            transform: scale(0.94);
            transition:
              opacity 0.18s ease,
              transform 0.18s ease;
          }

          .about-5w-mobile-word::after {
            background: linear-gradient(115deg, transparent 18%, rgba(255, 255, 255, 0.38) 45%, transparent 68%);
            opacity: 0;
            transform: translateX(-110%);
          }

          .about-5w-mobile-item.is-active:hover .about-5w-mobile-word,
          .about-5w-mobile-item.is-active:focus-within .about-5w-mobile-word {
            border-color: color-mix(in srgb, var(--tone) 58%, transparent);
            box-shadow:
              inset 0 0 16px color-mix(in srgb, var(--tone) 12%, transparent),
              0 0 16px color-mix(in srgb, var(--tone) 14%, transparent);
            filter: brightness(1.08);
            transform: translateY(-1px);
          }

          .about-5w-mobile-item.is-active:hover .about-5w-mobile-word::before,
          .about-5w-mobile-item.is-active:focus-within .about-5w-mobile-word::before {
            opacity: 1;
            transform: scale(1);
          }

          .about-5w-mobile-item.is-active:hover .about-5w-mobile-word::after,
          .about-5w-mobile-item.is-active:focus-within .about-5w-mobile-word::after {
            animation: about-5w-mobile-word-shine 0.7s ease-out;
          }

          .about-5w-mobile-item.is-active:has(.about-5w-mobile-tab:active)
            .about-5w-mobile-word {
            filter: brightness(1.16);
            transform: translateY(-1px) scale(0.992);
          }

          .about-5w-mobile-copy {
            display: grid;
            gap: 0.28rem;
            margin-top: 0.42rem;
            border: 1px solid color-mix(in srgb, var(--tone) 22%, transparent);
            border-radius: 12px;
            padding: 0.58rem 0.56rem;
            background: rgba(0, 0, 0, 0.12);
          }

          .about-5w-light .about-5w-mobile-copy {
            border-color: color-mix(in srgb, var(--tone) 32%, rgba(14, 165, 233, 0.1));
            background: rgba(255, 255, 255, 0.68);
          }

          .about-5w-light .about-5w-mobile-copy p {
            color: rgba(35, 32, 29, 0.86);
          }

          .about-5w-light .about-5w-mobile-readout b {
            border-color: color-mix(in srgb, var(--tone) 42%, rgba(14, 165, 233, 0.1));
            background: color-mix(in srgb, var(--tone) 12%, rgba(255, 255, 255, 0.72));
            color: color-mix(in srgb, var(--tone) 88%, #1f2933);
          }

          .about-5w-mobile-readout b {
            display: inline-flex;
            width: fit-content;
            align-items: center;
            gap: 0.3rem;
            border: 1px solid color-mix(in srgb, var(--tone) 34%, transparent);
            border-radius: 999px;
            padding: 0.26rem 0.44rem;
            color: var(--tone);
            font-size: 0.54rem;
            font-weight: 950;
            line-height: 1.05;
          }

          .about-5w-mobile-copy p {
            position: relative;
            margin: 0;
            max-width: 100%;
            color: var(--about-text);
            font-size: 0.74rem;
            font-weight: 850;
            line-height: 1.4;
          }

          .about-5w-mobile-copy p::after {
            content: "";
            display: inline-block;
            width: 0.45rem;
            height: 0.76rem;
            margin-left: 0.1rem;
            border-radius: 999px;
            background: var(--tone);
            vertical-align: -0.1rem;
            animation: about-5w-caret 0.88s steps(2, end) infinite;
          }

          .about-5w-mobile-readout {
            display: grid;
            gap: 0.24rem;
            margin-top: 0.36rem;
          }

          .about-5w-mobile-readout b {
            width: 100%;
            justify-content: flex-start;
            background: color-mix(in srgb, var(--tone) 10%, transparent);
          }

          .about-5w-typeword {
            min-height: 3.6rem;
            font-size: 1.72rem;
          }

          .about-5w-answer p {
            font-size: 0.74rem;
          }

          .about-5w-readout span {
            white-space: normal;
            line-height: 1.12;
          }

          .about-5w-skill-stack {
            padding: 0.48rem;
          }

          .about-5w-skill-row {
            min-height: 1.54rem;
          }

          .about-5w-skill-stack b {
            font-size: 0.48rem;
            padding: 0.24rem 0.4rem;
          }

          .about-portrait-track b {
            font-size: 0.48rem;
            padding: 0.28rem 0.44rem;
          }

          .about-mobile-scroll-controller[data-visible="true"] {
            top: 0.86rem;
            right: 0.26rem;
            bottom: 0.86rem;
            width: 0.38rem;
          }

          .about-mobile-scroll-controller__thumb {
            right: 0.045rem;
            left: 0.045rem;
            min-height: 1.9rem;
          }
        }

        @media (max-width: 375px) {
          .about-5w-surface {
            padding: 0.52rem;
          }

          .about-5w-topline h1 {
            font-size: 1.76rem;
          }

          .about-5w-actions {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .about-5w-actions .about-5w-linkedin-action {
            grid-column: auto;
          }

          .about-5w-tabs {
            gap: 0.32rem;
          }

          .about-5w-tabs button {
            font-size: 0.58rem;
          }

          .about-5w-mobile-accordion {
            gap: 0.32rem;
          }

          .about-5w-mobile-tab {
            min-height: 2.05rem;
            padding: 0.44rem 0.54rem;
            font-size: 0.58rem;
          }

          .about-5w-mobile-answer {
            padding: 0.44rem;
          }

          .about-5w-mobile-word {
            min-height: 2.48rem;
            font-size: 1.34rem;
          }

          .about-5w-mobile-copy {
            padding: 0.52rem;
          }

          .about-5w-answer-mark {
            font-size: 0.56rem;
          }

          .about-5w-portrait {
            min-height: 18rem;
          }

          .about-portrait-rails {
            padding: 0.5rem;
          }

          .about-portrait-track b {
            font-size: 0.44rem;
            padding: 0.24rem 0.38rem;
          }

          .about-5w-card h2 {
            font-size: 0.56rem;
          }

          .about-5w-mini-icon {
            width: 1.92rem;
            height: 1.92rem;
          }
        }

        @media (max-width: 320px) {
          .about-5w-surface {
            padding: 0.44rem;
          }

          .about-5w-topline h1 {
            font-size: 1.56rem;
          }

          .about-5w-actions a {
            font-size: 0.5rem;
          }

          .about-5w-tabs {
            grid-template-columns: minmax(0, 1fr);
          }

          .about-5w-mobile-tab {
            grid-template-columns: auto minmax(0, 1fr) auto;
            gap: 0.32rem;
            padding-inline: 0.46rem;
            font-size: 0.54rem;
          }

          .about-5w-mobile-tab::after {
            display: none;
          }

          .about-5w-mobile-copy p {
            font-size: 0.66rem;
          }

          .about-5w-typeword {
            min-height: 3rem;
            font-size: 1.42rem;
          }

          .about-5w-answer-copy {
            padding: 0.48rem;
          }

          .about-5w-answer p {
            font-size: 0.68rem;
          }

          .about-5w-portrait {
            min-height: 16.5rem;
          }

          .about-portrait-rail {
            padding-block: 0.16rem;
          }

          .about-portrait-track b {
            font-size: 0.4rem;
            padding: 0.22rem 0.34rem;
          }

          .about-5w-craft article,
          .about-5w-timeline article,
          .about-5w-study-grid article {
            grid-template-columns: minmax(0, 1fr);
          }

          .about-5w-mini-icon {
            grid-column: 1;
            grid-row: 1;
            justify-self: start;
          }

          .about-5w-mini-copy {
            grid-row: 2;
            margin-top: 0.28rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .about-5w-actions a,
          .about-5w-tabs button,
          .about-5w-tab-trigger,
          .about-5w-proof-strip span,
          .about-portrait-track b,
          .about-5w-skill-stack b,
          .about-5w-craft article,
          .about-5w-timeline article,
          .about-5w-study span,
          .about-5w-card,
          .about-5w-portrait,
          .about-5w-portrait-image {
            transition: none;
          }

          .about-5w-portrait-shine,
          .about-portrait-track,
          .about-5w-skill-track,
          .about-5w-skill-stack::before,
          .about-5w-craft::before,
          .about-5w-timeline::before,
          .about-5w-study::before,
          .about-5w-main::after,
          .about-5w-typeword,
          .about-5w-typeword::before,
          .about-5w-tabs button span,
          .about-5w-tabs button span::after,
          .about-5w-answer p,
          .about-5w-readout span,
          .about-5w-skill-stack b,
          .about-5w-study:hover::after,
          .about-5w-craft:hover::after,
          .about-5w-timeline:hover::after,
          .about-5w-answer::after,
          .about-5w-answer p::after {
            animation: none;
          }
        }
      `}</style>
    </PageShell>
  );
}
