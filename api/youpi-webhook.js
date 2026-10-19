// api/youpi-webhook.js — Vercel Serverless Function
// Authoritative server-to-server webhook endpoint for YouPI PG.
// Verifies HMAC-SHA256 signature to guarantee payment authenticity before order fulfillment.

import crypto from 'node:crypto';

export const config = {
  api: {
    bodyParser: false, // Required to capture raw request stream for byte-accurate HMAC verification
  },
};

// Helper to buffer the raw request stream
async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawBuffer = await getRawBody(req);
    const signature = req.headers['x-gateway-signature'] || '';
    const secret = process.env.YOUPI_WEBHOOK_SECRET || 'ht_sec_youpi_2026_dev';

    // Calculate expected HMAC-SHA256 signature
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(rawBuffer);
    const expected = 'sha256=' + hmac.digest('hex');

    // Secure timing-safe signature comparison
    const sigBuffer = Buffer.from(signature);
    const expBuffer = Buffer.from(expected);

    if (
      sigBuffer.length === 0 ||
      sigBuffer.length !== expBuffer.length ||
      !crypto.timingSafeEqual(sigBuffer, expBuffer)
    ) {
      console.warn('[YouPI Webhook] Unauthorized signature attempt:', {
        receivedSig: signature,
        expectedLength: expected.length,
      });
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    // Parse verified JSON payload
    const payload = JSON.parse(rawBuffer.toString('utf8'));
    console.log('[YouPI Webhook] Verified event received:', payload);

    const {
      event,
      orderId,
      utr = 'N/A',
      amount = '0.00',
      amountPaise = 0,
      paymentId = '',
    } = payload;

    if (event === 'SUCCESS') {
      // 1. Authoritative Telegram notification to business owner
      const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
      const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

      if (BOT_TOKEN && CHAT_ID) {
        const timeIST = new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'medium',
          timeStyle: 'short',
        });

        const text =
`⚡ *YOUPI PG — UPI PAYMENT VERIFIED* ⚡
────────────────────
✅ *Status:* Paid & Verified (Direct-to-Bank)
📦 *Order ID:* \`${orderId}\`
💰 *Amount Credited:* ₹${Number(amount).toLocaleString('en-IN')}
🏦 *Bank UTR / Ref:* \`${utr}\`
🆔 *Payment ID:* \`${paymentId}\`
⏰ *Verified At:* ${timeIST} IST

🎉 Zero platform fees deducted. Funds credited directly to merchant bank account.`;

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text,
            parse_mode: 'Markdown',
          }),
        }).catch(err => console.error('[YouPI Webhook] Telegram send error:', err));
      }
    }

    return res.status(200).json({ received: true, verified: true });
  } catch (err) {
    console.error('[YouPI Webhook] Handler error:', err);
    return res.status(500).json({ error: 'Internal server error processing webhook' });
  }
}
