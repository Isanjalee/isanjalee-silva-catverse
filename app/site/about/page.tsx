"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import PageShell from "@/components/PageShell";
import {
  BrainCircuit,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Target,
  X,
} from "lucide-react";

const impactStats = [
  { value: "2Y", label: "Professional Experience", color: "rgba(56,189,248,0.86)" },
  { value: "3.72", label: "GPA (out of 4.0)", color: "rgba(167,139,250,0.86)" },
  { value: "90%", label: "Peak Forecast Accuracy", color: "rgba(52,211,153,0.84)" },
  { value: "30-50%", label: "Engineering Efficiency Gain", color: "rgba(255,176,78,0.88)" },
];

const focusGroups = [
  {
    id: "engineering",
    label: "Engineering",
    color: "rgba(56,189,248,0.86)",
    items: [
      "Enterprise Software Development",
      "Data Migration and Workflow Automation",
      "Scalable Full-Stack Systems",
    ],
  },
  {
    id: "ai",
    label: "AI and Data",
    color: "rgba(167,139,250,0.86)",
    items: [
      "Machine Learning Demand Forecasting",
      "Explainable AI (SHAP, LIME)",
      "Data-Driven Product Engineering",
    ],
  },
  {
    id: "domain",
    label: "Domain",
    color: "rgba(52,211,153,0.84)",
    items: [
      "Aviation Supply Chain Systems",
      "AI-Assisted Engineering Workflows",
    ],
  },
];

const allSkillsRows = [
  [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind",
    "Framer Motion",
    "JavaScript",
    "HTML5",
    "CSS3",
  ],
  [
    "Node.js",
    "Express",
    "Java",
    "Spring Boot",
    "Python",
    "PostgreSQL",
    "Redis",
    "OpenSearch",
    "Prisma",
    "TensorFlow",
    "Scikit-learn",
    "Docker",
    "Git",
    "CI/CD",
    "JWT",
    "RBAC",
  ],
];

type DetailSlide = {
  kicker: string;
  title: string;
  copy: string;
  bullets?: string[];
  links?: { label: string; href: string }[];
};

const journeySlides: DetailSlide[] = [
  {
    kicker: "Jan 2026 - Present",
    title: "Full Stack Developer | Med Link (ALDTAN Pvt Ltd)",
    copy:
      "Developing an enterprise healthcare platform across authentication, clinical workflows, analytics, and audit logging.",
    bullets: [
      "Built secure APIs with JWT, RBAC, refresh token rotation, and replay attack protection",
      "Improved performance using Redis workers, OpenSearch, and PgBouncer",
      "Used monorepo architecture to increase maintainability and team velocity",
    ],
    links: [
      {
        label: "LinkedIn Profile",
        href: "https://www.linkedin.com/in/isanjalee-silva/",
      },
    ],
  },
  {
    kicker: "Oct 2024 - Dec 2025",
    title: "Software Engineer (Java) | IFS R&D International",
    copy:
      "Worked on enterprise aviation supply chain solutions, data migration, and automated quality pipelines.",
    bullets: [
      "Customized IFS Cloud backend logic and UI modules",
      "Built migration pipelines from Maintenix to IFS Cloud with SQL and PL/SQL",
      "Improved productivity by 30-50% through AI-assisted development workflows",
    ],
  },
  {
    kicker: "Feb 2024 - Aug 2024",
    title: "Software Engineer (Frontend) | Inivos Technology",
    copy:
      "Delivered transport automation product features for requests, approvals, and allocation workflows.",
    bullets: [
      "Implemented Google Maps integrations for geocoding and auto pin placement",
      "Reduced location selection time by about 45%",
      "Improved initial load performance by about 30%",
    ],
  },
  {
    kicker: "Jan 2023 - Jul 2023",
    title: "Software Engineer Intern | Inivos Technology",
    copy:
      "Built reusable React components, supported debugging tasks, and documented system flows and API behavior.",
    bullets: [
      "Developed UI components using React hooks and routing",
      "Supported frontend issue resolution and QA collaboration",
      "Prepared setup guides, UML diagrams, and workflow documentation",
    ],
  },
];

