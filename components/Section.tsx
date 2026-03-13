"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Section({
  title,
  subtitle,
  cta,
}: {
  title: string;
  subtitle?: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="pt-6">
      <motion.h1
        className="text-3xl font-semibold tracking-tight md:text-4xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {title}
      </motion.h1>

      {subtitle ? (
        <motion.p
          className="mt-3 max-w-2xl leading-relaxed text-black/70 dark:text-[#f5ece1]/70"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          {subtitle}
        </motion.p>
      ) : null}

      {cta ? (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
        >
          <Link
            href={cta.href}
            className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-black/5 px-5 py-2 text-sm text-black/85 hover:bg-black/10 dark:border-white/15 dark:bg-white/5 dark:text-[#f5ece1]/85 dark:hover:bg-white/10"
          >
            {cta.label}
            <span className="text-black/50 dark:text-white/40">-&gt;</span>
          </Link>
        </motion.div>
      ) : null}
    </div>
  );
}
