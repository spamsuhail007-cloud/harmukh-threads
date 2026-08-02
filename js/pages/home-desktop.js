/* ============================================================
   PAGE: Homepage Desktop
   ============================================================ */

function renderProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.setAttribute('role', 'article');
  card.dataset.productId = product.id;
  card.innerHTML = `
    <div class="product-card-image">
      <img src="${product.images[0]}" 
           alt="${product.name}"
           loading="lazy"
           onerror="this.src='https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&q=70'">
      ${product.badge ? `<div class="product-card-badge"><span class="badge ${product.badgeType || 'badge-primary'}">${product.badge}</span></div>` : ''}
    </div>
    <div class="product-card-body">
      <div class="product-card-category">${product.category}</div>
      <div class="product-card-name">${product.name}</div>
      <div class="product-card-price">
        ${formatPrice(product.price)}
        ${product.originalPrice ? `<del>${formatPrice(product.originalPrice)}</del>` : ''}
      </div>
    </div>
  `;
  card.addEventListener('click', () => Router.navigate('product', { id: product.id }));
  return card;
}

function renderCollectionCard(col) {
  const card = document.createElement('div');
  card.className = 'collection-card';
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.innerHTML = `
    <img class="collection-card-img"
         src="${col.image}"
         alt="${col.title}"
         loading="lazy"
         onerror="this.src='https://images.unsplash.com/photo-1600166898405-da9535204843?w=700&q=70'">
    <div class="collection-card-overlay">
      <div class="collection-card-label">${col.label}</div>
      <div class="collection-card-title">${col.title}</div>
      <div class="collection-card-count">${col.count}</div>
    </div>
  `;
  const go = () => Router.navigate(col.page || 'rugs');
  card.addEventListener('click', go);
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') go(); });
  return card;
}

