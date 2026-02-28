import Link from "next/link";
import InProgressCat from "@/components/InProgressCat";

export default function NotFound() {
  return (
    <main className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="z-10 text-center max-w-xl">
        <InProgressCat />
        
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-b from-zinc-100 to-zinc-400">
          Currently Crafting This Page.
        </h1>
        
        <p className="text-zinc-500 text-sm md:text-base mb-8 max-w-md mx-auto leading-relaxed">
          Writing clean logic. Polishing the details. <br className="hidden sm:block" />
          Our feline engineer is hard at work building something special.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-zinc-900 border border-zinc-800 px-6 py-2.5 text-xs font-medium text-zinc-300 transition-all hover:bg-zinc-800 hover:border-zinc-700 hover:scale-105 active:scale-95 shadow-lg"
        >
          Return to Universe
        </Link>
      </div>

      {/* Floating background lines - intentional, not lazy */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </main>
  );
}
