import "./globals.css";
import "./mobile-fixes.css";
import Navbar from "@/components/Navbar";
import CatCompanion from "@/components/CatCompanion";
import BackgroundCats from "@/components/BackgroundCats";
import FloatingCopyright from "@/components/FloatingCopyright";
import HomeStructuredData from "@/components/HomeStructuredData";
import SideDock from "@/components/SideDock";
import ViewportHeightSync from "@/components/ViewportHeightSync";
import WeatherBackground from "@/components/WeatherBackground";
import { WeatherProvider } from "@/components/WeatherProvider";
import type { Metadata, Viewport } from "next";

import { ThemeProvider } from "@/components/ThemeProvider";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: "%s | Isanjalee Silva",
  },
  description: siteConfig.description,
  applicationName: "Isanjalee Silva Portfolio",
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Isanjalee Silva Portfolio",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-[#fdfbf7] dark:bg-[#000000] text-[#1c1c1e] dark:text-[#f5ece1] antialiased min-h-screen transition-colors duration-300"
      >
        <HomeStructuredData />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <ViewportHeightSync />
          <WeatherProvider>
            <div className="mac-gradient-bg" />
            <WeatherBackground />
            <BackgroundCats />
            <SideDock />
            <div className="site-frame relative z-10 flex min-h-screen flex-col">
              <Navbar />
              <main className="site-main mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col px-5 pb-10 pt-6">
                {children}
              </main>
              <CatCompanion />
              <FloatingCopyright />
            </div>
          </WeatherProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
