export type { InteractionStates } from './conditions';
export { emitColor, emitThemedColor } from './color';

export {
  emitFontFamily,
  emitFontWeight,
  emitLineHeight,
  emitTextStyle,
} from './typography';
import type { StyleMap } from '@alanwind/core';
import type { ViewStyle } from 'react-native';
import type { ResolutionContext } from '../context/types';
import { emitBorder } from './border';
import { emitLayout } from './layout';
import { emitSizing } from './sizing';
import { emitSpacing } from './spacing';

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
