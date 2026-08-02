/* ============================================================
   DATA — Products, Collections, Admin mock data
   ============================================================ */

const PRODUCTS = [
  {
    id: 'p1',
    name: 'Indigo Nomadic Rug',
    category: 'Rugs',
    price: 180000,
    originalPrice: 220000,
    badge: 'Bestseller',
    badgeType: 'badge-primary',
    description: 'Hand-knotted over six months by master weavers in the villages of Anantnag. Each knot is a meditation; each row, a story passed from grandmother to granddaughter. The deep indigo dye is sourced from locally grown plants, fixed naturally under the mountain sun.',
    dimensions: '6×9 ft',
    material: 'Pure Himalayan Wool',
    knotDensity: '160 knots/sq.in',
    origin: 'Anantnag, Kashmir',
    weaveTime: '6 months',
    images: [
      'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80',
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    ],
    reviews: [
      { author: 'Priya M.', rating: 5, text: 'Absolutely breathtaking. The depth of colour is photograph-worthy.' },
      { author: 'James R.', rating: 5, text: 'Worth every rupee. The quality is museum-level.' },
    ]
  },
  {
    id: 'p2',
    name: 'Heritage Charcoal Scarf',
    category: 'Pashmina',
    price: 45000,
    badge: 'GI Tagged',
    badgeType: 'badge-secondary',
    description: 'Woven from Grade-A Changthangi pashmina sourced from the Changpa nomads of Ladakh. At 12 microns, this scarf is lighter than a cloud and warmer than memory.',
    dimensions: '28×80 in',
    material: 'Pure Changthangi Pashmina',
    knotDensity: null,
    origin: 'Srinagar, Kashmir',
    weaveTime: '3 months',
    images: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
      'https://images.unsplash.com/photo-1577198239986-fc433ee95de3?w=800&q=80',
    ],
    reviews: [
      { author: 'Aisha K.', rating: 5, text: 'The softest thing I have ever touched. True luxury.' },
    ]
  },
  {
    id: 'p3',
    name: 'Paisley Silk Cushion',
    category: 'Furnishings',
    price: 12000,
    originalPrice: 15000,
    badge: 'Limited',
    badgeType: 'badge-warn',
    description: 'Sozni embroidery on dupion silk — each paisley motif hand-stitched by craftswomen in Srinagar. The pattern draws from 16th-century Mughal court archives.',
    dimensions: '18×18 in',
    material: 'Dupion Silk, Sozni Thread',
    knotDensity: null,
    origin: 'Srinagar, Kashmir',
    weaveTime: '4 weeks',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80',
    ],
    reviews: []
  },
  {
    id: 'p4',
    name: 'Cloud Pashmina Wrap',
    category: 'Pashmina',
    price: 52000,
    badge: null,
    description: 'Sheer as woven air. This double-ply pashmina wrap is the result of sixty days of patient weaving. Wear it as a shawl, a throw, or frame it as the art it truly is.',
    dimensions: '36×80 in',
    material: 'Double-ply Pashmina',
    knotDensity: null,
    origin: 'Pampore, Kashmir',
    weaveTime: '60 days',
    images: [
      'https://images.unsplash.com/photo-1577198239986-fc433ee95de3?w=800&q=80',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
    ],
    reviews: [
      { author: 'Leila F.', rating: 5, text: 'A work of art. I feel like I am wrapped in a cloud.' },
    ]
  },
  {
    id: 'p5',
    name: 'Saffron Zari Tablerunner',
    category: 'Furnishings',
    price: 8500,
    badge: 'New',
    badgeType: 'badge-success',
    description: 'Kani weave with pure silver-gilt zari thread. Each tablerunner takes 12 days of meticulous work on a traditional karkhana loom.',
    dimensions: '14×72 in',
    material: 'Silk, Silver-gilt Zari',
    knotDensity: null,
    origin: 'Kanihama, Kashmir',
    weaveTime: '12 days',
    images: [
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80',
      'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80',
    ],
    reviews: []
  },
  {
    id: 'p6',
    name: 'Walnut Wood Jewellery Box',
    category: 'Woodcraft',
    price: 22000,
    badge: 'Handcrafted',
    badgeType: 'badge-secondary',
    description: 'Carved from single-block Kashmiri walnut wood with floral naqqashi designs. The interior is lined with raw pashmina. No two boxes are identical.',
    dimensions: '8×5×3 in',
    material: 'Kashmiri Walnut, Pashmina',
    knotDensity: null,
    origin: 'Habbakadal, Srinagar',
    weaveTime: '3 weeks',
    images: [
      'https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?w=800&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    ],
    reviews: [
      { author: 'Meera S.', rating: 5, text: 'A jewel box worthy of holding jewels. Exceptional craftsmanship.' },
    ]
  },
];

