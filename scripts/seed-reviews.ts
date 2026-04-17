import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PRODUCT_ID = 'cmo2ifv100000l404ol3e5j9p'; // Firdaus Floral Aari Rug

const MOCK_REVIEWS = [
  { author: "Anjali M.", rating: 5, text: "Absolutely stunning rug! The Aari work is so intricate and the colors are even more vibrant in person. Perfect size for my reading nook." },
  { author: "Rahul Sharma", rating: 5, text: "Very high quality wool and excellent craftsmanship. You can tell this is authentic Kashmiri work. Delivery was prompt as well." },
  { author: "Priya Desai", rating: 4, text: "Beautiful rug, definitely adds a premium feel to my living room. The only reason for 4 stars is that I wish it came in a slightly larger size too!" },
  { author: "Sangeeta K.", rating: 5, text: "I gifted this to my parents for their anniversary and they were thrilled. The medallion design in the center is flawlessly done." },
  { author: "Vikram S.", rating: 5, text: "Exceeded my expectations. The red and gold tones are extremely rich. It's soft yet feels very durable. Great value for the price." },
  { author: "Meera Reddy", rating: 5, text: "Such a gorgeous piece of art! I placed it in my entryway and everyone who visits asks about it." },
  { author: "Arjun P.", rating: 4, text: "Good rug. The embroidery is neat and it lays flat without curling at the edges. Happy with the purchase." },
  { author: "Kavita Nair", rating: 5, text: "The floral details are breathtaking. It truly looks like a piece of the 'Firdaus' gardens. Highly recommended." },
  { author: "Rohit Verma", rating: 5, text: "I have bought Kashmiri rugs before, but the Aari work on this one is incredibly dense and well-finished. Excellent authenticity." },
  { author: "Sunita Agarwal", rating: 5, text: "Beautiful craftsmanship. The colors match my decor perfectly. Very soft to walk on." },
  { author: "Deepak L.", rating: 5, text: "A genuine masterpiece. The fringes at the end add a nice traditional touch. Looks very expensive and premium." },
  { author: "Nisha Thakur", rating: 4, text: "Lovely design and great quality. Just a bit of shedding initially, but it settled down after a light vacuum." },
  { author: "Aditi G.", rating: 5, text: "I absolutely love the vibrant hues! It's like having a miniature garden on my floor." },
  { author: "Sanjay Joshi", rating: 5, text: "Top notch quality. The wool is thick and the embroidery is flawless. Harmukh Threads delivered on their promise of authentic Kashmiri art." },
  { author: "Pallavi R.", rating: 5, text: "Stunning! It brings so much warmth and character to my bedroom." },
  { author: "Kiran Patel", rating: 4, text: "Very pretty rug. The traditional patterns are well executed. Good packaging too." },
  { author: "Maya S.", rating: 5, text: "This rug is a conversation starter. The central medallion is so detailed. Absolutely worth every penny." },
  { author: "Amitabh C.", rating: 5, text: "Excellent product. The hand embroidery is tight and secure. Feels like a rug that will last for generations." },
  { author: "Smriti B.", rating: 5, text: "I am mesmerized by the intricate floral motifs. It's truly a labor of love by the artisans." },
  { author: "Ravi K.", rating: 5, text: "Perfect accent rug. The blue and gold accents against the red base are striking. Very happy customer!" },
  { author: "Poonam D.", rating: 5, text: "Gorgeous! The Aari threadwork has a slight sheen that looks beautiful under warm lighting." },
];

async function main() {
  console.log(`Starting to seed reviews for product ${PRODUCT_ID}...`);

  let count = 0;
  for (const review of MOCK_REVIEWS) {
    // Generate a random date between 1 and 60 days ago
    const daysAgo = Math.floor(Math.random() * 60) + 1;
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    await prisma.review.create({
      data: {
        productId: PRODUCT_ID,
        author: review.author,
        rating: review.rating,
        text: review.text,
        createdAt: createdAt
      }
    });
    count++;
  }

  console.log(`Successfully inserted ${count} reviews!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
