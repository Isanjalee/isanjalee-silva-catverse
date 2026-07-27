import type { Metadata } from "next";
import AboutPage from "../site/about/page";

export const metadata: Metadata = {
  title: "Digital Profile Console",
  description:
    "Learn about Isanjalee Silva, her software engineering experience, University of Moratuwa education, enterprise systems work, and applied AI research.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "Digital Profile Console",
    description:
      "Software engineering experience, education, enterprise work, and applied AI research by Isanjalee Silva.",
    url: "/about",
  },
};

export default AboutPage;
