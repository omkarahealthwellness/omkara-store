// ============================================================
// OMKARA — Seed Data Script
// ============================================================
// Run this from the storefront dev console or as a standalone
// script to populate Firestore with realistic dev data.
//
// Usage: import { seedAll } from '@shared/seed/data'
//        await seedAll()
//
// Idempotent: Uses fixed document IDs so re-running overwrites.
// ============================================================

import { createCategory } from '../dal/categories';
import { createProduct } from '../dal/products';
import { initializeSiteConfig } from '../dal/config';
import { createContentPage } from '../dal/content';
import type { Category } from '../types/category';
import type { Product } from '../types/product';
import type { SiteConfig } from '../types/config';
import type { ContentPage } from '../types/content';

// ── Site Config ───────────────────────────────────────────────

const siteConfig: SiteConfig = {
  brandName: 'OMKARA',
  tagline: 'SEHAT BHI. SWAAD BHI.',
  contact: {
    whatsappNumber: '918560078208',
    phone: '8560078208',
    email: 'omkara.health.wellness@gmail.com',
    location: 'Bikaner, Rajasthan',
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/omkara.health.bkn', handle: 'omkara.health.bkn', visible: true, order: 0 },
      { platform: 'WhatsApp', url: 'https://wa.me/918560078208', handle: '8560078208', visible: true, order: 1 },
    ],
  },
  whatsapp: {
    number: '918560078208',
    greeting: '🙏 *New Order from OMKARA*\n',
    closing: '\n— Sent from OMKARA Menu',
    enabled: true,
  },
  hero: {
    imageUrl: '/assets/hero_bg.webp',
    mobileImageUrl: '/assets/hero_bg.webp',
    title: 'Nourish Your Body,\nHonor Your Roots',
    subtitle: 'Premium health foods crafted with Bikaneri tradition',
    ctaText: 'Explore Menu',
    ctaLink: '#menu',
    visible: true,
  },
  footer: {
    tagline: 'SEHAT BHI. SWAAD BHI.',
    description: 'Rooted in the heritage of Bikaner, delivering premium health and wellness directly to you.',
    linkGroups: [
      {
        heading: 'Quick Links',
        links: [
          { id: 'home', label: 'Home', href: '/', visible: true, order: 0 },
          { id: 'shop', label: 'Shop All', href: '#menu', visible: true, order: 1 },
          { id: 'story', label: 'Our Story', href: '/about', visible: true, order: 2 },
          { id: 'admin', label: 'Admin Portal 🔒', href: '/admin', visible: true, order: 3 },
        ],
      },
      {
        heading: 'Support & Contact',
        links: [
          { id: 'whatsapp', label: 'WhatsApp Support', href: 'https://wa.me/918560078208', visible: true, order: 0 },
          { id: 'call', label: 'Call Us', href: 'tel:+918560078208', visible: true, order: 1 },
          { id: 'email', label: 'Email Support', href: 'mailto:omkara.health.wellness@gmail.com', visible: true, order: 2 },
        ],
      },
    ],
    bottomText: 'OMKARA · BIKANER, RAJASTHAN',
    bottomSubtext: 'NOURISH • BALANCE • LONGEVITY',
  },
  navigation: [
    { id: 'home', label: 'Home', href: '/', visible: true, order: 0 },
    { id: 'menu', label: 'Menu', href: '#menu', visible: true, order: 1 },
    { id: 'cart', label: 'Cart', href: '#cart', visible: true, order: 2 },
  ],
  announcement: {
    text: '🌿 Free delivery on orders above ₹300 in Bikaner!',
    visible: true,
    style: 'promo',
  },
  globalNotesEnabled: true,
  globalNotesPlaceholder: 'Any special instructions for your order?',
  globalNotesMaxLength: 500,
  availableTags: ['bestseller', 'new', 'vegan', 'protein', 'regional', 'premium', 'seasonal', 'fusion', 'light', 'detox', 'gluten-free', 'dairy-free', 'no-sugar', 'baked'],
  updatedAt: new Date().toISOString(),
};

