import { cn } from '@/lib/utils';

export type PaddingPreset = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type SectionPaddingValue = number | string | null | undefined;

export type SectionPadding = {
  top?: SectionPaddingValue;
  bottom?: SectionPaddingValue;
};

// Preserve preset behaviour (previously `pt-8` => 32px, etc.) while
// allowing arbitrary pixel values from the CMS.
const presetToPx: Record<PaddingPreset, number> = {
  none: 0,
  xs: 32,
  sm: 48,
  md: 64,
  lg: 80,
  xl: 96,
  '2xl': 128,
};

const normalizeToNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const lower = trimmed.toLowerCase();

    if (lower in presetToPx) {
      return presetToPx[lower as PaddingPreset];
    }

    const withoutPx = lower.endsWith('px') ? lower.slice(0, -2) : lower;
    const numeric = Number.parseFloat(withoutPx);
    if (Number.isNaN(numeric)) return null;

    return numeric;
  }

  return null;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const toPaddingClass = (direction: 'top' | 'bottom', value?: unknown): string => {
  const numeric = normalizeToNumber(value);
  if (numeric === null) return '';

  // Round to integer pixels to keep Tailwind safelist manageable.
  const rounded = Math.round(numeric);
  const clamped = clamp(rounded, 0, 600);

  return `${direction === 'top' ? 'pt' : 'pb'}-[${clamped}px]`;
};

/**
 * Returns padding utility classes. If no custom padding provided, falls back to the given string.
 * When only one direction is set, the fallback still supplies the other side.
 */
export function resolveSectionPadding(
  padding: SectionPadding | null | undefined,
  fallback: string
): string {
  const topClass = toPaddingClass('top', padding?.top);
  const bottomClass = toPaddingClass('bottom', padding?.bottom);

  if (!topClass && !bottomClass) {
    return fallback;
  }

  // Keep defaults (from fallback) for any side that wasn't overridden.
  return cn(fallback, topClass, bottomClass);
}
