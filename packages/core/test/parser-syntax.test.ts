import { describe, expect, it } from 'vitest';
import type { Diagnostic } from '../src';
import { sortDiagnostics } from '../src/diagnostics/diagnostics';
import { parseLook } from '../src/parser/parse-look';
import type { FreeValue, SyntaxItem } from '../src/parser/syntax-tree';

// Expected values are written by hand from docs/specs/sintaxe.md (sections
// 3, 4.1, 6, 7, 7.6 and 8) and task 020. Message text is outside the contract
// (R40): no test compares it.

// ---------- helpers ----------

const pos = (start: number, end: number) => ({ start, end });

const cls = (name: string, start: number, end: number): SyntaxItem => ({
  kind: 'class',
  name,
  position: pos(start, end),
});

const free = (
  family: string,
  value: FreeValue,
  start: number,
  end: number,
): SyntaxItem => ({ kind: 'free', family, value, position: pos(start, end) });

const num = (value: number, percent = false): FreeValue => ({
  kind: 'number',
  value,
  percent,
});

const color = (hex: string, opacity?: number): FreeValue =>
  opacity === undefined
    ? { kind: 'color', hex }
    : { kind: 'color', hex, opacity };

const variant = (
  name: string,
  items: SyntaxItem[],
  start: number,
  end: number,
): SyntaxItem => ({ kind: 'variant', name, items, position: pos(start, end) });

// `opacity?: undefined` and a missing key are the same thing for the spec.
const plain = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const label = (d: Diagnostic) =>
  `${d.code}[${d.position.start},${d.position.end})`;

const diagnosticsOf = (look: string) =>
  sortDiagnostics(parseLook(look).diagnostics).map(label);

const itemsOf = (look: string) => plain(parseLook(look).items);

const SYNTAX_CODES = new Set([
  'AW001',
  'AW002',
  'AW003',
  'AW006',
  'AW007',
  'AW008',
  'AW010',
]);

/** Every position of the tree, parents before children. */
const allPositions = (
  items: readonly SyntaxItem[],
): Diagnostic['position'][] => {
  // Iterative: the helper itself must not overflow the stack on deep trees.
  const out: Diagnostic['position'][] = [];
  const pending = [...items];
  for (let item = pending.pop(); item; item = pending.pop()) {
    out.push(item.position);
    if (item.kind === 'variant') pending.push(...item.items);
  }
  return out;
};

function expectSane(look: string): void {
  const result = parseLook(look);
  const spans = [
    ...result.diagnostics.map((d) => d.position),
    ...allPositions(result.items),
  ];
  for (const { start, end } of spans) {
    expect(start).toBeGreaterThanOrEqual(0);
    expect(start).toBeLessThanOrEqual(end);
    expect(end).toBeLessThanOrEqual(look.length);
  }
}

// ---------- valid input (section 7, R3, R4, R17, R18, R54) ----------

describe('valid looks: tree and positions', () => {
  it.each<[string, SyntaxItem[]]>([
    // section 7.1
    ['pad-4', [cls('pad-4', 0, 5)]],
    [
      'row center gap-4 pad-4',
      [
        cls('row', 0, 3),
        cls('center', 4, 10),
        cls('gap-4', 11, 16),
        cls('pad-4', 17, 22),
      ],
    ],
    ['margin-top-auto', [cls('margin-top-auto', 0, 15)]],
    // section 7.3: variants, D86
    [
      'hover(bg-raised shadow-md)',
      [
        variant(
          'hover',
          [cls('bg-raised', 6, 15), cls('shadow-md', 16, 25)],
          0,
          26,
        ),
      ],
    ],
    // R3: spaces inside the parentheses are ignored
    [
      'hover(  bg-raised  )',
      [variant('hover', [cls('bg-raised', 8, 17)], 0, 20)],
    ],
    [
      'dark(hover(bg-raised))',
      [
        variant(
          'dark',
          [variant('hover', [cls('bg-raised', 11, 20)], 5, 21)],
          0,
          22,
        ),
      ],
    ],
    [
      'col medium(pad-x-4 hover(bg-raised))',
      [
        cls('col', 0, 3),
        variant(
          'medium',
          [
            cls('pad-x-4', 11, 18),
            variant('hover', [cls('bg-raised', 25, 34)], 19, 35),
          ],
          4,
          36,
        ),
      ],
    ],
    // unknown variant names are not a parser concern (task 020, scope)
    ['hoover(pad-2)', [variant('hoover', [cls('pad-2', 7, 12)], 0, 13)]],
    // several variants side by side
    [
      'ios(pad-6) android(pad-4)',
      [
        variant('ios', [cls('pad-6', 4, 9)], 0, 10),
        variant('android', [cls('pad-4', 19, 24)], 11, 25),
      ],
    ],
    // R3: tab, newline and carriage return separate items
    ['row\tcol', [cls('row', 0, 3), cls('col', 4, 7)]],
    ['row\ncol', [cls('row', 0, 3), cls('col', 4, 7)]],
    ['row\r\ncol', [cls('row', 0, 3), cls('col', 5, 8)]],
    ['row \t\n\r  col', [cls('row', 0, 3), cls('col', 9, 12)]],
    ['  \t pad-4 \n ', [cls('pad-4', 4, 9)]],
    [
      'hover(\n\tbg-raised\r\n)',
      [variant('hover', [cls('bg-raised', 8, 17)], 0, 20)],
    ],
    // R2/D127: case is kept so the vocabulary can report AW101
    ['Pad-4', [cls('Pad-4', 0, 5)]],
  ])('%j', (look, items) => {
    const result = parseLook(look);
    expect(plain(result.items)).toStrictEqual(items);
    expect(result.diagnostics).toStrictEqual([]);
  });
});

