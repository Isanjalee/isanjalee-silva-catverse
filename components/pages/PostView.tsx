"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
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
  ArrowLeft,
  BookOpen,
  Cat,
  Clock3,
  Cloud,
  Gamepad2,
  Layers,
  PawPrint,
  Quote,
  Sparkles,
} from "lucide-react";
import { useTheme } from "next-themes";
import PageShell from "@/components/PageShell";
import type { BlogPost } from "@/lib/blogData";

const subscribe = () => () => {};

const accentCycle = [
  "rgba(34,211,238,0.86)",
  "rgba(251,191,36,0.88)",
  "rgba(163,230,53,0.88)",
  "rgba(192,132,252,0.86)",
];

const catLines = [
  "Purring at clean code.",
  "Approves this scroll speed.",
  "Reading between the lines.",
  "Chasing a bug — brb.",
];

const builtWith = [
  { label: "Next.js 16", color: accentCycle[0] },
  { label: "Tailwind v4", color: accentCycle[1] },
  { label: "Framer Motion", color: accentCycle[2] },
  { label: "TypeScript", color: accentCycle[3] },
];

const highlights = [
  { icon: Layers, text: "One console-styled system across every page", color: accentCycle[0] },
  { icon: Cloud, text: "Live seasonal + time-of-day backgrounds", color: accentCycle[1] },
  { icon: Gamepad2, text: "A cat mini-game hidden inside the site", color: accentCycle[2] },
];

