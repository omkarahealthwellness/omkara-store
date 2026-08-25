# OMKARA — Firestore Collection Structure

> This document defines the complete Firestore database schema for the OMKARA system.
> All projects (storefront, admin, cdn-panel) share this single Firestore database.

## Design Principles

1. **Flat collections** — no deeply nested sub-collections (Spark plan friendly)
2. **Denormalized where needed** — `productCount` on categories to avoid extra queries
3. **Sort order as field** — `sortOrder` on categories and products for admin-controlled ordering
4. **Status-based visibility** — `status: 'published' | 'draft' | 'archived'` on all content
5. **Snapshot fields** — cart items snapshot product name/image at time of adding

---

## Collections

### `/config/{configId}`

Single document (`configId = "site"`) holding all site-wide settings.

| Field | Type | Description |
|---|---|---|
| `brandName` | `string` | "OMKARA" |
| `tagline` | `string` | "SEHAT BHI. SWAAD BHI." |
| `contact.phone` | `string` | WhatsApp number |
| `contact.email` | `string` | Business email |
| `contact.instagram` | `string` | Instagram handle |
| `contact.location` | `string` | City/location |
| `whatsapp.number` | `string` | WhatsApp number for orders |
| `whatsapp.greeting` | `string` | Message greeting |
| `whatsapp.closing` | `string` | Message closing |
| `hero.imageUrl` | `string` | Hero banner image |
| `hero.headline` | `string` | Hero headline |
| `hero.subheadline` | `string` | Hero subheadline |
| `hero.ctaText` | `string` | Call-to-action button text |
| `hero.ctaUrl` | `string` | CTA link target |
| `footer.*` | `object` | Footer content (links, legal, social) |
| `announcement.*` | `object` | Optional announcement banner |
| `updatedAt` | `string` | ISO timestamp |

---

### `/categories/{categoryId}`

Each document is a menu category.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Document ID (auto or slug) |
| `name` | `string` | Category display name |
| `description` | `string` | Optional category description |
| `imageUrl` | `string` | Category header image (jsDelivr URL) |
| `iconUrl` | `string` | Category icon for nav bar |
| `accentColor` | `string` | Hex color for category theming |
| `sortOrder` | `number` | Display order (lower = first) |
| `productCount` | `number` | Denormalized count of products |
| `status` | `string` | `'published'` / `'draft'` / `'archived'` |
| `availability` | `string` | AvailabilityState value |
| `createdAt` | `string` | ISO timestamp |
| `updatedAt` | `string` | ISO timestamp |

---

### `/products/{productId}`

Each document is a product with embedded variants and add-ons.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Document ID |
| `categoryId` | `string` | Reference to parent category |
| `name` | `string` | Product display name |
| `description` | `string` | Product description (supports markdown) |
| `shortDescription` | `string` | One-liner for cards |
| `imageUrl` | `string` | Primary product image (jsDelivr URL) |
| `additionalImages` | `string[]` | Gallery images |
| `ingredients` | `string[]` | Ingredient list |
| `tags` | `string[]` | Searchable tags |
| `variants` | `Variant[]` | Serving size options (embedded) |
| `addons` | `Addon[]` | Add-on options (embedded) |
| `notesConfig` | `object` | Customer notes settings |
| `notesConfig.enabled` | `boolean` | Whether notes input is shown |
| `notesConfig.placeholder` | `string` | Input placeholder text |
| `notesConfig.maxLength` | `number` | Character limit |
| `availability` | `string` | AvailabilityState value |
| `sortOrder` | `number` | Display order within category |
| `isFeatured` | `boolean` | Show in featured section |
| `isNew` | `boolean` | Show "New" badge |
| `status` | `string` | `'published'` / `'draft'` / `'archived'` |
| `createdAt` | `string` | ISO timestamp |
| `updatedAt` | `string` | ISO timestamp |

#### Embedded: Variant

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Variant ID |
| `label` | `string` | Display label (e.g., "250g", "500g") |
| `price` | `number` | Price in INR |
| `description` | `string` | Optional size description |
| `isDefault` | `boolean` | Pre-selected variant |
| `availability` | `string` | AvailabilityState value |

#### Embedded: Addon

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Addon ID |
| `name` | `string` | Display name |
| `price` | `number` | Additional price in INR |
| `description` | `string` | Addon description |
| `isRequired` | `boolean` | Must select at least one |
| `selectionType` | `string` | `'single'` / `'multiple'` |
| `availability` | `string` | AvailabilityState value |

---

### `/content/{pageId}`

Static content pages (About, Philosophy, Help, etc.).

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Document ID / URL slug |
| `title` | `string` | Page title |
| `slug` | `string` | URL-friendly identifier |
| `body` | `string` | Page content (HTML or Markdown) |
| `excerpt` | `string` | Short summary |
| `seoTitle` | `string` | SEO title override |
| `seoDescription` | `string` | Meta description |
| `sortOrder` | `number` | Navigation order |
| `status` | `string` | `'published'` / `'draft'` / `'archived'` |
| `createdAt` | `string` | ISO timestamp |
| `updatedAt` | `string` | ISO timestamp |

---

## Read Strategy (Spark Plan Optimization)

The storefront fetches the **entire menu** in minimal Firestore reads:

| Query | Reads | What |
|---|---|---|
| `getDoc('config/site')` | 1 | All site settings |
| `getDocs('categories')` | 1 | All categories |
| `getDocs('products')` | 1 | All products |

**Total: 3 Firestore reads** for a complete storefront render.

Client-side JavaScript handles:
- Filtering by `status === 'published'`
- Sorting by `sortOrder`
- Grouping products by `categoryId`
- Search/filter within loaded data

This eliminates the need for complex Firestore queries and keeps the Spark plan usage minimal.
