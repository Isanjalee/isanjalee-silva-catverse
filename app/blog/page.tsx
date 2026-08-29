import type { Metadata } from "next";
import BlogPage from "@/components/pages/BlogPageContent";

export const metadata: Metadata = {
  title: "Digital Thought Journal",
  description:
    "Articles and engineering notes by Isanjalee Silva, published on Medium and, soon, natively on this site.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Digital Thought Journal",
    description: "Articles and engineering notes by Isanjalee Silva.",
    url: "/blog",
  },
};

export default BlogPage;
