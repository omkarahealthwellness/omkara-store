// ============================================================
// Site Configuration
// ============================================================

/** A navigation menu item */
export interface NavigationItem {
  /** Unique ID */
  id: string;
  /** Display label */
  label: string;
  /** Link target (relative path or external URL) */
  href: string;
  /** Whether this item is visible */
  visible: boolean;
  /** Display order */
  order: number;
}

/** A social media link */
export interface SocialLink {
  /** Platform name (e.g., "Instagram", "Facebook", "YouTube") */
  platform: string;
  /** Full URL */
  url: string;
  /** Display handle/username */
  handle: string;
  /** Whether visible on storefront */
  visible: boolean;
  /** Display order */
  order: number;
}

/** Contact information */
export interface ContactInfo {
  /** WhatsApp phone number (digits only, e.g., "918560078208") */
  whatsappNumber: string;
  /** Display phone number */
  phone: string;
  /** Email address */
  email: string;
  /** Physical address / location */
  location: string;
  /** Social media links */
  socialLinks: SocialLink[];
}

/** WhatsApp ordering configuration */
export interface WhatsAppConfig {
  /** The phone number for wa.me link (with country code, e.g., "918560078208") */
  number: string;
  /** Greeting text at the top of the order message */
  greeting: string;
  /** Closing text at the bottom of the order message */
  closing: string;
  /** Whether WhatsApp ordering is enabled */
  enabled: boolean;
}

/** Hero section configuration */
export interface HeroConfig {
  /** CDN URL for hero image */
  imageUrl: string;
  /** Mobile-specific hero image URL (optional) */
  mobileImageUrl: string;
  /** Hero title text */
  title: string;
  /** Hero subtitle text */
  subtitle: string;
  /** CTA button text */
  ctaText: string;
  /** CTA button link */
  ctaLink: string;
  /** Whether the hero is visible */
  visible: boolean;
}

/** Footer section link group */
export interface FooterLinkGroup {
  /** Group heading (e.g., "COMPANY", "SUPPORT") */
  heading: string;
  /** Links in this group */
  links: NavigationItem[];
}

/** Footer configuration */
export interface FooterConfig {
  /** Brand tagline in footer */
  tagline: string;
  /** Brand description in footer */
  description: string;
  /** Link groups (Company, Support, etc.) */
  linkGroups: FooterLinkGroup[];
  /** Bottom-line text (e.g., "OMKARA · BIKANER, RAJASTHAN") */
  bottomText: string;
  /** Secondary bottom text (e.g., "NOURISH • BALANCE • THRIVE") */
  bottomSubtext: string;
}

/** Announcement banner configuration */
export interface AnnouncementConfig {
  /** Banner text */
  text: string;
  /** Whether the announcement is visible */
  visible: boolean;
  /** Visual style: info, warning, promo */
  style: 'info' | 'warning' | 'promo';
}

/** Master site configuration — stored as a single Firestore document */
export interface SiteConfig {
  /** Brand name */
  brandName: string;
  /** Brand tagline */
  tagline: string;
  /** Contact information */
  contact: ContactInfo;
  /** WhatsApp ordering config */
  whatsapp: WhatsAppConfig;
  /** Hero section */
  hero: HeroConfig;
  /** Footer */
  footer: FooterConfig;
  /** Main navigation items */
  navigation: NavigationItem[];
  /** Announcement banner */
  announcement: AnnouncementConfig;
  /** Global customer notes setting */
  globalNotesEnabled: boolean;
  /** Global notes placeholder */
  globalNotesPlaceholder: string;
  /** Global notes max length */
  globalNotesMaxLength: number;
  /** Admin-managed tag library */
  availableTags: string[];
  /** Last updated timestamp */
  updatedAt: string;
}
