/* ============================================================
   PAGE: Admin Panel — 3-tab dashboard
   ============================================================ */

Router.register('admin', () => {
  const page = document.createElement('div');
  page.className = 'admin-layout';

  const statusBadge = (s) => {
    const map = {
      'New': 'badge-primary', 'Replied': 'badge-secondary', 'Resolved': 'badge-success',
      'Pending': 'badge-warn', 'Confirmed': 'badge-primary', 'Shipped': 'badge-secondary',
      'Delivered': 'badge-success', 'In Stock': 'badge-success', 'Low Stock': 'badge-warn',
      'Out of Stock': 'badge-error',
    };
    return `<span class="badge ${map[s] || 'badge-secondary'}">${s}</span>`;
  };

  const tabs = [
    { id: 'messages',  icon: '✉️',  label: 'Contact Messages' },
    { id: 'enquiries', icon: '📋',  label: 'Order Enquiries' },
    { id: 'abandoned', icon: '🛒',  label: 'Abandoned Carts' },
    { id: 'inventory', icon: '📦',  label: 'Inventory' },
  ];

  // Sidebar
  const sidebar = document.createElement('aside');
  sidebar.className = 'admin-sidebar';
  sidebar.innerHTML = `
    <div class="admin-sidebar-title">Admin Panel</div>
    ${tabs.map((t, i) => `
      <button class="admin-tab ${i === 0 ? 'active' : ''}" data-tab="${t.id}" id="tab-btn-${t.id}">
        <span>${t.icon}</span>
        <span>${t.label}</span>
      </button>
    `).join('')}
    <div style="margin-top:auto;padding:var(--space-lg);">
      <button class="btn btn-ghost btn-sm" onclick="Router.navigate('home')" style="width:100%;font-size:0.8rem;">
        ← Back to Store
      </button>
    </div>
  `;
  page.appendChild(sidebar);

  // Content area
  const content = document.createElement('div');
  content.className = 'admin-content';

  // ---- Panel: Messages ----
  const messagesPanel = document.createElement('div');
  messagesPanel.className = 'admin-panel active';
  messagesPanel.id = 'panel-messages';
  messagesPanel.innerHTML = `
    <h1 class="admin-page-title">Contact Messages</h1>
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Subject</th>
            <th>Message</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${ADMIN_MESSAGES.map(m => `
            <tr>
              <td class="name-col">
                <div>${m.name}</div>
                <div style="font-size:0.75rem;color:var(--on-surface-variant);font-weight:400;">${m.email}</div>
              </td>
              <td style="font-weight:500;">${m.subject}</td>
              <td class="msg-col">${m.message}</td>
              <td class="date-col">${m.date}</td>
              <td>${statusBadge(m.status)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  content.appendChild(messagesPanel);

  // ---- Panel: Enquiries ----
  const enquiriesPanel = document.createElement('div');
  enquiriesPanel.className = 'admin-panel';
  enquiriesPanel.id = 'panel-enquiries';
  enquiriesPanel.innerHTML = `
    <h1 class="admin-page-title">Order Enquiries</h1>
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${ADMIN_ENQUIRIES.map(e => `
            <tr>
              <td style="font-family:monospace;font-size:0.8rem;color:var(--primary);font-weight:600;">${e.id}</td>
              <td class="name-col">${e.customer}</td>
              <td class="msg-col">${e.product}</td>
              <td style="font-weight:600;">${e.amount}</td>
              <td class="date-col">${e.date}</td>
              <td>${statusBadge(e.status)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  content.appendChild(enquiriesPanel);

  // ---- Panel: Abandoned Carts ----
  const abandonedPanel = document.createElement('div');
  abandonedPanel.className = 'admin-panel';
  abandonedPanel.id = 'panel-abandoned';

  function renderAbandonedPanel() {
    const raw      = JSON.parse(localStorage.getItem('ht_abandoned_carts') || '{}');
    const leads    = Object.values(raw).sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    const totalVal = leads.reduce((s, l) => s + (l.total || 0), 0);

    if (leads.length === 0) {
      abandonedPanel.innerHTML = `
        <h1 class="admin-page-title">Abandoned Carts</h1>
        <div style="text-align:center;padding:var(--space-3xl) 0;color:var(--on-surface-variant);">
          <div style="font-size:3rem;margin-bottom:var(--space-lg);">🛒</div>
          <div style="font-family:var(--font-serif);font-size:1.25rem;font-weight:600;margin-bottom:var(--space-sm);">No abandoned carts yet</div>
          <div style="font-size:0.875rem;">When a customer fills in checkout fields but doesn't pay, they'll appear here.</div>
        </div>`;
      return;
    }

    abandonedPanel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-xl);flex-wrap:wrap;gap:var(--space-md);">
        <h1 class="admin-page-title" style="margin-bottom:0;">Abandoned Carts</h1>
        <button id="clear-all-abandoned" class="btn btn-ghost btn-sm" style="font-size:0.8rem;color:var(--error);">Clear All</button>
      </div>

      <!-- Summary strip -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-md);margin-bottom:var(--space-xl);">
        <div style="background:var(--surface-container-lowest);border-radius:var(--radius-md);padding:var(--space-lg);box-shadow:var(--shadow-ambient);">
          <div style="font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--on-surface-variant);margin-bottom:var(--space-sm);">Total Leads</div>
          <div style="font-family:var(--font-serif);font-size:2rem;font-weight:700;color:var(--on-surface);">${leads.length}</div>
        </div>
        <div style="background:var(--surface-container-lowest);border-radius:var(--radius-md);padding:var(--space-lg);box-shadow:var(--shadow-ambient);">
          <div style="font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--on-surface-variant);margin-bottom:var(--space-sm);">Revenue at Risk</div>
          <div style="font-family:var(--font-serif);font-size:2rem;font-weight:700;color:var(--secondary);">₹${totalVal.toLocaleString('en-IN')}</div>
        </div>
        <div style="background:var(--surface-container-lowest);border-radius:var(--radius-md);padding:var(--space-lg);box-shadow:var(--shadow-ambient);">
          <div style="font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--on-surface-variant);margin-bottom:var(--space-sm);">Avg Cart Value</div>
          <div style="font-family:var(--font-serif);font-size:2rem;font-weight:700;color:var(--primary);">₹${Math.round(totalVal / leads.length).toLocaleString('en-IN')}</div>
        </div>
      </div>

      <!-- Cards grid -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:var(--space-lg);" id="abandon-cards">
        ${leads.map(lead => {
          const c = lead.customer || {};
          const timeAgo = (() => {
            const diff = Date.now() - new Date(lead.savedAt).getTime();
            const m = Math.floor(diff / 60000);
            if (m < 1)  return 'Just now';
            if (m < 60) return `${m}m ago`;
            const h = Math.floor(m / 60);
            if (h < 24) return `${h}h ago`;
            return `${Math.floor(h/24)}d ago`;
          })();

          const itemsHTML = (lead.items || []).map(i =>
            `<div style="font-size:0.8rem;color:var(--on-surface-variant);">• ${i.name} × ${i.qty} — ₹${(i.price*i.qty).toLocaleString('en-IN')}</div>`
          ).join('');

          const waMsg = encodeURIComponent(
`Hi ${c.name || 'there'}, we noticed you left some items in your cart on Harmukh Threads! 🛒

Your selected items are still available. Complete your order here: https://harmukhthreads.com

Need help? We're happy to assist!`);

          return `
          <div class="abandon-card" data-id="${lead.id}" data-key="${Object.keys(raw).find(k => raw[k].id === lead.id) || ''}">
            <!-- Header -->
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:var(--space-md);">
              <div>
                <div style="font-weight:700;font-size:0.9375rem;color:var(--on-surface);margin-bottom:2px;">${c.name || 'Unknown'}</div>
                <div style="font-size:0.7rem;color:var(--on-surface-variant);">${timeAgo}</div>
              </div>
              <div style="display:flex;align-items:center;gap:var(--space-sm);">
                <span style="font-family:var(--font-serif);font-weight:700;font-size:1rem;color:var(--primary);">₹${(lead.total||0).toLocaleString('en-IN')}</span>
                <button class="abandon-dismiss" data-key="${Object.keys(raw).find(k => raw[k].id === lead.id) || ''}" title="Dismiss lead"
                  style="width:24px;height:24px;border-radius:50%;background:var(--surface-container-high);color:var(--on-surface-variant);font-size:0.75rem;display:flex;align-items:center;justify-content:center;border:none;cursor:pointer;">✕</button>
              </div>
            </div>

            <!-- Contact details -->
            <div style="background:var(--surface-container-low);border-radius:var(--radius-sm);padding:var(--space-md);margin-bottom:var(--space-md);display:flex;flex-direction:column;gap:6px;">
              ${c.phone ? `<div style="font-size:0.8rem;">📱 <strong>${c.phone}</strong></div>` : ''}
              ${c.email ? `<div style="font-size:0.8rem;">✉️ ${c.email}</div>` : ''}
              ${c.address ? `<div style="font-size:0.75rem;color:var(--on-surface-variant);">📍 ${c.address}</div>` : ''}
            </div>

            <!-- Items -->
            <div style="margin-bottom:var(--space-md);">
              <div style="font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--secondary);margin-bottom:var(--space-sm);">Items in Cart</div>
              ${itemsHTML || '<div style="font-size:0.8rem;color:var(--on-surface-variant);">No item data</div>'}
            </div>

            <!-- Action buttons -->
            <div style="display:flex;gap:var(--space-sm);flex-wrap:wrap;">
              ${c.phone ? `<a href="tel:${c.phone}" class="abandon-action-btn" style="background:var(--primary);color:#fff;">📞 Call</a>` : ''}
              ${c.phone ? `<a href="https://wa.me/91${c.phone.replace(/\D/g,'')}?text=${waMsg}" target="_blank" rel="noopener" class="abandon-action-btn" style="background:#25D366;color:#fff;">💬 WhatsApp</a>` : ''}
              ${c.email ? `<a href="mailto:${c.email}?subject=Your Harmukh Threads cart is waiting&body=Hi ${c.name || 'there'},%0D%0A%0D%0AWe noticed you left some beautiful items in your cart!%0D%0A%0D%0AComplete your order: https://harmukhthreads.com%0D%0A%0D%0AThank you,%0D%0AHarmukh Threads" class="abandon-action-btn" style="background:var(--secondary);color:#fff;">✉️ Email</a>` : ''}
            </div>
          </div>`;
        }).join('')}
      </div>

      <style>
        .abandon-card {
          background: var(--surface-container-lowest);
          border: 1px solid var(--outline-variant);
          border-radius: var(--radius-md);
          padding: var(--space-lg);
          box-shadow: var(--shadow-ambient);
          transition: box-shadow var(--transition-base);
        }
        .abandon-card:hover { box-shadow: var(--shadow-float); }
        .abandon-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 7px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: opacity var(--transition-fast), transform var(--transition-fast);
        }
        .abandon-action-btn:hover { opacity: 0.88; transform: translateY(-1px); }
      </style>
    `;

    // Dismiss single card
    abandonedPanel.querySelectorAll('.abandon-dismiss').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        const store = JSON.parse(localStorage.getItem('ht_abandoned_carts') || '{}');
        delete store[key];
        localStorage.setItem('ht_abandoned_carts', JSON.stringify(store));
        renderAbandonedPanel();
      });
    });

    // Clear all
    const clearAllBtn = abandonedPanel.querySelector('#clear-all-abandoned');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', () => {
        if (confirm('Clear all abandoned cart leads? This cannot be undone.')) {
          localStorage.removeItem('ht_abandoned_carts');
          renderAbandonedPanel();
        }
      });
    }
  }

  renderAbandonedPanel();
  content.appendChild(abandonedPanel);

  // ---- Panel: Inventory ----
  const inventoryPanel = document.createElement('div');
  inventoryPanel.className = 'admin-panel';
  inventoryPanel.id = 'panel-inventory';
  inventoryPanel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-xl);flex-wrap:wrap;gap:var(--space-md);">
      <h1 class="admin-page-title" style="margin-bottom:0;">Inventory Management</h1>
      <button class="btn btn-primary btn-sm">+ Add Product</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-md);margin-bottom:var(--space-xl);">
      <div style="background:var(--surface-container-lowest);border-radius:var(--radius-md);padding:var(--space-lg);box-shadow:var(--shadow-ambient);">
        <div style="font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--on-surface-variant);margin-bottom:var(--space-sm);">Total Products</div>
        <div style="font-family:var(--font-serif);font-size:2rem;font-weight:700;color:var(--on-surface);">${ADMIN_INVENTORY.length}</div>
      </div>
      <div style="background:var(--surface-container-lowest);border-radius:var(--radius-md);padding:var(--space-lg);box-shadow:var(--shadow-ambient);">
        <div style="font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--on-surface-variant);margin-bottom:var(--space-sm);">Low Stock</div>
        <div style="font-family:var(--font-serif);font-size:2rem;font-weight:700;color:var(--secondary);">${ADMIN_INVENTORY.filter(i => i.status === 'Low Stock').length}</div>
      </div>
      <div style="background:var(--surface-container-lowest);border-radius:var(--radius-md);padding:var(--space-lg);box-shadow:var(--shadow-ambient);">
        <div style="font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--on-surface-variant);margin-bottom:var(--space-sm);">Out of Stock</div>
        <div style="font-family:var(--font-serif);font-size:2rem;font-weight:700;color:var(--error);">${ADMIN_INVENTORY.filter(i => i.status === 'Out of Stock').length}</div>
      </div>
    </div>
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${ADMIN_INVENTORY.map(item => `
            <tr>
              <td class="name-col">${item.name}</td>
              <td style="font-family:monospace;font-size:0.8rem;color:var(--on-surface-variant);">${item.sku}</td>
              <td>${item.category}</td>
              <td style="font-weight:600;">${item.stock}</td>
              <td style="font-weight:600;">${item.price}</td>
              <td>${statusBadge(item.status)}</td>
              <td>
                <div style="display:flex;gap:var(--space-sm);">
                  <button class="btn btn-ghost btn-sm" style="padding:4px 10px;font-size:0.75rem;">Edit</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  content.appendChild(inventoryPanel);

  page.appendChild(content);

  // Tab switching
  setTimeout(() => {
    sidebar.addEventListener('click', e => {
      const btn = e.target.closest('[data-tab]');
      if (!btn) return;
      const tabId = btn.dataset.tab;

      sidebar.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');

      content.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
      const panel = document.getElementById(`panel-${tabId}`);
      if (panel) panel.classList.add('active');
    });
  }, 50);

  return page;
});
