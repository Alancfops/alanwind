# 026. Core: vocabulário de tipografia

- **Status**: bloqueada — aguarda aprovação de `docs/specs/sintaxe.md`,
  `docs/specs/tema.md` e `docs/specs/funcionamento-interno.md`
- **Fase**: 1
- **Branch**: feature/core-vocabulario-tipografia
- **Depende de**: 021, 012
- **Paralelo com**: 022, 023, 024, 025, 027, 028
- **Spec**: `docs/specs/sintaxe.md` §1.6; `docs/specs/tema.md` §1.5
- **Decisões**: D23, D49, D57

## Objetivo
Registrar as classes de texto (`type-`, `weight-` e afins), marcadas como
**classes de texto** na IR, para a herança por contexto (D57) saber o que
repassar.

## Escopo
- Faz: `type-xs` a `type-3xl` com os valores da D49; demais classes de texto que
  a spec listar para a fase 1 (`weight-*`, `align-*`, `leading-*`, `font-*`,
  `italic`, `underline`, `upper`, `lower`, `lines-N` estão só no rascunho).
- Não faz: escala de fonte do sistema (é do emissor, `042`).

## Arquivos permitidos
- Implementador: `packages/core/src/vocabulary/typography.ts`.
- QA: `packages/core/test/vocabulary-typography.test.ts`.

## Critérios de aceite
- [ ] `type-*` produz os tamanhos da D49.
- [ ] Toda classe que a spec classificar como "de texto" vem marcada como tal na
      IR (D57).

## Casos que o QA deve cobrir
- `type-xs` 12 … `type-3xl` 30 (D49); `type-4xl` → desconhecida.
- `type-lg type-sm` → `type-sm` (D58), se a `029` estiver pronta.

## Lacunas que bloqueiam
- Lista exata de "classes de texto" herdáveis (D57 diz "`text-*`, `type-*`,
  `weight-*` e afins").
- Valores de `weight-*`, `leading-*` e mapeamento de `font-sans/serif/mono` no
  RN.
- `lines-2` vira prop (`numberOfLines`), não estilo: a IR representa isso?
  (`funcionamento-interno.md` §2)
