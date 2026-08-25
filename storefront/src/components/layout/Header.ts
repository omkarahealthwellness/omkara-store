// ============================================================
// OMKARA Storefront — Header Component
// ============================================================

import { renderIcon } from '../ui/Icon';

export function renderHeader(): string {
  return `
    <header class="site-header" id="site-header">
      <div class="container">
        <div class="brand">
          <a href="#" id="header-brand-link" class="header-brand-link">
            <img src="/assets/icon-192.svg" alt="OMKARA logo" class="header-logo-img" width="28" height="28" fetchpriority="high" decoding="async" />
            <h1 class="heading-3 brand-name header-brand-text">OMKARA</h1>
          </a>
        </div>
        
        <nav class="header-nav" aria-label="Desktop Navigation">
          <div class="header-nav-actions">
            <a href="#category-nav-container" class="header-nav-link body-sm" id="header-menu-link">Menu</a>
            <a href="https://wa.me/918560078208" target="_blank" rel="noopener noreferrer" class="header-whatsapp-pill" aria-label="Chat on WhatsApp">
              ${renderIcon('icon-whatsapp', 16, 'icon-filled')}
              <span>WhatsApp</span>
            </a>
            <button
              type="button"
              id="header-cart-btn"
              class="header-cart-pill body-sm"
              aria-label="View cart"
            >
              ${renderIcon('icon-cart', 18)}
              <span>Cart</span>
              <span class="nav-cart-badge hidden" id="header-cart-badge" style="position: static; margin-left: var(--space-1);">0</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  `;
}

/**
 * Setup header event listeners.
 */
export function setupHeader(onCartClick: () => void): void {
  const cartBtn = document.getElementById('header-cart-btn');
  cartBtn?.addEventListener('click', onCartClick);
}

/**
 * Update Header desktop cart badge.
 */
export function updateHeaderCartBadge(count: number): void {
  const badge = document.getElementById('header-cart-badge');
  if (!badge) return;

  if (count > 0) {
    badge.textContent = count > 99 ? '99+' : count.toString();
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}
