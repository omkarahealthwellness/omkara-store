# Admin Panel Architecture & Execution Guide

> **PURPOSE:** This document provides the absolute ground truth for building the OMKARA Admin Panel. Any AI agent working on the `admin/` directory MUST follow these rules exactly to ensure god-tier quality and prevent architectural decay.

---

## 1. CORE ARCHITECTURAL CONSTRAINTS

### 1.1 Zero Frameworks
- **NO** React, Vue, Angular, Svelte, or any UI framework.
- **NO** Tailwind CSS, Bootstrap, Material UI, or any CSS framework.
- **NO** state management libraries (Redux, MobX, etc.).
- **ONLY** Vanilla TypeScript and Vanilla CSS.

### 1.2 The Component Pattern
Just like the storefront, all admin UI components must be pure functions returning HTML strings, paired with a setup function for event binding.

```typescript
// admin/src/components/ui/StatCard.ts
export function renderStatCard(title: string, value: number): string {
  return `
    <div class="stat-card">
      <h4 class="stat-title">${title}</h4>
      <div class="stat-value">${value}</div>
    </div>
  `;
}
```

### 1.3 TypeScript Enums are BANNED
Because `erasableSyntaxOnly: true` is enabled in `tsconfig.json`, using the `enum` keyword will cause an immediate build failure. Use `as const` objects instead.
```typescript
// CORRECT PATTERN:
export const PublishState = {
  Draft: 'draft',
  Published: 'published',
  Archived: 'archived'
} as const;
export type PublishState = typeof PublishState[keyof typeof PublishState];
```

### 1.4 Centralized Styling
- All CSS variables (tokens) are inherited from the design system.
- Do NOT use inline styles unless calculating dynamic layout (like absolute positioning coordinates).
- All styles go into `admin/src/style.css` (or imported modules).

---

## 2. ADMIN-SPECIFIC ARCHITECTURE

### 2.1 Firebase Authentication
- The admin panel requires Firebase Auth (Email/Password).
- **Rule:** Before rendering any admin route, verify the user session. If unauthenticated, render the Login screen.
- **Rule:** Do NOT use session cookies or custom JWTs; use the standard Firebase Web SDK `onAuthStateChanged`.

### 2.2 Data Access Layer (DAL) Integration
- The admin panel **must** use the DAL functions defined in `shared/dal/`.
- Do NOT write raw Firestore queries (`getDocs(collection(...))`) directly in the UI components.
- Import patterns must be: `import { createProduct, updateProduct } from 'shared/dal/products';`

### 2.3 The Draft / Publish Workflow (CRITICAL)
The storefront MUST NOT break while an admin is editing a product.
- When creating/editing a product or category, the changes are saved to the `status: 'draft'` state or a separate draft collection/field.
- A manual "Publish" action is required to push the changes to `status: 'published'`.
- The storefront DAL specifically queries for `status: 'published'`.

### 2.4 State Management & Routing
Since there's no router library:
- Use simple hash-based routing (`window.location.hash`).
- Listen to the `hashchange` event to re-render the main content area.
- Route map: `#dashboard`, `#products`, `#categories`, `#content`, `#settings`.

---

## 3. MICRO-PHASE EXECUTION (PHASES 27-34)

### Phase 27: Auth & Shell
1. Render `<div id="auth-guard">` that checks Firebase Auth.
2. If logged out: Render `renderLoginView()`. Handle form submit via `signInWithEmailAndPassword`.
3. If logged in: Render `renderAdminShell()`.
4. `renderAdminShell()` consists of `SidebarNav` (left) and `MainContent` (right).

### Phase 28: Dashboard
1. Fetch aggregate metrics: total products, total categories.
2. Render `renderDashboard()` with summary cards.
3. Add quick action buttons: "New Product", "New Category".

### Phase 29: Category CRUD
1. Render a list of categories using `getAllCategories()`.
2. Implement drag-and-drop reordering (update `sortOrder` on drop).
3. `renderCategoryForm()` handles Create/Edit. Validate name and color.

### Phase 30: Product CRUD (Basic)
1. List products, sortable and filterable by category.
2. `renderProductForm()` handles Basic Info, Pricing, Availability.
3. Validate: Starting price > 0, Name is not empty.

### Phase 31 & 32: Variants & Add-ons
1. Inside the product form, create sub-sections for Variants and Add-ons.
2. Use dynamic form rows: `renderVariantRow()`, allowing "Add Another Size".
3. Validate: At least ONE variant must exist and be marked as `isDefault`.

### Phase 33 & 34: Content & Ordering
1. Build forms for Hero Config, Footer Config, and Contact Info.
2. Save directly to the `config` Firestore document using `shared/dal/config.ts`.

---

## 4. ERROR HANDLING & VALIDATION
- Never show a raw Firebase error (e.g., `auth/user-not-found`) to the admin. Map it to a human-readable string.
- Provide visual validation feedback before submitting (e.g., red borders on invalid inputs).
- Use toast notifications (e.g., `showToast('Product saved successfully', 'success')`) for all mutations.
