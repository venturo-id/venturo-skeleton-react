// API helper utilities for Timebox module

import type { ApiEnvelope } from 'src/module/timebox/types';

// ----------------------------------------------------------------------
// Helper: Unwrap API envelope
// ----------------------------------------------------------------------

/**
 * Unwraps the ApiEnvelope response from the API
 * @throws Error if data is null/undefined or if errors are present
 */
export async function unwrap<T>(promise: Promise<{ data: ApiEnvelope<T> }>): Promise<T> {
  const res = await promise;
  const payload = res.data;

  if (payload.data === null || payload.data === undefined) {
    const messageParts: string[] = [];

    if (payload.message) {
      messageParts.push(String(payload.message));
    }

    if (payload.errors) {
      if (typeof payload.errors === 'string') {
        messageParts.push(payload.errors);
      } else {
        messageParts.push(JSON.stringify(payload.errors));
      }
    }

    const errorMessage = messageParts.length > 0 ? messageParts.join(': ') : 'Empty response';
    throw new Error(errorMessage);
  }

  return payload.data;
}

/**
 * Unwraps a paginated ApiEnvelope response
 */
export async function unwrapPaginated<T>(
  promise: Promise<{ data: ApiEnvelope<T[]> }>
): Promise<T[]> {
  return unwrap<T[]>(promise);
}

/**
 * Converts an API error to a readable Error message
 */
export function normalizeApiError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  // Axios error shape
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response &&
    'status' in error.response
  ) {
    const response = error.response as { data?: { errors?: string; message?: string }; status?: number };
    const data = response.data || {};
    const message = data.errors || data.message || 'API request failed';
    const err = new Error(message);
    if (response.status) {
      (err as any).status = response.status;
    }
    return err;
  }

  return new Error('An unknown error occurred');
}

// ----------------------------------------------------------------------
// Priority conversion utilities
// ----------------------------------------------------------------------

/**
 * Frontend priority string to API number
 */
export function priorityToApi(priority: string): number {
  const mapping: Record<string, number> = {
    urgent: 1,
    high: 2,
    medium: 3,
    low: 4,
    none: 5,
  };
  return mapping[priority] || 5;
}

/**
 * API number to frontend priority string
 */
export function priorityFromApi(priority: number): string {
  const mapping: Record<number, string> = {
    1: 'urgent',
    2: 'high',
    3: 'medium',
    4: 'low',
    5: 'none',
  };
  return mapping[priority] || 'none';
}

// ----------------------------------------------------------------------
// Query param builders
// ----------------------------------------------------------------------

/**
 * Build query string from object
 */
export function buildQueryParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}
