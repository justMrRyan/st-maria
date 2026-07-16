// components/ImageUpload.tsx
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/lib/constants';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageAdded: (url: string) => void;
  existingImages?: string[];
  onRemoveImage?: (url: string) => void;
}

export default function ImageUpload({
                                      onImageAdded,
                                      existingImages = [],
                                      onRemoveImage,
                                    }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
      event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
      return;
    }

    // Validate file size
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error(`File size exceeds ${MAX_IMAGE_SIZE / 1024 / 1024}MB limit`);
      return;
    }

    setIsUploading(true);

    try {
      const allowedUserId = process.env.NEXT_PUBLIC_ALLOWED_USER_ID;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `projects/${allowedUserId}/${fileName}`;

      // Upload directly to Supabase Storage
      const { error: uploadError } = await supabase.storage
          .from('MERYAMSWILEM')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error(`Failed to upload ${file.name}`);
        return;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
          .from('MERYAMSWILEM')
          .getPublicUrl(filePath);

      onImageAdded(publicUrl);
      toast.success('Image uploaded successfully');

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(
          error instanceof Error ? error.message : 'Failed to upload image'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
      <div className="space-y-4">
        {/* Upload Area */}
        <div
            className="border-2 border-dashed border-[#f0ebe6] rounded-lg p-8 text-center hover:border-[#2c1810] transition-colors cursor-pointer bg-[#faf8f6]"
            onClick={() => fileInputRef.current?.click()}
        >
          <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_IMAGE_TYPES.join(',')}
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
          />
          {isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 text-[#2c1810] animate-spin mb-3" />
                <p className="text-sm text-[#8a7a6a]">Uploading image...</p>
              </div>
          ) : (
              <>
                <ImageIcon className="h-10 w-10 text-[#b8a89a] mx-auto mb-3" />
                <p className="text-sm text-[#8a7a6a]">
                  Click to upload an image
                </p>
                <p className="text-xs text-[#b8a89a] mt-1">
                  PNG, JPG, WEBP (max {MAX_IMAGE_SIZE / 1024 / 1024}MB)
                </p>
                <Button
                    type="button"
                    variant="outline"
                    className="mt-4 border-[#f0ebe6] text-[#2c1810] hover:bg-[#f8f4f0] hover:border-[#b8a89a]"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Image
                </Button>
              </>
          )}
        </div>

        {/* Existing Images */}
        {existingImages.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-[#2c1810] mb-3">
                Uploaded Images ({existingImages.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingImages.map((imageUrl, index) => (
                    <div key={imageUrl} className="relative group">
                      <div className="relative w-full aspect-square bg-[#f8f4f0] rounded-lg overflow-hidden border border-[#f0ebe6]">
                        <img
                            src={imageUrl}
                            alt={`Uploaded ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                      </div>
                      {onRemoveImage && (
                          <button
                              type="button"
                              onClick={() => onRemoveImage(imageUrl)}
                              className="absolute top-2 right-2 p-1 bg-[#c0392b] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                          >
                            <X className="h-4 w-4" />
                          </button>
                      )}
                      <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-[#2c1810]/70 text-white text-[10px] rounded">
                  {index + 1}
                </span>
                    </div>
                ))}
              </div>
            </div>
        )}
      </div>
  );
}