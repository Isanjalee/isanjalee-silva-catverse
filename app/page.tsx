import PageShell from "@/components/PageShell";
import Section from "@/components/Section";
import { siteData } from "@/lib/siteData";

export default function HomePage() {
  return (
    <PageShell>
      <Section
        title="Welcome to my Catverse"
        subtitle="Simple. Animated. Relaxing. A little playful — like a tiny universe you can breathe in."
        cta={{ label: "Take a Mind Break", href: "/mind-break" }}
      />

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {siteData.highlights.map((h) => (
          <div key={h.title} className="card p-5 shadow-soft">
            <div className="text-sm text-white/70">{h.kicker}</div>
            <div className="mt-2 text-lg font-semibold">{h.title}</div>
            <div className="mt-2 text-sm text-white/70 leading-relaxed">
              {h.desc}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 card p-6">
        <div className="text-sm text-white/70">Quick intro</div>
        <div className="mt-2 text-xl font-semibold">
          I’m Isanjalee Silva — building calm, useful software with a creative
          touch.
        </div>
        <div className="mt-3 text-white/70 leading-relaxed">
          This site keeps things minimal, but alive: smooth motion, tiny
          surprises, and a cat companion that wanders with you.
        </div>
      </div>
    </PageShell>
  );
}
