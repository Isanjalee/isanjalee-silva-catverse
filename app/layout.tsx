import "./globals.css";
import Navbar from "@/components/Navbar";
import CatCompanion from "@/components/CatCompanion";
import BackgroundCats from "@/components/BackgroundCats";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#000000] text-[#f5ece1] antialiased min-h-screen">
        <div className="mac-gradient-bg" />
        <BackgroundCats />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-10 flex-1">
            {children}
          </main>
          <CatCompanion />
        </div>
      </body>
    </html>
  );
}
