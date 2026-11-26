# 021. Core: registro único do vocabulário e resolução para IR

- **Status**: bloqueada — aguarda aprovação de `docs/specs/sintaxe.md` e
  `docs/specs/funcionamento-interno.md`
- **Fase**: 1
- **Branch**: feature/core-vocabulario-registro
- **Depende de**: 010, 020
- **Paralelo com**: 013, 014, 015
- **Spec**: `docs/specs/sintaxe.md` §1.3, §1.10;
  `docs/specs/funcionamento-interno.md`
- **Decisões**: D18, D20, D35, D58, D66

## Objetivo
Criar a fonte única do vocabulário (skill `adicionar-utilitario`, passo 1) e a
função pura `look string + tema → IR + diagnósticos`, ainda sem nenhuma família
de classes. As famílias (`022` a `027`) e as variantes (`028`) só se registram
aqui.

## Escopo
- Faz: a estrutura do registro (cada família num arquivo próprio em
  `vocabulary/`), com especificidade por classe (D58); a resolução da árvore da
  `020` para a IR da `010`; classe desconhecida → diagnóstico da spec e ignorada
  em produção (D35); sugestão de classe parecida, **se a spec definir o
  critério**.
- Não faz: nenhuma classe concreta; regra de conflito (`029`); tipos de
  autocomplete (`030`).

## Arquivos permitidos
- Implementador: `packages/core/src/vocabulary/index.ts` (e arquivos de
  estrutura do registro), `packages/core/src/resolve/**`,
  `packages/core/src/index.ts`.
- QA: `packages/core/test/resolve-unknown.test.ts`.

## Critérios de aceite
- [ ] Assinatura pública da resolução exatamente como a spec definir.
- [ ] Classe desconhecida gera o diagnóstico da spec em dev e é ignorada em
      produção, sem lançar exceção (D35).
- [ ] Adicionar uma família nova não exige mexer em parser nem em emissor (skill
      `codigo-limpo`, seção 1).

## Casos que o QA deve cobrir
- `bg-banana` (com o registro de cores ainda vazio, qualquer classe é
  desconhecida): diagnóstico em dev, IR vazia em produção (D35).
- Entrada vazia → IR vazia, sem diagnóstico (se a spec confirmar).

## Lacunas que bloqueiam
- Assinatura pública da resolução (nome: `look`? `resolveLook`? D27 diz que a
  função "pode seguir o mesmo nome", sem decidir).
- Critério da sugestão "você quis dizer…?" (D35).
- Como o modo dev/produção chega ao `core` (ver `011`).
