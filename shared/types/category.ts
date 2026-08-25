// ============================================================
// Category
// ============================================================

import type { AvailabilityState } from './availability';

export interface Category {
  /** Firestore document ID */
  id: string;

  /** Display name (e.g., "Sprouts", "Smoothies") */
  name: string;

  /** Optional description shown below category heading */
  description: string;

  /** Display order (lower = first). Admin-controlled. */
  sortOrder: number;

  /** Brand color for this category (hex string, e.g., "#4A7C59") */
  color: string;

  /** Optional secondary/accent color */
  accentColor: string;

  /** CDN URL for category header image */
  imageUrl: string;

  /** CDN URL for category icon (nav bar) */
  iconUrl: string;

  /** Publication status */
  status: 'published' | 'draft' | 'archived';

  /** Category-level availability state */
  availability: AvailabilityState;

  /** Number of products in this category (denormalized for dashboard) */
  productCount: number;

  /** Firestore timestamps */
  createdAt: string;
  updatedAt: string;
}
