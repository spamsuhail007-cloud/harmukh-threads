import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

const db = new PrismaClient();

async function downloadBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status} ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function uploadBufferToCloudinary(buffer: Buffer, folder: string, resourceType: 'image' | 'video'): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error || !result) reject(error);
        else resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
}

function isVercelBlob(url: string): boolean {
  return url.includes('blob.vercel-storage.com') || url.includes('public.blob.vercel');
}

async function main() {
  console.log('🚀 Starting Vercel Blob → Cloudinary migration...\n');

  const products = await db.product.findMany();
  console.log(`Found ${products.length} products to process.\n`);

  let totalImages = 0;
  let totalVideos = 0;
  let skipped = 0;
  let errors = 0;

  for (const product of products) {
    console.log(`\n📦 Processing: ${product.name}`);

    // ── Migrate images ──────────────────────────────────────────
    const newImages: string[] = [];
    for (let i = 0; i < product.images.length; i++) {
      const imgUrl = product.images[i];
      if (!isVercelBlob(imgUrl)) {
        console.log(`  ✅ Image ${i + 1}: already on Cloudinary, skipping`);
        newImages.push(imgUrl);
        skipped++;
        continue;
      }
      try {
        console.log(`  ⬆️  Image ${i + 1}: downloading & uploading to Cloudinary...`);
        const buffer = await downloadBuffer(imgUrl);
        const newUrl = await uploadBufferToCloudinary(buffer, 'harmukh-threads/products', 'image');
        newImages.push(newUrl);
        totalImages++;
        console.log(`  ✅ Image ${i + 1}: done → ${newUrl.slice(0, 60)}...`);
      } catch (err: any) {
        console.error(`  ❌ Image ${i + 1} FAILED: ${err.message}`);
        newImages.push(imgUrl); // Keep old URL on failure
        errors++;
      }
    }

    // ── Migrate video ───────────────────────────────────────────
    let newVideoUrl: string | null | undefined = product.videoUrl;
    if (product.videoUrl && isVercelBlob(product.videoUrl)) {
      try {
        console.log(`  ⬆️  Video: downloading & uploading to Cloudinary...`);
        const buffer = await downloadBuffer(product.videoUrl);
        newVideoUrl = await uploadBufferToCloudinary(buffer, 'harmukh-threads/videos', 'video');
        totalVideos++;
        console.log(`  ✅ Video: done → ${newVideoUrl.slice(0, 60)}...`);
      } catch (err: any) {
        console.error(`  ❌ Video FAILED: ${err.message}`);
        errors++;
      }
    } else if (product.videoUrl) {
      console.log(`  ✅ Video: already on Cloudinary, skipping`);
    }

    // ── Update database ─────────────────────────────────────────
    await db.product.update({
      where: { id: product.id },
      data: {
        images: newImages,
        videoUrl: newVideoUrl,
      },
    });
    console.log(`  💾 Database updated for: ${product.name}`);
  }

  console.log(`\n✅ Migration complete!`);
  console.log(`   Images migrated: ${totalImages}`);
  console.log(`   Videos migrated: ${totalVideos}`);
  console.log(`   Already on Cloudinary (skipped): ${skipped}`);
  console.log(`   Errors: ${errors}`);

  if (errors > 0) {
    console.log(`\n⚠️  Some files failed. Re-run the script to retry failed uploads.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
