# 022. Core: vocabulário de layout

- **Status**: pronta (depois da 021)
- **Fase**: 1
- **Branch**: feature/core-vocabulario-layout
- **Depende de**: 021
- **Paralelo com**: 023, 024, 025, 026, 027
- **Spec**: `docs/specs/sintaxe.md` R34, R58, R59, seções 4.2 (`layout`), 5.2
  e 7.1; `docs/specs/funcionamento-interno.md` R23, R25, R46, seção 5.5
- **Decisões**: D18, D38, D62, D85, D122, D140

## Objetivo
Registrar as classes de layout com as propriedades abstratas e a
especificidade de cada uma, e produzir a IR das que não dependem da direção.

## Escopo
- Faz:
  - Registro de `row`, `col`, `center`, `center-x`, `center-y`, `x-start`,
    `x-end`, `y-start`, `y-end`, `between`, `wrap`, `fill`, com as
    propriedades abstratas (`direction`, `place.x`, `place.y`, `place.main`,
    `wrap`, `fill`) e os níveis da seção 5.9 (`center` nível 1; `center-x`,
    `x-start`, `x-end`, `center-y`, `y-start`, `y-end` e `between` nível 2,
    D139, D140).
  - IR que não depende da direção: `row` → `flexDirection: 'row'`, `col` →
    `'column'`, `center` → `justifyContent` e `alignItems` `'center'` (R23),
    `between` → `justifyContent: 'space-between'`, `wrap` →
    `flexWrap: 'wrap'`, `fill` → `flex: 1` (R46).
- Não faz: tradução de `center-x`, `center-y`, `x-start`, `x-end`, `y-start`,
  `y-end` pela direção final, desfazer valores e o conflito de `between` com
  alinhamento (`031`); `gap` (`023`); tradução para RN (`041`).

## Arquivos permitidos
- Implementador: `packages/core/src/vocabulary/layout.ts`.
- QA: `packages/core/test/vocabulary-layout.test.ts`.

## Critérios de aceite
- [ ] Cada classe acima existe no registro com as propriedades abstratas e o
      nível da seção 5.9.
- [ ] `row`, `col`, `center`, `between`, `wrap` e `fill` produzem exatamente a
      IR da seção 5.5 da `funcionamento-interno.md`.

## Casos que o QA deve cobrir
- Linhas da seção 5.5 da `funcionamento-interno.md`: `center`, `between`,
  `row between`, `wrap`, `fill`.
- `row` → `flexDirection: 'row'`; `col` → `flexDirection: 'column'`.
- Inválidas próximas: `rows` → `AW101` com sugestão `row`; `center-z` →
  `AW101` com sugestão `center-x` (empate com `center-y`, vence a ordem
  alfabética, R51); `x-middle` → `AW101` sem sugestão.
- Os casos com direção (`row center-x`, `col medium(row) center-x`) e os
  conflitos (`row col`, `between center-y`) ficam com a `031` e a `029`.
