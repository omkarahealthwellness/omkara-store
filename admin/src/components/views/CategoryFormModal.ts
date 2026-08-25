// ============================================================
// OMKARA Admin — Category Form Modal
// ============================================================

import type { Category } from 'shared/types/category';
import { openAdminModal, closeAdminModal } from '../ui/AdminModal';

export function openCategoryFormModal(
  category: Partial<Category> | null,
  onSave: (catData: Omit<Category, 'id'>, id?: string) => Promise<void>
): void {
  const isEdit = !!category && !!category.id;
  const title = isEdit ? `Edit Category: ${category.name}` : 'Create New Category';

  const bodyHtml = `
    <form id="category-modal-form">
      <div class="form-group">
        <label class="form-label" for="cat-name">Category Name *</label>
        <input
          type="text"
          id="cat-name"
          class="form-input"
          value="${category?.name || ''}"
          placeholder="e.g. Cold-Pressed Juices"
          required
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="cat-desc">Description</label>
        <textarea
          id="cat-desc"
          class="form-textarea"
          rows="2"
          placeholder="Brief description for menu section header..."
        >${category?.description || ''}</textarea>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
        <div class="form-group">
          <label class="form-label" for="cat-color">Primary Color (Hex)</label>
          <input
            type="color"
            id="cat-color"
            class="form-input"
            style="height: 40px; padding: 2px;"
            value="${category?.color || '#4A7C59'}"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="cat-accent">Accent Color (Hex)</label>
          <input
            type="color"
            id="cat-accent"
            class="form-input"
            style="height: 40px; padding: 2px;"
            value="${category?.accentColor || '#8FBC8F'}"
          />
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
        <div class="form-group">
          <label class="form-label" for="cat-sort">Sort Order</label>
          <input
            type="number"
            id="cat-sort"
            class="form-input"
            value="${category?.sortOrder ?? 0}"
            min="0"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="cat-status">Publish Status</label>
          <select id="cat-status" class="form-select">
            <option value="published" ${category?.status === 'published' ? 'selected' : ''}>Published (Live)</option>
            <option value="draft" ${category?.status === 'draft' ? 'selected' : ''}>Draft (Hidden)</option>
            <option value="archived" ${category?.status === 'archived' ? 'selected' : ''}>Archived</option>
          </select>
        </div>
      </div>
    </form>
  `;

  const footHtml = `
    <button type="button" class="btn btn-secondary btn-sm" id="cat-modal-cancel">Cancel</button>
    <button type="button" class="btn btn-primary btn-sm" id="cat-modal-save">${isEdit ? 'Save Changes' : 'Create Category'}</button>
  `;

  openAdminModal(title, bodyHtml, {
    footHtml,
    onAfterRender: (container) => {
      const cancelBtn = container.querySelector('#cat-modal-cancel');
      const saveBtn = container.querySelector('#cat-modal-save') as HTMLButtonElement | null;

      cancelBtn?.addEventListener('click', () => closeAdminModal());

      saveBtn?.addEventListener('click', async () => {
        const nameInput = container.querySelector('#cat-name') as HTMLInputElement | null;
        const descInput = container.querySelector('#cat-desc') as HTMLTextAreaElement | null;
        const colorInput = container.querySelector('#cat-color') as HTMLInputElement | null;
        const accentInput = container.querySelector('#cat-accent') as HTMLInputElement | null;
        const sortInput = container.querySelector('#cat-sort') as HTMLInputElement | null;
        const statusSelect = container.querySelector('#cat-status') as HTMLSelectElement | null;

        if (!nameInput || !nameInput.value.trim()) {
          alert('Category name is required.');
          return;
        }

        const now = new Date().toISOString();
        const catData: Omit<Category, 'id'> = {
          name: nameInput.value.trim(),
          description: descInput?.value.trim() || '',
          color: colorInput?.value || '#4A7C59',
          accentColor: accentInput?.value || '#8FBC8F',
          imageUrl: category?.imageUrl || '',
          iconUrl: category?.iconUrl || '',
          sortOrder: parseInt(sortInput?.value || '0', 10),
          status: (statusSelect?.value as 'published' | 'draft' | 'archived') || 'published',
          availability: 'available',
          productCount: category?.productCount || 0,
          createdAt: category?.createdAt || now,
          updatedAt: now,
        };

        if (saveBtn) {
          saveBtn.disabled = true;
          saveBtn.textContent = 'Saving...';
        }

        try {
          await onSave(catData, category?.id);
          closeAdminModal();
        } catch (err: unknown) {
          alert(`Failed to save category: ${err instanceof Error ? err.message : String(err)}`);
          if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.textContent = isEdit ? 'Save Changes' : 'Create Category';
          }
        }
      });
    },
  });
}
