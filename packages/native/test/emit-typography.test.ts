import { describe, expect, it } from 'vitest';
import type { ResolutionContext } from '../src/context/types';
import {
  emitFontFamily,
  emitFontWeight,
  emitLineHeight,
  emitTextStyle,
} from '../src/emit/index';

const ratio = (value: number) => ({ unit: 'ratio', value }) as const;

// Default context of the examples (emissor-native.md, section 5): compact,
// ios, window 390 x 844.
const ctx = (
  platform: ResolutionContext['platform'] = 'ios',
  scheme: ResolutionContext['scheme'] = 'light',
): ResolutionContext => ({
  scheme,
  band: 'compact',
  platform,
  window: { width: 390, height: 844 },
});

// docs/specs/emissor-native.md, section 5.3 and R21 (D156): the nine rows.
describe('emitFontFamily (R21, 5.3, D156)', () => {
  it.each([
    // generic, platform, expected
    ['sans', 'ios', 'System'],
    ['sans', 'android', 'Roboto'],
    ['sans', 'web', 'system-ui, sans-serif'],
    ['serif', 'ios', 'Georgia'],
    ['serif', 'android', 'serif'],
    ['serif', 'web', 'Georgia, serif'],
    ['mono', 'ios', 'Menlo'],
    ['mono', 'android', 'monospace'],
    ['mono', 'web', 'ui-monospace, monospace'],
  ] as const)('font-%s on %s', (family, platform, expected) => {
    expect(emitFontFamily(family, platform)).toBe(expected);
  });
});

// R16 and section 5.4 (D154): fontWeight is always a string.
describe('emitFontWeight (R16, 5.4, D154)', () => {
  it.each([
    [400, '400'],
    [500, '500'],
    [700, '700'],
  ] as const)('%s becomes the string %j', (weight, expected) => {
    const out = emitFontWeight(weight);
    expect(typeof out).toBe('string');
    expect(out).toBe(expected);
  });
});

// R20 and section 5.1/5.4 (D157): final size x value, to two decimals.
describe('emitLineHeight (R20, D157, D176)', () => {
  it.each([
    // name, ratio, received size, expected
    ['type-lg leading-normal (5.1)', 1.5, 18, 27],
    ['type-sm leading-tight (5.1)', 1.25, 14, 17.5],
    ['type-2xl leading=1.4 (5.4)', 1.4, 24, 33.6],
    ['leading-normal direct, size 16 (D176)', 1.5, 16, 24],
    // the received size rules, not a fixed size
    ['leading-normal with size 20', 1.5, 20, 30],
    ['ratio 1 returns the size', 1, 16, 16],
    // rounding to two decimals (D157), values far from the midpoint
    ['rounds down: 17 x 1.333 = 22.661', 1.333, 17, 22.66],
    ['rounds up: 17 x 1.336 = 22.712', 1.336, 17, 22.71],
    ['13 x 1.4 = 18.2 without floating point noise', 1.4, 13, 18.2],
    ['15 x 1.1 = 16.5 without floating point noise', 1.1, 15, 16.5],
    ['11 x 1.37 = 15.07', 1.37, 11, 15.07],
    ['integer result comes out without decimals', 1.5, 14, 21],
    // fractional ratio and size
    ['fractional size 12.5 x 1.5 = 18.75', 1.5, 12.5, 18.75],
  ] as const)('%s', (_name, value, fontSize, expected) => {
    expect(emitLineHeight(ratio(value), fontSize)).toBe(expected);
  });

  it('returns a number, not a string', () => {
    expect(typeof emitLineHeight(ratio(1.4), 24)).toBe('number');
  });
});

// Half-up pending decision: the exact product sits on a midpoint and floating
// point noise decides the side. Rounding is half up until Alan confirms; if he
// picks half to even, only the expected values of these cases change.
describe('emitLineHeight: half-up pending decision (D157)', () => {
  it.each([
    // name, ratio, received size, expected (half up)
    ['15 x 1.035 = 15.525 becomes 15.53', 1.035, 15, 15.53],
    ['13 x 1.005 = 13.065 becomes 13.07', 1.005, 13, 13.07],
    ['23 x 0.435 = 10.005 becomes 10.01', 0.435, 23, 10.01],
  ] as const)('%s', (_name, value, fontSize, expected) => {
    expect(emitLineHeight(ratio(value), fontSize)).toBe(expected);
  });

  it.each([
    ['15 x 1.035 = 15.525 becomes 15.53', 1.035, 15, 15.53],
    ['13 x 1.005 = 13.065 becomes 13.07', 1.005, 13, 13.07],
    ['23 x 0.435 = 10.005 becomes 10.01', 0.435, 23, 10.01],
  ] as const)('via emitTextStyle: %s', (_name, value, fontSize, expected) => {
    expect(
      emitTextStyle({ fontSize, lineHeight: ratio(value) }, ctx(), 16),
    ).toStrictEqual({ fontSize, lineHeight: expected });
  });
});