describe('valid free values (R17, R18, R22, R54, section 7.2)', () => {
  it.each<[string, SyntaxItem[]]>([
    ['w=137', [free('w', num(137), 0, 5)]],
    ['w=50%', [free('w', num(50, true), 0, 5)]],
    ['w=10.5', [free('w', num(10.5), 0, 6)]],
    ['w=0.5', [free('w', num(0.5), 0, 5)]], // R54
    ['leading=1.4', [free('leading', num(1.4), 0, 11)]],
    ['pad=10', [free('pad', num(10), 0, 6)]],
    ['pad-x=10', [free('pad-x', num(10), 0, 8)]],
    ['gap-x=6', [free('gap-x', num(6), 0, 7)]],
    ['border=3', [free('border', num(3), 0, 8)]],
    ['margin-top=-8', [free('margin-top', num(-8), 0, 13)]],
    ['w=-8.5%', [free('w', num(-8.5, true), 0, 7)]],
    ['bg=#e11d48', [free('bg', color('#e11d48'), 0, 10)]],
    ['bg=#e11d48/50', [free('bg', color('#e11d48', 50), 0, 13)]],
    ['bg=#fff', [free('bg', color('#fff'), 0, 7)]],
    ['bg=#e11d4880', [free('bg', color('#e11d4880'), 0, 12)]],
    ['bg=#E11D48', [free('bg', color('#E11D48'), 0, 10)]], // D127: case-free
    ['bg=#fff/0', [free('bg', color('#fff', 0), 0, 9)]],
    ['bg=#fff/100', [free('bg', color('#fff', 100), 0, 11)]],
    ['text=#abc/25', [free('text', color('#abc', 25), 0, 12)]],
    ['border=#0f0', [free('border', color('#0f0'), 0, 11)]],
    [
      'w=137 h=50%',
      [free('w', num(137), 0, 5), free('h', num(50, true), 6, 11)],
    ],
    [
      'dark(bg=#e11d48)',
      [variant('dark', [free('bg', color('#e11d48'), 5, 15)], 0, 16)],
    ],
    // lexically valid, decided later by the family (task 020, "Não faz")
    ['weight=600', [free('weight', num(600), 0, 10)]], // AW009 is the vocabulary
    ['w=-5', [free('w', num(-5), 0, 4)]], // AW008 negative: family decides
  ])('%s', (look, items) => {
    const result = parseLook(look);
    expect(plain(result.items)).toStrictEqual(items);
    expect(result.diagnostics).toStrictEqual([]);
  });

  // The opacity scale and the 8-digit rule depend on the family (task 020).
  it.each(['bg=#e11d48/30', 'bg=#e11d4880/50'])(
    '%s is not a parser error',
    (look) => {
      const result = parseLook(look);
      expect(result.diagnostics).toStrictEqual([]);
      expect(result.items).toHaveLength(1);
      expect(result.items[0]?.kind).toBe('free');
    },
  );
});

describe('empty input (R4)', () => {
  it.each(['', ' ', '   ', '\t', '\n', '\r', ' \t\n\r ', '\r\n\r\n'])(
    '%j',
    (look) => {
      expect(parseLook(look)).toStrictEqual({ items: [], diagnostics: [] });
    },
  );
});

// ---------- syntax errors (section 7.6, section 8, R50) ----------

