export default function FloatingCopyright() {
  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <div 
        className="flex flex-col items-end text-right px-4 py-2.5 rounded-2xl border backdrop-blur shadow-2xl transition-all duration-300"
        style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--nav-border)' }}
      >
        <span className="text-xs font-medium" style={{ color: 'var(--nav-fg)' }}>
          © 2026 Isanjalee Silva
        </span>
        <span className="text-[10px] font-light tracking-wide mt-0.5" style={{ color: 'var(--nav-fg-muted)' }}>
          AI & Full-Stack Engineer
        </span>
      </div>
    </div>
  );
}
