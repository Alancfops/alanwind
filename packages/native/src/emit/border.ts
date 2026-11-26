import type { StyleMap } from '@alanwind/core';
import type { ViewStyle } from 'react-native';

type BorderStyle = Pick<
  ViewStyle,
  | 'borderTopWidth'
  | 'borderRightWidth'
  | 'borderBottomWidth'
  | 'borderLeftWidth'
  | 'borderTopLeftRadius'
  | 'borderTopRightRadius'
  | 'borderBottomRightRadius'
  | 'borderBottomLeftRadius'
  | 'opacity'
>;

// R14, D120: widths and radii stay per side and per corner; values are dp.
export function emitBorder(d: StyleMap): BorderStyle {
  return {
    ...(d.borderTopWidth !== undefined && {
      borderTopWidth: d.borderTopWidth,
    }),
    ...(d.borderRightWidth !== undefined && {
      borderRightWidth: d.borderRightWidth,
    }),
    ...(d.borderBottomWidth !== undefined && {
      borderBottomWidth: d.borderBottomWidth,
    }),
    ...(d.borderLeftWidth !== undefined && {
      borderLeftWidth: d.borderLeftWidth,
    }),
    ...(d.borderTopLeftRadius !== undefined && {
      borderTopLeftRadius: d.borderTopLeftRadius,
    }),
    ...(d.borderTopRightRadius !== undefined && {
      borderTopRightRadius: d.borderTopRightRadius,
    }),
    ...(d.borderBottomRightRadius !== undefined && {
      borderBottomRightRadius: d.borderBottomRightRadius,
    }),
    ...(d.borderBottomLeftRadius !== undefined && {
      borderBottomLeftRadius: d.borderBottomLeftRadius,
    }),
    ...(d.opacity !== undefined && { opacity: d.opacity }),
  };
}
