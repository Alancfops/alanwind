# 041. Native: emissor de layout, espaço, tamanho, borda, raio e opacidade

- **Status**: bloqueada — aguarda `docs/specs/emissor-native.md` sair do
  rascunho e ser aprovada
- **Fase**: 1
- **Branch**: feature/native-emissor-layout
- **Depende de**: 010
- **Paralelo com**: 042, 043, 044, e as tarefas do `core`
- **Spec**: `docs/specs/emissor-native.md` seção 1 (eixos expandidos, layout
  padrão); `docs/specs/funcionamento-interno.md` R5, R8, R12, R22, R29, R32,
  R36, R47, seção 4 (`StyleMap`)
- **Decisões**: D62, D74, D82, D85, D107, D120, D124, D125

## Objetivo
Traduzir as declarações da IR de layout, espaço, tamanho, borda (larguras),
raio e opacidade para propriedades de estilo do RN.

## Escopo
- Faz: a tradução de `flexDirection`, `flexWrap`, `flex`, `justifyContent`,
  `alignItems`, `rowGap`, `columnGap`, `padding*`/`margin*` por lado,
  `width`, `height`, `border*Width`, os quatro raios de canto e `opacity`, com
  os valores `Dimension`, `Percent`, `ScreenSize` e `'auto'`, pela tabela da
  `emissor-native.md`. Lados continuam explícitos (D107).
- Não faz: cor e texto (`042`); `boxShadow` (`043`); condições (`044`);
  regra de conflito, precedência ou alinhamento pela direção (já resolvidos
  no `core`, R8, R22). Recebe IR, nunca a string do `look` (skill
  `codigo-limpo`).

## Arquivos permitidos
- Implementador: `packages/native/src/emit/layout.ts`,
  `packages/native/src/emit/spacing.ts`, `packages/native/src/emit/sizing.ts`,
  `packages/native/src/emit/border.ts`, `packages/native/src/emit/index.ts`.
- QA: `packages/native/test/emit-layout.test.ts` (Vitest; entrada: IR escrita
  à mão a partir dos exemplos da `funcionamento-interno.md`).

## Critérios de aceite
- [ ] Cada linha da tabela de tradução da `emissor-native.md` produz o estilo
      exato (`toStrictEqual`).
- [ ] `pad-x-4` vira `paddingLeft` + `paddingRight`, sem `paddingHorizontal`
      (D107).
- [ ] O emissor não importa o tema nem `@alanwind/css`; só tipos de
      `@alanwind/core` (R5).

## Casos que o QA deve cobrir
- IR das seções 5.1, 5.2, 5.5 e 5.7 da `funcionamento-interno.md` (partes
  de layout, espaço, tamanho, borda, raio e opacidade), traduzidas pela
  tabela da `emissor-native.md`.

## Lacunas que bloqueiam (`emissor-native.md` seção 2)
- Tradução exata de cada propriedade (a spec ainda não tem a tabela).
- Como `{ unit: 'screen' }` vira valor no RN (largura/altura da janela: vem do
  contexto da `040`?) e como `Percent` vira string (`'50%'`).
- `Box` padrão `flexDirection: 'column'` (D62) é do emissor ou do componente
  (`051`)?
