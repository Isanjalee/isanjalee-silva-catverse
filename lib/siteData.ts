export type SocialLink = {
  label: string;
  href: string;
};

export type Highlight = {
  kicker: string;
  title: string;
  desc: string;
  href: string;
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  tag: string;
  title: string;
  desc: string;
  links: ProjectLink[];
};

export type SiteData = {
  email: string | null;
  socials: SocialLink[];
  highlights: Highlight[];
  aboutParagraphs: string[];
  projects: Project[];
};

export const siteData: SiteData = {
  email: "ihnjmsilva152@gmail.com",
  socials: [
    { label: "GitHub", href: "https://github.com/Isanjalee" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/isanjalee-silva/",
    },
    { label: "Dribbble", href: "https://dribbble.com/Isanjalee" },
  ],
  highlights: [
    {
      kicker: "About",
      title: "Calm Engineering",
      desc: "Thoughtful UI, clean structure, and a clear personal identity.",
      href: "/about",
    },
    {
      kicker: "Work",
      title: "Selected Projects",
      desc: "A compact set of projects and engineering work worth highlighting.",
      href: "/projects",
    },
    {
      kicker: "Break",
      title: "Mind Break",
      desc: "A quick cat-pattern memory game built into the site for a playful reset.",
      href: "/mind-break",
    },
  ],
  aboutParagraphs: [
    "I'm Isanjalee Silva. I enjoy building clean, useful software and making it feel calm and friendly.",
    "This site is intentionally minimal but never flat. Motion stays subtle, and the cat adds character.",
    "I focus on solid structure, practical UX, and steady improvement over time.",
  ],
  projects: [
    {
      tag: "Web / Product",
      title: "SP Buses",
      desc: "Transit-focused product work centered on clearer information, smoother journeys, and a calmer user experience.",
      links: [{ label: "Website", href: "https://www.spgps.lk" }],
    },
    {
      tag: "Engineering / Systems",
      title: "ALDTAN",
      desc: "Practical systems work shaped by real-world constraints, maintainability, and reliable delivery.",
      links: [],
    },
  ],
};
