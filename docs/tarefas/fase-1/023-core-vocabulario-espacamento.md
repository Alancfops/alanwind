# 023. Core: vocabulário de espaçamento

- **Status**: bloqueada — aguarda aprovação de `docs/specs/sintaxe.md` e
  `docs/specs/tema.md`
- **Fase**: 1
- **Branch**: feature/core-vocabulario-espacamento
- **Depende de**: 021, 012
- **Paralelo com**: 022, 024, 025, 026, 027, 028
- **Spec**: `docs/specs/sintaxe.md` §1.3, §1.5, §1.9; `docs/specs/tema.md` §1.5
- **Decisões**: D19, D30, D43, D58

## Objetivo
Registrar `pad`, `margin` e `gap`, com eixos e lados, escala de 0 a 16 e valor
livre com `=`.

## Escopo
- Faz: `pad-N`, `margin-N`, `gap-N` com N de 0 a 16 (D43); eixos `x`/`y` (D19) e
  lados que a spec definir (`pad-top-2` aparece no rascunho); valor livre
  `pad=10` (D30); especificidade por classe (`pad` < `pad-y` < `pad-top`, D58).
- Não faz: a tradução para RN (`041`); a aplicação do conflito (`029`).

## Arquivos permitidos
- Implementador: `packages/core/src/vocabulary/spacing.ts`.
- QA: `packages/core/test/vocabulary-spacing.test.ts`.

## Critérios de aceite
- [ ] Cada classe produz a IR da spec, com o valor da escala do tema (sem número
      mágico).
- [ ] A especificidade registrada segue a ordem da D58.

## Casos que o QA deve cobrir
- `pad-0`, `pad-1`, `pad-4`, `pad-16` (D43); `pad-17` → classe desconhecida.
- `pad-x-4`, `pad-y-2`, `pad-top-2`; `margin-4`, `gap-4`.
- `pad=10` (D30).
- Especificidade: `pad-top` > `pad-y` > `pad` (D58).
- Dentro de variante: `medium(gap-6)`.

## Lacunas que bloqueiam
- Nomes dos lados (`top`, `bottom`, `left`, `right`? `start`/`end` para RTL?).
- `margin-x-auto` (aparece no rascunho): entra? Valor negativo de margem:
  existe? como se escreve sem colidir com o hífen?
- `gap-x`/`gap-y`: existem?
- Unidades aceitas no valor livre (`pad=10` é dp/px; `pad=50%` vale?).
