// IR contract between the core and the emitters.
// Spec: docs/specs/funcionamento-interno.md, section 4 (D120, D135, D139).

// ---------- result ----------
export interface ResolvedLook {
  readonly style: StyleIR;
  readonly props: PropsIR;
  readonly diagnostics: readonly Diagnostic[];
}

// ---------- style and conditions ----------
export interface StyleIR {
  /** In application order: the later layer wins, per property. */
  readonly layers: readonly StyleLayer[];
}

export interface StyleLayer {
  readonly when: Condition;
  readonly declarations: StyleMap;
}

/** Logical AND of the atoms. Empty list: always applies. Canonical (R14). */
export type Condition = readonly ConditionAtom[];

export type ConditionAtom =
  | {
      readonly kind: 'platform';
      readonly platform: 'ios' | 'android' | 'web' | 'native';
    }
  | { readonly kind: 'scheme'; readonly scheme: 'light' | 'dark' }
  | {
      readonly kind: 'screen';
      readonly from: 'medium' | 'expanded';
      /** Minimum window width, in px/dp. Comes from the theme (D94). */
      readonly minWidth: number;
    }
  | {
      readonly kind: 'state';
      readonly state: 'hover' | 'press' | 'focus' | 'disabled';
    };

// ---------- props (layers with condition, D135) ----------
export interface PropsIR {
  /** Same order and precedence as the style (R16, R17). */
  readonly layers: readonly PropsLayer[];
}

export interface PropsLayer {
  readonly when: Condition;
  readonly declarations: PropsMap;
}

export interface PropsMap {
  readonly numberOfLines?: number; // lines-N
}

// ---------- values ----------
export interface Percent {
  readonly unit: 'percent';
  readonly value: number;
}

export interface ScreenSize {
  readonly unit: 'screen'; // screen width or height, by property
}

export interface Ratio {
  readonly unit: 'ratio';
  readonly value: number; // multiple of the font size
}

export type Dimension = number | Percent; // number = px (web) / dp (native)

export interface Color {
  readonly rgb: string; // '#RRGGBB', uppercase
  readonly alpha: number; // 0 to 1
}

export interface ThemedColor {
  readonly light: Color;
  readonly dark: Color;
}

export interface ShadowLayer {
  readonly offsetX: number;
  readonly offsetY: number;
  readonly blur: number;
  readonly spread: number;
  readonly color: Color;
}

// ---------- neutral properties ----------
export interface StyleMap {
  // layout
  readonly flexDirection?: 'row' | 'column';
  readonly flexWrap?: 'wrap';
  readonly flex?: number; // fill
  readonly justifyContent?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between';
  readonly alignItems?: 'stretch' | 'flex-start' | 'center' | 'flex-end';
  readonly rowGap?: Dimension; // gap-y (R12, D139)
  readonly columnGap?: Dimension; // gap-x (R12, D139)

  // space (always per side, R12)
  readonly paddingTop?: Dimension;
  readonly paddingRight?: Dimension;
  readonly paddingBottom?: Dimension;
  readonly paddingLeft?: Dimension;
  readonly marginTop?: Dimension | 'auto';
  readonly marginRight?: Dimension | 'auto';
  readonly marginBottom?: Dimension | 'auto';
  readonly marginLeft?: Dimension | 'auto';

  // size
  readonly width?: Dimension | ScreenSize;
  readonly height?: Dimension | ScreenSize;

  // color
  readonly backgroundColor?: ThemedColor;
  readonly color?: ThemedColor; // text color
  readonly borderColor?: ThemedColor;

  // border, radius, shadow, opacity
  readonly borderTopWidth?: number;
  readonly borderRightWidth?: number;
  readonly borderBottomWidth?: number;
  readonly borderLeftWidth?: number;
  readonly borderTopLeftRadius?: number; // (R12, D139)
  readonly borderTopRightRadius?: number;
  readonly borderBottomRightRadius?: number;
  readonly borderBottomLeftRadius?: number;
  readonly boxShadow?: readonly ShadowLayer[];
  readonly opacity?: number; // 0 to 1

  // typography
  readonly fontSize?: number;
  readonly fontWeight?: 400 | 500 | 700;
  readonly lineHeight?: Ratio;
  readonly textAlign?: 'left' | 'center' | 'right';
  readonly fontFamily?: 'sans' | 'serif' | 'mono';
  readonly fontStyle?: 'italic';
  readonly textDecorationLine?: 'underline';
  readonly textTransform?: 'uppercase' | 'lowercase';
}

// ---------- diagnostics ----------
export interface Diagnostic {
  readonly code: `AW${number}`; // catalog in sintaxe.md
  readonly severity: 'error' | 'warning';
  readonly message: string; // free text, outside the contract (R40)
  readonly position: Position;
  readonly suggestion?: string; // text that replaces the span
  /** Only for errors inside a shortcut (R49, D135). */
  readonly origin?: DiagnosticOrigin;
}

export interface Position {
  readonly start: number;
  readonly end: number;
}

export interface DiagnosticOrigin {
  readonly shortcut: string; // shortcut name
  readonly position: Position; // inside the `define` text
}
