# 003. CI mínimo com Knip

- **Status**: pronta para começar (depois da 002)
- **Executor**: sessão principal (`.github/` e `knip.json` ficam na raiz; o hook
  do `implementador` não libera)
- **Fase**: 1
- **Branch**: chore/repo-ci-minimo
- **Depende de**: 001, 002
- **Paralelo com**: 004
- **Spec**: nenhuma (fundação)
- **Decisões**: D69, D73, D74

## Objetivo
Toda PR para `develop` e `main` roda lint, tipos, testes, build e Knip, e falha
se algo quebrar.

## Escopo
- Faz:
  - `.github/workflows/ci.yml`, disparado em `pull_request` para `develop` e
    `main` (D73): Node 22.13+, `pnpm install --frozen-lockfile`, `biome ci`,
    `pnpm typecheck`, `pnpm test`, `pnpm build`, `knip`.
  - `knip.json` na raiz com os workspaces `packages/*` e `apps/*`, os arquivos
    de teste como entrada e as configs de tsup/Vitest reconhecidas.
  - Knip como `devDependency` da raiz.
- Não faz: publicação no npm, release, deploy, matriz de várias versões do Node.

## Arquivos permitidos
- Implementador (sessão principal): `.github/workflows/ci.yml`, `knip.json`,
  `package.json` (raiz, só para adicionar Knip e o script), `pnpm-lock.yaml`.
- QA: nenhum arquivo; verificação por comando e por PR de teste.

## Critérios de aceite
- [ ] `pnpm knip` roda localmente sem achados no estado atual.
- [ ] O workflow roda numa PR para `develop` e fica verde.
- [ ] Um export sem uso adicionado de propósito num pacote faz o passo do Knip
      falhar (prova; não commitar).
- [ ] Um erro de lint faz o passo do Biome falhar (prova; não commitar).

## Casos que o QA deve cobrir
- As duas provas de falha (Knip e Biome), num worktree descartável.
- Conferir que o workflow não usa `push --force` nem escreve em `main`/`develop`
  (D73).
