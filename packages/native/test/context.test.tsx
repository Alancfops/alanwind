import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';
import { Dimensions, Platform, useColorScheme } from 'react-native';
import { setColorScheme as publicSetColorScheme } from '../src';
import {
  getSchemeChoice,
  setColorScheme,
  subscribeToSchemeChoice,
} from '../src/context/forced-scheme';
import {
  readResolutionContext,
  useResolutionContext,
} from '../src/context/resolution-context';
import { screenBandFor } from '../src/context/screen-band';

// docs/specs/emissor-native.md, secao 3.1 (R1 a R6) e secao 6.

type SystemScheme = 'light' | 'dark';
type Listener = (preferences: { colorScheme: SystemScheme }) => void;

// Controlled stand-in for the RN Appearance module. react-native's own
// useColorScheme imports it directly, so a property spy would not reach it.
const mockAppearance = {
  system: 'light' as SystemScheme | null,
  listeners: new Set<Listener>(),
  setColorScheme: jest.fn(),
};

jest.mock('react-native/Libraries/Utilities/Appearance', () => ({
  getColorScheme: () => mockAppearance.system,
  setColorScheme: (value: unknown) => mockAppearance.setColorScheme(value),
  addChangeListener: (listener: Listener) => {
    mockAppearance.listeners.add(listener);
    return { remove: () => mockAppearance.listeners.delete(listener) };
  },
}));

const appearanceSetSpy = mockAppearance.setColorScheme;

// @react-native/jest-preset replaces useColorScheme with a jest.fn that
// returns 'light'; an implementation built on it only sees a change after a
// re-render, so the helper drives both the module mock and that jest.fn.
const mockedUseColorScheme = useColorScheme as unknown as jest.Mock<
  () => SystemScheme | null
>;

async function setSystemScheme(next: SystemScheme): Promise<void> {
  mockAppearance.system = next;
  mockedUseColorScheme.mockReturnValue(next);
  await act(() => {
    for (const listener of [...mockAppearance.listeners]) {
      listener({ colorScheme: next });
    }
  });
}

async function setWindow(width: number, height: number): Promise<void> {
  await act(() => {
    Dimensions.set({
      window: { width, height, scale: 1, fontScale: 1 },
      screen: { width, height, scale: 1, fontScale: 1 },
    });
  });
}

async function forceScheme(choice: 'light' | 'dark' | 'system'): Promise<void> {
  await act(() => {
    setColorScheme(choice);
  });
}

function setPlatform(os: 'ios' | 'android' | 'web'): void {
  Object.defineProperty(Platform, 'OS', {
    configurable: true,
    get: () => os,
  });
}

const originalPlatform = Object.getOwnPropertyDescriptor(Platform, 'OS');

beforeEach(async () => {
  mockAppearance.system = 'light';
  mockedUseColorScheme.mockReturnValue('light');
  mockAppearance.listeners.clear();
  appearanceSetSpy.mockClear();
  setPlatform('ios');
  await setWindow(390, 844);
});

afterEach(() => {
  setColorScheme('system');
  if (originalPlatform) {
    Object.defineProperty(Platform, 'OS', originalPlatform);
  }
  jest.restoreAllMocks();
});

// R4 (D94): 599/600/839/840 -> compact/medium/medium/expanded. Limits 600/840.
describe('screenBandFor', () => {
  it.each([
    // width, expected
    [0, 'compact'],
    [320, 'compact'],
    [599, 'compact'],
    [599.9, 'compact'],
    [600, 'medium'],
    [700, 'medium'],
    [839, 'medium'],
    [839.9, 'medium'],
    [840, 'expanded'],
    [1024, 'expanded'],
    [5000, 'expanded'],
  ])('%s', (width, expected) => {
    expect(screenBandFor(width)).toBe(expected);
  });
});

