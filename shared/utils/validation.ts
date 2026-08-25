// ============================================================
// Validation Utilities
// ============================================================

/** Validate a price is a positive number */
export function isValidPrice(price: number): boolean {
  return typeof price === 'number' && isFinite(price) && price >= 0;
}

/** Validate a product name is non-empty */
export function isValidName(name: string): boolean {
  return typeof name === 'string' && name.trim().length > 0;
}

/** Validate an image URL format */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/** Validate a phone number (digits only, 10-15 chars) */
export function isValidPhone(phone: string): boolean {
  return /^\d{10,15}$/.test(phone);
}

/** Validate an email address */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Validate a hex color string */
export function isValidHexColor(color: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color);
}

/** Generate a simple unique ID (for client-side cart items, etc.) */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

/** Slugify a string for filenames/URLs */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 64);
}
