/// <reference types="vite/client" />

// Vite environment variable declarations for OMKARA
interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_GITHUB_TOKEN: string;
  readonly VITE_GITHUB_OWNER: string;
  readonly VITE_GITHUB_REPO: string;
  readonly VITE_GITHUB_BRANCH: string;
  readonly VITE_GITHUB_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
