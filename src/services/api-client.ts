import { mockDispatch } from './mock-dispatch';

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
  return mockDispatch<TData>(route, options as ApiClientRequestOptions<unknown>);
}
