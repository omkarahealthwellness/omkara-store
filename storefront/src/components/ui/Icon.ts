// ============================================================
// OMKARA Storefront — Icon Utility
// ============================================================
// Renders SVG icons from the centralized sprite sheet.
// Usage: renderIcon('icon-cart', 20, 'my-class')
// ============================================================

/**
 * Render an SVG icon from the sprite sheet.
 * @param name - Icon ID from /assets/icons.svg (e.g., 'icon-cart')
 * @param size - Width and height in px (default 24)
 * @param className - Additional CSS classes
 */
export function renderIcon(name: string, size: number = 24, className: string = ''): string {
  return `<svg class="icon ${className}" width="${size}" height="${size}" aria-hidden="true"><use href="/assets/icons.svg#${name}"></use></svg>`;
}
