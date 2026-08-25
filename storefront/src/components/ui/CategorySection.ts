// ============================================================
// OMKARA Storefront — Category Section Component
// ============================================================
// Renders a category section with title, description, product grid,
// and mobile "Show More" progressive disclosure.
// ============================================================

import type { MenuCategory } from 'shared/dal/menu';
import { GRID_DEFAULTS } from 'shared/constants/defaults';
import { renderProductCard } from './ProductCard';

const INITIAL_VISIBLE_COUNT = GRID_DEFAULTS.mobileColumns * GRID_DEFAULTS.mobileInitialRows; // 4

/**
 * Render an entire category section with its product grid.
 */
export function renderCategorySection(category: MenuCategory): string {
  if (!category.products || category.products.length === 0) {
    return '';
  }

  const hasMore = category.products.length > INITIAL_VISIBLE_COUNT;
  const excessCount = category.products.length - INITIAL_VISIBLE_COUNT;

  const productCards = category.products
    .map((product, index) => renderProductCard(product, index >= INITIAL_VISIBLE_COUNT))
    .join('');

  return `
    <section
      class="category-section"
      id="category-${category.id}"
      data-category-section="${category.id}"
    >
      <header class="category-header">
        <h2 class="heading-3 category-title">${category.name}</h2>
        <span class="category-item-count">${category.products.length} items</span>
      </header>

      ${category.description ? `<p class="category-description">${category.description}</p>` : ''}

      <div class="product-grid" id="grid-${category.id}">
        ${productCards}
      </div>

      ${
        hasMore
          ? `
        <div class="show-more-container">
          <button
            type="button"
            class="show-more-btn"
            data-show-more-category="${category.id}"
            data-excess-count="${excessCount}"
            aria-expanded="false"
          >
            Show ${excessCount} more
          </button>
        </div>
      `
          : ''
      }
    </section>
  `;
}

/**
 * Setup category section interactions (Show More toggle & product clicks).
 */
export function setupCategorySections(onProductClick?: (productId: string) => void): void {
  // 1. Show More Buttons
  const showMoreBtns = document.querySelectorAll<HTMLButtonElement>('[data-show-more-category]');
  showMoreBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const categoryId = btn.dataset.showMoreCategory;
      const excessCount = btn.dataset.excessCount || '0';
      if (!categoryId) return;

      const grid = document.getElementById(`grid-${categoryId}`);
      if (!grid) return;

      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const cards = grid.querySelectorAll('.product-card');

      if (isExpanded) {
        // Collapse: hide items beyond initial 4
        cards.forEach((card, index) => {
          if (index >= INITIAL_VISIBLE_COUNT) {
            card.classList.add('hidden-by-show-more');
          }
        });
        btn.setAttribute('aria-expanded', 'false');
        btn.textContent = `Show ${excessCount} more`;

        // Scroll back to category header smoothly if scrolled past
        const categorySection = document.getElementById(`category-${categoryId}`);
        if (categorySection) {
          categorySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        // Expand: reveal all items
        cards.forEach((card) => {
          card.classList.remove('hidden-by-show-more');
        });
        btn.setAttribute('aria-expanded', 'true');
        btn.textContent = 'Show less';
      }
    });
  });

  // 2. Product Card Clicks & Enter Keypress (Event Delegation)
  if (onProductClick) {
    const sectionsContainer = document.getElementById('menu-content');
    if (sectionsContainer) {
      sectionsContainer.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const card = target.closest<HTMLElement>('.product-card');
        if (card && card.dataset.productId) {
          onProductClick(card.dataset.productId);
        }
      });

      sectionsContainer.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          const target = event.target as HTMLElement;
          const card = target.closest<HTMLElement>('.product-card');
          if (card && card.dataset.productId) {
            event.preventDefault();
            onProductClick(card.dataset.productId);
          }
        }
      });
    }
  }
}
