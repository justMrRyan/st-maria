// app/route.ts
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { PortfolioSection } from '@/components/PortfolioSection';
import { ContactSection } from '@/components/ContactSection';
import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { getSupabaseClient } from '@/lib/supabase/server';
export const metadata: Metadata = {
    title: 'Interior Design Portfolio | Meryam Swilem',
    description: 'Explore stunning interior design projects and transformations by Meryam Swilem. Professional interior design services.',
    openGraph: {
        title: 'Interior Design Portfolio | Meryam Swilem',
        description: 'Explore stunning interior design projects and transformations by Meryam Swilem.',
        //url: 'https://your-domain.com',
        images: [
            {
                url: 'images/about-portrait.jpg',
                width: 1200,
                height: 630,
                alt: 'Meryam Swilem - Interior Design Portfolio',
            },
        ],
    },
};

export default async function Home() {
  const supabase = getSupabaseClient();

  // Fetch projects for the portfolio section
  const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .order('date', { ascending: false });

  return (
      <>

        <main className="min-h-screen">
          {/* Hero Section - Full screen with interior design image */}
          <HeroSection />

          {/* About Section - Designer portrait and story */}
          <AboutSection />

          {/* Portfolio Section - Masonry grid of projects */}
          <PortfolioSection projects={projects || []} />

          {/* Contact Section - Contact form and info */}
          <ContactSection />


        </main>
      </>
  );
}