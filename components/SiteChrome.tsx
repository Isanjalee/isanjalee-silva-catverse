"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import FloatingCopyright from "@/components/FloatingCopyright";
import Navbar from "@/components/Navbar";

// These are purely decorative, client-only overlays (fixed-position
// backgrounds, cursors, companions) — none of them render anything a
// crawler or first paint needs. Splitting them into their own chunks (and
// skipping SSR for them, since they're already gated behind hydration
// checks internally) keeps them out of the JS every page has to parse and
// run before it becomes interactive, without changing what ends up on
// screen once they mount a beat later.
const BackgroundCats = dynamic(() => import("@/components/BackgroundCats"), {
  ssr: false,
});
const CatCompanion = dynamic(() => import("@/components/CatCompanion"), {
  ssr: false,
});
const CatCursor = dynamic(() => import("@/components/CatCursor"), {
  ssr: false,
});
const CursorFollower = dynamic(() => import("@/components/CursorFollower"), {
  ssr: false,
});
const SideDock = dynamic(() => import("@/components/SideDock"), {
  ssr: false,
});
const WeatherBackground = dynamic(
  () => import("@/components/WeatherBackground"),
  { ssr: false },
);
const WinterFooterScene = dynamic(
  () => import("@/components/WinterFooterScene"),
  { ssr: false },
);

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isVaultOs =
    pathname === "/isanjalee" || pathname.startsWith("/isanjalee/");
  const isGamePage =
    pathname === "/mind-break" || pathname.startsWith("/mind-break/");

  return (
    <>
      {!isVaultOs ? (
        <>
          <div className="mac-gradient-bg" />
          <WeatherBackground />
          {!isGamePage ? <WinterFooterScene /> : null}
          <BackgroundCats />
          <SideDock />
          <CatCursor />
          <CursorFollower />
        </>
      ) : null}
      <div className="site-frame relative z-10 flex min-h-screen flex-col">
        {!isVaultOs ? <Navbar /> : null}
        <main
          className={`site-main flex min-h-0 w-full flex-1 flex-col ${
            isVaultOs
              ? "max-w-none p-0"
              : "mx-auto max-w-5xl px-5 pb-10 pt-6"
          }`}
        >
          {children}
        </main>
        {!isVaultOs && !isGamePage ? <CatCompanion /> : null}
        {!isVaultOs ? <FloatingCopyright /> : null}
      </div>
    </>
  );
}
