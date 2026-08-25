// ============================================================
// OMKARA Admin — Category List View
// ============================================================

import type { Category } from 'shared/types/category';

export function renderCategoryListView(categories: Category[]): string {
  const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);

  return `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
        <div>
          <h2 class="heading-2" style="color: var(--color-brand-primary);">Category Management</h2>
          <p class="body-sm" style="color: var(--color-text-secondary); margin-top: 2px;">Define food collections and their visual brand hierarchy.</p>
        </div>
        <button type="button" class="btn btn-primary" id="btn-add-category">
          + Add New Category
        </button>
      </div>

      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 60px;">Order</th>
              <th style="width: 50px;">Color</th>
              <th>Category Name</th>
              <th>Description</th>
              <th>Products</th>
              <th>Status</th>
              <th style="text-align: right; width: 140px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${sorted.length === 0 ? `
              <tr>
                <td colspan="7" style="text-align: center; padding: var(--space-8); color: var(--color-text-tertiary);">
                  No categories found. Click "+ Add New Category" to create your first food category.
                </td>
              </tr>
            ` : sorted.map((cat) => `
              <tr data-category-id="${cat.id}">
                <td style="font-weight: var(--weight-semibold); color: var(--color-text-secondary);">${cat.sortOrder}</td>
                <td>
                  <span style="display: inline-block; width: 22px; height: 22px; border-radius: var(--radius-full); background-color: ${cat.color}; border: 1px solid var(--color-border-subtle);"></span>
                </td>
                <td style="font-weight: var(--weight-bold); color: var(--color-brand-primary);">${cat.name}</td>
                <td style="color: var(--color-text-secondary); max-width: 320px; font-size: var(--text-xs);">${cat.description || '—'}</td>
                <td><span class="badge" style="background-color: var(--color-surface-secondary); color: var(--color-brand-primary);">${cat.productCount ?? 0}</span></td>
                <td><span class="badge badge-${cat.status}">${cat.status}</span></td>
                <td style="text-align: right;">
                  <button type="button" class="btn btn-secondary btn-sm" data-edit-category-id="${cat.id}">Edit</button>
                  <button type="button" class="btn btn-danger btn-sm" data-delete-category-id="${cat.id}">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function setupCategoryListView(
  categories: Category[],
  onAdd: () => void,
  onEdit: (cat: Category) => void,
  onDelete: (catId: string) => void
): void {
  const addBtn = document.getElementById('btn-add-category');
  addBtn?.addEventListener('click', onAdd);

  const editBtns = document.querySelectorAll<HTMLButtonElement>('[data-edit-category-id]');
  editBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.editCategoryId;
      const matched = categories.find((c) => c.id === id);
      if (matched) onEdit(matched);
    });
  });

  const deleteBtns = document.querySelectorAll<HTMLButtonElement>('[data-delete-category-id]');
  deleteBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.deleteCategoryId;
      if (id && confirm('Are you sure you want to delete this category? Products in this category will become unassigned.')) {
        onDelete(id);
      }
    });
  });
}
