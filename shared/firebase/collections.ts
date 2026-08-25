// ============================================================
// Firestore Collection References
// ============================================================
// Centralized collection name constants and typed references.
// Prevents typos and provides a single point of change.
// ============================================================

import { collection, doc } from 'firebase/firestore';
import type { CollectionReference, DocumentReference } from 'firebase/firestore';
import { getDb } from './config';

// ── Collection Names ─────────────────────────────────────────

export const COLLECTIONS = {
  CONFIG: 'config',
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  CONTENT: 'content',
} as const;

// ── Well-known Document IDs ──────────────────────────────────

export const CONFIG_DOC_ID = 'site';  // Single document for all site settings

// ── Typed Collection References ──────────────────────────────

/** Get a reference to the config collection */
export function configCollection(): CollectionReference {
  return collection(getDb(), COLLECTIONS.CONFIG);
}

/** Get a reference to the site config document */
export function siteConfigDoc(): DocumentReference {
  return doc(getDb(), COLLECTIONS.CONFIG, CONFIG_DOC_ID);
}

/** Get a reference to the categories collection */
export function categoriesCollection(): CollectionReference {
  return collection(getDb(), COLLECTIONS.CATEGORIES);
}

/** Get a reference to a specific category document */
export function categoryDoc(categoryId: string): DocumentReference {
  return doc(getDb(), COLLECTIONS.CATEGORIES, categoryId);
}

/** Get a reference to the products collection */
export function productsCollection(): CollectionReference {
  return collection(getDb(), COLLECTIONS.PRODUCTS);
}

/** Get a reference to a specific product document */
export function productDoc(productId: string): DocumentReference {
  return doc(getDb(), COLLECTIONS.PRODUCTS, productId);
}

/** Get a reference to the content collection */
export function contentCollection(): CollectionReference {
  return collection(getDb(), COLLECTIONS.CONTENT);
}

/** Get a reference to a specific content page document */
export function contentDoc(pageId: string): DocumentReference {
  return doc(getDb(), COLLECTIONS.CONTENT, pageId);
}
