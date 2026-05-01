import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  console.log('Fetching all reviews from the database...');
  
  const reviews = await db.review.findMany();
  
  if (reviews.length === 0) {
    console.log('No reviews found in the database.');
    return;
  }
  
  console.log(`Found ${reviews.length} reviews. Randomizing their creation dates...`);
  
  const startDate = new Date('2025-01-01T00:00:00Z');
  const endDate = new Date(); // Today

  let updatedCount = 0;
  
  // We can update them individually or in a batch if supported. 
  // Updating individually to assign a unique random date to each.
  for (const review of reviews) {
    const randomDate = getRandomDate(startDate, endDate);
    
    await db.review.update({
      where: { id: review.id },
      data: { createdAt: randomDate }
    });
    
    updatedCount++;
    if (updatedCount % 10 === 0) {
      console.log(`Updated ${updatedCount} reviews...`);
    }
  }
  
  console.log(`Successfully randomized dates for all ${updatedCount} reviews.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
