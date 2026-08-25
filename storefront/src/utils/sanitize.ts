// ============================================================
// OMKARA Storefront — HTML Sanitization Utilities
// ============================================================
// Prevents XSS by escaping user-controlled strings before
// insertion into innerHTML template strings.
// ============================================================

/**
 * Escape HTML special characters to prevent XSS.
 * Use this on ANY user-controlled string before inserting into innerHTML.
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
