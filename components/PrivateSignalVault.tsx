"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Eye,
  House,
  Moon,
  Power,
  ShieldCheck,
  Sun,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type VaultPhase = "entry" | "boot" | "ready" | "closing";
type AccessState = "locked" | "verifying" | "accepted" | "rejected";
type MessageMode = "hex" | "bin" | "reg" | "dec" | "read";
type PresenceStatus = "online" | "offline" | "away";
type MessageLanguage =
  | "english"
  | "sinhala"
  | "tamil"
  | "japanese"
  | "chinese"
  | "german";

type PrivateSignalVaultProps = {
  open?: boolean;
  initialOpen?: boolean;
  onRequestClose?: () => void;
};

const BOOT_DURATION = 3400;
const ENTRY_DURATION = 1280;
const CLOSE_DURATION = 1500;
const ACCESS_PHRASES = ["catverse", "isanjalee", "meow"];
const bootMessages = [
  "AREA 51 LOCATION ENTRY - CLASSIFIED",
  "ISANJALEE PRIVATE NODE - HIGH SECURITY",
  "RED ALARM BEACONS ..... ACTIVE",
  "BIOMETRIC MESH ........ SCANNING",
  "IDENTITY CORE ......... ONLINE",
  "SRI LANKA RADAR ....... REGIONAL LOCK",
  "ACCESS GATE ........... LOCKED",
  "PRIVATE TERMINAL READY",
];

const visitorMessageText =
  "Welcome. Your curiosity led you beyond the obvious and into this private corner of my digital home. Kudos for following the signal and finding your way here. Stay curious.";

const messageModeLabels: Record<MessageMode, string> = {
  hex: "HEX",
  bin: "BIN",
  reg: "REG",
  dec: "DEC",
  read: "READ",
};

const messageLanguageLabels: Record<MessageLanguage, string> = {
  english: "ENGLISH",
  sinhala: "SINHALA",
  tamil: "TAMIL",
  japanese: "JAPANESE",
  chinese: "CHINESE",
  german: "GERMAN",
};

const visitorMessageTranslations: Record<MessageLanguage, string> = {
  english: visitorMessageText,
  sinhala:
    "සාදරයෙන් පිළිගනිමු. ඔබේ කුතුහලය පැහැදිලිව පෙනෙන දේට එහා ගොස් මගේ ඩිජිටල් නිවසේ මේ පෞද්ගලික කොන වෙත ඔබව ගෙන ආවා. සංඥාව අනුගමනය කර මෙතැනට පැමිණීම ගැන ඔබට ප්‍රශංසා. කුතුහලයෙන් සිටින්න, සිතා බලා ගවේෂණය කරන්න, ඔබ සොයාගන්නා දේ රසවිඳින්න.",
  tamil:
    "வரவேற்கிறேன். உங்கள் ஆர்வம் வெளிப்படையாகத் தெரியும் எல்லைகளைத் தாண்டி, என் டிஜிட்டல் இல்லத்தின் இந்தத் தனிப்பட்ட மூலையில் உங்களை கொண்டு வந்துள்ளது. சிக்னலைப் பின்தொடர்ந்து இங்கு வந்ததற்கு பாராட்டுகள். தொடர்ந்து ஆர்வமாக இருங்கள், சிந்தனையுடன் ஆராயுங்கள், நீங்கள் கண்டுபிடிப்பதை மகிழ்ந்து அனுபவியுங்கள்.",
  japanese:
    "ようこそ。あなたの好奇心が、目に見えるものの先へ進み、私のデジタルホームのこのプライベートな場所へと導きました。シグナルをたどり、ここを見つけた探究心に拍手を送ります。好奇心を持ち続け、丁寧に探索し、発見を楽しんでください。",
  chinese:
    "欢迎。你的好奇心带你越过显而易见的表面，来到我数字家园的这个私人角落。感谢你循着信号找到这里。请保持好奇，用心探索，并享受你的每一次发现。",
  german:
    "Willkommen. Deine Neugier hat dich über das Offensichtliche hinaus in diesen privaten Winkel meines digitalen Zuhauses geführt. Respekt dafür, dass du dem Signal gefolgt bist und hierhergefunden hast. Bleib neugierig, erkunde aufmerksam und genieße deine Entdeckungen.",
};

const chunkText = (text: string, size: number) =>
  text.match(new RegExp(`.{1,${size}}`, "g")) ?? [text];

const encodeVisitorMessage = (mode: MessageMode, language: MessageLanguage) => {
  if (mode === "read") return [visitorMessageTranslations[language]];
  if (mode === "reg") {
    return [
      "REGEX:",
      "/Welcome\\..*curiosity.*private\\s+corner.*digital\\s+home/i",
      "/Kudos.*following\\s+the\\s+signal.*Stay\\s+curious.*discover/i",
    ];
  }

  const encoded = Array.from(visitorMessageText)
    .map((character) => {
      const code = character.charCodeAt(0);
      if (mode === "hex")
        return code.toString(16).toUpperCase().padStart(2, "0");
      if (mode === "bin") return code.toString(2).padStart(8, "0");
      return code.toString(10).padStart(3, "0");
    })
    .join(" ");

  return chunkText(
    `${mode.toUpperCase()}: ${encoded}`,
    mode === "bin" ? 72 : 92,
  );
};

type SecurityScanner = {
  label: string;
  src: string;
  alt: string;
  mode: string;
  result: string;
};

const faceRecognitionScanner: SecurityScanner = {
  label: "FACE RECOGNITION",
  src: "/security/face-recognition-scan.png",
  alt: "Face recognition scanner",
  mode: "facial geometry",
  result: "Face geometry verified",
};

const createAudio = () => {
  const AudioContextCtor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextCtor) return null;
  return new AudioContextCtor();
};

const useVaultAudio = (enabled: boolean) => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const ensureContext = useCallback(() => {
    if (!enabled) return null;
    if (
      !audioContextRef.current ||
      audioContextRef.current.state === "closed"
    ) {
      audioContextRef.current = createAudio();
    }
    return audioContextRef.current;
  }, [enabled]);

  const tick = useCallback(
    (
      kind:
        | "tick"
        | "startup"
        | "accept"
        | "reject"
        | "module"
        | "alarm"
        | "close",
    ) => {
      const audioContext = ensureContext();
      if (!audioContext) return;

      const now = audioContext.currentTime;
      const gain = audioContext.createGain();
      const oscillator = audioContext.createOscillator();
      const map = {
        tick: [1180, 0.035, 0.045],
        startup: [180, 0.08, 0.22],
        accept: [760, 0.09, 0.28],
        reject: [150, 0.07, 0.16],
        module: [420, 0.055, 0.2],
        alarm: [980, 0.075, 0.38],
        close: [120, 0.06, 0.32],
      } satisfies Record<typeof kind, [number, number, number]>;
      const [frequency, volume, duration] = map[kind];

      oscillator.type =
        kind === "reject" || kind === "alarm" ? "sawtooth" : "sine";
      oscillator.frequency.setValueAtTime(frequency, now);
      if (kind === "alarm") {
        oscillator.frequency.setValueAtTime(980, now);
        oscillator.frequency.setValueAtTime(520, now + 0.08);
        oscillator.frequency.setValueAtTime(1160, now + 0.16);
        oscillator.frequency.setValueAtTime(640, now + 0.26);
      }
      oscillator.frequency.exponentialRampToValueAtTime(
        kind === "close" ? 72 : frequency * 1.42,
        now + duration,
      );
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(now);
      oscillator.stop(now + duration);
    },
    [ensureContext],
  );

  const closeAudio = useCallback(() => {
    const audioContext = audioContextRef.current;
    if (!audioContext || audioContext.state === "closed") return;
    audioContextRef.current = null;
    void audioContext.close().catch(() => undefined);
  }, []);

  useEffect(() => () => closeAudio(), [closeAudio]);

  return { tick };
};

function OriginRadar() {
  return (
    <section className="vault-panel vault-origin" aria-label="Origin node">
      <div className="vault-panel__top">
        <span>ISLAND RADAR</span>
        <b>PUBLIC REGION</b>
      </div>
      <div className="vault-map" aria-label="Digital map of Sri Lanka">
        <span className="vault-map__ocean" aria-hidden="true" />
        <span className="vault-map__light-trace" aria-hidden="true" />
        <Image
          src="/maps/sri-lanka-digital-map.png"
          alt="Digitized dark blue map of Sri Lanka"
          width={1024}
          height={1536}
          className="vault-sri-lanka-map"
          priority
        />
        <span className="vault-map__rings" aria-hidden="true" />
        <span className="vault-map__corners" aria-hidden="true" />
        <span className="vault-map__pings" aria-hidden="true">
          {Array.from({ length: 9 }, (_, index) => (
            <i key={index} style={{ "--i": index } as CSSProperties} />
          ))}
        </span>
        <span className="vault-map__scan" aria-hidden="true" />
      </div>
      <div className="vault-origin__privacy">
        <b>ORIGIN NODE</b>
        <span>LAT 6.71° N</span>
        <span>LON 79.91° E</span>
        <em>PRECISION: REGIONAL</em>
        <strong>COUNTRY CENTER</strong>
        <span>LAT 7.87° N</span>
        <span>LON 80.77° E</span>
        <small>LOCATION DATA APPROXIMATED</small>
      </div>
    </section>
  );
}

function IdentityCore({
  layer,
  presenceStatus,
  onToggle,
}: {
  layer: "symbolic" | "human";
  presenceStatus?: PresenceStatus;
  onToggle: () => void;
}) {
  return (
    <section className="vault-core-wrap" aria-label="Identity core">
      {presenceStatus ? (
        <strong
          className={`vault-core-presence vault-presence--${presenceStatus}`}
        >
          <i aria-hidden="true" />
          {presenceStatus.toUpperCase()}
        </strong>
      ) : null}
      <button
        type="button"
        className="vault-core"
        onClick={onToggle}
        aria-label="Toggle identity layer"
      >
        <span className="vault-core__ring vault-core__ring--one" />
        <span className="vault-core__ring vault-core__ring--two" />
        <span className="vault-core__sweep" />
        <span className="vault-core__particles" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => (
            <i key={index} style={{ "--i": index } as CSSProperties} />
          ))}
        </span>
        <span className="vault-core__media">
          <AnimatePresence mode="wait">
            {layer === "symbolic" ? (
              <motion.span
                key="symbolic"
                initial={{ opacity: 0, scale: 0.86, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotate: 8 }}
              >
                <Image
                  src="/brand/isanjalee-logo-square-white.png"
                  alt="Isanjalee symbol"
                  width={150}
                  height={150}
                  priority
                  className="vault-brand-logo vault-brand-logo--on-dark"
                />
                <Image
                  src="/brand/isanjalee-logo-square-black.png"
                  alt=""
                  width={150}
                  height={150}
                  priority
                  className="vault-brand-logo vault-brand-logo--on-light"
                />
              </motion.span>
            ) : (
              <motion.span
                key="human"
                className="vault-core__portrait-frame"
                initial={{ opacity: 0, scale: 0.86, rotate: 8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotate: -8 }}
                aria-label="Isanjalee Silva portrait signal"
              >
                <Image
                  src="/brand/isanjalee-portrait-cutout.png"
                  alt="Isanjalee Silva"
                  width={420}
                  height={420}
                  priority
                  className="vault-core__portrait-image"
                />
                <i aria-hidden="true" />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </button>
      <div className="vault-core-label">
        <span>IDENTITY CORE</span>
        <b>STATUS: STABLE</b>
        <em>IDENTITY LAYER: {layer === "human" ? "HUMAN" : "SYMBOLIC"}</em>
      </div>
    </section>
  );
}

