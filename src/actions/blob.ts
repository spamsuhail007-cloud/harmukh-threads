'use server';

import { put } from '@vercel/blob';

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;
  
  if (!file) {
    throw new Error('No file provided');
  }

  // Upload the file to Vercel Blob
  // access: 'public' means the URL will be accessible to everyone via CDN
  const blob = await put(`products/${file.name}`, file, {
    access: 'public',
  });

  return { success: true, url: blob.url };
}
