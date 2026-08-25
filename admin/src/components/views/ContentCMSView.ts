// ============================================================
// OMKARA Admin — Content Pages CMS View
// ============================================================

import type { ContentPage } from 'shared/types/content';

export function renderContentCMSView(pages: ContentPage[], activeSlug: string = 'about'): string {
  const activePage = pages.find((p) => p.slug === activeSlug || p.id === activeSlug) || pages[0] || {
    id: 'about',
    slug: 'about',
    title: 'Our Story',
    subtitle: 'Born in Bikaner. Built for Wellness.',
    body: '',
    excerpt: '',
    imageUrl: '',
    seoTitle: '',
    seoDescription: '',
    sortOrder: 0,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
        <div>
          <h2 class="heading-2" style="color: var(--color-brand-primary);">Content Management (CMS)</h2>
          <p class="body-sm" style="color: var(--color-text-secondary); margin-top: 2px;">Edit brand narrative, philosophy, FAQ, and customer education copy.</p>
        </div>
        <button type="button" class="btn btn-accent" id="btn-save-content-page">
          💾 Save & Publish Page
        </button>
      </div>

      <!-- Page Tabs -->
      <div style="display: flex; gap: var(--space-2); margin-bottom: var(--space-6);">
        ${pages
          .map(
            (p) => `
          <button
            type="button"
            class="btn ${p.slug === activePage.slug ? 'btn-primary' : 'btn-secondary'} btn-sm page-tab-btn"
            data-page-slug="${p.slug || p.id}"
          >
            ${p.title || p.slug}
          </button>
        `
          )
          .join('')}
      </div>

      <!-- Editor Card -->
      <div class="admin-card">
        <form id="content-page-form" style="display: flex; flex-direction: column; gap: var(--space-4);">
          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-4);">
            <div class="form-group">
              <label class="form-label" for="page-title">Page Title</label>
              <input type="text" id="page-title" class="form-input" value="${activePage.title || ''}" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="page-slug">Slug / Identifier</label>
              <input type="text" id="page-slug" class="form-input" value="${activePage.slug || activePage.id}" readonly style="background-color: var(--color-surface-secondary);" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="page-subtitle">Subtitle / Tagline</label>
            <input type="text" id="page-subtitle" class="form-input" value="${activePage.subtitle || ''}" />
          </div>

          <div class="form-group">
            <label class="form-label" for="page-image">Banner Image URL</label>
            <input type="url" id="page-image" class="form-input" value="${activePage.imageUrl || ''}" placeholder="https://... /assets/..." />
          </div>

          <div class="form-group">
            <label class="form-label" for="page-body">Page Body Content (HTML / Rich Text)</label>
            <textarea id="page-body" class="form-textarea" rows="12" style="font-family: var(--font-mono); font-size: var(--text-xs);" placeholder="<p>Paragraph content...</p>">${activePage.body || ''}</textarea>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
            <div class="form-group">
              <label class="form-label" for="page-seo-title">SEO Meta Title</label>
              <input type="text" id="page-seo-title" class="form-input" value="${activePage.seoTitle || ''}" />
            </div>
            <div class="form-group">
              <label class="form-label" for="page-seo-desc">SEO Meta Description</label>
              <input type="text" id="page-seo-desc" class="form-input" value="${activePage.seoDescription || ''}" />
            </div>
          </div>
        </form>
      </div>
    </div>
  `;
}

export function setupContentCMSView(
  _pages: ContentPage[],
  activeSlug: string,
  onSwitchTab: (slug: string) => void,
  onSavePage: (pageId: string, data: Omit<ContentPage, 'id'>) => Promise<void>
): void {
  const tabBtns = document.querySelectorAll<HTMLButtonElement>('.page-tab-btn');
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const slug = btn.dataset.pageSlug;
      if (slug && slug !== activeSlug) {
        onSwitchTab(slug);
      }
    });
  });

  const saveBtn = document.getElementById('btn-save-content-page') as HTMLButtonElement | null;
  saveBtn?.addEventListener('click', async () => {
    const titleInput = document.getElementById('page-title') as HTMLInputElement | null;
    const slugInput = document.getElementById('page-slug') as HTMLInputElement | null;
    const subInput = document.getElementById('page-subtitle') as HTMLInputElement | null;
    const imgInput = document.getElementById('page-image') as HTMLInputElement | null;
    const bodyInput = document.getElementById('page-body') as HTMLTextAreaElement | null;
    const seoTitleInput = document.getElementById('page-seo-title') as HTMLInputElement | null;
    const seoDescInput = document.getElementById('page-seo-desc') as HTMLInputElement | null;

    const pageId = slugInput?.value.trim() || activeSlug;
    const now = new Date().toISOString();

    const pageData: Omit<ContentPage, 'id'> = {
      title: titleInput?.value.trim() || 'Untitled Page',
      subtitle: subInput?.value.trim() || '',
      slug: pageId,
      body: bodyInput?.value || '',
      excerpt: '',
      imageUrl: imgInput?.value.trim() || '',
      seoTitle: seoTitleInput?.value.trim() || '',
      seoDescription: seoDescInput?.value.trim() || '',
      sortOrder: 0,
      status: 'published',
      createdAt: now,
      updatedAt: now,
    };

    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Publishing...';
    }

    try {
      await onSavePage(pageId, pageData);
    } catch (err: unknown) {
      alert(`Failed to save page: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 Save & Publish Page';
      }
    }
  });
}
