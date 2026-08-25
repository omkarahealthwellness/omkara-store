// ============================================================
// OMKARA Storefront — Responsive Modal / Bottom Sheet Manager
// ============================================================
// Supports mobile bottom-sheet & desktop centered dialog with
// smooth animations, escape key dismiss, and focus trap.
// ============================================================

let currentCloseCallback: (() => void) | null = null;
let isInitialized = false;

function ensureModalDom(): { overlay: HTMLElement; container: HTMLElement } {
  let overlay = document.getElementById('modal-overlay');
  let container = document.getElementById('modal-container');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);
  }

  if (!container) {
    container = document.createElement('div');
    container.id = 'modal-container';
    container.className = 'modal-container';
    container.setAttribute('role', 'dialog');
    container.setAttribute('aria-modal', 'true');
    document.body.appendChild(container);
  }

  if (!isInitialized) {
    overlay.addEventListener('click', () => closeModal());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isModalOpen()) {
        closeModal();
      }
    });

    isInitialized = true;
  }

  return { overlay, container };
}

/**
 * Check if the modal is currently visible.
 */
export function isModalOpen(): boolean {
  const overlay = document.getElementById('modal-overlay');
  return overlay?.classList.contains('active') ?? false;
}

/**
 * Open the modal / bottom sheet with HTML content and optional sticky footer.
 */
export function openModal(
  contentHtml: string,
  options?: {
    footerHtml?: string;
    onClose?: () => void;
    onAfterRender?: (container: HTMLElement) => void;
  }
): void {
  const { overlay, container } = ensureModalDom();
  currentCloseCallback = options?.onClose || null;

  const footerHtml = options?.footerHtml
    ? `<div class="modal-footer-bar" id="modal-footer-bar">${options.footerHtml}</div>`
    : '';

  container.innerHTML = `
    <div class="modal-handle-bar"></div>
    <button type="button" class="modal-close-btn" id="modal-close-btn" aria-label="Close dialog">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    <div class="modal-body-scroll" id="modal-body-scroll">
      ${contentHtml}
    </div>
    ${footerHtml}
  `;

  // Attach close button handler
  const closeBtn = container.querySelector('#modal-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal());
  }

  document.body.classList.add('modal-open');

  // Trigger animations in next frame
  requestAnimationFrame(() => {
    overlay.classList.add('active');
    container.classList.add('active');
  });

  if (options?.onAfterRender) {
    options.onAfterRender(container);
  }
}

/**
 * Close the modal / bottom sheet.
 */
export function closeModal(): void {
  const overlay = document.getElementById('modal-overlay');
  const container = document.getElementById('modal-container');

  if (overlay) overlay.classList.remove('active');
  if (container) container.classList.remove('active');
  document.body.classList.remove('modal-open');

  if (currentCloseCallback) {
    currentCloseCallback();
    currentCloseCallback = null;
  }
}
