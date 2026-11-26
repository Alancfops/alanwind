import { createDiagnostic } from '../diagnostics/diagnostics.js';
import type { Diagnostic, Position } from '../ir/types.js';
import {
  classifyFreeValue,
  describeInvalidValue,
  isNumericFamily,
  suggestFreeValue,
} from './free-value.js';
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

  // Adds the token read at `position`; `item` is undefined when it was
  // dropped, but a token glued to a variant is still reported (R65).
  function addToken(
    scope: Scope,
    item: SyntaxItem | undefined,
    position: Position,
  ): void {
    reportGlue(scope, position);
    scope.previousVariant = undefined;
    if (item !== undefined) scope.items.push(item);
  }

  // Adds a closed variant; `undefined` when it was dropped. A dropped variant
  // is not a `)` to glue to, nor an item glued to one (D188).
  function addVariant(scope: Scope, variant: VariantNode | undefined): void {
    if (variant === undefined) {
      scope.previousVariant = undefined;
      return;
    }
    reportGlue(scope, variant.position);
    scope.previousVariant = variant.position;
    scope.items.push(variant);
  }

  function reportGlue(scope: Scope, position: Position): void {
    const { previousVariant } = scope;
    if (previousVariant?.end === position.start) {
      diagnostics.push(glueDiagnostic(previousVariant, position));
    }
  }

  // The `)` that closes the variant of `scope` ends at `end`.
  function closeVariant(
    scope: Scope,
    variant: OpenVariant,
    end: number,
  ): VariantNode | undefined {
    const { name, start, nameEnd, diagnosticsBefore } = variant;
    const position = { start, end };
    if (name.includes(':')) {
      // The whole span goes, so what was found inside goes with it (D188).
      diagnostics.length = diagnosticsBefore;
      diagnostics.push(
        colonDiagnostic(
          position,
          colonNames(name),
          look.slice(nameEnd + 1, end - 1),
        ),
      );
      return undefined;
    }
    if (isBlank(nameEnd + 1, end - 1)) {
      diagnostics.push(
        createDiagnostic({ code: 'AW003', position, args: [name] }),
      );
      return undefined;
    }
    // Emptied by errors inside: only those errors are reported (D188).
    if (scope.items.length === 0) return undefined;
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
        const outermostOpen =
          parents.length > 0 ? (parents[1] ?? scope) : undefined;
        if (outermostOpen?.variant === undefined) return topLevel.items;
        // R50: from the open variant to the end, as a single error on the
        // outermost one; whatever was found inside is discarded with it.
        const { name, start, diagnosticsBefore } = outermostOpen.variant;
        diagnostics.length = diagnosticsBefore;
        const span = look.slice(start);
        diagnostics.push(
          createDiagnostic({
            code: 'AW001',
            position: { start, end: look.length },
            args: [name],
            suggestion: span + ')'.repeat(parents.length),
          }),
        );
        return topLevel.items;
      }
      if (look.charAt(cursor) === ')') {
        const parent = parents.pop();
        if (parent === undefined || scope.variant === undefined) {
          diagnostics.push(
            createDiagnostic({
              code: 'AW002',
              position: { start: cursor, end: cursor + 1 },
              suggestion: '',
            }),
          );
          cursor++;
          continue;
        }
        const end = cursor + 1;
        addVariant(parent, closeVariant(scope, scope.variant, end));
        cursor = end;
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
      const position = { start, end: chunkEnd };
      addToken(scope, parseToken(position), position);
      cursor = chunkEnd;
    }
  }

  function parseToken(position: Position): SyntaxItem | undefined {
    const text = look.slice(position.start, position.end);
    const colon = text.indexOf(':');
    const equals = text.indexOf('=');
    if (colon >= 0 && (equals < 0 || colon < equals)) {
      const names = text.split(':');
      diagnostics.push(colonDiagnostic(position, names, names.pop() ?? ''));
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
    if (
      value === undefined ||
      (value.kind === 'color' && isNumericFamily(family))
    ) {
      diagnostics.push(invalidValueDiagnostic(position, family, rawValue));
      return undefined;
    }
    return { kind: 'free', family, value, position };
  }

  function glueDiagnostic(previous: Position, position: Position): Diagnostic {
    const item = look.slice(position.start, position.end);
    return createDiagnostic({
      code: 'AW010',
      position,
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

// `hover:dark(` -> [hover, dark]; the `:` before the `(` of `hover:(` ends it.
function colonNames(variantName: string): string[] {
  const names = variantName.split(':');
  if (names.at(-1) === '') names.pop();
  return names;
}

// `hover:bg-raised` -> `hover(bg-raised)`; no suggestion with an empty part.
function colonDiagnostic(
  position: Position,
  names: readonly string[],
  content: string,
): Diagnostic {
  const suggestion =
    names.includes('') || content.trim() === ''
      ? undefined
      : names.reduceRight((inner, name) => `${name}(${inner})`, content);
  return createDiagnostic({
    code: 'AW006',
    position,
    ...(suggestion === undefined ? {} : { suggestion }),
  });
}

function invalidValueDiagnostic(
  position: Position,
  family: string,
  rawValue: string,
): Diagnostic {
  const problem = describeInvalidValue(rawValue);
  const fixed = suggestFreeValue(rawValue);
  return createDiagnostic({
    code: 'AW008',
    position,
    args:
      problem === undefined ? [rawValue, family] : [rawValue, family, problem],
    ...(fixed === undefined ? {} : { suggestion: `${family}=${fixed}` }),
  });
}
