import Link from "next/link";
import PageShell from "@/components/PageShell";
import { siteData } from "@/lib/siteData";

export default function HomePage() {
  return (
    <PageShell>
      <section className="pt-6">
        <div className="card p-8 md:p-10">
          <div className="text-xs uppercase tracking-[0.25em] text-black/45 dark:text-white/45">
            Catverse
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Isanjalee Silva
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-black/70 dark:text-[#f5ece1]/70 md:text-base">
            A personal cat-themed portfolio with calm visuals, lightweight
            motion, selected work, and a playful mind-break built into the
            experience.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="rounded-full border border-black/10 bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 dark:border-white/10 dark:bg-white dark:text-black"
            >
              View Projects
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-black/10 bg-black/5 px-5 py-2.5 text-sm font-medium text-black/85 transition hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-[#f5ece1]/85 dark:hover:bg-white/10"
            >
              About Me
            </Link>
            <Link
              href="/mind-break"
              className="rounded-full border border-black/10 bg-black/5 px-5 py-2.5 text-sm font-medium text-black/85 transition hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-[#f5ece1]/85 dark:hover:bg-white/10"
            >
              Mind Break
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {siteData.highlights.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="card block p-6 transition hover:-translate-y-1"
          >
            <div className="text-xs uppercase tracking-[0.2em] text-black/45 dark:text-white/45">
              {item.kicker}
            </div>
            <div className="mt-3 text-xl font-semibold">{item.title}</div>
            <p className="mt-3 text-sm leading-relaxed text-black/70 dark:text-[#f5ece1]/70">
              {item.desc}
            </p>
          </Link>
        ))}
      </section>
    </PageShell>
  );
}
