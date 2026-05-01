import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  secure: true,
});

export async function uploadToCloudinary(buffer: Buffer, folder: string, resourceType: 'image' | 'video' = 'image'): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        // Optional optimizations:
        // format: 'webp', // auto convert to webp - Cloudinary usually auto-optimizes based on URL parameters, but we can set defaults here.
      },
      (error, result) => {
        if (error || !result) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(buffer);
  });
}
