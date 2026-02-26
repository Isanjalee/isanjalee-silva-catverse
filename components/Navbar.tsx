import Link from "next/link";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
  { href: "/mind-break", label: "Mind Break" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/35 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Isanjalee Silva
          <span className="ml-2 text-xs text-white/50">Catverse</span>
        </Link>

        <nav className="hidden gap-4 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-sm text-white/70 hover:text-white/90"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/mind-break"
          className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 hover:bg-white/10"
        >
          Play
        </Link>
      </div>
    </header>
  );
}
