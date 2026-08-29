"use client";

import { usePathname } from "next/navigation";
import BackgroundCats from "@/components/BackgroundCats";
import CatCompanion from "@/components/CatCompanion";
import CatCursor from "@/components/CatCursor";
import CursorFollower from "@/components/CursorFollower";
import FloatingCopyright from "@/components/FloatingCopyright";
import Navbar from "@/components/Navbar";
import SideDock from "@/components/SideDock";
import WeatherBackground from "@/components/WeatherBackground";
import WinterFooterScene from "@/components/WinterFooterScene";

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
