import type { Metadata } from "next";
import localFont from "next/font/local";
import { Open_Sans } from "next/font/google";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { fetchMenuByLocation } from "@/lib/menus";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

const lorin = localFont({
  src: [
    { path: "../public/fonts/Lorin-Bold.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/Lorin-Bold.woff", weight: "700", style: "normal" },
  ],
  variable: "--font-lorin",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kids Jump Tech | Interactive Equipment for Kids",
  description:
    "Turn any space into an interactive adventure. Explore Kids Jump Tech games, interactive floors, sandboxes, and digital parks built on Next.js + Laravel demo stack.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [headerMenu, footerMenu] = await Promise.all([
    fetchMenuByLocation("header", { revalidate: 0 }).catch(() => null),
    fetchMenuByLocation("footer", { revalidate: 0 }).catch(() => null),
  ]);

  return (
    <html lang="en">
      <body className={`${openSans.variable} ${lorin.variable} min-h-screen bg-background text-foreground antialiased font-sans`}>
        <div className="flex min-h-screen flex-col">
          <SiteHeader menu={headerMenu} />
          <div className="flex-1">{children}</div>
          <SiteFooter menu={footerMenu} />
        </div>
      </body>
    </html>
  );
}
