// app/layout.tsx
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import {Footer} from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
    title: {
        default: 'Meryam Swilem - Interior Design',
        template: '%s | Meryam Swilem'
    },
    description: 'Creating beautiful, timeless interior spaces that reflect your personality and lifestyle.',
    keywords: ['interior design', 'interior designer', 'home design', 'interior decorator', 'Meryam Swilem'],
    authors: [{ name: 'Meryam Swilem' }],
    creator: 'Meryam Swilem',
    publisher: 'Meryam Swilem',
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        //url: 'https://your-domain.com',
        siteName: 'Meryam Swilem - Interior Design',
        title: 'Meryam Swilem - Interior Design',
        description: 'Creating beautiful, timeless interior spaces that reflect your personality and lifestyle.',
        images: [
            {
                url: 'images/about-portrait.jpg',
                width: 1200,
                height: 630,
                alt: 'Meryam Swilem - Interior Design',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Meryam Swilem - Interior Design',
        description: 'Creating beautiful, timeless interior spaces that reflect your personality and lifestyle.',
        images: ['images/about-portrait.jpg'],
    },
    icons: {
        icon: [
            { url: '/favicon.ico' },
        ],
        apple: [
            { url: '/favicon.ico' },
        ],
    },
    manifest: '/site.webmanifest',
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#faf8f6] overflow-x-hidden" suppressHydrationWarning>
        <Navbar />
        <main className="pt-20 overflow-x-hidden max-w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}