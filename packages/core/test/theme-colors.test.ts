import { describe, expect, it } from 'vitest';
import { defaultTheme } from '../src/index.js';

// Golden tests for the default theme colors.
// Expected values are copied by hand from docs/specs/tema.md, sections 5.1 to
// 5.5 and 7.1 (R1, R2, R7, R8, R9, R30, R31). Nothing comes from the code.

type Pair = { readonly light: string; readonly dark: string };

// Loose view of the theme, so absent keys can be probed without type errors.
const colors = defaultTheme.colors as unknown as Record<
  string,
  Record<string, unknown>
>;

const roleOf = (role: string): Record<string, Pair> =>
  (colors.roles as unknown as Record<string, Record<string, Pair>>)[
    role
  ] as Record<string, Pair>;

const roles = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
] as const;
const facets = ['base', 'on', 'hover', 'soft', 'onSoft'] as const;

// tema.md 5.1
const neutralTable: ReadonlyArray<[string, string, string, string]> = [
  // group, key, light, dark
  ['backgrounds', 'page', '#F6F6F8', '#141416'],
  ['backgrounds', 'surface', '#FFFFFF', '#1E1E22'],
  ['backgrounds', 'raised', '#FFFFFF', '#28282D'],
  ['texts', 'strong', '#141416', '#F2F2F4'],
  ['texts', 'body', '#3B3B42', '#C9C9CF'],
  ['texts', 'muted', '#6B6B74', '#8E8E96'],
  ['texts', 'subtle', '#A1A1AA', '#5C5C64'],
  ['texts', 'link', '#1D4FD8', '#8AB4FF'],
  ['borders', 'subtle', '#E3E3E8', '#34343A'],
  ['borders', 'strong', '#8E8E96', '#74747E'],
  ['borders', 'focus', '#2563EB', '#8AB4FF'],
];

// tema.md 5.2 and 5.3: base, on, hover, soft, onSoft
type RoleRow = Record<(typeof facets)[number], string>;
const roleTable: Record<
  (typeof roles)[number],
  { light: RoleRow; dark: RoleRow }
> = {
  primary: {
    light: {
      base: '#2563EB',
      on: '#FFFFFF',
      hover: '#1D4FD8',
      soft: '#E1EAFD',
      onSoft: '#1E3FA8',
    },
    dark: {
      base: '#8AB4FF',
      on: '#0A1F4D',
      hover: '#A6C6FF',
      soft: '#14306B',
      onSoft: '#B3CCFF',
    },
  },
  secondary: {
    light: {
      base: '#E9E9EE',
      on: '#25252B',
      hover: '#DCDCE2',
      soft: '#F1F1F4',
      onSoft: '#3B3B42',
    },
    dark: {
      base: '#34343A',
      on: '#F2F2F4',
      hover: '#3E3E45',
      soft: '#232328',
      onSoft: '#C9C9CF',
    },
  },
  success: {
    light: {
      base: '#15803D',
      on: '#FFFFFF',
      hover: '#116932',
      soft: '#DCFCE7',
      onSoft: '#14532D',
    },
    dark: {
      base: '#5FD68E',
      on: '#052E16',
      hover: '#7CE2A4',
      soft: '#123A22',
      onSoft: '#A7F0C4',
    },
  },
  warning: {
    light: {
      base: '#F2B200',
      on: '#3B2A00',
      hover: '#D99F00',
      soft: '#FEF3C7',
      onSoft: '#713F12',
    },
    dark: {
      base: '#FFD166',
      on: '#3B2A00',
      hover: '#FFDD8A',
      soft: '#3A2C06',
      onSoft: '#FDE68A',
    },
  },
  danger: {
    light: {
      base: '#D02424',
      on: '#FFFFFF',
      hover: '#B91C1C',
      soft: '#FEE2E2',
      onSoft: '#991B1B',
    },
    dark: {
      base: '#FF8A80',
      on: '#450A0A',
      hover: '#FFA59D',
      soft: '#4A1515',
      onSoft: '#FECACA',
    },
  },
  info: {
    light: {
      base: '#0B63B6',
      on: '#FFFFFF',
      hover: '#09529A',
      soft: '#E0EFFF',
      onSoft: '#0B4A8B',
    },
    dark: {
      base: '#7CC4FF',
      on: '#04203D',
      hover: '#9BD2FF',
      soft: '#0E2E4F',
      onSoft: '#B8DCFF',
    },
  },
};

