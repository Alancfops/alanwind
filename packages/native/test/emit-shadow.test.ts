import type { Color, ShadowLayer, StyleMap } from '@alanwind/core';
import { describe, expect, it } from 'vitest';
import { emitShadow } from '../src/emit/index';

const black = (alpha: number): Color => ({ rgb: '#000000', alpha });

const layer = (offsetY: number, blur: number, alpha: number): ShadowLayer => ({
  offsetX: 0,
  offsetY,
  blur,
  spread: 0,
  color: black(alpha),
});

const out = (
  offsetY: number,
  blurRadius: number,
  color: string,
): Record<string, unknown> => ({
  offsetX: 0,
  offsetY,
  blurRadius,
  spreadDistance: 0,
  color,
});

const forbidden = [
  'shadowColor',
  'shadowOffset',
  'shadowOpacity',
  'shadowRadius',
  'elevation',
];

// tema.md section 5.7 (light, shadow-sm/md/lg) written as IR, and
// emissor-native.md R18, R17 (D154, D155): one boxShadow object per layer.
describe('emitShadow, light scheme (tema.md 5.7)', () => {
  it.each<[string, readonly ShadowLayer[], Record<string, unknown>[]]>([
    ['shadow-sm', [layer(1, 2, 0.06)], [out(1, 2, 'rgba(0, 0, 0, 0.06)')]],
    [
      'shadow-md',
      [layer(4, 8, 0.08), layer(1, 2, 0.06)],
      [out(4, 8, 'rgba(0, 0, 0, 0.08)'), out(1, 2, 'rgba(0, 0, 0, 0.06)')],
    ],
    [
      'shadow-lg',
      [layer(12, 24, 0.12), layer(4, 8, 0.06)],
      [out(12, 24, 'rgba(0, 0, 0, 0.12)'), out(4, 8, 'rgba(0, 0, 0, 0.06)')],
    ],
  ])('%s', (_name, boxShadow, expected) => {
    expect(emitShadow({ boxShadow })).toStrictEqual({ boxShadow: expected });
  });
});

// tema.md 5.7 (dark: one layer, D137) and emissor-native.md section 5.4,
// line `bg-surface shadow-md` dark (only the boxShadow part).
describe('emitShadow, dark scheme (tema.md 5.7)', () => {
  it.each<[string, readonly ShadowLayer[], Record<string, unknown>[]]>([
    ['shadow-sm', [layer(1, 2, 0.3)], [out(1, 2, 'rgba(0, 0, 0, 0.3)')]],
    ['shadow-md', [layer(4, 8, 0.35)], [out(4, 8, 'rgba(0, 0, 0, 0.35)')]],
    ['shadow-lg', [layer(12, 24, 0.4)], [out(12, 24, 'rgba(0, 0, 0, 0.4)')]],
  ])('%s', (_name, boxShadow, expected) => {
    expect(emitShadow({ boxShadow })).toStrictEqual({ boxShadow: expected });
  });
});

// emissor-native.md section 5.4, line `bg-surface shadow-md` light: only
// the boxShadow part; other declarations are not the shadow emitter's.
describe('emitShadow, section 5.4 (D155)', () => {
  it('bg-surface shadow-md, light: ignores backgroundColor', () => {
    const declarations: StyleMap = {
      backgroundColor: {
        light: { rgb: '#FFFFFF', alpha: 1 },
        dark: { rgb: '#1E1E22', alpha: 1 },
      },
      boxShadow: [layer(4, 8, 0.08), layer(1, 2, 0.06)],
    };
    expect(emitShadow(declarations)).toStrictEqual({
      boxShadow: [
        out(4, 8, 'rgba(0, 0, 0, 0.08)'),
        out(1, 2, 'rgba(0, 0, 0, 0.06)'),
      ],
    });
  });

  it('bg-surface shadow-md, dark: ignores border and background', () => {
    const declarations: StyleMap = {
      backgroundColor: {
        light: { rgb: '#28282D', alpha: 1 },
        dark: { rgb: '#28282D', alpha: 1 },
      },
      borderColor: {
        light: { rgb: '#34343A', alpha: 1 },
        dark: { rgb: '#34343A', alpha: 1 },
      },
      borderTopWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderLeftWidth: 1,
      boxShadow: [layer(4, 8, 0.35)],
    };
    expect(emitShadow(declarations)).toStrictEqual({
      boxShadow: [out(4, 8, 'rgba(0, 0, 0, 0.35)')],
    });
  });
});

