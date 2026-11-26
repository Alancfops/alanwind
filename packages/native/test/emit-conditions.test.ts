import type {
  Condition,
  PropsMap,
  StyleMap,
  ThemedColor,
} from '@alanwind/core';
import { describe, expect, it } from 'vitest';
import type { InteractionStates, ResolutionContext } from '../src';
import { resolveLayers } from '../src/emit/conditions';

// Golden tests for docs/specs/emissor-native.md R7 to R13, R23 (section 5.2
// and 6) and docs/specs/sintaxe.md section 7.7. The IR is written by hand
// (funcionamento-interno.md section 5.4); expected values come from the spec.

// ---------- hand-written IR helpers ----------

const themed = (light: string, dark: string): ThemedColor => ({
  light: { rgb: light, alpha: 1 },
  dark: { rgb: dark, alpha: 1 },
});

const PRIMARY = themed('#2563EB', '#8AB4FF');
const PRIMARY_HOVER = themed('#1D4FD8', '#AFCBFF');
const RAISED = themed('#FFFFFF', '#2A2A30');
const SURFACE = themed('#FFFFFF', '#1E1E22');

const bg = (color: ThemedColor): StyleMap => ({ backgroundColor: color });
const pad = (n: number): StyleMap => ({
  paddingTop: n,
  paddingRight: n,
  paddingBottom: n,
  paddingLeft: n,
});

const HOVER: Condition = [{ kind: 'state', state: 'hover' }];
const PRESS: Condition = [{ kind: 'state', state: 'press' }];
const FOCUS: Condition = [{ kind: 'state', state: 'focus' }];
const DISABLED: Condition = [{ kind: 'state', state: 'disabled' }];
const MEDIUM: Condition = [{ kind: 'screen', from: 'medium', minWidth: 600 }];
const EXPANDED: Condition = [
  { kind: 'screen', from: 'expanded', minWidth: 840 },
];
const DARK: Condition = [{ kind: 'scheme', scheme: 'dark' }];
const LIGHT: Condition = [{ kind: 'scheme', scheme: 'light' }];
const IOS: Condition = [{ kind: 'platform', platform: 'ios' }];
const ANDROID: Condition = [{ kind: 'platform', platform: 'android' }];
const WEB: Condition = [{ kind: 'platform', platform: 'web' }];
const NATIVE: Condition = [{ kind: 'platform', platform: 'native' }];

type Layer<M> = { when: Condition; declarations: M };
const style = (...layers: Layer<StyleMap>[]) => ({
  style: { layers },
  props: { layers: [] as Layer<PropsMap>[] },
});
const both = (
  styleLayers: Layer<StyleMap>[],
  propsLayers: Layer<PropsMap>[],
) => ({
  style: { layers: styleLayers },
  props: { layers: propsLayers },
});

function bandOf(width: number): ResolutionContext['band'] {
  if (width >= 840) return 'expanded';
  if (width >= 600) return 'medium';
  return 'compact';
}

// Default context of the examples: compact, ios, 390 x 844, light.
const ctx = (over: Partial<ResolutionContext> = {}): ResolutionContext => ({
  scheme: 'light',
  band: 'compact',
  platform: 'ios',
  window: { width: 390, height: 844 },
  ...over,
});
const atWidth = (width: number, over: Partial<ResolutionContext> = {}) =>
  ctx({ band: bandOf(width), window: { width, height: 844 }, ...over });

const NONE: InteractionStates = {};

// ---------- emissor-native.md 5.2: layout and screen bands ----------