const COLLECTIONS = [
  {
    id: 'rugs',
    title: 'Handwoven Rugs',
    label: 'The Collection',
    count: '24 pieces',
    image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80',
    page: 'rugs',
  },
  {
    id: 'pashmina',
    title: 'Pashmina & Shawls',
    label: 'Heritage Weaves',
    count: '38 pieces',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=80',
    page: 'rugs',
  },
  {
    id: 'furnishings',
    title: 'Home Furnishings',
    label: 'Artisan Living',
    count: '16 pieces',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80',
    page: 'rugs',
  },
];

const ADMIN_MESSAGES = [
  { id: 1, name: 'Sunita Khanna', email: 'sunita@email.com', subject: 'Custom rug inquiry', message: 'I would like to commission a 9×12 ft rug in a specific colour palette. Can you share the process?', date: '2026-04-07', status: 'New' },
  { id: 2, name: 'Tom Eriksson', email: 'tom.e@gmail.com', subject: 'Bulk pashmina order', message: 'We are a boutique hotel looking to place a bulk order of 50 pashmina throws for our guest rooms.', date: '2026-04-06', status: 'Replied' },
  { id: 3, name: 'Fatima Al-Rashid', email: 'f.rashid@mail.com', subject: 'GI certificate query', message: 'Do your rugs come with a GI tag certificate that can be sent digitally?', date: '2026-04-05', status: 'New' },
  { id: 4, name: 'Ananya Roy', email: 'ananya.r@outlook.com', subject: 'Delivery timeline', message: 'I placed an order last week (order #HT-2024-0891). Could you share the estimated delivery date?', date: '2026-04-04', status: 'Resolved' },
];

const ADMIN_ENQUIRIES = [
  { id: 'HT-2026-0142', customer: 'James Robertson', product: 'Indigo Nomadic Rug (6×9)', amount: '₹1,80,000', date: '2026-04-07', status: 'Pending' },
  { id: 'HT-2026-0141', customer: 'Priya Mehta', product: 'Heritage Charcoal Scarf × 2', amount: '₹90,000', date: '2026-04-06', status: 'Confirmed' },
  { id: 'HT-2026-0140', customer: 'Sarah Williams', product: 'Cloud Pashmina Wrap', amount: '₹52,000', date: '2026-04-05', status: 'Shipped' },
  { id: 'HT-2026-0139', customer: 'Rahul Verma', product: 'Paisley Silk Cushion × 4', amount: '₹48,000', date: '2026-04-03', status: 'Delivered' },
  { id: 'HT-2026-0138', customer: 'Emily Chen', product: 'Walnut Wood Jewellery Box', amount: '₹22,000', date: '2026-04-01', status: 'Delivered' },
];

const ADMIN_INVENTORY = [
  { id: 'p1', name: 'Indigo Nomadic Rug 6×9', sku: 'RUG-IND-69', category: 'Rugs', stock: 3, price: '₹1,80,000', status: 'Low Stock' },
  { id: 'p2', name: 'Heritage Charcoal Scarf', sku: 'PSH-CHAR-01', category: 'Pashmina', stock: 12, price: '₹45,000', status: 'In Stock' },
  { id: 'p3', name: 'Paisley Silk Cushion', sku: 'FRN-PSL-18', category: 'Furnishings', stock: 0, price: '₹12,000', status: 'Out of Stock' },
  { id: 'p4', name: 'Cloud Pashmina Wrap', sku: 'PSH-CLD-01', category: 'Pashmina', stock: 7, price: '₹52,000', status: 'In Stock' },
  { id: 'p5', name: 'Saffron Zari Tablerunner', sku: 'FRN-ZAR-14', category: 'Furnishings', stock: 15, price: '₹8,500', status: 'In Stock' },
  { id: 'p6', name: 'Walnut Wood Jewellery Box', sku: 'WOD-JWL-08', category: 'Woodcraft', stock: 2, price: '₹22,000', status: 'Low Stock' },
];

function formatPrice(rupees) {
  return '₹' + rupees.toLocaleString('en-IN');
}

function getProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}
