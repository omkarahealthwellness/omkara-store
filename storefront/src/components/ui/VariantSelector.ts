// ============================================================
// OMKARA Storefront — Variant / Serving Size Selector
// ============================================================

import type { ProductVariant } from 'shared/types/product';
import { formatPrice } from 'shared/constants/defaults';

/**
 * Render variant selector pills (serving sizes).
 * Hidden if only 1 variant exists.
 */
export function renderVariantSelector(
  variants: ProductVariant[],
  selectedVariantId: string
): string {
  if (!variants || variants.length <= 1) {
    return '';
  }

  const pills = variants
    .map((variant) => {
      const isSelected = variant.id === selectedVariantId;
      const activeClass = isSelected ? ' active' : '';

      return `
        <button
          type="button"
          class="variant-pill${activeClass}"
          data-variant-id="${variant.id}"
          role="radio"
          aria-checked="${isSelected ? 'true' : 'false'}"
        >
          <span class="variant-label">${variant.label}</span>
          <span class="variant-price">${formatPrice(variant.price)}</span>
        </button>
      `;
    })
    .join('');

  return `
    <div class="product-detail-section" id="variant-section">
      <h4 class="section-title">Select Serving Size</h4>
      <div class="variant-selector-grid" role="radiogroup" aria-label="Serving Size">
        ${pills}
      </div>
    </div>
  `;
}

/**
 * Setup variant selector click listeners.
 */
export function setupVariantSelector(
  variants: ProductVariant[],
  onSelect: (variant: ProductVariant) => void
): void {
  const pills = document.querySelectorAll<HTMLButtonElement>('.variant-pill');
  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const variantId = pill.dataset.variantId;
      if (!variantId) return;

      const matchedVariant = variants.find((v) => v.id === variantId);
      if (!matchedVariant) return;

      // Update UI active state
      pills.forEach((p) => {
        const isMatch = p.dataset.variantId === variantId;
        p.classList.toggle('active', isMatch);
        p.setAttribute('aria-checked', isMatch ? 'true' : 'false');
      });

      onSelect(matchedVariant);
    });
  });
}
