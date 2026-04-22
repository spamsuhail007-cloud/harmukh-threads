import Link from 'next/link';
import { type Product } from '@prisma/client';

export function VideoCard({ product }: { product: Product }) {
  if (!product.videoUrl) return null;

  return (
    <Link 
      href={`/products/${product.slug}`}
      style={{
        display: 'block',
        position: 'relative',
        width: '240px',
        height: '426px', // ~9:16 ratio
        flexShrink: 0,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: '#000',
        scrollSnapAlign: 'start',
        textDecoration: 'none',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
      className="video-card"
    >
      <video
        src={product.videoUrl}
        autoPlay
        muted
        loop
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.9,
          transition: 'opacity 0.3s',
        }}
        className="video-player"
      />
      
      {/* Gradient Overlay for text readability */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Play/Mute Icon overlay (optional static icon) */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      </div>

      {/* Content overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px',
        color: '#fff',
      }}>
        <h3 style={{
          fontSize: '1rem',
          fontWeight: 700,
          margin: '0 0 4px 0',
          textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span style={{ fontSize: '0.8rem', textDecoration: 'line-through', color: 'rgba(255,255,255,0.7)' }}>
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        
        {/* Small product thumbnail */}
        {product.images[0] && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            width: '36px',
            height: '48px',
            borderRadius: '4px',
            border: '2px solid rgba(255,255,255,0.8)',
            overflow: 'hidden'
          }}>
            <img src={product.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .video-card:hover { transform: translateY(-4px); }
        .video-card:hover .video-player { opacity: 1; }
      `}} />
    </Link>
  );
}
