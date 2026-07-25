"use client";

import { usePathname } from "next/navigation";
import BackgroundCats from "@/components/BackgroundCats";
import CatCompanion from "@/components/CatCompanion";
import FloatingCopyright from "@/components/FloatingCopyright";
import Navbar from "@/components/Navbar";
import SideDock from "@/components/SideDock";
import WeatherBackground from "@/components/WeatherBackground";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isVaultOs =
    pathname === "/isanjalee" || pathname.startsWith("/isanjalee/");

  return (
    <>
      {!isVaultOs ? (
        <>
          <div className="mac-gradient-bg" />
          <WeatherBackground />
          <BackgroundCats />
          <SideDock />
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
        {!isVaultOs ? <CatCompanion /> : null}
        {!isVaultOs ? <FloatingCopyright /> : null}
      </div>
    </>
  );
}
