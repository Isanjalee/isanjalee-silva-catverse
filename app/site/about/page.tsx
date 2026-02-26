import PageShell from "@/components/PageShell";
import Section from "@/components/Section";
import { siteData } from "@/lib/siteData";

export default function AboutPage() {
  return (
    <PageShell>
      <Section
        title="About"
        subtitle="A short story, with calm motion and clear focus."
      />

      <div className="mt-10 card p-6">
        <div className="text-white/70 leading-relaxed space-y-3">
          {siteData.aboutParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
