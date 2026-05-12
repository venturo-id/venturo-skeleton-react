// Cache management utilities for Timebox module

import { TIMEBOX_STORAGE_KEYS } from './constants';
import { storageGet, storageSet } from './storage.helpers';

// ----------------------------------------------------------------------
// Cache Types
// ----------------------------------------------------------------------

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  version?: number;
}

export interface CacheOptions {
  duration?: number; // Cache duration in milliseconds
  version?: number; // Optional version number for cache busting
}

// ----------------------------------------------------------------------
// Cache Helpers
// ----------------------------------------------------------------------

/**
 * Get cached data if still valid
 */
export function getCached<T>(
  key: string,
  options: CacheOptions = {}
): T | null {
  const { duration = 5 * 60 * 1000, version } = options;

  const cached = storageGet<CacheEntry<T>>(key);
  if (!cached) return null;

  // Check version if provided
  if (version !== undefined && cached.version !== version) {
    return null;
  }

  // Check expiry
  const now = Date.now();
  if (now - cached.timestamp > duration) {
    return null;
  }

  return cached.data;
}

/**
 * Set cached data
 */
export function setCached<T>(
  key: string,
  data: T,
  options: CacheOptions = {}
): void {
  const { version } = options;

  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    version,
  };

  storageSet(key, entry);
}

/**
 * Invalidate a specific cache entry
 */
export function invalidateCache(key: string): void {
  localStorage.removeItem(key);
}

/**
 * Invalidate multiple cache entries
 */
export function invalidateCaches(keys: string[]): void {
  keys.forEach((key) => localStorage.removeItem(key));
}

/**
 * Invalidate all timebox caches
 */
export function invalidateAllTimeboxCaches(): void {
  const keys = Object.values(TIMEBOX_STORAGE_KEYS) as string[];
  keys.forEach((key) => {
    if (key.includes('cache')) {
      localStorage.removeItem(key);
    }
  });
}

// ----------------------------------------------------------------------
// Cache Duration Constants
// ----------------------------------------------------------------------

export const CACHE_DURATION = {
  SHORT: 2 * 60 * 1000, // 2 minutes
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 15 * 60 * 1000, // 15 minutes
} as const;

// ----------------------------------------------------------------------
// Specific Cache Helpers
// ----------------------------------------------------------------------

/**
 * Invalidate projects cache
 */
export function invalidateProjectsCache(): void {
  invalidateCache(TIMEBOX_STORAGE_KEYS.PROJECTS_CACHE);
}

/**
 * Invalidate tasks cache
 */
export function invalidateTasksCache(): void {
  invalidateCache(TIMEBOX_STORAGE_KEYS.TASKS_CACHE);
}

/**
 * Invalidate labels cache
 */
export function invalidateLabelsCache(): void {
  invalidateCache('timebox.labels_cache');
}

/**
 * Invalidate teams cache
 */
export function invalidateTeamsCache(): void {
  invalidateCache('timebox.teams_cache');
}
