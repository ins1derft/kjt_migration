import type { CSSProperties } from 'react';

export type SectionPadding =
  | string
  | {
      top?: number | string | null;
      bottom?: number | string | null;
    }
  | null
  | undefined;

const parseNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const numeric = Number.parseFloat(trimmed.endsWith('px') ? trimmed.slice(0, -2) : trimmed);
    return Number.isFinite(numeric) ? numeric : null;
  }
  return null;
};

/**
 * Returns padding utility classes. If a custom style string is provided (from admin),
 * it is used as-is. Otherwise, the provided fallback utilities are applied.
 */
export function resolveSectionPadding(
  padding: SectionPadding | null | undefined,
  fallback: string
): string {
  if (typeof padding === 'string') {
    const custom = padding.trim();
    return custom ? custom : fallback;
  }

  if (padding && typeof padding === 'object') {
    const top = parseNumber(padding.top);
    const bottom = parseNumber(padding.bottom);
    const topClass = top !== null ? `pt-[${Math.round(top)}px]` : '';
    const bottomClass = bottom !== null ? `pb-[${Math.round(bottom)}px]` : '';
    const combined = `${topClass} ${bottomClass}`.trim();
    return combined ? combined : fallback;
  }

  return fallback;
}

/**
 * Returns the provided background utility class if present, otherwise the fallback.
 */
export function resolveSectionBackground(
  backgroundClass: string | null | undefined,
  fallback: string
): string {
  const custom = backgroundClass?.trim();
  return custom ? custom : fallback;
}

export function resolveSectionBackgroundStyle(
  backgroundColor?: string | null
): CSSProperties | undefined {
  const value = backgroundColor?.trim();
  if (!value) return undefined;
  return { backgroundColor: value };
}