// emissor-native.md, sections 5.1, 5.3 and 5.4: full text style.
describe('emitTextStyle: section 5.1 (R19, R20)', () => {
  it.each([
    [
      'type-lg leading-normal',
      { fontSize: 18, lineHeight: ratio(1.5) },
      18,
      { fontSize: 18, lineHeight: 27 },
    ],
    [
      'type-sm leading-tight',
      { fontSize: 14, lineHeight: ratio(1.25) },
      14,
      { fontSize: 14, lineHeight: 17.5 },
    ],
    // D176: direct look(), no type-* or inheritance, the caller passes 16.
    [
      'leading-normal (direct look())',
      { lineHeight: ratio(1.5) },
      16,
      { lineHeight: 24 },
    ],
    [
      'italic underline upper',
      {
        fontStyle: 'italic',
        textDecorationLine: 'underline',
        textTransform: 'uppercase',
      },
      16,
      {
        fontStyle: 'italic',
        textDecorationLine: 'underline',
        textTransform: 'uppercase',
      },
    ],
    ['align-center', { textAlign: 'center' }, 16, { textAlign: 'center' }],
  ] as const)('%s', (_look, declarations, fontSize, expected) => {
    expect(emitTextStyle(declarations, ctx(), fontSize)).toStrictEqual(
      expected,
    );
  });
});

// R15 and section 6: empty IR gives {}, no default value added (D83).
describe('emitTextStyle: empty IR (R15)', () => {
  it('{} becomes {}', () => {
    expect(emitTextStyle({}, ctx(), 16)).toStrictEqual({});
  });

  it('the received size alone does not become fontSize or lineHeight', () => {
    expect(emitTextStyle({}, ctx(), 24)).toStrictEqual({});
  });
});

// Section 5.3 and R21 (D156): the nine rows as full style.
describe('emitTextStyle: section 5.3 (R21)', () => {
  it.each([
    ['font-sans', 'sans', 'ios', 'System'],
    ['font-sans', 'sans', 'android', 'Roboto'],
    ['font-sans', 'sans', 'web', 'system-ui, sans-serif'],
    ['font-serif', 'serif', 'ios', 'Georgia'],
    ['font-serif', 'serif', 'android', 'serif'],
    ['font-serif', 'serif', 'web', 'Georgia, serif'],
    ['font-mono', 'mono', 'ios', 'Menlo'],
    ['font-mono', 'mono', 'android', 'monospace'],
    ['font-mono', 'mono', 'web', 'ui-monospace, monospace'],
  ] as const)('%s on %s', (_look, family, platform, expected) => {
    expect(
      emitTextStyle({ fontFamily: family }, ctx(platform), 16),
    ).toStrictEqual({ fontFamily: expected });
  });
});

// Section 5.4 (D154, D157) and R16.
describe('emitTextStyle: section 5.4 (D154, D157)', () => {
  it.each([
    [400, '400'],
    [500, '500'],
    [700, '700'],
  ] as const)(
    'fontWeight %s comes out as the string %j',
    (weight, expected) => {
      expect(emitTextStyle({ fontWeight: weight }, ctx(), 16)).toStrictEqual({
        fontWeight: expected,
      });
    },
  );

  it('type-2xl leading=1.4', () => {
    expect(
      emitTextStyle({ fontSize: 24, lineHeight: ratio(1.4) }, ctx(), 24),
    ).toStrictEqual({ fontSize: 24, lineHeight: 33.6 });
  });
});

// R22 (D115): the system font scale stays at the React Native default.
describe('emitTextStyle: font scale (R22)', () => {
  it.each([
    ['ios', 'light'],
    ['android', 'dark'],
    ['web', 'light'],
  ] as const)(
    'no allowFontScaling or maxFontSizeMultiplier (%s, %s)',
    (platform, scheme) => {
      const style = emitTextStyle(
        {
          fontSize: 18,
          fontWeight: 700,
          fontFamily: 'sans',
          lineHeight: ratio(1.5),
          textAlign: 'center',
          fontStyle: 'italic',
          textDecorationLine: 'underline',
          textTransform: 'uppercase',
          color: {
            light: { rgb: '#111111', alpha: 1 },
            dark: { rgb: '#EEEEEE', alpha: 1 },
          },
        },
        ctx(platform, scheme),
        18,
      );
      expect(style).not.toHaveProperty('allowFontScaling');
      expect(style).not.toHaveProperty('maxFontSizeMultiplier');
      expect(Object.keys(style).sort()).toStrictEqual([
        'color',
        'fontFamily',
        'fontSize',
        'fontStyle',
        'fontWeight',
        'lineHeight',
        'textAlign',
        'textDecorationLine',
        'textTransform',
      ]);
    },
  );
});

// Trying to break it.
describe('emitTextStyle: edges (R15, R20)', () => {
  it('lineHeight without declared fontSize uses the received size and creates no fontSize', () => {
    expect(emitTextStyle({ lineHeight: ratio(1.5) }, ctx(), 20)).toStrictEqual({
      lineHeight: 30,
    });
  });

  it('declared fontSize wins over the received size (R20)', () => {
    expect(
      emitTextStyle({ fontSize: 18, lineHeight: ratio(1.5) }, ctx(), 20),
    ).toStrictEqual({ fontSize: 18, lineHeight: 27 });
  });

  it('rounds to two decimals inside the full style (D157)', () => {
    expect(
      emitTextStyle({ fontSize: 17, lineHeight: ratio(1.333) }, ctx(), 17),
    ).toStrictEqual({ fontSize: 17, lineHeight: 22.66 });
  });

  it('adds no properties the IR did not declare (D83)', () => {
    expect(emitTextStyle({ fontWeight: 500 }, ctx(), 16)).toStrictEqual({
      fontWeight: '500',
    });
  });

  it('ignores properties that are neither color nor text (R14, R15)', () => {
    expect(
      emitTextStyle({ paddingTop: 16, opacity: 0.5 }, ctx(), 16),
    ).toStrictEqual({});
  });
});
