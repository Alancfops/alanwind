import type { Color, ShadowLayer } from '../../ir/types.js';

// docs/specs/tema.md 5.7: fixed values in the IR's neutral shapes (R17, R18).

// D96: shadows are always black, only the opacity changes.
const black = (alpha: number): Color => ({ rgb: '#000000', alpha });

const layer = (offsetY: number, blur: number, alpha: number): ShadowLayer => ({
  offsetX: 0,
  offsetY,
  blur,
  spread: 0,
  color: black(alpha),
});

// D96: layers are listed from the top one to the bottom one.
const light = {
  sm: [layer(1, 2, 0.06)],
  md: [layer(4, 8, 0.08), layer(1, 2, 0.06)],
  lg: [layer(12, 24, 0.12), layer(4, 8, 0.06)],
} as const;

// D137: a single layer per class in dark; the second light layer is dropped.
const dark = {
  sm: [layer(1, 2, 0.3)],
  md: [layer(4, 8, 0.35)],
  lg: [layer(12, 24, 0.4)],
} as const;

// D97, D132: in dark, a shadow lifts the background one level and adds a
// thin border; `raised` is the top level and stays where it is.
const elevation = {
  border: { width: 1, color: { rgb: '#34343A', alpha: 1 } as Color },
  nextBackground: {
    page: 'surface',
    surface: 'raised',
    raised: 'raised',
  },
} as const;

export const defaultShadows = { light, dark, elevation } as const;
