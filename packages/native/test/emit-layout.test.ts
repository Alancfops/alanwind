import type { StyleMap } from '@alanwind/core';
import { describe, expect, it } from 'vitest';
import type { ResolutionContext } from '../src';
import { emitBoxStyle } from '../src/emit';

// docs/specs/emissor-native.md, R14 to R16, sections 5.1, 5.4 and 6;
// docs/specs/funcionamento-interno.md, sections 5.1, 5.2, 5.5 and 5.7.
// Expected values are written by hand from the spec tables.

const windowOf = (width: number, height: number): ResolutionContext => ({
  scheme: 'light',
  band: 'compact',
  platform: 'ios',
  window: { width, height },
});

// Default example context: compact, ios, window 390 x 844 (spec section 5).
const context = windowOf(390, 844);

const percent = (value: number) => ({ unit: 'percent', value }) as const;
const screen = { unit: 'screen' } as const;

const FORBIDDEN_SHORTHANDS = [
  'padding',
  'paddingHorizontal',
  'paddingVertical',
  'margin',
  'borderWidth',
  'borderRadius',
] as const;

type Row = readonly [string, StyleMap, Record<string, unknown>];

// emissor-native.md 5.1, funcionamento-interno.md 5.1, 5.2 and 5.7.
describe('emitBoxStyle: value translation (R14, R16, section 5.1)', () => {
  it.each<Row>([
    [
      'pad-4',
      {
        paddingTop: 16,
        paddingRight: 16,
        paddingBottom: 16,
        paddingLeft: 16,
      },
      { paddingTop: 16, paddingRight: 16, paddingBottom: 16, paddingLeft: 16 },
    ],
    [
      'pad-x-2',
      { paddingLeft: 8, paddingRight: 8 },
      { paddingLeft: 8, paddingRight: 8 },
    ],
    [
      'pad-top-2 pad-y-4 (funcionamento-interno 5.2)',
      { paddingTop: 8, paddingBottom: 16 },
      { paddingTop: 8, paddingBottom: 16 },
    ],
    [
      'pad-4 pad-x-2 (funcionamento-interno 5.2)',
      { paddingTop: 16, paddingBottom: 16, paddingLeft: 8, paddingRight: 8 },
      { paddingTop: 16, paddingBottom: 16, paddingLeft: 8, paddingRight: 8 },
    ],
    [
      'margin-x-auto',
      { marginLeft: 'auto', marginRight: 'auto' },
      { marginLeft: 'auto', marginRight: 'auto' },
    ],
    ['margin-top=-8', { marginTop: -8 }, { marginTop: -8 }],
    ['w-full', { width: percent(100) }, { width: '100%' }],
    ['h-full', { height: percent(100) }, { height: '100%' }],
    ['w=50%', { width: percent(50) }, { width: '50%' }],
    ['w=12.5%', { width: percent(12.5) }, { width: '12.5%' }],
    ['w=137', { width: 137 }, { width: 137 }],
    ['w=10.5', { width: 10.5 }, { width: 10.5 }],
    ['size-10', { width: 40, height: 40 }, { width: 40, height: 40 }],
    [
      'size-full',
      { width: percent(100), height: percent(100) },
      { width: '100%', height: '100%' },
    ],
    ['gap-4', { rowGap: 16, columnGap: 16 }, { rowGap: 16, columnGap: 16 }],
    ['gap-x-4', { columnGap: 16 }, { columnGap: 16 }],
    ['gap-y-2', { rowGap: 8 }, { rowGap: 8 }],
    [
      'gap-4 gap-x-2 (funcionamento-interno 5.2)',
      { rowGap: 16, columnGap: 8 },
      { rowGap: 16, columnGap: 8 },
    ],
    [
      'border-y-2',
      { borderTopWidth: 2, borderBottomWidth: 2 },
      { borderTopWidth: 2, borderBottomWidth: 2 },
    ],
    [
      'border (BORDER(1))',
      {
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
      },
      {
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
      },
    ],
    [
      'round-top-lg',
      { borderTopLeftRadius: 12, borderTopRightRadius: 12 },
      { borderTopLeftRadius: 12, borderTopRightRadius: 12 },
    ],
    [
      'round-bottom-left-md',
      { borderBottomLeftRadius: 8 },
      { borderBottomLeftRadius: 8 },
    ],
    [
      'round-full (RADIUS(9999))',
      {
        borderTopLeftRadius: 9999,
        borderTopRightRadius: 9999,
        borderBottomRightRadius: 9999,
        borderBottomLeftRadius: 9999,
      },
      {
        borderTopLeftRadius: 9999,
        borderTopRightRadius: 9999,
        borderBottomRightRadius: 9999,
        borderBottomLeftRadius: 9999,
      },
    ],
    [
      'round-top-lg round-md (funcionamento-interno 5.2)',
      {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
      },
      {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
      },
    ],
    ['opacity-50', { opacity: 0.5 }, { opacity: 0.5 }],
    [
      'fill wrap between',
      { flex: 1, flexWrap: 'wrap', justifyContent: 'space-between' },
      { flex: 1, flexWrap: 'wrap', justifyContent: 'space-between' },
    ],
  ])('%s', (_look, declarations, expected) => {
    expect(emitBoxStyle(declarations, context)).toStrictEqual(expected);
  });
});

