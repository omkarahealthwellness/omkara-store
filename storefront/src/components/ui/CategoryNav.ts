// ============================================================
// OMKARA Storefront — Category Navigation Component
// ============================================================
// Horizontal scrollable pill navigation with scroll-spy.
// ============================================================

import type { Category } from 'shared/types/category';

/** SVG chevron-left icon. */
const CHEVRON_LEFT = `<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>`;

/** SVG chevron-right icon. */
const CHEVRON_RIGHT = `<svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"/></svg>`;

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
      <div class="category-nav-wrapper">
        <button
          type="button"
          class="category-nav-arrow left hidden"
          id="category-nav-arrow-left"
          aria-label="Scroll categories left"
        >${CHEVRON_LEFT}</button>

        <div class="category-nav-scroll" id="category-nav-scroll" role="tablist">
          ${pills}
        </div>

        <button
          type="button"
          class="category-nav-arrow right"
          id="category-nav-arrow-right"
          aria-label="Scroll categories right"
        >${CHEVRON_RIGHT}</button>
      </div>
    </nav>
  `;
}

/**
 * Setup category navigation click, desktop scroll buttons, and scroll-spy handlers.
 */
export function setupCategoryNav(): void {
  const navScroll = document.getElementById('category-nav-scroll');
  if (!navScroll) return;

  const pills = navScroll.querySelectorAll<HTMLButtonElement>('.category-pill');
  if (pills.length === 0) return;

  const leftArrow = document.getElementById('category-nav-arrow-left') as HTMLButtonElement | null;
  const rightArrow = document.getElementById('category-nav-arrow-right') as HTMLButtonElement | null;

  // 1. Desktop Arrow Buttons Scroll & Edge Detection
  function updateNavArrows(): void {
    if (!leftArrow || !rightArrow || !navScroll) return;
    const atStart = navScroll.scrollLeft <= 4;
    const atEnd = navScroll.scrollLeft + navScroll.clientWidth >= navScroll.scrollWidth - 4;

    leftArrow.classList.toggle('hidden', atStart);
    rightArrow.classList.toggle('hidden', atEnd);
  }

  if (leftArrow) {
    leftArrow.addEventListener('click', () => {
      navScroll.scrollBy({ left: -260, behavior: 'smooth' });
    });
  }

  if (rightArrow) {
    rightArrow.addEventListener('click', () => {
      navScroll.scrollBy({ left: 260, behavior: 'smooth' });
    });
  }

  navScroll.addEventListener('scroll', updateNavArrows, { passive: true });
  requestAnimationFrame(updateNavArrows);
  window.addEventListener('resize', updateNavArrows, { passive: true });

  // 2. Click-to-scroll handler
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

  // 3. Scroll-spy with IntersectionObserver
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