describe('syntax errors: code, position and surviving items', () => {
  it.each<[string, string[], SyntaxItem[]]>([
    // AW001: from the outermost open variant to the end of the look (R50)
    ['pad-4 hover(bg-raised', ['AW001[6,21)'], [cls('pad-4', 0, 5)]],
    ['hover(', ['AW001[0,6)'], []],
    [
      'pad-4 hover(bg-raised dark(pad-2)',
      ['AW001[6,33)'],
      [cls('pad-4', 0, 5)],
    ],
    ['hover(dark(pad-2', ['AW001[0,16)'], []],
    ['pad-4 hover(dark(medium(x', ['AW001[6,25)'], [cls('pad-4', 0, 5)]],
    ['hover( ', ['AW001[0,7)'], []], // up to the end, trailing space included
    ['row hover(a b', ['AW001[4,13)'], [cls('row', 0, 3)]],
    // AW002: only the `)` (R50)
    [
      'pad-4 bg-raised)',
      ['AW002[15,16)'],
      [cls('pad-4', 0, 5), cls('bg-raised', 6, 15)],
    ],
    [
      'hover(pad-2))',
      ['AW002[12,13)'],
      [variant('hover', [cls('pad-2', 6, 11)], 0, 12)],
    ],
    [')', ['AW002[0,1)'], []],
    ['))', ['AW002[0,1)', 'AW002[1,2)'], []],
    [') )', ['AW002[0,1)', 'AW002[2,3)'], []],
    [
      'pad-4 hover(bg-raised) )',
      ['AW002[23,24)'],
      [cls('pad-4', 0, 5), variant('hover', [cls('bg-raised', 12, 21)], 6, 22)],
    ],
    // AW003: the whole variant is discarded (R50)
    ['hover()', ['AW003[0,7)'], []],
    ['hover(  )', ['AW003[0,9)'], []],
    ['hover(\n\t)', ['AW003[0,9)'], []],
    [
      'pad-4 hover() row',
      ['AW003[6,13)'],
      [cls('pad-4', 0, 5), cls('row', 14, 17)],
    ],
    // AW006: colon form, whole token discarded
    ['hover:bg-raised', ['AW006[0,15)'], []],
    [
      'pad-4 hover:bg-raised row',
      ['AW006[6,21)'],
      [cls('pad-4', 0, 5), cls('row', 22, 25)],
    ],
    // AW007: malformed free value
    ['w=', ['AW007[0,2)'], []],
    ['=50', ['AW007[0,3)'], []],
    ['w==5', ['AW007[0,4)'], []],
    // AW008: lexical part of the free value (R18, R54, D118)
    ['w=10rem', ['AW008[0,7)'], []],
    ['w=10em', ['AW008[0,6)'], []],
    ['w=10vw', ['AW008[0,6)'], []],
    ['w=10vh', ['AW008[0,6)'], []],
    ['w=abc', ['AW008[0,5)'], []],
    ['bg=#12', ['AW008[0,6)'], []],
    ['bg=#1234', ['AW008[0,8)'], []],
    ['bg=#12345', ['AW008[0,9)'], []],
    ['bg=#1234567', ['AW008[0,11)'], []],
    ['bg=#123456789', ['AW008[0,13)'], []],
    ['w=10,5', ['AW008[0,6)'], []],
    ['w=.5', ['AW008[0,4)'], []],
    ['bg=red-40', ['AW008[0,9)'], []],
    // AW010: glued item after `)`; both items stay (R65)
    [
      'hover(bg-raised)pad-4',
      ['AW010[16,21)'],
      [
        variant('hover', [cls('bg-raised', 6, 15)], 0, 16),
        cls('pad-4', 16, 21),
      ],
    ],
    [
      'hover(a)hover(b)pad-4',
      ['AW010[8,16)', 'AW010[16,21)'],
      [
        variant('hover', [cls('a', 6, 7)], 0, 8),
        variant('hover', [cls('b', 14, 15)], 8, 16),
        cls('pad-4', 16, 21),
      ],
    ],
    [
      'dark(hover(a)b)',
      ['AW010[13,14)'],
      [
        variant(
          'dark',
          [variant('hover', [cls('a', 11, 12)], 5, 13), cls('b', 13, 14)],
          0,
          15,
        ),
      ],
    ],
    // several independent errors in one look: each one is reported
    ['hover()) hover(', ['AW003[0,7)', 'AW002[7,8)', 'AW001[9,15)'], []],
    ['w= =50', ['AW007[0,2)', 'AW007[3,6)'], []],
    [
      'foo w=10rem bar',
      ['AW008[4,11)'],
      [cls('foo', 0, 3), cls('bar', 12, 15)],
    ],
    // R50: inside a variant only the bad token goes; the rest stays
    [
      'hover(w= pad-2)',
      ['AW007[6,8)'],
      [variant('hover', [cls('pad-2', 9, 14)], 0, 15)],
    ],
    [
      'pad-4 hover(w=10rem pad-2) row',
      ['AW008[12,19)'],
      [
        cls('pad-4', 0, 5),
        variant('hover', [cls('pad-2', 20, 25)], 6, 26),
        cls('row', 27, 30),
      ],
    ],
    [
      'dark(hover:bg-raised pad-2)',
      ['AW006[5,20)'],
      [variant('dark', [cls('pad-2', 21, 26)], 0, 27)],
    ],
    // ---- D188 edge cases (sintaxe.md, "Regras dos diagnósticos") ----
    // (2) glued variant: AW010 covers the whole variant
    [
      'hover(a)hover(b)',
      ['AW010[8,16)'],
      [
        variant('hover', [cls('a', 6, 7)], 0, 8),
        variant('hover', [cls('b', 14, 15)], 8, 16),
      ],
    ],
    // (3) colon form with a free value; `:` inside a free value
    ['hover:w=5', ['AW006[0,9)'], []],
    ['hover:w=a:b', ['AW006[0,11)'], []], // D188: one single AW006
    ['w=a:b', ['AW008[0,5)'], []],
    // (4) a variant without a name is a parser item (AW004 is task 028)
    ['(x)', [], [variant('', [cls('x', 1, 2)], 0, 3)]],
    ['hover:(x)', ['AW006[0,9)'], []],
    // (10) colon form glued to a variant: the whole span goes
    ['hover:dark(bg-x)', ['AW006[0,16)'], []],
    // (5) emptied by an inner error: only the inner error
    ['dark(hover())', ['AW003[5,12)'], []],
    // (6) unclosed variant: only AW001, the discarded span is not evaluated
    ['hover(w=10rem', ['AW001[0,13)'], []],
    // (11) no AW010 glued to a discarded variant
    ['hover()x', ['AW003[0,7)'], [cls('x', 7, 8)]],
    [
      'hover(a)dark(b',
      ['AW001[8,14)'],
      [variant('hover', [cls('a', 6, 7)], 0, 8)],
    ],
    // (8) malformed numbers, hex in a size family
    ['w=10.', ['AW008[0,5)'], []],
    ['w=1.2.3', ['AW008[0,7)'], []],
    ['w=5%%', ['AW008[0,5)'], []],
    ['w=#ggg', ['AW008[0,6)'], []],
    ['w=#fff', ['AW008[0,6)'], []],
    // (12) leading zero in the opacity
    ['bg=#FFF/050', ['AW008[0,11)'], []],
    // (13) not a finite number: `w=` followed by 1000 digits
    [`w=${'9'.repeat(1000)}`, ['AW008[0,1002)'], []],
    // (8) lone `=`
    ['=', ['AW007[0,1)'], []],
  ])('%j', (look, diagnostics, items) => {
    expect(diagnosticsOf(look)).toStrictEqual(diagnostics);
    expect(itemsOf(look)).toStrictEqual(items);
  });

  // D188 (9): suggestion text per code. Whole item for AW006/AW008 (same
  // pattern as AW006 in 7.6); `undefined` means "no suggestion".
  it.each<[string, string, string | undefined]>([
    ['hover:bg-raised', 'AW006', 'hover(bg-raised)'],
    ['hover:w=5', 'AW006', 'hover(w=5)'],
    ['hover:w=a:b', 'AW006', 'hover(w=a:b)'],
    ['hover(dark(pad-2', 'AW001', 'hover(dark(pad-2))'],
    ['pad-4 hover(dark(medium(x', 'AW001', 'hover(dark(medium(x)))'],
    ['hover:(x)', 'AW006', 'hover(x)'],
    ['hover:dark(bg-x)', 'AW006', 'hover(dark(bg-x))'],
    ['hover(bg-raised)pad-4', 'AW010', ' pad-4'],
    ['hover(a)hover(b)', 'AW010', ' hover(b)'],
    ['hover(', 'AW001', 'hover()'],
    ['pad-4 hover(bg-raised', 'AW001', 'hover(bg-raised)'],
    [')', 'AW002', ''],
    ['hover(pad-2))', 'AW002', ''],
    ['hover()', 'AW003', undefined],
    ['w=10,5', 'AW008', 'w=10.5'],
    ['w=.5', 'AW008', 'w=0.5'],
    ['w=10rem', 'AW008', undefined],
    ['w=abc', 'AW008', undefined],
    ['w=10.', 'AW008', undefined],
    ['w=1.2.3', 'AW008', undefined],
    ['w=#fff', 'AW008', undefined],
    ['bg=red-40', 'AW008', undefined],
  ])('suggestion of %j (%s)', (look, code, suggestion) => {
    const found = parseLook(look).diagnostics.filter((x) => x.code === code);
    expect(found).toHaveLength(1);
    expect(found[0]?.suggestion).toBe(suggestion);
  });

  // D188 (11): nothing glued to a discarded variant raises AW010
  it.each(['hover()x', 'hover(a)dark(b', 'hover(a)hover()', 'x()y'])(
    'no AW010: %j',
    (look) => {
      expect(parseLook(look).diagnostics.map((d) => d.code)).not.toContain(
        'AW010',
      );
    },
  );

  it('AW006 suggests the variant form (7.6, R7)', () => {
    const [d] = parseLook('hover:bg-raised').diagnostics;
    expect(d?.code).toBe('AW006');
    expect(d?.suggestion).toBe('hover(bg-raised)');
  });

  it('AW006 inside a variant suggests the variant form', () => {
    const d = parseLook('dark(hover:bg-raised pad-2)').diagnostics.find(
      (x) => x.code === 'AW006',
    );
    expect(d?.suggestion).toBe('hover(bg-raised)');
  });

  it('AW010 suggests inserting a space before the glued item (R65)', () => {
    const [d] = parseLook('hover(bg-raised)pad-4').diagnostics;
    expect(d?.code).toBe('AW010');
    // D188 (1): the text replaces the span `pad-4` with a leading space.
    expect(d?.suggestion).toBe(' pad-4');
  });

  it('syntax errors are errors, not warnings (section 6)', () => {
    for (const look of [
      'hover(',
      ')',
      'hover()',
      'hover:a',
      'w=',
      'w=10rem',
      'hover(a)b',
    ]) {
      const [d] = parseLook(look).diagnostics;
      expect(d?.severity).toBe('error');
    }
  });

  it('AW001 always reaches the end of the look (R50)', () => {
    for (const look of ['hover(', 'a hover(b c', 'x(y(z(', 'hover(a)  b(  ']) {
      const d = parseLook(look).diagnostics.find((x) => x.code === 'AW001');
      expect(d?.position.end).toBe(look.length);
    }
  });

  it('AW002 covers exactly one `)` (R50)', () => {
    for (const look of [')', 'a)', 'a))b)', 'hover(a)) )']) {
      for (const d of parseLook(look).diagnostics) {
        if (d.code !== 'AW002') continue;
        expect(d.position.end - d.position.start).toBe(1);
        expect(look[d.position.start]).toBe(')');
      }
    }
  });

  // Section 8: several open variants give one single AW001, the outermost.
  it.each(['hover(dark(x', 'a(b(c(d', 'a(b(c) d(e'])(
    'one single AW001: %j',
    (look) => {
      const codes = parseLook(look).diagnostics.map((d) => d.code);
      expect(codes.filter((c) => c === 'AW001')).toHaveLength(1);
    },
  );
});

