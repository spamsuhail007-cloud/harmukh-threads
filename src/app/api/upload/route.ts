import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

// Use nodejs runtime so we can handle larger bodies
export const runtime = 'nodejs';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Determine if it's a video based on mime type
    const resourceType = file.type.startsWith('video/') ? 'video' : 'image';

    const url = await uploadToCloudinary(buffer, 'harmukh-threads', resourceType);

    return NextResponse.json({ url });
  } catch (error) {
    console.error('[Upload Error]', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
