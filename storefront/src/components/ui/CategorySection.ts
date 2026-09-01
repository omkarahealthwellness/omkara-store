// ============================================================
// OMKARA Storefront — Category Section Component
// ============================================================
// Renders a category section with title, description, two-row
// horizontal product slider, desktop arrow nav, and "Show More"
// toggle in the category header.
// ============================================================

import type { MenuCategory } from 'shared/dal/menu';
import { renderProductCard } from './ProductCard';

/** SVG chevron-left icon (inline, no external deps). */
const CHEVRON_LEFT = `<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>`;

/** SVG chevron-right icon. */
const CHEVRON_RIGHT = `<svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"/></svg>`;

/**
 * Render an entire category section with its product slider.
 */
export function renderCategorySection(category: MenuCategory): string {
  if (!category.products || category.products.length === 0) {
    return '';
  }

  const productCards = category.products
    .map((product) => renderProductCard(product, false))
    .join('');

  // Show "Show More" button for all categories with products
  const showMoreBtn = category.products.length > 0
    ? `
      <button
        type="button"
        class="category-show-more-btn"
        data-show-more-category="${category.id}"
        aria-expanded="false"
      >Show More →</button>
    `
    : '';

  return `
    <section
      class="category-section"
      id="category-${category.id}"
      data-category-section="${category.id}"
    >
      <header class="category-header">
        <h2 class="heading-3 category-title">${category.name}</h2>
        <div class="category-header-right">
          <span class="category-item-count">${category.products.length} items</span>
          ${showMoreBtn}
        </div>
      </header>

      ${category.description ? `<p class="category-description">${category.description}</p>` : ''}

      <div class="product-slider-wrapper" id="slider-wrap-${category.id}">
        <button
          type="button"
          class="slider-arrow left hidden"
          data-slider-arrow="left"
          data-slider-category="${category.id}"
          aria-label="Scroll left"
        >${CHEVRON_LEFT}</button>

        <div class="product-slider" id="slider-${category.id}">
          ${productCards}
        </div>

        <button
          type="button"
          class="slider-arrow right"
          data-slider-arrow="right"
          data-slider-category="${category.id}"
          aria-label="Scroll right"
        >${CHEVRON_RIGHT}</button>
      </div>
    </section>
  `;
}

/**
 * Setup category section interactions:
 *  - Slider arrow scroll (desktop)
 *  - Slider edge detection (hide/show arrows)
 *  - "Show More" toggle (slider ↔ grid)
 *  - Product card click delegation
 */
export function setupCategorySections(onProductClick?: (productId: string) => void): void {
  // 1. Slider Arrow Navigation
  const arrows = document.querySelectorAll<HTMLButtonElement>('[data-slider-arrow]');
  arrows.forEach((arrow) => {
    arrow.addEventListener('click', () => {
      const categoryId = arrow.dataset.sliderCategory;
      if (!categoryId) return;

      const slider = document.getElementById(`slider-${categoryId}`);
      if (!slider) return;

      const direction = arrow.dataset.sliderArrow === 'left' ? -1 : 1;
      // Scroll by roughly 2 card widths (~380px)
      const scrollAmount = 380;
      slider.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    });
  });

  // 2. Slider Edge Detection — hide/show arrows at scroll limits
  const sliders = document.querySelectorAll<HTMLElement>('.product-slider');
  sliders.forEach((slider) => {
    const wrapper = slider.closest('.product-slider-wrapper');
    if (!wrapper) return;

    const leftArrow = wrapper.querySelector<HTMLButtonElement>('.slider-arrow.left');
    const rightArrow = wrapper.querySelector<HTMLButtonElement>('.slider-arrow.right');

    function updateArrows(): void {
      if (!leftArrow || !rightArrow) return;

      const atStart = slider.scrollLeft <= 4;
      const atEnd = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 4;

      leftArrow.classList.toggle('hidden', atStart);
      rightArrow.classList.toggle('hidden', atEnd);
    }

    slider.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows, { passive: true });
    // Initial check (after layout settles)
    requestAnimationFrame(updateArrows);
    setTimeout(updateArrows, 150);
  });

  // 3. Show More Toggle (slider ↔ expanded grid)
  const showMoreBtns = document.querySelectorAll<HTMLButtonElement>('[data-show-more-category]');
  showMoreBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const categoryId = btn.dataset.showMoreCategory;
      if (!categoryId) return;

      const section = document.getElementById(`category-${categoryId}`);
      if (!section) return;

      const isExpanded = section.classList.toggle('expanded');
      btn.setAttribute('aria-expanded', String(isExpanded));
      btn.textContent = isExpanded ? '← Show Less' : 'Show More →';
    });
  });

  // 4. Product Card Clicks & Enter Keypress (Event Delegation)
  if (onProductClick) {
    const sectionsContainer = document.getElementById('menu-content');
    if (sectionsContainer) {
      sectionsContainer.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        // Ignore clicks on slider arrows
        if (target.closest('.slider-arrow')) return;
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
