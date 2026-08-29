export type BlogPlatform = "medium" | "site";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  platform: BlogPlatform;
  platformLabel: string;
  href: string;
  tags: string[];
  readTime?: string;
  content?: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "building-this-portfolio",
    title: "Building a Cat-Themed Portfolio: Design Notes From This Site",
    excerpt:
      "Why this portfolio looks and feels the way it does — the console-inspired UI, the seasonal weather, and the cat that lives in it.",
    platform: "site",
    platformLabel: "This Site",
    href: "/blog/building-this-portfolio",
    tags: ["Design", "Build Notes"],
    readTime: "4 min read",
    content: [
      "Most portfolios are a resume with a nicer font. I wanted mine to feel like a small piece of software you can actually use — something with a personality, not just a page you scroll past.",
      "That's where the \"catverse\" idea came from. Every page in this site is framed as a console: a kicker pill, a decoding title animation, glass panels with soft glows in cyan, gold, lime, and violet. It's the same visual language on the home page, the about page, projects, contact, and this blog — so moving between them feels like moving between screens of one app, not between unrelated pages.",
      "The site also reacts to real conditions. The background shifts with the season and the time of day in Sri Lanka, and there's a small cat that wanders the page, blinks, and reacts to clicks with a tiny sound. None of that is required to read the content — it's there so the site feels alive instead of static, the same way a good product feels considered rather than assembled.",
      "Underneath, it's a Next.js 16 app with Tailwind v4 and Framer Motion for the animation layer, deployed as a single cohesive design system rather than a collection of one-off pages. Every layout — including this blog — is built to stay fully responsive: a fixed, app-like single screen on desktop and tablet, and a natural scrolling page on phones.",
      "There's also a small game hidden in here — a cat catching butterflies, built the same way the rest of the site was: iterated on, tested, and fixed until it actually felt good to play, not just looked good in a screenshot.",
      "This article is the first native post on the site itself. More will follow here directly, alongside anything I publish on Medium.",
    ],
  },
  {
    slug: "from-artist-to-coder",
    title: "From Artist to Coder: A Journey of Building and Becoming",
    excerpt:
      "A personal look at the shift from art and design into software engineering — what carried over, and what had to be rebuilt from scratch.",
    platform: "medium",
    platformLabel: "Medium",
    href: "https://medium.com/@ihnjmsilva152/from-artist-to-coder-a-journey-of-building-and-becoming-47bba9955e43",
    tags: ["Career", "Personal"],
  },
];

export const mediumProfileUrl = "https://medium.com/@ihnjmsilva152";

export function getPostBySlug(slug: string) {
  return blogPosts.find((post) => post.platform === "site" && post.slug === slug);
}
