# 029. Regra de conflito entre classes (D58)

- **Status**: bloqueada — aguarda aprovação de `docs/specs/ir.md` (onde a regra
  é aplicada) e `docs/specs/sintaxe.md` §1.9
- **Fase**: 1
- **Branch**: feature/core-regra-de-conflito
- **Depende de**: 023, 025 (as famílias usadas nos casos de teste)
- **Paralelo com**: 022, 024, 026, 027, 028
- **Spec**: `docs/specs/sintaxe.md` §1.9; `docs/specs/ir.md`
- **Decisões**: D58

## Objetivo
Aplicar a regra de conflito: a mais específica vence; empate, vence a última
escrita; aviso em dev quando duas de mesma especificidade disputam a mesma
propriedade.

## Escopo
- Faz: os três itens da D58, no lugar que a `ir.md` definir.
- Não faz: nada de RN; se a spec decidir que a regra vive no emissor, esta
  tarefa muda de pacote (ver lacunas).

## Arquivos permitidos
- Implementador: `packages/core/src/resolve/conflict.ts` (se a regra ficar no
  core). Se a spec decidir pelo emissor, o planejador reescreve esta tarefa.
- QA: `packages/core/test/conflict.test.ts`.

## Critérios de aceite
- [ ] Todos os exemplos de conflito da spec produzem a saída exata.
- [ ] Dentro de variantes, a regra vale do mesmo jeito (se a spec confirmar).

## Casos que o QA deve cobrir
- `pad-4 pad-x-2` → eixo x = 8, demais = 16 (D58, item 1).
- `pad-x-2 pad-4` → o mesmo resultado (a especificidade vence a ordem) (D58).
- `pad pad-y pad-top` em ordens diferentes (D58).
- `bg-primary bg-surface` → `bg-surface`; aviso em dev (D58, itens 2 e 3).
- `bg-surface hover(bg-raised)`: não é conflito (condições diferentes), se a
  spec confirmar.

## Lacunas que bloqueiam
- `ir.md` §2: onde a regra é aplicada (parser, IR ou emissor).
- Conflito entre a mesma propriedade em variantes diferentes
  (`medium(pad-2) expanded(pad-4)`).
- Código do aviso (via `011`).
