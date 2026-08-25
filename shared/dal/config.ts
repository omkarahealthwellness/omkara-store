// ============================================================
// OMKARA — Site Config Data Access Layer
// ============================================================
// Read/write operations for the single site config document.
// Used by: Admin panel (write), Storefront (read)
// ============================================================

import { getDoc, setDoc } from 'firebase/firestore';
import { siteConfigDoc } from '../firebase/collections';
import type { SiteConfig } from '../types/config';

/**
 * Fetch the site configuration.
 * ONE Firestore read — returns the entire config document.
 */
export async function getSiteConfig(): Promise<SiteConfig | null> {
  const snap = await getDoc(siteConfigDoc());
  if (!snap.exists()) return null;
  return snap.data() as SiteConfig;
}

/**
 * Update the site configuration (full overwrite with merge).
 * Used by admin panel settings page.
 */
export async function updateSiteConfig(
  data: Partial<SiteConfig>,
): Promise<void> {
  await setDoc(siteConfigDoc(), {
    ...data,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

/**
 * Initialize site config with defaults if it doesn't exist.
 * Called once during setup or seeding.
 */
export async function initializeSiteConfig(
  config: SiteConfig,
): Promise<void> {
  const existing = await getSiteConfig();
  if (existing) return; // Don't overwrite existing config

  const now = new Date().toISOString();
  await setDoc(siteConfigDoc(), {
    ...config,
    createdAt: now,
    updatedAt: now,
  });
}
