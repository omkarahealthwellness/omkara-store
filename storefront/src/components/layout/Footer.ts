// ============================================================
// OMKARA Storefront — Dynamic Footer Component
// ============================================================

import type { SiteConfig } from 'shared/types/config';
import { renderIcon } from '../ui/Icon';

export function renderFooter(config?: SiteConfig): string {
  const brandName = config?.brandName || 'OMKARA';
  const tagline = config?.footer?.tagline || config?.tagline || 'SEHAT BHI. SWAAD BHI.';
  const description =
    config?.footer?.description ||
    'Rooted in the heritage of Bikaner, delivering premium health and wellness directly to you.';
  const bottomText = config?.footer?.bottomText || 'OMKARA · BIKANER, RAJASTHAN';
  const bottomSubtext = config?.footer?.bottomSubtext || 'NOURISH • BALANCE • LONGEVITY';

  const linkGroups = config?.footer?.linkGroups || [
    {
      heading: 'Quick Links',
      links: [
        { id: 'story', label: 'Our Story', href: '#story', visible: true, order: 0 },
        { id: 'philosophy', label: 'Philosophy', href: '#philosophy', visible: true, order: 1 },
        { id: 'help', label: 'Help & FAQ', href: '#help', visible: true, order: 2 },
      ],
    },
    {
      heading: 'Contact & Support',
      links: [
        {
          id: 'whatsapp',
          label: 'WhatsApp: 8560078208',
          href: `https://wa.me/${config?.contact?.whatsappNumber || '918560078208'}`,
          visible: true,
          order: 0,
        },
        {
          id: 'location',
          label: config?.contact?.location || 'Bikaner, Rajasthan',
          href: '#',
          visible: true,
          order: 1,
        },
        {
          id: 'email',
          label: config?.contact?.email || 'omkara.health.wellness@gmail.com',
          href: `mailto:${config?.contact?.email || 'omkara.health.wellness@gmail.com'}`,
          visible: true,
          order: 2,
        },
      ],
    },
  ];

  // Icon mapping for footer link prefixes
  const iconMap: Record<string, string> = {
    whatsapp: 'icon-whatsapp',
    location: 'icon-map-pin',
    email: 'icon-mail',
    phone: 'icon-phone',
  };

    const linkGroupsHtml = linkGroups
      .map((group) => {
        const linksHtml = group.links
          .filter((l) => l.visible !== false && !l.label.includes('Admin Portal'))
          .map((link) => {
            const isExternal = link.href.startsWith('http') || link.href.startsWith('mailto:') || link.href.startsWith('tel:');
            const cleanSlug = link.href.replace(/^[#/]+/, '');
            const isContentModal = !isExternal && cleanSlug !== '' && cleanSlug !== 'admin';
            const dataAttr = isContentModal ? `data-content-slug="${cleanSlug}"` : '';
            const iconName = iconMap[link.id];
            const iconHtml = iconName ? renderIcon(iconName, 14, iconName === 'icon-whatsapp' ? 'icon-filled footer-link-icon' : 'footer-link-icon') + ' ' : '';

            return `
              <a
                href="${link.href}"
                class="footer-link body-sm"
                ${dataAttr}
                ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}
              >
                ${iconHtml}${link.label}
              </a>
            `;
          })
          .join('');

      return `
        <div class="footer-section">
          <h4 class="footer-heading label">${group.heading}</h4>
          ${linksHtml}
        </div>
      `;
    })
    .join('');

  return `
    <footer class="site-footer" id="site-footer">
      <div class="container">
        <div class="footer-grid">
          <!-- Brand Section -->
          <div class="footer-section" style="max-width: 320px;">
            <h3 class="footer-brand-name heading-3 brand-name" style="color: #FFFFF0;">
              <img src="/assets/icon-192.svg" alt="" width="24" height="24" class="footer-logo-img" style="filter: brightness(0) invert(1);" />
              ${brandName}
            </h3>
            <p class="tagline footer-tagline">${tagline}</p>
            <p class="body-sm footer-description">${description}</p>
          </div>

          ${linkGroupsHtml}

          <!-- Social Links -->
          <div class="footer-section">
            <h4 class="footer-heading label">Connect</h4>
            <div style="display: flex; flex-direction: column; gap: var(--space-2);">
              <a href="https://instagram.com/omkara.health.bkn" target="_blank" rel="noopener noreferrer" class="footer-link body-sm">
                ${renderIcon('icon-instagram', 14, 'footer-link-icon')} Instagram
              </a>
              <a href="https://wa.me/918560078208" target="_blank" rel="noopener noreferrer" class="footer-link body-sm">
                ${renderIcon('icon-whatsapp', 14, 'icon-filled footer-link-icon')} WhatsApp
              </a>
            </div>
          </div>
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
          <div class="footer-bottom-brand">${bottomText}</div>
          <div class="footer-bottom-motto">${bottomSubtext}</div>
          <div class="footer-bottom-links">
            <a href="#privacy" data-content-slug="privacy" class="footer-link caption">Privacy Policy</a>
            <span class="footer-bottom-divider">•</span>
            <a href="#terms" data-content-slug="terms" class="footer-link caption">Terms of Service</a>
          </div>
          <p class="caption footer-copyright">&copy; ${new Date().getFullYear()} ${brandName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `;
}

/**
 * Setup footer content modal triggers
 */
export function setupFooter(onOpenPage: (slug: string) => void): void {
  const contentLinks = document.querySelectorAll<HTMLElement>('[data-content-slug]');
  contentLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const slug = link.dataset.contentSlug;
      if (slug) {
        onOpenPage(slug);
      }
    });
  });
}