export default function PostView({ post }: { post: BlogPost }) {
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
  const [catLineIndex, setCatLineIndex] = useState(0);

  const zoomWrapRef = useRef<HTMLDivElement | null>(null);
  const appliedZoomRef = useRef(1);
  const [fitZoom, setFitZoom] = useState(1);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCatLineIndex((current) => (current + 1) % catLines.length);
    }, 3200);
    return () => window.clearInterval(interval);
  }, []);

  const tuneAlpha = (color: string, alpha: string) => color.replace(/0\.\d+\)/, `${alpha})`);
  const accent = "rgba(34,211,238,0.86)";

  const panelStyle = isLight
    ? {
        borderColor: tuneAlpha(accent, "0.32"),
        background: `radial-gradient(circle at 88% 10%, ${tuneAlpha(accent, "0.14")}, transparent 42%), linear-gradient(180deg, rgba(255,251,245,0.97), rgba(247,242,235,0.95))`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.45), 0 12px 24px ${tuneAlpha(accent, "0.11")}`,
      }
    : {
        borderColor: tuneAlpha(accent, "0.38"),
        background: `radial-gradient(circle at 88% 10%, ${tuneAlpha(accent, "0.18")}, transparent 42%), linear-gradient(180deg, rgba(18,18,22,0.96), rgba(8,8,11,0.94))`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 16px 30px ${tuneAlpha(accent, "0.1")}`,
      };

  const content = post.content ?? [];
  const pullQuoteIndex = content.length >= 4 ? Math.floor(content.length / 2) : -1;

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

  const measureFit = useCallback(() => {
    const surface = surfaceRef.current;
    const wrap = zoomWrapRef.current;
    if (!surface || !wrap) return;

    if (window.innerWidth < 768) {
      if (appliedZoomRef.current !== 1) {
        appliedZoomRef.current = 1;
        setFitZoom(1);
      }
      return;
    }

    const available = surface.clientHeight;
    if (!available) return;

    const FLOOR = 0.62;
    const priorZoom = wrap.style.zoom;
    const measureAt = (z: number) => {
      wrap.style.zoom = String(z);
      return wrap.getBoundingClientRect().height;
    };

    let finalZoom = 1;
    if (measureAt(1) <= available) {
      finalZoom = 1;
    } else if (measureAt(FLOOR) > available) {
      finalZoom = FLOOR;
    } else {
      let lo = FLOOR;
      let hi = 1;
      for (let i = 0; i < 8; i += 1) {
        const mid = (lo + hi) / 2;
        if (measureAt(mid) > available) {
          hi = mid;
        } else {
          lo = mid;
        }
      }
      finalZoom = lo;
    }

    finalZoom = Number(finalZoom.toFixed(3));
    wrap.style.zoom = priorZoom;

    if (Math.abs(finalZoom - appliedZoomRef.current) > 0.004) {
      appliedZoomRef.current = finalZoom;
      setFitZoom(finalZoom);
    }
  }, []);

  useEffect(() => {
    const surface = surfaceRef.current;
    const wrap = zoomWrapRef.current;
    if (!surface || !wrap) return;
    const animationFrame = window.requestAnimationFrame(measureFit);
    const settleTimer = window.setTimeout(measureFit, 260);
    document.fonts?.ready?.then(measureFit).catch(() => {});
    const resizeObserver =
      "ResizeObserver" in window ? new ResizeObserver(measureFit) : null;
    resizeObserver?.observe(surface);
    resizeObserver?.observe(wrap);
    window.addEventListener("resize", measureFit);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(settleTimer);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", measureFit);
    };
  }, [measureFit]);

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
      <div className="blogpost-viewport-frame app-viewport-frame flex h-[calc(var(--app-height)-12.5rem)] min-h-0 items-start">
        <section className="blogpost-page-shell card page-light-card relative h-full w-full min-h-0 overflow-hidden p-3 md:p-4">
          <motion.div
            ref={surfaceRef}
            id="blogpost-console-surface"
            className="h-full min-h-0 overflow-y-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34 }}
          >
          <div
            ref={zoomWrapRef}
            className="flex flex-col gap-3"
            style={{ zoom: fitZoom }}
          >
            <div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.1em] transition hover:-translate-x-0.5"
                style={{ color: isLight ? "rgba(50,46,42,0.6)" : "rgba(245,236,225,0.62)" }}
              >
                <ArrowLeft size={13} />
                All Posts
              </Link>
            </div>

            <motion.article
              className="blogpost-article relative overflow-hidden rounded-2xl border p-5 md:p-8"
              style={panelStyle}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <motion.span
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
                style={{ background: accent }}
                animate={{ opacity: [0.08, 0.18, 0.08], scale: [0.9, 1.08, 0.9] }}
                transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage: isLight
                    ? "radial-gradient(circle, rgba(76,59,42,0.09) 1px, transparent 1px)"
                    : "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                  opacity: 0.5,
                }}
              />

              <div className="blogpost-layout relative lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-6">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.58rem] font-black uppercase tracking-[0.12em]"
                      style={{
                        borderColor: tuneAlpha(accent, "0.42"),
                        background: tuneAlpha(accent, "0.16"),
                        color: isLight ? "rgba(50,46,42,0.82)" : "rgba(245,236,225,0.86)",
                      }}
                    >
                      <BookOpen size={11} />
                      {post.platformLabel}
                    </span>
                    {post.readTime ? (
                      <span
                        className="inline-flex items-center gap-1 text-[0.6rem] font-black uppercase tracking-[0.1em]"
                        style={{ color: isLight ? "rgba(50,46,42,0.5)" : "rgba(245,236,225,0.5)" }}
                      >
                        <Clock3 size={11} />
                        {post.readTime}
                      </span>
                    ) : null}
                    {post.tags.map((tag, tagIndex) => {
                      const tagAccent = accentCycle[tagIndex % accentCycle.length];
                      return (
                        <span
                          key={tag}
                          className="rounded-full border px-2 py-0.5 text-[0.56rem] font-black uppercase tracking-[0.08em]"
                          style={{
                            borderColor: tuneAlpha(tagAccent, "0.4"),
                            background: tuneAlpha(tagAccent, "0.12"),
                            color: isLight ? "rgba(50,46,42,0.7)" : "rgba(245,236,225,0.76)",
                          }}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>

                  <h1
                    className="mt-4 font-black leading-[1.14] tracking-[-0.03em]"
                    style={{
                      color: isLight ? "rgba(34,34,40,0.96)" : "rgba(255,255,255,0.94)",
                      fontSize: "clamp(1.35rem, 4.4vw, 2.15rem)",
                    }}
                  >
                    {post.title}
                  </h1>

                  <div
                    className="mt-2 h-[3px] w-16 rounded-full"
                    style={{
                      background: "linear-gradient(90deg, #22d3ee, #a3e635, #fbbf24, #c084fc)",
                    }}
                  />

                  <div className="blogpost-body mt-6 grid gap-5">
                    {content.map((paragraph, index) => {
                      if (index === 0) {
                        return (
                          <motion.p
                            key={index}
                            className="blogpost-lede"
                            style={{ color: isLight ? "rgba(38,33,28,0.9)" : "rgba(255,255,255,0.92)" }}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            {paragraph}
                          </motion.p>
                        );
                      }

                      if (index === pullQuoteIndex) {
                        const quoteAccent = accentCycle[1];
                        return (
                          <motion.blockquote
                            key={index}
                            className="blogpost-pullquote relative overflow-hidden rounded-xl border-l-4 p-4"
                            style={{
                              borderColor: quoteAccent,
                              background: isLight
                                ? `linear-gradient(90deg, ${tuneAlpha(quoteAccent, "0.12")}, transparent)`
                                : `linear-gradient(90deg, ${tuneAlpha(quoteAccent, "0.14")}, transparent)`,
                            }}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 + index * 0.04 }}
                          >
                            <Quote
                              size={26}
                              className="mb-1 opacity-70"
                              color={quoteAccent}
                              fill={quoteAccent}
                            />
                            <p
                              className="text-base font-semibold leading-8 md:text-lg"
                              style={{ color: isLight ? "rgba(34,34,40,0.92)" : "rgba(255,255,255,0.94)" }}
                            >
                              {paragraph}
                            </p>
                          </motion.blockquote>
                        );
                      }

                      return (
                        <motion.p
                          key={index}
                          className="blogpost-paragraph"
                          style={{ color: isLight ? "rgba(50,46,42,0.82)" : "rgba(245,236,225,0.84)" }}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 + index * 0.04 }}
                        >
                          {paragraph}
                        </motion.p>
                      );
                    })}
                  </div>

                  <div
                    className="mt-7 flex flex-wrap items-center gap-2 rounded-xl border p-3"
                    style={{
                      borderColor: isLight ? "rgba(90,68,41,0.14)" : "rgba(255,255,255,0.1)",
                      background: isLight ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.03)",
                    }}
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                      style={{ background: tuneAlpha(accent, "0.18") }}
                    >
                      <Cat size={16} color={accent} />
                    </span>
                    <div className="text-xs font-semibold" style={{ color: isLight ? "rgba(50,46,42,0.68)" : "rgba(245,236,225,0.72)" }}>
                      Written by <strong style={{ color: isLight ? "rgba(34,34,40,0.9)" : "rgba(255,255,255,0.9)" }}>Isanjalee Silva</strong>
                    </div>
                    <Sparkles size={12} color={accent} className="ml-auto" />
                  </div>
                </div>

                <aside className="blogpost-rail mt-6 hidden lg:mt-0 lg:flex lg:flex-col lg:gap-3">
                  <div
                    className="blogpost-cat-card relative overflow-hidden rounded-xl border p-4 text-center"
                    style={{
                      borderColor: tuneAlpha(accent, "0.34"),
                      background: isLight
                        ? `radial-gradient(circle at 50% 0%, ${tuneAlpha(accent, "0.14")}, transparent 60%), rgba(255,255,255,0.5)`
                        : `radial-gradient(circle at 50% 0%, ${tuneAlpha(accent, "0.16")}, transparent 60%), rgba(255,255,255,0.03)`,
                    }}
                  >
                    <motion.div
                      className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
                      style={{ background: tuneAlpha(accent, "0.16") }}
                      animate={prefersReducedMotion ? undefined : { y: [0, -4, 0], rotate: [-4, 4, -4] }}
                      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Cat size={26} color={accent} />
                    </motion.div>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={catLineIndex}
                        className="mt-2 text-[0.66rem] font-semibold leading-4"
                        style={{ color: isLight ? "rgba(50,46,42,0.7)" : "rgba(245,236,225,0.74)" }}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.24 }}
                      >
                        {catLines[catLineIndex]}
                      </motion.p>
                    </AnimatePresence>
                  </div>

                  <div
                    className="rounded-xl border p-4"
                    style={{
                      borderColor: isLight ? "rgba(90,68,41,0.14)" : "rgba(255,255,255,0.1)",
                      background: isLight ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.03)",
                    }}
                  >
                    <div className="text-[0.58rem] font-black uppercase tracking-[0.14em]" style={{ color: isLight ? "rgba(50,46,42,0.55)" : "rgba(245,236,225,0.55)" }}>
                      Built With
                    </div>
                    <div className="mt-2.5 flex flex-col gap-1.5">
                      {builtWith.map((item) => (
                        <span key={item.label} className="flex items-center gap-2 text-[0.68rem] font-semibold" style={{ color: isLight ? "rgba(50,46,42,0.78)" : "rgba(245,236,225,0.82)" }}>
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: item.color }} />
                          {item.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    className="rounded-xl border p-4"
                    style={{
                      borderColor: isLight ? "rgba(90,68,41,0.14)" : "rgba(255,255,255,0.1)",
                      background: isLight ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.03)",
                    }}
                  >
                    <div className="text-[0.58rem] font-black uppercase tracking-[0.14em]" style={{ color: isLight ? "rgba(50,46,42,0.55)" : "rgba(245,236,225,0.55)" }}>
                      On This Site
                    </div>
                    <div className="mt-2.5 flex flex-col gap-2.5">
                      {highlights.map((item) => {
                        const Icon = item.icon;
                        return (
                          <span key={item.text} className="flex items-start gap-2 text-[0.64rem] font-medium leading-4" style={{ color: isLight ? "rgba(50,46,42,0.72)" : "rgba(245,236,225,0.76)" }}>
                            <Icon size={13} className="mt-0.5 shrink-0" color={item.color} />
                            {item.text}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </aside>
              </div>
            </motion.article>

            <Link
              href="/blog"
              className="group inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-black uppercase tracking-[0.1em] transition hover:-translate-y-0.5"
              style={panelStyle}
            >
              <PawPrint size={13} className="transition-transform group-hover:rotate-12" />
              Back to All Posts
            </Link>
          </div>
          </motion.div>

          <div
            ref={controllerRef}
            className="blogpost-mobile-scroll-controller"
            data-visible={scrollController.scrollable ? "true" : "false"}
            role="scrollbar"
            aria-label="Scroll article"
            aria-controls="blogpost-console-surface"
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
                "--blogpost-scroll-thumb-size": `${scrollController.thumbSize * 100}%`,
                "--blogpost-scroll-thumb-top": `${
                  scrollController.progress * (1 - scrollController.thumbSize) * 100
                }%`,
              } as React.CSSProperties
            }
          >
            <span className="blogpost-mobile-scroll-controller__thumb" />
          </div>
        </section>
      </div>

      <style>{`
        #blogpost-console-surface {
          overscroll-behavior: contain;
          scrollbar-width: none;
        }

        #blogpost-console-surface::-webkit-scrollbar {
          display: none;
          width: 0;
        }

        #blogpost-console-surface > div > div,
        #blogpost-console-surface > div > article,
        #blogpost-console-surface > div > a {
          flex: none;
        }

        .blogpost-lede {
          font-size: 1.02rem;
          font-weight: 500;
          line-height: 1.75;
          text-align: justify;
          text-justify: inter-word;
        }

        .blogpost-paragraph {
          font-size: 0.9rem;
          font-weight: 420;
          line-height: 1.75;
          text-align: justify;
          text-justify: inter-word;
          hyphens: auto;
        }

        .blogpost-pullquote {
          text-align: left;
        }

        .blogpost-mobile-scroll-controller {
          display: none;
        }

        @media (max-width: 768px) {
          .blogpost-mobile-scroll-controller[data-visible="true"] {
            position: absolute;
            top: 1rem;
            right: 0.34rem;
            bottom: 1rem;
            z-index: 28;
            display: block;
            width: 0.46rem;
            overflow: hidden;
            border: 1px solid rgba(34, 211, 238, 0.24);
            border-radius: 999px;
            background: color-mix(in srgb, var(--color-bg) 86%, #0e4f5c);
            cursor: ns-resize;
            opacity: 0.58;
            touch-action: none;
            transition: opacity 160ms ease, border-color 160ms ease;
          }

          .blogpost-mobile-scroll-controller__thumb {
            position: absolute;
            top: var(--blogpost-scroll-thumb-top);
            right: 0.06rem;
            left: 0.06rem;
            display: block;
            height: var(--blogpost-scroll-thumb-size);
            min-height: 2.15rem;
            max-height: 22%;
            border-radius: 999px;
            background: linear-gradient(180deg, #67e8f9 0%, #22d3ee 52%, #a3e635 100%);
            pointer-events: none;
            transition: top 90ms linear;
          }

          .blogpost-mobile-scroll-controller:hover,
          .blogpost-mobile-scroll-controller:focus-visible {
            opacity: 0.86;
            outline: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .blogpost-mobile-scroll-controller__thumb {
            transition: none;
          }
        }
      `}</style>
    </PageShell>
  );
}
