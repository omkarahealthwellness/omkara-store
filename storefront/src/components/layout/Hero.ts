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

  const title = hero?.title || 'Rooted in the Heritage of Bikaner';
  const formattedTitle = title.replace(/\\n|\n/g, '<br/>');
  const subtitle = hero?.subtitle || tagline;
  const ctaText = hero?.ctaText || 'Explore Menu';
  const ctaLink = hero?.ctaLink || '#category-nav-container';

  return `
    ${announcementHtml}
    <section class="hero" id="hero-section">
      <div class="hero-grain"></div>
      <div class="container hero-content">
        <h2 class="heading-2 animate-fade-in-up hero-title">${formattedTitle}</h2>
        <p class="tagline animate-fade-in-up hero-subtitle" style="animation-delay: 0.1s;">${subtitle}</p>
        <a href="${ctaLink}" class="hero-cta-btn animate-fade-in-up" id="hero-cta-btn" style="animation-delay: 0.2s;">
          <span>${ctaText}</span>
          ${renderIcon('icon-chevron-down', 18)}
        </a>
      </div>
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
