// ============================================================
// Content Pages (About, Philosophy, Bikaner, Help, Partner)
// ============================================================

export interface ContentPage {
  /** Firestore document ID (e.g., "about", "philosophy", "bikaner", "help", "partner") */
  id: string;

  /** Page title */
  title: string;

  /** Page subtitle */
  subtitle: string;

  /** URL-friendly slug */
  slug: string;

  /** Rich-text or structured body content (HTML string for flexibility) */
  body: string;

  /** Short excerpt/summary */
  excerpt: string;

  /** Optional hero/banner image for this page */
  imageUrl: string;

  /** SEO meta title */
  seoTitle: string;

  /** SEO meta description */
  seoDescription: string;

  /** Display order in navigation */
  sortOrder: number;

  /** Publication status */
  status: 'published' | 'draft' | 'archived';

  /** Created timestamp */
  createdAt: string;

  /** Last updated timestamp */
  updatedAt: string;
}
