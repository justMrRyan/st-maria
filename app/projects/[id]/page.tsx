// app/projects/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { notFound, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  FolderOpen,
  Sparkles,
  Heart,
  Share2,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Pause
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
  const router = useRouter();

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

  // Sliding dot window logic
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
          <div className="animate-spin h-10 w-10 border-4 border-[#d4c5b0] border-t-transparent rounded-full mx-auto" />
          <p className="text-[#8a7a6a] mt-4">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) return null;

  const featuredImage = imageUrls[0] || null;
  const galleryImages = imageUrls.slice(1) || [];

  return (
    <>
      <main className="min-h-screen bg-[#faf8f6]">
        {/* ─── HERO WITH SLIDESHOW ────────────────────────────── */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2c1810]/5 via-[#faf8f6] to-[#f0ebe6]" />
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#d4c5b0]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#e8ddd0]/20 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content – unchanged */}
              <div className="space-y-8">
                <div className="flex flex-wrap items-center gap-3">
                  {project.category && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#2c1810] text-white text-sm font-medium tracking-wide">
                      <Sparkles className="h-4 w-4" />
                      {project.category}
                    </span>
                  )}
                  {project.date && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-[#f0ebe6] text-[#8a7a6a] text-sm font-medium">
                      <Calendar className="h-4 w-4" />
                      {new Date(project.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </span>
                  )}
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="text-[#2c1810]">{project.title}</span>
                </h1>

                {project.description && (
                  <p className="text-lg sm:text-xl text-[#8a7a6a] leading-relaxed max-w-lg">
                    {project.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 pt-4">
                  <Link href="/contact">
                    <button className="bg-[#2c1810] hover:bg-[#3d2820] text-white gap-2 px-8 py-4 text-base transition-all duration-300 flex items-center">
                      <Heart className="h-5 w-5" />
                      Inquire About This Project
                    </button>
                  </Link>
                  <Link href="/projects">
                    <button className="border border-[#f0ebe6] text-[#2c1810] hover:bg-[#f8f4f0] hover:border-[#b8a89a] px-8 py-4 text-base flex items-center">
                      <ArrowLeft className="h-5 w-5 mr-2" />
                      Back
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right Content - Slideshow – UPDATED with sliding dots */}
              <div className="relative">
                {imageUrls.length > 0 ? (
                  <div className="relative aspect-[4/3] bg-[#f8f4f0] overflow-hidden group">
                    {/* Main Image – unchanged */}
                    <div
                      className="relative w-full h-full cursor-pointer"
                      onClick={() => openLightbox(currentImageIndex)}
                    >
                      <Image
                        src={imageUrls[currentImageIndex]}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-1000"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2c1810]/20 via-transparent to-transparent" />
                    </div>

                    {/* Image Navigation Arrows (on image) – kept as before */}
                    {imageUrls.length > 1 && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#2c1810] p-2 transition-all duration-300 opacity-0 group-hover:opacity-100"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); goToNext(); }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#2c1810] p-2 transition-all duration-300 opacity-0 group-hover:opacity-100"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </button>
                      </>
                    )}

                    {/* ─── NEW SLIDING DOT INDICATOR + CONTROLS ─── */}
                    {imageUrls.length > 1 && (
                      <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center px-4">
                        <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1.5 sm:px-3 sm:py-2">
                          {/* Left arrow */}
                          <button
                            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                            className="text-white/70 hover:text-white transition-colors p-0.5 sm:p-1"
                            aria-label="Previous"
                          >
                            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>

                          {/* Dots with ellipsis */}
                          <div className="flex items-center gap-1 sm:gap-1.5 mx-1">
                            {hasMoreBefore && (
                              <span className="text-white/50 text-xs">…</span>
                            )}
                            {visibleIndices.map((index) => (
                              <button
                                key={index}
                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                                  index === currentImageIndex
                                    ? 'w-5 sm:w-7 bg-[#d4c5b0]'
                                    : 'w-3 sm:w-4 bg-white/50 hover:bg-white/80'
                                }`}
                              />
                            ))}
                            {hasMoreAfter && (
                              <span className="text-white/50 text-xs">…</span>
                            )}
                          </div>

                          {/* Right arrow */}
                          <button
                            onClick={(e) => { e.stopPropagation(); goToNext(); }}
                            className="text-white/70 hover:text-white transition-colors p-0.5 sm:p-1"
                            aria-label="Next"
                          >
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>

                          {/* Separator */}
                          <div className="w-px h-5 bg-white/20 mx-1" />

                          {/* Play/Pause */}
                          <button
                            onClick={(e) => { e.stopPropagation(); setIsAutoPlaying(!isAutoPlaying); }}
                            className="text-white/70 hover:text-white transition-colors p-0.5 sm:p-1"
                          >
                            {isAutoPlaying ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                          </button>

                          {/* Zoom */}
                          <button
                            onClick={(e) => { e.stopPropagation(); openLightbox(currentImageIndex); }}
                            className="text-white/70 hover:text-white transition-colors p-0.5 sm:p-1"
                          >
                            <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>

                          {/* Counter */}
                          <span className="text-white/70 text-xs sm:text-sm ml-1">
                            {currentImageIndex + 1}/{imageUrls.length}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-[#f0ebe6] flex items-center justify-center">
                    <Sparkles className="h-16 w-16 text-[#b8a89a]" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ─── GALLERY GRID ────────────────────────────────────── */}
        {/* (unchanged – keep as is) */}
        {galleryImages.length > 0 && (
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#2c1810] mb-4">
                  Project Gallery
                </h2>
                <p className="text-[#8a7a6a] max-w-2xl mx-auto">
                  Explore the details and craftsmanship behind this beautiful space
                </p>
                <div className="w-20 h-1 bg-[#d4c5b0] mx-auto mt-4" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((imageUrl: string, index: number) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden cursor-pointer bg-[#f8f4f0]"
                    onClick={() => openLightbox(index + 1)}
                  >
                    <div className="aspect-[4/3]">
                      <Image
                        src={imageUrl}
                        alt={`${project.title} - Image ${index + 2}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                    </div>
                    <div className="absolute inset-0 bg-[#2c1810]/0 group-hover:bg-[#2c1810]/40 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <ZoomIn className="h-8 w-8 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── PROJECT DETAILS ────────────────────────────────── */}
        {/* (unchanged) */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#faf8f6]">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 border border-[#f0ebe6] text-center">
                <div className="w-12 h-12 bg-[#f8f4f0] flex items-center justify-center mx-auto mb-3">
                  <FolderOpen className="h-6 w-6 text-[#2c1810]" />
                </div>
                <h4 className="text-sm font-medium text-[#8a7a6a]">Category</h4>
                <p className="text-lg font-bold text-[#2c1810] mt-1">{project.category || 'Interior Design'}</p>
              </div>

              <div className="bg-white p-6 border border-[#f0ebe6] text-center">
                <div className="w-12 h-12 bg-[#f8f4f0] flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-[#2c1810]" />
                </div>
                <h4 className="text-sm font-medium text-[#8a7a6a]">Completed</h4>
                <p className="text-lg font-bold text-[#2c1810] mt-1">
                  {project.date ? new Date(project.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                  }) : 'Recent'}
                </p>
              </div>

              <div className="bg-white p-6 border border-[#f0ebe6] text-center">
                <div className="w-12 h-12 bg-[#f8f4f0] flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-6 w-6 text-[#2c1810]" />
                </div>
                <h4 className="text-sm font-medium text-[#8a7a6a]">Status</h4>
                <p className="text-lg font-bold text-[#2c1810] mt-1">Completed</p>
              </div>
            </div>

            {project.description && (
              <div className="mt-12 bg-white p-8 border border-[#f0ebe6]">
                <h3 className="text-xl font-bold text-[#2c1810] mb-4">About This Project</h3>
                <p className="text-[#8a7a6a] leading-relaxed text-lg">
                  {project.description}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ─── CTA ────────────────────────────────────────────── */}
        {/* (unchanged) */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#2c1810] to-[#3d2820] p-12 text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 mb-6">
                  <Sparkles className="h-4 w-4 text-[#d4c5b0]" />
                  <span className="text-sm font-medium text-[#d4c5b0]">Let's Create Together</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Inspired by This Design?
                </h2>
                <p className="text-[#d4c5b0] mb-8 max-w-2xl mx-auto">
                  Let's discuss how I can bring your vision to life with the same attention to detail and elegance.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/contact">
                    <button className="bg-white text-[#2c1810] hover:bg-gray-100 px-8 py-4 text-base transition-all duration-300 flex items-center">
                      Start Your Project
                      <ArrowLeft className="h-5 w-5 ml-2" />
                    </button>
                  </Link>
                  <Link href="/projects">
                    <button className="border border-white/30 text-white hover:bg-white/10 px-8 py-4 text-base transition-all duration-300">
                      Explore More Projects
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── LIGHTBOX ────────────────────────────────────────────── */}
      {/* (unchanged) */}
      {isLightboxOpen && imageUrls.length > 0 && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
          >
            <X className="w-8 h-8" />
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
              />
            </div>

            {imageUrls.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 transition-all duration-300"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 transition-all duration-300"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  {project.category && (
                    <p className="text-sm text-[#d4c5b0]">{project.category}</p>
                  )}
                </div>
                <span className="text-sm">
                  {currentImageIndex + 1} / {imageUrls.length}
                </span>
              </div>
              <div className="flex gap-1.5 mt-3">
                {imageUrls.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-1 transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'w-8 bg-[#d4c5b0]'
                        : 'w-4 bg-white/30 hover:bg-white/50'
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