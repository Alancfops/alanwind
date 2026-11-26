# 001. Raiz do monorepo e configuração das ferramentas

- **Status**: pronta para começar (aguarda só o pedido do Alan para criar
  estrutura, conforme o `CLAUDE.md`)
- **Executor**: `implementador` (o hook libera as configs da raiz, D148)
- **Fase**: 1
- **Branch**: chore/repo-monorepo-base
- **Depende de**: nenhuma
- **Paralelo com**: —
- **Spec**: nenhuma (fundação). Estrutura na seção 14 de
  `docs/00-visao-e-decisoes.md`; workflows em `.github/workflows/ci.yml` e
  `.github/workflows/release.yml`
- **Decisões**: D3, D14, D20, D67, D69, D74, D114, D141, D142, D143, D148,
  D150, D151

## Objetivo
Criar a raiz do monorepo com pnpm workspaces, Turborepo, TypeScript estrito e
Biome, com os nomes de script que o CI e o Release já chamam, para que os
pacotes da fase 1 tenham onde nascer.

## Escopo
- Faz:
  - `package.json` da raiz, `private: true`, com:
    - campo `packageManager` com o pnpm e a versão exata
      (`pnpm@<versão>`): o `pnpm/action-setup` dos dois workflows lê a versão
      daqui (D141, D142);
    - `engines.node` `>=22.18` (D150; o 22.13+ da seção 3.1 é de quem usa);
    - scripts com **estes nomes exatos**, delegando ao Turborepo:
      `typecheck`, `test`, `build` (chamados por `pnpm run` no CI e no
      Release) e `lint`.
  - `pnpm-workspace.yaml` com `packages/*` e `apps/*` (D67).
  - `turbo.json` com as tarefas `build`, `test`, `typecheck`, `lint` e o cache
    delas (D69). `test` precisa rodar tanto o Vitest quanto o Jest que o
    `native` vai ter (D114, ADR 0003): cada pacote expõe o seu `test`.
  - `tsconfig.base.json` com `strict`, `noUnusedLocals` e `noUnusedParameters`
    ligados (skill `codigo-limpo`, seção 4).
  - `biome.json` com lint e formatação (D69), regras de "não usado" ligadas, e a
    **regra de dependência** (skill `codigo-limpo`, seção 1) via
    `noRestrictedImports` por pasta:
    - `packages/core/**`: proibido importar `react`, `react-native`, `node:*` e
      qualquer `@alanwind/*`.
    - `packages/native/**`: proibido importar `@alanwind/css`.
  - Biome, TypeScript, Turborepo, Vitest e tsup como `devDependencies` da raiz.
  - `pnpm-lock.yaml` gerado. Ao entrar na `develop`, ele **liga o job `Code`
    do CI** (D141), então tudo abaixo precisa passar já nesta PR.
- Não faz: pacotes (`002`), Knip (`003`), app Expo (`004`), mudança nos
  workflows (já existem, D141 e D142).

## Arquivos permitidos
- Implementador: `package.json`, `pnpm-workspace.yaml`, `turbo.json`,
  `tsconfig.base.json`, `biome.json`, `pnpm-lock.yaml` (lista da D148).
- QA: nenhum arquivo; verificação por comando.
- Fora da lista da D148: `.gitignore`, `.npmrc` e `.github/`. Se o pnpm
  exigir `.npmrc`, se faltar entrada no `.gitignore` (ex.: `node_modules`,
  `dist`, `.turbo`) ou se o `biome ci` reclamar de `.github/scripts/*.mjs`,
  **pare e relate**: a sessão principal faz essa parte.

## Critérios de aceite
- [ ] `pnpm install --frozen-lockfile` termina sem erro em Node 22.18+.
- [ ] `package.json` tem `packageManager` com `pnpm@<versão>` e os scripts
      `typecheck`, `test` e `build` com esses nomes exatos.
- [ ] `pnpm exec biome ci .` passa no repositório inteiro (é o comando do CI).
      Se o `biome.json` limitar o alcance, `packages/`, `apps/`, os arquivos de
      configuração da raiz e `.github/scripts/` continuam dentro.
- [ ] `pnpm run typecheck`, `pnpm run test` e `pnpm run build` terminam sem
      erro sem nenhum pacote (nada a fazer, mas sem falha de configuração).
- [ ] `tsconfig.base.json` tem `strict`, `noUnusedLocals` e `noUnusedParameters`
      em `true`.
- [ ] Nenhuma `dependency` de runtime na raiz; só `devDependencies` (D20).
- [ ] O check `CI` fica verde na PR (D141, D143).

## Casos que o QA deve cobrir
- Rodar os comandos dos critérios, na ordem do job `Code` do `ci.yml`
  (`install`, `biome ci`, `typecheck`, `test`, `build`), e registrar a saída.
- Conferir no `biome.json` que as restrições de import valem para os caminhos
  de `core` e `native` descritos acima (a prova prática fica para a `002`,
  quando os pacotes existirem).
- `node .github/scripts/check-docs.mjs` continua passando.
