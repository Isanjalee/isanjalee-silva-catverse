import type { Metadata } from "next";
import ProjectsPage from "@/components/pages/ProjectsPageContent";

export const metadata: Metadata = {
  title: "Creative Build Laboratory",
  description:
    "Explore software engineering projects by Isanjalee Silva, including enterprise platforms, transport automation, healthcare software, AI assistants, mobile applications, and research.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Creative Build Laboratory",
    description:
      "Full-stack, enterprise, healthcare, transport automation, and AI projects by Isanjalee Silva.",
    url: "/projects",
  },
};

export default ProjectsPage;
