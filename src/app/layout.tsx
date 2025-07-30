import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { AuthProvider } from '@/components/providers/auth-provider';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Kilian Siebert - Photography & Videography',
    template: '%s | Kilian Siebert',
  },
  description:
    'Professional photography and videography services specializing in travel, event, and nature photography. Visual storytelling with passion and creativity by Kilian Siebert.',
  keywords: [
    'photography',
    'photographer',
    'nature',
    'travel',
    'event',
    'videography',
    'professional',
    'Germany',
    'Kilian Siebert',
  ],
  authors: [{ name: 'Kilian Siebert' }],
  creator: 'Kilian Siebert',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  ),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
    title: 'Kilian Siebert - Photography & Videography',
    description:
      'Professional photography and videography services specializing in travel, event, and nature photography.',
    siteName: 'Kilian Siebert Photography',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kilian Siebert - Photography & Videography',
    description:
      'Professional photography and videography services specializing in travel, event, and nature photography.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <AuthProvider>
          <Header />
          <main className='flex-1'>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