describe('whitespace between items does not raise AW010 (R3, R65)', () => {
  it.each([
    'hover(a) b',
    'hover(a)  b',
    'hover(a)\tb',
    'hover(a)\nb',
    'hover(a)\r\nb',
  ])('%j', (look) => {
    expect(parseLook(look).diagnostics).toStrictEqual([]);
    expect(parseLook(look).items).toHaveLength(2);
  });
});

// ---------- characters outside the grammar (section 8, R2) ----------

describe('tokens outside the grammar go on to the vocabulary', () => {
  it.each<[string, SyntaxItem[]]>([
    ['pad_4', [cls('pad_4', 0, 5)]],
    ['$', [cls('$', 0, 1)]],
    ['pad-4,', [cls('pad-4,', 0, 6)]],
    ['foo bar', [cls('foo', 0, 3), cls('bar', 4, 7)]],
    ['padd-4', [cls('padd-4', 0, 6)]],
    ['bg-primary/50', [cls('bg-primary/50', 0, 13)]], // AW107 is vocabulary
    ['margin-top--8', [cls('margin-top--8', 0, 13)]], // AW104 is vocabulary
    ['pad-17', [cls('pad-17', 0, 6)]], // AW103 is vocabulary
    ['border-3', [cls('border-3', 0, 8)]], // AW103 is vocabulary
    [
      'hover(pad_4 row)',
      [variant('hover', [cls('pad_4', 6, 11), cls('row', 12, 15)], 0, 16)],
    ],
    ['hover', [cls('hover', 0, 5)]], // AW005 is vocabulary
  ])('%j', (look, items) => {
    const result = parseLook(look);
    expect(plain(result.items)).toStrictEqual(items);
    expect(result.diagnostics).toStrictEqual([]);
  });
});

