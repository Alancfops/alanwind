import type { Color, ThemedColor } from '@alanwind/core';
import { describe, expect, it } from 'vitest';
import { emitColor, emitThemedColor } from '../src/emit/index';

const opaque = (rgb: string): Color => ({ rgb, alpha: 1 });

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
