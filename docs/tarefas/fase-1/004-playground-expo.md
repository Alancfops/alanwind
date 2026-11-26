# 004. App `playground-expo` (Expo SDK 58)

- **Status**: pronta para começar (depois da 002)
- **Fase**: 1
- **Branch**: feature/playground-app-expo
- **Depende de**: 002
- **Paralelo com**: 003, e todas as tarefas de `core` e `native`
- **Spec**: nenhuma (fundação). Seção 14 de `docs/00-visao-e-decisoes.md`
- **Decisões**: D14, D60, D67, D116, D142

## Objetivo
Ter um app Expo SDK 58 dentro do monorepo, não publicado, que importa
`@alanwind/native` do workspace, para testar o emissor RN e os componentes.

## Escopo
- Faz:
  - `apps/playground-expo` com Expo SDK 58 (RN 0.88, react-native-web 0.21),
    `private: true`. O `private` é obrigatório: o Release roda
    `pnpm -r publish` (D142) e só pula pacotes privados.
  - `@alanwind/native` como dependência `workspace:*`.
  - Configuração do Metro para monorepo pnpm (resolver pacotes do workspace).
  - Uma tela inicial vazia que importa algo de `@alanwind/native` (mesmo que
    seja só o módulo), provando que a ligação funciona.
- Não faz: a tela de demonstração (`060`); nenhum uso real de `look` ainda.

## Arquivos permitidos
- Implementador: `apps/playground-expo/**`.
- QA: nenhum arquivo; verificação por comando.
- Se o Expo exigir mudança na raiz (`.npmrc`, `pnpm-workspace.yaml`,
  `knip.json`), **pare e relate**: a mudança vai para a sessão principal.

## Critérios de aceite
- [ ] `pnpm --filter playground-expo exec expo-doctor` sem erros.
- [ ] `pnpm --filter playground-expo exec expo export --platform web` termina
      sem erro (prova de build sem precisar de emulador).
- [ ] O app abre no Expo Go ou emulador (verificação manual, registrada no
      relatório).
- [ ] `pnpm run build`, `pnpm run typecheck`, `pnpm run test` e
      `pnpm exec biome ci .` continuam passando com o app no workspace.
- [ ] O app não entra no Knip como dependência sem uso nem arquivo morto (se a
      `003` já estiver na `develop`).
- [ ] `pnpm -r publish --dry-run` não lista o app.

## Casos que o QA deve cobrir
- Os comandos dos critérios, com a saída registrada.
