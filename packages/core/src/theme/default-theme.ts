import { defaultColors } from './colors/index.js';

// docs/specs/tema.md 5.1 to 5.8: fixed values, nothing is computed (R5).

const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  13: 52,
  14: 56,
  15: 60,
  16: 64,
} as const;

export const defaultTheme = {
  colors: defaultColors,
  spacing,
  // D98: same scale as spacing, plus the relative sizes, in the IR's shapes.
  size: {
    ...spacing,
    full: { unit: 'percent', value: 100 },
    screen: { unit: 'screen' },
  },
  radius: { none: 0, sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
  fontSize: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30 },
  fontWeight: { regular: 400, medium: 500, bold: 700 },
  // Multiplies the font size.
  lineHeight: { tight: 1.25, normal: 1.5, loose: 1.75 },
  // Fractions of 1; keys are the percentages used in class names.
  opacity: { 0: 0, 25: 0.25, 50: 0.5, 75: 0.75, 100: 1 },
  // D94: the `compact` range is everything below `medium`.
  breakpoints: { medium: 600, expanded: 840 },
} as const;

export type DefaultTheme = typeof defaultTheme;
