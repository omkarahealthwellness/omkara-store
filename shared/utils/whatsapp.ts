// ============================================================
// WhatsApp Message Builder
// ============================================================

import type { CartItem } from '../types/cart';
import { WHATSAPP_BASE_URL } from '../constants/brand';
import { formatPrice } from '../constants/defaults';

/**
 * Build a structured WhatsApp order message from cart items.
 * 
 * Format matches the OMKARA spec:
 * ```
 * Hi OMKARA! 🌿
 * 
 * I'd like to place an order:
 * 
 * 1. Product Name
 *    Size × Qty
 *    ₹Price
 *    Add-ons: ...
 *    Note: ...
 * 
 * TOTAL: ₹XXX
 * 
 * Please confirm availability.
 * ```
 */
export function buildWhatsAppMessage(
  items: CartItem[],
  grandTotal: number,
  greeting: string = 'Hi OMKARA! 🌿',
  closing: string = 'Please confirm availability.',
): string {
  const lines: string[] = [greeting, '', "I'd like to place an order:", ''];

  items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.productName}`);
    lines.push(`   ${item.selectedVariant.label} × ${item.quantity}`);
    lines.push(`   ${formatPrice(item.totalPrice)}`);

    if (item.selectedAddons.length > 0) {
      lines.push('');
      lines.push('   Add-ons:');
      item.selectedAddons.forEach((addon) => {
        lines.push(`   ${addon.name}`);
      });
    }

    if (item.note.trim()) {
      lines.push('');
      lines.push('   Note:');
      lines.push(`   ${item.note.trim()}`);
    }

    lines.push('');
  });

  lines.push(`TOTAL: ${formatPrice(grandTotal)}`);
  lines.push('');
  lines.push(closing);

  return lines.join('\n');
}

/**
 * Generate a wa.me URL with pre-filled message.
 */
export function buildWhatsAppUrl(
  phoneNumber: string,
  message: string,
): string {
  const encoded = encodeURIComponent(message);
  return `${WHATSAPP_BASE_URL}${phoneNumber}?text=${encoded}`;
}