// emissor-native.md R17 (alpha 1 -> '#RRGGBB' as in the IR), D154.
describe('emitShadow, color format (R17)', () => {
  it.each<[string, Color, string]>([
    ['alpha 1 keeps rgb as is', { rgb: '#112233', alpha: 1 }, '#112233'],
    ['alpha 1 keeps uppercase', { rgb: '#AABBCC', alpha: 1 }, '#AABBCC'],
    ['alpha 0.5', { rgb: '#2563EB', alpha: 0.5 }, 'rgba(37, 99, 235, 0.5)'],
    ['alpha 0 stays rgba', { rgb: '#000000', alpha: 0 }, 'rgba(0, 0, 0, 0)'],
    [
      'alpha 0.99',
      { rgb: '#FFFFFF', alpha: 0.99 },
      'rgba(255, 255, 255, 0.99)',
    ],
  ])('%s', (_name, color, expected) => {
    const result = emitShadow({
      boxShadow: [{ offsetX: 0, offsetY: 1, blur: 2, spread: 0, color }],
    });
    expect(result).toStrictEqual({
      boxShadow: [out(1, 2, expected)],
    });
  });
});

// emissor-native.md R18: field mapping blur -> blurRadius, spread ->
// spreadDistance, offsets unchanged.
describe('emitShadow, field mapping (R18)', () => {
  it('maps every field, with non-zero spread and offsetX', () => {
    expect(
      emitShadow({
        boxShadow: [
          { offsetX: 3, offsetY: -2, blur: 7, spread: 5, color: black(0.5) },
        ],
      }),
    ).toStrictEqual({
      boxShadow: [
        {
          offsetX: 3,
          offsetY: -2,
          blurRadius: 7,
          spreadDistance: 5,
          color: 'rgba(0, 0, 0, 0.5)',
        },
      ],
    });
  });

  it('keeps spread 0 and blur 0 as 0 (not omitted)', () => {
    expect(
      emitShadow({
        boxShadow: [
          { offsetX: 0, offsetY: 0, blur: 0, spread: 0, color: black(1) },
        ],
      }),
    ).toStrictEqual({ boxShadow: [out(0, 0, '#000000')] });
  });

  it('keeps the layer order of the IR (R18)', () => {
    const result = emitShadow({
      boxShadow: [layer(1, 1, 0.1), layer(2, 2, 0.2), layer(3, 3, 0.3)],
    });
    expect(result).toStrictEqual({
      boxShadow: [
        out(1, 1, 'rgba(0, 0, 0, 0.1)'),
        out(2, 2, 'rgba(0, 0, 0, 0.2)'),
        out(3, 3, 'rgba(0, 0, 0, 0.3)'),
      ],
    });
  });

  it('one output layer per input layer', () => {
    const boxShadow = Array.from({ length: 5 }, (_, i) => layer(i, i, 0.5));
    const result = emitShadow({ boxShadow });
    expect(result.boxShadow).toHaveLength(5);
  });
});

// emissor-native.md R18 and section 6: boxShadow only.
describe('emitShadow, absence and forbidden keys (R18, section 6)', () => {
  it('IR without shadow returns {}', () => {
    expect(emitShadow({})).toStrictEqual({});
  });

  it('IR with only other properties returns {}', () => {
    expect(emitShadow({ opacity: 0.5, borderTopWidth: 1 })).toStrictEqual({});
  });

  it.each<[string, readonly ShadowLayer[]]>([
    ['shadow-sm', [layer(1, 2, 0.06)]],
    ['shadow-md', [layer(4, 8, 0.08), layer(1, 2, 0.06)]],
    ['shadow-lg', [layer(12, 24, 0.12), layer(4, 8, 0.06)]],
  ])('%s: only the boxShadow key, no shadow* or elevation', (_n, boxShadow) => {
    const result = emitShadow({ boxShadow });
    expect(Object.keys(result)).toStrictEqual(['boxShadow']);
    for (const key of forbidden) {
      expect(result).not.toHaveProperty(key);
    }
  });
});

// funcionamento-interno.md: the IR is immutable data; the emitter is pure.
describe('emitShadow, purity', () => {
  it('does not change the input IR', () => {
    const declarations: StyleMap = {
      boxShadow: [layer(4, 8, 0.08), layer(1, 2, 0.06)],
    };
    const before = structuredClone(declarations);
    emitShadow(declarations);
    expect(declarations).toStrictEqual(before);
  });

  it('is deterministic across calls', () => {
    const declarations: StyleMap = { boxShadow: [layer(4, 8, 0.08)] };
    expect(emitShadow(declarations)).toStrictEqual(emitShadow(declarations));
  });
});
