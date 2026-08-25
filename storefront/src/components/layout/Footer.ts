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

  const linkGroups = (config?.footer?.linkGroups || [
    {
      heading: 'Quick Links',
      links: [
        { id: 'shop', label: 'Shop All', href: '#category-nav-container', visible: true, order: -1 },
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
          href: `https://maps.google.com/?q=${encodeURIComponent(config?.contact?.location || 'Bikaner, Rajasthan')}`,
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
  ]).map(group => ({ ...group, links: [...group.links] }));

  // Inject Shop All if not present
  if (linkGroups.length > 0 && !linkGroups[0].links.some(l => l.id === 'shop' || l.label.toLowerCase() === 'shop all')) {
    linkGroups[0].links.unshift({ id: 'shop', label: 'Shop All', href: '#category-nav-container', visible: true, order: -1 });
  }

  // Icon mapping for footer link prefixes
  const iconMap: Record<string, string> = {
    shop: 'icon-cart',
    story: 'icon-star',
    philosophy: 'icon-leaf',
    help: 'icon-mail',
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
            const isContentModal = !isExternal && cleanSlug !== '' && cleanSlug !== 'admin' && cleanSlug !== 'category-nav-container';
            const dataAttr = isContentModal ? `data-content-slug="${cleanSlug}"` : '';
            const iconName = iconMap[link.id];
            const iconHtml = iconName ? renderIcon(iconName, 14, iconName === 'icon-whatsapp' ? 'icon-filled footer-link-icon' : 'footer-link-icon') : '';

            return `
              <a
                href="${link.href}"
                class="footer-link body-sm"
                ${dataAttr}
                ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}
              >
                <span style="color: var(--color-brand-accent); opacity: 0.5;">|</span>
                ${iconHtml}
                <span>${link.label}</span>
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
                <span style="color: var(--color-brand-accent); opacity: 0.5;">|</span>
                ${renderIcon('icon-instagram', 14, 'footer-link-icon')}
                <span>Instagram</span>
              </a>
              <a href="https://wa.me/918560078208" target="_blank" rel="noopener noreferrer" class="footer-link body-sm">
                <span style="color: var(--color-brand-accent); opacity: 0.5;">|</span>
                ${renderIcon('icon-whatsapp', 14, 'icon-filled footer-link-icon')}
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
          <div class="footer-bottom-brand">${bottomText}</div>
          <div class="footer-bottom-motto">${bottomSubtext}</div>
          <div class="footer-bottom-links">
            <a href="#privacy" data-content-slug="privacy" class="footer-link caption">
              <span style="color: var(--color-brand-accent); opacity: 0.5;">|</span>
              ${renderIcon('icon-external-link', 12, 'footer-link-icon')}
              <span>Privacy Policy</span>
            </a>
            <span class="footer-bottom-divider">•</span>
            <a href="#terms" data-content-slug="terms" class="footer-link caption">
              <span style="color: var(--color-brand-accent); opacity: 0.5;">|</span>
              ${renderIcon('icon-external-link', 12, 'footer-link-icon')}
              <span>Terms of Service</span>
            </a>
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

  const shopAllLink = document.querySelector<HTMLAnchorElement>('.site-footer a[href="#category-nav-container"]');
  if (shopAllLink) {
    shopAllLink.addEventListener('click', (e) => {
      const target = document.getElementById('category-nav-container');
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, '', '#category-nav-container');
      }
    });
  }
}
