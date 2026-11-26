import type { FreeValue } from './syntax-tree.js';

const NUMBER_VALUE = /^-?\d+(\.\d+)?%?$/;
// The opacity is any integer here; the scale (D98) is checked by the family.
const COLOR_VALUE =
  /^(#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8}))(?:\/(0|[1-9]\d*))?$/;
const DECIMAL_COMMA = /^-?\d+,\d/;
const LEADING_DOT = /^-?\.\d/;
const DECIMAL_COMMA_NUMBER = /^-?\d+,\d+$/;
const LEADING_DOT_NUMBER = /^-?\.\d+$/;
// R21: the families that take a number; only `bg`, `text` and `border` take a
// color. The parser has no vocabulary, so this is all it knows (D188).
const NUMERIC_FAMILIES = new Set([
  'pad',
  'margin',
  'gap',
  'w',
  'h',
  'size',
  'round',
  'type',
  'leading',
]);
// D118: palette tones (`red-40`) only come back with the palette.
const PALETTE_TONE = /^[a-z]+-\d+$/;

/** Classifies the text after `=`; `undefined` when it is not a free value. */
export function classifyFreeValue(text: string): FreeValue | undefined {
  if (NUMBER_VALUE.test(text)) {
    const percent = text.endsWith('%');
    const value = Number(percent ? text.slice(0, -1) : text);
    if (!Number.isFinite(value)) return undefined;
    return { kind: 'number', value, percent };
  }
  const color = COLOR_VALUE.exec(text);
  if (color?.[1] === undefined) return undefined;
  const opacity = color[2] === undefined ? undefined : Number(color[2]);
  if (opacity !== undefined && !Number.isFinite(opacity)) return undefined;
  return {
    kind: 'color',
    hex: color[1],
    ...(opacity === undefined ? {} : { opacity }),
  };
}

/** Whether the family of a free value takes a number, never a color. */
export function isNumericFamily(family: string): boolean {
  return NUMERIC_FAMILIES.has(family.split('-')[0] ?? '');
}

/** The obvious fix of a rejected value (`10,5` -> `10.5`), if there is one. */
export function suggestFreeValue(text: string): string | undefined {
  if (DECIMAL_COMMA_NUMBER.test(text)) return text.replace(',', '.');
  if (LEADING_DOT_NUMBER.test(text)) return text.replace('.', '0.');
  return undefined;
}

type InvalidValueProblem = 'comma' | 'leading-dot' | 'palette';

/** Names the problem of a rejected value, for the dedicated AW008 message. */
export function describeInvalidValue(
  text: string,
): InvalidValueProblem | undefined {
  if (DECIMAL_COMMA.test(text)) return 'comma';
  if (LEADING_DOT.test(text)) return 'leading-dot';
  if (PALETTE_TONE.test(text)) return 'palette';
  return undefined;
}
