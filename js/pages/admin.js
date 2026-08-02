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
    { id: 'messages', icon: '✉️', label: 'Contact Messages' },
    { id: 'enquiries', icon: '📋', label: 'Order Enquiries' },
    { id: 'inventory', icon: '📦', label: 'Inventory' },
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
