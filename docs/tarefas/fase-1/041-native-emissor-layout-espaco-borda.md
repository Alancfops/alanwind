# 041. Native: emissor de layout, espaçamento, tamanho, borda e raio

- **Status**: bloqueada — aguarda aprovação de `docs/specs/emissor-native.md` e
  `docs/specs/funcionamento-interno.md`
- **Fase**: 1
- **Branch**: feature/native-emissor-layout
- **Depende de**: 010
- **Paralelo com**: 042, 043, 044, e as tarefas de vocabulário do `core`
- **Spec**: `docs/specs/emissor-native.md` (tabela de tradução, a escrever)
- **Decisões**: D38, D43, D44, D62

## Objetivo
Traduzir declarações da IR (sem condição) de layout, espaçamento, tamanho, borda
e raio para um objeto de estilo do RN.

## Escopo
- Faz: a tabela IR → estilo RN da spec; `center-x`/`center-y` relativos à tela,
  trocando `alignItems`/`justifyContent` conforme a direção (D38, D62).
- Não faz: cor e texto (`042`); sombra (`043`); condições (`044`). Recebe IR,
  nunca a string do `look` (skill `codigo-limpo`, seção 1).

## Arquivos permitidos
- Implementador: `packages/native/src/emit/layout.ts`,
  `packages/native/src/emit/spacing.ts`, `packages/native/src/emit/sizing.ts`,
  `packages/native/src/emit/border.ts`, `packages/native/src/emit/index.ts`.
- QA: `packages/native/test/emit-layout.test.ts` (entrada: IR escrita à mão a
  partir dos exemplos da `funcionamento-interno.md`).

## Critérios de aceite
- [ ] Cada linha da tabela de tradução da spec produz o estilo exato
      (`toStrictEqual`).
- [ ] `center-x` em `row` e em `col` centraliza na horizontal da tela (D38).
- [ ] Nenhum import de `@alanwind/css`; só tipos e valores de `@alanwind/core`.

## Casos que o QA deve cobrir
- IR de `pad-4` → `{ padding: 16 }`, IR de `pad-x-4` →
  `paddingLeft`/`paddingRight` 16, **se a spec confirmar** esses nomes de
  propriedade (o exemplo da skill `teste-de-ouro` é ilustrativo).
- IR de `row center-x`, `col center-x`, `row center-y`, `col center-y` (D38).
- IR de `round-full` (D44).

## Lacunas que bloqueiam
- `emissor-native.md` §2: tradução exata de cada classe (ex.: `pad-x` vira
  `paddingHorizontal` ou `paddingLeft` + `paddingRight`?).
- `Box` padrão `flexDirection: 'column'` (D62) é responsabilidade do emissor ou
  do componente?
