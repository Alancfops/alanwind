# 014. Core: tema padrão, sombras

- **Status**: bloqueada — aguarda aprovação de `docs/specs/tema.md`
- **Fase**: 1
- **Branch**: feature/core-tema-sombras
- **Depende de**: 012
- **Paralelo com**: 013, 015, 020
- **Spec**: `docs/specs/tema.md` §1.5 (sombras)
- **Decisões**: D45, D50, D51

## Objetivo
Definir no tema os tokens `shadow-sm`, `shadow-md` e `shadow-lg` para os dois
esquemas, de forma neutra (sem propriedade de RN ou CSS).

## Escopo
- Faz: no claro, sombra real, mais suave no `sm` e mais forte no `lg`; no
  escuro, a elevação descrita na D45 (fundo mais claro, borda fina, sombra
  discreta), com os valores exatos da spec.
- Não faz: tradução para iOS/Android (`043`); classe `shadow-*` no vocabulário
  (`027`).

## Arquivos permitidos
- Implementador: `packages/core/src/theme/shadows/**`,
  `packages/core/src/index.ts`.
- QA: `packages/core/test/theme-shadows.test.ts`.

## Critérios de aceite
- [ ] Cada token bate com a tabela da spec nos dois esquemas.
- [ ] O token não usa nomes de propriedade de RN nem de CSS (é tema, não
      emissor).

## Casos que o QA deve cobrir
- Tabela token × esquema → valores, copiada da spec.

## Lacunas que bloqueiam
- `tema.md` §2: valores exatos das sombras.
- No escuro, `shadow-md` **troca o fundo** do elemento para `bg-raised`? E se o
  mesmo `look` tiver `bg-surface`? (Conflito entre a sombra e a cor de fundo;
  depende também da D58.)
- Cor e espessura da "borda fina" no escuro.
