import { defaultTheme } from '@alanwind/core';
import type { ScreenBand } from './types';

const { medium, expanded } = defaultTheme.breakpoints;

// R4, D94: the limits come from the theme kept by the core (D153).
export function screenBandFor(width: number): ScreenBand {
  if (width >= expanded) return 'expanded';
  if (width >= medium) return 'medium';
  return 'compact';
}
