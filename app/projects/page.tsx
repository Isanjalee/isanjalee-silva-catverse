import type { Metadata } from "next";
import ProjectsPage from "../site/projects/page";

export const metadata: Metadata = {
  title: "Software Engineering Projects",
  description:
    "Explore software engineering projects by Isanjalee Silva, including enterprise platforms, transport automation, healthcare software, AI assistants, mobile applications, and research.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Software Engineering Projects by Isanjalee Silva",
    description:
      "Full-stack, enterprise, healthcare, transport automation, and AI projects by Isanjalee Silva.",
    url: "/projects",
  },
};

export default ProjectsPage;
