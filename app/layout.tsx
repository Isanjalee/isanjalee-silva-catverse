import "./globals.css";
import "./mobile-fixes.css";
import CatverseCursorState from "@/components/CatverseCursorState";
import HomeStructuredData from "@/components/HomeStructuredData";
import SiteChrome from "@/components/SiteChrome";
import SiteLoader from "@/components/SiteLoader";
import ViewportHeightSync from "@/components/ViewportHeightSync";
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
  icons: {
    icon: [
      {
        url: "/brand/favicon-light.png",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/brand/favicon-dark.png",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
      { url: "/brand/favicon-light.png", type: "image/png" },
    ],
    apple: [{ url: "/brand/favicon-light.png", sizes: "512x512", type: "image/png" }],
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
        <SiteLoader />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <CatverseCursorState />
          <ViewportHeightSync />
          <WeatherProvider>
            <SiteChrome>{children}</SiteChrome>
          </WeatherProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
