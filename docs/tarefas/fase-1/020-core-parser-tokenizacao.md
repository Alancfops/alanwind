# 020. Core: parser, tokenização e grupos de variante

- **Status**: bloqueada — aguarda aprovação de `docs/specs/sintaxe.md`
- **Fase**: 1
- **Branch**: feature/core-parser-tokenizacao
- **Depende de**: 011
- **Paralelo com**: 010, 012, 013, 014, 015
- **Spec**: `docs/specs/sintaxe.md` §1.3, §1.4, §1.5 (só a forma do `=`),
  gramática EBNF (a escrever)
- **Decisões**: D17, D18, D28, D30

## Objetivo
Transformar a string do `look` numa árvore sintática: tokens separados por
espaço, grupos `variante(...)` com vários tokens, valor livre com `=`, com erro
e posição para entrada malformada. Não conhece o vocabulário.

## Escopo
- Faz: tokenização pela EBNF da spec; grupos com parêntese (D28) com vários
  tokens (D18); separação `nome=valor` (D30); rejeição de `hover:bg-x` (D28) com
  o código da spec; aninhamento conforme a spec decidir.
- Não faz: saber se `pad-4` ou `hover` existem (`021`, `028`); gerar IR.

## Arquivos permitidos
- Implementador: `packages/core/src/parser/**`, `packages/core/src/index.ts` (se
  a spec tornar a árvore pública; senão, só interno).
- QA: `packages/core/test/parser-syntax.test.ts`.

## Critérios de aceite
- [ ] Todos os exemplos de sucesso da spec produzem exatamente a árvore
      esperada.
- [ ] Todos os exemplos de erro produzem o código e a posição da spec.
- [ ] Função pura: a mesma entrada dá a mesma saída (D15).

## Casos que o QA deve cobrir
- `pad-4`, `row center gap-4 pad-4` (D27), `hover(bg-raised shadow-md)` (D28,
  D18), `w=137`, `pad=10`, `w=50%` (D30), `bg=#e11d48` (D33).
- `hover:bg-x` → erro (D28).
- Entrada vazia, só espaços, espaços repetidos, parêntese não fechado, parêntese
  sobrando, grupo vazio `hover()`, `=` sem valor, `=` sem nome, aninhamento
  `dark(hover(...))`: resultado conforme a spec.

## Lacunas que bloqueiam (de `sintaxe.md`, seção 2)
- Gramática formal (EBNF) e tokenização exata (quais caracteres valem no valor
  livre? `#`, `%`, `.`, `-`?).
- Aninhamento de variantes (`dark(hover(...))`): permitido? em que ordem?
- Códigos de erro (via `011`).
- Comportamento em produção para sintaxe malformada: ignora o `look` inteiro ou
  só o token ruim (D35 fala só de papel inexistente).
