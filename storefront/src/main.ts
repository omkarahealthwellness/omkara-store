// ============================================================
// OMKARA Storefront — Entry Point
// ============================================================
// Customer-facing food discovery and ordering experience.
// Mobile-first, QR-first, WhatsApp checkout.
// ============================================================

import './styles/main.css';
import { renderShell } from './components/layout/Shell';
import { setupHeader, updateHeaderCartBadge } from './components/layout/Header';
import { renderHero, setupHero } from './components/layout/Hero';
import { renderFooter, setupFooter } from './components/layout/Footer';
import { setupBottomNav, updateBottomNavBadge } from './components/layout/BottomNav';
import { renderCategoryNav, setupCategoryNav } from './components/ui/CategoryNav';
import { renderCategorySection, setupCategorySections } from './components/ui/CategorySection';
import { openProductDetail } from './components/ui/ProductDetail';
import { openCartView } from './components/ui/CartView';
import { openContentPageModal } from './components/ui/ContentPageModal';
import { onCartChange } from './store/cart';
import { loadStorefrontMenu } from 'shared/dal/menu';
import type { StorefrontMenu } from 'shared/dal/menu';
import type { Product, ProductVariant } from 'shared/types/product';
import { formatPrice } from 'shared/constants/defaults';
import { DEFAULT_CONTACT } from 'shared/constants/brand';
import { escapeHtml } from './utils/sanitize';

const app = document.querySelector<HTMLDivElement>('#app')!;

// Initial main content layout
const initialContent = `
  <div class="container" style="padding-block: var(--space-4);">
    <div id="category-nav-container"></div>
    <div id="search-results"></div>
    <div id="menu-content">
      <div id="loading-state" style="text-align: center; padding-block: var(--space-12);">
        <h2 class="heading-3">Menu Content Loading...</h2>
        <p class="body" style="color: var(--color-text-secondary); margin-top: var(--space-4);">Loading fresh Bikaner nourishment...</p>
      </div>
    </div>
  </div>
`;

app.innerHTML = renderShell(initialContent);

// State
let allProducts: Product[] = [];
let whatsappNumber: string = DEFAULT_CONTACT.whatsappNumber;

// Setup Cart Subscriptions
onCartChange((cart) => {
  updateHeaderCartBadge(cart.itemCount);
  updateBottomNavBadge(cart.itemCount);
});

// Setup Header & BottomNav Cart Triggers
setupHeader(() => {
  openCartView(whatsappNumber);
});

setupHero();

setupFooter((slug) => {
  openContentPageModal(slug);
});

setupBottomNav((tab) => {
  if (tab === 'cart') {
    openCartView(whatsappNumber);
  } else if (tab === 'menu') {
    const navEl = document.getElementById('category-nav-container');
    if (navEl) {
      navEl.scrollIntoView({ behavior: 'smooth' });
    }
  } else if (tab === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// Load Menu Data and wire interactions
loadStorefrontMenu()
  .then((menuData: StorefrontMenu) => {
    allProducts = menuData.allProducts;
    if (menuData.config?.whatsapp?.number) {
      whatsappNumber = menuData.config.whatsapp.number;
    }

    // 1. Update Hero & Footer with dynamic SiteConfig
    const heroSlot = document.getElementById('hero-slot');
    if (heroSlot) {
      heroSlot.innerHTML = renderHero(
        menuData.config?.hero,
        menuData.config?.announcement,
        menuData.config?.tagline
      );
      setupHero();
    }

    const footerSlot = document.getElementById('footer-slot');
    if (footerSlot) {
      footerSlot.innerHTML = renderFooter(menuData.config);
      setupFooter((slug) => {
        openContentPageModal(slug);
      });
    }

    // 2. Render Category Navigation
    const navContainer = document.getElementById('category-nav-container');
    if (navContainer) {
      navContainer.innerHTML = renderCategoryNav(menuData.categories);
      setupCategoryNav();
    }

    // 3. Render Category Sections
    const menuContent = document.getElementById('menu-content');
    if (menuContent) {
      menuContent.innerHTML = menuData.categories.map(renderCategorySection).join('');
      setupCategorySections((productId) => {
        const matchedProduct = allProducts.find((p) => p.id === productId);
        if (matchedProduct) {
          openProductDetail(matchedProduct);
        }
      });
    }
  })
  .catch((err: unknown) => {
    console.error('Failed to load menu data:', err);
    const menuContent = document.getElementById('menu-content');
    if (menuContent) {
      menuContent.innerHTML = `
        <div style="text-align: center; padding-block: var(--space-12);">
          <p class="body" style="color: var(--color-error);">Failed to load menu data. Please try again later.</p>
        </div>
      `;
    }
  });

