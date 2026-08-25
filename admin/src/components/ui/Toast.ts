// ============================================================
// OMKARA Admin — Toast Notification Utility
// ============================================================

let toastContainer: HTMLElement | null = null;

function ensureToastContainer(): HTMLElement {
  if (!toastContainer) {
    toastContainer = document.getElementById('admin-toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'admin-toast-container';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
  }
  return toastContainer;
}

export function showToast(message: string, durationMs: number = 3000): void {
  const container = ensureToastContainer();
  const toast = document.createElement('div');
  toast.className = 'admin-toast';
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.2s ease-out';
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 200);
  }, durationMs);
}
