// lib/supabase/storage.ts
import { supabase } from './client';

export const deleteImageFromStorage = async (publicUrl: string) => {
  const bucket = 'MERYAMSWILEM';
  const urlParts = publicUrl.split('/');
  const bucketIndex = urlParts.indexOf(bucket);
  if (bucketIndex === -1) {
    console.warn('Could not find bucket in URL:', publicUrl);
    return;
  }
  const filePath = urlParts.slice(bucketIndex + 1).join('/');
  const { error } = await supabase.storage.from(bucket).remove([filePath]);
  if (error) throw error;
};

export const deleteImagesFromStorage = async (imageUrls: string[]) => {
  const results = await Promise.allSettled(
    imageUrls.map(url => deleteImageFromStorage(url))
  );
  const failed = results.filter(r => r.status === 'rejected');
  if (failed.length > 0) {
    console.warn(`${failed.length} images failed to delete`);
  }
  return failed.length === 0;
};