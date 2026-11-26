import type { Ratio, StyleMap } from '@alanwind/core';
import type { ResolutionContext } from '../context/types';

type GenericFamily = NonNullable<StyleMap['fontFamily']>;

// R21, D156: exact system font text per platform; no font is downloaded.
const FONT_FAMILIES: Record<
  GenericFamily,
  Record<ResolutionContext['platform'], string>
> = {
  sans: { ios: 'System', android: 'Roboto', web: 'system-ui, sans-serif' },
  serif: { ios: 'Georgia', android: 'serif', web: 'Georgia, serif' },
  mono: { ios: 'Menlo', android: 'monospace', web: 'ui-monospace, monospace' },
};

const LINE_HEIGHT_PRECISION = 100;

export function emitFontFamily(
  family: GenericFamily,
  platform: ResolutionContext['platform'],
): string {
  return FONT_FAMILIES[family][platform];
}

/** R16, D154: the native `fontWeight` is always a string. */
export function emitFontWeight(weight: 400 | 500 | 700): string {
  return String(weight);
}

/**
 * R20, D157: `fontSize` is the final text size, decided by the caller (after
 * inheritance and the `Text` default).
 */
export function emitLineHeight(ratio: Ratio, fontSize: number): number {
  return (
    Math.round(fontSize * ratio.value * LINE_HEIGHT_PRECISION) /
    LINE_HEIGHT_PRECISION
  );
}
