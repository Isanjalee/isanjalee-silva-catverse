"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cat, Sun, Moon, PawPrint } from "lucide-react";
import { useState, useEffect } from "react";
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

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("catverse-music-enabled");
    if (saved === "true") setIsMusicPlaying(true);
  }, []);

  // Sync music state to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("catverse-music-enabled", isMusicPlaying.toString());
    }
  }, [isMusicPlaying, mounted]);

  return (
    <>
      <BackgroundAudio isPlaying={isMusicPlaying} />
      <header className="sticky top-6 z-50 mx-auto mt-6 w-full max-w-5xl px-5 transition-all duration-300">
      <div 
        className="flex w-full items-center justify-between rounded-full border px-3 py-2.5 backdrop-blur shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors duration-300"
        style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--nav-border)' }}
      >
        
        {/* Left: Logo */}
        <div className="flex items-center pl-3">
          <Link 
            href="/" 
            className="group flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: 'var(--nav-fg)' }}
          >
            <Cat size={18} className="opacity-80 transition-transform group-hover:scale-110 group-hover:opacity-100" />
            <span className="hidden sm:inline-block">Isanjalee Silva</span>
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-1">
          {nav.map((n) => {
            const isActive = pathname === n.href || (n.href !== "/" && pathname?.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className="relative rounded-full px-4 py-1.5 text-xs font-medium transition-all"
                style={{ 
                  color: isActive ? 'var(--nav-fg)' : 'var(--nav-fg-muted)',
                  backgroundColor: isActive ? 'var(--nav-bg-active)' : 'transparent' 
                }}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 pr-1">
          {/* Theme Toggle (Sun / Moon) */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: 'var(--nav-fg-muted)' }}
            aria-label="Toggle theme"
          >
            {mounted && (theme === "dark" ? <Sun size={16} /> : <Moon size={16} />)}
          </button>

          {/* Music Toggle (Soft Cat Paw) */}
          <button
            onClick={() => setIsMusicPlaying(!isMusicPlaying)}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: isMusicPlaying ? 'var(--nav-fg)' : 'var(--nav-fg-muted)' }}
            aria-label="Toggle music"
          >
            <div className="relative">
              <PawPrint size={15} className={`transition-transform duration-300 ${isMusicPlaying ? 'scale-110' : ''}`} />
              {isMusicPlaying && (
                <span className="absolute -right-1 -top-1 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-40"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-current"></span>
                </span>
              )}
            </div>
          </button>

          {/* Let's Chat Button (Cat Paw Style) */}
          <Link
            href="/contact"
            className="group ml-1 flex items-center gap-2 rounded-full bg-black dark:bg-[#f5ece1] px-4 py-1.5 text-xs font-semibold text-white dark:text-black shadow-[0_4px_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all hover:scale-105 hover:bg-black/90 dark:hover:bg-white active:scale-95"
          >
            <PawPrint size={13} className="opacity-80 transition-transform group-hover:rotate-12" />
            <span>Let&apos;s Chat</span>
          </Link>
        </div>
      </div>
    </header>
    </>
  );
}
