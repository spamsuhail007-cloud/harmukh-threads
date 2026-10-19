// api/update-vpa.js — Vercel / Node serverless function
// Allows editing the receiving UPI ID and syncs to SQLite database when running locally

import path from 'node:path';
import fs from 'node:fs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { upiId, payeeName = 'Harmukh Threads' } = req.body || {};

    if (!upiId || typeof upiId !== 'string' || !upiId.includes('@')) {
      return res.status(400).json({ error: 'Invalid UPI ID format. Expected format: username@bank' });
    }

    const cleanUpiId = upiId.trim().toLowerCase();
    const cleanPayee = (payeeName || 'Harmukh Threads').trim();

    let dbUpdated = false;

    // Check if running in an environment with local SQLite access
    const dbPath = path.resolve(process.cwd(), 'youpi-gateway', 'data', 'youpi_pg.sqlite');

    if (fs.existsSync(dbPath)) {
      try {
        const { DatabaseSync } = await import('node:sqlite');
        const db = new DatabaseSync(dbPath);

        db.prepare(`
          UPDATE payment_receiving_accounts
          SET upi_id = ?, payee_name = ?
          WHERE merchant_id = '00000000-0000-0000-0000-000000000001'
        `).run(cleanUpiId, cleanPayee);

        db.close();
        dbUpdated = true;
        console.log(`[Update VPA] Successfully synced receiving account in SQLite: ${cleanUpiId}`);
      } catch (dbErr) {
        console.warn('[Update VPA] SQLite update skipped or failed:', dbErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      upiId: cleanUpiId,
      payeeName: cleanPayee,
      dbUpdated,
      message: `Receiving UPI ID updated to ${cleanUpiId}`
    });
  } catch (err) {
    console.error('[Update VPA] Handler error:', err);
    return res.status(500).json({ error: 'Internal server error updating UPI ID' });
  }
}
