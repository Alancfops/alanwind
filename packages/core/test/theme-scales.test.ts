import { describe, expect, it } from 'vitest';
import { defaultTheme } from '../src/index.js';

// Golden tests for the non-chromatic default theme scales.
// Expected values come from docs/specs/tema.md (R5, R13, R14, R16, sections
// 5.6, 5.8, 7.2) and docs/specs/funcionamento-interno.md (R29, R32).

const spacingTable: ReadonlyArray<[string, number]> = [
  ['0', 0],
  ['1', 4],
  ['2', 8],
  ['3', 12],
  ['4', 16],
  ['5', 20],
  ['6', 24],
  ['7', 28],
  ['8', 32],
  ['9', 36],
  ['10', 40],
  ['11', 44],
  ['12', 48],
  ['13', 52],
  ['14', 56],
  ['15', 60],
  ['16', 64],
];

// tema.md 5.6: spacing 0..16, steps of 4 px (R13, D43)
describe('spacing', () => {
  it.each(spacingTable)('spacing[%s] = %d', (key, expected) => {
    expect((defaultTheme.spacing as Record<string, unknown>)[key]).toBe(
      expected,
    );
  });

  it('has exactly the keys 0..16', () => {
    expect(defaultTheme.spacing).toStrictEqual(
      Object.fromEntries(spacingTable),
    );
  });

  it.each([['17'], ['-1'], ['1.5'], ['full'], ['screen']])(
    'spacing[%s] does not exist',
    (key) => {
      expect(Object.hasOwn(defaultTheme.spacing, key)).toBe(false);
    },
  );
});

// tema.md 5.6: size = same scale plus full (100%) and screen (R13, D98);
// funcionamento-interno.md R29: full = percent 100, screen = { unit: 'screen' }
describe('size', () => {
  it.each(spacingTable)('size[%s] = %d', (key, expected) => {
    expect((defaultTheme.size as Record<string, unknown>)[key]).toBe(expected);
  });

  it('size[10] = 40 (h-10, tema.md 7.2)', () => {
    expect(defaultTheme.size[10]).toBe(40);
  });

  it('size.full is 100 percent', () => {
    expect(defaultTheme.size.full).toStrictEqual({
      unit: 'percent',
      value: 100,
    });
  });

  it('size.screen is the screen unit', () => {
    expect(defaultTheme.size.screen).toStrictEqual({ unit: 'screen' });
  });

  it('has exactly 0..16, full and screen', () => {
    expect(Object.keys(defaultTheme.size).sort()).toStrictEqual(
      [...spacingTable.map(([key]) => key), 'full', 'screen'].sort(),
    );
  });

  it('size[17] does not exist', () => {
    expect(Object.hasOwn(defaultTheme.size, '17')).toBe(false);
  });
});

// tema.md 5.6: radius (R14, D44, D98)
describe('radius', () => {
  it.each([
    ['none', 0],
    ['sm', 4],
    ['md', 8],
    ['lg', 12],
    ['xl', 16],
    ['full', 9999],
  ])('radius.%s = %d', (key, expected) => {
    expect((defaultTheme.radius as Record<string, unknown>)[key]).toBe(
      expected,
    );
  });

  it('has exactly six entries', () => {
    expect(defaultTheme.radius).toStrictEqual({
      none: 0,
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
      full: 9999,
    });
  });
});

// tema.md 5.6: typography (R14, D49)
describe('fontSize', () => {
  it('has exactly seven entries', () => {
    expect(defaultTheme.fontSize).toStrictEqual({
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
    });
  });

  it('fontSize.3xl = 30 (type-3xl, tema.md 7.2)', () => {
    expect(defaultTheme.fontSize['3xl']).toBe(30);
  });
});

// tema.md 5.6: weight (R14, D98)
describe('fontWeight', () => {
  it('has exactly three entries', () => {
    expect(defaultTheme.fontWeight).toStrictEqual({
      regular: 400,
      medium: 500,
      bold: 700,
    });
  });
});

// tema.md 5.6: line height multiplier (R14, D98); 7.2 leading-loose = 1.75
describe('lineHeight', () => {
  it('has exactly three entries', () => {
    expect(defaultTheme.lineHeight).toStrictEqual({
      tight: 1.25,
      normal: 1.5,
      loose: 1.75,
    });
  });
});

// tema.md 5.6: opacity 0, 25, 50, 75, 100; 7.2 opacity-25 = 0.25;
// funcionamento-interno.md R32: opacity is 0..1
describe('opacity', () => {
  it.each([
    ['0', 0],
    ['25', 0.25],
    ['50', 0.5],
    ['75', 0.75],
    ['100', 1],
  ])('opacity[%s] = %d', (key, expected) => {
    expect((defaultTheme.opacity as Record<string, unknown>)[key]).toBe(
      expected,
    );
  });

  it('has exactly five entries', () => {
    expect(Object.keys(defaultTheme.opacity).sort()).toStrictEqual([
      '0',
      '100',
      '25',
      '50',
      '75',
    ]);
  });

  it.each([['30'], ['10'], ['101'], ['-1']])(
    'opacity[%s] does not exist',
    (key) => {
      expect(Object.hasOwn(defaultTheme.opacity, key)).toBe(false);
    },
  );
});

// tema.md 5.8 and R16: medium from 600, expanded from 840 (D94).
// compact is "below 600" and has no threshold of its own.
describe('breakpoints', () => {
  it('has exactly medium 600 and expanded 840', () => {
    expect(defaultTheme.breakpoints).toStrictEqual({
      medium: 600,
      expanded: 840,
    });
  });
});

// tema.md R5 and task criteria: the theme is fixed, `as const` / readonly.
describe('immutability (R5)', () => {
  it('rejects writes at type level', () => {
    // Never called: only the compiler checks these lines (no runtime mutation).
    const typeOnly = (): void => {
      // @ts-expect-error spacing values are readonly
      defaultTheme.spacing[4] = 16;
      // @ts-expect-error breakpoints are readonly
      defaultTheme.breakpoints.medium = 600;
      // @ts-expect-error scales are readonly
      defaultTheme.radius = {} as typeof defaultTheme.radius;
    };
    expect(typeOnly).toBeTypeOf('function');
  });

  it('exposes literal types for the values', () => {
    const sixteen: 16 = defaultTheme.spacing[4];
    const fullRadius: 9999 = defaultTheme.radius.full;
    const medium: 600 = defaultTheme.breakpoints.medium;
    expect([sixteen, fullRadius, medium]).toStrictEqual([16, 9999, 600]);
  });
});
