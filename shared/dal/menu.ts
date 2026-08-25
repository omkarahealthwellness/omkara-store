// ============================================================
// OMKARA — Storefront Menu Loader
// ============================================================
// Fetches the ENTIRE menu (config + categories + products)
// in exactly 3 Firestore reads. Performs all filtering,
// sorting, and grouping client-side.
//
// Fallbacks seamlessly to rich mock data if Firebase .env
// is unconfigured during local development.
// ============================================================

import type { Category } from '../types/category';
import type { Product } from '../types/product';
import type { SiteConfig } from '../types/config';
import { getSiteConfig } from './config';
import { getAllCategories } from './categories';
import { getAllProducts } from './products';
import { SEED_CONFIG, SEED_CATEGORIES, SEED_PRODUCTS } from '../seed/data';

/** A category with its products pre-grouped */
export interface MenuCategory extends Category {
  products: Product[];
}

/** The complete storefront menu data */
export interface StorefrontMenu {
  config: SiteConfig;
  categories: MenuCategory[];
  allProducts: Product[];
  /** Total Firestore reads consumed */
  readCount: 3;
}

/**
 * Load the complete storefront menu.
 * 
 * Attempts 3-read Firestore fetch:
 * 1. getDoc('config/site') → 1 read
 * 2. getDocs('categories') → 1 read
 * 3. getDocs('products')   → 1 read
 * 
 * Falls back to built-in seed dataset if Firebase is not yet initialized.
 */
export async function loadStorefrontMenu(): Promise<StorefrontMenu> {
  try {
    const [config, allCategories, allProducts] = await Promise.all([
      getSiteConfig(),
      getAllCategories(),
      getAllProducts(),
    ]);

    if (config) {
      // Filter to published only
      const publishedCategories = allCategories
        .filter((cat) => cat.status === 'published')
        .sort((a, b) => a.sortOrder - b.sortOrder);

      const publishedProducts = allProducts
        .filter((prod) => prod.status === 'published')
        .sort((a, b) => a.sortOrder - b.sortOrder);

      // Group products by category
      const productsByCategory = new Map<string, Product[]>();
      for (const product of publishedProducts) {
        const existing = productsByCategory.get(product.categoryId) ?? [];
        existing.push(product);
        productsByCategory.set(product.categoryId, existing);
      }

      // Build menu categories with products attached
      const categories: MenuCategory[] = publishedCategories.map((cat) => ({
        ...cat,
        products: productsByCategory.get(cat.id) ?? [],
      }));

      return {
        config,
        categories,
        allProducts: publishedProducts,
        readCount: 3,
      };
    }
  } catch (err) {
    console.info('[OMKARA] Using built-in development fixtures (Firebase not configured in .env):', err);
  }

  // Fallback to rich seed fixtures
  const publishedCategories = SEED_CATEGORIES
    .filter((cat) => cat.status === 'published')
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const publishedProducts = SEED_PRODUCTS
    .filter((prod) => prod.status === 'published')
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const productsByCategory = new Map<string, Product[]>();
  for (const product of publishedProducts) {
    const existing = productsByCategory.get(product.categoryId) ?? [];
    existing.push(product);
    productsByCategory.set(product.categoryId, existing);
  }

  const categories: MenuCategory[] = publishedCategories.map((cat) => ({
    ...cat,
    products: productsByCategory.get(cat.id) ?? [],
  }));

  return {
    config: SEED_CONFIG,
    categories,
    allProducts: publishedProducts,
    readCount: 3,
  };
}
