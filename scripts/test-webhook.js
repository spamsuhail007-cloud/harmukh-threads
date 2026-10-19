// scripts/test-webhook.js
// Test harness to simulate an authoritative YouPI PG webhook dispatch with HMAC-SHA256 signature

import crypto from 'node:crypto';

async function testWebhook() {
  const secret = process.env.YOUPI_WEBHOOK_SECRET || 'ht_sec_youpi_2026_dev';
  const url = process.env.WEBHOOK_URL || 'http://localhost:3000/api/youpi-webhook';

  const payload = {
    event: 'SUCCESS',
    paymentId: 'pay_' + crypto.randomUUID(),
    orderId: 'HT-2026-' + Math.floor(Math.random() * 9000 + 1000),
    amount: '18500.00',
    amountPaise: 1850000,
    currency: 'INR',
    method: 'UPI',
    utr: 'UTR' + Math.floor(Math.random() * 899999999999 + 100000000000),
    completedAt: new Date().toISOString(),
    metadata: {
      store: 'Harmukh Threads',
      note: 'Handmade Pashmina Shawl'
    }
  };

  const rawBody = JSON.stringify(payload);
  const signature = 'sha256=' + crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

  console.log('====================================================');
  console.log('⚡ YOUPI PG — SIMULATED WEBHOOK DISPATCH');
  console.log('====================================================');
  console.log('Target URL: ', url);
  console.log('Order ID:   ', payload.orderId);
  console.log('Amount:     ', '₹' + payload.amount);
  console.log('Bank UTR:   ', payload.utr);
  console.log('Signature:  ', signature.substring(0, 24) + '...');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Gateway-Event': 'SUCCESS',
        'X-Gateway-Signature': signature,
        'X-Gateway-Delivery-Id': crypto.randomUUID(),
        'X-Gateway-Timestamp': Date.now().toString()
      },
      body: rawBody
    });

    const data = await res.json();
    console.log(`\nResponse (HTTP ${res.status}):`, data);

    if (res.ok && data.verified) {
      console.log('✅ Webhook verified and accepted successfully!');
    } else {
      console.warn('⚠️ Webhook rejected or error returned.');
    }
  } catch (err) {
    console.log('\n[Notice] Could not connect to local serverless port 3000:', err.message);
    console.log('Make sure your local Vercel / Node server is running on http://localhost:3000');
  }
  console.log('====================================================');
}

testWebhook();
