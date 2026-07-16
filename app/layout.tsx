// app/layout.tsx
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import './globals.css';

export const metadata: Metadata = {
    title: 'Meryam Swilem - Interior Design',
    description: 'Creating beautiful, timeless interior spaces.',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className="bg-[#faf8f6]" suppressHydrationWarning>
        <Navbar />
        <main className="pt-20">
            {children}
        </main>
        </body>
        </html>
    );
}