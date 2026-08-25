// ============================================================
// OMKARA Admin — Product List View
// ============================================================

import type { Product, ProductVariant } from 'shared/types/product';
import type { Category } from 'shared/types/category';
import { formatPrice } from 'shared/constants/defaults';

export function renderProductListView(products: Product[], categories: Category[]): string {
  return `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
        <div>
          <h2 class="heading-2" style="color: var(--color-brand-primary);">Product Management</h2>
          <p class="body-sm" style="color: var(--color-text-secondary); margin-top: 2px;">Create, edit, and organize all nourish food items and variants.</p>
        </div>
        <button type="button" class="btn btn-primary" id="btn-add-product">
          + Add New Product
        </button>
      </div>

      <!-- Filters Bar -->
      <div class="admin-card" style="padding: var(--space-4); margin-bottom: var(--space-6); display: flex; gap: var(--space-4); align-items: center; flex-wrap: wrap;">
        <div style="flex: 2; min-width: 200px;">
          <input
            type="text"
            id="prod-search-input"
            class="form-input"
            placeholder="Search products by name or tag..."
          />
        </div>

        <div style="flex: 1; min-width: 160px;">
          <select id="prod-category-filter" class="form-select">
            <option value="">All Categories</option>
            ${categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join('')}
          </select>
        </div>

        <div style="flex: 1; min-width: 140px;">
          <select id="prod-status-filter" class="form-select">
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <!-- Products Table Container -->
      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 50px;">Img</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Starting Price</th>
              <th>Variants</th>
              <th>Availability</th>
              <th>Status</th>
              <th style="text-align: right; width: 140px;">Actions</th>
            </tr>
          </thead>
          <tbody id="prod-table-tbody">
            ${renderProductRows(products, categories)}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function renderProductRows(products: Product[], categories: Category[]): string {
  if (products.length === 0) {
    return `
      <tr>
        <td colspan="8" style="text-align: center; padding: var(--space-8); color: var(--color-text-tertiary);">
          No products match your filter. Click "+ Add New Product" to create one.
        </td>
      </tr>
    `;
  }

  return products
    .map((p) => {
      const defaultVar = p.variants.find((v: ProductVariant) => v.isDefault) || p.variants[0];
      const startPrice = defaultVar ? defaultVar.price : 0;
      const cat = categories.find((c) => c.id === p.categoryId);
      const imgHtml = p.imageUrl
        ? `<img src="${p.imageUrl}" alt="${p.name}" style="width: 36px; height: 36px; object-fit: cover; border-radius: var(--radius-sm);" onerror="this.style.display='none';" />`
        : `<span style="font-size: 1.25rem;">🌿</span>`;

      return `
        <tr data-prod-id="${p.id}">
          <td>${imgHtml}</td>
          <td>
            <div style="font-weight: var(--weight-bold); color: var(--color-brand-primary);">${p.name}</div>
            <div class="caption" style="color: var(--color-text-secondary);">${p.tags?.join(', ') || ''}</div>
          </td>
          <td><span class="badge" style="background-color: var(--color-surface-secondary); color: var(--color-brand-primary);">${cat?.name || p.categoryId}</span></td>
          <td style="font-weight: var(--weight-semibold); color: var(--color-brand-accent);">${formatPrice(startPrice)}</td>
          <td><span class="body-sm">${p.variants.length} size${p.variants.length > 1 ? 's' : ''}</span></td>
          <td>
            <span class="badge" style="background-color: var(--color-surface-secondary); color: var(--color-brand-primary);">${p.availability}</span>
          </td>
          <td><span class="badge badge-${p.status}">${p.status}</span></td>
          <td style="text-align: right;">
            <button type="button" class="btn btn-secondary btn-sm" data-edit-prod-id="${p.id}">Edit</button>
            <button type="button" class="btn btn-danger btn-sm" data-delete-prod-id="${p.id}">Delete</button>
          </td>
        </tr>
      `;
    })
    .join('');
}

export function setupProductListView(
  allProducts: Product[],
  categories: Category[],
  onAdd: () => void,
  onEdit: (product: Product) => void,
  onDelete: (productId: string) => void
): void {
  const addBtn = document.getElementById('btn-add-product');
  addBtn?.addEventListener('click', onAdd);

  const searchInput = document.getElementById('prod-search-input') as HTMLInputElement | null;
  const catFilter = document.getElementById('prod-category-filter') as HTMLSelectElement | null;
  const statusFilter = document.getElementById('prod-status-filter') as HTMLSelectElement | null;
  const tbody = document.getElementById('prod-table-tbody');

  const filterAndRender = () => {
    const q = searchInput?.value.toLowerCase().trim() || '';
    const selectedCat = catFilter?.value || '';
    const selectedStatus = statusFilter?.value || '';

    const filtered = allProducts.filter((p) => {
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q));

      const matchCat = !selectedCat || p.categoryId === selectedCat;
      const matchStatus = !selectedStatus || p.status === selectedStatus;

      return matchQuery && matchCat && matchStatus;
    });

    if (tbody) {
      tbody.innerHTML = renderProductRows(filtered, categories);
      attachRowEvents();
    }
  };

  const attachRowEvents = () => {
    const editBtns = document.querySelectorAll<HTMLButtonElement>('[data-edit-prod-id]');
    editBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.editProdId;
        const matched = allProducts.find((p) => p.id === id);
        if (matched) onEdit(matched);
      });
    });

    const deleteBtns = document.querySelectorAll<HTMLButtonElement>('[data-delete-prod-id]');
    deleteBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.deleteProdId;
        if (id && confirm('Are you sure you want to delete this product?')) {
          onDelete(id);
        }
      });
    });
  };

  searchInput?.addEventListener('input', filterAndRender);
  catFilter?.addEventListener('change', filterAndRender);
  statusFilter?.addEventListener('change', filterAndRender);

  attachRowEvents();
}
