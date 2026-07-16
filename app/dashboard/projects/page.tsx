// app/dashboard/projects/route.ts
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { toast, Toaster } from 'sonner';
import { Plus, Pencil, Trash2, Eye, Calendar, FolderOpen, Sparkles } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  images: any[];
  created_at: string;
  user_id: string;
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
      const allowedUserId = process.env.NEXT_PUBLIC_ALLOWED_USER_ID;

      const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', allowedUserId)
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
      fetchProjects();
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

  return (
      <>
        <Toaster position="top-right" />
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#2c1810]">Projects</h1>
              <p className="text-[#8a7a6a] mt-1">
                Manage your portfolio projects
              </p>
            </div>
            <Link href="/dashboard/projects/new">
              <Button className="bg-[#2c1810] hover:bg-[#3d2820] text-white gap-2">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </Link>
          </div>

          {/* Projects Grid */}
          {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin">
                  <div className="h-8 w-8 border-4 border-[#2c1810] border-t-transparent rounded-full" />
                </div>
              </div>
          ) : projects.length === 0 ? (
              <div className="bg-[#f8f4f0] border border-[#f0ebe6] rounded-xl p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="rounded-full bg-white p-4 shadow-sm">
                    <Sparkles className="h-8 w-8 text-[#8a7a6a]" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-[#2c1810]">No projects yet</p>
                    <p className="text-sm text-[#8a7a6a] mt-1">
                      Start building your portfolio by creating your first project.
                    </p>
                  </div>
                  <Link href="/dashboard/projects/new">
                    <Button className="bg-[#2c1810] hover:bg-[#3d2820] text-white gap-2">
                      <Plus className="h-4 w-4" />
                      Create Your First Project
                    </Button>
                  </Link>
                </div>
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => {
                  const imageUrl = getImageUrl(project.images);
                  return (
                      <div
                          key={project.id}
                          className="group bg-white rounded-xl border border-[#f0ebe6] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
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
                        <span className="px-2.5 py-1 bg-[#2c1810]/80 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                          {project.category}
                        </span>
                              </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-3">
                          <div>
                            <h3 className="font-semibold text-lg text-[#2c1810] line-clamp-1 group-hover:text-[#8a7a6a] transition-colors">
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
                              <Button variant="outline" size="sm" className="w-full gap-1 border-[#f0ebe6] text-[#2c1810] hover:bg-[#f8f4f0]">
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                              </Button>
                            </Link>
                            <Link
                                href={`/projects/${project.id}`}
                                target="_blank"
                                className="flex-1"
                            >
                              <Button variant="outline" size="sm" className="w-full gap-1 border-[#f0ebe6] text-[#2c1810] hover:bg-[#f8f4f0]">
                                <Eye className="h-3.5 w-3.5" />
                                View
                              </Button>
                            </Link>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(project.id)}
                                disabled={deleting === project.id}
                                className="gap-1 bg-[#c0392b] hover:bg-[#e74c3c]"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              {deleting === project.id ? '...' : ''}
                            </Button>
                          </div>
                        </div>
                      </div>
                  );
                })}
              </div>
          )}

          {projects.length > 0 && (
              <div className="text-sm text-[#b8a89a] text-center pt-4 border-t border-[#f0ebe6]">
                Showing {projects.length} project{projects.length !== 1 ? 's' : ''}
              </div>
          )}
        </div>
      </>
  );
}