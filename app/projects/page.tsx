// app/projects/route.ts
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { Sparkles, FolderOpen } from 'lucide-react';

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

    if (loading) {
        return (
            <>
                <main className="min-h-screen bg-[#faf8f6] pt-20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin h-10 w-10 border-4 border-[#d4c5b0] border-t-transparent rounded-full mx-auto" />
                        <p className="text-[#8a7a6a] mt-4">Loading projects...</p>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>

            <main className="min-h-screen bg-[#faf8f6]">
                {/* ─── HERO ────────────────────────────────────────────────── */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#f8f4f0] via-white to-[#f0ebe6]">
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

                {/* ─── MASONRY GALLERY ────────────────────────────────────── */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        {projects.length === 0 ? (
                            <div className="text-center py-20">
                                <FolderOpen className="h-16 w-16 text-[#b8a89a] mx-auto mb-4" />
                                <p className="text-lg font-medium text-[#2c1810]">No projects yet</p>
                                <p className="text-sm text-[#8a7a6a]">Check back soon.</p>
                            </div>
                        ) : (
                            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                                {projects.map((project, index) => {
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
        </>
    );
}