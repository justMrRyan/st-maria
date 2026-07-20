// app/dashboard/projects/new/page.tsx
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { toast, Toaster } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Calendar, FolderOpen, FileText, ImageIcon, X, Upload, Loader2 } from 'lucide-react';

export default function NewProject() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        date: '',
    });
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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
        setImagePreviews([...imagePreviews, ...previews]);
        setImages([...images, ...validFiles]);
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setUploading(true);

        try {
            const uploadedImages = [];

            // Upload images
            if (images.length > 0) {
                for (const file of images) {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                    const filePath = `projects/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('MERYAMSWILEM')
                        .upload(filePath, file, {
                            cacheControl: '3600',
                            upsert: false,
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
                setUploading(false);
            }

            // Insert project WITHOUT user_id
            const { error } = await supabase
                .from('projects')
                .insert({
                    title: formData.title,
                    description: formData.description,
                    category: formData.category,
                    date: formData.date || new Date().toISOString(),
                    images: uploadedImages,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                });

            if (error) throw error;

            toast.success('Project created successfully!');
            router.push('/dashboard/projects');
        } catch (error: any) {
            console.error('Error creating project:', error);
            toast.error(error.message || 'Failed to create project');
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

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
                        <h1 className="text-2xl font-bold text-[#2c1810]">New Project</h1>
                        <p className="text-[#8a7a6a] text-sm mt-1">Add a new project to your portfolio</p>
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
                            
                            <div
                                className="border-2 border-dashed border-[#f0ebe6] p-8 text-center hover:border-[#d4c5b0] transition-colors cursor-pointer bg-[#faf8f6]"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                {uploading ? (
                                    <div className="flex flex-col items-center">
                                        <Loader2 className="h-10 w-10 text-[#2c1810] animate-spin mb-3" />
                                        <p className="text-sm text-[#8a7a6a]">Uploading images...</p>
                                    </div>
                                ) : (
                                    <>
                                        <ImageIcon className="h-10 w-10 text-[#b8a89a] mx-auto mb-3" />
                                        <p className="text-sm text-[#8a7a6a]">Click to upload images</p>
                                        <p className="text-xs text-[#b8a89a] mt-1">PNG, JPG, WEBP (max 5MB each)</p>
                                    </>
                                )}
                            </div>

                            {/* Image Previews */}
                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative group aspect-square">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover border border-[#f0ebe6]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
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
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-3 pt-4 border-t border-[#f0ebe6]">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#2c1810] hover:bg-[#3d2820] text-white px-6 py-2.5 text-sm font-medium transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-4 w-4" />
                                        Create Project
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