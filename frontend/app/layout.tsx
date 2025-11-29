import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kids Jump Tech | Interactive Equipment for Kids",
  description:
    "Turn any space into an interactive adventure. Explore Kids Jump Tech games, interactive floors, sandboxes, and digital parks built on Next.js + Laravel demo stack.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}>
        <Script id="perf-measure-guard" strategy="beforeInteractive">{`
          (function(){
            try {
              if (typeof performance === 'undefined' || typeof performance.measure !== 'function') return;
              const original = performance.measure.bind(performance);
              performance.measure = function(name, startOrOptions, end){
                try {
                  return original(name, startOrOptions, end);
                } catch (e) {
                  if (e && e.message && e.message.includes('negative time stamp')) {
                    return;
                  }
                  throw e;
                }
              };
            } catch (_) {}
          })();
        `}</Script>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
