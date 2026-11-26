import { createDiagnostic } from '../diagnostics/diagnostics.js';
import type { Diagnostic, Position } from '../ir/types.js';
import { classifyFreeValue, describeInvalidValue } from './free-value.js';
import type { ParseResult, SyntaxItem, VariantNode } from './syntax-tree.js';

const WHITESPACE = new Set([' ', '\t', '\n', '\r']);

/** The list being read: the top level, or the inside of an open variant. */
interface Scope {
  readonly items: SyntaxItem[];
  // The last variant closed, to find an item glued to its `)` (R65).
  previousVariant?: Position | undefined;
  /** Absent in the top-level scope. */
  readonly variant?: OpenVariant;
}

interface OpenVariant {
  readonly name: string;
  readonly start: number;
  readonly nameEnd: number;
  readonly diagnosticsBefore: number;
}

/**
 * Reads the `look` by the EBNF of sintaxe.md, 4.1. It does not know the
 * vocabulary and never throws (R47): only the malformed span is dropped, with
 * its diagnostic (R50). Positions are UTF-16 offsets into `look`. Nesting uses
 * an explicit stack of scopes, so the depth does not grow the call stack.
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

  // Adds the item read at [start, cursor) to its scope; `item` is undefined
  // when the span was dropped.
  function addItem(
    scope: Scope,
    item: SyntaxItem | undefined,
    start: number,
    isVariant: boolean,
  ): void {
    const { previousVariant } = scope;
    if (previousVariant?.end === start) {
      diagnostics.push(glueDiagnostic(previousVariant, start, cursor));
    }
    scope.previousVariant = isVariant ? { start, end: cursor } : undefined;
    if (item !== undefined) scope.items.push(item);
  }

  // The cursor is on the `)` that closes the variant of `scope`.
  function closeVariant(
    scope: Scope,
    variant: OpenVariant,
  ): VariantNode | undefined {
    const { name, start, nameEnd } = variant;
    const position = { start, end: ++cursor };
    if (isBlank(nameEnd + 1, position.end - 1)) {
      diagnostics.push(
        createDiagnostic({ code: 'AW003', position, args: [name] }),
      );
      return undefined;
    }
    return { kind: 'variant', name, items: scope.items, position };
  }

  function parseList(): readonly SyntaxItem[] {
    const topLevel: Scope = { items: [] };
    // The scopes around `scope`, from the top level to its parent.
    const parents: Scope[] = [];
    let scope = topLevel;
    for (;;) {
      skipWhitespace();
      if (cursor >= look.length) {
        const outermost =
          parents.length > 0 ? (parents[1] ?? scope) : undefined;
        if (outermost?.variant === undefined) return topLevel.items;
        // R50: from the open variant to the end, as a single error on the
        // outermost one; whatever was found inside is discarded with it.
        const { name, start, diagnosticsBefore } = outermost.variant;
        diagnostics.length = diagnosticsBefore;
        diagnostics.push(
          createDiagnostic({
            code: 'AW001',
            position: { start, end: look.length },
            args: [name],
          }),
        );
        parents.length = 0;
        scope = topLevel;
        addItem(topLevel, undefined, start, true);
        continue;
      }
      if (look.charAt(cursor) === ')') {
        const parent = parents.pop();
        if (parent === undefined || scope.variant === undefined) {
          diagnostics.push(
            createDiagnostic({
              code: 'AW002',
              position: { start: cursor, end: cursor + 1 },
            }),
          );
          cursor++;
          continue;
        }
        const closed = closeVariant(scope, scope.variant);
        addItem(parent, closed, scope.variant.start, true);
        scope = parent;
        continue;
      }
      const start = cursor;
      const chunkEnd = findChunkEnd(start);
      if (look.charAt(chunkEnd) === '(') {
        parents.push(scope);
        scope = {
          items: [],
          variant: {
            name: look.slice(start, chunkEnd),
            start,
            nameEnd: chunkEnd,
            diagnosticsBefore: diagnostics.length,
          },
        };
        cursor = chunkEnd + 1;
        continue;
      }
      addItem(scope, parseToken(start, chunkEnd), start, false);
    }
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

  // Stops at the first non-blank character, so deep nesting stays linear.
  function isBlank(from: number, to: number): boolean {
    for (let index = from; index < to; index++) {
      if (!WHITESPACE.has(look.charAt(index))) return false;
    }
    return true;
  }

  const items = parseList();
  return { items, diagnostics };
}

function isDelimiter(char: string): boolean {
  return char === '(' || char === ')' || WHITESPACE.has(char);
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
