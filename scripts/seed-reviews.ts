import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const indianNames = [
  "Aarav Sharma", "Vivaan Patel", "Aditya Singh", "Vihaan Kumar", "Arjun Gupta",
  "Sai Reddy", "Ayaan Das", "Krishna Rao", "Ishaan Joshi", "Shaurya Nair",
  "Diya Mishra", "Aarohi Desai", "Ananya Menon", "Saanvi Iyer", "Aditi Pillai",
  "Kavya Reddy", "Navya Bhat", "Myra Kapoor", "Riya Verma", "Kyra Ahuja",
  "Rohan Mehra", "Kabir Chadha", "Dhruv Malik", "Mira Sengupta", "Isha Nambiar",
  "Neha Agarwal", "Pooja Trivedi", "Rahul Jain", "Vikram Chauhan", "Nisha Bhatia",
  "Rahul Sharma", "Karan Malhotra", "Priya Singh", "Simran Kaur", "Amit Patel"
];

const positiveAdjectives = ["Beautiful", "Stunning", "Exquisite", "Gorgeous", "Elegant", "Premium", "Luxurious"];
const qualityPhrases = [
  "The knotting is incredibly detailed and fine.",
  "Feels so soft and luxurious underfoot.",
  "Colors are rich and exactly as shown in the picture.",
  "Adds such a royal look to my living room.",
  "The craftsmanship is truly authentic Kashmiri.",
  "Feels very premium, a true heirloom piece."
];
const deliveryPhrases = [
  "Arrived well packaged.",
  "Delivery was fast and hassle-free.",
  "Customer service was helpful when I had a query.",
  "Packaging was very secure."
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateReviewText(): string {
  const isShort = Math.random() > 0.5;
  if (isShort) {
    return `${getRandomItem(positiveAdjectives)} rug! ${getRandomItem(qualityPhrases)}`;
  } else {
    return `${getRandomItem(positiveAdjectives)} piece of art. ${getRandomItem(qualityPhrases)} ${getRandomItem(deliveryPhrases)} Highly recommended.`;
  }
}

async function main() {
  console.log('Fetching rugs...');
  const rugs = await db.product.findMany({
    where: { category: 'Rugs' }
  });

  if (rugs.length === 0) {
    console.log('No rugs found.');
    return;
  }

  console.log(`Found ${rugs.length} rugs. Checking for those without reviews...`);

  let addedCount = 0;

  for (const rug of rugs) {
    // Check existing reviews
    const existing = await db.review.count({ where: { productId: rug.id } });
    if (existing > 0) {
      console.log(`Rug '${rug.name}' already has ${existing} reviews. Skipping.`);
      continue;
    }

    const numReviews = Math.floor(Math.random() * 2) + 4; // 4 or 5 reviews
    
    const reviewsToCreate = [];
    // Shuffle names array to get unique names for this product
    const shuffledNames = [...indianNames].sort(() => 0.5 - Math.random());

    for (let i = 0; i < numReviews; i++) {
      reviewsToCreate.push({
        productId: rug.id,
        author: shuffledNames[i],
        rating: Math.random() > 0.2 ? 5 : 4, // Mostly 5 stars, some 4 stars
        text: generateReviewText(),
      });
    }

    await db.review.createMany({
      data: reviewsToCreate
    });

    addedCount += reviewsToCreate.length;
    console.log(`Added ${reviewsToCreate.length} reviews for '${rug.name}'`);
  }

  console.log(`Successfully added ${addedCount} total reviews to rugs.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
