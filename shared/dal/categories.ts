// ============================================================
// OMKARA — Categories Data Access Layer
// ============================================================
// CRUD + reorder operations for product categories.
// Used by: Admin panel (full CRUD), Storefront (read only)
// ============================================================

import {
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import type { QuerySnapshot, DocumentData } from 'firebase/firestore';
import { categoriesCollection, categoryDoc } from '../firebase/collections';
import { getDb } from '../firebase/config';
import type { Category } from '../types/category';

// ── Read ──────────────────────────────────────────────────────

/**
 * Fetch all categories ordered by sortOrder.
 * Used by both storefront (filters published client-side) and admin (sees all).
 * This is ONE Firestore read (getDocs on collection).
 */
export async function getAllCategories(): Promise<Category[]> {
  const q = query(categoriesCollection(), orderBy('sortOrder', 'asc'));
  const snapshot: QuerySnapshot<DocumentData> = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[];
}

/**
 * Fetch a single category by ID.
 */
export async function getCategoryById(categoryId: string): Promise<Category | null> {
  const snap = await getDoc(categoryDoc(categoryId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Category;
}

// ── Write ─────────────────────────────────────────────────────

/**
 * Create a new category. 
 * Auto-assigns sortOrder to end of list if not provided.
 */
export async function createCategory(
  categoryId: string,
  data: Omit<Category, 'id'>,
): Promise<void> {
  const now = new Date().toISOString();
  await setDoc(categoryDoc(categoryId), {
    ...data,
    productCount: data.productCount ?? 0,
    createdAt: now,
    updatedAt: now,
  });
}

/**
 * Update an existing category (partial update).
 */
export async function updateCategory(
  categoryId: string,
  data: Partial<Omit<Category, 'id'>>,
): Promise<void> {
  await updateDoc(categoryDoc(categoryId), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Delete a category.
 * WARNING: Caller must handle orphaned products (reassign or delete).
 */
export async function deleteCategory(categoryId: string): Promise<void> {
  await deleteDoc(categoryDoc(categoryId));
}

// ── Reorder ───────────────────────────────────────────────────

/**
 * Batch update sortOrder for multiple categories.
 * Used by admin drag-and-drop reordering.
 * 
 * @param orderedIds — Array of category IDs in desired display order
 */
export async function reorderCategories(orderedIds: string[]): Promise<void> {
  const db = getDb();
  const batch = writeBatch(db);
  const now = new Date().toISOString();

  orderedIds.forEach((id, index) => {
    batch.update(categoryDoc(id), {
      sortOrder: index,
      updatedAt: now,
    });
  });

  await batch.commit();
}
