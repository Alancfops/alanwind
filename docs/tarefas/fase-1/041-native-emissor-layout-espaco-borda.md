# 041. Native: emissor de layout, espaço, tamanho, borda, raio e opacidade

- **Status**: pronta (depois da 010 e da 040)
- **Fase**: 1
- **Branch**: feature/native-emissor-layout
- **Depende de**: 010, 040 (só o tipo `ResolutionContext`, para a janela)
- **Paralelo com**: 042, 043, 044 e as tarefas do `core`
- **Spec**: `docs/specs/emissor-native.md` R14, R15, R16 (linhas `number`,
  `Percent`, `ScreenSize` e `'auto'`), R39 (só o valor), seções 5.1 e 5.4
  (unidades de tela) e 6; `docs/specs/funcionamento-interno.md` R5, R8, R12,
  R22, R29, R32, R36, R47, seção 4 (`StyleMap`)
- **Decisões**: D62, D74, D82, D85, D107, D120, D124, D125, D152

## Objetivo
Traduzir as declarações da IR de layout, espaço, tamanho, borda (larguras),
raio e opacidade para propriedades de estilo do RN.

## Escopo
- Faz:
  - Cada declaração vira a propriedade do RN de **mesmo nome** (R14):
    `flexDirection`, `flexWrap`, `flex`, `justifyContent`, `alignItems`,
    `rowGap`, `columnGap`, `padding*` e `margin*` por lado, `width`,
    `height`, `border*Width`, os quatro raios de canto e `opacity`. Lados e
    cantos continuam explícitos: nunca `padding`, `paddingHorizontal`,
    `paddingVertical`, `margin`, `borderWidth` nem `borderRadius` (R14,
    D107, D120).
  - Valores pela tabela da R16: `number` sai como o mesmo número (dp);
    `Percent` sai como a string `'<value>%'` (`'50%'`, `'100%'`, `'12.5%'`);
    `'auto'` (só em margem) sai como `'auto'`.
  - `ScreenSize` (`{ unit: 'screen' }`): `width` recebe a largura da janela e
    `height` a altura, lidas do `window` do contexto que a função recebe
    (R16, R39, D152). A chave do cache com a janela exata é da `045`.
  - Só sai o que a IR declara: nada de valor padrão (R15, D83). O
    `flexDirection: 'column'` do `Box` é da base do componente (`051`,
    componentes R9, D168), não do emissor.
- Não faz: cor e texto (`042`); `boxShadow` (`043`); condições e camadas
  (`044`); regra de conflito, precedência ou alinhamento pela direção (já
  resolvidos no `core`, R12, D82, D136). Recebe IR, nunca a string do `look`
  (skill `codigo-limpo`).

## Arquivos permitidos
- Implementador: `packages/native/src/emit/layout.ts`,
  `packages/native/src/emit/spacing.ts`, `packages/native/src/emit/sizing.ts`,
  `packages/native/src/emit/border.ts`, `packages/native/src/emit/index.ts`.
- QA: `packages/native/test/emit-layout.test.ts` (Vitest; entrada: IR escrita
  à mão a partir dos exemplos da `funcionamento-interno.md`).

## Critérios de aceite
- [ ] Cada linha de layout, espaço, tamanho, borda, raio e opacidade da
      seção 5.1 sai exata (`toStrictEqual`), com a IR escrita à mão.
- [ ] As linhas `h-screen` e `size-screen` da seção 5.4 saem exatas com
      janelas 390 × 844 e 390 × 800 (R16, R39).
- [ ] O estilo nunca contém `padding`, `paddingHorizontal`,
      `paddingVertical`, `margin`, `borderWidth` nem `borderRadius` (R14).
- [ ] IR sem declaração dá `{}` (R15).
- [ ] O emissor não importa o tema nem `@alanwind/css`; só tipos de
      `@alanwind/core` e o tipo da `040` (`funcionamento-interno.md` R5).

## Casos que o QA deve cobrir
- Seção 5.1 da `emissor-native.md`: `pad-4` (só o padding), `pad-x-2`,
  `margin-x-auto`, `margin-top=-8`, `w-full`, `w=50%`, `w=137`, `w=10.5`,
  `size-10`, `gap-4`, `gap-x-4`, `border-y-2`, `round-top-lg`,
  `opacity-50`, `fill wrap between`, vazio (R14 a R16).
- Seção 5.4: `h-screen` com 390 × 844 e 390 × 800; `size-screen` com
  390 × 844 (R16, R39, D152).
- IR das seções 5.1, 5.2, 5.5 e 5.7 da `funcionamento-interno.md` (partes
  de layout, espaço, tamanho, borda, raio e opacidade).
- Caso de borda: `pad-x-4` → `paddingLeft` e `paddingRight`, nunca
  `paddingHorizontal` (seção 6).
