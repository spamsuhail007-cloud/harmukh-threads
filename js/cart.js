/* ============================================================
   CART — State, drawer, add/remove/update
   ============================================================ */

const Cart = (() => {
  let items = [];

  function getItems() { return items; }

  function add(productId, qty = 1) {
    const existing = items.find(i => i.id === productId);
    const product = getProduct(productId);
    if (!product) return;

    if (existing) {
      existing.qty += qty;
    } else {
      items.push({ id: productId, qty, product });
    }
    updateUI();
    openDrawer();

    // Meta Pixel: Track AddToCart event
    if (typeof fbq === 'function') {
      fbq('track', 'AddToCart', {
        content_ids: [product.id],
        content_name: product.name,
        content_category: product.category,
        content_type: 'product',
        value: product.price * qty,
        currency: 'INR'
      });
    }
  }

  function remove(productId) {
    items = items.filter(i => i.id !== productId);
    updateUI();
  }

  function updateQty(productId, qty) {
    if (qty <= 0) { remove(productId); return; }
    const item = items.find(i => i.id === productId);
    if (item) { item.qty = qty; updateUI(); }
  }

  function total() {
    return items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  }

  function count() {
    return items.reduce((sum, i) => sum + i.qty, 0);
  }

  function clear() {
    items = [];
    updateUI();
  }

  function updateUI() {
    const countEl = document.getElementById('cart-count');
    const n = count();
    countEl.textContent = n;
    countEl.classList.remove('bump');
    void countEl.offsetWidth; // reflow
    countEl.classList.add('bump');

    renderDrawer();
  }

  function renderDrawer() {
    const container = document.getElementById('cart-items');
    const footer = document.getElementById('cart-footer');
    const empty = document.getElementById('cart-empty');
    const totalEl = document.getElementById('cart-total');

    if (items.length === 0) {
      if (empty) empty.style.display = '';
      if (footer) footer.style.display = 'none';
      container.querySelectorAll('.cart-item').forEach(el => el.remove());
      return;
    }

    if (empty) empty.style.display = 'none';
    if (footer) footer.style.display = '';

    container.querySelectorAll('.cart-item').forEach(el => el.remove());

    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.dataset.itemId = item.id;
      el.innerHTML = `
        <img class="cart-item-image" 
             src="${item.product.images[0]}" 
             alt="${item.product.name}"
             onerror="this.src='https://images.unsplash.com/photo-1600166898405-da9535204843?w=200&q=60'">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.product.name}</div>
          <div class="cart-item-meta">${item.product.category} · ${item.product.dimensions || ''}</div>
          <div class="cart-item-actions">
            <button class="qty-btn" data-action="dec" data-id="${item.id}" aria-label="Decrease quantity">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="cart-item-price">${formatPrice(item.product.price * item.qty)}</div>
      `;
      container.appendChild(el);
    });

    if (totalEl) totalEl.textContent = formatPrice(total());
  }

  function openDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    drawer.classList.add('open');
    overlay.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function bindEvents() {
    document.getElementById('cart-btn').addEventListener('click', openDrawer);
    document.getElementById('cart-close').addEventListener('click', closeDrawer);
    document.getElementById('cart-overlay').addEventListener('click', closeDrawer);

    document.getElementById('continue-shopping').addEventListener('click', closeDrawer);

    document.getElementById('checkout-btn').addEventListener('click', () => {
      closeDrawer();

      // Meta Pixel: Track InitiateCheckout event
      if (typeof fbq === 'function') {
        fbq('track', 'InitiateCheckout', {
          content_ids: items.map(i => i.id),
          content_type: 'product',
          num_items: count(),
          value: total(),
          currency: 'INR'
        });
      }

      setTimeout(() => Router.navigate('checkout'), 100);
    });

    // Qty buttons (event delegation)
    document.getElementById('cart-items').addEventListener('click', e => {
      const btn = e.target.closest('.qty-btn');
      if (!btn) return;
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      const item = items.find(i => i.id === id);
      if (!item) return;
      if (action === 'inc') updateQty(id, item.qty + 1);
      if (action === 'dec') updateQty(id, item.qty - 1);
    });
  }

  return { add, remove, updateQty, clear, total, count, getItems, openDrawer, closeDrawer, bindEvents, updateUI };
})();
