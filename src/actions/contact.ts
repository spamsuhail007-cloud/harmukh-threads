'use server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { sendEnquiryCopyEmail } from '@/lib/email';
import { verifyRecaptcha } from '@/lib/recaptcha';

const ContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
  token: z.string().min(1),
});

export async function submitContactForm(data: unknown) {
  const parsed = ContactSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: 'Please fill all fields correctly.' };
  }

  const isValidBot = await verifyRecaptcha(parsed.data.token);
  if (!isValidBot) {
    return { success: false, error: 'Google reCAPTCHA verification failed. Are you a bot?' };
  }

  try {
    const { token, ...dbData } = parsed.data;
    await db.contactMessage.create({ data: dbData });
    await sendEnquiryCopyEmail(dbData);
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
