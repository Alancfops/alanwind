import { describe, expect, expectTypeOf, it } from 'vitest';
import type {
  Color,
  Condition,
  ConditionAtom,
  Diagnostic,
  DiagnosticOrigin,
  Dimension,
  Percent,
  Position,
  PropsIR,
  PropsLayer,
  PropsMap,
  Ratio,
  ResolvedLook,
  ScreenSize,
  ShadowLayer,
  StyleIR,
  StyleLayer,
  StyleMap,
  ThemedColor,
} from '../src/index.js';

// These type tests are enforced by `tsc --noEmit` (the `typecheck` script):
// Vitest strips types, so `expectTypeOf` does nothing at runtime. Each
// `@ts-expect-error` below is a shape the spec forbids; if the type starts
// accepting it, `tsc` reports "Unused '@ts-expect-error' directive".
// The directive sits right above the invalid property, because `tsc` reports
// the error on that line.
//
// Color values: docs/specs/funcionamento-interno.md, section 5 (D46, D50, D51,
// D95, D128). Examples are written in full, without the T/PAD/BORDER notation.

const surface = {
  light: { rgb: '#FFFFFF', alpha: 1 },
  dark: { rgb: '#1E1E22', alpha: 1 },
} satisfies ThemedColor;
const raised = {
  light: { rgb: '#FFFFFF', alpha: 1 },
  dark: { rgb: '#28282D', alpha: 1 },
} satisfies ThemedColor;
const primary = {
  light: { rgb: '#2563EB', alpha: 1 },
  dark: { rgb: '#8AB4FF', alpha: 1 },
} satisfies ThemedColor;
const primaryHover = {
  light: { rgb: '#1D4FD8', alpha: 1 },
  dark: { rgb: '#A6C6FF', alpha: 1 },
} satisfies ThemedColor;
// The spec gives no hex for `danger` or `on-danger-soft` in section 5: the
// value is just a valid ThemedColor, only the type matters here.
const anyPair = {
  light: { rgb: '#DC2626', alpha: 1 },
  dark: { rgb: '#FF8A8A', alpha: 1 },
} satisfies ThemedColor;

const noProps = { layers: [] } satisfies PropsIR;

const hover = {
  kind: 'state',
  state: 'hover',
} as const satisfies ConditionAtom;
const press = {
  kind: 'state',
  state: 'press',
} as const satisfies ConditionAtom;
const dark = {
  kind: 'scheme',
  scheme: 'dark',
} as const satisfies ConditionAtom;
const light = {
  kind: 'scheme',
  scheme: 'light',
} as const satisfies ConditionAtom;
const medium = {
  kind: 'screen',
  from: 'medium',
  minWidth: 600,
} as const satisfies ConditionAtom;
const expanded = {
  kind: 'screen',
  from: 'expanded',
  minWidth: 840,
} as const satisfies ConditionAtom;

const shadowMdLight = [
  {
    offsetX: 0,
    offsetY: 4,
    blur: 8,
    spread: 0,
    color: { rgb: '#000000', alpha: 0.08 },
  },
  {
    offsetX: 0,
    offsetY: 1,
    blur: 2,
    spread: 0,
    color: { rgb: '#000000', alpha: 0.06 },
  },
] as const satisfies readonly ShadowLayer[];
const shadowMdDark = [
  {
    offsetX: 0,
    offsetY: 4,
    blur: 8,
    spread: 0,
    color: { rgb: '#000000', alpha: 0.35 },
  },
] as const satisfies readonly ShadowLayer[];
const borderGray = {
  light: { rgb: '#34343A', alpha: 1 },
  dark: { rgb: '#34343A', alpha: 1 },
} satisfies ThemedColor;
const raisedBoth = {
  light: { rgb: '#28282D', alpha: 1 },
  dark: { rgb: '#28282D', alpha: 1 },
} satisfies ThemedColor;
const surfaceBoth = {
  light: { rgb: '#1E1E22', alpha: 1 },
  dark: { rgb: '#1E1E22', alpha: 1 },
} satisfies ThemedColor;

