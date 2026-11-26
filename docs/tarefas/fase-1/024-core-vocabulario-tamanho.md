# 024. Core: vocabulário de tamanho (`w`, `h`, `size`)

- **Status**: pronta (depois da 021 e da 012)
- **Fase**: 1
- **Branch**: feature/core-vocabulario-tamanho
- **Depende de**: 021, 012
- **Paralelo com**: 022, 023, 025, 026, 027, 028
- **Spec**: `docs/specs/sintaxe.md` R17 a R19, R21, R54, R61, seções 5.4, 5.9,
  7.1 e 7.2; `docs/specs/funcionamento-interno.md` R29, seção 5.7;
  `docs/specs/tema.md` R13
- **Decisões**: D19, D30, D77, D98, D105, D125

## Objetivo
Registrar `w`, `h` e `size`, com escala, `full`, `screen` e valor livre.

## Escopo
- Faz:
  - `w-N`, `h-N`, `size-N` com a escala da `012` (`h-10` = 40) (D98).
  - `w-full`, `h-full` → `{ unit: 'percent', value: 100 }`; `w-screen`,
    `h-screen` → `{ unit: 'screen' }` (R29).
  - `size-full` e `size-screen` (R61, D125); `size-*` vira `width` e `height`
    com o mesmo valor (R29).
  - Valor livre `w=137`, `w=50%`, `w=10.5`, `h=V`, `size=V` (R17, R18, R54).
  - Especificidade: `size` nível 1, `w`/`h` nível 2 (seção 5.9).
  - `AW103` para número fora da escala.
- Não faz: `min-`/`max-` (não estão no vocabulário da fase 1); conflito
  (`029`); tradução para RN (`041`).

## Arquivos permitidos
- Implementador: `packages/core/src/vocabulary/sizing.ts`.
- QA: `packages/core/test/vocabulary-sizing.test.ts`.

## Critérios de aceite
- [ ] Cada classe produz a IR da seção 5.7 da `funcionamento-interno.md`.
- [ ] `size-N`, `size-full` e `size-screen` produzem `width` e `height`
      iguais.
- [ ] Negativo é recusado (`w=-5` → `AW008`, R19).

## Casos que o QA deve cobrir
- `funcionamento-interno.md` 5.7: `w-full`, `h-screen`, `w=137`, `w=10.5`,
  `w=50%`, `size-10`, `size-full`, `size-screen`.
- `sintaxe.md` 7.1 e 7.2: `h-10`, `size-10`, `w=137`, `w=50%`, `w=10.5`.
- Erros: `w=-5` → `AW008[0,4)`; `w-17` → `AW103`; `width-4` → `AW101`.
