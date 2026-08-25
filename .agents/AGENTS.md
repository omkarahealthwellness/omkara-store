# OMKARA — God-Tier Knowledge Transfer & Micro-Phase Execution Guide

> **PURPOSE:** This document transfers the complete thinking process, coding knowledge, and architectural decisions to any future AI agent. Follow it line by line and you will produce flawless code. Deviate from it and you will break the project.

---

## PART 1: ABSOLUTE RULES (MEMORIZE BEFORE WRITING A SINGLE LINE)

### Rule 1: ZERO UI FRAMEWORKS
- **NO** React, Vue, Svelte, Angular, Lit, Preact, Solid, or ANY component framework.
- **NO** Tailwind CSS, Bootstrap, Material UI, Chakra, or ANY CSS framework.
- **NO** state management libraries (Redux, Zustand, MobX, Jotai).
- **ONLY** Vanilla TypeScript + Vanilla CSS with CSS Custom Properties.

### Rule 2: COMPONENT PATTERN (FOLLOW EXACTLY)
Every UI component is a `.ts` file that exports:
1. A **render function** that returns an HTML string.
2. An optional **setup function** that queries the DOM and attaches event listeners.

**EXACT PATTERN:**
```typescript
// storefront/src/components/ui/ExampleWidget.ts

export function renderExampleWidget(data: SomeType): string {
  return `
    <div class="example-widget" id="example-widget">
      <h3 class="heading-4">${data.name}</h3>
      <p class="body-sm">${data.description}</p>
    </div>
  `;
}

export function setupExampleWidget(onClick: (id: string) => void): void {
  const el = document.getElementById('example-widget');
  if (!el) return; // ALWAYS null-check
  el.addEventListener('click', () => onClick('some-id'));
}
```

### Rule 3: CSS — ONLY USE TOKENS
- **NEVER** write `color: #3B2415`. Write `color: var(--color-brand-primary)`.
- **NEVER** write `padding: 16px`. Write `padding: var(--space-4)`.
- **NEVER** write `border-radius: 8px`. Write `border-radius: var(--radius-md)`.
- **NEVER** write `font-family: 'Inter'`. Write `font-family: var(--font-body)`.
- New CSS classes go into `storefront/src/styles/components.css`.

### Rule 4: TYPESCRIPT — NO ENUMS
- Vite/esbuild has `erasableSyntaxOnly: true` enabled.
- Using `enum` will cause a **BUILD ERROR**. 
- Use `const` object pattern instead:
```typescript
// WRONG — WILL BREAK BUILD:
enum Status { Active = 'active' }

// CORRECT:
export const Status = { Active: 'active' } as const;
export type Status = typeof Status[keyof typeof Status];
```

### Rule 5: IMPORT PATHS
- From storefront code, import shared types like: `import type { Product } from 'shared/types/product';`
- The Vite alias `@shared` maps to `../shared`. The tsconfig path `@shared/*` maps to `../shared/*`.
- But the actual imports in `main.ts` currently use bare `shared/` (e.g., `'shared/dal/menu'`). **Match the existing pattern.**

### Rule 6: FILE ORGANIZATION
```
storefront/src/
├── components/
│   ├── layout/          ← Shell, Header, Hero, Footer, BottomNav
│   └── ui/              ← SearchBar, CategoryNav, ProductCard, etc.
├── styles/
│   ├── tokens.css       ← ALL design tokens (DO NOT MODIFY)
│   ├── reset.css        ← CSS reset (DO NOT MODIFY)
│   ├── typography.css   ← Font classes (DO NOT MODIFY)
│   ├── animations.css   ← Keyframes (DO NOT MODIFY)
│   ├── layout.css       ← Shell/header/footer/nav layout
│   ├── components.css   ← All UI component styles
│   └── main.css         ← Import aggregator
└── main.ts              ← Entry point, orchestrator
```

