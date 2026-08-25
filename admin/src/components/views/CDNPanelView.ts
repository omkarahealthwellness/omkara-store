// ============================================================
// OMKARA Admin — CDN & Image Optimizer Panel
// ============================================================
import { showToast } from '../ui/Toast';

const REPO_OWNER = 'omkarahealthwellness';
const REPO_NAME = 'omkara-cdn';
const BRANCH = 'main';

export function renderCDNPanelView(): string {
  return `
    <div>
      <div style="margin-bottom: var(--space-6);">
        <h2 class="heading-2" style="color: var(--color-brand-primary);">CDN & Image Optimizer</h2>
        <p class="body-sm" style="color: var(--color-text-secondary); margin-top: 2px;">
          Automatically converts raw food photography into ultra-fast 512×512 WebP assets, pushes to GitHub CDN, and manages gallery.
        </p>
      </div>

      <!-- GitHub Token Configuration -->
      <div class="admin-card" style="margin-bottom: var(--space-6);">
        <div style="display: flex; gap: var(--space-4); align-items: flex-end; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 250px;">
            <label class="form-label" for="cdn-github-token">GitHub Personal Access Token (Requires 'repo' scope)</label>
            <input type="password" id="cdn-github-token" class="form-input" placeholder="ghp_..." />
          </div>
          <button type="button" class="btn btn-secondary" id="cdn-load-gallery-btn">
            Load Gallery
          </button>
        </div>
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
            <div style="display: flex; gap: var(--space-2);">
              <button type="button" class="btn btn-secondary btn-sm" id="cdn-download-btn" title="Download Locally">
                ⬇
              </button>
              <button type="button" class="btn btn-primary btn-sm" id="cdn-push-btn">
                ☁️ Push to CDN
              </button>
            </div>
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
                value="https://cdn.jsdelivr.net/gh/${REPO_OWNER}/${REPO_NAME}@${BRANCH}/products/dish-photo.webp"
                style="background-color: var(--color-surface-secondary); font-size: var(--text-xs); font-family: var(--font-mono);"
              />
              <button type="button" class="btn btn-secondary btn-sm" id="cdn-copy-url-btn">
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Gallery Section -->
      <div class="admin-card" style="margin-top: var(--space-6);">
        <h3 class="heading-4" style="color: var(--color-brand-primary); margin-bottom: var(--space-4);">CDN Image Gallery</h3>
        <div id="cdn-gallery-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: var(--space-4);">
          <p class="body-sm" style="color: var(--color-text-secondary); grid-column: 1 / -1;">Enter GitHub token and click Load Gallery.</p>
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
  const pushBtn = document.getElementById('cdn-push-btn') as HTMLButtonElement | null;
  const urlInput = document.getElementById('cdn-generated-url') as HTMLInputElement | null;
  const copyBtn = document.getElementById('cdn-copy-url-btn');
  const tokenInput = document.getElementById('cdn-github-token') as HTMLInputElement | null;
  const loadGalleryBtn = document.getElementById('cdn-load-gallery-btn');
  const galleryGrid = document.getElementById('cdn-gallery-grid');

  let currentBlob: Blob | null = null;
  let currentBase64: string = '';

  // Load token from localStorage
  if (tokenInput) {
    const savedToken = localStorage.getItem('omkara_github_token');
    if (savedToken) {
      tokenInput.value = savedToken;
    }
    tokenInput.addEventListener('change', () => {
      localStorage.setItem('omkara_github_token', tokenInput.value);
    });
  }

  const updateUrl = () => {
    const fn = (filenameInput?.value.trim() || 'dish-photo').replace(/\.[^/.]+$/, '');
    if (previewFilename) previewFilename.textContent = `${fn}.webp`;
    if (urlInput) {
      urlInput.value = `https://cdn.jsdelivr.net/gh/${REPO_OWNER}/${REPO_NAME}@${BRANCH}/products/${fn}.webp`;
    }
  };

  filenameInput?.addEventListener('input', updateUrl);

  dropzone?.addEventListener('click', () => fileInput?.click());

  dropzone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (dropzone) dropzone.style.borderColor = 'var(--color-brand-accent)';
  });

  dropzone?.addEventListener('dragleave', () => {
    if (dropzone) dropzone.style.borderColor = 'var(--color-border-default)';
  });

  dropzone?.addEventListener('drop', (e) => {
    e.preventDefault();
    if (dropzone) dropzone.style.borderColor = 'var(--color-border-default)';
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
              
              // Get base64 for GitHub push
              const reader2 = new FileReader();
              reader2.onloadend = () => {
                const dataUrl = reader2.result as string;
                currentBase64 = dataUrl.split(',')[1];
              };
              reader2.readAsDataURL(blob);
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
  
  pushBtn?.addEventListener('click', async () => {
    if (!currentBase64) return;
    const token = tokenInput?.value.trim();
    if (!token) {
      showToast('Please enter your GitHub Personal Access Token first.');
      return;
    }
    
    const fn = (filenameInput?.value.trim() || 'dish-photo').replace(/\.[^/.]+$/, '');
    const path = `products/${fn}.webp`;
    const message = `Add ${fn}.webp`;
    
    try {
      if (pushBtn) pushBtn.disabled = true;
      if (pushBtn) pushBtn.textContent = 'Pushing...';
      
      // 1. Check if file exists to get SHA (for overwrite)
      let sha = undefined;
      const getRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (getRes.ok) {
        const data = await getRes.json();
        sha = data.sha;
      }
      
      // 2. Put file
      const putRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          content: currentBase64,
          branch: BRANCH,
          sha: sha
        })
      });
      
      if (!putRes.ok) {
        const errorData = await putRes.json();
        throw new Error(errorData.message || 'Failed to push to GitHub');
      }
      
      showToast('Image successfully pushed to CDN!');
      if (loadGalleryBtn) loadGalleryBtn.click(); // Reload gallery
    } catch (err: any) {
      showToast(err.message || 'Error pushing to GitHub');
      console.error(err);
    } finally {
      if (pushBtn) {
        pushBtn.disabled = false;
        pushBtn.textContent = '☁️ Push to CDN';
      }
    }
  });

  copyBtn?.addEventListener('click', () => {
    if (urlInput) {
      navigator.clipboard.writeText(urlInput.value);
      if (copyBtn) copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        if (copyBtn) copyBtn.textContent = 'Copy';
      }, 2000);
    }
  });
  
  // Gallery Logic
  loadGalleryBtn?.addEventListener('click', async () => {
    const token = tokenInput?.value.trim();
    if (!galleryGrid) return;
    
    if (!token) {
      galleryGrid.innerHTML = `<p class="body-sm" style="color: var(--color-error); grid-column: 1 / -1;">Please enter a GitHub token to load the gallery.</p>`;
      return;
    }
    
    galleryGrid.innerHTML = `<p class="body-sm" style="color: var(--color-text-secondary); grid-column: 1 / -1;">Loading gallery...</p>`;
    
    try {
      const getRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (!getRes.ok) {
        if (getRes.status === 404) {
           galleryGrid.innerHTML = `<p class="body-sm" style="color: var(--color-text-secondary); grid-column: 1 / -1;">No images found in products/ yet.</p>`;
           return;
        }
        const errorData = await getRes.json();
        throw new Error(errorData.message || 'Failed to fetch gallery');
      }
      
      const files: any[] = await getRes.json();
      const imageFiles = files.filter(f => f.type === 'file' && (f.name.endsWith('.webp') || f.name.endsWith('.jpg') || f.name.endsWith('.png')));
      
      if (imageFiles.length === 0) {
        galleryGrid.innerHTML = `<p class="body-sm" style="color: var(--color-text-secondary); grid-column: 1 / -1;">No images found in CDN.</p>`;
        return;
      }
      
      galleryGrid.innerHTML = imageFiles.map(file => {
        const jsdelivrUrl = `https://cdn.jsdelivr.net/gh/${REPO_OWNER}/${REPO_NAME}@${BRANCH}/${file.path}`;
        return `
          <div class="gallery-item" style="border: 1px solid var(--color-border-subtle); border-radius: var(--radius-md); overflow: hidden; background: var(--color-surface-primary); display: flex; flex-direction: column;">
            <img src="${jsdelivrUrl}" alt="${file.name}" style="width: 100%; aspect-ratio: 1/1; object-fit: cover;" loading="lazy" />
            <div style="padding: var(--space-2); display: flex; flex-direction: column; gap: var(--space-2);">
              <span class="caption" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${file.name}">${file.name}</span>
              <button type="button" class="btn btn-secondary btn-sm copy-gallery-btn" data-url="${jsdelivrUrl}" style="width: 100%; font-size: var(--text-xs); padding: var(--space-1);">Copy Link</button>
            </div>
          </div>
        `;
      }).join('');
      
      // Attach copy listeners
      const copyBtns = galleryGrid.querySelectorAll('.copy-gallery-btn');
      copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const target = e.target as HTMLButtonElement;
          const url = target.getAttribute('data-url');
          if (url) {
            navigator.clipboard.writeText(url);
            const originalText = target.textContent;
            target.textContent = 'Copied!';
            setTimeout(() => {
              target.textContent = originalText;
            }, 2000);
          }
        });
      });
      
    } catch (err: any) {
      galleryGrid.innerHTML = `<p class="body-sm" style="color: var(--color-error); grid-column: 1 / -1;">Error: ${err.message}</p>`;
    }
  });
}
