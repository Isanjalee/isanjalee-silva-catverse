import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mind Break",
  description:
    "A small interactive memory game in Isanjalee Silva's portfolio.",
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
