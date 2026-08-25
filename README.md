# OMKARA — Digital Food Storefront System

> **SEHAT BHI. SWAAD BHI.**
> Premium, mobile-first, QR-first healthy-food storefront for Bikaner.

## Architecture

```
prompt/
├── storefront/     → Customer-facing menu & ordering (port 3000)
├── admin/          → Business owner CMS (port 3001)
├── cdn-panel/      → Image processing & GitHub CDN upload (port 3002)
├── shared/         → Shared TypeScript types, constants, utilities
└── prompt.md       → Original product specification
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite + vanilla TypeScript |
| Hosting | Cloudflare Pages (free) |
| Database | Firebase Firestore (Spark plan — free) |
| Auth | Firebase Auth (admin only) |
| Images | GitHub repo → jsDelivr CDN |
| Ordering | WhatsApp (pre-formatted message) |

## Quick Start

```bash
# Storefront
cd storefront && npm install && npm run dev

# Admin Panel
cd admin && npm install && npm run dev

# CDN Panel
cd cdn-panel && npm install && npm run dev
```

## Environment Setup

Copy `.env.example` to `.env` in each project directory and fill in your Firebase configuration.

## Infrastructure Constraints

- **Cloudflare Pages free** (no R2, no paid Workers)
- **Firebase Spark plan** (free tier — minimize reads/writes)
- **GitHub + jsDelivr** for image CDN (no paid storage)
- **Zero** customer accounts — scan QR, browse, order via WhatsApp
