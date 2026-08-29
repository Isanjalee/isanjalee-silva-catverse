"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  AlertCircle,
  ArrowUpRight,
  AtSign,
  Briefcase,
  CheckCircle2,
  Clock3,
  Dribbble,
  Download,
  Eye,
  Github,
  HelpCircle,
  Linkedin,
  LoaderCircle,
  Mail,
  MessageCircle,
  MessageSquareText,
  Send,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useTheme } from "next-themes";
import DigitalSectionTitle from "@/components/DigitalSectionTitle";
import PageShell from "@/components/PageShell";
import { siteData } from "@/lib/siteData";

const subscribe = () => () => {};

type QuickStart = {
  key: string;
  label: string;
  icon: typeof Briefcase;
  subject: string;
  message: string;
  color: string;
};

const quickStarts: QuickStart[] = [
  {
    key: "project",
    label: "Project Work",
    icon: Briefcase,
    subject: "Project Inquiry",
    color: "rgba(34,211,238,0.86)",
    message:
      "Hi Isanjalee,\n\nI'd like to talk about a project:\n- What we're building:\n- Timeline:\n- Budget or context:\n\nLooking forward to hearing from you.",
  },
  {
    key: "hire",
    label: "Hire Me",
    icon: Sparkles,
    subject: "Hiring Inquiry",
    color: "rgba(251,191,36,0.88)",
    message:
      "Hi Isanjalee,\n\nWe're hiring for a role that looks like a good fit for you:\n- Role:\n- Company:\n- Next steps:\n\nLet me know if you're open to a chat.",
  },
  {
    key: "hi",
    label: "Just Say Hi",
    icon: MessageCircle,
    subject: "Just Saying Hi",
    color: "rgba(163,230,53,0.88)",
    message:
      "Hi Isanjalee,\n\nJust came across your portfolio and wanted to say hello! ",
  },
  {
    key: "question",
    label: "Ask a Question",
    icon: HelpCircle,
    subject: "Quick Question",
    color: "rgba(192,132,252,0.86)",
    message: "Hi Isanjalee,\n\nQuick question — ",
  },
];

