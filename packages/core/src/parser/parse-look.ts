import { createDiagnostic } from '../diagnostics/diagnostics.js';
import type { Diagnostic, Position } from '../ir/types.js';
import { classifyFreeValue, describeInvalidValue } from './free-value.js';
import type { ParseResult, SyntaxItem, VariantNode } from './syntax-tree.js';

const WHITESPACE = new Set([' ', '\t', '\n', '\r']);
const TOP_LEVEL = 0;

interface ListResult {
  readonly items: readonly SyntaxItem[];
  /** `false` when the text ended before the `)` of a nested list. */
  readonly closed: boolean;
}

/**
 * Reads the `look` by the EBNF of sintaxe.md, 4.1. It does not know the
 * vocabulary and never throws (R47): only the malformed span is dropped, with
 * its diagnostic (R50). Positions are UTF-16 offsets into `look`.
 */
export function parseLook(look: string): ParseResult {
  const diagnostics: Diagnostic[] = [];
  let cursor = 0;

  function skipWhitespace(): void {
    while (cursor < look.length && WHITESPACE.has(look.charAt(cursor))) {
      cursor++;
    }
  }

  function findChunkEnd(from: number): number {
    let end = from;
    while (end < look.length && !isDelimiter(look.charAt(end))) end++;
    return end;
  }

  function parseList(depth: number): ListResult {
    const items: SyntaxItem[] = [];
    // The last variant closed, to find an item glued to its `)` (R65).
    let previousVariant: Position | undefined;
    for (;;) {
      skipWhitespace();
      if (cursor >= look.length) {
        return { items, closed: depth === TOP_LEVEL };
      }
      if (look.charAt(cursor) === ')') {
        if (depth > TOP_LEVEL) return { items, closed: true };
        diagnostics.push(
          createDiagnostic({
            code: 'AW002',
            position: { start: cursor, end: cursor + 1 },
          }),
        );
        cursor++;
        continue;
      }
      const start = cursor;
      const chunkEnd = findChunkEnd(start);
      const isVariant = look.charAt(chunkEnd) === '(';
      const item = isVariant
        ? parseVariant(start, chunkEnd, depth)
        : parseToken(start, chunkEnd);
      if (previousVariant?.end === start) {
        diagnostics.push(glueDiagnostic(previousVariant, start, cursor));
      }
      previousVariant = isVariant ? { start, end: cursor } : undefined;
      if (item !== undefined) items.push(item);
    }
  }

  // The cursor is on the `(` after the name, which spans [start, nameEnd).
  function parseVariant(
    start: number,
    nameEnd: number,
    depth: number,
  ): VariantNode | undefined {
    const name = look.slice(start, nameEnd);
    const diagnosticsBefore = diagnostics.length;
    cursor = nameEnd + 1;
    const { items, closed } = parseList(depth + 1);
    if (!closed) {
      // R50: from the open variant to the end, as a single error on the
      // outermost one; whatever was found inside is discarded with it.
      if (depth === TOP_LEVEL) {
        diagnostics.length = diagnosticsBefore;
        diagnostics.push(
          createDiagnostic({
            code: 'AW001',
            position: { start, end: look.length },
            args: [name],
          }),
        );
      }
      return undefined;
    }
    const position = { start, end: ++cursor };
    if (isBlank(look.slice(nameEnd + 1, position.end - 1))) {
      diagnostics.push(
        createDiagnostic({ code: 'AW003', position, args: [name] }),
      );
      return undefined;
    }
    return { kind: 'variant', name, items, position };
  }

  function parseToken(start: number, end: number): SyntaxItem | undefined {
    cursor = end;
    const text = look.slice(start, end);
    const position = { start, end };
    const colon = text.indexOf(':');
    const equals = text.indexOf('=');
    if (colon >= 0 && (equals < 0 || colon < equals)) {
      diagnostics.push(colonDiagnostic(text, position));
      return undefined;
    }
    if (equals < 0) return { kind: 'class', name: text, position };

    const family = text.slice(0, equals);
    const rawValue = text.slice(equals + 1);
    if (family === '' || rawValue === '' || rawValue.includes('=')) {
      diagnostics.push(createDiagnostic({ code: 'AW007', position }));
      return undefined;
    }
    const value = classifyFreeValue(rawValue);
    if (value === undefined) {
      const problem = describeInvalidValue(rawValue);
      diagnostics.push(
        createDiagnostic({
          code: 'AW008',
          position,
          args:
            problem === undefined
              ? [rawValue, family]
              : [rawValue, family, problem],
        }),
      );
      return undefined;
    }
    return { kind: 'free', family, value, position };
  }

  function glueDiagnostic(
    previous: Position,
    start: number,
    end: number,
  ): Diagnostic {
    const item = look.slice(start, end);
    return createDiagnostic({
      code: 'AW010',
      position: { start, end },
      args: [look.slice(previous.start, previous.end), item],
      suggestion: ` ${item}`,
    });
  }

  const { items } = parseList(TOP_LEVEL);
  return { items, diagnostics };
}

function isDelimiter(char: string): boolean {
  return char === '(' || char === ')' || WHITESPACE.has(char);
}

function isBlank(text: string): boolean {
  return [...text].every((char) => WHITESPACE.has(char));
}

// `hover:bg-raised` -> `hover(bg-raised)`; no suggestion with an empty part.
function colonDiagnostic(text: string, position: Position): Diagnostic {
  const parts = text.split(':');
  const suggestion = parts.some((part) => part === '')
    ? undefined
    : parts.reduceRight((inner, name) => `${name}(${inner})`);
  return createDiagnostic({
    code: 'AW006',
    position,
    ...(suggestion === undefined ? {} : { suggestion }),
  });
}