// tema.md 5.5: text-<role> (no secondary, R30)
const roleTextTable: ReadonlyArray<[string, string, string]> = [
  ['primary', '#2563EB', '#8AB4FF'],
  ['success', '#15803D', '#5FD68E'],
  ['warning', '#8A5A00', '#FFD166'],
  ['danger', '#D02424', '#FF8A80'],
  ['info', '#0B63B6', '#7CC4FF'],
];

describe('neutral colors (tema.md 5.1)', () => {
  it.each(neutralTable)('%s.%s', (group, key, light, dark) => {
    expect(colors[group]?.[key]).toStrictEqual({ light, dark });
  });

  it('has exactly the groups backgrounds, texts, borders, roles, roleTexts', () => {
    expect(Object.keys(colors).sort()).toStrictEqual([
      'backgrounds',
      'borders',
      'roleTexts',
      'roles',
      'texts',
    ]);
  });

  it('backgrounds has exactly page, surface, raised', () => {
    expect(Object.keys(colors.backgrounds ?? {}).sort()).toStrictEqual([
      'page',
      'raised',
      'surface',
    ]);
  });

  it('texts has exactly strong, body, muted, subtle, link', () => {
    expect(Object.keys(colors.texts ?? {}).sort()).toStrictEqual([
      'body',
      'link',
      'muted',
      'strong',
      'subtle',
    ]);
  });

  it('borders has exactly subtle, strong, focus', () => {
    expect(Object.keys(colors.borders ?? {}).sort()).toStrictEqual([
      'focus',
      'strong',
      'subtle',
    ]);
  });

  // tema.md 5.1 note and D128: light raised equals light surface
  it('light raised equals light surface, dark raised differs', () => {
    const bg = colors.backgrounds as Record<string, Pair>;
    expect(bg.raised?.light).toBe(bg.surface?.light);
    expect(bg.raised?.dark).not.toBe(bg.surface?.dark);
  });
});

describe('role colors (tema.md 5.2 and 5.3)', () => {
  const cases = roles.flatMap((role) =>
    facets.map((facet) => [role, facet] as const),
  );

  it.each(cases)('roles.%s.%s', (role, facet) => {
    const expected = roleTable[role];
    const actual = roleOf(role)[facet];
    expect(actual).toStrictEqual({
      light: expected.light[facet],
      dark: expected.dark[facet],
    });
  });

  it('has exactly the six roles', () => {
    expect(Object.keys(colors.roles ?? {}).sort()).toStrictEqual([
      'danger',
      'info',
      'primary',
      'secondary',
      'success',
      'warning',
    ]);
  });

  it.each(roles)('%s has exactly the five facets', (role) => {
    expect(Object.keys(roleOf(role)).sort()).toStrictEqual([
      'base',
      'hover',
      'on',
      'onSoft',
      'soft',
    ]);
  });

  // R8, D47, D91: dark text on the warning color in both schemes
  it('on-warning is #3B2A00 in both schemes (R8)', () => {
    expect(roleOf('warning').on).toStrictEqual({
      light: '#3B2A00',
      dark: '#3B2A00',
    });
  });

  // 7.1: bg-secondary-hover / bg-secondary-soft / text-on-secondary-soft
  it('secondary hover and soft values (7.1)', () => {
    const s = roleOf('secondary');
    expect(s.hover).toStrictEqual({ light: '#DCDCE2', dark: '#3E3E45' });
    expect(s.soft).toStrictEqual({ light: '#F1F1F4', dark: '#232328' });
    expect(s.onSoft).toStrictEqual({ light: '#3B3B42', dark: '#C9C9CF' });
  });

  // 5.4: hover lightens in dark and darkens in light (D22, D24): check that
  // hover differs from base in every role and scheme.
  it.each(roles)('%s hover differs from base in both schemes', (role) => {
    const r = roleOf(role);
    expect(r.hover?.light).not.toBe(r.base?.light);
    expect(r.hover?.dark).not.toBe(r.base?.dark);
  });
});

