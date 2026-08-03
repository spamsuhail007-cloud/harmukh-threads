/* ============================================================
   PAGE: Product Detail
   ============================================================ */

Router.register('product', ({ id }) => {
  const product = getProduct(id) || PRODUCTS[0];

  // Meta Pixel: Track ViewContent when a product page is viewed
  if (typeof fbq === 'function') {
    fbq('track', 'ViewContent', {
      content_ids: [product.id],
      content_name: product.name,
      content_category: product.category,
      content_type: 'product',
      value: product.price,
      currency: 'INR'
    });
  }

  const page = document.createElement('div');
  page.style.cssText = 'padding:var(--space-2xl) 0;';

  let activeImg = 0;

  const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

  page.innerHTML = `
    <div class="container">
      <!-- Breadcrumb -->
      <nav style="font-size:0.75rem;color:var(--on-surface-variant);margin-bottom:var(--space-xl);">
        <a href="#" data-page="home" style="color:var(--on-surface-variant);">Home</a>
        <span style="margin:0 6px;">›</span>
        <a href="#" data-page="rugs" style="color:var(--on-surface-variant);">Collections</a>
        <span style="margin:0 6px;">›</span>
        <span style="color:var(--on-surface);">${product.name}</span>
      </nav>

      <!-- Product layout -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3xl);align-items:start;">

        <!-- Image gallery -->
        <div>
          <div id="main-img-wrap" style="aspect-ratio:4/5;border-radius:var(--radius-md);overflow:hidden;background:var(--surface-container);margin-bottom:var(--space-md);">
            <img id="main-product-img"
                 src="${product.images[0]}"
                 alt="${product.name}"
                 style="width:100%;height:100%;object-fit:cover;transition:opacity 200ms ease;"
                 onerror="this.src='https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80'">
          </div>
          <div style="display:flex;gap:var(--space-sm);" id="thumb-strip">
            ${product.images.map((img, i) => `
              <button data-img-idx="${i}"
                      style="width:72px;height:90px;border-radius:var(--radius-sm);overflow:hidden;border:2px solid ${i === 0 ? 'var(--primary)' : 'transparent'};padding:0;cursor:pointer;transition:border-color var(--transition-fast);"
                      aria-label="View image ${i + 1}">
                <img src="${img}" alt="" style="width:100%;height:100%;object-fit:cover;"
                     onerror="this.src='https://images.unsplash.com/photo-1600166898405-da9535204843?w=200&q=60'">
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Info -->
        <div style="position:sticky;top:calc(var(--navbar-height) + var(--space-xl));">
          <div style="margin-bottom:var(--space-sm);">
            ${product.badge ? `<span class="badge ${product.badgeType || 'badge-primary'}" style="margin-bottom:var(--space-sm);">${product.badge}</span>` : ''}
          </div>
          <div style="font-size:0.7rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--secondary);margin-bottom:var(--space-sm);">${product.category}</div>
          <h1 style="font-family:var(--font-serif);font-size:2rem;font-weight:700;letter-spacing:-0.025em;color:var(--on-surface);line-height:1.15;margin-bottom:var(--space-lg);">${product.name}</h1>

          <div style="display:flex;align-items:baseline;gap:var(--space-md);margin-bottom:var(--space-xl);">
            <span style="font-family:var(--font-serif);font-size:2rem;font-weight:700;color:var(--primary);">${formatPrice(product.price)}</span>
            ${product.originalPrice ? `<span style="font-size:1rem;color:var(--on-surface-variant);text-decoration:line-through;">${formatPrice(product.originalPrice)}</span>` : ''}
          </div>

          <p style="color:var(--on-surface-variant);line-height:1.8;margin-bottom:var(--space-xl);">${product.description}</p>

          <!-- Spec grid -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm) var(--space-xl);margin-bottom:var(--space-xl);padding:var(--space-lg);background:var(--surface-container-low);border-radius:var(--radius-md);">
            ${[
              ['Dimensions', product.dimensions],
              ['Material', product.material],
              ['Origin', product.origin],
              ['Weave Time', product.weaveTime],
            ].filter(([,v]) => v).map(([k, v]) => `
              <div>
                <div style="font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--on-surface-variant);margin-bottom:2px;">${k}</div>
                <div style="font-size:0.875rem;font-weight:600;color:var(--on-surface);">${v}</div>
              </div>
            `).join('')}
          </div>

          <!-- Size chips (demo) -->
          <div style="margin-bottom:var(--space-xl);">
            <div style="font-size:0.7rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--on-surface-variant);margin-bottom:var(--space-sm);">Size</div>
            <div style="display:flex;gap:var(--space-sm);flex-wrap:wrap;" id="size-chips">
              ${['Standard', 'Large', 'Custom'].map((s, i) => `
                <button class="badge ${i === 0 ? 'badge-primary' : 'badge-secondary'}" 
                        style="padding:6px 16px;cursor:pointer;font-size:0.75rem;"
                        data-size="${s}">${s}</button>
              `).join('')}
            </div>
          </div>

          <!-- Add to bag CTA -->
          <button class="btn btn-primary btn-full" id="add-to-bag-btn" style="margin-bottom:var(--space-md);font-size:1rem;padding:16px;">
            Add to Bag — ${formatPrice(product.price)}
          </button>
          <button class="btn btn-secondary btn-full" style="font-size:0.875rem;">
            ♡ Save to Wishlist
          </button>
        </div>
      </div>

      <!-- Reviews -->
      ${product.reviews.length > 0 ? `
        <div style="margin-top:var(--space-3xl);padding-top:var(--space-2xl);border-top:1px solid var(--surface-container-high);">
          <h2 style="font-family:var(--font-serif);font-size:1.5rem;font-weight:600;margin-bottom:var(--space-xl);">Client Testimonials</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:var(--space-lg);">
            ${product.reviews.map(r => `
              <div style="background:var(--surface-container-lowest);padding:var(--space-xl);border-radius:var(--radius-md);box-shadow:var(--shadow-ambient);">
                <div style="color:var(--secondary);font-size:1.1rem;margin-bottom:var(--space-sm);">${stars(r.rating)}</div>
                <p style="color:var(--on-surface-variant);line-height:1.7;margin-bottom:var(--space-md);font-style:italic;">"${r.text}"</p>
                <div style="font-size:0.8rem;font-weight:600;color:var(--on-surface);">— ${r.author}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Related products -->
      <div style="margin-top:var(--space-3xl);">
        <div class="section-kicker">Discover</div>
        <h2 class="section-title" style="margin-bottom:var(--space-xl);">You May Also Love</h2>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);" id="related-grid"></div>
      </div>
    </div>
  `;

  // Bind after insert
  setTimeout(() => {
    // Thumbnail switcher
    const thumbStrip = document.getElementById('thumb-strip');
    if (thumbStrip) {
      thumbStrip.addEventListener('click', e => {
        const btn = e.target.closest('[data-img-idx]');
        if (!btn) return;
        const idx = parseInt(btn.dataset.imgIdx);
        const mainImg = document.getElementById('main-product-img');
        if (!mainImg) return;
        mainImg.style.opacity = '0';
        setTimeout(() => {
          mainImg.src = product.images[idx];
          mainImg.style.opacity = '1';
        }, 200);
        thumbStrip.querySelectorAll('button').forEach((b, i) => {
          b.style.borderColor = i === idx ? 'var(--primary)' : 'transparent';
        });
      });
    }

    // Size chips
    const sizeChips = document.getElementById('size-chips');
    if (sizeChips) {
      sizeChips.addEventListener('click', e => {
        const btn = e.target.closest('[data-size]');
        if (!btn) return;
        sizeChips.querySelectorAll('[data-size]').forEach(b => {
          b.className = `badge ${b.dataset.size === btn.dataset.size ? 'badge-primary' : 'badge-secondary'}`;
          b.style.cssText = 'padding:6px 16px;cursor:pointer;font-size:0.75rem;';
        });
      });
    }

    // Add to bag
    const addBtn = document.getElementById('add-to-bag-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        Cart.add(product.id);
        addBtn.textContent = '✓ Added to Bag!';
        addBtn.style.background = 'var(--tertiary-container)';
        setTimeout(() => {
          addBtn.innerHTML = `Add to Bag — ${formatPrice(product.price)}`;
          addBtn.style.background = '';
        }, 1500);
      });
    }

    // Related grid
    const relatedGrid = document.getElementById('related-grid');
    if (relatedGrid) {
      PRODUCTS.filter(p => p.id !== product.id).slice(0, 4)
        .forEach(p => relatedGrid.appendChild(renderProductCard(p)));
    }
  }, 50);

  page.appendChild(renderFooter());
  return page;
});