describe('5.2 faixas de tela (R9)', () => {
  const colMediumRow = style(
    { when: [], declarations: { flexDirection: 'column' } },
    { when: MEDIUM, declarations: { flexDirection: 'row' } },
  );
  it.each([
    [599, { flexDirection: 'column' }],
    [600, { flexDirection: 'row' }],
    [840, { flexDirection: 'row' }],
  ])('col medium(row) com largura %s', (width, expected) => {
    expect(resolveLayers(colMediumRow, atWidth(width), NONE)).toStrictEqual({
      style: expected,
      props: {},
    });
  });

  // `center-x` in a row/column medium: the core already produced the layers
  // (funcionamento-interno.md 5.5); the emitter only applies them.
  const centered = style(
    {
      when: [],
      declarations: { flexDirection: 'column', alignItems: 'center' },
    },
    {
      when: MEDIUM,
      declarations: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
      },
    },
  );
  it.each([
    [599, { flexDirection: 'column', alignItems: 'center' }],
    [
      700,
      {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
      },
    ],
  ])('col medium(row) center-x com largura %s', (width, expected) => {
    expect(resolveLayers(centered, atWidth(width), NONE).style).toStrictEqual(
      expected,
    );
  });

  const padX2Medium4 = style(
    { when: [], declarations: { paddingLeft: 8, paddingRight: 8 } },
    { when: MEDIUM, declarations: pad(16) },
  );
  it.each([
    ['compact', 390, { paddingLeft: 8, paddingRight: 8 }],
    ['medium', 700, pad(16)],
  ])('pad-x-2 medium(pad-4) em %s', (_band, width, expected) => {
    expect(
      resolveLayers(padX2Medium4, atWidth(width), NONE).style,
    ).toStrictEqual(expected);
  });

  it('usa o minWidth do átomo, não 600 fixo (R9)', () => {
    const custom = style({
      when: [{ kind: 'screen', from: 'medium', minWidth: 1000 }],
      declarations: { opacity: 0.5 },
    });
    expect(resolveLayers(custom, atWidth(700), NONE).style).toStrictEqual({});
    expect(resolveLayers(custom, atWidth(999), NONE).style).toStrictEqual({});
    expect(resolveLayers(custom, atWidth(1000), NONE).style).toStrictEqual({
      opacity: 0.5,
    });
  });

  it('usa window.width, não a band do contexto (R9)', () => {
    const ir = style({ when: MEDIUM, declarations: { opacity: 0.5 } });
    // band says compact, width says 700: R9 reads the width of the atom.
    const context = ctx({ band: 'compact', window: { width: 700, height: 1 } });
    expect(resolveLayers(ir, context, NONE).style).toStrictEqual({
      opacity: 0.5,
    });
  });

  it('medium também vale em expanded: largura 839 e 840 (R9, D37)', () => {
    const ir = style({ when: MEDIUM, declarations: { opacity: 0.5 } });
    expect(resolveLayers(ir, atWidth(839), NONE).style).toStrictEqual({
      opacity: 0.5,
    });
    expect(resolveLayers(ir, atWidth(840), NONE).style).toStrictEqual({
      opacity: 0.5,
    });
  });

  it('expanded não vale em 839 e vale em 840 (R9)', () => {
    const ir = style({ when: EXPANDED, declarations: { opacity: 0.5 } });
    expect(resolveLayers(ir, atWidth(839), NONE).style).toStrictEqual({});
    expect(resolveLayers(ir, atWidth(840), NONE).style).toStrictEqual({
      opacity: 0.5,
    });
  });

  it('largura 0 não vale nenhuma faixa (R9)', () => {
    const ir = style({ when: MEDIUM, declarations: { opacity: 0.5 } });
    expect(resolveLayers(ir, atWidth(0), NONE).style).toStrictEqual({});
  });
});

// ---------- emissor-native.md 5.2: interaction states ----------

