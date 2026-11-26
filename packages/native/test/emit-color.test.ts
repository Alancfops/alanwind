import type { Color, ThemedColor } from '@alanwind/core';
import { describe, expect, it } from 'vitest';
import type { ResolutionContext } from '../src/context/types';
import { emitColor, emitTextStyle, emitThemedColor } from '../src/emit/index';

const opaque = (rgb: string): Color => ({ rgb, alpha: 1 });

const ctx = (scheme: ResolutionContext['scheme']): ResolutionContext => ({
  scheme,
  band: 'compact',
  platform: 'ios',
  window: { width: 390, height: 844 },
});

// emissor-native.md, seções 5.1 e 5.4 (R15, R17, D154): estilo completo.
describe('emitTextStyle: cor como estilo completo', () => {
  const surface: ThemedColor = {
    light: opaque('#FFFFFF'),
    dark: opaque('#1E1E22'),
  };
  const primary: ThemedColor = {
    light: opaque('#2563EB'),
    dark: opaque('#8AB4FF'),
  };
  const onWarning: ThemedColor = {
    light: opaque('#3B2A00'),
    dark: opaque('#3B2A00'),
  };
  const danger: ThemedColor = {
    light: opaque('#D02424'),
    dark: opaque('#FF8A80'),
  };
  const primary50: ThemedColor = {
    light: { rgb: '#2563EB', alpha: 0.5 },
    dark: { rgb: '#8AB4FF', alpha: 0.5 },
  };
  const rose50: Color = { rgb: '#E11D48', alpha: 0.5 };

  it.each([
    [
      'bg-surface',
      { backgroundColor: surface },
      'light',
      { backgroundColor: '#FFFFFF' },
    ],
    [
      'bg-surface',
      { backgroundColor: surface },
      'dark',
      { backgroundColor: '#1E1E22' },
    ],
    [
      'bg-primary',
      { backgroundColor: primary },
      'light',
      { backgroundColor: '#2563EB' },
    ],
    [
      'bg-primary',
      { backgroundColor: primary },
      'dark',
      { backgroundColor: '#8AB4FF' },
    ],
    ['text-on-warning', { color: onWarning }, 'light', { color: '#3B2A00' }],
    ['text-on-warning', { color: onWarning }, 'dark', { color: '#3B2A00' }],
    [
      'border-danger',
      { borderColor: danger },
      'light',
      { borderColor: '#D02424' },
    ],
    [
      'border-danger',
      { borderColor: danger },
      'dark',
      { borderColor: '#FF8A80' },
    ],
    [
      'bg-primary-50',
      { backgroundColor: primary50 },
      'light',
      { backgroundColor: 'rgba(37, 99, 235, 0.5)' },
    ],
    [
      'bg-primary-50',
      { backgroundColor: primary50 },
      'dark',
      { backgroundColor: 'rgba(138, 180, 255, 0.5)' },
    ],
    [
      'bg=#e11d48/50',
      { backgroundColor: { light: rose50, dark: rose50 } },
      'light',
      { backgroundColor: 'rgba(225, 29, 72, 0.5)' },
    ],
    [
      'bg=#e11d48/50',
      { backgroundColor: { light: rose50, dark: rose50 } },
      'dark',
      { backgroundColor: 'rgba(225, 29, 72, 0.5)' },
    ],
  ] as const)('%s (%s)', (_look, declarations, scheme, expected) => {
    expect(emitTextStyle(declarations, ctx(scheme), 16)).toStrictEqual(
      expected,
    );
  });

  it('bg + text + border juntos: cada um escolhe o esquema', () => {
    const declarations = {
      backgroundColor: primary,
      color: onWarning,
      borderColor: danger,
    };
    expect(emitTextStyle(declarations, ctx('dark'), 16)).toStrictEqual({
      backgroundColor: '#8AB4FF',
      color: '#3B2A00',
      borderColor: '#FF8A80',
    });
  });

  it('alfa < 1 só no claro: o escuro sai opaco e vice-versa', () => {
    const mixed: ThemedColor = {
      light: { rgb: '#FFFFFF', alpha: 0.5 },
      dark: opaque('#FFFFFF'),
    };
    expect(
      emitTextStyle({ backgroundColor: mixed }, ctx('light'), 16),
    ).toStrictEqual({ backgroundColor: 'rgba(255, 255, 255, 0.5)' });
    expect(
      emitTextStyle({ backgroundColor: mixed }, ctx('dark'), 16),
    ).toStrictEqual({ backgroundColor: '#FFFFFF' });
  });
});

