import type {
  ApiKey,
  ApiKeyListParams,
  CreateApiKeyResult,
  CreateApiKeyPayload,
  UpdateApiKeyPayload,
  ApiKeyListEnvelope,
} from '../types';

import axios, { endpoints } from 'src/shared/lib/axios';

// ----------------------------------------------------------------------

type Meta = { page: number; limit: number; total: number; total_pages: number };

// NOTE: pagination is nested INSIDE `data` for this contract
// (`data.api_keys`, `data.total`, `data.page`, `data.limit`),
// not in `meta.pagination` like branches/fund-transfer.
export async function listApiKeysPaginated(
  params: ApiKeyListParams = {}
): Promise<{ data: ApiKey[]; meta: Meta }> {
  const res = await axios.get<ApiKeyListEnvelope>(endpoints.core.apiKeys.list, {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      environment: params.environment || undefined,
      is_active: params.is_active,
    },
  });
  const payload = res.data.data ?? { api_keys: [], total: 0, page: 1, limit: 20 };
  const data = payload.api_keys ?? [];
  const limit = payload.limit || data.length || 20;
  const total = payload.total ?? data.length;
  return {
    data,
    meta: {
      page: payload.page ?? 1,
      limit,
      total,
      total_pages: limit > 0 ? Math.ceil(total / limit) : 1,
    },
  };
}

export async function getApiKey(id: string): Promise<ApiKey> {
  const res = await axios.get<{ data: ApiKey | null; message: string }>(
    endpoints.core.apiKeys.byId(id)
  );
  if (!res.data.data) throw new Error(res.data.message || 'API key not found');
  return res.data.data;
}

// Returns the 201 payload — the ONLY response that contains the full secret `key`.
export async function createApiKey(payload: CreateApiKeyPayload): Promise<CreateApiKeyResult> {
  const res = await axios.post<{ data: CreateApiKeyResult | null; message: string }>(
    endpoints.core.apiKeys.list,
    payload
  );
  if (!res.data.data) throw new Error(res.data.message || 'Failed to create API key');
  return res.data.data;
}

export async function updateApiKey(id: string, payload: UpdateApiKeyPayload): Promise<ApiKey> {
  const res = await axios.patch<{ data: ApiKey | null; message: string }>(
    endpoints.core.apiKeys.byId(id),
    payload
  );
  if (!res.data.data) throw new Error(res.data.message || 'Failed to update API key');
  return res.data.data;
}

// Revoke (not hard delete). Body is optional.
export async function revokeApiKey(id: string, reason?: string): Promise<{ id: string }> {
  await axios.delete(endpoints.core.apiKeys.byId(id), {
    data: reason ? { reason } : undefined,
  });
  return { id };
}
