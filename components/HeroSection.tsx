// components/HeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function HeroSection() {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProjectImages = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('images')
          .order('date', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Supabase error:', error);
          setLoading(false);
          return;
        }

        if (data && data.images) {
          let imageArray = data.images;
          if (typeof imageArray === 'string') {
            try { imageArray = JSON.parse(imageArray); } catch { imageArray = []; }
          }
          if (Array.isArray(imageArray) && imageArray.length > 0) {
            const urls = imageArray.map((img: any) => typeof img === 'string' ? img : img.url).filter(Boolean);
            setImages(urls);
          }
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProjectImages();
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const scrollToContact = () => {
    const contactSection = document.querySelector('#contact');
    if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
  };

  const fallbackImage = '/images/hero-interior.jpg';

  // Sliding dot window logic
  const totalImages = images.length;
  const maxVisibleDots = 5;

  // Compute the start index of the visible window
  let start = 0;
  if (totalImages > maxVisibleDots) {
    const half = Math.floor(maxVisibleDots / 2);
    start = Math.max(0, Math.min(currentIndex - half, totalImages - maxVisibleDots));
  }
  const visibleIndices = Array.from(
    { length: Math.min(maxVisibleDots, totalImages) },
    (_, i) => start + i
  );

  const hasMoreBefore = start > 0;
  const hasMoreAfter = start + maxVisibleDots < totalImages;

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

      {/* Slideshow indicator with sliding dots + arrows */}
      {!loading && images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center px-4">
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-2 sm:px-4 sm:py-2.5">
            {/* Previous button */}
            <button
              onClick={goToPrevious}
              className="text-white/70 hover:text-white transition-colors p-1"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {hasMoreBefore && (
                <span className="text-white/50 text-xs">…</span>
              )}
              {visibleIndices.map((index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-6 sm:w-8 bg-[#d4c5b0]'
                      : 'w-4 sm:w-5 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
              {hasMoreAfter && (
                <span className="text-white/50 text-xs">…</span>
              )}
            </div>

            {/* Next button */}
            <button
              onClick={goToNext}
              className="text-white/70 hover:text-white transition-colors p-1"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
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