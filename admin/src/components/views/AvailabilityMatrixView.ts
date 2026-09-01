// ============================================================
// OMKARA Admin — Availability & Ordering Matrix View
// ============================================================
// Rapid real-time stock control + drag-and-drop & manual product
// display ordering within respective categories.
// ============================================================

import type { Product, ProductVariant } from 'shared/types/product';
import type { Category } from 'shared/types/category';
import type { AvailabilityState } from 'shared/types/availability';
import { formatPrice } from 'shared/constants/defaults';

export const AVAILABILITY_OPTIONS: { value: AvailabilityState; label: string; color: string }[] = [
  { value: 'available', label: '✅ Available (Ready)', color: '#4A7C59' },
  { value: 'freshly_prepared', label: '🥗 Freshly Prepared', color: '#2E8B57' },
  { value: 'limited', label: '⏳ Limited Quantity', color: '#D4A84A' },
  { value: 'low_stock', label: '⚠️ Low Stock', color: '#E67E22' },
  { value: 'seasonal', label: '🍂 Seasonal Special', color: '#CD853F' },
  { value: 'out_of_stock', label: '❌ Out of Stock', color: '#C0392B' },
  { value: 'coming_soon', label: '🚀 Coming Soon', color: '#2E86AB' },
  { value: 'temporarily_unavailable', label: '⏸ Temporarily Paused', color: '#8B7B6B' },
];

export interface MatrixUpdatePayload {
  productId: string;
  availability?: AvailabilityState;
  sortOrder?: number;
}

/**
 * Render an individual product row within a category matrix table.
 */
function renderMatrixRow(
  product: Product,
  category: Category,
  index: number,
  totalInCategory: number
): string {
  const defaultVar = product.variants.find((v: ProductVariant) => v.isDefault) || product.variants[0];
  const startPrice = defaultVar ? defaultVar.price : 0;
  const isAvailable = product.availability === 'available';

  const imgHtml = product.imageUrl
    ? `<img src="${product.imageUrl}" alt="${product.name}" style="width: 34px; height: 34px; object-fit: cover; border-radius: var(--radius-sm);" onerror="this.style.display='none';" />`
    : `<span style="font-size: 1.1rem;">🌿</span>`;

  return `
    <tr
      class="matrix-row"
      id="matrix-row-${product.id}"
      data-matrix-prod-id="${product.id}"
      data-matrix-cat-id="${category.id}"
      data-current-index="${index}"
      draggable="true"
    >
      <td style="width: 140px;">
        <div class="matrix-order-cell">
          <span class="matrix-drag-handle" title="Drag to reorder" data-drag-handle-id="${product.id}">☰</span>
          <input
            type="number"
            class="matrix-order-input"
            value="${index + 1}"
            min="1"
            max="${totalInCategory}"
            data-order-prod-id="${product.id}"
            data-cat-id="${category.id}"
            title="Type position number (1-${totalInCategory}) and press Enter"
          />
          <div class="matrix-order-btns">
            <button
              type="button"
              class="btn btn-secondary matrix-order-btn"
              data-move="up"
              data-prod-id="${product.id}"
              data-cat-id="${category.id}"
              ${index === 0 ? 'disabled' : ''}
              title="Move Up"
            >▲</button>
            <button
              type="button"
              class="btn btn-secondary matrix-order-btn"
              data-move="down"
              data-prod-id="${product.id}"
              data-cat-id="${category.id}"
              ${index === totalInCategory - 1 ? 'disabled' : ''}
              title="Move Down"
            >▼</button>
          </div>
        </div>
      </td>
      <td style="min-width: 220px;">
        <div style="display: flex; align-items: center; gap: var(--space-3);">
          ${imgHtml}
          <div>
            <div style="font-weight: var(--weight-bold); color: var(--color-brand-primary);">
              ${product.name}
            </div>
            <div class="caption" style="color: var(--color-text-secondary);">
              ${formatPrice(startPrice)} · ${product.variants.length} size${product.variants.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </td>
      <td style="min-width: 200px;">
        <select
          class="form-select matrix-select"
          data-prod-select-id="${product.id}"
          style="width: 100%; max-width: 220px; font-weight: var(--weight-semibold);"
        >
          ${AVAILABILITY_OPTIONS.map(
            (opt) => `
            <option value="${opt.value}" ${product.availability === opt.value ? 'selected' : ''}>
              ${opt.label}
            </option>
          `
          ).join('')}
        </select>
      </td>
      <td style="text-align: right; min-width: 140px;">
        <button
          type="button"
          class="btn btn-secondary btn-sm matrix-toggle-btn"
          data-prod-toggle-id="${product.id}"
          data-target-state="${isAvailable ? 'out_of_stock' : 'available'}"
        >
          ${isAvailable ? 'Mark Sold Out' : 'Mark In Stock'}
        </button>
      </td>
    </tr>
  `;
}

