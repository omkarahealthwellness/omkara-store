// ============================================================
// OMKARA Storefront — Hero & Announcement Banner
// ============================================================

import type { HeroConfig, AnnouncementConfig } from 'shared/types/config';
import { renderIcon } from '../ui/Icon';

export function renderHero(
  hero?: HeroConfig,
  announcement?: AnnouncementConfig,
  tagline: string = 'SEHAT BHI. SWAAD BHI.'
): string {
  const announcementHtml =
    announcement && announcement.visible && announcement.text
      ? `
      <div class="announcement-bar announcement-${announcement.style || 'promo'}" id="announcement-bar">
        <span>${announcement.text}</span>
      </div>
    `
      : '';

  if (hero && !hero.visible) {
    return announcementHtml;
  }

  // User asked for an image banner via jsdelivr link
  const bannerImage = 'https://cdn.jsdelivr.net/gh/omkarahealthwellness/omkara-cdn@main/banner.jpg';
  const ctaLink = hero?.ctaLink || '#category-nav-container';

  return `
    ${announcementHtml}
    <section class="hero" id="hero-section" style="padding-block: 0; position: relative;">
      <a href="${ctaLink}" id="hero-cta-btn" style="display: block; width: 100%; text-decoration: none;">
        <img src="${bannerImage}" alt="OMKARA Hero Banner" style="width: 100%; height: auto; max-height: 60vh; object-fit: cover; display: block;" onerror="this.src='/assets/placeholder.webp'" />
      </a>
    </section>
  `;
}

/**
 * Wire hero CTA button smooth scrolling
 */
export function setupHero(): void {
  const cta = document.getElementById('hero-cta-btn');
  if (cta) {
    cta.addEventListener('click', (e) => {
      const targetHref = cta.getAttribute('href');
      if (targetHref && targetHref.startsWith('#')) {
        e.preventDefault();
        const targetEl = document.querySelector(targetHref);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
}
