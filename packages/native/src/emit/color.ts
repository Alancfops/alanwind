import type { Color, ThemedColor } from '@alanwind/core';
import type { ResolutionContext } from '../context/types';

const HEX_DIGITS_PER_CHANNEL = 2;
const HEX_RADIX = 16;

function channel(rgb: string, index: number): number {
  const start = 1 + index * HEX_DIGITS_PER_CHANNEL;
  return Number.parseInt(
    rgb.slice(start, start + HEX_DIGITS_PER_CHANNEL),
    HEX_RADIX,
  );
}

/** R17, D154: opaque colors keep the IR `rgb`; the others become `rgba`. */
export function emitColor(color: Color): string {
  if (color.alpha === 1) return color.rgb;
  const [r, g, b] = [0, 1, 2].map((index) => channel(color.rgb, index));
  return `rgba(${r}, ${g}, ${b}, ${color.alpha})`;
}

/** R17: picks the side of the themed color by the context scheme. */
export function emitThemedColor(
  color: ThemedColor,
  scheme: ResolutionContext['scheme'],
): string {
  return emitColor(color[scheme]);
}
