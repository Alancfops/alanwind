# 010. Core: tipos da IR

- **Status**: pronta (depois da 002)
- **Fase**: 1
- **Branch**: feature/core-ir-tipos
- **Depende de**: 002
- **Paralelo com**: 012, 040
- **Spec**: `docs/specs/funcionamento-interno.md`, seção 4 (formato), R1, R3,
  R11, R12, R14, R27, R28, R29 a R36, R37, R38, R47, R48, R49
- **Decisões**: D74, D82, D83, D84, D120, D124, D125, D135, D139

## Objetivo
Fechar em TypeScript o formato da IR, o contrato entre o `core` e os emissores.
Nenhuma tarefa de emissor começa antes desta (skill `codigo-limpo`, seção 1).

## Escopo
- Faz: os tipos exportados exatamente como a seção 4 da spec, todos
  `readonly`: `ResolvedLook`, `StyleIR`, `StyleLayer`, `Condition`,
  `ConditionAtom`, `PropsIR`, `PropsLayer`, `PropsMap`, `Percent`,
  `ScreenSize`, `Ratio`, `Dimension`, `Color`, `ThemedColor`, `ShadowLayer`,
  `StyleMap`, `Diagnostic`, `Position`, `DiagnosticOrigin` (D120, D135, D139).
- Não faz: parser, vocabulário, emissores, regra de conflito, catálogo de
  códigos (`011`).

## Arquivos permitidos
- Implementador: `packages/core/src/ir/**`, `packages/core/src/index.ts`.
- QA: `packages/core/test/ir.test.ts` (testes de tipo com `expectTypeOf` do
  Vitest).

## Critérios de aceite
- [ ] Os tipos exportados batem campo a campo com a seção 4 (critério 1 da
      seção 7 da spec).
- [ ] `props` é `PropsIR` com `layers`, não um mapa plano (R28, D135).
- [ ] `StyleMap` só tem lados explícitos de padding, margem e largura de borda,
      `rowGap`/`columnGap` e os quatro raios de canto; sem `padding`,
      `paddingHorizontal`, `gap` ou `borderRadius` (R12, D124, D125, D139).
- [ ] A IR não carrega especificidade nem ordem de escrita (R11) e não contém
      nada de RN ou de CSS (R3).
- [ ] `Diagnostic.origin` é opcional e tem `shortcut` + `position` (R49).
- [ ] `pnpm run typecheck` e `pnpm run test` passam; Knip limpo.

## Casos que o QA deve cobrir
- Cada exemplo das seções 5.1 a 5.9 da spec, escrito por inteiro (sem a
  notação `T()`, `PAD()`, `BORDER()`, `RADIUS()`, `GAP()`), é aceito pelo tipo
  `ResolvedLook` (`expectTypeOf`).
- Formas inválidas rejeitadas com `// @ts-expect-error`: discriminante errado
  em `ConditionAtom` (`kind: 'size'`), `state: 'active'`, campo desconhecido em
  `StyleMap` (`paddingHorizontal`, `borderRadius`, `gap`), `props` plano
  (`{ numberOfLines: 2 }` sem `layers`), `fontWeight: 600`,
  `justifyContent: 'space-around'`, `marginTop: 'auto'` aceito mas
  `paddingTop: 'auto'` rejeitado (R29), `width: { unit: 'screen' }` aceito mas
  `paddingTop: { unit: 'screen' }` rejeitado, `severity: 'info'`.
