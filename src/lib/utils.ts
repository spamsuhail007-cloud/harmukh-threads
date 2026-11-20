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

export const CATEGORIES = ['Rugs', 'Cushion Covers'] as const;
export type Category = typeof CATEGORIES[number];

/**
 * Automatically injects Cloudinary optimization parameters (f_auto, q_auto, optional width)
 * into Cloudinary URLs.
 */
export function optimizeCloudinaryUrl(url: string, width?: number): string {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  const transform = width ? `f_auto,q_auto,w_${width},c_limit` : 'f_auto,q_auto';

  // For images
  if (url.includes('/image/upload/')) {
    if (url.includes('/image/upload/f_auto,q_auto/')) {
      return width ? url.replace('/image/upload/f_auto,q_auto/', `/image/upload/${transform}/`) : url;
    }
    return url.replace('/image/upload/', `/image/upload/${transform}/`);
  }
  
  // For videos
  if (url.includes('/video/upload/')) {
    if (url.includes('/video/upload/f_auto,q_auto/')) return url;
    return url.replace('/video/upload/', '/video/upload/f_auto,q_auto/');
  }
  
  return url;
}
