"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  ArrowUpRight,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarClock,
  Check,
  ChevronDown,
  CloudCog,
  Code2,
  Compass,
  DatabaseZap,
  Download,
  ExternalLink,
  Eye,
  Filter,
  Gauge,
  Github,
  Globe,
  Layers3,
  ListChecks,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { useTheme } from "next-themes";
import DigitalSectionTitle from "@/components/DigitalSectionTitle";
import PageShell from "@/components/PageShell";
import { siteData, type Project } from "@/lib/siteData";

const subscribe = () => () => {};
const CV_PATH = "/Isanjalee-Silva-CV.pdf";

type ProjectCategory =
  | "All"
  | "Full-Stack"
  | "Enterprise"
  | "AI"
  | "Mobile"
  | "Creative"
  | "Game";

type ProjectMeta = {
  shortTitle: string;
  role: string;
  category: Exclude<ProjectCategory, "All">;
  status: "Live" | "Case Study" | "Research" | "Source";
  year: string;
  domain: string;
  impact: string;
  contribution: string;
  purpose: string;
  skills: string[];
  signals: string[];
  color: string;
  glow: string;
  image: string;
  icon: LucideIcon;
};

const projectMeta: ProjectMeta[] = [
  {
    shortTitle: "Transpomate",
    role: "Frontend Engineer",
    category: "Enterprise",
    status: "Live",
    year: "2024",
    domain: "Transport automation",
    impact: "Ride approvals, fleet allocation, reporting, maps, and faster load paths.",
    contribution:
      "Built approval, allocation, HR, finance, and map-driven transport workflows with a focus on clean UI states and faster loading.",
    purpose: "Cuts manual dispatch work so transport teams approve and route rides in minutes, not hours.",
    skills: ["React", "Next.js", "NestJS", "Maps"],
    signals: ["Maps", "Approvals", "Reports"],
    color: "rgba(34,211,238,0.88)",
    glow: "rgba(34,211,238,0.2)",
    image: "/projects/transpomate.png",
    icon: DatabaseZap,
  },
  {
    shortTitle: "IFS Cloud",
    role: "Software Engineer",
    category: "Enterprise",
    status: "Case Study",
    year: "2023",
    domain: "Aviation ERP",
    impact: "IFS Cloud modules, Maintenix migration, PL/SQL jobs, tests, and KT.",
    contribution:
      "Developed enterprise logic, migration support, test coverage, documentation, and global-team delivery for aviation systems.",
    purpose: "Keeps aviation supply-chain data accurate through a cloud migration so operations never stall.",
    skills: ["Java", "PL/SQL", "IFS Cloud", "JUnit"],
    signals: ["Cloud", "Migration", "Aviation"],
    color: "rgba(251,191,36,0.9)",
    glow: "rgba(251,191,36,0.2)",
    image: "/projects/ifs.png",
    icon: CloudCog,
  },
  {
    shortTitle: "Med Link",
    role: "Full Stack Developer",
    category: "Full-Stack",
    status: "Live",
    year: "2025",
    domain: "Healthcare platform",
    impact: "Authentication, clinical workflows, analytics, and resilient APIs.",
    contribution:
      "Delivered secure product flows across authentication, healthcare operations, analytics surfaces, and API architecture.",
    purpose: "Gives clinics a secure, reliable system to run daily operations and trust their patient data.",
    skills: ["Next.js", "API Design", "Auth", "Analytics"],
    signals: ["Auth", "API", "Clinical"],
    color: "rgba(163,230,53,0.9)",
    glow: "rgba(163,230,53,0.18)",
    image: "/projects/medlink.png",
    icon: ShieldCheck,
  },
  {
    shortTitle: "Calm Agent",
    role: "AI Engineer",
    category: "AI",
    status: "Source",
    year: "2025",
    domain: "Local AI planning",
    impact: "Private daily planning with Ollama-powered task orchestration.",
    contribution:
      "Designed a local-first assistant for private planning, focused productivity, and calm personal workflow support.",
    purpose: "Helps people plan their day without sending personal data to the cloud.",
    skills: ["Python", "Ollama", "Agents", "Privacy"],
    signals: ["Local AI", "Tasks", "Privacy"],
    color: "rgba(20,241,196,0.86)",
    glow: "rgba(20,241,196,0.18)",
    image: "/projects/calmdayagent.png",
    icon: BrainCircuit,
  },
  {
    shortTitle: "Posh AI",
    role: "Full Stack Developer",
    category: "AI",
    status: "Source",
    year: "2025",
    domain: "Apparel content tools",
    impact: "Captions, hashtags, replies, and design ideas for apparel sellers.",
    contribution:
      "Built seller-focused AI workflows for social copy, replies, product ideas, and practical content operations.",
    purpose: "Saves small apparel sellers hours of content writing every week.",
    skills: ["TypeScript", "AI UX", "Content Tools", "Automation"],
    signals: ["Prompt UX", "Social", "Ideas"],
    color: "rgba(192,132,252,0.84)",
    glow: "rgba(192,132,252,0.18)",
    image: "/projects/posh.png",
    icon: Sparkles,
  },
  {
    shortTitle: "Servicr",
    role: "Frontend Engineer",
    category: "Mobile",
    status: "Source",
    year: "2022",
    domain: "Home services",
    impact: "Flutter UI, scheduling, notifications, admin, and database support.",
    contribution:
      "Contributed mobile screens, scheduling flows, notification handling, admin support, and database-backed features.",
    purpose: "Makes booking a home-service provider as easy as ordering food, for both sides of the market.",
    skills: ["Flutter", "Scheduling", "Notifications", "Admin"],
    signals: ["Mobile", "Booking", "Admin"],
    color: "rgba(96,165,250,0.88)",
    glow: "rgba(96,165,250,0.17)",
    image: "/projects/servicr.png",
    icon: Layers3,
  },
  {
    shortTitle: "Flappy Bird",
    role: "Software Engineer",
    category: "Game",
    status: "Source",
    year: "2021",
    domain: "Gameplay systems",
    impact: "Obstacle timing, collision handling, scoring, and game loops.",
    contribution:
      "Implemented C# game fundamentals including obstacle timing, collision handling, score tracking, and player movement.",
    purpose: "A hands-on rebuild of a classic game loop to learn core game-engine fundamentals from scratch.",
    skills: ["C#", "Game Loops", "Collision", "Scoring"],
    signals: ["Loop", "Collision", "Score"],
    color: "rgba(251,113,133,0.86)",
    glow: "rgba(251,113,133,0.16)",
    image: "/projects/flappybird.png",
    icon: Gauge,
  },
  {
    shortTitle: "DevTrio",
    role: "Frontend Engineer",
    category: "Creative",
    status: "Source",
    year: "2022",
    domain: "Agency web presence",
    impact: "Company website for web, digital design, and mobile services.",
    contribution:
      "Created frontend presentation for a digital solutions team, connecting web, design, mobile, and remote delivery.",
    purpose: "Gives a remote digital agency a professional web presence to win and showcase client work.",
    skills: ["Web Design", "Frontend", "Remote Team", "Delivery"],
    signals: ["Brand", "Web", "Delivery"],
    color: "rgba(34,211,238,0.86)",
    glow: "rgba(34,211,238,0.16)",
    image: "/projects/devtrio.png",
    icon: Code2,
  },
];

