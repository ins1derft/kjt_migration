export function withYouTubeOrigin(url: string, origin?: string | null): string {
  const resolvedOrigin =
    origin !== undefined
      ? origin
      : typeof window !== 'undefined'
        ? window.location.origin
        : null;

  if (!resolvedOrigin || !resolvedOrigin.trim()) return url;

  try {
    const parsed = new URL(url);
    parsed.searchParams.set('origin', resolvedOrigin.trim());
    return parsed.toString();
  } catch {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}origin=${encodeURIComponent(resolvedOrigin.trim())}`;
  }
}

