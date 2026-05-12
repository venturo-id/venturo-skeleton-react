// LocalStorage utilities for Timebox module

// ----------------------------------------------------------------------
// Type Definitions
// ----------------------------------------------------------------------

type StorageValue = string | number | boolean | object | null;
type StorageKey = string;

// ----------------------------------------------------------------------
// Getters
// ----------------------------------------------------------------------

/**
 * Get item from localStorage
 */
export function storageGet<T = StorageValue>(key: StorageKey, defaultValue?: T): T | null {
  try {
    const item = window.localStorage.getItem(key);
    if (item === null) {
      return defaultValue ?? null;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue ?? null;
  }
}

/**
 * Get string from localStorage
 */
export function storageGetString(key: StorageKey, defaultValue = ''): string {
  const item = window.localStorage.getItem(key);
  return item ?? defaultValue;
}

/**
 * Get number from localStorage
 */
export function storageGetNumber(key: StorageKey, defaultValue = 0): number {
  try {
    const item = window.localStorage.getItem(key);
    if (item === null) return defaultValue;
    const parsed = Number.parseFloat(item);
    return Number.isNaN(parsed) ? defaultValue : parsed;
  } catch {
    return defaultValue;
  }
}

/**
 * Get boolean from localStorage
 */
export function storageGetBoolean(key: StorageKey, defaultValue = false): boolean {
  try {
    const item = window.localStorage.getItem(key);
    if (item === null) return defaultValue;
    return item === 'true';
  } catch {
    return defaultValue;
  }
}

/**
 * Get object from localStorage
 */
export function storageGetObject<T extends Record<string, unknown>>(
  key: StorageKey,
  defaultValue: T
): T {
  try {
    const item = window.localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Get array from localStorage
 */
export function storageGetArray<T>(key: StorageKey, defaultValue: T[] = []): T[] {
  try {
    const item = window.localStorage.getItem(key);
    if (item === null) return defaultValue;
    const parsed = JSON.parse(item);
    return Array.isArray(parsed) ? (parsed as T[]) : defaultValue;
  } catch {
    return defaultValue;
  }
}

// ----------------------------------------------------------------------
// Setters
// ----------------------------------------------------------------------

/**
 * Set item in localStorage
 */
export function storageSet(key: StorageKey, value: StorageValue): boolean {
  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Set string in localStorage
 */
export function storageSetString(key: StorageKey, value: string): boolean {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error writing string to localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Set number in localStorage
 */
export function storageSetNumber(key: StorageKey, value: number): boolean {
  return storageSetString(key, String(value));
}

/**
 * Set boolean in localStorage
 */
export function storageSetBoolean(key: StorageKey, value: boolean): boolean {
  return storageSetString(key, String(value));
}

// ----------------------------------------------------------------------
// Removers
// ----------------------------------------------------------------------

/**
 * Remove item from localStorage
 */
export function storageRemove(key: StorageKey): boolean {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Clear all items from localStorage
 */
export function storageClear(): boolean {
  try {
    window.localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}

// ----------------------------------------------------------------------
// Checkers
// ----------------------------------------------------------------------

/**
 * Check if key exists in localStorage
 */
export function storageHas(key: StorageKey): boolean {
  return window.localStorage.getItem(key) !== null;
}

/**
 * Get all keys from localStorage
 */
export function storageKeys(): string[] {
  return Object.keys(window.localStorage);
}

// ----------------------------------------------------------------------
// Batch Operations
// ----------------------------------------------------------------------

/**
 * Get multiple items from localStorage
 */
export function storageGetMultiple<T extends Record<string, StorageValue>>(
  keys: StorageKey[]
): Partial<Record<StorageKey, T>> {
  const result: Partial<Record<StorageKey, T>> = {};

  for (const key of keys) {
    result[key] = storageGet<T>(key) as T;
  }

  return result;
}

/**
 * Set multiple items in localStorage
 */
export function storageSetMultiple<T extends Record<string, StorageValue>>(
  items: T
): boolean {
  try {
    for (const [key, value] of Object.entries(items)) {
      const serialized = JSON.stringify(value);
      window.localStorage.setItem(key, serialized);
    }
    return true;
  } catch (error) {
    console.error('Error setting multiple localStorage items:', error);
    return false;
  }
}

/**
 * Remove multiple items from localStorage
 */
export function storageRemoveMultiple(keys: StorageKey[]): boolean {
  try {
    for (const key of keys) {
      window.localStorage.removeItem(key);
    }
    return true;
  } catch (error) {
    console.error('Error removing multiple localStorage items:', error);
    return false;
  }
}

// ----------------------------------------------------------------------
// Prefix Operations
// ----------------------------------------------------------------------

/**
 * Get all keys with a specific prefix
 */
export function storageGetKeysByPrefix(prefix: string): string[] {
  const allKeys = storageKeys();
  return allKeys.filter((key) => key.startsWith(prefix));
}

/**
 * Remove all keys with a specific prefix
 */
export function storageRemoveByPrefix(prefix: string): boolean {
  const keysToRemove = storageGetKeysByPrefix(prefix);
  return storageRemoveMultiple(keysToRemove);
}

// ----------------------------------------------------------------------
// Session Storage (similar API but uses sessionStorage)
// ----------------------------------------------------------------------

/**
 * Get item from sessionStorage
 */
export function sessionGet<T = StorageValue>(key: StorageKey, defaultValue?: T): T | null {
  try {
    const item = window.sessionStorage.getItem(key);
    if (item === null) {
      return defaultValue ?? null;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from sessionStorage key "${key}":`, error);
    return defaultValue ?? null;
  }
}

/**
 * Set item in sessionStorage
 */
export function sessionSet(key: StorageKey, value: StorageValue): boolean {
  try {
    const serialized = JSON.stringify(value);
    window.sessionStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Error writing to sessionStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Remove item from sessionStorage
 */
export function sessionRemove(key: StorageKey): boolean {
  try {
    window.sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing sessionStorage key "${key}":`, error);
    return false;
  }
}

// ----------------------------------------------------------------------
// Utility Functions
// ----------------------------------------------------------------------

/**
 * Get storage size in bytes (approximately)
 */
export function getStorageSize(): number {
  let total = 0;
  const keys = storageKeys();

  for (const key of keys) {
    const value = window.localStorage.getItem(key);
    if (value) {
      total += key.length + value.length;
    }
  }

  return total;
}

/**
 * Format storage size to human-readable format
 */
export function formatStorageSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if sessionStorage is available
 */
export function isSessionStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    window.sessionStorage.setItem(testKey, 'test');
    window.sessionStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
