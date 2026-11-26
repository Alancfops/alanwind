# 013. Core: tema padrão, cores dos papéis

- **Status**: bloqueada — aguarda aprovação de `docs/specs/tema.md`
- **Fase**: 1
- **Branch**: feature/core-tema-cores
- **Depende de**: 012
- **Paralelo com**: 014, 015, 020
- **Spec**: `docs/specs/tema.md` §1.1, §1.2, §1.6, §1.7
- **Decisões**: D20, D22, D24, D25, D33, D46 a D52

## Objetivo
Colocar no tema padrão as cores de todos os papéis, nos esquemas claro e escuro,
com `-soft`, `-hover` e `on-`, todas passando no contraste AA.

## Escopo
- Faz: papéis `primary`, `secondary`, `success`, `warning`, `danger`, `info`;
  fundos `page`, `surface`, `raised`; textos `strong`, `body`, `muted`,
  `subtle`, `link`; bordas `subtle`, `strong`, `focus`. Valores **finais** da
  spec, claro e escuro, com `-soft`, `-hover` e o par `on-` de cada papel
  colorido.
- Não faz: recalcular `-soft`/`-hover`/`on-` a partir de uma cor nova (só
  necessário com tema customizável, fora da fase 1, D66); aviso de contraste em
  runtime (D32, fora da fase 1); paleta por tons (`015`).

## Arquivos permitidos
- Implementador: `packages/core/src/theme/colors/**`,
  `packages/core/src/index.ts`.
- QA: `packages/core/test/theme-colors.test.ts`,
  `packages/core/test/theme-contrast.test.ts` (o cálculo WCAG fica no próprio
  teste, pela fórmula da skill `checar-contraste`, independente do código).

## Critérios de aceite
- [ ] Cada cor bate com a tabela final da spec, nos dois esquemas.
- [ ] Todos os pares da skill `checar-contraste` passam: texto 4,5:1,
      `border-focus` 3:1, nos dois esquemas.
- [ ] `text-on-warning` é escuro nos dois esquemas (D47).
- [ ] No escuro, `-hover` é mais claro que o papel; no claro, mais escuro (D22,
      D24).

## Casos que o QA deve cobrir
- Tabela papel × esquema → cor, copiada da spec.
- Teste de contraste percorrendo todos os pares da skill `checar-contraste`, com
  a razão de cada par no nome do caso.
- `warning` com texto escuro (D47).

## Lacunas que bloqueiam (de `tema.md`, seção 2)
- Valores **finais** de todas as cores (os de D46 a D52 são ilustrativos);
  `success`, `warning`, `danger` e `info` não têm nem valor ilustrativo.
- Valores de `border-strong`, `border-focus`, `text-link`, `text-subtle`.
- Qual texto vai sobre `-soft` (D46 dá exemplo só para `primary`: `-soft` tem
  texto próprio?).
- Se o tema padrão guarda hex prontos ou referências à paleta por tons
  (`blue-40`), o que decide se a `015` é pré-requisito.
