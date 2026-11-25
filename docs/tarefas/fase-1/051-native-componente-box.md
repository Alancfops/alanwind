# 051. Native: componente `Box`

- **Status**: bloqueada — aguarda aprovação de `docs/specs/componentes.md`
- **Fase**: 1
- **Branch**: feature/native-box
- **Depende de**: 045, 050
- **Paralelo com**: 052, 053
- **Spec**: `docs/specs/componentes.md` §1
- **Decisões**: D26, D27, D53, D57, D62

## Objetivo
`<Box look="...">`: um `View` do RN com o `look` resolvido, sempre flex em
coluna, somando ao `style` da pessoa e repassando classes de texto aos filhos.

## Escopo
- Faz: prop `look` (D27); flex em coluna por padrão (D62); `style` da pessoa
  vence o `look` (D53, seção 3.3 da visão); repassa texto pelo contexto da `050`
  (D57); aceita todas as props de `View` e repassa o `ref` (seção 3.3).
- Não faz: tipagem estrita da prop (`054`); `hover`/`press` (só no `Pressable`,
  salvo decisão contrária).

## Arquivos permitidos
- Implementador: `packages/native/src/components/Box.tsx`,
  `packages/native/src/index.ts`.
- QA: `packages/native/test/Box.test.tsx`.

## Critérios de aceite
- [ ] `<Box />` sem `look` já é flex em coluna (D62).
- [ ] `<Box look="row">` vira linha.
- [ ] `<Box look="pad-4" style={{ padding: 2 }}>` → `padding: 2` (o `style`
      vence, D53).
- [ ] O `ref` chega ao `View`.
- [ ] Funciona via react-native-web (D26).

## Casos que o QA deve cobrir
- Os quatro primeiros critérios, com o estilo final exato.
- `<Box look="text-on-danger"><Text>Ok</Text></Box>` → texto com a cor
  `on-danger` (D57).

## Lacunas que bloqueiam
- Props de acessibilidade padrão do `Box` (`componentes.md` §2).
- `hover(...)` num `Box` (sem estado de interação) é ignorado com aviso?
  (Paralelo com a D53, item 3.)
