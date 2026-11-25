# 012. Core: tema padrão, escalas

- **Status**: bloqueada — aguarda aprovação de `docs/specs/tema.md`
- **Fase**: 1
- **Branch**: feature/core-tema-escalas
- **Depende de**: 002
- **Paralelo com**: 010, 011, 040
- **Spec**: `docs/specs/tema.md` §1.5
- **Decisões**: D43, D44, D49

## Objetivo
Criar a estrutura do tema padrão (fonte única da verdade) com as escalas
não-cromáticas: espaçamento, raios e tamanhos de texto.

## Escopo
- Faz: o objeto do tema padrão no formato da spec, com:
  - espaçamento `0` a `16`, passo de 4 (`1` = 4, `4` = 16, `16` = 64) (D43);
  - raios `none` 0, `sm` 4, `md` 8, `lg` 12, `xl` 16, `full` (D44);
  - tamanhos de texto `xs` 12, `sm` 14, `base` 16, `lg` 18, `xl` 20, `2xl` 24,
    `3xl` 30; fonte padrão do sistema (D49);
  - pesos, alturas de linha e opacidades **só se a spec definir os valores**.
- Não faz: cores (`013`), sombras (`014`), paleta (`015`), configuração pela
  pessoa (fora da fase 1, D66), atalhos `define` (ver perguntas).

## Arquivos permitidos
- Implementador: `packages/core/src/theme/**` (exceto `colors`, `shadows`,
  `palette`), `packages/core/src/index.ts`.
- QA: `packages/core/test/theme-scales.test.ts`.

## Critérios de aceite
- [ ] Cada valor de escala bate com a tabela da spec.
- [ ] Os valores existem **uma vez** e são lidos daqui pelas outras tarefas
      (skill `codigo-limpo`, seção 3).
- [ ] O tema é imutável (`readonly`/`as const`).

## Casos que o QA deve cobrir
- Espaçamento: `0`→0, `1`→4, `4`→16, `16`→64; `17` não existe (D43).
- Raios: as seis entradas (D44), incluindo como a spec representar `full`.
- Tipografia: as sete entradas (D49).

## Lacunas que bloqueiam (de `tema.md`, seção 2)
- Formato do objeto de tema (o formato de `alanwind.config.ts`/`defineTheme`
  também define o formato interno?).
- Valor de `round-full` no tema (número grande? marcador?).
- Escala de pesos (`weight-*`), alturas de linha (`leading-*`) e opacidades
  (`opacity-*`).
- Escala de tamanho (`w-*`, `h-*`, `size-*`): é a mesma do espaçamento?
- Valores dos breakpoints `medium` e `expanded` (necessários para a
  `040`/`044`).