// R2: sem setColorScheme, segue o sistema. R3 / tema.md C8: forcado e 'system'.
describe('scheme: system x setColorScheme', () => {
  it.each([
    // system, call,      expected
    ['light', undefined, 'light'],
    ['dark', undefined, 'dark'],
    ['light', 'light', 'light'],
    ['light', 'dark', 'dark'],
    ['dark', 'light', 'light'],
    ['dark', 'dark', 'dark'],
    ['light', 'system', 'light'],
    ['dark', 'system', 'dark'],
  ] as const)(
    'system %s, setColorScheme(%s) -> %s',
    (system, call, expected) => {
      mockAppearance.system = system;
      if (call) setColorScheme(call);
      expect(readResolutionContext().scheme).toBe(expected);
    },
  );

  it("'system' volta a seguir o sistema depois de forcar (R3)", () => {
    mockAppearance.system = 'light';
    setColorScheme('dark');
    expect(readResolutionContext().scheme).toBe('dark');
    setColorScheme('system');
    expect(readResolutionContext().scheme).toBe('light');
    mockAppearance.system = 'dark';
    expect(readResolutionContext().scheme).toBe('dark');
  });

  it('forcado continua forcado quando o sistema muda (R3)', async () => {
    setColorScheme('dark');
    const { result } = await renderHook(() => useResolutionContext());
    await setSystemScheme('dark');
    await setSystemScheme('light');
    expect(result.current.scheme).toBe('dark');
  });

  it('a API publica e a mesma funcao de estado (R3, sem Provider)', () => {
    publicSetColorScheme('dark');
    expect(readResolutionContext().scheme).toBe('dark');
    expect(getSchemeChoice()).toBe('dark');
    publicSetColorScheme('system');
    expect(getSchemeChoice()).toBe('system');
  });

  it('chamar duas vezes o mesmo valor e idempotente', () => {
    setColorScheme('dark');
    setColorScheme('dark');
    expect(readResolutionContext().scheme).toBe('dark');
    setColorScheme('system');
    setColorScheme('system');
    expect(readResolutionContext().scheme).toBe('light');
  });

  it('sistema sem esquema (null) cai em um esquema valido', () => {
    mockAppearance.system = null;
    expect(['light', 'dark']).toContain(readResolutionContext().scheme);
  });

  it('notifica quem assina a escolha', () => {
    const seen: string[] = [];
    const unsubscribe = subscribeToSchemeChoice(() => {
      seen.push(getSchemeChoice());
    });
    setColorScheme('dark');
    setColorScheme('system');
    unsubscribe();
    setColorScheme('light');
    expect(seen).toContain('dark');
    expect(seen).toContain('system');
    expect(seen).not.toContain('light');
  });
});

// R3 / D162: nunca chama Appearance.setColorScheme, em qualquer plataforma.
describe('setColorScheme nao usa Appearance (R3, D162)', () => {
  it.each([
    // platform, choice
    ['ios', 'light'],
    ['ios', 'dark'],
    ['ios', 'system'],
    ['android', 'light'],
    ['android', 'dark'],
    ['android', 'system'],
    ['web', 'light'],
    ['web', 'dark'],
    ['web', 'system'],
  ] as const)('%s, %s', (platform, choice) => {
    setPlatform(platform);
    mockAppearance.system = 'light';
    setColorScheme(choice);
    publicSetColorScheme(choice);
    expect(appearanceSetSpy).not.toHaveBeenCalled();
    expect(readResolutionContext().scheme).toBe(
      choice === 'system' ? 'light' : choice,
    );
  });
});

// R5: plataforma e Platform.OS (web incluida).
describe('platform (R5)', () => {
  it.each([['ios'], ['android'], ['web']] as const)('%s', (os) => {
    setPlatform(os);
    expect(readResolutionContext().platform).toBe(os);
  });

  it.each([['ios'], ['android'], ['web']] as const)('hook: %s', async (os) => {
    setPlatform(os);
    const { result } = await renderHook(() => useResolutionContext());
    expect(result.current.platform).toBe(os);
  });
});

// R1 e secao 5.4: janela 390 x 844 no contexto.
describe('window e band no contexto (R1, R4)', () => {
  it('janela 390 x 844 -> compact, ios, light', () => {
    expect(readResolutionContext()).toStrictEqual({
      scheme: 'light',
      band: 'compact',
      platform: 'ios',
      window: { width: 390, height: 844 },
    });
  });

  it.each([
    // width, height, band
    [599, 800, 'compact'],
    [600, 800, 'medium'],
    [839, 800, 'medium'],
    [840, 800, 'expanded'],
  ] as const)('largura %s, altura %s', async (width, height, band) => {
    await setWindow(width, height);
    const context = readResolutionContext();
    expect(context.band).toBe(band);
    expect(context.window).toStrictEqual({ width, height });
  });

  it('contexto completo: dark forcado, android, 700 x 1000', async () => {
    setPlatform('android');
    setColorScheme('dark');
    await setWindow(700, 1000);
    expect(readResolutionContext()).toStrictEqual({
      scheme: 'dark',
      band: 'medium',
      platform: 'android',
      window: { width: 700, height: 1000 },
    });
  });
});

