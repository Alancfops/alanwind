# 043. Native: emissor de `boxShadow`

- **Status**: pronta (depois da 010 e da 042)
- **Fase**: 1
- **Branch**: feature/native-emissor-sombras
- **Depende de**: 010, 042 (conversão de cor da R17)
- **Paralelo com**: 041, 044
- **Spec**: `docs/specs/emissor-native.md` R16 (linha `ShadowLayer[]`), R17
  (formato da cor), R18, seção 5.4 (linhas `shadow-md`) e 6;
  `docs/specs/funcionamento-interno.md` R34, R35, seção 5.8
- **Decisões**: D45, D96, D108, D132, D137, D154, D155

## Objetivo
Traduzir a lista `boxShadow` da IR para o `boxShadow` do RN 0.76+ (nova
arquitetura), igual no iOS, no Android e na web (D108).

## Escopo
- Faz:
  - Cada `ShadowLayer` vira um objeto do `boxShadow`, **na mesma ordem**
    (R18, D155): `{ offsetX, offsetY, blurRadius, spreadDistance, color }`,
    com `blur` da IR em `blurRadius` e `spread` em `spreadDistance`.
  - `color` no formato da R17: `'#RRGGBB'` com `alpha` 1 e
    `'rgba(r, g, b, a)'` com `alpha` < 1 (D154), usando a conversão de cor
    da `042`, sem segunda cópia (skill `codigo-limpo`, seção 3).
- Não faz: elevação do escuro, troca de fundo e borda (já expandidas pelo
  `core` em camadas comuns, `032`; o emissor não conhece elevação, R18,
  `funcionamento-interno.md` R35); `shadowColor`, `shadowOffset`,
  `shadowOpacity`, `shadowRadius` e `elevation` (R18, D108); valores do tema.

## Arquivos permitidos
- Implementador: `packages/native/src/emit/shadow.ts`,
  `packages/native/src/emit/index.ts`.
- QA: `packages/native/test/emit-shadow.test.ts` (Vitest; entrada: IR escrita
  à mão).

## Critérios de aceite
- [ ] O `boxShadow` de `shadow-md` da seção 5.4 sai exato, claro (duas
      camadas, `'rgba(0, 0, 0, 0.08)'` e `'rgba(0, 0, 0, 0.06)'`) e escuro
      (uma camada, `'rgba(0, 0, 0, 0.35)'`), na mesma ordem da IR (R18).
- [ ] O estilo nunca contém `shadowColor`, `shadowOffset`, `shadowOpacity`,
      `shadowRadius` nem `elevation` (R18).
- [ ] A cor da sombra usa a conversão da `042`; não há segunda
      implementação no pacote.

## Casos que o QA deve cobrir
- Seção 5.4: só a parte `boxShadow` das duas linhas `bg-surface shadow-md`
  (claro e escuro; D155).
- `boxShadow` de `shadow-sm`, `shadow-md` e `shadow-lg`, claro e escuro,
  com os valores da tabela 5.7 do `tema.md` escritos como IR.
- Ordem das camadas preservada (R18).
- Caso de borda: `shadow-md` → `boxShadow` apenas (seção 6).