// ---------- positions in UTF-16 (section 2) ----------

describe('positions are UTF-16 code units of the original look', () => {
  it('counts a surrogate pair as 2', () => {
    // pad-4 [0,5) ' ' [5] emoji [6,8) ' ' [8] row [9,12)
    const items = itemsOf('pad-4 \u{1F600} row');
    expect(items.at(-1)).toStrictEqual(cls('row', 9, 12));
  });

  it('keeps diagnostic positions after non-ASCII text', () => {
    expect(diagnosticsOf('\u{1F600} hover(')).toStrictEqual(['AW001[3,9)']);
    expect(diagnosticsOf('é hover:x')).toStrictEqual(['AW006[2,9)']);
    expect(diagnosticsOf('é)')).toStrictEqual(['AW002[1,2)']);
  });

  it('keeps nested positions relative to the whole look', () => {
    // dark( 0-4, \u{1F600} [5,7), space, hover( [8,14), bg-raised [14,23)
    const items = itemsOf('dark(\u{1F600} hover(bg-raised))');
    expect(items).toStrictEqual([
      variant(
        'dark',
        [
          cls('\u{1F600}', 5, 7),
          variant('hover', [cls('bg-raised', 14, 23)], 8, 24),
        ],
        0,
        25,
      ),
    ]);
  });
});

