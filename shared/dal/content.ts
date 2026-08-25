// ============================================================
// OMKARA — Content Pages Data Access Layer
// ============================================================
// CRUD operations for static content pages (About, Philosophy, etc.)
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
} from 'firebase/firestore';
import type { QuerySnapshot, DocumentData } from 'firebase/firestore';
import { contentCollection, contentDoc } from '../firebase/collections';
import type { ContentPage } from '../types/content';

// ── Read ──────────────────────────────────────────────────────

/**
 * Fetch all content pages ordered by sortOrder.
 * ONE Firestore read.
 */
export async function getAllContentPages(): Promise<ContentPage[]> {
  const q = query(contentCollection(), orderBy('sortOrder', 'asc'));
  const snapshot: QuerySnapshot<DocumentData> = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ContentPage[];
}

/**
 * Fetch a single content page by its slug/ID.
 */
export async function getContentPageById(pageId: string): Promise<ContentPage | null> {
  const snap = await getDoc(contentDoc(pageId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as ContentPage;
}

// ── Write ─────────────────────────────────────────────────────

/**
 * Create a new content page.
 */
export async function createContentPage(
  pageId: string,
  data: Omit<ContentPage, 'id'>,
): Promise<void> {
  const now = new Date().toISOString();
  await setDoc(contentDoc(pageId), {
    ...data,
    createdAt: now,
    updatedAt: now,
  });
}

/**
 * Update an existing content page (partial update).
 */
export async function updateContentPage(
  pageId: string,
  data: Partial<Omit<ContentPage, 'id'>>,
): Promise<void> {
  await updateDoc(contentDoc(pageId), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Delete a content page.
 */
export async function deleteContentPage(pageId: string): Promise<void> {
  await deleteDoc(contentDoc(pageId));
}
