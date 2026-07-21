// app/dashboard/projects/[id]/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { toast, Toaster } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Sparkles, Calendar, FolderOpen, FileText, ImageIcon, X, Upload, Save } from 'lucide-react';
import imageCompression from 'browser-image-compression'; // <-- ADDED

export default function EditProject() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [project, setProject] = useState<any>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        date: '',
    });
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

    const categories = [
        'Residential',
        'Commercial',
        'Luxury',
        'Modern',
        'Classic',
        'Minimalist',
        'Industrial',
        'Scandinavian',
        'Mediterranean',
        'Contemporary',
        'Traditional',
        'Eclectic',
    ];

    useEffect(() => {
        if (projectId) {
            fetchProject();
        }
    }, [projectId]);

    const fetchProject = async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single();

            if (error) throw error;

            setProject(data);
            setFormData({
                title: data.title || '',
                description: data.description || '',
                category: data.category || '',
                date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
            });

            // Parse images
            let images = data.images || [];
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
            setExistingImages(images.filter(Boolean));
        } catch (error) {
            console.error('Error fetching project:', error);
            toast.error('Failed to fetch project');
            router.push('/dashboard/projects');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const validFiles = files.filter(file => {
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} is too large (max 5MB)`);
                return false;
            }
            return true;
        });

        const previews = validFiles.map(file => URL.createObjectURL(file));
        setNewImagePreviews([...newImagePreviews, ...previews]);
        setNewImages([...newImages, ...validFiles]);
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(existingImages.filter((_, i) => i !== index));
    };

    const removeNewImage = (index: number) => {
        setNewImages(newImages.filter((_, i) => i !== index));
        setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            let uploadedImages = [...existingImages];

            // Upload new images (with compression)
            if (newImages.length > 0) {
                for (const file of newImages) {
                    // ---- COMPRESSION ----
                    const options = {
                        maxSizeMB: 0.5,
                        maxWidthOrHeight: 1200,
                        useWebWorker: true,
                        fileType: file.type,
                    };
                    const compressedFile = await imageCompression(file, options);
                    // --------------------

                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                    const filePath = `projects/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('MERYAMSWILEM')
                        .upload(filePath, compressedFile, {
                            cacheControl: '3600',
                            upsert: false,
                            contentType: compressedFile.type,
                        });

                    if (uploadError) {
                        console.error('Upload error:', uploadError);
                        toast.error(`Failed to upload ${file.name}`);
                        continue;
                    }

                    const { data: { publicUrl } } = supabase.storage
                        .from('MERYAMSWILEM')
                        .getPublicUrl(filePath);

                    uploadedImages.push(publicUrl);
                }
            }

            // Update project WITHOUT user_id
            const { error } = await supabase
                .from('projects')
                .update({
                    title: formData.title,
                    description: formData.description,
                    category: formData.category,
                    date: formData.date || new Date().toISOString(),
                    images: uploadedImages,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', projectId);

            if (error) throw error;

            toast.success('Project updated successfully!');
            router.push('/dashboard/projects');
        } catch (error: any) {
            console.error('Error updating project:', error);
            toast.error(error.message || 'Failed to update project');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 border-4 border-[#d4c5b0] border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" />
            <div className="space-y-8 max-w-3xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-4"
                >
                    <Link href="/dashboard/projects">
                        <button className="border border-[#f0ebe6] text-[#2c1810] hover:bg-[#f8f4f0] px-4 py-2 text-sm transition-all duration-300 flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-[#2c1810]">Edit Project</h1>
                        <p className="text-[#8a7a6a] text-sm mt-1">Update your project details</p>
                    </div>
                </motion.div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white border border-[#f0ebe6] p-8"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-xs tracking-[0.2em] uppercase text-[#8a7a6a] mb-2 font-medium">
                                Title <span className="text-[#c0392b]">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-transparent border-b border-[#f0ebe6] py-2 text-[#2c1810] focus:border-[#d4c5b0] focus:outline-none transition-colors placeholder:text-[#b8a89a]"
                                placeholder="Project title"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-xs tracking-[0.2em] uppercase text-[#8a7a6a] mb-2 font-medium">
                                Category
                            </label>
                            <div className="relative">
                                <FolderOpen className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-[#b8a89a]" />
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full pl-6 pb-2 bg-transparent border-b border-[#f0ebe6] text-[#2c1810] focus:border-[#d4c5b0] focus:outline-none transition-colors appearance-none"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-xs tracking-[0.2em] uppercase text-[#8a7a6a] mb-2 font-medium">
                                Date
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-[#b8a89a]" />
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full pl-6 pb-2 bg-transparent border-b border-[#f0ebe6] text-[#2c1810] focus:border-[#d4c5b0] focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs tracking-[0.2em] uppercase text-[#8a7a6a] mb-2 font-medium">
                                Description
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-0 top-2 h-4 w-4 text-[#b8a89a]" />
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={5}
                                    className="w-full pl-6 pb-2 bg-transparent border-b border-[#f0ebe6] text-[#2c1810] focus:border-[#d4c5b0] focus:outline-none transition-colors resize-y placeholder:text-[#b8a89a]"
                                    placeholder="Describe your project..."
                                />
                            </div>
                        </div>

                        {/* Images */}
                        <div>
                            <label className="block text-xs tracking-[0.2em] uppercase text-[#8a7a6a] mb-2 font-medium">
                                Images
                            </label>

                            {/* Existing Images */}
                            {existingImages.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
                                    {existingImages.map((url, index) => (
                                        <div key={index} className="relative group aspect-square">
                                            <img
                                                src={url}
                                                alt={`Image ${index + 1}`}
                                                className="w-full h-full object-cover border border-[#f0ebe6]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(index)}
                                                className="absolute top-1 right-1 p-1 bg-[#c0392b] text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-[#2c1810]/70 text-white text-[10px]">
                                                {index + 1}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Upload Area */}
                            <div
                                className="border-2 border-dashed border-[#f0ebe6] p-8 text-center hover:border-[#d4c5b0] transition-colors cursor-pointer mt-4 bg-[#faf8f6]"
                                onClick={() => document.getElementById('image-upload')?.click()}
                            >
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <ImageIcon className="h-10 w-10 text-[#b8a89a] mx-auto mb-3" />
                                <p className="text-sm text-[#8a7a6a]">Click to add more images</p>
                                <p className="text-xs text-[#b8a89a] mt-1">PNG, JPG, WEBP (max 5MB each)</p>
                            </div>

                            {/* New Image Previews */}
                            {newImagePreviews.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
                                    {newImagePreviews.map((preview, index) => (
                                        <div key={index} className="relative group aspect-square">
                                            <img
                                                src={preview}
                                                alt={`New ${index + 1}`}
                                                className="w-full h-full object-cover border border-[#f0ebe6]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(index)}
                                                className="absolute top-1 right-1 p-1 bg-[#c0392b] text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-[#2c1810]/70 text-white text-[10px]">
                                                New
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-3 pt-4 border-t border-[#f0ebe6]">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-[#2c1810] hover:bg-[#3d2820] text-white px-6 py-2.5 text-sm font-medium transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                            <Link href="/dashboard/projects">
                                <button className="border border-[#f0ebe6] text-[#2c1810] hover:bg-[#f8f4f0] px-6 py-2.5 text-sm font-medium transition-all duration-300">
                                    Cancel
                                </button>
                            </Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </>
    );
}
