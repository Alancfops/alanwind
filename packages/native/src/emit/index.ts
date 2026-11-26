import type { StyleMap } from '@alanwind/core';
import type { ViewStyle } from 'react-native';
import type { ResolutionContext } from '../context/types';
import { emitBorder } from './border';
import { emitLayout } from './layout';
import { emitSizing } from './sizing';
import { emitSpacing } from './spacing';

export { emitColor, emitThemedColor } from './color';
export type { InteractionStates } from './conditions';
export {
  emitFontFamily,
  emitFontWeight,
  emitLineHeight,
  emitTextStyle,
} from './typography';

/** Layout, space, size, border, radius and opacity (R14 to R16). */
export function emitBoxStyle(
  declarations: StyleMap,
  context: ResolutionContext,
): ViewStyle {
  return {
    ...emitLayout(declarations),
    ...emitSpacing(declarations),
    ...emitSizing(declarations, context.window),
    ...emitBorder(declarations),
  };
}