/**
 * Render the whole category matrix table.
 */
function renderCategoryMatrixSection(category: Category, categoryProducts: Product[]): string {
  return `
    <div class="category-matrix-card" id="cat-card-${category.id}" data-category-card="${category.id}">
      <div class="category-matrix-header">
        <div class="category-matrix-title">
          <span style="display: inline-block; width: 12px; height: 12px; border-radius: var(--radius-full); background-color: ${category.color || 'var(--color-brand-accent)'};"></span>
          <span>${category.name}</span>
          <span class="badge" style="background-color: var(--color-surface-elevated); color: var(--color-brand-primary);">
            ${categoryProducts.length} ${categoryProducts.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        <div class="caption" style="color: var(--color-text-secondary);">
          💡 Drag ☰ or type # to change storefront display order
        </div>
      </div>

      <div class="data-table-container" style="border: none; border-radius: 0; box-shadow: none;">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 140px;">Display Order</th>
              <th>Product Details</th>
              <th>Availability State</th>
              <th style="text-align: right; width: 140px;">Quick Toggle</th>
            </tr>
          </thead>
          <tbody id="matrix-tbody-${category.id}" data-cat-tbody="${category.id}">
            ${
              categoryProducts.length === 0
                ? `<tr><td colspan="4" style="text-align: center; padding: var(--space-6); color: var(--color-text-tertiary);">No products in this category yet.</td></tr>`
                : categoryProducts
                    .map((p, idx) => renderMatrixRow(p, category, idx, categoryProducts.length))
                    .join('')
            }
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/**
 * Render the full Availability Matrix View.
 */
export function renderAvailabilityMatrixView(products: Product[], categories: Category[]): string {
  // Sort categories by sortOrder
  const sortedCategories = [...categories].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  // Map products into categories
  const productsByCat = new Map<string, Product[]>();
  for (const cat of sortedCategories) {
    const catProds = products
      .filter((p) => p.categoryId === cat.id)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    productsByCat.set(cat.id, catProds);
  }

  return `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-6); gap: var(--space-4); flex-wrap: wrap;">
        <div>
          <h2 class="heading-2" style="color: var(--color-brand-primary);">Live Availability & Product Ordering Matrix</h2>
          <p class="body-sm" style="color: var(--color-text-secondary); margin-top: 2px;">
            Reorder items (drag-and-drop or enter position #) and toggle live stock availability for your storefront.
          </p>
        </div>
        <div style="display: flex; gap: var(--space-3); align-items: center;">
          <button type="button" class="btn btn-accent" id="btn-save-matrix" style="font-size: var(--text-sm); font-weight: var(--weight-bold);">
            💾 Save All Changes
          </button>
        </div>
      </div>

      <!-- Category Filter Tabs -->
      <div class="matrix-filter-pills" id="matrix-filter-tabs">
        <button type="button" class="matrix-filter-pill active" data-filter-cat="all">
          All Categories (${products.length})
        </button>
        ${sortedCategories
          .map((cat) => {
            const count = productsByCat.get(cat.id)?.length ?? 0;
            return `
              <button type="button" class="matrix-filter-pill" data-filter-cat="${cat.id}">
                ${cat.name} (${count})
              </button>
            `;
          })
          .join('')}
      </div>

      <!-- Categorized Sections -->
      <div id="matrix-sections-container">
        ${sortedCategories
          .map((cat) => {
            const catProds = productsByCat.get(cat.id) || [];
            return renderCategoryMatrixSection(cat, catProds);
          })
          .join('')}
      </div>
    </div>
  `;
}

/**
 * Setup drag-and-drop ordering, manual order entry, and availability toggles.
 */
export function setupAvailabilityMatrixView(
  allProducts: Product[],
  categories: Category[],
  onSaveBatch: (updates: MatrixUpdatePayload[]) => Promise<void>
): void {
  // Local state copy organized by category
  const categoryMap = new Map<string, Category>(categories.map((c) => [c.id, c]));
  const catProductsMap = new Map<string, Product[]>();

  categories.forEach((cat) => {
    const list = allProducts
      .filter((p) => p.categoryId === cat.id)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    catProductsMap.set(cat.id, [...list]);
  });

  const pendingAvailability = new Map<string, AvailabilityState>();
  const pendingSortOrders = new Map<string, number>();

  const markDirty = () => {
    const saveBtn = document.getElementById('btn-save-matrix');
    if (saveBtn) {
      const totalChanges = pendingAvailability.size + pendingSortOrders.size;
      if (totalChanges > 0) {
        saveBtn.textContent = `💾 Save Changes (${totalChanges} pending)`;
        saveBtn.classList.remove('btn-secondary');
        saveBtn.classList.add('btn-accent');
      } else {
        saveBtn.textContent = '💾 Save All Changes';
      }
    }
  };

  /**
   * Re-render table body for a single category and rebind events
   */
  const refreshCategoryTbody = (categoryId: string, highlightProdId?: string) => {
    const tbody = document.getElementById(`matrix-tbody-${categoryId}`);
    const cat = categoryMap.get(categoryId);
    const prods = catProductsMap.get(categoryId);
    if (!tbody || !cat || !prods) return;

    tbody.innerHTML = prods
      .map((p, idx) => renderMatrixRow(p, cat, idx, prods.length))
      .join('');

    bindCategoryRowEvents(categoryId);

    if (highlightProdId) {
      const row = document.getElementById(`matrix-row-${highlightProdId}`);
      if (row) {
        row.classList.add('row-highlight-pulse');
        setTimeout(() => row.classList.remove('row-highlight-pulse'), 1200);
      }
    }
  };

  /**
   * Move product within a category from fromIndex to toIndex
   */
  const moveProductInCategory = (categoryId: string, fromIndex: number, toIndex: number) => {
    const prods = catProductsMap.get(categoryId);
    if (!prods || fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || toIndex >= prods.length) {
      return;
    }

    const [movedItem] = prods.splice(fromIndex, 1);
    prods.splice(toIndex, 0, movedItem);

    // Reassign sortOrder for all items in category
    prods.forEach((p, idx) => {
      p.sortOrder = idx;
      pendingSortOrders.set(p.id, idx);
    });

    markDirty();
    refreshCategoryTbody(categoryId, movedItem.id);
  };

  /**
   * Bind event listeners for rows inside a category table
   */
  const bindCategoryRowEvents = (categoryId: string) => {
    const tbody = document.getElementById(`matrix-tbody-${categoryId}`);
    if (!tbody) return;

    // 1. Availability Selects
    const selects = tbody.querySelectorAll<HTMLSelectElement>('[data-prod-select-id]');
    selects.forEach((select) => {
      const prodId = select.dataset.prodSelectId;
      if (prodId && pendingAvailability.has(prodId)) {
        select.value = pendingAvailability.get(prodId)!;
        select.style.borderColor = 'var(--color-brand-accent)';
      }

      select.addEventListener('change', () => {
        if (prodId) {
          pendingAvailability.set(prodId, select.value as AvailabilityState);
          select.style.borderColor = 'var(--color-brand-accent)';
          markDirty();
        }
      });
    });

    // 2. Instant Toggle Buttons
    const toggleBtns = tbody.querySelectorAll<HTMLButtonElement>('[data-prod-toggle-id]');
    toggleBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const prodId = btn.dataset.prodToggleId;
        const targetState = btn.dataset.targetState as AvailabilityState;
        if (prodId && targetState) {
          const select = tbody.querySelector<HTMLSelectElement>(`[data-prod-select-id="${prodId}"]`);
          if (select) {
            select.value = targetState;
            pendingAvailability.set(prodId, targetState);
            select.style.borderColor = 'var(--color-brand-accent)';
            btn.dataset.targetState = targetState === 'available' ? 'out_of_stock' : 'available';
            btn.textContent = targetState === 'available' ? 'Mark Sold Out' : 'Mark In Stock';
            markDirty();
          }
        }
      });
    });

    // 3. Manual Order Number Inputs
    const orderInputs = tbody.querySelectorAll<HTMLInputElement>('.matrix-order-input');
    orderInputs.forEach((input) => {
      const handleManualOrderCommit = () => {
        const prodId = input.dataset.orderProdId;
        const catId = input.dataset.catId;
        if (!prodId || !catId) return;

        const prods = catProductsMap.get(catId);
        if (!prods) return;

        const currentIdx = prods.findIndex((p) => p.id === prodId);
        let desiredPos = parseInt(input.value, 10);
        if (isNaN(desiredPos)) {
          input.value = String(currentIdx + 1);
          return;
        }

        // Clamp between 1 and length
        desiredPos = Math.max(1, Math.min(desiredPos, prods.length));
        const targetIdx = desiredPos - 1;

        if (targetIdx !== currentIdx) {
          moveProductInCategory(catId, currentIdx, targetIdx);
        } else {
          input.value = String(currentIdx + 1);
        }
      };

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleManualOrderCommit();
        }
      });

      input.addEventListener('blur', () => {
        handleManualOrderCommit();
      });
    });

    // 4. Move Up / Down Buttons
    const moveBtns = tbody.querySelectorAll<HTMLButtonElement>('.matrix-order-btn');
    moveBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const prodId = btn.dataset.prodId;
        const catId = btn.dataset.catId;
        const direction = btn.dataset.move;
        if (!prodId || !catId || !direction) return;

        const prods = catProductsMap.get(catId);
        if (!prods) return;

        const currentIdx = prods.findIndex((p) => p.id === prodId);
        if (currentIdx === -1) return;

        if (direction === 'up' && currentIdx > 0) {
          moveProductInCategory(catId, currentIdx, currentIdx - 1);
        } else if (direction === 'down' && currentIdx < prods.length - 1) {
          moveProductInCategory(catId, currentIdx, currentIdx + 1);
        }
      });
    });

    // 5. Drag and Drop Reordering (HTML5)
    let draggedProdId: string | null = null;
    let draggedCatId: string | null = null;

    const rows = tbody.querySelectorAll<HTMLTableRowElement>('.matrix-row');
    rows.forEach((row) => {
      row.addEventListener('dragstart', (e) => {
        draggedProdId = row.dataset.matrixProdId || null;
        draggedCatId = row.dataset.matrixCatId || null;
        row.classList.add('is-dragging');
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', draggedProdId || '');
        }
      });

      row.addEventListener('dragend', () => {
        row.classList.remove('is-dragging');
        rows.forEach((r) => r.classList.remove('drag-over-top', 'drag-over-bottom'));
      });

      row.addEventListener('dragover', (e) => {
        if (!draggedProdId || draggedCatId !== categoryId) return;
        e.preventDefault();
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = 'move';
        }

        const rect = row.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        if (e.clientY < midY) {
          row.classList.add('drag-over-top');
          row.classList.remove('drag-over-bottom');
        } else {
          row.classList.add('drag-over-bottom');
          row.classList.remove('drag-over-top');
        }
      });

      row.addEventListener('dragleave', () => {
        row.classList.remove('drag-over-top', 'drag-over-bottom');
      });

      row.addEventListener('drop', (e) => {
        if (!draggedProdId || draggedCatId !== categoryId) return;
        e.preventDefault();
        const targetProdId = row.dataset.matrixProdId;
        const isTop = row.classList.contains('drag-over-top');
        row.classList.remove('drag-over-top', 'drag-over-bottom');

        if (!targetProdId || targetProdId === draggedProdId) return;

        const prods = catProductsMap.get(categoryId);
        if (!prods) return;

        const fromIdx = prods.findIndex((p) => p.id === draggedProdId);
        let toIdx = prods.findIndex((p) => p.id === targetProdId);
        if (fromIdx === -1 || toIdx === -1) return;

        if (!isTop && fromIdx < toIdx) {
          // Dropped below target
          // toIdx is already correct
        } else if (isTop && fromIdx > toIdx) {
          // Dropped above target
          // toIdx is already correct
        } else if (!isTop && fromIdx > toIdx) {
          toIdx += 1;
        } else if (isTop && fromIdx < toIdx) {
          toIdx -= 1;
        }

        toIdx = Math.max(0, Math.min(toIdx, prods.length - 1));
        moveProductInCategory(categoryId, fromIdx, toIdx);
      });
    });
  };

  // Bind all category sections initially
  categories.forEach((cat) => {
    bindCategoryRowEvents(cat.id);
  });

  // Filter Tabs Handler
  const filterTabs = document.querySelectorAll<HTMLButtonElement>('.matrix-filter-pill');
  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filterCat = tab.dataset.filterCat || 'all';
      const cards = document.querySelectorAll<HTMLElement>('[data-category-card]');
      cards.forEach((card) => {
        const catId = card.dataset.categoryCard;
        if (filterCat === 'all' || catId === filterCat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Save Button Handler
  const saveBtn = document.getElementById('btn-save-matrix') as HTMLButtonElement | null;
  saveBtn?.addEventListener('click', async () => {
    const totalChanges = pendingAvailability.size + pendingSortOrders.size;
    if (totalChanges === 0) {
      alert('No changes to save.');
      return;
    }

    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving Changes...';
    }

    try {
      // Gather unique product IDs that have any updates
      const updatedProductIds = new Set<string>([
        ...pendingAvailability.keys(),
        ...pendingSortOrders.keys(),
      ]);

      const updates: MatrixUpdatePayload[] = Array.from(updatedProductIds).map((productId) => ({
        productId,
        ...(pendingAvailability.has(productId)
          ? { availability: pendingAvailability.get(productId) }
          : {}),
        ...(pendingSortOrders.has(productId)
          ? { sortOrder: pendingSortOrders.get(productId) }
          : {}),
      }));

      await onSaveBatch(updates);

      pendingAvailability.clear();
      pendingSortOrders.clear();

      // Reset border highlights
      document.querySelectorAll<HTMLSelectElement>('[data-prod-select-id]').forEach((s) => {
        s.style.borderColor = '';
      });

      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 Save All Changes';
        saveBtn.classList.remove('btn-accent');
        saveBtn.classList.add('btn-secondary');
      }
    } catch (err: unknown) {
      alert(`Failed to save matrix updates: ${err instanceof Error ? err.message : String(err)}`);
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 Retry Save';
      }
    }
  });
}
