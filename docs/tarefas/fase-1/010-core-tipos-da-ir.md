# 010. Core: tipos da IR

- **Status**: bloqueada — aguarda aprovação de
  `docs/specs/funcionamento-interno.md`
- **Fase**: 1
- **Branch**: feature/core-ir-tipos
- **Depende de**: 002
- **Paralelo com**: 011, 012, 040
- **Spec**: `docs/specs/funcionamento-interno.md` (regras a numerar; hoje só a
  seção 1 "Já definido")
- **Decisões**: D15, D58, D60, D65

## Objetivo
Fechar em TypeScript o formato da IR, o contrato entre o parser e os emissores.
Nenhuma tarefa de emissor começa antes desta (skill `codigo-limpo`, seção 1).

## Escopo
- Faz: os tipos exportados da IR exatamente como a spec definir, imutáveis
  (`readonly`), com uniões discriminadas; inclui o que a spec disser sobre
  especificidade, ordem de escrita (D58) e condições (variantes).
- Não faz: parser, vocabulário, emissores, aplicação da regra de conflito.

## Arquivos permitidos
- Implementador: `packages/core/src/ir/**`, `packages/core/src/index.ts`.
- QA: `packages/core/test/ir.test.ts` (testes de tipo com `expectTypeOf` do
  Vitest).

## Critérios de aceite
- [ ] Os tipos exportados batem campo a campo com a gramática/tipos da
  `funcionamento-interno.md` aprovada.
- [ ] A IR carrega especificidade e ordem de escrita de cada declaração (D58).
- [ ] A IR não contém nada específico de RN nem de CSS (serve aos dois
      emissores, D65).
- [ ] `pnpm typecheck` e `pnpm test` passam; Knip limpo.

## Casos que o QA deve cobrir
- Um valor de exemplo de IR para cada exemplo da `funcionamento-interno.md` é
  aceito pelo tipo (`expectTypeOf`).
- Formas inválidas (campo faltando, discriminante errado) são rejeitadas pelo
  tipo (`// @ts-expect-error`).

## Lacunas que bloqueiam (de `funcionamento-interno.md`, seção 2)
- O formato da IR em si (tipos, campos, variantes e condições).
- Se a IR representa saídas que não são estilo (`lines-2` → `numberOfLines`,
  `tap-target`).
- Onde a regra de conflito é aplicada (parser, IR ou emissor). Muda a `029`.
- Como erros e avisos são transportados (muda a `011`).
