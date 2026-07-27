import type { Metadata } from "next";
import DigitalSectionTitle from "@/components/DigitalSectionTitle";
import InProgressPage from "@/components/InProgressPage";

export const metadata: Metadata = {
  title: "Digital Thought Journal",
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
      eyebrow="Digital Thought Journal"
      title={<DigitalSectionTitle label="thoughts.log" />}
      subtitle="Posts still need to be written."
    />
  );
}
