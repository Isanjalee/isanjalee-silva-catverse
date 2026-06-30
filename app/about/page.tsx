import type { Metadata } from "next";
import AboutPage from "../site/about/page";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Isanjalee Silva, her software engineering experience, University of Moratuwa education, enterprise systems work, and applied AI research.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Isanjalee Silva",
    description:
      "Software engineering experience, education, enterprise work, and applied AI research by Isanjalee Silva.",
    url: "/about",
  },
};

export default AboutPage;
