"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PawPrint, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import InProgressCat from "@/components/InProgressCat";

type InProgressPageProps = {
  eyebrow?: string;
  title?: ReactNode;
  subtitle?: string;
};

export default function InProgressPage({
  eyebrow,
  title = "Currently Crafting This Page.",
  subtitle = "Writing clean logic. Polishing the details.",
}: InProgressPageProps) {
  return (
    <div className="app-viewport-frame in-progress-viewport-frame flex h-[calc(var(--app-height)-12.5rem)] min-h-0 items-start">
      <section className="in-progress-shell card page-light-card relative flex h-full w-full min-h-0 items-center justify-center overflow-hidden p-4">
        <motion.div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(251,191,36,0.14),transparent_40%)] dark:bg-[radial-gradient(circle_at_12%_10%,rgba(251,191,36,0.1),transparent_44%)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_92%,rgba(34,211,238,0.12),transparent_38%)] dark:bg-[radial-gradient(circle_at_88%_92%,rgba(34,211,238,0.1),transparent_42%)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        />

        <motion.div
          className="in-progress-content relative z-10 mx-auto flex w-full max-w-xl flex-col items-center px-2 py-6 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <InProgressCat />

          <motion.div
            className="mb-3 mt-2 inline-flex items-center gap-2 rounded-full border border-black/14 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#5a4d3f] dark:border-white/12 dark:bg-white/6 dark:text-white/58"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Sparkles size={13} />
            {eyebrow ?? "Still In Progress"}
          </motion.div>

          <h1 className="mb-4 bg-gradient-to-b from-[var(--color-fg)] to-[var(--color-muted)] bg-clip-text text-3xl font-semibold leading-[1.2] tracking-tight text-transparent md:text-4xl">
            {title}
          </h1>

          <p className="mb-8 max-w-md text-sm leading-relaxed text-[var(--color-muted)] md:text-base">
            {subtitle}
          </p>

          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--nav-border)] px-7 py-3 text-sm font-semibold shadow-[0_4px_15px_rgba(0,0,0,0.08)] transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "var(--nav-fg)",
              color: "var(--color-bg)",
            }}
          >
            <PawPrint
              size={14}
              className="opacity-80 transition-transform group-hover:rotate-12"
            />
            Return to Home
          </Link>
        </motion.div>
      </section>

      <style>{`
        @media (max-width: 767px) {
          .in-progress-viewport-frame {
            height: auto !important;
          }

          .in-progress-shell {
            height: auto !important;
            min-height: 60vh !important;
            padding: 1.5rem 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
