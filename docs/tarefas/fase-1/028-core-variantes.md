# 028. Core: variantes viram condições na IR

- **Status**: bloqueada — aguarda aprovação de `docs/specs/sintaxe.md` e
  `docs/specs/funcionamento-interno.md`
- **Fase**: 1
- **Branch**: feature/core-variantes
- **Depende de**: 021
- **Paralelo com**: 022, 023, 024, 025, 026, 027
- **Spec**: `docs/specs/sintaxe.md` §1.4; `docs/specs/funcionamento-interno.md`
- **Decisões**: D28, D29, D37, D59, D61

## Objetivo
Registrar as variantes da fase 1 e transformar cada grupo `variante(...)` em
condições neutras na IR, que o emissor avalia depois.

## Escopo
- Faz: estado `hover` (só ponteiro) e `press` (D59); tela `medium` e `expanded`,
  "a partir de" (D37, D61); plataforma `ios`, `android`, `web`; esquema `dark`;
  demais variantes que a spec incluir na fase 1. `compact(...)` → variante
  desconhecida (D61).
- Não faz: avaliar a condição (é do emissor, `044`); `focus`, `disabled`,
  `light`, `native`, `motion-safe` se não forem aprovadas para a fase 1.

## Arquivos permitidos
- Implementador: `packages/core/src/vocabulary/variants.ts`.
- QA: `packages/core/test/variants.test.ts`.

## Critérios de aceite
- [ ] Cada variante gera a condição da spec na IR.
- [ ] `medium(...)` gera condição "a partir de `medium`" (vale também em
      `expanded`) (D37).
- [ ] `compact(row)` → variante desconhecida (D61).
- [ ] `hover:bg-x` não chega aqui (é erro de sintaxe na `020`).

## Casos que o QA deve cobrir
- `hover(bg-raised shadow-md)`, `press(bg-primary-hover)` (D59), `medium(row)`,
  `expanded(gap-6)`, `ios(pad-6)`, `dark(bg-surface)`.
- `col medium(row)` (D37).
- `compact(row)` → desconhecida (D61); `banana(row)` → desconhecida.
- Aninhamento, conforme a spec (ver `020`).

## Lacunas que bloqueiam
- `focus(...)`, `disabled(...)`, `light(...)`, `native(...)` sem decisão própria
  (`sintaxe.md` §2).
- `motion-safe(...)` está na spec, mas a D66 diz que utilitários de
  acessibilidade não estão marcados para a fase 1: entra ou não?
- Aninhamento e ordem entre variantes.
