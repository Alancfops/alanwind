# 055. Native: árvores de componentes com herança (integração)

- **Status**: pronta (depois da 051, 052 e 053)
- **Fase**: 1
- **Branch**: test/native-arvores-componentes
- **Depende de**: 051, 052, 053
- **Paralelo com**: 054, 060
- **Spec**: `docs/specs/componentes.md` R11, R19, R20, R26, R28 a R31, seção
  5.3 e critérios da seção 7 sobre herança
- **Decisões**: D57, D112, D113, D163, D164, D165, D166

## Objetivo
Conferir com os componentes reais as árvores da seção 5.3 da `componentes.md`
(`Box`, `Pressable` e `Text` juntos), que nenhuma das tarefas 050 a 053
consegue testar sozinha, porque cada uma usa só o próprio componente.

## Escopo
- Faz: testes de ouro das onze linhas da seção 5.3, com `Box`, `Pressable` e
  `Text` reais. Se um teste falhar, o implementador corrige no componente ou
  na herança, dentro dos arquivos da 050 a 053.
- Não faz: comportamento novo; testes já cobertos por componente isolado
  (`050` a `053`).

## Arquivos permitidos
- Implementador: só correções em `packages/native/src/text-inheritance/**`
  e `packages/native/src/components/**`, se algum teste falhar.
- QA: `packages/native/test/component-trees.test.tsx` (Jest, `jest-expo` e
  `@testing-library/react-native`, D114, R34).

## Critérios de aceite
- [ ] Cada linha da seção 5.3 dá o estilo achatado exato do `Text`
      (`StyleSheet.flatten`).
- [ ] A cascata da R29 vale com três níveis reais (`Box` > `Box` > `Text`).

## Casos que o QA deve cobrir
- Seção 5.3, linha a linha:
  - `<Pressable look="bg-danger text-on-danger"><Text/></Pressable>` claro
    → `{ color: '#FFFFFF', fontSize: 16 }`; escuro →
    `{ color: '#450A0A', fontSize: 16 }` (R26, R28);
  - `<Box look="text-muted type-lg"><Text look="text-strong"/></Box>` →
    `{ color: '#141416', fontSize: 18 }` (R29);
  - `<Box look="type-lg"><Box look="text-muted"><Text/></Box></Box>` →
    `{ color: '#6B6B74', fontSize: 18 }` (R29);
  - `<Box look="pad-4 bg-surface"><Text/></Box>` → o padrão (R28);
  - `<Box style={{ color: 'red' }}><Text/></Box>` → o padrão (R30);
  - `<Box look="leading-normal"><Text look="type-lg"/></Box>` →
    `lineHeight: 27` (R20);
  - `<Text look="type-lg">Olá <Text look="weight-bold">mundo</Text></Text>`
    → o de dentro `{ color: '#3B3B42', fontSize: 18, fontWeight: '700' }`
    (R19, D164);
  - `<Pressable look="bg-primary text-on-primary press(text-strong)">`
    com `Text` filho, pressionado → `{ color: '#141416', fontSize: 16 }`;
    solto → `{ color: '#FFFFFF', fontSize: 16 }` (R26, D165);
  - `<Box look="hover(text-strong)"><Text/></Box>` → o padrão (R12).
- `<Box look="lines-2"><Text/></Box>`: o `Text` não recebe
  `numberOfLines` (R31, D163).
