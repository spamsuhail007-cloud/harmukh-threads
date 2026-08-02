/* ============================================================
   PAGE: Rugs Collection
   ============================================================ */

Router.register('rugs', () => {
  const page = document.createElement('div');

  // Hero banner
  const banner = document.createElement('div');
  banner.style.cssText = 'background:var(--surface-container);padding:var(--space-3xl) 0 var(--space-xl);';
  banner.innerHTML = `
    <div class="container">
      <div style="display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:var(--space-lg);">
        <div>
          <nav style="font-size:0.75rem;color:var(--on-surface-variant);margin-bottom:var(--space-sm);">
            <a href="#" data-page="home" style="color:var(--on-surface-variant);">Home</a>
            <span style="margin:0 6px;">›</span>
            <span style="color:var(--on-surface);">Collections</span>
          </nav>
          <div class="section-kicker">The Collection</div>
          <h1 class="section-title">Handwoven Rugs &amp; Textiles</h1>
          <p class="section-lead">Hand-knotted over months, dyed with natural pigments, carried on centuries of memory.</p>
        </div>
        <div style="display:flex;gap:var(--space-sm);align-items:center;">
          <span style="font-size:0.8rem;color:var(--on-surface-variant);">${PRODUCTS.length} pieces</span>
        </div>
      </div>
    </div>
  `;
  page.appendChild(banner);

  // Filter chips
  const filterWrap = document.createElement('div');
  filterWrap.style.cssText = 'padding:var(--space-lg) 0;background:var(--surface-container-low);position:sticky;top:var(--navbar-height);z-index:100;';
  const cats = ['All', 'Rugs', 'Pashmina', 'Furnishings', 'Woodcraft'];
  filterWrap.innerHTML = `
    <div class="container">
      <div style="display:flex;gap:var(--space-sm);flex-wrap:wrap;" id="filter-chips">
        ${cats.map((c, i) => `
          <button class="badge ${i === 0 ? 'badge-primary' : 'badge-secondary'}" 
                  style="padding:6px 16px;cursor:pointer;font-size:0.75rem;transition:all var(--transition-fast);"
                  data-filter="${c}">${c}</button>
        `).join('')}
      </div>
    </div>
  `;
  page.appendChild(filterWrap);

  // Product grid
  const gridSec = document.createElement('section');
  gridSec.style.cssText = 'padding:var(--space-2xl) 0;';
  gridSec.innerHTML = `
    <div class="container">
      <div id="product-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-lg);"></div>
    </div>
  `;
  page.appendChild(gridSec);

  // Append after DOM insert (router does appendChild then animates)
  setTimeout(() => {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    let activeFilter = 'All';
    function renderProducts() {
      grid.innerHTML = '';
      const filtered = activeFilter === 'All' 
        ? PRODUCTS 
        : PRODUCTS.filter(p => p.category === activeFilter);
      if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:var(--space-3xl);color:var(--on-surface-variant);">No products in this category yet.</div>`;
        return;
      }
      filtered.forEach(p => grid.appendChild(renderProductCard(p)));
    }
    renderProducts();

    // Filter clicks
    document.getElementById('filter-chips').addEventListener('click', e => {
      const btn = e.target.closest('[data-filter]');
      if (!btn) return;
      activeFilter = btn.dataset.filter;
      document.querySelectorAll('#filter-chips [data-filter]').forEach(b => {
        b.className = `badge ${b.dataset.filter === activeFilter ? 'badge-primary' : 'badge-secondary'}`;
        b.style.cssText = 'padding:6px 16px;cursor:pointer;font-size:0.75rem;transition:all var(--transition-fast);';
      });
      renderProducts();
    });
  }, 50);

  page.appendChild(renderFooter());
  return page;
});
