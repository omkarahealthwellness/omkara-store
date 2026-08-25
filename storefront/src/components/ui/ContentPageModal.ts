// ============================================================
// OMKARA Storefront — Supporting Content Modal
// ============================================================
// Displays About Us, Philosophy, Help & FAQ, Terms, Privacy.
// ============================================================

import { getContentPageById } from 'shared/dal/content';
import { SEED_CONTENT_PAGES } from 'shared/seed/data';
import type { ContentPage } from 'shared/types/content';
import { openModal } from './Modal';

/**
 * Open a supporting content page in the modal dialog.
 */
export async function openContentPageModal(slug: string): Promise<void> {
  let pageData: ContentPage | null = null;

  try {
    pageData = await getContentPageById(slug);
  } catch (err) {
    console.info('[OMKARA] Using seed content page fixture:', err);
  }

  if (!pageData) {
    pageData = SEED_CONTENT_PAGES.find((p) => p.slug === slug || p.id === slug) || null;
  }

  if (!pageData) {
    // Basic fallback for standard links
    const titleMap: Record<string, string> = {
      about: 'Our Story',
      philosophy: 'Our Philosophy',
      help: 'Help & Support',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      contact: 'Contact Us',
    };

    pageData = {
      id: slug,
      slug,
      title: titleMap[slug] || 'Information',
      subtitle: 'SEHAT BHI. SWAAD BHI.',
      body: `<p>OMKARA — Handcrafted with love and rooted in the pure food traditions of Bikaner, Rajasthan.</p><p>For inquiries, please message us on WhatsApp or call <strong>8560078208</strong>.</p>`,
      excerpt: '',
      imageUrl: '',
      seoTitle: '',
      seoDescription: '',
      sortOrder: 0,
      status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const contentHtml = `
    <div class="content-page-modal" style="padding-bottom: var(--space-4);">
      <header style="margin-bottom: var(--space-6);">
        <h2 class="heading-2" style="color: var(--color-brand-primary); margin-bottom: var(--space-2);">${pageData.title}</h2>
        ${pageData.subtitle ? `<p class="body-sm" style="color: var(--color-brand-accent); font-weight: var(--weight-medium);">${pageData.subtitle}</p>` : ''}
      </header>

      ${
        pageData.imageUrl
          ? `
        <div style="margin-bottom: var(--space-6); border-radius: var(--radius-md); overflow: hidden;">
          <img src="${pageData.imageUrl}" alt="${pageData.title}" style="width: 100%; height: auto; display: block; object-fit: cover;" onerror="this.parentElement.style.display='none';" />
        </div>
      `
          : ''
      }

      <div class="content-page-body body" style="line-height: var(--leading-relaxed); color: var(--color-text-primary); display: flex; flex-direction: column; gap: var(--space-4);">
        ${pageData.body}
      </div>
    </div>
  `;

  openModal(contentHtml);
}
