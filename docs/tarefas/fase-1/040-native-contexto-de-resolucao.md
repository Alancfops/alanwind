# 040. Native: contexto de resolução (esquema, faixa de tela, plataforma)

- **Status**: bloqueada — aguarda `docs/specs/emissor-native.md` sair do
  rascunho e ser aprovada
- **Fase**: 1
- **Branch**: feature/native-contexto
- **Depende de**: 002, 012 (breakpoints)
- **Paralelo com**: 010, 011, 013, 014, 020 e as demais tarefas do `core`
- **Spec**: `docs/specs/emissor-native.md` seção 1 (esquema, cache);
  `docs/specs/tema.md` R3, R4, R16, seções 5.8 e 7.2 (larguras), critério C8
- **Decisões**: D14, D25, D29, D61, D64, D94, D109, D114

## Objetivo
Ler na borda RN o contexto que muda o resultado do `look` (esquema de cor,
faixa de tela, plataforma) e oferecer `setColorScheme` sem Provider.

## Escopo
- Faz:
  - Esquema seguindo o sistema (D25) via `useColorScheme`/`Appearance`.
  - `setColorScheme('light' | 'dark' | 'system')`, sem Provider, com os
    componentes já montados atualizando (R4, D64).
  - Faixa de tela atual a partir da largura da janela: `compact` abaixo de
    600, `medium` a partir de 600, `expanded` a partir de 840 (R16, D94). A
    faixa é o que entra na chave do cache (D109).
  - Plataforma (`ios`, `android`, `web`) via `Platform.OS`.
- Não faz: ponteiro e estados de interação (vêm do componente, `053`, D110);
  avaliar condições da IR (`044`); cache (`045`).

## Arquivos permitidos
- Implementador: `packages/native/src/context/**`,
  `packages/native/src/index.ts`.
- QA: `packages/native/test/context.test.tsx` (Jest, `jest-expo`, D114).

## Critérios de aceite
- [ ] Sem chamar `setColorScheme`, o esquema segue o sistema (R3).
- [ ] `setColorScheme('dark')` força escuro em toda a árvore, sem Provider, e
      componentes já montados atualizam (R4, C8).
- [ ] `setColorScheme('system')` volta a seguir o sistema.
- [ ] A faixa muda exatamente em 600 e 840 (`tema.md` 7.2).

## Casos que o QA deve cobrir
- Sistema claro/escuro × `setColorScheme` em cada valor (D25, D64).
- Larguras 599 → `compact`, 600 → `medium`, 839 → `medium`, 840 →
  `expanded` (`tema.md` 7.2).
- `Platform.OS` em `ios`, `android`, `web`.

## Lacunas que bloqueiam
- `emissor-native.md` ainda é rascunho (seção 2 aberta).
- De onde a borda RN lê os limites 600 e 840 para calcular a faixa do cache
  (D109): do tema do `core`? A R5 da `funcionamento-interno.md` proíbe o
  emissor de consultar o tema, e os átomos da IR já trazem `minWidth`, mas a
  chave do cache precisa da faixa antes de resolver.
- Comportamento de `setColorScheme` na web via react-native-web.
