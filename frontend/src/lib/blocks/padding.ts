import { cn } from '@/lib/utils';

export type PaddingScale = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type SectionPadding = {
  top?: PaddingScale | null;
  bottom?: PaddingScale | null;
};

const scaleToValue: Record<PaddingScale, string> = {
  none: '0',
  xs: '8',
  sm: '12',
  md: '16',
  lg: '20',
  xl: '24',
  '2xl': '32',
};

const numericValues = new Set(Object.values(scaleToValue));

const normalize = (value: unknown): string | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return null;
    return trimmed.toLowerCase();
  }
  if (typeof value === 'number') return String(value);
  return null;
};

const hasScale = (scale: unknown): scale is PaddingScale => {
  const normalized = normalize(scale);
  if (!normalized) return false;

  if (normalized in scaleToValue) return true;
  return numericValues.has(normalized);
};

const directionClass = (direction: 'top' | 'bottom', scale?: unknown): string => {
  if (!hasScale(scale)) return '';

  const normalized = normalize(scale);
  const token = normalized && normalized in scaleToValue
    ? scaleToValue[normalized as PaddingScale]
    : normalized ?? '';

  return `${direction === 'top' ? 'pt' : 'pb'}-${token}`;
};

/**
 * Returns padding utility classes. If no custom padding provided, falls back to the given string.
 */
export function resolveSectionPadding(
  padding: SectionPadding | null | undefined,
  fallback: string
): string {
  const top = padding?.top;
  const bottom = padding?.bottom;

  const hasCustom = hasScale(top) || hasScale(bottom);

  if (!hasCustom) {
    return fallback;
  }

  return cn(directionClass('top', top), directionClass('bottom', bottom));
}
