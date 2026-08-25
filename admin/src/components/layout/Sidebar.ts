// ============================================================
// OMKARA Admin — Sidebar Navigation
// ============================================================

export interface NavItem {
  id: string;
  hash: string;
  label: string;
  icon: string;
}

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', hash: '#dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'products', hash: '#products', label: 'Products', icon: '🥗' },
  { id: 'categories', hash: '#categories', label: 'Categories', icon: '📁' },
  { id: 'matrix', hash: '#matrix', label: 'Availability Matrix', icon: '⚡' },
  { id: 'config', hash: '#config', label: 'Site Config', icon: '⚙️' },
  { id: 'content', hash: '#content', label: 'Content Pages', icon: '📝' },
  { id: 'cdn', hash: '#cdn', label: 'CDN & Images', icon: '🖼️' },
];

export function renderSidebar(currentHash: string = '#dashboard'): string {
  const normalizedHash = currentHash || '#dashboard';

  const navHtml = ADMIN_NAV_ITEMS.map((item) => {
    const isActive = normalizedHash === item.hash || (normalizedHash === '' && item.hash === '#dashboard');
    return `
      <a href="${item.hash}" class="nav-link ${isActive ? 'active' : ''}" data-nav-id="${item.id}">
        <span style="font-size: 1.1rem;">${item.icon}</span>
        <span>${item.label}</span>
      </a>
    `;
  }).join('');

  return `
    <aside class="admin-sidebar" id="admin-sidebar">
      <div class="sidebar-header">
        <h2 class="sidebar-brand-title">
          <span style="color: var(--color-brand-accent);">ॐ</span> OMKARA
        </h2>
        <span class="badge" style="background: rgba(255,255,255,0.15); color: var(--color-brand-warm); font-size: 10px;">ADMIN</span>
      </div>

      <nav class="sidebar-nav">
        ${navHtml}
      </nav>

      <div class="sidebar-footer">
        <a href="http://localhost:5173" target="_blank" rel="noopener noreferrer" class="nav-link" style="padding: var(--space-2); font-size: var(--text-xs); color: rgba(255,255,255,0.6);">
          <span>↗ Open Storefront</span>
        </a>
      </div>
    </aside>
  `;
}
