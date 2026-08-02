/* ============================================================
   PAGE: Homepage Mobile (< 768px)
   ============================================================ */

Router.register('home-mobile', () => {
  const page = document.createElement('div');

  // Compact stacked hero
  const hero = document.createElement('section');
  hero.style.cssText = 'position:relative;min-height:70vh;display:flex;align-items:center;overflow:hidden;background:var(--surface-container-low);';
  hero.innerHTML = `
    <img style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.35;"
         src="https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80"
         alt="Kashmir artisan weaving">
    <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(252,249,242,0.98) 0%, rgba(252,249,242,0.6) 100%);"></div>
    <div class="container" style="position:relative;z-index:2;text-align:center;padding-top:var(--space-2xl);padding-bottom:var(--space-2xl);">
      <div style="font-size:0.65rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--secondary);margin-bottom:var(--space-md);">Kashmir · GI Tagged</div>
      <h1 style="font-family:var(--font-serif);font-size:2.25rem;font-weight:700;letter-spacing:-0.025em;color:var(--on-surface);line-height:1.15;margin-bottom:var(--space-md);">
        Each piece carries<br><em style="color:var(--primary);font-style:italic;">400 years</em><br>of tradition.
      </h1>
      <p style="color:var(--on-surface-variant);line-height:1.7;font-size:0.95rem;margin-bottom:var(--space-xl);max-width:340px;margin-left:auto;margin-right:auto;">
        Harmukh Threads brings the timeless elegance of Kashmiri artistry to your home. Discover our curated collection of handcrafted home décor, premium textiles, and artisan-made pieces that celebrate the rich heritage of Kashmir.
      </p>
      <button class="btn btn-primary btn-full-mobile" onclick="Router.navigate('rugs')" style="max-width:280px;margin:0 auto;">
        Explore Collections
      </button>
    </div>
  `;
  page.appendChild(hero);

  // Mobile collection list (vertical scroll)
  const colSec = document.createElement('section');
  colSec.style.cssText = 'padding:var(--space-xl) 0;';
  colSec.innerHTML = `
    <div class="container">
      <div class="section-kicker">Collections</div>
      <h2 class="section-title" style="margin-bottom:var(--space-lg)">Shop by Category</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);" id="mob-col-grid"></div>
    </div>
  `;
  page.appendChild(colSec);
  const colGrid = colSec.querySelector('#mob-col-grid');
  COLLECTIONS.forEach(c => colGrid.appendChild(renderCollectionCard(c)));

  // Featured products (2 col)
  const prodSec = document.createElement('section');
  prodSec.style.cssText = 'padding:var(--space-xl) 0;background:var(--surface-container-low);';
  prodSec.innerHTML = `
    <div class="container">
      <div class="section-kicker">Bestsellers</div>
      <h2 class="section-title" style="margin-bottom:var(--space-lg)">Most Loved</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);" id="mob-prod-grid"></div>
      <div style="margin-top:var(--space-xl);text-align:center;">
        <button class="btn btn-secondary" onclick="Router.navigate('rugs')">View All Products</button>
      </div>
    </div>
  `;
  page.appendChild(prodSec);
  const prodGrid = prodSec.querySelector('#mob-prod-grid');
  PRODUCTS.slice(0, 4).forEach(p => prodGrid.appendChild(renderProductCard(p)));

  // Trust bar (2col on mobile)
  const trust = document.createElement('section');
  trust.className = 'trust-bar';
  trust.innerHTML = `
    <div class="container">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);text-align:center;">
        <div><div style="font-size:1.5rem;margin-bottom:4px;">✈️</div><div style="font-size:0.8rem;font-weight:600;">Free Shipping</div></div>
        <div><div style="font-size:1.5rem;margin-bottom:4px;">🏷️</div><div style="font-size:0.8rem;font-weight:600;">GI Tagged</div></div>
        <div style="cursor:pointer;" onclick="Router.navigate('returns')"><div style="font-size:1.5rem;margin-bottom:4px;">🔍</div><div style="font-size:0.8rem;font-weight:600;color:var(--primary);">No Returns</div><div style="font-size:0.65rem;color:var(--on-surface-variant);">Inspected</div></div>
        <div><div style="font-size:1.5rem;margin-bottom:4px;">🤝</div><div style="font-size:0.8rem;font-weight:600;">Artisan Made</div></div>
      </div>
    </div>
  `;
  page.appendChild(trust);

  // Minimal footer
  const foot = document.createElement('footer');
  foot.style.cssText = 'background:var(--surface-container-high);padding:var(--space-xl) 0;text-align:center;';
  foot.innerHTML = `
    <div class="container">
      <div style="font-family:var(--font-serif);font-size:1.1rem;font-weight:600;margin-bottom:var(--space-md);">✦ Harmukh Threads</div>
      <p style="font-size:0.8rem;color:var(--on-surface-variant);margin-bottom:var(--space-md);">Handwoven in Kashmir.</p>
      <p style="font-size:0.75rem;color:var(--on-surface-variant);">© 2026 Harmukh Threads. All rights reserved.</p>
    </div>
  `;
  page.appendChild(foot);

  return page;
});
