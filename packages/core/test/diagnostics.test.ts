import { describe, expect, it } from 'vitest';
import type { Diagnostic } from '../src';
import type { DiagnosticCode } from '../src/diagnostics/catalog';
import { diagnosticCatalog } from '../src/diagnostics/catalog';
import {
  createDiagnostic,
  sortDiagnostics,
  suggestClosest,
} from '../src/diagnostics/diagnostics';

// Message text is outside the contract (R40): no test compares it.

const at = (start: number, end = start + 1) => ({ start, end });

const make = (code: DiagnosticCode, start: number, end = start + 1) =>
  createDiagnostic({ code, position: at(start, end) });

const codes = (list: readonly Diagnostic[]) => list.map((d) => d.code);

// docs/specs/sintaxe.md, section 6 (table), D144 (no AW303)
const SEVERITY_TABLE: ReadonlyArray<[DiagnosticCode, 'error' | 'warning']> = [
  ['AW001', 'error'],
  ['AW002', 'error'],
  ['AW003', 'error'],
  ['AW004', 'error'],
  ['AW005', 'error'],
  ['AW006', 'error'],
  ['AW007', 'error'],
  ['AW008', 'error'],
  ['AW009', 'error'],
  ['AW010', 'error'],
  ['AW101', 'error'],
  ['AW102', 'error'],
  ['AW103', 'error'],
  ['AW104', 'error'],
  ['AW107', 'error'],
  ['AW201', 'warning'],
  ['AW202', 'warning'],
  ['AW301', 'error'],
  ['AW302', 'error'],
  ['AW304', 'error'],
];

describe('catalog (sintaxe.md section 6)', () => {
  it('has exactly the phase 1 codes, no AW303 and nothing else (D144)', () => {
    expect(Object.keys(diagnosticCatalog).sort()).toStrictEqual(
      SEVERITY_TABLE.map(([code]) => code).sort(),
    );
  });

  it.each(['AW303', 'AW105', 'AW106', 'AW108', 'AW203', 'AW305', 'AW011'])(
    '%s is not in the catalog',
    (code) => {
      expect(Object.keys(diagnosticCatalog)).not.toContain(code);
    },
  );

  it.each(SEVERITY_TABLE)('%s has severity %s', (code, severity) => {
    expect(make(code, 0).severity).toBe(severity);
  });

  it('only AW201 and AW202 are warnings in the real catalog', () => {
    const warnings = (Object.keys(diagnosticCatalog) as DiagnosticCode[])
      .filter((code) => make(code, 0).severity === 'warning')
      .sort();
    expect(warnings).toStrictEqual(['AW201', 'AW202']);
  });
});

describe('createDiagnostic (R37, R40, R48)', () => {
  it.each(SEVERITY_TABLE)('%s carries a non-empty message', (code) => {
    const diagnostic = createDiagnostic({
      code,
      position: at(0, 3),
      args: ['a', 'b', 'c'],
    });
    expect(typeof diagnostic.message).toBe('string');
    expect(diagnostic.message.length).toBeGreaterThan(0);
  });

  it.each(SEVERITY_TABLE)('%s does not throw without args', (code) => {
    expect(() => createDiagnostic({ code, position: at(0) })).not.toThrow();
  });

  it('keeps code, severity and position; omits suggestion and origin', () => {
    const diagnostic = createDiagnostic({
      code: 'AW101',
      position: { start: 0, end: 6 },
      args: ['padd-4'],
    });
    expect(diagnostic).toStrictEqual({
      code: 'AW101',
      severity: 'error',
      message: expect.any(String),
      position: { start: 0, end: 6 },
    });
  });

  it('keeps the suggestion as given (R40: text replacing the span)', () => {
    const diagnostic = createDiagnostic({
      code: 'AW101',
      position: { start: 0, end: 6 },
      args: ['padd-4'],
      suggestion: 'pad-4',
    });
    expect(diagnostic).toStrictEqual({
      code: 'AW101',
      severity: 'error',
      message: expect.any(String),
      position: { start: 0, end: 6 },
      suggestion: 'pad-4',
    });
  });

  it('keeps the origin of an error inside a shortcut (R66, D135)', () => {
    const diagnostic = createDiagnostic({
      code: 'AW103',
      position: { start: 10, end: 14 },
      args: ['pad-17', 'pad'],
      origin: { shortcut: 'card', position: { start: 4, end: 10 } },
    });
    expect(diagnostic).toStrictEqual({
      code: 'AW103',
      severity: 'error',
      message: expect.any(String),
      position: { start: 10, end: 14 },
      origin: { shortcut: 'card', position: { start: 4, end: 10 } },
    });
  });

  it('derives severity from the code, never from the caller', () => {
    expect(make('AW201', 5).severity).toBe('warning');
    expect(make('AW001', 5).severity).toBe('error');
  });

  it('does not mutate the input', () => {
    const input = {
      code: 'AW001' as const,
      position: { start: 1, end: 2 },
      args: ['hover'],
    };
    const copy = structuredClone(input);
    createDiagnostic(input);
    expect(input).toStrictEqual(copy);
  });
});