// ---------- breaking it (R47) ----------

const NASTY = [
  '(',
  ')',
  '()',
  '(x)',
  '((',
  '))',
  ')(',
  '(()',
  '())',
  ':',
  '::',
  'a:b:c',
  'hover:',
  ':hover',
  'hover:(bg-raised)',
  'hover (pad-4)',
  'hover( pad-4 ) )',
  'hover(pad-4',
  'hover(pad-4)(',
  'hover(a)(b)',
  '=',
  '==',
  '===',
  'w=a:b',
  'w=#',
  'w=#/',
  'w=/',
  'w=%',
  'w=-',
  'w=--5',
  'w=5%%',
  'w=1.2.3',
  'w=10.',
  'w=1/2',
  'bg=#e11d48/',
  'bg=#e11d48//50',
  'bg=#ggg',
  'bg=#e11d48/abc',
  'bg=#e11d48/-5',
  'a=b=c',
  'a(=)',
  '(=)',
  '-',
  '--',
  '-a',
  'a-',
  '#',
  '/',
  '%',
  '.',
  ',',
  '$',
  ' ',
  'pad-4 row',
  '\u0000',
  ' ',
  'café',
  '\u{1F600}',
  '\u{1F600}(\u{1F600})',
  '\ud800',
  '\udc00(',
  'a\ud800b',
  'hover(\u{1F600}',
  'A'.repeat(10),
  'hover(hover(hover(hover(x)))',
  'hover(hover(hover(hover(x))))))',
  ' ( ',
  '\t)\t',
  '\n(\n',
  'constructor',
  '__proto__',
  'toString(hasOwnProperty)',
  'hover(__proto__)',
  '__proto__=1',
  'constructor=#fff',
];

