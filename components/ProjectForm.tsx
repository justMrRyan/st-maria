// components/ProjectForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import ImageUpload from './ImageUpload';
import { toast, Toaster } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { PROJECT_CATEGORIES } from '@/lib/constants';
import { Loader2 } from 'lucide-react';

const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  date: z.string().min(1, 'Please select a date'),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: any;
}

export default function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(
      project?.images?.map((img: any) => typeof img === 'string' ? img : img.url) || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      category: project?.category || '',
      date: project?.date || '',
    },
  });

  const handleImageAdded = (url: string) => {
    setImages((prev) => [...prev, url]);
  };

  const handleRemoveImage = (url: string) => {
    setImages((prev) => prev.filter((img) => img !== url));
  };

  const onSubmit = async (data: ProjectFormData) => {
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setIsSubmitting(true);

    try {
      const allowedUserId = process.env.NEXT_PUBLIC_ALLOWED_USER_ID;

      const projectData = {
        user_id: allowedUserId,
        title: data.title,
        description: data.description,
        category: data.category,
        date: data.date || new Date().toISOString(),
        images: images,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (project) {
        // Update existing project
        result = await supabase
            .from('projects')
            .update(projectData)
            .eq('id', project.id)
            .select()
            .single();
      } else {
        // Create new project
        result = await supabase
            .from('projects')
            .insert(projectData)
            .select()
            .single();
      }

      if (result.error) throw result.error;

      toast.success(
          project ? 'Project updated successfully' : 'Project created successfully'
      );
      router.push('/dashboard/projects');
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast.error(error.message || 'Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <>
        <Toaster position="top-right" />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[#2c1810] mb-1.5">
              Title <span className="text-[#c0392b]">*</span>
            </label>
            <input
                {...register('title')}
                type="text"
                placeholder="Project title"
                className="w-full px-4 py-2 bg-white border border-[#f0ebe6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c1810] focus:border-transparent transition-shadow text-[#2c1810] placeholder:text-[#b8a89a]"
            />
            {errors.title && (
                <p className="text-[#c0392b] text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-[#2c1810] mb-1.5">
              Category <span className="text-[#c0392b]">*</span>
            </label>
            <select
                {...register('category')}
                className="w-full px-4 py-2 bg-white border border-[#f0ebe6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c1810] focus:border-transparent text-[#2c1810]"
            >
              <option value="">Select a category</option>
              {PROJECT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
              ))}
            </select>
            {errors.category && (
                <p className="text-[#c0392b] text-sm mt-1">
                  {errors.category.message}
                </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-[#2c1810] mb-1.5">
              Date <span className="text-[#c0392b]">*</span>
            </label>
            <input
                {...register('date')}
                type="date"
                className="w-full px-4 py-2 bg-white border border-[#f0ebe6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c1810] focus:border-transparent text-[#2c1810]"
            />
            {errors.date && (
                <p className="text-[#c0392b] text-sm mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#2c1810] mb-1.5">
              Description <span className="text-[#c0392b]">*</span>
            </label>
            <textarea
                {...register('description')}
                placeholder="Project description"
                rows={5}
                className="w-full px-4 py-2 bg-white border border-[#f0ebe6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c1810] focus:border-transparent resize-y text-[#2c1810] placeholder:text-[#b8a89a]"
            />
            {errors.description && (
                <p className="text-[#c0392b] text-sm mt-1">
                  {errors.description.message}
                </p>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-[#2c1810] mb-1.5">
              Images <span className="text-[#c0392b]">*</span>
            </label>
            <ImageUpload
                onImageAdded={handleImageAdded}
                existingImages={images}
                onRemoveImage={handleRemoveImage}
            />
            {images.length === 0 && (
                <p className="text-[#c0392b] text-sm mt-1">Please upload at least one image</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-[#f0ebe6]">
            <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#2c1810] hover:bg-[#3d2820] text-white gap-2 min-w-[140px]"
            >
              {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
              ) : (
                  project ? 'Update Project' : 'Create Project'
              )}
            </Button>
            <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/projects')}
                className="border-[#f0ebe6] text-[#2c1810] hover:bg-[#f8f4f0]"
            >
              Cancel
            </Button>
          </div>
        </form>
      </>
  );
}