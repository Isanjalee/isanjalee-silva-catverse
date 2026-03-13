"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  Dribbble,
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

const DOCK_ITEMS: DockItemData[] = [
  {
    icon: Github,
    label: "Code & Repos",
    href: githubHref,
    id: "github",
    external: true,
  },
  {
    icon: Linkedin,
    label: "Experience",
    href: linkedInHref,
    id: "linkedin",
    external: true,
  },
  {
    icon: Dribbble,
    label: "UI / Art",
    href: dribbbleHref,
    id: "dribbble",
    external: true,
  },
  {
    icon: FolderKanban,
    label: "Projects",
    href: "/projects",
    id: "projects",
  },
  {
    icon: Mail,
    label: "Email Me",
    href: `mailto:${siteData.email}`,
    id: "email",
  },
];

type DockItemProps = DockItemData & {
  mouseY: MotionValue<number>;
};

function DockItem({ icon: Icon, label, href, external, mouseY }: DockItemProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);

  const distance = useTransform(mouseY, (value: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    return value - bounds.y - bounds.height / 2;
  });

  const widthSync = useTransform(distance, [-100, 0, 100], [40, 65, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const isActive =
    !external &&
    ((href === "/" && pathname === "/") ||
      (href !== "/" && pathname.startsWith(href)));

  return (
    <div className="relative flex items-center justify-center py-1">
      <motion.a
        ref={ref}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ width, height: width }}
        className="group relative flex items-center justify-center rounded-2xl transition-colors duration-300"
      >
        <div className="absolute inset-0 rounded-2xl bg-black/5 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white/10" />
        <Icon
          className="relative z-10 transition-colors"
          style={{ color: hovered ? "var(--nav-fg)" : "var(--nav-fg-muted)" }}
          size={20}
        />

        {hovered ? (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 20 }}
            className="pointer-events-none absolute left-full ml-4 whitespace-nowrap rounded-lg bg-black/80 px-3 py-1.5 text-[10px] font-medium text-white shadow-xl backdrop-blur-md dark:bg-white/90 dark:text-black"
          >
            {label}
            <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 border-y-[4px] border-y-transparent border-r-[4px] border-r-black/80 dark:border-r-white/90" />
          </motion.div>
        ) : null}

        {isActive ? (
          <div
            className="absolute -left-2 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-current shadow-[0_0_8px_rgba(255,255,255,0.5)]"
            style={{ backgroundColor: "var(--nav-fg)" }}
          />
        ) : null}
      </motion.a>
    </div>
  );
}

export default function SideDock() {
  const mouseY = useMotionValue(Infinity);

  return (
    <div className="fixed left-4 top-[45%] z-50 hidden -translate-y-1/2 lg:block">
      <motion.div
        onMouseMove={(event) => mouseY.set(event.pageY)}
        onMouseLeave={() => mouseY.set(Infinity)}
        className="flex flex-col items-center gap-1 rounded-full border p-2 backdrop-blur shadow-2xl transition-all duration-300"
        style={{ backgroundColor: "var(--nav-bg)", borderColor: "var(--nav-border)" }}
      >
        {DOCK_ITEMS.map((item) => (
          <DockItem key={item.id} {...item} mouseY={mouseY} />
        ))}
      </motion.div>
    </div>
  );
}
