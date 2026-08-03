/* ============================================================
   PAGE: Order Thank You — Payment Confirmation
   Features:
     • Reads order params passed from checkout.js
     • Fires Meta Pixel Purchase event ✅
     • Telegram bot notification on page load (once per order)
     • WhatsApp notify button opens pre-filled message to business
     • Animated checkmark, order summary, next steps
   ============================================================ */

Router.register('success', (params = {}) => {
  const page = document.createElement('div');
  page.className = 'page-enter';

  /* ── Order data ─────────────────────────────────────────── */
  const orderNum   = params.orderNum   || ('HT-2026-' + String(Math.floor(Math.random() * 9000) + 1000));
  const orderTotal = params.orderTotal || 0;
  const orderItems = params.orderItems || [];
  const customer   = params.customer   || {};

  /* ── Fire Meta Pixel Purchase event ────────────────────── */
  if (typeof fbq === 'function' && orderTotal > 0) {
    fbq('track', 'Purchase', {
      value:        orderTotal,
      currency:     'INR',
      content_ids:  orderItems.map(i => String(i.id || i.product?.id || '')),
      content_type: 'product',
      num_items:    orderItems.reduce((s, i) => s + (i.qty || 1), 0)
    });
  }

  /* ── WhatsApp message builder ───────────────────────────── */
  const WHATSAPP_NUMBER = '919876543210'; // ← Replace with your WhatsApp business number (91 + 10 digits, no spaces)

  function buildWhatsAppMessage() {
    const name  = customer.name  || 'Customer';
    const phone = customer.phone || '';
    const itemLines = orderItems.length > 0
      ? orderItems.map(i => `  • ${i.product?.name || i.name || 'Item'} × ${i.qty || 1}`).join('\n')
      : '  • (see order reference)';

    return encodeURIComponent(
`Hi Harmukh Threads! 🙏

I have successfully made the UPI payment for my order.

📦 Order Reference: ${orderNum}
💰 Amount Paid: ₹${orderTotal.toLocaleString('en-IN')}
👤 Name: ${name}${phone ? `\n📱 Phone: ${phone}` : ''}

Items ordered:
${itemLines}

Please confirm receipt and process my order. Thank you!`
    );
  }

  function openWhatsApp() {
    const msg = buildWhatsAppMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
    window.open(url, '_blank', 'noopener');

    // Also fire Telegram notification on button click (deduped)
    sendTelegramNotification('whatsapp_button');

    // Update button state after click
    const btn = document.getElementById('whatsapp-notify-btn');
    const btnText = document.getElementById('wa-btn-text');
    if (btn && btnText) {
      btn.classList.add('wa-sent');
      btnText.textContent = 'Message Sent — We\u2019ll Confirm Shortly';
    }
  }

  /* ── Telegram Notification ──────────────────────────────────
     Calls /api/notify (Vercel serverless function).
     Bot token lives in Vercel env vars — never in this file.
  ─────────────────────────────────────────────────────────── */
  function sendTelegramNotification(trigger = 'page_load') {
    // Guard: only fire once per order
    const dedupKey = `tg_sent_${orderNum}`;
    if (sessionStorage.getItem(dedupKey)) return;
    sessionStorage.setItem(dedupKey, '1');

    // Build a clean items array for the server
    const items = orderItems.map(i => ({
      name: i.product?.name || i.name || 'Item',
      qty:  i.qty || 1
    }));

    fetch('/api/notify', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderNum,
        orderTotal,
        orderItems: items,
        customer: {
          name:  customer.name  || 'Not provided',
          phone: customer.phone || 'Not provided'
        },
        trigger
      })
    })
    .then(res => res.json())
    .then(data => {
      if (!data.ok) console.warn('[Harmukh] Notify failed:', data.error);
    })
    .catch(err => console.warn('[Harmukh] Notify error:', err));
  }

  /* ── Order items summary HTML ───────────────────────────── */
  const itemsHTML = orderItems.length > 0
    ? orderItems.map(item => {
        const p = item.product || item;
        const img = (p.images && p.images[0]) || p.image || '';
        return `
          <div class="ty-item-row">
            ${img ? `<img src="${img}" alt="${p.name || ''}" class="ty-item-img"
                       onerror="this.style.display='none'">` : ''}
            <div class="ty-item-info">
              <div class="ty-item-name">${p.name || 'Handwoven Piece'}</div>
              <div class="ty-item-meta">${p.category || 'Kashmiri Craft'} · Qty ${item.qty || 1}</div>
            </div>
            <div class="ty-item-price">₹${((p.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}</div>
          </div>`;
      }).join('')
    : '';

  /* ── Page HTML ──────────────────────────────────────────── */
  page.innerHTML = `
    <div class="ty-bg">

      <!-- Confetti dots (CSS animated) -->
      <div class="ty-confetti" aria-hidden="true">
        ${Array.from({length: 14}).map((_, i) => `<span class="ty-dot ty-dot-${i % 5}"></span>`).join('')}
      </div>

      <div class="ty-container">

        <!-- ── Top badge ── -->
        <div class="ty-brand-tag">✦ Harmukh Threads</div>

        <!-- ── Animated checkmark ── -->
        <div class="ty-check-wrap" aria-label="Payment confirmed">
          <svg class="ty-check-svg" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle class="ty-check-ring" cx="40" cy="40" r="36" stroke-width="3"/>
            <polyline class="ty-check-mark" points="24,41 35,52 56,29" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <!-- ── Headline ── -->
        <h1 class="ty-headline">Payment Received</h1>
        <p class="ty-subline">
          Thank you for choosing Harmukh Threads.<br>
          Your piece of Kashmir is on its way to you.
        </p>

        <!-- ── Order ref pill ── -->
        <div class="ty-order-ref">
          <span class="ty-ref-label">Order Reference</span>
          <strong class="ty-ref-num">${orderNum}</strong>
        </div>

        <!-- ── Items (if available) ── -->
        ${itemsHTML ? `
        <div class="ty-items-block">
          <div class="ty-section-label">Your Order</div>
          ${itemsHTML}
          <div class="ty-total-row">
            <span>Total Paid</span>
            <strong>₹${orderTotal.toLocaleString('en-IN')}</strong>
          </div>
        </div>` : ''}

        <!-- ── Divider ── -->
        <div class="ty-divider"></div>

        <!-- ── WHATSAPP CTA — Primary Action ── -->
        <div class="ty-wa-section">
          <p class="ty-wa-instruction">
            Tap below to notify us on WhatsApp. We'll confirm your payment and
            share a dispatch update within <strong>2 hours</strong>.
          </p>
          <button id="whatsapp-notify-btn" class="ty-wa-btn" onclick="openWhatsAppNotify()">
            <svg class="ty-wa-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 3C8.82 3 3 8.82 3 16c0 2.46.67 4.76 1.83 6.74L3 29l6.43-1.8A13 13 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3z" fill="currentColor" opacity=".15"/>
              <path d="M16 3C8.82 3 3 8.82 3 16c0 2.46.67 4.76 1.83 6.74L3 29l6.43-1.8A13 13 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm0 23.6a10.57 10.57 0 0 1-5.38-1.47l-.39-.23-4.02 1.06 1.07-3.9-.25-.4A10.6 10.6 0 1 1 16 26.6zm5.8-7.93c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.72.16-.21.32-.82 1.03-1.01 1.24-.18.21-.37.24-.69.08-.32-.16-1.34-.49-2.56-1.57-.94-.84-1.58-1.87-1.77-2.19-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.19.21-.32.32-.54.11-.21.05-.4-.03-.56-.08-.16-.71-1.72-.97-2.35-.26-.62-.52-.53-.72-.54h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.15 3.08 1.31 3.3c.16.21 2.27 3.46 5.5 4.86.77.33 1.37.53 1.84.68.77.24 1.47.21 2.03.13.62-.09 1.88-.77 2.14-1.51.27-.74.27-1.38.19-1.51-.08-.14-.29-.22-.61-.38z" fill="currentColor"/>
            </svg>
            <span id="wa-btn-text">I've Paid — Notify via WhatsApp</span>
          </button>
          <p class="ty-wa-note">Opens WhatsApp with your order details pre-filled</p>
        </div>

        <!-- ── Divider ── -->
        <div class="ty-divider"></div>

        <!-- ── What happens next ── -->
        <div class="ty-steps-block">
          <div class="ty-section-label">What Happens Next</div>
          <div class="ty-steps">
            <div class="ty-step">
              <div class="ty-step-num">1</div>
              <div class="ty-step-body">
                <div class="ty-step-title">Payment Verified</div>
                <div class="ty-step-desc">Our team confirms your UPI payment within 2 hours</div>
              </div>
            </div>
            <div class="ty-step">
              <div class="ty-step-num">2</div>
              <div class="ty-step-body">
                <div class="ty-step-title">Artisan Prepares Your Piece</div>
                <div class="ty-step-desc">Carefully inspected & packed (1–2 days)</div>
              </div>
            </div>
            <div class="ty-step">
              <div class="ty-step-num">3</div>
              <div class="ty-step-body">
                <div class="ty-step-title">Dispatched with Tracking</div>
                <div class="ty-step-desc">Insured shipping across India (3–5 days)</div>
              </div>
            </div>
            <div class="ty-step">
              <div class="ty-step-num">4</div>
              <div class="ty-step-body">
                <div class="ty-step-title">Delivered to Your Door</div>
                <div class="ty-step-desc">Your piece of Kashmir arrives safely</div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Secondary actions ── -->
        <div class="ty-actions">
          <button class="ty-btn-secondary" onclick="Router.navigate('rugs')">Continue Shopping</button>
          <button class="ty-btn-ghost" onclick="Router.navigate('home')">Return Home</button>
        </div>

        <!-- ── Trust strip ── -->
        <div class="ty-trust-strip">
          <span>🔒 SSL Secured</span>
          <span>✦ Handmade Guarantee</span>
          <span>↩ 30-Day Returns</span>
        </div>

      </div>
    </div>

    <!-- ── Styles (scoped) ── -->
    <style>
      /* Background */
      .ty-bg {
        min-height: 100vh;
        background: var(--surface-container-low);
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding: var(--space-2xl) var(--space-md);
        position: relative;
        overflow: hidden;
      }

      /* Confetti dots */
      .ty-confetti { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
      .ty-dot {
        position: absolute;
        width: 8px; height: 8px;
        border-radius: 50%;
        opacity: 0;
        animation: tyDotFall 3s ease-out forwards;
      }
      .ty-dot-0 { background: #c25303; left: 10%; top: -10px; animation-delay: 0.1s; }
      .ty-dot-1 { background: #765a24; left: 20%; top: -10px; animation-delay: 0.3s; }
      .ty-dot-2 { background: #4e6151; left: 35%; top: -10px; animation-delay: 0.5s; }
      .ty-dot-3 { background: #ffb692; left: 50%; top: -10px; animation-delay: 0.2s; }
      .ty-dot-4 { background: #fed795; left: 65%; top: -10px; animation-delay: 0.4s; }
      .ty-confetti span:nth-child(1)  { left:  8%; animation-delay: 0.0s; }
      .ty-confetti span:nth-child(2)  { left: 15%; animation-delay: 0.15s; }
      .ty-confetti span:nth-child(3)  { left: 25%; animation-delay: 0.3s; width:5px; height:5px; }
      .ty-confetti span:nth-child(4)  { left: 38%; animation-delay: 0.1s; }
      .ty-confetti span:nth-child(5)  { left: 48%; animation-delay: 0.5s; width:10px; height:10px; }
      .ty-confetti span:nth-child(6)  { left: 60%; animation-delay: 0.25s; }
      .ty-confetti span:nth-child(7)  { left: 72%; animation-delay: 0.4s; width:6px; height:6px; }
      .ty-confetti span:nth-child(8)  { left: 83%; animation-delay: 0.1s; }
      .ty-confetti span:nth-child(9)  { left: 92%; animation-delay: 0.35s; }
      .ty-confetti span:nth-child(10) { left: 30%; animation-delay: 0.6s; background:#c25303; }
      .ty-confetti span:nth-child(11) { left: 55%; animation-delay: 0.45s; background:#9b4000; }
      .ty-confetti span:nth-child(12) { left: 75%; animation-delay: 0.2s; background:#fed795; }
      .ty-confetti span:nth-child(13) { left: 45%; animation-delay: 0.7s; background:#4e6151; }
      .ty-confetti span:nth-child(14) { left: 88%; animation-delay: 0.55s; background:#765a24; }

      @keyframes tyDotFall {
        0%   { opacity: 0; transform: translateY(-20px) rotate(0deg); }
        20%  { opacity: 1; }
        80%  { opacity: 0.6; }
        100% { opacity: 0; transform: translateY(220px) rotate(360deg); }
      }

      /* Card */
      .ty-container {
        background: var(--surface-container-lowest);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-float);
        max-width: 560px;
        width: 100%;
        padding: var(--space-2xl) var(--space-xl);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        position: relative;
        z-index: 1;
      }
      @media (max-width: 600px) {
        .ty-container { padding: var(--space-xl) var(--space-lg); }
      }

      /* Brand tag */
      .ty-brand-tag {
        font-family: var(--font-serif);
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--secondary);
        margin-bottom: var(--space-lg);
      }

      /* Check animation */
      .ty-check-wrap {
        width: 88px; height: 88px;
        margin-bottom: var(--space-lg);
      }
      .ty-check-svg { width: 100%; height: 100%; }

      .ty-check-ring {
        stroke: var(--primary);
        stroke-dasharray: 226;
        stroke-dashoffset: 226;
        animation: tyRingDraw 0.6s cubic-bezier(0.65,0,0.45,1) 0.2s forwards;
        fill: none;
      }
      .ty-check-mark {
        stroke: var(--primary);
        stroke-dasharray: 48;
        stroke-dashoffset: 48;
        animation: tyCheckDraw 0.4s cubic-bezier(0.65,0,0.45,1) 0.7s forwards;
        fill: none;
      }
      @keyframes tyRingDraw {
        to { stroke-dashoffset: 0; }
      }
      @keyframes tyCheckDraw {
        to { stroke-dashoffset: 0; }
      }

      /* Headline */
      .ty-headline {
        font-family: var(--font-serif);
        font-size: clamp(1.75rem, 5vw, 2.25rem);
        font-weight: 700;
        letter-spacing: -0.02em;
        color: var(--on-surface);
        margin-bottom: var(--space-sm);
      }
      .ty-subline {
        font-size: 0.9375rem;
        color: var(--on-surface-variant);
        line-height: 1.65;
        margin-bottom: var(--space-lg);
      }

      /* Order ref */
      .ty-order-ref {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        background: var(--primary-fixed);
        border: 1px solid var(--outline-variant);
        border-radius: var(--radius-md);
        padding: var(--space-md) var(--space-xl);
        margin-bottom: var(--space-xl);
      }
      .ty-ref-label {
        font-size: 0.65rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--primary);
      }
      .ty-ref-num {
        font-family: var(--font-serif);
        font-size: 1.375rem;
        font-weight: 700;
        color: var(--on-surface);
        letter-spacing: 0.04em;
      }

      /* Items */
      .ty-items-block {
        width: 100%;
        text-align: left;
        margin-bottom: var(--space-xl);
      }
      .ty-section-label {
        font-size: 0.65rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--secondary);
        margin-bottom: var(--space-md);
        text-align: left;
      }
      .ty-item-row {
        display: flex;
        align-items: center;
        gap: var(--space-md);
        padding: var(--space-md) 0;
        border-bottom: 1px solid var(--surface-container-high);
      }
      .ty-item-img {
        width: 52px; height: 64px;
        object-fit: cover;
        border-radius: var(--radius-sm);
        flex-shrink: 0;
      }
      .ty-item-info { flex: 1; }
      .ty-item-name {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--on-surface);
        margin-bottom: 2px;
      }
      .ty-item-meta {
        font-size: 0.75rem;
        color: var(--on-surface-variant);
      }
      .ty-item-price {
        font-size: 0.875rem;
        font-weight: 700;
        color: var(--primary);
        flex-shrink: 0;
      }
      .ty-total-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: var(--space-md);
        font-weight: 700;
        font-size: 0.9375rem;
        color: var(--on-surface);
      }

      /* Divider */
      .ty-divider {
        width: 100%;
        height: 1px;
        background: var(--surface-container-high);
        margin: var(--space-xl) 0;
      }

      /* WhatsApp section */
      .ty-wa-section {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-md);
      }
      .ty-wa-instruction {
        font-size: 0.875rem;
        color: var(--on-surface-variant);
        line-height: 1.6;
        max-width: 380px;
      }
      .ty-wa-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-sm);
        width: 100%;
        padding: 16px var(--space-xl);
        background: #25D366;
        color: #ffffff;
        font-size: 1rem;
        font-weight: 600;
        border-radius: var(--radius-md);
        border: none;
        cursor: pointer;
        transition: background var(--transition-base), transform var(--transition-fast), box-shadow var(--transition-base);
        box-shadow: 0 4px 16px rgba(37, 211, 102, 0.35);
        letter-spacing: 0.01em;
      }
      .ty-wa-btn:hover {
        background: #20b858;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(37, 211, 102, 0.45);
      }
      .ty-wa-btn:active {
        transform: translateY(0);
      }
      .ty-wa-btn.wa-sent {
        background: var(--tertiary);
        box-shadow: 0 4px 16px rgba(78, 97, 81, 0.3);
        pointer-events: none;
      }
      .ty-wa-icon {
        width: 24px; height: 24px;
        color: #ffffff;
        flex-shrink: 0;
      }
      .ty-wa-note {
        font-size: 0.7rem;
        color: var(--on-surface-variant);
        letter-spacing: 0.02em;
      }

      /* Steps */
      .ty-steps-block {
        width: 100%;
        text-align: left;
        margin-bottom: var(--space-xl);
      }
      .ty-steps {
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
        position: relative;
      }
      .ty-steps::before {
        content: '';
        position: absolute;
        left: 15px;
        top: 28px;
        bottom: 16px;
        width: 1px;
        background: var(--outline-variant);
      }
      .ty-step {
        display: flex;
        gap: var(--space-md);
        align-items: flex-start;
      }
      .ty-step-num {
        width: 32px; height: 32px;
        border-radius: 50%;
        background: var(--primary);
        color: var(--on-primary);
        font-size: 0.75rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        position: relative;
        z-index: 1;
        box-shadow: 0 2px 8px rgba(155, 64, 0, 0.25);
      }
      .ty-step-body { padding-top: 5px; }
      .ty-step-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--on-surface);
        margin-bottom: 2px;
      }
      .ty-step-desc {
        font-size: 0.8rem;
        color: var(--on-surface-variant);
        line-height: 1.5;
      }

      /* Actions */
      .ty-actions {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
        margin-bottom: var(--space-xl);
      }
      .ty-btn-secondary {
        width: 100%;
        padding: 13px var(--space-xl);
        background: var(--primary);
        color: var(--on-primary);
        border-radius: var(--radius-md);
        font-size: 0.9375rem;
        font-weight: 600;
        transition: background var(--transition-base), transform var(--transition-fast);
      }
      .ty-btn-secondary:hover {
        background: var(--primary-container);
        transform: translateY(-1px);
      }
      .ty-btn-ghost {
        width: 100%;
        padding: 12px var(--space-xl);
        background: transparent;
        border: 1px solid var(--outline-variant);
        color: var(--on-surface-variant);
        border-radius: var(--radius-md);
        font-size: 0.9rem;
        font-weight: 500;
        transition: border-color var(--transition-base), color var(--transition-base);
      }
      .ty-btn-ghost:hover {
        border-color: var(--outline);
        color: var(--on-surface);
      }

      /* Trust strip */
      .ty-trust-strip {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: var(--space-md);
        font-size: 0.7rem;
        color: var(--on-surface-variant);
        letter-spacing: 0.04em;
      }
    </style>
  `;

  /* ── Expose WhatsApp opener to inline onclick ── */
  window.openWhatsAppNotify = openWhatsApp;

  /* ── Auto-fire Telegram on page load ───────────────────────
     Fires as soon as the customer reaches this page.
     The deduplication guard inside sendTelegramNotification()
     ensures it never fires a second time even if the customer
     also clicks the WhatsApp button afterwards.              */
  setTimeout(() => sendTelegramNotification('page_load'), 300);

  return page;
});