describe('trying to break it: nothing throws and spans stay inside (R47)', () => {
  it.each(NASTY)('%j', (look) => {
    expect(() => parseLook(look)).not.toThrow();
    expectSane(look);
    for (const d of parseLook(look).diagnostics) {
      expect(SYNTAX_CODES.has(d.code)).toBe(true);
    }
  });

  it('is pure: same input, same output (D15)', () => {
    for (const look of NASTY) {
      expect(parseLook(look)).toStrictEqual(parseLook(look));
    }
  });

  // R47: no input throws, not even a RangeError from the call stack.
  describe.each([1_000, 5_000, 20_000])('nesting depth %i', (depth) => {
    const closed = `${'hover('.repeat(depth)}x${')'.repeat(depth)}`;
    const open = `${'hover('.repeat(depth)}x`;
    const extra = `${'hover('.repeat(depth)}x${')'.repeat(depth + 5)}`;

    it('closed: no throw, no diagnostic', () => {
      expect(() => parseLook(closed)).not.toThrow();
      expect(parseLook(closed).diagnostics).toStrictEqual([]);
      expect(parseLook(closed).items).toHaveLength(1);
    });

    it('open: one single AW001 from the outermost variant (R50)', () => {
      expect(() => parseLook(open)).not.toThrow();
      const result = parseLook(open);
      expect(result.items).toStrictEqual([]);
      expect(result.diagnostics.map(label)).toStrictEqual([
        `AW001[0,${open.length})`,
      ]);
    });

    it('extra `)`: one AW002 for each one left over (R50)', () => {
      expect(() => parseLook(extra)).not.toThrow();
      expect(parseLook(extra).diagnostics.map(label)).toStrictEqual(
        Array.from(
          { length: 5 },
          (_, i) => `AW002[${closed.length + i},${closed.length + i + 1})`,
        ),
      );
    });
  });

  describe('very long input', () => {
    it('50 000 items', () => {
      const result = parseLook('pad-4 '.repeat(50_000));
      expect(result.items).toHaveLength(50_000);
      expect(result.diagnostics).toStrictEqual([]);
      expect(result.items.at(-1)?.position).toStrictEqual(
        pos(6 * 49_999, 6 * 49_999 + 5),
      );
    });

    it('one word of 1 000 000 characters', () => {
      const longWord = 'a'.repeat(1_000_000);
      const [item] = parseLook(longWord).items;
      expect(item?.position).toStrictEqual(pos(0, 1_000_000));
    });

    it.each([1_000, 10_000, 100_000])('%i stray `)`', (n) => {
      expect(() => parseLook(')'.repeat(n))).not.toThrow();
      expect(parseLook(')'.repeat(n)).diagnostics).toHaveLength(n);
    });

    it.each([1_000, 10_000, 100_000])('%i `(` in a row', (n) => {
      expect(() => parseLook('('.repeat(n))).not.toThrow();
    });
  });

  it('does not treat a trailing comma, `)`-glued or `:`-glued text as valid', () => {
    expect(diagnosticsOf('hover:bg-raised pad-4')).toStrictEqual([
      'AW006[0,15)',
    ]);
    expect(itemsOf('hover:bg-raised pad-4')).toStrictEqual([
      cls('pad-4', 16, 21),
    ]);
  });
});

// ---------- property tests (section 9) ----------

// mulberry32: small seeded PRNG, so a failure is reproducible.
function makeRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Random = () => number;

const int = (r: Random, min: number, max: number) =>
  min + Math.floor(r() * (max - min + 1));
const pick = <T>(r: Random, list: readonly T[]): T =>
  list[Math.floor(r() * list.length)] as T;
const chars = (r: Random, alphabet: string, min: number, max: number) =>
  Array.from({ length: int(r, min, max) }, () => pick(r, [...alphabet])).join(
    '',
  );

// EBNF 4.1: ws = " " | "\t" | "\n" | "\r"
const ws1 = (r: Random) => chars(r, ' \t\n\r', 1, 3);
const ws0 = (r: Random) => (r() < 0.5 ? '' : ws1(r));

// EBNF 4.1: word = segment { "-" segment }; segment = (letter|digit){...}
const genWord = (r: Random) =>
  Array.from({ length: int(r, 1, 3) }, () => chars(r, 'abcxyz0189', 1, 4)).join(
    '-',
  );

interface Generated {
  readonly text: string;
  readonly item: SyntaxItem;
}

function genFreeValue(r: Random): { text: string; value: FreeValue } {
  if (r() < 0.5) {
    const sign = r() < 0.3 ? '-' : '';
    const intPart = chars(r, '0123456789', 1, 3);
    const frac = r() < 0.4 ? `.${chars(r, '0123456789', 1, 2)}` : '';
    const percent = r() < 0.3;
    return {
      text: `${sign}${intPart}${frac}${percent ? '%' : ''}`,
      value: num(Number(`${sign}${intPart}${frac}`), percent),
    };
  }
  const digits = pick(r, [3, 6, 8]);
  const hex = `#${chars(r, '0123456789abcdefABCDEF', digits, digits)}`;
  return { text: hex, value: color(hex) };
}