// R40 / D158: instantaneo nao reage; hook reage (R6).
describe('instantaneo (R40)', () => {
  it('nao muda depois de lido', async () => {
    const before = readResolutionContext();
    setColorScheme('dark');
    await setWindow(900, 500);
    expect(before.scheme).toBe('light');
    expect(before.band).toBe('compact');
    expect(before.window).toStrictEqual({ width: 390, height: 844 });
    expect(readResolutionContext().scheme).toBe('dark');
    expect(readResolutionContext().band).toBe('expanded');
  });
});

describe('hook useResolutionContext (R2, R3, R6)', () => {
  it('entrega o contexto atual na primeira renderizacao', async () => {
    const { result } = await renderHook(() => useResolutionContext());
    expect(result.current).toStrictEqual({
      scheme: 'light',
      band: 'compact',
      platform: 'ios',
      window: { width: 390, height: 844 },
    });
  });

  it('acompanha o sistema claro -> escuro -> claro (R2)', async () => {
    // The jest preset mocks useColorScheme (no subscription), so the
    // re-render stands in for the notification RN would deliver.
    const { result, rerender } = await renderHook(() => useResolutionContext());
    await setSystemScheme('dark');
    await rerender({});
    expect(result.current.scheme).toBe('dark');
    await setSystemScheme('light');
    await rerender({});
    expect(result.current.scheme).toBe('light');
  });

  it('setColorScheme atualiza o componente ja montado (R3, C8)', async () => {
    const { result } = await renderHook(() => useResolutionContext());
    await forceScheme('dark');
    expect(result.current.scheme).toBe('dark');
    await forceScheme('light');
    expect(result.current.scheme).toBe('light');
    await setSystemScheme('dark');
    expect(result.current.scheme).toBe('light');
    await forceScheme('system');
    expect(result.current.scheme).toBe('dark');
  });

  it('dois componentes montados atualizam juntos, sem Provider', async () => {
    const a = await renderHook(() => useResolutionContext());
    const b = await renderHook(() => useResolutionContext());
    await forceScheme('dark');
    expect(a.result.current.scheme).toBe('dark');
    expect(b.result.current.scheme).toBe('dark');
  });

  it('janela muda de faixa: 700 -> 500 -> 900', async () => {
    await setWindow(700, 900);
    const { result } = await renderHook(() => useResolutionContext());
    expect(result.current.band).toBe('medium');
    await setWindow(500, 900);
    expect(result.current.band).toBe('compact');
    await setWindow(900, 900);
    expect(result.current.band).toBe('expanded');
  });

  it('janela exata muda mesmo dentro da faixa: 700 -> 800 (R6, R39)', async () => {
    await setWindow(700, 900);
    const { result } = await renderHook(() => useResolutionContext());
    await setWindow(800, 950);
    expect(result.current.band).toBe('medium');
    expect(result.current.window).toStrictEqual({ width: 800, height: 950 });
  });

  it('limites ao vivo: 599 -> 600 -> 839 -> 840', async () => {
    const { result } = await renderHook(() => useResolutionContext());
    await setWindow(599, 800);
    expect(result.current.band).toBe('compact');
    await setWindow(600, 800);
    expect(result.current.band).toBe('medium');
    await setWindow(839, 800);
    expect(result.current.band).toBe('medium');
    await setWindow(840, 800);
    expect(result.current.band).toBe('expanded');
  });

  it('depois de desmontar, mudancas nao quebram e nao deixam assinatura', async () => {
    const { unmount } = await renderHook(() => useResolutionContext());
    await unmount();
    expect(mockAppearance.listeners.size).toBe(0);
    await setSystemScheme('dark');
    await forceScheme('dark');
    await setWindow(900, 900);
  });
});
