# 002. Esqueleto dos pacotes `@alanwind/core` e `@alanwind/native`

- **Status**: pronta para começar (depois da 001)
- **Fase**: 1
- **Branch**: chore/repo-pacotes-core-native
- **Depende de**: 001
- **Paralelo com**: —
- **Spec**: nenhuma (fundação). Seção 14 de `docs/00-visao-e-decisoes.md`;
  ADR 0003 (Jest nos componentes)
- **Decisões**: D14, D20, D67, D68, D69, D74, D114, D121, D142

## Objetivo
Criar os dois pacotes da fase 1, vazios mas compiláveis, testáveis e
publicáveis, com a regra de dependência valendo.

## Escopo
- Faz:
  - `packages/core`: `package.json` com nome `@alanwind/core` (D68, D121),
    **sem `dependencies`** (D20), `tsconfig.json` estendendo a base, config do
    tsup e do Vitest, `src/index.ts`.
  - `packages/native`: `package.json` com nome `@alanwind/native`, dependência
    de `@alanwind/core` via `workspace:*` (única dependência permitida, por ser
    pacote interno), `react` e `react-native` como `peerDependencies` (skill
    `codigo-limpo`), versões alvo do Expo SDK 58 / RN 0.88 (D14);
    `tsconfig.json`, tsup, `src/index.ts`.
  - Testes no `native` com **duas ferramentas** (D114, ADR 0003): Vitest para
    TypeScript puro (emissores, cache) e Jest com `jest-expo` +
    `@testing-library/react-native` para componentes e hooks. Convenção de
    arquivos: Vitest pega `test/**/*.test.ts`; Jest pega `test/**/*.test.tsx`.
    O script `test` do pacote roda os dois.
  - `package.json` dos dois pacotes prontos para o Release (D142): sem
    `private`, com `exports`/`main`/`types` e `files` apontando para a saída do
    tsup, para que `pnpm -r publish` publique o pacote compilado.
  - Os dois pacotes compilam com tsup e rodam os testes (sem testes ainda, sem
    falhar).
- Não faz: nenhum código de domínio; pacote fachada `alanwind` (fase 2, D79);
  `css`, `vite-plugin`, `cdn`, `cli` (fases seguintes).

## Arquivos permitidos
- Implementador: `packages/core/**` e `packages/native/**` (só configuração e
  `src/index.ts`).
- QA: nenhum arquivo permanente; verificação por comando.
- Na raiz, só os arquivos da lista da D148, se precisar (`turbo.json`,
  `pnpm-lock.yaml`, `package.json`, `biome.json`). Fora dela, **pare e
  relate**: a mudança vai para a sessão principal.

## Critérios de aceite
- [ ] `pnpm run build`, `pnpm run typecheck`, `pnpm run test` e
      `pnpm exec biome ci .` passam com os dois pacotes.
- [ ] `packages/core/package.json` não tem `dependencies` nem
      `peerDependencies`.
- [ ] `packages/native/package.json` só tem `@alanwind/core` em `dependencies`;
      `react` e `react-native` em `peerDependencies`.
- [ ] O `test` do `native` roda o Vitest e o Jest; um teste `.test.ts` de
      exemplo roda só no Vitest e um `.test.tsx` só no Jest (prova; não
      commitar).
- [ ] `pnpm -r publish --dry-run` lista os dois pacotes com a saída do tsup e
      sem os fontes de teste.
- [ ] Um import de `react` colocado temporariamente em `packages/core/src` faz o
      `biome ci` falhar (prova da regra da 001; desfazer depois).

## Casos que o QA deve cobrir
- Os comandos dos critérios, com a saída registrada.
- A prova da regra de dependência (import proibido em `core` e import de
  `@alanwind/css` em `native`), feita num worktree descartável, sem commit.
- A prova das duas ferramentas de teste no `native`, no mesmo worktree.
