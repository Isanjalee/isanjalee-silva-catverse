import Link from "next/link";
import IdentityStatus from "@/components/IdentityStatus";
import PageShell from "@/components/PageShell";
import { siteData } from "@/lib/siteData";

export default function HomePage() {
  return (
    <PageShell>
      <section className="pt-0">
        <div className="card identity-card min-h-[50vh] p-8 md:p-12">
          <div className="identity-content">
            <h1 className="identity-heading" aria-label="Isanjalee Silva">
              <span className="identity-line">ISANJALEE</span>
              <span className="identity-line">SILVA</span>
            </h1>
            <p className="identity-roles">
              AI ENGINEER <span>|</span> FULLSTACK DEVELOPER <span>|</span>{" "}
              RESEARCHER <span>|</span> DESIGNER
            </p>
            <IdentityStatus />
          </div>
        </div>
      </section>

      <section className="mt-20 grid auto-rows-fr gap-12 md:grid-cols-3">
        {siteData.highlights.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="grid-card block h-full p-6 transition hover:-translate-y-1"
          >
            <div className="grid-card__kicker text-xs uppercase tracking-[0.2em]">
              {item.kicker}
            </div>
            <div className="grid-card__title mt-4 text-2xl font-semibold tracking-tight">
              {item.title}
            </div>
            <p className="grid-card__desc mt-3 text-sm leading-relaxed">
              {item.desc}
            </p>
          </Link>
        ))}
      </section>
    </PageShell>
  );
}
