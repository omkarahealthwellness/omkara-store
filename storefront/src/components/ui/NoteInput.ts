// ============================================================
// OMKARA Storefront — Customer Note Input
// ============================================================

import type { ProductNotesConfig } from 'shared/types/product';

/**
 * Render customer special instructions input.
 * Hidden if notesConfig.enabled is false.
 */
export function renderNoteInput(
  config?: ProductNotesConfig,
  currentNote: string = ''
): string {
  if (!config || !config.enabled) {
    return '';
  }

  const placeholder = config.placeholder || 'Any special instructions? (e.g. Less spicy)';
  const maxLength = config.maxLength || 200;

  return `
    <div class="product-detail-section" id="note-section">
      <h4 class="section-title">Special Instructions</h4>
      <div class="note-input-container">
        <textarea
          class="note-textarea"
          id="customer-note"
          maxlength="${maxLength}"
          placeholder="${placeholder}"
          aria-label="Special instructions"
        >${currentNote}</textarea>
        <span class="note-counter" id="note-counter">${currentNote.length}/${maxLength}</span>
      </div>
    </div>
  `;
}

/**
 * Setup note input typing and character counter listeners.
 */
export function setupNoteInput(
  maxLength: number = 200,
  onChange: (note: string) => void
): void {
  const textarea = document.getElementById('customer-note') as HTMLTextAreaElement | null;
  const counter = document.getElementById('note-counter');
  if (!textarea) return;

  textarea.addEventListener('input', () => {
    const val = textarea.value;
    if (counter) {
      counter.textContent = `${val.length}/${maxLength}`;
    }
    onChange(val);
  });
}
