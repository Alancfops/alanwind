import type { Dimension, Percent, ScreenSize, StyleMap } from '@alanwind/core';
import type { ViewStyle } from 'react-native';
import type { ResolutionContext } from '../context/types';

type SizingStyle = Pick<ViewStyle, 'width' | 'height'>;

function isPercent(value: Dimension | 'auto'): value is Percent {
  return typeof value === 'object';
}

function isScreen(value: Dimension | ScreenSize): value is ScreenSize {
  return typeof value === 'object' && value.unit === 'screen';
}

// R16: `number` stays in dp, `Percent` becomes `'<value>%'`, `'auto'` stays.
export function toNativeDimension(
  value: Dimension | 'auto',
): number | `${number}%` | 'auto' {
  return isPercent(value) ? `${value.value}%` : value;
}

// R16, R39, D152: `ScreenSize` reads the window of the context it receives.
export function emitSizing(
  d: StyleMap,
  window: ResolutionContext['window'],
): SizingStyle {
  return {
    ...(d.width !== undefined && {
      width: isScreen(d.width) ? window.width : toNativeDimension(d.width),
    }),
    ...(d.height !== undefined && {
      height: isScreen(d.height) ? window.height : toNativeDimension(d.height),
    }),
  };
}
