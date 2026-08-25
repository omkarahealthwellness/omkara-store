// ============================================================
// OMKARA Admin — Login View
// ============================================================

export function renderLoginView(): string {
  return `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at center, var(--color-surface-secondary) 0%, var(--color-surface-dark) 100%); padding: var(--space-4);">
      <div style="background-color: var(--color-surface-elevated); border-radius: var(--radius-xl); padding: var(--space-8); width: 100%; max-width: 420px; box-shadow: var(--shadow-xl); border: 1px solid var(--color-border-subtle);">
        <div style="text-align: center; margin-bottom: var(--space-8);">
          <h1 class="heading-2 brand-name" style="color: var(--color-brand-primary); margin-bottom: var(--space-2);">
            <span style="color: var(--color-brand-accent);">ॐ</span> OMKARA
          </h1>
          <p class="caption" style="color: var(--color-brand-accent); letter-spacing: 0.15em; font-weight: var(--weight-bold);">ADMIN CONTROL PORTAL</p>
        </div>

        <form id="admin-login-form">
          <div id="login-error-msg" style="display: none; padding: var(--space-3); background-color: rgba(192, 57, 43, 0.1); border: 1px solid rgba(192, 57, 43, 0.3); border-radius: var(--radius-md); color: var(--color-error); font-size: var(--text-xs); margin-bottom: var(--space-4);"></div>

          <div class="form-group">
            <label class="form-label" for="login-email">Email Address</label>
            <input
              type="email"
              id="login-email"
              class="form-input"
              placeholder="admin@omkara.com"
              required
              autocomplete="email"
            />
          </div>

          <div class="form-group" style="margin-bottom: var(--space-6);">
            <label class="form-label" for="login-password">Password</label>
            <input
              type="password"
              id="login-password"
              class="form-input"
              placeholder="••••••••"
              required
              autocomplete="current-password"
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            id="login-submit-btn"
            style="width: 100%; padding-block: var(--space-3); font-size: var(--text-base);"
          >
            Sign In to Dashboard
          </button>
        </form>

        <div style="margin-top: var(--space-6); text-align: center; border-top: 1px solid var(--color-border-subtle); padding-top: var(--space-4);">
          <p class="caption" style="color: var(--color-text-tertiary); margin-top: var(--space-2);">Secure Access Only</p>
        </div>
      </div>
    </div>
  `;
}

export function setupLoginView(
  onLogin: (email: string, pass: string) => Promise<void>,
  onDemoBypass: () => void
): void {
  const form = document.getElementById('admin-login-form') as HTMLFormElement | null;
  const emailInput = document.getElementById('login-email') as HTMLInputElement | null;
  const passInput = document.getElementById('login-password') as HTMLInputElement | null;
  const errorMsg = document.getElementById('login-error-msg');
  const submitBtn = document.getElementById('login-submit-btn') as HTMLButtonElement | null;
  const demoBtn = document.getElementById('demo-login-btn');

  demoBtn?.addEventListener('click', () => {
    onDemoBypass();
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!emailInput || !passInput) return;

    if (errorMsg) errorMsg.style.display = 'none';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Authenticating...';
    }

    try {
      await onLogin(emailInput.value.trim(), passInput.value);
    } catch (err: unknown) {
      if (errorMsg) {
        const message = err instanceof Error ? err.message : 'Invalid credentials. Please check your email and password.';
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In to Dashboard';
      }
    }
  });
}
