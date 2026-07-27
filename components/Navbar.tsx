"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sun,
  Moon,
  PawPrint,
  Music2,
  Menu,
  X,
  TreePalm,
  Leaf,
  Flower2,
} from "lucide-react";
import { useTheme } from "next-themes";
import BackgroundAudio, {
  prepareAmbientAudio,
} from "@/components/BackgroundAudio";
import PrivateSignalVault from "@/components/PrivateSignalVault";
import VaultViewportNotice from "@/components/VaultViewportNotice";
import { useWeather } from "@/components/WeatherProvider";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/gallery", label: "Gallery" },
  { href: "/mind-break", label: "Games" },
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
  const { season, nextSeason } = useWeather();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isVaultViewportNoticeOpen, setIsVaultViewportNoticeOpen] =
    useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("catverse-music-enabled") === "true";
  });

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("catverse-music-enabled", isMusicPlaying.toString());
  }, [hydrated, isMusicPlaying]);

  const showMusicState = hydrated && isMusicPlaying;
  const seasonLabel =
    season === "tropical"
      ? "Tropical Sri Lanka"
      : season === "autumn"
        ? "Autumn - next life age"
        : "Spring - beauty of life";
  const SeasonIcon =
    season === "tropical"
      ? TreePalm
      : season === "autumn"
        ? Leaf
        : Flower2;

  if (pathname === "/isanjalee" || pathname.startsWith("/isanjalee/")) {
    return null;
  }

  return (
    <>
      <BackgroundAudio isPlaying={showMusicState} />
      <PrivateSignalVault
        open={isVaultOpen}
        onRequestClose={() => setIsVaultOpen(false)}
      />
      {isVaultViewportNoticeOpen ? (
        <VaultViewportNotice
          mode="dialog"
          onClose={() => setIsVaultViewportNoticeOpen(false)}
        />
      ) : null}
      <header className="site-navbar sticky top-6 z-50 mx-auto mt-6 w-full max-w-6xl px-5 transition-all duration-300">
        <div className="navbar-pill-layout min-w-0 w-full">
          <div
            className="navbar-logo-pill min-w-0 rounded-full border backdrop-blur transition-colors duration-300"
            style={{
              backgroundColor: "var(--nav-bg)",
              borderColor: "var(--nav-border)",
            }}
          >
            <Link
              href="/isanjalee"
              onClick={(event) => {
                event.preventDefault();
                setIsMenuOpen(false);
                if (window.innerWidth < 768) {
                  setIsVaultViewportNoticeOpen(true);
                  return;
                }
                setIsVaultOpen(true);
              }}
              className="navbar-brand-logo group"
              aria-label="Open Isanjalee private signal vault"
            >
              <span className="navbar-logo-mark" aria-hidden="true">
                <Image
                  src="/brand/isanjalee-wordmark-light.png"
                  alt="Isanjalee Silva"
                  width={220}
                  height={113}
                  priority
                  className="navbar-logo-image navbar-logo-image--light"
                />
                <Image
                  src="/brand/isanjalee-wordmark-dark.png"
                  alt=""
                  width={220}
                  height={112}
                  priority
                  className="navbar-logo-image navbar-logo-image--dark"
                />
              </span>
            </Link>
          </div>

          <div
            className="navbar-main-pill min-w-0 rounded-full border backdrop-blur transition-colors duration-300"
            style={{
              backgroundColor: "var(--nav-bg)",
              borderColor: "var(--nav-border)",
            }}
          >
          <nav className="hidden items-center justify-center gap-1 lg:flex">
            {nav.map((n) => {
              const isActive =
                pathname === n.href ||
                (n.href !== "/" && pathname.startsWith(n.href));
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className="relative whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-all"
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
              type="button"
              onClick={nextSeason}
              className="season-control navbar-season-control flex h-8 items-center justify-center gap-1.5 rounded-full px-2 transition-all hover:bg-black/5 dark:hover:bg-white/5"
              data-season={season}
              style={{ color: "var(--nav-fg-muted)" }}
              aria-label={`${seasonLabel}. Change season`}
              title={`${seasonLabel} — click to change`}
            >
              <SeasonIcon size={15} />
              <span className="hidden text-[0.58rem] font-semibold uppercase tracking-[0.12em] 2xl:inline">
                {season}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="navbar-icon-control navbar-theme-toggle flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/5"
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
              type="button"
              onClick={() => setIsMenuOpen((value) => !value)}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/5 lg:hidden"
              style={{ color: "var(--nav-fg-muted)" }}
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMenuOpen}
              aria-controls="responsive-navigation"
            >
              {isMenuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>

            <button
              onClick={() => {
                const nextValue = !isMusicPlaying;
                if (nextValue) prepareAmbientAudio();
                setIsMusicPlaying(nextValue);
              }}
              className="navbar-icon-control navbar-music-toggle flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{
                color: showMusicState ? "var(--nav-fg)" : "var(--nav-fg-muted)",
              }}
              aria-label="Toggle ambient weather sounds"
              aria-pressed={showMusicState}
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
              className="navbar-chat-button group ml-1 flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold shadow-[0_4px_15px_rgba(0,0,0,0.08)] transition-all hover:scale-105 active:scale-95"
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
              <span className="navbar-chat-label">Let&apos;s Chat</span>
            </Link>
          </div>
          </div>
        </div>

        {isMenuOpen ? (
          <nav
            id="responsive-navigation"
            className="navbar-mobile-menu mt-2 grid grid-cols-2 gap-1 rounded-2xl border p-2 shadow-2xl backdrop-blur-xl lg:hidden"
            style={{
              backgroundColor: "var(--nav-bg)",
              borderColor: "var(--nav-border)",
            }}
            aria-label="Mobile navigation"
          >
            {nav.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-center text-xs font-semibold transition-colors"
                  style={{
                    color: isActive ? "var(--nav-fg)" : "var(--nav-fg-muted)",
                    backgroundColor: isActive ? "var(--nav-bg-active)" : "transparent",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        ) : null}
      </header>
    </>
  );
}
