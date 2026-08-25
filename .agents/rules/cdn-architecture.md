# CDN Panel Architecture & Execution Guide

> **PURPOSE:** This document provides the absolute ground truth for building the OMKARA CDN Panel (`cdn-panel/`). Any AI agent working on this tool MUST follow these rules exactly.

---

## 1. WHAT IS THE CDN PANEL?

Because the client wants to avoid heavy recurring server costs (like Cloudinary or AWS S3 data egress), image hosting is offloaded to a free, global CDN strategy: **GitHub Pages + jsDelivr**.

The `cdn-panel` is a standalone, client-side-only Vite application used strictly by the admin to process and upload images.

### The Pipeline:
1. Admin selects a raw photo (e.g., 4000x3000 JPEG, 5MB).
2. The browser (Canvas API) resizes, crops, and converts it to a highly optimized 512x512 WebP (< 50KB).
3. The browser uses the GitHub REST API to commit this single file to a specific repository.
4. The panel generates the public `cdn.jsdelivr.net/gh/...` URL for the admin to copy and paste into the Admin Panel's product configuration.

---

## 2. CORE ARCHITECTURAL CONSTRAINTS

### 2.1 Zero Frameworks
- **NO** React, Vue, Angular, etc.
- **NO** Tailwind CSS or CSS frameworks.
- **ONLY** Vanilla TypeScript and Vanilla CSS.

### 2.2 Pure Client-Side Execution
- There is NO backend Node.js server for the CDN panel.
- All image manipulation MUST happen in the browser using the native `HTMLCanvasElement`.
- **Do not** import heavy image processing libraries (like `sharp` or `jimp`) which are meant for Node.js.

### 2.3 API Security
- The GitHub Personal Access Token (PAT) required to upload files MUST NOT be hardcoded.
- It must be provided via an environment variable (`VITE_GITHUB_TOKEN`) during the build process, or requested from the admin via a secure input field saved to `localStorage`.

---

## 3. MICRO-PHASE EXECUTION (PHASES 35-36)

### Phase 35: Image Processing Engine
**Goal:** Take a raw file, crop to 1:1, resize to 512x512, and export as WebP.

1. **Input:** `<input type="file" accept="image/*">`
2. **Read:** Use `FileReader` or `URL.createObjectURL(file)` to load the image into an `HTMLImageElement`.
3. **Canvas Setup:**
   ```typescript
   const canvas = document.createElement('canvas');
   canvas.width = 512;
   canvas.height = 512;
   const ctx = canvas.getContext('2d');
   ```
4. **Draw & Crop (Cover):** Calculate aspect ratio. Draw the image into the 512x512 canvas so it fills the square (cropping the overflow from the longest edge).
5. **Export:** 
   ```typescript
   canvas.toBlob((blob) => {
     // blob is now a compressed WebP file ready for upload
   }, 'image/webp', 0.85); // 85% quality
   ```

### Phase 36: GitHub Upload Integration
**Goal:** Push the Blob to GitHub via API and get the jsDelivr URL.

1. Convert the WebP Blob to a Base64 string (required by GitHub API).
2. Construct the API request to: `PUT /repos/{owner}/{repo}/contents/{path}`
3. Payload requires: `message` (commit msg) and `content` (base64 data).
4. **URL Generation:**
   Once successful, generate the CDN link:
   `https://cdn.jsdelivr.net/gh/{owner}/{repo}@{branch}/{path}`
5. Render a UI card showing the uploaded image, the generated URL, and a "Copy to Clipboard" button (`navigator.clipboard.writeText`).

---

## 4. ERROR HANDLING & UX
- Image processing takes CPU time. Show a clear loading state ("Optimizing image...") while the Canvas API is working.
- Network uploads can fail. Handle GitHub API errors (e.g., 401 Unauthorized if token is invalid, 422 if file exists) gracefully and display them to the user.
- Ensure the Drag & Drop zone highlights when a file is dragged over it.