// docs/specs/emissor-native.md, R17 e seção 5.1: cor opaca sai como '#RRGGBB'
// da IR, escolhida pelo esquema do contexto.
describe('emitThemedColor: cor opaca por esquema (R17, 5.1)', () => {
  const surface: ThemedColor = {
    light: opaque('#FFFFFF'),
    dark: opaque('#1E1E22'),
  };
  const primary: ThemedColor = {
    light: opaque('#2563EB'),
    dark: opaque('#8AB4FF'),
  };
  const onWarning: ThemedColor = {
    light: opaque('#3B2A00'),
    dark: opaque('#3B2A00'),
  };
  const danger: ThemedColor = {
    light: opaque('#D02424'),
    dark: opaque('#FF8A80'),
  };

  it.each([
    // nome, cor, esquema, esperado
    ['bg-surface', surface, 'light', '#FFFFFF'],
    ['bg-surface', surface, 'dark', '#1E1E22'],
    ['bg-primary', primary, 'light', '#2563EB'],
    ['bg-primary', primary, 'dark', '#8AB4FF'],
    ['text-on-warning', onWarning, 'light', '#3B2A00'],
    ['text-on-warning', onWarning, 'dark', '#3B2A00'],
    ['border-danger', danger, 'light', '#D02424'],
    ['border-danger', danger, 'dark', '#FF8A80'],
  ] as const)('%s no esquema %s', (_name, themed, scheme, expected) => {
    expect(emitThemedColor(themed, scheme)).toBe(expected);
  });
});

// R17 e seção 5.4 (D154): com alfa menor que 1, 'rgba(r, g, b, a)'.
describe('emitThemedColor: cor com alfa (R17, 5.4, D154)', () => {
  it('bg-primary-50 no claro vira rgba(37, 99, 235, 0.5)', () => {
    const themed: ThemedColor = {
      light: { rgb: '#2563EB', alpha: 0.5 },
      dark: { rgb: '#8AB4FF', alpha: 0.5 },
    };
    expect(emitThemedColor(themed, 'light')).toBe('rgba(37, 99, 235, 0.5)');
  });

  it('bg-primary-50 no escuro usa o canal escuro (138, 180, 255)', () => {
    const themed: ThemedColor = {
      light: { rgb: '#2563EB', alpha: 0.5 },
      dark: { rgb: '#8AB4FF', alpha: 0.5 },
    };
    expect(emitThemedColor(themed, 'dark')).toBe('rgba(138, 180, 255, 0.5)');
  });

  it.each([['light'], ['dark']] as const)(
    'bg=#e11d48/50 em qualquer esquema (%s)',
    (scheme) => {
      const same: Color = { rgb: '#E11D48', alpha: 0.5 };
      expect(emitThemedColor({ light: same, dark: same }, scheme)).toBe(
        'rgba(225, 29, 72, 0.5)',
      );
    },
  );

  it('claro e escuro com alfas diferentes: cada esquema usa o seu', () => {
    const themed: ThemedColor = {
      light: { rgb: '#000000', alpha: 0.08 },
      dark: { rgb: '#000000', alpha: 0.35 },
    };
    expect(emitThemedColor(themed, 'light')).toBe('rgba(0, 0, 0, 0.08)');
    expect(emitThemedColor(themed, 'dark')).toBe('rgba(0, 0, 0, 0.35)');
  });

  it('esquema claro com alfa 1 e escuro com alfa < 1 não se misturam', () => {
    const themed: ThemedColor = {
      light: { rgb: '#FFFFFF', alpha: 1 },
      dark: { rgb: '#FFFFFF', alpha: 0.5 },
    };
    expect(emitThemedColor(themed, 'light')).toBe('#FFFFFF');
    expect(emitThemedColor(themed, 'dark')).toBe('rgba(255, 255, 255, 0.5)');
  });
});

// R17 (conversão exportada para a 043 usar na sombra, R18, D155).
describe('emitColor (R17)', () => {
  it.each([
    // rgb, alfa, esperado
    ['#2563EB', 1, '#2563EB'],
    ['#000000', 1, '#000000'],
    ['#FFFFFF', 1, '#FFFFFF'],
    ['#2563EB', 0.5, 'rgba(37, 99, 235, 0.5)'],
    ['#000000', 0.08, 'rgba(0, 0, 0, 0.08)'],
    ['#000000', 0.06, 'rgba(0, 0, 0, 0.06)'],
    ['#000000', 0.35, 'rgba(0, 0, 0, 0.35)'],
    ['#E11D48', 0.5, 'rgba(225, 29, 72, 0.5)'],
    ['#FFFFFF', 0.25, 'rgba(255, 255, 255, 0.25)'],
    // limites: o menor e o maior valor de canal, e alfa quase 1 / quase 0
    ['#000000', 0.99, 'rgba(0, 0, 0, 0.99)'],
    ['#FFFFFF', 0.01, 'rgba(255, 255, 255, 0.01)'],
    // canais com zero à esquerda no hex: 0x0A = 10, 0x01 = 1
    ['#0A0101', 0.5, 'rgba(10, 1, 1, 0.5)'],
    // alfa 0 é menor que 1: vira rgba, não o hex
    ['#2563EB', 0, 'rgba(37, 99, 235, 0)'],
  ] as const)('%s com alfa %s', (rgb, alpha, expected) => {
    expect(emitColor({ rgb, alpha })).toBe(expected);
  });

  it('alfa 1 devolve o rgb exatamente como veio da IR', () => {
    expect(emitColor({ rgb: '#AbCdEf', alpha: 1 })).toBe('#AbCdEf');
  });

  it('o alfa sai como o número, sem zeros a mais (0.5, não 0.50)', () => {
    expect(emitColor({ rgb: '#102030', alpha: 0.5 })).toBe(
      'rgba(16, 32, 48, 0.5)',
    );
  });
});