describe('ResolvedLook: spec examples (section 5)', () => {
  it('5.1 simple style', () => {
    const cases = {
      'pad-4 bg-surface': {
        style: {
          layers: [
            {
              when: [],
              declarations: {
                paddingTop: 16,
                paddingRight: 16,
                paddingBottom: 16,
                paddingLeft: 16,
                backgroundColor: surface,
              },
            },
          ],
        },
        props: noProps,
        diagnostics: [],
      },
      'bg-primary-50': {
        style: {
          layers: [
            {
              when: [],
              declarations: {
                backgroundColor: {
                  light: { rgb: '#2563EB', alpha: 0.5 },
                  dark: { rgb: '#8AB4FF', alpha: 0.5 },
                },
              },
            },
          ],
        },
        props: noProps,
        diagnostics: [],
      },
      'bg=#e11d48/50': {
        style: {
          layers: [
            {
              when: [],
              declarations: {
                backgroundColor: {
                  light: { rgb: '#E11D48', alpha: 0.5 },
                  dark: { rgb: '#E11D48', alpha: 0.5 },
                },
              },
            },
          ],
        },
        props: noProps,
        diagnostics: [],
      },
      'bg=#f00': {
        style: {
          layers: [
            {
              when: [],
              declarations: {
                backgroundColor: {
                  light: { rgb: '#FF0000', alpha: 1 },
                  dark: { rgb: '#FF0000', alpha: 1 },
                },
              },
            },
          ],
        },
        props: noProps,
        diagnostics: [],
      },
      empty: { style: { layers: [] }, props: noProps, diagnostics: [] },
    } satisfies Record<string, ResolvedLook>;
    expectTypeOf(cases).toExtend<Record<string, ResolvedLook>>();
    expect(Object.keys(cases)).toHaveLength(5);
  });

  it('5.2 resolved conflict', () => {
    const cases = {
      'pad-4 pad-x-2': {
        style: {
          layers: [
            {
              when: [],
              declarations: {
                paddingTop: 16,
                paddingBottom: 16,
                paddingLeft: 8,
                paddingRight: 8,
              },
            },
          ],
        },
        props: noProps,
        diagnostics: [],
      },
      'pad-x-2 pad-4': {
        style: {
          layers: [
            {
              when: [],
              declarations: {
                paddingTop: 16,
                paddingBottom: 16,
                paddingLeft: 8,
                paddingRight: 8,
              },
            },
          ],
        },
        props: noProps,
        diagnostics: [],
      },
      'pad-top-2 pad-y-4': {
        style: {
          layers: [
            { when: [], declarations: { paddingTop: 8, paddingBottom: 16 } },
          ],
        },
        props: noProps,
        diagnostics: [],
      },
      'bg-primary bg-surface': {
        style: {
          layers: [{ when: [], declarations: { backgroundColor: surface } }],
        },
        props: noProps,
        diagnostics: [
          {
            code: 'AW201',
            severity: 'warning',
            message: 'conflict',
            position: { start: 0, end: 10 },
          },
        ],
      },
      'bg-surface hover(bg-primary-hover)': {
        style: {
          layers: [
            { when: [], declarations: { backgroundColor: surface } },
            {
              when: [hover],
              declarations: { backgroundColor: primaryHover },
            },
          ],
        },
        props: noProps,
        diagnostics: [],
      },
      'gap-4 gap-x-2': {
        style: {
          layers: [{ when: [], declarations: { rowGap: 16, columnGap: 8 } }],
        },
        props: noProps,
        diagnostics: [],
      },
      'round-top-lg round-md': {
        style: {
          layers: [
            {
              when: [],
              declarations: {
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                borderBottomRightRadius: 8,
                borderBottomLeftRadius: 8,
              },
            },
          ],
        },
        props: noProps,
        diagnostics: [],
      },
    } satisfies Record<string, ResolvedLook>;
    expectTypeOf(cases).toExtend<Record<string, ResolvedLook>>();
    expect(Object.keys(cases)).toHaveLength(7);
  });

  it('5.3 nested variant, no fusion, same condition (R51)', () => {
    const nested = {
      style: {
        layers: [
          { when: [], declarations: { backgroundColor: primary } },
          {
            when: [hover, dark],
            declarations: { backgroundColor: primaryHover },
          },
        ],
      },
      props: noProps,
      diagnostics: [],
    } satisfies ResolvedLook;
    const noFusion = {
      style: {
        layers: [
          { when: [hover], declarations: { backgroundColor: raised } },
          { when: [press], declarations: { backgroundColor: surface } },
          {
            when: [hover],
            declarations: {
              paddingTop: 16,
              paddingRight: 16,
              paddingBottom: 16,
              paddingLeft: 16,
            },
          },
        ],
      },
      props: noProps,
      diagnostics: [],
    } satisfies ResolvedLook;
    const pressHover = {
      style: {
        layers: [
          { when: [hover, press], declarations: { backgroundColor: raised } },
        ],
      },
      props: noProps,
      diagnostics: [],
    } satisfies ResolvedLook;
    const sameCondition = {
      style: {
        layers: [
          { when: [hover], declarations: { paddingLeft: 8, paddingRight: 8 } },
          {
            when: [hover],
            declarations: { paddingTop: 16, paddingBottom: 16 },
          },
        ],
      },
      props: noProps,
      diagnostics: [],
    } satisfies ResolvedLook;
    const tie = {
      style: {
        layers: [
          {
            when: [hover],
            declarations: {
              paddingTop: 8,
              paddingRight: 8,
              paddingBottom: 8,
              paddingLeft: 8,
            },
          },
        ],
      },
      props: noProps,
      diagnostics: [
        {
          code: 'AW201',
          severity: 'warning',
          message: 'tie',
          position: { start: 6, end: 11 },
        },
      ],
    } satisfies ResolvedLook;
    expectTypeOf(nested).toExtend<ResolvedLook>();
    expectTypeOf(noFusion).toExtend<ResolvedLook>();
    expectTypeOf(pressHover).toExtend<ResolvedLook>();
    expectTypeOf(sameCondition).toExtend<ResolvedLook>();
    expectTypeOf(tie).toExtend<ResolvedLook>();
  });

  it('5.4 screen ranges and precedence between conditions', () => {
    const screens = {
      style: {
        layers: [
          {
            when: [],
            declarations: {
              paddingTop: 8,
              paddingRight: 8,
              paddingBottom: 8,
              paddingLeft: 8,
            },
          },
          {
            when: [medium],
            declarations: {
              paddingTop: 16,
              paddingRight: 16,
              paddingBottom: 16,
              paddingLeft: 16,
            },
          },
          {
            when: [expanded],
            declarations: {
              paddingTop: 24,
              paddingRight: 24,
              paddingBottom: 24,
              paddingLeft: 24,
            },
          },
        ],
      },
      props: noProps,
      diagnostics: [],
    } satisfies ResolvedLook;
    // Layer-order table
    const hoverOverBase = {
      style: {
        layers: [
          { when: [], declarations: { backgroundColor: primary } },
          { when: [hover], declarations: { backgroundColor: raised } },
        ],
      },
      props: noProps,
      diagnostics: [],
    } satisfies ResolvedLook;
    const moreAtoms = {
      style: {
        layers: [
          { when: [hover], declarations: { backgroundColor: surface } },
          { when: [hover, dark], declarations: { backgroundColor: raised } },
        ],
      },
      props: noProps,
      diagnostics: [],
    } satisfies ResolvedLook;
    const conditionOverFamily = {
      style: {
        layers: [
          { when: [], declarations: { paddingLeft: 8, paddingRight: 8 } },
          {
            when: [medium],
            declarations: {
              paddingTop: 16,
              paddingRight: 16,
              paddingBottom: 16,
              paddingLeft: 16,
            },
          },
        ],
      },
      props: noProps,
      diagnostics: [],
    } satisfies ResolvedLook;
    const propsLayers = {
      style: { layers: [] },
      props: {
        layers: [
          { when: [], declarations: { numberOfLines: 4 } },
          { when: [medium], declarations: { numberOfLines: 2 } },
        ],
      },
      diagnostics: [],
    } satisfies ResolvedLook;
    expectTypeOf(screens).toExtend<ResolvedLook>();
    expectTypeOf(hoverOverBase).toExtend<ResolvedLook>();
    expectTypeOf(moreAtoms).toExtend<ResolvedLook>();
    expectTypeOf(conditionOverFamily).toExtend<ResolvedLook>();
    expectTypeOf(propsLayers).toExtend<ResolvedLook>();
  });

  it('5.5 alignment and direction', () => {
    const cases = {
      center: { justifyContent: 'center', alignItems: 'center' },
      'center-x': { alignItems: 'center' },
      'center-y': { justifyContent: 'center' },
      'col center-x': { flexDirection: 'column', alignItems: 'center' },
      'row center-x': { flexDirection: 'row', justifyContent: 'center' },
      'row center-y': { flexDirection: 'row', alignItems: 'center' },
      'x-start': { alignItems: 'flex-start' },
      'x-end': { alignItems: 'flex-end' },
      'y-start': { justifyContent: 'flex-start' },
      'row x-end': { flexDirection: 'row', justifyContent: 'flex-end' },
      'row y-start': { flexDirection: 'row', alignItems: 'flex-start' },
      between: { justifyContent: 'space-between' },
      'row between': { flexDirection: 'row', justifyContent: 'space-between' },
      wrap: { flexWrap: 'wrap' },
      fill: { flex: 1 },
    } satisfies Record<string, StyleMap>;
    const asLooks = Object.values(cases).map(
      (declarations): ResolvedLook => ({
        style: { layers: [{ when: [], declarations }] },
        props: noProps,
        diagnostics: [],
      }),
    );
    expect(asLooks).toHaveLength(15);

    const centerX = {
      style: {
        layers: [
          {
            when: [],
            declarations: { flexDirection: 'column', alignItems: 'center' },
          },
          {
            when: [medium],
            declarations: {
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'stretch',
            },
          },
        ],
      },
      props: noProps,
      diagnostics: [],
    } satisfies ResolvedLook;
    const centerY = {
      style: {
        layers: [
          {
            when: [],
            declarations: { flexDirection: 'column', justifyContent: 'center' },
          },
          {
            when: [medium],
            declarations: {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            },
          },
        ],
      },
      props: noProps,
      diagnostics: [],
    } satisfies ResolvedLook;
    const centerBoth = {
      style: {
        layers: [
          {
            when: [],
            declarations: {
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            },
          },
          { when: [medium], declarations: { flexDirection: 'row' } },
        ],
      },
      props: noProps,
      diagnostics: [],
    } satisfies ResolvedLook;
    const darkAndMedium = {
      style: {
        layers: [
          { when: [dark], declarations: { alignItems: 'center' } },
          { when: [medium], declarations: { flexDirection: 'row' } },
          {
            when: [dark, medium],
            declarations: { justifyContent: 'center', alignItems: 'stretch' },
          },
        ],
      },
      props: noProps,
      diagnostics: [],
    } satisfies ResolvedLook;
    expectTypeOf(centerX).toExtend<ResolvedLook>();
    expectTypeOf(centerY).toExtend<ResolvedLook>();
    expectTypeOf(centerBoth).toExtend<ResolvedLook>();
    expectTypeOf(darkAndMedium).toExtend<ResolvedLook>();
  });

  it('5.6 props', () => {
    const cases = {
      'lines-2': {
        style: { layers: [] },
        props: {
          layers: [{ when: [], declarations: { numberOfLines: 2 } }],
        },
        diagnostics: [],
      },
      'type-sm lines-2': {
        style: {
          layers: [{ when: [], declarations: { fontSize: 14 } }],
        },
        props: {
          layers: [{ when: [], declarations: { numberOfLines: 2 } }],
        },
        diagnostics: [],
      },
      'lines-2 lines-3': {
        style: { layers: [] },
        props: {
          layers: [{ when: [], declarations: { numberOfLines: 3 } }],
        },
        diagnostics: [
          {
            code: 'AW201',
            severity: 'warning',
            message: 'conflict',
            position: { start: 0, end: 7 },
          },
        ],
      },
      'medium(lines-2) lines-4': {
        style: { layers: [] },
        props: {
          layers: [
            { when: [], declarations: { numberOfLines: 4 } },
            { when: [medium], declarations: { numberOfLines: 2 } },
          ],
        },
        diagnostics: [],
      },
    } satisfies Record<string, ResolvedLook>;
    expectTypeOf(cases).toExtend<Record<string, ResolvedLook>>();
    expect(Object.keys(cases)).toHaveLength(4);
  });

  it('5.7 values', () => {
    const cases = {
      'w-full': { width: { unit: 'percent', value: 100 } },
      'h-screen': { height: { unit: 'screen' } },
      'w=137': { width: 137 },
      'w=10.5': { width: 10.5 },
      'w=50%': { width: { unit: 'percent', value: 50 } },
      'size-10': { width: 40, height: 40 },
      'size-full': {
        width: { unit: 'percent', value: 100 },
        height: { unit: 'percent', value: 100 },
      },
      'size-screen': {
        width: { unit: 'screen' },
        height: { unit: 'screen' },
      },
      'gap-4': { rowGap: 16, columnGap: 16 },
      'gap-x-4': { columnGap: 16 },
      'gap-y-2': { rowGap: 8 },
      'margin-x-auto': { marginLeft: 'auto', marginRight: 'auto' },
      'margin-top=-8': { marginTop: -8 },
      border: {
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
      },
      'border-0': {
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
      },
      'border-y-2': { borderTopWidth: 2, borderBottomWidth: 2 },
      'border=3': {
        borderTopWidth: 3,
        borderRightWidth: 3,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
      },
      'border-danger': { borderColor: anyPair },
      'round-full': {
        borderTopLeftRadius: 9999,
        borderTopRightRadius: 9999,
        borderBottomRightRadius: 9999,
        borderBottomLeftRadius: 9999,
      },
      'round-md': {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
      },
      'round-top-lg': { borderTopLeftRadius: 12, borderTopRightRadius: 12 },
      'round-bottom-left-md': { borderBottomLeftRadius: 8 },
      'opacity-50': { opacity: 0.5 },
      'weight-bold upper': { fontWeight: 700, textTransform: 'uppercase' },
      'font-mono': { fontFamily: 'mono' },
      'type-lg leading-normal': {
        fontSize: 18,
        lineHeight: { unit: 'ratio', value: 1.5 },
      },
      'leading=1.4': { lineHeight: { unit: 'ratio', value: 1.4 } },
      'text-on-danger-soft': { color: anyPair },
    } satisfies Record<string, StyleMap>;
    const asLooks = Object.values(cases).map(
      (declarations): ResolvedLook => ({
        style: { layers: [{ when: [], declarations }] },
        props: noProps,
        diagnostics: [],
      }),
    );
    expect(asLooks).toHaveLength(28);
  });

  it('5.8 dark-scheme elevation', () => {
    const elevated = {
      style: {
        layers: [
          { when: [], declarations: { backgroundColor: surface } },
          { when: [light], declarations: { boxShadow: shadowMdLight } },
          {
            when: [dark],
            declarations: {
              backgroundColor: raisedBoth,
              borderColor: borderGray,
              borderTopWidth: 1,
              borderRightWidth: 1,
              borderBottomWidth: 1,
              borderLeftWidth: 1,
              boxShadow: shadowMdDark,
            },
          },
        ],
      },
      props: noProps,
      diagnostics: [],
    } satisfies ResolvedLook;
    expectTypeOf(elevated).toExtend<ResolvedLook>();

    // Table: the [scheme dark] layer of each look (the spec gives only this
    // layer). `bg-primary` and `dark(bg-surface)` have no backgroundColor;
    // `border-2 border-strong` has no borderColor and no border widths.
    const darkLayers = {
      'shadow-sm': {
        when: [dark],
        declarations: {
          backgroundColor: surfaceBoth,
          borderColor: borderGray,
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderBottomWidth: 1,
          borderLeftWidth: 1,
          boxShadow: [
            {
              offsetX: 0,
              offsetY: 1,
              blur: 2,
              spread: 0,
              color: { rgb: '#000000', alpha: 0.3 },
            },
          ],
        },
      },
      'bg-page shadow-md': {
        when: [dark],
        declarations: {
          backgroundColor: surfaceBoth,
          borderColor: borderGray,
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderBottomWidth: 1,
          borderLeftWidth: 1,
          boxShadow: shadowMdDark,
        },
      },
      'bg-raised shadow-lg': {
        when: [dark],
        declarations: {
          backgroundColor: raisedBoth,
          borderColor: borderGray,
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderBottomWidth: 1,
          borderLeftWidth: 1,
          boxShadow: [
            {
              offsetX: 0,
              offsetY: 12,
              blur: 24,
              spread: 0,
              color: { rgb: '#000000', alpha: 0.4 },
            },
          ],
        },
      },
      'bg-primary shadow-md': {
        when: [dark],
        declarations: {
          borderColor: borderGray,
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderBottomWidth: 1,
          borderLeftWidth: 1,
          boxShadow: shadowMdDark,
        },
      },
      'dark(bg-surface) shadow-md': {
        when: [dark],
        declarations: {
          borderColor: borderGray,
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderBottomWidth: 1,
          borderLeftWidth: 1,
          boxShadow: shadowMdDark,
        },
      },
      'border-2 border-strong shadow-md': {
        when: [dark],
        declarations: {
          backgroundColor: surfaceBoth,
          boxShadow: shadowMdDark,
        },
      },
    } satisfies Record<string, StyleLayer>;
    expect(Object.keys(darkLayers)).toHaveLength(6);
  });

  it('5.8.1 shadow inside a variant', () => {
    const hoverShadow = {
      style: {
        layers: [
          { when: [], declarations: { backgroundColor: surface } },
          {
            when: [hover, light],
            declarations: { boxShadow: shadowMdLight },
          },
          {
            when: [hover, dark],
            declarations: {
              backgroundColor: raisedBoth,
              borderColor: borderGray,
              borderTopWidth: 1,
              borderRightWidth: 1,
              borderBottomWidth: 1,
              borderLeftWidth: 1,
              boxShadow: shadowMdDark,
            },
          },
        ],
      },
      props: noProps,
      diagnostics: [],
    } satisfies ResolvedLook;
    expectTypeOf(hoverShadow).toExtend<ResolvedLook>();

    // Table: the [hover, dark] layer of each look.
    const hoverDarkLayers = {
      'bg-primary hover(shadow-md)': {
        when: [hover, dark],
        declarations: {
          borderColor: borderGray,
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderBottomWidth: 1,
          borderLeftWidth: 1,
          boxShadow: shadowMdDark,
        },
      },
      'hover(bg-primary shadow-md)': {
        when: [hover, dark],
        declarations: {
          borderColor: borderGray,
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderBottomWidth: 1,
          borderLeftWidth: 1,
          boxShadow: shadowMdDark,
        },
      },
      'press(bg-primary) hover(shadow-md)': {
        when: [hover, dark],
        declarations: {
          backgroundColor: surfaceBoth,
          borderColor: borderGray,
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderBottomWidth: 1,
          borderLeftWidth: 1,
          boxShadow: shadowMdDark,
        },
      },
    } satisfies Record<string, StyleLayer>;
    expect(Object.keys(hoverDarkLayers)).toHaveLength(3);
  });

  it('5.9 errors and discards', () => {
    const cases = {
      'pad-4 hover(bg-raised': {
        style: {
          layers: [
            {
              when: [],
              declarations: {
                paddingTop: 16,
                paddingRight: 16,
                paddingBottom: 16,
                paddingLeft: 16,
              },
            },
          ],
        },
        props: noProps,
        diagnostics: [
          {
            code: 'AW102',
            severity: 'error',
            message: 'open parenthesis',
            position: { start: 6, end: 21 },
          },
        ],
      },
      'pad-4 bg-banana': {
        style: {
          layers: [
            {
              when: [],
              declarations: {
                paddingTop: 16,
                paddingRight: 16,
                paddingBottom: 16,
                paddingLeft: 16,
              },
            },
          ],
        },
        props: noProps,
        diagnostics: [
          {
            code: 'AW104',
            severity: 'error',
            message: 'unknown role',
            position: { start: 6, end: 15 },
          },
        ],
      },
      'pad-4 compact(row)': {
        style: {
          layers: [
            {
              when: [],
              declarations: {
                paddingTop: 16,
                paddingRight: 16,
                paddingBottom: 16,
                paddingLeft: 16,
              },
            },
          ],
        },
        props: noProps,
        diagnostics: [
          {
            code: 'AW105',
            severity: 'error',
            message: 'unknown variant',
            position: { start: 6, end: 18 },
          },
        ],
      },
      'pad-4 btn': {
        style: {
          layers: [
            {
              when: [],
              declarations: {
                paddingTop: 16,
                paddingRight: 16,
                paddingBottom: 16,
                paddingLeft: 16,
                backgroundColor: primary,
              },
            },
          ],
        },
        props: noProps,
        diagnostics: [
          {
            code: 'AW103',
            severity: 'warning',
            message: 'out of scale',
            position: { start: 6, end: 9 },
            origin: {
              shortcut: 'btn',
              position: { start: 11, end: 17 },
            },
          },
        ],
      },
    } satisfies Record<string, ResolvedLook>;
    expectTypeOf(cases).toExtend<Record<string, ResolvedLook>>();
    expect(Object.keys(cases)).toHaveLength(4);
  });
});

