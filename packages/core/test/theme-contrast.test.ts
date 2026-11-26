import { describe, expect, it } from 'vitest';
import { defaultTheme } from '../src/index.js';

// Contrast tests for the default theme: WCAG 2 formula (skill
// checar-contraste), computed here, not by the core. Required pairs and
// expected ratios come from docs/specs/tema.md section 6 (R19, R20, C1, C2).
// The test compares the unrounded ratio with the minimum; the expected
// two-decimal value in each case name is the spec table value.

type Scheme = 'light' | 'dark';
type Pair = { readonly light: string; readonly dark: string };

const channel = (hex: string, start: number): number => {
  const c = Number.parseInt(hex.slice(start, start + 2), 16) / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex: string): number =>
  0.2126 * channel(hex, 1) +
  0.7152 * channel(hex, 3) +
  0.0722 * channel(hex, 5);

const ratio = (a: string, b: string): number => {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

const round2 = (n: number): number => Math.round(n * 100) / 100;

const c = defaultTheme.colors as unknown as {
  backgrounds: Record<string, Pair>;
  texts: Record<string, Pair>;
  borders: Record<string, Pair>;
  roles: Record<string, Record<string, Pair>>;
  roleTexts: Record<string, Pair>;
};

const schemes: readonly Scheme[] = ['light', 'dark'];

// Sanity check of the formula itself (WCAG 2 reference values)
describe('contrast formula', () => {
  it('black on white is 21', () => {
    expect(ratio('#000000', '#FFFFFF')).toBeCloseTo(21, 10);
  });
  it('same color is 1', () => {
    expect(ratio('#2563EB', '#2563EB')).toBeCloseTo(1, 10);
  });
});

// tema.md 6.1 (min 4.5): [role, kind, light, dark]
// kind: base = bg-<role> / on; hover = bg-<role>-hover / on (C2);
// soft = bg-<role>-soft / on-soft
const table61: ReadonlyArray<
  [string, 'base' | 'hover' | 'soft', number, number]
> = [
  ['primary', 'base', 5.17, 7.64],
  ['primary', 'hover', 6.64, 9.23],
  ['primary', 'soft', 7.46, 7.81],
  ['secondary', 'base', 12.59, 11.06],
  ['secondary', 'hover', 11.16, 9.49],
  ['secondary', 'soft', 9.86, 9.49],
  ['success', 'base', 5.02, 8.16],
  ['success', 'hover', 6.79, 9.42],
  ['success', 'soft', 8.3, 9.62],
  ['warning', 'base', 7.35, 9.6],
  ['warning', 'hover', 5.87, 10.52],
  ['warning', 'soft', 7.79, 10.93],
  ['danger', 'base', 5.3, 7.07],
  ['danger', 'hover', 6.47, 8.55],
  ['danger', 'soft', 6.8, 10.3],
  ['info', 'base', 6.04, 8.75],
  ['info', 'hover', 7.82, 10.21],
  ['info', 'soft', 7.59, 9.67],
];

const pick = (role: string, kind: 'base' | 'hover' | 'soft', s: Scheme) => {
  const r = c.roles[role] as Record<string, Pair>;
  const bg = r[kind] as Pair;
  const fg = (kind === 'soft' ? r.onSoft : r.on) as Pair;
  return { bg: bg[s], fg: fg[s] };
};

describe('6.1 on-<role>, -hover and -soft (min 4.5)', () => {
  const cases = table61.flatMap(([role, kind, light, dark]) =>
    schemes.map((s) => [role, kind, s, s === 'light' ? light : dark] as const),
  );

  it.each(cases)('%s %s %s = %d', (role, kind, s, expected) => {
    const { bg, fg } = pick(role, kind, s);
    const r = ratio(bg, fg);
    expect(round2(r)).toBe(expected);
    expect(r).toBeGreaterThanOrEqual(4.5);
  });
});

// tema.md 6.2 (min 4.5): text-<role> on page, surface, raised
// [role, Lp, Ls, Lr, Dp, Ds, Dr]
const table62: ReadonlyArray<[string, number[]]> = [
  ['primary', [4.79, 5.17, 5.17, 8.81, 7.95, 7.02]],
  ['success', [4.65, 5.02, 5.02, 10.07, 9.09, 8.03]],
  ['warning', [5.49, 5.93, 5.93, 12.76, 11.52, 10.17]],
  ['danger', [4.91, 5.3, 5.3, 8.06, 7.28, 6.43]],
  ['info', [5.6, 6.04, 6.04, 9.81, 8.86, 7.82]],
];

// tema.md 6.3 (min 4.5): neutral texts on page, surface, raised
const table63: ReadonlyArray<[string, number[]]> = [
  ['strong', [17.05, 18.4, 18.4, 16.46, 14.86, 13.12]],
  ['body', [10.29, 11.11, 11.11, 11.16, 10.08, 8.9]],
  ['muted', [4.89, 5.28, 5.28, 5.66, 5.11, 4.51]],
  ['link', [6.15, 6.64, 6.64, 8.81, 7.95, 7.02]],
];

// tema.md 6.4 (min 3): borders on page, surface, raised
const table64: ReadonlyArray<[string, number[]]> = [
  ['focus', [4.79, 5.17, 5.17, 8.81, 7.95, 7.02]],
  ['strong', [3.01, 3.25, 3.25, 3.98, 3.59, 3.17]],
];

const grounds = ['page', 'surface', 'raised'] as const;
const columns = schemes.flatMap((s) => grounds.map((g) => [s, g] as const));

const expand = (
  rows: ReadonlyArray<[string, number[]]>,
): Array<[string, Scheme, string, number]> =>
  rows.flatMap(([name, values]) =>
    columns.map(
      ([s, g], i) =>
        [name, s, g, values[i] as number] as [string, Scheme, string, number],
    ),
  );

describe('6.2 text-<role> on backgrounds (min 4.5)', () => {
  it.each(expand(table62))('text-%s %s on %s = %d', (role, s, g, expected) => {
    const r = ratio(
      (c.roleTexts[role] as Pair)[s],
      (c.backgrounds[g] as Pair)[s],
    );
    expect(round2(r)).toBe(expected);
    expect(r).toBeGreaterThanOrEqual(4.5);
  });

  it('secondary has no text color to check (R30)', () => {
    expect(c.roleTexts.secondary).toBeUndefined();
  });

  // section 6.2 reference: the role color of warning would fail on page and
  // surface (1.75 and 1.88), which is why the adjusted tone exists (D92)
  it.each([
    ['page', 1.75],
    ['surface', 1.88],
  ])('warning role color #F2B200 on %s would be %d (fails)', (g, expected) => {
    const r = ratio('#F2B200', (c.backgrounds[g] as Pair).light);
    expect(round2(r)).toBe(expected);
    expect(r).toBeLessThan(4.5);
  });
});

describe('6.3 neutral texts on backgrounds (min 4.5)', () => {
  it.each(expand(table63))('text-%s %s on %s = %d', (name, s, g, expected) => {
    const r = ratio((c.texts[name] as Pair)[s], (c.backgrounds[g] as Pair)[s]);
    expect(round2(r)).toBe(expected);
    expect(r).toBeGreaterThanOrEqual(4.5);
  });

  // 6.3 note: passes by a thin margin; any change must redo the test (D95)
  it('text-muted dark on raised is 4.51 and passes unrounded', () => {
    const r = ratio(
      c.texts.muted?.dark as string,
      c.backgrounds.raised?.dark as string,
    );
    expect(round2(r)).toBe(4.51);
    expect(r).toBeGreaterThanOrEqual(4.5);
  });
});

describe('6.4 borders on backgrounds (min 3)', () => {
  it.each(expand(table64))(
    'border-%s %s on %s = %d',
    (name, s, g, expected) => {
      const r = ratio(
        (c.borders[name] as Pair)[s],
        (c.backgrounds[g] as Pair)[s],
      );
      expect(round2(r)).toBe(expected);
      expect(r).toBeGreaterThanOrEqual(3);
    },
  );
});

// R10, R11, D93, D95, D128: exempt pairs are not required to pass, and the
// spec says text-subtle is 2.2 to 2.8:1. We only record that they are not
// part of the required set, by checking they really would fail 4.5.
describe('exempt colors (R10, R11)', () => {
  it.each(columns)('text-subtle %s on %s is below 3 (exempt)', (s, g) => {
    const r = ratio((c.texts.subtle as Pair)[s], (c.backgrounds[g] as Pair)[s]);
    expect(r).toBeGreaterThanOrEqual(2.2);
    expect(r).toBeLessThan(3);
  });
});

// C2: every -hover must be checked against the on- of the same role in both
// schemes, including secondary-hover with its dedicated on color (D130).
describe('hover with the on- of the same role (C2)', () => {
  const roleNames = Object.keys(c.roles);

  it('covers the six roles', () => {
    expect(roleNames.sort()).toStrictEqual([
      'danger',
      'info',
      'primary',
      'secondary',
      'success',
      'warning',
    ]);
  });

  it.each(roleNames.flatMap((role) => schemes.map((s) => [role, s] as const)))(
    '%s-hover %s with text-on-%s passes 4.5',
    (role, s) => {
      const r = c.roles[role] as Record<string, Pair>;
      expect(
        ratio((r.hover as Pair)[s], (r.on as Pair)[s]),
      ).toBeGreaterThanOrEqual(4.5);
    },
  );

  // 5.2: secondary-hover text is #25252B in light and #F2F2F4 in dark
  it.each([
    ['light', '#25252B'],
    ['dark', '#F2F2F4'],
  ] as const)('secondary-hover %s uses on color %s (D130)', (s, on) => {
    expect((c.roles.secondary as Record<string, Pair>).on?.[s]).toBe(on);
  });
});

// R19, R20, C1: one sweep of every required pair, derived from the rules, so
// a role added to the theme without passing contrast fails here.
describe('sweep of all required pairs (R19, R20)', () => {
  const failures: string[] = [];
  for (const s of schemes) {
    for (const [role, r] of Object.entries(c.roles)) {
      for (const kind of ['base', 'hover', 'soft'] as const) {
        const fg = (kind === 'soft' ? r.onSoft : r.on) as Pair;
        const v = ratio((r[kind] as Pair)[s], fg[s]);
        if (v < 4.5) failures.push(`${role} ${kind} ${s}: ${v}`);
      }
    }
    for (const g of grounds) {
      const bg = (c.backgrounds[g] as Pair)[s];
      for (const [name, t] of Object.entries({ ...c.texts, ...c.roleTexts })) {
        if (name === 'subtle') continue;
        const v = ratio(t[s], bg);
        if (v < 4.5) failures.push(`text-${name} ${s} on ${g}: ${v}`);
      }
      for (const name of ['focus', 'strong']) {
        const v = ratio((c.borders[name] as Pair)[s], bg);
        if (v < 3) failures.push(`border-${name} ${s} on ${g}: ${v}`);
      }
    }
  }

  it('has no required pair below its minimum', () => {
    expect(failures).toStrictEqual([]);
  });
});
