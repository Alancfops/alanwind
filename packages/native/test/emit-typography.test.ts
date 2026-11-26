import { describe, expect, it } from 'vitest';
import type { ResolutionContext } from '../src/context/types';
import {
  emitFontFamily,
  emitFontWeight,
  emitLineHeight,
  emitTextStyle,
} from '../src/emit/index';

const ratio = (value: number) => ({ unit: 'ratio', value }) as const;

// Contexto padrão dos exemplos (emissor-native.md, seção 5): compact, ios,
// janela 390 x 844.
const ctx = (
  platform: ResolutionContext['platform'] = 'ios',
  scheme: ResolutionContext['scheme'] = 'light',
): ResolutionContext => ({
  scheme,
  band: 'compact',
  platform,
  window: { width: 390, height: 844 },
});

// docs/specs/emissor-native.md, seção 5.3 e R21 (D156): as nove linhas.
describe('emitFontFamily (R21, 5.3, D156)', () => {
  it.each([
    // genérica, plataforma, esperado
    ['sans', 'ios', 'System'],
    ['sans', 'android', 'Roboto'],
    ['sans', 'web', 'system-ui, sans-serif'],
    ['serif', 'ios', 'Georgia'],
    ['serif', 'android', 'serif'],
    ['serif', 'web', 'Georgia, serif'],
    ['mono', 'ios', 'Menlo'],
    ['mono', 'android', 'monospace'],
    ['mono', 'web', 'ui-monospace, monospace'],
  ] as const)('font-%s em %s', (family, platform, expected) => {
    expect(emitFontFamily(family, platform)).toBe(expected);
  });
});

// R16 e seção 5.4 (D154): fontWeight sempre string.
describe('emitFontWeight (R16, 5.4, D154)', () => {
  it.each([
    [400, '400'],
    [500, '500'],
    [700, '700'],
  ] as const)('%s vira a string %j', (weight, expected) => {
    const out = emitFontWeight(weight);
    expect(typeof out).toBe('string');
    expect(out).toBe(expected);
  });
});

// R20 e seção 5.1/5.4 (D157): tamanho final × value, a duas casas.
describe('emitLineHeight (R20, D157, D176)', () => {
  it.each([
    // nome, razão, tamanho recebido, esperado
    ['type-lg leading-normal (5.1)', 1.5, 18, 27],
    ['type-sm leading-tight (5.1)', 1.25, 14, 17.5],
    ['type-2xl leading=1.4 (5.4)', 1.4, 24, 33.6],
    ['leading-normal direto, tamanho 16 (D176)', 1.5, 16, 24],
    // tamanho recebido manda, não um tamanho fixo
    ['leading-normal com tamanho 20', 1.5, 20, 30],
    ['razão 1 devolve o tamanho', 1, 16, 16],
    // arredondamento a duas casas (D157), valores longe de meio-termo
    ['arredonda para baixo: 17 × 1.333 = 22.661', 1.333, 17, 22.66],
    ['arredonda para cima: 17 × 1.336 = 22.712', 1.336, 17, 22.71],
    ['13 × 1.4 = 18.2 sem ruído de ponto flutuante', 1.4, 13, 18.2],
    ['15 × 1.1 = 16.5 sem ruído de ponto flutuante', 1.1, 15, 16.5],
    ['11 × 1.37 = 15.07', 1.37, 11, 15.07],
    ['resultado inteiro sai sem decimais', 1.5, 14, 21],
    // razão e tamanho fracionários
    ['tamanho fracionário 12.5 × 1.5 = 18.75', 1.5, 12.5, 18.75],
  ] as const)('%s', (_name, value, fontSize, expected) => {
    expect(emitLineHeight(ratio(value), fontSize)).toBe(expected);
  });

  it('devolve número, não string', () => {
    expect(typeof emitLineHeight(ratio(1.4), 24)).toBe('number');
  });
});

// emissor-native.md, seções 5.1, 5.3 e 5.4: estilo completo de texto.
describe('emitTextStyle: seção 5.1 (R19, R20)', () => {
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
    // D176: look() direto, sem type-* nem herança, quem chama passa 16.
    [
      'leading-normal (look() direto)',
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

// R15 e seção 6: IR vazia dá {}, sem valor padrão acrescentado (D83).
describe('emitTextStyle: IR vazia (R15)', () => {
  it('{} vira {}', () => {
    expect(emitTextStyle({}, ctx(), 16)).toStrictEqual({});
  });

  it('o tamanho recebido sozinho não vira fontSize nem lineHeight', () => {
    expect(emitTextStyle({}, ctx(), 24)).toStrictEqual({});
  });
});

// Seção 5.3 e R21 (D156): as nove linhas como estilo completo.
describe('emitTextStyle: seção 5.3 (R21)', () => {
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
  ] as const)('%s em %s', (_look, family, platform, expected) => {
    expect(
      emitTextStyle({ fontFamily: family }, ctx(platform), 16),
    ).toStrictEqual({ fontFamily: expected });
  });
});

// Seção 5.4 (D154, D157) e R16.
describe('emitTextStyle: seção 5.4 (D154, D157)', () => {
  it.each([
    [400, '400'],
    [500, '500'],
    [700, '700'],
  ] as const)('fontWeight %s sai como a string %j', (weight, expected) => {
    expect(emitTextStyle({ fontWeight: weight }, ctx(), 16)).toStrictEqual({
      fontWeight: expected,
    });
  });

  it('type-2xl leading=1.4', () => {
    expect(
      emitTextStyle({ fontSize: 24, lineHeight: ratio(1.4) }, ctx(), 24),
    ).toStrictEqual({ fontSize: 24, lineHeight: 33.6 });
  });
});

// R22 (D115): a escala de fonte do sistema fica no padrão do React Native.
describe('emitTextStyle: escala de fonte (R22)', () => {
  it.each([
    ['ios', 'light'],
    ['android', 'dark'],
    ['web', 'light'],
  ] as const)(
    'sem allowFontScaling nem maxFontSizeMultiplier (%s, %s)',
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

// Tentar quebrar.
describe('emitTextStyle: bordas (R15, R20)', () => {
  it('lineHeight sem fontSize declarado usa o tamanho recebido e não cria fontSize', () => {
    expect(emitTextStyle({ lineHeight: ratio(1.5) }, ctx(), 20)).toStrictEqual({
      lineHeight: 30,
    });
  });

  it('arredonda a duas casas dentro do estilo completo (D157)', () => {
    expect(
      emitTextStyle({ fontSize: 17, lineHeight: ratio(1.333) }, ctx(), 17),
    ).toStrictEqual({ fontSize: 17, lineHeight: 22.66 });
  });

  it('não acrescenta propriedades que a IR não declarou (D83)', () => {
    expect(emitTextStyle({ fontWeight: 500 }, ctx(), 16)).toStrictEqual({
      fontWeight: '500',
    });
  });

  it('ignora propriedades que não são de cor nem de texto (R14, R15)', () => {
    expect(
      emitTextStyle({ paddingTop: 16, opacity: 0.5 }, ctx(), 16),
    ).toStrictEqual({});
  });
});
