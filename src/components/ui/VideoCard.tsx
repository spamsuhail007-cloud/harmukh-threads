'use client';

import Link from 'next/link';
import { type Product } from '@prisma/client';
import { useState } from 'react';
import { optimizeCloudinaryUrl } from '@/lib/utils';
 
 export function VideoCard({ product }: { product: Product }) {
   const [isPlaying, setIsPlaying] = useState(false);
   
   if (!product.videoUrl) return null;
   const optimizedUrl = optimizeCloudinaryUrl(product.videoUrl);

  return (
    <div 
      style={{
        display: 'block',
        position: 'relative',
        width: '220px',
        height: '391px', // ~9:16 ratio
        flexShrink: 0,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: '#000',
        scrollSnapAlign: 'start',
        boxShadow: 'var(--shadow-ambient)',
        transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
      className="video-card"
    >
      <video
        ref={(el) => {
          if (el) {
            el.defaultMuted = true;
            el.muted = true;
          }
        }}
        src={optimizedUrl}
        autoPlay
        preload="metadata"
        muted
        loop
        playsInline
        onClick={(e) => {
          if (e.currentTarget.paused) {
            e.currentTarget.play();
          } else {
            e.currentTarget.pause();
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.9,
          transition: 'opacity 0.3s',
          cursor: 'pointer'
        }}
        className="video-player"
      />
      
      {/* Play Button Overlay */}
      {!isPlaying && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '48px',
          height: '48px',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 2,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" stroke="none">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </div>
      )}

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

      {/* Content overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px',
        color: '#fff',
      }}>
        <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
        </Link>
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
        .video-card:active { transform: scale(0.97); }
        .video-card:hover .video-player { opacity: 1; }
      `}} />
    </div>
  );
}
