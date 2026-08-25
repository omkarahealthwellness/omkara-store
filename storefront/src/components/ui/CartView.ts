// ============================================================
// OMKARA Storefront — Cart View & WhatsApp Checkout
// ============================================================

import type { Cart, CartItem } from 'shared/types/cart';
import { formatPrice } from 'shared/constants/defaults';
import { buildWhatsAppMessage, buildWhatsAppUrl } from 'shared/utils/whatsapp';
import { DEFAULT_CONTACT } from 'shared/constants/brand';
import { getCart, removeFromCart, clearCart } from '../../store/cart';
import { openModal, closeModal } from './Modal';
import { escapeHtml } from '../../utils/sanitize';

/**
 * Render an individual cart item row.
 */
function renderCartItemRow(item: CartItem): string {
  const addonsText =
    item.selectedAddons.length > 0
      ? `<div class="cart-item-addons">+ ${item.selectedAddons.map((a) => a.name).join(', ')}</div>`
      : '';

  const noteText = item.note.trim()
    ? `<div class="cart-item-note">"${escapeHtml(item.note.trim())}"</div>`
    : '';

  const imgHtml = item.productImageUrl
    ? `<img src="${item.productImageUrl}" alt="${item.productName}" class="cart-item-img" onerror="this.style.display='none';" />`
    : `<div class="cart-item-img" style="display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">🌿</div>`;

  return `
    <div class="cart-item-card" data-cart-item-id="${item.id}">
      ${imgHtml}
      <div class="cart-item-details">
        <h4 class="cart-item-name">${item.productName}</h4>
        <div class="cart-item-variant">${item.selectedVariant.label} × ${item.quantity}</div>
        ${addonsText}
        ${noteText}
      </div>
      <div class="cart-item-right">
        <span class="cart-item-price">${formatPrice(item.totalPrice)}</span>
        <button
          type="button"
          class="cart-item-remove-btn"
          data-remove-item-id="${item.id}"
          aria-label="Remove ${item.productName} from cart"
        >
          Remove
        </button>
      </div>
    </div>
  `;
}

/**
 * Render the full Cart View HTML.
 */
export function renderCartView(cart: Cart, whatsappNumber: string = DEFAULT_CONTACT.whatsappNumber): string {
  if (cart.items.length === 0) {
    return `
      <div class="cart-container">
        <header class="cart-header">
          <h2 class="cart-title">Your Order</h2>
        </header>
        <div class="cart-empty-state">
          <span class="cart-empty-icon">🛒</span>
          <h3 class="cart-empty-title">Cart abhi khaali hai</h3>
          <p class="cart-empty-desc">Explore our fresh, nourishing Bikaner menu and add your favorites!</p>
          <button
            type="button"
            class="add-to-cart-btn"
            id="cart-explore-menu-btn"
          >
            Explore Menu
          </button>
        </div>
      </div>
    `;
  }

  const itemsHtml = cart.items.map(renderCartItemRow).join('');
  const waMessage = buildWhatsAppMessage(cart.items, cart.grandTotal);
  const waUrl = buildWhatsAppUrl(whatsappNumber, waMessage);

  return `
    <div class="cart-container">
      <header class="cart-header">
        <h2 class="cart-title">Your Order</h2>
        <span class="caption" style="color: var(--color-text-tertiary);">${cart.itemCount} items</span>
      </header>

      <div class="cart-items-list" id="cart-items-list">
        ${itemsHtml}
      </div>

      <div class="cart-footer-summary">
        <div class="cart-summary-row">
          <span>Grand Total</span>
          <span style="font-size: var(--text-2xl); color: var(--color-brand-primary);">${formatPrice(cart.grandTotal)}</span>
        </div>

        <a
          href="${waUrl}"
          target="_blank"
          rel="noopener noreferrer"
          class="whatsapp-checkout-btn"
          id="whatsapp-order-cta"
        >
          <svg class="whatsapp-icon-svg" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.072-1.847-.432-1.423-.591-2.34-2.035-2.411-2.13-.072-.095-.576-.768-.576-1.464 0-.696.36-1.037.488-1.18.128-.144.28-.18.374-.18.095 0 .19.001.272.006.089.005.207-.034.324.247.12.288.411 1.002.447 1.074.036.072.06.156.012.252-.048.096-.072.156-.144.24-.072.084-.152.188-.217.252-.072.072-.147.151-.063.296.084.144.374.618.802 1.001.552.493 1.018.646 1.162.718.144.072.228.06.312-.036.084-.096.36-.42.456-.564.096-.144.192-.12.324-.072.132.048.84.396.984.468.144.072.24.108.276.168.036.06.036.348-.108.753z"/>
          </svg>
          Order on WhatsApp
        </a>

        <div style="text-align: center; margin-top: var(--space-3);">
          <button
            type="button"
            class="caption"
            id="cart-clear-btn"
            style="background: none; border: none; color: var(--color-text-tertiary); cursor: pointer; text-decoration: underline;"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Open the Cart View in the bottom sheet / modal.
 */
export function openCartView(whatsappNumber?: string): void {
  const currentCart = getCart();

  openModal(renderCartView(currentCart, whatsappNumber), {
    onAfterRender: (container) => {
      // 1. Explore Menu Button (Empty State)
      const exploreBtn = container.querySelector('#cart-explore-menu-btn');
      if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
          closeModal();
        });
      }

      // 2. Remove Item Buttons
      const removeBtns = container.querySelectorAll<HTMLButtonElement>('[data-remove-item-id]');
      removeBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const itemId = btn.dataset.removeItemId;
          if (itemId) {
            removeFromCart(itemId);
            // Re-render cart in modal
            openCartView(whatsappNumber);
          }
        });
      });

      // 3. Clear Cart Button
      const clearBtn = container.querySelector('#cart-clear-btn');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (confirm('Are you sure you want to clear your cart?')) {
            clearCart();
            openCartView(whatsappNumber);
          }
        });
      }

      // 4. WhatsApp CTA click -> prompt to optionally clear cart after sending
      const waBtn = container.querySelector('#whatsapp-order-cta');
      if (waBtn) {
        waBtn.addEventListener('click', () => {
          setTimeout(() => {
            closeModal();
          }, 500);
        });
      }
    },
  });
}
