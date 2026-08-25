// ============================================================
// Default Values
// ============================================================

/** Default product image dimensions for CDN panel processing */
export const IMAGE_DEFAULTS = {
  width: 512,
  height: 512,
  format: 'webp' as const,
  quality: 0.85,
} as const;

/** Default notes configuration */
export const NOTES_DEFAULTS = {
  enabled: true,
  placeholder: 'Any special instructions?',
  maxLength: 200,
} as const;

/** Mobile grid defaults */
export const GRID_DEFAULTS = {
  mobileColumns: 2,
  mobileInitialRows: 2,
  desktopInitialRows: 2,
  minCardWidth: 160,
} as const;

/** Currency formatting */
export const CURRENCY = {
  symbol: '₹',
  code: 'INR',
  locale: 'en-IN',
} as const;

/** Format a price in INR */
export function formatPrice(amount: number): string {
  return `${CURRENCY.symbol}${amount.toLocaleString(CURRENCY.locale)}`;
}