function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <span class="logo-text">✦ Harmukh Threads</span>
          <p>Preserving the soul of Himalayan craftsmanship through ethical trade and timeless design. Every piece is an heirloom in waiting.</p>
        </div>
        <div class="footer-col">
          <h4>The House</h4>
          <ul>
            <li><a href="#">Our Story</a></li>
            <li><a href="#">The Artisans</a></li>
            <li><a href="#">GI Certification</a></li>
            <li><a href="#">Care Guide</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><a href="#" data-page="rugs">Rugs</a></li>
            <li><a href="#">Pashmina</a></li>
            <li><a href="#">Woodcraft</a></li>
            <li><a href="#">Furnishings</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Connect</h4>
          <ul>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Journal</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Privacy</a></li>
            <li><a href="#" data-page="returns">Quality Policy</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span class="footer-copy">© 2026 Harmukh Threads. Handwoven in Kashmir.</span>
        <span class="footer-copy">GI Tagged · Artisan Certified · Ethically Sourced</span>
      </div>
    </div>
  `;
  return footer;
}

Router.register('home-desktop', () => {
  const page = document.createElement('div');

  // Hero
  const hero = document.createElement('section');
  hero.className = 'hero';
  hero.innerHTML = `
    <img class="hero-bg"
         src="https://images.unsplash.com/photo-1600166898405-da9535204843?w=1600&q=80"
         alt="Kashmir artisan weaving"
         loading="eager">
    <div class="hero-overlay"></div>
    <div class="container">
      <div class="hero-content">
        <div class="hero-kicker">Kashmir · Since 1842 · GI Tagged</div>
        <h1 class="hero-headline">
          Each piece carries<br>
          <em>400 years</em> of tradition.
        </h1>
        <p class="hero-body">
          Harmukh Threads brings the timeless elegance of Kashmiri artistry to your home. Discover our curated collection of handcrafted home décor, premium textiles, and artisan-made pieces that celebrate the rich heritage of Kashmir.
        </p>
        <div class="hero-actions">
          <button class="btn btn-primary" id="hero-cta" onclick="Router.navigate('rugs')">Explore Collections</button>
          <button class="btn btn-secondary" onclick="Router.navigate('artisan')">Our Story</button>
        </div>
      </div>
    </div>
  `;
  page.appendChild(hero);

  // Trust bar
  const trust = document.createElement('section');
  trust.className = 'trust-bar';
  trust.innerHTML = `
    <div class="container">
      <div class="trust-bar-grid">
        <div class="trust-item">
          <div class="trust-item-icon">✈️</div>
          <div class="trust-item-title">Free Shipping</div>
          <div class="trust-item-sub">Worldwide Delivery</div>
        </div>
        <div class="trust-item">
          <div class="trust-item-icon">🏷️</div>
          <div class="trust-item-title">GI Tagged</div>
          <div class="trust-item-sub">Authentic Kashmir Origin</div>
        </div>
        <div class="trust-item" style="cursor:pointer;" onclick="Router.navigate('returns')" title="View our Quality Policy">
          <div class="trust-item-icon">🔍</div>
          <div class="trust-item-title">Quality Inspected</div>
          <div class="trust-item-sub">Pre-Shipment Check · No Returns</div>
        </div>
        <div class="trust-item">
          <div class="trust-item-icon">🤝</div>
          <div class="trust-item-title">Artisan Made</div>
          <div class="trust-item-sub">Directly Empowering Makers</div>
        </div>
      </div>
    </div>
  `;
  page.appendChild(trust);

  // Collections grid
  const colSec = document.createElement('section');
  colSec.style.padding = 'var(--space-3xl) 0';
  colSec.innerHTML = `
    <div class="container">
      <div style="margin-bottom:var(--space-xl)">
        <div class="section-kicker">Explore</div>
        <h2 class="section-title">Our Collections</h2>
        <p class="section-lead">Three centuries of regional craft, distilled into three distinct chapters.</p>
      </div>
      <div id="collections-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-lg)"></div>
    </div>
  `;
  page.appendChild(colSec);
  const colGrid = colSec.querySelector('#collections-grid');
  COLLECTIONS.forEach(c => colGrid.appendChild(renderCollectionCard(c)));

  // Seasonal bestsellers
  const bsSec = document.createElement('section');
  bsSec.style.cssText = 'padding:var(--space-3xl) 0;background:var(--surface-container-low);';
  bsSec.innerHTML = `
    <div class="container">
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:var(--space-xl);flex-wrap:wrap;gap:var(--space-md)">
        <div>
          <div class="section-kicker">Seasonal</div>
          <h2 class="section-title">Bestsellers</h2>
          <p class="section-lead" style="margin-top:var(--space-sm)">Most coveted pieces from our current collection.</p>
        </div>
        <button class="btn btn-secondary" onclick="Router.navigate('rugs')">View All →</button>
      </div>
      <div id="bestsellers-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg)"></div>
    </div>
  `;
  page.appendChild(bsSec);
  const bsGrid = bsSec.querySelector('#bestsellers-grid');
  PRODUCTS.slice(0, 4).forEach(p => bsGrid.appendChild(renderProductCard(p)));

  // Editorial banner
  const editSec = document.createElement('section');
  editSec.style.cssText = 'padding:var(--space-3xl) 0;';
  editSec.innerHTML = `
    <div class="container">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-2xl);align-items:center;">
        <div>
          <div class="section-kicker">The Artisan Way</div>
          <h2 class="section-title" style="margin-bottom:var(--space-lg)">From loom to living room — a 400-year journey.</h2>
          <p style="color:var(--on-surface-variant);line-height:1.8;margin-bottom:var(--space-xl)">
            Every rug begins with raw wool hand-spun by mountain shepherdesses. It is then dyed using centuries-old natural recipes — saffron for gold, walnut husks for brown, indigo plants for the deep blues Kashmir is known for.
          </p>
          <button class="btn btn-primary" onclick="Router.navigate('artisan')">Meet the Artisans</button>
        </div>
        <div style="position:relative;">
          <img src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=700&q=80"
               alt="Kashmir artisan at work"
               style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:var(--radius-md);"
               loading="lazy">
          <div style="position:absolute;bottom:-var(--space-lg);right:-var(--space-lg);
               background:var(--primary);color:var(--on-primary);
               padding:var(--space-lg) var(--space-xl);border-radius:var(--radius-md);
               font-family:var(--font-serif);font-size:1.5rem;font-weight:700;
               box-shadow:var(--shadow-float);">
            1200+<br><span style="font-family:var(--font-sans);font-size:0.75rem;font-weight:600;opacity:0.8;letter-spacing:0.08em;text-transform:uppercase;">Artisan Families</span>
          </div>
        </div>
      </div>
    </div>
  `;
  page.appendChild(editSec);

  page.appendChild(renderFooter());
  return page;
});
