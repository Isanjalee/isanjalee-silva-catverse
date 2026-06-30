import type { Metadata } from "next";
import InProgressPage from "@/components/InProgressPage";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles and engineering notes by Isanjalee Silva.",
  alternates: {
    canonical: "/blog",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function BlogPage() {
  return (
    <InProgressPage
      title="Blog is on the way."
      subtitle="The route works now. Posts still need to be written."
    />
  );
}
