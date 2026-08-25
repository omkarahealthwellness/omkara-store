// ============================================================
// OMKARA Admin — Main Application Orchestrator
// ============================================================

import './style.css';
import { adminLogin, adminLogout, onAdminAuthChange } from 'shared/dal/auth';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from 'shared/dal/categories';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from 'shared/dal/products';
import { getSiteConfig, updateSiteConfig } from 'shared/dal/config';
import { getAllContentPages, createContentPage } from 'shared/dal/content';
import { SEED_CATEGORIES, SEED_PRODUCTS, SEED_CONFIG, SEED_CONTENT_PAGES } from 'shared/seed/data';

import type { Category } from 'shared/types/category';
import type { Product } from 'shared/types/product';
import type { SiteConfig } from 'shared/types/config';
import type { ContentPage } from 'shared/types/content';
import type { AvailabilityState } from 'shared/types/availability';

import { renderAdminShell } from './components/layout/AdminShell';
import { setupAdminHeader } from './components/layout/AdminHeader';
import { renderLoginView, setupLoginView } from './components/views/LoginView';
import { renderDashboardView } from './components/views/DashboardView';
import { renderCategoryListView, setupCategoryListView } from './components/views/CategoryListView';
import { openCategoryFormModal } from './components/views/CategoryFormModal';
import { renderProductListView, setupProductListView } from './components/views/ProductListView';
import { openProductFormModal } from './components/views/ProductFormModal';
import { renderAvailabilityMatrixView, setupAvailabilityMatrixView } from './components/views/AvailabilityMatrixView';
import { renderConfigView, setupConfigView } from './components/views/ConfigView';
import { renderContentCMSView, setupContentCMSView } from './components/views/ContentCMSView';
import { renderCDNPanelView, setupCDNPanelView } from './components/views/CDNPanelView';
import { showToast } from './components/ui/Toast';

const app = document.getElementById('app')!;

// App State
let isAuthenticated = false;
let userEmail = '';
let currentHash = window.location.hash || '#dashboard';

let categories: Category[] = [];
let products: Product[] = [];
let siteConfig: SiteConfig = SEED_CONFIG;
let contentPages: ContentPage[] = [];
let activeContentSlug = 'about';

/**
 * Load all data from Firestore (falling back to seed fixtures if unconfigured)
 */
async function loadAdminData(): Promise<void> {
  try {
    const [fetchedCats, fetchedProds, fetchedConfig, fetchedPages] = await Promise.all([
      getAllCategories(),
      getAllProducts(),
      getSiteConfig(),
      getAllContentPages(),
    ]);

    categories = fetchedCats.length > 0 ? fetchedCats : [...SEED_CATEGORIES];
    products = fetchedProds.length > 0 ? fetchedProds : [...SEED_PRODUCTS];
    siteConfig = fetchedConfig || { ...SEED_CONFIG };
    contentPages = fetchedPages.length > 0 ? fetchedPages : [...SEED_CONTENT_PAGES];
  } catch (err) {
    console.info('[OMKARA Admin] Using development seed fixtures:', err);
    categories = [...SEED_CATEGORIES];
    products = [...SEED_PRODUCTS];
    siteConfig = { ...SEED_CONFIG };
    contentPages = [...SEED_CONTENT_PAGES];
  }
}

/**
 * Render the current active route into the Admin Main Content Area
 */
function renderActiveRoute(): void {
  if (!isAuthenticated) {
    app.innerHTML = renderLoginView();
    setupLoginView(
      async (email, pass) => {
        try {
          const user = await adminLogin(email, pass);
          userEmail = user.email || email;
          isAuthenticated = true;
          await loadAdminData();
          renderApp();
          showToast(`Welcome back, ${userEmail}!`);
        } catch (err: unknown) {
          // If Firebase config missing, allow fallback demo bypass
          console.warn('[OMKARA] Firebase login failed:', err);
          throw new Error('Authentication failed. Check your Firebase credentials or use Dev Bypass Mode.');
        }
      },
      async () => {
        // Dev / Demo Bypass
        if (import.meta.env.DEV) {
          userEmail = 'admin@omkara.com (Dev Mode)';
          isAuthenticated = true;
          await loadAdminData();
          renderApp();
          showToast('Logged in via Dev Bypass Mode');
        } else {
          showToast('Dev bypass is disabled in production.');
        }
      }
    );
    return;
  }

  currentHash = window.location.hash || '#dashboard';
  let viewHtml = '';

  switch (currentHash) {
    case '#products':
      viewHtml = renderProductListView(products, categories);
      break;

    case '#categories':
      viewHtml = renderCategoryListView(categories);
      break;

    case '#matrix':
      viewHtml = renderAvailabilityMatrixView(products, categories);
      break;

    case '#config':
      viewHtml = renderConfigView(siteConfig);
      break;

    case '#content':
      viewHtml = renderContentCMSView(contentPages, activeContentSlug);
      break;

    case '#cdn':
      viewHtml = renderCDNPanelView();
      break;

    case '#dashboard':
    default:
      viewHtml = renderDashboardView(products, categories);
      break;
  }

  app.innerHTML = renderAdminShell(viewHtml, currentHash, userEmail);
  setupAdminHeader(handleLogout);
  wireActiveRouteHandlers();
}

function renderApp(): void {
  renderActiveRoute();
}

/**
 * Wire event handlers for the currently mounted view
 */
