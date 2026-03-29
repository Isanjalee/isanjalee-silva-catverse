import Link from "next/link";
import { PawPrint } from "lucide-react";
import InProgressCat from "@/components/InProgressCat";

type InProgressPageProps = {
  title?: string;
  subtitle?: string;
};

export default function InProgressPage({
  title = "Currently Crafting This Page.",
  subtitle = "Writing clean logic. Polishing the details.",
}: InProgressPageProps) {
  return (
    <div className="relative min-h-[70vh] w-full overflow-hidden py-8">
      <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center text-center">
        <InProgressCat />

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
          Return to Universe
        </Link>
      </div>
    </div>
  );
}
