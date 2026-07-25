"use client";

import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "framer-motion";
import {
  BookOpenText,
  Dribbble,
  ExternalLink,
  FolderKanban,
  Github,
  Linkedin,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { siteData } from "@/lib/siteData";

type DockItemData = {
  icon: LucideIcon;
  label: string;
  href: string;
  id: string;
  accent: string;
  external?: boolean;
};

const githubHref =
  siteData.socials.find((social) => social.label === "GitHub")?.href ??
  "https://github.com/Isanjalee";

const linkedInHref =
  siteData.socials.find((social) => social.label === "LinkedIn")?.href ??
  "https://www.linkedin.com/in/isanjalee-silva/";

const dribbbleHref =
  siteData.socials.find((social) => social.label === "Dribbble")?.href ??
  "https://dribbble.com/Isanjalee";

const mediumHref = "https://medium.com/@ihnjmsilva152";

const DOCK_ITEMS: DockItemData[] = [
  {
    icon: Github,
    label: "Code & Repos",
    href: githubHref,
    id: "github",
    accent: "#67e8f9",
    external: true,
  },
  {
    icon: Linkedin,
    label: "Experience",
    href: linkedInHref,
    id: "linkedin",
    accent: "#38bdf8",
    external: true,
  },
  {
    icon: BookOpenText,
    label: "Medium Articles",
    href: mediumHref,
    id: "medium",
    accent: "#bef264",
    external: true,
  },
  {
    icon: Dribbble,
    label: "UI / Art",
    href: dribbbleHref,
    id: "dribbble",
    accent: "#facc15",
    external: true,
  },
  {
    icon: FolderKanban,
    label: "Projects",
    href: "/projects",
    id: "projects",
    accent: "#2dd4bf",
  },
  {
    icon: Mail,
    label: "Email Me",
    href: `mailto:${siteData.email}`,
    id: "email",
    accent: "#a3e635",
  },
];

type DockItemProps = DockItemData & {
  mouseY: MotionValue<number>;
  selected: boolean;
  onSelect: (id: string) => void;
};

type DockItemStyle = MotionStyle & {
  "--dock-accent": string;
};

function DockItem({
  icon: Icon,
  label,
  href,
  id,
  accent,
  external,
  mouseY,
  selected,
  onSelect,
}: DockItemProps) {
  const itemRef = useRef<HTMLAnchorElement>(null);
  const selectionAnimation = useAnimationControls();
  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const distance = useTransform(mouseY, (pointerY) => {
    if (!Number.isFinite(pointerY)) return 160;

    const bounds = itemRef.current?.getBoundingClientRect();
    if (!bounds) return 160;

    return pointerY - (bounds.top + bounds.height / 2);
  });
  const scaleTarget = useTransform(
    distance,
    [-110, -58, 0, 58, 110],
    [1, 1.07, 1.22, 1.07, 1],
  );
  const scale = useSpring(scaleTarget, {
    mass: 0.14,
    stiffness: 260,
    damping: 20,
  });

  const isActive =
    !external &&
    ((href === "/" && pathname === "/") ||
      (href !== "/" && pathname.startsWith(href)));
  const emphasized = hovered || focused || selected || isActive;

  return (
    <div className="site-side-dock__item-shell">
      <motion.a
        ref={itemRef}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "me noopener noreferrer" : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onClick={() => {
          onSelect(id);
          void selectionAnimation.start({
            rotate: [0, -4, 4, -3, 3, 0],
            transition: { duration: 0.38, ease: "easeInOut" },
          });
        }}
        aria-label={label}
        aria-current={isActive ? "page" : undefined}
        data-selected={emphasized ? "true" : "false"}
        style={{
          "--dock-accent": accent,
          scale,
          transformOrigin: "center",
        } as DockItemStyle}
        className="site-side-dock__item"
        animate={selectionAnimation}
        whileTap={{ scale: 0.96 }}
      >
        <span className="site-side-dock__selector" aria-hidden="true" />
        <Icon size={19} strokeWidth={2.1} aria-hidden="true" />
        <span className="site-side-dock__status" aria-hidden="true" />
      </motion.a>

      <AnimatePresence>
        {hovered || focused ? (
          <motion.div
            className="site-side-dock__tooltip"
            initial={{ opacity: 0, x: -6, y: "-50%", scale: 0.96 }}
            animate={{ opacity: 1, x: 0, y: "-50%", scale: 1 }}
            exit={{ opacity: 0, x: -4, y: "-50%", scale: 0.97 }}
            transition={{ duration: 0.15 }}
            role="tooltip"
          >
            <span>{label}</span>
            {external ? <ExternalLink size={11} aria-hidden="true" /> : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function SideDock() {
  const pathname = usePathname();
  const mouseY = useMotionValue(Number.POSITIVE_INFINITY);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (pathname === "/isanjalee" || pathname.startsWith("/isanjalee/")) {
    return null;
  }

  return (
    <aside
      className="site-side-dock fixed left-4 top-1/2 z-50 hidden xl:block"
      style={{ transform: "translateY(-50%)" }}
      aria-label="Portfolio links"
    >
      <nav
        className="site-side-dock__rail"
        aria-label="Social profiles and quick links"
        onMouseMove={(event) => mouseY.set(event.clientY)}
        onMouseLeave={() => mouseY.set(Number.POSITIVE_INFINITY)}
      >
        {DOCK_ITEMS.map((item) => (
          <DockItem
            key={item.id}
            {...item}
            mouseY={mouseY}
            selected={selectedId === item.id}
            onSelect={setSelectedId}
          />
        ))}
      </nav>
    </aside>
  );
}