### Rule 7: PRODUCT TYPE SHAPE (CRITICAL FOR ALL UI CODE)
The `Product` interface has these fields you'll use constantly:
```typescript
interface Product {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  shortDescription: string;
  ingredients: string[];
  imageUrl: string;
  tags: string[];
  variants: ProductVariant[];     // At least 1. Each has: id, label, price, isDefault
  addons: ProductAddon[];         // 0 to N. Each has: id, name, price, selectionType
  notesConfig: ProductNotesConfig; // { enabled, placeholder, maxLength }
  availability: AvailabilityState; // 'available' | 'freshly_prepared' | 'limited' | etc.
  sortOrder: number;
  isFeatured: boolean;
  isNew: boolean;
  status: 'published' | 'draft' | 'archived';
}
```

**CRITICAL:** The `price` field does NOT exist on `Product` directly. The price comes from `product.variants[0].price` (the default variant). The previous `main.ts` code references `p.price` — this is a bug in the search results display that needs fixing. The correct way to get the starting price is:
```typescript
const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
const startingPrice = defaultVariant.price;
```

### Rule 8: CATEGORY TYPE SHAPE
```typescript
interface Category {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
  color: string;         // Hex color for this category
  accentColor: string;
  imageUrl: string;
  iconUrl: string;
  status: 'published' | 'draft' | 'archived';
  availability: AvailabilityState;
  productCount: number;
}
```

### Rule 9: MENU DATA LOADING
The storefront loads ALL data in one call:
```typescript
import { loadStorefrontMenu } from 'shared/dal/menu';

const menuData = await loadStorefrontMenu();
// menuData.config: SiteConfig
// menuData.categories: MenuCategory[] (each has .products: Product[])
// menuData.allProducts: Product[]
// menuData.readCount: 3 (always 3 Firestore reads)
```

### Rule 10: AVAILABILITY HELPERS
```typescript
import { AvailabilityState, isOrderable } from 'shared/types/availability';

// Check if product can be added to cart:
if (isOrderable(product.availability)) { /* show Add to Cart */ }

// Orderable states: available, freshly_prepared, limited, low_stock, seasonal
// Non-orderable: out_of_stock, coming_soon, temporarily_unavailable
```

---

## PART 2: EXISTING FILE MAP (WHAT EXISTS RIGHT NOW)

### Shared Module (shared/)
| File | Purpose | Key Exports |
|------|---------|-------------|
| `types/availability.ts` | Availability states | `AvailabilityState`, `isOrderable()`, `ORDERABLE_STATES` |
| `types/product.ts` | Product, Variant, Addon types | `Product`, `ProductVariant`, `ProductAddon`, `ProductNotesConfig` |
| `types/category.ts` | Category type | `Category` |
| `types/cart.ts` | Cart types | `CartItem`, `Cart` |
| `types/config.ts` | Site config types | `SiteConfig`, `HeroConfig`, `FooterConfig`, `WhatsAppConfig`, `ContactInfo` |
| `types/order.ts` | Order types (future) | `Order`, `OrderItem`, `OrderStatus` |
| `types/content.ts` | Content page type | `ContentPage` |
| `constants/brand.ts` | Brand strings | `BRAND`, `DEFAULT_CONTACT`, `WHATSAPP_BASE_URL` |
| `constants/defaults.ts` | Default values | `IMAGE_DEFAULTS`, `GRID_DEFAULTS`, `CURRENCY`, `formatPrice()` |
| `utils/whatsapp.ts` | WhatsApp msg builder | `buildWhatsAppMessage()`, `buildWhatsAppUrl()` |
| `dal/menu.ts` | Storefront loader | `loadStorefrontMenu()` returns `StorefrontMenu` |
| `dal/categories.ts` | Category CRUD | `getAllCategories()`, `createCategory()`, etc. |
| `dal/products.ts` | Product CRUD | `getAllProducts()`, `createProduct()`, etc. |
| `dal/config.ts` | Site config R/W | `getSiteConfig()`, `initializeSiteConfig()` |
| `dal/content.ts` | Content CRUD | `getContentPage()`, `createContentPage()` |
| `dal/auth.ts` | Admin auth | `adminLogin()`, `adminLogout()` |
| `seed/data.ts` | Seed script | `seedAll()` — 4 categories, 14 products |

