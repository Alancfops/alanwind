import type { Color, StyleMap, ThemedColor } from '@alanwind/core';
import type { TextStyle } from 'react-native';
import type { ResolutionContext } from '../context/types';

const HEX_DIGITS_PER_CHANNEL = 2;
const HEX_RADIX = 16;
const RGB_CHANNELS = 3;

/** R17, D154: opaque colors keep the IR `rgb`; the others become `rgba`. */
export function emitColor(color: Color): string {
  if (color.alpha === 1) return color.rgb;
  const digits = color.rgb.slice(1);
  const [r, g, b] = Array.from({ length: RGB_CHANNELS }, (_, index) =>
    Number.parseInt(
      digits.slice(
        index * HEX_DIGITS_PER_CHANNEL,
        (index + 1) * HEX_DIGITS_PER_CHANNEL,
      ),
      HEX_RADIX,
    ),
  );
  return `rgba(${r}, ${g}, ${b}, ${color.alpha})`;
}

/** R17: picks the side of the themed color by the context scheme. */
export function emitThemedColor(
  color: ThemedColor,
  scheme: ResolutionContext['scheme'],
): string {
  return emitColor(color[scheme]);
}

/** R14, R15, R17: only the color properties the IR declared. */
export function emitColorStyle(
  declarations: StyleMap,
  scheme: ResolutionContext['scheme'],
): Pick<TextStyle, 'backgroundColor' | 'color' | 'borderColor'> {
  const { backgroundColor, color, borderColor } = declarations;
  return {
    ...(backgroundColor && {
      backgroundColor: emitThemedColor(backgroundColor, scheme),
    }),
    ...(color && { color: emitThemedColor(color, scheme) }),
    ...(borderColor && { borderColor: emitThemedColor(borderColor, scheme) }),
  };
}
