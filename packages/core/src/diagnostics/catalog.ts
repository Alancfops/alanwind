import type { Diagnostic } from '../ir/types.js';

/** Arguments quoted in a message (`{x}` in the table of sintaxe.md, section 6). */
export type MessageArgs = readonly string[];

interface CatalogEntry {
  readonly severity: Diagnostic['severity'];
  /** Free text outside the contract (R40). */
  readonly message: (args: MessageArgs) => string;
}

// Phase 1 catalog (sintaxe.md, section 6). AW303 stays out until roles can
// be created (D144).
export const diagnosticCatalog = {
  AW001: {
    severity: 'error',
    message: ([name = '']) => `Variant ${name} was not closed with ")".`,
  },
  AW002: {
    severity: 'error',
    message: () => '")" has no matching opening parenthesis.',
  },
  AW003: {
    severity: 'error',
    message: ([name = '']) => `Variant ${name} is empty.`,
  },
  AW004: {
    severity: 'error',
    message: ([name = '']) => {
      if (name === 'compact') {
        return `Variant ${name} does not exist; what has no variant applies to all sizes.`;
      }
      if (name === 'motion-safe') {
        return `Variant ${name} is not available in this phase.`;
      }
      return `Variant ${name} does not exist.`;
    },
  },
  AW005: {
    severity: 'error',
    message: ([name = '']) => `${name} is a variant; use ${name}(...).`,
  },
  AW006: {
    severity: 'error',
    message: () => 'Variants use parentheses, not ":".',
  },
  AW007: {
    severity: 'error',
    message: () => 'Malformed free value.',
  },
  AW008: {
    severity: 'error',
    // Third argument (optional): 'comma', 'leading-dot' or 'palette' selects
    // the dedicated message; anything else gets the generic one.
    message: ([value = '', family = '', problem = '']) => {
      switch (problem) {
        case 'comma':
          return `Value ${value} uses a decimal comma; use "." instead.`;
        case 'leading-dot':
          return `Value ${value} needs a digit before the ".".`;
        case 'palette':
          return `Value ${value} is a palette tone, which is not available in this phase.`;
        default:
          return `Value ${value} is not accepted in ${family}.`;
      }
    },
  },
  AW009: {
    severity: 'error',
    message: ([family = '']) => `${family} does not accept a free value.`,
  },
  AW010: {
    severity: 'error',
    message: ([first = '', second = '']) =>
      `A space is missing between ${first} and ${second}.`,
  },
  AW101: {
    severity: 'error',
    message: ([name = '']) => `Class ${name} does not exist.`,
  },
  AW102: {
    severity: 'error',
    message: ([role = '', prefix = '']) =>
      `Role ${role} does not exist in ${prefix}-.`,
  },
  AW103: {
    severity: 'error',
    message: ([value = '', family = '']) =>
      `${value} is out of the scale of ${family}.`,
  },
  AW104: {
    severity: 'error',
    message: () => 'Negative margin is only available as a free value.',
  },
  AW107: {
    severity: 'error',
    message: () => 'Opacity on a role uses a suffix, not "/".',
  },
  AW201: {
    severity: 'warning',
    message: ([discarded = '', winner = '']) =>
      `${discarded} is overridden by ${winner}.`,
  },
  AW202: {
    severity: 'warning',
    message: ([first = '', second = '']) =>
      `Conditions ${first} and ${second} never apply together.`,
  },
  AW301: {
    severity: 'error',
    message: ([first = '', second = '']) =>
      `Shortcut cycle: ${first} -> ${second} -> ${first}.`,
  },
  AW302: {
    severity: 'error',
    message: ([name = '']) =>
      `Shortcut ${name} coincides with a class or a variant.`,
  },
  AW304: {
    severity: 'error',
    message: ([name = '']) => `Shortcut name ${name} is invalid.`,
  },
} as const satisfies Record<`AW${number}`, CatalogEntry>;

export type DiagnosticCode = keyof typeof diagnosticCatalog;
