import type {
  User,
  Client,
  Company,
  MeResponse,
  AuthContextValue,
} from 'src/module/core/features/auth/types';

import { vi } from 'vitest';

// ----------------------------------------------------------------------

export const testUser: User = {
  id: 'user-1',
  email: 'rina@example.test',
  username: 'rina',
  full_name: 'Rina Kusuma',
};

export const testCompany: Company = { id: 'company-1', name: 'PT Contoh Abadi' };

export const testClient: Client = { id: 'client-1', slug: 'contoh', name: 'Contoh Group' };

export function meResponse(overrides: Partial<MeResponse> = {}): MeResponse {
  return {
    user: testUser,
    company: testCompany,
    client: testClient,
    roles: ['staff'],
    permissions: ['branches:read'],
    is_super_admin: false,
    ...overrides,
  };
}

/** A complete AuthContextValue for components rendered without AuthProvider. */
export function authContextValue(overrides: Partial<AuthContextValue> = {}): AuthContextValue {
  return {
    loading: false,
    user: testUser,
    company: testCompany,
    client: testClient,
    roles: [],
    permissions: [],
    isSuperAdmin: false,
    companyVersion: 0,
    authenticated: true,
    unauthenticated: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
    switchCompany: vi.fn(),
    checkUserSession: vi.fn(),
    ...overrides,
  };
}
