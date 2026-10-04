// app/layout.tsx
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  ),
  title: {
    default: 'Meryam Swilem - Interior Design',
    template: '%s | Meryam Swilem',
  },
  description:
      'Creating beautiful, timeless interior spaces that reflect your personality and lifestyle.',
  keywords: [
    'interior design',
    'interior designer',
    'home design',
    'interior decorator',
    'Meryam Swilem',
  ],
  authors: [{ name: 'Meryam Swilem' }],
  creator: 'Meryam Swilem',
  publisher: 'Meryam Swilem',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Meryam Swilem - Interior Design',
    title: 'Meryam Swilem - Interior Design',
    description:
        'Creating beautiful, timeless interior spaces that reflect your personality and lifestyle.',
    images: [
      {
        url: '/images/about-portrait.jpg',   // ← leading slash
        width: 1200,
        height: 630,
        alt: 'Meryam Swilem - Interior Design',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meryam Swilem - Interior Design',
    description:
        'Creating beautiful, timeless interior spaces that reflect your personality and lifestyle.',
    images: ['/images/about-portrait.jpg'], // ← leading slash
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  // manifest: '/site.webmanifest',  ← either delete this line
  //                                    OR create public/site.webmanifest
};