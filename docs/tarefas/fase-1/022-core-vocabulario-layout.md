# 022. Core: vocabulário de layout

- **Status**: bloqueada — aguarda aprovação de `docs/specs/sintaxe.md`
  (vocabulário de layout) e da lista de classes da fase 1
- **Fase**: 1
- **Branch**: feature/core-vocabulario-layout
- **Depende de**: 021
- **Paralelo com**: 023, 024, 025, 026, 027, 028
- **Spec**: `docs/specs/sintaxe.md` §1.3, §1.7
- **Decisões**: D18, D38, D62

## Objetivo
Registrar as classes de layout e a IR que cada uma produz.

## Escopo
- Faz: `row`, `col` (D18, D62); `center`, `center-x`, `center-y` (D38),
  relativos à **tela**, iguais em `row` e `col`; demais classes de layout que a
  spec listar para a fase 1 (`between`, `start`, `end`, `wrap`, `fill` estão só
  no rascunho da seção 11).
- Não faz: a tradução para RN (`041`).

## Arquivos permitidos
- Implementador: `packages/core/src/vocabulary/layout.ts`.
- QA: `packages/core/test/vocabulary-layout.test.ts`.

## Critérios de aceite
- [ ] Cada classe da tabela da spec produz exatamente a IR esperada.
- [ ] `center-x` produz a mesma IR em `row` e em `col` (D38), sem depender da
      direção.

## Casos que o QA deve cobrir
- `row`, `col`, `center`, `center-x`, `center-y` (D38).
- `row center-x` e `col center-x`: a mesma intenção horizontal (D38).
- `row col` (conflito, mesma especificidade: vence a última, D58), se a `029`
  estiver pronta.
- Dentro de variante: `medium(row)` (D37).
- Inválidas próximas: `rows`, `center-z`.

## Lacunas que bloqueiam
- Lista de classes de layout da fase 1 e a IR de cada uma.
- Como `center-x`/`center-y` são representados na IR (neutros) para que o
  emissor RN saiba trocar entre `alignItems` e `justifyContent` conforme a
  direção.
