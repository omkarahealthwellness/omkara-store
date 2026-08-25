// ============================================================
// OMKARA CDN Panel — Entry Point
// ============================================================
// Image upload, processing, and management tool.
// Processes images to 512x512 WebP, uploads to GitHub,
// generates jsDelivr CDN URLs.
// ============================================================

import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui,sans-serif;background:#f0f4f8;color:#2c3e50;">
    <h1 style="font-size:2rem;font-weight:700;letter-spacing:0.1em;margin:0;">OMKARA</h1>
    <p style="font-size:0.75rem;letter-spacing:0.25em;color:#c4a35a;margin:0.5rem 0;">CDN PANEL</p>
    <p style="font-size:0.75rem;color:#888;margin:2rem 0 0;">Phase 1 Complete ✓</p>
  </div>
`;
