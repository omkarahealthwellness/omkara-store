// ============================================================
// OMKARA Admin — CDN & Image Optimizer Panel (Phases 35–36)
// ============================================================
// Client-side 512x512 square crop, resize, WebP compression,
// and CDN URL generator with instant download.
// ============================================================

export function renderCDNPanelView(): string {
  return `
    <div>
      <div style="margin-bottom: var(--space-6);">
        <h2 class="heading-2" style="color: var(--color-brand-primary);">CDN & Image Optimizer</h2>
        <p class="body-sm" style="color: var(--color-text-secondary); margin-top: 2px;">
          Automatically converts raw food photography into ultra-fast 512×512 WebP assets with 0 byte server overhead.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6);">
        <!-- Left: Upload & Dropzone -->
        <div class="admin-card">
          <h3 class="heading-4" style="color: var(--color-brand-primary); margin-bottom: var(--space-4);">Select Food Image</h3>
          
          <div
            id="cdn-dropzone"
            style="border: 2px dashed var(--color-border-default); border-radius: var(--radius-lg); padding: var(--space-8); text-align: center; background-color: var(--color-surface-primary); cursor: pointer; transition: all 0.2s ease-out;"
          >
            <span style="font-size: 2.5rem; display: block; margin-bottom: var(--space-2);">📸</span>
            <strong style="display: block; color: var(--color-brand-primary); margin-bottom: var(--space-1);">Drag & Drop photo here</strong>
            <span class="body-sm" style="color: var(--color-text-secondary);">or click to browse from device (JPG, PNG, WebP)</span>
            <input type="file" id="cdn-file-input" accept="image/*" style="display: none;" />
          </div>

          <div style="margin-top: var(--space-4);">
            <label class="form-label" for="cdn-target-filename">Target Filename (slug)</label>
            <input
              type="text"
              id="cdn-target-filename"
              class="form-input"
              placeholder="e.g. moong-sprout-bowl"
              value="dish-photo"
            />
            <span class="caption" style="color: var(--color-text-tertiary);">Saved as <code id="cdn-preview-filename">dish-photo.webp</code></span>
          </div>
        </div>

        <!-- Right: Processed Preview & Export -->
        <div class="admin-card">
          <h3 class="heading-4" style="color: var(--color-brand-primary); margin-bottom: var(--space-4);">512×512 WebP Preview</h3>

          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 260px; background-color: var(--color-surface-primary); border-radius: var(--radius-md); padding: var(--space-4); border: 1px solid var(--color-border-subtle);">
            <canvas id="cdn-canvas" width="512" height="512" style="max-width: 220px; max-height: 220px; width: 100%; height: auto; border-radius: var(--radius-md); box-shadow: var(--shadow-md); display: none;"></canvas>
            <div id="cdn-placeholder-view" style="text-align: center; color: var(--color-text-tertiary);">
              <p class="body-sm">No image loaded yet.</p>
              <p class="caption">Processed 512×512 WebP will appear here.</p>
            </div>
          </div>

          <!-- Stats Bar -->
          <div id="cdn-stats-bar" style="display: none; justify-content: space-between; align-items: center; margin-top: var(--space-4); padding: var(--space-3); background-color: rgba(74, 124, 89, 0.1); border-radius: var(--radius-md); border: 1px solid rgba(74, 124, 89, 0.2);">
            <div>
              <span class="caption" style="color: var(--color-success); font-weight: var(--weight-bold); display: block;">Optimized Size</span>
              <strong id="cdn-optimized-size" style="color: var(--color-brand-primary); font-size: var(--text-sm);">— KB</strong>
            </div>
            <button type="button" class="btn btn-primary btn-sm" id="cdn-download-btn">
              ⬇ Download .webp
            </button>
          </div>

          <!-- CDN Link Helper -->
          <div style="margin-top: var(--space-4);">
            <label class="form-label">jsDelivr CDN Link</label>
            <div style="display: flex; gap: var(--space-2);">
              <input
                type="text"
                id="cdn-generated-url"
                class="form-input"
                readonly
                value="https://cdn.jsdelivr.net/gh/user/omkara-cdn/products/dish-photo.webp"
                style="background-color: var(--color-surface-secondary); font-size: var(--text-xs); font-family: var(--font-mono);"
              />
              <button type="button" class="btn btn-secondary btn-sm" id="cdn-copy-url-btn">
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function setupCDNPanelView(): void {
  const dropzone = document.getElementById('cdn-dropzone');
  const fileInput = document.getElementById('cdn-file-input') as HTMLInputElement | null;
  const canvas = document.getElementById('cdn-canvas') as HTMLCanvasElement | null;
  const placeholder = document.getElementById('cdn-placeholder-view');
  const filenameInput = document.getElementById('cdn-target-filename') as HTMLInputElement | null;
  const previewFilename = document.getElementById('cdn-preview-filename');
  const statsBar = document.getElementById('cdn-stats-bar');
  const sizeDisplay = document.getElementById('cdn-optimized-size');
  const downloadBtn = document.getElementById('cdn-download-btn');
  const urlInput = document.getElementById('cdn-generated-url') as HTMLInputElement | null;
  const copyBtn = document.getElementById('cdn-copy-url-btn');

  let currentBlob: Blob | null = null;

  const updateUrl = () => {
    const fn = (filenameInput?.value.trim() || 'dish-photo').replace(/\.[^/.]+$/, '');
    if (previewFilename) previewFilename.textContent = `${fn}.webp`;
    if (urlInput) {
      urlInput.value = `https://cdn.jsdelivr.net/gh/user/omkara-cdn/products/${fn}.webp`;
    }
  };

  filenameInput?.addEventListener('input', updateUrl);

  dropzone?.addEventListener('click', () => fileInput?.click());

  dropzone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--color-brand-accent)';
  });

  dropzone?.addEventListener('dragleave', () => {
    dropzone.style.borderColor = 'var(--color-border-default)';
  });

  dropzone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--color-border-default)';
    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  });

  fileInput?.addEventListener('change', () => {
    if (fileInput.files && fileInput.files[0]) {
      processImageFile(fileInput.files[0]);
    }
  });

  function processImageFile(file: File) {
    if (!filenameInput?.value || filenameInput.value === 'dish-photo') {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (filenameInput) filenameInput.value = cleanName;
      updateUrl();
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = new Image();
      img.onload = () => {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Crop square from center
        const size = Math.min(img.width, img.height);
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;

        ctx.clearRect(0, 0, 512, 512);
        ctx.drawImage(img, startX, startY, size, size, 0, 0, 512, 512);

        canvas.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';

        // Export as WebP
        canvas.toBlob(
          (blob) => {
            if (blob) {
              currentBlob = blob;
              const kb = (blob.size / 1024).toFixed(1);
              if (sizeDisplay) sizeDisplay.textContent = `${kb} KB (512×512 WebP)`;
              if (statsBar) statsBar.style.display = 'flex';
            }
          },
          'image/webp',
          0.85
        );
      };
      img.src = evt.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  downloadBtn?.addEventListener('click', () => {
    if (!currentBlob) return;
    const fn = (filenameInput?.value.trim() || 'dish-photo').replace(/\.[^/.]+$/, '');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(currentBlob);
    a.download = `${fn}.webp`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  copyBtn?.addEventListener('click', () => {
    if (urlInput) {
      navigator.clipboard.writeText(urlInput.value);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 2000);
    }
  });
}
