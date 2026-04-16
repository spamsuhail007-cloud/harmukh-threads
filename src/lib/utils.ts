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
