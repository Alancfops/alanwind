# 011. Core: diagnósticos (códigos de erro e aviso)

- **Status**: bloqueada — aguarda aprovação de `docs/specs/sintaxe.md` (códigos
  e mensagens) e `docs/specs/funcionamento-interno.md` (transporte)
- **Fase**: 1
- **Branch**: feature/core-diagnosticos
- **Depende de**: 002
- **Paralelo com**: 010, 012, 040
- **Spec**: `docs/specs/sintaxe.md` §1.9 item 3, §1.10;
  `docs/specs/funcionamento-interno.md` §2
- **Decisões**: D35, D58, D66

## Objetivo
Definir num só lugar os códigos de erro e aviso do alanwind (`AW###`) e o tipo
que os carrega, para parser, vocabulário e emissores usarem o mesmo catálogo.

## Escopo
- Faz: catálogo de códigos com mensagem em inglês (D7, skill `codigo-limpo`),
  tipo do diagnóstico (código, mensagem, posição, severidade, se a spec definir)
  e a forma de devolver diagnósticos junto do resultado, como a spec definir.
- Não faz: decidir quando cada erro acontece (cada tarefa de parser/vocabulário
  emite o seu); exibir aviso no console (borda, `native`).

## Arquivos permitidos
- Implementador: `packages/core/src/diagnostics/**`,
  `packages/core/src/index.ts`.
- QA: `packages/core/test/diagnostics.test.ts`.

## Critérios de aceite
- [ ] Todo código listado na spec existe no catálogo, com a mensagem exata da
      spec.
- [ ] Nenhum código fora da spec.
- [ ] O `core` não lê `__DEV__`, `process.env` nem nada de plataforma para
      decidir dev/produção (D35 + skill `codigo-limpo`): o modo chega como
      entrada, se a spec assim definir.

## Casos que o QA deve cobrir
- Tabela código → mensagem, copiada da spec.

## Lacunas que bloqueiam
- `sintaxe.md` §2: "Códigos e textos das mensagens de erro".
- `funcionamento-interno.md` §2: "Como erros e avisos são representados e
  transportados".
- D35 diz "aviso **ou** erro em desenvolvimento": falta decidir qual, por caso.
- Como o `core` sabe se está em desenvolvimento ou produção (entrada da função?
  opção?).
