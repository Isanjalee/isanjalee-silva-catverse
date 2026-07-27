import type { Metadata } from "next";
import ContactPage from "../site/contact/page";

export const metadata: Metadata = {
  title: "Communication Gateway",
  description:
    "Communication Gateway for reaching Isanjalee Silva about software engineering, full-stack development, AI workflows, enterprise systems, or technical collaboration.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Communication Gateway",
    description:
      "Get in touch with Isanjalee Silva for software engineering and technical collaboration.",
    url: "/contact",
  },
};

export default ContactPage;
