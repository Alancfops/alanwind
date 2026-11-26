export type { DiagnosticCode, MessageArgs } from './diagnostics/catalog.js';
export type { DiagnosticInput } from './diagnostics/diagnostics.js';
export {
  createDiagnostic,
  sortDiagnostics,
  suggestClosest,
} from './diagnostics/diagnostics.js';
export type {
  Color,
  Condition,
  ConditionAtom,
  Diagnostic,
  DiagnosticOrigin,
  Dimension,
  Percent,
  Position,
  PropsIR,
  PropsLayer,
  PropsMap,
  Ratio,
  ResolvedLook,
  ScreenSize,
  ShadowLayer,
  StyleIR,
  StyleLayer,
  StyleMap,
  ThemedColor,
} from './ir/types.js';
export type { DefaultTheme } from './theme/default-theme.js';
export { defaultTheme } from './theme/default-theme.js';
