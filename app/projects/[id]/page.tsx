// app/projects/[id]/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { getSupabaseClient } from '@/lib/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  FolderOpen,
  Sparkles,
  Heart,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Pause,
  LayoutGrid
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  images: any[];
  date: string;
}

export default function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProject = async () => {
      const { id } = await params;
      const supabase = getSupabaseClient();

      const { data: projectData, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !projectData) {
        notFound();
        return;
      }

      setProject(projectData);

      let images = projectData.images || [];
      if (typeof images === 'string') {
        try {
          images = JSON.parse(images);
        } catch {
          images = [];
        }
      }

      if (Array.isArray(images) && images.length > 0 && typeof images[0] === 'object') {
        images = images.map((img: any) => img.url || img);
      }

      const urls = Array.isArray(images) ? images.filter(Boolean) : [];
      setImageUrls(urls);
      setLoading(false);
    };

    fetchProject();
  }, [params]);

  useEffect(() => {
    if (!isAutoPlaying || imageUrls.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, imageUrls.length]);

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Sliding dot window logic – exactly as in HeroSection
  const totalImages = imageUrls.length;
  const maxVisibleDots = 5;

  let start = 0;
  if (totalImages > maxVisibleDots) {
    const half = Math.floor(maxVisibleDots / 2);
    start = Math.max(0, Math.min(currentImageIndex - half, totalImages - maxVisibleDots));
  }
  const visibleIndices = Array.from(
    { length: Math.min(maxVisibleDots, totalImages) },
    (_, i) => start + i
  );

  const hasMoreBefore = start > 0;
  const hasMoreAfter = start + maxVisibleDots < totalImages;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 sm:h-10 sm:w-10 border-4 border-[#d4c5b0] border-t-transparent rounded-full mx-auto" />
          <p className="text-[#8a7a6a] mt-3 text-sm sm:text-base">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <>
      <main className="min-h-screen bg-[#faf8f6]">
        {/* ─── FULL-SCREEN HERO SLIDESHOW ────────────────────── */}
        <section className="relative h-screen w-full overflow-hidden">
          {imageUrls.length > 0 ? (
            <>
              <div className="absolute inset-0">
                <Image
                  src={imageUrls[currentImageIndex]}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2c1810]/80 via-[#2c1810]/30 to-transparent" />
              </div>

              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col justify-end pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-8 lg:px-16">
                <div className="max-w-4xl">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    {project.category && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white/20 backdrop-blur-sm text-white text-[10px] sm:text-xs font-medium tracking-wide border border-white/10">
                        <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        {project.category}
                      </span>
                    )}
                    {project.date && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white/20 backdrop-blur-sm text-white/80 text-[10px] sm:text-xs font-medium border border-white/10">
                        <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        {new Date(project.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-white leading-tight mb-2 sm:mb-4">
                    {project.title}
                  </h1>

                  {project.description && (
                    <p className="text-sm sm:text-base lg:text-lg text-white/80 max-w-2xl leading-relaxed mb-4 sm:mb-6 line-clamp-3 sm:line-clamp-none">
                      {project.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <Link href="/contact">
                      <button className="bg-white text-[#2c1810] hover:bg-gray-100 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-1.5 sm:gap-2">
                        <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Inquire
                      </button>
                    </Link>
                    <Link href="/projects">
                      <button className="border border-white/30 text-white hover:bg-white/10 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-1.5 sm:gap-2">
                        <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Back
                      </button>
                    </Link>
                    {imageUrls.length > 1 && (
                      <button
                        onClick={scrollToGallery}
                        className="border border-white/30 text-white hover:bg-white/10 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-1.5 sm:gap-2"
                      >
                        <LayoutGrid className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="hidden xs:inline">All Images</span>
                        <span className="xs:hidden">Gallery</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ─── SLIDE BAR (EXACTLY AS IN HERO SECTION) ─── */}
              {imageUrls.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center px-4">
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-2 sm:px-4 sm:py-2.5">
                    {/* Previous button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                      className="text-white/70 hover:text-white transition-colors p-1"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {/* Dots with ellipsis */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      
                      {visibleIndices.map((index) => (
                        <button
                          key={index}
                          onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                          className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                            index === currentImageIndex
                              ? 'w-6 sm:w-8 bg-[#d4c5b0]'
                              : 'w-4 sm:w-5 bg-white/50 hover:bg-white/80'
                          }`}
                        />
                      ))}
                      
                    </div>

                    {/* Next button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); goToNext(); }}
                      className="text-white/70 hover:text-white transition-colors p-1"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {/* Separator and extra controls (play/pause, zoom) */}
                    <div className="w-px h-4 sm:h-5 bg-white/20 mx-0.5 sm:mx-1" />
                    <button
                      onClick={(e) => { e.stopPropagation(); setIsAutoPlaying(!isAutoPlaying); }}
                      className="text-white/70 hover:text-white transition-colors p-1"
                    >
                      {isAutoPlaying ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); openLightbox(currentImageIndex); }}
                      className="text-white/70 hover:text-white transition-colors p-1"
                    >
                      <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <span className="text-white/70 text-xs sm:text-sm ml-0.5 sm:ml-1 min-w-[28px] sm:min-w-[40px] text-center">
                      {currentImageIndex + 1}/{imageUrls.length}
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-[#f0ebe6] flex items-center justify-center">
              <div className="text-center px-4">
                <FolderOpen className="h-16 w-16 sm:h-20 sm:w-20 text-[#b8a89a] mx-auto mb-3" />
                <p className="text-[#8a7a6a] text-sm">No images available</p>
              </div>
            </div>
          )}
        </section>

        {/* ─── THUMBNAIL GALLERY ────────────────────────────── */}
        {imageUrls.length > 1 && (
          <section ref={galleryRef} className="py-6 sm:py-12 px-3 sm:px-6 lg:px-8 bg-white border-t border-[#f0ebe6]">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-3 sm:mb-6">
                <h2 className="text-base sm:text-xl font-bold text-[#2c1810]">All Images</h2>
                <span className="text-xs sm:text-sm text-[#8a7a6a]">{imageUrls.length} images</span>
              </div>
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
                {imageUrls.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`relative aspect-square overflow-hidden cursor-pointer bg-[#f8f4f0] border-2 transition-all ${
                      index === currentImageIndex ? 'border-[#2c1810]' : 'border-transparent hover:border-[#d4c5b0]'
                    }`}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <Image
                      src={imageUrl}
                      alt={`${project.title} - ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 480px) 50vw, (max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
                    />
                    <div
                      className="absolute inset-0 bg-[#2c1810]/0 hover:bg-[#2c1810]/20 transition-all duration-300 flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(index);
                      }}
                    >
                      <ZoomIn className="h-4 w-4 sm:h-6 sm:w-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="absolute bottom-1 right-1 px-1 py-0.5 bg-[#2c1810]/70 text-white text-[7px] sm:text-[9px]">
                      {index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── PROJECT INFO ───────────────────────────────────── */}
        <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#faf8f6]">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white p-4 sm:p-6 border border-[#f0ebe6] text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#f8f4f0] flex items-center justify-center mx-auto mb-1 sm:mb-2">
                  <FolderOpen className="h-4 w-4 sm:h-5 sm:w-5 text-[#2c1810]" />
                </div>
                <h4 className="text-[10px] sm:text-xs font-medium text-[#8a7a6a] uppercase tracking-wider">Category</h4>
                <p className="text-sm sm:text-base font-medium text-[#2c1810] mt-0.5 sm:mt-1">{project.category || 'Interior Design'}</p>
              </div>

              <div className="bg-white p-4 sm:p-6 border border-[#f0ebe6] text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#f8f4f0] flex items-center justify-center mx-auto mb-1 sm:mb-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-[#2c1810]" />
                </div>
                <h4 className="text-[10px] sm:text-xs font-medium text-[#8a7a6a] uppercase tracking-wider">Completed</h4>
                <p className="text-sm sm:text-base font-medium text-[#2c1810] mt-0.5 sm:mt-1">
                  {project.date ? new Date(project.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                  }) : 'Recent'}
                </p>
              </div>

              <div className="bg-white p-4 sm:p-6 border border-[#f0ebe6] text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#f8f4f0] flex items-center justify-center mx-auto mb-1 sm:mb-2">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-[#2c1810]" />
                </div>
                <h4 className="text-[10px] sm:text-xs font-medium text-[#8a7a6a] uppercase tracking-wider">Status</h4>
                <p className="text-sm sm:text-base font-medium text-[#2c1810] mt-0.5 sm:mt-1">Completed</p>
              </div>
            </div>

            {project.description && (
              <div className="mt-6 sm:mt-8 bg-white p-4 sm:p-8 border border-[#f0ebe6]">
                <h3 className="text-base sm:text-lg font-bold text-[#2c1810] mb-2 sm:mb-3">About This Project</h3>
                <p className="text-sm sm:text-base text-[#8a7a6a] leading-relaxed">
                  {project.description}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ─── CTA ────────────────────────────────────────────── */}
        <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#f0ebe6]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xl sm:text-3xl font-bold text-[#2c1810] mb-2 sm:mb-3">
              Inspired by This Design?
            </h2>
            <p className="text-sm sm:text-base text-[#8a7a6a] mb-4 sm:mb-6">
              Let's discuss how I can bring your vision to life.
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              <Link href="/contact">
                <button className="bg-[#2c1810] hover:bg-[#3d2820] text-white px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-300">
                  Start Your Project
                </button>
              </Link>
              <Link href="/projects">
                <button className="border border-[#f0ebe6] text-[#2c1810] hover:bg-[#f8f4f0] px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-300">
                  View All Projects
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ─── LIGHTBOX ──────────────────────────────────────────── */}
      {isLightboxOpen && imageUrls.length > 0 && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-2 sm:p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white/70 hover:text-white transition-colors z-10"
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          <div
            className="relative w-full max-w-6xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-black">
              <Image
                src={imageUrls[currentImageIndex]}
                alt={project.title}
                width={1200}
                height={800}
                className="w-full h-auto max-h-[80vh] object-contain"
                priority
              />
            </div>

            {imageUrls.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 sm:p-3 transition-all duration-300"
                >
                  <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 sm:p-3 transition-all duration-300"
                >
                  <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
                </button>
              </>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="text-sm sm:text-xl font-bold">{project.title}</h3>
                  {project.category && (
                    <p className="text-xs sm:text-sm text-[#d4c5b0]">{project.category}</p>
                  )}
                </div>
                <span className="text-xs sm:text-sm">
                  {currentImageIndex + 1} / {imageUrls.length}
                </span>
              </div>
              <div className="flex gap-1 mt-2 sm:mt-3 overflow-x-auto pb-1">
                {imageUrls.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-1 transition-all duration-300 flex-shrink-0 ${
                      index === currentImageIndex
                        ? 'w-4 sm:w-8 bg-[#d4c5b0]'
                        : 'w-2 sm:w-4 bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}