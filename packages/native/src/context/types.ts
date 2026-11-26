// docs/specs/emissor-native.md section 4.

export type ScreenBand = 'compact' | 'medium' | 'expanded';

export interface ResolutionContext {
  readonly scheme: 'light' | 'dark';
  /** Derived from the window width (R4). Part of the cache key (R26). */
  readonly band: ScreenBand;
  readonly platform: 'ios' | 'android' | 'web';
  /** Window, in dp. R9 and the screen units (R39). */
  readonly window: { readonly width: number; readonly height: number };
}
