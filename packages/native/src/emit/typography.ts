import type { Ratio, StyleMap } from '@alanwind/core';
import type { TextStyle } from 'react-native';
import type { ResolutionContext } from '../context/types';
import { emitColorStyle } from './color';

type GenericFamily = NonNullable<StyleMap['fontFamily']>;
type FontWeight = NonNullable<StyleMap['fontWeight']>;

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
export function emitFontWeight(weight: FontWeight): `${FontWeight}` {
  return `${weight}`;
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

/**
 * Color and text style of the merged declarations (R14, R15, R19 to R22).
 * `fontSize` is the final text size, used only for `lineHeight` (R20); the
 * emitted `fontSize` is still the one the IR declared. R22: never emits
 * `allowFontScaling` or `maxFontSizeMultiplier`.
 */
export function emitTextStyle(
  declarations: StyleMap,
  context: ResolutionContext,
  fontSize: number,
): TextStyle {
  const {
    fontSize: declaredFontSize,
    fontWeight,
    fontFamily,
    lineHeight,
    textAlign,
    fontStyle,
    textDecorationLine,
    textTransform,
  } = declarations;
  return {
    ...emitColorStyle(declarations, context.scheme),
    ...(declaredFontSize !== undefined && { fontSize: declaredFontSize }),
    ...(fontWeight !== undefined && { fontWeight: emitFontWeight(fontWeight) }),
    ...(fontFamily && {
      fontFamily: emitFontFamily(fontFamily, context.platform),
    }),
    ...(lineHeight && { lineHeight: emitLineHeight(lineHeight, fontSize) }),
    ...(textAlign && { textAlign }),
    ...(fontStyle && { fontStyle }),
    ...(textDecorationLine && { textDecorationLine }),
    ...(textTransform && { textTransform }),
  };
}
