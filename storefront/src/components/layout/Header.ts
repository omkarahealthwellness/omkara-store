// ============================================================
// OMKARA Storefront — Header Component
// ============================================================

import { renderIcon } from '../ui/Icon';

export function renderHeader(): string {
  return `
    <header class="site-header" id="site-header">
      <div class="container">
        <div class="brand">
          <a href="#" id="header-brand-link" class="header-brand-link" style="display: flex; align-items: center; gap: var(--space-2); color: #FFFFF0; text-decoration: none;">
            <img src="/assets/icon-192.svg" alt="OMKARA logo" class="header-logo-img" width="28" height="28" fetchpriority="high" decoding="async" style="filter: brightness(0) invert(1);" />
            <h1 class="heading-3 brand-name header-brand-text" style="margin: 0; line-height: 1;">OMKARA</h1>
          </a>
        </div>
        
        <nav class="header-nav" aria-label="Desktop Navigation" style="position: relative;">
          <button type="button" id="header-menu-toggle" class="header-menu-toggle" aria-label="Toggle menu" style="background: none; border: none; color: #FFFFF0; cursor: pointer; padding: var(--space-2); display: flex; align-items: center; justify-content: center;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          <div class="header-dropdown-menu" id="header-dropdown-menu">
            <a href="#category-nav-container" class="header-dropdown-item" id="header-menu-link">
              ${renderIcon('icon-map-pin', 16)} Menu
            </a>
            <a href="https://wa.me/918560078208" target="_blank" rel="noopener noreferrer" class="header-dropdown-item" aria-label="Chat on WhatsApp">
              ${renderIcon('icon-whatsapp', 16)} WhatsApp
            </a>
            <button
              type="button"
              id="header-cart-btn"
              class="header-dropdown-item"
              aria-label="View cart"
            >
              ${renderIcon('icon-cart', 16)} Cart
              <span class="nav-cart-badge hidden" id="header-cart-badge" style="margin-left: auto;">0</span>
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
  cartBtn?.addEventListener('click', () => {
    document.getElementById('header-dropdown-menu')?.classList.remove('open');
    onCartClick();
  });

  const menuToggle = document.getElementById('header-menu-toggle');
  const dropdownMenu = document.getElementById('header-dropdown-menu');
  
  menuToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu?.classList.toggle('open');
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (dropdownMenu?.classList.contains('open') && !menuToggle?.contains(e.target as Node) && !dropdownMenu.contains(e.target as Node)) {
      dropdownMenu.classList.remove('open');
    }
  });
  
  // Close dropdown when Menu link is clicked
  const menuLink = document.getElementById('header-menu-link');
  menuLink?.addEventListener('click', () => {
    dropdownMenu?.classList.remove('open');
  });
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
