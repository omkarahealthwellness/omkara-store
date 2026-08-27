// ============================================================
// Firebase Configuration
// ============================================================
// Shared Firebase initialization for all OMKARA projects.
// Each project imports this module to get a configured
// Firestore instance (and Auth for admin).
//
// Uses Vite env vars when available (.env file for local dev),
// falls back to hardcoded production defaults otherwise.
// NOTE: These are CLIENT-SIDE Firebase keys — they are always
// embedded in the JS bundle and protected by Security Rules,
// NOT by key secrecy. Safe to commit.
// ============================================================

import { initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';

// ── Production defaults (safe to commit — client-side keys) ──
const PRODUCTION_CONFIG = {
  apiKey: 'AIzaSyB-6Hj5ltWTfkP8V2KA_Ep5k-t7Z5ZoV8A',
  authDomain: 'omkara-foods.firebaseapp.com',
  projectId: 'omkara-foods',
  storageBucket: 'omkara-foods.firebasestorage.app',
  messagingSenderId: '658065481663',
  appId: '1:658065481663:web:7c11332fcd1c988ebd0b0a',
} as const;

/**
 * Firebase configuration.
 * Prefers Vite env vars (from .env) when available, otherwise
 * falls back to production defaults so deploys work without
 * configuring env vars on the hosting platform.
 */
function getFirebaseConfig() {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || PRODUCTION_CONFIG.apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || PRODUCTION_CONFIG.authDomain,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || PRODUCTION_CONFIG.projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || PRODUCTION_CONFIG.storageBucket,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || PRODUCTION_CONFIG.messagingSenderId,
    appId: import.meta.env.VITE_FIREBASE_APP_ID || PRODUCTION_CONFIG.appId,
  };
}

// ── Singleton instances ──────────────────────────────────────

let _app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _auth: Auth | null = null;

/**
 * Get the Firebase app instance (creates one if not yet initialized).
 */
export function getApp(): FirebaseApp {
  if (!_app) {
    const config = getFirebaseConfig();
    if (!config.projectId) {
      throw new Error(
        '[OMKARA] Firebase not configured. ' +
        'Copy .env.example to .env and fill in your Firebase project values.'
      );
    }
    _app = initializeApp(config);
  }
  return _app;
}

/**
 * Get the Firestore database instance.
 * Used by both storefront (public reads) and admin (reads + writes).
 */
export function getDb(): Firestore {
  if (!_db) {
    _db = getFirestore(getApp());
  }
  return _db;
}

/**
 * Get the Firebase Auth instance.
 * Used only by the admin panel for owner authentication.
 * The storefront NEVER calls this — zero customer auth.
 */
export function getAdminAuth(): Auth {
  if (!_auth) {
    _auth = getAuth(getApp());
  }
  return _auth;
}
