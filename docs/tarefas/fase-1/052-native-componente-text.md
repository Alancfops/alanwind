# 052. Native: componente `Text`

- **Status**: bloqueada — aguarda aprovação de `docs/specs/componentes.md`
- **Fase**: 1
- **Branch**: feature/native-text
- **Depende de**: 045, 050
- **Paralelo com**: 051, 053
- **Spec**: `docs/specs/componentes.md` §1
- **Decisões**: D27, D53, D57

## Objetivo
`<Text look="...">`: o `Text` do RN com o `look` resolvido, recebendo as classes
de texto herdadas, com o próprio `look` vencendo.

## Escopo
- Faz: prop `look`; combina herdado + próprio (D57); `style` vence o `look`
  (D53); escala de fonte do sistema (seção 5 da visão, via `042`); todas as
  props de `Text` e o `ref`.
- Não faz: tipagem estrita da prop (`054`).

## Arquivos permitidos
- Implementador: `packages/native/src/components/Text.tsx`,
  `packages/native/src/index.ts`.
- QA: `packages/native/test/Text.test.tsx`.

## Critérios de aceite
- [ ] Sem `look` nem pai com texto, usa o texto padrão do tema (se a spec
      definir um, ex.: `text-body type-base`).
- [ ] Herdado + próprio combinados como na `050`.
- [ ] `style` vence o `look`.

## Casos que o QA deve cobrir
- Os casos da `050` agora com o componente real.
- `<Text look="type-lg" style={{ fontSize: 10 }}>` → `fontSize: 10` (D53).

## Lacunas que bloqueiam
- O `Text` tem cor e tamanho padrão (ex.: `text-body`, `type-base`) quando nada
  é herdado? Isso afeta o par claro/escuro: sem padrão, o texto fica preto no
  tema escuro.
- `lines-2` (`numberOfLines`) entra na fase 1?
