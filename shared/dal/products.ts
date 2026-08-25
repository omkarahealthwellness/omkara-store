// ============================================================
// OMKARA — Products Data Access Layer
// ============================================================
// CRUD + reorder + batch operations for products.
// Used by: Admin panel (full CRUD), Storefront (read only)
// ============================================================

import {
  getDocs,
  getDoc,
  updateDoc,
  query,
  orderBy,
  where,
  writeBatch,
  increment,
} from 'firebase/firestore';
import type { QuerySnapshot, DocumentData } from 'firebase/firestore';
import { productsCollection, productDoc, categoryDoc } from '../firebase/collections';
import { getDb } from '../firebase/config';
import type { Product } from '../types/product';


// ── Read ──────────────────────────────────────────────────────

/**
 * Fetch ALL products ordered by sortOrder.
 * This is ONE Firestore read. Client-side code groups by categoryId.
 * Used by storefront (entire menu load) and admin (product list).
 */
export async function getAllProducts(): Promise<Product[]> {
  const q = query(productsCollection(), orderBy('sortOrder', 'asc'));
  const snapshot: QuerySnapshot<DocumentData> = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
}

/**
 * Fetch products belonging to a specific category.
 * Used by admin when viewing a single category's products.
 * Costs 1 Firestore read (query with where clause).
 */
export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const q = query(
    productsCollection(),
    where('categoryId', '==', categoryId),
    orderBy('sortOrder', 'asc'),
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
}

/**
 * Fetch a single product by ID.
 */
export async function getProductById(productId: string): Promise<Product | null> {
  const snap = await getDoc(productDoc(productId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Product;
}

// ── Write ─────────────────────────────────────────────────────

/**
 * Create a new product and increment the parent category's productCount.
 */
export async function createProduct(
  productId: string,
  data: Omit<Product, 'id'>,
): Promise<void> {
  const db = getDb();
  const batch = writeBatch(db);
  const now = new Date().toISOString();

  // Create the product
  batch.set(productDoc(productId), {
    ...data,
    createdAt: now,
    updatedAt: now,
  });

  // Increment category product count
  batch.update(categoryDoc(data.categoryId), {
    productCount: increment(1),
    updatedAt: now,
  });

  await batch.commit();
}

/**
 * Update an existing product (partial update).
 * If categoryId changes, update both old and new category counts.
 */
export async function updateProduct(
  productId: string,
  data: Partial<Omit<Product, 'id'>>,
  previousCategoryId?: string,
): Promise<void> {
  const db = getDb();
  const now = new Date().toISOString();

  // If category changed, update counts on both categories
  if (data.categoryId && previousCategoryId && data.categoryId !== previousCategoryId) {
    const batch = writeBatch(db);

    batch.update(productDoc(productId), {
      ...data,
      updatedAt: now,
    });

    // Decrement old category count
    batch.update(categoryDoc(previousCategoryId), {
      productCount: increment(-1),
      updatedAt: now,
    });

    // Increment new category count
    batch.update(categoryDoc(data.categoryId), {
      productCount: increment(1),
      updatedAt: now,
    });

    await batch.commit();
  } else {
    // Simple update, no category change
    await updateDoc(productDoc(productId), {
      ...data,
      updatedAt: now,
    });
  }
}

/**
 * Delete a product and decrement the parent category's productCount.
 */
export async function deleteProduct(
  productId: string,
  categoryId: string,
): Promise<void> {
  const db = getDb();
  const batch = writeBatch(db);
  const now = new Date().toISOString();

  batch.delete(productDoc(productId));
  batch.update(categoryDoc(categoryId), {
    productCount: increment(-1),
    updatedAt: now,
  });

  await batch.commit();
}

// ── Reorder ───────────────────────────────────────────────────

/**
 * Batch update sortOrder for products within a category.
 * Used by admin drag-and-drop reordering.
 */
export async function reorderProducts(orderedIds: string[]): Promise<void> {
  const db = getDb();
  const batch = writeBatch(db);
  const now = new Date().toISOString();

  orderedIds.forEach((id, index) => {
    batch.update(productDoc(id), {
      sortOrder: index,
      updatedAt: now,
    });
  });

  await batch.commit();
}

// ── Duplicate ─────────────────────────────────────────────────

/**
 * Duplicate a product (creates a copy with "(Copy)" appended to name).
 * Useful for admin creating similar products quickly.
 */
export async function duplicateProduct(
  sourceProductId: string,
  newProductId: string,
): Promise<void> {
  const source = await getProductById(sourceProductId);
  if (!source) throw new Error(`Product ${sourceProductId} not found`);

  const { id: _id, ...sourceData } = source;
  await createProduct(newProductId, {
    ...sourceData,
    name: `${source.name} (Copy)`,
    status: 'draft' as const,
    sortOrder: source.sortOrder + 0.5, // Place right after original
  });
}
