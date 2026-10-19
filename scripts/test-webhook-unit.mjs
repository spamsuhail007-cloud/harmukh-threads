// scripts/test-webhook-unit.mjs
// Verifies HMAC-SHA256 signature logic for api/youpi-webhook.js

import assert from 'node:assert';
import crypto from 'node:crypto';
import handler from '../api/youpi-webhook.js';
import { Readable } from 'node:stream';

const secret = 'ht_sec_youpi_2026_dev';
process.env.YOUPI_WEBHOOK_SECRET = secret;

async function runTests() {
  console.log('🧪 Testing api/youpi-webhook.js HMAC signature verification...');

  // Test 1: Valid signature
  {
    const payload = JSON.stringify({
      event: 'SUCCESS',
      orderId: 'HT-2026-9999',
      utr: 'UTR112233445566',
      amount: '5000.00',
      amountPaise: 500000
    });
    const signature = 'sha256=' + crypto.createHmac('sha256', secret).update(payload).digest('hex');

    const req = Readable.from(Buffer.from(payload));
    req.method = 'POST';
    req.headers = {
      'x-gateway-signature': signature
    };

    let statusCode = null;
    let jsonOutput = null;
    const res = {
      status(code) { statusCode = code; return this; },
      json(data) { jsonOutput = data; return this; }
    };

    await handler(req, res);
    assert.strictEqual(statusCode, 200, `Expected 200 for valid signature, got ${statusCode}`);
    assert.strictEqual(jsonOutput.verified, true);
    console.log('  ✔ Test 1: Valid HMAC signature verified and accepted (200 OK)');
  }

  // Test 2: Invalid signature
  {
    const payload = JSON.stringify({ event: 'SUCCESS', orderId: 'HT-TAMPERED' });
    const req = Readable.from(Buffer.from(payload));
    req.method = 'POST';
    req.headers = {
      'x-gateway-signature': 'sha256=0000000000000000000000000000000000000000000000000000000000000000'
    };

    let statusCode = null;
    let jsonOutput = null;
    const res = {
      status(code) { statusCode = code; return this; },
      json(data) { jsonOutput = data; return this; }
    };

    await handler(req, res);
    assert.strictEqual(statusCode, 401, `Expected 401 for forged signature, got ${statusCode}`);
    console.log('  ✔ Test 2: Invalid / forged HMAC signature correctly rejected (401 Unauthorized)');
  }

  // Test 3: Non-POST method
  {
    const req = { method: 'GET', headers: {} };
    let statusCode = null;
    const res = {
      status(code) { statusCode = code; return this; },
      json(data) { return this; }
    };
    await handler(req, res);
    assert.strictEqual(statusCode, 405);
    console.log('  ✔ Test 3: Non-POST request correctly rejected (405 Method Not Allowed)');
  }

  console.log('🎉 All webhook unit verification tests passed!\n');
}

runTests().catch(err => {
  console.error('[-] Test failed:', err);
  process.exit(1);
});
