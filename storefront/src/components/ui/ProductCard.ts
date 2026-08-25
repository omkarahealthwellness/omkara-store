// ============================================================
// OMKARA Storefront — Product Card Component
// ============================================================
// Reusable product card with image, price, tags, and availability badge.
// ============================================================

import type { Product, ProductVariant } from 'shared/types/product';
import { AvailabilityState, isOrderable } from 'shared/types/availability';
import { formatPrice } from 'shared/constants/defaults';

/**
 * Render availability badge if not standard 'available' state.
 */
function renderAvailabilityBadge(state: AvailabilityState): string {
  switch (state) {
    case AvailabilityState.FreshlyPrepared:
      return '<span class="availability-badge freshly_prepared">Freshly Made</span>';
    case AvailabilityState.Limited:
      return '<span class="availability-badge limited">Limited</span>';
    case AvailabilityState.LowStock:
      return '<span class="availability-badge low_stock">Low Stock</span>';
    case AvailabilityState.OutOfStock:
      return '<span class="availability-badge out_of_stock">Sold Out</span>';
    case AvailabilityState.ComingSoon:
      return '<span class="availability-badge coming_soon">Coming Soon</span>';
    case AvailabilityState.TemporarilyUnavailable:
      return '<span class="availability-badge temporarily_unavailable">Unavailable</span>';
    case AvailabilityState.Seasonal:
      return '<span class="availability-badge seasonal">Seasonal</span>';
    case AvailabilityState.Available:
    default:
      return '';
  }
}

/**
 * Render an individual product card.
 */
export function renderProductCard(product: Product, isHidden: boolean = false): string {
  const defaultVariant = product.variants.find((v: ProductVariant) => v.isDefault) || product.variants[0];
  const startingPrice = defaultVariant ? defaultVariant.price : 0;
  const hasMultipleVariants = product.variants.length > 1;
  const orderable = isOrderable(product.availability);

  const hiddenClass = isHidden ? ' hidden-by-show-more' : '';
  const unavailableClass = !orderable ? ' unavailable' : '';
  const badgeHtml = renderAvailabilityBadge(product.availability);

  const tagsHtml = product.tags && product.tags.length > 0
    ? `
      <div class="product-card-tags">
        ${product.tags.slice(0, 2).map((t) => `<span class="product-tag">${t}</span>`).join('')}
      </div>
    `
    : '';

  const imageUrl = product.imageUrl || '';
  const imageHtml = imageUrl
    ? `
      <div class="product-card-img-wrapper">
        <img
          src="${imageUrl}"
          alt="${product.name}"
          class="product-card-img"
          loading="lazy"
          onerror="this.onerror=null; this.parentElement.style.display='none';"
        />
        ${badgeHtml}
      </div>
    `
    : badgeHtml ? `<div style="position: relative; height: var(--space-6);">${badgeHtml}</div>` : '';

  return `
    <article
      class="product-card${hiddenClass}${unavailableClass}"
      data-product-id="${product.id}"
      tabindex="0"
      role="button"
      aria-label="${product.name}, ${hasMultipleVariants ? 'starting from ' : ''}${formatPrice(startingPrice)}"
    >
      ${imageHtml}
      <div class="product-card-body">
        <h3 class="product-card-name">${product.name}</h3>
        ${product.shortDescription ? `<p class="product-card-desc">${product.shortDescription}</p>` : ''}
        
        <div class="product-card-footer">
          <div class="product-card-price">
            ${hasMultipleVariants ? '<span class="product-card-price-prefix">From</span>' : ''}${formatPrice(startingPrice)}
          </div>
        </div>

        ${tagsHtml}
      </div>
    </article>
  `;
}
