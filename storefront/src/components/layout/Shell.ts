// ============================================================
// OMKARA Storefront — App Shell
// ============================================================

import { renderHeader } from './Header';
import { renderHero } from './Hero';
import { renderFooter } from './Footer';
import { renderBottomNav } from './BottomNav';
import type { SiteConfig } from 'shared/types/config';

export function renderShell(mainContent: string, config?: SiteConfig): string {
  return `
    <div class="shell" id="app-shell">
      ${renderHeader()}
      <div id="hero-slot">
        ${renderHero(config?.hero, config?.announcement, config?.tagline)}
      </div>
      <main class="main-content">
        ${mainContent}
      </main>
      <div id="footer-slot">
        ${renderFooter(config)}
      </div>
      ${renderBottomNav()}
    </div>
  `;
}