### Storefront (storefront/src/)
| File | Purpose | Key Exports |
|------|---------|-------------|
| `main.ts` | Entry point | Renders shell, loads menu, wires search |
| `components/layout/Shell.ts` | App shell | `renderShell(mainContent: string): string` |
| `components/layout/Header.ts` | Sticky header | `renderHeader(): string` |
| `components/layout/Hero.ts` | Hero section | `renderHero(): string` |
| `components/layout/Footer.ts` | Site footer | `renderFooter(): string` |
| `components/layout/BottomNav.ts` | Mobile nav capsule | `renderBottomNav(): string` |
| `components/ui/SearchBar.ts` | Search input | `renderSearchBar(): string`, `setupSearchBar(cb)` |
| `styles/tokens.css` | Design tokens | All CSS variables |
| `styles/layout.css` | Shell layout | `.shell`, `.site-header`, `.hero`, `.site-footer`, `.bottom-nav` |
| `styles/components.css` | UI component styles | `.search-bar-container`, `.search-input`, etc. |

### Key CSS Classes Already Defined (USE THESE, don't reinvent)
**Typography:** `.heading-1` through `.heading-5`, `.body-lg`, `.body`, `.body-sm`, `.label`, `.caption`, `.tagline`, `.price-large`, `.hinglish`, `.brand-name`
**Layout:** `.container`, `.flex-center`, `.flex-between`, `.sr-only`
**Animations:** `.animate-fade-in-up`, `.animate-scale-in`, `.animate-float`, `.animate-shimmer`

---

## PART 3: KNOWN GOTCHAS & TRAPS

### Trap 1: `p.price` does not exist on Product
Product has `variants[]`, not a direct `price` field. The current `main.ts` search results use `p.price` — this is wrong. Fix it using `p.variants[0]?.price ?? 0`.

### Trap 2: `erasableSyntaxOnly` blocks enums
Any `enum` keyword will break the Vite build. Always use `as const` objects.

### Trap 3: Import type vs import
Use `import type { X }` for types (required by `verbatimModuleSyntax: true`). Use `import { fn }` for runtime values.

### Trap 4: `loadStorefrontMenu()` returns `categories` with nested `products`
The `StorefrontMenu.categories` is `MenuCategory[]` where each `MenuCategory extends Category` and adds `products: Product[]`. So `menuData.categories[0].products` gives you the products for that category. `menuData.allProducts` is a flat list of ALL products across all categories.

### Trap 5: Vite dev server port
The `vite.config.ts` says `port: 3000`, but the daemon was started with `--port 5173`. Check which is actually running. Default to `localhost:5173` for browser testing.

### Trap 6: The `StorefrontMenu` type has `allProducts` not `products`
When accessing the flat product list from menu data, use `menuData.allProducts`, NOT `menuData.products`.

### Trap 7: CSS token `--content-padding` is `var(--space-4)`
The `.container` class already applies horizontal padding. Don't add extra padding inside it.

### Trap 8: Bottom nav is hidden on desktop (>=768px)
The `.bottom-nav-container` has `display: none` at `min-width: 768px`. Desktop uses header nav instead.

---

## PART 4: MICRO-PHASE EXECUTION GUIDE (PHASES 9-40)

Each phase below is broken into atomic sub-steps. Execute them IN ORDER. Do not skip steps. Do not combine steps.

---

### PHASE 9 — Category Navigation Bar

**Goal:** Horizontal scrolling pill-style category nav below the search bar. Tapping scrolls to section. Scroll-spy auto-highlights active category.

