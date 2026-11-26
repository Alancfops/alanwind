# 027. Core: vocabulário de espessura de borda, raio e opacidade

- **Status**: pronta (depois da 021 e da 012)
- **Fase**: 1
- **Branch**: feature/core-vocabulario-borda-raio
- **Depende de**: 021, 012
- **Paralelo com**: 022, 023, 024, 025, 026, 028
- **Spec**: `docs/specs/sintaxe.md` R21, R31, R62, R63, seções 4.2 (`border`,
  `round`, `opacity-class`), 5.6, 5.8, 5.9, 7.1, 7.2 e 7.6 (`border-3`);
  `docs/specs/funcionamento-interno.md` R12, R32, R36, R47, seção 5.7;
  `docs/specs/tema.md` R14
- **Decisões**: D44, D87, D98, D123, D124, D127, D139

## Objetivo
Registrar a espessura de borda (com lados e eixos), o raio (com lados e
cantos) e a opacidade do elemento.

## Escopo
- Faz:
  - Espessura: `border` = 1; `border-0`, `border-2`, `border-4`; `border-x`,
    `border-y`, `border-<lado>` (1) e `border-x-N`, `border-y-N`,
    `border-<lado>-N` com `N` em 0, 2, 4; `border=V` e as formas por lado e
    eixo com valor livre (R62, D139). IR em `borderTopWidth`,
    `borderRightWidth`, `borderBottomWidth`, `borderLeftWidth` (R12).
    `border-1` e `border-3` → `AW103` com sugestão do valor livre (R62).
    Respeita a desambiguação de `border-` da seção 4.2 (o resto é papel de
    cor, `025`).
  - Raio: `round-<tam>` nos quatro cantos; `round-top|bottom|left|right-<tam>`
    nos dois cantos do lado; `round-top-left-<tam>` e afins num canto;
    `<tam>` em `none` 0, `sm` 4, `md` 8, `lg` 12, `xl` 16, `full` 9999;
    `round=V` nos quatro cantos (R63, R47, R36). IR nos quatro raios de canto
    (R12).
  - Opacidade do elemento: `opacity-0|25|50|75|100` → `opacity` de 0 a 1
    (R32).
  - Especificidade da seção 5.9 (borda: `border` < `border-x`/`border-y` <
    `border-<lado>`; raio: `round` < `round-<lado>` < `round-<canto>`;
    opacidade: nível único).
- Não faz: cor da borda (`025`); `shadow-*` (`032`); `shadow-none` (fora da
  fase 1, D124); tradução para RN (`041`).

## Arquivos permitidos
- Implementador: `packages/core/src/vocabulary/border.ts`,
  `packages/core/src/vocabulary/radius.ts`,
  `packages/core/src/vocabulary/opacity.ts`.
- QA: `packages/core/test/vocabulary-border.test.ts`,
  `packages/core/test/vocabulary-radius.test.ts`,
  `packages/core/test/vocabulary-opacity.test.ts`.

## Critérios de aceite
- [ ] Cada classe produz a IR da seção 5.7 da `funcionamento-interno.md`.
- [ ] A IR nunca tem `borderWidth` nem `borderRadius` únicos (R12).
- [ ] Os valores vêm da escala da `012`.

## Casos que o QA deve cobrir
- `funcionamento-interno.md` 5.7: `border`, `border-0`, `border-y-2`,
  `border=3`, `round-full`, `round-md`, `round-top-lg`,
  `round-bottom-left-md`, `opacity-50`.
- `sintaxe.md` 7.1: `border-2`, `border-4`, `border-x`, `border-top`,
  `border-bottom-2`, `round-bottom-md`, `round-left-lg`, `round-top-left-lg`,
  `opacity-50`.
- Erros: `border-3` → `AW103[0,8)` com sugestão `border=3`; `border-1` →
  `AW103` (D139); `opacity-30` → `AW103[0,10)`; `round-2xl` → `AW103` (valor
  fora da escala de raio, como `type-4xl`).