function ContactWorkspaceScene() {
  const flowPackets = [
    {
      label: "hello()",
      Icon: MessageSquareText,
      left: "12%",
      delay: 0,
      duration: 9.8,
      color: "rgba(34,211,238,0.58)",
      path: ["0rem", "1.1rem", "-0.35rem", "0.8rem"],
    },
    {
      label: "reply",
      Icon: Mail,
      left: "28%",
      delay: 1.8,
      duration: 11.4,
      color: "rgba(251,191,36,0.54)",
      path: ["0rem", "-0.7rem", "1rem", "-0.2rem"],
    },
    {
      label: "const",
      Icon: Sparkles,
      left: "47%",
      delay: 0.9,
      duration: 10.6,
      color: "rgba(192,132,252,0.54)",
      path: ["0rem", "0.5rem", "-1rem", "0.25rem"],
    },
    {
      label: "send",
      Icon: Send,
      left: "64%",
      delay: 3.1,
      duration: 12.2,
      color: "rgba(20,241,196,0.55)",
      path: ["0rem", "-1rem", "0.55rem", "-0.8rem"],
    },
    {
      label: "@gmail",
      Icon: AtSign,
      left: "80%",
      delay: 1.1,
      duration: 10.2,
      color: "rgba(34,211,238,0.52)",
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
            stroke="rgba(34,211,238,0.28)"
            strokeWidth="1.2"
            strokeDasharray="5 10"
            fill="none"
          />
          <path
            className="contact-flow-route contact-flow-route--warm"
            d="M56 254 C126 218 148 156 220 146 S320 126 396 76"
            stroke="rgba(251,191,36,0.22)"
            strokeWidth="1"
            strokeDasharray="3 12"
            fill="none"
          />
          <path
            className="contact-flow-route contact-flow-route--slow"
            d="M12 176 C102 142 166 206 232 172 S312 84 408 118"
            stroke="rgba(192,132,252,0.2)"
            strokeWidth="1"
            strokeDasharray="2 11"
            fill="none"
          />
        </svg>

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
            "radial-gradient(circle, rgba(34,211,238,0.12) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          opacity: 0.14,
        }}
        animate={{ backgroundPosition: ["0px 0px", "22px 22px"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute left-[9%] top-[22%] flex h-8 w-8 items-center justify-center rounded-lg border"
        style={{
          borderColor: "rgba(34,211,238,0.3)",
          background: "rgba(255,255,255,0.06)",
        }}
        animate={{ y: [0, -5, 0], rotateZ: [0, -4, 0], opacity: [0.38, 0.72, 0.38] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Mail size={14} color="rgba(34,211,238,0.86)" />
      </motion.div>
      <motion.div
        className="absolute right-[13%] top-[30%] flex h-8 w-8 items-center justify-center rounded-lg border"
        style={{
          borderColor: "rgba(251,191,36,0.28)",
          background: "rgba(255,255,255,0.055)",
        }}
        animate={{ y: [0, 5, 0], rotateZ: [0, 5, 0], opacity: [0.34, 0.68, 0.34] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
      >
        <Send size={14} color="rgba(251,191,36,0.88)" />
      </motion.div>
      <motion.div
        className="absolute bottom-[15%] right-[20%] flex h-8 w-8 items-center justify-center rounded-lg border"
        style={{
          borderColor: "rgba(192,132,252,0.28)",
          background: "rgba(255,255,255,0.05)",
        }}
        animate={{ y: [0, -4, 0], rotateZ: [0, -5, 0], opacity: [0.3, 0.62, 0.3] }}
        transition={{ duration: 5.1, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
      >
        <AtSign size={14} color="rgba(192,132,252,0.86)" />
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
        <rect x="335" y="162" width="52" height="13" rx="4" fill="#22d3ee" opacity="0.14" />
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
          <path d="M137 73 L153 83 L169 73" stroke="#22d3ee" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.86" />
          <path d="M137 86 L149 78 M169 86 L157 78" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" opacity="0.46" />
        </g>

        <g className="contact-float-chat" style={{ transformOrigin: "462px 168px" }}>
          <path d="M438 152 H486 A9 9 0 0 1 495 161 V180 A9 9 0 0 1 486 189 H463 L450 199 V189 H438 A9 9 0 0 1 429 180 V161 A9 9 0 0 1 438 152 Z" fill="var(--color-fg)" opacity="0.14" />
          <circle cx="448" cy="171" r="2.4" fill="#fbbf24" opacity="0.82" />
          <circle cx="462" cy="171" r="2.4" fill="#22d3ee" opacity="0.82" />
          <circle cx="476" cy="171" r="2.4" fill="#c084fc" opacity="0.82" />
          <rect x="445" y="179" width="35" height="2.4" rx="1.2" fill="#ffffff" opacity="0.18" />
        </g>

        <g className="contact-float-card" style={{ transformOrigin: "146px 156px" }}>
          <rect x="120" y="137" width="76" height="42" rx="10" fill="var(--color-fg)" opacity="0.11" />
          <circle cx="139" cy="154" r="8" fill="#22d3ee" opacity="0.22" />
          <path d="M135 154 A4 4 0 1 0 143 154 A4 4 0 1 0 135 154" fill="#22d3ee" opacity="0.58" />
          <path d="M130 169 C134 162 144 162 148 169" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" opacity="0.58" />
          <rect x="156" y="148" width="26" height="3" rx="1.5" fill="#ffffff" opacity="0.28" />
          <rect x="156" y="157" width="32" height="3" rx="1.5" fill="#ffffff" opacity="0.18" />
          <rect x="156" y="166" width="20" height="3" rx="1.5" fill="#fbbf24" opacity="0.36" />
        </g>

        <path className="contact-dash-route" d="M180 78 C230 46 296 58 335 126" stroke="#22d3ee" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="4 7" opacity="0.28" fill="none" />
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
  const prefersReducedMotion = useReducedMotion();
  const email = siteData.email ?? "hello@example.com";
  const [formState, setFormState] = useState({
    name: "",
    senderEmail: "",
    subject: "",
    message: "",
    website: "",
  });
  const [submitState, setSubmitState] = useState<{
    status: "idle" | "sending" | "success" | "error";
    message: string;
    configIssue?: boolean;
  }>({ status: "idle", message: "" });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [activeQuickStart, setActiveQuickStart] = useState<string | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);

  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingScrollRef = useRef(false);
  const [scrollController, setScrollController] = useState({
    progress: 0,
    scrollable: false,
    thumbSize: 1,
  });

  const subjectParam = encodeURIComponent("Project Inquiry");
  const bodyParam = encodeURIComponent(
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

  const mailtoHref = `mailto:${email}?subject=${subjectParam}&body=${bodyParam}`;
  const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subjectParam}&body=${bodyParam}`;
  const outlookHref = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(email)}&subject=${subjectParam}&body=${bodyParam}`;
  const tuneAlpha = (color: string, alpha: string) => color.replace(/0\.\d+\)/, `${alpha})`);
  const accentColors = [
    "rgba(34,211,238,0.86)",
    "rgba(251,191,36,0.88)",
    "rgba(192,132,252,0.86)",
    "rgba(163,230,53,0.88)",
    "rgba(96,165,250,0.86)",
    "rgba(251,113,133,0.86)",
  ];

  const accentCardStyle = (color: string) =>
    isLight
      ? {
          borderColor: tuneAlpha(color, "0.32"),
          background: "linear-gradient(180deg, rgba(255,251,245,0.98), rgba(250,245,237,0.98))",
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

  const fieldBorder = (field: string, baseColor: string) =>
    focusedField === field ? tuneAlpha(baseColor, "0.6") : isLight ? "rgba(90,68,41,0.14)" : "rgba(255,255,255,0.12)";

  const inputStyle = (field: string) => ({
    borderColor: fieldBorder(field, "rgba(251,191,36,0.9)"),
    background: isLight ? "rgba(255,255,255,0.66)" : "rgba(255,255,255,0.055)",
    color: isLight ? "rgba(34,34,40,0.88)" : "rgba(245,236,225,0.86)",
    boxShadow:
      focusedField === field ? `0 0 0 3px ${tuneAlpha("rgba(251,191,36,0.9)", "0.16")}` : "none",
  });

  const reachChannels = [
    { label: "Mail App", href: mailtoHref, icon: Mail, color: accentColors[0], external: false },
    { label: "Gmail", href: gmailHref, icon: Send, color: accentColors[1], external: true },
    { label: "Outlook", href: outlookHref, icon: MessageSquareText, color: accentColors[2], external: true },
    ...siteData.socials.map((social, index) => ({
      label: social.label,
      href: social.href,
      icon:
        social.label.toLowerCase() === "github"
          ? Github
          : social.label.toLowerCase() === "linkedin"
            ? Linkedin
            : social.label.toLowerCase() === "dribbble"
              ? Dribbble
              : ArrowUpRight,
      color: accentColors[(index + 3) % accentColors.length],
      external: true,
    })),
  ];

  const applyQuickStart = (quickStart: QuickStart) => {
    setActiveQuickStart(quickStart.key);
    setFormState((state) => ({
      ...state,
      subject: quickStart.subject,
      message: quickStart.message,
    }));
    window.setTimeout(() => {
      messageRef.current?.focus();
      const len = quickStart.message.length;
      messageRef.current?.setSelectionRange(len, len);
    }, 60);
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitState.status === "sending") return;
    setSubmitState({ status: "sending", message: "Sending your message directly to my inbox…" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        const isConfigIssue = response.status === 503;
        throw Object.assign(new Error(result.error || "The message could not be sent."), {
          configIssue: isConfigIssue,
        });
      }

      setFormState({ name: "", senderEmail: "", subject: "", message: "", website: "" });
      setActiveQuickStart(null);
      setSubmitState({
        status: "success",
        message: "Message delivered straight to my inbox. I'll get back to you as soon as possible.",
      });
    } catch (error) {
      const configIssue =
        error instanceof Error && "configIssue" in error
          ? Boolean((error as Error & { configIssue?: boolean }).configIssue)
          : false;
      setSubmitState({
        status: "error",
        configIssue,
        message: configIssue
          ? "Direct send isn't switched on yet — pick any option below and it'll reach me just as fast."
          : error instanceof Error
            ? error.message
            : "The message could not be sent. Please try one of the options below.",
      });
    }
  };

  const updateScrollController = useCallback(() => {
    const surface = surfaceRef.current;
    if (!surface) return;

    const maxScroll = Math.max(0, surface.scrollHeight - surface.clientHeight);
    const scrollable = maxScroll > 6;
    const progress = scrollable ? surface.scrollTop / maxScroll : 0;
    const thumbSize = scrollable
      ? Math.min(0.72, Math.max(0.18, surface.clientHeight / surface.scrollHeight))
      : 1;

    setScrollController((current) => {
      const next = { progress, scrollable, thumbSize };
      if (
        current.scrollable === next.scrollable &&
        Math.abs(current.progress - next.progress) < 0.003 &&
        Math.abs(current.thumbSize - next.thumbSize) < 0.003
      ) {
        return current;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;

    const animationFrame = window.requestAnimationFrame(updateScrollController);
    const settleTimer = window.setTimeout(updateScrollController, 260);
    const resizeObserver =
      "ResizeObserver" in window ? new ResizeObserver(updateScrollController) : null;

    resizeObserver?.observe(surface);
    Array.from(surface.children).forEach((child) => resizeObserver?.observe(child));
    surface.addEventListener("scroll", updateScrollController, { passive: true });
    window.addEventListener("resize", updateScrollController);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(settleTimer);
      resizeObserver?.disconnect();
      surface.removeEventListener("scroll", updateScrollController);
      window.removeEventListener("resize", updateScrollController);
    };
  }, [updateScrollController]);

  const setScrollFromPointer = useCallback((clientY: number) => {
    const surface = surfaceRef.current;
    const controller = controllerRef.current;
    if (!surface || !controller) return;

    const rect = controller.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    surface.scrollTop = ratio * (surface.scrollHeight - surface.clientHeight);
  }, []);

  const handleScrollPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!scrollController.scrollable) return;
      isDraggingScrollRef.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setScrollFromPointer(event.clientY);
    },
    [scrollController.scrollable, setScrollFromPointer],
  );

  const handleScrollPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDraggingScrollRef.current) return;
      setScrollFromPointer(event.clientY);
    },
    [setScrollFromPointer],
  );

  const handleScrollPointerEnd = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDraggingScrollRef.current) return;
    isDraggingScrollRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const handleScrollKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      const surface = surfaceRef.current;
      if (!surface) return;

      const step = Math.max(88, surface.clientHeight * 0.38);

      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        surface.scrollBy({
          top: event.key === "PageDown" ? surface.clientHeight * 0.82 : step,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      }

      if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        surface.scrollBy({
          top: event.key === "PageUp" ? -surface.clientHeight * 0.82 : -step,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      }

      if (event.key === "Home") {
        event.preventDefault();
        surface.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
      }

      if (event.key === "End") {
        event.preventDefault();
        surface.scrollTo({ top: surface.scrollHeight, behavior: prefersReducedMotion ? "auto" : "smooth" });
      }
    },
    [prefersReducedMotion],
  );

  return (
    <PageShell>
      <div className="contact-viewport-frame app-viewport-frame flex h-[calc(var(--app-height)-12.5rem)] min-h-0 items-start">
        <section className="contact-page-shell card page-light-card relative h-full w-full min-h-0 overflow-hidden p-3 md:p-4">
          <motion.div
            ref={surfaceRef}
            id="contact-console-surface"
            className="contact-page-grid grid h-full min-h-0 w-full gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34 }}
          >
              <section className="card page-light-card h-full min-h-0 overflow-visible p-0">
                <div
                  className="relative flex h-full min-h-0 flex-col overflow-visible px-5 py-4 md:px-6"
                  style={panelStyle("rgba(251,191,36,0.88)")}
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
                    className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#fbbf24] blur-3xl"
                    animate={{ opacity: [0.08, 0.18, 0.08], scale: [0.9, 1.08, 0.9] }}
                    transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
                  />

                  <div className="relative flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div
                        className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]"
                        style={{
                          color: isLight ? "rgba(84,72,60,0.58)" : "rgba(255,255,255,0.62)",
                          background: isLight ? "rgba(255,255,255,0.62)" : "rgba(255,255,255,0.06)",
                          borderColor: isLight ? "rgba(90,68,41,0.1)" : "rgba(255,255,255,0.1)",
                        }}
                      >
                        <Sparkles size={14} />
                        Communication Gateway
                      </div>
                      <h1
                        className="mt-3 text-3xl font-black tracking-[-0.05em] md:text-[2.35rem]"
                        style={{ color: isLight ? "rgba(34,34,40,0.96)" : "rgba(255,255,255,0.92)" }}
                      >
                        <DigitalSectionTitle label="connect.io" />
                      </h1>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <a
                        href="/Isanjalee-Silva-CV.pdf"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-cyan-500/25 bg-cyan-400/5 px-2.5 py-1.5 text-[0.6rem] font-black uppercase tracking-[0.12em] transition hover:-translate-y-0.5 hover:border-cyan-400/45"
                        style={{ color: isLight ? "#176477" : "rgba(103,232,249,0.86)" }}
                      >
                        <Eye size={11} />
                        View CV
                      </a>
                      <a
                        href="/Isanjalee-Silva-CV.pdf"
                        download="Isanjalee-Silva-CV.pdf"
                        className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-amber-500/25 bg-amber-400/5 px-2.5 py-1.5 text-[0.6rem] font-black uppercase tracking-[0.12em] transition hover:-translate-y-0.5 hover:border-amber-400/45"
                        style={{ color: isLight ? "#8a5a08" : "rgba(251,191,36,0.9)" }}
                      >
                        <Download size={11} />
                        CV
                      </a>
                    </div>
                  </div>

                  <p
                    className="relative mt-2 max-w-2xl text-sm leading-6 [text-align:justify] [text-justify:inter-word]"
                    style={{ color: isLight ? "rgba(50,46,42,0.74)" : "rgba(245,236,225,0.78)" }}
                  >
                    Pick a quick-start below, or write it your own way — either lands
                    straight in my inbox.
                  </p>

                  <div className="relative mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4" aria-label="Quick-start message templates">
                    {quickStarts.map((quickStart) => {
                      const Icon = quickStart.icon;
                      const active = activeQuickStart === quickStart.key;
                      return (
                        <motion.button
                          key={quickStart.key}
                          type="button"
                          onClick={() => applyQuickStart(quickStart)}
                          className="flex flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-center text-[0.62rem] font-black uppercase tracking-[0.06em] transition"
                          style={
                            active
                              ? accentCardStyle(quickStart.color)
                              : {
                                  borderColor: isLight ? "rgba(90,68,41,0.12)" : "rgba(255,255,255,0.1)",
                                  background: isLight ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.04)",
                                }
                          }
                          whileHover={{ y: -2, scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                        >
                          <Icon size={15} color={active ? quickStart.color : isLight ? "rgba(50,46,42,0.6)" : "rgba(245,236,225,0.6)"} />
                          <span style={{ color: isLight ? "rgba(50,46,42,0.78)" : "rgba(245,236,225,0.82)" }}>
                            {quickStart.label}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>

                  <form
                    onSubmit={handleFormSubmit}
                    className="relative mt-3 flex min-h-0 flex-1 flex-col gap-2.5 overflow-visible rounded-2xl border p-3"
                    style={accentCardStyle("rgba(251,191,36,0.88)")}
                  >
                    <motion.span
                      className="pointer-events-none absolute -right-10 top-0 h-28 w-28 rounded-full bg-[#fbbf24] blur-3xl"
                      animate={{ opacity: [0.08, 0.2, 0.08], scale: [0.9, 1.08, 0.9] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <label className="pointer-events-none absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
                      Website
                      <input
                        tabIndex={-1}
                        autoComplete="off"
                        value={formState.website}
                        onChange={(event) =>
                          setFormState((state) => ({ ...state, website: event.target.value }))
                        }
                      />
                    </label>
                    <div className="grid gap-2 md:grid-cols-2">
                      <label className="grid min-w-0 gap-1">
                        <span className="text-[0.58rem] font-black uppercase tracking-[0.16em]" style={{ color: isLight ? "rgba(84,72,60,0.58)" : "rgba(245,236,225,0.62)" }}>
                          Name
                        </span>
                        <input
                          required
                          minLength={2}
                          maxLength={80}
                          autoComplete="name"
                          value={formState.name}
                          onChange={(event) => setFormState((state) => ({ ...state, name: event.target.value }))}
                          onFocus={() => setFocusedField("name")}
                          onBlur={() => setFocusedField((current) => (current === "name" ? null : current))}
                          className="h-10 w-full min-w-0 rounded-xl border px-3 text-sm font-semibold outline-none transition-all duration-200 placeholder:text-black/40 dark:placeholder:text-[#f5ece1]/50"
                          style={inputStyle("name")}
                          placeholder="Your name"
                        />
                      </label>
                      <label className="grid min-w-0 gap-1">
                        <span className="text-[0.58rem] font-black uppercase tracking-[0.16em]" style={{ color: isLight ? "rgba(84,72,60,0.58)" : "rgba(245,236,225,0.62)" }}>
                          Email
                        </span>
                        <input
                          required
                          maxLength={160}
                          autoComplete="email"
                          type="email"
                          value={formState.senderEmail}
                          onChange={(event) => setFormState((state) => ({ ...state, senderEmail: event.target.value }))}
                          onFocus={() => setFocusedField("senderEmail")}
                          onBlur={() => setFocusedField((current) => (current === "senderEmail" ? null : current))}
                          className="h-10 w-full min-w-0 rounded-xl border px-3 text-sm font-semibold outline-none transition-all duration-200 placeholder:text-black/40 dark:placeholder:text-[#f5ece1]/50"
                          style={inputStyle("senderEmail")}
                          placeholder="you@example.com"
                        />
                      </label>
                    </div>
                    <label className="grid min-w-0 gap-1">
                      <span className="text-[0.58rem] font-black uppercase tracking-[0.16em]" style={{ color: isLight ? "rgba(84,72,60,0.58)" : "rgba(245,236,225,0.62)" }}>
                        Subject
                      </span>
                      <input
                        maxLength={120}
                        value={formState.subject}
                        onChange={(event) => setFormState((state) => ({ ...state, subject: event.target.value }))}
                        onFocus={() => setFocusedField("subject")}
                        onBlur={() => setFocusedField((current) => (current === "subject" ? null : current))}
                        className="h-10 w-full min-w-0 rounded-xl border px-3 text-sm font-semibold outline-none transition-all duration-200 placeholder:text-black/40 dark:placeholder:text-[#f5ece1]/50"
                        style={inputStyle("subject")}
                        placeholder="Project inquiry"
                      />
                    </label>
                    <label className="flex min-h-0 flex-1 flex-col gap-1">
                      <span className="flex items-center justify-between text-[0.58rem] font-black uppercase tracking-[0.16em]" style={{ color: isLight ? "rgba(84,72,60,0.58)" : "rgba(245,236,225,0.62)" }}>
                        <span>Message</span>
                        <span className="normal-case tracking-normal opacity-70">
                          {formState.message.length}/3000
                        </span>
                      </span>
                      <textarea
                        ref={messageRef}
                        required
                        minLength={10}
                        maxLength={3000}
                        value={formState.message}
                        onChange={(event) => setFormState((state) => ({ ...state, message: event.target.value }))}
                        onFocus={() => setFocusedField("message")}
                        onBlur={() => setFocusedField((current) => (current === "message" ? null : current))}
                        className="min-h-[6.8rem] w-full min-w-0 flex-1 resize-none rounded-xl border px-3 py-2 text-sm font-medium leading-6 outline-none transition-all duration-200 placeholder:text-black/40 dark:placeholder:text-[#f5ece1]/50"
                        style={inputStyle("message")}
                        placeholder="Tell me what you want to build, improve, or discuss."
                      />
                    </label>
                    <motion.button
                      type="submit"
                      disabled={submitState.status === "sending"}
                      className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-black uppercase tracking-[0.12em] transition disabled:cursor-wait disabled:opacity-65"
                      style={{
                        ...accentCardStyle("rgba(251,191,36,0.88)"),
                        color: isLight ? "rgba(34,34,40,0.84)" : "rgba(245,236,225,0.86)",
                      }}
                      whileHover={submitState.status === "sending" ? undefined : { scale: 1.015, y: -1 }}
                      whileTap={submitState.status === "sending" ? undefined : { scale: 0.98 }}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {submitState.status === "sending" ? (
                          <motion.span
                            key="sending"
                            className="inline-flex items-center gap-2"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.16 }}
                          >
                            <LoaderCircle className="animate-spin" size={16} />
                            Sending
                          </motion.span>
                        ) : submitState.status === "success" ? (
                          <motion.span
                            key="success"
                            className="inline-flex items-center gap-2"
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2, type: "spring", stiffness: 320, damping: 18 }}
                          >
                            <CheckCircle2 size={16} />
                            Message Sent
                          </motion.span>
                        ) : (
                          <motion.span
                            key="idle"
                            className="inline-flex items-center gap-2"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.16 }}
                          >
                            <Send size={16} />
                            Send Message Directly
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                    <AnimatePresence>
                      {submitState.status !== "idle" ? (
                        <motion.div
                          initial={{ opacity: 0, y: 6, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -6, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-start gap-2 overflow-hidden rounded-xl border px-3 py-2 text-xs font-semibold leading-5"
                          role="status"
                          aria-live="polite"
                          style={{
                            borderColor:
                              submitState.status === "error"
                                ? "rgba(248,113,113,0.34)"
                                : submitState.status === "success"
                                  ? "rgba(74,222,128,0.32)"
                                  : "rgba(34,211,238,0.26)",
                            color:
                              submitState.status === "error"
                                ? isLight ? "#9f2525" : "#fca5a5"
                                : submitState.status === "success"
                                  ? isLight ? "#166534" : "#86efac"
                                  : isLight ? "#155e75" : "#67e8f9",
                          }}
                        >
                          {submitState.status === "error" ? (
                            <AlertCircle className="mt-0.5 shrink-0" size={14} />
                          ) : submitState.status === "success" ? (
                            <CheckCircle2 className="mt-0.5 shrink-0" size={14} />
                          ) : (
                            <LoaderCircle className="mt-0.5 shrink-0 animate-spin" size={14} />
                          )}
                          {submitState.message}
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </form>
                </div>
              </section>

              <aside className="grid h-full min-h-0 gap-3 overflow-visible">
                <motion.section
                  className="card page-light-card p-4"
                  style={panelStyle("rgba(34,211,238,0.86)")}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em]" style={{ color: isLight ? "rgba(38,33,28,0.72)" : "rgba(245,236,225,0.68)" }}>
                    <Wand2 size={14} />
                    Reach Me Directly
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {reachChannels.map((channel, index) => {
                      const Icon = channel.icon;
                      return (
                        <motion.a
                          key={channel.label}
                          href={channel.href}
                          target={channel.external ? "_blank" : undefined}
                          rel={channel.external ? "me noopener noreferrer" : undefined}
                          className="relative flex h-14 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border"
                          title={channel.label}
                          aria-label={channel.label}
                          style={accentCardStyle(channel.color)}
                          whileHover={{ y: -2, scale: 1.03 }}
                          whileTap={{ scale: 0.96 }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.span
                            className="pointer-events-none absolute inset-0 rounded-xl"
                            style={{
                              background: `radial-gradient(circle at 50% 50%, ${tuneAlpha(channel.color, "0.2")}, transparent 56%)`,
                            }}
                            animate={{ opacity: [0.18, 0.5, 0.18], scale: [0.94, 1.08, 0.94] }}
                            transition={{ duration: 3.2 + index * 0.15, repeat: Infinity, ease: "easeInOut" }}
                          />
                          <Icon className="relative" size={16} color={channel.color} />
                          <span
                            className="relative text-[0.52rem] font-black uppercase tracking-[0.05em]"
                            style={{ color: isLight ? "rgba(50,46,42,0.68)" : "rgba(245,236,225,0.72)" }}
                          >
                            {channel.label}
                          </span>
                        </motion.a>
                      );
                    })}
                  </div>
                </motion.section>

                <motion.section
                  className="contact-workspace-panel card page-light-card relative hidden min-h-0 overflow-hidden p-3 md:block"
                  style={panelStyle("rgba(20,241,196,0.84)")}
                  whileHover={{ y: -2 }}
                >
                  <div className="h-full min-h-[17rem]">
                    <ContactWorkspaceScene />
                  </div>
                  <motion.div
                    className="pointer-events-none absolute left-6 top-6 rounded-full border px-3 py-1 text-[0.58rem] font-black uppercase tracking-[0.16em]"
                    style={{
                      borderColor: isLight ? "rgba(20,241,196,0.28)" : "rgba(20,241,196,0.34)",
                      background: isLight ? "rgba(255,255,255,0.62)" : "rgba(0,0,0,0.24)",
                      color: isLight ? "rgba(34,34,40,0.62)" : "rgba(245,236,225,0.62)",
                    }}
                    animate={{ y: [0, -2, 0], opacity: [0.72, 1, 0.72] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    Mail Ready
                  </motion.div>
                </motion.section>

                <section className="contact-info-stack grid content-start gap-3">
                  <motion.div
                    className="card page-light-card overflow-hidden p-4"
                    style={panelStyle("rgba(163,230,53,0.88)")}
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em]" style={{ color: isLight ? "rgba(38,33,28,0.72)" : "rgba(245,236,225,0.68)" }}>
                      <Clock3 size={14} />
                      Response Time
                    </div>
                    <p className="mt-2 text-xs leading-5" style={{ color: isLight ? "rgba(50,46,42,0.68)" : "rgba(245,236,225,0.76)" }}>
                      Usually within 24 hours, Sri Lanka time (UTC +5:30). Quick-start
                      templates above help me reply faster.
                    </p>
                  </motion.div>

                  <motion.div
                    className="card page-light-card overflow-hidden p-4"
                    style={panelStyle("rgba(192,132,252,0.86)")}
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
                </section>
              </aside>
          </motion.div>

          <div
            ref={controllerRef}
            className="contact-mobile-scroll-controller"
            data-visible={scrollController.scrollable ? "true" : "false"}
            role="scrollbar"
            aria-label="Scroll contact console"
            aria-controls="contact-console-surface"
            aria-orientation="vertical"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(scrollController.progress * 100)}
            tabIndex={scrollController.scrollable ? 0 : -1}
            onPointerDown={handleScrollPointerDown}
            onPointerMove={handleScrollPointerMove}
            onPointerUp={handleScrollPointerEnd}
            onPointerCancel={handleScrollPointerEnd}
            onKeyDown={handleScrollKeyDown}
            style={
              {
                "--contact-scroll-thumb-size": `${scrollController.thumbSize * 100}%`,
                "--contact-scroll-thumb-top": `${
                  scrollController.progress * (1 - scrollController.thumbSize) * 100
                }%`,
              } as React.CSSProperties
            }
          >
            <span className="contact-mobile-scroll-controller__thumb" />
          </div>
        </section>
      </div>

      <style>{`
        #contact-console-surface {
          overscroll-behavior: contain;
          scrollbar-width: none;
        }

        #contact-console-surface::-webkit-scrollbar {
          display: none;
          width: 0;
        }

        .contact-mobile-scroll-controller {
          display: none;
        }

        @media (max-width: 768px) {
          .contact-mobile-scroll-controller[data-visible="true"] {
            position: absolute;
            top: 1rem;
            right: 0.34rem;
            bottom: 1rem;
            z-index: 28;
            display: block;
            width: 0.46rem;
            overflow: hidden;
            border: 1px solid rgba(251, 191, 36, 0.24);
            border-radius: 999px;
            background: color-mix(in srgb, var(--color-bg) 86%, #78350f);
            box-shadow:
              inset 0 0 0 1px rgba(251, 191, 36, 0.06),
              0 0 0.32rem rgba(251, 191, 36, 0.08);
            cursor: ns-resize;
            opacity: 0.58;
            touch-action: none;
            transition:
              opacity 160ms ease,
              border-color 160ms ease,
              box-shadow 160ms ease;
          }

          .contact-mobile-scroll-controller__thumb {
            position: absolute;
            top: var(--contact-scroll-thumb-top);
            right: 0.06rem;
            left: 0.06rem;
            display: block;
            height: var(--contact-scroll-thumb-size);
            min-height: 2.15rem;
            max-height: 22%;
            border-radius: 999px;
            background: linear-gradient(180deg, #fde68a 0%, #fbbf24 52%, #22d3ee 100%);
            box-shadow:
              inset 0 0 0 1px rgba(255, 255, 255, 0.24),
              0 0 0.28rem rgba(251, 191, 36, 0.28);
            pointer-events: none;
            transition:
              top 90ms linear,
              box-shadow 170ms ease,
              filter 170ms ease;
          }

          .contact-mobile-scroll-controller:hover,
          .contact-mobile-scroll-controller:focus-visible {
            border-color: rgba(251, 191, 36, 0.38);
            opacity: 0.86;
            outline: none;
            box-shadow:
              inset 0 0 0 1px rgba(251, 191, 36, 0.12),
              0 0 0.42rem rgba(251, 191, 36, 0.16);
          }

          .contact-mobile-scroll-controller:hover .contact-mobile-scroll-controller__thumb,
          .contact-mobile-scroll-controller:focus-visible .contact-mobile-scroll-controller__thumb {
            filter: brightness(1.08) saturate(1.08);
            box-shadow:
              inset 0 0 0 1px rgba(255, 255, 255, 0.3),
              0 0 0.38rem rgba(251, 191, 36, 0.4);
          }
        }

        @media (max-width: 1023px) {
          #contact-console-surface > section,
          #contact-console-surface > aside {
            flex: none !important;
          }

          #contact-console-surface > section,
          #contact-console-surface > section > div,
          #contact-console-surface > aside,
          #contact-console-surface > aside > section {
            height: auto !important;
            min-height: 0 !important;
          }

          #contact-console-surface > section form {
            height: auto !important;
            min-height: 0 !important;
          }

          #contact-console-surface > section form textarea {
            height: 7.5rem !important;
            flex: none !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .contact-mobile-scroll-controller__thumb {
            transition: none;
          }
        }
      `}</style>
    </PageShell>
  );
}
