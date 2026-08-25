// ============================================================
// OMKARA Admin — App Shell
// ============================================================

import { renderSidebar } from './Sidebar';
import { renderAdminHeader } from './AdminHeader';

export function renderAdminShell(contentHtml: string, currentHash: string, userEmail?: string): string {
  return `
    <div class="admin-app" id="admin-shell">
      ${renderSidebar(currentHash)}
      <div class="admin-main">
        ${renderAdminHeader(userEmail)}
        <main class="admin-content-area" id="admin-main-content">
          ${contentHtml}
        </main>
      </div>
    </div>
  `;
}
