# 044. Native: avaliação das condições e aplicação das camadas

- **Status**: bloqueada — aguarda `docs/specs/emissor-native.md` sair do
  rascunho e ser aprovada
- **Fase**: 1
- **Branch**: feature/native-condicoes
- **Depende de**: 010, 040
- **Paralelo com**: 041, 042, 043
- **Spec**: `docs/specs/emissor-native.md` seção 1 (estados, ponteiro,
  camadas); `docs/specs/funcionamento-interno.md` R17 a R20, seção 5.4;
  `docs/specs/sintaxe.md` seção 7.7
- **Decisões**: D37, D59, D94, D103, D110, D117, D135, D136

## Objetivo
Dado a IR e o contexto atual (esquema, largura, plataforma, estados de
interação), decidir quais camadas valem e aplicá-las em ordem, para estilo e
para props.

## Escopo
- Faz:
  - Avaliação dos átomos: `scheme` pelo esquema; `platform` pela plataforma,
    com `native` valendo em `ios` e `android`; `screen` com
    `largura >= minWidth` do próprio átomo (R18); `state` pelo estado vindo
    do componente: `hover` só com evento de hover ativo (D110), `press` com
    pressionado, `focus` com foco, `disabled` com desabilitado (R19, R20).
  - Condição = E de todos os átomos; lista vazia sempre vale.
  - Aplicação na ordem da lista: entre as camadas que valem, a posterior
    vence, propriedade a propriedade, no estilo e nas props (R17). Sem
    reimplementar precedência (já está na ordem da IR, D117, D136).
- Não faz: ler o contexto (`040`); ligar estados do `Pressable` (`053`);
  traduzir valores (`041` a `043`).

## Arquivos permitidos
- Implementador: `packages/native/src/emit/conditions.ts`,
  `packages/native/src/emit/index.ts`.
- QA: `packages/native/test/emit-conditions.test.ts` (Vitest; entrada: IR
  escrita à mão).

## Critérios de aceite
- [ ] Para cada contexto da seção 7.7 da `sintaxe.md`, com a IR
      correspondente da `funcionamento-interno.md`, vale o valor indicado.
- [ ] Sem evento de hover, `[hover]` nunca vale, mesmo pressionado (D59,
      D110).
- [ ] O emissor usa o `minWidth` do átomo, sem ler o tema (R5, R18).

## Casos que o QA deve cobrir
- `col medium(row)` com largura 599, 600 e 840 (D37).
- `bg-primary hover(bg-primary-hover) press(bg-primary-hover)`: tocado sem
  ponteiro → só `press` (D59).
- `ios(pad-6)` em `android` → sem efeito; `native(pad-4)` em `ios` e
  `android` → vale, em `web` → não.
- `dark(bg-surface)` em claro e escuro.
- As linhas da seção 7.7 da `sintaxe.md` (inclusive
  `expanded(bg-primary) hover(bg-raised) medium(bg-surface)` com tudo ativo →
  `bg-primary`).
- Props: `medium(lines-2) lines-4` → `numberOfLines` 4 em `compact` e 2 em
  `medium`.

## Lacunas que bloqueiam (`emissor-native.md` seção 2)
- Forma de entrada do contexto e dos estados (o que o componente passa ao
  emissor).
- Tradução das props da IR para props do RN (`numberOfLines`).