const categories: ProjectCategory[] = [
  "All",
  "Full-Stack",
  "Enterprise",
  "AI",
  "Mobile",
  "Creative",
  "Game",
];

function ProjectLinkIcon({ label }: { label: string }) {
  const normalized = label.toLowerCase();

  if (normalized.includes("github")) return <Github size={14} />;
  if (normalized.includes("live") || normalized.includes("ifs")) return <Globe size={14} />;
  return <ExternalLink size={14} />;
}

function ProjectPreview({
  project,
  meta,
  isLight,
}: {
  project: Project;
  meta: ProjectMeta;
  isLight: boolean;
}) {
  const Icon = meta.icon;

  return (
    <div className="projects-lab-preview" style={{ "--project-accent": meta.color } as CSSProperties}>
      <div className="projects-lab-preview__image">
        <Image
          src={meta.image}
          alt={`${project.title} preview`}
          fill
          sizes="(max-width: 768px) 100vw, 360px"
          className="projects-lab-preview__asset"
          style={{
            filter: isLight
              ? "brightness(1.03) contrast(0.98) saturate(0.98)"
              : "brightness(0.9) contrast(1.08) saturate(1.06)",
          }}
        />
      </div>
      <div className="projects-lab-preview__grid" aria-hidden="true" />
      <div className="projects-lab-preview__badge">
        <Icon size={15} />
        {meta.status}
      </div>
      <div className="projects-lab-preview__signals">
        {meta.signals.map((signal) => (
          <b key={signal}>{signal}</b>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  meta,
  index,
  isLight,
  onInspect,
}: {
  project: Project;
  meta: ProjectMeta;
  index: number;
  isLight: boolean;
  onInspect: () => void;
}) {
  const Icon = meta.icon;

  return (
    <motion.article
      layout
      className="projects-lab-card"
      style={{ "--project-accent": meta.color, "--project-glow": meta.glow } as CSSProperties}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.28, delay: Math.min(index * 0.025, 0.16) }}
    >
      <button
        type="button"
        className="projects-lab-card__open"
        onClick={onInspect}
        aria-label={`Inspect ${project.title}`}
      >
        <ArrowUpRight size={14} />
      </button>

      <ProjectPreview project={project} meta={meta} isLight={isLight} />

      <div className="projects-lab-card__body">
        <div className="projects-lab-card__topline">
          <span>
            <Icon size={14} />
            {meta.category}
          </span>
          <b>{meta.year}</b>
        </div>
        <h2>{project.title}</h2>
        <p>{meta.impact}</p>
        <div className="projects-lab-skill-row" aria-label={`${project.title} technology stack`}>
          {meta.skills.slice(0, 4).map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectsPage() {
  const { resolvedTheme } = useTheme();
  const hasHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const isLight = hasHydrated ? resolvedTheme !== "dark" : false;
  const prefersReducedMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>("All");
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);

  const projects = useMemo(
    () =>
      siteData.projects.map((project, index) => ({
        project,
        index,
        meta: projectMeta[index] ?? projectMeta[0],
      })),
    [],
  );

  const timelineStats = useMemo(() => {
    const byYear = new Map<string, number>();
    projects.forEach(({ meta }) => {
      byYear.set(meta.year, (byYear.get(meta.year) ?? 0) + 1);
    });
    const years = Array.from(byYear.keys()).sort();
    const domainCount = new Set(projects.map(({ meta }) => meta.domain)).size;
    const stackCount = new Set(projects.flatMap(({ meta }) => meta.skills)).size;
    return { years, byYear, domainCount, stackCount };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return projects.filter(({ project, meta }) => {
      const categoryMatch =
        selectedCategory === "All" || meta.category === selectedCategory;
      const searchable = [
        project.title,
        project.tag,
        project.desc,
        meta.role,
        meta.category,
        meta.status,
        meta.domain,
        meta.impact,
        ...meta.skills,
        ...meta.signals,
      ]
        .join(" ")
        .toLowerCase();

      return categoryMatch && (!query || searchable.includes(query));
    });
  }, [projects, searchTerm, selectedCategory]);

  const selectedProject =
    selectedProjectIndex === null ? null : projects[selectedProjectIndex] ?? null;

  useEffect(() => {
    if (selectedProjectIndex === null) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const timer = window.setTimeout(() => closeButtonRef.current?.focus(), 40);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedProjectIndex(null);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [selectedProjectIndex]);

  return (
    <PageShell>
      <div className="projects-viewport-frame app-viewport-frame">
        <section className="projects-page-shell projects-lab-shell card page-light-card">
          <div className="projects-page-surface projects-lab-surface">
            <div className="projects-lab-scan" aria-hidden="true" />

            <div className="projects-page-content projects-lab-content">
              <motion.header
                className="projects-lab-header"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.34 }}
              >
                <div className="projects-lab-kicker">
                  <Sparkles size={13} />
                  Creative Build Laboratory
                </div>

                <div className="projects-lab-title-row">
                  <div>
                    <DigitalSectionTitle label="projects.dev" />
                    <p>
                      A searchable lab of product systems, enterprise delivery,
                      AI experiments, mobile work, and creative builds.
                    </p>
                  </div>

                  <div className="projects-lab-header-actions" aria-label="Project actions">
                    <a href={CV_PATH} target="_blank" rel="noreferrer" aria-label="View CV">
                      <Eye size={14} />
                      <span>View CV</span>
                    </a>
                    <a href={CV_PATH} download="Isanjalee-Silva-CV.pdf" aria-label="Download CV">
                      <Download size={14} />
                      <span>CV</span>
                    </a>
                    <a
                      href="https://github.com/Isanjalee"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub"
                    >
                      <Github size={14} />
                    </a>
                  </div>
                </div>
              </motion.header>

              <motion.section
                className="projects-lab-timeline"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.34, delay: 0.04 }}
                aria-label="Build timeline and highlights"
              >
                <div className="projects-lab-timeline__track">
                  {timelineStats.years.map((year, index) => (
                    <div key={year} className="projects-lab-timeline__year">
                      <span className="projects-lab-timeline__dot" style={{ "--tl-delay": `${index * 0.1}s` } as CSSProperties} />
                      <b>{year}</b>
                      <em>{timelineStats.byYear.get(year)} build{(timelineStats.byYear.get(year) ?? 0) > 1 ? "s" : ""}</em>
                    </div>
                  ))}
                </div>
                <div className="projects-lab-timeline__stats">
                  <span>
                    <b>{projects.length}</b>
                    <em>Total Builds</em>
                  </span>
                  <span>
                    <b>{timelineStats.domainCount}</b>
                    <em>Domains</em>
                  </span>
                  <span>
                    <b>{timelineStats.stackCount}</b>
                    <em>Technologies</em>
                  </span>
                </div>
              </motion.section>

              <motion.section
                className="projects-lab-controls"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.34, delay: 0.08 }}
                aria-label="Project search and filters"
              >
                <label className="projects-lab-search">
                  <Search size={15} />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search builds, stacks, domains..."
                    aria-label="Search projects"
                  />
                  {searchTerm ? (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      aria-label="Clear search"
                    >
                      <X size={13} />
                    </button>
                  ) : null}
                </label>

                <div className="projects-lab-filter-strip" role="tablist" aria-label="Project categories">
                  {categories.map((category) => {
                    const active = category === selectedCategory;
                    return (
                      <button
                        key={category}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        className={active ? "is-active" : ""}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {active ? <Check size={12} /> : <Filter size={12} />}
                        {category}
                      </button>
                    );
                  })}
                </div>
              </motion.section>

              <section className="projects-list-region projects-lab-results" aria-label="Project results">
                <div className="projects-lab-results__meta">
                  <span>
                    <BriefcaseBusiness size={13} />
                    {filteredProjects.length} builds
                  </span>
                  <span>
                    <ChevronDown size={13} />
                    {selectedCategory} view
                  </span>
                </div>

                <motion.div layout className="projects-lab-scroll projects-lab-grid">
                  <AnimatePresence mode="popLayout">
                    {filteredProjects.map(({ project, meta, index }, resultIndex) => (
                      <ProjectCard
                        key={project.title}
                        project={project}
                        meta={meta}
                        index={resultIndex}
                        isLight={isLight}
                        onInspect={() => setSelectedProjectIndex(index)}
                      />
                    ))}
                  </AnimatePresence>

                  {!filteredProjects.length ? (
                    <motion.div
                      className="projects-lab-empty"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Sparkles size={18} />
                      No matching builds found.
                    </motion.div>
                  ) : null}
                </motion.div>
              </section>
            </div>
          </div>

          {hasHydrated
            ? createPortal(
                <AnimatePresence>
                  {selectedProject ? (
                    <motion.div
                      className="projects-lab-modal-overlay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setSelectedProjectIndex(null)}
                    >
                      <motion.div
                        className="projects-lab-modal"
                        data-theme={isLight ? "light" : "dark"}
                        style={
                          {
                            "--project-accent": selectedProject.meta.color,
                            "--project-glow": selectedProject.meta.glow,
                          } as CSSProperties
                        }
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="project-dialog-title"
                        initial={
                          prefersReducedMotion
                            ? { opacity: 0 }
                            : { y: 18, opacity: 0, scale: 0.98 }
                        }
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={
                          prefersReducedMotion
                            ? { opacity: 0 }
                            : { y: 12, opacity: 0, scale: 0.98 }
                        }
                        transition={{ duration: 0.22 }}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <button
                          ref={closeButtonRef}
                          type="button"
                          className="projects-lab-modal__close"
                          onClick={() => setSelectedProjectIndex(null)}
                          aria-label="Close project details"
                        >
                          <X size={14} />
                          Close
                        </button>

                        <div className="projects-lab-modal__visual">
                          <div className="projects-lab-modal__visual-media">
                            <ProjectPreview
                              project={selectedProject.project}
                              meta={selectedProject.meta}
                              isLight={isLight}
                            />
                          </div>

                          <div className="projects-lab-modal__visual-details">
                            <div className="projects-lab-modal__visual-meta">
                              <span className="projects-lab-modal__visual-badge">
                                {(() => {
                                  const Icon = selectedProject.meta.icon;
                                  return <Icon size={12} />;
                                })()}
                                {selectedProject.meta.category}
                              </span>
                              <span className="projects-lab-modal__visual-year">
                                {selectedProject.meta.year}
                              </span>
                            </div>

                            <div className="projects-lab-modal__visual-facts" aria-label="Project glance">
                              {[
                                { label: "Role", value: selectedProject.meta.role, icon: UserRound },
                                { label: "Coverage", value: selectedProject.meta.domain, icon: Compass },
                                { label: "Stack", value: `${selectedProject.meta.skills.length} tools`, icon: Layers3 },
                              ].map((fact, factIndex) => {
                                const FactIcon = fact.icon;
                                return (
                                  <motion.div
                                    key={fact.label}
                                    className="projects-lab-modal__visual-fact"
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.26, delay: 0.05 + factIndex * 0.05 }}
                                  >
                                    <FactIcon size={11} className="projects-lab-modal__visual-fact-icon" />
                                    <span className="projects-lab-modal__visual-fact-copy">
                                      <b>{fact.label}</b>
                                      <em>{fact.value}</em>
                                    </span>
                                  </motion.div>
                                );
                              })}
                            </div>

                            <div className="projects-lab-modal__visual-signals" aria-label="Highlights">
                              {selectedProject.meta.signals.map((signal) => (
                                <b key={signal}>{signal}</b>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="projects-lab-modal__content">
                          <span>
                            {selectedProject.meta.category} / {selectedProject.meta.status}
                          </span>
                          <h2 id="project-dialog-title">{selectedProject.project.title}</h2>
                          <p className="projects-lab-modal__desc">{selectedProject.project.desc}</p>

                          <div className="projects-lab-modal__facts">
                            <article>
                              <b>
                                <UserRound size={12} />
                                Role
                              </b>
                              <span>{selectedProject.meta.role}</span>
                            </article>
                            <article>
                              <b>
                                <Compass size={12} />
                                Coverage
                              </b>
                              <span>{selectedProject.meta.domain}</span>
                            </article>
                            <article>
                              <b>
                                <CalendarClock size={12} />
                                Year
                              </b>
                              <span>{selectedProject.meta.year}</span>
                            </article>
                          </div>

                          <section className="projects-lab-modal__stack-section">
                            <h3>
                              <Layers3 size={13} />
                              Tech Stack
                            </h3>
                            <div className="projects-lab-modal__stack">
                              {selectedProject.meta.skills.map((skill) => (
                                <span key={skill}>{skill}</span>
                              ))}
                            </div>
                          </section>

                          <section className="projects-lab-modal__specs">
                            <h3>
                              <ListChecks size={13} />
                              Specifications
                            </h3>
                            <p>{selectedProject.meta.impact}</p>
                          </section>

                          <section>
                            <h3>
                              <Wrench size={13} />
                              What I Shipped
                            </h3>
                            <p>{selectedProject.meta.contribution}</p>
                          </section>

                          <section className="projects-lab-modal__purpose">
                            <h3>
                              <Target size={13} />
                              Why It Matters
                            </h3>
                            <p>{selectedProject.meta.purpose}</p>
                          </section>

                          <div className="projects-lab-modal__links">
                            {selectedProject.project.links.map((link) => (
                              <a
                                key={link.label}
                                href={link.href}
                                target={link.href.startsWith("http") ? "_blank" : undefined}
                                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                              >
                                <ProjectLinkIcon label={link.label} />
                                {link.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>,
                document.body,
              )
            : null}
        </section>
      </div>
    </PageShell>
  );
}
