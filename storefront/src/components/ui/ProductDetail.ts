// ============================================================
// OMKARA Storefront — Product Detail Sheet / Modal
// ============================================================
// Full product customization: serving sizes, add-ons, quantity,
// notes, dynamic live total, and add-to-cart.
// ============================================================

import type { Product, ProductVariant, ProductAddon } from 'shared/types/product';
import { isOrderable } from 'shared/types/availability';
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

  // 2. Build Scrollable Body HTML
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

  const bodyHtml = `
    <div class="product-detail-container" id="product-detail-content">
      ${imageHtml}
      <h2 class="product-detail-title">${product.name}</h2>
      ${product.description ? `<p class="product-detail-desc">${product.description}</p>` : ''}
      
      ${ingredientsHtml}
      ${renderVariantSelector(product.variants, selectedVariant.id)}
      ${renderAddonSelector(product.addons, [])}
      ${renderNoteInput(product.notesConfig, note)}

      <div class="product-detail-section" style="display: flex; align-items: center; justify-content: space-between;">
        <h4 class="section-title" style="margin-bottom: 0;">Quantity</h4>
        ${renderQuantityControls(quantity)}
      </div>
    </div>
  `;

  // 3. Build Sticky Footer HTML
  const footerHtml = `
    <div class="product-total-display">
      <span class="product-total-label">Total</span>
      <span class="product-total-price" id="dynamic-total-price">${formatPrice(getCalculatedTotal())}</span>
    </div>
    <button
      type="button"
      class="add-to-cart-btn"
      id="product-add-to-cart-btn"
      ${!orderable ? 'disabled' : ''}
    >
      ${orderable ? 'Add to Cart' : 'Currently Unavailable'}
    </button>
  `;

  // 4. Open Modal and Attach Listeners
  openModal(bodyHtml, {
    footerHtml,
    onAfterRender: () => {
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
      if (addBtn && orderable) {
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
