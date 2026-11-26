// docs/specs/tema.md 5.2 and 5.3: fixed values, nothing is computed (R5, R7).
// Per role: `base` is `bg-<role>`, `on` is `text-on-<role>`, `onSoft` is
// `text-on-<role>-soft` (R31).

export const roles = {
  primary: {
    base: { light: '#2563EB', dark: '#8AB4FF' },
    on: { light: '#FFFFFF', dark: '#0A1F4D' },
    hover: { light: '#1D4FD8', dark: '#A6C6FF' },
    soft: { light: '#E1EAFD', dark: '#14306B' },
    onSoft: { light: '#1E3FA8', dark: '#B3CCFF' },
  },
  secondary: {
    base: { light: '#E9E9EE', dark: '#34343A' },
    on: { light: '#25252B', dark: '#F2F2F4' },
    hover: { light: '#DCDCE2', dark: '#3E3E45' },
    soft: { light: '#F1F1F4', dark: '#232328' },
    onSoft: { light: '#3B3B42', dark: '#C9C9CF' },
  },
  success: {
    base: { light: '#15803D', dark: '#5FD68E' },
    on: { light: '#FFFFFF', dark: '#052E16' },
    hover: { light: '#116932', dark: '#7CE2A4' },
    soft: { light: '#DCFCE7', dark: '#123A22' },
    onSoft: { light: '#14532D', dark: '#A7F0C4' },
  },
  warning: {
    base: { light: '#F2B200', dark: '#FFD166' },
    // R8: dark text on the strong color in both schemes.
    on: { light: '#3B2A00', dark: '#3B2A00' },
    hover: { light: '#D99F00', dark: '#FFDD8A' },
    soft: { light: '#FEF3C7', dark: '#3A2C06' },
    onSoft: { light: '#713F12', dark: '#FDE68A' },
  },
  danger: {
    base: { light: '#D02424', dark: '#FF8A80' },
    on: { light: '#FFFFFF', dark: '#450A0A' },
    hover: { light: '#B91C1C', dark: '#FFA59D' },
    soft: { light: '#FEE2E2', dark: '#4A1515' },
    onSoft: { light: '#991B1B', dark: '#FECACA' },
  },
  info: {
    base: { light: '#0B63B6', dark: '#7CC4FF' },
    on: { light: '#FFFFFF', dark: '#04203D' },
    hover: { light: '#09529A', dark: '#9BD2FF' },
    soft: { light: '#E0EFFF', dark: '#0E2E4F' },
    onSoft: { light: '#0B4A8B', dark: '#B8DCFF' },
  },
} as const;

// R9, D92, D99: `text-<role>` is the role color when it passes 4.5:1 on page,
// surface and raised; `warning` in light needs the adjusted tone from 5.5.
// D129, R30: there is no `text-secondary`.
export const roleTexts = {
  primary: roles.primary.base,
  success: roles.success.base,
  warning: { light: '#8A5A00', dark: roles.warning.base.dark },
  danger: roles.danger.base,
  info: roles.info.base,
} as const;