// funcionamento-interno.md 5.5: the alignment IR passes through by name.
describe('emitBoxStyle: layout IR (R14, funcionamento-interno 5.5)', () => {
  it.each<Row>([
    [
      'center',
      { justifyContent: 'center', alignItems: 'center' },
      { justifyContent: 'center', alignItems: 'center' },
    ],
    ['center-x', { alignItems: 'center' }, { alignItems: 'center' }],
    ['center-y', { justifyContent: 'center' }, { justifyContent: 'center' }],
    [
      'col center-x',
      { flexDirection: 'column', alignItems: 'center' },
      { flexDirection: 'column', alignItems: 'center' },
    ],
    [
      'row center-x',
      { flexDirection: 'row', justifyContent: 'center' },
      { flexDirection: 'row', justifyContent: 'center' },
    ],
    ['x-start', { alignItems: 'flex-start' }, { alignItems: 'flex-start' }],
    ['x-end', { alignItems: 'flex-end' }, { alignItems: 'flex-end' }],
    [
      'y-start',
      { justifyContent: 'flex-start' },
      { justifyContent: 'flex-start' },
    ],
    [
      'row between',
      { flexDirection: 'row', justifyContent: 'space-between' },
      { flexDirection: 'row', justifyContent: 'space-between' },
    ],
    [
      'alignItems stretch (undo, R26) is kept',
      { flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch' },
      { flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch' },
    ],
    ['wrap', { flexWrap: 'wrap' }, { flexWrap: 'wrap' }],
    ['fill', { flex: 1 }, { flex: 1 }],
  ])('%s', (_look, declarations, expected) => {
    expect(emitBoxStyle(declarations, context)).toStrictEqual(expected);
  });
});

// emissor-native.md 5.4 and R16 (ScreenSize), R39, D152.
describe('emitBoxStyle: screen units come from the window (R16, D152)', () => {
  it.each<
    readonly [string, StyleMap, ResolutionContext, Record<string, unknown>]
  >([
    [
      'h-screen, 390 x 844',
      { height: screen },
      windowOf(390, 844),
      {
        height: 844,
      },
    ],
    [
      'h-screen, 390 x 800',
      { height: screen },
      windowOf(390, 800),
      {
        height: 800,
      },
    ],
    [
      'w-screen, 390 x 844',
      { width: screen },
      windowOf(390, 844),
      {
        width: 390,
      },
    ],
    [
      'size-screen, 390 x 844',
      { width: screen, height: screen },
      windowOf(390, 844),
      { width: 390, height: 844 },
    ],
    [
      'size-screen, 700 x 1000 (width differs: height is not width)',
      { width: screen, height: screen },
      windowOf(700, 1000),
      { width: 700, height: 1000 },
    ],
    [
      'h-screen on a landscape window 844 x 390',
      { height: screen },
      windowOf(844, 390),
      { height: 390 },
    ],
    [
      'h-screen with fractional window 390.5 x 844.25',
      { height: screen },
      windowOf(390.5, 844.25),
      { height: 844.25 },
    ],
    [
      'w-screen mixed with h-full',
      { width: screen, height: percent(100) },
      windowOf(320, 568),
      { width: 320, height: '100%' },
    ],
  ])('%s', (_look, declarations, ctx, expected) => {
    expect(emitBoxStyle(declarations, ctx)).toStrictEqual(expected);
  });

  it('only reads the window: scheme, band and platform do not change it', () => {
    const declarations: StyleMap = { width: screen, height: screen };
    const expected = { width: 390, height: 844 };
    for (const scheme of ['light', 'dark'] as const) {
      for (const band of ['compact', 'medium', 'expanded'] as const) {
        for (const platform of ['ios', 'android', 'web'] as const) {
          const ctx: ResolutionContext = {
            scheme,
            band,
            platform,
            window: { width: 390, height: 844 },
          };
          expect(emitBoxStyle(declarations, ctx)).toStrictEqual(expected);
        }
      }
    }
  });
});

// R14: the shorthands never appear (section 6, `pad-x-4`).
describe('emitBoxStyle: no shorthand properties (R14, D107, D120)', () => {
  it('pad-x-4 gives paddingLeft and paddingRight, never paddingHorizontal', () => {
    const style = emitBoxStyle({ paddingLeft: 16, paddingRight: 16 }, context);
    expect(style).toStrictEqual({ paddingLeft: 16, paddingRight: 16 });
    expect(style).not.toHaveProperty('paddingHorizontal');
  });

  it('a full IR with every side and corner emits no shorthand', () => {
    const style = emitBoxStyle(
      {
        paddingTop: 1,
        paddingRight: 2,
        paddingBottom: 3,
        paddingLeft: 4,
        marginTop: 5,
        marginRight: 6,
        marginBottom: 7,
        marginLeft: 8,
        borderTopWidth: 1,
        borderRightWidth: 2,
        borderBottomWidth: 3,
        borderLeftWidth: 4,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 6,
        borderBottomRightRadius: 7,
        borderBottomLeftRadius: 8,
      },
      context,
    );
    for (const name of FORBIDDEN_SHORTHANDS) {
      expect(style).not.toHaveProperty(name);
    }
    expect(style).toStrictEqual({
      paddingTop: 1,
      paddingRight: 2,
      paddingBottom: 3,
      paddingLeft: 4,
      marginTop: 5,
      marginRight: 6,
      marginBottom: 7,
      marginLeft: 8,
      borderTopWidth: 1,
      borderRightWidth: 2,
      borderBottomWidth: 3,
      borderLeftWidth: 4,
      borderTopLeftRadius: 5,
      borderTopRightRadius: 6,
      borderBottomRightRadius: 7,
      borderBottomLeftRadius: 8,
    });
  });

  it('a single side keeps only that side (no collapse to shorthand)', () => {
    const style = emitBoxStyle({ paddingTop: 8 }, context);
    expect(style).toStrictEqual({ paddingTop: 8 });
  });

  it('four equal sides are not collapsed into padding', () => {
    const style = emitBoxStyle(
      { paddingTop: 4, paddingRight: 4, paddingBottom: 4, paddingLeft: 4 },
      context,
    );
    expect(Object.keys(style).sort()).toStrictEqual([
      'paddingBottom',
      'paddingLeft',
      'paddingRight',
      'paddingTop',
    ]);
  });
});

// R15, D83: only what the IR declares; no defaults.
describe('emitBoxStyle: only what the IR declares (R15, D83, D168)', () => {
  it('empty IR gives {}', () => {
    expect(emitBoxStyle({}, context)).toStrictEqual({});
  });

  it('empty IR gives {} in every window, scheme and platform', () => {
    expect(emitBoxStyle({}, windowOf(0, 0))).toStrictEqual({});
    expect(
      emitBoxStyle(
        {},
        {
          scheme: 'dark',
          band: 'expanded',
          platform: 'web',
          window: { width: 1200, height: 800 },
        },
      ),
    ).toStrictEqual({});
  });

  it('does not add flexDirection when the IR has none (task 051, D168)', () => {
    const style = emitBoxStyle({ alignItems: 'center' }, context);
    expect(style).toStrictEqual({ alignItems: 'center' });
    expect(style).not.toHaveProperty('flexDirection');
  });

  it('does not add flexDirection for a wrap, fill or gap', () => {
    expect(emitBoxStyle({ flexWrap: 'wrap' }, context)).not.toHaveProperty(
      'flexDirection',
    );
    expect(emitBoxStyle({ flex: 1 }, context)).not.toHaveProperty(
      'flexDirection',
    );
    expect(emitBoxStyle({ rowGap: 4 }, context)).not.toHaveProperty(
      'flexDirection',
    );
  });

  it('keeps an explicit flexDirection row', () => {
    expect(emitBoxStyle({ flexDirection: 'row' }, context)).toStrictEqual({
      flexDirection: 'row',
    });
  });

  it('keeps an explicit flexDirection column', () => {
    expect(emitBoxStyle({ flexDirection: 'column' }, context)).toStrictEqual({
      flexDirection: 'column',
    });
  });

  it('width alone does not bring height (and vice versa)', () => {
    expect(emitBoxStyle({ width: 10 }, context)).toStrictEqual({ width: 10 });
    expect(emitBoxStyle({ height: 10 }, context)).toStrictEqual({
      height: 10,
    });
  });

  it('a padding on one side does not bring margin, border or radius', () => {
    expect(emitBoxStyle({ paddingLeft: 3 }, context)).toStrictEqual({
      paddingLeft: 3,
    });
  });

  it('does not emit opacity unless declared', () => {
    expect(emitBoxStyle({ width: 1 }, context)).not.toHaveProperty('opacity');
  });
});

// Boundary values: zero must be kept, not treated as "absent".
describe('emitBoxStyle: zero and edge values (R16)', () => {
  it.each<Row>([
    [
      'border-0 (BORDER(0))',
      {
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
      },
      {
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
      },
    ],
    ['pad-top=0', { paddingTop: 0 }, { paddingTop: 0 }],
    ['margin-left=0', { marginLeft: 0 }, { marginLeft: 0 }],
    ['gap=0', { rowGap: 0, columnGap: 0 }, { rowGap: 0, columnGap: 0 }],
    ['w=0', { width: 0 }, { width: 0 }],
    ['opacity-0', { opacity: 0 }, { opacity: 0 }],
    ['opacity-100', { opacity: 1 }, { opacity: 1 }],
    ['round=0', { borderTopLeftRadius: 0 }, { borderTopLeftRadius: 0 }],
    ['flex 0', { flex: 0 }, { flex: 0 }],
    ['w=0%', { width: percent(0) }, { width: '0%' }],
    [
      'w=100% (explicit percent 100)',
      { width: percent(100) },
      {
        width: '100%',
      },
    ],
    [
      'w=200% (over 100 is not clamped)',
      { width: percent(200) },
      {
        width: '200%',
      },
    ],
    ['margin-top=-12.5', { marginTop: -12.5 }, { marginTop: -12.5 }],
    ['margin-top=-10%', { marginTop: percent(-10) }, { marginTop: '-10%' }],
    [
      'pad-left=10% (percent in padding)',
      { paddingLeft: percent(10) },
      {
        paddingLeft: '10%',
      },
    ],
    [
      'gap=25% (percent in gap)',
      { rowGap: percent(25), columnGap: percent(25) },
      {
        rowGap: '25%',
        columnGap: '25%',
      },
    ],
    ['margin-top=auto', { marginTop: 'auto' }, { marginTop: 'auto' }],
    [
      'margin-auto on the four sides',
      {
        marginTop: 'auto',
        marginRight: 'auto',
        marginBottom: 'auto',
        marginLeft: 'auto',
      },
      {
        marginTop: 'auto',
        marginRight: 'auto',
        marginBottom: 'auto',
        marginLeft: 'auto',
      },
    ],
    ['opacity 0.05 (small decimal)', { opacity: 0.05 }, { opacity: 0.05 }],
    ['w=0.5 is dp, not a percent', { width: 0.5 }, { width: 0.5 }],
  ])('%s', (_look, declarations, expected) => {
    expect(emitBoxStyle(declarations, context)).toStrictEqual(expected);
  });

  it('screen unit with a zero-sized window gives 0', () => {
    expect(
      emitBoxStyle({ width: screen, height: screen }, windowOf(0, 0)),
    ).toStrictEqual({ width: 0, height: 0 });
  });
});

// Number vs. string: Percent is a string, number stays a number.
describe('emitBoxStyle: value types (R16)', () => {
  it('number stays a number and Percent becomes a string', () => {
    const style = emitBoxStyle({ width: 50, height: percent(50) }, context);
    expect(typeof style.width).toBe('number');
    expect(typeof style.height).toBe('string');
    expect(style).toStrictEqual({ width: 50, height: '50%' });
  });

  it('the percent unit is not left as an object', () => {
    const style = emitBoxStyle({ width: percent(75) }, context);
    expect(style.width).toBe('75%');
  });

  it('does not mutate the IR it receives', () => {
    const declarations: StyleMap = {
      width: screen,
      height: percent(50),
      marginLeft: 'auto',
    };
    const snapshot = JSON.stringify(declarations);
    emitBoxStyle(declarations, context);
    expect(JSON.stringify(declarations)).toBe(snapshot);
  });

  it('is deterministic: same input and context give equal output', () => {
    const declarations: StyleMap = { width: screen, paddingTop: 4 };
    expect(emitBoxStyle(declarations, context)).toStrictEqual(
      emitBoxStyle(declarations, context),
    );
  });
});

// Combined real-world IR (spec 5.1 `fill wrap between` plus spacing).
describe('emitBoxStyle: mixed declarations', () => {
  it('layout, spacing, size, border, radius and opacity together', () => {
    const style = emitBoxStyle(
      {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        rowGap: 8,
        columnGap: 16,
        paddingTop: 16,
        marginLeft: 'auto',
        width: percent(50),
        height: screen,
        borderBottomWidth: 2,
        borderTopLeftRadius: 12,
        opacity: 0.5,
      },
      windowOf(390, 800),
    );
    expect(style).toStrictEqual({
      flexDirection: 'row',
      flexWrap: 'wrap',
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      rowGap: 8,
      columnGap: 16,
      paddingTop: 16,
      marginLeft: 'auto',
      width: '50%',
      height: 800,
      borderBottomWidth: 2,
      borderTopLeftRadius: 12,
      opacity: 0.5,
    });
  });
});
