# 003. Knip no CI

- **Status**: pronta para começar (depois da 002)
- **Executor**: sessão principal (`knip.json` e `package.json` ficam na raiz; o
  hook do `implementador` não libera)
- **Fase**: 1
- **Branch**: chore/repo-knip
- **Depende de**: 002
- **Paralelo com**: 004
- **Spec**: nenhuma (fundação). Workflow em `.github/workflows/ci.yml`
- **Decisões**: D69, D74, D141

## Objetivo
Ligar o Knip (código, exports, arquivos e dependências sem uso) no CI. O
workflow já existe (D141) e roda `pnpm exec knip` sozinho quando há um
`knip.json` na raiz; falta a configuração e a prova de que ele falha.

## Escopo
- Faz:
  - `knip.json` na raiz com os workspaces `packages/*` e `apps/*`, os arquivos
    de teste como entrada e as configs de tsup, Vitest e Jest reconhecidas.
  - Knip como `devDependency` da raiz e script `knip` no `package.json`.
- Não faz: mexer no `ci.yml` ou no `release.yml` (D141, D142); publicação.

## Arquivos permitidos
- Implementador (sessão principal): `knip.json`, `package.json` (raiz, só para
  adicionar Knip e o script), `pnpm-lock.yaml`.
- QA: nenhum arquivo; verificação por comando e pela PR.

## Critérios de aceite
- [ ] `pnpm exec knip` roda localmente sem achados no estado atual.
- [ ] Na PR, o passo "Dead code and files (Knip)" do job `Code` roda (não é
      pulado) e fica verde.
- [ ] Um export sem uso adicionado de propósito num pacote faz o Knip falhar
      (prova; não commitar).
- [ ] Um arquivo não importado por ninguém num pacote faz o Knip falhar (prova;
      não commitar).
- [ ] Uma `devDependency` sem uso num pacote faz o Knip falhar (prova; não
      commitar).

## Casos que o QA deve cobrir
- As três provas de falha, num worktree descartável.
- Conferir que os arquivos de teste do Vitest e do Jest do `native` não
  aparecem como arquivos mortos.

## Observação
- Se a `004` entrar antes, o `knip.json` já precisa cobrir o app. Se entrar
  depois e o app exigir ajuste no `knip.json`, o implementador da `004` relata
  e a sessão principal ajusta.