// sintaxe.md R49 / funcionamento-interno.md R39, D144
describe('sortDiagnostics', () => {
  it('returns an empty list for an empty list', () => {
    expect(sortDiagnostics([])).toStrictEqual([]);
  });

  it('keeps a single item', () => {
    const only = make('AW101', 3);
    expect(sortDiagnostics([only])).toStrictEqual([only]);
  });

  it('orders by position.start ascending', () => {
    const out = sortDiagnostics([
      make('AW101', 20),
      make('AW103', 0),
      make('AW102', 7),
    ]);
    expect(out.map((d) => d.position.start)).toStrictEqual([0, 7, 20]);
    expect(codes(out)).toStrictEqual(['AW103', 'AW102', 'AW101']);
  });

  it('orders numerically, not as text (2 before 10)', () => {
    const out = sortDiagnostics([make('AW101', 10), make('AW101', 2)]);
    expect(out.map((d) => d.position.start)).toStrictEqual([2, 10]);
  });

  it.each([
    // same start: code ascending (D144)
    [
      ['AW202', 'AW201'],
      ['AW201', 'AW202'],
    ],
    [
      ['AW101', 'AW010'],
      ['AW010', 'AW101'],
    ],
    [
      ['AW304', 'AW001', 'AW201', 'AW101'],
      ['AW001', 'AW101', 'AW201', 'AW304'],
    ],
    [
      ['AW107', 'AW104', 'AW103'],
      ['AW103', 'AW104', 'AW107'],
    ],
    // numeric order inside the same hundred
    [
      ['AW010', 'AW009', 'AW002'],
      ['AW002', 'AW009', 'AW010'],
    ],
  ] as Array<[DiagnosticCode[], DiagnosticCode[]]>)(
    'same start, codes %j -> %j',
    (input, expected) => {
      const out = sortDiagnostics(input.map((c) => make(c, 4)));
      expect(codes(out)).toStrictEqual(expected);
    },
  );

  it('start wins over code', () => {
    const out = sortDiagnostics([make('AW001', 9), make('AW304', 1)]);
    expect(codes(out)).toStrictEqual(['AW304', 'AW001']);
  });

  it('sorts by start only, ignoring end', () => {
    const out = sortDiagnostics([make('AW101', 5, 6), make('AW102', 3, 100)]);
    expect(codes(out)).toStrictEqual(['AW102', 'AW101']);
  });

  it('keeps discovery order when start and code are equal (R39)', () => {
    const first = createDiagnostic({
      code: 'AW101',
      position: at(2, 4),
      suggestion: 'first',
    });
    const second = createDiagnostic({
      code: 'AW101',
      position: at(2, 9),
      suggestion: 'second',
    });
    const third = createDiagnostic({
      code: 'AW101',
      position: at(2, 6),
      suggestion: 'third',
    });
    expect(
      sortDiagnostics([first, second, third]).map((d) => d.suggestion),
    ).toStrictEqual(['first', 'second', 'third']);
  });

  it('does not mutate the input list', () => {
    const input = [make('AW101', 9), make('AW101', 1)];
    const snapshot = [...input];
    sortDiagnostics(input);
    expect(input).toStrictEqual(snapshot);
  });
});

// sintaxe.md R51, D127
describe('suggestClosest', () => {
  const classes = ['pad-4', 'pad-8', 'margin-4', 'round-4'];
  const variants = ['hover', 'focus', 'dark', 'medium', 'pressed'];
  const roles = ['primary', 'secondary', 'success', 'warning', 'danger'];

  it.each([
    // input, candidates, expected
    ['padd-4', classes, 'pad-4'],
    ['hoover', variants, 'hover'],
    ['bg-primry', ['bg-primary', 'bg-secondary', 'bg-danger'], 'bg-primary'],
    ['primry', roles, 'primary'],
    ['hovr', variants, 'hover'], // one deletion
    ['hoverrr', variants, 'hover'], // distance 2
  ])('%s -> %s', (input, candidates, expected) => {
    expect(suggestClosest(input, candidates)).toBe(expected);
  });

  it('bg-banana has no candidate within distance 2', () => {
    expect(
      suggestClosest('bg-banana', ['bg-primary', 'bg-secondary', 'bg-danger']),
    ).toBeUndefined();
  });

  it('distance 3 is out (hoverrrr vs hover)', () => {
    expect(suggestClosest('hoverrrr', variants)).toBeUndefined();
  });

  it('distance 2 is in (ab -> abcd)', () => {
    expect(suggestClosest('ab', ['abcd'])).toBe('abcd');
  });

  it('distance 3 is out (ab -> abcde)', () => {
    expect(suggestClosest('ab', ['abcde'])).toBeUndefined();
  });

  it('empty candidate list gives no suggestion', () => {
    expect(suggestClosest('padd-4', [])).toBeUndefined();
  });

  it('tie between two candidates: first in alphabetical order', () => {
    // both at distance 1 from "pad-4"
    expect(suggestClosest('pad-4', ['pad-5', 'pad-3'])).toBe('pad-3');
    expect(suggestClosest('pad-4', ['pad-3', 'pad-5'])).toBe('pad-3');
  });

  it('tie result does not depend on candidate order', () => {
    expect(suggestClosest('cat', ['cot', 'cut', 'cit'])).toBe('cit');
    expect(suggestClosest('cat', ['cit', 'cut', 'cot'])).toBe('cit');
  });

  it('the closest wins over alphabetical order', () => {
    // "pad-4x" is distance 1, "pad-xx" is distance 2
    expect(suggestClosest('pad-4', ['pad-4x', 'pad-xx'])).toBe('pad-4x');
    expect(suggestClosest('pad-4', ['pad-xx', 'pad-4x'])).toBe('pad-4x');
    // alphabetically first ("aad-xx", distance 2) loses to "pad-4y" (1)
    expect(suggestClosest('pad-4', ['aad-xx', 'pad-4y'])).toBe('pad-4y');
  });

  it('is case sensitive: Pad-4 -> pad-4 is distance 1 (AW101 example)', () => {
    expect(suggestClosest('Pad-4', ['pad-4'])).toBe('pad-4');
  });

  it('pad_4 -> pad-4 (AW101 example, one substitution)', () => {
    expect(suggestClosest('pad_4', ['pad-4', 'margin-4'])).toBe('pad-4');
  });

  it('does not mutate the candidate list', () => {
    const candidates = ['pad-5', 'pad-3'];
    suggestClosest('pad-4', candidates);
    expect(candidates).toStrictEqual(['pad-5', 'pad-3']);
  });

  it('empty input only matches candidates of length <= 2', () => {
    expect(suggestClosest('', ['ab'])).toBe('ab');
    expect(suggestClosest('', ['abc'])).toBeUndefined();
  });
});

