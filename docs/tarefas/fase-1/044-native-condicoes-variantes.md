# 044. Native: avaliação das condições e aplicação das camadas

- **Status**: pronta (depois da 010 e da 040)
- **Fase**: 1
- **Branch**: feature/native-condicoes
- **Depende de**: 010, 040 (tipo `ResolutionContext`)
- **Paralelo com**: 041, 042, 043
- **Spec**: `docs/specs/emissor-native.md` R7 a R13, R23, seções 2
  ("Estados de interação", "Avaliar"), 4 (`ResolutionContext`,
  `InteractionStates`), 5.2 e 6; `docs/specs/funcionamento-interno.md` R17 a
  R20, seção 5.4; `docs/specs/sintaxe.md` seção 7.7
- **Decisões**: D37, D59, D83, D94, D103, D110, D117, D135, D136

## Objetivo
Dada a IR, o contexto (seção 4) e os estados de interação do elemento,
decidir quais camadas valem e aplicá-las em ordem, para estilo e para props.

## Escopo
- Faz:
  - O tipo `InteractionStates` da seção 4 (`hover`, `press`, `focus`,
    `disabled`, todos opcionais; ausente = não ativo), exportado de
    `@alanwind/native`. Os estados **não** fazem parte do contexto (R1,
    D110).
  - Entrada: a IR, um `ResolutionContext` (`040`) e um `InteractionStates`.
    Saída: o `StyleMap` e as props da IR já combinados, ainda sem traduzir
    valores (a tradução é da `041` a `043`, ligadas pela `045`).
  - Avaliação dos átomos:
    - `scheme` vale com o esquema do contexto igual ao do átomo (R7);
    - `platform` vale com a plataforma igual; `native` vale em `ios` e
      `android`, não em `web` (R8);
    - `screen` vale com `context.window.width >= minWidth` do próprio
      átomo, "a partir de"; sem ler o tema nem repetir 600 e 840 (R9);
    - `state` vale quando o estado vem ativo; `hover` só com o evento de
      hover, nunca por causa de `press` (R10, D110); estado não informado
      conta como não ativo (R13).
  - Condição = E de todos os átomos; condição vazia sempre vale (R11).
  - Aplicação na ordem da lista: entre as camadas que valem, a posterior
    vence, propriedade a propriedade; camadas de estilo e de props
    separadas (R12, R23). Sem reordenar nem recalcular precedência,
    conflito ou centralização (R12, D82, D136).
  - Sem camada que valha: estilo `{}` e props `{}` (R15, R23).
- Não faz: ler o contexto (`040`); ligar os estados do `Pressable` (`053`);
  traduzir valores (`041` a `043`); cache (`045`).

## Arquivos permitidos
- Implementador: `packages/native/src/emit/conditions.ts`,
  `packages/native/src/emit/index.ts`, `packages/native/src/index.ts` (só o
  export do tipo `InteractionStates`).
- QA: `packages/native/test/emit-conditions.test.ts` (Vitest; entrada: IR
  escrita à mão).

## Critérios de aceite
- [ ] Cada linha da seção 5.2 da `emissor-native.md`, com a IR
      correspondente escrita à mão, dá as declarações que, traduzidas,
      batem com o estilo e as props indicados.
- [ ] Cada contexto da seção 7.7 da `sintaxe.md` dá o valor indicado.
- [ ] Sem evento de hover, `[hover]` nunca vale, mesmo com `press` (R10).
- [ ] Átomo `state` com estado ausente não vale (R13).
- [ ] O módulo não importa o tema; usa o `minWidth` do átomo (R9).

## Casos que o QA deve cobrir
- Seção 5.2, linha a linha: `col medium(row)` com larguras 599, 600 e 840;
  `col medium(row) center-x` com 599 e 700; `pad-x-2 medium(pad-4)` em
  `compact` e `medium`;
  `bg-primary hover(bg-raised) press(bg-primary-hover)` em repouso, só
  `press`, só `hover`, `hover` e `press`; `hover(bg-raised)` escuro com
  `press` e sem hover → `{}`;
  `ios(pad-6)` em `android` e `ios`; `native(pad-4)` em `ios`, `android` e
  `web`; `dark(bg-surface)` claro e escuro; `disabled(opacity-50)` ativo e
  inativo; `expanded(bg-primary) hover(bg-raised) medium(bg-surface)` com
  largura 900 e `hover` → `bg-primary` (D136); `medium(lines-2) lines-4`
  com 599 e 700; `lines-2` (R7 a R13, R23).
- Seção 6: largura exatamente 600 e 840; `ios(...)` em `web` sem
  diagnóstico; duas camadas com a mesma propriedade valendo juntas.
- As linhas da seção 7.7 da `sintaxe.md`.
