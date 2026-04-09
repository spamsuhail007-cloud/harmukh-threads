'use server';

import { put } from '@vercel/blob';

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const blob = await put(`products/${file.name}`, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return { success: true, url: blob.url };
  } catch (error: any) {
    console.error('Blob upload error:', error);
    return { success: false, error: error.message || String(error) };
  }
}
