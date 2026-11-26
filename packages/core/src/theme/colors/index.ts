import { backgrounds, borders, texts } from './neutrals';
import { roles, roleTexts } from './roles';

export const defaultColors = {
  backgrounds,
  texts,
  borders,
  roles,
  roleTexts,
} as const;

export type DefaultColors = typeof defaultColors;
