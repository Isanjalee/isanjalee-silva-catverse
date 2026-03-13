import PageShell from "@/components/PageShell";
import Section from "@/components/Section";
import { siteData } from "@/lib/siteData";

export default function ContactPage() {
  return (
    <PageShell>
      <Section title="Contact" subtitle="Say hi. Keep it simple." />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="card p-6">
          <div className="text-sm text-white/70">Email</div>
          <div className="mt-2 text-lg font-semibold">{siteData.email}</div>

          <div className="mt-6 text-sm text-white/70">Links</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {siteData.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80 hover:bg-white/5"
                target="_blank"
                rel="noreferrer"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="text-sm text-white/70">Quick message</div>
          <div className="mt-3 text-sm leading-relaxed text-white/70">
            If you want a proper contact form later, we can add it with free
            options like Formspree, Google Forms, or a server action.
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            The fastest contact path is email, with socials as backup.
          </div>
        </div>
      </div>
    </PageShell>
  );
}
