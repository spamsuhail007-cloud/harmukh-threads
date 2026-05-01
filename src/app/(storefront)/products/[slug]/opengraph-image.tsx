import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/db';
 
export const runtime = 'edge';
 
export const alt = 'Harmukh Threads';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
 
export default async function Image({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });
 
  if (!product) return new Response('Not found', { status: 404 });
 
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          background: '#fcf9f2', // Brand surface color
          padding: '60px',
        }}
      >
        {/* Left: Product Image */}
        <div style={{ display: 'flex', width: '50%', height: '100%', borderRadius: '20px', overflow: 'hidden' }}>
          <img
            src={product.images[0]}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Right: Info */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '50%', paddingLeft: '60px' }}>
          <div style={{ display: 'flex', fontSize: '24px', color: '#9b4000', fontWeight: 'bold', marginBottom: '20px' }}>
            HARMUKH THREADS
          </div>
          <h1 style={{ fontSize: '64px', fontWeight: 'bold', color: '#1a1a1a', margin: '0 0 20px 0', lineHeight: 1.1 }}>
            {product.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#9b4000' }}>
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: '32px', textDecoration: 'line-through', color: '#999' }}>
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', background: '#9b4000', color: 'white', padding: '15px 30px', borderRadius: '10px', fontSize: '24px', fontWeight: 'bold' }}>
            SHOP AUTHENTIC KASHMIR
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
