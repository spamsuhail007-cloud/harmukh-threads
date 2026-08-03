// api/notify.js — Vercel Serverless Function
// Receives order data from the browser and forwards it to Telegram.
// The bot token stays SERVER-SIDE only — never exposed to the browser.

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Read credentials from Vercel Environment Variables
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: 'Telegram credentials not configured' });
  }

  // Parse request body
  const { orderNum, orderTotal, orderItems = [], customer = {}, trigger = 'page_load' } = req.body;

  if (!orderNum) {
    return res.status(400).json({ error: 'Missing orderNum' });
  }

  // Build item list
  const itemLines = orderItems.length > 0
    ? orderItems.map(i => `  • ${i.name || 'Item'} × ${i.qty || 1}`).join('\n')
    : '  • (no item data)';

  const triggerLabel = trigger === 'whatsapp_button'
    ? '📲 Customer clicked "I have paid" button'
    : '👁️ Customer reached Thank You page';

  const timeIST = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const text =
`🛒 *NEW ORDER RECEIVED*
────────────────────

📦 *Order:* \`${orderNum}\`
💰 *Amount:* ₹${Number(orderTotal || 0).toLocaleString('en-IN')}
👤 *Customer:* ${customer.name || 'Not provided'}
📱 *Phone:* ${customer.phone || 'Not provided'}

🗃️ *Items Ordered:*
${itemLines}

${triggerLabel}

⏰ *Time:* ${timeIST} IST

✅ Please confirm UPI payment and process this order.`;

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id:    CHAT_ID,
          text,
          parse_mode: 'Markdown'
        })
      }
    );

    const data = await tgRes.json();

    if (!data.ok) {
      console.error('[notify] Telegram error:', data.description);
      return res.status(502).json({ error: data.description });
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('[notify] Fetch error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