// sintaxe.md R51, D185: Damerau-Levenshtein, optimal string alignment.
// Distances below were computed by hand.
describe('suggestClosest, transpositions (D185)', () => {
  const variants = ['hover', 'focus', 'dark', 'medium', 'pressed'];

  it.each([
    // input, candidates, expected, hand-computed distance
    ['hovre', variants, 'hover'], // swap r/e: 1
    ['ohver', variants, 'hover'], // swap o/h: 1
    ['ohvre', variants, 'hover'], // two swaps (oh, re): 2
    ['badc', ['abcd'], 'abcd'], // two swaps (ab, cd): 2
  ])('%s -> %s', (input, candidates, expected) => {
    expect(suggestClosest(input, candidates)).toBe(expected);
  });

  it('three swaps are distance 3, out of the limit', () => {
    // badcfe vs abcdef: swaps ab, cd, ef = 3
    expect(suggestClosest('badcfe', ['abcdef'])).toBeUndefined();
  });

  it('OSA, not unrestricted DL: ca -> abc is distance 3', () => {
    // OSA forbids editing a substring twice; unrestricted DL would give 2
    expect(suggestClosest('ca', ['abc'])).toBeUndefined();
  });

  it('a swap (1) ties with a substitution (1): alphabetical wins', () => {
    // abcd vs abdc: swap = 1; abcd vs abcx: substitution = 1
    expect(suggestClosest('abcd', ['abdc', 'abcx'])).toBe('abcx');
    expect(suggestClosest('abcd', ['abcx', 'abdc'])).toBe('abcx');
  });

  it('a swap tie resolves alphabetically when the swap one is first', () => {
    // abcd vs abdc: 1; abcd vs abcz: 1; "abcz" < "abdc"
    expect(suggestClosest('abcd', ['abdc', 'abcz'])).toBe('abcz');
    // abcd vs acbd: swap = 1; abcd vs abce: 1; "abce" < "acbd"
    expect(suggestClosest('abcd', ['acbd', 'abce'])).toBe('abce');
  });

  it('a swap (1) beats a closer-in-alphabet candidate at distance 2', () => {
    // hovre vs hover: 1; hovre vs gover: sub + swap = 2; "gover" < "hover"
    expect(suggestClosest('hovre', ['gover', 'hover'])).toBe('hover');
    expect(suggestClosest('hovre', ['hover', 'gover'])).toBe('hover');
  });
});

describe('suggestClosest, identical candidate (D185)', () => {
  it('only candidate identical to the input: no suggestion', () => {
    expect(suggestClosest('hover', ['hover'])).toBeUndefined();
  });

  it('identical plus a candidate beyond distance 2: no suggestion', () => {
    expect(suggestClosest('hover', ['hover', 'focus'])).toBeUndefined();
  });

  it('identical plus another within distance 2: the other', () => {
    expect(suggestClosest('hover', ['hover', 'hovers'])).toBe('hovers');
    expect(suggestClosest('hover', ['hovers', 'hover'])).toBe('hovers');
    // "cover" is alphabetically first among non-identical at distance 1
    expect(suggestClosest('hover', ['hover', 'cover', 'hovers'])).toBe('cover');
  });

  it('identical empty input and empty candidate: no suggestion', () => {
    expect(suggestClosest('', [''])).toBeUndefined();
    expect(suggestClosest('', ['', 'ab'])).toBe('ab');
  });
});
