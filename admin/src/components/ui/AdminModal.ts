// ============================================================
// OMKARA Admin — Modal Dialog Utility
// ============================================================

let modalOverlay: HTMLElement | null = null;
let currentCloseCb: (() => void) | null = null;

function ensureAdminModalDom(): HTMLElement {
  if (!modalOverlay) {
    modalOverlay = document.getElementById('admin-modal-overlay');
    if (!modalOverlay) {
      modalOverlay = document.createElement('div');
      modalOverlay.id = 'admin-modal-overlay';
      modalOverlay.className = 'admin-modal-overlay';
      document.body.appendChild(modalOverlay);

      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          closeAdminModal();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay?.classList.contains('active')) {
          closeAdminModal();
        }
      });
    }
  }
  return modalOverlay;
}

export function openAdminModal(
  title: string,
  bodyHtml: string,
  options?: {
    footHtml?: string;
    onAfterRender?: (container: HTMLElement) => void;
    onClose?: () => void;
  }
): void {
  const overlay = ensureAdminModalDom();
  currentCloseCb = options?.onClose || null;

  const foot = options?.footHtml
    ? `<div class="modal-foot" id="admin-modal-foot">${options.footHtml}</div>`
    : '';

  overlay.innerHTML = `
    <div class="admin-modal" id="admin-modal-card">
      <div class="modal-head">
        <h3 class="heading-4" style="color: var(--color-brand-primary);">${title}</h3>
        <button type="button" class="btn btn-secondary btn-sm" id="admin-modal-close-x" style="padding: 4px 8px; border-radius: var(--radius-full);">✕</button>
      </div>
      <div class="modal-content-scroll" id="admin-modal-body">
        ${bodyHtml}
      </div>
      ${foot}
    </div>
  `;

  const closeX = overlay.querySelector('#admin-modal-close-x');
  closeX?.addEventListener('click', () => closeAdminModal());

  requestAnimationFrame(() => {
    overlay.classList.add('active');
  });

  if (options?.onAfterRender) {
    options.onAfterRender(overlay);
  }
}

export function closeAdminModal(): void {
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
  }
  if (currentCloseCb) {
    currentCloseCb();
    currentCloseCb = null;
  }
}
