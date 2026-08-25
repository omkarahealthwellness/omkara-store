// ============================================================
// OMKARA Admin — Availability Matrix View
// ============================================================
// Rapid real-time stock control across all 8 availability states.
// ============================================================

import type { Product } from 'shared/types/product';
import type { Category } from 'shared/types/category';
import type { AvailabilityState } from 'shared/types/availability';

const AVAILABILITY_OPTIONS: { value: AvailabilityState; label: string; color: string }[] = [
  { value: 'available', label: '✅ Available (Ready)', color: '#4A7C59' },
  { value: 'freshly_prepared', label: '🥗 Freshly Prepared', color: '#2E8B57' },
  { value: 'limited', label: '⏳ Limited Quantity', color: '#D4A84A' },
  { value: 'low_stock', label: '⚠️ Low Stock', color: '#E67E22' },
  { value: 'seasonal', label: '🍂 Seasonal Special', color: '#CD853F' },
  { value: 'out_of_stock', label: '❌ Out of Stock', color: '#C0392B' },
  { value: 'coming_soon', label: '🚀 Coming Soon', color: '#2E86AB' },
  { value: 'temporarily_unavailable', label: '⏸ Temporarily Paused', color: '#8B7B6B' },
];

export function renderAvailabilityMatrixView(products: Product[], categories: Category[]): string {
  return `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
        <div>
          <h2 class="heading-2" style="color: var(--color-brand-primary);">Live Availability Matrix</h2>
          <p class="body-sm" style="color: var(--color-text-secondary); margin-top: 2px;">Instantly toggle dish availability for morning prep or sudden sold-out items.</p>
        </div>
        <button type="button" class="btn btn-accent" id="btn-save-matrix">
          💾 Save Availability Changes
        </button>
      </div>

      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Current Availability State</th>
              <th style="text-align: right;">Instant Action</th>
            </tr>
          </thead>
          <tbody id="matrix-tbody">
            ${products
              .map((p) => {
                const cat = categories.find((c) => c.id === p.categoryId);
                return `
                <tr data-matrix-prod-id="${p.id}">
                  <td style="font-weight: var(--weight-bold); color: var(--color-brand-primary);">${p.name}</td>
                  <td><span class="badge" style="background-color: var(--color-surface-secondary); color: var(--color-brand-primary);">${cat?.name || p.categoryId}</span></td>
                  <td>
                    <select class="form-select matrix-select" data-prod-select-id="${p.id}" style="width: auto; font-weight: var(--weight-semibold);">
                      ${AVAILABILITY_OPTIONS.map(
                        (opt) => `
                        <option value="${opt.value}" ${p.availability === opt.value ? 'selected' : ''}>
                          ${opt.label}
                        </option>
                      `
                      ).join('')}
                    </select>
                  </td>
                  <td style="text-align: right;">
                    <button type="button" class="btn btn-secondary btn-sm matrix-toggle-btn" data-prod-toggle-id="${p.id}" data-target-state="${p.availability === 'available' ? 'out_of_stock' : 'available'}">
                      ${p.availability === 'available' ? 'Mark Sold Out' : 'Mark In Stock'}
                    </button>
                  </td>
                </tr>
              `;
              })
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function setupAvailabilityMatrixView(
  _products: Product[],
  onSaveBatch: (updates: { productId: string; availability: AvailabilityState }[]) => Promise<void>
): void {
  const pendingUpdates = new Map<string, AvailabilityState>();

  const selects = document.querySelectorAll<HTMLSelectElement>('[data-prod-select-id]');
  selects.forEach((select) => {
    select.addEventListener('change', () => {
      const prodId = select.dataset.prodSelectId;
      if (prodId) {
        pendingUpdates.set(prodId, select.value as AvailabilityState);
        select.style.borderColor = 'var(--color-brand-accent)';
      }
    });
  });

  const toggleBtns = document.querySelectorAll<HTMLButtonElement>('[data-prod-toggle-id]');
  toggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const prodId = btn.dataset.prodToggleId;
      const targetState = btn.dataset.targetState as AvailabilityState;
      if (prodId && targetState) {
        const select = document.querySelector<HTMLSelectElement>(`[data-prod-select-id="${prodId}"]`);
        if (select) {
          select.value = targetState;
          pendingUpdates.set(prodId, targetState);
          select.style.borderColor = 'var(--color-brand-accent)';
          btn.dataset.targetState = targetState === 'available' ? 'out_of_stock' : 'available';
          btn.textContent = targetState === 'available' ? 'Mark Sold Out' : 'Mark In Stock';
        }
      }
    });
  });

  const saveBtn = document.getElementById('btn-save-matrix') as HTMLButtonElement | null;
  saveBtn?.addEventListener('click', async () => {
    if (pendingUpdates.size === 0) {
      alert('No availability changes to save.');
      return;
    }

    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving Updates...';
    }

    try {
      const updates = Array.from(pendingUpdates.entries()).map(([productId, availability]) => ({
        productId,
        availability,
      }));
      await onSaveBatch(updates);
      pendingUpdates.clear();
      selects.forEach((s) => (s.style.borderColor = ''));
    } catch (err: unknown) {
      alert(`Failed to save matrix: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 Save Availability Changes';
      }
    }
  });
}
