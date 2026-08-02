/* ============================================================
   PAGE: Artisan Heritage
   ============================================================ */

Router.register('artisan', () => {
  const page = document.createElement('div');

  page.innerHTML = `
    <!-- Hero -->
    <div class="artisan-hero">
      <img class="artisan-hero-bg"
           src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1400&q=80"
           alt="Kashmir artisans at work"
           loading="eager">
      <div class="artisan-hero-overlay"></div>
      <div class="artisan-hero-content">
        <div style="font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.6);margin-bottom:var(--space-md);">Our Heritage</div>
        <h1>The Hands<br>That Weave<br><em>History.</em></h1>
        <p>For over 600 years, the valleys of Kashmir have been home to the world's finest weavers. We are their custodians.</p>
      </div>
    </div>

    <!-- Stats -->
    <div style="background:var(--surface-container-low);padding:var(--space-2xl) 0;">
      <div class="container">
        <div class="artisan-stat-grid">
          <div>
            <div class="artisan-stat-num">1,200+</div>
            <div class="artisan-stat-label">Artisan Families Supported</div>
          </div>
          <div>
            <div class="artisan-stat-num">6</div>
            <div class="artisan-stat-label">GI-Certified Craft Categories</div>
          </div>
          <div>
            <div class="artisan-stat-num">600</div>
            <div class="artisan-stat-label">Years of Weaving Tradition</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Story section 1 -->
    <section class="artisan-section">
      <div class="container">
        <div class="artisan-grid">
          <div>
            <div class="section-kicker">The Origin</div>
            <h2 class="section-title" style="margin-bottom:var(--space-lg);">Kashmir's craft began with the migration of Central Asian weavers in the 14th century.</h2>
            <p style="color:var(--on-surface-variant);line-height:1.8;margin-bottom:var(--space-md);">
              Sultan Zain-ul-Abidin, known as Bud Shah — "The Great King" — invited master craftsmen from Samarkand and Central Asia to settle in Kashmir. They brought with them the secrets of the kani loom and the art of twill tapestry weaving that would define Kashmiri identity for centuries.
            </p>
            <p style="color:var(--on-surface-variant);line-height:1.8;">
              Today, that lineage continues in the karkhanas (workshops) of Kanihama, Shalteng, and Anantnag — passed silently from father to son, mother to daughter, through the muscle memory of the hands alone.
            </p>
          </div>
          <div>
            <img class="artisan-img"
                 src="https://images.unsplash.com/photo-1600166898405-da9535204843?w=700&q=80"
                 alt="Traditional Kashmir weaving">
          </div>
        </div>
      </div>
    </section>

    <!-- Story section 2 -->
    <section class="artisan-section" style="background:var(--surface-container-low);">
      <div class="container">
        <div class="artisan-grid reverse">
          <div>
            <div class="section-kicker">The Process</div>
            <h2 class="section-title" style="margin-bottom:var(--space-lg);">From mountain pasture to your living room — 18 stages of pure craft.</h2>
            <div style="display:flex;flex-direction:column;gap:var(--space-md);">
              ${[
                ['01', 'Fibre Sourcing', 'Changthangi pashmina is combed by hand from the undercoat of Ladakhi goats at 15,000 ft altitude.'],
                ['02', 'Natural Dyeing', 'Saffron, walnut husks, indigo, and pomegranate rind are used as mordants — a recipe unchanged for 400 years.'],
                ['03', 'Hand Spinning', 'Village women spin the fibres into yarn on a traditional charkha. Each artisan produces only 100g per day.'],
                ['04', 'Weaving', 'On the kani loom, weavers follow a coded talim notation — a pattern language unique to Kashmir.'],
              ].map(([num, title, desc]) => `
                <div style="display:flex;gap:var(--space-md);">
                  <div style="font-family:var(--font-serif);font-size:1.25rem;font-weight:700;color:var(--primary);flex-shrink:0;width:32px;">${num}</div>
                  <div>
                    <div style="font-weight:600;margin-bottom:4px;">${title}</div>
                    <div style="font-size:0.875rem;color:var(--on-surface-variant);line-height:1.6;">${desc}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          <div>
            <img class="artisan-img"
                 src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=700&q=80"
                 alt="Artisan dyeing process">
          </div>
        </div>
      </div>
    </section>

    <!-- Pledge -->
    <section style="padding:var(--space-3xl) 0;text-align:center;">
      <div class="container-sm">
        <div class="section-kicker">Our Pledge</div>
        <h2 class="section-title" style="margin-bottom:var(--space-lg);">Fair trade is not a feature. It is the foundation.</h2>
        <p style="color:var(--on-surface-variant);line-height:1.8;margin-bottom:var(--space-xl);">
          Harmukh Threads operates on a direct-to-artisan model. We visit every karkhana. We pay above market rates. We ensure every weaver is named and acknowledged. When you buy a piece, you buy an artisan's livelihood — and the continuation of 600 years of craft.
        </p>
        <button class="btn btn-primary" onclick="Router.navigate('rugs')">Shop the Collection</button>
      </div>
    </section>
  `;

  page.appendChild(renderFooter());
  return page;
});
