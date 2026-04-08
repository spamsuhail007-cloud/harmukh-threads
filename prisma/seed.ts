import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL,
});

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Admin User ───────────────────────────────────────
  const hashedPassword = await bcrypt.hash('admin123', 12);
  await prisma.adminUser.upsert({
    where: { email: 'admin@harmukh.com' },
    update: {},
    create: {
      email: 'admin@harmukh.com',
      password: hashedPassword,
      name: 'Admin',
    },
  });
  console.log('✅ Admin user created: admin@harmukh.com / admin123');

  // ─── Products ─────────────────────────────────────────
  const products = [
    {
      name: 'Indigo Nomadic Rug',
      slug: 'indigo-nomadic-rug',
      category: 'Rugs',
      price: 180000,
      originalPrice: 220000,
      badge: 'Bestseller',
      badgeType: 'badge-primary',
      description:
        'Hand-knotted over six months by master weavers in the villages of Anantnag. Each knot is a meditation; each row, a story passed from grandmother to granddaughter. The deep indigo dye is sourced from locally grown plants, fixed naturally under the mountain sun.',
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
      stock: 3,
      isActive: true,
      reviews: {
        create: [
          { author: 'Priya M.', rating: 5, text: 'Absolutely breathtaking. The depth of colour is photograph-worthy.' },
          { author: 'James R.', rating: 5, text: 'Worth every rupee. The quality is museum-level.' },
        ],
      },
    },
    {
      name: 'Heritage Charcoal Scarf',
      slug: 'heritage-charcoal-scarf',
      category: 'Pashmina',
      price: 45000,
      badge: 'GI Tagged',
      badgeType: 'badge-secondary',
      description:
        'Woven from Grade-A Changthangi pashmina sourced from the Changpa nomads of Ladakh. At 12 microns, this scarf is lighter than a cloud and warmer than memory.',
      dimensions: '28×80 in',
      material: 'Pure Changthangi Pashmina',
      knotDensity: null,
      origin: 'Srinagar, Kashmir',
      weaveTime: '3 months',
      images: [
        'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
        'https://images.unsplash.com/photo-1577198239986-fc433ee95de3?w=800&q=80',
      ],
      stock: 12,
      isActive: true,
      reviews: {
        create: [
          { author: 'Aisha K.', rating: 5, text: 'The softest thing I have ever touched. True luxury.' },
        ],
      },
    },
    {
      name: 'Paisley Silk Cushion',
      slug: 'paisley-silk-cushion',
      category: 'Furnishings',
      price: 12000,
      originalPrice: 15000,
      badge: 'Limited',
      badgeType: 'badge-warn',
      description:
        'Sozni embroidery on dupion silk — each paisley motif hand-stitched by craftswomen in Srinagar. The pattern draws from 16th-century Mughal court archives.',
      dimensions: '18×18 in',
      material: 'Dupion Silk, Sozni Thread',
      knotDensity: null,
      origin: 'Srinagar, Kashmir',
      weaveTime: '4 weeks',
      images: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
        'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80',
      ],
      stock: 0,
      isActive: true,
      reviews: { create: [] },
    },
    {
      name: 'Cloud Pashmina Wrap',
      slug: 'cloud-pashmina-wrap',
      category: 'Pashmina',
      price: 52000,
      badge: null,
      description:
        'Sheer as woven air. This double-ply pashmina wrap is the result of sixty days of patient weaving. Wear it as a shawl, a throw, or frame it as the art it truly is.',
      dimensions: '36×80 in',
      material: 'Double-ply Pashmina',
      knotDensity: null,
      origin: 'Pampore, Kashmir',
      weaveTime: '60 days',
      images: [
        'https://images.unsplash.com/photo-1577198239986-fc433ee95de3?w=800&q=80',
        'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
      ],
      stock: 7,
      isActive: true,
      reviews: {
        create: [
          { author: 'Leila F.', rating: 5, text: 'A work of art. I feel like I am wrapped in a cloud.' },
        ],
      },
    },
    {
      name: 'Saffron Zari Tablerunner',
      slug: 'saffron-zari-tablerunner',
      category: 'Furnishings',
      price: 8500,
      badge: 'New',
      badgeType: 'badge-success',
      description:
        'Kani weave with pure silver-gilt zari thread. Each tablerunner takes 12 days of meticulous work on a traditional karkhana loom.',
      dimensions: '14×72 in',
      material: 'Silk, Silver-gilt Zari',
      knotDensity: null,
      origin: 'Kanihama, Kashmir',
      weaveTime: '12 days',
      images: [
        'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80',
        'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80',
      ],
      stock: 15,
      isActive: true,
      reviews: { create: [] },
    },
    {
      name: 'Walnut Wood Jewellery Box',
      slug: 'walnut-wood-jewellery-box',
      category: 'Woodcraft',
      price: 22000,
      badge: 'Handcrafted',
      badgeType: 'badge-secondary',
      description:
        'Carved from single-block Kashmiri walnut wood with floral naqqashi designs. The interior is lined with raw pashmina. No two boxes are identical.',
      dimensions: '8×5×3 in',
      material: 'Kashmiri Walnut, Pashmina',
      knotDensity: null,
      origin: 'Habbakadal, Srinagar',
      weaveTime: '3 weeks',
      images: [
        'https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?w=800&q=80',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      ],
      stock: 2,
      isActive: true,
      reviews: {
        create: [
          { author: 'Meera S.', rating: 5, text: 'A jewel box worthy of holding jewels. Exceptional craftsmanship.' },
        ],
      },
    },
  ];

  for (const product of products) {
    const { reviews, ...productData } = product;
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productData,
        reviews,
      },
    });
    console.log(`✅ Product: ${productData.name}`);
  }

  // ─── Sample Contact Messages ──────────────────────────
  await prisma.contactMessage.createMany({
    skipDuplicates: true,
    data: [
      {
        name: 'Sunita Khanna',
        email: 'sunita@email.com',
        subject: 'Custom rug inquiry',
        message: 'I would like to commission a 9×12 ft rug in a specific colour palette. Can you share the process?',
        status: 'NEW',
      },
      {
        name: 'Tom Eriksson',
        email: 'tom.e@gmail.com',
        subject: 'Bulk pashmina order',
        message: 'We are a boutique hotel looking to place a bulk order of 50 pashmina throws for our guest rooms.',
        status: 'REPLIED',
      },
      {
        name: 'Fatima Al-Rashid',
        email: 'f.rashid@mail.com',
        subject: 'GI certificate query',
        message: 'Do your rugs come with a GI tag certificate that can be sent digitally?',
        status: 'NEW',
      },
    ],
  });
  console.log('✅ Sample contact messages created');

  console.log('\n🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
