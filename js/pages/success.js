/* ============================================================
   PAGE: Order Success Confirmation
   ============================================================ */

Router.register('success', () => {
  const page = document.createElement('div');
  const orderNum = 'HT-2026-' + String(Math.floor(Math.random() * 9000) + 1000);

  page.innerHTML = `
    <div class="success-wrap">
      <div class="success-card">
        <div class="success-icon">✓</div>
        <h1>Order Confirmed</h1>
        <p>
          Thank you for your trust in Harmukh Threads. Your piece of Kashmir is now being prepared with the care it deserves. You will receive a confirmation email shortly.
        </p>
        <div class="success-order-id">
          Order Reference: <strong>${orderNum}</strong>
        </div>
        <div style="display:flex;flex-direction:column;gap:var(--space-sm);">
          <button class="btn btn-primary" onclick="Router.navigate('rugs')">Continue Shopping</button>
          <button class="btn btn-ghost" onclick="Router.navigate('home')">Return Home</button>
        </div>
        <div style="margin-top:var(--space-xl);padding:var(--space-lg);background:var(--surface-container-low);border-radius:var(--radius-md);">
          <div style="font-size:0.7rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--secondary);margin-bottom:var(--space-sm);">What happens next?</div>
          <div style="display:flex;flex-direction:column;gap:var(--space-sm);">
            <div style="display:flex;gap:var(--space-sm);align-items:center;font-size:0.875rem;color:var(--on-surface-variant);">
              <span style="color:var(--primary);font-weight:700;">1.</span> Artisan prepares &amp; inspects your piece (1–2 days)
            </div>
            <div style="display:flex;gap:var(--space-sm);align-items:center;font-size:0.875rem;color:var(--on-surface-variant);">
              <span style="color:var(--primary);font-weight:700;">2.</span> Dispatched with insurance &amp; tracking (3–5 days)
            </div>
            <div style="display:flex;gap:var(--space-sm);align-items:center;font-size:0.875rem;color:var(--on-surface-variant);">
              <span style="color:var(--primary);font-weight:700;">3.</span> White-glove delivery to your door
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  return page;
});
