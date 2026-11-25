# 002. Esqueleto dos pacotes `@alanwind/core` e `@alanwind/native`

- **Status**: pronta para começar (depois da 001)
- **Fase**: 1
- **Branch**: chore/repo-pacotes-core-native
- **Depende de**: 001
- **Paralelo com**: —
- **Spec**: nenhuma (fundação). Seção 14 de `docs/00-visao-e-decisoes.md`
- **Decisões**: D14, D20, D67, D68, D69, D74

## Objetivo
Criar os dois pacotes da fase 1, vazios mas compiláveis e testáveis, com a regra
de dependência valendo.

## Escopo
- Faz:
  - `packages/core`: `package.json` com nome `@alanwind/core` (D68), **sem
    `dependencies`** (D20), `tsconfig.json` estendendo a base, config do tsup e
    do Vitest, `src/index.ts`.
  - `packages/native`: `package.json` com nome `@alanwind/native`, dependência
    de `@alanwind/core` via `workspace:*` (única dependência permitida, por ser
    pacote interno), `react` e `react-native` como `peerDependencies` (skill
    `codigo-limpo`), versões alvo do Expo SDK 58 / RN 0.88 (D14);
    `tsconfig.json`, tsup, Vitest, `src/index.ts`.
  - Os dois pacotes compilam com tsup e rodam `vitest` (sem testes ainda, sem
    falhar).
- Não faz: nenhum código de domínio; pacote fachada `alanwind` (ver `055`);
  `css`, `vite-plugin`, `cdn`, `cli` (fases seguintes).

## Arquivos permitidos
- Implementador: `packages/core/**` e `packages/native/**` (só configuração e
  `src/index.ts`).
- QA: nenhum arquivo permanente; verificação por comando.

## Critérios de aceite
- [ ] `pnpm build`, `pnpm typecheck`, `pnpm test` e `pnpm lint` passam com os
      dois pacotes.
- [ ] `packages/core/package.json` não tem `dependencies` nem
      `peerDependencies`.
- [ ] `packages/native/package.json` só tem `@alanwind/core` em `dependencies`;
      `react` e `react-native` em `peerDependencies`.
- [ ] Um import de `react` colocado temporariamente em `packages/core/src` faz o
      `pnpm lint` falhar (prova da regra da 001; desfazer depois).

## Casos que o QA deve cobrir
- Os comandos dos critérios, com a saída registrada.
- A prova da regra de dependência (import proibido em `core` e import de
  `@alanwind/css` em `native`), feita num worktree descartável, sem commit.
