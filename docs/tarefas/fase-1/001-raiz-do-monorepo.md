# 001. Raiz do monorepo e configuração das ferramentas

- **Status**: pronta para começar (aguarda só o pedido do Alan para criar
  estrutura, conforme o `CLAUDE.md`)
- **Executor**: sessão principal (os arquivos são da raiz; o hook do
  `implementador` só libera `packages/` e `apps/`)
- **Fase**: 1
- **Branch**: chore/repo-monorepo-base
- **Depende de**: nenhuma
- **Paralelo com**: —
- **Spec**: nenhuma (fundação). Estrutura na seção 14 de
  `docs/00-visao-e-decisoes.md`
- **Decisões**: D3, D14, D20, D67, D69, D74

## Objetivo
Criar a raiz do monorepo com pnpm workspaces, Turborepo, TypeScript estrito e
Biome, para que os pacotes da fase 1 tenham onde nascer.

## Escopo
- Faz:
  - `package.json` da raiz (privado), com `engines.node` `>=22.13` (seção 3.1) e
    scripts que delegam ao Turborepo: `build`, `test`, `typecheck`, `lint`.
  - `pnpm-workspace.yaml` com `packages/*` e `apps/*` (D67).
  - `turbo.json` com as tarefas `build`, `test`, `typecheck`, `lint` e o cache
    delas (D69).
  - `tsconfig.base.json` com `strict`, `noUnusedLocals` e `noUnusedParameters`
    ligados (skill `codigo-limpo`, seção 4).
  - `biome.json` com lint e formatação (D69), regras de "não usado" ligadas, e a
    **regra de dependência** (skill `codigo-limpo`, seção 1) via
    `noRestrictedImports` por pasta:
    - `packages/core/**`: proibido importar `react`, `react-native`, `node:*` e
      qualquer `@alanwind/*`.
    - `packages/native/**`: proibido importar `@alanwind/css`.
  - Vitest, tsup, Turborepo, Biome e TypeScript como `devDependencies` da raiz.
- Não faz: pacotes (`002`), CI e Knip (`003`), app Expo (`004`).

## Arquivos permitidos
- Implementador (sessão principal): `package.json`, `pnpm-workspace.yaml`,
  `turbo.json`, `tsconfig.base.json`, `biome.json`, `pnpm-lock.yaml`,
  `.gitignore`, `.npmrc` (se o pnpm exigir).
- QA: nenhum arquivo; verificação por comando.

## Critérios de aceite
- [ ] `pnpm install` termina sem erro em Node 22.13+.
- [ ] `pnpm lint` (Biome) roda sem erro no repositório.
- [ ] `pnpm turbo run build test typecheck lint` roda sem erro (sem pacotes,
      nada a fazer, mas sem falha de configuração).
- [ ] `tsconfig.base.json` tem `strict`, `noUnusedLocals` e `noUnusedParameters`
      em `true`.
- [ ] Nenhuma `dependency` de runtime na raiz; só `devDependencies` (D20).

## Casos que o QA deve cobrir
- Rodar os comandos dos critérios e registrar a saída.
- Conferir no `biome.json` que as restrições de import valem para os caminhos de
  `core` e `native` descritos acima (a prova prática fica para a `002`, quando
  os pacotes existirem).
