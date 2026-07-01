import { mockDispatch } from './mock-dispatch';
import { realDispatch } from './real-dispatch';
import { isRealBackendEnabled } from './supabase-client';
import { captureSink } from '@/telemetry/capture-sink';

export interface ApiClientRequestOptions<TBody = unknown> {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: TBody;
  headers?: Record<string, string>;
}

export interface ApiClientResponse<TData> {
  data: TData;
}

/**
 * @route ANY /api/*
 */
export async function apiClient<TData, TBody = unknown>(
  route: string,
  options: ApiClientRequestOptions<TBody> = {},
): Promise<ApiClientResponse<TData>> {
  // PAC-R2 whole-dispatcher flip (OD-PAC-04, docs/backend/switch/architecture.md):
  // VITE_USE_REAL_BACKEND selects the backend ONCE per call, off by default (mock).
  const dispatch = isRealBackendEnabled() ? realDispatch : mockDispatch;

  // BE3-R5a capture tap: OFF by default. When VITE_BE3_CAPTURE !== '1' this branch
  // is skipped entirely, so returned data and timing are unchanged (D-BE3-CAPTURE-OFF).
  if (!captureSink.isEnabled()) {
    return dispatch<TData>(route, options as ApiClientRequestOptions<unknown>);
  }
  const start = performance.now();
  const response = await dispatch<TData>(route, options as ApiClientRequestOptions<unknown>);
  captureSink.record({
    route,
    method: options.method ?? 'GET',
    requestBody: options.body,
    response: response.data,
    durationMs: performance.now() - start,
  });
  return response;
}
