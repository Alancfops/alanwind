import type {
  Condition,
  ConditionAtom,
  PropsIR,
  PropsMap,
  StyleIR,
  StyleMap,
} from '@alanwind/core';
import type { ResolutionContext } from '../context/types';

// docs/specs/emissor-native.md section 4. Reported by the component, per
// element (R10); absent = not active (R13).
export interface InteractionStates {
  readonly hover?: boolean;
  readonly press?: boolean;
  readonly focus?: boolean;
  readonly disabled?: boolean;
}

interface Layered<Declarations> {
  readonly layers: readonly {
    readonly when: Condition;
    readonly declarations: Declarations;
  }[];
}

interface ResolvedLayers {
  readonly style: StyleMap;
  readonly props: PropsMap;
}

function atomApplies(
  atom: ConditionAtom,
  context: ResolutionContext,
  states: InteractionStates,
): boolean {
  switch (atom.kind) {
    case 'scheme':
      return atom.scheme === context.scheme;
    case 'platform':
      // R8: `native` is `ios` or `android`, never `web`.
      return atom.platform === 'native'
        ? context.platform !== 'web'
        : atom.platform === context.platform;
    case 'screen':
      // R9: the atom carries its own minimum width.
      return context.window.width >= atom.minWidth;
    case 'state':
      return states[atom.state] === true;
  }
}

// R11: logical AND of the atoms; an empty condition always applies.
function conditionApplies(
  when: Condition,
  context: ResolutionContext,
  states: InteractionStates,
): boolean {
  return when.every((atom) => atomApplies(atom, context, states));
}

// R12: layers keep the IR order; the later one wins, per property.
function mergeLayers<Declarations extends object>(
  ir: Layered<Declarations>,
  context: ResolutionContext,
  states: InteractionStates,
): Declarations {
  const merged = {} as Declarations;
  for (const layer of ir.layers) {
    if (conditionApplies(layer.when, context, states)) {
      Object.assign(merged, layer.declarations);
    }
  }
  return merged;
}

/** Applies the layers that hold for the context and states (R7 to R13, R23). */
export function resolveLayers(
  ir: { readonly style: StyleIR; readonly props: PropsIR },
  context: ResolutionContext,
  states: InteractionStates,
): ResolvedLayers {
  return {
    style: mergeLayers(ir.style, context, states),
    props: mergeLayers(ir.props, context, states),
  };
}
