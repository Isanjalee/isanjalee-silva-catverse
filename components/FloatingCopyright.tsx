export default function FloatingCopyright() {
  return (
    <div className="floating-copyright fixed bottom-6 right-6 z-50 pointer-events-none">
      <div
        className="floating-copyright-panel flex flex-col items-end rounded-2xl border px-4 py-2.5 text-right shadow-2xl backdrop-blur transition-all duration-300"
        style={{ backgroundColor: "var(--nav-bg)", borderColor: "var(--nav-border)" }}
      >
        <span className="floating-copyright-accent" aria-hidden="true">
          <span />
        </span>
        <span className="floating-copyright-title floating-copyright-title--desktop text-xs font-medium" style={{ color: "var(--nav-fg)" }}>
          Copyright 2026 Isanjalee Silva
        </span>
        <span className="floating-copyright-title floating-copyright-title--mobile" style={{ color: "var(--nav-fg)" }}>
          © 2026 Isanjalee
        </span>
        <span
          className="floating-copyright-subtitle mt-0.5 text-[10px] font-light tracking-wide"
          style={{ color: "var(--nav-fg-muted)" }}
        >
          AI & Full-Stack Engineer
        </span>
      </div>
    </div>
  );
}