describe('role text colors (tema.md 5.5)', () => {
  it.each(roleTextTable)('roleTexts.%s', (role, light, dark) => {
    expect(colors.roleTexts?.[role]).toStrictEqual({ light, dark });
  });

  it('has exactly primary, success, warning, danger, info', () => {
    expect(Object.keys(colors.roleTexts ?? {}).sort()).toStrictEqual([
      'danger',
      'info',
      'primary',
      'success',
      'warning',
    ]);
  });

  // R30, D129: text-secondary does not exist
  it('has no secondary entry (R30)', () => {
    expect('secondary' in (colors.roleTexts ?? {})).toBe(false);
    expect(colors.roleTexts?.secondary).toBeUndefined();
  });

  // R9, 5.5 and section 8: warning light uses the adjusted tone
  it('text-warning light is #8A5A00, not the role color #F2B200 (R9)', () => {
    const warning = colors.roleTexts?.warning as Pair;
    expect(warning.light).toBe('#8A5A00');
    expect(warning.light).not.toBe('#F2B200');
    expect(roleOf('warning').base?.light).toBe('#F2B200');
  });

  // R9: where the role color already passes, the text color is the role color
  it.each(['primary', 'success', 'danger', 'info'])(
    '%s text equals the role color in both schemes (R9)',
    (role) => {
      const text = colors.roleTexts?.[role] as Pair;
      expect(text).toStrictEqual(roleOf(role).base);
    },
  );

  it('warning dark text equals the role color (R9)', () => {
    const text = colors.roleTexts?.warning as Pair;
    expect(text.dark).toBe(roleOf('warning').base?.dark);
  });
});

describe('format of every color', () => {
  const all: Array<[string, unknown]> = [];
  for (const [group, entries] of Object.entries(colors)) {
    for (const [name, value] of Object.entries(entries)) {
      if (group === 'roles') {
        for (const [facet, pair] of Object.entries(
          value as Record<string, unknown>,
        )) {
          all.push([`${group}.${name}.${facet}`, pair]);
        }
      } else {
        all.push([`${group}.${name}`, value]);
      }
    }
  }

  it('covers 11 neutral + 30 role + 5 role text entries', () => {
    expect(all).toHaveLength(11 + 30 + 5);
  });

  // tema.md section 3: colors are always #RRGGBB, uppercase (R1, R2)
  it.each(all)('%s is {light, dark} of uppercase #RRGGBB', (_name, pair) => {
    expect(Object.keys(pair as object).sort()).toStrictEqual(['dark', 'light']);
    const p = pair as Pair;
    expect(p.light).toMatch(/^#[0-9A-F]{6}$/);
    expect(p.dark).toMatch(/^#[0-9A-F]{6}$/);
  });
});

describe('immutability (R5)', () => {
  it('rejects writes at type level', () => {
    // Never called: only the compiler checks these lines.
    const typeOnly = (): void => {
      // @ts-expect-error color values are readonly
      defaultTheme.colors.backgrounds.page.light = '#000000';
      // @ts-expect-error role facets are readonly
      defaultTheme.colors.roles.primary.base = {
        light: '#000000',
        dark: '#000000',
      };
      // @ts-expect-error the colors object is readonly
      defaultTheme.colors = {} as typeof defaultTheme.colors;
    };
    expect(typeOnly).toBeTypeOf('function');
  });

  it('exposes literal types for the values', () => {
    const blue: '#2563EB' = defaultTheme.colors.roles.primary.base.light;
    const warningText: '#8A5A00' = defaultTheme.colors.roleTexts.warning.light;
    expect([blue, warningText]).toStrictEqual(['#2563EB', '#8A5A00']);
  });

  it('has no secondary in roleTexts at type level (R30)', () => {
    // @ts-expect-error text-secondary does not exist
    const missing: unknown = defaultTheme.colors.roleTexts.secondary;
    expect(missing).toBeUndefined();
  });
});
