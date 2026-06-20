"use client";

import { motion } from "framer-motion";
import { FormEvent, useEffect, useState, useSyncExternalStore } from "react";
import {
  ArrowUpRight,
  AtSign,
  Github,
  Linkedin,
  Mail,
  MailPlus,
  MessageSquareText,
  Send,
  Sparkles,
} from "lucide-react";
import { useTheme } from "next-themes";
import PageShell from "@/components/PageShell";
import { siteData } from "@/lib/siteData";

const subscribe = () => () => {};
const contactChips = ["Project Work", "AI Workflows", "Frontend / Full-stack"];

function ContactWorkspaceScene() {
  const flowPackets = [
    {
      label: "hello()",
      Icon: MessageSquareText,
      left: "12%",
      delay: 0,
      duration: 9.8,
      color: "rgba(56,189,248,0.58)",
      path: ["0rem", "1.1rem", "-0.35rem", "0.8rem"],
    },
    {
      label: "reply",
      Icon: Mail,
      left: "28%",
      delay: 1.8,
      duration: 11.4,
      color: "rgba(255,176,78,0.54)",
      path: ["0rem", "-0.7rem", "1rem", "-0.2rem"],
    },
    {
      label: "const",
      Icon: Sparkles,
      left: "47%",
      delay: 0.9,
      duration: 10.6,
      color: "rgba(167,139,250,0.54)",
      path: ["0rem", "0.5rem", "-1rem", "0.25rem"],
    },
    {
      label: "send",
      Icon: Send,
      left: "64%",
      delay: 3.1,
      duration: 12.2,
      color: "rgba(45,212,191,0.55)",
      path: ["0rem", "-1rem", "0.55rem", "-0.8rem"],
    },
    {
      label: "@gmail",
      Icon: AtSign,
      left: "80%",
      delay: 1.1,
      duration: 10.2,
      color: "rgba(56,189,248,0.52)",
      path: ["0rem", "0.75rem", "-0.75rem", "0.4rem"],
    },
  ];
  const ambientMarks = [
    { text: "</>", left: "18%", top: "72%", delay: 0.2 },
    { text: "ping", left: "36%", top: "83%", delay: 1.1 },
    { text: "200", left: "58%", top: "75%", delay: 2 },
    { text: "mail", left: "73%", top: "88%", delay: 0.7 },
  ];

  return (
    <div className="home-light-subcard pointer-events-none relative hidden h-full min-h-[17rem] overflow-hidden rounded-2xl border border-black/6 shadow-[inset_0_1px_0_rgba(255,255,255,0.34)] dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))] dark:shadow-none md:block">
      <div className="absolute inset-x-8 bottom-0 h-px bg-black/8 dark:bg-white/8" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_46%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.018),transparent_46%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent dark:from-white/[0.03]" />
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 420 260"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className="contact-flow-route"
            d="M24 238 C94 194 94 110 164 92 S288 98 385 34"
            stroke="rgba(56,189,248,0.28)"
            strokeWidth="1.2"
            strokeDasharray="5 10"
            fill="none"
          />
          <path
            className="contact-flow-route contact-flow-route--warm"
            d="M56 254 C126 218 148 156 220 146 S320 126 396 76"
            stroke="rgba(255,176,78,0.22)"
            strokeWidth="1"
            strokeDasharray="3 12"
            fill="none"
          />
          <path
            className="contact-flow-route contact-flow-route--slow"
            d="M12 176 C102 142 166 206 232 172 S312 84 408 118"
            stroke="rgba(167,139,250,0.2)"
            strokeWidth="1"
            strokeDasharray="2 11"
            fill="none"
          />
        </svg>

        <motion.div
          className="absolute left-[50%] top-[63%] h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{
            borderColor: "rgba(56,189,248,0.12)",
            boxShadow: "0 0 42px rgba(56,189,248,0.08)",
          }}
          animate={{ scale: [0.88, 1.28, 0.88], opacity: [0.06, 0.18, 0.06] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-[50%] top-[63%] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{ borderColor: "rgba(255,176,78,0.13)" }}
          animate={{ scale: [1.2, 0.9, 1.2], opacity: [0.05, 0.16, 0.05] }}
          transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />

        {ambientMarks.map(({ text, left, top, delay }) => (
          <motion.span
            key={text}
            className="absolute rounded-md border px-1.5 py-1 font-mono text-[0.5rem] font-bold"
            style={{
              left,
              top,
              borderColor: "rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.035)",
              color: "rgba(245,236,225,0.22)",
            }}
            animate={{ y: [0, -10, 0], opacity: [0.08, 0.26, 0.08] }}
            transition={{ duration: 5.8, delay, repeat: Infinity, ease: "easeInOut" }}
          >
            {text}
          </motion.span>
        ))}

        {flowPackets.map(({ label, Icon, left, delay, duration, color, path }) => (
          <motion.div
            key={`${label}-${left}`}
            className="absolute bottom-[-2.2rem] inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[0.5rem] font-black uppercase tracking-[0.12em] backdrop-blur-sm"
            style={{
              left,
              borderColor: color.replace(/0\.\d+\)/, "0.16)"),
              background: "linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.02))",
              color,
              filter: `drop-shadow(0 0 14px ${color.replace(/0\.\d+\)/, "0.14)")})`,
            }}
            animate={{
              y: ["0%", "-780%"],
              x: path,
              opacity: [0, 0.18, 0.34, 0.2, 0],
              scale: [0.86, 1, 0.94],
              rotate: [-2, 2, -1],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 0.4,
            }}
          >
            <Icon size={10} />
            <span>{label}</span>
          </motion.div>
        ))}
      </div>
      <motion.div
        className="absolute -left-1/3 top-0 h-full w-1/4 rotate-12 blur-sm"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.045), transparent)",
        }}
        animate={{ x: ["0%", "430%"] }}
        transition={{ duration: 8.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 2.4 }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(56,189,248,0.12) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          opacity: 0.14,
        }}
        animate={{ backgroundPosition: ["0px 0px", "22px 22px"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute left-[9%] top-[22%] flex h-8 w-8 items-center justify-center rounded-lg border"
        style={{
          borderColor: "rgba(56,189,248,0.3)",
          background: "rgba(255,255,255,0.06)",
        }}
        animate={{ y: [0, -5, 0], rotateZ: [0, -4, 0], opacity: [0.38, 0.72, 0.38] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Mail size={14} color="rgba(56,189,248,0.86)" />
      </motion.div>
      <motion.div
        className="absolute right-[13%] top-[30%] flex h-8 w-8 items-center justify-center rounded-lg border"
        style={{
          borderColor: "rgba(255,176,78,0.28)",
          background: "rgba(255,255,255,0.055)",
        }}
        animate={{ y: [0, 5, 0], rotateZ: [0, 5, 0], opacity: [0.34, 0.68, 0.34] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
      >
        <Send size={14} color="rgba(255,176,78,0.88)" />
      </motion.div>
      <motion.div
        className="absolute bottom-[15%] right-[20%] flex h-8 w-8 items-center justify-center rounded-lg border"
        style={{
          borderColor: "rgba(167,139,250,0.28)",
          background: "rgba(255,255,255,0.05)",
        }}
        animate={{ y: [0, -4, 0], rotateZ: [0, -5, 0], opacity: [0.3, 0.62, 0.3] }}
        transition={{ duration: 5.1, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
      >
        <AtSign size={14} color="rgba(167,139,250,0.86)" />
      </motion.div>

      <svg
        width="100%"
        height="100%"
        viewBox="116 42 380 188"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <circle cx="418" cy="57" r="20" fill="#f6f1c4" style={{ opacity: "calc(var(--inprogress-moon-opacity) * 0.08)" }} />
        <circle cx="418" cy="57" r="13" fill="#f6f1c4" style={{ opacity: "calc(var(--inprogress-moon-opacity) * 0.92)" }} />
        <circle cx="423" cy="52" r="10.5" fill="#03040a" style={{ opacity: "calc(var(--inprogress-moon-opacity) * 0.9)" }} />
        <circle cx="423" cy="52" r="10.5" fill="none" stroke="#f6f1c4" strokeWidth="1.2" style={{ opacity: "calc(var(--inprogress-moon-opacity) * 0.14)" }} />
        <circle cx="418" cy="57" r="13" fill="#fbbf24" style={{ opacity: "calc(var(--inprogress-sun-opacity) * 0.95)" }} />
        <circle cx="418" cy="57" r="18" fill="#facc15" style={{ opacity: "calc(var(--inprogress-sun-opacity) * 0.18)" }} />

        <rect x="190" y="198" width="180" height="6" rx="3" fill="var(--color-fg)" opacity="0.16" />

        <rect x="316" y="118" width="116" height="82" rx="12" fill="var(--color-fg)" opacity="0.95" />
        <rect x="321" y="123" width="106" height="72" rx="9" fill="var(--color-fg)" opacity="0.38" />
        <rect x="325" y="127" width="98" height="64" rx="8" fill="url(#contactScreenGlow)" />
        <circle cx="374" cy="122" r="1.8" fill="var(--color-bg)" opacity="0.7" />
        <rect x="335" y="136" width="78" height="14" rx="4" fill="#ffffff" opacity="0.12" />
        <rect x="340" y="141" width="30" height="2.5" rx="1.25" fill="#e0f2fe" opacity="0.72" />
        <rect x="340" y="148" width="46" height="2.5" rx="1.25" fill="#e0f2fe" opacity="0.42" />
        <rect x="335" y="162" width="52" height="13" rx="4" fill="#38bdf8" opacity="0.14" />
        <rect x="342" y="167" width="28" height="2.5" rx="1.25" fill="#e0f2fe" opacity="0.66" />
        <path d="M393 162 H412 A4 4 0 0 1 416 166 V171 A4 4 0 0 1 412 175 H398 L392 180 V175 A4 4 0 0 1 388 171 V166 A4 4 0 0 1 392 162 Z" fill="#fbbf24" opacity="0.22" />
        <circle cx="398" cy="168.5" r="1.5" fill="#fff7ed" opacity="0.74" />
        <circle cx="403" cy="168.5" r="1.5" fill="#fff7ed" opacity="0.62" />
        <circle cx="408" cy="168.5" r="1.5" fill="#fff7ed" opacity="0.5" />
        <rect x="300" y="200" width="148" height="10" rx="5" fill="var(--color-fg)" opacity="0.85" />
        <rect x="346" y="202.5" width="52" height="4" rx="2" fill="var(--color-bg)" opacity="0.18" />
        <rect x="370" y="209.5" width="8" height="5.5" rx="2.75" fill="var(--color-bg)" opacity="0.8" />

        <text
          x="337"
          y="158"
          className="fill-cyan-100/90 font-mono text-[4.8px]"
        >
          const idea = &quot;say hi&quot;;
        </text>

        <g className="contact-float-mail" style={{ transformOrigin: "150px 78px" }}>
          <rect x="126" y="61" width="54" height="34" rx="9" fill="var(--color-fg)" opacity="0.13" />
          <rect x="132" y="68" width="42" height="22" rx="5" fill="#ffffff" opacity="0.1" />
          <path d="M137 73 L153 83 L169 73" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.86" />
          <path d="M137 86 L149 78 M169 86 L157 78" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.46" />
        </g>

        <g className="contact-float-chat" style={{ transformOrigin: "462px 168px" }}>
          <path d="M438 152 H486 A9 9 0 0 1 495 161 V180 A9 9 0 0 1 486 189 H463 L450 199 V189 H438 A9 9 0 0 1 429 180 V161 A9 9 0 0 1 438 152 Z" fill="var(--color-fg)" opacity="0.14" />
          <circle cx="448" cy="171" r="2.4" fill="#fbbf24" opacity="0.82" />
          <circle cx="462" cy="171" r="2.4" fill="#38bdf8" opacity="0.82" />
          <circle cx="476" cy="171" r="2.4" fill="#a78bfa" opacity="0.82" />
          <rect x="445" y="179" width="35" height="2.4" rx="1.2" fill="#ffffff" opacity="0.18" />
        </g>

        <g className="contact-float-card" style={{ transformOrigin: "146px 156px" }}>
          <rect x="120" y="137" width="76" height="42" rx="10" fill="var(--color-fg)" opacity="0.11" />
          <circle cx="139" cy="154" r="8" fill="#38bdf8" opacity="0.22" />
          <path d="M135 154 A4 4 0 1 0 143 154 A4 4 0 1 0 135 154" fill="#38bdf8" opacity="0.58" />
          <path d="M130 169 C134 162 144 162 148 169" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" opacity="0.58" />
          <rect x="156" y="148" width="26" height="3" rx="1.5" fill="#ffffff" opacity="0.28" />
          <rect x="156" y="157" width="32" height="3" rx="1.5" fill="#ffffff" opacity="0.18" />
          <rect x="156" y="166" width="20" height="3" rx="1.5" fill="#fbbf24" opacity="0.36" />
        </g>

        <path className="contact-dash-route" d="M180 78 C230 46 296 58 335 126" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="4 7" opacity="0.28" fill="none" />
        <path className="contact-dash-route contact-dash-route--slow" d="M431 117 C400 92 374 92 374 126" stroke="#fbbf24" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="4 7" opacity="0.24" fill="none" />

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
        @keyframes contactFloatMail {
          0%, 100% { transform: translateY(0) rotate(-1deg); opacity: 0.82; }
          50% { transform: translateY(-5px) rotate(1deg); opacity: 1; }
        }
        @keyframes contactFloatChat {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.78; }
          50% { transform: translateY(-4px) translateX(3px); opacity: 1; }
        }
        @keyframes contactFloatCard {
          0%, 100% { transform: translateY(0) rotate(1deg); opacity: 0.76; }
          50% { transform: translateY(4px) rotate(-1deg); opacity: 0.96; }
        }
        @keyframes contactRouteFlow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -44; }
        }
        .contact-cat-blink { animation: contactCatBlink 4.6s infinite; }
        .contact-cat-tail {
          animation: contactCatTail 3.8s ease-in-out infinite;
          transform-origin: 194px 193px;
        }
        .contact-cat-nose { animation: contactCatNose 3.1s infinite; }
        .contact-float-mail { animation: contactFloatMail 4.2s ease-in-out infinite; }
        .contact-float-chat { animation: contactFloatChat 4.8s ease-in-out infinite; }
        .contact-float-card { animation: contactFloatCard 5.2s ease-in-out infinite; }
        .contact-dash-route {
          animation: contactRouteFlow 7s linear infinite;
        }
        .contact-dash-route--slow {
          animation-duration: 9s;
        }
        .contact-flow-route {
          animation: contactRouteFlow 10s linear infinite;
        }
        .contact-flow-route--warm {
          animation-duration: 12s;
        }
        .contact-flow-route--slow {
          animation-duration: 15s;
        }
      `}</style>
    </div>
  );
}

export default function ContactPage() {
  const { resolvedTheme } = useTheme();
  const hasHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const isLight = hasHydrated && resolvedTheme !== "dark";
  const email = siteData.email ?? "hello@example.com";
  const [formState, setFormState] = useState({
    name: "",
    senderEmail: "",
    subject: "",
    message: "",
  });
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
  const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subject}&body=${body}`;
  const outlookHref = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(email)}&subject=${subject}&body=${body}`;
  const tuneAlpha = (color: string, alpha: string) =>
    color.replace(/0\.\d+\)/, `${alpha})`);
  const accentColors = [
    "rgba(56,189,248,0.86)",
    "rgba(167,139,250,0.86)",
    "rgba(52,211,153,0.84)",
    "rgba(255,176,78,0.88)",
  ];
  const accentCardStyle = (color: string) =>
    isLight
      ? {
          borderColor: tuneAlpha(color, "0.32"),
          background:
            "linear-gradient(180deg, rgba(255,251,245,0.98), rgba(250,245,237,0.98))",
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.42), 0 12px 24px ${tuneAlpha(color, "0.13")}`,
        }
      : {
          borderColor: tuneAlpha(color, "0.4"),
          background: `radial-gradient(circle at 88% 16%, ${tuneAlpha(color, "0.2")}, transparent 42%), linear-gradient(180deg, rgba(18,18,22,0.96), rgba(8,8,11,0.94))`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.09), 0 16px 30px ${tuneAlpha(color, "0.1")}`,
        };

  const panelStyle = (color: string) =>
    isLight
      ? {
          borderColor: tuneAlpha(color, "0.32"),
          background: `radial-gradient(circle at 88% 10%, ${tuneAlpha(color, "0.14")}, transparent 42%), linear-gradient(180deg, rgba(255,251,245,0.97), rgba(247,242,235,0.95))`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.45), 0 12px 24px ${tuneAlpha(color, "0.11")}`,
        }
      : {
          borderColor: tuneAlpha(color, "0.38"),
          background: `radial-gradient(circle at 88% 10%, ${tuneAlpha(color, "0.18")}, transparent 42%), linear-gradient(180deg, rgba(18,18,22,0.96), rgba(8,8,11,0.94))`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 16px 30px ${tuneAlpha(color, "0.1")}`,
        };
  const scenePanelStyle = isLight
    ? {
        ...panelStyle("rgba(45,212,191,0.84)"),
        background:
          "radial-gradient(circle at 70% 26%, rgba(45,212,191,0.12), transparent 40%), linear-gradient(180deg, rgba(255,251,245,0.97), rgba(247,242,235,0.95))",
      }
    : {
        ...panelStyle("rgba(45,212,191,0.84)"),
        background:
          "radial-gradient(circle at 70% 30%, rgba(45,212,191,0.15), transparent 42%), linear-gradient(180deg, rgba(18,18,22,0.96), rgba(8,8,11,0.94))",
      };

  const inputStyle = {
    borderColor: isLight ? "rgba(90,68,41,0.14)" : "rgba(255,255,255,0.12)",
    background: isLight ? "rgba(255,255,255,0.66)" : "rgba(255,255,255,0.055)",
    color: isLight ? "rgba(34,34,40,0.88)" : "rgba(245,236,225,0.86)",
  };

  const emailActions = [
    { label: "Mail App", href: mailtoHref, icon: Mail, color: "rgba(56,189,248,0.86)" },
    { label: "Gmail", href: gmailHref, icon: Send, color: "rgba(255,176,78,0.88)" },
    { label: "Outlook", href: outlookHref, icon: AtSign, color: "rgba(167,139,250,0.86)" },
  ];

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formSubject = encodeURIComponent(
      formState.subject.trim() || "Portfolio Contact",
    );
    const formBody = encodeURIComponent(
      [
        `Name: ${formState.name || "Not provided"}`,
        `Email: ${formState.senderEmail || "Not provided"}`,
        "",
        "Message:",
        formState.message || "Not provided",
      ].join("\n"),
    );

    window.location.href = `mailto:${email}?subject=${formSubject}&body=${formBody}`;
  };

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
    document.body.style.height = "var(--app-height)";
    document.documentElement.style.height = "var(--app-height)";
    document.body.style.maxHeight = "var(--app-height)";
    document.documentElement.style.maxHeight = "var(--app-height)";

    if (mainElement instanceof HTMLElement) {
      mainElement.style.overflow = "hidden";
      mainElement.style.paddingBottom = "0";
      mainElement.style.minHeight = "calc(var(--app-height) - 8.5rem)";
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
      <div className="app-viewport-frame flex h-[calc(var(--app-height)-12.5rem)] min-h-0 items-start">
        <div className="grid h-full min-h-0 w-full gap-3 lg:grid-cols-[minmax(0,1.08fr)_minmax(310px,0.92fr)]">
          <section className="card page-light-card h-full min-h-0 overflow-hidden p-0">
            <div
              className="relative flex h-full min-h-0 flex-col overflow-hidden px-5 py-4 md:px-6"
              style={panelStyle("rgba(255,176,78,0.88)")}
            >
              <motion.div
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage: isLight
                    ? "radial-gradient(circle, rgba(76,59,42,0.12) 1px, transparent 1px)"
                    : "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                  opacity: isLight ? 0.16 : 0.18,
                }}
                animate={{ backgroundPosition: ["0px 0px", "22px 22px"] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 rotate-12 blur-sm"
                style={{
                  background: isLight
                    ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)"
                    : "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                }}
                animate={{ x: ["0%", "430%"] }}
                transition={{ duration: 9.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 2.2 }}
              />
              <motion.div
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#ffb04e] blur-3xl"
                animate={{ opacity: [0.08, 0.18, 0.08], scale: [0.9, 1.08, 0.9] }}
                transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]"
                    style={{
                      color: isLight ? "rgba(84,72,60,0.58)" : "rgba(255,255,255,0.62)",
                      background: isLight ? "rgba(255,255,255,0.62)" : "rgba(255,255,255,0.06)",
                      borderColor: isLight ? "rgba(90,68,41,0.1)" : "rgba(255,255,255,0.1)",
                    }}
                  >
                    <Sparkles size={14} />
                    Contact
                  </div>
                  <h2
                    className="mt-3 text-3xl font-black tracking-[-0.05em] md:text-[2.35rem]"
                    style={{ color: isLight ? "rgba(34,34,40,0.96)" : "rgba(255,255,255,0.92)" }}
                  >
                    Let&apos;s build the next thing clearly.
                  </h2>
                </div>
                <MailPlus className="mt-2 hidden shrink-0 md:block" size={30} color="rgba(255,176,78,0.88)" />
              </div>

              <p
                className="relative mt-2 max-w-2xl text-sm leading-6"
                style={{ color: isLight ? "rgba(50,46,42,0.74)" : "rgba(245,236,225,0.78)" }}
              >
                Send a quick note for product work, frontend/full-stack delivery, AI workflows, or a technical discussion.
              </p>
              <div className="relative mt-2 flex flex-wrap gap-1.5">
                {contactChips.map((chip, index) => (
                  <motion.span
                    key={chip}
                    className="rounded-full border px-2.5 py-1 text-[0.58rem] font-black uppercase tracking-[0.12em]"
                    style={{
                      borderColor: tuneAlpha(accentColors[index], "0.3"),
                      background: isLight ? "rgba(255,255,255,0.58)" : "rgba(255,255,255,0.055)",
                      color: isLight ? "rgba(50,46,42,0.7)" : "rgba(245,236,225,0.74)",
                    }}
                    animate={{ y: [0, index % 2 ? 1.5 : -1.5, 0] }}
                    transition={{ duration: 3 + index * 0.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {chip}
                  </motion.span>
                ))}
              </div>

              <form
                onSubmit={handleFormSubmit}
                className="relative mt-3 flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden rounded-2xl border p-3"
                style={accentCardStyle("rgba(255,176,78,0.88)")}
              >
                <motion.span
                  className="pointer-events-none absolute -right-10 top-0 h-28 w-28 rounded-full bg-[#ffb04e] blur-3xl"
                  animate={{ opacity: [0.08, 0.2, 0.08], scale: [0.9, 1.08, 0.9] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="grid gap-2 md:grid-cols-2">
                  <label className="grid gap-1">
                    <span className="text-[0.58rem] font-black uppercase tracking-[0.16em]" style={{ color: isLight ? "rgba(84,72,60,0.58)" : "rgba(245,236,225,0.62)" }}>
                      Name
                    </span>
                    <input
                      value={formState.name}
                      onChange={(event) => setFormState((state) => ({ ...state, name: event.target.value }))}
                      className="h-10 rounded-xl border px-3 text-sm font-semibold outline-none transition placeholder:text-black/40 focus:ring-2 focus:ring-amber-400/30 dark:placeholder:text-[#f5ece1]/50"
                      style={inputStyle}
                      placeholder="Your name"
                    />
                  </label>
                  <label className="grid gap-1">
                    <span className="text-[0.58rem] font-black uppercase tracking-[0.16em]" style={{ color: isLight ? "rgba(84,72,60,0.58)" : "rgba(245,236,225,0.62)" }}>
                      Email
                    </span>
                    <input
                      type="email"
                      value={formState.senderEmail}
                      onChange={(event) => setFormState((state) => ({ ...state, senderEmail: event.target.value }))}
                      className="h-10 rounded-xl border px-3 text-sm font-semibold outline-none transition placeholder:text-black/40 focus:ring-2 focus:ring-amber-400/30 dark:placeholder:text-[#f5ece1]/50"
                      style={inputStyle}
                      placeholder="you@example.com"
                    />
                  </label>
                </div>
                <label className="grid gap-1">
                  <span className="text-[0.58rem] font-black uppercase tracking-[0.16em]" style={{ color: isLight ? "rgba(84,72,60,0.58)" : "rgba(245,236,225,0.62)" }}>
                    Subject
                  </span>
                  <input
                    value={formState.subject}
                    onChange={(event) => setFormState((state) => ({ ...state, subject: event.target.value }))}
                    className="h-10 rounded-xl border px-3 text-sm font-semibold outline-none transition placeholder:text-black/40 focus:ring-2 focus:ring-amber-400/30 dark:placeholder:text-[#f5ece1]/50"
                    style={inputStyle}
                    placeholder="Project inquiry"
                  />
                </label>
                <label className="flex min-h-0 flex-1 flex-col gap-1">
                  <span className="text-[0.58rem] font-black uppercase tracking-[0.16em]" style={{ color: isLight ? "rgba(84,72,60,0.58)" : "rgba(245,236,225,0.62)" }}>
                    Message
                  </span>
                  <textarea
                    value={formState.message}
                    onChange={(event) => setFormState((state) => ({ ...state, message: event.target.value }))}
                    className="min-h-[6.8rem] flex-1 resize-none rounded-xl border px-3 py-2 text-sm font-medium leading-6 outline-none transition placeholder:text-black/40 focus:ring-2 focus:ring-amber-400/30 dark:placeholder:text-[#f5ece1]/50"
                    style={inputStyle}
                    placeholder="Tell me what you want to build, improve, or discuss."
                  />
                </label>
                <button
                  type="submit"
                  className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-black uppercase tracking-[0.12em] transition hover:scale-[1.01]"
                  style={{
                    ...accentCardStyle("rgba(255,176,78,0.88)"),
                    color: isLight ? "rgba(34,34,40,0.84)" : "rgba(245,236,225,0.86)",
                  }}
                >
                  <Send size={16} />
                  Send To Gmail
                </button>
              </form>
            </div>
          </section>

          <aside className="grid h-full min-h-0 gap-3 overflow-hidden xl:grid-rows-[auto_minmax(0,1fr)_auto]">
            <section className="card page-light-card p-3" style={panelStyle("rgba(56,189,248,0.86)")}>
              <div className="grid grid-cols-3 gap-2">
                {emailActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <motion.a
                      key={action.label}
                      href={action.href}
                      target={action.label === "Mail App" ? undefined : "_blank"}
                      rel={action.label === "Mail App" ? undefined : "noreferrer"}
                      className="relative grid aspect-[2.35/1] min-h-12 place-items-center overflow-hidden rounded-xl border"
                      title={action.label}
                      aria-label={action.label}
                      style={accentCardStyle(action.color)}
                      whileHover={{ y: -2, scale: 1.03 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.span
                        className="pointer-events-none absolute inset-0 rounded-xl"
                        style={{
                          background: `radial-gradient(circle at 50% 50%, ${tuneAlpha(action.color, "0.22")}, transparent 54%)`,
                        }}
                        animate={{ opacity: [0.2, 0.56, 0.2], scale: [0.94, 1.08, 0.94] }}
                        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <Icon className="relative" size={18} color={action.color} />
                    </motion.a>
                  );
                })}
              </div>
            </section>

            <motion.section
              className="contact-workspace-panel card page-light-card relative hidden min-h-0 overflow-hidden p-3 md:block"
              style={scenePanelStyle}
              whileHover={{ y: -2 }}
            >
              <div className="h-full min-h-[17rem]">
                <ContactWorkspaceScene />
              </div>
              <motion.div
                className="pointer-events-none absolute left-6 top-6 rounded-full border px-3 py-1 text-[0.58rem] font-black uppercase tracking-[0.16em]"
                style={{
                  borderColor: isLight ? "rgba(45,212,191,0.28)" : "rgba(45,212,191,0.34)",
                  background: isLight ? "rgba(255,255,255,0.62)" : "rgba(0,0,0,0.24)",
                  color: isLight ? "rgba(34,34,40,0.62)" : "rgba(245,236,225,0.62)",
                }}
                animate={{ y: [0, -2, 0], opacity: [0.72, 1, 0.72] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              >
                Mail Ready
              </motion.div>
            </motion.section>

            <section className="grid gap-3 md:grid-cols-2 lg:grid-cols-1">
              <motion.div
                className="card page-light-card overflow-hidden p-3"
                style={panelStyle("rgba(167,139,250,0.86)")}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em]" style={{ color: isLight ? "rgba(38,33,28,0.72)" : "rgba(245,236,225,0.68)" }}>
                  <MessageSquareText size={14} />
                  Good First Message
                </div>
                <p className="mt-2 text-xs leading-5" style={{ color: isLight ? "rgba(50,46,42,0.68)" : "rgba(245,236,225,0.76)" }}>
                  Share who you are, what you need, timeline, and any links. That keeps the reply fast and useful.
                </p>
              </motion.div>

              <div className="card page-light-card p-3" style={panelStyle("rgba(255,176,78,0.88)")}>
                <div className="grid grid-cols-3 gap-2">
                  {siteData.socials.map((social, index) => {
                    const color = accentColors[index % accentColors.length];
                    const Icon =
                      social.label.toLowerCase() === "github"
                        ? Github
                        : social.label.toLowerCase() === "linkedin"
                          ? Linkedin
                          : ArrowUpRight;
                    return (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        className="relative grid aspect-[2.35/1] min-h-10 place-items-center overflow-hidden rounded-xl border"
                        title={social.label}
                        aria-label={social.label}
                        style={accentCardStyle(color)}
                        whileHover={{ y: -2, scale: 1.03 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.span
                          className="pointer-events-none absolute inset-0 rounded-xl"
                          style={{
                            background: `radial-gradient(circle at 50% 50%, ${tuneAlpha(color, "0.2")}, transparent 56%)`,
                          }}
                          animate={{ opacity: [0.18, 0.5, 0.18], scale: [0.94, 1.08, 0.94] }}
                          transition={{ duration: 3.4 + index * 0.2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <Icon className="relative" size={17} color={color} />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
