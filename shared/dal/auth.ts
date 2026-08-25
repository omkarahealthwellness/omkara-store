// ============================================================
// OMKARA — Auth Data Access Layer
// ============================================================
// Admin authentication via Firebase Auth (email/password).
// The storefront NEVER imports this module.
// ============================================================

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import type { User, Unsubscribe } from 'firebase/auth';
import { getAdminAuth } from '../firebase/config';

/**
 * Sign in the admin user with email and password.
 * Returns the Firebase User on success, throws on failure.
 */
export async function adminLogin(
  email: string,
  password: string,
): Promise<User> {
  const auth = getAdminAuth();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/**
 * Sign out the current admin user.
 */
export async function adminLogout(): Promise<void> {
  const auth = getAdminAuth();
  await signOut(auth);
}

/**
 * Get the currently authenticated admin user (or null).
 */
export function getCurrentAdmin(): User | null {
  const auth = getAdminAuth();
  return auth.currentUser;
}

/**
 * Subscribe to auth state changes.
 * Returns an unsubscribe function.
 * 
 * Usage:
 * ```ts
 * const unsubscribe = onAdminAuthChange((user) => {
 *   if (user) { // logged in }
 *   else { // logged out, redirect to login }
 * });
 * ```
 */
export function onAdminAuthChange(
  callback: (user: User | null) => void,
): Unsubscribe {
  const auth = getAdminAuth();
  return onAuthStateChanged(auth, callback);
}
