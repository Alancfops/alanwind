// docs/specs/tema.md 5.1: fixed values, nothing is computed (R5, R7).
// Colors are `#RRGGBB`, uppercase, one value per color scheme.

export const backgrounds = {
  page: { light: '#F6F6F8', dark: '#141416' },
  surface: { light: '#FFFFFF', dark: '#1E1E22' },
  // D128: equal to `surface` in light; the elevation comes from the shadow.
  raised: { light: '#FFFFFF', dark: '#28282D' },
} as const;

export const texts = {
  strong: { light: '#141416', dark: '#F2F2F4' },
  body: { light: '#3B3B42', dark: '#C9C9CF' },
  muted: { light: '#6B6B74', dark: '#8E8E96' },
  // D93, D128: disabled elements only; exempt from the contrast minimum (R10).
  subtle: { light: '#A1A1AA', dark: '#5C5C64' },
  link: { light: '#1D4FD8', dark: '#8AB4FF' },
} as const;

export const borders = {
  // D95: decorative, exempt from the contrast minimum (R11).
  subtle: { light: '#E3E3E8', dark: '#34343A' },
  strong: { light: '#8E8E96', dark: '#74747E' },
  focus: { light: '#2563EB', dark: '#8AB4FF' },
} as const;
