// ============================================================
// OMKARA Admin — Site Configuration View
// ============================================================

import type { SiteConfig } from 'shared/types/config';

export function renderConfigView(config: SiteConfig): string {
  return `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
        <div>
          <h2 class="heading-2" style="color: var(--color-brand-primary);">Site Configuration</h2>
          <p class="body-sm" style="color: var(--color-text-secondary); margin-top: 2px;">Control store messaging, WhatsApp ordering parameters, hero copy, and banners.</p>
        </div>
        <button type="button" class="btn btn-accent" id="btn-save-config">
          💾 Save Configuration
        </button>
      </div>

      <form id="site-config-form" style="display: flex; flex-direction: column; gap: var(--space-6);">
        <!-- 1. Brand & Identity -->
        <div class="admin-card">
          <h3 class="heading-4" style="color: var(--color-brand-primary); margin-bottom: var(--space-4);">Brand Identity</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
            <div class="form-group">
              <label class="form-label" for="cfg-brand-name">Brand Name</label>
              <input type="text" id="cfg-brand-name" class="form-input" value="${config.brandName || 'OMKARA'}" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="cfg-tagline">Brand Tagline</label>
              <input type="text" id="cfg-tagline" class="form-input" value="${config.tagline || 'SEHAT BHI. SWAAD BHI.'}" required />
            </div>
          </div>
        </div>

        <!-- 2. WhatsApp Ordering Setup -->
        <div class="admin-card">
          <h3 class="heading-4" style="color: var(--color-brand-primary); margin-bottom: var(--space-4);">WhatsApp Ordering Channel</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
            <div class="form-group">
              <label class="form-label" for="cfg-wa-number">Order WhatsApp Number (with country code, digits only)</label>
              <input type="text" id="cfg-wa-number" class="form-input" value="${config.whatsapp?.number || '918560078208'}" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="cfg-wa-enabled">Ordering System Status</label>
              <select id="cfg-wa-enabled" class="form-select">
                <option value="true" ${config.whatsapp?.enabled !== false ? 'selected' : ''}>Active (Receiving Orders)</option>
                <option value="false" ${config.whatsapp?.enabled === false ? 'selected' : ''}>Disabled / Closed</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="cfg-wa-greeting">Message Greeting</label>
            <input type="text" id="cfg-wa-greeting" class="form-input" value="${config.whatsapp?.greeting || '🙏 *New Order from OMKARA*\\n'}" />
          </div>
        </div>

        <!-- 3. Announcement Banner -->
        <div class="admin-card">
          <h3 class="heading-4" style="color: var(--color-brand-primary); margin-bottom: var(--space-4);">Announcement Banner</h3>
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: var(--space-4);">
            <div class="form-group">
              <label class="form-label" for="cfg-announce-text">Banner Text</label>
              <input type="text" id="cfg-announce-text" class="form-input" value="${config.announcement?.text || ''}" placeholder="e.g. 🌿 Free delivery on orders above ₹300 in Bikaner!" />
            </div>
            <div class="form-group">
              <label class="form-label" for="cfg-announce-style">Visual Style</label>
              <select id="cfg-announce-style" class="form-select">
                <option value="promo" ${config.announcement?.style === 'promo' ? 'selected' : ''}>Gold Promo</option>
                <option value="info" ${config.announcement?.style === 'info' ? 'selected' : ''}>Subtle Info</option>
                <option value="warning" ${config.announcement?.style === 'warning' ? 'selected' : ''}>Alert Warning</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="cfg-announce-visible">Visibility</label>
              <select id="cfg-announce-visible" class="form-select">
                <option value="true" ${config.announcement?.visible ? 'selected' : ''}>Visible</option>
                <option value="false" ${!config.announcement?.visible ? 'selected' : ''}>Hidden</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 4. Hero Section -->
        <div class="admin-card">
          <h3 class="heading-4" style="color: var(--color-brand-primary); margin-bottom: var(--space-4);">Hero Section</h3>
          <div class="form-group">
            <label class="form-label" for="cfg-hero-title">Headline</label>
            <input type="text" id="cfg-hero-title" class="form-input" value="${config.hero?.title || 'Rooted in the Heritage of Bikaner'}" />
          </div>
          <div class="form-group">
            <label class="form-label" for="cfg-hero-subtitle">Subtitle</label>
            <input type="text" id="cfg-hero-subtitle" class="form-input" value="${config.hero?.subtitle || 'SEHAT BHI. SWAAD BHI.'}" />
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
            <div class="form-group">
              <label class="form-label" for="cfg-hero-cta">CTA Button Text</label>
              <input type="text" id="cfg-hero-cta" class="form-input" value="${config.hero?.ctaText || 'Explore Menu'}" />
            </div>
            <div class="form-group">
              <label class="form-label" for="cfg-hero-visible">Hero Visibility</label>
              <select id="cfg-hero-visible" class="form-select">
                <option value="true" ${config.hero?.visible !== false ? 'selected' : ''}>Visible</option>
                <option value="false" ${config.hero?.visible === false ? 'selected' : ''}>Hidden</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 5. Contact Information -->
        <div class="admin-card">
          <h3 class="heading-4" style="color: var(--color-brand-primary); margin-bottom: var(--space-4);">Contact Info</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--space-4);">
            <div class="form-group">
              <label class="form-label" for="cfg-contact-phone">Phone</label>
              <input type="text" id="cfg-contact-phone" class="form-input" value="${config.contact?.phone || '8560078208'}" />
            </div>
            <div class="form-group">
              <label class="form-label" for="cfg-contact-email">Email</label>
              <input type="email" id="cfg-contact-email" class="form-input" value="${config.contact?.email || 'omkara.health.wellness@gmail.com'}" />
            </div>
            <div class="form-group">
              <label class="form-label" for="cfg-contact-loc">Location</label>
              <input type="text" id="cfg-contact-loc" class="form-input" value="${config.contact?.location || 'Bikaner, Rajasthan'}" />
            </div>
          </div>
        </div>
      </form>
    </div>
  `;
}