describe('format: shape of the types (section 4)', () => {
  it('Condition is a readonly list of atoms', () => {
    expectTypeOf<Condition>().toEqualTypeOf<readonly ConditionAtom[]>();
    expectTypeOf<ConditionAtom['kind']>().toEqualTypeOf<
      'platform' | 'scheme' | 'screen' | 'state'
    >();
  });

  it('atoms accept the four forms of the spec', () => {
    const atoms = [
      { kind: 'platform', platform: 'ios' },
      { kind: 'platform', platform: 'android' },
      { kind: 'platform', platform: 'web' },
      { kind: 'platform', platform: 'native' },
      { kind: 'scheme', scheme: 'light' },
      { kind: 'scheme', scheme: 'dark' },
      { kind: 'screen', from: 'medium', minWidth: 600 },
      { kind: 'screen', from: 'expanded', minWidth: 840 },
      { kind: 'state', state: 'hover' },
      { kind: 'state', state: 'press' },
      { kind: 'state', state: 'focus' },
      { kind: 'state', state: 'disabled' },
    ] as const satisfies readonly ConditionAtom[];
    expect(atoms).toHaveLength(12);
  });

  it('values and fields of each type', () => {
    expectTypeOf<Dimension>().toEqualTypeOf<number | Percent>();
    expectTypeOf<Percent>().toEqualTypeOf<{
      readonly unit: 'percent';
      readonly value: number;
    }>();
    expectTypeOf<ScreenSize>().toEqualTypeOf<{ readonly unit: 'screen' }>();
    expectTypeOf<Ratio>().toEqualTypeOf<{
      readonly unit: 'ratio';
      readonly value: number;
    }>();
    expectTypeOf<Color>().toEqualTypeOf<{
      readonly rgb: string;
      readonly alpha: number;
    }>();
    expectTypeOf<ThemedColor>().toEqualTypeOf<{
      readonly light: Color;
      readonly dark: Color;
    }>();
    expectTypeOf<ShadowLayer>().toEqualTypeOf<{
      readonly offsetX: number;
      readonly offsetY: number;
      readonly blur: number;
      readonly spread: number;
      readonly color: Color;
    }>();
    expectTypeOf<Position>().toEqualTypeOf<{
      readonly start: number;
      readonly end: number;
    }>();
    expectTypeOf<DiagnosticOrigin>().toEqualTypeOf<{
      readonly shortcut: string;
      readonly position: Position;
    }>();
    expectTypeOf<PropsMap>().toEqualTypeOf<{
      readonly numberOfLines?: number;
    }>();
  });

  it('layer structure and result', () => {
    expectTypeOf<ResolvedLook['style']>().toEqualTypeOf<StyleIR>();
    expectTypeOf<ResolvedLook['props']>().toEqualTypeOf<PropsIR>();
    expectTypeOf<ResolvedLook['diagnostics']>().toEqualTypeOf<
      readonly Diagnostic[]
    >();
    expectTypeOf<StyleIR['layers']>().toEqualTypeOf<readonly StyleLayer[]>();
    expectTypeOf<PropsIR['layers']>().toEqualTypeOf<readonly PropsLayer[]>();
    expectTypeOf<StyleLayer['when']>().toEqualTypeOf<Condition>();
    expectTypeOf<StyleLayer['declarations']>().toEqualTypeOf<StyleMap>();
    expectTypeOf<PropsLayer['when']>().toEqualTypeOf<Condition>();
    expectTypeOf<PropsLayer['declarations']>().toEqualTypeOf<PropsMap>();
  });

  it('Diagnostic: origin and suggestion are optional (R37, R49)', () => {
    const plain = {
      code: 'AW201',
      severity: 'warning',
      message: 'm',
      position: { start: 0, end: 1 },
    } satisfies Diagnostic;
    expectTypeOf(plain).toExtend<Diagnostic>();
    expectTypeOf<Diagnostic['origin']>().toEqualTypeOf<
      DiagnosticOrigin | undefined
    >();
    expectTypeOf<Diagnostic['suggestion']>().toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf<Diagnostic['severity']>().toEqualTypeOf<'error' | 'warning'>();
    expectTypeOf<Diagnostic['code']>().toEqualTypeOf<`AW${number}`>();
  });

  it('StyleMap: margin accepts auto; size accepts screen; spacing does not', () => {
    expectTypeOf<StyleMap['marginTop']>().toEqualTypeOf<
      Dimension | 'auto' | undefined
    >();
    expectTypeOf<StyleMap['width']>().toEqualTypeOf<
      Dimension | ScreenSize | undefined
    >();
    expectTypeOf<StyleMap['paddingTop']>().toEqualTypeOf<
      Dimension | undefined
    >();
    expectTypeOf<StyleMap['fontWeight']>().toEqualTypeOf<
      400 | 500 | 700 | undefined
    >();
    expectTypeOf<StyleMap['lineHeight']>().toEqualTypeOf<Ratio | undefined>();
    expectTypeOf<StyleMap['boxShadow']>().toEqualTypeOf<
      readonly ShadowLayer[] | undefined
    >();
  });

  it('StyleMap has none of the forbidden keys (R12, D124, D125, D139)', () => {
    expectTypeOf<StyleMap>().not.toHaveProperty('padding');
    expectTypeOf<StyleMap>().not.toHaveProperty('paddingHorizontal');
    expectTypeOf<StyleMap>().not.toHaveProperty('paddingVertical');
    expectTypeOf<StyleMap>().not.toHaveProperty('margin');
    expectTypeOf<StyleMap>().not.toHaveProperty('gap');
    expectTypeOf<StyleMap>().not.toHaveProperty('borderRadius');
    expectTypeOf<StyleMap>().not.toHaveProperty('borderWidth');
  });

  it('the IR carries no specificity or writing order (R11)', () => {
    expectTypeOf<StyleLayer>().not.toHaveProperty('specificity');
    expectTypeOf<StyleLayer>().not.toHaveProperty('order');
    expectTypeOf<StyleLayer>().not.toHaveProperty('index');
    expectTypeOf<StyleLayer>().toHaveProperty('when');
    expectTypeOf<StyleLayer>().toHaveProperty('declarations');
    expectTypeOf<keyof StyleLayer>().toEqualTypeOf<'when' | 'declarations'>();
    expectTypeOf<keyof ResolvedLook>().toEqualTypeOf<
      'style' | 'props' | 'diagnostics'
    >();
  });
});

