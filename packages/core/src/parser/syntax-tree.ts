import type { Diagnostic, Position } from '../ir/types.js';

/** Free value already classified by its lexical shape (sintaxe.md, 4.1). */
export type FreeValue =
  | {
      readonly kind: 'number';
      readonly value: number;
      /** `true` when written with `%`. */
      readonly percent: boolean;
    }
  | {
      readonly kind: 'color';
      /** Hex as written, with `#` and 3, 6 or 8 digits. */
      readonly hex: string;
      /** Number after `/`; whether it is in the scale is up to the family. */
      readonly opacity?: number;
    };

/** `word`: the vocabulary decides whether the class exists. */
interface ClassNode {
  readonly kind: 'class';
  readonly name: string;
  readonly position: Position;
}

/** `family=value`. */
interface FreeTokenNode {
  readonly kind: 'free';
  readonly family: string;
  readonly value: FreeValue;
  readonly position: Position;
}

/** `name(items)`; `name` is only a `word`, the variants decide if it exists. */
export interface VariantNode {
  readonly kind: 'variant';
  readonly name: string;
  readonly items: readonly SyntaxItem[];
  readonly position: Position;
}

export type SyntaxItem = ClassNode | FreeTokenNode | VariantNode;

export interface ParseResult {
  /** Items that survived the syntax errors, in source order. */
  readonly items: readonly SyntaxItem[];
  /** Syntax diagnostics (AW001 to AW003, AW006 to AW008, AW010), unsorted. */
  readonly diagnostics: readonly Diagnostic[];
}
