// components/HeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

export function HeroSection() {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProjectImages = async () => {
      try {
        console.log('📸 Fetching latest project...');
        const { data, error } = await supabase
          .from('projects')          // <-- make sure this is your exact table name
          .select('images')
          .order('date', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('❌ Supabase error:', error);
          setLoading(false);
          return;
        }

        console.log('📦 Project data:', data);

        if (data && data.images) {
          let imageArray = data.images;
          if (typeof imageArray === 'string') {
            try { imageArray = JSON.parse(imageArray); } catch { imageArray = []; }
          }
          if (Array.isArray(imageArray) && imageArray.length > 0) {
            const urls = imageArray.map((img: any) => typeof img === 'string' ? img : img.url).filter(Boolean);
            console.log('🖼️ Images found:', urls);
            setImages(urls);
          } else {
            console.warn('⚠️ No images in the latest project.');
          }
        } else {
          console.warn('⚠️ No project found or images column is empty.');
        }
      } catch (err) {
        console.error('💥 Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProjectImages();
  }, []);

  // Auto‑slideshow
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  const scrollToContact = () => {
    const contactSection = document.querySelector('#contact');
    if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
  };

  const fallbackImage = '/images/hero-interior.jpg';

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        {!loading && images.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <Image
                src={images[currentIndex]}
                alt="Interior design showcase"
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <Image
            src={fallbackImage}
            alt="Luxurious interior design by Meryam Swilem"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2c1810]/90 via-[#2c1810]/40 to-transparent" />
      </div>

      {!loading && images.length > 1 && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-8 bg-[#d4c5b0]' : 'w-4 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 pb-16 lg:pb-24 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-body text-sm md:text-base tracking-[0.3em] uppercase text-[#d4c5b0] mb-4"
        >
          Interior Designer & Artiste Peintre
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] text-white max-w-4xl"
        >
          Creating Spaces
          <br />
          <span className="italic text-[#d4c5b0]">that Inspire</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 text-lg md:text-xl text-white/70 max-w-xl"
        >
          Bespoke interiors combining elegance, functionality, and artistic passion.
          Based in Tunisia.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <button
            onClick={scrollToContact}
            className="px-8 py-3.5 bg-[#d4c5b0] text-[#2c1810] font-body text-sm tracking-wide uppercase hover:brightness-110 transition-all duration-300 rounded-lg font-semibold"
          >
            Get in Touch
          </button>
          <Link href="/projects">
            <button className="px-8 py-3.5 border border-white/30 text-white font-body text-sm tracking-wide uppercase hover:border-[#d4c5b0] hover:text-[#d4c5b0] transition-all duration-300 rounded-lg">
              View Portfolio
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}