describe('5.2 estados de interação (R10, R13)', () => {
  const stateIr = style(
    { when: [], declarations: bg(PRIMARY) },
    { when: HOVER, declarations: bg(RAISED) },
    { when: PRESS, declarations: bg(PRIMARY_HOVER) },
  );
  it.each([
    ['repouso', {}, bg(PRIMARY)],
    ['só press', { press: true }, bg(PRIMARY_HOVER)],
    ['só hover', { hover: true }, bg(RAISED)],
    [
      'hover e press (a posterior vence)',
      { hover: true, press: true },
      bg(PRIMARY_HOVER),
    ],
  ] as [string, InteractionStates, StyleMap][])(
    'bg-primary hover(bg-raised) press(bg-primary-hover): %s',
    (_name, states, expected) => {
      expect(resolveLayers(stateIr, ctx(), states).style).toStrictEqual(
        expected,
      );
    },
  );

  it('hover(bg-raised) escuro, press ativo e sem hover: {} (D110)', () => {
    const ir = style({ when: HOVER, declarations: bg(RAISED) });
    expect(
      resolveLayers(ir, ctx({ scheme: 'dark' }), { press: true }),
    ).toStrictEqual({ style: {}, props: {} });
  });

  it.each([
    ['ausente', {}],
    ['hover false', { hover: false }],
    ['hover undefined', { hover: undefined }],
    ['só press', { press: true }],
    ['só focus', { focus: true }],
    ['só disabled', { disabled: true }],
    ['press, focus e disabled', { press: true, focus: true, disabled: true }],
  ] as [string, InteractionStates][])('hover nunca vale: %s', (_n, states) => {
    const ir = style({ when: HOVER, declarations: { opacity: 0.5 } });
    expect(resolveLayers(ir, ctx(), states).style).toStrictEqual({});
  });

  it.each([
    ['hover', HOVER, { hover: true }],
    ['press', PRESS, { press: true }],
    ['focus', FOCUS, { focus: true }],
    ['disabled', DISABLED, { disabled: true }],
  ] as [string, Condition, InteractionStates][])(
    'estado %s vale só com o próprio estado ativo (R10)',
    (_n, when, active) => {
      const ir = style({ when, declarations: { opacity: 0.5 } });
      expect(resolveLayers(ir, ctx(), active).style).toStrictEqual({
        opacity: 0.5,
      });
      expect(resolveLayers(ir, ctx(), {}).style).toStrictEqual({});
      const everyOther: InteractionStates = {
        hover: true,
        press: true,
        focus: true,
        disabled: true,
        ...Object.fromEntries(Object.keys(active).map((k) => [k, false])),
      };
      expect(resolveLayers(ir, ctx(), everyOther).style).toStrictEqual({});
    },
  );

  it('disabled(opacity-50) com disabled ativo e inativo', () => {
    const ir = style({ when: DISABLED, declarations: { opacity: 0.5 } });
    expect(resolveLayers(ir, ctx(), { disabled: true })).toStrictEqual({
      style: { opacity: 0.5 },
      props: {},
    });
    expect(resolveLayers(ir, ctx(), { disabled: false })).toStrictEqual({
      style: {},
      props: {},
    });
  });

  it('estados não alteram plataforma nem esquema (E lógico, R11)', () => {
    const ir = style({
      when: [...HOVER, ...DARK],
      declarations: { opacity: 0.5 },
    });
    expect(resolveLayers(ir, ctx(), { hover: true }).style).toStrictEqual({});
    expect(resolveLayers(ir, ctx({ scheme: 'dark' }), {}).style).toStrictEqual(
      {},
    );
    expect(
      resolveLayers(ir, ctx({ scheme: 'dark' }), { hover: true }).style,
    ).toStrictEqual({ opacity: 0.5 });
  });
});

// ---------- emissor-native.md 5.2: platform and scheme ----------

describe('5.2 plataforma (R8)', () => {
  const iosPad6 = style({ when: IOS, declarations: pad(24) });
  it.each([
    ['android', {}],
    ['web', {}],
    ['ios', pad(24)],
  ] as [ResolutionContext['platform'], StyleMap][])(
    'ios(pad-6) em %s',
    (platform, expected) => {
      expect(resolveLayers(iosPad6, ctx({ platform }), NONE)).toStrictEqual({
        style: expected,
        props: {},
      });
    },
  );

  const nativePad4 = style({ when: NATIVE, declarations: pad(16) });
  it.each([
    ['ios', pad(16)],
    ['android', pad(16)],
    ['web', {}],
  ] as [ResolutionContext['platform'], StyleMap][])(
    'native(pad-4) em %s',
    (platform, expected) => {
      expect(
        resolveLayers(nativePad4, ctx({ platform }), NONE).style,
      ).toStrictEqual(expected);
    },
  );

  it.each([
    ['android', ANDROID, 'android', true],
    ['android', ANDROID, 'ios', false],
    ['web', WEB, 'web', true],
    ['web', WEB, 'ios', false],
    ['web', WEB, 'android', false],
  ] as [string, Condition, ResolutionContext['platform'], boolean][])(
    '%s(...) em %s: vale=%s',
    (_n, when, platform, applies) => {
      const ir = style({ when, declarations: { opacity: 0.5 } });
      expect(resolveLayers(ir, ctx({ platform }), NONE).style).toStrictEqual(
        applies ? { opacity: 0.5 } : {},
      );
    },
  );
});

