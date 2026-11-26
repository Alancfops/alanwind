# 030. Core: tipagem estrita do `look`

- **Status**: bloqueada — aguarda aprovação de `docs/specs/sintaxe.md` (seção de
  tipos, a escrever)
- **Fase**: 1
- **Branch**: feature/core-tipagem-estrita
- **Depende de**: 022, 023, 024, 025, 026, 027, 028
- **Paralelo com**: 041, 042, 043, 044
- **Spec**: `docs/specs/sintaxe.md` §1.10
- **Decisões**: D20, D35, D66

## Objetivo
Gerar, a partir da fonte única do vocabulário (sem lista copiada), o tipo
TypeScript que dá autocomplete e erro de tipo para classes inválidas no `look`.

## Escopo
- Faz: tipos derivados do registro da `021`, no nível de garantia que a spec
  definir.
- Não faz: ligar o tipo na prop dos componentes (`054`).

## Arquivos permitidos
- Implementador: `packages/core/src/types/**`, `packages/core/src/index.ts`.
- QA: `packages/core/test/types.test-d.ts` (ou `types.test.ts` com
  `expectTypeOf`).

## Critérios de aceite
- [ ] Classe válida é aceita; classe inválida é erro de tipo, para os exemplos
      da spec.
- [ ] Nenhuma classe é listada à mão nos tipos: tudo vem do registro (skill
      `codigo-limpo`, seção 3).
- [ ] `pnpm typecheck` continua rápido o bastante (limite a definir na spec, se
      houver).

## Casos que o QA deve cobrir
- `'pad-4'`, `'row center gap-4 pad-4'`, `'hover(bg-raised shadow-md)'`:
  aceitos.
- `'pad-17'`, `'bg-banana'`, `'hover:bg-x'`: erro de tipo
  (`// @ts-expect-error`).

## Lacunas que bloqueiam
- O que a tipagem garante numa string com vários tokens e variantes: o
  TypeScript tem limite de recursão em template literal types. Opções: validar
  só o primeiro token, validar a string inteira até N tokens, ou aceitar
  `string` com autocomplete. É decisão do Alan.
- Valor livre (`pad=10`, `bg=#e11d48`): como entra no tipo.
- "Erro ou aviso" (D20): na tipagem, é sempre erro de tipo?
