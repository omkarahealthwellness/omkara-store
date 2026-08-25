---
description: Critical architectural constraints for the OMKARA project. Must be read before writing any code.
---

# OMKARA Architectural Rules (CRITICAL)

The following rules MUST be followed strictly by any agent working on this project.

## 1. Zero Frameworks
- **NO React, Vue, Svelte, or Angular.**
- The storefront is built using **Pure Vanilla TypeScript** and **Vanilla CSS**.
- **Do not introduce** any Virtual DOM, state management libraries (like Redux or Zustand), or UI component libraries (like Tailwind, MUI, Bootstrap).
- Components are simply pure functions that return HTML strings (e.g. `export function renderHero(): string { return '<div...>'; }`).
- Interactivity is handled via separate setup functions that query the DOM and attach event listeners (e.g. `export function setupSearchBar(onSearch: (q: string) => void): void { ... }`).

## 2. CSS Architecture
- All styling MUST use the CSS Custom Properties defined in `storefront/src/styles/tokens.css`.
- **Do NOT hardcode colors, spacing, radii, or fonts.**
- Example: Use `var(--space-4)` for padding, `var(--color-brand-primary)` for colors, `var(--radius-md)` for border-radius.
- Write component-specific CSS in `storefront/src/styles/components.css` or `layout.css`. No inline styles for structural design.

## 3. Tooling and Execution Strategy
- When creating new UI components, use `write_to_file` to create the `.ts` file cleanly.
- Keep the DOM manipulation simple. Re-rendering large chunks via `innerHTML` is acceptable for this scale if handled carefully, but avoid re-rendering the whole page on every input.
- Keep the bundle size minimal.

## 4. TypeScript & Data Models
- Enums are strictly forbidden due to Vite/esbuild `erasableSyntaxOnly` constraint. Use `const` object mapping (e.g. `export const OrderStatus = { PENDING: 'pending' } as const;`).
- All data models are defined in `shared/types/`. Import them via the `shared/` workspace link.

## 5. Working Process for AI Agents
- **Phase-by-Phase Execution:** Check `task.md` and only work on the active phase. Do not jump ahead.
- **Micro-Steps:** If a phase involves multiple complex parts, implement the static HTML first, verify it visually, and then add the interaction logic.
- **Defensive Coding:** Always check if elements exist before attaching listeners (e.g., `if (!element) return;`).
