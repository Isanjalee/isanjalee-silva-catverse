import type { Metadata } from "next";
import InProgressPage from "@/components/InProgressPage";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A visual gallery of Isanjalee Silva's creative and technical work.",
  alternates: {
    canonical: "/gallery",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function GalleryPage() {
  return (
    <InProgressPage
      title="Gallery is being curated."
      subtitle="A dedicated space for selected visuals, design work, and creative experiments is coming soon."
    />
  );
}
