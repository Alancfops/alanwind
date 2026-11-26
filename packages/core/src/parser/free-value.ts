import type { FreeValue } from './syntax-tree.js';

const NUMBER_VALUE = /^-?\d+(\.\d+)?%?$/;
// The opacity is any integer here; the scale (D98) is checked by the family.
const COLOR_VALUE =
  /^(#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8}))(?:\/(\d+))?$/;
const DECIMAL_COMMA = /^-?\d+,\d/;
const LEADING_DOT = /^-?\.\d/;
// D118: palette tones (`red-40`) only come back with the palette.
const PALETTE_TONE = /^[a-z]+-\d+$/;

/** Classifies the text after `=`; `undefined` when it is not a free value. */
export function classifyFreeValue(text: string): FreeValue | undefined {
  if (NUMBER_VALUE.test(text)) {
    const percent = text.endsWith('%');
    return {
      kind: 'number',
      value: Number(percent ? text.slice(0, -1) : text),
      percent,
    };
  }
  const color = COLOR_VALUE.exec(text);
  if (color?.[1] === undefined) return undefined;
  const opacity = color[2];
  return {
    kind: 'color',
    hex: color[1],
    ...(opacity === undefined ? {} : { opacity: Number(opacity) }),
  };
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
