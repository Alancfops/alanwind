# 024. Core: vocabulário de tamanho

- **Status**: bloqueada — aguarda aprovação de `docs/specs/sintaxe.md` e
  `docs/specs/tema.md`, e confirmação de que entra na fase 1
- **Fase**: 1 (a confirmar)
- **Branch**: feature/core-vocabulario-tamanho
- **Depende de**: 021, 012
- **Paralelo com**: 022, 023, 025, 026, 027, 028
- **Spec**: `docs/specs/sintaxe.md` §1.3, §1.5
- **Decisões**: D19, D30

## Objetivo
Registrar `w`, `h` e `size`, com escala, `full` e valor livre.

## Escopo
- Faz: as classes de tamanho que a spec definir; valor livre `w=137` e `w=50%`
  (D30).
- Não faz: tradução para RN (`041`).

## Arquivos permitidos
- Implementador: `packages/core/src/vocabulary/sizing.ts`.
- QA: `packages/core/test/vocabulary-sizing.test.ts`.

## Critérios de aceite
- [ ] Cada classe produz a IR da spec.
- [ ] `size-N` equivale a `w-N h-N` na IR, se a spec confirmar.

## Casos que o QA deve cobrir
- `w=137`, `w=50%` (D30); demais casos da tabela da spec.

## Lacunas que bloqueiam
- Todo o vocabulário de tamanho está só no rascunho (seção 11): `w-full`,
  `h-10`, `size-10`. Falta decidir a escala (`h-10` = 40?), `min-`/`max-` e se a
  família entra na fase 1.
