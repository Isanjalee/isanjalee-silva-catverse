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
  image?: string;
  imageAlt?: string;
  imageFit?: "cover" | "contain";
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
    "I'm Isanjalee Silva, a First Class (Batch Second) B.Sc. (Hons) graduate in Information Technology and Management from the University of Moratuwa.",
    "I have nearly two years of professional software engineering experience across enterprise aviation supply chain and transport automation systems, with hands-on work in backend logic, UI development, and large-scale data migration.",
    "At IFS R&D, I contributed to engineering and testing improvements that increased development efficiency by around 30-50%, while mentoring junior engineers and collaborating with global teams on client-facing deliveries.",
    "My research focus includes machine-learning-based ride demand forecasting, where weather-enhanced models reached up to 90% accuracy and Explainable AI techniques (SHAP, LIME) improved model transparency.",
    "I'm especially interested in building scalable AI-powered and data-driven software systems for real-world industrial applications.",
  ],
  projects: [
    {
      tag: "Web Platform / Transport Automation",
      title: "Transpomate",
      desc: "B2B transport-automation platform for ride requests, approvals, vehicle allocation, cost optimisation, and HR/Finance reporting. Contributed frontend engineering with React and Next.js, including Google Maps workflows and performance improvements.",
      links: [{ label: "Live App", href: "https://transpomate.com/" }],
    },
    {
      tag: "Enterprise Product / Aviation ERP",
      title: "IFS Cloud & Maintenix",
      desc: "Enterprise aviation supply-chain and maintenance work across IFS Cloud and Maintenix, including backend business logic, UI customisation, migration pipelines, automated testing, documentation, and AI-assisted development workflows.",
      links: [
        {
          label: "IFS",
          href: "https://www.ifs.com/en",
        },
        {
          label: "IFS Cloud SCM",
          href: "https://www.ifs.com/en/insights/assets/supply-chain-management-in-ifs-cloud",
        },
        {
          label: "Maintenix",
          href: "https://www.ifs.com/en/industries/aerospace-and-defense/airlines-and-air-operators",
        },
      ],
    },
    {
      tag: "Enterprise Product / Healthcare",
      title: "Med Link (ALDTAN Pvt Ltd)",
      desc: "Production healthcare platform focused on secure authentication, clinical workflows, analytics, and resilient API architecture.",
      links: [{ label: "Live App", href: "https://medlink.aldtan.com/" }],
    },
    {
      tag: "Local AI Agent / Python",
      title: "Calm Day Agent",
      desc: "Calm, local-first AI daily planner powered by Ollama, built for private task orchestration and focused personal productivity.",
      links: [
        {
          label: "GitHub",
          href: "https://github.com/Isanjalee/calm-day-agent",
        },
      ],
    },
    {
      tag: "AI Product / TypeScript",
      title: "Posh AI Assistant",
      desc: "AI-powered apparel business assistant generating captions, hashtags, customer replies, and design ideas for social-first growth workflows.",
      links: [
        {
          label: "GitHub",
          href: "https://github.com/Isanjalee/posh-ai-assistant",
        },
      ],
    },
    {
      tag: "Mobile + Platform / Flutter",
      title: "Servicr (Home Services Platform)",
      desc: "Service marketplace connecting clients with providers. Contributed Flutter mobile UI, scheduling and notification flows, plus admin panel and database support.",
      links: [
        {
          label: "GitHub Org",
          href: "https://github.com/ethos-fit19",
        },
        {
          label: "Client Repo",
          href: "https://github.com/Isanjalee/servicr_client",
        },
      ],
    },
    {
      tag: "Game Development / C#",
      title: "Flappy Bird Game",
      desc: "C# fundamentals project recreating Flappy Bird mechanics with obstacle timing, collision handling, and score-driven gameplay loops.",
      links: [
        {
          label: "GitHub",
          href: "https://github.com/Isanjalee/flappyBirdGame",
        },
      ],
    },
    {
      tag: "Web Product / Agency Build",
      title: "DevTrio IT Solutions",
      desc: "Website creation for a UK-based digital solutions company with a remote Sri Lanka team, focused on web development, digital design, and mobile app services.",
      links: [
        {
          label: "GitHub Org",
          href: "https://github.com/Team-DevTrio",
        },
      ],
    },
  ],
};
