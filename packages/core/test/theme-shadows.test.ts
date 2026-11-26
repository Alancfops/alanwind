import { describe, expect, it } from 'vitest';
import type { ShadowLayer } from '../src/index.js';
import { defaultTheme } from '../src/index.js';

// Golden tests for the default theme shadows and dark elevation.
// Expected values come from docs/specs/tema.md (R17, R18, section 5.7, 7.2)
// and docs/specs/funcionamento-interno.md (R34, ShadowLayer). Decisions: D96
// (black, layer order), D97, D132 (border, levels), D137 (one dark layer).

const { shadows } = defaultTheme;

const black = (alpha: number) => ({ rgb: '#000000', alpha });
const layer = (offsetY: number, blur: number, alpha: number): ShadowLayer => ({
  offsetX: 0,
  offsetY,
  blur,
  spread: 0,
  color: black(alpha),
});

type Size = 'sm' | 'md' | 'lg';

// tema.md 5.7, light table (D96): top layer first.
const lightTable: ReadonlyArray<[Size, ShadowLayer[]]> = [
  ['sm', [layer(1, 2, 0.06)]],
  ['md', [layer(4, 8, 0.08), layer(1, 2, 0.06)]],
  ['lg', [layer(12, 24, 0.12), layer(4, 8, 0.06)]],
];

// tema.md 5.7, dark table (D132, D137): exactly one layer.
const darkTable: ReadonlyArray<[Size, ShadowLayer[]]> = [
  ['sm', [layer(1, 2, 0.3)]],
  ['md', [layer(4, 8, 0.35)]],
  ['lg', [layer(12, 24, 0.4)]],
];

describe('light shadows (R17, 5.7)', () => {
  it.each(lightTable)('shadow-%s', (size, expected) => {
    expect(shadows.light[size]).toStrictEqual(expected);
  });

  it.each([
    ['sm', 1],
    ['md', 2],
    ['lg', 2],
  ] as const)('shadow-%s has %i layer(s)', (size, count) => {
    expect(shadows.light[size]).toHaveLength(count);
  });

  // tema.md 7.2: md and lg keep the larger shadow first (D96).
  it('orders the layers from the top one to the bottom one (D96)', () => {
    for (const size of ['md', 'lg'] as const) {
      const [top, bottom] = shadows.light[size];
      expect(top?.blur).toBeGreaterThan(bottom?.blur ?? Number.MAX_VALUE);
      expect(top?.color.alpha).toBeGreaterThan(0);
    }
  });
});

describe('dark shadows (R18, 5.7, D137)', () => {
  it.each(darkTable)('shadow-%s', (size, expected) => {
    expect(shadows.dark[size]).toStrictEqual(expected);
  });

  it.each(['sm', 'md', 'lg'] as const)('shadow-%s has one layer', (size) => {
    expect(shadows.dark[size]).toHaveLength(1);
  });

  // D137: the second light layer does not apply in dark.
  it.each(['md', 'lg'] as const)(
    'shadow-%s drops the light 2nd layer',
    (size) => {
      expect(shadows.dark[size]).not.toContainEqual(shadows.light[size][1]);
    },
  );
});

describe('common shape of all layers (D96, ShadowLayer)', () => {
  const all = (['light', 'dark'] as const).flatMap((scheme) =>
    (['sm', 'md', 'lg'] as const).flatMap((size) =>
      shadows[scheme][size].map((l, i): [string, ShadowLayer] => [
        `${scheme} ${size}[${i}]`,
        l,
      ]),
    ),
  );

  it('has 8 layers in total', () => {
    // light: 1 + 2 + 2, dark: 1 + 1 + 1
    expect(all).toHaveLength(8);
  });

  it.each(all)('%s: black, spread 0, offsetX 0, alpha within 0..1', (_n, l) => {
    expect(l.color.rgb).toBe('#000000');
    expect(l.spread).toBe(0);
    expect(l.offsetX).toBe(0);
    expect(l.color.alpha).toBeGreaterThan(0);
    expect(l.color.alpha).toBeLessThanOrEqual(1);
  });

  // Only neutral IR names: no RN/CSS property names (task criterion).
  it.each(all)('%s: only the ShadowLayer keys', (_n, l) => {
    expect(Object.keys(l).sort()).toStrictEqual(
      ['blur', 'color', 'offsetX', 'offsetY', 'spread'].sort(),
    );
    expect(Object.keys(l.color).sort()).toStrictEqual(['alpha', 'rgb']);
  });

  it('has no RN/CSS property names anywhere in the shadows', () => {
    const text = JSON.stringify(shadows);
    for (const name of [
      'boxShadow',
      'box-shadow',
      'shadowColor',
      'shadowOffset',
      'shadowOpacity',
      'shadowRadius',
      'elevation:',
      'borderWidth',
      'borderColor',
      'blurRadius',
      'spreadDistance',
      'rgba(',
      'px',
    ]) {
      expect(text).not.toContain(name);
    }
  });
});

describe('dark elevation border (R18, D132)', () => {
  it('has width 1', () => {
    expect(shadows.elevation.border.width).toBe(1);
  });

  it('has color #34343A', () => {
    expect(shadows.elevation.border.color.rgb).toBe('#34343A');
  });

  it('is opaque', () => {
    expect(shadows.elevation.border.color.alpha).toBe(1);
  });

  it('equals the border-subtle dark color of the theme (5.2)', () => {
    expect(shadows.elevation.border.color.rgb).toBe(
      defaultTheme.colors.borders.subtle.dark,
    );
  });
});

describe('dark elevation levels (R18, D97, D132)', () => {
  // tema.md 5.7: page -> surface -> raised; raised stays in raised.
  it.each([
    ['page', 'surface'],
    ['surface', 'raised'],
    ['raised', 'raised'],
  ] as const)('%s -> %s', (from, to) => {
    expect(shadows.elevation.nextBackground[from]).toBe(to);
  });

  it('has exactly the three levels', () => {
    expect(Object.keys(shadows.elevation.nextBackground).sort()).toStrictEqual([
      'page',
      'raised',
      'surface',
    ]);
  });

  it('never goes down: applying it twice from page reaches raised', () => {
    const next = shadows.elevation.nextBackground;
    expect(next[next.page]).toBe('raised');
  });
});

describe('structure of the shadows object', () => {
  it('has only light, dark and elevation', () => {
    expect(Object.keys(shadows).sort()).toStrictEqual([
      'dark',
      'elevation',
      'light',
    ]);
  });

  it.each(['light', 'dark'] as const)('%s has only sm, md, lg', (scheme) => {
    expect(Object.keys(shadows[scheme]).sort()).toStrictEqual([
      'lg',
      'md',
      'sm',
    ]);
  });

  it('has only border and nextBackground in elevation', () => {
    expect(Object.keys(shadows.elevation).sort()).toStrictEqual([
      'border',
      'nextBackground',
    ]);
  });
});

// Task criterion: the theme is immutable (R5).
describe('immutability', () => {
  it('rejects writes at type level', () => {
    // Never called: only the compiler checks these lines.
    const typeOnly = (): void => {
      // @ts-expect-error layers are readonly
      shadows.light.sm = [];
      // @ts-expect-error layer lists are readonly
      shadows.light.md.push(layer(0, 0, 0));
      // @ts-expect-error levels are readonly
      shadows.elevation.nextBackground.raised = 'page';
      // @ts-expect-error border width is readonly
      shadows.elevation.border.width = 2;
    };
    expect(typeOnly).toBeTypeOf('function');
  });
});
