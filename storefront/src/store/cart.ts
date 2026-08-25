// ============================================================
// OMKARA Storefront — Cart Store
// ============================================================
// LocalStorage-backed cart state with event subscriptions.
// ============================================================

import type { Cart, CartItem } from 'shared/types/cart';

const STORAGE_KEY = 'omkara_cart_v1';
type CartListener = (cart: Cart) => void;
const listeners: Set<CartListener> = new Set();

/**
 * Calculate unit price (variant price + sum of addon prices).
 */
export function calculateUnitPrice(variantPrice: number, addonPrices: number[]): number {
  const addonsSum = addonPrices.reduce((sum, p) => sum + p, 0);
  return variantPrice + addonsSum;
}

/**
 * Calculate total price for a single cart item.
 * unitPrice * quantity
 */
export function calculateItemTotal(
  variantPrice: number,
  addonPrices: number[],
  quantity: number
): number {
  return calculateUnitPrice(variantPrice, addonPrices) * quantity;
}

/**
 * Calculate cart summary (grandTotal and itemCount).
 */
function recalculateCart(items: CartItem[]): Cart {
  const grandTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    itemCount,
    grandTotal,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Read current cart from localStorage.
 */
export function getCart(): Cart {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        items: [],
        itemCount: 0,
        grandTotal: 0,
        updatedAt: new Date().toISOString(),
      };
    }
    return JSON.parse(raw) as Cart;
  } catch (err) {
    console.error('[OMKARA Cart] Failed to parse cart from localStorage:', err);
    return {
      items: [],
      itemCount: 0,
      grandTotal: 0,
      updatedAt: new Date().toISOString(),
    };
  }
}

/**
 * Save cart to localStorage and notify listeners.
 */
function saveCart(cart: Cart): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (err) {
    console.error('[OMKARA Cart] Failed to save cart to localStorage:', err);
  }

  listeners.forEach((listener) => {
    try {
      listener(cart);
    } catch (listenerErr) {
      console.error('[OMKARA Cart] Error in cart listener:', listenerErr);
    }
  });
}

/**
 * Subscribe to cart changes.
 */
export function onCartChange(listener: CartListener): () => void {
  listeners.add(listener);
  // Immediately call with current cart state
  listener(getCart());

  return () => {
    listeners.delete(listener);
  };
}

/**
 * Add an item to cart (or increment if identical variant/addons/note exists).
 */
export function addToCart(
  item: Omit<CartItem, 'id' | 'unitPrice' | 'totalPrice' | 'addedAt'>
): CartItem {
  const currentCart = getCart();
  const addonPrices = item.selectedAddons.map((a) => a.price);
  const unitPrice = calculateUnitPrice(item.selectedVariant.price, addonPrices);
  const totalPrice = unitPrice * item.quantity;
  const now = new Date().toISOString();

  // Check for an identical existing item
  const existingIndex = currentCart.items.findIndex((existing) => {
    if (existing.productId !== item.productId) return false;
    if (existing.selectedVariant.id !== item.selectedVariant.id) return false;
    if (existing.note.trim() !== item.note.trim()) return false;

    // Compare addons by sorted IDs
    const existingAddonIds = existing.selectedAddons.map((a) => a.id).sort().join(',');
    const newAddonIds = item.selectedAddons.map((a) => a.id).sort().join(',');
    return existingAddonIds === newAddonIds;
  });

  let addedItem: CartItem;

  if (existingIndex >= 0) {
    // Increase quantity of existing item
    const existing = currentCart.items[existingIndex];
    const newQty = existing.quantity + item.quantity;
    const newTotal = existing.unitPrice * newQty;

    addedItem = {
      ...existing,
      quantity: newQty,
      totalPrice: newTotal,
      addedAt: now,
    };
    currentCart.items[existingIndex] = addedItem;
  } else {
    // Create new unique item
    const id = `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    addedItem = {
      ...item,
      id,
      unitPrice,
      totalPrice,
      addedAt: now,
    };
    currentCart.items.push(addedItem);
  }

  const updatedCart = recalculateCart(currentCart.items);
  saveCart(updatedCart);
  showToast(`Added ${item.productName} to cart 🌿`);

  return addedItem;
}

/**
 * Remove an item from the cart by its unique item ID.
 */
export function removeFromCart(itemId: string): void {
  const currentCart = getCart();
  const filtered = currentCart.items.filter((item) => item.id !== itemId);
  const updatedCart = recalculateCart(filtered);
  saveCart(updatedCart);
}

/**
 * Update an existing cart item (e.g. quantity change or edits).
 */
export function updateCartItem(
  itemId: string,
  updates: Partial<Omit<CartItem, 'id'>>
): void {
  const currentCart = getCart();
  const index = currentCart.items.findIndex((i) => i.id === itemId);
  if (index === -1) return;

  const existing = currentCart.items[index];
  const updated: CartItem = {
    ...existing,
    ...updates,
  };

  const addonPrices = updated.selectedAddons.map((a) => a.price);
  updated.unitPrice = calculateUnitPrice(updated.selectedVariant.price, addonPrices);
  updated.totalPrice = updated.unitPrice * updated.quantity;

  currentCart.items[index] = updated;
  const updatedCart = recalculateCart(currentCart.items);
  saveCart(updatedCart);
}

/**
 * Clear the entire cart.
 */
export function clearCart(): void {
  const emptyCart: Cart = {
    items: [],
    itemCount: 0,
    grandTotal: 0,
    updatedAt: new Date().toISOString(),
  };
  saveCart(emptyCart);
}

/**
 * Show temporary toast message in the UI.
 */
export function showToast(message: string): void {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('active');

  setTimeout(() => {
    toast?.classList.remove('active');
  }, 2500);
}