function VisitorMessage() {
  const [messageMode, setMessageMode] = useState<MessageMode>("hex");
  const [messageLanguage, setMessageLanguage] =
    useState<MessageLanguage>("english");
  const payload = useMemo(
    () => encodeVisitorMessage(messageMode, messageLanguage),
    [messageLanguage, messageMode],
  );

  return (
    <section className="vault-message" aria-label="Message for visitors">
      <div>
        <span>VISITOR MESSAGE</span>
        <div
          className="vault-message__language"
          role="tablist"
          aria-label="Message encoding mode"
        >
          {Object.entries(messageModeLabels).map(([value, label]) => {
            const nextMode = value as MessageMode;
            const isActive = messageMode === nextMode;

            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={isActive ? "is-active" : ""}
                onClick={() => setMessageMode(nextMode)}
              >
                {label}
              </button>
            );
          })}
        </div>
        {messageMode === "read" ? (
          <div
            className="vault-message__translator"
            role="tablist"
            aria-label="Readable message language"
          >
            {Object.entries(messageLanguageLabels).map(([value, label]) => {
              const nextLanguage = value as MessageLanguage;
              const isActive = messageLanguage === nextLanguage;

              return (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={isActive ? "is-active" : ""}
                  onClick={() => setMessageLanguage(nextLanguage)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        ) : null}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${messageMode}-${messageLanguage}`}
            className={`vault-message__payload vault-message__payload--${messageMode}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            {payload.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="vault-message__codes" aria-hidden="true">
        {payload.slice(0, 4).map((line, index) => (
          <b key={`${messageMode}-${index}`}>{line}</b>
        ))}
      </div>
    </section>
  );
}

function SecurityDeck({
  state,
  unlocked,
  biometricVerified,
  onScannerSelect,
}: {
  state: AccessState;
  unlocked: boolean;
  biometricVerified: boolean;
  onScannerSelect: (scanner: SecurityScanner) => void;
}) {
  return (
    <section
      className={`vault-security vault-security--${state} ${
        unlocked ? "vault-security--unlocked" : ""
      } ${biometricVerified ? "vault-security--biometric-verified" : ""}`}
      aria-label="Security scanners"
    >
      <div className="vault-panel__top">
        <span>SECURITY MESH</span>
        <b>
          {biometricVerified
            ? "HUMAN VERIFIED"
            : unlocked
              ? "FACE REQUIRED"
              : state === "rejected"
                ? "WARNING"
                : "SCANNING"}
        </b>
      </div>
      <div className="vault-security-body">
        <motion.button
          type="button"
          className="vault-security-face"
          onClick={() => onScannerSelect(faceRecognitionScanner)}
          aria-label="Open face recognition scan"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.985 }}
        >
          <Image
            src={faceRecognitionScanner.src}
            alt={faceRecognitionScanner.alt}
            width={1024}
            height={1024}
            className="vault-security-face__image"
          />
          <span>FACE_RECOGNITION</span>
        </motion.button>
      </div>
    </section>
  );
}

function AccessGuidance({
  unlocked,
  biometricVerified,
  onPasswordFocus,
  onFaceStart,
}: {
  unlocked: boolean;
  biometricVerified: boolean;
  onPasswordFocus: () => void;
  onFaceStart: () => void;
}) {
  const [open, setOpen] = useState(false);

  if (unlocked && biometricVerified) return null;

  const closeAndRun = (callback: () => void) => {
    setOpen(false);
    callback();
  };

  if (unlocked) {
    return (
      <div className="vault-security-notifier vault-security-notifier--warning">
        <button
          type="button"
          aria-label="Open security guidance"
          onClick={() => setOpen((value) => !value)}
        >
          !
        </button>
        <AnimatePresence>
          {open ? (
            <motion.div
              className="vault-security-popover"
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
            >
              <b>HUMAN CHECK REQUIRED</b>
              <p>
                Access phrase accepted. Verify you are human, not an automated
                visitor, to decrypt the message.
              </p>
              <button type="button" onClick={() => closeAndRun(onFaceStart)}>
                RUN FACE RECOGNITION
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }

  if (biometricVerified) {
    return (
      <div className="vault-security-notifier vault-security-notifier--success">
        <button
          type="button"
          aria-label="Open security guidance"
          onClick={() => setOpen((value) => !value)}
        >
          i
        </button>
        <AnimatePresence>
          {open ? (
            <motion.div
              className="vault-security-popover"
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
            >
              <b>HUMAN VERIFIED</b>
              <p>
                Biometric guard is clear. Enter the access phrase to unlock the
                visitor message.
              </p>
              <button
                type="button"
                onClick={() => closeAndRun(onPasswordFocus)}
              >
                ENTER ACCESS PHRASE
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="vault-security-notifier vault-security-notifier--attention">
      <button
        type="button"
        aria-label="Open security guidance"
        onClick={() => setOpen((value) => !value)}
      >
        !
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="vault-security-popover"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
          >
            <b>ACCESS NEEDS TWO SIGNALS</b>
            <p>
              Complete the access phrase and human verification. The visitor
              message stays sealed until both pass.
            </p>
            <div>
              <button
                type="button"
                onClick={() => closeAndRun(onPasswordFocus)}
              >
                ACCESS PHRASE
              </button>
              <button type="button" onClick={() => closeAndRun(onFaceStart)}>
                HUMAN VERIFY
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function BiometricScanModal({
  scanner,
  complete,
  onClose,
}: {
  scanner: SecurityScanner;
  complete: boolean;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="vault-face-scan"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={`${scanner.label} biometric scan`}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 8 }}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" aria-label="Close scan" onClick={onClose}>
          <X size={16} />
        </button>
        <div className="vault-face-scan__top">
          <span>{scanner.mode.toUpperCase()}</span>
          <b className={complete ? "is-complete" : ""}>
            {complete ? "HUMAN VERIFIED" : "BIOMETRIC GUARD ACTIVE"}
          </b>
        </div>
        <div className="vault-face-scan__stage">
          <Image
            src="/security/face-recognition-scan.png"
            alt="Face recognition scanner"
            width={1024}
            height={1024}
            className="vault-face-scan__face"
          />
          <span className="vault-face-scan__ring vault-face-scan__ring--one" />
          <span className="vault-face-scan__ring vault-face-scan__ring--two" />
          <span className="vault-face-scan__sweep" />
          <span className="vault-face-scan__lock" />
          <span className="vault-face-scan__beam vault-face-scan__beam--ltr" />
          <span className="vault-face-scan__beam vault-face-scan__beam--rtl" />
          <span className="vault-face-scan__beam vault-face-scan__beam--ttb" />
          <span className="vault-face-scan__beam vault-face-scan__beam--btt" />
          <span className="vault-face-scan__points" aria-hidden="true">
            {Array.from({ length: 14 }, (_, index) => (
              <i key={index} />
            ))}
          </span>
        </div>
        <div className="vault-face-scan__readout">
          <div className="vault-face-scan__terminal">
            <p>
              {complete
                ? scanner.result
                : "Initializing biometric guard protocol..."}
            </p>
            <p>
              {complete
                ? "Face detected - human identity verified"
                : "Scanning facial landmarks, contour mesh, and thermal symmetry"}
            </p>
          </div>
          <label
            className={`vault-face-scan__verify ${
              complete ? "vault-face-scan__verify--complete" : ""
            }`}
          >
            <input type="checkbox" checked={complete} readOnly />
            <span>{complete ? "Human verified" : "Human verification pending"}</span>
          </label>
          <em>
            {complete
              ? "ACCESS TRUST SCORE: 99.8%"
              : "SECURITY GUARD STATUS: ACTIVE SCAN"}
          </em>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PrivateSignalVault({
  open,
  initialOpen = false,
  onRequestClose,
}: PrivateSignalVaultProps) {
  const reducedMotion = useReducedMotion();
  const { resolvedTheme, setTheme } = useTheme();
  const controlled = typeof open === "boolean";
  const [internalOpen, setInternalOpen] = useState(initialOpen);
  const isOpen = controlled ? !!open : internalOpen;
  const [phase, setPhase] = useState<VaultPhase>("entry");
  const [bootProgress, setBootProgress] = useState(0);
  const [accessPhrase, setAccessPhrase] = useState("");
  const [showPhrase, setShowPhrase] = useState(false);
  const [showClue, setShowClue] = useState(false);
  const [accessState, setAccessState] = useState<AccessState>("locked");
  const [attempts, setAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [biometricVerified, setBiometricVerified] = useState(false);
  const [identityLayer, setIdentityLayer] = useState<"symbolic" | "human">(
    "symbolic",
  );
  const [presenceStatus, setPresenceStatus] =
    useState<PresenceStatus>("away");
  const [activeScan, setActiveScan] = useState<SecurityScanner | null>(null);
  const [scanComplete, setScanComplete] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const [audioMuted, setAudioMuted] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("private-vault-audio-muted") === "true";
  });
  const [terminalNote, setTerminalNote] = useState("CHANNEL FOCUSED");
  const accessInputRef = useRef<HTMLInputElement>(null);
  const { tick } = useVaultAudio(isOpen && !audioMuted);

  useEffect(() => {
    if (!isOpen) return;
    window.localStorage.setItem(
      "private-vault-audio-muted",
      String(audioMuted),
    );
  }, [audioMuted, isOpen]);

  useEffect(() => {
    document.body.classList.toggle("private-vault-active", isOpen);
    document.body.classList.toggle(
      "private-vault-entering",
      isOpen && phase === "entry",
    );
    return () => {
      document.body.classList.remove("private-vault-active");
      document.body.classList.remove("private-vault-entering");
    };
  }, [isOpen, phase]);

  useEffect(() => {
    if (!isOpen) return;

    const resetTimer = window.setTimeout(() => {
      setPhase("entry");
      setBootProgress(0);
      setAccessPhrase("");
      setShowPhrase(false);
      setShowClue(false);
      setAccessState("locked");
      setAttempts(0);
      setCooldown(0);
      setUnlocked(false);
      setBiometricVerified(false);
      setIdentityLayer("symbolic");
      setPresenceStatus("away");
      setActiveScan(null);
      setScanComplete(false);
      setConfirmExit(false);
      setTerminalNote("CHANNEL FOCUSED");
    }, 0);

    const entryTimer = window.setTimeout(
      () => setPhase("boot"),
      reducedMotion ? 120 : ENTRY_DURATION,
    );

    return () => {
      window.clearTimeout(resetTimer);
      window.clearTimeout(entryTimer);
    };
  }, [isOpen, reducedMotion]);

  useEffect(() => {
    if (!isOpen || audioMuted) return;
    tick("startup");
  }, [audioMuted, isOpen, tick]);

  useEffect(() => {
    if (!isOpen || phase !== "boot") return;
    tick("alarm");

    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const nextProgress = Math.min(
        100,
        ((Date.now() - startedAt) / BOOT_DURATION) * 100,
      );
      setBootProgress(nextProgress);
      if (nextProgress >= 100) {
        window.clearInterval(timer);
        setPhase("ready");
      }
    }, 32);

    return () => window.clearInterval(timer);
  }, [isOpen, phase, tick]);

  useEffect(() => {
    if (!cooldown) return;
    const timer = window.setInterval(() => {
      setCooldown((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (!activeScan) return;

    const timer = window.setTimeout(() => {
      setScanComplete(true);
      setTerminalNote(`${activeScan.label} - HUMAN VERIFIED`);
      if (activeScan.label === faceRecognitionScanner.label) {
        setBiometricVerified(true);
        setIdentityLayer("human");
      }
      tick("accept");
    }, reducedMotion ? 700 : 3000);

    return () => window.clearTimeout(timer);
  }, [activeScan, reducedMotion, tick]);

  useEffect(() => {
    if (!activeScan || !scanComplete) return;
    const timer = window.setTimeout(() => {
      setActiveScan(null);
      setScanComplete(false);
    }, reducedMotion ? 500 : 2000);

    return () => window.clearTimeout(timer);
  }, [activeScan, reducedMotion, scanComplete]);

  const openSecurityScan = useCallback(
    (scanner: SecurityScanner) => {
      setActiveScan(scanner);
      setScanComplete(false);
      if (scanner.label === faceRecognitionScanner.label) {
        setBiometricVerified(false);
      }
      setTerminalNote(`${scanner.label} - BIOMETRIC SCAN ACTIVE`);
      tick("alarm");
    },
    [tick],
  );

  const focusAccessPhrase = useCallback(() => {
    accessInputRef.current?.focus();
    setTerminalNote("ACCESS PHRASE FIELD TARGETED");
    tick("module");
  }, [tick]);

  const visibleBootMessages = useMemo(() => {
    const messageCount = Math.min(
      bootMessages.length,
      Math.max(1, Math.ceil((bootProgress / 100) * bootMessages.length)),
    );
    return bootMessages.slice(0, messageCount);
  }, [bootProgress]);

  const closeVault = useCallback(() => {
    setPhase("closing");
    setTerminalNote("CLOSING PRIVATE CHANNEL...");
    tick("close");
    window.setTimeout(
      () => {
        if (onRequestClose) {
          onRequestClose();
        } else {
          setInternalOpen(false);
          window.location.href = "/";
        }
      },
      reducedMotion ? 120 : CLOSE_DURATION,
    );
  }, [onRequestClose, reducedMotion, tick]);

  const verifyAccess = useCallback(() => {
    if (cooldown || unlocked || accessState === "verifying") return;
    setAccessState("verifying");
    setTerminalNote("VERIFYING ACCESS SIGNATURE...");
    tick("module");

    window.setTimeout(
      () => {
        const normalized = accessPhrase.trim().toLowerCase();
        if (ACCESS_PHRASES.includes(normalized)) {
          setAccessState("accepted");
          setUnlocked(true);
          setTerminalNote("SIGNATURE ACCEPTED - ACCESS GATE OPEN");
          tick("accept");
          return;
        }

        const nextAttempts = attempts + 1;
        setAttempts(nextAttempts);
        setAccessState("rejected");
        setTerminalNote("SIGNATURE NOT RECOGNIZED - GATE REMAINS SEALED");
        tick(nextAttempts >= 3 ? "alarm" : "reject");
        if (nextAttempts >= 3) {
          setCooldown(8);
          setAttempts(0);
          setTerminalNote("SYSTEM COOLING - RETRY AVAILABLE IN 08");
        }
      },
      reducedMotion ? 120 : 760,
    );
  }, [
    accessPhrase,
    accessState,
    attempts,
    cooldown,
    reducedMotion,
    tick,
    unlocked,
  ]);

  const typedSegments = Math.min(12, accessPhrase.length);
  const accessGranted = unlocked && biometricVerified;

  useEffect(() => {
    if (!accessGranted) return;

    const statuses: PresenceStatus[] = ["online", "away", "offline"];
    const rotateStatus = () => {
      setPresenceStatus((current) => {
        const alternatives = statuses.filter((status) => status !== current);
        return alternatives[Math.floor(Math.random() * alternatives.length)];
      });
    };

    const firstUpdate = window.setTimeout(rotateStatus, 0);
    const rotation = window.setInterval(rotateStatus, 60000);

    return () => {
      window.clearTimeout(firstUpdate);
      window.clearInterval(rotation);
    };
  }, [accessGranted]);

  const interfaceMetrics = [
    { label: "SESSION", value: "LOCAL", tone: "neutral" },
    {
      label: "PASSWORD",
      value: unlocked ? "VERIFIED" : "PENDING",
      tone: unlocked ? "secure" : "pending",
    },
    {
      label: "FACE CHECK",
      value: biometricVerified ? "VERIFIED" : "PENDING",
      tone: biometricVerified ? "secure" : "pending",
    },
    {
      label: "ACCESS",
      value: accessGranted ? "GRANTED" : "LOCKED",
      tone: accessGranted ? "secure" : "sealed",
    },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="private-vault"
        role="dialog"
        aria-modal="true"
        aria-label="Isanjalee private signal vault"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <style>{vaultCss}</style>
        <div className="private-vault__grid" aria-hidden="true" />
        <div className="private-vault__noise" aria-hidden="true" />

        <AnimatePresence mode="wait">
          {phase === "entry" ? (
            <motion.div
              key="entry"
              className="vault-entry"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.08 }}
            >
              <motion.div
                className="vault-entry__core"
                animate={{
                  scale: [0.72, 0.72, 1.24, 18],
                  opacity: [0, 1, 1, 0],
                  rotate: [0, 0, 20, 120],
                }}
                transition={{
                  times: [0, 0.16, 0.62, 1],
                  duration: reducedMotion ? 0.18 : 1.2,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src="/brand/isanjalee-logo-square-white.png"
                  alt=""
                  width={140}
                  height={140}
                  priority
                  className="vault-brand-logo vault-brand-logo--on-dark"
                />
                <Image
                  src="/brand/isanjalee-logo-square-black.png"
                  alt=""
                  width={140}
                  height={140}
                  priority
                  className="vault-brand-logo vault-brand-logo--on-light"
                />
              </motion.div>
              <motion.div
                className="vault-entry__tunnel"
                animate={{ rotate: 360, scale: [0.8, 1.45] }}
                transition={{
                  duration: reducedMotion ? 0.18 : 1.25,
                  ease: "easeInOut",
                }}
                aria-hidden="true"
              />
            </motion.div>
          ) : null}

          {phase === "boot" ? (
            <motion.section
              key="boot"
              className="vault-boot"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <div className="vault-boot__core" aria-hidden="true">
                <Image
                  src="/brand/isanjalee-logo-square-white.png"
                  alt=""
                  width={96}
                  height={96}
                  priority
                  className="vault-brand-logo vault-brand-logo--on-dark"
                />
                <Image
                  src="/brand/isanjalee-logo-square-black.png"
                  alt=""
                  width={96}
                  height={96}
                  priority
                  className="vault-brand-logo vault-brand-logo--on-light"
                />
                <span />
              </div>
              <div className="vault-boot__terminal">
                {visibleBootMessages.map((message) => (
                  <motion.p
                    key={message}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {message}
                  </motion.p>
                ))}
              </div>
              <div className="vault-boot__progress">
                <span style={{ width: `${bootProgress}%` }} />
              </div>
              <div className="vault-boot__matrix" aria-hidden="true">
                {Array.from({ length: 20 }, (_, index) => (
                  <i key={index} style={{ "--i": index } as CSSProperties} />
                ))}
              </div>
              <div className="vault-tail-loader" aria-hidden="true" />
            </motion.section>
          ) : null}

          {phase === "ready" || phase === "closing" ? (
            <motion.div
              key="ready"
              className="vault-shell"
              initial={{ opacity: 0, filter: "blur(12px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
            >
              <header className="vault-topbar">
                <div>
                  <b>ISANJALEE PRIVATE NODE</b>
                  <span>SECURE CHANNEL 01</span>
                </div>
                <div className="vault-topbar__actions">
                  <button
                    type="button"
                    onClick={() =>
                      setTheme(resolvedTheme === "light" ? "dark" : "light")
                    }
                    aria-label={`Use ${resolvedTheme === "light" ? "dark" : "light"} theme`}
                  >
                    {resolvedTheme === "light" ? (
                      <Moon size={15} />
                    ) : (
                      <Sun size={15} />
                    )}
                    THEME: {resolvedTheme === "light" ? "LIGHT" : "DARK"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const nextMuted = !audioMuted;
                      setAudioMuted(nextMuted);
                      if (!nextMuted) {
                        tick("startup");
                      }
                    }}
                    aria-label={audioMuted ? "Activate audio" : "Mute audio"}
                  >
                    {audioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                    AUDIO: {audioMuted ? "MUTED" : "ACTIVE"}
                  </button>
                  <span>SIGNAL: STABLE</span>
                </div>
              </header>

              <main className="vault-main">
                <OriginRadar />
                <div className="vault-center-stack">
                  <IdentityCore
                    layer={identityLayer}
                    presenceStatus={accessGranted ? presenceStatus : undefined}
                    onToggle={() => {
                      setIdentityLayer((value) =>
                        value === "symbolic" ? "human" : "symbolic",
                      );
                      setTerminalNote("VISUAL LAYER READY");
                      tick("module");
                    }}
                  />
                </div>
                <section
                  className={`vault-panel vault-gate vault-gate--${accessState} ${
                    accessGranted ? "vault-gate--unlocked" : ""
                  }`}
                  aria-label="Access gate"
                >
                  <AnimatePresence mode="wait">
                    {!accessGranted ? (
                      <motion.div
                        key="gate"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                      >
                        <div className="vault-panel__top">
                          <span>ACCESS GATE</span>
                          <b>
                            {cooldown
                              ? "SYSTEM COOLING"
                              : unlocked
                                ? "PASSWORD VERIFIED"
                                : "LOCKED"}
                          </b>
                        </div>
                        <form
                          className={`vault-access-console ${
                            accessState === "rejected" ? "is-rejected" : ""
                          }`}
                          onSubmit={(event) => {
                            event.preventDefault();
                            verifyAccess();
                          }}
                        >
                          <div className="vault-field-head">
                            <label htmlFor="access-phrase">
                              ENTER ACCESS PHRASE
                            </label>
                            <AccessGuidance
                              unlocked={unlocked}
                              biometricVerified={biometricVerified}
                              onPasswordFocus={focusAccessPhrase}
                              onFaceStart={() =>
                                openSecurityScan(faceRecognitionScanner)
                              }
                            />
                          </div>
                          <div className="vault-input-wrap">
                            <input
                              ref={accessInputRef}
                              id="access-phrase"
                              type={showPhrase ? "text" : "password"}
                              value={accessPhrase}
                              disabled={
                                !!cooldown ||
                                unlocked ||
                                accessState === "verifying"
                              }
                              onChange={(event) => {
                                setAccessPhrase(event.target.value);
                                setAccessState("locked");
                                setTerminalNote("SIGNAL RECEIVED");
                                tick("tick");
                              }}
                              autoComplete="off"
                              aria-describedby="access-clue"
                            />
                            <button
                              type="button"
                              aria-label="Temporarily reveal access phrase"
                              onPointerDown={() => setShowPhrase(true)}
                              onPointerUp={() => setShowPhrase(false)}
                              onPointerLeave={() => setShowPhrase(false)}
                              onBlur={() => setShowPhrase(false)}
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                          <div className="vault-scanner" aria-hidden="true">
                            {Array.from({ length: 12 }, (_, index) => (
                              <span
                                key={index}
                                className={
                                  index < typedSegments ||
                                  accessState === "accepted"
                                    ? "is-active"
                                    : ""
                                }
                              />
                            ))}
                          </div>
                          <div className="vault-action-row">
                            <button
                              type="submit"
                              className="vault-verify"
                              disabled={
                                !!cooldown ||
                                unlocked ||
                                accessState === "verifying"
                              }
                            >
                              <ShieldCheck size={15} />
                              {unlocked
                                ? "PASSWORD VERIFIED"
                                : accessState === "verifying"
                                ? "VERIFYING ACCESS SIGNATURE..."
                                : cooldown
                                  ? `RETRY AVAILABLE IN ${String(cooldown).padStart(2, "0")}`
                                  : "VERIFY SIGNATURE"}
                            </button>
                            <button
                              type="button"
                              id="access-clue"
                              className="vault-clue"
                              onClick={() => {
                                setShowClue((value) => !value);
                                setTerminalNote("CLUE CHANNEL OPEN");
                                tick("module");
                              }}
                            >
                              REQUEST ACCESS CLUE
                            </button>
                          </div>
                        </form>
                        <SecurityDeck
                          state={accessState}
                          unlocked={unlocked}
                          biometricVerified={biometricVerified}
                          onScannerSelect={openSecurityScan}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="granted"
                        className="vault-granted"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <div className="vault-panel__top">
                          <span>ACCESS GRANTED</span>
                          <b>IDENTITY VERIFIED</b>
                        </div>
                        <div className="vault-clearance">
                          <b>ACCESS GRANTED</b>
                          <p>Identity confirmed. Private visitor channel unlocked.</p>
                        </div>
                        <VisitorMessage />
                        <button
                          type="button"
                          className="vault-return-home"
                          onClick={closeVault}
                        >
                          <House size={15} />
                          RETURN TO HOME
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>
              </main>

              <section className="vault-metrics" aria-label="Interface metrics">
                {interfaceMetrics.map(({ label, value, tone }) => (
                  <span
                    key={label}
                    className={`vault-metric--${tone}`}
                  >
                    <b>{label}</b>
                    <em>{value}</em>
                  </span>
                ))}
                <small>LOCAL INTERFACE STATUS</small>
              </section>

              <footer className="vault-footer">
                <span>{terminalNote}</span>
                <button
                  type="button"
                  onClick={() => setConfirmExit(true)}
                  className="vault-terminate"
                >
                  <Power size={15} />
                  TERMINATE SESSION
                </button>
              </footer>

              <AnimatePresence>
                {showClue ? (
                  <motion.div
                    className="vault-clue-modal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Access clue"
                    onClick={() => setShowClue(false)}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <button
                        type="button"
                        aria-label="Close clue"
                        onClick={() => setShowClue(false)}
                      >
                        <X size={16} />
                      </button>
                      <span>CLUE CHANNEL OPEN</span>
                      <p>
                        Ask the tiny guardian who answers with soft paws, bright
                        eyes, and a very small sound.
                      </p>
                      <b>ACCESS PHRASE IS A CUTE SIGNAL, NOT A PLACE.</b>
                    </motion.div>
                  </motion.div>
                ) : null}

                {activeScan ? (
                  <BiometricScanModal
                    scanner={activeScan}
                    complete={scanComplete}
                    onClose={() => setActiveScan(null)}
                  />
                ) : null}

              </AnimatePresence>

              <AnimatePresence>
                {confirmExit ? (
                  <motion.div
                    className="vault-confirm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div>
                      <b>TERMINATE CURRENT SESSION?</b>
                      <span>UNLOCKED MODULES WILL CLOSE.</span>
                      {phase === "closing" ? (
                        <p>CLOSING PRIVATE CHANNEL...</p>
                      ) : null}
                      <div>
                        <button type="button" onClick={closeVault}>
                          TERMINATE
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmExit(false)}
                        >
                          RETURN
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

const vaultCss = `
  .private-vault {
    position: fixed;
    inset: 0;
    z-index: 120;
    display: grid;
    place-items: center;
    overflow: hidden;
    color: #f7f8ff;
    background:
      radial-gradient(circle at 50% 35%, rgba(34, 211, 238, 0.12), transparent 34%),
      radial-gradient(circle at 78% 22%, rgba(163, 230, 53, 0.1), transparent 28%),
      #060817;
    cursor: url("/cursors/rat-pointer.svg") 8 6, auto;
  }

  .private-vault button,
  .private-vault a {
    cursor: url("/cursors/rat-pointer-active.svg") 8 6, pointer;
  }

  .private-vault__grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(34, 211, 238, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(163, 230, 53, 0.06) 1px, transparent 1px);
    background-size: 42px 42px;
    mask-image: radial-gradient(circle at center, black, transparent 78%);
    opacity: 0.38;
  }

  .private-vault__noise {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.03), transparent);
    animation: vaultScan 5.8s linear infinite;
  }

  .vault-entry {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
  }

  .vault-entry__core {
    position: relative;
    z-index: 3;
    width: 9rem;
    height: 9rem;
    display: grid;
    place-items: center;
    border: 1px solid rgba(34, 211, 238, 0.55);
    border-radius: 999px;
    box-shadow: 0 0 36px rgba(34, 211, 238, 0.4);
  }

  .vault-entry__core img {
    width: 72%;
    height: 72%;
    object-fit: contain;
    filter: drop-shadow(0 0 18px rgba(34, 211, 238, 0.8));
  }

  .vault-entry__tunnel {
    position: absolute;
    width: min(80vw, 46rem);
    aspect-ratio: 1;
    border-radius: 50%;
    background:
      repeating-conic-gradient(from 0deg, rgba(34, 211, 238, 0.38) 0 4deg, transparent 4deg 12deg),
      radial-gradient(circle, transparent 36%, rgba(14, 165, 233, 0.12), transparent 66%);
    filter: blur(0.2px);
    opacity: 0.9;
  }

  .vault-boot {
    position: relative;
    z-index: 2;
    width: min(92vw, 42rem);
    padding: 1.5rem;
    border: 1px solid rgba(34, 211, 238, 0.28);
    background: rgba(13, 16, 38, 0.88);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255,255,255,0.08);
    backdrop-filter: blur(18px);
  }

  .vault-boot__terminal {
    min-height: 13rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    color: rgba(247, 248, 255, 0.88);
    letter-spacing: 0.08em;
  }

  .vault-boot__terminal p {
    margin: 0 0 0.8rem;
    font-size: clamp(0.78rem, 1.6vw, 1rem);
  }

  .vault-boot__progress {
    height: 0.42rem;
    overflow: hidden;
    border: 1px solid rgba(34, 211, 238, 0.32);
    background: rgba(255, 255, 255, 0.05);
  }

  .vault-boot__progress span {
    display: block;
    height: 100%;
    background: linear-gradient(90deg, #22d3ee, #0ea5e9, #a3e635);
    transition: width 80ms linear;
  }

  .vault-tail-loader {
    width: 7rem;
    height: 1.1rem;
    margin-top: 0.8rem;
    border-bottom: 2px solid rgba(163, 230, 53, 0.75);
    border-radius: 0 0 80% 80%;
    animation: vaultTail 1.1s ease-in-out infinite;
  }

  .vault-shell {
    position: relative;
    z-index: 2;
    display: grid;
    width: min(94vw, 74rem);
    height: min(90dvh, 46rem);
    grid-template-rows: auto minmax(0, 1fr) auto auto;
    border: 1px solid rgba(34, 211, 238, 0.24);
    background: linear-gradient(180deg, rgba(13, 16, 38, 0.94), rgba(6, 8, 23, 0.96));
    box-shadow: 0 28px 90px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.08);
    backdrop-filter: blur(22px);
  }

  .vault-topbar,
  .vault-footer,
  .vault-metrics {
    border-color: rgba(34, 211, 238, 0.18);
  }

  .vault-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1.2rem;
    border-bottom: 1px solid rgba(34, 211, 238, 0.18);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }

  .vault-topbar b,
  .vault-topbar span,
  .vault-footer,
  .vault-panel__top,
  .vault-origin__copy,
  .vault-access-console label,
  .vault-clue,
  .vault-modules button,
  .vault-metrics,
  .vault-module-panel {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }

  .vault-topbar > div:first-child {
    display: grid;
    gap: 0.2rem;
  }

  .vault-topbar b {
    font-size: clamp(0.78rem, 1.5vw, 0.96rem);
    letter-spacing: 0.1em;
  }

  .vault-topbar span {
    color: rgba(247, 248, 255, 0.58);
    font-size: 0.68rem;
    letter-spacing: 0.12em;
  }

  .vault-topbar__actions {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    color: rgba(247, 248, 255, 0.72);
    font-size: 0.68rem;
    letter-spacing: 0.12em;
  }

  .vault-topbar__actions button {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    border: 1px solid rgba(34, 211, 238, 0.24);
    padding: 0.42rem 0.55rem;
    color: inherit;
    background: rgba(255, 255, 255, 0.04);
  }

  .vault-main {
    display: grid;
    min-height: 0;
    grid-template-columns: minmax(14rem, 0.88fr) minmax(18rem, 1.2fr) minmax(16rem, 0.98fr);
    gap: 0.9rem;
    padding: 1rem;
    overflow: hidden;
  }

  .vault-panel {
    min-width: 0;
    border: 1px solid rgba(34, 211, 238, 0.16);
    background: rgba(255, 255, 255, 0.035);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  }

  .vault-panel__top {
    display: flex;
    justify-content: space-between;
    gap: 0.6rem;
    padding: 0.78rem 0.82rem;
    border-bottom: 1px solid rgba(34, 211, 238, 0.13);
    color: rgba(247, 248, 255, 0.66);
    font-size: 0.62rem;
    letter-spacing: 0.12em;
  }

  .vault-panel__top b {
    color: #22d3ee;
    font-weight: 800;
  }

  .vault-origin {
    display: grid;
    min-height: 0;
    grid-template-rows: auto minmax(10rem, 1fr) auto auto;
  }

  .vault-map {
    display: grid;
    min-height: 0;
    place-items: center;
    color: #22d3ee;
    overflow: hidden;
  }

  .vault-map svg {
    width: 100%;
    max-width: 18rem;
    height: auto;
    filter: drop-shadow(0 0 16px rgba(34, 211, 238, 0.22));
  }

  .vault-origin__copy {
    display: grid;
    gap: 0.3rem;
    padding: 0 0.85rem 0.8rem;
    font-size: 0.7rem;
    letter-spacing: 0.09em;
  }

  .vault-origin__copy span,
  .vault-origin__copy small {
    color: rgba(247, 248, 255, 0.56);
  }

  .vault-origin__copy b {
    color: #f7f8ff;
  }

  .vault-origin__copy em {
    color: #a3e635;
    font-style: normal;
  }

  .vault-mini-link {
    display: block;
    margin: 0 0.85rem 0.85rem;
    border: 1px solid rgba(163, 230, 53, 0.28);
    padding: 0.55rem;
    color: rgba(247, 248, 255, 0.72);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.58rem;
    letter-spacing: 0.1em;
    text-align: center;
    text-decoration: none;
  }

  .vault-core-wrap {
    display: grid;
    min-height: 0;
    place-items: center;
    align-content: center;
    gap: 0.8rem;
  }

  .vault-core {
    position: relative;
    display: grid;
    width: min(28vw, 18rem);
    min-width: 14rem;
    aspect-ratio: 1;
    place-items: center;
    border: 1px solid rgba(34, 211, 238, 0.32);
    border-radius: 999px;
    color: white;
    background: radial-gradient(circle, rgba(34, 211, 238, 0.12), rgba(13, 16, 38, 0.34) 54%, transparent 68%);
    box-shadow: 0 0 48px rgba(34, 211, 238, 0.14);
  }

  .vault-core__ring,
  .vault-core__sweep,
  .vault-core__particles {
    position: absolute;
    inset: 7%;
    border-radius: 999px;
    pointer-events: none;
  }

  .vault-core__ring {
    border: 1px solid rgba(34, 211, 238, 0.45);
  }

  .vault-core__ring--one {
    animation: vaultRotate 8s linear infinite;
  }

  .vault-core__ring--two {
    inset: 14%;
    border-style: dashed;
    border-color: rgba(163, 230, 53, 0.5);
    animation: vaultRotate 12s linear infinite reverse;
  }

  .vault-core__sweep {
    background: conic-gradient(from 0deg, rgba(34, 211, 238, 0.3), transparent 28%);
    mask-image: radial-gradient(circle, transparent 48%, black 49%, black 52%, transparent 53%);
    animation: vaultRotate 4.5s linear infinite;
  }

  .vault-core__particles i {
    --angle: calc(var(--i) * 20deg);
    position: absolute;
    left: 50%;
    top: 50%;
    width: 0.22rem;
    height: 0.22rem;
    border-radius: 999px;
    background: #a3e635;
    transform: rotate(var(--angle)) translateX(7.1rem);
    transform-origin: 0 0;
    opacity: 0.55;
    animation: vaultParticle 2.4s ease-in-out infinite;
    animation-delay: calc(var(--i) * -0.08s);
  }

  .vault-core__media {
    position: relative;
    z-index: 2;
    display: grid;
    width: 48%;
    aspect-ratio: 1;
    place-items: center;
  }

  .vault-core__media img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 0 20px rgba(34, 211, 238, 0.42));
  }

  .vault-core__portrait-signal {
    position: relative;
    display: grid;
    width: 100%;
    height: 100%;
    place-items: center;
    border: 1px solid rgba(163, 230, 53, 0.32);
    border-radius: 999px;
    background:
      radial-gradient(circle at 50% 34%, rgba(247, 248, 255, 0.9) 0 18%, transparent 19%),
      radial-gradient(ellipse at 50% 74%, rgba(247, 248, 255, 0.72) 0 30%, transparent 31%),
      linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(163, 230, 53, 0.16));
    box-shadow: inset 0 0 26px rgba(34, 211, 238, 0.14), 0 0 24px rgba(163, 230, 53, 0.16);
  }

  .vault-core__portrait-signal i,
  .vault-core__portrait-signal b,
  .vault-core__portrait-signal em {
    position: absolute;
    display: block;
    pointer-events: none;
  }

  .vault-core__portrait-signal i {
    top: 19%;
    width: 34%;
    aspect-ratio: 1;
    border-radius: 44% 44% 48% 48%;
    background: #060817;
    box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.3);
  }

  .vault-core__portrait-signal b {
    bottom: 19%;
    width: 54%;
    height: 32%;
    border-radius: 48% 48% 18% 18%;
    background: #060817;
    box-shadow: 0 0 0 2px rgba(163, 230, 53, 0.24);
  }

  .vault-core__portrait-signal em {
    inset: 10%;
    border-radius: 999px;
    border: 1px dashed rgba(247, 248, 255, 0.26);
    animation: vaultRotate 10s linear infinite;
  }

  .vault-core-label {
    display: grid;
    justify-items: center;
    gap: 0.22rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: 0.12em;
    text-align: center;
  }

  .vault-core-label span {
    color: #f7f8ff;
    font-size: 0.78rem;
    font-weight: 900;
  }

  .vault-core-label b,
  .vault-core-label em {
    color: rgba(247, 248, 255, 0.6);
    font-size: 0.62rem;
    font-style: normal;
  }

  .vault-gate {
    min-height: 0;
    overflow: hidden;
  }

  .vault-access-console {
    display: grid;
    gap: 0.7rem;
    padding: 1rem;
  }

  .vault-access-console label {
    color: rgba(247, 248, 255, 0.7);
    font-size: 0.68rem;
    letter-spacing: 0.12em;
  }

  .vault-input-wrap {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    border: 1px solid rgba(34, 211, 238, 0.28);
    background: rgba(0, 0, 0, 0.18);
    box-shadow: 0 0 0 rgba(34, 211, 238, 0);
    transition: box-shadow 160ms ease, border-color 160ms ease;
  }

  .vault-input-wrap:focus-within {
    border-color: rgba(163, 230, 53, 0.52);
    box-shadow: 0 0 24px rgba(163, 230, 53, 0.15);
  }

  .vault-input-wrap input {
    width: 100%;
    min-width: 0;
    border: 0;
    padding: 0.85rem;
    color: #f7f8ff;
    background: transparent;
    font: 700 1rem ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: 0.18em;
    outline: 0;
  }

  .vault-input-wrap button {
    display: grid;
    width: 2.55rem;
    height: 2.55rem;
    place-items: center;
    border: 0;
    color: rgba(247, 248, 255, 0.7);
    background: transparent;
  }

  .vault-scanner {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 0.25rem;
  }

  .vault-scanner span {
    height: 0.28rem;
    background: rgba(255, 255, 255, 0.09);
  }

  .vault-scanner span.is-active {
    background: linear-gradient(90deg, #22d3ee, #a3e635);
    box-shadow: 0 0 14px rgba(34, 211, 238, 0.28);
  }

  .vault-verify,
  .vault-clue,
  .vault-modules button,
  .vault-terminate {
    border: 1px solid rgba(34, 211, 238, 0.22);
    color: #f7f8ff;
    background: rgba(255, 255, 255, 0.045);
    transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
  }

  .vault-verify {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    min-height: 2.65rem;
    padding: 0.7rem 0.9rem;
    font: 800 0.66rem ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: 0.1em;
  }

  .vault-action-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0.62rem;
  }

  .vault-action-row .vault-verify,
  .vault-action-row .vault-clue {
    width: 100%;
    min-height: 2.65rem;
    margin: 0;
    padding: 0.62rem 0.5rem;
  }

  .vault-field-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .vault-verify:disabled {
    opacity: 0.72;
  }

  .vault-clue {
    margin: 0 1rem;
    padding: 0.65rem;
    width: calc(100% - 2rem);
    color: rgba(247, 248, 255, 0.72);
    font-size: 0.62rem;
    letter-spacing: 0.11em;
  }

  .vault-clue-copy {
    margin: 0.8rem 1rem 0;
    border-left: 2px solid #a3e635;
    padding: 0.65rem 0.72rem;
    color: rgba(247, 248, 255, 0.76);
    background: rgba(163, 230, 53, 0.08);
    font: 700 0.68rem/1.5 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }

  .vault-access-console.is-rejected {
    animation: vaultReject 220ms ease;
  }

  .vault-modules {
    display: grid;
    gap: 0.62rem;
    padding-bottom: 1rem;
  }

  .vault-modules .vault-panel__top {
    margin-bottom: 0.2rem;
  }

  .vault-lock-split {
    position: relative;
    display: grid;
    width: 2.4rem;
    height: 2.4rem;
    place-items: center;
    margin: 0.4rem auto;
    color: #22d3ee;
  }

  .vault-lock-split span {
    position: absolute;
    width: 3.2rem;
    height: 1px;
    background: #a3e635;
    transform: rotate(-14deg);
  }

  .vault-modules button {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 0.25rem 0.6rem;
    align-items: center;
    margin-inline: 1rem;
    padding: 0.72rem;
    text-align: left;
  }

  .vault-modules button:hover,
  .vault-verify:hover,
  .vault-clue:hover,
  .vault-terminate:hover {
    transform: translateY(-1px);
    border-color: rgba(163, 230, 53, 0.42);
    background: rgba(163, 230, 53, 0.08);
  }

  .vault-modules button span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #f7f8ff;
    font-size: 0.68rem;
    font-weight: 900;
    letter-spacing: 0.09em;
    white-space: nowrap;
  }

  .vault-modules button em {
    grid-column: 2;
    color: rgba(247, 248, 255, 0.56);
    font-size: 0.56rem;
    font-style: normal;
    letter-spacing: 0.08em;
  }

  .vault-metrics {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.55rem;
    padding: 0.85rem 1rem;
    border-top: 1px solid rgba(34, 211, 238, 0.18);
  }

  .vault-metrics span {
    display: flex;
    justify-content: space-between;
    gap: 0.4rem;
    min-width: 0;
    color: rgba(247, 248, 255, 0.66);
    font-size: 0.66rem;
    letter-spacing: 0.08em;
  }

  .vault-metrics b {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .vault-metrics em {
    color: #22d3ee;
    font-style: normal;
    font-weight: 900;
  }

  .vault-metrics small {
    grid-column: 1 / -1;
    color: rgba(247, 248, 255, 0.42);
    font-size: 0.52rem;
    letter-spacing: 0.14em;
    text-align: right;
  }

  .vault-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.8rem 1rem;
    border-top: 1px solid rgba(34, 211, 238, 0.18);
    color: rgba(247, 248, 255, 0.68);
    font-size: 0.66rem;
    letter-spacing: 0.1em;
  }

  .vault-terminate {
    display: inline-flex;
    align-items: center;
    gap: 0.42rem;
    padding: 0.58rem 0.72rem;
    font-size: 0.62rem;
    letter-spacing: 0.1em;
  }

  .vault-module-panel {
    position: absolute;
    inset: 0;
    z-index: 8;
    display: grid;
    place-items: center;
    padding: 1.5rem;
    background:
      radial-gradient(circle at 45% 40%, rgba(34, 211, 238, 0.13), transparent 32%),
      rgba(6, 8, 23, 0.92);
    backdrop-filter: blur(14px);
  }

  .vault-module-panel > div {
    width: min(100%, 35rem);
    border: 1px solid rgba(34, 211, 238, 0.24);
    padding: 1.2rem;
    background: rgba(13, 16, 38, 0.86);
  }

  .vault-module-panel span {
    color: #22d3ee;
    font-size: 0.64rem;
    font-weight: 900;
    letter-spacing: 0.14em;
  }

  .vault-module-panel h2 {
    margin: 0.6rem 0 1rem;
    font-size: clamp(1.35rem, 4vw, 3rem);
    line-height: 1;
    letter-spacing: 0;
  }

  .vault-module-panel p {
    margin: 0.55rem 0;
    color: rgba(247, 248, 255, 0.72);
    font-size: 0.82rem;
    line-height: 1.55;
  }

  .vault-module-panel__close {
    position: absolute;
    right: 1rem;
    top: 1rem;
    display: grid;
    width: 2.45rem;
    height: 2.45rem;
    place-items: center;
    border: 1px solid rgba(247, 248, 255, 0.16);
    color: #f7f8ff;
    background: rgba(255, 255, 255, 0.04);
  }

  .vault-module-panel__link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: 1rem;
    border: 1px solid rgba(163, 230, 53, 0.28);
    padding: 0.72rem 0.86rem;
    color: #f7f8ff;
    text-decoration: none;
  }

  .vault-confirm {
    position: absolute;
    inset: 0;
    z-index: 10;
    display: grid;
    place-items: center;
    padding: 1rem;
    background: rgba(6, 8, 23, 0.74);
    backdrop-filter: blur(10px);
  }

  .vault-confirm > div {
    display: grid;
    width: min(100%, 26rem);
    gap: 0.65rem;
    border: 1px solid rgba(163, 230, 53, 0.3);
    padding: 1rem;
    background: rgba(13, 16, 38, 0.94);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: 0.08em;
  }

  .vault-confirm b {
    color: #f7f8ff;
  }

  .vault-confirm span,
  .vault-confirm p {
    margin: 0;
    color: rgba(247, 248, 255, 0.66);
    font-size: 0.72rem;
  }

  .vault-confirm div div {
    display: flex;
    gap: 0.55rem;
  }

  .vault-confirm button {
    flex: 1;
    border: 1px solid rgba(34, 211, 238, 0.22);
    padding: 0.65rem;
    color: #f7f8ff;
    background: rgba(255, 255, 255, 0.05);
    font: 800 0.66rem ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: 0.08em;
  }

  .private-vault-active {
    overflow: hidden;
  }

  body.private-vault-active .mac-gradient-bg,
  body.private-vault-active .weather-background,
  body.private-vault-active .power-outage-effect,
  body.private-vault-active .background-cats,
  body.private-vault-active .site-navbar,
  body.private-vault-active .site-side-dock,
  body.private-vault-active .cat-companion-scenery,
  body.private-vault-active .cat-companion-character,
  body.private-vault-active .floating-copyright {
    display: none !important;
  }

  .private-vault-entering .site-frame {
    transform: scale(1.018);
    filter: saturate(1.15) brightness(0.72);
    transition: transform 260ms ease, filter 260ms ease;
  }

  @keyframes vaultRotate {
    to { transform: rotate(360deg); }
  }

  @keyframes vaultScan {
    from { transform: translateY(-100%); }
    to { transform: translateY(100%); }
  }

  @keyframes vaultTail {
    0%, 100% { transform: translateX(0) rotate(0deg); }
    50% { transform: translateX(1.8rem) rotate(8deg); }
  }

  @keyframes vaultParticle {
    0%, 100% { opacity: 0.18; scale: 0.8; }
    50% { opacity: 0.82; scale: 1.2; }
  }

  @keyframes vaultReject {
    0%, 100% { transform: translateX(0); }
    35% { transform: translateX(-5px); }
    65% { transform: translateX(4px); }
  }

  @media (max-width: 900px) {
    .vault-shell {
      width: 100vw;
      height: 100dvh;
      border: 0;
    }

    .vault-main {
      grid-template-columns: minmax(0, 1fr);
      overflow: auto;
    }

    .vault-origin {
      min-height: 17rem;
    }

    .vault-core {
      width: min(64vw, 17rem);
      min-width: 12.5rem;
    }

    .vault-metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 560px) {
    .vault-topbar,
    .vault-footer {
      align-items: stretch;
      flex-direction: column;
    }

    .vault-topbar__actions {
      justify-content: space-between;
    }

    .vault-metrics {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .private-vault {
    color: #f5ece1;
    background:
      radial-gradient(circle at 12% 0%, rgba(251, 191, 36, 0.12), transparent 32%),
      radial-gradient(circle at 82% 14%, rgba(34, 211, 238, 0.14), transparent 30%),
      radial-gradient(circle at 70% 88%, rgba(163, 230, 53, 0.12), transparent 34%),
      #050509;
  }

  .vault-shell {
    width: min(96vw, 82rem);
    height: calc(100dvh - 1.5rem);
    max-height: 58rem;
    border-radius: 1.5rem;
    background:
      linear-gradient(180deg, rgba(13, 13, 21, 0.94), rgba(6, 6, 12, 0.97)),
      rgba(0, 0, 0, 0.92);
    border-color: rgba(245, 236, 225, 0.12);
    overflow: hidden;
  }

  .vault-panel,
  .vault-message,
  .vault-security,
  .vault-module-panel > div,
  .vault-confirm > div {
    border-radius: 1.1rem;
    overflow: hidden;
  }

  .vault-input-wrap,
  .vault-verify,
  .vault-clue,
  .vault-modules button,
  .vault-topbar__actions button,
  .vault-terminate,
  .vault-module-panel__close,
  .vault-module-panel__link,
  .vault-confirm button {
    border-radius: 0.9rem;
  }

  .vault-main {
    grid-template-columns:
      minmax(15rem, 0.84fr)
      minmax(24rem, 1.36fr)
      minmax(17rem, 0.92fr);
    gap: 1rem;
    min-height: 0;
  }

  .vault-center-stack {
    display: grid;
    min-height: 0;
    grid-template-rows: minmax(0, 1fr) auto;
    gap: 0.8rem;
  }

  .vault-origin {
    grid-template-rows: auto minmax(0, 1fr) auto;
  }

  .vault-map {
    position: relative;
    min-height: 0;
    padding: 0.75rem;
  }

  .vault-sri-lanka-map {
    width: min(100%, 15rem);
    max-height: 100%;
    color: #22d3ee;
  }

  .vault-origin__privacy {
    display: grid;
    gap: 0.38rem;
    margin: 0 0.85rem 0.85rem;
    border: 1px solid rgba(251, 191, 36, 0.18);
    border-radius: 0.95rem;
    padding: 0.78rem;
    background: rgba(251, 191, 36, 0.055);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }

  .vault-origin__privacy b {
    color: #fbbf24;
    font-size: 0.62rem;
    letter-spacing: 0.12em;
  }

  .vault-origin__privacy span {
    color: rgba(245, 236, 225, 0.68);
    font-size: 0.66rem;
    line-height: 1.45;
  }

  .vault-core-wrap {
    gap: 0.62rem;
  }

  .vault-core {
    width: min(34vw, 24rem);
    min-width: 18rem;
    background:
      radial-gradient(circle, rgba(245, 236, 225, 0.08), transparent 25%),
      radial-gradient(circle, rgba(34, 211, 238, 0.12), transparent 62%);
    box-shadow:
      0 0 60px rgba(34, 211, 238, 0.18),
      inset 0 0 44px rgba(245, 236, 225, 0.04);
  }

  .vault-core__media {
    width: 68%;
  }

  .vault-core__portrait-frame {
    position: relative;
    display: grid;
    width: 100%;
    height: 100%;
    place-items: center;
    overflow: hidden;
    border: 1px solid rgba(245, 236, 225, 0.2);
    border-radius: 999px;
    background:
      radial-gradient(circle at 50% 18%, rgba(251, 191, 36, 0.24), transparent 32%),
      rgba(245, 236, 225, 0.05);
  }

  .vault-core__portrait-frame i {
    position: absolute;
    inset: 8%;
    border: 1px dashed rgba(34, 211, 238, 0.32);
    border-radius: 999px;
    animation: vaultRotate 12s linear infinite reverse;
  }

  .vault-core__portrait-image {
    position: relative;
    z-index: 1;
    width: 108%;
    height: 108%;
    object-fit: contain;
    object-position: center bottom;
    filter:
      drop-shadow(0 0 26px rgba(251, 191, 36, 0.22))
      drop-shadow(0 0 22px rgba(34, 211, 238, 0.18));
  }

  .vault-message {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(9rem, 0.8fr);
    gap: 0.8rem;
    border: 1px solid rgba(245, 236, 225, 0.1);
    padding: 0.9rem;
    background:
      linear-gradient(135deg, rgba(251, 191, 36, 0.08), transparent 42%),
      rgba(255, 255, 255, 0.035);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }

  .vault-message span {
    color: #fbbf24;
    font-size: 0.62rem;
    font-weight: 900;
    letter-spacing: 0.14em;
  }

  .vault-message p {
    margin: 0.42rem 0 0;
    color: rgba(245, 236, 225, 0.82);
    font-size: 0.78rem;
    line-height: 1.55;
  }

  .vault-message__codes {
    display: grid;
    align-content: center;
    gap: 0.32rem;
    min-width: 0;
  }

  .vault-message__codes b {
    overflow: hidden;
    color: rgba(34, 211, 238, 0.84);
    font-size: 0.56rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .vault-security {
    margin: 0.95rem 1rem 0;
    border: 1px solid rgba(163, 230, 53, 0.18);
    background: rgba(255, 255, 255, 0.028);
  }

  .vault-fingerprint {
    position: relative;
    display: grid;
    height: 6.2rem;
    place-items: center;
    color: #22d3ee;
  }

  .vault-fingerprint span,
  .vault-fingerprint i,
  .vault-fingerprint b {
    position: absolute;
    display: block;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50% 50% 42% 42%;
  }

  .vault-fingerprint span {
    width: 4.6rem;
    height: 5.2rem;
    opacity: 0.55;
  }

  .vault-fingerprint i {
    width: 3rem;
    height: 3.8rem;
    opacity: 0.72;
  }

  .vault-fingerprint b {
    width: 1.5rem;
    height: 2.2rem;
    opacity: 0.92;
  }

  .vault-fingerprint::after {
    content: "";
    position: absolute;
    left: 18%;
    right: 18%;
    top: 50%;
    height: 1px;
    background: linear-gradient(90deg, transparent, #a3e635, transparent);
    animation: vaultFingerScan 1.8s ease-in-out infinite;
  }

  .vault-security__rows {
    display: grid;
    gap: 0.48rem;
    padding: 0 0.8rem 0.85rem;
  }

  .vault-security__rows div {
    display: grid;
    grid-template-columns: minmax(7rem, 0.72fr) minmax(0, 1fr);
    gap: 0.5rem;
    align-items: center;
    color: rgba(245, 236, 225, 0.58);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.58rem;
    font-weight: 850;
    letter-spacing: 0.08em;
  }

  .vault-security__rows em {
    display: grid;
    grid-template-columns: repeat(9, minmax(0, 1fr));
    gap: 0.18rem;
    font-style: normal;
  }

  .vault-security__rows i {
    height: 0.32rem;
    border-radius: 999px;
    background: rgba(245, 236, 225, 0.1);
  }

  .vault-security__rows i.is-live {
    background: linear-gradient(90deg, #22d3ee, #a3e635);
    box-shadow: 0 0 12px rgba(163, 230, 53, 0.24);
  }

  .vault-metrics {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    border-top-color: rgba(245, 236, 225, 0.1);
    background: rgba(255, 255, 255, 0.02);
  }

  .vault-metrics em {
    color: #fbbf24;
  }

  .vault-panel,
  .vault-metrics,
  .vault-footer,
  .vault-topbar {
    border-color: rgba(245, 236, 225, 0.1);
  }

  @keyframes vaultFingerScan {
    0%, 100% {
      transform: translateY(-2.2rem);
      opacity: 0;
    }
    18%, 82% {
      opacity: 0.9;
    }
    50% {
      transform: translateY(2.2rem);
      opacity: 0.7;
    }
  }

  @media (max-height: 768px) and (min-width: 901px) {
    .vault-shell {
      height: calc(100dvh - 0.75rem);
      border-radius: 1.15rem;
    }

    .vault-topbar {
      padding: 0.72rem 1rem;
    }

    .vault-main {
      gap: 0.7rem;
      padding: 0.75rem;
    }

    .vault-core {
      width: min(29vw, 19.5rem);
      min-width: 16rem;
    }

    .vault-message {
      padding: 0.7rem;
    }

    .vault-message p {
      font-size: 0.7rem;
      line-height: 1.42;
    }

    .vault-security {
      margin-top: 0.65rem;
    }

    .vault-fingerprint {
      height: 4.8rem;
    }

    .vault-metrics {
      padding: 0.58rem 0.8rem;
    }

    .vault-footer {
      padding: 0.58rem 0.8rem;
    }
  }

  @media (max-width: 900px) {
    .vault-shell {
      width: 100vw;
      height: 100dvh;
      max-height: none;
      border: 0;
      border-radius: 0;
    }

    .vault-main {
      grid-template-columns: minmax(0, 1fr);
      overflow-y: auto;
      overscroll-behavior: contain;
    }

    .vault-center-stack {
      min-height: 36rem;
    }

    .vault-core {
      width: min(72vw, 20rem);
      min-width: 14rem;
    }

    .vault-message {
      grid-template-columns: minmax(0, 1fr);
    }

    .vault-metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 560px) {
    .vault-center-stack {
      min-height: 32rem;
    }

    .vault-core {
      width: min(82vw, 18rem);
    }

    .vault-security__rows div {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .vault-shell:has(.vault-unlocked-nav) {
    grid-template-rows: auto auto minmax(0, 1fr) auto auto;
  }

  .vault-unlocked-nav {
    display: grid;
    grid-template-columns: auto repeat(4, minmax(0, 1fr));
    align-items: center;
    gap: 0.55rem;
    padding: 0.65rem 1rem;
    border-bottom: 1px solid rgba(245, 236, 225, 0.1);
    background:
      linear-gradient(90deg, rgba(34, 211, 238, 0.06), rgba(163, 230, 53, 0.045)),
      rgba(255, 255, 255, 0.018);
  }

  .vault-unlocked-nav__label {
    color: #fbbf24;
    font: 950 0.62rem ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: 0.14em;
    white-space: nowrap;
  }

  .vault-unlocked-nav button {
    display: inline-flex;
    min-width: 0;
    min-height: 2.35rem;
    align-items: center;
    justify-content: center;
    gap: 0.42rem;
    border: 1px solid rgba(34, 211, 238, 0.22);
    border-radius: 999px;
    color: rgba(245, 236, 225, 0.88);
    background: rgba(255, 255, 255, 0.035);
    font: 850 0.62rem ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: 0.08em;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
    white-space: nowrap;
  }

  .vault-unlocked-nav button:hover {
    transform: translateY(-1px);
    border-color: rgba(251, 191, 36, 0.36);
    background: rgba(251, 191, 36, 0.075);
  }

  .vault-clearance {
    display: grid;
    gap: 0.45rem;
    margin: 0.55rem 1rem 0;
    border: 1px solid rgba(34, 211, 238, 0.18);
    border-radius: 1rem;
    padding: 0.9rem;
    background:
      radial-gradient(circle at 12% 0%, rgba(34, 211, 238, 0.12), transparent 36%),
      rgba(255, 255, 255, 0.035);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }

  .vault-clearance b {
    color: #22d3ee;
    font-size: 0.68rem;
    letter-spacing: 0.12em;
  }

  .vault-clearance p {
    margin: 0;
    color: rgba(245, 236, 225, 0.72);
    font-size: 0.72rem;
    line-height: 1.55;
  }

  .vault-clearance span {
    color: #fbbf24;
    font-size: 0.58rem;
    font-weight: 900;
    letter-spacing: 0.11em;
  }

  .vault-origin__privacy em,
  .vault-origin__privacy small {
    color: rgba(245, 236, 225, 0.68);
    font-size: 0.66rem;
    font-style: normal;
    line-height: 1.45;
  }

  .vault-origin__privacy small {
    color: #fbbf24;
    font-size: 0.58rem;
    font-weight: 900;
    letter-spacing: 0.12em;
  }

  .vault-message__encoded,
  .vault-message__decoded {
    display: grid;
    gap: 0.6rem;
  }

  .vault-message__encoded button {
    justify-self: start;
    border: 1px solid rgba(251, 191, 36, 0.28);
    border-radius: 999px;
    padding: 0.48rem 0.78rem;
    color: #fbbf24;
    background: rgba(251, 191, 36, 0.065);
    font: 900 0.58rem ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: 0.12em;
  }

  .vault-message__language {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.34rem;
  }

  .vault-message__language button {
    min-width: 0;
    min-height: 1.8rem;
    border: 1px solid rgba(34, 211, 238, 0.24);
    border-radius: 0.7rem;
    padding: 0.35rem 0.42rem;
    color: rgba(245, 236, 225, 0.72);
    background: rgba(11, 19, 43, 0.8);
    font: 800 0.58rem ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: 0.08em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .vault-message__language button.is-active {
    border-color: rgba(251, 191, 36, 0.48);
    color: #fbbf24;
    background: rgba(251, 191, 36, 0.09);
  }

  .vault-security--verifying {
    border-color: rgba(34, 211, 238, 0.42);
    box-shadow: 0 0 24px rgba(34, 211, 238, 0.08);
  }

  .vault-security--rejected {
    border-color: rgba(255, 107, 129, 0.38);
    animation: vaultReject 220ms ease;
  }

  .vault-security--unlocked {
    border-color: rgba(251, 191, 36, 0.34);
    box-shadow: 0 0 26px rgba(251, 191, 36, 0.08);
  }

  .vault-security--verifying .vault-fingerprint::after,
  .vault-security--unlocked .vault-fingerprint::after {
    animation-duration: 0.82s;
  }

  .vault-scanner span.is-active {
    animation: vaultScannerPulse 0.72s ease-in-out infinite alternate;
  }

  @keyframes vaultScannerPulse {
    from {
      opacity: 0.58;
      transform: scaleY(0.72);
    }
    to {
      opacity: 1;
      transform: scaleY(1.25);
    }
  }

  @media (max-height: 768px) and (min-width: 901px) {
    .vault-unlocked-nav {
      padding: 0.48rem 0.75rem;
    }

    .vault-unlocked-nav button {
      min-height: 2rem;
      font-size: 0.55rem;
    }

    .vault-clearance {
      padding: 0.68rem;
    }

    .vault-sri-lanka-map {
      width: min(100%, 13rem);
    }
  }

  @media (max-width: 900px) {
    .vault-unlocked-nav {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .vault-unlocked-nav__label {
      grid-column: 1 / -1;
    }
  }

  .vault-map {
    align-content: center;
    background:
      radial-gradient(circle at 44% 52%, rgba(34, 211, 238, 0.14), transparent 52%),
      rgba(11, 19, 43, 0.42);
  }

  .vault-sri-lanka-map {
    width: min(100%, 18rem);
    height: min(100%, 27rem);
    object-fit: contain;
    border-radius: 1.05rem;
    box-shadow:
      0 0 42px rgba(34, 211, 238, 0.16),
      inset 0 0 30px rgba(34, 211, 238, 0.08);
  }

  .vault-map__scan {
    position: absolute;
    left: 14%;
    right: 14%;
    top: 50%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(163, 230, 53, 0.95), transparent);
    animation: vaultMapScan 2.4s ease-in-out infinite;
  }

  .vault-map__lock {
    position: absolute;
    left: 24%;
    bottom: 28%;
    width: 0.65rem;
    height: 0.65rem;
    border-radius: 999px;
    background: #a3e635;
    box-shadow:
      0 0 0 0.42rem rgba(34, 211, 238, 0.2),
      0 0 22px rgba(163, 230, 53, 0.8);
  }

  @keyframes vaultMapScan {
    0%, 100% {
      transform: translateY(-7rem) rotate(-10deg);
      opacity: 0;
    }
    18%, 82% {
      opacity: 0.82;
    }
    50% {
      transform: translateY(7rem) rotate(-10deg);
      opacity: 0.9;
    }
  }

  .vault-shell {
    padding: 0.18rem;
  }

  .vault-main {
    padding: clamp(1rem, 1.45vw, 1.35rem);
    gap: clamp(1rem, 1.4vw, 1.25rem);
  }

  .vault-panel {
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.018)),
      rgba(7, 8, 14, 0.72);
  }

  .vault-panel__top {
    padding: 0.85rem 1rem;
  }

  .vault-origin__privacy {
    gap: 0.34rem;
    margin: 0 1rem 1rem;
    padding: 0.92rem;
  }

  .vault-origin__privacy strong {
    margin-top: 0.35rem;
    color: #22d3ee;
    font-size: 0.58rem;
    letter-spacing: 0.13em;
  }

  .vault-map {
    padding: 1rem;
  }

  .vault-map::before {
    content: "";
    position: absolute;
    inset: 1rem;
    border-radius: 1.15rem;
    background:
      linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px),
      linear-gradient(rgba(34, 211, 238, 0.08) 1px, transparent 1px);
    background-size: 22px 22px;
    opacity: 0.22;
    pointer-events: none;
    animation: vaultGridDrift 9s linear infinite;
  }

  .vault-map__lock {
    display: none;
  }

  .vault-sri-lanka-map {
    position: relative;
    z-index: 1;
    width: min(100%, 19rem);
    height: min(100%, 28.5rem);
    padding: 0.28rem;
    background: rgba(6, 8, 23, 0.64);
  }

  .vault-message {
    padding: 1.05rem;
  }

  .vault-message__codes b {
    animation: vaultCodePulse 2.2s ease-in-out infinite;
  }

  .vault-message__codes b:nth-child(2n) {
    animation-delay: 0.38s;
  }

  .vault-security {
    margin: 1rem 1rem 0;
  }

  .vault-security-assets {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.55rem;
    padding: 0.85rem 0.85rem 0.65rem;
  }

  .vault-security-asset {
    position: relative;
    display: grid;
    min-width: 0;
    place-items: center;
    gap: 0.25rem;
    margin: 0;
    overflow: hidden;
    border: 1px solid rgba(34, 211, 238, 0.16);
    border-radius: 0.9rem;
    padding: 0.42rem 0.32rem;
    background:
      radial-gradient(circle at 50% 36%, rgba(34, 211, 238, 0.18), transparent 56%),
      rgba(11, 19, 43, 0.38);
  }

  .vault-security-asset::after {
    content: "";
    position: absolute;
    left: 12%;
    right: 12%;
    top: 48%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(163, 230, 53, 0.9), transparent);
    animation: vaultMiniScan 1.5s ease-in-out infinite;
  }

  .vault-security-asset__image {
    width: 100%;
    max-width: 4.8rem;
    height: 4.8rem;
    object-fit: contain;
    mix-blend-mode: screen;
    filter: drop-shadow(0 0 15px rgba(34, 211, 238, 0.42));
  }

  .vault-security-asset figcaption {
    width: 100%;
    overflow: hidden;
    color: rgba(245, 236, 225, 0.62);
    font: 850 0.48rem ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: 0.06em;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .vault-security__rows {
    padding-inline: 1rem;
    padding-bottom: 1rem;
  }

  .vault-boot {
    display: grid;
    grid-template-columns: minmax(8rem, 0.42fr) minmax(0, 1fr);
    gap: 1rem;
    align-items: center;
    border-radius: 1.35rem;
    overflow: hidden;
    background:
      radial-gradient(circle at 20% 50%, rgba(34, 211, 238, 0.14), transparent 34%),
      linear-gradient(135deg, rgba(13, 16, 38, 0.94), rgba(6, 8, 23, 0.96));
  }

  .vault-boot__core {
    position: relative;
    display: grid;
    aspect-ratio: 1;
    place-items: center;
    border: 1px solid rgba(34, 211, 238, 0.28);
    border-radius: 999px;
    background:
      repeating-conic-gradient(from 0deg, rgba(34, 211, 238, 0.2) 0 5deg, transparent 5deg 18deg),
      radial-gradient(circle, rgba(163, 230, 53, 0.16), transparent 64%);
    animation: vaultRotate 12s linear infinite;
  }

  .vault-boot__core img {
    width: 54%;
    height: 54%;
    object-fit: contain;
    animation: vaultBootLogo 1.8s ease-in-out infinite;
    filter: drop-shadow(0 0 18px rgba(34, 211, 238, 0.72));
  }

  .vault-boot__core span {
    position: absolute;
    inset: 18%;
    border: 1px dashed rgba(245, 236, 225, 0.22);
    border-radius: 999px;
  }

  .vault-boot__terminal {
    min-height: 11rem;
  }

  .vault-boot__progress,
  .vault-tail-loader {
    grid-column: 1 / -1;
  }

  .vault-boot__matrix {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: repeat(20, minmax(0, 1fr));
    gap: 0.18rem;
  }

  .vault-boot__matrix i {
    height: 0.35rem;
    border-radius: 999px;
    background: rgba(34, 211, 238, 0.12);
    animation: vaultMatrixPulse 1.4s ease-in-out infinite;
    animation-delay: calc(var(--i) * 0.055s);
  }

  .vault-tail-loader {
    width: 100%;
    height: 0.9rem;
    border: 0;
    border-radius: 999px;
    background:
      linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.78), rgba(163, 230, 53, 0.7), transparent);
    mask-image: linear-gradient(90deg, transparent, black 22%, black 78%, transparent);
    animation: vaultLoaderRail 1.25s ease-in-out infinite;
  }

  @keyframes vaultGridDrift {
    to { background-position: 44px 22px; }
  }

  @keyframes vaultCodePulse {
    0%, 100% { opacity: 0.56; transform: translateX(0); }
    50% { opacity: 1; transform: translateX(2px); }
  }

  @keyframes vaultMiniScan {
    0%, 100% { transform: translateY(-1.9rem); opacity: 0; }
    50% { transform: translateY(1.9rem); opacity: 0.9; }
  }

  @keyframes vaultBootLogo {
    0%, 100% { transform: scale(0.96); opacity: 0.78; }
    50% { transform: scale(1.04); opacity: 1; }
  }

  @keyframes vaultMatrixPulse {
    0%, 100% { background: rgba(34, 211, 238, 0.08); transform: scaleY(0.65); }
    50% { background: rgba(163, 230, 53, 0.58); transform: scaleY(1.28); }
  }

  @keyframes vaultLoaderRail {
    0%, 100% { transform: scaleX(0.55); opacity: 0.52; }
    50% { transform: scaleX(1); opacity: 1; }
  }

  .vault-origin {
    grid-template-rows: auto minmax(0, 1fr) auto;
    overflow: hidden;
  }

  .vault-origin .vault-panel__top {
    padding-inline: 1.05rem;
  }

  .vault-map {
    display: grid;
    min-height: 0;
    place-items: center;
    padding: clamp(0.95rem, 1.45vw, 1.35rem);
    background:
      radial-gradient(circle at 50% 62%, rgba(34, 211, 238, 0.16), transparent 44%),
      linear-gradient(180deg, rgba(12, 31, 55, 0.42), rgba(7, 8, 14, 0.26));
  }

  .vault-map::before {
    inset: clamp(0.85rem, 1.5vw, 1.25rem);
    border: 1px solid rgba(34, 211, 238, 0.08);
    border-radius: 1.2rem;
    opacity: 0.16;
  }

  .vault-sri-lanka-map {
    width: min(100%, 18.2rem);
    height: min(100%, 27rem);
    border: 0;
    border-radius: 1.2rem;
    padding: 0;
    object-fit: contain;
    object-position: center;
    background: transparent;
    filter: saturate(1.16) contrast(1.08) drop-shadow(0 0 24px rgba(34, 211, 238, 0.28));
  }

  .vault-map__scan {
    background:
      linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.72), rgba(163, 230, 53, 0.48), transparent),
      linear-gradient(180deg, transparent, rgba(34, 211, 238, 0.24), transparent);
    mix-blend-mode: screen;
  }

  .vault-origin__privacy {
    margin: 0.95rem;
    border-radius: 1rem;
    padding: 0.95rem 1rem;
    background:
      linear-gradient(135deg, rgba(251, 191, 36, 0.08), rgba(34, 211, 238, 0.035)),
      rgba(14, 12, 10, 0.82);
  }

  .vault-origin__privacy b,
  .vault-origin__privacy small,
  .vault-origin__privacy strong {
    line-height: 1.1;
  }

  .vault-core__media {
    width: clamp(10.5rem, 58%, 16rem);
    transform: translateY(0.15rem);
  }

  .vault-core__media > span {
    display: grid;
    width: 100%;
    height: 100%;
    place-items: center;
  }

  .vault-core__media img {
    object-position: center;
  }

  .vault-message {
    grid-template-columns: minmax(0, 1.12fr) minmax(9rem, 0.72fr);
    align-items: stretch;
    gap: 0.85rem;
    min-height: 9.2rem;
    border-radius: 1rem;
    padding: 1rem;
  }

  .vault-message > div:first-child {
    display: grid;
    min-width: 0;
    gap: 0.58rem;
  }

  .vault-message__language {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 0.32rem;
  }

  .vault-message__language button {
    min-height: 1.75rem;
    border-radius: 999px;
    padding-inline: 0.34rem;
    letter-spacing: 0.09em;
    cursor: pointer;
  }

  .vault-message__language button:hover,
  .vault-message__language button:focus-visible {
    border-color: rgba(34, 211, 238, 0.55);
    color: #f5ece1;
    outline: none;
    box-shadow: 0 0 18px rgba(34, 211, 238, 0.12);
  }

  .vault-message__payload {
    display: grid;
    align-content: start;
    min-height: 4.7rem;
    max-height: 7.2rem;
    gap: 0.24rem;
    overflow: auto;
    border: 1px solid rgba(34, 211, 238, 0.13);
    border-radius: 0.72rem;
    padding: 0.68rem 0.72rem;
    background:
      linear-gradient(90deg, rgba(34, 211, 238, 0.06) 1px, transparent 1px),
      linear-gradient(rgba(34, 211, 238, 0.045) 1px, transparent 1px),
      rgba(2, 6, 16, 0.42);
    background-size: 18px 18px;
  }

  .vault-message__payload p {
    margin: 0;
    color: rgba(245, 236, 225, 0.8);
    font: 850 0.62rem/1.55 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: 0.035em;
    overflow-wrap: anywhere;
  }

  .vault-message__payload--hex p,
  .vault-message__payload--bin p,
  .vault-message__payload--dec p {
    color: #22d3ee;
    text-shadow: 0 0 10px rgba(34, 211, 238, 0.2);
  }

  .vault-message__payload--reg p {
    color: #a3e635;
  }

  .vault-message__payload--read p {
    color: rgba(245, 236, 225, 0.9);
    font-size: 0.72rem;
    line-height: 1.62;
  }

  .vault-message__codes {
    align-content: center;
    border-left: 1px solid rgba(34, 211, 238, 0.12);
    padding-left: 0.85rem;
  }

  .vault-metrics {
    position: relative;
    overflow: hidden;
  }

  .vault-metrics::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.08), transparent);
    transform: translateX(-100%);
    animation: vaultMetricSweep 3.8s ease-in-out infinite;
    pointer-events: none;
  }

  .vault-metrics span {
    position: relative;
    isolation: isolate;
  }

  .vault-metric--bio {
    border: 1px solid rgba(34, 211, 238, 0.16);
    border-radius: 999px;
    padding: 0.35rem 0.58rem;
    background:
      repeating-linear-gradient(90deg, rgba(34, 211, 238, 0.12) 0 1px, transparent 1px 8px),
      rgba(7, 13, 26, 0.7);
    box-shadow: inset 0 0 18px rgba(34, 211, 238, 0.055);
  }

  .vault-metric--bio em {
    color: #22d3ee;
    font-variant-numeric: tabular-nums;
    text-shadow: 0 0 12px rgba(34, 211, 238, 0.42);
    animation: vaultBioSerialize 1.6s steps(2, end) infinite;
  }

  .vault-security-assets {
    padding: 0.95rem 1rem 0.72rem;
  }

  .vault-security-asset {
    aspect-ratio: 1;
    gap: 0;
    border-color: rgba(34, 211, 238, 0.1);
    border-radius: 0.95rem;
    padding: 0.2rem;
    background:
      radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.16), transparent 56%),
      rgba(0, 0, 0, 0.08);
  }

  .vault-security-asset::before {
    content: "";
    position: absolute;
    inset: 12%;
    border: 1px dashed rgba(34, 211, 238, 0.18);
    border-radius: 999px;
    animation: vaultRotate 8s linear infinite;
  }

  .vault-security-asset::after {
    left: 9%;
    right: 9%;
    top: 50%;
    z-index: 2;
  }

  .vault-security-asset__image {
    position: relative;
    z-index: 1;
    max-width: 6.2rem;
    height: 6.2rem;
    object-position: center;
    filter:
      saturate(1.22)
      contrast(1.1)
      drop-shadow(0 0 16px rgba(34, 211, 238, 0.42));
  }

  .vault-security-asset figcaption {
    display: none;
  }

  @keyframes vaultMetricSweep {
    0%, 45% { transform: translateX(-100%); opacity: 0; }
    58% { opacity: 1; }
    100% { transform: translateX(100%); opacity: 0; }
  }

  @keyframes vaultBioSerialize {
    0%, 100% { opacity: 0.72; filter: hue-rotate(0deg); }
    50% { opacity: 1; filter: hue-rotate(24deg); }
  }

  .vault-shell {
    width: min(95.5vw, 80rem);
    height: calc(100dvh - 1.25rem);
    max-height: none;
    grid-template-rows: 4.35rem minmax(0, 1fr) 4.85rem 3.1rem;
    border-radius: 1.35rem;
  }

  .vault-topbar {
    min-height: 0;
    padding: 0.9rem 1.25rem;
  }

  .vault-main {
    grid-template-columns:
      minmax(17rem, 0.9fr)
      minmax(25rem, 1.28fr)
      minmax(18rem, 0.96fr);
    gap: clamp(1rem, 1.5vw, 1.35rem);
    padding: clamp(1.05rem, 1.55vw, 1.45rem);
    overflow: hidden;
  }

  .vault-panel,
  .vault-message,
  .vault-security {
    border-radius: 1.05rem;
    box-shadow:
      inset 0 1px 0 rgba(245, 236, 225, 0.055),
      0 18px 42px rgba(0, 0, 0, 0.18);
  }

  .vault-panel__top {
    min-height: 2.7rem;
    padding: 0.8rem 1.05rem;
  }

  .vault-origin {
    min-height: 0;
    grid-template-rows: 2.7rem minmax(0, 1fr) auto;
  }

  .vault-map {
    padding: clamp(0.85rem, 1.2vw, 1.08rem);
  }

  .vault-map::before {
    inset: clamp(0.72rem, 1vw, 0.95rem);
    border-radius: 0.95rem;
  }

  .vault-sri-lanka-map {
    width: min(100%, 17.2rem);
    height: min(100%, 24.2rem);
    max-height: 100%;
    border-radius: 0.95rem;
  }

  .vault-origin__privacy {
    margin: 0.8rem 0.95rem 0.95rem;
    padding: 0.82rem 0.92rem;
  }

  .vault-origin__privacy span,
  .vault-origin__privacy em {
    font-size: 0.64rem;
  }

  .vault-center-stack {
    grid-template-rows: minmax(0, 1fr) auto;
    gap: clamp(0.78rem, 1.15vw, 1rem);
    overflow: hidden;
  }

  .vault-core-wrap {
    align-content: center;
    gap: 0.55rem;
    overflow: visible;
  }

  .vault-core {
    width: min(31vw, 23rem, 44vh);
    min-width: 15.5rem;
    max-width: 23rem;
  }

  .vault-core__media {
    width: 56%;
    transform: translateY(0);
  }

  .vault-core-label {
    gap: 0.22rem;
  }

  .vault-message {
    min-height: 8.35rem;
    grid-template-columns: minmax(0, 1.24fr) minmax(8.5rem, 0.64fr);
    gap: 0.76rem;
    padding: 0.86rem 0.95rem;
    overflow: hidden;
  }

  .vault-message > div:first-child {
    gap: 0.48rem;
  }

  .vault-message__language {
    gap: 0.28rem;
  }

  .vault-message__language button {
    min-height: 1.62rem;
    font-size: 0.54rem;
  }

  .vault-message__payload {
    min-height: 4.1rem;
    max-height: 5.25rem;
    padding: 0.58rem 0.64rem;
    scrollbar-width: thin;
    scrollbar-color: rgba(245, 236, 225, 0.34) rgba(2, 6, 16, 0.45);
  }

  .vault-message__payload p {
    font-size: 0.58rem;
    line-height: 1.48;
  }

  .vault-message__payload--read p {
    font-size: 0.66rem;
    line-height: 1.55;
  }

  .vault-message__codes {
    min-width: 0;
    overflow: hidden;
    padding-left: 0.75rem;
  }

  .vault-message__codes b {
    font-size: 0.54rem;
    line-height: 1.55;
    overflow-wrap: anywhere;
  }

  .vault-gate {
    display: grid;
    min-height: 0;
    align-content: start;
  }

  .vault-access-console {
    padding: 0.92rem 1rem 0.78rem;
  }

  .vault-security {
    margin: 0.9rem 1rem 0;
  }

  .vault-security-assets {
    gap: 0.52rem;
    padding: 0.82rem 0.92rem 0.55rem;
  }

  .vault-security-asset {
    border-radius: 0.78rem;
    padding: 0.28rem;
  }

  .vault-security-asset__image {
    max-width: 5.25rem;
    height: 5.25rem;
  }

  .vault-security__rows {
    padding: 0 1rem 0.92rem;
  }

  .vault-security__rows div {
    min-height: 1.15rem;
  }

  .vault-metrics {
    grid-template-columns: minmax(11.5rem, 1.22fr) repeat(5, minmax(7.5rem, 1fr));
    align-content: center;
    gap: 0.72rem;
    min-height: 0;
    padding: 0.78rem 1.1rem 0.56rem;
  }

  .vault-metrics span {
    align-items: center;
    font-size: 0.62rem;
  }

  .vault-metrics small {
    align-self: end;
  }

  .vault-footer {
    min-height: 0;
    padding: 0.65rem 1rem;
  }

  .vault-cat-wires {
    opacity: 0.48;
  }

  .vault-entry::before,
  .vault-entry::after {
    content: "";
    position: absolute;
    top: clamp(2rem, 8vh, 4rem);
    width: clamp(3.5rem, 8vw, 7rem);
    aspect-ratio: 1;
    border-radius: 999px;
    background:
      radial-gradient(circle, rgba(255, 255, 255, 0.9) 0 8%, rgba(255, 32, 64, 0.95) 9% 28%, rgba(127, 29, 29, 0.28) 48%, transparent 70%);
    filter: blur(0.2px);
    opacity: 0.82;
    animation: vaultAlarmBeacon 0.72s steps(2, end) infinite;
  }

  .vault-entry::before {
    left: clamp(2rem, 10vw, 8rem);
  }

  .vault-entry::after {
    right: clamp(2rem, 10vw, 8rem);
    animation-delay: 0.36s;
  }

  .vault-entry__core {
    border-color: rgba(251, 191, 36, 0.7);
    box-shadow:
      0 0 42px rgba(251, 191, 36, 0.24),
      0 0 90px rgba(255, 32, 64, 0.18);
  }

  .vault-entry__tunnel {
    background:
      repeating-conic-gradient(from 0deg, rgba(251, 191, 36, 0.38) 0 3deg, transparent 3deg 9deg),
      repeating-radial-gradient(circle, transparent 0 2.2rem, rgba(255, 32, 64, 0.18) 2.25rem 2.35rem, transparent 2.4rem 3.4rem),
      radial-gradient(circle, transparent 34%, rgba(34, 211, 238, 0.14), transparent 68%);
  }

  .vault-boot {
    border-color: rgba(251, 191, 36, 0.34);
    background:
      radial-gradient(circle at 14% 18%, rgba(255, 32, 64, 0.18), transparent 26%),
      radial-gradient(circle at 86% 14%, rgba(251, 191, 36, 0.16), transparent 28%),
      linear-gradient(135deg, rgba(13, 16, 38, 0.94), rgba(7, 8, 14, 0.96));
    box-shadow:
      0 28px 90px rgba(0, 0, 0, 0.55),
      0 0 50px rgba(255, 32, 64, 0.14),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  .vault-boot::before,
  .vault-boot::after {
    content: "";
    position: absolute;
    top: 1rem;
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 999px;
    background: #ff2040;
    box-shadow: 0 0 18px rgba(255, 32, 64, 0.95);
    animation: vaultAlarmBeacon 0.62s steps(2, end) infinite;
  }

  .vault-boot::before {
    left: 1rem;
  }

  .vault-boot::after {
    right: 1rem;
    animation-delay: 0.31s;
  }

  .vault-boot__terminal p:first-child,
  .vault-boot__terminal p:nth-child(2),
  .vault-boot__terminal p:nth-child(3) {
    color: #fbbf24;
    text-shadow: 0 0 12px rgba(251, 191, 36, 0.24);
  }

  .vault-boot__progress span {
    background: linear-gradient(90deg, #ff2040, #fbbf24, #22d3ee);
  }

  .vault-map {
    border-inline: 1px solid rgba(9, 24, 53, 0.92);
    background:
      radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.16), transparent 44%),
      linear-gradient(180deg, rgba(6, 19, 43, 0.82), rgba(3, 7, 18, 0.5));
  }

  .vault-map::before {
    border-color: rgba(30, 64, 175, 0.46);
    box-shadow:
      inset 0 0 0 1px rgba(34, 211, 238, 0.08),
      inset 0 0 38px rgba(9, 24, 53, 0.75);
  }

  .vault-sri-lanka-map {
    filter:
      saturate(1.22)
      contrast(1.12)
      drop-shadow(0 0 18px rgba(34, 211, 238, 0.34))
      drop-shadow(0 0 34px rgba(30, 64, 175, 0.32));
  }

  .vault-center-stack > .vault-security {
    display: grid;
    min-height: 8.35rem;
    grid-template-rows: 2.7rem minmax(0, 1fr);
    margin: 0;
    overflow: hidden;
  }

  .vault-center-stack > .vault-security .vault-security-assets {
    height: 100%;
    align-items: center;
    gap: clamp(0.72rem, 1.25vw, 1rem);
    padding: 0.85rem 1rem 1rem;
  }

  .vault-center-stack > .vault-security .vault-security-asset {
    aspect-ratio: 1.58;
    border: 1px solid rgba(34, 211, 238, 0.18);
    border-radius: 0.9rem;
    padding: 0.45rem;
    background:
      radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.18), transparent 62%),
      rgba(7, 13, 26, 0.56);
    box-shadow:
      inset 0 1px 0 rgba(245, 236, 225, 0.08),
      0 12px 26px rgba(0, 0, 0, 0.26);
  }

  .vault-center-stack > .vault-security .vault-security-asset::before {
    display: none;
  }

  .vault-center-stack > .vault-security .vault-security-asset::after {
    left: 0.7rem;
    right: 0.7rem;
    top: 50%;
    height: 2px;
    opacity: 0.82;
  }

  .vault-center-stack > .vault-security .vault-security-asset__image {
    width: 100%;
    max-width: none;
    height: 100%;
    border-radius: 0.82rem;
    object-fit: contain;
    mix-blend-mode: normal;
    opacity: 1;
    filter:
      saturate(1.08)
      contrast(1.08)
      brightness(1.04)
      drop-shadow(0 0 18px rgba(34, 211, 238, 0.22));
  }

  .vault-gate {
    align-content: stretch;
  }

  .vault-gate > div {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }

  .vault-gate .vault-access-console {
    padding-bottom: 0.62rem;
  }

  .vault-gate .vault-clue {
    margin-top: 0.28rem;
  }

  .vault-gate .vault-message {
    align-self: stretch;
    display: grid;
    flex: 1 1 auto;
    grid-template-columns: minmax(0, 1fr);
    min-height: 13rem;
    margin: 0.95rem 1rem 1rem;
    padding: 0.95rem;
    background:
      linear-gradient(135deg, rgba(251, 191, 36, 0.075), rgba(34, 211, 238, 0.045)),
      rgba(14, 12, 10, 0.78);
  }

  .vault-gate .vault-message__codes {
    display: none;
  }

  .vault-message__translator {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.3rem;
  }

  .vault-message__translator button {
    min-width: 0;
    min-height: 1.58rem;
    border: 1px solid rgba(251, 191, 36, 0.2);
    border-radius: 999px;
    padding: 0.3rem 0.45rem;
    color: rgba(245, 236, 225, 0.7);
    background: rgba(7, 13, 26, 0.62);
    font: 850 0.5rem ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: 0.06em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .vault-message__translator button.is-active {
    border-color: rgba(251, 191, 36, 0.55);
    color: #fbbf24;
    background: rgba(251, 191, 36, 0.1);
  }

  .vault-gate .vault-message__payload {
    min-height: 0;
    max-height: none;
    overflow: visible;
  }

  .vault-gate .vault-message > div:first-child {
    display: grid;
    height: 100%;
    grid-template-rows: auto auto auto minmax(0, 1fr);
    align-content: start;
  }

  .vault-gate .vault-message:not(:has(.vault-message__translator)) > div:first-child {
    grid-template-rows: auto auto minmax(0, 1fr);
  }

  .vault-gate .vault-message__payload p {
    font-size: 0.52rem;
    line-height: 1.5;
  }

  .vault-gate .vault-message__payload--read p {
    font-size: 0.66rem;
    line-height: 1.65;
    letter-spacing: 0.01em;
  }

  @keyframes vaultAlarmBeacon {
    0%, 45% {
      opacity: 0.28;
      transform: scale(0.92);
    }
    46%, 100% {
      opacity: 1;
      transform: scale(1.06);
    }
  }

  .vault-clue-modal {
    position: absolute;
    inset: 0;
    z-index: 20;
    display: grid;
    place-items: center;
    padding: 1.2rem;
    background: rgba(2, 6, 16, 0.58);
    backdrop-filter: blur(10px);
  }

  .vault-clue-modal > div {
    position: relative;
    display: grid;
    width: min(92vw, 25rem);
    gap: 0.62rem;
    border: 1px solid rgba(251, 191, 36, 0.32);
    border-radius: 1.05rem;
    padding: 1.05rem;
    background:
      radial-gradient(circle at 12% 0%, rgba(251, 191, 36, 0.16), transparent 34%),
      linear-gradient(135deg, rgba(14, 12, 10, 0.96), rgba(7, 8, 14, 0.96));
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.48), 0 0 34px rgba(251, 191, 36, 0.12);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }

  .vault-clue-modal button {
    position: absolute;
    top: 0.72rem;
    right: 0.72rem;
    display: grid;
    width: 1.9rem;
    height: 1.9rem;
    place-items: center;
    border: 1px solid rgba(34, 211, 238, 0.24);
    border-radius: 999px;
    color: rgba(245, 236, 225, 0.8);
    background: rgba(7, 13, 26, 0.72);
  }

  .vault-clue-modal span {
    color: #fbbf24;
    font-size: 0.68rem;
    font-weight: 950;
    letter-spacing: 0.13em;
  }

  .vault-clue-modal p {
    margin: 0;
    color: rgba(245, 236, 225, 0.82);
    font-size: 0.82rem;
    line-height: 1.55;
  }

  .vault-clue-modal b {
    color: #22d3ee;
    font-size: 0.6rem;
    letter-spacing: 0.1em;
  }

  .vault-unlocked-nav {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.65rem;
    padding: 0.58rem 1.1rem;
  }

  .vault-unlocked-nav__label {
    display: none;
  }

  .vault-unlocked-nav button {
    min-height: 2.12rem;
    border-radius: 0.85rem;
    font-size: 0.58rem;
  }

  .vault-clearance {
    margin-top: 0.82rem;
    padding: 0.85rem;
  }

  .vault-clearance p {
    font-size: 0.68rem;
    line-height: 1.5;
  }

  .vault-center-stack > .vault-security .vault-security-asset {
    aspect-ratio: 1.38;
    overflow: visible;
    border-color: rgba(34, 211, 238, 0.28);
    background:
      radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.13), transparent 66%),
      rgba(3, 7, 18, 0.62);
  }

  .vault-center-stack > .vault-security .vault-security-asset__image {
    width: 92%;
    height: 92%;
    border-radius: 0;
    object-fit: contain;
    background: transparent;
    filter:
      saturate(1.18)
      contrast(1.12)
      brightness(1.08)
      drop-shadow(0 0 20px rgba(34, 211, 238, 0.34));
  }

  .vault-center-stack > .vault-security .vault-security-asset::after {
    left: 0.35rem;
    right: 0.35rem;
  }

  .vault-metrics {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    align-items: center;
    gap: 0.45rem;
    padding: 0.62rem 1rem 0.48rem;
    background:
      linear-gradient(90deg, rgba(34, 211, 238, 0.045), rgba(251, 191, 36, 0.035), rgba(163, 230, 53, 0.035)),
      rgba(3, 7, 18, 0.72);
  }

  .vault-metrics span,
  .vault-metric--bio {
    display: inline-flex;
    min-width: 0;
    min-height: 1.82rem;
    align-items: center;
    justify-content: center;
    gap: 0.34rem;
    border: 1px solid rgba(245, 236, 225, 0.08);
    border-radius: 999px;
    padding: 0.28rem 0.54rem;
    background: rgba(7, 13, 26, 0.48);
  }

  .vault-metrics b {
    flex: 0 1 auto;
    color: rgba(245, 236, 225, 0.58);
    font-size: 0.56rem;
  }

  .vault-metrics em {
    flex: 0 0 auto;
    color: #fbbf24;
    font-size: 0.58rem;
  }

  .vault-metric--bio {
    border-color: rgba(34, 211, 238, 0.28);
    background:
      linear-gradient(90deg, rgba(34, 211, 238, 0.13), rgba(7, 13, 26, 0.62));
  }

  .vault-metric--bio em {
    color: #22d3ee;
  }

  .vault-metrics small {
    grid-column: 1 / -1;
    margin-top: -0.1rem;
    font-size: 0.47rem;
  }

  .vault-origin {
    border-radius: 1.12rem;
  }

  .vault-origin .vault-panel__top {
    min-height: 2.7rem;
    border-radius: 1.12rem 1.12rem 0 0;
  }

  .vault-map {
    isolation: isolate;
    margin: 0;
    border: 0;
    border-radius: 0;
    padding: clamp(0.72rem, 1vw, 0.95rem);
    background:
      radial-gradient(circle at 50% 48%, rgba(34, 211, 238, 0.24), transparent 34%),
      radial-gradient(ellipse at 50% 100%, rgba(16, 185, 129, 0.1), transparent 62%),
      linear-gradient(180deg, #071b2f 0%, #08253b 48%, #04111f 100%);
    box-shadow:
      inset 0 0 0 1px rgba(34, 211, 238, 0.08),
      inset 0 0 42px rgba(0, 0, 0, 0.32);
  }

  .vault-map::before {
    inset: 0.72rem;
    border: 1px solid rgba(34, 211, 238, 0.18);
    border-radius: 0.98rem;
    background:
      linear-gradient(90deg, rgba(34, 211, 238, 0.11) 1px, transparent 1px),
      linear-gradient(rgba(34, 211, 238, 0.085) 1px, transparent 1px);
    background-size: 24px 24px;
    opacity: 0.24;
    animation: vaultGridDrift 7.5s linear infinite;
  }

  .vault-map::after {
    content: "";
    position: absolute;
    inset: 0.72rem;
    z-index: 3;
    border-radius: 0.98rem;
    background:
      linear-gradient(115deg, transparent 0 42%, rgba(34, 211, 238, 0.14) 49%, transparent 56%),
      radial-gradient(circle at 24% 72%, rgba(251, 191, 36, 0.14), transparent 11%),
      radial-gradient(circle at 72% 56%, rgba(163, 230, 53, 0.12), transparent 10%);
    mix-blend-mode: screen;
    pointer-events: none;
    animation: vaultOceanSweep 4.6s ease-in-out infinite;
  }

  .vault-map__ocean,
  .vault-map__rings,
  .vault-map__corners,
  .vault-map__pings {
    position: absolute;
    inset: 0.72rem;
    z-index: 2;
    border-radius: 0.98rem;
    pointer-events: none;
  }

  .vault-map__ocean {
    background:
      radial-gradient(circle at 18% 72%, rgba(34, 211, 238, 0.18), transparent 16%),
      radial-gradient(circle at 68% 18%, rgba(34, 211, 238, 0.12), transparent 18%),
      radial-gradient(ellipse at 50% 55%, rgba(8, 47, 73, 0.78), transparent 65%);
    animation: vaultOceanPulse 3.8s ease-in-out infinite;
  }

  .vault-map__rings {
    background:
      repeating-radial-gradient(circle at 43% 58%, transparent 0 2.35rem, rgba(34, 211, 238, 0.13) 2.42rem 2.48rem, transparent 2.55rem 4.9rem);
    opacity: 0.62;
    animation: vaultRadarRings 6.2s linear infinite;
  }

  .vault-map__corners {
    background:
      linear-gradient(#22d3ee, #22d3ee) left 0.62rem top 0.62rem / 2.3rem 1px no-repeat,
      linear-gradient(#22d3ee, #22d3ee) left 0.62rem top 0.62rem / 1px 2.3rem no-repeat,
      linear-gradient(#22d3ee, #22d3ee) right 0.62rem top 0.62rem / 2.3rem 1px no-repeat,
      linear-gradient(#22d3ee, #22d3ee) right 0.62rem top 0.62rem / 1px 2.3rem no-repeat,
      linear-gradient(#fbbf24, #fbbf24) left 0.62rem bottom 0.62rem / 2.3rem 1px no-repeat,
      linear-gradient(#fbbf24, #fbbf24) left 0.62rem bottom 0.62rem / 1px 2.3rem no-repeat,
      linear-gradient(#a3e635, #a3e635) right 0.62rem bottom 0.62rem / 2.3rem 1px no-repeat,
      linear-gradient(#a3e635, #a3e635) right 0.62rem bottom 0.62rem / 1px 2.3rem no-repeat;
    opacity: 0.45;
  }

  .vault-map__pings i {
    position: absolute;
    width: 0.22rem;
    height: 0.22rem;
    border-radius: 999px;
    background: #22d3ee;
    box-shadow: 0 0 12px rgba(34, 211, 238, 0.8);
    opacity: 0;
    animation: vaultMapPing 2.7s ease-in-out infinite;
    animation-delay: calc(var(--i) * -0.22s);
  }

  .vault-map__pings i:nth-child(1) { left: 19%; top: 23%; }
  .vault-map__pings i:nth-child(2) { left: 44%; top: 18%; }
  .vault-map__pings i:nth-child(3) { left: 72%; top: 27%; }
  .vault-map__pings i:nth-child(4) { left: 23%; top: 48%; }
  .vault-map__pings i:nth-child(5) { left: 49%; top: 44%; }
  .vault-map__pings i:nth-child(6) { left: 76%; top: 52%; }
  .vault-map__pings i:nth-child(7) { left: 27%; top: 72%; }
  .vault-map__pings i:nth-child(8) { left: 52%; top: 76%; }
  .vault-map__pings i:nth-child(9) { left: 70%; top: 70%; }

  .vault-map__scan {
    left: 11%;
    right: 11%;
    z-index: 4;
    height: 2px;
    border-radius: 999px;
    background:
      linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.8), rgba(34, 211, 238, 0.95), rgba(163, 230, 53, 0.72), transparent);
    box-shadow: 0 0 16px rgba(34, 211, 238, 0.35);
    animation: vaultMapScan 2.15s ease-in-out infinite;
  }

  .vault-sri-lanka-map {
    z-index: 3;
    width: min(100%, 17.15rem);
    height: min(100%, 24.15rem);
    border-radius: 0.9rem;
    padding: 0;
    background: transparent;
    box-shadow: none;
    filter:
      saturate(1.28)
      contrast(1.18)
      drop-shadow(0 0 18px rgba(34, 211, 238, 0.38))
      drop-shadow(0 0 34px rgba(6, 182, 212, 0.22));
    animation: vaultMapFloat 5.4s ease-in-out infinite;
  }

  .vault-origin__privacy {
    margin: 0.75rem 0.88rem 0.9rem;
    border-radius: 1rem;
    padding: 0.8rem 0.88rem;
  }

  @keyframes vaultOceanPulse {
    0%, 100% { opacity: 0.72; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.015); }
  }

  @keyframes vaultOceanSweep {
    0%, 100% { opacity: 0.2; transform: translateX(-8%) skewX(-8deg); }
    50% { opacity: 0.68; transform: translateX(8%) skewX(-8deg); }
  }

  @keyframes vaultRadarRings {
    to { transform: rotate(360deg); }
  }

  @keyframes vaultMapPing {
    0%, 30%, 100% { opacity: 0; transform: scale(0.55); }
    44% { opacity: 0.9; transform: scale(1); }
    68% { opacity: 0; transform: scale(2.6); }
  }

  @keyframes vaultMapFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-0.22rem); }
  }

  .vault-core-wrap {
    padding-top: clamp(0.9rem, 1.65vh, 1.45rem);
  }

  .vault-core {
    padding: clamp(0.9rem, 1.1vw, 1.18rem);
    overflow: visible;
  }

  .vault-core__ring,
  .vault-core__sweep,
  .vault-core__particles {
    inset: 10%;
  }

  .vault-core__ring--two {
    inset: 17%;
  }

  .vault-core__media {
    width: clamp(9.3rem, 49%, 14.1rem);
    padding: 0.28rem;
    transform: translateY(0.18rem);
  }

  .vault-core__portrait-frame {
    padding: clamp(0.48rem, 0.8vw, 0.76rem);
  }

  .vault-core__portrait-frame i {
    inset: 10%;
  }

  .vault-core__portrait-image {
    width: 86%;
    height: 86%;
    object-fit: contain;
    object-position: center;
  }

  .vault-center-stack > .vault-security {
    border-color: rgba(34, 211, 238, 0.22);
    background:
      linear-gradient(180deg, rgba(7, 13, 26, 0.74), rgba(3, 7, 18, 0.76)),
      radial-gradient(circle at 28% 35%, rgba(34, 211, 238, 0.12), transparent 34%);
  }

  .vault-center-stack > .vault-security .vault-security-assets {
    perspective: 900px;
  }

  .vault-center-stack > .vault-security .vault-security-asset {
    position: relative;
    cursor: pointer;
    transform-style: preserve-3d;
    animation: vaultMeshCardLive 5.8s ease-in-out infinite;
    animation-delay: calc(var(--i) * -0.42s);
    color: rgba(245, 236, 225, 0.72);
    border-radius: 0.88rem;
    overflow: hidden;
    background:
      linear-gradient(180deg, rgba(9, 27, 47, 0.9), rgba(2, 6, 16, 0.96)),
      repeating-linear-gradient(90deg, rgba(34, 211, 238, 0.08) 0 1px, transparent 1px 12px);
    box-shadow:
      inset 0 1px 0 rgba(245, 236, 225, 0.08),
      inset 0 -28px 36px rgba(2, 6, 16, 0.72),
      0 0 0 1px rgba(34, 211, 238, 0.1),
      0 18px 30px rgba(0, 0, 0, 0.2);
  }

  .vault-center-stack > .vault-security .vault-security-asset::before,
  .vault-center-stack > .vault-security .vault-security-asset::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
  }

  .vault-center-stack > .vault-security .vault-security-asset::before {
    background:
      linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.34), transparent),
      linear-gradient(180deg, transparent 0 48%, rgba(163, 230, 53, 0.34) 49%, rgba(34, 211, 238, 0.26) 50%, transparent 52%);
    opacity: 0.58;
    transform: translateX(-110%);
    animation: vaultMeshCardSweep 2.7s ease-in-out infinite;
    animation-delay: calc(var(--i) * -0.35s);
  }

  .vault-center-stack > .vault-security .vault-security-asset::after {
    border-radius: inherit;
    background:
      linear-gradient(rgba(34, 211, 238, 0.12), rgba(34, 211, 238, 0.12)) left top / 1.8rem 1px no-repeat,
      linear-gradient(rgba(34, 211, 238, 0.12), rgba(34, 211, 238, 0.12)) left top / 1px 1.8rem no-repeat,
      linear-gradient(rgba(251, 191, 36, 0.18), rgba(251, 191, 36, 0.18)) right bottom / 1.8rem 1px no-repeat,
      linear-gradient(rgba(251, 191, 36, 0.18), rgba(251, 191, 36, 0.18)) right bottom / 1px 1.8rem no-repeat;
  }

  .vault-center-stack > .vault-security .vault-security-asset:nth-child(2) {
    animation-duration: 6.35s;
  }

  .vault-center-stack > .vault-security .vault-security-asset:nth-child(3) {
    animation-duration: 5.45s;
  }

  .vault-center-stack > .vault-security .vault-security-asset:hover,
  .vault-center-stack > .vault-security .vault-security-asset:focus-visible {
    border-color: rgba(251, 191, 36, 0.5);
    outline: none;
    box-shadow:
      inset 0 1px 0 rgba(245, 236, 225, 0.1),
      0 0 28px rgba(34, 211, 238, 0.18),
      0 0 18px rgba(251, 191, 36, 0.12);
  }

  .vault-center-stack > .vault-security .vault-security-asset span {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    overflow: hidden;
    min-height: 1.15rem;
    padding: 0.28rem 0.42rem 0.22rem;
    color: rgba(245, 236, 225, 0.54);
    font: 850 0.44rem ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: 0.08em;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    background:
      linear-gradient(90deg, rgba(3, 7, 18, 0.8), rgba(8, 47, 73, 0.8)),
      repeating-linear-gradient(90deg, rgba(34, 211, 238, 0.1) 0 1px, transparent 1px 9px);
    border-top: 1px solid rgba(34, 211, 238, 0.18);
  }

  .vault-center-stack > .vault-security .vault-security-asset span::after {
    content: "_";
    margin-left: 0.18rem;
    color: #22d3ee;
    animation: vaultTerminalCursor 0.9s steps(2, end) infinite;
  }

  .vault-center-stack > .vault-security .vault-security-asset__image {
    width: 112%;
    height: 84%;
    margin-bottom: 0.95rem;
    border-radius: 0.56rem;
    object-fit: cover;
    object-position: center;
    mix-blend-mode: plus-lighter;
    mask-image: radial-gradient(ellipse at center, black 0 58%, transparent 76%);
    animation: vaultMeshImagePulse 2.8s ease-in-out infinite;
  }

  .vault-face-scan {
    position: absolute;
    inset: 0;
    z-index: 22;
    display: grid;
    place-items: center;
    padding: 1.2rem;
    background:
      radial-gradient(circle at 50% 35%, rgba(34, 211, 238, 0.14), transparent 38%),
      rgba(2, 6, 16, 0.68);
    backdrop-filter: blur(12px);
  }

  .vault-face-scan > div {
    position: relative;
    display: grid;
    width: min(94vw, 34rem);
    gap: 0.85rem;
    border: 1px solid rgba(34, 211, 238, 0.32);
    border-radius: 1.18rem;
    padding: 1rem;
    background:
      radial-gradient(circle at 50% 18%, rgba(34, 211, 238, 0.2), transparent 32%),
      linear-gradient(145deg, rgba(3, 7, 18, 0.97), rgba(8, 47, 73, 0.86));
    box-shadow:
      0 26px 76px rgba(0, 0, 0, 0.56),
      inset 0 1px 0 rgba(245, 236, 225, 0.08),
      0 0 42px rgba(34, 211, 238, 0.12);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }

  .vault-face-scan > div > button {
    position: absolute;
    top: 0.82rem;
    right: 0.82rem;
    z-index: 6;
    display: grid;
    width: 2rem;
    height: 2rem;
    place-items: center;
    border: 1px solid rgba(34, 211, 238, 0.3);
    border-radius: 999px;
    color: rgba(245, 236, 225, 0.82);
    background: rgba(3, 7, 18, 0.74);
  }

  .vault-face-scan__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.8rem;
    padding-right: 2.4rem;
  }

  .vault-face-scan__top span {
    color: #22d3ee;
    font-size: 0.62rem;
    font-weight: 950;
    letter-spacing: 0.12em;
  }

  .vault-face-scan__top b {
    color: #fbbf24;
    font-size: 0.58rem;
    letter-spacing: 0.11em;
  }

  .vault-face-scan__top b.is-complete {
    color: #a3e635;
    text-shadow: 0 0 16px rgba(163, 230, 53, 0.28);
  }

  .vault-face-scan__stage {
    position: relative;
    display: grid;
    width: min(76vw, 22.5rem);
    aspect-ratio: 1;
    place-items: center;
    justify-self: center;
    border-radius: 999px;
    overflow: hidden;
    background:
      radial-gradient(circle, rgba(34, 211, 238, 0.12), transparent 54%),
      rgba(3, 7, 18, 0.42);
  }

  .vault-face-scan__face {
    width: 92%;
    height: 92%;
    border-radius: 999px;
    object-fit: cover;
    filter:
      saturate(1.18)
      contrast(1.12)
      drop-shadow(0 0 24px rgba(34, 211, 238, 0.26));
  }

  .vault-face-scan__ring,
  .vault-face-scan__sweep,
  .vault-face-scan__lock,
  .vault-face-scan__beam,
  .vault-face-scan__points {
    position: absolute;
    pointer-events: none;
  }

  .vault-face-scan__ring,
  .vault-face-scan__sweep,
  .vault-face-scan__lock {
    border-radius: 999px;
  }

  .vault-face-scan__ring--one {
    inset: 4%;
    border: 1px solid rgba(34, 211, 238, 0.46);
    animation: vaultRotate 5.8s linear infinite;
  }

  .vault-face-scan__ring--two {
    inset: 12%;
    border: 1px dashed rgba(251, 191, 36, 0.42);
    animation: vaultRotate 8s linear infinite reverse;
  }

  .vault-face-scan__sweep {
    inset: 7%;
    background: conic-gradient(from 0deg, rgba(34, 211, 238, 0.55), transparent 24%);
    mask-image: radial-gradient(circle, transparent 44%, black 46%, black 49%, transparent 52%);
    animation: vaultRotate 1.8s linear infinite;
  }

  .vault-face-scan__lock {
    inset: 21%;
    border: 1px solid rgba(163, 230, 53, 0.24);
    animation: vaultScanLock 2.2s ease-in-out infinite;
  }

  .vault-face-scan__beam {
    z-index: 6;
    opacity: 0.72;
    border-radius: 999px;
    mix-blend-mode: screen;
  }

  .vault-face-scan__beam--ltr,
  .vault-face-scan__beam--rtl {
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, transparent, #22d3ee, #fbbf24, #22d3ee, transparent);
    box-shadow: 0 0 18px rgba(34, 211, 238, 0.65);
  }

  .vault-face-scan__beam--ttb,
  .vault-face-scan__beam--btt {
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #22d3ee, #a3e635, #22d3ee, transparent);
    box-shadow: 0 0 18px rgba(163, 230, 53, 0.44);
  }

  .vault-face-scan__beam--ltr { animation: vaultFaceScanLtr 5s linear infinite; }
  .vault-face-scan__beam--rtl { animation: vaultFaceScanRtl 5s linear infinite; animation-delay: 1.25s; }
  .vault-face-scan__beam--ttb { animation: vaultFaceScanTtb 5s linear infinite; animation-delay: 2.5s; }
  .vault-face-scan__beam--btt { animation: vaultFaceScanBtt 5s linear infinite; animation-delay: 3.75s; }

  .vault-face-scan__points {
    inset: 22%;
    z-index: 7;
  }

  .vault-face-scan__points i {
    position: absolute;
    width: 0.28rem;
    height: 0.28rem;
    border-radius: 999px;
    background: #fbbf24;
    box-shadow:
      0 0 10px rgba(251, 191, 36, 0.86),
      0 0 18px rgba(34, 211, 238, 0.58);
    opacity: 0.18;
    animation: vaultFacePointPulse 1.35s ease-in-out infinite;
    animation-delay: calc(var(--p, 0) * -0.13s);
  }

  .vault-face-scan__points i:nth-child(1) { left: 48%; top: 5%; --p: 1; }
  .vault-face-scan__points i:nth-child(2) { left: 24%; top: 24%; --p: 2; }
  .vault-face-scan__points i:nth-child(3) { left: 72%; top: 24%; --p: 3; }
  .vault-face-scan__points i:nth-child(4) { left: 33%; top: 35%; --p: 4; }
  .vault-face-scan__points i:nth-child(5) { left: 62%; top: 35%; --p: 5; }
  .vault-face-scan__points i:nth-child(6) { left: 48%; top: 44%; --p: 6; }
  .vault-face-scan__points i:nth-child(7) { left: 38%; top: 56%; --p: 7; }
  .vault-face-scan__points i:nth-child(8) { left: 58%; top: 56%; --p: 8; }
  .vault-face-scan__points i:nth-child(9) { left: 48%; top: 67%; --p: 9; }
  .vault-face-scan__points i:nth-child(10) { left: 30%; top: 74%; --p: 10; }
  .vault-face-scan__points i:nth-child(11) { left: 66%; top: 74%; --p: 11; }
  .vault-face-scan__points i:nth-child(12) { left: 18%; top: 47%; --p: 12; }
  .vault-face-scan__points i:nth-child(13) { left: 78%; top: 47%; --p: 13; }
  .vault-face-scan__points i:nth-child(14) { left: 48%; top: 84%; --p: 14; }

  .vault-face-scan__readout {
    display: grid;
    gap: 0.52rem;
    border: 1px solid rgba(34, 211, 238, 0.24);
    border-radius: 0.9rem;
    padding: 0.8rem;
    background:
      linear-gradient(180deg, rgba(3, 7, 18, 0.78), rgba(3, 7, 18, 0.58)),
      repeating-linear-gradient(90deg, rgba(34, 211, 238, 0.07) 0 1px, transparent 1px 12px);
    box-shadow:
      inset 0 1px 0 rgba(245, 236, 225, 0.06),
      0 0 24px rgba(34, 211, 238, 0.08);
  }

  .vault-face-scan__terminal {
    display: grid;
    gap: 0.28rem;
  }

  .vault-face-scan__readout p {
    margin: 0;
    color: rgba(245, 236, 225, 0.78);
    font-size: 0.68rem;
    line-height: 1.45;
  }

  .vault-face-scan__readout p:first-child::before,
  .vault-face-scan__readout p:nth-child(2)::before {
    color: #22d3ee;
    content: "> ";
  }

  .vault-face-scan__verify {
    display: flex;
    align-items: center;
    gap: 0.48rem;
    color: rgba(245, 236, 225, 0.82);
    font-size: 0.64rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .vault-face-scan__verify input {
    width: 0.92rem;
    height: 0.92rem;
    accent-color: #fbbf24;
  }

  .vault-face-scan__verify--complete {
    color: #a3e635;
    text-shadow: 0 0 16px rgba(163, 230, 53, 0.26);
  }

  .vault-face-scan__verify--complete input {
    accent-color: #a3e635;
  }

  .vault-face-scan__verify--complete ~ em {
    color: #a3e635;
    text-shadow: 0 0 16px rgba(163, 230, 53, 0.26);
  }

  .vault-face-scan__readout em {
    color: #fbbf24;
    font-size: 0.62rem;
    font-style: normal;
    font-weight: 950;
    letter-spacing: 0.11em;
  }

  .vault-message,
  .vault-clearance,
  .vault-origin__privacy,
  .vault-clue-modal > div {
    position: relative;
    overflow: hidden;
    background:
      linear-gradient(180deg, rgba(15, 23, 42, 0.84), rgba(3, 7, 18, 0.72)),
      repeating-linear-gradient(90deg, rgba(34, 211, 238, 0.055) 0 1px, transparent 1px 13px);
    box-shadow:
      inset 0 1px 0 rgba(245, 236, 225, 0.06),
      inset 0 -24px 42px rgba(2, 6, 16, 0.34),
      0 0 28px rgba(34, 211, 238, 0.055);
  }

  .vault-message::after,
  .vault-clearance::after,
  .vault-origin__privacy::after,
  .vault-clue-modal > div::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background: linear-gradient(180deg, transparent 0 48%, rgba(34, 211, 238, 0.05) 49%, transparent 51% 100%);
    background-size: 100% 0.42rem;
    opacity: 0.42;
  }

  .vault-message__payload,
  .vault-clearance p,
  .vault-origin__privacy p,
  .vault-clue-modal p {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }

  @keyframes vaultMeshCardLive {
    0%, 100% { transform: translateY(0) rotateY(0deg); }
    18% { transform: translateY(-0.12rem) rotateY(0deg); }
    24% { transform: translateX(-1px) rotateY(-3deg); }
    28% { transform: translateX(1px) rotateY(3deg); }
    42% { transform: translateY(0) rotateY(0deg); }
    58% { transform: translateY(-0.08rem) rotateY(180deg); }
    72% { transform: translateY(0) rotateY(360deg); }
  }

  @keyframes vaultMeshCardSweep {
    0%, 36%, 100% { transform: translateX(-115%); opacity: 0; }
    46% { opacity: 0.68; }
    62% { transform: translateX(115%); opacity: 0; }
  }

  @keyframes vaultMeshImagePulse {
    0%, 100% { filter: saturate(1.18) contrast(1.12) brightness(1.08) drop-shadow(0 0 20px rgba(34, 211, 238, 0.34)); }
    50% { filter: saturate(1.35) contrast(1.18) brightness(1.18) drop-shadow(0 0 28px rgba(34, 211, 238, 0.52)); }
  }

  @keyframes vaultTerminalCursor {
    0%, 48% { opacity: 1; }
    49%, 100% { opacity: 0; }
  }

  @keyframes vaultFaceScanLtr {
    0%, 100% { left: 7%; opacity: 0; }
    8%, 24% { opacity: 0.8; }
    35% { left: 93%; opacity: 0; }
  }

  @keyframes vaultFaceScanRtl {
    0%, 100% { right: 7%; opacity: 0; }
    8%, 24% { opacity: 0.8; }
    35% { right: 93%; opacity: 0; }
  }

  @keyframes vaultFaceScanTtb {
    0%, 100% { top: 8%; opacity: 0; }
    8%, 24% { opacity: 0.78; }
    35% { top: 92%; opacity: 0; }
  }

  @keyframes vaultFaceScanBtt {
    0%, 100% { bottom: 8%; opacity: 0; }
    8%, 24% { opacity: 0.78; }
    35% { bottom: 92%; opacity: 0; }
  }

  @keyframes vaultFacePointPulse {
    0%, 100% { opacity: 0.18; transform: scale(0.72); }
    42% { opacity: 1; transform: scale(1.25); }
    72% { opacity: 0.36; transform: scale(0.92); }
  }

  @keyframes vaultGuidancePulse {
    0%, 100% { box-shadow: inset 0 1px 0 rgba(245, 236, 225, 0.06), 0 0 18px rgba(251, 191, 36, 0.06); }
    50% { box-shadow: inset 0 1px 0 rgba(245, 236, 225, 0.08), 0 0 28px rgba(34, 211, 238, 0.12); }
  }

  @keyframes vaultScanLock {
    0%, 100% { transform: scale(0.88); opacity: 0.28; }
    50% { transform: scale(1.08); opacity: 0.75; }
  }

  .vault-center-stack {
    grid-template-rows: minmax(0, 1fr);
    align-items: center;
  }

  .vault-center-stack .vault-core-wrap {
    align-self: center;
  }

  .vault-core__media {
    width: clamp(11.6rem, 64%, 17rem);
  }

  .vault-core__portrait-frame {
    padding: 0.12rem;
  }

  .vault-core__portrait-frame i {
    inset: 4%;
  }

  .vault-core__portrait-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transform: scale(1.26);
    transform-origin: center;
  }

  .vault-presence {
    display: inline-grid;
    width: fit-content;
    place-self: center;
    margin-top: 0.18rem;
    border: 1px solid currentColor;
    border-radius: 999px;
    padding: 0.18rem 0.52rem;
    font-size: 0.54rem;
    font-weight: 950;
    letter-spacing: 0.16em;
    line-height: 1;
    background: rgba(3, 7, 18, 0.58);
  }

  .vault-presence--online {
    color: #a3e635;
    box-shadow: 0 0 16px rgba(163, 230, 53, 0.24);
  }

  .vault-presence--away {
    color: #fbbf24;
    box-shadow: 0 0 16px rgba(251, 191, 36, 0.2);
  }

  .vault-presence--offline {
    color: #ef4444;
    box-shadow: 0 0 16px rgba(239, 68, 68, 0.2);
  }

  .vault-gate {
    position: relative;
    padding-bottom: 0.95rem;
  }

  .vault-gate .vault-security {
    position: relative;
    display: grid;
    min-height: 19.4rem;
    margin: 1.05rem 1.05rem 0.9rem;
    grid-template-rows: 2.35rem minmax(0, 1fr);
    overflow: hidden;
    border-color: rgba(34, 211, 238, 0.28);
    background:
      radial-gradient(circle at 22% 40%, rgba(34, 211, 238, 0.12), transparent 36%),
      linear-gradient(180deg, rgba(7, 13, 26, 0.82), rgba(3, 7, 18, 0.82));
  }

  .vault-gate .vault-security .vault-panel__top b {
    color: #fbbf24;
  }

  .vault-gate > div > .vault-panel__top b {
    color: #fbbf24;
  }

  .vault-gate--accepted > div > .vault-panel__top b,
  .vault-gate--unlocked > div > .vault-panel__top b {
    color: #22c55e;
    text-shadow: 0 0 16px rgba(34, 197, 94, 0.3);
  }

  .vault-gate--rejected > div > .vault-panel__top b {
    color: #ef4444;
    text-shadow: 0 0 16px rgba(239, 68, 68, 0.32);
  }

  .vault-gate--verifying > div > .vault-panel__top b {
    color: #22d3ee;
  }

  .vault-gate .vault-security--unlocked .vault-panel__top b,
  .vault-gate .vault-security--accepted .vault-panel__top b {
    color: #fbbf24;
  }

  .vault-gate .vault-security--rejected .vault-panel__top b {
    color: #ef4444;
    text-shadow: 0 0 16px rgba(239, 68, 68, 0.32);
  }

  .vault-gate .vault-security--biometric-verified .vault-panel__top b {
    color: #a3e635;
    text-shadow: 0 0 18px rgba(163, 230, 53, 0.34);
  }

  .vault-security-body {
    display: grid;
    min-height: 0;
    place-items: center;
    padding: 0.95rem 1.2rem 0.9rem;
  }

  .vault-security-face {
    position: relative;
    display: grid;
    grid-template-rows: minmax(0, 1fr);
    width: min(100%, 14.7rem);
    height: min(100%, 15.65rem);
    min-height: 13.8rem;
    padding: 0.74rem;
    margin-top: 0;
    place-items: center;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid rgba(34, 211, 238, 0.28);
    border-radius: 1rem;
    background:
      radial-gradient(circle at 50% 42%, rgba(34, 211, 238, 0.2), transparent 38%),
      radial-gradient(circle at 50% 110%, rgba(34, 197, 94, 0.12), transparent 40%),
      linear-gradient(180deg, rgba(8, 47, 73, 0.58), rgba(2, 6, 16, 0.92));
    box-shadow:
      inset 0 1px 0 rgba(245, 236, 225, 0.08),
      0 0 34px rgba(34, 211, 238, 0.1),
      0 18px 30px rgba(0, 0, 0, 0.24);
  }

  .vault-security-face::before,
  .vault-security-face::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
  }

  .vault-security-face::before {
    background:
      linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.46), transparent),
      linear-gradient(180deg, transparent 0 47%, rgba(34, 197, 94, 0.28) 48%, rgba(251, 191, 36, 0.26) 50%, transparent 53%);
    transform: translateX(-115%);
    opacity: 0;
    animation: vaultMeshCardSweep 2.5s ease-in-out infinite;
  }

  .vault-security-face::after {
    border-radius: inherit;
    background:
      linear-gradient(#22d3ee, #22d3ee) left 0.75rem top 0.75rem / 2.2rem 1px no-repeat,
      linear-gradient(#22d3ee, #22d3ee) left 0.75rem top 0.75rem / 1px 2.2rem no-repeat,
      linear-gradient(#22c55e, #22c55e) right 0.75rem top 0.75rem / 2.2rem 1px no-repeat,
      linear-gradient(#22c55e, #22c55e) right 0.75rem top 0.75rem / 1px 2.2rem no-repeat,
      linear-gradient(#fbbf24, #fbbf24) left 0.75rem bottom 0.75rem / 2.2rem 1px no-repeat,
      linear-gradient(#fbbf24, #fbbf24) left 0.75rem bottom 0.75rem / 1px 2.2rem no-repeat,
      linear-gradient(#ef4444, #ef4444) right 0.75rem bottom 0.75rem / 2.2rem 1px no-repeat,
      linear-gradient(#ef4444, #ef4444) right 0.75rem bottom 0.75rem / 1px 2.2rem no-repeat;
    opacity: 0.56;
  }

  .vault-security-face__image {
    position: relative;
    z-index: 1;
    align-self: center;
    justify-self: center;
    width: 84%;
    height: 84%;
    min-height: 0;
    object-fit: contain;
    object-position: center;
    filter:
      saturate(1.24)
      contrast(1.1)
      drop-shadow(0 0 22px rgba(34, 211, 238, 0.34));
    animation: vaultMeshImagePulse 2.6s ease-in-out infinite;
  }

  .vault-security-face span {
    position: absolute;
    left: 0.62rem;
    top: 50%;
    z-index: 4;
    width: auto;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    color: #a3e635;
    background: transparent;
    box-shadow: none;
    font: 950 0.48rem ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: 0.16em;
    line-height: 1;
    text-align: left;
    text-shadow: 0 0 14px rgba(163, 230, 53, 0.28);
    text-transform: uppercase;
    transform: translateY(-50%) rotate(180deg);
    transform-origin: center;
    writing-mode: vertical-rl;
    pointer-events: none;
  }

  .vault-security-notifier {
    position: absolute;
    top: 0.5rem;
    right: 5.55rem;
    z-index: 14;
  }

  .vault-field-head .vault-security-notifier {
    position: relative;
    top: auto;
    right: auto;
    z-index: 16;
    flex: 0 0 auto;
  }

  .vault-field-head .vault-security-popover {
    top: 2.05rem;
    right: 0;
  }

  .vault-gate--unlocked .vault-security-notifier {
    right: 11.8rem;
  }

  .vault-gate--unlocked .vault-field-head .vault-security-notifier {
    right: auto;
  }

  .vault-security-notifier > button {
    display: grid;
    width: 1.75rem;
    height: 1.75rem;
    place-items: center;
    border: 1px solid rgba(251, 191, 36, 0.46);
    border-radius: 999px;
    color: #fbbf24;
    background:
      radial-gradient(circle, rgba(251, 191, 36, 0.16), transparent 64%),
      rgba(3, 7, 18, 0.86);
    box-shadow: 0 0 18px rgba(251, 191, 36, 0.18);
    font: 950 0.72rem ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    cursor: pointer;
    animation: vaultGuidancePulse 2.4s ease-in-out infinite;
  }

  .vault-security-notifier--success > button {
    border-color: rgba(163, 230, 53, 0.5);
    color: #a3e635;
    box-shadow: 0 0 18px rgba(163, 230, 53, 0.18);
  }

  .vault-security-popover {
    position: absolute;
    top: 2.05rem;
    right: 0;
    display: grid;
    width: min(17.8rem, calc(100vw - 4rem));
    gap: 0.34rem;
    overflow: hidden;
    border: 1px solid rgba(251, 191, 36, 0.26);
    border-radius: 0.72rem;
    padding: 0.52rem 0.58rem;
    background:
      linear-gradient(180deg, rgba(15, 23, 42, 0.84), rgba(3, 7, 18, 0.7)),
      repeating-linear-gradient(90deg, rgba(34, 211, 238, 0.06) 0 1px, transparent 1px 12px);
    box-shadow:
      inset 0 1px 0 rgba(245, 236, 225, 0.06),
      0 0 24px rgba(251, 191, 36, 0.07);
  }

  .vault-security-popover::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.2), transparent);
    opacity: 0;
    transform: translateX(-115%);
    animation: vaultMeshCardSweep 2.4s ease-in-out infinite;
    pointer-events: none;
  }

  .vault-security-popover b {
    position: relative;
    z-index: 1;
    color: #fbbf24;
    font-size: 0.54rem;
    font-weight: 950;
    letter-spacing: 0.12em;
  }

  .vault-security-popover p {
    position: relative;
    z-index: 1;
    margin: 0;
    color: rgba(245, 236, 225, 0.74);
    font: 800 0.48rem/1.42 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }

  .vault-security-popover div {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.38rem;
  }

  .vault-security-popover button {
    position: relative;
    z-index: 1;
    min-height: 1.46rem;
    border: 1px solid rgba(34, 211, 238, 0.28);
    border-radius: 0.56rem;
    color: rgba(245, 236, 225, 0.86);
    background:
      linear-gradient(180deg, rgba(34, 211, 238, 0.08), rgba(3, 7, 18, 0.72)),
      rgba(255, 255, 255, 0.035);
    font: 950 0.44rem ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition:
      border-color 180ms ease,
      color 180ms ease,
      transform 180ms ease,
      box-shadow 180ms ease;
  }

  .vault-security-popover button:hover,
  .vault-security-popover button:focus-visible {
    border-color: currentColor;
    color: #22d3ee;
    outline: none;
    transform: translateY(-1px);
    box-shadow: 0 0 18px rgba(34, 211, 238, 0.16);
  }

  .vault-security-notifier--success .vault-security-popover {
    border-color: rgba(163, 230, 53, 0.35);
    box-shadow: 0 0 24px rgba(163, 230, 53, 0.09);
  }

  .vault-security-notifier--success .vault-security-popover b,
  .vault-security-notifier--success .vault-security-popover button {
    color: #a3e635;
  }

  .vault-security-notifier--warning .vault-security-popover {
    border-color: rgba(251, 191, 36, 0.34);
  }

  .vault-security-notifier--attention .vault-security-popover {
    border-color: rgba(34, 211, 238, 0.34);
  }

  .vault-gate .vault-security-assets {
    height: auto;
    align-items: center;
    justify-items: center;
    gap: 0.42rem;
    padding: 0.28rem 1rem 0.9rem;
    perspective: 900px;
  }

  .vault-gate .vault-security-asset {
    position: relative;
    width: min(100%, 4.75rem);
    aspect-ratio: 1.24;
    min-height: 0;
    cursor: default;
    transform-style: preserve-3d;
    overflow: hidden;
    border-radius: 0.82rem;
    background:
      linear-gradient(180deg, rgba(9, 27, 47, 0.9), rgba(2, 6, 16, 0.96)),
      repeating-linear-gradient(90deg, rgba(34, 211, 238, 0.08) 0 1px, transparent 1px 12px);
    box-shadow:
      inset 0 1px 0 rgba(245, 236, 225, 0.08),
      inset 0 -24px 34px rgba(2, 6, 16, 0.7),
      0 0 0 1px rgba(34, 211, 238, 0.1);
    animation: vaultMeshCardLive 6.8s ease-in-out infinite;
    animation-delay: calc(var(--i) * -0.42s);
  }

  .vault-gate .vault-security-asset::before,
  .vault-gate .vault-security-asset::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
  }

  .vault-gate .vault-security-asset::before {
    background:
      linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.32), transparent),
      linear-gradient(180deg, transparent 0 48%, rgba(163, 230, 53, 0.32) 49%, rgba(34, 211, 238, 0.24) 50%, transparent 52%);
    opacity: 0.58;
    transform: translateX(-110%);
    animation: vaultMeshCardSweep 2.7s ease-in-out infinite;
    animation-delay: calc(var(--i) * -0.35s);
  }

  .vault-gate .vault-security-asset::after {
    border-radius: inherit;
    background:
      linear-gradient(rgba(34, 211, 238, 0.12), rgba(34, 211, 238, 0.12)) left top / 1.45rem 1px no-repeat,
      linear-gradient(rgba(34, 211, 238, 0.12), rgba(34, 211, 238, 0.12)) left top / 1px 1.45rem no-repeat,
      linear-gradient(rgba(251, 191, 36, 0.18), rgba(251, 191, 36, 0.18)) right bottom / 1.45rem 1px no-repeat,
      linear-gradient(rgba(251, 191, 36, 0.18), rgba(251, 191, 36, 0.18)) right bottom / 1px 1.45rem no-repeat;
  }

  .vault-gate .vault-security-asset__image {
    position: relative;
    z-index: 1;
    width: 106%;
    max-width: none;
    height: 72%;
    margin-bottom: 0.68rem;
    border-radius: 0.56rem;
    object-fit: cover;
    object-position: center;
    mix-blend-mode: plus-lighter;
    mask-image: radial-gradient(ellipse at center, black 0 58%, transparent 76%);
    animation: vaultMeshImagePulse 2.8s ease-in-out infinite;
  }

  .vault-gate .vault-security-asset span {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    min-height: 0.88rem;
    padding: 0.2rem 0.24rem 0.16rem;
    overflow: hidden;
    color: rgba(245, 236, 225, 0.56);
    background:
      linear-gradient(90deg, rgba(3, 7, 18, 0.8), rgba(8, 47, 73, 0.8)),
      repeating-linear-gradient(90deg, rgba(34, 211, 238, 0.1) 0 1px, transparent 1px 9px);
    border-top: 1px solid rgba(34, 211, 238, 0.18);
    font: 850 0.32rem ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: 0.08em;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .vault-gate .vault-security-asset span::after {
    content: "_";
    margin-left: 0.16rem;
    color: #22d3ee;
    animation: vaultTerminalCursor 0.9s steps(2, end) infinite;
  }

  .vault-shell {
    --vault-space: clamp(0.86rem, 1.05vw, 1.05rem);
    --vault-space-tight: clamp(0.58rem, 0.75vw, 0.74rem);
    --vault-space-mini: clamp(0.32rem, 0.45vw, 0.44rem);
  }

  .vault-topbar {
    gap: var(--vault-space);
    padding: var(--vault-space);
  }

  .vault-main {
    gap: var(--vault-space);
    padding: var(--vault-space);
  }

  .vault-panel__top {
    min-height: 2.7rem;
    gap: var(--vault-space-tight);
    padding: var(--vault-space-tight);
  }

  .vault-center-stack {
    gap: var(--vault-space);
  }

  .vault-map {
    padding: var(--vault-space);
  }

  .vault-origin__privacy {
    gap: var(--vault-space-mini);
    margin: var(--vault-space);
    padding: var(--vault-space-tight);
  }

  .vault-gate {
    padding-bottom: 0;
  }

  .vault-access-console {
    position: relative;
    gap: var(--vault-space-tight);
    padding: var(--vault-space);
  }

  .vault-access-console::after {
    content: "";
    display: block;
    width: calc(100% - (var(--vault-space-tight) * 2));
    height: 1px;
    justify-self: center;
    margin-top: var(--vault-space-mini);
    background: linear-gradient(
      90deg,
      transparent,
      rgba(34, 211, 238, 0.42) 16%,
      rgba(34, 211, 238, 0.2) 84%,
      transparent
    );
    box-shadow: 0 0 12px rgba(34, 211, 238, 0.14);
  }

  .vault-field-head,
  .vault-action-row {
    gap: var(--vault-space-tight);
  }

  .vault-input-wrap input {
    padding: var(--vault-space-tight);
  }

  .vault-scanner {
    gap: var(--vault-space-mini);
  }

  .vault-action-row .vault-verify,
  .vault-action-row .vault-clue {
    padding: var(--vault-space-tight);
  }

  .vault-gate .vault-security {
    flex: 1 1 auto;
    min-height: 0;
    margin: 0 var(--vault-space) var(--vault-space);
    grid-template-rows: auto minmax(0, 1fr);
    border-top-color: rgba(34, 211, 238, 0.44);
    box-shadow:
      0 -1px 0 rgba(34, 211, 238, 0.18),
      inset 0 1px 0 rgba(245, 236, 225, 0.04);
  }

  .vault-gate .vault-security::before {
    content: "";
    position: absolute;
    top: 0;
    left: var(--vault-space-tight);
    right: var(--vault-space-tight);
    z-index: 5;
    height: 1px;
    pointer-events: none;
    background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.5), rgba(251, 191, 36, 0.34), transparent);
    box-shadow: 0 0 16px rgba(34, 211, 238, 0.18);
  }

  .vault-security-body {
    display: grid;
    min-height: 0;
    place-items: center;
    padding: var(--vault-space);
  }

  .vault-security-face {
    align-self: center;
    justify-self: center;
    max-height: 100%;
    padding: var(--vault-space);
  }

  .vault-security-face__image {
    width: 90%;
    height: 90%;
    margin: auto;
  }

  .vault-gate .vault-message,
  .vault-clearance {
    margin: var(--vault-space);
    padding: var(--vault-space);
  }

  .vault-message {
    gap: var(--vault-space-tight);
    padding: var(--vault-space);
  }

  .vault-message > div:first-child,
  .vault-message__encoded,
  .vault-message__decoded,
  .vault-face-scan__terminal,
  .vault-face-scan__readout {
    gap: var(--vault-space-tight);
  }

  .vault-message__language,
  .vault-message__translator,
  .vault-security-popover div {
    gap: var(--vault-space-mini);
  }

  .vault-message__payload,
  .vault-security-popover,
  .vault-clue-modal > div {
    padding: var(--vault-space-tight);
  }

  .vault-metrics {
    gap: var(--vault-space-mini);
    padding: var(--vault-space-mini);
  }

  .vault-footer {
    gap: var(--vault-space);
    padding: var(--vault-space-tight);
  }

  .vault-metrics {
    position: relative;
    isolation: isolate;
    grid-template-columns: minmax(10rem, 1.16fr) repeat(5, minmax(7.4rem, 1fr));
    align-items: center;
    align-content: center;
    overflow: hidden;
    border-top: 1px solid rgba(34, 211, 238, 0.2);
    border-bottom: 1px solid rgba(163, 230, 53, 0.1);
    background:
      radial-gradient(circle at 8% 45%, rgba(34, 211, 238, 0.16), transparent 30%),
      linear-gradient(90deg, rgba(2, 6, 16, 0.92), rgba(8, 13, 29, 0.86), rgba(2, 6, 16, 0.92)),
      repeating-linear-gradient(90deg, rgba(34, 211, 238, 0.055) 0 1px, transparent 1px 18px);
    box-shadow:
      inset 0 1px 0 rgba(245, 236, 225, 0.05),
      inset 0 -18px 34px rgba(34, 211, 238, 0.045);
  }

  .vault-metrics::before,
  .vault-metrics::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
  }

  .vault-metrics::before {
    background:
      linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.18), rgba(163, 230, 53, 0.08), transparent),
      linear-gradient(180deg, transparent 0 48%, rgba(34, 211, 238, 0.07) 49%, transparent 51% 100%);
    background-size: 100% 100%, 100% 0.52rem;
    transform: translateX(-105%);
    animation: vaultMetricSweep 3.6s ease-in-out infinite;
  }

  .vault-metrics::after {
    opacity: 0.48;
    background:
      radial-gradient(circle at 24% 50%, rgba(163, 230, 53, 0.12), transparent 24%),
      radial-gradient(circle at 82% 48%, rgba(163, 230, 53, 0.11), transparent 28%);
  }

  .vault-metrics span,
  .vault-metric--bio {
    position: relative;
    display: grid;
    min-width: 0;
    min-height: 1.54rem;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    justify-content: stretch;
    gap: 0.46rem;
    overflow: hidden;
    border: 1px solid rgba(34, 211, 238, 0.17);
    border-radius: 0.72rem;
    padding: var(--vault-space-mini);
    color: rgba(245, 236, 225, 0.68);
    background:
      linear-gradient(180deg, rgba(15, 23, 42, 0.7), rgba(3, 7, 18, 0.58)),
      repeating-linear-gradient(90deg, rgba(34, 211, 238, 0.055) 0 1px, transparent 1px 10px);
    box-shadow:
      inset 0 1px 0 rgba(245, 236, 225, 0.055),
      0 0 18px rgba(34, 211, 238, 0.045);
  }

  .vault-metrics span::before {
    content: "";
    position: absolute;
    left: 0.44rem;
    top: 50%;
    width: 0.28rem;
    height: 0.28rem;
    border-radius: 999px;
    background: #22d3ee;
    box-shadow: 0 0 12px rgba(34, 211, 238, 0.48);
    transform: translateY(-50%);
  }

  .vault-metrics span::after {
    content: "";
    position: absolute;
    inset: auto 0 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, currentColor, transparent);
    opacity: 0.28;
  }

  .vault-metrics b {
    min-width: 0;
    padding-left: 0.66rem;
    overflow: hidden;
    color: rgba(245, 236, 225, 0.6);
    font-size: 0.49rem;
    font-weight: 950;
    letter-spacing: 0.12em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .vault-metrics em {
    color: #22d3ee;
    font-size: 0.52rem;
    font-style: normal;
    font-weight: 950;
    letter-spacing: 0.08em;
    text-shadow: 0 0 12px rgba(34, 211, 238, 0.28);
  }

  .vault-metric--bio {
    border-color: rgba(34, 211, 238, 0.32);
    background:
      linear-gradient(90deg, rgba(34, 211, 238, 0.15), rgba(3, 7, 18, 0.72)),
      repeating-linear-gradient(90deg, rgba(34, 211, 238, 0.1) 0 1px, transparent 1px 8px);
  }

  .vault-metric--secure {
    border-color: rgba(163, 230, 53, 0.24);
  }

  .vault-metric--secure::before {
    background: #a3e635;
    box-shadow: 0 0 13px rgba(163, 230, 53, 0.5);
  }

  .vault-metric--secure em {
    color: #a3e635;
    text-shadow: 0 0 13px rgba(163, 230, 53, 0.28);
  }

  .vault-metric--sealed {
    border-color: rgba(251, 191, 36, 0.26);
  }

  .vault-metric--sealed::before {
    background: #fbbf24;
    box-shadow: 0 0 13px rgba(251, 191, 36, 0.48);
  }

  .vault-metric--sealed em {
    color: #fbbf24;
    text-shadow: 0 0 13px rgba(251, 191, 36, 0.28);
  }

  .vault-metrics small {
    grid-column: 1 / -1;
    position: relative;
    display: inline-flex;
    justify-self: end;
    align-items: center;
    gap: 0.3rem;
    margin-top: -0.2rem;
    color: rgba(245, 236, 225, 0.46);
    font-size: 0.42rem;
    font-weight: 900;
    letter-spacing: 0.16em;
    text-align: right;
  }

  .vault-metrics small::before {
    content: "";
    width: 0.3rem;
    height: 0.3rem;
    border-radius: 999px;
    background: #a3e635;
    box-shadow: 0 0 14px rgba(163, 230, 53, 0.44);
  }

  /* Compact, truthful OS session telemetry. */
  .vault-metrics {
    grid-template-columns: repeat(4, minmax(7rem, 1fr)) minmax(8.4rem, 0.82fr);
    gap: 0.3rem;
    padding: 0.32rem 0.42rem;
    border-bottom-color: rgba(34, 211, 238, 0.12);
    background:
      linear-gradient(90deg, rgba(2, 6, 16, 0.94), rgba(7, 14, 27, 0.88), rgba(2, 6, 16, 0.94)),
      repeating-linear-gradient(90deg, rgba(34, 211, 238, 0.04) 0 1px, transparent 1px 18px);
    box-shadow: inset 0 1px 0 rgba(245, 236, 225, 0.04);
  }

  .vault-metrics::before {
    opacity: 0.48;
    animation-duration: 5.4s;
  }

  .vault-metrics::after,
  .vault-metrics span::after {
    display: none;
  }

  .vault-metrics span,
  .vault-metric--bio {
    min-height: 1.82rem;
    gap: 0.38rem;
    border-radius: 0.5rem;
    padding: 0.32rem 0.5rem;
    background: rgba(7, 13, 26, 0.58);
    box-shadow: inset 0 1px 0 rgba(245, 236, 225, 0.04);
  }

  .vault-metrics span::before {
    left: 0.42rem;
    width: 0.26rem;
    height: 0.26rem;
  }

  .vault-metrics b {
    padding-left: 0.52rem;
    font-size: 0.52rem;
    letter-spacing: 0.1em;
  }

  .vault-metrics em {
    font-size: 0.57rem;
    letter-spacing: 0.06em;
  }

  .vault-metric--pending {
    border-color: rgba(251, 191, 36, 0.24) !important;
  }

  .vault-metric--pending::before {
    background: #fbbf24 !important;
    box-shadow: 0 0 10px rgba(251, 191, 36, 0.42) !important;
  }

  .vault-metric--pending em {
    color: #fbbf24;
    text-shadow: 0 0 10px rgba(251, 191, 36, 0.22);
  }

  .vault-metrics small {
    grid-column: auto;
    justify-self: stretch;
    justify-content: center;
    min-height: 1.82rem;
    margin: 0;
    padding: 0.24rem 0.38rem;
    border-left: 1px solid rgba(34, 211, 238, 0.18);
    font-size: 0.44rem;
    letter-spacing: 0.12em;
    text-align: center;
  }

  .vault-topbar__actions {
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  /* The light theme keeps maps and scanners as dark instrument displays. */
  html.light .private-vault {
    color: #17242c;
    background:
      radial-gradient(circle at 12% 0%, rgba(251, 191, 36, 0.16), transparent 30%),
      radial-gradient(circle at 82% 12%, rgba(6, 182, 212, 0.16), transparent 30%),
      linear-gradient(145deg, #edf7f8, #dcebed 56%, #eef6f2);
  }

  html.light .private-vault__grid {
    opacity: 0.24;
    filter: invert(1);
  }

  html.light .private-vault__noise {
    opacity: 0.035;
    mix-blend-mode: multiply;
  }

  html.light .vault-shell {
    color: #17242c;
    border-color: rgba(8, 112, 136, 0.34);
    background: rgba(246, 251, 252, 0.96);
    box-shadow:
      0 26px 80px rgba(32, 73, 82, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }

  html.light .vault-topbar,
  html.light .vault-footer,
  html.light .vault-panel,
  html.light .vault-metrics {
    border-color: rgba(8, 112, 136, 0.2);
  }

  html.light .vault-topbar,
  html.light .vault-footer {
    color: #243841;
    background: rgba(236, 246, 247, 0.82);
  }

  html.light .vault-topbar b,
  html.light .vault-topbar span,
  html.light .vault-footer,
  html.light .vault-field-head label,
  html.light .vault-core-label b,
  html.light .vault-core-label span,
  html.light .vault-core-label em {
    color: #20343d;
  }

  html.light .vault-topbar__actions,
  html.light .vault-topbar__actions span {
    color: rgba(32, 52, 61, 0.7);
  }

  html.light .vault-topbar__actions button,
  html.light .vault-verify,
  html.light .vault-clue,
  html.light .vault-terminate {
    color: #18323b;
    border-color: rgba(8, 112, 136, 0.28);
    background: rgba(255, 255, 255, 0.66);
  }

  html.light .vault-panel {
    background: rgba(255, 255, 255, 0.52);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.86);
  }

  html.light .vault-panel__top {
    color: #2c414a;
    border-color: rgba(8, 112, 136, 0.18);
    background: rgba(224, 239, 241, 0.76);
  }

  html.light .vault-input-wrap {
    border-color: rgba(8, 112, 136, 0.34);
    background: rgba(255, 255, 255, 0.84);
  }

  html.light .vault-input-wrap input,
  html.light .vault-input-wrap button {
    color: #102a33;
  }

  html.light .vault-origin__privacy,
  html.light .vault-clearance,
  html.light .vault-message,
  html.light .vault-module-panel {
    color: #24363f;
    border-color: rgba(8, 112, 136, 0.24);
    background: rgba(250, 253, 253, 0.86);
  }

  html.light .vault-metrics {
    background:
      linear-gradient(90deg, rgba(226, 241, 243, 0.96), rgba(244, 249, 249, 0.96), rgba(226, 241, 243, 0.96)),
      repeating-linear-gradient(90deg, rgba(8, 112, 136, 0.05) 0 1px, transparent 1px 18px);
  }

  html.light .vault-metrics span,
  html.light .vault-metric--bio {
    color: #2a3e47;
    border-color: rgba(8, 112, 136, 0.2);
    background: rgba(255, 255, 255, 0.72);
  }

  html.light .vault-metrics b,
  html.light .vault-metrics small {
    color: rgba(31, 51, 60, 0.7);
  }

  html.light .vault-gate .vault-security,
  html.light .vault-map,
  html.light .vault-message__payload,
  html.light .vault-face-scan__terminal,
  html.light .vault-face-scan__readout {
    color: #f5ece1;
  }

  html.light .vault-boot {
    color: #17323b;
    border-color: rgba(8, 112, 136, 0.3);
    background: rgba(241, 249, 250, 0.96);
    box-shadow: 0 24px 70px rgba(32, 73, 82, 0.18);
  }

  html.light .vault-boot__terminal,
  html.light .vault-boot__progress {
    border-color: rgba(8, 112, 136, 0.24);
    background: rgba(255, 255, 255, 0.72);
  }

  html.light .vault-core {
    border-color: rgba(8, 145, 178, 0.48);
    background:
      radial-gradient(circle at 50% 45%, rgba(8, 145, 178, 0.24), transparent 38%),
      radial-gradient(circle, #102b35 0 43%, #07131f 65%, #030811 100%);
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.74),
      0 18px 42px rgba(22, 78, 91, 0.2),
      inset 0 0 42px rgba(34, 211, 238, 0.1);
  }

  html.light .vault-core__media img {
    filter:
      contrast(1.04)
      drop-shadow(0 0 20px rgba(34, 211, 238, 0.44));
  }

  html.light .vault-origin__privacy {
    border-color: rgba(8, 112, 136, 0.24);
    background:
      linear-gradient(145deg, rgba(255, 255, 255, 0.94), rgba(226, 241, 243, 0.9)),
      repeating-linear-gradient(90deg, rgba(8, 112, 136, 0.04) 0 1px, transparent 1px 13px);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.94),
      0 10px 24px rgba(35, 79, 89, 0.1);
  }

  html.light .vault-origin__privacy::after {
    opacity: 0.12;
  }

  html.light .vault-origin__privacy b,
  html.light .vault-origin__privacy small {
    color: #a16207;
    text-shadow: none;
  }

  html.light .vault-origin__privacy span,
  html.light .vault-origin__privacy em {
    color: #415761;
    text-shadow: none;
  }

  html.light .vault-origin__privacy strong {
    color: #08788f;
    text-shadow: none;
  }

  html.light .vault-gate .vault-security {
    color: #e8f7fa;
    border-color: rgba(8, 145, 178, 0.56);
    background:
      radial-gradient(circle at 50% 42%, rgba(8, 145, 178, 0.16), transparent 44%),
      linear-gradient(180deg, #0a1d29, #050c16 82%);
    box-shadow:
      0 -1px 0 rgba(8, 145, 178, 0.24),
      inset 0 1px 0 rgba(255, 255, 255, 0.06),
      0 12px 30px rgba(35, 79, 89, 0.14);
  }

  html.light .vault-gate .vault-security > .vault-panel__top {
    color: #c6e7ed;
    border-color: rgba(34, 211, 238, 0.2);
    background: rgba(3, 10, 18, 0.78);
  }

  html.light .vault-gate .vault-security > .vault-panel__top span {
    color: rgba(222, 244, 247, 0.7);
  }

  html.light .vault-security-body {
    background: transparent;
  }

  html.light .vault-security-face {
    border-color: rgba(34, 211, 238, 0.38);
    background:
      radial-gradient(circle at 50% 42%, rgba(34, 211, 238, 0.2), transparent 39%),
      radial-gradient(circle at 50% 110%, rgba(34, 197, 94, 0.1), transparent 42%),
      linear-gradient(180deg, #0a2634, #030913 92%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.06),
      0 14px 30px rgba(0, 36, 49, 0.26);
  }

  .vault-brand-logo--on-light {
    display: none !important;
  }

  html.light .vault-brand-logo--on-dark {
    display: none !important;
  }

  html.light .vault-brand-logo--on-light {
    display: block !important;
  }

  /* Complete light OS surfaces: no dark terminal panels remain. */
  html.light .vault-core {
    color: #172f38;
    border-color: rgba(8, 120, 143, 0.34);
    background:
      radial-gradient(circle at 50% 45%, rgba(34, 211, 238, 0.18), transparent 38%),
      radial-gradient(circle, #ffffff 0 42%, #e9f6f7 66%, #d5ecef 100%);
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.9),
      0 18px 42px rgba(22, 78, 91, 0.14),
      inset 0 0 42px rgba(8, 145, 178, 0.08);
  }

  html.light .vault-core__portrait-frame {
    border-color: rgba(8, 120, 143, 0.24);
    background:
      radial-gradient(circle at 50% 18%, rgba(251, 191, 36, 0.16), transparent 34%),
      rgba(255, 255, 255, 0.72);
  }

  html.light .vault-core__ring {
    border-color: rgba(8, 120, 143, 0.42);
  }

  html.light .vault-core__ring--two {
    border-color: rgba(63, 125, 21, 0.42);
  }

  html.light .vault-map {
    background: #ffffff;
  }

  html.light .vault-sri-lanka-map {
    opacity: 0;
  }

  .vault-map__light-trace {
    display: none;
  }

  html.light .vault-map__light-trace {
    position: absolute;
    inset: 0.75rem;
    z-index: 3;
    display: block;
    width: min(calc(100% - 1.5rem), 17.15rem);
    max-height: calc(100% - 1.5rem);
    aspect-ratio: 2 / 3;
    margin: auto;
    background:
      linear-gradient(150deg, #075985 8%, #0369a1 38%, #1d4ed8 66%, #0e7490 94%);
    filter:
      contrast(1.38)
      drop-shadow(0 0 12px rgba(3, 105, 161, 0.28));
    opacity: 0.98;
    -webkit-mask-image:
      url("/maps/sri-lanka-digital-map.png"),
      url("/maps/sri-lanka-digital-map.png");
    -webkit-mask-position: center, center;
    -webkit-mask-repeat: no-repeat, no-repeat;
    -webkit-mask-size: contain, contain;
    -webkit-mask-composite: source-over;
    mask-image:
      url("/maps/sri-lanka-digital-map.png"),
      url("/maps/sri-lanka-digital-map.png");
    mask-mode: luminance, luminance;
    mask-position: center, center;
    mask-repeat: no-repeat, no-repeat;
    mask-size: contain, contain;
    mask-composite: add;
    animation: vaultMapFloat 5.4s ease-in-out infinite;
  }

  html.light .vault-map__scan {
    opacity: 0.42;
    mix-blend-mode: multiply;
  }

  html.light .vault-gate .vault-security {
    color: #203943;
    border-color: rgba(8, 120, 143, 0.3);
    background:
      radial-gradient(circle at 50% 42%, rgba(34, 211, 238, 0.16), transparent 46%),
      linear-gradient(180deg, #f5fbfc, #e5f3f5 84%);
    box-shadow:
      0 -1px 0 rgba(8, 120, 143, 0.16),
      inset 0 1px 0 rgba(255, 255, 255, 0.94),
      0 12px 28px rgba(35, 79, 89, 0.09);
  }

  html.light .vault-gate .vault-security > .vault-panel__top {
    color: #2b4650;
    border-color: rgba(8, 120, 143, 0.17);
    background: rgba(224, 241, 243, 0.9);
  }

  html.light .vault-gate .vault-security > .vault-panel__top span {
    color: #415b65;
  }

  html.light .vault-security-face {
    border-color: rgba(8, 120, 143, 0.3);
    background:
      radial-gradient(circle at 50% 42%, rgba(34, 211, 238, 0.2), transparent 42%),
      linear-gradient(180deg, #ffffff, #dff1f3 94%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.96),
      0 14px 28px rgba(22, 78, 91, 0.12);
  }

  html.light .vault-security-face__image,
  html.light .vault-face-scan__face {
    filter:
      invert(1)
      hue-rotate(180deg)
      saturate(0.92)
      contrast(1.08)
      brightness(1.02)
      drop-shadow(0 0 18px rgba(8, 120, 143, 0.18));
  }

  html.light .vault-security-face span {
    color: #4d7c0f;
    text-shadow: none;
  }

  html.light .vault-message,
  html.light .vault-clearance,
  html.light .vault-clue-modal > div {
    color: #20343d;
    border-color: rgba(8, 120, 143, 0.24);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(229, 243, 245, 0.94)),
      repeating-linear-gradient(90deg, rgba(8, 120, 143, 0.04) 0 1px, transparent 1px 13px);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.95),
      0 16px 36px rgba(35, 79, 89, 0.12);
  }

  html.light .vault-message::after,
  html.light .vault-clearance::after,
  html.light .vault-clue-modal > div::after {
    opacity: 0.12;
  }

  html.light .vault-message__language button,
  html.light .vault-message__translator button {
    color: #415761;
    border-color: rgba(8, 120, 143, 0.24);
    background: rgba(255, 255, 255, 0.78);
  }

  html.light .vault-message__language button:hover,
  html.light .vault-message__language button:focus-visible,
  html.light .vault-message__translator button:hover,
  html.light .vault-message__translator button:focus-visible {
    color: #08788f;
    border-color: rgba(8, 120, 143, 0.48);
    background: rgba(224, 243, 246, 0.92);
  }

  html.light .vault-message__language button.is-active,
  html.light .vault-message__translator button.is-active {
    color: #8a5708;
    border-color: rgba(161, 98, 7, 0.42);
    background: rgba(251, 191, 36, 0.12);
  }

  html.light .vault-message__payload,
  html.light .vault-face-scan__terminal,
  html.light .vault-face-scan__readout {
    color: #263f49;
    border-color: rgba(8, 120, 143, 0.22);
    background:
      linear-gradient(rgba(8, 120, 143, 0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(8, 120, 143, 0.07) 1px, transparent 1px),
      rgba(248, 252, 252, 0.94);
    background-size: 18px 18px;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.94);
  }

  html.light .vault-message__payload p,
  html.light .vault-message__payload--read p,
  html.light .vault-face-scan__readout p,
  html.light .vault-clearance p {
    color: #415761;
    text-shadow: none;
  }

  html.light .vault-message__payload--hex p,
  html.light .vault-message__payload--bin p,
  html.light .vault-message__payload--dec p {
    color: #08788f;
    text-shadow: none;
  }

  html.light .vault-message__payload--reg p {
    color: #3f7d15;
  }

  html.light .vault-clearance b {
    color: #08788f;
  }

  html.light .vault-clue-modal,
  html.light .vault-confirm,
  html.light .vault-face-scan,
  html.light .vault-module-panel {
    background: rgba(218, 236, 239, 0.72);
    backdrop-filter: blur(12px);
  }

  html.light .vault-clue-modal p,
  html.light .vault-confirm span,
  html.light .vault-confirm p,
  html.light .vault-module-panel p {
    color: #415761;
  }

  html.light .vault-clue-modal button,
  html.light .vault-confirm button,
  html.light .vault-module-panel__close,
  html.light .vault-module-panel__link {
    color: #203943;
    border-color: rgba(8, 120, 143, 0.28);
    background: rgba(255, 255, 255, 0.82);
  }

  html.light .vault-module-panel > div,
  html.light .vault-confirm > div,
  html.light .vault-face-scan > div {
    color: #20343d;
    border-color: rgba(8, 120, 143, 0.3);
    background:
      radial-gradient(circle at 50% 18%, rgba(34, 211, 238, 0.13), transparent 34%),
      linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(226, 242, 244, 0.96));
    box-shadow:
      0 24px 64px rgba(35, 79, 89, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.96);
  }

  html.light .vault-confirm b,
  html.light .vault-module-panel h2 {
    color: #20343d;
  }

  html.light .vault-face-scan > div > button {
    color: #203943;
    border-color: rgba(8, 120, 143, 0.26);
    background: rgba(255, 255, 255, 0.82);
  }

  html.light .vault-face-scan__stage {
    background:
      radial-gradient(circle, rgba(34, 211, 238, 0.18), transparent 58%),
      rgba(232, 246, 248, 0.9);
  }

  html.light .vault-face-scan__verify {
    color: #415761;
  }

  html.light .vault-face-scan__verify--complete {
    color: #3f7d15;
    text-shadow: none;
  }

  html.light .vault-security-popover {
    color: #20343d;
    border-color: rgba(161, 98, 7, 0.3);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(231, 244, 246, 0.96)),
      repeating-linear-gradient(90deg, rgba(8, 120, 143, 0.04) 0 1px, transparent 1px 12px);
    box-shadow: 0 14px 34px rgba(35, 79, 89, 0.16);
  }

  html.light .vault-security-popover p {
    color: #415761;
  }

  html.light .vault-security-popover button {
    color: #29444e;
    border-color: rgba(8, 120, 143, 0.26);
    background: rgba(255, 255, 255, 0.82);
  }

  html.light .vault-unlocked-nav {
    border-color: rgba(8, 120, 143, 0.18);
    background: rgba(228, 242, 244, 0.9);
  }

  html.light .vault-unlocked-nav button,
  html.light .vault-modules button {
    color: #29444e;
    border-color: rgba(8, 120, 143, 0.24);
    background: rgba(255, 255, 255, 0.74);
  }

  html.light .vault-entry__core {
    border-color: rgba(8, 120, 143, 0.46);
    background: rgba(255, 255, 255, 0.72);
    box-shadow: 0 0 42px rgba(8, 120, 143, 0.2);
  }

  html.light .vault-entry__core img,
  html.light .vault-boot__core img {
    filter: drop-shadow(0 0 16px rgba(8, 120, 143, 0.26));
  }

  html.light .vault-entry__tunnel {
    background:
      repeating-conic-gradient(from 0deg, rgba(8, 120, 143, 0.28) 0 4deg, transparent 4deg 12deg),
      radial-gradient(circle, transparent 36%, rgba(63, 125, 21, 0.09), transparent 66%);
  }

  html.light .vault-boot {
    color: #20343d;
    border-color: rgba(8, 120, 143, 0.3);
    background:
      radial-gradient(circle at 20% 50%, rgba(34, 211, 238, 0.16), transparent 36%),
      linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(225, 241, 243, 0.96));
  }

  html.light .vault-boot__core {
    border-color: rgba(8, 120, 143, 0.28);
    background:
      repeating-conic-gradient(from 0deg, rgba(8, 120, 143, 0.16) 0 5deg, transparent 5deg 18deg),
      radial-gradient(circle, rgba(63, 125, 21, 0.1), transparent 66%);
  }

  html.light .vault-boot__core span {
    border-color: rgba(8, 120, 143, 0.28);
  }

  html.light .vault-boot__terminal {
    color: #29444e;
    background: rgba(255, 255, 255, 0.7);
  }

  html.light .vault-boot__progress {
    border-color: rgba(8, 120, 143, 0.3);
    background: rgba(8, 120, 143, 0.08);
  }

  html.light .vault-panel__top b,
  html.light .vault-face-scan__top span,
  html.light .vault-clue-modal b,
  html.light .vault-module-panel span {
    color: #08788f;
    text-shadow: none;
  }

  html.light .vault-gate > div > .vault-panel__top b,
  html.light .vault-gate .vault-security .vault-panel__top b,
  html.light .vault-face-scan__top b,
  html.light .vault-face-scan__readout em,
  html.light .vault-clue-modal span,
  html.light .vault-security-popover b {
    color: #a16207;
    text-shadow: none;
  }

  html.light .vault-gate .vault-security--biometric-verified .vault-panel__top b,
  html.light .vault-face-scan__top b.is-complete,
  html.light .vault-security-notifier--success .vault-security-popover b,
  html.light .vault-security-notifier--success .vault-security-popover button {
    color: #3f7d15;
    text-shadow: none;
  }

  html.light .vault-metrics em {
    color: #08788f;
    text-shadow: none;
  }

  html.light .vault-metric--secure em {
    color: #3f7d15;
  }

  html.light .vault-metric--pending em,
  html.light .vault-metric--sealed em {
    color: #a16207;
    text-shadow: none;
  }

  .vault-core-wrap {
    position: relative;
  }

  .vault-core-presence {
    position: absolute;
    top: clamp(0.8rem, 1.4vw, 1.2rem);
    right: clamp(0.8rem, 1.4vw, 1.2rem);
    z-index: 12;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    border: 1px solid currentColor;
    border-radius: 999px;
    padding: 0.34rem 0.58rem;
    background: rgba(3, 7, 18, 0.82);
    box-shadow: 0 0 18px rgba(163, 230, 53, 0.2);
    font: 950 0.52rem ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: 0.14em;
    line-height: 1;
  }

  .vault-core-presence i {
    width: 0.38rem;
    height: 0.38rem;
    border-radius: 999px;
    background: currentColor;
    box-shadow: 0 0 10px currentColor;
    animation: vaultSignalPulse 1.6s ease-in-out infinite;
  }

  @keyframes vaultSignalPulse {
    0%, 100% { opacity: 0.5; transform: scale(0.82); }
    50% { opacity: 1; transform: scale(1.16); }
  }

  .vault-granted {
    display: grid;
    height: 100%;
    min-height: 0;
    grid-template-rows: auto auto minmax(0, 1fr) auto;
    align-content: start;
    gap: 0.82rem;
    padding-bottom: 0.95rem;
  }

  .vault-granted > .vault-clearance,
  .vault-granted > .vault-message,
  .vault-granted > .vault-return-home {
    margin-inline: 0.95rem;
  }

  .vault-granted > .vault-clearance {
    margin-top: 0.12rem;
    border-color: rgba(163, 230, 53, 0.48);
    background:
      linear-gradient(135deg, rgba(163, 230, 53, 0.13), rgba(34, 197, 94, 0.055)),
      rgba(5, 20, 18, 0.82);
    box-shadow:
      inset 0 1px 0 rgba(163, 230, 53, 0.1),
      0 0 24px rgba(163, 230, 53, 0.1);
  }

  .vault-granted > .vault-panel__top {
    border-bottom-color: rgba(163, 230, 53, 0.28);
    background: rgba(163, 230, 53, 0.065);
  }

  .vault-granted > .vault-panel__top span,
  .vault-granted > .vault-panel__top b,
  .vault-granted > .vault-clearance b {
    color: #a3e635;
    text-shadow: 0 0 14px rgba(163, 230, 53, 0.24);
  }

  .vault-granted > .vault-clearance p {
    color: rgba(226, 252, 211, 0.84);
  }

  .vault-granted > .vault-message {
    min-height: 0;
    margin-block: 0;
    overflow: hidden;
  }

  .vault-granted .vault-message > div:first-child {
    display: flex;
    min-height: 0;
    flex-direction: column;
  }

  .vault-granted .vault-message__payload {
    min-height: 0;
    flex: 1 1 auto;
  }

  .vault-granted .vault-message__payload--bin,
  .vault-granted .vault-message__payload--dec {
    max-height: 100%;
    gap: 0.24rem;
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #22d3ee rgba(34, 211, 238, 0.08);
  }

  .vault-granted .vault-message__payload--bin p,
  .vault-granted .vault-message__payload--dec p {
    overflow-wrap: anywhere;
    white-space: normal;
  }

  .vault-granted .vault-message__payload p {
    font-size: calc(0.58rem + 1px);
  }

  .vault-granted .vault-message__payload--read p {
    font-size: calc(0.66rem + 1px);
  }

  .vault-granted .vault-message__payload--bin::-webkit-scrollbar,
  .vault-granted .vault-message__payload--dec::-webkit-scrollbar {
    width: 6px;
  }

  .vault-granted .vault-message__payload--bin::-webkit-scrollbar-track,
  .vault-granted .vault-message__payload--dec::-webkit-scrollbar-track {
    background: rgba(34, 211, 238, 0.06);
  }

  .vault-granted .vault-message__payload--bin::-webkit-scrollbar-thumb,
  .vault-granted .vault-message__payload--dec::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: rgba(34, 211, 238, 0.72);
  }

  .vault-return-home {
    display: inline-flex;
    min-height: 2.55rem;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border: 1px solid rgba(34, 211, 238, 0.34);
    border-radius: 0.86rem;
    color: #dff9fd;
    background:
      linear-gradient(90deg, rgba(34, 211, 238, 0.08), rgba(34, 197, 94, 0.08)),
      rgba(9, 15, 27, 0.86);
    font: 900 0.6rem ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: 0.11em;
    cursor: pointer;
    transition: border-color 160ms ease, color 160ms ease, background 160ms ease;
  }

  .vault-return-home:hover,
  .vault-return-home:focus-visible {
    border-color: rgba(163, 230, 53, 0.58);
    color: #a3e635;
    background: rgba(12, 28, 28, 0.92);
  }

  html.light .vault-map {
    isolation: isolate;
    background: #ffffff;
    box-shadow:
      inset 0 0 0 1px rgba(8, 120, 143, 0.12),
      inset 0 0 28px rgba(34, 211, 238, 0.055);
  }

  html.light .vault-map::before {
    border-color: rgba(8, 120, 143, 0.18);
    background:
      linear-gradient(90deg, rgba(8, 120, 143, 0.055) 1px, transparent 1px),
      linear-gradient(rgba(8, 120, 143, 0.045) 1px, transparent 1px);
    background-size: 24px 24px;
    box-shadow: none;
    opacity: 0.32;
  }

  html.light .vault-map::after {
    mix-blend-mode: multiply;
    opacity: 0.34;
  }

  html.light .vault-map__ocean {
    background: transparent;
  }

  html.light .vault-core-presence {
    background: rgba(248, 252, 252, 0.9);
  }

  html.light .vault-granted > .vault-panel__top {
    border-bottom-color: rgba(63, 125, 21, 0.3);
    background: rgba(163, 230, 53, 0.11);
  }

  html.light .vault-granted > .vault-panel__top span,
  html.light .vault-granted > .vault-panel__top b,
  html.light .vault-granted > .vault-clearance b {
    color: #3f7d15;
    text-shadow: none;
  }

  html.light .vault-granted > .vault-clearance {
    color: #29461d;
    border-color: rgba(63, 125, 21, 0.36);
    background:
      linear-gradient(135deg, rgba(236, 252, 224, 0.98), rgba(244, 251, 240, 0.96));
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.96),
      0 12px 28px rgba(63, 125, 21, 0.1);
  }

  html.light .vault-granted > .vault-clearance p {
    color: #456238;
  }

  html.light .vault-return-home {
    color: #173640;
    border-color: rgba(8, 120, 143, 0.3);
    background: rgba(255, 255, 255, 0.82);
  }

  html.light .vault-return-home:hover,
  html.light .vault-return-home:focus-visible {
    color: #3f7d15;
    border-color: rgba(63, 125, 21, 0.42);
    background: rgba(241, 249, 239, 0.94);
  }

  .vault-entry {
    background:
      radial-gradient(circle at 50% 46%, rgba(34, 211, 238, 0.14), transparent 30%),
      radial-gradient(circle at 34% 62%, rgba(163, 230, 53, 0.08), transparent 26%),
      radial-gradient(circle at 66% 30%, rgba(251, 191, 36, 0.08), transparent 24%),
      #060817;
  }

  .vault-entry__core {
    background:
      radial-gradient(circle, rgba(34, 211, 238, 0.14), rgba(6, 8, 23, 0.94) 66%);
  }

  .vault-boot {
    color: #f5ece1;
    border-color: rgba(34, 211, 238, 0.34);
    background:
      radial-gradient(circle at 14% 18%, rgba(163, 230, 53, 0.14), transparent 26%),
      radial-gradient(circle at 86% 14%, rgba(251, 191, 36, 0.12), transparent 28%),
      linear-gradient(135deg, rgba(13, 16, 38, 0.97), rgba(6, 8, 23, 0.98));
  }

  .vault-boot__progress span {
    background: linear-gradient(90deg, #22d3ee, #a3e635 52%, #fbbf24);
  }

  html.light .vault-entry {
    background:
      radial-gradient(circle at 50% 46%, rgba(34, 211, 238, 0.18), transparent 30%),
      radial-gradient(circle at 34% 62%, rgba(163, 230, 53, 0.09), transparent 26%),
      radial-gradient(circle at 66% 30%, rgba(251, 191, 36, 0.11), transparent 24%),
      #edf7f8;
  }

  html.light .vault-entry__core {
    border-color: rgba(8, 120, 143, 0.46);
    background:
      radial-gradient(circle, rgba(34, 211, 238, 0.14), rgba(255, 255, 255, 0.94) 68%);
    box-shadow:
      0 0 42px rgba(8, 120, 143, 0.2),
      0 0 84px rgba(163, 230, 53, 0.09);
  }

  html.light .vault-entry__tunnel {
    background:
      repeating-conic-gradient(from 0deg, rgba(8, 120, 143, 0.28) 0 3deg, transparent 3deg 9deg),
      repeating-radial-gradient(circle, transparent 0 2.2rem, rgba(163, 230, 53, 0.1) 2.25rem 2.35rem, transparent 2.4rem 3.4rem),
      radial-gradient(circle, transparent 34%, rgba(251, 191, 36, 0.1), transparent 68%);
  }

  html.light .vault-boot {
    color: #20343d;
    border-color: rgba(8, 120, 143, 0.3);
    background:
      radial-gradient(circle at 14% 18%, rgba(163, 230, 53, 0.08), transparent 26%),
      radial-gradient(circle at 86% 14%, rgba(251, 191, 36, 0.1), transparent 28%),
      linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(225, 241, 243, 0.97));
    box-shadow:
      0 24px 70px rgba(32, 73, 82, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.96);
  }

  html.light .vault-boot__terminal {
    color: #29444e;
    background: transparent;
  }

  html.light .vault-boot__matrix i {
    background: rgba(8, 120, 143, 0.14);
  }

  @media (min-width: 1440px) {
    .vault-core-wrap {
      padding-top: clamp(1.05rem, 1.5vh, 1.55rem);
    }

    .vault-core {
      padding: clamp(0.95rem, 0.95vw, 1.25rem);
    }

    .vault-core__media {
      width: clamp(11.6rem, 62%, 16.8rem);
    }

    .vault-core__portrait-frame {
      padding: clamp(0.48rem, 0.7vw, 0.72rem);
    }

    .vault-core__portrait-image {
      width: 100%;
      height: 100%;
    }
  }

  @media (max-height: 950px) and (min-width: 901px) {
    .vault-gate .vault-security {
      min-height: 15.7rem;
      margin-top: 0.78rem;
      margin-bottom: 0.72rem;
    }

    .vault-security-body {
      padding: 0.62rem 0.85rem;
    }

    .vault-security-face {
      width: min(100%, 12.7rem);
      height: 11.6rem;
      min-height: 0;
      padding: 0.58rem;
    }

    .vault-security-face__image {
      width: 81%;
      height: 81%;
    }
  }

  @media (max-height: 768px) and (min-width: 901px) {
    .vault-shell {
      --vault-space: 0.82rem;
      --vault-space-tight: 0.62rem;
      --vault-space-mini: 0.34rem;
    }
    .vault-main {
      gap: var(--vault-space);
      padding: var(--vault-space);
    }
    .vault-core {
      width: min(30vw, 38vh, 20.5rem);
      min-width: 14.5rem;
    }
    .vault-core-label span {
      font-size: 0.72rem;
    }
    .vault-core-label b,
    .vault-core-label em {
      font-size: 0.58rem;
    }
    .vault-map { padding: var(--vault-space); }
    .vault-sri-lanka-map {
      width: min(100%, 16rem);
      height: min(100%, 22rem);
    }
    .vault-origin__privacy {
      margin: var(--vault-space);
      padding: var(--vault-space-tight);
    }
    .vault-message {
      min-height: 8rem;
      padding: var(--vault-space);
    }
    .vault-message__payload {
      min-height: 3.85rem;
      max-height: 4.85rem;
    }
    .vault-center-stack > .vault-security {
      min-height: 7.45rem;
    }
    .vault-center-stack > .vault-security .vault-security-assets {
      gap: var(--vault-space-tight);
      padding: var(--vault-space-tight);
    }
    .vault-gate .vault-message {
      margin: var(--vault-space);
      padding: var(--vault-space);
      min-height: 11.8rem;
    }
    .vault-gate .vault-message__payload {
      min-height: 0;
      max-height: none;
    }
    .vault-gate .vault-message__payload p {
      font-size: 0.46rem;
      line-height: 1.43;
    }
    .vault-gate .vault-message__payload--read p {
      font-size: 0.58rem;
    }
    .vault-gate .vault-security {
      min-height: 14.6rem;
      margin: 0 var(--vault-space) var(--vault-space);
    }
    .vault-security-body {
      padding: var(--vault-space);
    }
    .vault-security-face {
      width: min(100%, 11.7rem);
      min-height: 0;
      height: 10.8rem;
      margin-top: 0;
    }
    .vault-security-face span {
      font-size: 0.4rem;
    }
    .vault-security-notifier {
      top: 0.48rem;
      right: 5.1rem;
    }
    .vault-security-popover {
      width: min(16.5rem, calc(100vw - 3.5rem));
      padding: var(--vault-space-tight);
    }
    .vault-security-popover p {
      font-size: 0.43rem;
      line-height: 1.45;
    }
    .vault-gate .vault-security-assets {
      gap: var(--vault-space-mini);
      padding: var(--vault-space-tight);
    }
    .vault-metrics {
      gap: var(--vault-space-mini);
      padding: var(--vault-space-mini);
    }
    .vault-footer {
      padding: var(--vault-space-tight);
    }
    .vault-security-assets {
      gap: var(--vault-space-mini);
      padding: var(--vault-space-tight);
    }
    .vault-security-asset__image {
      max-width: 4.3rem;
      height: 4.3rem;
    }
  }

  @media (max-width: 900px) {
    .vault-shell {
      --vault-space: 0.88rem;
      --vault-space-tight: 0.66rem;
      --vault-space-mini: 0.38rem;
    }
    .vault-boot {
      grid-template-columns: minmax(0, 1fr);
    }
    .vault-boot__core {
      width: min(42vw, 9rem);
      justify-self: center;
    }
    .vault-message {
      grid-template-columns: minmax(0, 1fr);
    }
    .vault-message__codes {
      border-left: 0;
      border-top: 1px solid rgba(34, 211, 238, 0.12);
      padding: var(--vault-space-tight);
    }
    .vault-center-stack {
      min-height: 24rem;
    }
    .vault-gate .vault-security {
      margin: 0 var(--vault-space) var(--vault-space);
      min-height: 17.2rem;
    }
    .vault-metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .vault-metrics small {
      grid-column: 1 / -1;
    }
  }

  @media (min-width: 768px) and (max-width: 900px) {
    .vault-overlay {
      align-items: flex-start;
      padding: 0.5rem;
      overflow: hidden;
    }

    .vault-shell {
      width: calc(100vw - 1rem);
      height: calc(100dvh - 1rem);
      min-height: 43rem;
      grid-template-rows: auto minmax(0, 1fr) auto auto;
      border-radius: 0.85rem;
    }

    .vault-topbar {
      padding: 0.72rem 0.82rem;
    }

    .vault-topbar__actions {
      gap: 0.42rem;
    }

    .vault-main {
      grid-template-areas:
        "radar gate"
        "core core";
      grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-template-rows: auto auto;
      align-items: stretch;
      gap: 0.8rem;
      padding: 0.8rem;
      overflow-x: hidden;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(34, 211, 238, 0.7) rgba(34, 211, 238, 0.08);
    }

    .vault-origin {
      grid-area: radar;
      min-height: 38rem;
    }

    .vault-center-stack {
      grid-area: core;
      min-height: 29rem;
      overflow: visible;
    }

    .vault-gate {
      grid-area: gate;
      min-height: 38rem;
    }

    .vault-sri-lanka-map {
      width: min(100%, 15.5rem);
      height: min(21rem, 46vh);
    }

    .vault-core {
      width: min(48vw, 19rem);
      min-width: 15rem;
    }

    .vault-gate .vault-security {
      min-height: 18.5rem;
    }

    .vault-security-face {
      width: min(100%, 14.5rem);
      height: 14.5rem;
      min-height: 14.5rem;
    }

    .vault-metrics {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      padding: 0.42rem;
    }

    .vault-metrics small {
      grid-column: 1 / -1;
    }

    .vault-footer {
      padding: 0.62rem 0.8rem;
    }
  }

  @media (max-width: 560px) {
    .vault-message__language {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .vault-sri-lanka-map {
      width: min(100%, 16.8rem);
      height: min(70vh, 24.5rem);
    }
    .vault-origin__privacy {
      margin: var(--vault-space);
      padding: var(--vault-space-tight);
    }
    .vault-metrics {
      grid-template-columns: minmax(0, 1fr);
    }
    .vault-metrics small {
      grid-column: 1 / -1;
    }
    .vault-center-stack {
      min-height: 21rem;
    }
    .vault-gate .vault-security-assets {
      gap: 0.38rem;
      padding: var(--vault-space-tight);
    }
    .vault-security-face {
      width: min(100%, 13.2rem);
      min-height: 12.8rem;
      height: 13.45rem;
      margin-top: 0;
    }
    .vault-security-notifier {
      right: 4.6rem;
    }
    .vault-security-popover div {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (min-width: 901px) {
    .vault-security-body {
      padding: 0.48rem;
    }

    .vault-security-face {
      width: min(100%, 19rem);
      height: min(100%, 19rem);
      min-height: 0;
      padding: 0.48rem;
    }

    .vault-security-face__image {
      width: 94%;
      height: 94%;
    }
  }

  @media (min-width: 901px) and (max-width: 1199px) {
    .vault-shell {
      width: calc(100vw - 1rem);
    }

    .vault-main {
      grid-template-columns:
        minmax(15.25rem, 0.92fr)
        minmax(20rem, 1.22fr)
        minmax(15.25rem, 0.92fr);
      gap: 0.75rem;
      padding: 0.75rem;
    }

    .vault-topbar {
      padding-inline: 0.9rem;
    }

    .vault-origin__privacy {
      margin: 0.7rem;
      padding: 0.68rem;
    }

    .vault-gate .vault-security {
      margin-inline: 0.7rem;
      margin-bottom: 0.7rem;
    }

    .vault-access-console {
      padding-inline: 0.7rem;
    }

    .vault-metrics {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .vault-metrics small {
      grid-column: 1 / -1;
    }
  }

  @media (min-width: 1440px) {
    .vault-shell {
      width: min(calc(100vw - 2rem), 88rem);
    }

    .vault-main {
      grid-template-columns:
        minmax(18rem, 0.95fr)
        minmax(27rem, 1.25fr)
        minmax(18rem, 0.95fr);
      gap: 1.15rem;
      padding: 1.15rem;
    }

    .vault-security-face {
      width: min(100%, 22rem);
      height: min(100%, 22rem);
    }
  }

  /* Keep granted-message legibility stable after compact viewport rules. */
  .vault-granted .vault-message__payload p {
    font-size: calc(0.58rem + 1px);
  }

  .vault-granted .vault-message__payload--read p {
    font-size: calc(0.66rem + 1px);
  }
`;
