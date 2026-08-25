// ============================================================
// OMKARA Admin — Top Bar / Header
// ============================================================

export function renderAdminHeader(userEmail?: string): string {
  const displayEmail = userEmail || 'admin@omkara.com';

  return `
    <header class="admin-header">
      <div style="display: flex; align-items: center; gap: var(--space-4);">
        <h3 class="heading-4" id="admin-page-title" style="color: var(--color-brand-primary); font-size: var(--text-lg);">Control Center</h3>
      </div>

      <div style="display: flex; align-items: center; gap: var(--space-4);">
        <button type="button" class="btn btn-primary btn-sm" id="admin-publish-btn" style="background: var(--color-brand-accent); border-color: var(--color-brand-accent);">
          <span>🚀 Publish All</span>
        </button>
        <div style="display: flex; align-items: center; gap: var(--space-2);">
          <span style="width: 8px; height: 8px; border-radius: var(--radius-full); background-color: var(--color-success); display: inline-block;"></span>
          <span class="body-sm" style="color: var(--color-text-secondary); font-weight: var(--weight-medium);">${displayEmail}</span>
        </div>
        <button type="button" class="btn btn-secondary btn-sm" id="admin-logout-btn">
          <span>Logout</span>
        </button>
      </div>
    </header>
  `;
}

export function setupAdminHeader(onLogout: () => void, onPublish: () => void): void {
  const logoutBtn = document.getElementById('admin-logout-btn');
  logoutBtn?.addEventListener('click', onLogout);

  const publishBtn = document.getElementById('admin-publish-btn');
  publishBtn?.addEventListener('click', onPublish);
}
