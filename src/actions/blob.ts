'use server';

import { uploadToCloudinary } from '@/lib/cloudinary';

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const url = await uploadToCloudinary(buffer, 'harmukh-threads', 'image');

    return { success: true, url };
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return { success: false, error: error.message || String(error) };
  }
}
