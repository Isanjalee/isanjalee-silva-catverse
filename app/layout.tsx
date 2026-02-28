import "./globals.css";
import Navbar from "@/components/Navbar";
import CatCompanion from "@/components/CatCompanion";
import BackgroundCats from "@/components/BackgroundCats";
import FloatingCopyright from "@/components/FloatingCopyright";
import SideDock from "@/components/SideDock";

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#fdfbf7] dark:bg-[#000000] text-[#1c1c1e] dark:text-[#f5ece1] antialiased min-h-screen transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <div className="mac-gradient-bg" />
          <BackgroundCats />
          <SideDock />
          <div className="relative z-10 flex min-h-screen flex-col">
            <Navbar />
            <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-10 flex-1">
              {children}
            </main>
            <CatCompanion />
            <FloatingCopyright />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
