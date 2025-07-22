import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
  title: {
    default: "Portfolio - Professional Photography",
    template: "%s | Portfolio"
  },
  description: "Professional photography services specializing in weddings, portraits, and events. Capturing life's precious moments with creativity and passion.",
  keywords: ["photography", "photographer", "wedding", "portrait", "event", "professional", "Munich"],
  authors: [{ name: "Portfolio Photographer" }],
  creator: "Portfolio Photographer",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    title: "Portfolio - Professional Photography",
    description: "Professional photography services specializing in weddings, portraits, and events.",
    siteName: "Portfolio Photography",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio - Professional Photography",
    description: "Professional photography services specializing in weddings, portraits, and events.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
