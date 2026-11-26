# 023. Core: vocabulário de espaçamento (`pad`, `margin`, `gap`)

- **Status**: pronta (depois da 021 e da 012)
- **Fase**: 1
- **Branch**: feature/core-vocabulario-espacamento
- **Depende de**: 021, 012
- **Paralelo com**: 022, 024, 025, 026, 027
- **Spec**: `docs/specs/sintaxe.md` R17 a R21, R31 a R33, R54, R60, seções 5.2
  (`gap`), 5.3, 5.9, 7.1 e 7.2; `docs/specs/funcionamento-interno.md` R12,
  R29, seção 5.7; `docs/specs/tema.md` R13
- **Decisões**: D19, D30, D43, D58, D87, D89, D105, D107, D125, D127, D139

## Objetivo
Registrar `pad`, `margin` e `gap`, com eixos e lados, escala de 0 a 16,
`auto` na margem e valor livre com `=`, sempre em lados explícitos na IR.

## Escopo
- Faz:
  - `pad-N`, `pad-x-N`, `pad-y-N`, `pad-<lado>-N` e o mesmo para `margin`,
    com `<lado>` em `top`, `bottom`, `left`, `right` (D87); `N` de 0 a 16,
    valor da escala da `012` (R31).
  - `margin-auto` em todas as formas (`margin-auto`, `margin-x-auto`,
    `margin-y-auto`, `margin-<lado>-auto`) (R33).
  - `gap-N`, `gap-x-N` (entre colunas) e `gap-y-N` (entre linhas), relativos à
    tela (R60).
  - Valor livre em todas as formas (`pad=10`, `pad-x=10`, `margin-top=-8`,
    `gap-x=6`), com decimal (R54) e `%`; negativo só em `margin` (R19).
  - IR em lados explícitos: `paddingTop/Right/Bottom/Left`,
    `marginTop/Right/Bottom/Left`; `gap` → `rowGap` + `columnGap`,
    `gap-x` → `columnGap`, `gap-y` → `rowGap` (R12, R29).
  - Especificidade da seção 5.9 (`pad` < `pad-x`/`pad-y` < `pad-<lado>`; o
    mesmo para `margin`; `gap` < `gap-x`/`gap-y`); propriedades abstratas
    `pad.*`, `margin.*`, `gap.x`, `gap.y`.
  - `AW103` para número fora da escala (`pad-17`); `AW104` para margem
    negativa na escala (`margin-top--8`, sugestão `margin-top=-8`) (R20).
- Não faz: aplicação do conflito (`029`); variantes (`028`); `start`/`end`
  como lados (fora da fase 1, R32); tradução para RN (`041`).

## Arquivos permitidos
- Implementador: `packages/core/src/vocabulary/spacing.ts`.
- QA: `packages/core/test/vocabulary-spacing.test.ts`.

## Critérios de aceite
- [ ] Cada classe produz a IR da spec com o valor da escala do tema (sem
      número mágico).
- [ ] A IR nunca tem `padding`, `paddingHorizontal`, `margin*` de eixo nem
      `gap` (R12).
- [ ] O nível de especificidade registrado segue a seção 5.9.

## Casos que o QA deve cobrir
A `sintaxe.md` escreve a saída em notação abstrata; o QA traduz para a IR da
`funcionamento-interno.md` (lados explícitos, valores da escala).
- Seção 7.1: `pad-4`, `pad-0`, `pad-16`, `pad-x-4`, `pad-y-2`, `pad-top-2`,
  `margin-left-4`, `margin-x-auto`, `margin-auto`, `margin-top-auto`,
  `margin-top=-8`, `gap-4`, `gap-x-4`, `gap-y-2`.
- Seção 7.2: `pad=10`, `pad-x=10`, `gap-x=6`.
- Seção 5.7 da `funcionamento-interno.md`: `gap-4`, `gap-x-4`, `gap-y-2`,
  `margin-x-auto`, `margin-top=-8`.
- Erros: `pad-17` → `AW103[0,6)`; `margin-top--8` → `AW104[0,13)` com
  sugestão `margin-top=-8`; `pad=-4` → `AW008` (negativo fora de `margin`);
  `padd-4` → `AW101[0,6)` com sugestão `pad-4`; `pad-start-2` → `AW101` (R32).
