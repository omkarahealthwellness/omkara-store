// ============================================================
// OMKARA Storefront — Bottom Navigation Capsule (Mobile)
// ============================================================

import { renderIcon } from '../ui/Icon';

export function renderBottomNav(): string {
  return `
    <div class="bottom-nav-container">
      <nav class="bottom-nav" aria-label="Mobile Navigation">
        <button type="button" class="bottom-nav-item active" id="nav-item-home" aria-label="Home">
          ${renderIcon('icon-home', 22, 'bottom-nav-icon')}
          <span class="caption">Home</span>
        </button>
        
        <button type="button" class="bottom-nav-item" id="nav-item-menu" aria-label="Menu">
          ${renderIcon('icon-menu', 22, 'bottom-nav-icon')}
          <span class="caption">Menu</span>
        </button>

        <button type="button" class="bottom-nav-item" id="nav-item-cart" aria-label="Cart" style="position: relative;">
          ${renderIcon('icon-cart', 22, 'bottom-nav-icon')}
          <span class="nav-cart-badge hidden" id="bottom-nav-cart-badge">0</span>
          <span class="caption">Cart</span>
        </button>
      </nav>
    </div>
  `;
}

/**
 * Setup Bottom Navigation event listeners and badge updater.
 */
export function setupBottomNav(onNavClick: (tab: 'home' | 'menu' | 'cart') => void): void {
  const homeBtn = document.getElementById('nav-item-home');
  const menuBtn = document.getElementById('nav-item-menu');
  const cartBtn = document.getElementById('nav-item-cart');

  homeBtn?.addEventListener('click', () => {
    setActiveNav('home');
    onNavClick('home');
  });

  menuBtn?.addEventListener('click', () => {
    setActiveNav('menu');
    onNavClick('menu');
  });

  cartBtn?.addEventListener('click', () => {
    onNavClick('cart');
  });

  function setActiveNav(tab: 'home' | 'menu') {
    homeBtn?.classList.toggle('active', tab === 'home');
    menuBtn?.classList.toggle('active', tab === 'menu');
  }
}

/**
 * Update BottomNav cart badge count.
 */
export function updateBottomNavBadge(count: number): void {
  const badge = document.getElementById('bottom-nav-cart-badge');
  if (!badge) return;

  if (count > 0) {
    badge.textContent = count > 99 ? '99+' : count.toString();
    badge.classList.remove('hidden');
    badge.classList.add('animate-badge-pop');
    setTimeout(() => badge.classList.remove('animate-badge-pop'), 400);
  } else {
    badge.classList.add('hidden');
  }
}
