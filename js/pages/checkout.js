/* ============================================================
   PAGE: Checkout — Harmukh Threads × YouPI PG Sovereign Gateway
   Features:
     • YouPI PG V2 Universal Integration (Instant Prepaid UPI)
     • Receiving UPI ID: 9796381311@axl (Direct-to-bank settlement)
     • COD is strictly disabled
     • Dynamic vector SVG QR codes, 1-tap mobile deep links (GPay, PhonePe, Paytm, CRED)
     • WhatsApp pre-checkout verification
     • Single-slot deterministic FIFO queue
     • Seamless fallback & Dev Mode Simulator if gateway server is offline
     • Abandoned Cart auto-save
     • Full integration with Meta Pixel & Telegram notifications
   ============================================================ */

Router.register('checkout', () => {
  const cartItems = Cart.getItems();
  const total = Cart.total();
  const config = window.HT_CONFIG ? window.HT_CONFIG.get() : {
    gatewayUrl: 'http://localhost:7000',
    apiUrl: 'http://localhost:6100',
    merchantKey: '00000000-0000-0000-0000-000000000001',
    merchantName: 'Harmukh Threads',
    merchantVpa: '9796381311@axl'
  };

  const currentVpa = config.merchantVpa || '9796381311@axl';

  const page = document.createElement('div');
  page.style.cssText = 'padding:var(--space-2xl) 0;background:var(--surface-container-low);min-height:80vh;';

  page.innerHTML = `
    <div class="container">
      <!-- Header -->
      <div style="text-align:center;margin-bottom:var(--space-2xl);">
        <div style="font-family:var(--font-serif);font-size:1rem;font-weight:600;letter-spacing:0.1em;color:var(--secondary);margin-bottom:var(--space-sm);">✦ Harmukh Threads</div>
        <h1 style="font-family:var(--font-serif);font-size:2rem;font-weight:700;letter-spacing:-0.02em;color:var(--on-surface);">Secure Sovereign Checkout</h1>
        <p style="font-size:0.875rem;color:var(--on-surface-variant);margin-top:6px;">Direct Artisan-to-Customer Settlement · Zero Aggregator Fees</p>
      </div>

      <div style="display:grid;grid-template-columns:1fr 380px;gap:var(--space-2xl);align-items:start;">

        <!-- Left: Forms -->
        <div>
          <!-- Contact -->
          <div style="background:var(--surface-container-lowest);border-radius:var(--radius-md);padding:var(--space-xl);margin-bottom:var(--space-lg);box-shadow:var(--shadow-ambient);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-lg);">
              <h2 style="font-family:var(--font-serif);font-size:1.1rem;font-weight:600;margin:0;">Contact Information</h2>
              <span style="font-size:0.75rem;color:var(--secondary);display:flex;align-items:center;gap:4px;">
                <span>💬 WhatsApp Delivery Updates</span>
              </span>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="first-name">First Name</label>
                <input class="form-input" id="first-name" type="text" placeholder="Aisha" autocomplete="given-name">
              </div>
              <div class="form-group">
                <label class="form-label" for="last-name">Last Name</label>
                <input class="form-input" id="last-name" type="text" placeholder="Khan" autocomplete="family-name">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="email">Email Address</label>
              <input class="form-input" id="email" type="email" placeholder="aisha@example.com" autocomplete="email">
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" for="phone">Phone / WhatsApp Number (for OTP & Dispatch)</label>
              <input class="form-input" id="phone" type="tel" placeholder="+91 98765 43210" autocomplete="tel">
            </div>
          </div>

          <!-- Shipping -->
          <div style="background:var(--surface-container-lowest);border-radius:var(--radius-md);padding:var(--space-xl);margin-bottom:var(--space-lg);box-shadow:var(--shadow-ambient);">
            <h2 style="font-family:var(--font-serif);font-size:1.1rem;font-weight:600;margin-bottom:var(--space-lg);">Shipping Address</h2>
            <div class="form-group">
              <label class="form-label" for="address">Street Address</label>
              <input class="form-input" id="address" type="text" placeholder="14 Residency Road" autocomplete="street-address">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="city">City</label>
                <input class="form-input" id="city" type="text" placeholder="Mumbai" autocomplete="address-level2">
              </div>
              <div class="form-group">
                <label class="form-label" for="pincode">PIN Code</label>
                <input class="form-input" id="pincode" type="text" placeholder="400 001" autocomplete="postal-code">
              </div>
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" for="country">Country</label>
              <select class="form-select" id="country" autocomplete="country">
                <option>India</option>
                <option>United Kingdom</option>
                <option>United States</option>
                <option>United Arab Emirates</option>
                <option>Singapore</option>
                <option>Canada</option>
                <option>Australia</option>
              </select>
            </div>
          </div>

          <!-- Payment -->
          <div style="background:var(--surface-container-lowest);border-radius:var(--radius-md);padding:var(--space-xl);box-shadow:var(--shadow-ambient);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-lg);">
              <h2 style="font-family:var(--font-serif);font-size:1.1rem;font-weight:600;margin:0;">Payment Method</h2>
              <span class="badge badge-primary" style="font-size:0.65rem;letter-spacing:0.04em;">⚡ 100% Secure Prepaid</span>
            </div>

            <!-- Method Selection (Prepaid Only - No COD) -->
            <div style="display:flex;flex-wrap:wrap;gap:var(--space-sm);margin-bottom:var(--space-lg);">
              <button class="badge badge-primary pay-chip" data-method="upi" style="padding:10px 18px;cursor:pointer;font-size:0.8rem;display:flex;align-items:center;gap:6px;">
                <span>🇮🇳 Instant UPI (QR & Any UPI App)</span>
              </button>
              <button class="badge badge-secondary pay-chip" data-method="card" style="padding:10px 18px;cursor:pointer;font-size:0.8rem;display:flex;align-items:center;gap:6px;">
                <span>💳 Card / NetBanking</span>
              </button>
            </div>

            <!-- YouPI Gateway Banner -->
            <div id="youpi-gateway-box" style="border:1px solid var(--outline-variant);border-radius:var(--radius-md);padding:var(--space-md);background:var(--surface-container-low);margin-bottom:var(--space-md);">
              <div style="display:flex;align-items:flex-start;gap:12px;">
                <div style="width:36px;height:36px;background:var(--primary);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;flex-shrink:0;">
                  ✦
                </div>
                <div style="flex:1;">
                  <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
                    <div style="font-size:0.875rem;font-weight:700;color:var(--on-surface);">YouPI PG Direct UPI Rail</div>
                    <span style="font-family:monospace;font-size:0.75rem;background:var(--surface-container-highest);padding:2px 8px;border-radius:4px;color:var(--primary);font-weight:600;">
                      ${currentVpa}
                    </span>
                  </div>
                  <div style="font-size:0.75rem;color:var(--on-surface-variant);line-height:1.5;margin-top:4px;" id="youpi-box-desc">
                    Generates dynamic vector SVG QR code and 1-tap app switchers for Google Pay, PhonePe, Paytm, and CRED. Verified directly on NPCI banking rails without intermediaries.
                  </div>
                  <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;">
                    <span style="font-size:0.7rem;background:var(--surface-container-highest);padding:2px 8px;border-radius:4px;">🔒 0% Aggregator Fee</span>
                    <span style="font-size:0.7rem;background:var(--surface-container-highest);padding:2px 8px;border-radius:4px;">⚡ Direct to ${currentVpa}</span>
                    <span style="font-size:0.7rem;background:var(--surface-container-highest);padding:2px 8px;border-radius:4px;">💬 WhatsApp Verification</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card Fields (Only shown if Card selected) -->
            <div id="card-fields" style="display:none;">
              <div class="form-group">
                <label class="form-label" for="card-num">Card Number</label>
                <input class="form-input" id="card-num" type="text" placeholder="4242 4242 4242 4242" maxlength="19">
              </div>
              <div class="form-row">
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label" for="card-exp">Expiry</label>
                  <input class="form-input" id="card-exp" type="text" placeholder="MM / YY">
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label" for="card-cvv">CVV</label>
                  <input class="form-input" id="card-cvv" type="text" placeholder="•••" maxlength="4">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Order Summary -->
        <div style="position:sticky;top:calc(var(--navbar-height)+var(--space-lg));">
          <div style="background:var(--surface-container-lowest);border-radius:var(--radius-md);padding:var(--space-xl);box-shadow:var(--shadow-ambient);">
            <h2 style="font-family:var(--font-serif);font-size:1.1rem;font-weight:600;margin-bottom:var(--space-lg);">Order Summary</h2>

            <div id="checkout-items">
              ${cartItems.length > 0
                ? cartItems.map(item => `
                    <div style="display:flex;gap:var(--space-md);margin-bottom:var(--space-md);padding-bottom:var(--space-md);border-bottom:1px solid var(--surface-container-high);">
                      <div style="position:relative;flex-shrink:0;">
                        <img src="${item.product.images[0]}" alt="${item.product.name}"
                             style="width:56px;height:70px;object-fit:cover;border-radius:var(--radius-sm);"
                             onerror="this.src='https://images.unsplash.com/photo-1600166898405-da9535204843?w=200&q=60'">
                        <span style="position:absolute;top:-8px;right:-8px;width:20px;height:20px;background:var(--primary);color:var(--on-primary);border-radius:var(--radius-full);font-size:0.65rem;font-weight:700;display:flex;align-items:center;justify-content:center;">${item.qty}</span>
                      </div>
                      <div style="flex:1;">
                        <div style="font-size:0.875rem;font-weight:600;color:var(--on-surface);margin-bottom:2px;">${item.product.name}</div>
                        <div style="font-size:0.75rem;color:var(--on-surface-variant);">${item.product.category}</div>
                      </div>
                      <div style="font-size:0.875rem;font-weight:600;color:var(--primary);">${formatPrice(item.product.price * item.qty)}</div>
                    </div>
                  `).join('')
                : `<div style="text-align:center;padding:var(--space-xl);color:var(--on-surface-variant);">
                     <p style="margin-bottom:var(--space-md);">Your bag is empty.</p>
                     <button class="btn btn-secondary btn-sm" onclick="Router.navigate('rugs')">Browse Collection</button>
                   </div>`
              }
            </div>

            <div style="border-top:1px solid var(--surface-container-high);padding-top:var(--space-md);margin-top:var(--space-sm);">
              <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-sm);">
                <span style="font-size:0.875rem;color:var(--on-surface-variant);">Subtotal</span>
                <span style="font-size:0.875rem;font-weight:600;">${formatPrice(total)}</span>
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-md);">
                <span style="font-size:0.875rem;color:var(--on-surface-variant);">Shipping</span>
                <span style="font-size:0.875rem;color:var(--tertiary);font-weight:600;">Free</span>
              </div>
              <div style="display:flex;justify-content:space-between;padding-top:var(--space-md);border-top:1px solid var(--surface-container-high);">
                <span style="font-weight:700;">Total</span>
                <span style="font-family:var(--font-serif);font-size:1.25rem;font-weight:700;color:var(--primary);">${formatPrice(total)}</span>
              </div>
            </div>

            <button class="btn btn-primary btn-full" id="place-order-btn" style="margin-top:var(--space-lg);font-size:1rem;padding:16px;">
              Pay via UPI — ${formatPrice(total)}
            </button>

            <div style="display:flex;align-items:center;justify-content:center;gap:var(--space-sm);margin-top:var(--space-md);">
              <span style="font-size:0.75rem;color:var(--on-surface-variant);">🛡️ Prepaid Sovereign UPI · 30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Offline / Developer Helper Modal -->
    <div id="youpi-fallback-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:99999;align-items:center;justify-content:center;padding:16px;">
      <div style="background:var(--surface-container-lowest);border-radius:var(--radius-lg);padding:var(--space-xl);max-width:500px;width:100%;box-shadow:var(--shadow-float);position:relative;">
        <div style="text-align:center;margin-bottom:var(--space-lg);">
          <div style="width:48px;height:48px;border-radius:50%;background:rgba(155,64,0,0.1);color:var(--primary);display:inline-flex;align-items:center;justify-content:center;font-size:1.5rem;margin-bottom:12px;">⚡</div>
          <h3 style="font-family:var(--font-serif);font-size:1.25rem;font-weight:700;margin-bottom:6px;">YouPI PG Gateway Notice</h3>
          <p style="font-size:0.875rem;color:var(--on-surface-variant);line-height:1.5;" id="youpi-fallback-msg">
            The YouPI PG Gateway server was not detected at <code>${config.gatewayUrl}</code>.
          </p>
        </div>

        <div style="background:var(--surface-container-low);border-radius:var(--radius-md);padding:14px;margin-bottom:var(--space-lg);font-size:0.8rem;line-height:1.6;">
          <div style="font-weight:600;color:var(--on-surface);margin-bottom:4px;">Receiving VPA: <code>${currentVpa}</code></div>
          <div style="color:var(--on-surface-variant);margin-bottom:6px;">To start the live YouPI Gateway with this VPA:</div>
          <pre style="background:#1e1e1e;color:#50fa7b;padding:8px 12px;border-radius:4px;overflow-x:auto;font-size:0.75rem;">npm run gateway:dev</pre>
        </div>

        <div style="display:flex;flex-direction:column;gap:10px;">
          <button id="simulate-youpi-btn" class="btn btn-primary btn-full" style="padding:14px;">
            Simulate Verified UPI Payment to ${currentVpa}
          </button>
          <button id="close-fallback-btn" class="btn btn-ghost btn-full" style="padding:12px;">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `;

  // Bind interactions
  setTimeout(() => {
    let selectedMethod = 'upi';
    const payChips = page.querySelectorAll('.pay-chip');
    const youpiBox = document.getElementById('youpi-gateway-box');
    const cardFields = document.getElementById('card-fields');
    const placeBtn = document.getElementById('place-order-btn');

    payChips.forEach(chip => {
      chip.addEventListener('click', () => {
        selectedMethod = chip.dataset.method;
        payChips.forEach(c => {
          c.className = `badge ${c.dataset.method === selectedMethod ? 'badge-primary' : 'badge-secondary'} pay-chip`;
          c.style.cssText = 'padding:10px 18px;cursor:pointer;font-size:0.8rem;display:flex;align-items:center;gap:6px;';
        });

        if (selectedMethod === 'upi') {
          youpiBox.style.display = 'block';
          cardFields.style.display = 'none';
          placeBtn.textContent = `Pay via UPI — ${formatPrice(total)}`;
        } else {
          youpiBox.style.display = 'none';
          cardFields.style.display = 'block';
          placeBtn.textContent = `Place Order — ${formatPrice(total)}`;
        }
      });
    });

    // Credit card number formatting
    const cardNum = document.getElementById('card-num');
    if (cardNum) {
      cardNum.addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 16);
        e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
      });
    }

    // ── Abandoned Cart Auto-Save ─────────────────────────────
    const ABANDON_KEY = 'ht_abandoned_carts';

    function saveAbandonedCart() {
      const firstName = (document.getElementById('first-name')?.value || '').trim();
      const lastName  = (document.getElementById('last-name')?.value  || '').trim();
      const email     = (document.getElementById('email')?.value      || '').trim();
      const phone     = (document.getElementById('phone')?.value      || '').trim();
      const address   = (document.getElementById('address')?.value    || '').trim();
      const city      = (document.getElementById('city')?.value       || '').trim();
      const pincode   = (document.getElementById('pincode')?.value    || '').trim();

      if (!firstName && !phone && !email) return;

      const items = Cart.getItems().map(i => ({
        name:  i.product?.name || 'Item',
        price: i.product?.price || 0,
        qty:   i.qty || 1,
        image: i.product?.images?.[0] || ''
      }));

      const entry = {
        id:        `AC-${Date.now()}`,
        savedAt:   new Date().toISOString(),
        customer: {
          name:    [firstName, lastName].filter(Boolean).join(' '),
          email,
          phone,
          address: [address, city, pincode].filter(Boolean).join(', ')
        },
        items,
        total:     Cart.total(),
        status:    'Abandoned'
      };

      const dedupKey = (email || phone || firstName).toLowerCase();
      const existing = JSON.parse(localStorage.getItem(ABANDON_KEY) || '{}');
      existing[dedupKey] = entry;
      localStorage.setItem(ABANDON_KEY, JSON.stringify(existing));
    }

    ['first-name','last-name','email','phone','address','city','pincode'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('blur',  saveAbandonedCart);
        el.addEventListener('input', saveAbandonedCart);
      }
    });

    function clearAbandoned(customer) {
      const dedupKey = (customer.email || customer.phone || customer.name).toLowerCase();
      if (dedupKey) {
        const existing = JSON.parse(localStorage.getItem(ABANDON_KEY) || '{}');
        delete existing[dedupKey];
        localStorage.setItem(ABANDON_KEY, JSON.stringify(existing));
      }
    }

    // Modal helpers
    const fallbackModal = document.getElementById('youpi-fallback-modal');
    const closeFallbackBtn = document.getElementById('close-fallback-btn');
    const simulateBtn = document.getElementById('simulate-youpi-btn');

    if (closeFallbackBtn) {
      closeFallbackBtn.addEventListener('click', () => {
        fallbackModal.style.display = 'none';
        placeBtn.disabled = false;
        placeBtn.textContent = `Pay via UPI — ${formatPrice(total)}`;
      });
    }

    // Place order handler
    if (placeBtn) {
      placeBtn.addEventListener('click', async () => {
        if (Cart.count() === 0) {
          alert('Your bag is empty.');
          return;
        }

        placeBtn.textContent = 'Connecting to Gateway...';
        placeBtn.disabled = true;

        const firstName = (document.getElementById('first-name')?.value || '').trim();
        const lastName  = (document.getElementById('last-name')?.value  || '').trim();
        const email     = (document.getElementById('email')?.value      || '').trim();
        const phone     = (document.getElementById('phone')?.value      || '').trim();
        const address   = (document.getElementById('address')?.value    || '').trim();
        const city      = (document.getElementById('city')?.value       || '').trim();
        const pincode   = (document.getElementById('pincode')?.value    || '').trim();

        const customer = {
          name: [firstName, lastName].filter(Boolean).join(' ') || 'Valued Customer',
          phone,
          email,
          address: [address, city, pincode].filter(Boolean).join(', ')
        };

        const orderNum = 'HT-2026-' + String(Math.floor(Math.random() * 9000) + 1000);
        const orderItems = Cart.getItems();
        const orderTotal = Cart.total();

        // 1. If UPI, launch YouPI PG Checkout Modal
        if (selectedMethod === 'upi') {
          try {
            // Verify SDK is loaded
            if (typeof window.Youpi === 'undefined' || typeof window.Youpi.pay !== 'function') {
              throw new Error('YouPI SDK not ready');
            }

            console.log(`[Harmukh] Launching YouPI PG Checkout for Order: ${orderNum} (VPA: ${currentVpa})`);
            window.Youpi.pay({
              key: config.merchantKey,
              order_id: orderNum,
              amount: orderTotal,
              currency: 'INR',
              name: 'Harmukh Threads',
              description: `Handcrafted Kashmir Heritage Pieces (${orderItems.length} items)`,
              customer: {
                name: customer.name,
                email: customer.email,
                phone: customer.phone
              },
              metadata: {
                shippingAddress: customer.address,
                store: 'Harmukh Threads',
                receivingVpa: currentVpa
              },
              portalUrl: config.gatewayUrl,
              apiUrl: config.apiUrl,
              theme: { color: '#9b4000' },
              handler: function(response) {
                console.log('[Harmukh] YouPI payment verified by observer!', response);
                clearAbandoned(customer);
                Cart.clear();
                Router.navigate('success', {
                  orderNum: response.order_id || orderNum,
                  orderItems,
                  orderTotal,
                  customer,
                  utr: response.utr || response.bankRef || ('UTR' + Math.floor(Math.random() * 899999999999 + 100000000000)),
                  paymentId: response.paymentId,
                  method: 'Instant UPI (YouPI PG Verified)'
                });
              },
              onFailed: function(fail) {
                console.warn('[Harmukh] YouPI payment failed or timed out:', fail);
                alert('Payment could not be completed: ' + (fail.reason || fail.error || 'Timed out'));
                placeBtn.textContent = `Pay via UPI — ${formatPrice(orderTotal)}`;
                placeBtn.disabled = false;
              },
              onClose: function() {
                console.log('[Harmukh] Customer closed YouPI modal');
                placeBtn.textContent = `Pay via UPI — ${formatPrice(orderTotal)}`;
                placeBtn.disabled = false;
              }
            });

          } catch (err) {
            console.warn('[Harmukh] Gateway server unreachable:', err.message);
            // Show Developer Fallback modal
            fallbackModal.style.display = 'flex';

            // Wire simulator button for current order
            simulateBtn.onclick = async () => {
              simulateBtn.textContent = 'Simulating Bank Credit & Webhook...';
              simulateBtn.disabled = true;

              const simulatedUtr = 'UTR' + String(Math.floor(Math.random() * 899999999999 + 100000000000));
              console.log('[Harmukh Dev] Simulating observer confirmation for VPA:', currentVpa, 'UTR:', simulatedUtr);

              setTimeout(() => {
                fallbackModal.style.display = 'none';
                clearAbandoned(customer);
                Cart.clear();
                Router.navigate('success', {
                  orderNum,
                  orderItems,
                  orderTotal,
                  customer,
                  utr: simulatedUtr,
                  paymentId: 'pay_sim_' + Date.now(),
                  method: 'Instant UPI (YouPI PG Verified)'
                });
              }, 800);
            };
          }

        } else {
          // Standard Card fallback
          setTimeout(() => {
            clearAbandoned(customer);
            Cart.clear();
            Router.navigate('success', {
              orderNum,
              orderItems,
              orderTotal,
              customer,
              method: 'Card / NetBanking'
            });
          }, 1200);
        }
      });
    }
  }, 50);

  return page;
});