describe('5.2 esquema (R7)', () => {
  const darkSurface = style({ when: DARK, declarations: bg(SURFACE) });
  it('dark(bg-surface) em claro: {}', () => {
    expect(resolveLayers(darkSurface, ctx(), NONE)).toStrictEqual({
      style: {},
      props: {},
    });
  });
  it('dark(bg-surface) em escuro', () => {
    expect(
      resolveLayers(darkSurface, ctx({ scheme: 'dark' }), NONE).style,
    ).toStrictEqual(bg(SURFACE));
  });
  it('light(...) vale só em claro', () => {
    const ir = style({ when: LIGHT, declarations: { opacity: 0.5 } });
    expect(resolveLayers(ir, ctx(), NONE).style).toStrictEqual({
      opacity: 0.5,
    });
    expect(
      resolveLayers(ir, ctx({ scheme: 'dark' }), NONE).style,
    ).toStrictEqual({});
  });
});

// ---------- emissor-native.md 5.2: precedence between layers ----------

describe('5.2 e sintaxe 7.7 precedência (R12, D117, D136)', () => {
  // expanded(bg-primary) hover(bg-raised) medium(bg-surface), after the core
  // ordered the layers (bigger band last, D136).
  const ordered = style(
    { when: HOVER, declarations: bg(RAISED) },
    { when: MEDIUM, declarations: bg(SURFACE) },
    { when: EXPANDED, declarations: bg(PRIMARY) },
  );
  it('largura 900 e hover: a faixa maior vence (bg-primary)', () => {
    expect(
      resolveLayers(ordered, atWidth(900), { hover: true }).style,
    ).toStrictEqual(bg(PRIMARY));
  });
  it('largura 700 e hover: medium vence hover (bg-surface)', () => {
    expect(
      resolveLayers(ordered, atWidth(700), { hover: true }).style,
    ).toStrictEqual(bg(SURFACE));
  });
  it('largura 390 e hover: bg-raised', () => {
    expect(
      resolveLayers(ordered, atWidth(390), { hover: true }).style,
    ).toStrictEqual(bg(RAISED));
  });

  it('ordem da lista decide: a posterior vence, sem reordenar (R12)', () => {
    const a = style(
      { when: PRESS, declarations: bg(PRIMARY_HOVER) },
      { when: HOVER, declarations: bg(RAISED) },
    );
    expect(
      resolveLayers(a, ctx(), { hover: true, press: true }).style,
    ).toStrictEqual(bg(RAISED));
    const b = style(
      { when: HOVER, declarations: bg(RAISED) },
      { when: PRESS, declarations: bg(PRIMARY_HOVER) },
    );
    expect(
      resolveLayers(b, ctx(), { hover: true, press: true }).style,
    ).toStrictEqual(bg(PRIMARY_HOVER));
  });

  it('bg-primary hover(bg-raised): nenhuma e hover (7.7)', () => {
    const ir = style(
      { when: [], declarations: bg(PRIMARY) },
      { when: HOVER, declarations: bg(RAISED) },
    );
    expect(resolveLayers(ir, ctx(), NONE).style).toStrictEqual(bg(PRIMARY));
    expect(resolveLayers(ir, ctx(), { hover: true }).style).toStrictEqual(
      bg(RAISED),
    );
  });

  it('dark(hover(bg-raised)) hover(bg-surface): dark+hover e só hover (7.7)', () => {
    const ir = style(
      { when: HOVER, declarations: bg(SURFACE) },
      { when: [...HOVER, ...DARK], declarations: bg(RAISED) },
    );
    expect(
      resolveLayers(ir, ctx({ scheme: 'dark' }), { hover: true }).style,
    ).toStrictEqual(bg(RAISED));
    expect(resolveLayers(ir, ctx(), { hover: true }).style).toStrictEqual(
      bg(SURFACE),
    );
  });

  it.each([
    ['expanded(pad-8) medium(pad-4) em 900', 900],
    ['medium(pad-4) expanded(pad-8) em 900', 900],
  ])('%s: pad-8 (7.7)', (_n, width) => {
    const ir = style(
      { when: MEDIUM, declarations: pad(16) },
      { when: EXPANDED, declarations: pad(32) },
    );
    expect(resolveLayers(ir, atWidth(width), NONE).style).toStrictEqual(
      pad(32),
    );
  });

  it('hover e press na ordem hover, press: primary-hover (7.7)', () => {
    const ir = style(
      { when: HOVER, declarations: bg(RAISED) },
      { when: PRESS, declarations: bg(PRIMARY_HOVER) },
    );
    expect(
      resolveLayers(ir, ctx(), { hover: true, press: true }).style,
    ).toStrictEqual(bg(PRIMARY_HOVER));
  });

  it('propriedade a propriedade: camada posterior só troca o que declara (R12)', () => {
    const ir = style(
      { when: [], declarations: { ...bg(PRIMARY), opacity: 1 } },
      { when: HOVER, declarations: { opacity: 0.5 } },
    );
    expect(resolveLayers(ir, ctx(), { hover: true }).style).toStrictEqual({
      backgroundColor: PRIMARY,
      opacity: 0.5,
    });
  });

  it('duas camadas com a mesma propriedade valendo juntas (secão 6)', () => {
    const ir = style(
      { when: [], declarations: { opacity: 1 } },
      { when: MEDIUM, declarations: { opacity: 0.8 } },
      { when: HOVER, declarations: { opacity: 0.4 } },
    );
    expect(
      resolveLayers(ir, atWidth(700), { hover: true }).style,
    ).toStrictEqual({ opacity: 0.4 });
  });

  it('camada que não vale não sobrescreve a anterior (R12)', () => {
    const ir = style(
      { when: [], declarations: { opacity: 1 } },
      { when: IOS, declarations: { opacity: 0.3 } },
    );
    expect(
      resolveLayers(ir, ctx({ platform: 'android' }), NONE).style,
    ).toStrictEqual({ opacity: 1 });
  });
});

