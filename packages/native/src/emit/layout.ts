import type { StyleMap } from '@alanwind/core';
import type { ViewStyle } from 'react-native';
import { toNativeDimension } from './sizing';

type LayoutStyle = Pick<
  ViewStyle,
  | 'flexDirection'
  | 'flexWrap'
  | 'flex'
  | 'justifyContent'
  | 'alignItems'
  | 'rowGap'
  | 'columnGap'
>;

// R14, R15: only what the IR declares; no default values (D83).
export function emitLayout(d: StyleMap): LayoutStyle {
  return {
    ...(d.flexDirection !== undefined && { flexDirection: d.flexDirection }),
    ...(d.flexWrap !== undefined && { flexWrap: d.flexWrap }),
    ...(d.flex !== undefined && { flex: d.flex }),
    ...(d.justifyContent !== undefined && { justifyContent: d.justifyContent }),
    ...(d.alignItems !== undefined && { alignItems: d.alignItems }),
    ...(d.rowGap !== undefined && { rowGap: toNativeDimension(d.rowGap) }),
    ...(d.columnGap !== undefined && {
      columnGap: toNativeDimension(d.columnGap),
    }),
  };
}
