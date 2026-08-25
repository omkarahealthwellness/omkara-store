// ============================================================
// Product, Variant, Add-on
// ============================================================

import type { AvailabilityState } from './availability';

/** Selection type for add-on groups */
export type AddonSelectionType = 'single' | 'multiple';

/** A serving size / variant (e.g., Small, Medium, Large, 250ml) */
export interface ProductVariant {
  /** Unique ID within this product */
  id: string;

  /** Display label (e.g., "Medium", "500ml", "Family") */
  label: string;

  /** Price in INR (paise avoided — whole rupees for simplicity) */
  price: number;

  /** Optional description (e.g., "Serves 1-2") */
  description: string;

  /** Whether this is the default selection */
  isDefault: boolean;

  /** Variant-level availability */
  availability: AvailabilityState;

  /** Display order */
  sortOrder: number;
}

/** A product add-on (e.g., Extra Seeds, Protein Boost) */
export interface ProductAddon {
  /** Unique ID within this product */
  id: string;

  /** Display name */
  name: string;

  /** Additional price in INR */
  price: number;

  /** Optional description */
  description: string;

  /** Whether this add-on is currently available */
  availability: AvailabilityState;

  /** Single-select (radio) or multi-select (checkbox) */
  selectionType: AddonSelectionType;

  /** Whether the customer must select this add-on */
  required: boolean;

  /** Display order */
  sortOrder: number;
}

/** Configuration for customer notes on a product */
export interface ProductNotesConfig {
  /** Whether notes are enabled for this product */
  enabled: boolean;

  /** Placeholder text (e.g., "Any special instructions?") */
  placeholder: string;

  /** Maximum character length */
  maxLength: number;
}

/** The core Product type */
export interface Product {
  /** Firestore document ID */
  id: string;

  /** Product display name */
  name: string;

  /** Category ID this product belongs to */
  categoryId: string;

  /** Full description (supports markdown) */
  description: string;

  /** Short one-liner for product cards */
  shortDescription: string;

  /** Ingredient list */
  ingredients: string[];

  /** CDN URL for primary product image */
  imageUrl: string;

  /** Additional gallery images */
  additionalImages: string[];

  /** Searchable tags (e.g., "bestseller", "vegetarian", "spicy") */
  tags: string[];

  /** Serving sizes / variants. At least one required. */
  variants: ProductVariant[];

  /** Optional add-ons */
  addons: ProductAddon[];

  /** Customer note configuration */
  notesConfig: ProductNotesConfig;

  /** Product availability state */
  availability: AvailabilityState;

  /** Admin-controlled display order within category */
  sortOrder: number;

  /** Show in featured section */
  isFeatured: boolean;

  /** Show "New" badge */
  isNew: boolean;

  /** Publication status */
  status: 'published' | 'draft' | 'archived';

  /** Firestore timestamps */
  createdAt: string;
  updatedAt: string;
}
