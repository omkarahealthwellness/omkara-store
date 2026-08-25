// ============================================================
// OMKARA Storefront — Hero & Announcement Banner
// ============================================================

import type { HeroConfig, AnnouncementConfig } from 'shared/types/config';


export function renderHero(
  hero?: HeroConfig,
  announcement?: AnnouncementConfig
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

  // User asked for an image banner, read from config with a fallback
  const bannerImage = hero?.imageUrl || 'https://cdn.jsdelivr.net/gh/omkarahealthwellness/omkara-cdn@main/banner.jpg';
  const mobileBannerImage = hero?.mobileImageUrl || bannerImage;
  const ctaLink = hero?.ctaLink || '#category-nav-container';

  return `
    ${announcementHtml}
    <section class="hero" id="hero-section" style="padding-block: 0; position: relative;">
      <a href="${ctaLink}" id="hero-cta-btn" style="display: block; width: 100%; text-decoration: none;">
        <style>
          .hero-banner-mobile { display: none !important; }
          .hero-banner-desktop { display: block !important; width: 100%; height: auto; object-fit: cover; }
          @media (max-width: 767px) {
            .hero-banner-desktop { display: none !important; }
            .hero-banner-mobile { display: block !important; width: 100%; height: auto; object-fit: cover; }
          }
        </style>
        <img src="${bannerImage}" alt="OMKARA Hero Banner" class="hero-banner-desktop" onerror="this.onerror=null; this.src='/assets/placeholder.webp'" />
        <img src="${mobileBannerImage}" alt="OMKARA Hero Banner Mobile" class="hero-banner-mobile" onerror="this.onerror=null; this.src='/assets/placeholder.webp'" />
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
