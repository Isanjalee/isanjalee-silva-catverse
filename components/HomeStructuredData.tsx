import { siteConfig } from "@/lib/seo";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: "Isanjalee Silva Portfolio",
      alternateName: "Isanjalee Portfolio",
      description: siteConfig.description,
    },
    {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: siteConfig.name,
      alternateName: "Isanjalee",
      url: siteConfig.url,
      image: `${siteConfig.url}${siteConfig.image}`,
      jobTitle: "Software Engineer",
      description:
        "Sri Lankan software engineer focused on full-stack product engineering, enterprise systems, applied AI, and machine-learning research.",
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "University of Moratuwa",
      },
      knowsAbout: [
        "Software Engineering",
        "Full-Stack Development",
        "Artificial Intelligence",
        "Machine Learning",
        "Enterprise Software",
        "Next.js",
        "React",
        "TypeScript",
      ],
      sameAs: [
        siteConfig.socials.github,
        siteConfig.socials.linkedin,
        siteConfig.socials.dribbble,
      ],
    },
  ],
};

export default function HomeStructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
