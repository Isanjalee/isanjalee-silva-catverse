"use client";

import Link from "next/link";
import { Laptop, X } from "lucide-react";

type VaultViewportNoticeProps = {
  mode: "dialog" | "page";
  onClose?: () => void;
};

export default function VaultViewportNotice({
  mode,
  onClose,
}: VaultViewportNoticeProps) {
  const isDialog = mode === "dialog";

  return (
    <div
      className={isDialog ? "vault-viewport-notice__overlay" : "vault-viewport-notice__page"}
      role={isDialog ? "presentation" : undefined}
      onMouseDown={(event) => {
        if (isDialog && event.target === event.currentTarget) onClose?.();
      }}
    >
      <section
        className={`vault-viewport-notice vault-viewport-notice--${mode}`}
        role={isDialog ? "dialog" : "status"}
        aria-modal={isDialog || undefined}
        aria-labelledby="vault-viewport-title"
      >
        <div className="vault-viewport-notice__topline">
          <span>PRIVATE NODE</span>
          <b>DISPLAY LINK</b>
          {isDialog ? (
            <button type="button" onClick={onClose} aria-label="Close message">
              <X size={17} />
            </button>
          ) : null}
        </div>

        <div className="vault-viewport-notice__signal" aria-hidden="true">
          <i />
          <Laptop size={34} strokeWidth={1.6} />
          <i />
        </div>

        <div className="vault-viewport-notice__terminal">
          <span>&gt; NODE PAUSED</span>
          <h1 id="vault-viewport-title">DESKTOP SIGNAL REQUIRED</h1>
          <p>
            This private interface opens at 768px or wider. Continue on a
            laptop or landscape screen.
          </p>
          <b>ROUTE SAVED · CURIOSITY NOTED</b>
        </div>

        {isDialog ? (
          <button
            type="button"
            className="vault-viewport-notice__action"
            onClick={onClose}
          >
            SIGNAL ACKNOWLEDGED
          </button>
        ) : (
          <Link href="/" className="vault-viewport-notice__action">
            RETURN TO HOME
          </Link>
        )}
      </section>

      <style jsx global>{`
        .vault-viewport-notice__overlay,
        .vault-viewport-notice__page {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: grid;
          place-items: center;
          padding: 0.85rem;
          color: #e8f8fa;
          background:
            linear-gradient(rgba(34, 211, 238, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.035) 1px, transparent 1px),
            rgba(1, 6, 14, 0.9);
          background-size: 24px 24px;
          backdrop-filter: blur(14px);
        }

        .vault-viewport-notice__page {
          min-height: 100dvh;
          position: relative;
        }

        .vault-viewport-notice {
          position: relative;
          width: min(100%, 25rem);
          overflow: hidden;
          border: 1px solid rgba(34, 211, 238, 0.42);
          border-radius: 8px;
          background: rgba(4, 12, 24, 0.97);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.44), 0 0 28px rgba(34, 211, 238, 0.1);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          animation: vaultNoticeEnter 220ms ease-out both;
        }

        .vault-viewport-notice__topline {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          min-height: 2.55rem;
          gap: 0.55rem;
          border-bottom: 1px solid rgba(34, 211, 238, 0.2);
          padding: 0.55rem 0.7rem;
          font-size: 0.62rem;
          font-weight: 850;
          letter-spacing: 0.08em;
        }

        .vault-viewport-notice__topline span { color: #22d3ee; }
        .vault-viewport-notice__topline b { color: #facc15; }

        .vault-viewport-notice--dialog .vault-viewport-notice__topline {
          grid-template-columns: minmax(0, 1fr) auto auto;
        }

        .vault-viewport-notice__topline button {
          display: grid;
          width: 1.85rem;
          height: 1.85rem;
          place-items: center;
          border: 1px solid rgba(34, 211, 238, 0.28);
          border-radius: 50%;
          color: inherit;
          background: transparent;
          cursor: pointer;
        }

        .vault-viewport-notice__signal {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 0.7rem;
          padding: 0.85rem 0.8rem 0.2rem;
          color: #a3e635;
        }

        .vault-viewport-notice__signal i {
          height: 1px;
          background: linear-gradient(90deg, transparent, #22d3ee);
        }

        .vault-viewport-notice__signal i:last-child {
          background: linear-gradient(90deg, #22d3ee, transparent);
        }

        .vault-viewport-notice__terminal {
          margin: 0.65rem 0.7rem;
          border-left: 2px solid #22d3ee;
          padding: 0.15rem 0 0.15rem 0.7rem;
        }

        .vault-viewport-notice__terminal span,
        .vault-viewport-notice__terminal b {
          color: #a3e635;
          font-size: 0.62rem;
          letter-spacing: 0.08em;
        }

        .vault-viewport-notice__terminal h1 {
          margin: 0.42rem 0;
          color: #e8f8fa;
          font-size: clamp(0.88rem, 4.2vw, 1.08rem);
          line-height: 1.35;
          letter-spacing: 0;
        }

        .vault-viewport-notice__terminal p {
          margin: 0 0 0.55rem;
          color: rgba(232, 248, 250, 0.74);
          font-size: 0.7rem;
          line-height: 1.55;
          letter-spacing: 0;
        }

        .vault-viewport-notice__action {
          display: flex;
          width: calc(100% - 1.4rem);
          min-height: 2.75rem;
          align-items: center;
          justify-content: center;
          margin: 0.7rem;
          border: 1px solid rgba(34, 211, 238, 0.36);
          border-radius: 6px;
          color: #e8f8fa;
          background: rgba(34, 211, 238, 0.07);
          font: 850 0.66rem ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          letter-spacing: 0.08em;
          text-decoration: none;
          cursor: pointer;
        }

        :global(html.light) .vault-viewport-notice__overlay,
        :global(html.light) .vault-viewport-notice__page {
          color: #15313a;
          background:
            linear-gradient(rgba(8, 120, 143, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(8, 120, 143, 0.045) 1px, transparent 1px),
            rgba(240, 250, 251, 0.93);
          background-size: 24px 24px;
        }

        :global(html.light) .vault-viewport-notice {
          border-color: rgba(8, 120, 143, 0.38);
          color: #15313a;
          background: rgba(252, 255, 255, 0.98);
          box-shadow: 0 24px 70px rgba(15, 70, 82, 0.18), 0 0 34px rgba(34, 211, 238, 0.1);
        }

        :global(html.light) .vault-viewport-notice__terminal h1,
        :global(html.light) .vault-viewport-notice__action {
          color: #15313a;
        }

        :global(html.light) .vault-viewport-notice__terminal p {
          color: rgba(21, 49, 58, 0.74);
        }

        :global(html.light) .vault-viewport-notice__action {
          background: rgba(8, 120, 143, 0.055);
        }

        @keyframes vaultNoticeEnter {
          from { opacity: 0; transform: translateY(8px) scale(0.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .vault-viewport-notice { animation: none; }
        }
      `}</style>
    </div>
  );
}
