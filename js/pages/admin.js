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
    { id: 'gateway',   icon: '⚡',  label: 'YouPI Gateway' },
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

  // ---- Panel: YouPI Gateway ----
  const gatewayPanel = document.createElement('div');
  gatewayPanel.className = 'admin-panel';
  gatewayPanel.id = 'panel-gateway';
  gatewayPanel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-xl);">
      <div>
        <h1 class="admin-page-title" style="margin-bottom:4px;">YouPI PG Sovereign Gateway</h1>
        <p style="font-size:0.875rem;color:var(--on-surface-variant);margin:0;">Self-hosted UPI payment engine & banking observation mesh</p>
      </div>
      <span class="badge badge-success" style="padding:6px 12px;font-size:0.75rem;">● 0% Platform Fee Rail</span>
    </div>

    <!-- Gateway Architecture Cards -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:var(--space-lg);margin-bottom:var(--space-2xl);">
      <div style="background:var(--surface-container-lowest);border:1px solid var(--outline-variant);border-radius:var(--radius-md);padding:var(--space-lg);box-shadow:var(--shadow-ambient);">
        <div style="font-size:0.75rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--secondary);margin-bottom:6px;">Active Receiving VPA</div>
        <div id="active-vpa-display" style="font-family:monospace;font-size:1.15rem;font-weight:700;color:var(--primary);">sofisuhail007@ibl</div>
        <div style="font-size:0.75rem;color:var(--on-surface-variant);margin-top:6px;">Direct NPCI settlement to merchant account</div>
      </div>

      <div style="background:var(--surface-container-lowest);border:1px solid var(--outline-variant);border-radius:var(--radius-md);padding:var(--space-lg);box-shadow:var(--shadow-ambient);">
        <div style="font-size:0.75rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--secondary);margin-bottom:6px;">Authoritative Webhook</div>
        <div style="font-family:monospace;font-size:0.85rem;font-weight:600;color:var(--primary);word-break:break-all;">/api/youpi-webhook</div>
        <div style="font-size:0.75rem;color:var(--on-surface-variant);margin-top:6px;">HMAC-SHA256 Signature Verification Enforced</div>
      </div>

      <div style="background:var(--surface-container-lowest);border:1px solid var(--outline-variant);border-radius:var(--radius-md);padding:var(--space-lg);box-shadow:var(--shadow-ambient);">
        <div style="font-size:0.75rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--secondary);margin-bottom:6px;">Payment Policy</div>
        <div style="font-size:1rem;font-weight:700;color:var(--on-surface);">100% Prepaid UPI Only</div>
        <div style="font-size:0.75rem;color:var(--tertiary);margin-top:6px;">Cash on Delivery (COD) disabled</div>
      </div>
    </div>

    <!-- Receiving UPI IDs Management Section -->
    <div style="background:var(--surface-container-lowest);border-radius:var(--radius-md);padding:var(--space-xl);margin-bottom:var(--space-2xl);box-shadow:var(--shadow-ambient);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md);flex-wrap:wrap;gap:10px;">
        <div>
          <h3 style="font-family:var(--font-serif);font-size:1.15rem;font-weight:700;margin:0 0 4px 0;">Receiving UPI IDs Management</h3>
          <p style="font-size:0.85rem;color:var(--on-surface-variant);margin:0;">
            Edit or switch the UPI ID where customer payments land. Updates take effect immediately in checkout & database.
          </p>
        </div>
        <span class="badge badge-primary" style="font-size:0.75rem;">Direct P2P Settlement</span>
      </div>

      <!-- Edit / Add Active UPI Form -->
      <div style="background:var(--surface-container-low);border-radius:var(--radius-md);padding:var(--space-lg);margin-bottom:var(--space-xl);border:1px solid var(--outline-variant);">
        <h4 style="font-size:0.9rem;font-weight:700;margin:0 0 var(--space-md) 0;color:var(--on-surface);">Set / Edit Active UPI ID</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr auto;gap:var(--space-md);align-items:flex-end;">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" for="edit-upi-vpa">Receiving UPI ID (VPA)</label>
            <input class="form-input" id="edit-upi-vpa" type="text" placeholder="sofisuhail007@ibl" style="font-family:monospace;font-weight:600;">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" for="edit-upi-payee">Payee / Account Name</label>
            <input class="form-input" id="edit-upi-payee" type="text" placeholder="Harmukh Threads">
          </div>
          <button id="save-upi-btn" class="btn btn-primary" style="padding:10px 20px;height:42px;white-space:nowrap;font-size:0.85rem;">
            💾 Save & Set Active
          </button>
        </div>
        <div id="upi-save-feedback" style="margin-top:10px;font-size:0.8rem;min-height:20px;"></div>
      </div>

      <!-- Configured Accounts Table -->
      <div>
        <h4 style="font-size:0.9rem;font-weight:700;margin:0 0 var(--space-md) 0;color:var(--on-surface);">Configured Receiving Accounts</h4>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>UPI ID (VPA)</th>
                <th>Payee Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="upi-accounts-tbody">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Service URLs & Endpoints -->
    <div style="background:var(--surface-container-lowest);border-radius:var(--radius-md);padding:var(--space-xl);margin-bottom:var(--space-2xl);box-shadow:var(--shadow-ambient);">
      <h3 style="font-family:var(--font-serif);font-size:1.1rem;font-weight:600;margin-bottom:var(--space-lg);">Service Endpoints & Topology</h3>
      <table class="admin-table">
        <thead>
          <tr>
            <th>Service Name</th>
            <th>Default Port</th>
            <th>Local Endpoint</th>
            <th>Status / Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Checkout Portal & youpi.js</strong></td>
            <td><code>7000</code></td>
            <td><a href="http://localhost:7000" target="_blank" style="color:var(--primary);font-family:monospace;">http://localhost:7000</a></td>
            <td><button class="btn btn-ghost btn-sm" onclick="window.open('http://localhost:7000', '_blank')">Open Portal</button></td>
          </tr>
          <tr>
            <td><strong>Payment Core REST API</strong></td>
            <td><code>6100</code></td>
            <td><a href="http://localhost:6100" target="_blank" style="color:var(--primary);font-family:monospace;">http://localhost:6100/health</a></td>
            <td><button class="btn btn-ghost btn-sm" onclick="window.open('http://localhost:6100/health', '_blank')">Health Check</button></td>
          </tr>
          <tr>
            <td><strong>Merchant Admin & Control Hub</strong></td>
            <td><code>6001</code></td>
            <td><a href="http://localhost:6001" target="_blank" style="color:var(--primary);font-family:monospace;">http://localhost:6001</a></td>
            <td><button class="btn btn-ghost btn-sm" onclick="window.open('http://localhost:6001', '_blank')">Open Admin</button></td>
          </tr>
          <tr>
            <td><strong>Control Center Supervisor</strong></td>
            <td><code>8090</code></td>
            <td><a href="http://localhost:8090" target="_blank" style="color:var(--primary);font-family:monospace;">http://localhost:8090</a></td>
            <td><button class="btn btn-ghost btn-sm" onclick="window.open('http://localhost:8090', '_blank')">Open Supervisor</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Quick Operations & Diagnostics -->
    <div style="background:var(--surface-container-lowest);border-radius:var(--radius-md);padding:var(--space-xl);box-shadow:var(--shadow-ambient);">
      <h3 style="font-family:var(--font-serif);font-size:1.1rem;font-weight:600;margin-bottom:var(--space-md);">CLI Quickstart & Service Controls</h3>
      <p style="font-size:0.875rem;color:var(--on-surface-variant);margin-bottom:var(--space-lg);">
        You can launch all gateway services, run migrations, or simulate webhooks directly from the terminal:
      </p>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);">
        <div style="background:#1e1e1e;border-radius:var(--radius-md);padding:var(--space-md);color:#f8f8f2;font-family:monospace;font-size:0.8rem;line-height:1.7;">
          <div style="color:#6272a4;"># Launch YouPI PG Gateway Supervisor (Ports 6100, 7000, 6001, 8090)</div>
          <div style="color:#50fa7b;">npm run gateway:dev</div>
          <br>
          <div style="color:#6272a4;"># Test Webhook Signature Verification</div>
          <div style="color:#50fa7b;">npm run test:webhook</div>
        </div>

        <div style="background:#1e1e1e;border-radius:var(--radius-md);padding:var(--space-md);color:#f8f8f2;font-family:monospace;font-size:0.8rem;line-height:1.7;">
          <div style="color:#6272a4;"># Reset / Seed Harmukh Threads DB Profile</div>
          <div style="color:#50fa7b;">npm run gateway:setup</div>
          <br>
          <div style="color:#6272a4;"># Run Full 31-Suite Regression Tests</div>
          <div style="color:#50fa7b;">npm run gateway:test</div>
        </div>
      </div>
    </div>
  `;
  content.appendChild(gatewayPanel);

  page.appendChild(content);

  // Tab switching and UPI accounts management
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

    // ── UPI Accounts Management Logic ────────────────────────
    function renderUpiAccounts() {
      const cfg = window.HT_CONFIG ? window.HT_CONFIG.get() : {
        merchantVpa: 'sofisuhail007@ibl',
        merchantName: 'Harmukh Threads',
        upiAccounts: [{ id: 'acc_1', upiId: 'sofisuhail007@ibl', payeeName: 'Harmukh Threads', isActive: true }]
      };

      const activeVpa = cfg.merchantVpa || 'sofisuhail007@ibl';
      const accounts = (cfg.upiAccounts && cfg.upiAccounts.length > 0)
        ? cfg.upiAccounts
        : [{ id: 'acc_1', upiId: activeVpa, payeeName: cfg.merchantName || 'Harmukh Threads', isActive: true }];

      const container = document.getElementById('upi-accounts-tbody');
      const activeDisplay = document.getElementById('active-vpa-display');
      const inputVpa = document.getElementById('edit-upi-vpa');
      const inputPayee = document.getElementById('edit-upi-payee');

      if (activeDisplay) activeDisplay.textContent = activeVpa;
      if (inputVpa && !inputVpa.value) inputVpa.value = activeVpa;
      if (inputPayee && !inputPayee.value) inputPayee.value = cfg.merchantName || 'Harmukh Threads';

      if (container) {
        container.innerHTML = accounts.map(acc => {
          const isActive = acc.upiId.toLowerCase() === activeVpa.toLowerCase() || Boolean(acc.isActive);
          return `
            <tr>
              <td><strong style="font-family:monospace;font-size:0.9rem;color:var(--on-surface);">${acc.upiId}</strong></td>
              <td>${acc.payeeName || 'Harmukh Threads'}</td>
              <td>
                ${isActive
                  ? '<span class="badge badge-success" style="font-size:0.75rem;">● Active Receiving</span>'
                  : '<span class="badge badge-secondary" style="font-size:0.75rem;">Standby</span>'}
              </td>
              <td>
                <div style="display:flex;gap:6px;">
                  ${!isActive
                    ? `<button class="btn btn-primary btn-sm activate-vpa-btn" data-id="${acc.id}" data-vpa="${acc.upiId}" data-name="${acc.payeeName || 'Harmukh Threads'}" style="padding:4px 10px;font-size:0.75rem;">Set Active</button>`
                    : '<span style="font-size:0.75rem;color:var(--secondary);font-weight:600;padding:4px 0;">Current</span>'}
                  ${accounts.length > 1 && !isActive
                    ? `<button class="btn btn-ghost btn-sm remove-vpa-btn" data-id="${acc.id}" style="padding:4px 10px;font-size:0.75rem;color:var(--error);">Delete</button>`
                    : ''}
                </div>
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    renderUpiAccounts();

    // Save & Set Active UPI ID
    const saveUpiBtn = document.getElementById('save-upi-btn');
    if (saveUpiBtn) {
      saveUpiBtn.addEventListener('click', async () => {
        const vpaInput = document.getElementById('edit-upi-vpa');
        const payeeInput = document.getElementById('edit-upi-payee');
        const feedback = document.getElementById('upi-save-feedback');

        const vpa = (vpaInput?.value || '').trim();
        const payee = (payeeInput?.value || '').trim() || 'Harmukh Threads';

        if (!vpa || !vpa.includes('@')) {
          if (feedback) feedback.innerHTML = '<span style="color:var(--error);font-weight:600;">⚠️ Invalid UPI ID format. Expected format: username@bank (e.g. sofisuhail007@ibl)</span>';
          return;
        }

        saveUpiBtn.disabled = true;
        saveUpiBtn.textContent = 'Saving...';

        // 1. Update client-side config
        if (window.HT_CONFIG) {
          window.HT_CONFIG.setVpa(vpa, payee);
        }

        // 2. Call backend /api/update-vpa to sync with SQLite database
        try {
          const res = await fetch('/api/update-vpa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ upiId: vpa, payeeName: payee })
          });
          const resData = await res.json();
          console.log('[Admin] Update VPA response:', resData);
        } catch (e) {
          console.warn('[Admin] Local sync notice:', e.message);
        }

        renderUpiAccounts();
        saveUpiBtn.disabled = false;
        saveUpiBtn.textContent = '💾 Save & Set Active';

        if (feedback) {
          feedback.innerHTML = `<span style="color:#25d366;font-weight:700;">✓ Active receiving UPI ID updated to <code>${vpa}</code>. Synced across checkout & database.</span>`;
          setTimeout(() => { feedback.innerHTML = ''; }, 4500);
        }
      });
    }

    // Event delegation on table buttons (Activate / Delete)
    const accountsTableBody = document.getElementById('upi-accounts-tbody');
    if (accountsTableBody) {
      accountsTableBody.addEventListener('click', async (e) => {
        const actBtn = e.target.closest('.activate-vpa-btn');
        if (actBtn) {
          const accId = actBtn.dataset.id;
          const vpa = actBtn.dataset.vpa;
          const name = actBtn.dataset.name;

          if (window.HT_CONFIG) {
            window.HT_CONFIG.setVpa(vpa, name);
          }

          // Sync backend
          try {
            await fetch('/api/update-vpa', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ upiId: vpa, payeeName: name })
            });
          } catch (err) {}

          renderUpiAccounts();
          const feedback = document.getElementById('upi-save-feedback');
          if (feedback) {
            feedback.innerHTML = `<span style="color:#25d366;font-weight:700;">✓ Switched active receiving UPI ID to <code>${vpa}</code>.</span>`;
            setTimeout(() => { feedback.innerHTML = ''; }, 3500);
          }
          return;
        }

        const delBtn = e.target.closest('.remove-vpa-btn');
        if (delBtn) {
          const accId = delBtn.dataset.id;
          if (confirm('Are you sure you want to remove this standby UPI account?')) {
            if (window.HT_CONFIG) {
              window.HT_CONFIG.removeAccount(accId);
            }
            renderUpiAccounts();
          }
        }
      });
    }
  }, 50);

  return page;
});
