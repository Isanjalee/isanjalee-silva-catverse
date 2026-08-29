import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mind Break",
  description:
    "Catch falling butterflies with a cat in a small interactive game in Isanjalee Silva's portfolio.",
  alternates: {
    canonical: "/mind-break",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function MindBreakLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
