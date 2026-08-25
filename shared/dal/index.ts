// DAL barrel export
export {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from './categories';

export {
  getAllProducts,
  getProductsByCategory,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  reorderProducts,
  duplicateProduct,
} from './products';

export {
  getSiteConfig,
  updateSiteConfig,
  initializeSiteConfig,
} from './config';

export {
  getAllContentPages,
  getContentPageById,
  createContentPage,
  updateContentPage,
  deleteContentPage,
} from './content';

export {
  adminLogin,
  adminLogout,
  getCurrentAdmin,
  onAdminAuthChange,
} from './auth';

export {
  loadStorefrontMenu,
} from './menu';

export type {
  MenuCategory,
  StorefrontMenu,
} from './menu';
