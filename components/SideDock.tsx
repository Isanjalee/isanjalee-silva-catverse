"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Github, Linkedin, Dribbble, Palette, FileText, Mail } from "lucide-react";
import { useRef, useState } from "react";
import { usePathname } from "next/navigation";

const DOCK_ITEMS = [
  { icon: Github, label: "Code & Repos", href: "https://github.com", id: "github" },
  { icon: Linkedin, label: "Experience", href: "https://linkedin.com", id: "linkedin" },
  { icon: Dribbble, label: "UI / Art", href: "https://dribbble.com", id: "dribbble" },
  { icon: Palette, label: "Portfolio", href: "https://behance.net", id: "behance" },
  { icon: FileText, label: "Download Resume", href: "/cv.pdf", id: "cv" },
  { icon: Mail, label: "Email Me", href: "mailto:hello@example.com", id: "email" },
];

function DockItem({ icon: Icon, label, href, id, mouseX }: any) {
  const ref = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);

  // Mac magnification logic
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    return val - bounds.y - bounds.height / 2;
  });

  const widthSync = useTransform(distance, [-100, 0, 100], [40, 65, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const isActive = (href === "/" && pathname === "/") || (href !== "/" && pathname.startsWith(href));

  return (
    <div className="relative flex items-center justify-center py-1">
      <motion.a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ width, height: width }}
        className="group relative flex items-center justify-center rounded-2xl transition-colors duration-300"
      >
        <div 
          className="absolute inset-0 rounded-2xl bg-black/5 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" 
        />
        <Icon 
          className="relative z-10 transition-colors" 
          style={{ color: hovered ? 'var(--nav-fg)' : 'var(--nav-fg-muted)' }}
          size={20} 
        />

        {/* Tooltip */}
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 20 }}
            className="absolute left-full ml-4 whitespace-nowrap rounded-lg bg-black/80 dark:bg-white/90 px-3 py-1.5 text-[10px] font-medium text-white dark:text-black shadow-xl backdrop-blur-md pointer-events-none"
          >
            {label}
            <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 border-y-[4px] border-y-transparent border-r-[4px] border-r-black/80 dark:border-r-white/90" />
          </motion.div>
        )}

        {/* Active Indicator (Dot) */}
        {isActive && (
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 h-1 w-1 rounded-full bg-current shadow-[0_0_8px_rgba(255,255,255,0.5)]" style={{ backgroundColor: 'var(--nav-fg)' }} />
        )}
      </motion.a>
    </div>
  );
}

export default function SideDock() {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="fixed left-4 top-[45%] z-50 -translate-y-1/2 hidden lg:block">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageY)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex flex-col items-center gap-1 rounded-full border p-2 backdrop-blur shadow-2xl transition-all duration-300"
        style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--nav-border)' }}
      >
        {DOCK_ITEMS.map((item) => (
          <DockItem key={item.id} {...item} mouseX={mouseX} />
        ))}
      </motion.div>
    </div>
  );
}
