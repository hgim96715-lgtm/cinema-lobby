const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3050';

function parseApiErrorMessage(body: unknown, status: number): string {
  if (body && typeof body === 'object' && 'message' in body) {
    const message = (body as { message: unknown }).message;
    if (typeof message === 'string' && message.trim()) return message;
    if (Array.isArray(message)) {
      const parts = message.filter(
        (part): part is string =>
          typeof part === 'string' && part.trim().length > 0,
      );
      if (parts.length > 0) return parts.join(', ');
    }
  }
  return `HTTP ${status}`;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const { token, headers, ...rest } = options;
  const res = await fetch(`${API_URL}/v1${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(parseApiErrorMessage(body, res.status));
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
