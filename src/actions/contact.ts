'use server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { sendEnquiryCopyEmail, sendAdminEnquiryNotification } from '@/lib/email';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { sendTelegramAlert } from '@/lib/telegram';

const ContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10, "Phone number is required"),
  subject: z.string().min(3),
  message: z.string().min(10),
  token: z.string(),
});

export async function submitContactForm(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsed = ContactSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: 'Please fill all fields correctly.' };
  }

  const recaptchaResult = await verifyRecaptcha(parsed.data.token);
  if (!recaptchaResult.success) {
    const errorDetails = recaptchaResult.errorCodes 
      ? `Codes: ${recaptchaResult.errorCodes.join(',')}` 
      : `Score: ${recaptchaResult.score || 'N/A'}`;
    return { 
      success: false, 
      error: `Google reCAPTCHA verification failed. Are you a bot? (${errorDetails})` 
    };
  }

  try {
    const { token, ...dbData } = parsed.data;

    // Critical: save to DB — if this fails, return error
    await db.contactMessage.create({ data: dbData });

    // Critical Fix: We MUST await this on Vercel, otherwise the Serverless Function freezes 
    // the container immediately upon returning and kills the outgoing email network requests!
    await Promise.allSettled([
      sendEnquiryCopyEmail(dbData),
      sendAdminEnquiryNotification(dbData),
      sendTelegramAlert(
        `📩 <b>NEW ENQUIRY</b>\n` +
        `👤 ${dbData.name}\n` +
        `📞 ${dbData.phone}\n` +
        `📬 ${dbData.email}\n` +
        `💬 <b>${dbData.subject}</b>\n\n` +
        `${dbData.message.slice(0, 200)}${dbData.message.length > 200 ? '...' : ''}`
      ),
    ]).catch(err => console.error('[Notifications] Error:', err));

    return { success: true };
  } catch (err) {
    console.error('[ContactForm] Error saving message:', err);
    return { success: false, error: 'Something went wrong saving your message. Please try again.' };
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
