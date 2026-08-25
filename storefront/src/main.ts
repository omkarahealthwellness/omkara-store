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
import { renderSearchBar, setupSearchBar } from './components/ui/SearchBar';
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
    ${renderSearchBar()}
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

// Setup Search Bar with Click-to-Open Details
setupSearchBar((query: string) => {
  const resultsContainer = document.getElementById('search-results');
  const menuContent = document.getElementById('menu-content');
  const navContainer = document.getElementById('category-nav-container');

  if (!resultsContainer || !menuContent) return;

  if (!query) {
    resultsContainer.innerHTML = '';
    menuContent.style.display = 'block';
    if (navContainer) navContainer.style.display = 'block';
    return;
  }

  menuContent.style.display = 'none';
  if (navContainer) navContainer.style.display = 'none';

  const matches = allProducts.filter((p: Product) => {
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.tags.some((t: string) => t.toLowerCase().includes(q)) ||
      p.categoryId.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  });

  if (matches.length === 0) {
    resultsContainer.innerHTML = `
      <div style="text-align: center; padding-block: var(--space-8);">
        <p class="body">No products found for "${escapeHtml(query)}"</p>
        <p class="body-sm" style="color: var(--color-text-secondary); margin-top: var(--space-2);">Try searching for "smoothie" or "sprouts"</p>
      </div>
    `;
  } else {
    resultsContainer.innerHTML = `
      <div style="padding-block: var(--space-4);">
        <h3 class="label" style="margin-bottom: var(--space-4);">Search Results (${matches.length})</h3>
        <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: var(--space-4);">
          ${matches
            .map((p: Product) => {
              const defaultVariant = p.variants.find((v: ProductVariant) => v.isDefault) || p.variants[0];
              const price = defaultVariant ? defaultVariant.price : 0;
              return `
              <li
                class="search-result-item"
                data-product-id="${p.id}"
                style="padding: var(--space-3); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-md); background-color: var(--color-surface-secondary); cursor: pointer;"
              >
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                  <strong>${p.name}</strong>
                  <span style="font-weight: var(--weight-bold); color: var(--color-brand-accent);">${formatPrice(price)}</span>
                </div>
                <div class="caption" style="color: var(--color-text-secondary); margin-top: 2px;">${p.tags.join(', ')}</div>
              </li>
            `;
            })
            .join('')}
        </ul>
      </div>
    `;

    // Wire clicks on search results to open product detail
    const resultItems = resultsContainer.querySelectorAll<HTMLElement>('.search-result-item');
    resultItems.forEach((item) => {
      item.addEventListener('click', () => {
        const prodId = item.dataset.productId;
        const matched = allProducts.find((p) => p.id === prodId);
        if (matched) {
          openProductDetail(matched);
        }
      });
    });
  }
});
