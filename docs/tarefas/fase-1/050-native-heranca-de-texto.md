# 050. Native: herança de texto em cascata

- **Status**: bloqueada — aguarda `docs/specs/componentes.md` sair do rascunho
  e ser aprovada
- **Fase**: 1
- **Branch**: feature/native-heranca-texto
- **Depende de**: 045
- **Paralelo com**: 030, 046
- **Spec**: `docs/specs/componentes.md` seção 1 (herança de texto, herança em
  cascata); `docs/specs/emissor-native.md` seção 1 (herança)
- **Decisões**: D57, D113

## Objetivo
Mecanismo (contexto React) pelo qual `Box` e `Pressable` repassam as
propriedades de texto do seu `look` aos `Text` de dentro, em cascata, com a
mais próxima vencendo por propriedade.

## Escopo
- Faz:
  - O contexto de texto herdado e as funções para separar a parte de texto do
    estilo resolvido e para combinar herdado + próprio.
  - Cascata (D113): um `Box` interno repassa o que herdou somado ao que
    declara; a classe de texto mais próxima vence **por propriedade** (a cor
    do filho vence a do pai; o tamanho do pai continua).
  - Só o `look` é herdado; o `style` escrito à mão não (D113).
- Não faz: os componentes em si (`051` a `053`); o visual padrão do `Text`
  (`052`, D112).

## Arquivos permitidos
- Implementador: `packages/native/src/text-inheritance/**`.
- QA: `packages/native/test/text-inheritance.test.tsx` (Jest, D114).

## Critérios de aceite
- [ ] Propriedades de texto de um pai chegam ao `Text` filho (D57).
- [ ] O `look` do `Text` vence o herdado na mesma propriedade, e só nela
      (D57, D113).
- [ ] Propriedades que não são de texto (`padding*`, `backgroundColor`) não
      são herdadas.
- [ ] O `style` do pai não é herdado (D113).

## Casos que o QA deve cobrir
- Pai `bg-danger text-on-danger` + `Text` sem `look` → cor `on-danger` (D57).
- Pai `text-muted type-lg` + `Text look="text-strong"` → cor `strong`, tamanho
  `lg` (D113).
- Dois níveis: `Box look="type-lg"` > `Box look="text-muted"` > `Text` → cor
  `muted` e tamanho `lg` (D113).
- Pai com `style={{ color: ... }}` e sem `look` de texto → o `Text` não herda
  a cor (D113).

## Lacunas que bloqueiam (`componentes.md` seção 2)
- Lista exata das propriedades herdáveis (D57 diz "`text-*`, `type-*`,
  `weight-*` e afins"): entram `lineHeight`, `fontFamily`, `textAlign`,
  `fontStyle`, `textDecorationLine`, `textTransform`? E a prop
  `numberOfLines` (`lines-N`)?
- Texto dentro de variante de estado do pai (`press(text-on-primary)` num
  `Pressable`) é herdado, valendo com o estado do pai? (ver `053`)