export function setupConfigView(
  currentConfig: SiteConfig,
  onSave: (updatedConfig: SiteConfig) => Promise<void>
): void {
  const saveBtn = document.getElementById('btn-save-config') as HTMLButtonElement | null;

  saveBtn?.addEventListener('click', async () => {
    const brandName = (document.getElementById('cfg-brand-name') as HTMLInputElement)?.value.trim() || 'OMKARA';
    const tagline = (document.getElementById('cfg-tagline') as HTMLInputElement)?.value.trim() || 'SEHAT BHI. SWAAD BHI.';
    const waNumber = (document.getElementById('cfg-wa-number') as HTMLInputElement)?.value.trim() || '918560078208';
    const waEnabled = (document.getElementById('cfg-wa-enabled') as HTMLSelectElement)?.value === 'true';
    const waGreeting = (document.getElementById('cfg-wa-greeting') as HTMLInputElement)?.value || '';

    const announceText = (document.getElementById('cfg-announce-text') as HTMLInputElement)?.value.trim() || '';
    const announceStyle = ((document.getElementById('cfg-announce-style') as HTMLSelectElement)?.value as 'promo' | 'info' | 'warning') || 'promo';
    const announceVisible = (document.getElementById('cfg-announce-visible') as HTMLSelectElement)?.value === 'true';

    const heroTitle = (document.getElementById('cfg-hero-title') as HTMLInputElement)?.value.trim() || '';
    const heroSubtitle = (document.getElementById('cfg-hero-subtitle') as HTMLInputElement)?.value.trim() || '';
    const heroCta = (document.getElementById('cfg-hero-cta') as HTMLInputElement)?.value.trim() || 'Explore Menu';
    const heroVisible = (document.getElementById('cfg-hero-visible') as HTMLSelectElement)?.value === 'true';

    const phone = (document.getElementById('cfg-contact-phone') as HTMLInputElement)?.value.trim() || '';
    const email = (document.getElementById('cfg-contact-email') as HTMLInputElement)?.value.trim() || '';
    const location = (document.getElementById('cfg-contact-loc') as HTMLInputElement)?.value.trim() || '';

    const newConfig: SiteConfig = {
      ...currentConfig,
      brandName,
      tagline,
      contact: {
        ...currentConfig.contact,
        phone,
        email,
        location,
        whatsappNumber: waNumber,
      },
      whatsapp: {
        ...currentConfig.whatsapp,
        number: waNumber,
        enabled: waEnabled,
        greeting: waGreeting,
      },
      announcement: {
        text: announceText,
        style: announceStyle,
        visible: announceVisible,
      },
      hero: {
        ...currentConfig.hero,
        title: heroTitle,
        subtitle: heroSubtitle,
        ctaText: heroCta,
        visible: heroVisible,
      },
      updatedAt: new Date().toISOString(),
    };

    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving Changes...';
    }

    try {
      await onSave(newConfig);
    } catch (err: unknown) {
      alert(`Failed to save config: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 Save Configuration';
      }
    }
  });
}
