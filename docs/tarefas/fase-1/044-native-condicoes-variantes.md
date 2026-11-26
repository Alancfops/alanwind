# 044. Native: avaliação das condições (variantes)

- **Status**: bloqueada — aguarda aprovação de `docs/specs/emissor-native.md` e
  `docs/specs/funcionamento-interno.md`
- **Fase**: 1
- **Branch**: feature/native-condicoes
- **Depende de**: 010, 040
- **Paralelo com**: 041, 042, 043
- **Spec**: `docs/specs/emissor-native.md` §1 (estados); `docs/specs/sintaxe.md`
  §1.4
- **Decisões**: D37, D59, D61

## Objetivo
Dado a IR e o contexto atual (esquema, faixa de tela, plataforma, estados de
interação), decidir quais declarações valem.

## Escopo
- Faz: `press` vale com o estado `pressed` (D59); `hover` vale só com ponteiro e
  hover ativo (D59); `medium` vale em `medium` e `expanded`, `expanded` só em
  `expanded` (D37); `ios`/`android`/`web` pela plataforma; `dark` pelo esquema.
- Não faz: ler o contexto (`040`); ligar estados de `Pressable` (`053`).

## Arquivos permitidos
- Implementador: `packages/native/src/emit/conditions.ts`,
  `packages/native/src/emit/index.ts`.
- QA: `packages/native/test/emit-conditions.test.ts`.

## Critérios de aceite
- [ ] Para cada combinação de contexto da tabela da spec, o conjunto de
      declarações ativas é o esperado.
- [ ] Sem ponteiro, `hover(...)` nunca vale, mesmo pressionado (D59).

## Casos que o QA deve cobrir
- `col medium(row)` em `compact` → coluna; em `medium` e `expanded` → linha
  (D37).
- `bg-primary hover(bg-primary-hover) press(bg-primary-hover)`: tocado sem
  ponteiro → só `press` (D59).
- `ios(pad-6)` em `android` → sem efeito.
- `dark(bg-surface)` em claro e escuro.

## Lacunas que bloqueiam
- Formato das condições na IR (`010`).
- Ver `040` (ponteiro, limites de largura).
- Ordem de prioridade quando duas variantes ativas definem a mesma propriedade
  (ver `029`).
