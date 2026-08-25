// ============================================================
// OMKARA Storefront — Quantity Stepper Controls
// ============================================================

/**
 * Render stepper quantity controls (minus, count, plus).
 */
export function renderQuantityControls(quantity: number = 1): string {
  return `
    <div class="stepper-container" id="product-stepper" role="group" aria-label="Quantity">
      <button
        type="button"
        class="stepper-btn"
        id="stepper-minus"
        aria-label="Decrease quantity"
        ${quantity <= 1 ? 'disabled' : ''}
      >
        −
      </button>
      <span class="stepper-count" id="stepper-count" aria-live="polite">${quantity}</span>
      <button
        type="button"
        class="stepper-btn"
        id="stepper-plus"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  `;
}

/**
 * Setup quantity controls event listeners.
 */
export function setupQuantityControls(
  initialQuantity: number,
  onChange: (newQty: number) => void
): void {
  const minusBtn = document.getElementById('stepper-minus') as HTMLButtonElement | null;
  const plusBtn = document.getElementById('stepper-plus') as HTMLButtonElement | null;
  const countEl = document.getElementById('stepper-count');

  if (!minusBtn || !plusBtn || !countEl) return;

  let currentQty = initialQuantity;

  minusBtn.addEventListener('click', () => {
    if (currentQty > 1) {
      currentQty--;
      countEl.textContent = currentQty.toString();
      minusBtn.disabled = currentQty <= 1;
      onChange(currentQty);
    }
  });

  plusBtn.addEventListener('click', () => {
    currentQty++;
    countEl.textContent = currentQty.toString();
    minusBtn.disabled = false;
    onChange(currentQty);
  });
}
