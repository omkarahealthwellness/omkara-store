// ============================================================
// OMKARA Storefront — Add-on Selector
// ============================================================

import type { ProductAddon } from 'shared/types/product';
import { formatPrice } from 'shared/constants/defaults';

/**
 * Render optional add-ons list.
 * Hidden if no add-ons exist.
 */
export function renderAddonSelector(
  addons: ProductAddon[],
  selectedAddonIds: string[]
): string {
  if (!addons || addons.length === 0) {
    return '';
  }

  const items = addons
    .map((addon) => {
      const isSelected = selectedAddonIds.includes(addon.id);
      const isSingle = addon.selectionType === 'single';
      const inputType = isSingle ? 'radio' : 'checkbox';
      const nameAttr = isSingle ? 'name="single-addon"' : `name="addon-${addon.id}"`;

      return `
        <label
          class="addon-item${isSelected ? ' selected' : ''}"
          data-addon-id="${addon.id}"
        >
          <div class="addon-left">
            <input
              type="${inputType}"
              ${nameAttr}
              class="addon-checkbox"
              value="${addon.id}"
              ${isSelected ? 'checked' : ''}
            />
            <span class="addon-name">${addon.name}</span>
          </div>
          <span class="addon-price">+${formatPrice(addon.price)}</span>
        </label>
      `;
    })
    .join('');

  return `
    <div class="product-detail-section" id="addon-section">
      <h4 class="section-title">Add Extra Nourishment (Optional)</h4>
      <div class="addon-list">
        ${items}
      </div>
    </div>
  `;
}

/**
 * Setup add-on selector event listeners.
 */
export function setupAddonSelector(
  addons: ProductAddon[],
  onUpdate: (selected: ProductAddon[]) => void
): void {
  const container = document.getElementById('addon-section');
  if (!container) return;

  const checkboxes = container.querySelectorAll<HTMLInputElement>('.addon-checkbox');

  checkboxes.forEach((input) => {
    input.addEventListener('change', () => {
      // Update visual item selection states
      const items = container.querySelectorAll<HTMLLabelElement>('.addon-item');
      items.forEach((item) => {
        const itemInput = item.querySelector<HTMLInputElement>('.addon-checkbox');
        item.classList.toggle('selected', itemInput?.checked ?? false);
      });

      const selectedIds = Array.from(checkboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);

      const selectedAddons = addons.filter((a) => selectedIds.includes(a.id));
      onUpdate(selectedAddons);
    });
  });
}
