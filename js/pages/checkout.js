/* ============================================================
   PAGE: Checkout
   ============================================================ */

Router.register('checkout', () => {
  const cartItems = Cart.getItems();
  const total = Cart.total();
  const page = document.createElement('div');
  page.style.cssText = 'padding:var(--space-2xl) 0;background:var(--surface-container-low);min-height:80vh;';

  page.innerHTML = `
    <div class="container">
      <!-- Header -->
      <div style="text-align:center;margin-bottom:var(--space-2xl);">
        <div style="font-family:var(--font-serif);font-size:1rem;font-weight:600;letter-spacing:0.1em;color:var(--secondary);margin-bottom:var(--space-sm);">✦ Harmukh Threads</div>
        <h1 style="font-family:var(--font-serif);font-size:2rem;font-weight:700;letter-spacing:-0.02em;color:var(--on-surface);">Secure Checkout</h1>
      </div>

      <div style="display:grid;grid-template-columns:1fr 380px;gap:var(--space-2xl);align-items:start;">

        <!-- Left: Forms -->
        <div>
          <!-- Contact -->
          <div style="background:var(--surface-container-lowest);border-radius:var(--radius-md);padding:var(--space-xl);margin-bottom:var(--space-lg);box-shadow:var(--shadow-ambient);">
            <h2 style="font-family:var(--font-serif);font-size:1.1rem;font-weight:600;margin-bottom:var(--space-lg);">Contact Information</h2>
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
              <label class="form-label" for="phone">Phone (for delivery updates)</label>
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
            <h2 style="font-family:var(--font-serif);font-size:1.1rem;font-weight:600;margin-bottom:var(--space-lg);">Payment</h2>
            <div style="display:flex;gap:var(--space-sm);margin-bottom:var(--space-lg);">
              ${['💳 Card', '🇮🇳 UPI', '🏦 NetBanking', '💵 COD'].map((m, i) => `
                <button class="badge ${i === 0 ? 'badge-primary' : 'badge-secondary'}" 
                        style="padding:8px 14px;cursor:pointer;font-size:0.75rem;"
                        data-method="${m}">${m}</button>
              `).join('')}
            </div>
            <div id="card-fields">
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
              Place Order
            </button>

            <div style="display:flex;align-items:center;justify-content:center;gap:var(--space-sm);margin-top:var(--space-md);">
              <span style="font-size:0.75rem;color:var(--on-surface-variant);">🔒 Secured by SSL · 30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind interactions
  setTimeout(() => {
    // Payment method chips
    const methodChips = page.querySelectorAll('[data-method]');
    methodChips.forEach(chip => {
      chip.addEventListener('click', () => {
        methodChips.forEach(c => {
          c.className = `badge ${c.dataset.method === chip.dataset.method ? 'badge-primary' : 'badge-secondary'}`;
          c.style.cssText = 'padding:8px 14px;cursor:pointer;font-size:0.75rem;';
        });
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

    // Place order
    const placeBtn = document.getElementById('place-order-btn');
    if (placeBtn) {
      placeBtn.addEventListener('click', () => {
        placeBtn.textContent = 'Processing...';
        placeBtn.disabled = true;
        setTimeout(() => {
          Cart.clear();
          Router.navigate('success');
        }, 1200);
      });
    }
  }, 50);

  return page;
});
