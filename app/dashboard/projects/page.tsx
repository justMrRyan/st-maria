'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Calendar, FolderOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface Project {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    date: string | null;
    images: any[] | null;
}

export default function ProjectDetailPage() {
    const params = useParams();
    const projectId = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState<Project | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!projectId) return;

        const fetchProject = async () => {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('id', projectId)
                    .single();

                if (error) throw error;
                setProject(data);
            } catch (err: any) {
                console.error('Error fetching project:', err);
                setError(err.message ?? 'Failed to load project');
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    const extractImageUrls = (images: any): string[] => {
        if (!images) return [];
        let arr = images;
        if (typeof arr === 'string') {
            try {
                arr = JSON.parse(arr);
            } catch {
                return [];
            }
        }
        if (!Array.isArray(arr)) return [];
        return arr
            .map((img) => (typeof img === 'string' ? img : img?.url ?? null))
            .filter((url): url is string => Boolean(url));
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-[#faf8f6]">
                <Loader2 className="h-8 w-8 text-[#2c1810] animate-spin" />
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#faf8f6] gap-4 px-4">
                <p className="text-[#8a7a6a]">{error ?? 'Project not found'}</p>
                <Link
                    href="/projects"
                    className="border border-[#f0ebe6] text-[#2c1810] hover:bg-[#f8f4f0] px-6 py-2.5 text-sm transition-all duration-300 flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to projects
                </Link>
            </div>
        );
    }

    const images = extractImageUrls(project.images);
    const hero = images[0];
    const rest = images.slice(1);

    return (
        <article className="bg-[#faf8f6] min-h-screen">
            <div className="max-w-5xl mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 text-sm text-[#8a7a6a] hover:text-[#2c1810] transition-colors mb-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        All projects
                    </Link>

                    <header className="mb-10">
                        <h1 className="text-4xl font-bold text-[#2c1810] mb-4">
                            {project.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-sm text-[#8a7a6a]">
                            {project.category && (
                                <span className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" />
                                    {project.category}
                </span>
                            )}
                            {project.date && (
                                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                                    {new Date(project.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                </span>
                            )}
                        </div>
                    </header>

                    {project.description && (
                        <p className="text-[#2c1810]/80 leading-relaxed mb-12 whitespace-pre-line">
                            {project.description}
                        </p>
                    )}

                    {hero && (
                        <div className="relative w-full aspect-[16/10] mb-6 bg-[#f0ebe6]">
                            <Image
                                src={hero}
                                alt={project.title}
                                fill
                                priority
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 1024px"
                            />
                        </div>
                    )}

                    {rest.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {rest.map((url, i) => (
                                <div
                                    key={`${url}-${i}`}
                                    className="relative w-full aspect-square bg-[#f0ebe6]"
                                >
                                    <Image
                                        src={url}
                                        alt={`${project.title} — ${i + 2}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 100vw, 50vw"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </article>
    );
}