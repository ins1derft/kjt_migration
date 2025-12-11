import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalize media URLs coming from the CMS:
 * - pass through absolute/http/https/data URLs unchanged
 * - prefix relative paths (e.g. "pages/specs/img.svg") with `/storage/`
 * - keep already-prefixed `/storage/...` paths
 */
export function resolveMediaUrl(src?: string | null): string | null {
  if (!src) return null;
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//') || src.startsWith('data:')) {
    return src;
  }
  // Allow static assets served by Next/Nginx without forcing /storage
  if (src.startsWith('/')) {
    return src;
  }
  if (src.startsWith('/storage/')) {
    return src;
  }
  return `/storage/${src.replace(/^\//, '')}`;
}
