// ============================================================
// OMKARA Storefront — Category Navigation Component
// ============================================================
// Horizontal scrollable pill navigation with scroll-spy.
// ============================================================

import type { Category } from 'shared/types/category';

/**
 * Render the horizontal category navigation bar.
 */
export function renderCategoryNav(categories: Category[]): string {
  if (!categories || categories.length === 0) return '';

  const pills = categories
    .map((cat, index) => {
      const activeClass = index === 0 ? ' active' : '';
      return `
        <button
          type="button"
          class="category-pill${activeClass}"
          data-category-id="${cat.id}"
          id="pill-${cat.id}"
          role="tab"
          aria-selected="${index === 0 ? 'true' : 'false'}"
        >
          ${cat.name}
        </button>
      `;
    })
    .join('');

  return `
    <nav class="category-nav" id="category-nav" aria-label="Category Navigation">
      <div class="category-nav-scroll" id="category-nav-scroll" role="tablist">
        ${pills}
      </div>
    </nav>
  `;
}

/**
 * Setup category navigation click and scroll-spy handlers.
 */
export function setupCategoryNav(): void {
  const navScroll = document.getElementById('category-nav-scroll');
  if (!navScroll) return;

  const pills = navScroll.querySelectorAll<HTMLButtonElement>('.category-pill');
  if (pills.length === 0) return;

  // 1. Click-to-scroll handler
  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const categoryId = pill.dataset.categoryId;
      if (!categoryId) return;

      const targetSection = document.getElementById(`category-${categoryId}`);
      if (!targetSection) return;

      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Update active pill state immediately on click
      updateActivePill(categoryId);
    });
  });

  // 2. Scroll-spy with IntersectionObserver
  const sections = document.querySelectorAll<HTMLElement>('[data-category-section]');
  if (sections.length === 0) return;

  const observerOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section is in top portion of viewport
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const categoryId = (entry.target as HTMLElement).dataset.categorySection;
        if (categoryId) {
          updateActivePill(categoryId);
        }
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));

  function updateActivePill(categoryId: string): void {
    pills.forEach((pill) => {
      const isActive = pill.dataset.categoryId === categoryId;
      pill.classList.toggle('active', isActive);
      pill.setAttribute('aria-selected', isActive ? 'true' : 'false');

      if (isActive) {
        // Smoothly scroll active pill into view horizontally
        pill.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    });
  }
}