#### Step 9.1: Create CSS for CategoryNav
**File:** `storefront/src/styles/components.css` (APPEND to existing file)
**What to add:**
```css
.category-nav {
  position: sticky;
  top: 56px;
  z-index: 30;
  background-color: var(--color-surface-primary);
  border-bottom: 1px solid var(--color-border-subtle);
  padding-block: var(--space-3);
}

.category-nav-scroll {
  display: flex;
  gap: var(--space-3);
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  padding-inline: var(--space-4);
}

.category-nav-scroll::-webkit-scrollbar { display: none; }

.category-pill {
  flex-shrink: 0;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border-default);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  white-space: nowrap;
}

.category-pill:hover {
  border-color: var(--color-brand-primary);
  color: var(--color-brand-primary);
}

.category-pill.active {
  background-color: var(--color-brand-primary);
  border-color: var(--color-brand-primary);
  color: var(--color-text-on-dark);
}
```

#### Step 9.2: Create CategoryNav.ts render function
**File:** `storefront/src/components/ui/CategoryNav.ts` (NEW file)
- Import `Category` from `shared/types/category`
- Export `renderCategoryNav(categories: Category[]): string`
- Generate pill buttons with `data-category-id` attributes
- First pill gets `.active` class by default

#### Step 9.3: Create CategoryNav.ts setup function
- Export `setupCategoryNav(): void`
- Click handler: find section by `id="category-{catId}"`, call `scrollIntoView({ behavior: 'smooth' })`
- Scroll spy: use `IntersectionObserver` on `[data-category-section]` elements
- When section enters viewport, toggle `.active` on matching pill
- Auto-scroll active pill into view within the nav

#### Step 9.4: Integrate into main.ts
- After menu loads, render category nav between search bar and menu content
- Call `setupCategoryNav()` after DOM is updated

---

### PHASE 10 — Category Section Layout

**Goal:** Each category becomes a section with heading + product grid. "Show More" if >4 products on mobile.

#### Step 10.1: Add CSS for category sections to components.css
- `.category-section` with `scroll-margin-top` accounting for header + nav height
- `.product-grid` using CSS Grid: `repeat(2, 1fr)` on mobile, `auto-fill` on desktop
- `.show-more-btn` with dashed border style
- `.hidden-by-show-more` with `display: none`

#### Step 10.2: Create CategorySection.ts
- Import `MenuCategory` from `shared/dal/menu`
- Import `GRID_DEFAULTS` from `shared/constants/defaults`
- Export `renderCategorySection(category: MenuCategory): string`
- Section must have `id="category-{cat.id}"` and `data-category-section="{cat.id}"` for scroll-spy
- Products beyond `mobileColumns * mobileInitialRows` (4) get `.hidden-by-show-more`
- Show More button only if products.length > 4

#### Step 10.3: Create setupShowMore function
- Toggle `.hidden-by-show-more` class on click
- Update button text between "Show X more" and "Show less"

#### Step 10.4: Wire into main.ts
- Replace placeholder content with `menuData.categories.map(renderCategorySection).join('')`
- Call `setupShowMore()` after rendering

---

### PHASE 11 — Product Card Component

#### Step 11.1: Add product card CSS
- `.product-card` — border, radius, overflow hidden, cursor pointer, hover shadow
- `.product-card-img` — aspect-ratio 1/1, object-fit cover, lazy loading
- `.product-card-body` — padding, flex column
- `.product-card-name` — truncate with text-overflow ellipsis
- `.product-card-price` — bold, brand accent color
- `.availability-badge` — small pill with state-specific colors
- `.product-card.unavailable` — opacity 0.6, grayscale filter

#### Step 11.2: Create ProductCard.ts
- Get starting price: `product.variants.find(v => v.isDefault)?.price ?? product.variants[0]?.price ?? 0`
- Use `formatPrice()` from `shared/constants/defaults`
- Image with `loading="lazy"` and `onerror="this.src='/assets/placeholder.webp'"`
- Availability badge with text mapping for all 8 states
- Tags as small pills below price

