import type { ApiEnvelope } from 'src/module/core/features/auth/types';

// ----------------------------------------------------------------------

export type ApiKeyEnvironment = 'live' | 'test';

// Masked API key object (List / Get / Update) — secret is never returned here.
export type ApiKey = {
  id: string;
  key_prefix: string;
  name: string;
  description: string | null;
  environment: ApiKeyEnvironment;
  scoped_permissions: string[];
  ip_whitelist: string[];
  rate_limit: number;
  rate_limit_window: number;
  expires_at: string | null;
  revoked_at: string | null;
  last_used_at: string | null;
  last_used_ip: string | null;
  total_requests: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// 201 create response — the only time the full secret `key` is returned.
export type CreateApiKeyResult = {
  id: string;
  key: string;
  key_prefix: string;
  name: string;
  message: string;
};

export type ApiKeyListParams = {
  page?: number;
  limit?: number;
  environment?: ApiKeyEnvironment;
  is_active?: boolean;
};

export type CreateApiKeyPayload = {
  name: string;
  description?: string;
  environment?: ApiKeyEnvironment;
  scoped_permissions?: string[];
  ip_whitelist?: string[];
  rate_limit?: number;
  rate_limit_window?: number;
  expires_at?: string;
};

export type UpdateApiKeyPayload = {
  name?: string;
  description?: string;
  scoped_permissions?: string[];
  ip_whitelist?: string[];
  rate_limit?: number;
  rate_limit_window?: number;
};

export type RevokeApiKeyPayload = {
  reason?: string;
};

// NOTE: Unlike other list endpoints, the API-key contract nests pagination
// INSIDE `data` (`data.api_keys`, `data.total`, `data.page`, `data.limit`),
// not in `meta.pagination`. See `api/index.ts` for parsing.
export type ApiKeyListData = {
  api_keys: ApiKey[];
  total: number;
  page: number;
  limit: number;
};

export type ApiKeyListEnvelope = ApiEnvelope<ApiKeyListData>;
