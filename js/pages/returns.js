/* ============================================================
   PAGE: Quality Assurance & No Returns Policy
   ============================================================ */

Router.register('returns', () => {
  const page = document.createElement('div');
  page.innerHTML = `
    <!-- ── Hero Banner ── -->
    <section style="
      background: linear-gradient(135deg, #1c1c18 0%, #3a2a20 60%, #9b4000 100%);
      padding: var(--space-3xl) 0 var(--space-2xl);
      position: relative;
      overflow: hidden;
    ">
      <!-- Subtle grain overlay -->
      <div style="
        position:absolute;inset:0;
        background-image:url('https://www.transparenttextures.com/patterns/asfalt-dark.png');
        opacity:0.06;pointer-events:none;
      "></div>
      <!-- Decorative saffron circle -->
      <div style="
        position:absolute;right:-120px;top:-120px;
        width:480px;height:480px;border-radius:50%;
        background:radial-gradient(circle, rgba(155,64,0,0.35) 0%, transparent 70%);
        pointer-events:none;
      "></div>

      <div class="container" style="position:relative;z-index:1;text-align:center;">
        <div style="
          display:inline-flex;align-items:center;gap:8px;
          background:rgba(255,219,203,0.12);border:1px solid rgba(255,182,146,0.25);
          border-radius:var(--radius-full);
          padding:6px 20px;margin-bottom:var(--space-lg);
        ">
          <span style="font-size:0.65rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#ffb692;">
            Quality Assurance Policy
          </span>
        </div>

        <h1 style="
          font-family:var(--font-serif);font-size:clamp(2.2rem,5vw,3.6rem);
          color:#fcf9f2;font-weight:700;line-height:1.15;margin-bottom:var(--space-md);
        ">
          Every piece leaves our atelier<br><em style="color:#ffb692;">perfect</em>.
        </h1>

        <p style="
          color:rgba(252,249,242,0.68);font-size:1.05rem;max-width:580px;
          margin:0 auto var(--space-xl);line-height:1.75;
        ">
          Before your order is sealed and shipped, our master craftsmen personally inspect
          each piece. This is our promise to you — and the reason we do not accept returns.
        </p>
      </div>
    </section>

    <!-- ── No Returns Banner ── -->
    <section style="background:#fcf9f2;padding:0;">
      <div class="container">
        <div style="
          margin: calc(-1 * var(--space-xl)) auto var(--space-2xl);
          max-width: 860px;
          background: linear-gradient(135deg, #fff5f0, #ffe8da);
          border: 2px solid #9b4000;
          border-radius: var(--radius-lg);
          padding: var(--space-xl) var(--space-2xl);
          display: flex;
          align-items: flex-start;
          gap: var(--space-lg);
          box-shadow: 0 8px 32px rgba(155,64,0,0.14);
          position: relative;
          overflow: hidden;
        ">
          <!-- Warning stripe top -->
          <div style="
            position:absolute;top:0;left:0;right:0;height:4px;
            background: repeating-linear-gradient(90deg, #9b4000 0px, #9b4000 24px, #c25303 24px, #c25303 48px);
          "></div>

          <div style="
            min-width:56px;height:56px;
            background:var(--primary);border-radius:var(--radius-md);
            display:flex;align-items:center;justify-content:center;
            font-size:1.6rem;flex-shrink:0;margin-top:4px;
          ">🚫</div>

          <div>
            <div style="
              font-size:0.65rem;font-weight:700;letter-spacing:0.18em;
              text-transform:uppercase;color:var(--primary);margin-bottom:8px;
            ">Important — Please Read</div>
            <h2 style="
              font-family:var(--font-serif);font-size:1.5rem;
              color:#1c1c18;margin-bottom:var(--space-sm);line-height:1.3;
            ">We do not accept returns or exchanges.</h2>
            <p style="color:#574238;font-size:0.95rem;line-height:1.7;margin:0;">
              All sales at Harmukh Threads are <strong>final</strong>. Because every order undergoes a rigorous
              hands-on inspection by our artisans before dispatch, we are fully confident in the quality
              of each shipment. We ask that you review your order carefully before placing it.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Our Inspection Promise ── -->
    <section style="background:#fcf9f2;padding:var(--space-2xl) 0 var(--space-3xl);">
      <div class="container">
        <div style="text-align:center;margin-bottom:var(--space-2xl);">
          <div class="section-kicker">Our Commitment</div>
          <h2 class="section-title">The Harmukh Quality Promise</h2>
          <p class="section-lead" style="max-width:560px;margin:var(--space-md) auto 0;">
            Every order passes through our four-stage inspection before it ever reaches your doorstep.
            This is why every purchase is final — and why you can buy with complete peace of mind.
          </p>
        </div>

        <!-- Steps grid -->
        <div style="
          display:grid;
          grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));
          gap:var(--space-lg);
          max-width:960px;margin:0 auto var(--space-2xl);
        ">
          ${[
            {
              step: '01',
              icon: '🧵',
              title: 'Material Verification',
              desc: 'Each piece is sourced and verified for 100% authentic Kashmiri origin. Material purity and GI compliance are confirmed at intake.'
            },
            {
              step: '02',
              icon: '🔍',
              title: 'Weave & Stitch Inspection',
              desc: 'Master weavers inspect every warp and weft under natural light — examining consistency, density, and the integrity of each knot or stitch.'
            },
            {
              step: '03',
              icon: '🎨',
              title: 'Color & Finish Check',
              desc: 'Dyes are inspected for evenness and colorfastness. Embroidery borders, fringes, and finishing edges are examined for perfection.'
            },
            {
              step: '04',
              icon: '📦',
              title: 'Pre-Shipment Sign-Off',
              desc: 'Only after a final sign-off by our senior quality lead is your order sealed, documented, and dispatched with full insurance.'
            }
          ].map(s => `
            <div style="
              background:var(--surface-container-low);
              border:1px solid var(--outline-variant);
              border-radius:var(--radius-lg);
              padding:var(--space-xl) var(--space-lg);
              position:relative;
              transition:transform 200ms ease, box-shadow 200ms ease;
            "
            onmouseenter="this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 32px rgba(155,64,0,0.10)'"
            onmouseleave="this.style.transform='translateY(0)';this.style.boxShadow='none'"
            >
              <div style="
                position:absolute;top:var(--space-lg);right:var(--space-lg);
                font-family:var(--font-serif);font-size:2.5rem;font-weight:700;
                color:var(--outline-variant);line-height:1;
              ">${s.step}</div>
              <div style="font-size:2rem;margin-bottom:var(--space-md);">${s.icon}</div>
              <h3 style="
                font-family:var(--font-serif);font-size:1.05rem;
                color:var(--on-surface);margin-bottom:var(--space-sm);
              ">${s.title}</h3>
              <p style="font-size:0.875rem;color:var(--on-surface-variant);line-height:1.65;margin:0;">${s.desc}</p>
            </div>
          `).join('')}
        </div>

        <!-- Artisan seal -->
        <div style="
          max-width:640px;margin:0 auto;
          background:linear-gradient(135deg,#1c1c18,#3a2a20);
          border-radius:var(--radius-lg);padding:var(--space-xl) var(--space-2xl);
          text-align:center;color:#fcf9f2;
          box-shadow:var(--shadow-float);
        ">
          <div style="font-size:2.5rem;margin-bottom:var(--space-md);">✦</div>
          <h3 style="font-family:var(--font-serif);font-size:1.3rem;margin-bottom:var(--space-sm);color:#ffb692;">
            "We inspect what we ship. We ship what we are proud of."
          </h3>
          <p style="font-size:0.875rem;color:rgba(252,249,242,0.6);line-height:1.7;margin:0;">
            — The Harmukh Threads Quality Guild
          </p>
        </div>
      </div>
    </section>

    <!-- ── FAQ Section ── -->
    <section style="background:var(--surface-container-low);padding:var(--space-3xl) 0;">
      <div class="container" style="max-width:720px;">
        <div style="text-align:center;margin-bottom:var(--space-2xl);">
          <div class="section-kicker">Policy Details</div>
          <h2 class="section-title">Common Questions</h2>
        </div>

        <div id="faq-list" style="display:flex;flex-direction:column;gap:var(--space-sm);"></div>
      </div>
    </section>

    <!-- ── Contact CTA ── -->
    <section style="background:#fcf9f2;padding:var(--space-3xl) 0;">
      <div class="container" style="max-width:640px;text-align:center;">
        <div style="font-size:2rem;margin-bottom:var(--space-md);">💬</div>
        <h2 style="font-family:var(--font-serif);font-size:1.75rem;margin-bottom:var(--space-md);">
          A concern before you order?
        </h2>
        <p style="color:var(--on-surface-variant);line-height:1.7;margin-bottom:var(--space-xl);">
          We encourage you to reach out <em>before</em> placing an order if you have any questions
          about a specific piece — its dimensions, fiber, or condition. Our team is happy to provide
          detailed photographs and a written condition report.
        </p>
        <div style="display:flex;gap:var(--space-md);justify-content:center;flex-wrap:wrap;">
          <a href="https://wa.me/" target="_blank" style="
            display:inline-flex;align-items:center;gap:8px;
            background:var(--primary);color:var(--on-primary);
            padding:14px 28px;border-radius:var(--radius-md);
            font-size:0.875rem;font-weight:600;letter-spacing:0.04em;
            transition:opacity 200ms ease;text-decoration:none;
          " onmouseenter="this.style.opacity='0.85'" onmouseleave="this.style.opacity='1'">
            <span>📲</span> WhatsApp Us
          </a>
          <a href="mailto:care@harmukhthreads.com" style="
            display:inline-flex;align-items:center;gap:8px;
            background:transparent;color:var(--primary);
            border:1.5px solid var(--primary);
            padding:14px 28px;border-radius:var(--radius-md);
            font-size:0.875rem;font-weight:600;letter-spacing:0.04em;
            transition:all 200ms ease;text-decoration:none;
          "
          onmouseenter="this.style.background='var(--primary)';this.style.color='#fff'"
          onmouseleave="this.style.background='transparent';this.style.color='var(--primary)'">
            <span>✉️</span> Email Support
          </a>
        </div>
        <p style="margin-top:var(--space-lg);font-size:0.75rem;color:var(--on-surface-variant);letter-spacing:0.05em;">
          We respond within 4 business hours, Mon–Sat.
        </p>
      </div>
    </section>
  `;

  // ── Build FAQ accordions ──
  const faqs = [
    {
      q: 'Why don\'t you accept returns?',
      a: 'Every order is personally inspected and verified by our master craftsmen before it is shipped. We guarantee the condition, authenticity, and quality of each piece when it leaves our atelier. Because we absorb all quality risk on our end before dispatch, we are unable to process returns once an order is fulfilled.'
    },
    {
      q: 'What if my item arrives damaged in transit?',
      a: 'All orders are shipped fully insured. In the extremely rare event that your piece is damaged during transit, please photograph the damage and the packaging within 24 hours of delivery and contact us immediately at care@harmukhthreads.com. Transit damage claims are handled directly through the shipping insurer and are separate from our no-returns policy.'
    },
    {
      q: 'Can I cancel my order after placing it?',
      a: 'Orders can be cancelled within 2 hours of placement, before the inspection and packing process begins. After the 2-hour window, the order enters our fulfilment pipeline and cannot be cancelled. Please double-check your order before confirming.'
    },
    {
      q: 'How can I be sure the piece matches the photos?',
      a: 'All product photography is conducted under controlled natural lighting and represents the actual item. For bespoke or high-value pieces, we can provide additional photographs, a short video walkthrough, and a written condition report on request before you purchase.'
    },
    {
      q: 'Do you offer exchanges?',
      a: 'We do not offer exchanges. All sales are final. We strongly encourage you to contact us before ordering if you have any doubt about size, colour, or suitability — our team will guide you to the right piece.'
    },
    {
      q: 'What does the pre-shipment inspection cover?',
      a: 'Our inspection covers: material authenticity (GI compliance), structural integrity (weave, knotting, stitching), surface condition (no stains, snags, or uneven dye), colour consistency, and finishing quality (fringes, borders, backing). A quality sign-off document accompanies every shipment.'
    },
  ];

  const faqList = page.querySelector('#faq-list');

  faqs.forEach((faq, idx) => {
    const item = document.createElement('div');
    item.style.cssText = `
      border:1px solid var(--outline-variant);
      border-radius:var(--radius-md);
      overflow:hidden;
      background:var(--surface-container-lowest);
      transition: box-shadow 200ms ease;
    `;

    const btn = document.createElement('button');
    btn.style.cssText = `
      width:100%;display:flex;justify-content:space-between;align-items:center;
      padding:var(--space-lg) var(--space-xl);
      font-family:var(--font-serif);font-size:0.975rem;font-weight:600;
      color:var(--on-surface);text-align:left;gap:var(--space-md);
      background:none;border:none;cursor:pointer;
      transition: color 200ms ease;
    `;
    btn.innerHTML = `
      <span>${faq.q}</span>
      <span class="faq-chevron-${idx}" style="
        color:var(--primary);font-size:1.1rem;flex-shrink:0;
        transition:transform 200ms ease;display:inline-block;
      ">›</span>
    `;

    const body = document.createElement('div');
    body.style.cssText = `
      max-height:0;overflow:hidden;
      transition:max-height 300ms ease, padding 300ms ease;
      padding:0 var(--space-xl);
    `;
    body.innerHTML = `<p style="font-size:0.9rem;color:var(--on-surface-variant);line-height:1.75;padding-bottom:var(--space-lg);margin:0;">${faq.a}</p>`;

    let open = false;
    btn.addEventListener('click', () => {
      open = !open;
      const chevron = btn.querySelector(`.faq-chevron-${idx}`);
      if (open) {
        body.style.maxHeight = body.scrollHeight + 'px';
        body.style.paddingTop = 'var(--space-sm)';
        chevron.style.transform = 'rotate(90deg)';
        item.style.boxShadow = '0 4px 16px rgba(155,64,0,0.08)';
        item.style.borderColor = 'var(--primary)';
      } else {
        body.style.maxHeight = '0';
        body.style.paddingTop = '0';
        chevron.style.transform = 'rotate(0deg)';
        item.style.boxShadow = 'none';
        item.style.borderColor = 'var(--outline-variant)';
      }
    });

    item.appendChild(btn);
    item.appendChild(body);
    faqList.appendChild(item);
  });

  return page;
});
