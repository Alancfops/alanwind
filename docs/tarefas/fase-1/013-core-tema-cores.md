# 013. Core: tema padrão, cores dos papéis

- **Status**: pronta (depois da 012)
- **Fase**: 1
- **Branch**: feature/core-tema-cores
- **Depende de**: 012
- **Paralelo com**: 011, 014, 041, 042, 043
- **Spec**: `docs/specs/tema.md` R1, R2, R5, R7 a R12, R19 a R21, R30, R31;
  seções 5.1 a 5.5, 6 e 7.1; critérios C1, C2, C3, C5, C7, C9
- **Decisões**: D20, D22, D24, D46 a D52, D91, D92, D93, D95, D99, D128 a D131

## Objetivo
Colocar no tema padrão as cores finais de todos os papéis, em claro e escuro,
com `-soft`, `-hover`, `on-`, `on-<papel>-soft` e o tom de `text-<papel>`, e
provar o contraste.

## Escopo
- Faz, com os valores **exatos** das tabelas (`#RRGGBB` maiúsculo):
  - fundos `page`, `surface`, `raised` (claro: `raised` = `#FFFFFF`, D128);
    textos `strong`, `body`, `muted`, `subtle`, `link`; bordas `subtle`,
    `strong`, `focus` (tabela 5.1);
  - `primary` e `secondary` com cor, `on-`, `-hover`, `-soft` e
    `on-<papel>-soft` (tabela 5.2, D130, D131);
  - `success`, `warning`, `danger`, `info`, com as mesmas cinco cores (tabela
    5.3, D91);
  - o tom de `text-<papel>` já calculado para `primary`, `success`, `warning`,
    `danger`, `info` (tabela 5.5, D92, D99). Sem `text-secondary` (D129).
- Não faz: recalcular `-soft`/`-hover`/`on-` (fase de tema, D99); paleta por
  tons (fase de tema, D118); aviso de contraste em runtime (D32, fora da
  fase 1); classes de cor (`025`).

## Arquivos permitidos
- Implementador: `packages/core/src/theme/colors/**`,
  `packages/core/src/theme/default-theme.ts` (o tema é um objeto só),
  `packages/core/src/index.ts`.
- QA: `packages/core/test/theme-colors.test.ts`,
  `packages/core/test/theme-contrast.test.ts` (o cálculo WCAG fica no próprio
  teste, pela fórmula da skill `checar-contraste`, sem função do `core`).

## Critérios de aceite
- [ ] Cada cor bate com as tabelas 5.1 a 5.5, nos dois esquemas (R7, C3, C9).
- [ ] Todos os pares da seção 6 passam: 4,5:1 nos textos, 3:1 em
      `border-focus` e `border-strong`, sem arredondar (R19, C1, C2).
- [ ] `text-subtle` e `border-subtle` ficam fora do teste de contraste (R10,
      R11).
- [ ] Não existe cor de texto para o `secondary` (R30).
- [ ] Os valores existem uma vez só e o tema é imutável.

## Casos que o QA deve cobrir
- Tabela papel × esquema → cor, copiada das tabelas 5.1 a 5.5.
- Cada linha da seção 7.1 que é valor de cor (todas, menos `text-secondary`,
  que fica com a `025`).
- Contraste percorrendo as tabelas 6.1 a 6.4, com a razão esperada no nome do
  caso; `text-muted` escuro sobre `raised` (4,51) incluído (seção 6.3).
- `on-warning` = `#3B2A00` nos dois esquemas (R8).
- `text-warning` claro = `#8A5A00` e não `#F2B200` (R9, seção 8).
- `-hover` com o `on-` do mesmo papel nos dois esquemas, inclusive
  `secondary-hover` e `secondary-soft` (C2).
