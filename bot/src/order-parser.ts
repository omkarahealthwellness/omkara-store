// ============================================================
// OMKARA WhatsApp Bot — Order Message Parser
// ============================================================
// Detects and parses order messages sent via the wa.me checkout.
//
// The OMKARA storefront builds messages in this format:
//   Hi OMKARA! 🌿
//   I'd like to place an order:
//   1. Product Name
//      Size × Qty
//      ₹Price
//   TOTAL: ₹XXX
//   Please confirm availability.
// ============================================================

export interface ParsedOrder {
  isOrder: boolean;
  items: OrderItem[];
  total: string;
  rawText: string;
}

export interface OrderItem {
  name: string;
  variant: string;
  quantity: number;
  price: string;
  addons: string[];
  note: string;
}

/**
 * Keywords/patterns that identify an order message from the OMKARA storefront.
 */
const ORDER_MARKERS = [
  "i'd like to place an order",
  'place an order',
  'order karna',
  'order chahiye',
  'TOTAL:',
  'confirm availability',
];

/**
 * Detect whether a message is an order from the OMKARA storefront checkout.
 */
export function isOrderMessage(text: string): boolean {
  const lower = text.toLowerCase();
  // Must contain at least 2 of the order markers to avoid false positives
  let hits = 0;
  for (const marker of ORDER_MARKERS) {
    if (lower.includes(marker.toLowerCase())) {
      hits++;
      if (hits >= 2) return true;
    }
  }
  // Also check for the rupee + total pattern
  if (/TOTAL:\s*₹[\d,.]+/i.test(text)) return true;
  return false;
}

/**
 * Parse order items from the OMKARA checkout message format.
 * Returns a structured representation of the order.
 */
export function parseOrderMessage(text: string): ParsedOrder {
  if (!isOrderMessage(text)) {
    return { isOrder: false, items: [], total: '', rawText: text };
  }

  const lines = text.split('\n').map((l) => l.trim());
  const items: OrderItem[] = [];
  let total = '';
  let currentItem: Partial<OrderItem> | null = null;

  for (const line of lines) {
    // Match numbered items: "1. Product Name"
    const itemMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (itemMatch) {
      // Save previous item
      if (currentItem?.name) {
        items.push(finalizeItem(currentItem));
      }
      currentItem = {
        name: itemMatch[2],
        variant: '',
        quantity: 1,
        price: '',
        addons: [],
        note: '',
      };
      continue;
    }

    // Match variant + quantity: "Size × Qty" or "Size x Qty"
    const variantMatch = line.match(/^(.+?)\s*[×x]\s*(\d+)$/i);
    if (variantMatch && currentItem) {
      currentItem.variant = variantMatch[1].trim();
      currentItem.quantity = parseInt(variantMatch[2], 10);
      continue;
    }

    // Match price: "₹123" or "₹1,234"
    const priceMatch = line.match(/^₹[\d,.]+$/);
    if (priceMatch && currentItem) {
      currentItem.price = line;
      continue;
    }

    // Match total: "TOTAL: ₹XXX"
    const totalMatch = line.match(/^TOTAL:\s*(₹[\d,.]+)$/i);
    if (totalMatch) {
      // Save last item
      if (currentItem?.name) {
        items.push(finalizeItem(currentItem));
        currentItem = null;
      }
      total = totalMatch[1];
      continue;
    }

    // Match add-ons section
    if (line.toLowerCase() === 'add-ons:' && currentItem) {
      continue; // Next lines are addon names
    }

    // Match note section
    if (line.toLowerCase() === 'note:' && currentItem) {
      continue; // Next line is the note text
    }

    // If inside an item and line starts with spaces (indented content)
    if (currentItem && line.length > 0 && !line.startsWith('Hi ') && !line.startsWith("I'd")) {
      // Could be addon name or note text — heuristic: if we've seen a price, it's likely addon/note
      if (currentItem.price) {
        // Check if it looks like an addon (no ₹ prefix, short text)
        if (line.length < 60 && !line.startsWith('₹')) {
          currentItem.addons = currentItem.addons ?? [];
          currentItem.addons.push(line);
        }
      }
    }
  }

  // Save last item
  if (currentItem?.name) {
    items.push(finalizeItem(currentItem));
  }

  return { isOrder: true, items, total, rawText: text };
}

function finalizeItem(partial: Partial<OrderItem>): OrderItem {
  return {
    name: partial.name ?? 'Unknown',
    variant: partial.variant ?? '',
    quantity: partial.quantity ?? 1,
    price: partial.price ?? '',
    addons: partial.addons ?? [],
    note: partial.note ?? '',
  };
}

/**
 * Format a parsed order into a human-readable summary.
 */
export function formatOrderSummary(order: ParsedOrder): string {
  if (!order.isOrder || order.items.length === 0) return '';

  const lines: string[] = ['📋 Order Summary:', ''];

  order.items.forEach((item, i) => {
    lines.push(`${i + 1}. ${item.name}`);
    if (item.variant) {
      lines.push(`   ${item.variant} × ${item.quantity}`);
    }
    if (item.price) {
      lines.push(`   ${item.price}`);
    }
    if (item.addons.length > 0) {
      lines.push(`   + ${item.addons.join(', ')}`);
    }
    lines.push('');
  });

  if (order.total) {
    lines.push(`💰 TOTAL: ${order.total}`);
  }

  return lines.join('\n');
}
