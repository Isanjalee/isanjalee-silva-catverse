"use client";

import { useEffect } from "react";
import {
  ArrowUpRight,
  Clock3,
  Mail,
  MessageSquareText,
  Sparkles,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import { siteData } from "@/lib/siteData";

const questionPrompts = [
  "Want to discuss a project, product idea, or collaboration?",
  "Need help with frontend, full-stack, or AI-focused work?",
  "Have a question about process, design, or engineering decisions?",
];

function ContactWorkspaceScene() {
  return (
    <div className="pointer-events-none relative hidden h-[15.5rem] overflow-hidden rounded-[26px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))] md:block">
      <div className="absolute inset-x-8 bottom-0 h-px bg-white/8" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_46%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/14 to-transparent dark:from-white/[0.03]" />

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 560 248"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0"
      >
        <circle cx="432" cy="48" r="13" fill="#f6f1c4" style={{ opacity: "calc(var(--inprogress-moon-opacity) * 0.9)" }} />
        <circle cx="437" cy="43" r="11" fill="var(--color-bg)" style={{ opacity: "var(--inprogress-moon-opacity)" }} />
        <circle cx="432" cy="48" r="13" fill="#fbbf24" style={{ opacity: "calc(var(--inprogress-sun-opacity) * 0.95)" }} />
        <circle cx="432" cy="48" r="18" fill="#facc15" style={{ opacity: "calc(var(--inprogress-sun-opacity) * 0.18)" }} />

        <rect x="190" y="198" width="180" height="6" rx="3" fill="var(--color-fg)" opacity="0.16" />

        <rect x="316" y="118" width="116" height="82" rx="12" fill="var(--color-fg)" opacity="0.95" />
        <rect x="321" y="123" width="106" height="72" rx="9" fill="var(--color-fg)" opacity="0.38" />
        <rect x="325" y="127" width="98" height="64" rx="8" fill="url(#contactScreenGlow)" />
        <circle cx="374" cy="122" r="1.8" fill="var(--color-bg)" opacity="0.7" />
        <rect x="300" y="200" width="148" height="10" rx="5" fill="var(--color-fg)" opacity="0.85" />
        <rect x="346" y="202.5" width="52" height="4" rx="2" fill="var(--color-bg)" opacity="0.18" />
        <rect x="370" y="209.5" width="8" height="5.5" rx="2.75" fill="var(--color-bg)" opacity="0.8" />

        <text
          x="374"
          y="158"
          textAnchor="middle"
          className="fill-cyan-100/80 font-mono text-[9px]"
        >
          const idea = &quot;say hi&quot;;
        </text>

        <path d="M178 198 C178 126 255 126 255 198 Z" fill="var(--cat-color)" />
        <path d="M232 149 C203 149 197 127 197 114 C197 97 213 92 232 92 C251 92 267 97 267 114 C267 127 261 149 232 149 Z" fill="var(--cat-color)" />
        <polygon points="201,115 191,85 220,96" fill="var(--cat-color)" />
        <polygon points="263,115 273,85 244,96" fill="var(--cat-color)" />
        <polygon points="202,110 196,94 212,100" fill="var(--color-bg)" opacity="0.12" />
        <polygon points="262,110 268,94 252,100" fill="var(--color-bg)" opacity="0.12" />

        <g className="contact-cat-blink" style={{ transformOrigin: "232px 117px" }}>
          <path d="M212 118 Q 217 113 222 118 Q 217 120 212 118 Z" fill="var(--color-bg)" />
          <path d="M242 118 Q 247 113 252 118 Q 247 120 242 118 Z" fill="var(--color-bg)" />
          <circle cx="215.5" cy="117.2" r="1.3" fill="var(--cat-color)" />
          <circle cx="245.5" cy="117.2" r="1.3" fill="var(--cat-color)" />
        </g>

        <polygon points="232,128 230,126 234,126" fill="var(--color-bg)" opacity="0.62" className="contact-cat-nose" />

        <path d="M194 193 Q 147 214 165 162" stroke="var(--cat-color)" strokeWidth="5.5" strokeLinecap="round" fill="none" className="contact-cat-tail" />

        <path d="M271 194 C283 183 292 175 301 169" stroke="var(--cat-color)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
        <rect x="295" y="164" width="18" height="24" rx="9" fill="var(--cat-color)" />
        <rect x="307" y="175" width="17" height="7" rx="3.5" fill="var(--cat-color)" opacity="0.96" />

        <circle cx="110" cy="74" r="3" fill="var(--color-fg)" opacity="0.16" />
        <circle cx="452" cy="70" r="3" fill="var(--color-fg)" opacity="0.16" />
        <circle cx="466" cy="91" r="2.2" fill="var(--color-fg)" opacity="0.14" />

        <defs>
          <linearGradient id="contactScreenGlow" x1="325" y1="127" x2="423" y2="191" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9fd7ff" stopOpacity="0.66" />
            <stop offset="0.45" stopColor="#7db8ff" stopOpacity="0.28" />
            <stop offset="1" stopColor="#182849" stopOpacity="0.16" />
          </linearGradient>
        </defs>
      </svg>

      <style>{`
        @keyframes contactCatBlink {
          0%, 84%, 100% { transform: scaleY(1); }
          88% { transform: scaleY(0.12); }
        }
        @keyframes contactCatTail {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(6deg); }
        }
        @keyframes contactCatNose {
          0%, 90%, 100% { transform: translateY(0); }
          95% { transform: translateY(-1px); }
        }
        .contact-cat-blink { animation: contactCatBlink 4.6s infinite; }
        .contact-cat-tail {
          animation: contactCatTail 3.8s ease-in-out infinite;
          transform-origin: 194px 193px;
        }
        .contact-cat-nose { animation: contactCatNose 3.1s infinite; }
      `}</style>
    </div>
  );
}

export default function ContactPage() {
  const email = siteData.email ?? "hello@example.com";
  const subject = encodeURIComponent("Project Inquiry");
  const body = encodeURIComponent(
    [
      "Hi Isanjalee,",
      "",
      "I would like to talk about:",
      "- Project / company:",
      "- Scope:",
      "- Timeline:",
      "- Budget / context:",
      "",
      "Best regards,",
      "",
    ].join("\n"),
  );

  const mailtoHref = `mailto:${email}?subject=${subject}&body=${body}`;

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyHeight = document.body.style.height;
    const previousHtmlHeight = document.documentElement.style.height;
    const previousBodyMaxHeight = document.body.style.maxHeight;
    const previousHtmlMaxHeight = document.documentElement.style.maxHeight;
    const previousBodyOverflowY = document.body.style.overflowY;
    const previousHtmlOverflowY = document.documentElement.style.overflowY;
    const mainElement = document.querySelector("main");
    const previousMainStyle = mainElement?.getAttribute("style");

    document.body.style.overflow = "clip";
    document.documentElement.style.overflow = "clip";
    document.body.style.overflowY = "clip";
    document.documentElement.style.overflowY = "clip";
    document.body.style.height = "100dvh";
    document.documentElement.style.height = "100dvh";
    document.body.style.maxHeight = "100dvh";
    document.documentElement.style.maxHeight = "100dvh";

    if (mainElement instanceof HTMLElement) {
      mainElement.style.overflow = "hidden";
      mainElement.style.paddingBottom = "0";
      mainElement.style.minHeight = "calc(100dvh - 8.5rem)";
    }

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflowY = previousBodyOverflowY;
      document.documentElement.style.overflowY = previousHtmlOverflowY;
      document.body.style.height = previousBodyHeight;
      document.documentElement.style.height = previousHtmlHeight;
      document.body.style.maxHeight = previousBodyMaxHeight;
      document.documentElement.style.maxHeight = previousHtmlMaxHeight;

      if (mainElement instanceof HTMLElement) {
        if (previousMainStyle) {
          mainElement.setAttribute("style", previousMainStyle);
        } else {
          mainElement.removeAttribute("style");
        }
      }
    };
  }, []);

  return (
    <PageShell>
      <div className="flex h-[calc(100dvh-12.5rem)] min-h-0 items-start">
        <div className="grid w-full gap-5 xl:grid-cols-[minmax(0,1.28fr)_minmax(300px,0.72fr)]">
        <section className="card overflow-hidden p-0">
          <div className="relative rounded-[20px] bg-[radial-gradient(circle_at_top_left,rgba(255,206,122,0.24),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.14),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0.06))] px-6 py-6 dark:bg-[radial-gradient(circle_at_top_left,rgba(255,176,78,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] md:px-8 md:py-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/55 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-black/60 dark:border-white/10 dark:bg-white/6 dark:text-white/60">
              <Sparkles size={14} />
              Let&apos;s Connect
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-black/85 dark:text-white/92 md:text-[2.5rem]">
              Ready to talk?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-black/68 dark:text-white/68 md:text-base">
              Whether you&apos;re reaching out about a new build, product
              improvement, freelance collaboration, or a technical question, I
              prefer to keep communication straightforward and useful.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] dark:bg-white dark:text-black"
              >
                <Mail size={16} />
                Send Email
              </a>

              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-5 py-3 text-sm font-semibold text-black/70 transition hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:text-white/74 dark:hover:bg-white/10"
              >
                Copy Email Intent
                <ArrowUpRight size={16} />
              </a>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-black/8 bg-white/50 p-5 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-2 text-sm font-semibold text-black/82 dark:text-white/88">
                  <Mail size={16} />
                  Email
                </div>
                <div className="mt-3 text-lg font-semibold tracking-tight text-black/85 dark:text-white/90">
                  {email}
                </div>
                <p className="mt-2 text-sm leading-6 text-black/60 dark:text-white/62">
                  Best for project inquiries, collaboration, and detailed
                  discussions.
                </p>
              </div>

              <div className="rounded-[24px] border border-black/8 bg-white/50 p-5 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-2 text-sm font-semibold text-black/82 dark:text-white/88">
                  <Clock3 size={16} />
                  Response Style
                </div>
                <p className="mt-3 text-sm leading-6 text-black/60 dark:text-white/62">
                  Clear context helps. Include your goal, timeline, and any key
                  constraints so the conversation can start efficiently.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <ContactWorkspaceScene />
            </div>
          </div>
        </section>

        <aside className="grid content-start gap-5 self-center">
          <section className="card p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-black/45 dark:text-white/45">
              <MessageSquareText size={15} />
              Ask A Question
            </div>
            <div className="mt-4 grid gap-2.5">
              {questionPrompts.map((prompt) => (
                <div
                  key={prompt}
                  className="rounded-2xl border border-black/8 bg-black/[0.03] px-4 py-3 text-sm leading-6 text-black/66 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/66"
                >
                  {prompt}
                </div>
              ))}
            </div>
          </section>

          <section className="card p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/45 dark:text-white/45">
              Other Places
            </div>
            <div className="mt-4 grid gap-2.5">
              {siteData.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-black/8 bg-white/50 px-4 py-3 text-sm font-medium text-black/78 transition hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:text-white/78 dark:hover:bg-white/9"
                >
                  <span>{social.label}</span>
                  <ArrowUpRight size={16} className="text-black/40 dark:text-white/40" />
                </a>
              ))}
            </div>
          </section>

          <section className="card p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/45 dark:text-white/45">
              Best First Message
            </div>
            <div className="mt-4 rounded-2xl border border-black/8 bg-black/[0.03] p-4 text-sm leading-6 text-black/65 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/66">
              Share who you are, what you&apos;re building, what kind of help
              you need, and the timeline. That usually makes the first reply
              much faster and more useful.
            </div>
          </section>
        </aside>
        </div>
      </div>
    </PageShell>
  );
}
