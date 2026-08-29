"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  ArrowUpRight,
  BookOpen,
  Cat,
  Clock3,
  Feather,
  PenTool,
  Rss,
  Sparkles,
} from "lucide-react";
import { useTheme } from "next-themes";
import DigitalSectionTitle from "@/components/DigitalSectionTitle";
import PageShell from "@/components/PageShell";
import { blogPosts, mediumProfileUrl } from "@/lib/blogData";

const subscribe = () => () => {};

const platformAccent: Record<string, string> = {
  medium: "rgba(251,191,36,0.88)",
  site: "rgba(34,211,238,0.86)",
};

const platformCoverIcon: Record<string, typeof PenTool> = {
  medium: Feather,
  site: PenTool,
};

function BlogCoverArt({ accent, platform }: { accent: string; platform: string }) {
  const CoverIcon = platformCoverIcon[platform] ?? BookOpen;
  return (
    <div
      className="blog-cover relative overflow-hidden rounded-xl"
      style={{ "--cover-accent": accent } as React.CSSProperties}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.14) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
        animate={{ backgroundPosition: ["0px 0px", "16px 16px"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />
      <motion.span
        className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full blur-2xl"
        style={{ background: accent }}
        animate={{ opacity: [0.24, 0.42, 0.24], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="relative flex h-full items-center justify-center"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <CoverIcon size={34} color={accent} strokeWidth={1.8} />
      </motion.div>
      <Cat
        size={16}
        className="absolute bottom-2 right-2 opacity-30"
        color={accent}
      />
    </div>
  );
}

export default function BlogPage() {
  const { resolvedTheme } = useTheme();
  const hasHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const isLight = hasHydrated && resolvedTheme !== "dark";
  const prefersReducedMotion = useReducedMotion();

  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingScrollRef = useRef(false);
  const [scrollController, setScrollController] = useState({
    progress: 0,
    scrollable: false,
    thumbSize: 1,
  });

  const tuneAlpha = (color: string, alpha: string) => color.replace(/0\.\d+\)/, `${alpha})`);

  const accentCardStyle = (color: string) =>
    isLight
      ? {
          borderColor: tuneAlpha(color, "0.32"),
          background: "linear-gradient(180deg, rgba(255,251,245,0.98), rgba(250,245,237,0.98))",
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.42), 0 12px 24px ${tuneAlpha(color, "0.13")}`,
        }
      : {
          borderColor: tuneAlpha(color, "0.4"),
          background: `radial-gradient(circle at 88% 16%, ${tuneAlpha(color, "0.2")}, transparent 42%), linear-gradient(180deg, rgba(18,18,22,0.96), rgba(8,8,11,0.94))`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.09), 0 16px 30px ${tuneAlpha(color, "0.1")}`,
        };

  const panelStyle = (color: string) =>
    isLight
      ? {
          borderColor: tuneAlpha(color, "0.32"),
          background: `radial-gradient(circle at 88% 10%, ${tuneAlpha(color, "0.14")}, transparent 42%), linear-gradient(180deg, rgba(255,251,245,0.97), rgba(247,242,235,0.95))`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.45), 0 12px 24px ${tuneAlpha(color, "0.11")}`,
        }
      : {
          borderColor: tuneAlpha(color, "0.38"),
          background: `radial-gradient(circle at 88% 10%, ${tuneAlpha(color, "0.18")}, transparent 42%), linear-gradient(180deg, rgba(18,18,22,0.96), rgba(8,8,11,0.94))`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 16px 30px ${tuneAlpha(color, "0.1")}`,
        };

  const updateScrollController = useCallback(() => {
    const surface = surfaceRef.current;
    if (!surface) return;

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
    if (!surface) return;

    const animationFrame = window.requestAnimationFrame(updateScrollController);
    const settleTimer = window.setTimeout(updateScrollController, 260);
    const resizeObserver =
      "ResizeObserver" in window ? new ResizeObserver(updateScrollController) : null;

    resizeObserver?.observe(surface);
    Array.from(surface.children).forEach((child) => resizeObserver?.observe(child));
    surface.addEventListener("scroll", updateScrollController, { passive: true });
    window.addEventListener("resize", updateScrollController);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(settleTimer);
      resizeObserver?.disconnect();
      surface.removeEventListener("scroll", updateScrollController);
      window.removeEventListener("resize", updateScrollController);
    };
  }, [updateScrollController]);

  const setScrollFromPointer = useCallback((clientY: number) => {
    const surface = surfaceRef.current;
    const controller = controllerRef.current;
    if (!surface || !controller) return;

    const rect = controller.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    surface.scrollTop = ratio * (surface.scrollHeight - surface.clientHeight);
  }, []);

  const handleScrollPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!scrollController.scrollable) return;
      isDraggingScrollRef.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setScrollFromPointer(event.clientY);
    },
    [scrollController.scrollable, setScrollFromPointer],
  );

  const handleScrollPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDraggingScrollRef.current) return;
      setScrollFromPointer(event.clientY);
    },
    [setScrollFromPointer],
  );

  const handleScrollPointerEnd = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDraggingScrollRef.current) return;
    isDraggingScrollRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const handleScrollKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      const surface = surfaceRef.current;
      if (!surface) return;

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
        surface.scrollTo({ top: surface.scrollHeight, behavior: prefersReducedMotion ? "auto" : "smooth" });
      }
    },
    [prefersReducedMotion],
  );

  return (
    <PageShell>
      <div className="blog-viewport-frame app-viewport-frame flex h-[calc(var(--app-height)-12.5rem)] min-h-0 items-start">
        <section className="blog-page-shell card page-light-card relative h-full w-full min-h-0 overflow-hidden p-3 md:p-4">
          <motion.div
            ref={surfaceRef}
            id="blog-console-surface"
            className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34 }}
          >
            <motion.header
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.34 }}
            >
              <div
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]"
                style={{
                  color: isLight ? "rgba(84,72,60,0.58)" : "rgba(255,255,255,0.62)",
                  background: isLight ? "rgba(255,255,255,0.62)" : "rgba(255,255,255,0.06)",
                  borderColor: isLight ? "rgba(90,68,41,0.1)" : "rgba(255,255,255,0.1)",
                }}
              >
                <Sparkles size={14} />
                Digital Thought Journal
              </div>

              <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h1
                    className="text-3xl font-black tracking-[-0.05em] md:text-[2.35rem]"
                    style={{ color: isLight ? "rgba(34,34,40,0.96)" : "rgba(255,255,255,0.92)" }}
                  >
                    <DigitalSectionTitle label="thoughts.log" />
                  </h1>
                  <p
                    className="blog-subtitle mt-2 max-w-2xl text-sm leading-6"
                    style={{ color: isLight ? "rgba(50,46,42,0.74)" : "rgba(245,236,225,0.78)" }}
                  >
                    Notes on building, learning, and becoming an engineer — written
                    here on the site, and on Medium.
                  </p>
                </div>
                <a
                  href={mediumProfileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-2 text-xs font-black uppercase tracking-[0.1em] transition hover:-translate-y-0.5"
                  style={accentCardStyle("rgba(251,191,36,0.88)")}
                >
                  <Rss size={13} />
                  Follow on Medium
                </a>
              </div>
            </motion.header>

            <section
              className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
              aria-label="Blog posts"
            >
              {blogPosts.map((post, index) => {
                const accent = platformAccent[post.platform] ?? "rgba(34,211,238,0.86)";
                const isInternal = post.platform === "site";
                const CardIcon = platformCoverIcon[post.platform] ?? BookOpen;
                return (
                  <motion.a
                    key={post.slug}
                    href={post.href}
                    target={isInternal ? undefined : "_blank"}
                    rel={isInternal ? undefined : "noreferrer"}
                    className="blog-card group relative flex flex-col overflow-hidden rounded-2xl border p-4"
                    style={{ ...panelStyle(accent), "--post-accent": accent } as React.CSSProperties}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.34, delay: 0.08 + index * 0.07 }}
                    whileHover={{ y: -4 }}
                  >
                    <span className="blog-card__shine" aria-hidden="true" />
                    <motion.span
                      className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl"
                      style={{ background: accent }}
                      animate={{ opacity: [0.12, 0.26, 0.12], scale: [0.9, 1.1, 0.9] }}
                      transition={{ duration: 4 + index * 0.3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="relative mb-3 h-24 w-full overflow-hidden rounded-xl">
                      <BlogCoverArt accent={accent} platform={post.platform} />
                      {index === 0 ? (
                        <span
                          className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-[0.5rem] font-black uppercase tracking-[0.1em]"
                          style={{
                            background: accent,
                            color: "#0a0c10",
                          }}
                        >
                          Latest
                        </span>
                      ) : null}
                    </div>
                    <div className="relative flex items-center justify-between gap-2">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6rem] font-black uppercase tracking-[0.12em]"
                        style={{
                          borderColor: tuneAlpha(accent, "0.42"),
                          background: tuneAlpha(accent, "0.16"),
                          color: isLight ? "rgba(50,46,42,0.82)" : "rgba(245,236,225,0.86)",
                        }}
                      >
                        <CardIcon size={11} />
                        {post.platformLabel}
                      </span>
                      {post.readTime ? (
                        <span
                          className="inline-flex items-center gap-1 text-[0.56rem] font-black uppercase tracking-[0.08em]"
                          style={{ color: isLight ? "rgba(50,46,42,0.5)" : "rgba(245,236,225,0.5)" }}
                        >
                          <Clock3 size={10} />
                          {post.readTime}
                        </span>
                      ) : (
                        <ArrowUpRight
                          size={16}
                          className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          color={isLight ? "rgba(50,46,42,0.5)" : "rgba(245,236,225,0.55)"}
                        />
                      )}
                    </div>

                    <h2
                      className="relative mt-3 text-lg font-black leading-snug tracking-[-0.02em] transition-colors"
                      style={{ color: isLight ? "rgba(34,34,40,0.94)" : "rgba(255,255,255,0.92)" }}
                    >
                      {post.title}
                    </h2>

                    <p
                      className="blog-card__excerpt relative mt-2 flex-1 text-xs leading-5"
                      style={{ color: isLight ? "rgba(50,46,42,0.72)" : "rgba(245,236,225,0.74)" }}
                    >
                      {post.excerpt}
                    </p>

                    <div className="relative mt-3 flex flex-wrap items-center gap-1.5">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border px-2 py-0.5 text-[0.56rem] font-black uppercase tracking-[0.08em]"
                          style={{
                            borderColor: tuneAlpha(accent, "0.32"),
                            background: tuneAlpha(accent, "0.08"),
                            color: isLight ? "rgba(50,46,42,0.66)" : "rgba(245,236,225,0.7)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                      <span
                        className="ml-auto inline-flex items-center gap-1 text-[0.6rem] font-black uppercase tracking-[0.08em] opacity-0 transition-opacity group-hover:opacity-100"
                        style={{ color: accent }}
                      >
                        Read
                        <ArrowUpRight size={12} />
                      </span>
                    </div>
                  </motion.a>
                );
              })}

              <motion.a
                href="/contact"
                className="blog-card group relative flex flex-col items-start justify-center gap-2 overflow-hidden rounded-2xl border border-dashed p-4"
                style={{
                  borderColor: isLight ? "rgba(251,191,36,0.32)" : "rgba(251,191,36,0.28)",
                  background: isLight
                    ? "radial-gradient(circle at 80% 15%, rgba(251,191,36,0.12), transparent 55%), rgba(255,255,255,0.45)"
                    : "radial-gradient(circle at 80% 15%, rgba(251,191,36,0.14), transparent 55%), rgba(255,255,255,0.03)",
                }}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.34, delay: 0.08 + blogPosts.length * 0.07 }}
                whileHover={{ y: -4 }}
              >
                <motion.span
                  className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl"
                  style={{ background: "rgba(251,191,36,0.7)" }}
                  animate={{ opacity: [0.1, 0.24, 0.1], scale: [0.9, 1.1, 0.9] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.span
                  className="relative"
                  animate={{ rotate: [0, -8, 0], y: [0, -2, 0] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Feather size={20} color={isLight ? "#b5820b" : "rgba(251,191,36,0.9)"} />
                </motion.span>
                <p
                  className="blog-card__excerpt relative text-xs leading-5"
                  style={{ color: isLight ? "rgba(50,46,42,0.7)" : "rgba(245,236,225,0.72)" }}
                >
                  More native posts are on the way. Got a topic you&apos;d like me to
                  write about? Tell me — I&apos;m always up for a good idea.
                </p>
                <span
                  className="relative mt-1 inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.08em]"
                  style={{ color: isLight ? "#b5820b" : "rgba(251,191,36,0.9)" }}
                >
                  Suggest a topic
                  <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </motion.a>
            </section>
          </motion.div>

          <div
            ref={controllerRef}
            className="blog-mobile-scroll-controller"
            data-visible={scrollController.scrollable ? "true" : "false"}
            role="scrollbar"
            aria-label="Scroll blog console"
            aria-controls="blog-console-surface"
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
                "--blog-scroll-thumb-size": `${scrollController.thumbSize * 100}%`,
                "--blog-scroll-thumb-top": `${
                  scrollController.progress * (1 - scrollController.thumbSize) * 100
                }%`,
              } as React.CSSProperties
            }
          >
            <span className="blog-mobile-scroll-controller__thumb" />
          </div>
        </section>
      </div>

      <style>{`
        #blog-console-surface {
          overscroll-behavior: contain;
          scrollbar-width: none;
        }

        #blog-console-surface::-webkit-scrollbar {
          display: none;
          width: 0;
        }

        .blog-mobile-scroll-controller {
          display: none;
        }

        @media (max-width: 768px) {
          .blog-mobile-scroll-controller[data-visible="true"] {
            position: absolute;
            top: 1rem;
            right: 0.34rem;
            bottom: 1rem;
            z-index: 28;
            display: block;
            width: 0.46rem;
            overflow: hidden;
            border: 1px solid rgba(251, 191, 36, 0.24);
            border-radius: 999px;
            background: color-mix(in srgb, var(--color-bg) 86%, #78350f);
            box-shadow:
              inset 0 0 0 1px rgba(251, 191, 36, 0.06),
              0 0 0.32rem rgba(251, 191, 36, 0.08);
            cursor: ns-resize;
            opacity: 0.58;
            touch-action: none;
            transition:
              opacity 160ms ease,
              border-color 160ms ease,
              box-shadow 160ms ease;
          }

          .blog-mobile-scroll-controller__thumb {
            position: absolute;
            top: var(--blog-scroll-thumb-top);
            right: 0.06rem;
            left: 0.06rem;
            display: block;
            height: var(--blog-scroll-thumb-size);
            min-height: 2.15rem;
            max-height: 22%;
            border-radius: 999px;
            background: linear-gradient(180deg, #fde68a 0%, #fbbf24 52%, #22d3ee 100%);
            box-shadow:
              inset 0 0 0 1px rgba(255, 255, 255, 0.24),
              0 0 0.28rem rgba(251, 191, 36, 0.28);
            pointer-events: none;
            transition:
              top 90ms linear,
              box-shadow 170ms ease,
              filter 170ms ease;
          }

          .blog-mobile-scroll-controller:hover,
          .blog-mobile-scroll-controller:focus-visible {
            border-color: rgba(251, 191, 36, 0.38);
            opacity: 0.86;
            outline: none;
          }

          .blog-mobile-scroll-controller:hover .blog-mobile-scroll-controller__thumb,
          .blog-mobile-scroll-controller:focus-visible .blog-mobile-scroll-controller__thumb {
            filter: brightness(1.08) saturate(1.08);
          }
        }

        #blog-console-surface > header,
        #blog-console-surface > a,
        #blog-console-surface > section {
          flex: none;
        }

        .blog-cover {
          width: 100%;
          height: 100%;
          background: linear-gradient(145deg, color-mix(in srgb, var(--cover-accent) 22%, transparent), color-mix(in srgb, var(--cover-accent) 6%, transparent)), rgba(255, 255, 255, 0.03);
        }

        html:not(.dark) .blog-cover {
          background: linear-gradient(145deg, color-mix(in srgb, var(--cover-accent) 18%, transparent), color-mix(in srgb, var(--cover-accent) 5%, transparent)), rgba(255, 255, 255, 0.5);
        }

        .blog-card {
          transition:
            transform 0.28s cubic-bezier(0.25, 0.8, 0.25, 1),
            border-color 0.28s ease,
            box-shadow 0.28s ease;
        }

        .blog-card:hover {
          border-color: color-mix(in srgb, var(--post-accent, rgba(251,191,36,0.7)) 60%, transparent);
          box-shadow: 0 18px 36px -14px color-mix(in srgb, var(--post-accent, rgba(251,191,36,0.7)) 40%, transparent);
        }

        .blog-card:hover h2 {
          color: color-mix(in srgb, var(--post-accent, #fbbf24) 90%, white);
        }

        html:not(.dark) .blog-card:hover h2 {
          color: color-mix(in srgb, var(--post-accent, #fbbf24) 60%, #1c2026);
        }

        .blog-card__shine {
          pointer-events: none;
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(105deg, transparent 0 34%, rgba(255, 255, 255, 0.14) 45%, transparent 57% 100%);
          opacity: 0;
          transform: translateX(-70%);
        }

        .blog-card:hover .blog-card__shine {
          opacity: 1;
          animation: blogCardShine 0.85s ease-out;
        }

        @keyframes blogCardShine {
          from { transform: translateX(-70%); }
          to { transform: translateX(72%); }
        }

        .blog-card__excerpt {
          text-align: justify;
          text-justify: inter-word;
          hyphens: auto;
        }

        .blog-subtitle {
          text-align: justify;
          text-justify: inter-word;
        }

        @media (prefers-reduced-motion: reduce) {
          .blog-mobile-scroll-controller__thumb,
          .blog-card__shine {
            transition: none;
            animation: none;
          }
        }
      `}</style>
    </PageShell>
  );
}