// ---------- condition = AND of atoms (R11) ----------

describe('R11 condição é o E de todos os átomos', () => {
  const all: Condition = [
    { kind: 'platform', platform: 'ios' },
    { kind: 'scheme', scheme: 'dark' },
    { kind: 'screen', from: 'medium', minWidth: 600 },
    { kind: 'state', state: 'hover' },
  ];
  const ir = style({ when: all, declarations: { opacity: 0.5 } });
  const ok = atWidth(700, { scheme: 'dark', platform: 'ios' });

  it('todos valem: aplica', () => {
    expect(resolveLayers(ir, ok, { hover: true }).style).toStrictEqual({
      opacity: 0.5,
    });
  });
  it.each([
    [
      'plataforma falha',
      atWidth(700, { scheme: 'dark', platform: 'web' }),
      { hover: true },
    ],
    ['esquema falha', atWidth(700, { platform: 'ios' }), { hover: true }],
    [
      'faixa falha',
      atWidth(599, { scheme: 'dark', platform: 'ios' }),
      { hover: true },
    ],
    ['estado falha', ok, {}],
  ] as [string, ResolutionContext, InteractionStates][])(
    '%s: não aplica',
    (_n, context, states) => {
      expect(resolveLayers(ir, context, states).style).toStrictEqual({});
    },
  );

  it('condição vazia sempre vale, em qualquer contexto e estado', () => {
    const always = style({ when: [], declarations: { opacity: 0.5 } });
    for (const context of [
      ctx(),
      ctx({ scheme: 'dark', platform: 'web' }),
      atWidth(0),
      atWidth(5000, { platform: 'android' }),
    ]) {
      expect(resolveLayers(always, context, NONE).style).toStrictEqual({
        opacity: 0.5,
      });
    }
  });
});

// ---------- props (R12, R23) ----------

