# 027. Core: vocabulário de borda, raio e sombra

- **Status**: bloqueada — aguarda aprovação de `docs/specs/sintaxe.md` e
  `docs/specs/tema.md`
- **Fase**: 1
- **Branch**: feature/core-vocabulario-borda-raio-sombra
- **Depende de**: 021, 012, 014
- **Paralelo com**: 022, 023, 024, 025, 026, 028
- **Spec**: `docs/specs/sintaxe.md`; `docs/specs/tema.md` §1.5
- **Decisões**: D44, D45

## Objetivo
Registrar `round-*`, `border`/`border-2` e `shadow-*`.

## Escopo
- Faz: `round-none`, `round-sm`, `round-md`, `round-lg`, `round-xl`,
  `round-full` (D44); `shadow-sm`, `shadow-md`, `shadow-lg` com os tokens da
  `014` (D45); espessura de borda que a spec definir.
- Não faz: cor de borda (`025`); tradução para RN (`041`, `043`).

## Arquivos permitidos
- Implementador: `packages/core/src/vocabulary/border.ts`,
  `packages/core/src/vocabulary/shadow.ts`.
- QA: `packages/core/test/vocabulary-border.test.ts`,
  `packages/core/test/vocabulary-shadow.test.ts`.

## Critérios de aceite
- [ ] Os seis raios produzem os valores da D44.
- [ ] `shadow-*` produz IR diferente para claro e escuro (D45).

## Casos que o QA deve cobrir
- Os seis raios (D44); `round-2xl` → desconhecida.
- `shadow-md` claro e escuro (D45).
- `hover(shadow-md)`.

## Lacunas que bloqueiam
- Raios por canto (`round-top-md`?) existem?
- Espessuras de borda (`border` = 1, `border-2` está só no rascunho) e lados.
- Ver lacunas da `014` (sombra no escuro troca o fundo?).
