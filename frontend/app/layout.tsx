import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { fetchMenuByLocation } from "@/lib/menus";
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
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}>
        <div className="flex min-h-screen flex-col">
          <SiteHeader menu={headerMenu} />
          <div className="flex-1">{children}</div>
          <SiteFooter menu={footerMenu} />
        </div>
      </body>
    </html>
  );
}
