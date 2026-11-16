// Official Harmukh Threads Article Number Mapping
export interface ArticleInfo {
  code: string;
  name: string;
  category: string;
  size: string;
  price: number;
  stock: number;
  slug: string;
}

export const ARTICLES_MAP: Record<string, ArticleInfo> = {
  // 3×5 ft Aari Rugs (₹5,999)
  '3-ft-5-ft-mehrab-garden-aari-rug': {
    code: 'HT-301',
    name: '3 ft × 5 ft - Mehrab Garden Aari Rug',
    category: 'Rugs',
    size: '3×5 ft',
    price: 5999,
    stock: 1,
    slug: '3-ft-5-ft-mehrab-garden-aari-rug',
  },
  '3-ft-5-ft-zareen-medallion-aari-rug': {
    code: 'HT-302',
    name: '3 ft × 5 ft - Zareen Medallion Aari Rug',
    category: 'Rugs',
    size: '3×5 ft',
    price: 5999,
    stock: 1,
    slug: '3-ft-5-ft-zareen-medallion-aari-rug',
  },
  '3-ft-5-ft-zameer-floral-aari-rug': {
    code: 'HT-303',
    name: '3 ft × 5 ft - Zameer Floral Aari Rug',
    category: 'Rugs',
    size: '3×5 ft',
    price: 5999,
    stock: 1,
    slug: '3-ft-5-ft-zameer-floral-aari-rug',
  },
  '3-ft-5-ft-sahar-floral-weave-rug': {
    code: 'HT-304',
    name: '3 ft × 5 ft - Sahar Floral Weave Rug',
    category: 'Rugs',
    size: '3×5 ft',
    price: 5999,
    stock: 1,
    slug: '3-ft-5-ft-sahar-floral-weave-rug',
  },
  '3-ft-5-ft-rangrez-bloom-aari-rug': {
    code: 'HT-305',
    name: '3 ft × 5 ft - Rangrez Bloom Aari Rug',
    category: 'Rugs',
    size: '3×5 ft',
    price: 5999,
    stock: 1,
    slug: '3-ft-5-ft-rangrez-bloom-aari-rug',
  },
  '3-ft-5-ft-gulistan-panel-aari-rug': {
    code: 'HT-306',
    name: '3 ft × 5 ft - Gulistan Panel Aari Rug',
    category: 'Rugs',
    size: '3×5 ft',
    price: 5999,
    stock: 0,
    slug: '3-ft-5-ft-gulistan-panel-aari-rug',
  },

  // 2.5×4 ft Aari Rugs (₹3,999)
  'firdaus-floral-aari-rug': {
    code: 'HT-251',
    name: '2.5 ft × 4 ft - Firdaus Floral Aari Rug',
    category: 'Rugs',
    size: '2.5×4 ft',
    price: 3999,
    stock: 1,
    slug: 'firdaus-floral-aari-rug',
  },
  '2-5-ft-4-ft-gulistan-vine-embroidered-rug': {
    code: 'HT-252',
    name: '2.5 ft × 4 ft - Gulistan Vine Embroidered Rug',
    category: 'Rugs',
    size: '2.5×4 ft',
    price: 3999,
    stock: 1,
    slug: '2-5-ft-4-ft-gulistan-vine-embroidered-rug',
  },
  '2-5-ft-4-ft-mehrunisa-floral-panel-rug': {
    code: 'HT-253',
    name: '2.5 ft × 4 ft - Mehrunisa Floral Panel Rug',
    category: 'Rugs',
    size: '2.5×4 ft',
    price: 3999,
    stock: 1,
    slug: '2-5-ft-4-ft-mehrunisa-floral-panel-rug',
  },
  '2-5-ft-4-ft-parizaad-floral-weave-rug': {
    code: 'HT-254',
    name: '2.5 ft × 4 ft - Parizaad Floral Weave Rug',
    category: 'Rugs',
    size: '2.5×4 ft',
    price: 3999,
    stock: 1,
    slug: '2-5-ft-4-ft-parizaad-floral-weave-rug',
  },
  '2-5-ft-4-ft-zameen-e-ivory-aari-rug': {
    code: 'HT-255',
    name: '2.5 ft × 4 ft - Zameen-e-Ivory Aari Rug',
    category: 'Rugs',
    size: '2.5×4 ft',
    price: 3999,
    stock: 1,
    slug: '2-5-ft-4-ft-zameen-e-ivory-aari-rug',
  },
  '2-5-ft-4-ft-zarina-floral-vine-rug': {
    code: 'HT-256',
    name: '2.5 ft × 4 ft - Zarina Floral Vine Rug',
    category: 'Rugs',
    size: '2.5×4 ft',
    price: 3999,
    stock: 1,
    slug: '2-5-ft-4-ft-zarina-floral-vine-rug',
  },

  // 2×3 ft Rugs (₹2,999)
  '2-ft-3-ft-afsana-heritage-rug': {
    code: 'HT-201',
    name: '2 ft × 3 ft - Afsana Heritage Rug',
    category: 'Rugs',
    size: '2×3 ft',
    price: 2999,
    stock: 1,
    slug: '2-ft-3-ft-afsana-heritage-rug',
  },
  '2-ft-3-ft-naqsh-royale-rug': {
    code: 'HT-202',
    name: '2 ft × 3 ft - Naqsh Royale Rug',
    category: 'Rugs',
    size: '2×3 ft',
    price: 2999,
    stock: 1,
    slug: '2-ft-3-ft-naqsh-royale-rug',
  },
  '2-ft-3-ft-nooran-blossom-rug': {
    code: 'HT-203',
    name: '2 ft × 3 ft - Nooran Blossom Rug',
    category: 'Rugs',
    size: '2×3 ft',
    price: 2999,
    stock: 1,
    slug: '2-ft-3-ft-nooran-blossom-rug',
  },
  '2-5-ft-4-ft-rubaab-medallion-rug': {
    code: 'HT-204',
    name: '2 ft × 3 ft - Rubaab Medallion Rug',
    category: 'Rugs',
    size: '2×3 ft',
    price: 2999,
    stock: 1,
    slug: '2-5-ft-4-ft-rubaab-medallion-rug',
  },

  // 16×16 in Cushion Covers (₹699)
  'allover-hand-embroidered-kashmiri-crewel-16-16-cushion-cover': {
    code: 'HT-C01',
    name: 'Allover Hand Embroidered Crewel Cushion Cover',
    category: 'Cushion Covers',
    size: '16×16 in',
    price: 699,
    stock: 6,
    slug: 'allover-hand-embroidered-kashmiri-crewel-16-16-cushion-cover',
  },
  'beige-floral-hand-embroidered-kashmiri-crewel-16-16-cushion-cover': {
    code: 'HT-C02',
    name: 'Beige Floral Hand Embroidered Crewel Cushion Cover',
    category: 'Cushion Covers',
    size: '16×16 in',
    price: 699,
    stock: 4,
    slug: 'beige-floral-hand-embroidered-kashmiri-crewel-16-16-cushion-cover',
  },
  'ivory-hand-embroidered-kashmiri-crewel-16-16-cushion-cover': {
    code: 'HT-C03',
    name: 'Ivory Hand Embroidered Crewel Cushion Cover',
    category: 'Cushion Covers',
    size: '16×16 in',
    price: 699,
    stock: 2,
    slug: 'ivory-hand-embroidered-kashmiri-crewel-16-16-cushion-cover',
  },
  'mustard-vine-hand-embroidered-kashmiri-crewel-16-16-cushion-cover': {
    code: 'HT-C04',
    name: 'Mustard Vine Hand Embroidered Crewel Cushion Cover',
    category: 'Cushion Covers',
    size: '16×16 in',
    price: 699,
    stock: 4,
    slug: 'mustard-vine-hand-embroidered-kashmiri-crewel-16-16-cushion-cover',
  },
  'rust-floral-hand-embroidered-kashmiri-crewel-16-16-cushion-cover': {
    code: 'HT-C05',
    name: 'Rust Floral Hand Embroidered Crewel Cushion Cover',
    category: 'Cushion Covers',
    size: '16×16 in',
    price: 699,
    stock: 0,
    slug: 'rust-floral-hand-embroidered-kashmiri-crewel-16-16-cushion-cover',
  },
  'heritage-motif-hand-embroidered-kashmiri-crewel-16-16-cushion-cover': {
    code: 'HT-C06',
    name: 'Heritage Motif Hand Embroidered Crewel Cushion Cover',
    category: 'Cushion Covers',
    size: '16×16 in',
    price: 699,
    stock: 0,
    slug: 'heritage-motif-hand-embroidered-kashmiri-crewel-16-16-cushion-cover',
  },
};

export const HARMUKH_WHATSAPP_NUMBER = '918491006127';
export const HARMUKH_UPI_ID = 'sofisuhail007@ybl';
export const HARMUKH_UPI_NAME = 'Suhail Skindar Sofi';

export function getArticleBySlug(slug: string): ArticleInfo | null {
  return ARTICLES_MAP[slug] || null;
}

export function getWhatsAppOrderUrl(productName: string, articleCode: string, price: number): string {
  const message = `Hi Harmukh Threads, I want to order Article #${articleCode} (${productName} - ₹${price.toLocaleString('en-IN')}). Please confirm availability & dispatch.`;
  return `https://wa.me/${HARMUKH_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
