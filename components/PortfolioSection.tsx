// components/PortfolioSection.tsx
'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { FolderOpen } from "lucide-react";

interface Project {
    id: string;
    title: string;
    description: string;
    category: string;
    images: any[];
    date: string;
}

interface PortfolioSectionProps {
    projects: Project[];
}

function getImageUrl(images: any[]): string | null {
    if (!images || images.length === 0) return null;
    const firstImage = images[0];
    if (typeof firstImage === 'string') return firstImage;
    if (typeof firstImage === 'object' && firstImage.url) return firstImage.url;
    return null;
}

export function PortfolioSection({ projects }: PortfolioSectionProps) {
    const displayProjects = projects.slice(0, 9);

    if (projects.length === 0) return null;

    return (
        <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#faf8f6]">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <p className="text-sm tracking-[0.3em] uppercase text-[#d4c5b0] mb-3 font-medium">
                        Portfolio
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#2c1810]">
                        Selected <span className="italic text-[#d4c5b0]">Projects</span>
                    </h2>
                    <div className="w-16 h-1 bg-[#d4c5b0] mx-auto mt-4 rounded-full" />
                </motion.div>

                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                    {displayProjects.map((project, index) => {
                        const imageUrl = getImageUrl(project.images);
                        return (
                            <Link href={`/projects/${project.id}`} key={project.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.08 }}
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

                {projects.length > 9 && (
                    <div className="text-center mt-12">
                        <Link href="/projects">
                            <button className="px-8 py-3.5 bg-[#2c1810] text-white hover:bg-[#3d2820] transition-all duration-300 font-medium text-sm tracking-wide">
                                View All Projects
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}