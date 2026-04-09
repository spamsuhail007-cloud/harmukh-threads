import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Here we could enforce authentication (e.g., check session)
        // For simplicity and since this is a prototype, we'll allow it.
        // The token is scoped strictly to the requested upload.
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          tokenPayload: JSON.stringify({
            // Any custom data to pass to onUploadCompleted
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Run after the upload is completed
        console.log('blob upload completed', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}
