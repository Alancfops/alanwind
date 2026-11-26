# 012. Core: tema padrão, escalas e breakpoints

- **Status**: pronta (depois da 002)
- **Fase**: 1
- **Branch**: feature/core-tema-escalas
- **Depende de**: 002
- **Paralelo com**: 010
- **Spec**: `docs/specs/tema.md` R5, R13, R14, R16; seções 5.6, 5.8 e 7.2 (só
  escalas e breakpoints); critério C4
- **Decisões**: D43, D44, D49, D94, D98, D99

## Objetivo
Criar a estrutura do tema padrão (fonte única da verdade) com as escalas
não cromáticas e os breakpoints, para vocabulário e condições lerem daqui.

## Escopo
- Faz: o objeto do tema padrão, imutável, com os valores da seção 5.6 e 5.8:
  - espaçamento `0` a `16`, passo de 4 (`1` = 4, `4` = 16, `16` = 64) (D43);
  - tamanho: a mesma escala, mais `full` e `screen` (D98);
  - raios `none` 0, `sm` 4, `md` 8, `lg` 12, `xl` 16, `full` 9999 (D44, D98);
  - tipografia `xs` 12, `sm` 14, `base` 16, `lg` 18, `xl` 20, `2xl` 24,
    `3xl` 30 (D49);
  - peso `regular` 400, `medium` 500, `bold` 700 (D98);
  - altura de linha `tight` 1.25, `normal` 1.5, `loose` 1.75 (D98);
  - opacidade `0`, `25`, `50`, `75`, `100`, usada pelo elemento e pela cor
    (D98);
  - breakpoints `medium` 600 e `expanded` 840 (D94).
- Não faz: cores (`013`), sombras (`014`), mapeamento de família de fonte por
  plataforma (é do emissor, `042`, D133), configuração pela pessoa (fase de
  tema, D81, D99).

## Arquivos permitidos
- Implementador: `packages/core/src/theme/**` (exceto `colors` e `shadows`),
  `packages/core/src/index.ts`.
- QA: `packages/core/test/theme-scales.test.ts`.

## Critérios de aceite
- [ ] Cada valor bate com as tabelas 5.6 e 5.8 da spec.
- [ ] Os valores existem **uma vez** e são lidos daqui pelas outras tarefas
      (skill `codigo-limpo`, seção 3).
- [ ] O tema é imutável (`readonly`/`as const`) e não calcula nada (R5).

## Casos que o QA deve cobrir
- Espaçamento: `0`→0, `1`→4, `4`→16, `16`→64; `17` não existe (D43).
- Tamanho: `10`→40 (`h-10`, seção 7.2); `full` e `screen` existem.
- Raios: as seis entradas, `full` = 9999.
- Tipografia: as sete entradas; peso: as três; altura de linha: as três.
- Opacidade: os cinco valores; `30` não existe.
- Breakpoints: `medium` = 600 e `expanded` = 840. As linhas de largura
  599/600/839/840 da seção 7.2 ficam com a `028` (átomo) e a `040` (faixa).
