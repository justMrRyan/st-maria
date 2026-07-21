// app/page.tsx
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { PortfolioSection } from '@/components/PortfolioSection';
import { ContactSection } from '@/components/ContactSection';
import type { Metadata } from 'next';
import { getSupabaseClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Interior Design Portfolio | Meryam Swilem',
  description: 'Explore stunning interior design projects and transformations by Meryam Swilem. Professional interior design services.',
  openGraph: {
    title: 'Interior Design Portfolio | Meryam Swilem',
    description: 'Explore stunning interior design projects and transformations by Meryam Swilem.',
    images: [
      {
        url: '/images/about-portrait.jpg',
        width: 1200,
        height: 630,
        alt: 'Meryam Swilem - Interior Design Portfolio',
      },
    ],
  },
};

export default async function Home() {
  const supabase = getSupabaseClient();

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* Wrap each section to clip animation overflow */}
      <div className="overflow-hidden">
        <HeroSection />
      </div>
      <div className="overflow-hidden">
        <AboutSection />
      </div>
      <div className="overflow-hidden">
        <PortfolioSection projects={projects || []} />
      </div>
      <div className="overflow-hidden">
        <ContactSection />
      </div>
    </main>
  );
}