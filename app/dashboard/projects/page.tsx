// app/dashboard/projects/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { toast, Toaster } from 'sonner';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye, Calendar, FolderOpen, Sparkles } from 'lucide-react';

interface Project {
    id: string;
    title: string;
    description: string;
    category: string;
    date: string;
    images: any[];
    created_at: string;
}

export default function DashboardProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            // Fetch all projects (no user_id filter)
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
            toast.error('Failed to fetch projects');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (projectId: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        setDeleting(projectId);
        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', projectId);

            if (error) throw error;

            toast.success('Project deleted successfully');
            await fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error('Failed to delete project');
        } finally {
            setDeleting(null);
        }
    };

    const getImageUrl = (images: any[]) => {
        if (!images || images.length === 0) return null;
        const firstImage = images[0];
        if (typeof firstImage === 'string') return firstImage;
        if (typeof firstImage === 'object' && firstImage.url) return firstImage.url;
        return null;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-[#d4c5b0] border-t-transparent" />
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" />
            <div className="space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-[#2c1810]">Projects</h1>
                        <p className="text-[#8a7a6a] mt-1">
                            Manage your portfolio projects
                        </p>
                    </div>
                    <Link href="/dashboard/projects/new">
                        <button className="bg-[#2c1810] hover:bg-[#3d2820] text-white px-6 py-2.5 flex items-center gap-2 text-sm font-medium transition-all duration-300">
                            <Plus className="h-4 w-4" />
                            New Project
                        </button>
                    </Link>
                </motion.div>

                {projects.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-[#f8f4f0] border border-[#f0ebe6] p-12 text-center"
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="bg-white p-4 shadow-sm">
                                <Sparkles className="h-8 w-8 text-[#8a7a6a]" />
                            </div>
                            <div>
                                <p className="text-lg font-medium text-[#2c1810]">No projects yet</p>
                                <p className="text-sm text-[#8a7a6a] mt-1">
                                    Start building your portfolio by creating your first project.
                                </p>
                            </div>
                            <Link href="/dashboard/projects/new">
                                <button className="bg-[#2c1810] hover:bg-[#3d2820] text-white px-6 py-2 text-sm font-medium transition-all duration-300 flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create Your First Project
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {projects.map((project, index) => {
                            const imageUrl = getImageUrl(project.images);
                            return (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className="group bg-white border border-[#f0ebe6] overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#d4c5b0]"
                                >
                                    {/* Image */}
                                    <div className="relative w-full aspect-[4/3] bg-[#f8f4f0] overflow-hidden">
                                        {imageUrl ? (
                                            <Image
                                                src={imageUrl}
                                                alt={project.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[#b8a89a]">
                                                <FolderOpen className="h-12 w-12" />
                                            </div>
                                        )}
                                        {project.category && (
                                            <div className="absolute top-3 left-3">
                                                <span className="px-2.5 py-1 bg-[#2c1810]/80 text-white text-xs font-medium backdrop-blur-sm">
                                                    {project.category}
                                                </span>
                                            </div>
                                        )}
                                        {/* View Overlay */}
                                        <Link
                                            href={`/projects/${project.id}`}
                                            target="_blank"
                                            className="absolute inset-0 bg-[#2c1810]/0 group-hover:bg-[#2c1810]/30 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100"
                                        >
                                            <span className="px-4 py-2 bg-white text-[#2c1810] text-sm font-medium transform -translate-y-2 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-2">
                                                <Eye className="h-4 w-4" />
                                                View Project
                                            </span>
                                        </Link>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 space-y-3">
                                        <div>
                                            <h3 className="font-semibold text-lg text-[#2c1810] line-clamp-1 group-hover:text-[#d4c5b0] transition-colors">
                                                {project.title}
                                            </h3>
                                            {project.date && (
                                                <div className="flex items-center gap-1 text-xs text-[#b8a89a] mt-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(project.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        {project.description && (
                                            <p className="text-sm text-[#8a7a6a] line-clamp-2">
                                                {project.description}
                                            </p>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2 border-t border-[#f0ebe6]">
                                            <Link
                                                href={`/dashboard/projects/${project.id}/edit`}
                                                className="flex-1"
                                            >
                                                <button className="w-full border border-[#f0ebe6] text-[#2c1810] hover:bg-[#f8f4f0] px-3 py-1.5 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-1">
                                                    <Pencil className="h-3.5 w-3.5" />
                                                    Edit
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                disabled={deleting === project.id}
                                                className="flex-1 bg-[#c0392b] hover:bg-[#e74c3c] text-white px-3 py-1.5 text-sm font-medium transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-1"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                {deleting === project.id ? '...' : 'Delete'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}

                {projects.length > 0 && (
                    <div className="text-center text-sm text-[#b8a89a] pt-4 border-t border-[#f0ebe6]">
                        Showing <span className="font-medium text-[#2c1810]">{projects.length}</span> project{projects.length !== 1 ? 's' : ''}
                    </div>
                )}
            </div>
        </>
    );
}