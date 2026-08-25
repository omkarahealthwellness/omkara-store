// ============================================================
// Firebase Configuration
// ============================================================
// Shared Firebase initialization for all OMKARA projects.
// Each project imports this module to get a configured
// Firestore instance (and Auth for admin).
//
// Environment variables are read from each project's .env file
// via Vite's import.meta.env mechanism.
// ============================================================

import { initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';

/**
 * Firebase configuration pulled from environment variables.
 * Each Vite project must define these in its `.env` file.
 */
function getFirebaseConfig() {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
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
