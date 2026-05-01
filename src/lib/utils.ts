export function formatPrice(rupees: number): string {
  return '₹' + rupees.toLocaleString('en-IN');
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `HT-${year}-${num}`;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const CATEGORIES = ['Rugs', 'Pillow Covers'] as const;
export type Category = typeof CATEGORIES[number];

/**
 * Automatically injects Cloudinary optimization parameters (f_auto, q_auto)
 * into Cloudinary URLs.
 */
export function optimizeCloudinaryUrl(url: string): string {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  // For images
  if (url.includes('/image/upload/')) {
    return url.replace('/image/upload/', '/image/upload/f_auto,q_auto/');
  }
  
  // For videos
  if (url.includes('/video/upload/')) {
    return url.replace('/video/upload/', '/video/upload/f_auto,q_auto/');
  }
  
  return url;
}
