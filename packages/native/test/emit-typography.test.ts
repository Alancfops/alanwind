import { describe, expect, it } from 'vitest';
import {
  emitFontFamily,
  emitFontWeight,
  emitLineHeight,
} from '../src/emit/index';

const ratio = (value: number) => ({ unit: 'ratio', value }) as const;

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