const researchSlides: DetailSlide[] = [
  {
    kicker: "Project Overview",
    title:
      "Customer Assistance and Recommendation System for Transportation Service Providers",
    copy:
      "An AI-driven transportation support and analytics platform combining customer support automation, sentiment and behavior analysis, knowledge graph answers, and ride demand forecasting.",
    bullets: [
      "Uses social data, ride history, and weather patterns",
      "Designed for operational decision-making and customer experience improvements",
    ],
  },
  {
    kicker: "System Architecture",
    title: "4 AI Modules in the Overall Platform",
    copy:
      "The solution is organized as a modular system with dedicated NLP, profiling, knowledge, and forecasting components.",
    bullets: [
      "Module 1: Question preprocessing, sentiment and sarcasm analysis",
      "Module 2: Customer behavior analysis and profile generation",
      "Module 3: Knowledge graph-based answer extraction",
      "Module 4: Ride demand analysis and forecasting (my module)",
    ],
  },
  {
    kicker: "My Contribution - Module 4",
    title: "AI-Powered Ride Demand Forecasting and Transportation Analytics",
    copy:
      "Designed and implemented a demand forecasting engine using weather, temporal, and location-aware ride patterns with explainability and geo-spatial intelligence.",
    bullets: [
      "ML and forecasting models: Decision Tree Regressor, Gradient Boosting, ARIMA, SARIMA, LSTM, Prophet",
      "Explainability: SHAP and LIME for model transparency and feature understanding",
      "Visualization: Geo heat maps and borough-level demand insights",
      "Evaluation metrics: MAE, MSE, RMSE, R2",
    ],
  },
  {
    kicker: "Tech Stack",
    title: "Core Technologies Used in Module 4",
    copy:
      "Python, Scikit-learn, TensorFlow, Pandas, NumPy, ARIMA, SARIMA, LSTM, Prophet, SHAP, LIME, Matplotlib, Seaborn, Google Colab, and Jupyter notebooks.",
    bullets: [
      "Weather-aware forecasting and temporal trend learning",
      "Explainable AI for feature contribution and trust",
      "Geo-spatial analytics for borough-level demand insights",
    ],
  },
  {
    kicker: "Research Notebooks",
    title: "Colab and Experiment Assets",
    copy:
      "Notebook links used for exploratory analysis, model development, forecasting, explainability, and geo-visual analytics.",
    links: [
      {
        label: "EDA.ipynb",
        href: "https://colab.research.google.com/drive/1qFZXZqmCPxiY5oUJoCPDHylWt4rgx2M8#scrollTo=5ba1efee",
      },
      {
        label: "ARIMA + SARIMA + LSTM + PROPHET (LocationID=237 Manhattan)",
        href: "https://colab.research.google.com/drive/1MgxXFfmi8RjULwywmhULSjSeD7d77NeW#scrollTo=HCXlUp1u91TT",
      },
      {
        label: "Forecasting Notebook Variant",
        href: "https://colab.research.google.com/drive/1tx4NuU0-EyDtNQraoa6Uv6SLiLNDnm8g#scrollTo=v4-ZuFsD-Djf",
      },
      {
        label: "Pickups Prediction DTR + GBR + SHAP + LIME",
        href: "https://colab.research.google.com/drive/1g3Woa8JWUZDRgqpiV_RF1mH2Om7oiY6O#scrollTo=b571c7b7",
      },
      {
        label: "Geo-Map Visualization Based on Borough Ride Demand",
        href: "https://colab.research.google.com/drive/14ZMaHE_B9W-wwzkkvKqMx47LbFczxCgC#scrollTo=5b9343dd",
      },
    ],
  },
];

type PopupMode = "journey" | "research" | null;
const subscribe = () => () => {};