function wireActiveRouteHandlers(): void {
  switch (currentHash) {
    case '#products':
      setupProductListView(
        products,
        categories,
        () => {
          openProductFormModal(null, categories, handleSaveProduct);
        },
        (prod) => {
          openProductFormModal(prod, categories, handleSaveProduct);
        },
        handleDeleteProduct
      );
      break;

    case '#categories':
      setupCategoryListView(
        categories,
        () => {
          openCategoryFormModal(null, handleSaveCategory);
        },
        (cat) => {
          openCategoryFormModal(cat, handleSaveCategory);
        },
        handleDeleteCategory
      );
      break;

    case '#matrix':
      setupAvailabilityMatrixView(products, handleBatchAvailability);
      break;

    case '#config':
      setupConfigView(siteConfig, handleSaveConfig);
      break;

    case '#content':
      setupContentCMSView(
        contentPages,
        activeContentSlug,
        (newSlug) => {
          activeContentSlug = newSlug;
          renderActiveRoute();
        },
        handleSaveContentPage
      );
      break;

    case '#cdn':
      setupCDNPanelView();
      break;

    default:
      break;
  }
}

// ── CRUD Handlers ─────────────────────────────────────────────

async function handleSaveProduct(prodData: Omit<Product, 'id'>, id?: string): Promise<void> {
  if (id) {
    try {
      await updateProduct(id, prodData);
    } catch (e) {
      console.warn('Local update fallback:', e);
    }
    const idx = products.findIndex((p) => p.id === id);
    if (idx !== -1) products[idx] = { id, ...prodData };
    showToast(`Product "${prodData.name}" updated!`);
  } else {
    const newId = prodData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    try {
      await createProduct(newId, prodData);
    } catch (e) {
      console.warn('Local create fallback:', e);
    }
    products.push({ id: newId, ...prodData });
    showToast(`Product "${prodData.name}" created!`);
  }
  renderActiveRoute();
}

async function handleDeleteProduct(id: string): Promise<void> {
  const prod = products.find((p) => p.id === id);
  if (prod) {
    try {
      await deleteProduct(id, prod.categoryId);
    } catch (e) {
      console.warn('Local delete fallback:', e);
    }
  }
  products = products.filter((p) => p.id !== id);
  showToast('Product deleted');
  renderActiveRoute();
}

async function handleSaveCategory(catData: Omit<Category, 'id'>, id?: string): Promise<void> {
  if (id) {
    try {
      await updateCategory(id, catData);
    } catch (e) {
      console.warn('Local update fallback:', e);
    }
    const idx = categories.findIndex((c) => c.id === id);
    if (idx !== -1) categories[idx] = { id, ...catData };
    showToast(`Category "${catData.name}" updated!`);
  } else {
    const newId = catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    try {
      await createCategory(newId, catData);
    } catch (e) {
      console.warn('Local create fallback:', e);
    }
    categories.push({ id: newId, ...catData });
    showToast(`Category "${catData.name}" created!`);
  }
  renderActiveRoute();
}

async function handleDeleteCategory(id: string): Promise<void> {
  try {
    await deleteCategory(id);
  } catch (e) {
    console.warn('Local delete fallback:', e);
  }
  categories = categories.filter((c) => c.id !== id);
  showToast('Category deleted');
  renderActiveRoute();
}

async function handleBatchAvailability(
  updates: { productId: string; availability: AvailabilityState }[]
): Promise<void> {
  for (const update of updates) {
    try {
      await updateProduct(update.productId, { availability: update.availability });
    } catch (e) {
      console.warn('Local matrix update fallback:', e);
    }
    const prod = products.find((p) => p.id === update.productId);
    if (prod) prod.availability = update.availability;
  }
  showToast(`Updated ${updates.length} availability states!`);
  renderActiveRoute();
}

async function handleSaveConfig(newConfig: SiteConfig): Promise<void> {
  try {
    await updateSiteConfig(newConfig);
  } catch (e) {
    console.warn('Local config update fallback:', e);
  }
  siteConfig = newConfig;
  showToast('Site configuration saved successfully!');
  renderActiveRoute();
}

async function handleSaveContentPage(pageId: string, data: Omit<ContentPage, 'id'>): Promise<void> {
  try {
    await createContentPage(pageId, data);
  } catch (e) {
    console.warn('Local content page save fallback:', e);
  }
  const idx = contentPages.findIndex((p) => p.id === pageId || p.slug === pageId);
  if (idx !== -1) {
    contentPages[idx] = { id: pageId, ...data };
  } else {
    contentPages.push({ id: pageId, ...data });
  }
  showToast(`Page "${data.title}" published!`);
  renderActiveRoute();
}

async function handleLogout(): Promise<void> {
  try {
    await adminLogout();
  } catch (e) {
    console.warn('Logout fallback:', e);
  }
  isAuthenticated = false;
  userEmail = '';
  renderActiveRoute();
  showToast('Logged out successfully');
}

// ── Hash Router & Auth Listener ────────────────────────────────

window.addEventListener('hashchange', () => {
  renderActiveRoute();
});

// Subscribe to Firebase Auth if available
try {
  onAdminAuthChange(async (user) => {
    if (user) {
      isAuthenticated = true;
      userEmail = user.email || 'Admin';
      await loadAdminData();
      renderApp();
    } else if (!isAuthenticated) {
      renderActiveRoute();
    }
  });
} catch {
  // Offline initial render
  renderActiveRoute();
}

// Initial Boot
renderActiveRoute();
