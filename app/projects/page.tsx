// app/projects/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { Sparkles, FolderOpen, X } from 'lucide-react';

interface Project {
    id: string;
    title: string;
    description: string;
    category: string;
    images: any[];
    date: string;
}

function getImageUrl(images: any[]): string | null {
    if (!images || images.length === 0) return null;
    const firstImage = images[0];
    if (typeof firstImage === 'string') return firstImage;
    if (typeof firstImage === 'object' && firstImage.url) return firstImage.url;
    return null;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .order('date', { ascending: false });

                if (error) throw error;
                setProjects(data || []);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Extract unique categories
    const allCategories = Array.from(
        new Set(projects.map((p) => p.category).filter(Boolean))
    ).sort();

    // Filter projects by selected category
    const filteredProjects = selectedCategory
        ? projects.filter((p) => p.category === selectedCategory)
        : projects;

    if (loading) {
        return (
            <main className="min-h-screen bg-[#faf8f6] pt-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-10 w-10 border-4 border-[#d4c5b0] border-t-transparent rounded-full mx-auto" />
                    <p className="text-[#8a7a6a] mt-4">Loading projects...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#faf8f6]">
            {/* ─── HERO ────────────────────────────────────────────────── */}
            <section className="pt-20 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#f8f4f0] via-white to-[#f0ebe6]">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-sm tracking-[0.3em] uppercase text-[#d4c5b0] mb-3 font-medium">
                        Portfolio
                    </p>
                    <h1 className="text-4xl sm:text-5xl font-bold text-[#2c1810]">
                        Selected <span className="italic text-[#d4c5b0]">Projects</span>
                    </h1>
                    <div className="w-16 h-1 bg-[#d4c5b0] mx-auto mt-4 rounded-full" />
                </div>
            </section>

            {/* ─── CATEGORY FILTER ───────────────────────────────────── */}
            <section className="py-6 px-4 sm:px-6 lg:px-8 border-b border-[#f0ebe6] bg-white/80 backdrop-blur-sm sticky top-20 z-10">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2 sm:gap-3">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-300 ${
                            selectedCategory === null
                                ? 'bg-[#2c1810] text-white shadow-md'
                                : 'bg-[#f8f4f0] text-[#8a7a6a] hover:bg-[#f0ebe6] hover:text-[#2c1810]'
                        }`}
                    >
                        All
                    </button>
                    {allCategories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-300 whitespace-nowrap ${
                                selectedCategory === cat
                                    ? 'bg-[#2c1810] text-white shadow-md'
                                    : 'bg-[#f8f4f0] text-[#8a7a6a] hover:bg-[#f0ebe6] hover:text-[#2c1810]'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                    {selectedCategory && (
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="ml-auto text-xs text-[#8a7a6a] hover:text-[#2c1810] flex items-center gap-1 transition-colors"
                        >
                            <X className="h-3 w-3" />
                            Clear filter
                        </button>
                    )}
                </div>
                
            </section>

            {/* ─── MASONRY GALLERY ────────────────────────────────────── */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {filteredProjects.length === 0 ? (
                        <div className="text-center py-20">
                            <FolderOpen className="h-16 w-16 text-[#b8a89a] mx-auto mb-4" />
                            <p className="text-lg font-medium text-[#2c1810]">No projects in this category</p>
                            <p className="text-sm text-[#8a7a6a]">Try selecting a different category or view all projects.</p>
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="mt-4 px-6 py-2 bg-[#2c1810] text-white text-sm font-medium rounded-full hover:bg-[#3d2820] transition-colors"
                            >
                                View All Projects
                            </button>
                        </div>
                    ) : (
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                            {filteredProjects.map((project, index) => {
                                const imageUrl = getImageUrl(project.images);
                                return (
                                    <Link href={`/projects/${project.id}`} key={project.id}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 40 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: index * 0.05 }}
                                            className="group relative overflow-hidden break-inside-avoid cursor-pointer"
                                        >
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={project.title}
                                                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full aspect-[3/4] bg-[#f0ebe6] flex items-center justify-center">
                                                    <FolderOpen className="h-12 w-12 text-[#b8a89a]" />
                                                </div>
                                            )}

                                            {/* Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#2c1810]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                                {project.category && (
                                                    <p className="text-xs tracking-[0.2em] uppercase text-[#d4c5b0]">
                                                        {project.category}
                                                    </p>
                                                )}
                                                <h3 className="text-xl font-medium text-white mt-1">{project.title}</h3>
                                            </div>
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}