#### Step 11.3: Replace placeholder in CategorySection
- Import `renderProductCard` and use it instead of placeholder divs

#### Step 11.4: Add click handler
- `setupProductCards(onProductClick: (productId: string) => void)`
- Use event delegation on `.product-grid` containers

---

### PHASE 12 — Product Detail Bottom Sheet (Mobile)

#### Step 12.1: Create bottom sheet CSS
- `.bottom-sheet-overlay` — fixed, inset 0, bg rgba(0,0,0,0.5), z-index var(--z-overlay)
- `.bottom-sheet` — fixed, bottom 0, max-height 90vh, bg white, rounded top, z-index var(--z-sheet)
- Slide-up animation using `@keyframes sheet-slide-up`
- `.sheet-open` on body — `overflow: hidden`

#### Step 12.2: Create BottomSheet.ts (generic)
- `openBottomSheet(content: string): void`
- `closeBottomSheet(): void`
- Close triggers: X button, overlay click, swipe down, ESC key
- Focus trap using `tabindex` management
- Body scroll lock

#### Step 12.3: Create ProductDetail.ts
- Full product info: image, name, description, ingredients, tags
- Placeholder slots for variant/addon/qty/notes (Phases 14-17)
- "Add to Cart" button (disabled until Phase 18)

#### Step 12.4: Wire product card click to open sheet

---

### PHASE 13 — Product Detail Modal (Desktop)

#### Step 13.1: Modal CSS (centered, two-column at >=768px)
#### Step 13.2: Modal.ts (open/close/ESC/backdrop)
#### Step 13.3: Use `window.matchMedia` to choose sheet vs modal

---

### PHASE 14 — Serving Size Selector

#### Step 14.1: CSS for pill/chip selector
#### Step 14.2: `renderVariantSelector(variants: ProductVariant[]): string`
- Radio-style pills, default pre-selected
- Single variant = hide selector
- Disabled state for unavailable variants
#### Step 14.3: `setupVariantSelector(onSelect: (variant: ProductVariant) => void)`
- Update active state, call callback with selected variant

---

### PHASE 15 — Add-on Selector

#### Step 15.1: CSS for checkbox/radio add-on list
#### Step 15.2: `renderAddonSelector(addons: ProductAddon[]): string`
- Hide section if no addons
- Single-select = radio buttons, multi-select = checkboxes
- Show +price next to each
#### Step 15.3: `setupAddonSelector(onUpdate: (selected: ProductAddon[]) => void)`

---

### PHASE 16 — Quantity Controls & Dynamic Total

#### Step 16.1: CSS for stepper (minus, count, plus buttons)
#### Step 16.2: `renderQuantityControls(): string`
#### Step 16.3: `setupQuantityControls(onChange: (qty: number) => void)`
- Min 1, no max
#### Step 16.4: Dynamic total display
- `(variantPrice + sum(addonPrices)) * quantity`
- Use `formatPrice()` for display

---

### PHASE 17 — Customer Note Input

#### Step 17.1: CSS for textarea with character counter
#### Step 17.2: `renderNoteInput(config: ProductNotesConfig): string`
- Hide if `config.enabled === false`
- Placeholder from config
#### Step 17.3: `setupNoteInput(onChange: (note: string) => void)`
- Character counter: `${current}/${max}`

---

### PHASE 18 — Cart System (Core)

#### Step 18.1: Create `storefront/src/store/cart.ts`
- localStorage persistence
- Event listener pattern for UI updates
- `addToCart()`, `removeFromCart()`, `updateCartItem()`, `clearCart()`, `getCart()`
- `onCartChange(listener)` for reactive UI updates

#### Step 18.2: Update BottomNav cart badge
- Listen to `onCartChange`, update badge count
- Animate badge on change (pulse)

