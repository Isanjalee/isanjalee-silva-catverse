import type { Metadata } from "next";
import ContactPage from "../site/contact/page";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Isanjalee Silva regarding software engineering, full-stack development, AI workflows, enterprise systems, or technical collaboration.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Isanjalee Silva",
    description:
      "Get in touch with Isanjalee Silva for software engineering and technical collaboration.",
    url: "/contact",
  },
};

export default ContactPage;
