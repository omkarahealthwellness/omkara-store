// ============================================================
// OMKARA Storefront — Product Detail Sheet / Modal
// ============================================================
// Full product customization: serving sizes, add-ons, quantity,
// notes, dynamic live total, and add-to-cart.
// ============================================================

import type { Product, ProductVariant, ProductAddon } from 'shared/types/product';
import { AvailabilityState, isOrderable } from 'shared/types/availability';
import { formatPrice } from 'shared/constants/defaults';
import { renderVariantSelector, setupVariantSelector } from './VariantSelector';
import { renderAddonSelector, setupAddonSelector } from './AddonSelector';
import { renderQuantityControls, setupQuantityControls } from './QuantityControls';
import { renderNoteInput, setupNoteInput } from './NoteInput';
import { calculateItemTotal, addToCart } from '../../store/cart';
import { openModal, closeModal } from './Modal';

/**
 * Open the product detail sheet/modal for a product.
 */
export function openProductDetail(product: Product): void {
  // 1. Initial customization state
  const defaultVariant = product.variants.find((v) => v.isDefault) || product.variants[0];
  let selectedVariant: ProductVariant = defaultVariant || {
    id: 'default',
    label: 'Standard',
    price: 0,
    isDefault: true,
  };

  let selectedAddons: ProductAddon[] = [];
  let quantity = 1;
  let note = '';
  const orderable = isOrderable(product.availability);

  function getCalculatedTotal(): number {
    return calculateItemTotal(
      selectedVariant.price,
      selectedAddons.map((a) => a.price),
      quantity
    );
  }

  // 2. Build unavailability banner for non-orderable products
  const unavailabilityBannerHtml = !orderable ? renderUnavailabilityBanner(product.availability) : '';

  // 3. Build Scrollable Body HTML
  const ingredientsHtml =
    product.ingredients && product.ingredients.length > 0
      ? `
      <div class="product-detail-ingredients">
        <h5 class="ingredients-label">Key Ingredients</h5>
        <div class="ingredients-list">
          ${product.ingredients.map((ing) => `<span class="ingredient-chip">${ing}</span>`).join('')}
        </div>
      </div>
    `
      : '';

  const imageHtml = product.imageUrl
    ? `
      <div class="product-detail-img-wrapper">
        <img
          src="${product.imageUrl}"
          alt="${product.name}"
          class="product-detail-img"
          onerror="this.parentElement.style.display='none';"
        />
      </div>
    `
    : '';

  // Customization controls — wrapped in disabled container when non-orderable
  const controlsHtml = `
    ${renderVariantSelector(product.variants, selectedVariant.id)}
    ${renderAddonSelector(product.addons, [])}
    ${renderNoteInput(product.notesConfig, note)}

    <div class="product-detail-section" style="display: flex; align-items: center; justify-content: space-between;">
      <h4 class="section-title" style="margin-bottom: 0;">Quantity</h4>
      ${renderQuantityControls(quantity)}
    </div>
  `;

  const bodyHtml = `
    <div class="product-detail-container" id="product-detail-content">
      ${imageHtml}
      ${unavailabilityBannerHtml}
      <h2 class="product-detail-title">${product.name}</h2>
      ${product.description ? `<p class="product-detail-desc">${product.description}</p>` : ''}
      
      ${ingredientsHtml}
      ${orderable
        ? controlsHtml
        : `<div class="product-detail-disabled">${controlsHtml}</div>`
      }
    </div>
  `;

  // 4. Build Sticky Footer HTML — only for orderable products
  const footerHtml = orderable
    ? `
      <div class="product-total-display">
        <span class="product-total-label">Total</span>
        <span class="product-total-price" id="dynamic-total-price">${formatPrice(getCalculatedTotal())}</span>
      </div>
      <button
        type="button"
        class="add-to-cart-btn"
        id="product-add-to-cart-btn"
      >
        Add to Cart
      </button>
    `
    : undefined;

  // 5. Open Modal and Attach Listeners
  openModal(bodyHtml, {
    footerHtml,
    onAfterRender: () => {
      // Only wire interactive controls for orderable products
      if (!orderable) return;

      const updateTotalPriceDisplay = () => {
        const totalEl = document.getElementById('dynamic-total-price');
        if (totalEl) {
          totalEl.textContent = formatPrice(getCalculatedTotal());
        }
      };

      // Wire Variant Selection
      setupVariantSelector(product.variants, (newVariant) => {
        selectedVariant = newVariant;
        updateTotalPriceDisplay();
      });

      // Wire Add-on Selection
      setupAddonSelector(product.addons, (newAddons) => {
        selectedAddons = newAddons;
        updateTotalPriceDisplay();
      });

      // Wire Quantity Controls
      setupQuantityControls(quantity, (newQty) => {
        quantity = newQty;
        updateTotalPriceDisplay();
      });

      // Wire Note Input
      setupNoteInput(product.notesConfig?.maxLength || 200, (newNote) => {
        note = newNote;
      });

      // Wire Add to Cart button
      const addBtn = document.getElementById('product-add-to-cart-btn');
      if (addBtn) {
        addBtn.addEventListener('click', () => {
          addToCart({
            productId: product.id,
            productName: product.name,
            productImageUrl: product.imageUrl || '',
            selectedVariant,
            selectedAddons,
            quantity,
            note,
          });

          closeModal();
        });
      }
    },
  });
}

/**
 * Render a prominent unavailability banner for the product detail modal.
 */
function renderUnavailabilityBanner(state: AvailabilityState): string {
  switch (state) {
    case AvailabilityState.OutOfStock:
      return `
        <div class="product-detail-unavailable-banner banner-sold-out">
          <span class="banner-icon">🚫</span>
          <span>This item is currently sold out</span>
        </div>
      `;
    case AvailabilityState.ComingSoon:
      return `
        <div class="product-detail-unavailable-banner banner-coming-soon">
          <span class="banner-icon">🚀</span>
          <span>This item is coming soon!</span>
        </div>
      `;
    case AvailabilityState.TemporarilyUnavailable:
      return `
        <div class="product-detail-unavailable-banner banner-paused">
          <span class="banner-icon">⏸</span>
          <span>This item is temporarily paused</span>
        </div>
      `;
    default:
      return `
        <div class="product-detail-unavailable-banner banner-paused">
          <span class="banner-icon">ℹ️</span>
          <span>This item is currently unavailable</span>
        </div>
      `;
  }
}