function genItem(r: Random, start: number, depth: number): Generated {
  const kind =
    depth > 0 && r() < 0.4 ? 'variant' : r() < 0.4 ? 'free' : 'class';
  if (kind === 'class') {
    const name = genWord(r);
    return { text: name, item: cls(name, start, start + name.length) };
  }
  if (kind === 'free') {
    const family = genWord(r);
    const { text, value } = genFreeValue(r);
    let finalText = text;
    let finalValue = value;
    if (value.kind === 'color' && r() < 0.5) {
      const opacity = pick(r, [0, 25, 50, 75, 100]);
      finalText = `${text}/${opacity}`;
      finalValue = color(value.hex, opacity);
    }
    const full = `${family}=${finalText}`;
    return {
      text: full,
      item: free(family, finalValue, start, start + full.length),
    };
  }
  const name = genWord(r);
  let text = `${name}(${ws0(r)}`;
  const inner: SyntaxItem[] = [];
  const count = int(r, 1, 3);
  for (let i = 0; i < count; i++) {
    if (i > 0) text += ws1(r);
    const child = genItem(r, start + text.length, depth - 1);
    text += child.text;
    inner.push(child.item);
  }
  text += `${ws0(r)})`;
  return { text, item: variant(name, inner, start, start + text.length) };
}

function genLook(r: Random): { text: string; items: SyntaxItem[] } {
  let text = ws0(r);
  const items: SyntaxItem[] = [];
  const count = int(r, 0, 5);
  for (let i = 0; i < count; i++) {
    if (i > 0) text += ws1(r);
    const generated = genItem(r, text.length, 3);
    text += generated.text;
    items.push(generated.item);
  }
  text += ws0(r);
  return { text, items };
}

describe('property: looks generated from the EBNF are read without AW00x', () => {
  it('reads 2000 generated looks, tree and positions included', () => {
    const r = makeRandom(20260626);
    for (let i = 0; i < 2000; i++) {
      const { text, items } = genLook(r);
      const result = parseLook(text);
      expect(result.diagnostics, JSON.stringify(text)).toStrictEqual([]);
      expect(plain(result.items), JSON.stringify(text)).toStrictEqual(
        plain(items),
      );
    }
  });

  it('a space-free `)`-glued item is the only way to get AW010', () => {
    const r = makeRandom(7);
    for (let i = 0; i < 300; i++) {
      const a = genItem(r, 0, 2);
      const b = genItem(r, 0, 0);
      const joined = parseLook(`${a.text}${b.text}`);
      const spaced = parseLook(`${a.text} ${b.text}`);
      expect(spaced.diagnostics).toStrictEqual([]);
      const glued = joined.diagnostics.map((d) => d.code);
      if (a.item.kind === 'variant') {
        expect(glued, a.text + b.text).toStrictEqual(['AW010']);
        // both items stay, same names as the spaced version (R65)
        expect(joined.items).toHaveLength(2);
      }
    }
  });
});

describe('property: random strings never throw (R47)', () => {
  const ALPHABET = [
    ...'(){}=:/#%.,-_ \t\n\r$aAzZ09fFgG',
    'é',
    '\u{1F600}',
    '\ud800',
    'hover(',
    'dark(',
    'w=',
    'bg=#',
    'pad-',
  ];

  it('keeps every invariant over 5000 random strings', () => {
    const r = makeRandom(42);
    for (let i = 0; i < 5000; i++) {
      const look = Array.from({ length: int(r, 0, 30) }, () =>
        pick(r, ALPHABET),
      ).join('');
      let result: ReturnType<typeof parseLook> | undefined;
      expect(() => {
        result = parseLook(look);
      }, JSON.stringify(look)).not.toThrow();
      expectSane(look);
      expect(result, JSON.stringify(look)).toStrictEqual(parseLook(look));
      for (const d of result?.diagnostics ?? []) {
        expect(SYNTAX_CODES.has(d.code), JSON.stringify(look)).toBe(true);
        expect(d.severity).toBe('error');
        if (d.code === 'AW001') expect(d.position.end).toBe(look.length);
        if (d.code === 'AW002') expect(look[d.position.start]).toBe(')');
      }
      const open = (result?.diagnostics ?? []).filter(
        (d) => d.code === 'AW001',
      );
      expect(open.length, JSON.stringify(look)).toBeLessThanOrEqual(1);
    }
  });

  it('keeps siblings in source order, without overlap, inside the parent', () => {
    const r = makeRandom(99);
    const check = (items: readonly SyntaxItem[], from: number, to: number) => {
      let cursor = from;
      for (const item of items) {
        expect(item.position.start).toBeGreaterThanOrEqual(cursor);
        expect(item.position.end).toBeLessThanOrEqual(to);
        cursor = item.position.end;
        if (item.kind === 'variant') {
          check(item.items, item.position.start, item.position.end);
        }
      }
    };
    for (let i = 0; i < 3000; i++) {
      const look = Array.from({ length: int(r, 0, 30) }, () =>
        pick(r, ALPHABET),
      ).join('');
      check(parseLook(look).items, 0, look.length);
    }
  });
});
