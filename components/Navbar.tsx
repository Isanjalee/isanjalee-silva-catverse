"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cat, Sun, Moon, PawPrint, Music2 } from "lucide-react";
import { useTheme } from "next-themes";
import BackgroundAudio from "@/components/BackgroundAudio";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/mind-break", label: "Mind Break" },
];

const subscribe = () => () => {};

export default function Navbar() {
  const pathname = usePathname();
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const { theme, setTheme } = useTheme();
  const [isMusicPlaying, setIsMusicPlaying] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("catverse-music-enabled") === "true";
  });

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("catverse-music-enabled", isMusicPlaying.toString());
  }, [hydrated, isMusicPlaying]);

  const showMusicState = hydrated && isMusicPlaying;

  return (
    <>
      <BackgroundAudio isPlaying={showMusicState} />
      <header className="sticky top-6 z-50 mx-auto mt-6 w-full max-w-5xl px-5 transition-all duration-300">
        <div
          className="flex w-full items-center justify-between rounded-full border px-3 py-2.5 backdrop-blur shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-colors duration-300 dark:shadow-none"
          style={{
            backgroundColor: "var(--nav-bg)",
            borderColor: "var(--nav-border)",
          }}
        >
          <div className="flex items-center pl-3">
            <Link
              href="/"
              className="group flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: "var(--nav-fg)" }}
            >
              <Cat
                size={18}
                className="opacity-80 transition-transform group-hover:scale-110 group-hover:opacity-100"
              />
              <span className="hidden sm:inline-block">Isanjalee Silva</span>
            </Link>
          </div>

          <nav className="hidden items-center justify-center gap-1 md:flex">
            {nav.map((n) => {
              const isActive =
                pathname === n.href ||
                (n.href !== "/" && pathname.startsWith(n.href));
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className="relative rounded-full px-4 py-1.5 text-xs font-medium transition-all"
                  style={{
                    color: isActive ? "var(--nav-fg)" : "var(--nav-fg-muted)",
                    backgroundColor: isActive
                      ? "var(--nav-bg-active)"
                      : "transparent",
                  }}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 pr-1">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{ color: "var(--nav-fg-muted)" }}
              aria-label="Toggle theme"
            >
              {hydrated ? (
                theme === "dark" ? (
                  <Sun size={16} />
                ) : (
                  <Moon size={16} />
                )
              ) : null}
            </button>

            <button
              onClick={() => setIsMusicPlaying((value) => !value)}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{
                color: showMusicState ? "var(--nav-fg)" : "var(--nav-fg-muted)",
              }}
              aria-label="Toggle music"
            >
              <div className="relative">
                <Music2
                  size={15}
                  className={`transition-transform duration-300 ${showMusicState ? "scale-110" : ""}`}
                />
                {showMusicState ? (
                  <span className="absolute -right-1 -top-1 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-35" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
                  </span>
                ) : null}
              </div>
            </button>

            <Link
              href="/contact"
              className="group ml-1 flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold shadow-[0_4px_15px_rgba(0,0,0,0.08)] transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: "var(--nav-fg)",
                color: "var(--color-bg)",
                borderColor: "var(--nav-border)",
              }}
            >
              <PawPrint
                size={13}
                className="opacity-80 transition-transform group-hover:rotate-12"
              />
              <span>Let&apos;s Chat</span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
