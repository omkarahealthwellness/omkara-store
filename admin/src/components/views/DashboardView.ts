// ============================================================
// OMKARA Admin — Dashboard View
// ============================================================

import type { Product } from 'shared/types/product';
import type { Category } from 'shared/types/category';
import { formatPrice } from 'shared/constants/defaults';

export function renderDashboardView(products: Product[], categories: Category[]): string {
  const publishedProducts = products.filter((p) => p.status === 'published').length;
  const draftProducts = products.filter((p) => p.status === 'draft').length;
  const availableProducts = products.filter((p) => p.availability === 'available').length;
  const unavailableProducts = products.filter(
    (p) => p.availability === 'out_of_stock' || p.availability === 'temporarily_unavailable'
  ).length;

  const recentProducts = [...products].slice(0, 5);

  return `
    <div>
      <div style="margin-bottom: var(--space-8); display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2 class="heading-2" style="color: var(--color-brand-primary);">Storefront Overview</h2>
          <p class="body-sm" style="color: var(--color-text-secondary); margin-top: 2px;">Manage live catalog, stock states, and digital branding.</p>
        </div>
        <div style="display: flex; gap: var(--space-3);">
          <a href="#products" class="btn btn-primary btn-sm">+ Add Product</a>
          <a href="#categories" class="btn btn-secondary btn-sm">+ Add Category</a>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-label">Total Categories</span>
          <div class="stat-value">${categories.length}</div>
          <span class="caption" style="color: var(--color-success);">● All Active</span>
        </div>

        <div class="stat-card">
          <span class="stat-label">Total Products</span>
          <div class="stat-value">${products.length}</div>
          <span class="caption" style="color: var(--color-text-secondary);">${publishedProducts} Published · ${draftProducts} Draft</span>
        </div>

        <div class="stat-card">
          <span class="stat-label">Ready to Order</span>
          <div class="stat-value" style="color: var(--color-success);">${availableProducts}</div>
          <span class="caption" style="color: var(--color-success);">Instant WhatsApp orders</span>
        </div>

        <div class="stat-card">
          <span class="stat-label">Out of Stock / Paused</span>
          <div class="stat-value" style="color: var(--color-error);">${unavailableProducts}</div>
          <span class="caption" style="color: var(--color-error);">Needs inventory refresh</span>
        </div>
      </div>

      <!-- Quick Actions Grid -->
      <div class="admin-card">
        <h3 class="heading-4" style="color: var(--color-brand-primary); margin-bottom: var(--space-4);">Quick Workflows</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4);">
          <a href="#matrix" style="text-decoration: none; padding: var(--space-4); background-color: var(--color-surface-primary); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle); display: flex; align-items: center; gap: var(--space-3); color: var(--color-brand-primary);">
            <span style="font-size: 1.5rem;">⚡</span>
            <div>
              <strong style="display: block; font-size: var(--text-sm);">Availability Matrix</strong>
              <span class="caption" style="color: var(--color-text-secondary);">One-click stock toggle</span>
            </div>
          </a>

          <a href="#cdn" style="text-decoration: none; padding: var(--space-4); background-color: var(--color-surface-primary); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle); display: flex; align-items: center; gap: var(--space-3); color: var(--color-brand-primary);">
            <span style="font-size: 1.5rem;">🖼️</span>
            <div>
              <strong style="display: block; font-size: var(--text-sm);">Image Optimizer</strong>
              <span class="caption" style="color: var(--color-text-secondary);">512x512 WebP converter</span>
            </div>
          </a>

          <a href="#config" style="text-decoration: none; padding: var(--space-4); background-color: var(--color-surface-primary); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle); display: flex; align-items: center; gap: var(--space-3); color: var(--color-brand-primary);">
            <span style="font-size: 1.5rem;">⚙️</span>
            <div>
              <strong style="display: block; font-size: var(--text-sm);">Site Configuration</strong>
              <span class="caption" style="color: var(--color-text-secondary);">WhatsApp & Hero Banner</span>
            </div>
          </a>

          <a href="#content" style="text-decoration: none; padding: var(--space-4); background-color: var(--color-surface-primary); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle); display: flex; align-items: center; gap: var(--space-3); color: var(--color-brand-primary);">
            <span style="font-size: 1.5rem;">📝</span>
            <div>
              <strong style="display: block; font-size: var(--text-sm);">Story & Philosophy CMS</strong>
              <span class="caption" style="color: var(--color-text-secondary);">Brand narrative pages</span>
            </div>
          </a>
        </div>
      </div>

      <!-- Recent Products Table -->
      <div class="admin-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
          <h3 class="heading-4" style="color: var(--color-brand-primary);">Recent Menu Items</h3>
          <a href="#products" class="body-sm" style="color: var(--color-brand-accent); text-decoration: none; font-weight: var(--weight-medium);">View All Products →</a>
        </div>

        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Starting Price</th>
                <th>Availability</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${recentProducts
                .map((p) => {
                  const defaultVar = p.variants.find((v) => v.isDefault) || p.variants[0];
                  const cat = categories.find((c) => c.id === p.categoryId);
                  return `
                  <tr>
                    <td style="font-weight: var(--weight-semibold);">${p.name}</td>
                    <td>${cat?.name || p.categoryId}</td>
                    <td>${formatPrice(defaultVar?.price ?? 0)}</td>
                    <td><span class="badge" style="background-color: var(--color-surface-secondary); color: var(--color-brand-primary);">${p.availability}</span></td>
                    <td><span class="badge badge-${p.status}">${p.status}</span></td>
                  </tr>
                `;
                })
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
