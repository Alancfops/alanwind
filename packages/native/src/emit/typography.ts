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
  // D157: `toPrecision` drops floating-point noise before rounding half up,
  // so 15 * 1.035 gives 15.53 and not 15.52.
  const product = Number((fontSize * ratio.value).toPrecision(12));
  return Math.round(product * LINE_HEIGHT_PRECISION) / LINE_HEIGHT_PRECISION;
}

/**
 * Color and text style of the merged declarations (R14, R15, R19 to R22).
 * `fallbackFontSize` is the final text size (after inheritance and the `Text`
 * default), used for `lineHeight` only when the IR declares no `fontSize`; a
 * declared `fontSize` wins (R20). R22: never emits `allowFontScaling` or
 * `maxFontSizeMultiplier`.
 */
export function emitTextStyle(
  declarations: StyleMap,
  context: ResolutionContext,
  fallbackFontSize: number,
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
    ...(lineHeight && {
      lineHeight: emitLineHeight(
        lineHeight,
        declaredFontSize ?? fallbackFontSize,
      ),
    }),
    ...(textAlign && { textAlign }),
    ...(fontStyle && { fontStyle }),
    ...(textDecorationLine && { textDecorationLine }),
    ...(textTransform && { textTransform }),
  };
}
