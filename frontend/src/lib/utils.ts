import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const imageBaseUrl = (process.env.NEXT_IMAGE_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');

/**
 * Normalize media URLs coming from the CMS:
 * - pass through absolute/http/https/data URLs unchanged
 * - prefix relative paths (e.g. "pages/specs/img.svg") with `/storage/`
 * - keep already-prefixed `/storage/...` paths
 * - if NEXT_PUBLIC_SITE_URL is set, return an absolute URL so Next.js image optimizer
 *   can fetch it through Nginx instead of looking for a local file inside the Next container
 */
export function resolveMediaUrl(src?: string | null): string | null {
  if (!src) return null;
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//') || src.startsWith('data:')) {
    return src;
  }
  const buildUrl = (path: string) => imageBaseUrl ? `${imageBaseUrl}${path}` : path;

  if (src.startsWith('/storage/')) {
    return buildUrl(src);
  }
  return buildUrl(`/storage/${src.replace(/^\//, '')}`);
}
