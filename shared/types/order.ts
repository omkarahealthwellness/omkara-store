// ============================================================
// Order (Future-Compatible)
// ============================================================
// Data model for orders — not built into UI yet but the types
// are defined now for future kitchen queue and order tracking.
// ============================================================

import type { CartItem } from './cart';

/** Order status lifecycle */
export const OrderStatus = {
  New: 'new',
  Received: 'received',
  AwaitingPaymentMethod: 'awaiting_payment_method',
  PaymentPending: 'payment_pending',
  COD: 'cod',
  Confirmed: 'confirmed',
  Preparing: 'preparing',
  Ready: 'ready',
  OutForDelivery: 'out_for_delivery',
  Delivered: 'delivered',
  Cancelled: 'cancelled',
  Rejected: 'rejected',
  PaymentVerification: 'payment_verification',
  Failed: 'failed',
  OnHold: 'on_hold',
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

/** An order item (snapshot of cart item at time of order) */
export interface OrderItem extends CartItem {
  /** Preparation status for kitchen queue */
  preparationStatus: 'pending' | 'preparing' | 'ready';
}

/** A customer order */
export interface Order {
  /** Firestore document ID */
  id: string;

  /** Human-readable order number (e.g., "OMK-0042") */
  orderNumber: string;

  /** Order items */
  items: OrderItem[];

  /** Grand total */
  grandTotal: number;

  /** Current order status */
  status: OrderStatus;

  /** Payment method (future) */
  paymentMethod: 'pending' | 'cod' | 'upi';

  /** Customer phone (from WhatsApp, future) */
  customerPhone: string;

  /** Customer name (from WhatsApp, future) */
  customerName: string;

  /** Optional delivery address (future) */
  deliveryAddress: string;

  /** Order placed timestamp */
  createdAt: string;

  /** Last status update timestamp */
  updatedAt: string;

  /** Status history for audit trail */
  statusHistory: Array<{
    status: OrderStatus;
    timestamp: string;
    note: string;
  }>;
}
