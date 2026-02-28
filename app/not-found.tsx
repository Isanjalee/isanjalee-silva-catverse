import Link from "next/link";
import InProgressCat from "@/components/InProgressCat";
import { PawPrint } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative min-h-[70vh] w-full overflow-hidden px-6 py-8">
      <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center text-center">
        <InProgressCat />

        <h1 className="pb-3 b-3 bg-gradient-to-b from-[var(--color-fg)] to-[var(--color-muted)] bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
          Currently Crafting This Page.
        </h1>

        <p className="mb-8 max-w-md text-sm leading-relaxed text-[var(--color-muted)] md:text-base">
          Writing clean logic. Polishing the details.
        </p>

        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border border-[var(--nav-border)] px-6 py-2.5 text-xs font-semibold shadow-[0_4px_15px_rgba(0,0,0,0.08)] transition-all hover:scale-105 active:scale-95"
          style={{
            backgroundColor: "var(--nav-fg)",
            color: "var(--color-bg)",
          }}
        >
          <PawPrint size={13} className="opacity-80 transition-transform group-hover:rotate-12" />
          Return to Universe
        </Link>
      </div>
    </main>
  );
}
