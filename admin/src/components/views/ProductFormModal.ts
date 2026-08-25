// ============================================================
// OMKARA Admin — Product Form Modal
// ============================================================

import type { Product, ProductVariant, ProductAddon } from 'shared/types/product';
import type { Category } from 'shared/types/category';
import type { AvailabilityState } from 'shared/types/availability';
import { openAdminModal, closeAdminModal } from '../ui/AdminModal';

export function openProductFormModal(
  product: Partial<Product> | null,
  categories: Category[],
  onSave: (prodData: Omit<Product, 'id'>, id?: string) => Promise<void>
): void {
  const isEdit = !!product && !!product.id;
  const title = isEdit ? `Edit Product: ${product.name}` : 'Create New Product';

  let variants: ProductVariant[] = product?.variants && product.variants.length > 0
    ? [...product.variants]
    : [{ id: 'regular', label: 'Regular', description: '', price: 60, isDefault: true, availability: 'available', sortOrder: 0 }];

  let addons: ProductAddon[] = product?.addons ? [...product.addons] : [];

  function renderVariantsEditor(): string {
    return `
      <div id="variants-list" style="display: flex; flex-direction: column; gap: var(--space-2); margin-bottom: var(--space-3);">
        ${variants
          .map(
            (v, idx) => `
          <div class="variant-row" data-v-idx="${idx}" style="display: flex; gap: var(--space-2); align-items: center; background-color: var(--color-surface-secondary); padding: var(--space-2); border-radius: var(--radius-md);">
            <input type="text" class="form-input v-label" value="${v.label}" placeholder="Size label (e.g. Regular, 300ml)" style="flex: 2;" required />
            <input type="number" class="form-input v-price" value="${v.price}" placeholder="Price (₹)" min="0" style="flex: 1;" required />
            <label style="display: flex; align-items: center; gap: 4px; font-size: var(--text-xs); white-space: nowrap; cursor: pointer;">
              <input type="radio" name="variant-default-radio" class="v-default" ${v.isDefault ? 'checked' : ''} /> Default
            </label>
            <button type="button" class="btn btn-danger btn-sm v-remove" ${variants.length <= 1 ? 'disabled' : ''}>✕</button>
          </div>
        `
          )
          .join('')}
      </div>
      <button type="button" class="btn btn-secondary btn-sm" id="btn-add-variant">+ Add Serving Size / Variant</button>
    `;
  }

  function renderAddonsEditor(): string {
    return `
      <div id="addons-list" style="display: flex; flex-direction: column; gap: var(--space-2); margin-bottom: var(--space-3);">
        ${addons
          .map(
            (a, idx) => `
          <div class="addon-row" data-a-idx="${idx}" style="display: flex; gap: var(--space-2); align-items: center; background-color: var(--color-surface-secondary); padding: var(--space-2); border-radius: var(--radius-md);">
            <input type="text" class="form-input a-name" value="${a.name}" placeholder="Add-on name (e.g. Extra Lemon)" style="flex: 2;" required />
            <input type="number" class="form-input a-price" value="${a.price}" placeholder="+₹" min="0" style="flex: 1;" required />
            <button type="button" class="btn btn-danger btn-sm a-remove">✕</button>
          </div>
        `
          )
          .join('')}
      </div>
      <button type="button" class="btn btn-secondary btn-sm" id="btn-add-addon">+ Add Optional Add-on</button>
    `;
  }

  const bodyHtml = `
    <form id="product-modal-form" style="display: flex; flex-direction: column; gap: var(--space-4);">
      <!-- Basic Details -->
      <div class="form-group">
        <label class="form-label" for="prod-name">Product Name *</label>
        <input type="text" id="prod-name" class="form-input" value="${product?.name || ''}" placeholder="e.g. Moong Sprout Bowl" required />
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
        <div class="form-group">
          <label class="form-label" for="prod-category">Category *</label>
          <select id="prod-category" class="form-select" required>
            ${categories
              .map(
                (c) => `<option value="${c.id}" ${product?.categoryId === c.id ? 'selected' : ''}>${c.name}</option>`
              )
              .join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="prod-availability">Availability State</label>
          <select id="prod-availability" class="form-select">
            <option value="available" ${product?.availability === 'available' ? 'selected' : ''}>Available (Orderable)</option>
            <option value="freshly_prepared" ${product?.availability === 'freshly_prepared' ? 'selected' : ''}>Freshly Prepared</option>
            <option value="limited" ${product?.availability === 'limited' ? 'selected' : ''}>Limited Quantity</option>
            <option value="low_stock" ${product?.availability === 'low_stock' ? 'selected' : ''}>Low Stock</option>
            <option value="seasonal" ${product?.availability === 'seasonal' ? 'selected' : ''}>Seasonal</option>
            <option value="out_of_stock" ${product?.availability === 'out_of_stock' ? 'selected' : ''}>Out of Stock</option>
            <option value="coming_soon" ${product?.availability === 'coming_soon' ? 'selected' : ''}>Coming Soon</option>
            <option value="temporarily_unavailable" ${product?.availability === 'temporarily_unavailable' ? 'selected' : ''}>Temporarily Unavailable</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="prod-short-desc">Short Tagline</label>
        <input type="text" id="prod-short-desc" class="form-input" value="${product?.shortDescription || ''}" placeholder="Brief subtitle on card..." />
      </div>

      <div class="form-group">
        <label class="form-label" for="prod-desc">Full Description</label>
        <textarea id="prod-desc" class="form-textarea" rows="3" placeholder="Full dish ingredients and story...">${product?.description || ''}</textarea>
      </div>

      <div class="form-group">
        <label class="form-label" for="prod-ingredients">Key Ingredients (comma-separated)</label>
        <input type="text" id="prod-ingredients" class="form-input" value="${product?.ingredients?.join(', ') || ''}" placeholder="Sprouted Moong, Lemon, Green Chilli..." />
      </div>

      <div class="form-group">
        <label class="form-label" for="prod-image-url">Image URL</label>
        <input type="url" id="prod-image-url" class="form-input" value="${product?.imageUrl || ''}" placeholder="https://... /assets/..." />
      </div>

      <!-- Variants Sub-section -->
      <div style="border: 1px solid var(--color-border-subtle); padding: var(--space-4); border-radius: var(--radius-md); background-color: var(--color-surface-primary);">
        <label class="form-label" style="font-weight: var(--weight-bold); margin-bottom: var(--space-2); display: block;">Serving Sizes & Pricing *</label>
        <div id="variants-container">${renderVariantsEditor()}</div>
      </div>

      <!-- Addons Sub-section -->
      <div style="border: 1px solid var(--color-border-subtle); padding: var(--space-4); border-radius: var(--radius-md); background-color: var(--color-surface-primary);">
        <label class="form-label" style="font-weight: var(--weight-bold); margin-bottom: var(--space-2); display: block;">Custom Add-ons (Optional)</label>
        <div id="addons-container">${renderAddonsEditor()}</div>
      </div>

      <!-- Tags & Status -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
        <div class="form-group">
          <label class="form-label" for="prod-tags">Tags (comma-separated)</label>
          <input type="text" id="prod-tags" class="form-input" value="${product?.tags?.join(', ') || ''}" placeholder="bestseller, protein, vegan" />
        </div>

        <div class="form-group">
          <label class="form-label" for="prod-status">Publish Status</label>
          <select id="prod-status" class="form-select">
            <option value="published" ${product?.status === 'published' ? 'selected' : ''}>Published (Live in Menu)</option>
            <option value="draft" ${product?.status === 'draft' ? 'selected' : ''}>Draft (Hidden)</option>
            <option value="archived" ${product?.status === 'archived' ? 'selected' : ''}>Archived</option>
          </select>
        </div>
      </div>
    </form>
  `;

  const footHtml = `
    <button type="button" class="btn btn-secondary btn-sm" id="prod-modal-cancel">Cancel</button>
    <button type="button" class="btn btn-primary btn-sm" id="prod-modal-save">${isEdit ? 'Save Changes' : 'Create Product'}</button>
  `;

  openAdminModal(title, bodyHtml, {
    footHtml,
    onAfterRender: (container) => {
      const cancelBtn = container.querySelector('#prod-modal-cancel');
      const saveBtn = container.querySelector('#prod-modal-save') as HTMLButtonElement | null;
      cancelBtn?.addEventListener('click', () => closeAdminModal());

      const rebindVariants = () => {
        const vContainer = container.querySelector('#variants-container');
        if (vContainer) {
          vContainer.innerHTML = renderVariantsEditor();
          attachVariantEvents();
        }
      };

      const attachVariantEvents = () => {
        const addVBtn = container.querySelector('#btn-add-variant');
        addVBtn?.addEventListener('click', () => {
          syncCurrentVariantsState();
          variants.push({
            id: `size-${Date.now()}`,
            label: 'Large',
            description: '',
            price: 100,
            isDefault: variants.length === 0,
            availability: 'available',
            sortOrder: variants.length,
          });
          rebindVariants();
        });

        const removeBtns = container.querySelectorAll<HTMLButtonElement>('.v-remove');
        removeBtns.forEach((btn) => {
          btn.addEventListener('click', () => {
            syncCurrentVariantsState();
            const row = btn.closest('.variant-row') as HTMLElement;
            const idx = parseInt(row.dataset.vIdx || '0', 10);
            if (variants.length > 1) {
              variants.splice(idx, 1);
              if (!variants.some((v) => v.isDefault)) {
                variants[0].isDefault = true;
              }
              rebindVariants();
            }
          });
        });
      };

      const syncCurrentVariantsState = () => {
        const rows = container.querySelectorAll<HTMLElement>('.variant-row');
        rows.forEach((row, idx) => {
          const labelInput = row.querySelector('.v-label') as HTMLInputElement;
          const priceInput = row.querySelector('.v-price') as HTMLInputElement;
          const defaultRadio = row.querySelector('.v-default') as HTMLInputElement;
          if (variants[idx]) {
            variants[idx].label = labelInput.value.trim() || 'Serving';
            variants[idx].price = parseFloat(priceInput.value || '0');
            variants[idx].isDefault = defaultRadio.checked;
          }
        });
      };

      attachVariantEvents();

      // Addons handlers
      const rebindAddons = () => {
        const aContainer = container.querySelector('#addons-container');
        if (aContainer) {
          aContainer.innerHTML = renderAddonsEditor();
          attachAddonEvents();
        }
      };

      const attachAddonEvents = () => {
        const addABtn = container.querySelector('#btn-add-addon');
        addABtn?.addEventListener('click', () => {
          syncCurrentAddonsState();
          addons.push({
            id: `addon-${Date.now()}`,
            name: 'Extra Portion',
            description: '',
            price: 20,
            availability: 'available',
            selectionType: 'multiple',
            required: false,
            sortOrder: addons.length,
          });
          rebindAddons();
        });

        const removeBtns = container.querySelectorAll<HTMLButtonElement>('.a-remove');
        removeBtns.forEach((btn) => {
          btn.addEventListener('click', () => {
            syncCurrentAddonsState();
            const row = btn.closest('.addon-row') as HTMLElement;
            const idx = parseInt(row.dataset.aIdx || '0', 10);
            addons.splice(idx, 1);
            rebindAddons();
          });
        });
      };

      const syncCurrentAddonsState = () => {
        const rows = container.querySelectorAll<HTMLElement>('.addon-row');
        rows.forEach((row, idx) => {
          const nameInput = row.querySelector('.a-name') as HTMLInputElement;
          const priceInput = row.querySelector('.a-price') as HTMLInputElement;
          if (addons[idx]) {
            addons[idx].name = nameInput.value.trim() || 'Addon';
            addons[idx].price = parseFloat(priceInput.value || '0');
          }
        });
      };

      attachAddonEvents();

      // Save Handler
      saveBtn?.addEventListener('click', async () => {
        syncCurrentVariantsState();
        syncCurrentAddonsState();

        const nameInput = container.querySelector('#prod-name') as HTMLInputElement | null;
        const catSelect = container.querySelector('#prod-category') as HTMLSelectElement | null;
        const availSelect = container.querySelector('#prod-availability') as HTMLSelectElement | null;
        const shortDescInput = container.querySelector('#prod-short-desc') as HTMLInputElement | null;
        const descInput = container.querySelector('#prod-desc') as HTMLTextAreaElement | null;
        const ingInput = container.querySelector('#prod-ingredients') as HTMLInputElement | null;
        const imgInput = container.querySelector('#prod-image-url') as HTMLInputElement | null;
        const tagsInput = container.querySelector('#prod-tags') as HTMLInputElement | null;
        const statusSelect = container.querySelector('#prod-status') as HTMLSelectElement | null;

        if (!nameInput || !nameInput.value.trim()) {
          alert('Product name is required.');
          return;
        }

        if (variants.length === 0) {
          alert('At least one serving size variant is required.');
          return;
        }

        const now = new Date().toISOString();
        const ingredients = ingInput?.value
          ? ingInput.value.split(',').map((s) => s.trim()).filter(Boolean)
          : [];
        const tags = tagsInput?.value
          ? tagsInput.value.split(',').map((s) => s.trim()).filter(Boolean)
          : [];

        const prodData: Omit<Product, 'id'> = {
          name: nameInput.value.trim(),
          categoryId: catSelect?.value || categories[0]?.id || 'sprouts',
          description: descInput?.value.trim() || '',
          shortDescription: shortDescInput?.value.trim() || '',
          ingredients,
          imageUrl: imgInput?.value.trim() || '',
          additionalImages: product?.additionalImages || [],
          tags,
          variants,
          addons,
          notesConfig: product?.notesConfig || { enabled: true, placeholder: 'Any special instructions?', maxLength: 200 },
          availability: (availSelect?.value as AvailabilityState) || 'available',
          sortOrder: product?.sortOrder ?? 0,
          isFeatured: product?.isFeatured ?? false,
          isNew: product?.isNew ?? false,
          status: (statusSelect?.value as 'published' | 'draft' | 'archived') || 'published',
          createdAt: product?.createdAt || now,
          updatedAt: now,
        };

        if (saveBtn) {
          saveBtn.disabled = true;
          saveBtn.textContent = 'Saving...';
        }

        try {
          await onSave(prodData, product?.id);
          closeAdminModal();
        } catch (err: unknown) {
          alert(`Failed to save product: ${err instanceof Error ? err.message : String(err)}`);
          if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.textContent = isEdit ? 'Save Changes' : 'Create Product';
          }
        }
      });
    },
  });
}
