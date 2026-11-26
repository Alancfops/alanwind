import type { Diagnostic, DiagnosticOrigin, Position } from '../ir/types.js';
import type { DiagnosticCode, MessageArgs } from './catalog.js';
import { diagnosticCatalog } from './catalog.js';

/** Maximum edit distance for a suggestion (R51). */
const MAX_SUGGESTION_DISTANCE = 2;

export interface DiagnosticInput {
  readonly code: DiagnosticCode;
  readonly position: Position;
  /** Quoted texts of the message, in the order of the catalog. */
  readonly args?: MessageArgs;
  readonly suggestion?: string;
  readonly origin?: DiagnosticOrigin;
}

/** Severity and message come from the catalog. */
export function createDiagnostic(input: DiagnosticInput): Diagnostic {
  const { code, position, args = [], suggestion, origin } = input;
  const entry = diagnosticCatalog[code];
  return {
    code,
    severity: entry.severity,
    message: entry.message(args),
    position,
    ...(suggestion === undefined ? {} : { suggestion }),
    ...(origin === undefined ? {} : { origin }),
  };
}

/**
 * Orders by `position.start`, then by code (R39, R49, D144). The sort is
 * stable, so equal code and start keep the order they were found in.
 */
export function sortDiagnostics(
  diagnostics: readonly Diagnostic[],
): Diagnostic[] {
  return [...diagnostics].sort(
    (a, b) =>
      a.position.start - b.position.start || compareText(a.code, b.code),
  );
}

/**
 * The candidate closest to `input` within an edit distance of 2; ties go to
 * the first in alphabetical order (R51). No candidate, no suggestion.
 */
export function suggestClosest(
  input: string,
  candidates: readonly string[],
): string | undefined {
  let best: { readonly name: string; readonly distance: number } | undefined;
  for (const name of candidates) {
    const distance = editDistance(input, name);
    if (distance > MAX_SUGGESTION_DISTANCE) continue;
    if (
      best === undefined ||
      distance < best.distance ||
      (distance === best.distance && compareText(name, best.name) < 0)
    ) {
      best = { name, distance };
    }
  }
  return best?.name;
}

// Code-unit comparison, independent of the locale (determinism, D15).
function compareText(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

/** Levenshtein distance: insertions, deletions and substitutions. */
function editDistance(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      const substitution =
        (previous[j - 1] ?? 0) + (a[i - 1] === b[j - 1] ? 0 : 1);
      current.push(
        Math.min(
          substitution,
          (previous[j] ?? 0) + 1,
          (current[j - 1] ?? 0) + 1,
        ),
      );
    }
    previous = current;
  }
  return previous[b.length] ?? 0;
}