describe('5.2 props (R23)', () => {
  const lines = (n: number, when: Condition): Layer<PropsMap> => ({
    when,
    declarations: { numberOfLines: n },
  });
  const mediumLines2Lines4 = both([], [lines(4, []), lines(2, MEDIUM)]);
  it.each([
    [599, { numberOfLines: 4 }],
    [700, { numberOfLines: 2 }],
    [600, { numberOfLines: 2 }],
  ])('medium(lines-2) lines-4 com largura %s', (width, props) => {
    expect(
      resolveLayers(mediumLines2Lines4, atWidth(width), NONE),
    ).toStrictEqual({ style: {}, props });
  });

  it('lines-2: estilo {} e props { numberOfLines: 2 }', () => {
    expect(resolveLayers(both([], [lines(2, [])]), ctx(), NONE)).toStrictEqual({
      style: {},
      props: { numberOfLines: 2 },
    });
  });

  it('camadas de props e de estilo são independentes (R12)', () => {
    const ir = both(
      [{ when: HOVER, declarations: { opacity: 0.5 } }],
      [lines(3, [])],
    );
    expect(resolveLayers(ir, ctx(), NONE)).toStrictEqual({
      style: {},
      props: { numberOfLines: 3 },
    });
    expect(resolveLayers(ir, ctx(), { hover: true })).toStrictEqual({
      style: { opacity: 0.5 },
      props: { numberOfLines: 3 },
    });
  });

  it('props com estado: lines em hover só com o evento de hover (R10)', () => {
    const ir = both([], [lines(1, HOVER)]);
    expect(resolveLayers(ir, ctx(), { press: true }).props).toStrictEqual({});
    expect(resolveLayers(ir, ctx(), { hover: true }).props).toStrictEqual({
      numberOfLines: 1,
    });
  });

  it('props com plataforma e esquema', () => {
    const ir = both([], [lines(1, IOS), lines(2, DARK)]);
    expect(resolveLayers(ir, ctx(), NONE).props).toStrictEqual({
      numberOfLines: 1,
    });
    expect(
      resolveLayers(ir, ctx({ platform: 'web' }), NONE).props,
    ).toStrictEqual({});
    expect(
      resolveLayers(ir, ctx({ scheme: 'dark' }), NONE).props,
    ).toStrictEqual({ numberOfLines: 2 });
  });
});

// ---------- borda (empty / no layer) ----------

describe('R15, R23 sem camada que valha', () => {
  it('IR sem camadas: estilo {} e props {}', () => {
    expect(resolveLayers(both([], []), ctx(), NONE)).toStrictEqual({
      style: {},
      props: {},
    });
  });

  it('nenhuma camada vale: estilo {} e props {}', () => {
    const ir = both(
      [{ when: HOVER, declarations: { opacity: 0.5 } }],
      [{ when: DARK, declarations: { numberOfLines: 1 } }],
    );
    expect(resolveLayers(ir, ctx(), NONE)).toStrictEqual({
      style: {},
      props: {},
    });
  });

  it('camada com declarações vazias vale e não muda nada', () => {
    const ir = style({ when: [], declarations: {} });
    expect(resolveLayers(ir, ctx(), NONE)).toStrictEqual({
      style: {},
      props: {},
    });
  });

  it('não altera a IR de entrada nem devolve a mesma referência', () => {
    const first = { when: [], declarations: { opacity: 1 } as StyleMap };
    const second = { when: HOVER, declarations: { opacity: 0.5 } as StyleMap };
    const ir = style(first, second);
    const out = resolveLayers(ir, ctx(), { hover: true });
    expect(out.style).toStrictEqual({ opacity: 0.5 });
    expect(first.declarations).toStrictEqual({ opacity: 1 });
    expect(second.declarations).toStrictEqual({ opacity: 0.5 });
    expect(out.style).not.toBe(first.declarations);
    expect(out.style).not.toBe(second.declarations);
  });

  it('ios(...) em web: sem exceção e sem diagnóstico (seção 6)', () => {
    const ir = style({ when: IOS, declarations: pad(24) });
    expect(() =>
      resolveLayers(ir, ctx({ platform: 'web' }), NONE),
    ).not.toThrow();
    expect(
      Object.keys(resolveLayers(ir, ctx({ platform: 'web' }), NONE)).sort(),
    ).toStrictEqual(['props', 'style']);
  });
});
