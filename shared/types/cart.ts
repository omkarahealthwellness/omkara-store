// ============================================================
// Cart
// ============================================================

import type { ProductAddon, ProductVariant } from './product';

/** A single item in the customer's cart */
export interface CartItem {
  /** Unique cart item ID (generated client-side, e.g., nanoid) */
  id: string;

  /** Reference to the product ID */
  productId: string;

  /** Product name (snapshot at time of adding — for display even if product changes) */
  productName: string;

  /** Product image URL (snapshot) */
  productImageUrl: string;

  /** The selected variant/size */
  selectedVariant: ProductVariant;

  /** Selected add-ons */
  selectedAddons: ProductAddon[];

  /** Quantity */
  quantity: number;

  /** Customer note */
  note: string;

  /** 
   * Calculated unit price: variant price + sum of addon prices 
   * Stored for quick display. Recalculated on edit.
   */
  unitPrice: number;

  /** Total: unitPrice × quantity */
  totalPrice: number;

  /** Timestamp when added to cart */
  addedAt: string;
}

/** The full cart state */
export interface Cart {
  /** All items in the cart */
  items: CartItem[];

  /** Grand total (sum of all item totalPrices) */
  grandTotal: number;

  /** Total item count (sum of all quantities) */
  itemCount: number;

  /** Last modified timestamp */
  updatedAt: string;
}
