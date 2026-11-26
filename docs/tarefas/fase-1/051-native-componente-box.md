# 051. Native: componente `Box`

- **Status**: bloqueada — aguarda `docs/specs/componentes.md` sair do rascunho
  e ser aprovada
- **Fase**: 1
- **Branch**: feature/native-box
- **Depende de**: 045, 050
- **Paralelo com**: 052, 053
- **Spec**: `docs/specs/componentes.md` seção 1 (`Box`, `look`, herança,
  acessibilidade)
- **Decisões**: D26, D27, D53, D57, D62, D113, D114, D115

## Objetivo
`<Box look="...">`: um `View` do RN com o `look` resolvido, sempre flex em
coluna, somando ao `style` da pessoa e repassando texto aos filhos.

## Escopo
- Faz: prop `look` (D27); flex em coluna por padrão (D62); `style` da pessoa
  vence o `look` (D53); repassa texto pelo contexto da `050` (D57, D113);
  aceita todas as props de `View` e repassa o `ref`; sem papel de
  acessibilidade forçado (D115); funciona via react-native-web (D26).
- Não faz: tipo da prop com autocomplete (`054`); estados de interação (só no
  `Pressable`).

## Arquivos permitidos
- Implementador: `packages/native/src/components/Box.tsx`,
  `packages/native/src/index.ts`.
- QA: `packages/native/test/Box.test.tsx` (Jest, D114).

## Critérios de aceite
- [ ] `<Box />` sem `look` já é flex em coluna (D62).
- [ ] `<Box look="row">` vira linha.
- [ ] `<Box look="pad-4" style={{ paddingTop: 2 }}>` → `paddingTop: 2` e os
      outros lados 16 (o `style` vence, D53).
- [ ] O `ref` chega ao `View`; nenhum `accessibilityRole` padrão (D115).

## Casos que o QA deve cobrir
- Os critérios acima, com o estilo final exato.
- `<Box look="text-on-danger"><Text>Ok</Text></Box>` → texto com a cor
  `on-danger` (D57).
- `<Box look="dark(bg-surface)">` com `setColorScheme('dark')`.

## Lacunas que bloqueiam (`componentes.md` seção 2)
- `hover(...)`, `press(...)`, `focus(...)` e `disabled(...)` num `Box` (sem
  estado de interação): ignorados com aviso em dev, como no `styled()` (D53,
  item 3)? A spec só diz isso do `styled()`.
