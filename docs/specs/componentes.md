# Spec: componentes

Status: **rascunho, só o já decidido** · Decisões de origem: D26, D27, D40, D41, D53, D54, D57, D60, D62

`Box`, `Text`, `Pressable` e demais componentes, `contentLook` e `styled()`.

## 1. Já definido

- **API principal no React Native: componentes do alanwind**, com a função de resolução por baixo (disponível para quem precisar). Os mesmos componentes funcionam na web via react-native-web (D26).
- Os componentes são o lugar da **acessibilidade por padrão** (ex.: `Pressable` com papel de botão e área mínima de toque) (D26).
- Prop de estilo: **`look`** (D27).
- **Lista** (D40): `Box`, `Text`, `Pressable`, `Image`, `ScrollView`, `TextInput`, `FlatList`, `Modal`, `Switch`, `SafeArea`. O resto é adicional.
- **Fase 1**: `Box`, `Text` e `Pressable` (D60).
- **`contentLook`** (D41): componentes com segunda área de estilo (`ScrollView`, `FlatList` e parecidos) aplicam `contentLook` ao `contentContainerStyle`.
- **`Box`** é sempre flex em coluna (D62).
- **Herança de texto** (D57): `Box` e `Pressable` repassam estilos de texto aos `Text` filhos; o `look` do próprio `Text` vence.
- **`styled()`** para componentes de terceiros (D41, D53):
  1. o `style` **vence** o `look` quando os dois conflitam;
  2. mais de uma área de estilo usa **mapa de props**: `styled(Lista, { contentContainerStyle: 'contentLook' })`;
  3. variantes de estado só funcionam se o componente informar o estado; senão são **ignoradas com aviso em dev**;
  4. tipos do componente original e `ref` são **preservados**.
- **Look padrão no `styled()`** (`styled(Botao, 'round-md pad-4')`): aprovado como **extra para fase posterior** (D54).

## 2. Ainda não definido

- Props e comportamentos de acessibilidade de cada componente.
- Comportamento de `Modal` (foco, botão voltar).
- Como `Pressable` e `Switch` expõem os estados para as variantes.
- Formato exato do mapa de props do `styled()`.
