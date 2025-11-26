export const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api').replace(/\/+$/, '');

export type PaginatedResponse<T> = {
  data: T[];
  meta?: unknown;
  links?: unknown;
};

export function extractData<T>(payload: PaginatedResponse<T> | T[] | null | undefined): T[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
}

export async function fetchJson<T>(
  path: string,
  init?: RequestInit & { revalidate?: number }
): Promise<T | null> {
  const { revalidate, ...rest } = init ?? {};
  const res = await fetch(`${apiBase}${path}`, {
    ...rest,
    next: revalidate !== undefined ? { revalidate } : undefined,
  });

  if (res.status === 404) return null as T;
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with ${res.status}`);
  }

  return (await res.json()) as T;
}