describe('invalid shapes (@ts-expect-error)', () => {
  it('ConditionAtom', () => {
    // @ts-expect-error discriminant 'size' does not exist
    const a: ConditionAtom = { kind: 'size', from: 'medium', minWidth: 600 };
    // @ts-expect-error state 'active' does not exist
    const b: ConditionAtom = { kind: 'state', state: 'active' };
    // @ts-expect-error unknown scheme
    const c: ConditionAtom = { kind: 'scheme', scheme: 'sepia' };
    // @ts-expect-error range 'compact' does not exist (D61)
    const d: ConditionAtom = { kind: 'screen', from: 'compact', minWidth: 0 };
    // @ts-expect-error screen requires minWidth
    const e: ConditionAtom = { kind: 'screen', from: 'medium' };
    // @ts-expect-error unknown platform
    const f: ConditionAtom = { kind: 'platform', platform: 'windows' };
    // @ts-expect-error field of another atom on the wrong atom
    const g: ConditionAtom = { kind: 'state', scheme: 'dark' };
    expect([a, b, c, d, e, f, g]).toHaveLength(7);
  });

  it('StyleMap: unknown keys', () => {
    // @ts-expect-error paddingHorizontal does not exist (R12)
    const a: StyleMap = { paddingHorizontal: 8 };
    // @ts-expect-error borderRadius does not exist, only the four corners (D139)
    const b: StyleMap = { borderRadius: 8 };
    // @ts-expect-error gap does not exist, only rowGap/columnGap (D139)
    const c: StyleMap = { gap: 16 };
    // @ts-expect-error padding does not exist, only per side (R12)
    const d: StyleMap = { padding: 16 };
    // @ts-expect-error margin does not exist, only per side (R12)
    const e: StyleMap = { margin: 16 };
    // @ts-expect-error borderWidth does not exist, only per side (R12)
    const f: StyleMap = { borderWidth: 1 };
    // @ts-expect-error no RN/CSS property in the neutral IR (R3)
    const g: StyleMap = { shadowOpacity: 0.3 };
    expect([a, b, c, d, e, f, g]).toHaveLength(7);
  });

  it('StyleMap: values outside the domain', () => {
    // @ts-expect-error fontWeight is only 400, 500 or 700 (R36)
    const a: StyleMap = { fontWeight: 600 };
    // @ts-expect-error fontWeight as a string
    const b: StyleMap = { fontWeight: 'bold' };
    // @ts-expect-error 'space-around' does not exist in the IR
    const c: StyleMap = { justifyContent: 'space-around' };
    // @ts-expect-error alignItems 'baseline' does not exist in the IR
    const d: StyleMap = { alignItems: 'baseline' };
    // @ts-expect-error flexDirection 'row-reverse' does not exist
    const e: StyleMap = { flexDirection: 'row-reverse' };
    // @ts-expect-error flexWrap is only 'wrap'
    const f: StyleMap = { flexWrap: 'nowrap' };
    // @ts-expect-error fontFamily is only generic (R48)
    const g: StyleMap = { fontFamily: 'Inter' };
    // @ts-expect-error lineHeight is a Ratio, not a number (R33)
    const h: StyleMap = { lineHeight: 1.5 };
    // @ts-expect-error textAlign 'justify' does not exist
    const i: StyleMap = { textAlign: 'justify' };
    // @ts-expect-error textTransform 'capitalize' does not exist
    const j: StyleMap = { textTransform: 'capitalize' };
    // @ts-expect-error opacity is a number, not a string
    const k: StyleMap = { opacity: '50%' };
    expect([a, b, c, d, e, f, g, h, i, j, k]).toHaveLength(11);
  });

  it("'auto' only on margin; { unit: 'screen' } only on size (R29)", () => {
    const okMargin: StyleMap = { marginTop: 'auto' };
    const okWidth: StyleMap = { width: { unit: 'screen' } };
    const okHeight: StyleMap = { height: { unit: 'screen' } };
    expect([okMargin, okWidth, okHeight]).toHaveLength(3);

    // @ts-expect-error paddingTop does not accept 'auto'
    const a: StyleMap = { paddingTop: 'auto' };
    // @ts-expect-error paddingTop does not accept { unit: 'screen' }
    const b: StyleMap = { paddingTop: { unit: 'screen' } };
    // @ts-expect-error marginTop does not accept { unit: 'screen' }
    const c: StyleMap = { marginTop: { unit: 'screen' } };
    // @ts-expect-error rowGap does not accept 'auto'
    const d: StyleMap = { rowGap: 'auto' };
    // @ts-expect-error columnGap does not accept { unit: 'screen' }
    const e: StyleMap = { columnGap: { unit: 'screen' } };
    // @ts-expect-error width does not accept 'auto'
    const f: StyleMap = { width: 'auto' };
    // @ts-expect-error percent requires value
    const g: StyleMap = { width: { unit: 'percent' } };
    // @ts-expect-error a ratio is not a dimension
    const h: StyleMap = { width: { unit: 'ratio', value: 1 } };
    expect([a, b, c, d, e, f, g, h]).toHaveLength(8);
  });

  it('colors: always a ThemedColor with both colors resolved (R30)', () => {
    // @ts-expect-error color as a string
    const a: StyleMap = { backgroundColor: '#FFFFFF' };
    // @ts-expect-error the dark color is missing
    const b: StyleMap = { color: { light: { rgb: '#FFFFFF', alpha: 1 } } };
    // @ts-expect-error bare Color, without light/dark
    const c: StyleMap = { borderColor: { rgb: '#FFFFFF', alpha: 1 } };
    // @ts-expect-error Color requires alpha
    const d: Color = { rgb: '#FFFFFF' };
    // @ts-expect-error alpha as a string
    const e: Color = { rgb: '#FFFFFF', alpha: '1' };
    expect([a, b, c, d, e]).toHaveLength(5);
  });

  it('props: layers, not a flat map (R28, D135)', () => {
    // @ts-expect-error flat props, without layers
    const a: PropsIR = { numberOfLines: 2 };
    const b: ResolvedLook = {
      style: { layers: [] },
      // @ts-expect-error ResolvedLook.props is flat
      props: { numberOfLines: 2 },
      diagnostics: [],
    };
    // @ts-expect-error unknown prop in PropsMap
    const c: PropsMap = { ellipsizeMode: 'tail' };
    // @ts-expect-error numberOfLines is a number
    const d: PropsMap = { numberOfLines: '2' };
    // @ts-expect-error a props layer requires when
    const e: PropsLayer = { declarations: { numberOfLines: 2 } };
    expect([a, b, c, d, e]).toHaveLength(5);
  });

  it('StyleLayer and ResolvedLook: required and forbidden fields', () => {
    // @ts-expect-error when is missing
    const a: StyleLayer = { declarations: {} };
    // @ts-expect-error declarations is missing
    const b: StyleLayer = { when: [] };
    // @ts-expect-error the IR carries no specificity (R11)
    const c: StyleLayer = { when: [], declarations: {}, specificity: 1 };
    // @ts-expect-error props is missing
    const d: ResolvedLook = { style: { layers: [] }, diagnostics: [] };
    // @ts-expect-error diagnostics is missing
    const e: ResolvedLook = { style: { layers: [] }, props: { layers: [] } };
    const f: StyleLayer = {
      // @ts-expect-error when is a list, not a single atom
      when: { kind: 'state', state: 'hover' },
      declarations: {},
    };
    expect([a, b, c, d, e, f]).toHaveLength(6);
  });

  it('Diagnostic', () => {
    const a: Diagnostic = {
      code: 'AW201',
      // @ts-expect-error severity 'info' does not exist (R37)
      severity: 'info',
      message: 'm',
      position: { start: 0, end: 1 },
    };
    const b: Diagnostic = {
      // @ts-expect-error code outside the AW### pattern
      code: 'E201',
      severity: 'error',
      message: 'm',
      position: { start: 0, end: 1 },
    };
    // @ts-expect-error position is missing (R37)
    const c: Diagnostic = { code: 'AW201', severity: 'error', message: 'm' };
    // @ts-expect-error message is missing
    const d: Diagnostic = {
      code: 'AW201',
      severity: 'error',
      position: { start: 0, end: 1 },
    };
    const e: Diagnostic = {
      code: 'AW201',
      severity: 'error',
      message: 'm',
      position: { start: 0, end: 1 },
      // @ts-expect-error origin without position (R49)
      origin: { shortcut: 'btn' },
    };
    const f: Diagnostic = {
      code: 'AW201',
      severity: 'error',
      message: 'm',
      position: { start: 0, end: 1 },
      // @ts-expect-error origin without shortcut (R49)
      origin: { position: { start: 0, end: 1 } },
    };
    // @ts-expect-error Position requires end (R38)
    const g: Position = { start: 0 };
    expect([a, b, c, d, e, f, g]).toHaveLength(7);
  });

  it('everything is readonly', () => {
    const look: ResolvedLook = {
      style: { layers: [{ when: [], declarations: { paddingTop: 1 } }] },
      props: { layers: [] },
      diagnostics: [],
    };
    // @ts-expect-error style is readonly
    look.style = { layers: [] };
    // @ts-expect-error layers is readonly
    look.style.layers = [];
    // @ts-expect-error the layers list is readonly
    look.style.layers.push({ when: [], declarations: {} });
    // @ts-expect-error the diagnostics list is readonly
    look.diagnostics.push({
      code: 'AW201',
      severity: 'error',
      message: 'm',
      position: { start: 0, end: 1 },
    });
    // @ts-expect-error when is readonly
    look.style.layers[0]?.when.push(hover);
    const firstLayer = look.style.layers[0];
    if (firstLayer) {
      // @ts-expect-error declarations.paddingTop is readonly
      firstLayer.declarations.paddingTop = 2;
    }
    const color: Color = { rgb: '#000000', alpha: 1 };
    // @ts-expect-error Color.alpha is readonly
    color.alpha = 0;
    const pos: Position = { start: 0, end: 1 };
    // @ts-expect-error Position.start is readonly
    pos.start = 1;
    const shadows: StyleMap = { boxShadow: [] };
    // @ts-expect-error boxShadow is a readonly list
    shadows.boxShadow?.push(shadowMdDark[0]);
    expect(look.style.layers).toHaveLength(1);
  });
});
