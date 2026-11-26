# 052. Native: componente `Text`

- **Status**: bloqueada — aguarda `docs/specs/componentes.md` sair do rascunho
  e ser aprovada
- **Fase**: 1
- **Branch**: feature/native-text
- **Depende de**: 045, 050
- **Paralelo com**: 051, 053
- **Spec**: `docs/specs/componentes.md` seção 1 (`Text` padrão, herança,
  acessibilidade)
- **Decisões**: D27, D53, D57, D112, D113, D114, D115

## Objetivo
`<Text look="...">`: o `Text` do RN com o `look` resolvido, recebendo o texto
herdado, com o próprio `look` vencendo e um visual padrão do tema.

## Escopo
- Faz: prop `look`; visual padrão `text-body` + `type-base` quando nada é
  herdado nem escrito (D112); combina padrão + herdado + próprio, por
  propriedade (D113); `style` vence o `look` (D53); `lines-N` vira
  `numberOfLines` (props da IR); respeita a escala de fonte do sistema e não
  força papel de acessibilidade (D115); todas as props de `Text` e o `ref`.
- Não faz: tipo da prop com autocomplete (`054`).

## Arquivos permitidos
- Implementador: `packages/native/src/components/Text.tsx`,
  `packages/native/src/index.ts`.
- QA: `packages/native/test/Text.test.tsx` (Jest, D114).

## Critérios de aceite
- [ ] Sem `look` nem pai com texto: cor `text-body` (`#3B3B42` claro,
      `#C9C9CF` escuro) e `fontSize` 16 (D112).
- [ ] Herdado + próprio combinados como na `050`.
- [ ] `style` vence o `look`.
- [ ] `look="lines-2"` → `numberOfLines={2}`.

## Casos que o QA deve cobrir
- O padrão nos dois esquemas (D112).
- Os casos da `050`, agora com o componente real.
- `<Text look="type-lg" style={{ fontSize: 10 }}>` → `fontSize: 10` (D53).
- `<Text look="medium(lines-2) lines-4">` em `compact` e `medium`.
- `allowFontScaling` não é desligado (D115).