export default function AboutPage() {
  const { resolvedTheme } = useTheme();
  const hasHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const isLight = hasHydrated ? resolvedTheme !== "dark" : false;
  const [activeFocus, setActiveFocus] = useState(focusGroups[0].id);
  const [popupMode, setPopupMode] = useState<PopupMode>(null);
  const [popupIndex, setPopupIndex] = useState(0);

  const activeGroup = useMemo(
    () => focusGroups.find((g) => g.id === activeFocus) ?? focusGroups[0],
    [activeFocus],
  );

  const popupSlides = useMemo(() => {
    if (popupMode === "journey") return journeySlides;
    if (popupMode === "research") return researchSlides;
    return [];
  }, [popupMode]);
  const popupAccent =
    popupMode === "research" ? "rgba(167,139,250,0.86)" : "rgba(255,176,78,0.88)";

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
    if (!popupMode) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [popupMode]);

  const openPopup = (mode: Exclude<PopupMode, null>) => {
    setPopupMode(mode);
    setPopupIndex(0);
  };

  const nextPopup = () => {
    if (!popupSlides.length) return;
    setPopupIndex((i) => (i + 1) % popupSlides.length);
  };

  const prevPopup = () => {
    if (!popupSlides.length) return;
    setPopupIndex((i) => (i - 1 + popupSlides.length) % popupSlides.length);
  };

  const aboutSurfaceStyle = isLight
    ? {
        background: "linear-gradient(180deg, rgba(255,251,245,0.96), rgba(247,242,235,0.94))",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.48), 0 12px 28px rgba(106,82,52,0.1)",
      }
    : {
        background:
          "radial-gradient(circle at top left, rgba(255,176,78,0.14), transparent 30%), radial-gradient(circle at bottom right, rgba(34,211,238,0.09), transparent 34%), linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
      };

  const sectionCardStyle = isLight
    ? {
        borderColor: "rgba(90,68,41,0.1)",
        background:
          "linear-gradient(180deg, rgba(255,251,245,0.98), rgba(250,245,237,0.98))",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.4), 0 8px 18px rgba(106,82,52,0.08)",
      }
    : undefined;

  const innerCardStyle = isLight
    ? {
        borderColor: "rgba(90,68,41,0.1)",
        background:
          "linear-gradient(180deg, rgba(255,251,245,0.98), rgba(250,245,237,0.98))",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 16px rgba(106,82,52,0.06)",
      }
    : undefined;

  const focusChipActiveStyle = isLight
    ? {
        borderColor: "rgba(90,68,41,0.18)",
        background:
          "linear-gradient(180deg, rgba(255,251,245,0.98), rgba(250,245,237,0.98))",
        color: "rgba(34,34,40,0.92)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.4), 0 6px 14px rgba(106,82,52,0.06)",
      }
    : undefined;

  const focusChipInactiveStyle = isLight
    ? {
        borderColor: "rgba(90,68,41,0.1)",
        background: "rgba(255,255,255,0.52)",
        color: "rgba(54,47,40,0.72)",
      }
    : undefined;

  const focusItemStyle = isLight
    ? {
        borderColor: "rgba(90,68,41,0.1)",
        background:
          "linear-gradient(180deg, rgba(255,251,245,0.98), rgba(250,245,237,0.98))",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 16px rgba(106,82,52,0.06)",
      }
    : undefined;

  const tuneAlpha = (color: string, alpha: string) =>
    color.replace(/0\.\d+\)/, `${alpha})`);

  const accentCardStyle = (color: string) =>
    isLight
      ? {
          borderColor: tuneAlpha(color, "0.32"),
          background:
            "linear-gradient(180deg, rgba(255,251,245,0.98), rgba(250,245,237,0.98))",
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.42), 0 12px 24px ${tuneAlpha(color, "0.13")}`,
        }
      : {
          borderColor: tuneAlpha(color, "0.34"),
          background: `radial-gradient(circle at 88% 16%, ${tuneAlpha(color, "0.18")}, transparent 42%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.025))`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.09), 0 16px 28px ${tuneAlpha(color, "0.08")}`,
        };

  const aboutPanelStyle = (color: string) =>
    isLight
      ? {
          borderColor: tuneAlpha(color, "0.34"),
          background: `radial-gradient(circle at 88% 8%, ${tuneAlpha(color, "0.16")}, transparent 40%), linear-gradient(180deg, rgba(255,251,245,0.98), rgba(250,245,237,0.97))`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.44), 0 14px 28px ${tuneAlpha(color, "0.12")}`,
        }
      : {
          borderColor: tuneAlpha(color, "0.36"),
          background: `radial-gradient(circle at 88% 10%, ${tuneAlpha(color, "0.18")}, transparent 42%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.024))`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.09), 0 18px 32px ${tuneAlpha(color, "0.08")}`,
        };

  const aboutActionStyle = (color: string) =>
    isLight
      ? {
          borderColor: tuneAlpha(color, "0.32"),
          background:
            "linear-gradient(180deg, rgba(255,251,245,0.96), rgba(250,245,237,0.98))",
          color: "rgba(34,34,40,0.74)",
          boxShadow: `0 8px 16px ${tuneAlpha(color, "0.09")}`,
        }
      : {
          borderColor: tuneAlpha(color, "0.28"),
          background: `radial-gradient(circle at 90% 0%, ${tuneAlpha(color, "0.13")}, transparent 48%), rgba(255,255,255,0.045)`,
          color: "rgba(245,236,225,0.74)",
        };

  const popupOverlayStyle = isLight
    ? {
        background: "rgba(62,48,31,0.28)",
      }
    : undefined;

  const popupSlideCardStyle = {
    borderColor: tuneAlpha(popupAccent, "0.3"),
    background: `radial-gradient(circle at 90% 0%, ${tuneAlpha(popupAccent, "0.16")}, transparent 42%), linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025))`,
    color: isLight ? "rgba(50,46,42,0.72)" : "rgba(245,236,225,0.74)",
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.1), 0 18px 38px ${tuneAlpha(popupAccent, "0.08")}`,
  };

  const popupItemStyle = {
    borderColor: tuneAlpha(popupAccent, "0.24"),
    background: isLight
      ? "linear-gradient(180deg, rgba(255,251,245,0.92), rgba(250,245,237,0.9))"
      : "rgba(255,255,255,0.055)",
    color: isLight ? "rgba(50,46,42,0.74)" : "rgba(245,236,225,0.74)",
  };

  return (
    <PageShell>
      <div className="app-viewport-frame about-viewport-frame flex h-[calc(var(--app-height)-12.5rem)] min-h-0 items-start">
        <div className="mx-auto h-full w-full max-w-5xl">
          <section className="card page-light-card h-full overflow-hidden p-0">
            <div
              className="about-page-surface relative h-full px-6 py-3.5 md:px-8 md:py-3.5"
              style={aboutSurfaceStyle}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,176,78,0.16),transparent_45%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,176,78,0.13),transparent_48%)]" />

              <div className="about-page-content relative flex h-full min-h-0 flex-col">
                <div
                  className="self-start inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]"
                  style={
                    isLight
                      ? {
                          color: "rgba(84,72,60,0.56)",
                          background: "rgba(255,255,255,0.55)",
                          borderColor: "rgba(90,68,41,0.08)",
                        }
                      : {
                          color: "rgba(255,255,255,0.6)",
                          background: "rgba(255,255,255,0.06)",
                          borderColor: "rgba(255,255,255,0.1)",
                        }
                  }
                >
                  <Sparkles size={13} />
                  Profile
                </div>

                <div className="about-top-grid mt-1.5 grid gap-2.5 lg:grid-cols-[minmax(0,1.14fr)_minmax(0,0.86fr)]">
                  <motion.section
                    className="about-intro-card h-full rounded-2xl border border-black/10 bg-white/72 px-4 py-3 md:px-5 md:py-3.5 dark:border-white/10 dark:bg-white/5"
                    style={aboutPanelStyle("rgba(255,176,78,0.88)")}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.42 }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex h-full flex-col justify-between">
                      <div>
                        <motion.div
                          className="text-3xl font-black tracking-[-0.045em] md:text-[2.15rem]"
                          style={{
                            color: isLight
                              ? "rgba(34,34,40,0.96)"
                              : "rgba(245,236,225,0.92)",
                          }}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35 }}
                        >
                          Software Engineer
                        </motion.div>
                        <motion.div
                          className="mt-1 text-sm font-semibold md:text-base"
                          style={{
                            color: isLight
                              ? "rgba(50,46,42,0.76)"
                              : "rgba(245,236,225,0.68)",
                          }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: 0.04 }}
                        >
                          AI-Focused | Enterprise Systems | Full Stack
                        </motion.div>
                        <motion.div
                          className="mt-2 h-[3px] w-24 rounded-full"
                          style={{
                            background: isLight
                              ? "linear-gradient(90deg, rgba(255,176,78,0.95), rgba(255,145,0,0.35))"
                              : "linear-gradient(90deg, rgba(255,176,78,0.95), rgba(255,176,78,0.1))",
                          }}
                          initial={{ opacity: 0, scaleX: 0.55, transformOrigin: "left" }}
                          animate={{ opacity: 1, scaleX: 1 }}
                          transition={{ duration: 0.4, delay: 0.08 }}
                        />
                      </div>

                      <motion.p
                        className="about-intro-copy mt-2.5 text-[0.9rem] leading-6 md:text-[0.93rem]"
                        style={{
                          color: isLight
                            ? "rgba(50,46,42,0.75)"
                            : "rgba(245,236,225,0.72)",
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.38, delay: 0.1 }}
                      >
                        Hi, I&apos;m <span className="font-semibold">Isanjalee Silva</span> from{" "}
                        <span className="font-semibold">Panadura, Sri Lanka</span>. I completed
                        my <span className="font-semibold">B.Sc. (Hons) IT &amp; Management</span>{" "}
                        with a <span className="font-semibold">First Class</span> result. I build
                        elegant full-stack experiences that feel modern, reliable, and user-first.
                      </motion.p>

                      <motion.div
                        className="about-skill-stack mt-2.5"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.14 }}
                      >
                        <div
                          className="text-[0.62rem] font-semibold uppercase tracking-[0.18em]"
                          style={{ color: isLight ? "rgba(84,72,60,0.6)" : "rgba(255,255,255,0.56)" }}
                        >
                          Skill Stack
                        </div>
                        <div className="mt-1.5 space-y-1.5">
                          {allSkillsRows.map((row, rowIndex) => (
                            <div
                              key={`skills-row-${rowIndex}`}
                              className="about-skill-row overflow-hidden rounded-lg border border-black/10 py-1 dark:border-white/10"
                              style={
                                isLight
                                  ? {
                                      borderColor: "transparent",
                                      background:
                                        "linear-gradient(180deg, rgba(255,255,255,0.84), rgba(255,249,241,0.8)) padding-box, linear-gradient(120deg, rgba(255,176,78,0.62), rgba(255,145,0,0.2), rgba(45,212,191,0.28)) border-box",
                                      boxShadow:
                                        "inset 0 1px 0 rgba(255,255,255,0.56), 0 4px 10px rgba(106,82,52,0.08)",
                                    }
                                  : { background: "rgba(255,255,255,0.03)" }
                              }
                            >
                              <motion.div
                                className="about-skill-track flex w-max items-center gap-1.5 px-2"
                                animate={{ x: rowIndex === 0 ? [0, -440] : [-440, 0] }}
                                transition={{
                                  repeat: Infinity,
                                  duration: rowIndex === 0 ? 17 : 20,
                                  ease: "linear",
                                }}
                              >
                                {[...row, ...row].map((skill, index) => (
                                  <span
                                    key={`${skill}-${rowIndex}-${index}`}
                                    className={`${index >= row.length ? "about-skill-duplicate " : ""}rounded-full border border-black/10 px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.12em] dark:border-white/10`}
                                    style={{
                                      color: isLight ? "rgba(84,72,60,0.72)" : "rgba(255,255,255,0.72)",
                                      background: isLight
                                        ? "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(255,248,239,0.92)) padding-box, linear-gradient(120deg, rgba(255,176,78,0.62), rgba(255,145,0,0.18)) border-box"
                                        : "rgba(255,255,255,0.04)",
                                      borderColor: isLight ? "transparent" : undefined,
                                    }}
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </motion.div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </motion.section>

                  <motion.section
                    className="min-h-0 overflow-hidden rounded-2xl border border-black/10 bg-white/72 p-0 dark:border-white/10 dark:bg-white/5"
                    style={aboutPanelStyle("rgba(45,212,191,0.84)")}
                    initial={{ opacity: 0, y: 14, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.44, delay: 0.06 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.992 }}
                  >
                    <motion.div
                      className="group relative h-full min-h-[220px]"
                      animate={{
                        boxShadow: isLight
                          ? [
                              "0 0 0 rgba(255,145,0,0.0)",
                              "0 0 20px rgba(255,145,0,0.16)",
                              "0 0 0 rgba(255,145,0,0.0)",
                            ]
                          : [
                              "0 0 0 rgba(167,139,250,0)",
                              "0 0 20px rgba(167,139,250,0.2)",
                              "0 0 0 rgba(167,139,250,0)",
                            ],
                      }}
                      transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut" }}
                    >
                      <Image
                        src={isLight ? "/about/profile-light.png" : "/about/profile-dark.png"}
                        alt="Isanjalee portrait illustration"
                        fill
                        sizes="(max-width: 1024px) 100vw, 34vw"
                        className="object-cover object-[center_22%] transition-transform duration-500 group-hover:scale-[1.04]"
                        priority
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      <motion.div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(120deg, rgba(255,255,255,0.02) 20%, rgba(255,255,255,0.22) 46%, rgba(255,255,255,0.02) 70%)",
                          backgroundSize: "220% 220%",
                        }}
                        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                        transition={{ repeat: Infinity, duration: 3.6, ease: "linear" }}
                      />
                      <motion.div
                        className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm"
                        animate={{ y: [0, -2, 0], opacity: [0.84, 1, 0.84] }}
                        transition={{ repeat: Infinity, duration: 2.3, ease: "easeInOut" }}
                      >
                        Tap To Glow
                      </motion.div>
                      <motion.div
                        className="absolute right-3 bottom-3 rounded-full border border-white/15 bg-black/28 px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-white/72 backdrop-blur-sm"
                        animate={{ x: [0, 2, 0] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                      >
                        Live Motion
                      </motion.div>
                    </motion.div>
                  </motion.section>
                </div>

                <motion.div
                  className="about-middle-grid mt-1.5 grid gap-2.5 lg:grid-cols-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.12 }}
                >
                  <motion.section
                    className="rounded-2xl border border-black/10 bg-white/68 p-2.5 dark:border-white/10 dark:bg-white/5"
                    style={aboutPanelStyle("rgba(56,189,248,0.86)")}
                    whileHover={{ y: -2 }}
                  >
                    <div
                      className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em]"
                      style={{
                        color: isLight
                          ? "rgba(38,33,28,0.72)"
                          : "rgba(255,255,255,0.45)",
                      }}
                    >
                      <Target size={14} />
                      Impact
                    </div>
                    <div className="about-impact-grid mt-1.5 grid grid-cols-2 gap-2">
                      {impactStats.map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          className="relative overflow-hidden rounded-xl border border-black/10 bg-white/75 px-3 py-2 text-center dark:border-white/10 dark:bg-white/5"
                          style={accentCardStyle(stat.color)}
                          whileHover={{ y: -1, scale: 1.015 }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.span
                            className="pointer-events-none absolute -right-5 -top-6 h-14 w-14 rounded-full blur-2xl"
                            style={{ background: stat.color }}
                            animate={{
                              opacity: [0.16, 0.32, 0.16],
                              x: index % 2 === 0 ? [0, -6, 0] : [0, 6, 0],
                            }}
                            transition={{
                              duration: 3 + index * 0.25,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                          <div
                            className="relative text-lg font-black tracking-tight"
                            style={{
                              color: isLight
                                ? "rgba(34,34,40,0.9)"
                                : stat.color,
                            }}
                          >
                            {stat.value}
                          </div>
                          <div
                            className="relative mt-1 text-[0.63rem] font-semibold uppercase tracking-[0.14em]"
                            style={{
                              color: isLight
                                ? "rgba(84,72,60,0.5)"
                                : "rgba(255,255,255,0.45)",
                            }}
                          >
                            {stat.label}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>

                  <motion.section
                    className="rounded-2xl border border-black/10 bg-white/68 p-2.5 dark:border-white/10 dark:bg-white/5"
                    style={aboutPanelStyle("rgba(45,212,191,0.84)")}
                    whileHover={{ y: -2 }}
                  >
                    <div
                      className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]"
                      style={{
                        color: isLight
                          ? "rgba(84,72,60,0.55)"
                          : "rgba(255,255,255,0.45)",
                      }}
                    >
                      <BrainCircuit size={14} />
                      Focus Areas
                    </div>

                    <div className="about-focus-tabs mt-1.5 flex flex-wrap gap-1.5">
                      {focusGroups.map((group) => {
                        const isActive = group.id === activeFocus;
                        return (
                          <button
                            key={group.id}
                            type="button"
                            onClick={() => setActiveFocus(group.id)}
                            className={`relative overflow-hidden rounded-full border px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.1em] transition ${
                              isActive
                                ? "border-black/20 text-black/86 dark:border-white/20 dark:text-[#f5ece1]/88"
                                : "border-black/10 text-black/55 hover:text-black/75 dark:border-white/10 dark:text-white/52 dark:hover:text-white/75"
                            }`}
                            style={
                              isActive
                                ? {
                                    ...(focusChipActiveStyle ?? {}),
                                    borderColor: tuneAlpha(group.color, "0.48"),
                                    boxShadow: `0 0 18px ${tuneAlpha(group.color, "0.14")}`,
                                  }
                                : focusChipInactiveStyle
                            }
                          >
                            {isActive && !isLight ? (
                              <motion.span
                                layoutId="focus-tab-pill"
                                className="absolute inset-0 bg-black/8 dark:bg-white/10"
                                transition={{
                                  type: "spring",
                                  stiffness: 280,
                                  damping: 24,
                                }}
                              />
                            ) : null}
                            <span
                              className="relative"
                              style={
                                isLight
                                  ? {
                                      color: isActive
                                        ? "rgba(28,28,30,0.94)"
                                        : "rgba(54,47,40,0.74)",
                                    }
                                  : undefined
                              }
                            >
                              {group.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.ul
                        key={activeGroup.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.22 }}
                        className="about-focus-list mt-1.5 space-y-1.5"
                      >
                        {activeGroup.items.map((item) => (
                          <motion.li
                            key={item}
                            className="relative overflow-hidden rounded-xl border border-black/10 bg-white/75 px-3 py-1.5 text-xs font-semibold leading-relaxed tracking-[0.01em] text-black/74 dark:border-white/10 dark:bg-white/5 dark:text-[#f5ece1]/72"
                            style={accentCardStyle(activeGroup.color) ?? focusItemStyle ?? innerCardStyle}
                            whileHover={{ x: 2 }}
                            transition={{ duration: 0.18 }}
                          >
                            <span
                              className="relative"
                              style={
                                isLight
                                  ? { color: "rgba(42,37,32,0.86)" }
                                  : undefined
                              }
                            >
                              {item}
                            </span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </AnimatePresence>
                  </motion.section>
                </motion.div>

                <motion.div
                  className="about-bottom-grid mt-1.5 grid gap-2.5 lg:grid-cols-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.16 }}
                >
                  <motion.section
                    className="rounded-2xl border border-black/10 bg-white/68 p-2.5 dark:border-white/10 dark:bg-white/5"
                    style={aboutPanelStyle("rgba(255,176,78,0.88)")}
                    whileHover={{ y: -2 }}
                  >
                    <div
                      className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]"
                      style={{
                        color: isLight
                          ? "rgba(84,72,60,0.55)"
                          : "rgba(255,255,255,0.45)",
                      }}
                    >
                      <BriefcaseBusiness size={14} />
                      Journey
                    </div>
                    <motion.div
                      className="relative mt-1.5 overflow-hidden rounded-xl border border-black/10 bg-white/72 px-3 py-2 dark:border-white/10 dark:bg-white/5"
                      style={accentCardStyle("rgba(255,176,78,0.88)")}
                      whileHover={{ x: 2 }}
                    >
                      <motion.span
                        className="pointer-events-none absolute -right-8 top-0 h-20 w-20 rounded-full bg-[#ffb04e] blur-2xl"
                        animate={{
                          opacity: [0.12, 0.26, 0.12],
                          scale: [0.9, 1.08, 0.9],
                        }}
                        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <div
                        className="relative text-[0.62rem] font-semibold uppercase tracking-[0.2em]"
                        style={{
                          color: isLight
                            ? "rgba(84,72,60,0.48)"
                            : "rgba(255,255,255,0.4)",
                        }}
                      >
                        Current Role
                      </div>
                      <div
                        className="relative mt-1 text-sm font-semibold"
                        style={{
                          color: isLight
                            ? "rgba(34,34,40,0.84)"
                            : "rgba(245,236,225,0.84)",
                        }}
                      >
                        Full Stack Developer | Med Link
                      </div>
                      <div
                        className="relative mt-1 text-xs"
                        style={{
                          color: isLight
                            ? "rgba(50,46,42,0.62)"
                            : "rgba(245,236,225,0.62)",
                        }}
                      >
                        Includes IFS and Inivos experience in timeline
                      </div>
                    </motion.div>
                    <div className="mt-1.5 grid grid-cols-2 gap-2">
                      <a
                        href="https://www.linkedin.com/in/isanjalee-silva/"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-black/15 bg-white/65 px-3 py-1.5 text-center text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-black/72 transition hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white/72 dark:hover:bg-white/10"
                        style={aboutActionStyle("rgba(255,176,78,0.88)")}
                      >
                        LinkedIn
                      </a>
                      <button
                        type="button"
                        onClick={() => openPopup("journey")}
                        className="rounded-lg border border-black/15 bg-black/5 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-black/70 transition hover:bg-black/10 dark:border-white/15 dark:bg-white/5 dark:text-white/72 dark:hover:bg-white/10"
                        style={aboutActionStyle("rgba(255,176,78,0.88)")}
                      >
                        Details
                      </button>
                    </div>
                  </motion.section>

                  <motion.section
                    className="rounded-2xl border border-black/10 bg-white/68 p-2.5 dark:border-white/10 dark:bg-white/5"
                    style={aboutPanelStyle("rgba(167,139,250,0.86)")}
                    whileHover={{ y: -2 }}
                  >
                    <div
                      className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]"
                      style={{
                        color: isLight
                          ? "rgba(84,72,60,0.55)"
                          : "rgba(255,255,255,0.45)",
                      }}
                    >
                      <GraduationCap size={14} />
                      Research Edge
                    </div>
                    <motion.div
                      className="relative mt-1.5 overflow-hidden rounded-xl border border-black/10 bg-white/72 px-3 py-2 dark:border-white/10 dark:bg-white/5"
                      style={accentCardStyle("rgba(167,139,250,0.86)")}
                      whileHover={{ x: 2 }}
                    >
                      <motion.span
                        className="pointer-events-none absolute -right-8 top-0 h-20 w-20 rounded-full bg-[#a78bfa] blur-2xl"
                        animate={{
                          opacity: [0.12, 0.26, 0.12],
                          scale: [0.9, 1.08, 0.9],
                        }}
                        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <div
                        className="relative text-[0.62rem] font-semibold uppercase tracking-[0.2em]"
                        style={{
                          color: isLight
                            ? "rgba(84,72,60,0.48)"
                            : "rgba(255,255,255,0.4)",
                        }}
                      >
                        Core
                      </div>
                      <div
                        className="relative mt-1 text-sm font-semibold leading-snug"
                        style={{
                          color: isLight
                            ? "rgba(34,34,40,0.84)"
                            : "rgba(245,236,225,0.84)",
                        }}
                      >
                        Module 4: Explainable ride-demand forecasting with geo-spatial analytics
                      </div>
                    </motion.div>
                    <button
                      type="button"
                      onClick={() => openPopup("research")}
                      className="mt-1.5 w-full rounded-lg border border-black/15 bg-black/5 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-black/70 transition hover:bg-black/10 dark:border-white/15 dark:bg-white/5 dark:text-white/72 dark:hover:bg-white/10"
                      style={aboutActionStyle("rgba(167,139,250,0.86)")}
                    >
                      Open Research Details
                    </button>
                  </motion.section>
                </motion.div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <AnimatePresence>
        {popupMode ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPopupMode(null)}
            style={popupOverlayStyle}
          >
            <motion.div
              className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/18 bg-[linear-gradient(180deg,rgba(17,17,19,0.98),rgba(11,11,13,0.96))] p-5 text-white shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
              style={
                isLight
                  ? {
                      background:
                        "linear-gradient(180deg, rgba(255,251,245,0.98), rgba(247,242,235,0.96))",
                      borderColor: tuneAlpha(popupAccent, "0.32"),
                      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.48), 0 24px 62px ${tuneAlpha(popupAccent, "0.16")}`,
                    }
                  : undefined
              }
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.985 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.span
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
                style={{ background: popupAccent }}
                animate={{ opacity: [0.1, 0.24, 0.1], scale: [0.9, 1.08, 0.9] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="flex items-center justify-between">
                <div
                  className="relative text-xs font-semibold uppercase tracking-[0.2em]"
                  style={{
                    color: isLight ? "rgba(84,72,60,0.52)" : popupAccent,
                  }}
                >
                  {popupMode === "journey" ? "Journey Timeline" : "Research Portfolio"}
                </div>
                <button
                  type="button"
                  onClick={() => setPopupMode(null)}
                  className="rounded-full border border-black/10 p-1.5 text-black/65 transition hover:bg-black/5 dark:border-white/10 dark:text-white/65 dark:hover:bg-white/5"
                  style={
                    isLight
                      ? {
                          borderColor: "rgba(90,68,41,0.1)",
                          color: "rgba(84,72,60,0.68)",
                          background: "rgba(255,255,255,0.55)",
                        }
                      : undefined
                  }
                  aria-label="Close dialog"
                >
                  <X size={15} />
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${popupMode}-${popupIndex}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="relative mt-4 overflow-hidden rounded-2xl border border-black/10 bg-white/72 p-4 dark:border-white/10 dark:bg-white/5"
                  style={popupSlideCardStyle ?? sectionCardStyle}
                >
                  <motion.span
                    className="pointer-events-none absolute -right-8 top-0 h-24 w-24 rounded-full blur-2xl"
                    style={{ background: popupAccent }}
                    animate={{ opacity: [0.1, 0.2, 0.1], scale: [0.9, 1.08, 0.9] }}
                    transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div
                    className="relative text-[0.65rem] font-semibold uppercase tracking-[0.2em]"
                    style={{
                      color: isLight ? "rgba(84,72,60,0.48)" : popupAccent,
                    }}
                  >
                    {popupSlides[popupIndex]?.kicker}
                  </div>
                  <div
                    className="relative mt-2 text-lg font-semibold leading-relaxed"
                    style={{
                      color: isLight
                        ? "rgba(34,34,40,0.88)"
                        : "rgba(245,236,225,0.88)",
                    }}
                  >
                    {popupSlides[popupIndex]?.title}
                  </div>
                  <p
                    className="relative mt-2 text-sm leading-relaxed"
                    style={{
                      color: isLight
                        ? "rgba(50,46,42,0.66)"
                        : "rgba(245,236,225,0.66)",
                    }}
                  >
                    {popupSlides[popupIndex]?.copy}
                  </p>

                  {popupSlides[popupIndex]?.bullets?.length ? (
                    <div className="mt-3 space-y-1.5">
                      {popupSlides[popupIndex].bullets?.map((item) => (
                        <div
                          key={item}
                          className="relative rounded-lg border border-black/10 bg-white/75 px-3 py-2 text-xs leading-relaxed text-black/72 dark:border-white/10 dark:bg-white/5 dark:text-[#f5ece1]/72"
                          style={popupItemStyle ?? innerCardStyle}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {popupSlides[popupIndex]?.links?.length ? (
                    <div className="mt-3 space-y-2">
                      {popupSlides[popupIndex].links?.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="block rounded-lg border border-black/10 bg-white/75 px-3 py-2 text-xs font-semibold leading-relaxed text-black/74 transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-[#f5ece1]/74 dark:hover:bg-white/10"
                          style={popupItemStyle ?? innerCardStyle}
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </motion.div>
              </AnimatePresence>

              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevPopup}
                  className="inline-flex items-center gap-1 rounded-lg border border-black/12 bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-black/68 transition hover:bg-white dark:border-white/12 dark:bg-white/5 dark:text-white/68 dark:hover:bg-white/10"
                  style={
                    isLight
                      ? {
                          borderColor: "rgba(90,68,41,0.12)",
                          background:
                            "linear-gradient(180deg, rgba(255,251,245,0.96), rgba(250,245,237,0.98))",
                          color: "rgba(34,34,40,0.7)",
                        }
                      : undefined
                  }
                >
                  <ChevronLeft size={14} />
                  Prev
                </button>
                <div
                  className="text-xs font-semibold tracking-[0.14em]"
                  style={{
                    color: isLight
                      ? "rgba(84,72,60,0.54)"
                      : "rgba(255,255,255,0.48)",
                  }}
                >
                  {popupIndex + 1} / {popupSlides.length}
                </div>
                <button
                  type="button"
                  onClick={nextPopup}
                  className="inline-flex items-center gap-1 rounded-lg border border-black/12 bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-black/68 transition hover:bg-white dark:border-white/12 dark:bg-white/5 dark:text-white/68 dark:hover:bg-white/10"
                  style={
                    isLight
                      ? {
                          borderColor: "rgba(90,68,41,0.12)",
                          background:
                            "linear-gradient(180deg, rgba(255,251,245,0.96), rgba(250,245,237,0.98))",
                          color: "rgba(34,34,40,0.7)",
                        }
                      : undefined
                  }
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </PageShell>
  );
}
