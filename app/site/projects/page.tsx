import PageShell from "@/components/PageShell";
import Section from "@/components/Section";
import { siteData } from "@/lib/siteData";

export default function ProjectsPage() {
  return (
    <PageShell>
      <Section
        title="Projects"
        subtitle="A few things I’ve built and improved."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {siteData.projects.map((p: any) => (
          <div key={p.title} className="card p-6 shadow-soft">
            <div className="text-xs text-white/60">{p.tag}</div>
            <div className="mt-2 text-lg font-semibold">{p.title}</div>
            <div className="mt-2 text-sm text-white/70 leading-relaxed">
              {p.desc}
            </div>
            {p.links?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {p.links.map((l: any) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80 hover:bg-white/5"
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </PageShell>
  );
}
