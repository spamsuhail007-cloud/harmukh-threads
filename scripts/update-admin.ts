import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  const newEmail = 'spam.suhail007@gmail.com';
  const newPassword = ')g)Vam]}_0J2^Z0L)6S_Q1h#~X0]';
  
  const hash = await bcrypt.hash(newPassword, 12);
  
  const existing = await db.adminUser.findFirst();
  
  if (existing) {
    await db.adminUser.update({
      where: { id: existing.id },
      data: { email: newEmail, password: hash }
    });
    console.log('✅ Updated admin credentials successfully.');
    console.log('   Email:', newEmail);
  } else {
    await db.adminUser.create({
      data: { email: newEmail, password: hash, name: 'Admin' }
    });
    console.log('✅ Created new admin user successfully.');
    console.log('   Email:', newEmail);
  }
  
  await db.$disconnect();
}

main().catch(e => {
  console.error('❌ Error:', e);
  process.exit(1);
});
