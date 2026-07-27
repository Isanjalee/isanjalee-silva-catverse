import type { Metadata } from "next";
import DigitalSectionTitle from "@/components/DigitalSectionTitle";
import InProgressPage from "@/components/InProgressPage";

export const metadata: Metadata = {
  title: "Visual Memory Archive",
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
      eyebrow="Visual Memory Archive"
      title={<DigitalSectionTitle label="pixels.png" />}
      subtitle="Selected visuals, design work, and creative experiments are being curated."
    />
  );
}
