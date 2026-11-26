# 030. Core: tipo do `look` com autocomplete

- **Status**: pronta (depois da 022 a 027 e da 032)
- **Fase**: 1
- **Branch**: feature/core-tipo-look
- **Depende de**: 022, 023, 024, 025, 026, 027, 032 (todas as famílias de
  classes)
- **Paralelo com**: 031, 035, 045
- **Spec**: `docs/specs/sintaxe.md` R52, critério da seção 9 sobre o tipo
- **Decisões**: D20, D66, D126

## Objetivo
Gerar, a partir da fonte única do vocabulário (sem lista copiada), o tipo
TypeScript do `look`: autocomplete das classes conhecidas e aceita qualquer
`string`. A validação de verdade é o diagnóstico em runtime (D126).

## Escopo
- Faz:
  - Um tipo com a união das classes conhecidas, derivado do registro da `021`
    e das escalas do tema (ex.: `pad-${0..16}` a partir da escala), sem listar
    classe à mão.
  - O tipo do `look`: essa união **mais** qualquer `string`, de forma que o
    editor ofereça as classes no autocomplete e nenhuma string vire erro de
    tipo (R52).
- Não faz: template literal estrito que valida a string inteira (descartado
  pela D126); atalhos do `define` no autocomplete (a spec pede "classes
  conhecidas"); ligar o tipo na prop dos componentes (`054`).

## Arquivos permitidos
- Implementador: `packages/core/src/types/**`, `packages/core/src/index.ts`.
- QA: `packages/core/test/types.test.ts` (com `expectTypeOf`).

## Critérios de aceite
- [ ] O tipo do `look` aceita qualquer `string` (R52, D126).
- [ ] A união das classes conhecidas contém as classes do vocabulário e não
      contém classes inválidas.
- [ ] Nenhuma classe é listada à mão nos tipos: tudo vem do registro e do tema
      (skill `codigo-limpo`, seção 3).
- [ ] `pnpm run typecheck` continua passando sem erro de profundidade de tipo.

## Casos que o QA deve cobrir
- O tipo do `look` aceita `'pad-4'`, `'row center gap-4 pad-4'`,
  `'hover(bg-raised shadow-md)'`, `'w=137'` e também `'pad-17'`,
  `'bg-banana'`, `'hover:bg-x'` (D126: não são erro de tipo).
- A união das classes conhecidas contém `'pad-4'`, `'pad-x-16'`, `'row'`,
  `'bg-primary'`, `'text-on-danger-soft'`, `'round-top-left-lg'`,
  `'shadow-md'`, e não contém `'pad-17'`, `'bg-banana'`, `'text-secondary'`,
  `'shadow-none'` (`expectTypeOf(...).not`).
- Observação: o autocomplete no editor é conferido à mão e registrado no
  relatório (não há teste automático para ele).