// ── Categories ────────────────────────────────────────────────

const categories: Record<string, Omit<Category, 'id'>> = {
  sprouts: {
    name: 'Sprouts',
    description: 'Farm-fresh sprouted legumes & grains, packed with living nutrition.',
    sortOrder: 0,
    color: '#4A7C59',
    accentColor: '#8FBC8F',
    imageUrl: 'https://cdn.jsdelivr.net/gh/user/omkara-cdn/categories/sprouts.webp',
    iconUrl: 'https://cdn.jsdelivr.net/gh/user/omkara-cdn/icons/sprouts.svg',
    status: 'published',
    availability: 'available',
    productCount: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  salads: {
    name: 'Salads',
    description: 'Crisp, vibrant salad bowls dressed with signature Bikaneri flavors.',
    sortOrder: 1,
    color: '#2E8B57',
    accentColor: '#66CDAA',
    imageUrl: 'https://cdn.jsdelivr.net/gh/user/omkara-cdn/categories/salads.webp',
    iconUrl: 'https://cdn.jsdelivr.net/gh/user/omkara-cdn/icons/salads.svg',
    status: 'published',
    availability: 'available',
    productCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  smoothies: {
    name: 'Smoothies',
    description: 'Thick, creamy blends of seasonal fruits, seeds & natural sweeteners.',
    sortOrder: 2,
    color: '#CD853F',
    accentColor: '#DEB887',
    imageUrl: 'https://cdn.jsdelivr.net/gh/user/omkara-cdn/categories/smoothies.webp',
    iconUrl: 'https://cdn.jsdelivr.net/gh/user/omkara-cdn/icons/smoothies.svg',
    status: 'published',
    availability: 'available',
    productCount: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  snacks: {
    name: 'Healthy Snacks',
    description: 'Guilt-free munching — roasted, baked, never fried.',
    sortOrder: 3,
    color: '#B8860B',
    accentColor: '#DAA520',
    imageUrl: 'https://cdn.jsdelivr.net/gh/user/omkara-cdn/categories/snacks.webp',
    iconUrl: 'https://cdn.jsdelivr.net/gh/user/omkara-cdn/icons/snacks.svg',
    status: 'published',
    availability: 'available',
    productCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

// ── Products ──────────────────────────────────────────────────

const defaultNotesConfig = {
  enabled: true,
  placeholder: 'Any special instructions?',
  maxLength: 200,
};

const products: Record<string, Omit<Product, 'id'>> = {
  // ── Sprouts ──
  'moong-sprout-bowl': {
    name: 'Moong Sprout Bowl',
    categoryId: 'sprouts',
    description: 'Freshly sprouted moong dal tossed with diced onions, tomatoes, green chillies, lemon juice, and a dusting of chaat masala. Light, protein-packed, and perfect for any time of day.',
    shortDescription: 'Classic sprouted moong with chaat masala kick',
    ingredients: ['Sprouted Moong Dal', 'Onion', 'Tomato', 'Lemon', 'Green Chilli', 'Chaat Masala', 'Coriander'],
    imageUrl: 'https://cdn.jsdelivr.net/gh/user/omkara-cdn/products/moong-sprout-bowl.webp',
    additionalImages: [],
    tags: ['bestseller', 'protein', 'vegan'],
    variants: [
      { id: 'small', label: 'Regular', price: 60, description: 'Single serving', isDefault: true, availability: 'available', sortOrder: 0 },
      { id: 'large', label: 'Family', price: 150, description: 'Serves 3-4', isDefault: false, availability: 'available', sortOrder: 1 },
    ],
    addons: [
      { id: 'extra-lemon', name: 'Extra Lemon', price: 10, description: '', availability: 'available', selectionType: 'multiple', required: false, sortOrder: 0 },
      { id: 'peanuts', name: 'Roasted Peanuts', price: 20, description: 'Crunchy protein boost', availability: 'available', selectionType: 'multiple', required: false, sortOrder: 1 },
    ],
    notesConfig: defaultNotesConfig,
    availability: 'available',
    sortOrder: 0,
    isFeatured: true,
    isNew: false,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'mixed-sprout-chaat': {
    name: 'Mixed Sprout Chaat',
    categoryId: 'sprouts',
    description: 'A hearty mix of sprouted moong, chana, and matki, tossed in our signature spice blend with pomegranate and fresh mint.',
    shortDescription: 'Triple-sprout chaat with pomegranate & mint',
    ingredients: ['Sprouted Moong', 'Sprouted Chana', 'Sprouted Matki', 'Pomegranate', 'Mint', 'Spice Blend'],
    imageUrl: 'https://cdn.jsdelivr.net/gh/user/omkara-cdn/products/mixed-sprout-chaat.webp',
    additionalImages: [],
    tags: ['protein', 'vegan'],
    variants: [
      { id: 'regular', label: 'Regular', price: 80, description: '', isDefault: true, availability: 'available', sortOrder: 0 },
    ],
    addons: [],
    notesConfig: defaultNotesConfig,
    availability: 'available',
    sortOrder: 1,
    isFeatured: false,
    isNew: true,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'sprouted-moth-salad': {
    name: 'Sprouted Moth Salad',
    categoryId: 'sprouts',
    description: 'A Bikaner specialty — moth beans sprouted overnight, seasoned with raw mustard oil, green chilli, and rock salt. Simple. Powerful.',
    shortDescription: 'Bikaneri-style moth with mustard oil',
    ingredients: ['Sprouted Moth', 'Mustard Oil', 'Green Chilli', 'Rock Salt', 'Onion'],
    imageUrl: 'https://cdn.jsdelivr.net/gh/user/omkara-cdn/products/sprouted-moth-salad.webp',
    additionalImages: [],
    tags: ['regional', 'protein'],
    variants: [
      { id: 'regular', label: 'Regular', price: 70, description: '', isDefault: true, availability: 'available', sortOrder: 0 },
    ],
    addons: [],
    notesConfig: defaultNotesConfig,
    availability: 'available',
    sortOrder: 2,
    isFeatured: false,
    isNew: false,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'paneer-sprout-bowl': {
    name: 'Paneer Sprout Power Bowl',
    categoryId: 'sprouts',
    description: 'Premium sprouted moong loaded with cubed paneer, cherry tomatoes, cucumber, and a drizzle of herbed yogurt dressing.',
    shortDescription: 'Protein-loaded sprouts with paneer & yogurt drizzle',
    ingredients: ['Sprouted Moong', 'Paneer', 'Cherry Tomatoes', 'Cucumber', 'Yogurt Dressing', 'Herbs'],
    imageUrl: 'https://cdn.jsdelivr.net/gh/user/omkara-cdn/products/paneer-sprout-bowl.webp',
    additionalImages: [],
    tags: ['premium', 'protein', 'vegetarian'],
    variants: [
      { id: 'regular', label: 'Regular', price: 120, description: '', isDefault: true, availability: 'available', sortOrder: 0 },
      { id: 'xl', label: 'XL Bowl', price: 180, description: 'Extra paneer, double portion', isDefault: false, availability: 'available', sortOrder: 1 },
    ],
    addons: [
      { id: 'extra-paneer', name: 'Extra Paneer', price: 40, description: '', availability: 'available', selectionType: 'multiple', required: false, sortOrder: 0 },
    ],
    notesConfig: defaultNotesConfig,
    availability: 'temporarily_unavailable',
    sortOrder: 3,
    isFeatured: false,
    isNew: false,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ── Salads ──
  'garden-fresh-salad': {
    name: 'Garden Fresh Salad',
    categoryId: 'salads',
    description: 'A rainbow of seasonal vegetables — crunchy bell peppers, carrots, beetroot, lettuce, and cherry tomatoes with our house lemon-herb vinaigrette.',
    shortDescription: 'Seasonal veggies with lemon-herb vinaigrette',
    ingredients: ['Lettuce', 'Bell Pepper', 'Carrot', 'Beetroot', 'Cherry Tomato', 'Lemon-Herb Vinaigrette'],
    imageUrl: 'https://cdn.jsdelivr.net/gh/user/omkara-cdn/products/garden-fresh-salad.webp',
    additionalImages: [],
    tags: ['light', 'vegan'],
    variants: [
      { id: 'regular', label: 'Regular', price: 90, description: '', isDefault: true, availability: 'available', sortOrder: 0 },
      { id: 'large', label: 'Large', price: 140, description: 'Double portion', isDefault: false, availability: 'available', sortOrder: 1 },
    ],
    addons: [
      { id: 'paneer', name: 'Add Paneer', price: 40, description: '', availability: 'available', selectionType: 'multiple', required: false, sortOrder: 0 },
      { id: 'quinoa', name: 'Add Quinoa', price: 50, description: '', availability: 'available', selectionType: 'multiple', required: false, sortOrder: 1 },
    ],
    notesConfig: defaultNotesConfig,
    availability: 'available',
    sortOrder: 0,
    isFeatured: true,
    isNew: false,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'quinoa-tikki-salad': {
    name: 'Quinoa Tikki Salad',
    categoryId: 'salads',
    description: 'Crispy quinoa-and-potato tikkis served on a bed of fresh greens with tangy tamarind dressing — our signature fusion bowl.',
    shortDescription: 'Fusion bowl with quinoa tikkis & tamarind dressing',
    ingredients: ['Quinoa', 'Potato', 'Mixed Greens', 'Tamarind Dressing', 'Pomegranate'],
    imageUrl: 'https://cdn.jsdelivr.net/gh/user/omkara-cdn/products/quinoa-tikki-salad.webp',
    additionalImages: [],
    tags: ['fusion', 'bestseller'],
    variants: [
      { id: 'regular', label: 'Regular', price: 130, description: '', isDefault: true, availability: 'available', sortOrder: 0 },
    ],
    addons: [],
    notesConfig: defaultNotesConfig,
    availability: 'available',
    sortOrder: 1,
    isFeatured: false,
    isNew: true,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'kachumber-salad': {
    name: 'Bikaneri Kachumber',
    categoryId: 'salads',
    description: 'The classic Rajasthani side — finely diced onion, tomato, cucumber, and radish with raw mustard oil, chilli, and fresh coriander.',
    shortDescription: 'Traditional Rajasthani diced vegetable salad',
    ingredients: ['Onion', 'Tomato', 'Cucumber', 'Radish', 'Mustard Oil', 'Coriander'],
    imageUrl: 'https://cdn.jsdelivr.net/gh/user/omkara-cdn/products/kachumber-salad.webp',
    additionalImages: [],
    tags: ['regional', 'vegan', 'light'],
    variants: [
      { id: 'regular', label: 'Regular', price: 50, description: '', isDefault: true, availability: 'available', sortOrder: 0 },
    ],
    addons: [],
    notesConfig: defaultNotesConfig,
    availability: 'available',
    sortOrder: 2,
    isFeatured: false,
    isNew: false,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ── Smoothies ──
  'mango-lassi-smoothie': {
    name: 'Mango Lassi Smoothie',
    categoryId: 'smoothies',
    description: 'Our take on the classic — ripe Alphonso mangoes blended with thick yogurt, cardamom, and a touch of saffron. Rich, creamy, and naturally sweet.',
    shortDescription: 'Classic mango lassi with saffron & cardamom',
    ingredients: ['Alphonso Mango', 'Yogurt', 'Cardamom', 'Saffron', 'Honey'],
    imageUrl: 'https://cdn.jsdelivr.net/gh/user/omkara-cdn/products/mango-lassi-smoothie.webp',
    additionalImages: [],
    tags: ['bestseller', 'seasonal'],
    variants: [
      { id: '300ml', label: '300ml', price: 80, description: '', isDefault: true, availability: 'available', sortOrder: 0 },
      { id: '500ml', label: '500ml', price: 120, description: '', isDefault: false, availability: 'available', sortOrder: 1 },
    ],
    addons: [
      { id: 'chia-seeds', name: 'Chia Seeds', price: 20, description: '', availability: 'available', selectionType: 'multiple', required: false, sortOrder: 0 },
      { id: 'protein-scoop', name: 'Protein Scoop', price: 40, description: 'Whey protein boost', availability: 'available', selectionType: 'multiple', required: false, sortOrder: 1 },
    ],
    notesConfig: defaultNotesConfig,
    availability: 'available',
    sortOrder: 0,
    isFeatured: true,
    isNew: false,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'green-detox-smoothie': {
    name: 'Green Detox',
    categoryId: 'smoothies',
    description: 'Spinach, banana, apple, ginger, and a squeeze of lime blended into a smooth, energizing green powerhouse.',
    shortDescription: 'Spinach-banana-apple green blend',
    ingredients: ['Spinach', 'Banana', 'Apple', 'Ginger', 'Lime', 'Honey'],
    imageUrl: 'https://cdn.jsdelivr.net/gh/user/omkara-cdn/products/green-detox-smoothie.webp',
    additionalImages: [],
    tags: ['detox', 'vegan'],
    variants: [
      { id: '300ml', label: '300ml', price: 90, description: '', isDefault: true, availability: 'available', sortOrder: 0 },
      { id: '500ml', label: '500ml', price: 140, description: '', isDefault: false, availability: 'available', sortOrder: 1 },
    ],
    addons: [
      { id: 'spirulina', name: 'Spirulina Boost', price: 30, description: '', availability: 'available', selectionType: 'multiple', required: false, sortOrder: 0 },
    ],
    notesConfig: defaultNotesConfig,
    availability: 'available',
    sortOrder: 1,
    isFeatured: false,
    isNew: true,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'dates-almond-shake': {
    name: 'Dates & Almond Shake',
    categoryId: 'smoothies',
    description: 'Medjool dates blended with soaked almonds, warm milk, and a pinch of cinnamon. No added sugar — nature provides.',
    shortDescription: 'Natural sweetness from dates & almonds',
    ingredients: ['Medjool Dates', 'Almonds', 'Milk', 'Cinnamon'],
    imageUrl: 'https://cdn.jsdelivr.net/gh/user/omkara-cdn/products/dates-almond-shake.webp',
    additionalImages: [],
    tags: ['premium', 'no-sugar'],
    variants: [
      { id: '300ml', label: '300ml', price: 110, description: '', isDefault: true, availability: 'available', sortOrder: 0 },
      { id: '500ml', label: '500ml', price: 170, description: '', isDefault: false, availability: 'available', sortOrder: 1 },
    ],
    addons: [],
    notesConfig: defaultNotesConfig,
    availability: 'available',
    sortOrder: 2,
    isFeatured: false,
    isNew: false,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'berry-blast-smoothie': {
    name: 'Berry Blast',
    categoryId: 'smoothies',
    description: 'A burst of mixed berries — strawberry, blueberry, and raspberry — blended with banana and oat milk for a dairy-free delight.',
    shortDescription: 'Mixed berries with oat milk',
    ingredients: ['Strawberry', 'Blueberry', 'Raspberry', 'Banana', 'Oat Milk'],
    imageUrl: 'https://cdn.jsdelivr.net/gh/user/omkara-cdn/products/berry-blast-smoothie.webp',
    additionalImages: [],
    tags: ['vegan', 'dairy-free'],
    variants: [
      { id: '300ml', label: '300ml', price: 100, description: '', isDefault: true, availability: 'available', sortOrder: 0 },
    ],
    addons: [],
    notesConfig: defaultNotesConfig,
    availability: 'out_of_stock',
    sortOrder: 3,
    isFeatured: false,
    isNew: false,
    status: 'archived',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ── Snacks ──
  'roasted-makhana': {
    name: 'Roasted Makhana',
    categoryId: 'snacks',
    description: 'Fox nuts slow-roasted in ghee with rock salt, turmeric, and a whisper of black pepper. The perfect guilt-free crunch.',
    shortDescription: 'Ghee-roasted fox nuts with turmeric',
    ingredients: ['Makhana (Fox Nuts)', 'Ghee', 'Rock Salt', 'Turmeric', 'Black Pepper'],
    imageUrl: 'https://cdn.jsdelivr.net/gh/user/omkara-cdn/products/roasted-makhana.webp',
    additionalImages: [],
    tags: ['bestseller', 'gluten-free'],
    variants: [
      { id: '100g', label: '100g Pack', price: 80, description: '', isDefault: true, availability: 'available', sortOrder: 0 },
      { id: '250g', label: '250g Pack', price: 180, description: '', isDefault: false, availability: 'available', sortOrder: 1 },
    ],
    addons: [],
    notesConfig: { enabled: false, placeholder: '', maxLength: 0 },
    availability: 'available',
    sortOrder: 0,
    isFeatured: true,
    isNew: false,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'seed-trail-mix': {
    name: 'Seeds & Trail Mix',
    categoryId: 'snacks',
    description: 'A curated mix of pumpkin seeds, sunflower seeds, flax seeds, cashews, and dried cranberries. Lightly salted, deeply satisfying.',
    shortDescription: 'Curated seeds & dried fruit mix',
    ingredients: ['Pumpkin Seeds', 'Sunflower Seeds', 'Flax Seeds', 'Cashews', 'Dried Cranberries', 'Rock Salt'],
    imageUrl: 'https://cdn.jsdelivr.net/gh/user/omkara-cdn/products/seed-trail-mix.webp',
    additionalImages: [],
    tags: ['protein', 'vegan'],
    variants: [
      { id: '100g', label: '100g Pack', price: 120, description: '', isDefault: true, availability: 'available', sortOrder: 0 },
      { id: '250g', label: '250g Pack', price: 280, description: '', isDefault: false, availability: 'available', sortOrder: 1 },
    ],
    addons: [],
    notesConfig: { enabled: false, placeholder: '', maxLength: 0 },
    availability: 'available',
    sortOrder: 1,
    isFeatured: false,
    isNew: true,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'baked-beetroot-chips': {
    name: 'Baked Beetroot Chips',
    categoryId: 'snacks',
    description: 'Thinly sliced beetroot, oven-baked to a perfect crisp and dusted with Himalayan pink salt and smoked paprika.',
    shortDescription: 'Oven-baked beet chips with pink salt',
    ingredients: ['Beetroot', 'Olive Oil', 'Himalayan Pink Salt', 'Smoked Paprika'],
    imageUrl: 'https://cdn.jsdelivr.net/gh/user/omkara-cdn/products/baked-beetroot-chips.webp',
    additionalImages: [],
    tags: ['baked', 'vegan'],
    variants: [
      { id: '80g', label: '80g Pack', price: 90, description: '', isDefault: true, availability: 'available', sortOrder: 0 },
    ],
    addons: [],
    notesConfig: { enabled: false, placeholder: '', maxLength: 0 },
    availability: 'available',
    sortOrder: 2,
    isFeatured: false,
    isNew: false,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

// ── Content Pages ─────────────────────────────────────────────

const contentPages: Record<string, Omit<ContentPage, 'id'>> = {
  about: {
    title: 'Our Story',
    subtitle: 'Born in Bikaner. Built for Wellness.',
    slug: 'about',
    body: `<p>OMKARA was born from a simple belief — that health and flavor are not enemies, but ancient allies.</p>
<p>In the heart of Bikaner, where centuries-old food traditions meet the desert's unforgiving sun, we found inspiration. Our ancestors knew that sprouted grains held the key to sustained energy. That fresh, seasonal ingredients needed no artificial enhancement. That food is medicine when prepared with intention.</p>
<p>We bring this wisdom to your table — reimagined for modern life, but rooted in timeless principles.</p>`,
    excerpt: 'How a Bikaner family\'s wellness journey became OMKARA.',
    imageUrl: '/assets/philosophy.webp',
    seoTitle: 'About OMKARA — Our Story',
    seoDescription: 'Learn about OMKARA\'s journey from a Bikaner kitchen to a premium health food brand. Rooted in tradition, designed for modern wellness.',
    sortOrder: 0,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  philosophy: {
    title: 'Philosophy',
    subtitle: 'Nourish. Balance. Longevity.',
    slug: 'philosophy',
    body: `<p>Three words guide every decision at OMKARA:</p>
<ul>
<li><strong>Nourish</strong> — Every ingredient is chosen for its nutritional value, not just its taste.</li>
<li><strong>Balance</strong> — We believe in Ayurvedic balance — the right foods at the right time.</li>
<li><strong>Longevity</strong> — Our goal isn't just to feed you today, but to invest in your health for years to come.</li>
</ul>
<p>No shortcuts. No preservatives. No compromise.</p>`,
    excerpt: 'Nourish, Balance, Longevity — the three pillars of OMKARA.',
    imageUrl: '/assets/philosophy.webp',
    seoTitle: 'Our Philosophy — OMKARA',
    seoDescription: 'Nourish. Balance. Longevity. Discover the Ayurvedic principles and Bikaneri traditions behind every OMKARA product.',
    sortOrder: 1,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  help: {
    title: 'Help & FAQ',
    subtitle: 'We\'re here for you.',
    slug: 'help',
    body: `<h3>How do I place an order?</h3>
<p>Browse our menu, add items to your cart, and tap "Order on WhatsApp". A pre-formatted message will open in WhatsApp — just send it!</p>
<h3>What payment methods do you accept?</h3>
<p>Currently we accept Cash on Delivery (COD) and UPI payments. Payment details are confirmed via WhatsApp after your order.</p>
<h3>Do you deliver?</h3>
<p>Yes! We deliver within Bikaner city limits. Delivery charges may apply based on distance.</p>
<h3>Can I modify my order?</h3>
<p>Once sent via WhatsApp, simply message us to modify. We'll confirm any changes.</p>`,
    excerpt: 'Frequently asked questions about ordering from OMKARA.',
    imageUrl: '',
    seoTitle: 'Help & FAQ — OMKARA',
    seoDescription: 'Get answers to common questions about ordering, delivery, and payments at OMKARA.',
    sortOrder: 2,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

export const SEED_CONFIG: SiteConfig = siteConfig;
export const SEED_CATEGORIES: Category[] = Object.entries(categories).map(([id, data]) => ({ id, ...data }));
export const SEED_PRODUCTS: Product[] = Object.entries(products).map(([id, data]) => ({ id, ...data }));
export const SEED_CONTENT_PAGES: ContentPage[] = Object.entries(contentPages).map(([id, data]) => ({ id, ...data }));

// ── Seed Runner ───────────────────────────────────────────────

export async function seedAll(): Promise<void> {
  console.log('[SEED] Starting OMKARA seed...');

  // 1. Site Config
  console.log('[SEED] → Site config...');
  await initializeSiteConfig(siteConfig);

  // 2. Categories
  console.log('[SEED] → Categories...');
  for (const [id, data] of Object.entries(categories)) {
    await createCategory(id, data);
    console.log(`  ✓ ${data.name}`);
  }

  // 3. Products
  console.log('[SEED] → Products...');
  for (const [id, data] of Object.entries(products)) {
    await createProduct(id, data);
    console.log(`  ✓ ${data.name}`);
  }

  // 4. Content Pages
  console.log('[SEED] → Content pages...');
  for (const [id, data] of Object.entries(contentPages)) {
    await createContentPage(id, data);
    console.log(`  ✓ ${data.title}`);
  }

  console.log('[SEED] ✅ Done! All data seeded successfully.');
}

