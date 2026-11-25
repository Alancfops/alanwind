# 015. Core: paleta base por tons (0 a 100)

- **Status**: bloqueada — aguarda aprovação de `docs/specs/tema.md` **e**
  confirmação de que entra na fase 1
- **Fase**: 1 (a confirmar)
- **Branch**: feature/core-tema-paleta
- **Depende de**: 012
- **Paralelo com**: 013, 014, 020
- **Spec**: `docs/specs/tema.md` §1.1
- **Decisões**: D33, D34

## Objetivo
Dada uma cor com alguns tons-âncora, calcular qualquer tom de 0 (preto) a 100
(branco), de forma pura e determinística.

## Escopo
- Faz: a paleta padrão e a função pura que devolve o tom `n` de uma cor, pelo
  algoritmo da spec.
- Não faz: classes com a paleta (proibido, D34); configuração pela pessoa.

## Arquivos permitidos
- Implementador: `packages/core/src/theme/palette/**`,
  `packages/core/src/index.ts`.
- QA: `packages/core/test/theme-palette.test.ts`.

## Critérios de aceite
- [ ] Tom 0 = preto e tom 100 = branco para qualquer cor (D33).
- [ ] Tons-âncora definidos voltam exatamente iguais.
- [ ] Tons intermediários batem com a tabela de exemplos da spec.

## Casos que o QA deve cobrir
- Extremos 0 e 100, âncoras, intermediários da tabela da spec, tom fora de 0–100
  (erro da spec).

## Lacunas que bloqueiam
- `tema.md` §2: algoritmo de interpolação dos tons.
- **Escopo**: a paleta só é necessária na fase 1 se (a) o tema padrão for
  escrito em tons (ver `013`) ou (b) a cor livre `bg=red-40` entrar na fase 1.
  Nenhuma das duas está decidida. Se não entrar, esta tarefa sai da fase 1.
