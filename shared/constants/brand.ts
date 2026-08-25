// ============================================================
// Brand Constants
// ============================================================
// Default values for OMKARA branding. These are used as initial
// seed data and fallbacks — the live values come from Firebase.
// ============================================================

export const BRAND = {
  name: 'OMKARA',
  tagline: 'SEHAT BHI. SWAAD BHI.',
  description: 'Fresh food & wellness from Bikaner.',
  motto: 'NOURISH • BALANCE • THRIVE',
  location: 'Bikaner, Rajasthan',
} as const;

export const DEFAULT_CONTACT = {
  whatsappNumber: '918560078208',
  phone: '8560078208',
  email: 'omkara.health.wellness@gmail.com',
  location: 'Bikaner, Rajasthan',
  instagram: {
    handle: 'omkara.health.bkn',
    url: 'https://instagram.com/omkara.health.bkn',
  },
} as const;

export const WHATSAPP_BASE_URL = 'https://wa.me/';
