import type { StyleMap } from '@alanwind/core';
import type { ViewStyle } from 'react-native';
import { toNativeDimension } from './sizing';

type SpacingStyle = Pick<
  ViewStyle,
  | 'paddingTop'
  | 'paddingRight'
  | 'paddingBottom'
  | 'paddingLeft'
  | 'marginTop'
  | 'marginRight'
  | 'marginBottom'
  | 'marginLeft'
>;

// R14, D107: always per side, never `padding`, `margin` or the axis forms.
export function emitSpacing(d: StyleMap): SpacingStyle {
  return {
    ...(d.paddingTop !== undefined && {
      paddingTop: toNativeDimension(d.paddingTop),
    }),
    ...(d.paddingRight !== undefined && {
      paddingRight: toNativeDimension(d.paddingRight),
    }),
    ...(d.paddingBottom !== undefined && {
      paddingBottom: toNativeDimension(d.paddingBottom),
    }),
    ...(d.paddingLeft !== undefined && {
      paddingLeft: toNativeDimension(d.paddingLeft),
    }),
    ...(d.marginTop !== undefined && {
      marginTop: toNativeDimension(d.marginTop),
    }),
    ...(d.marginRight !== undefined && {
      marginRight: toNativeDimension(d.marginRight),
    }),
    ...(d.marginBottom !== undefined && {
      marginBottom: toNativeDimension(d.marginBottom),
    }),
    ...(d.marginLeft !== undefined && {
      marginLeft: toNativeDimension(d.marginLeft),
    }),
  };
}
