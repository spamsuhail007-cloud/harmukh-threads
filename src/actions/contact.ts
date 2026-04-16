'use server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { sendEnquiryCopyEmail } from '@/lib/email';

const ContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

export async function submitContactForm(data: unknown) {
  const parsed = ContactSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: 'Please fill all fields correctly.' };
  }
  try {
    await db.contactMessage.create({ data: parsed.data });
    await sendEnquiryCopyEmail(parsed.data);
    return { success: true };
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

export async function getMessages() {
  return db.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function updateMessageStatus(id: string, status: string) {
  await db.contactMessage.update({
    where: { id },
    data: { status: status as never },
  });
  revalidatePath('/admin/messages');
}