#### Step 18.3: Wire "Add to Cart" button in ProductDetail
- Gather selected variant, addons, quantity, note
- Build CartItem, call addToCart()
- Close sheet/modal
- Show success feedback (toast or animation)

---

### PHASE 19 — Cart View & Edit

#### Step 19.1: Cart page/sheet CSS
#### Step 19.2: `renderCartView(cart: Cart): string`
- Each item: thumbnail, name, variant, addons, note, price, qty, edit/remove
- Grand total at bottom
- Empty state: "Cart abhi khaali hai."
#### Step 19.3: Edit item = reopen product detail pre-filled
#### Step 19.4: Remove with undo toast
#### Step 19.5: "Order on WhatsApp" CTA button

---

### PHASE 20 — WhatsApp Checkout

#### Step 20.1: Pre-send confirmation screen
- Show formatted message preview
#### Step 20.2: Build message using `buildWhatsAppMessage()` from `shared/utils/whatsapp`
#### Step 20.3: Build URL using `buildWhatsAppUrl()` with phone from `menuData.config.whatsapp.number`
#### Step 20.4: Open WhatsApp link
#### Step 20.5: Post-send: option to clear cart

---

### PHASES 21-26 — Integration & Polish (follow same micro-step pattern)
### PHASES 27-34 — Admin Panel (same Vanilla TS pattern, different Vite project)
### PHASES 35-36 — CDN Panel (Canvas API + GitHub API)
### PHASES 37-40 — QA & Launch (validation, testing, Lighthouse)

---

## PART 5: CSS TOKEN QUICK REFERENCE

### Colors
| Token | Value | Use For |
|-------|-------|---------|
| `--color-brand-primary` | `#3B2415` | Headers, nav, primary text |
| `--color-brand-secondary` | `#1A3A1A` | Hero bg, organic accents |
| `--color-brand-accent` | `#C5943A` | CTA buttons, gold highlights |
| `--color-brand-warm` | `#F5D8B4` | Warm accents, logo |
| `--color-surface-primary` | `#FAF5EE` | Main background |
| `--color-surface-secondary` | `#F3EBE0` | Cards |
| `--color-surface-tertiary` | `#EDE3D5` | Hover states |
| `--color-surface-dark` | `#2C1A0E` | Footer, overlays |
| `--color-text-primary` | `#1A0F0A` | Body text |
| `--color-text-secondary` | `#5C4A3A` | Secondary text |
| `--color-text-tertiary` | `#8B7B6B` | Captions |
| `--color-whatsapp` | `#25D366` | WhatsApp CTA |

### Spacing
| Token | px | Use |
|-------|-----|-----|
| `--space-2` | 8 | Tight gaps |
| `--space-3` | 12 | Pill padding |
| `--space-4` | 16 | Standard padding |
| `--space-6` | 24 | Sub-sections |
| `--space-8` | 32 | Sections |
| `--space-12` | 48 | Large sections |

### Radii
| Token | px | Use |
|-------|-----|-----|
| `--radius-sm` | 4 | Subtle |
| `--radius-md` | 8 | Cards |
| `--radius-lg` | 12 | Buttons |
| `--radius-full` | 9999 | Pills |

---

## PART 6: THINKING CHECKLIST (RUN BEFORE EVERY CODE CHANGE)

Before writing ANY code, ask yourself:

1. Am I using a CSS token or hardcoding a value? → USE TOKEN
2. Am I importing a type with `import type` or `import`? → Use `import type` for interfaces
3. Am I using an `enum`? → STOP. Use `as const` object
4. Am I null-checking DOM elements before using them? → ALWAYS null-check
5. Am I accessing `product.price`? → WRONG. Use `product.variants[0].price`
6. Am I creating a new CSS file? → NO. Append to `components.css`
7. Am I importing from `shared/`? → Match existing import patterns in main.ts
8. Am I adding a new CSS import? → Add it to `main.css` import list
9. Is my component a pure function returning a string? → GOOD
10. Did I add event listeners in a separate setup function? → GOOD
