# 040. Native: contexto de resolução (esquema, largura, plataforma, `setColorScheme`)

- **Status**: bloqueada — aguarda aprovação de `docs/specs/emissor-native.md` e
  `docs/specs/tema.md` (breakpoints)
- **Fase**: 1
- **Branch**: feature/native-contexto
- **Depende de**: 002
- **Paralelo com**: 010, 011, 012, 020 e as demais tarefas do `core`
- **Spec**: `docs/specs/emissor-native.md` §1; `docs/specs/tema.md` §1.4
- **Decisões**: D14, D25, D29, D37, D59, D61, D64

## Objetivo
Ler na borda (RN) o contexto que muda o resultado do `look` (esquema de cor,
faixa de largura, plataforma, presença de ponteiro) e oferecer `setColorScheme`
sem Provider.

## Escopo
- Faz: esquema seguindo o sistema (D25) via `useColorScheme`/`Appearance`;
  `setColorScheme('light' | 'dark' | 'system')` sem Provider (D64); faixa de
  tela atual (`compact`, `medium`, `expanded`) a partir da largura (D29, D61);
  plataforma (`ios`, `android`, `web`) via `Platform.OS`; detecção de ponteiro,
  se a spec definir como.
- Não faz: avaliar condições da IR (`044`); cache (`045`).

## Arquivos permitidos
- Implementador: `packages/native/src/context/**`,
  `packages/native/src/index.ts`.
- QA: `packages/native/test/context.test.ts(x)`.

## Critérios de aceite
- [ ] Sem chamar `setColorScheme`, o esquema segue o sistema (D25).
- [ ] `setColorScheme('dark')` força escuro em toda a árvore, sem Provider, e
      componentes já montados atualizam (D64).
- [ ] `setColorScheme('system')` volta a seguir o sistema.
- [ ] A faixa de tela muda nos limites definidos na spec.

## Casos que o QA deve cobrir
- Sistema claro/escuro × `setColorScheme` em cada valor (D25, D64).
- Larguras exatamente nos limites de `medium` e `expanded` e um pixel abaixo.
- `Platform.OS` em `ios`, `android`, `web`.

## Lacunas que bloqueiam
- Valores dos limites de `medium` e `expanded` (D29 só cita o Material Design
  como inspiração).
- Como o RN sabe se "existe ponteiro" para `hover(...)` (D59).
- Comportamento de `setColorScheme` no web via react-native-web.
- Infraestrutura de teste de componentes RN (precisa de
  `@testing-library/react-native` e preset; não decidido, mas é só ferramenta de
  dev, D69).
