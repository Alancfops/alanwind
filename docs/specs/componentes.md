# Spec: componentes

Status: **em revisão** (estrutura completa; só restam as fases posteriores da
seção 8; aguarda o Alan) · Decisões de origem: D26, D27, D40, D41, D53, D54,
D57, D59, D60, D62, D78, D98, D103, D107, D110 a D115, D126, D157, D158,
D163 a D172

`Box`, `Text`, `Pressable` e demais componentes, herança de texto, `contentLook`
e `styled()`.

## 1. Escopo

Cobre, na **fase 1** (D60): os componentes `Box`, `Text` e `Pressable` do
pacote `native`.

- Comportamento comum: prop `look`, soma com o `style`, `ref` e props originais
  (D26, D27, D53).
- A **herança de texto** em cascata (D57, D113).
- O visual padrão do `Text` (D112).
- A **área de toque** e a **acessibilidade padrão** do `Pressable` (D78, D111,
  D115).
- Como os estados do `Pressable` chegam às variantes (D59, D103, D110).
- O tipo da prop `look` (D126).

Está descrito, mas **não é da fase 1** (seção 3.8): `Image`, `ScrollView`,
`TextInput`, `FlatList`, `Modal`, `Switch`, `SafeArea` (D40), `contentLook`
(D41), `styled()` (D41, D53) e o look padrão do `styled()` (D54).

Fica de fora: a tradução do estilo, as condições e o cache (`emissor-native.md`)
e a regra de conflito e precedência (`funcionamento-interno.md`).

## 2. Definições

| Termo | Significado |
|---|---|
| **`look`** | Prop com a string de classes (D27). |
| **`style`** | A prop de estilo original do React Native, escrita à mão. |
| **Estilo do look** | O estilo nativo que a resolução devolve (`emissor-native.md`). |
| **Base do componente** | Estilo que o componente põe sob o `look` (ex.: o padrão do `Text`). |
| **Propriedade de texto** | Propriedade do `StyleMap` herdável (R31): cor do texto, tamanho, peso, altura de linha, alinhamento, família, estilo, decoração e transformação. |
| **Texto herdado** | As propriedades de texto que um ancestral (`Box`, `Pressable`) repassa por contexto (D57). |
| **Próprio** | O que o `look` do próprio componente declara. |
| **Estados de interação** | `hover`, `press`, `focus`, `disabled` do `Pressable` (D59, D103). |
| **Área de toque** | Região que responde ao toque, incluindo o `hitSlop`. |

## 3. Regras normativas

### 3.1 Comum a `Box`, `Text` e `Pressable`

- **R1.** Cada componente DEVE aceitar a prop `look` (D27) e todas as props do
  componente original do React Native (`View`, `Text`, `Pressable`), além de
  repassar o `ref` para ele (D26, D53; D114 item de tipos).
- **R2.** O estilo final DEVE somar a base do componente, o estilo do `look` e o
  `style` da pessoa, nessa ordem. Achatado (`StyleSheet.flatten`), o `style`
  vence o `look`, propriedade a propriedade (D53). **Exceção conhecida** (D167):
  atalhos do RN no `style` (`padding`, `paddingHorizontal`, `margin`,
  `borderWidth`, `borderRadius`) NÃO vencem um lado específico vindo do `look`
  (`paddingTop`), porque o RN dá precedência ao lado específico. O alanwind NÃO
  DEVE normalizar o `style`; a documentação DEVE avisar.
- **R3.** Um componente sem `look`, ou com `look` vazio, NÃO DEVE acrescentar
  estilo além da base do componente.
- **R4.** O `look` DEVE ser resolvido pelo `useLook` do `native`, com o
  contexto atual (esquema, faixa de tela, plataforma) e os estados do
  componente, e DEVE ser resolvido de novo quando esse contexto mudar (D15, D64,
  D158; `emissor-native.md` R3, R6, R40).
- **R5.** As props do `look` (`numberOfLines`, de `lines-N`) DEVEM ser aplicadas
  ao componente; a que a pessoa passar explicitamente vence a do `look` (mesma
  ideia de R2, D53).
- **R6.** Diagnósticos do `look` seguem a borda do `native`: aparecem em dev e
  são ignorados em produção (D84; `emissor-native.md` R31).
- **R7.** Os componentes DEVEM funcionar na web via `react-native-web` com o
  mesmo código (D26).

### 3.2 `Box`

- **R8.** `Box` DEVE renderizar um `View` (D40).
- **R9.** `Box` DEVE ser sempre flex em coluna: a base do componente DEVE trazer
  `flexDirection: 'column'` explícito, abaixo do `look` e do `style`, que
  `row` no `look` e o `style` sobrepõem (D62, D168).
- **R10.** `Box` NÃO DEVE forçar papel de acessibilidade (D115).
- **R11.** `Box` DEVE repassar às crianças o texto herdado somado ao que o seu
  `look` declara (R28 a R31).
- **R12.** Variantes de estado (`hover`, `press`, `focus`, `disabled`) no `look`
  de um `Box` são ignoradas: o `Box` não informa estado e a camada NÃO vale
  (`emissor-native.md` R13). Em dev, a borda DEVE avisar, sem código `AW`,
  como no `styled()` (D166, D53).

### 3.3 `Text`

- **R13.** `Text` DEVE renderizar um `Text` do React Native (D40).
- **R14.** O estilo do texto DEVE seguir, por propriedade, da menor para a maior
  precedência: padrão do `Text` (`text-body` e `type-base`), texto herdado,
  `look` próprio, `style` (D112, D113, D53). O padrão só vale para a propriedade
  que nada herdado nem escrito define: com `type-lg` herdado e sem cor, o
  tamanho é 18 e a cor é a de `text-body` (D112).
- **R15.** O `look` do próprio `Text` vence o herdado, só na propriedade que
  declara (D57, D113).
- **R16.** `lines-N` no `look` DEVE chegar como `numberOfLines={N}` (D83, D77).
- **R17.** O `Text` DEVE respeitar a escala de fonte do sistema: NÃO DEVE
  desligar `allowFontScaling` (D115; `emissor-native.md` R22).
- **R18.** `Text` NÃO DEVE forçar papel de acessibilidade (D115).
- **R19.** O `Text` também DEVE repassar por contexto o texto herdado somado ao
  que declara. Assim um `Text` dentro de `Text` herda do de fora, e o padrão da
  R14 só vale quando nada é herdado (D164).
- **R20.** O `lineHeight` DEVE ser o tamanho de fonte **final** da R14 vezes o
  `Ratio` da IR, arredondado a duas casas: sem `type-*` em lugar nenhum, o
  tamanho é 16 (D112), então `leading-normal` dá 24 (D98, D113, D157;
  `emissor-native.md` R20).
- **R44.** Variantes de estado no `look` de um `Text` são ignoradas, com aviso
  da borda em dev e sem código `AW`, como no `Box` (R12, D166).

### 3.4 `Pressable`

- **R21.** `Pressable` DEVE renderizar um `Pressable` do React Native e aceitar
  `style` como objeto ou como função, como o original; o resultado vence o
  `look` (R2, D53).
- **R22.** **Estados** (D59, D103, D110):
  - `press` DEVE valer enquanto o `Pressable` está pressionado;
  - `hover` DEVE valer enquanto chegam os eventos `onHoverIn`/`onHoverOut`, que
    só ocorrem com ponteiro; sem ponteiro, nunca vale, nem pressionado;
  - `focus` DEVE valer com o foco do `Pressable`, vindo só de
    `onFocus`/`onBlur` (teclado e web); o foco de leitor de tela (TalkBack,
    VoiceOver) NÃO ativa `focus(...)` na fase 1 (D171);
  - `disabled` DEVE valer com a prop `disabled` ligada.
- **R23.** O `Pressable` NÃO DEVE perder os callbacks da pessoa
  (`onPressIn`, `onPressOut`, `onHoverIn`, `onHoverOut`, `onFocus`, `onBlur`,
  `onLayout`): DEVE chamá-los além de atualizar o próprio estado.
- **R24.** **Área mínima de toque** (D78, D111): a área de toque DEVE ter pelo
  menos 44 × 44 no iOS e na web e 48 × 48 no Android, aumentada com `hitSlop`,
  **sem mudar o visual**. Em cada eixo, se o tamanho é menor que o mínimo, cada
  lado DEVE receber `ceil((mínimo - tamanho) / 2)`; se já tem o mínimo, nenhum
  `hitSlop` é somado. Antes do primeiro `onLayout`, o `Pressable` NÃO DEVE
  somar `hitSlop`. Se a pessoa passar `hitSlop`, o dela vence, como o `style`
  sobre o `look` (D170).
- **R25.** **Acessibilidade padrão** (D115):
  - `accessibilityRole` DEVE ser `'button'` por padrão; se a pessoa passar
    `accessibilityRole` ou `role`, o padrão NÃO se aplica;
  - `accessibilityState.disabled` DEVE seguir a prop `disabled`, preservando as
    outras chaves de `accessibilityState` da pessoa;
  - na web, o `Pressable` com foco de teclado DEVE ter indicação visível de foco
    (D115): os componentes NÃO DEVEM remover o outline do navegador e NÃO têm
    anel padrão próprio; `focus(...)` personaliza (D169).
- **R26.** O `Pressable` DEVE repassar às crianças o texto herdado somado ao que
  o seu `look` declara, avaliado com o estado atual do `Pressable`:
  `press(text-on-primary)` vale para o `Text` filho enquanto o pai está
  pressionado (D165, D57).
- **R27.** `tap-target` e `focus-ring` NÃO existem nesta fase (D78).

### 3.5 Herança de texto (D57, D113)

- **R28.** `Box` e `Pressable` DEVEM repassar por contexto as propriedades de
  texto do seu `look` aos `Text` de dentro. Propriedades que não são de texto
  (`padding*`, `backgroundColor`, bordas) NÃO DEVEM ser herdadas.
- **R29.** **Cascata:** um `Box` interno DEVE repassar o que herdou somado ao
  que declara. A classe de texto mais próxima vence **por propriedade**: a cor
  do filho vence a do pai e o tamanho do pai continua valendo.
- **R30.** Só o `look` é herdado. O `style` escrito à mão NÃO DEVE ser herdado.
- **R31.** As propriedades herdáveis são `color`, `fontSize`, `fontWeight`,
  `lineHeight`, `textAlign`, `fontFamily`, `fontStyle`, `textDecorationLine` e
  `textTransform`; `numberOfLines` NÃO é herdado (D163).

### 3.6 Tipos (D126)

- **R32.** O tipo da prop `look` DEVE ser o do `core` (R52 da `sintaxe.md`):
  autocomplete das classes conhecidas e qualquer `string` aceita; sem erro de
  tipo para classe inválida (D126).
- **R33.** Os tipos das props originais (`onPress`, `accessibilityRole`,
  `hitSlop`, `ref`) DEVEM ser preservados e funcionar com a Strict TypeScript
  API do React Native 0.88 (D14).

### 3.7 Testes

- **R34.** Os testes de componentes usam `jest-expo` e
  `@testing-library/react-native` (D114, ADR 0003).

### 3.8 Fases posteriores (descrito, fora da fase 1)

- **R35.** Componentes da lista da D40 além dos três: `Image`, `ScrollView`,
  `TextInput`, `FlatList`, `Modal`, `Switch` e `SafeArea`. O que vier depois é
  adicional (D40).
- **R36.** **`contentLook`** (D41): `ScrollView`, `FlatList` e parecidos aplicam
  `contentLook` ao `contentContainerStyle`.
- **R37.** **`styled()`** para componentes de terceiros (D41, D53):
  1. o `style` vence o `look` quando os dois conflitam;
  2. mais de uma área de estilo usa **mapa de props**:
     `styled(Lista, { contentContainerStyle: 'contentLook' })`;
  3. variantes de estado só funcionam se o componente informar o estado; senão
     são ignoradas com aviso em dev;
  4. tipos do componente original e `ref` são preservados.
- **R38.** **Look padrão no `styled()`**
  (`styled(Botao, 'round-md pad-4')`): extra para fase posterior (D54).

## 4. Formato

Os nomes dos componentes são os da D40. Esboço dos tipos (as props nativas são
as do React Native):

```ts
import type { PressableProps, TextProps, ViewProps } from 'react-native';

/** Tipo da `030`: autocomplete + qualquer string (D126). */
type Look = LookString;

export interface BoxProps extends ViewProps {
  look?: Look;
}
export interface TextProps_ extends TextProps {
  look?: Look;
}
export interface PressableProps_ extends PressableProps {
  look?: Look;
}
```

Os sufixos `_` só evitam colidir com os tipos do React Native neste esboço; os
nomes exportados são da tarefa de tipos.

## 5. Exemplos

Contexto: `compact`, `ios`, claro, salvo quando dito. "Estilo" é o resultado de
`StyleSheet.flatten` do `style` recebido pelo componente nativo. Cores: D46,
D50, D51, D91.

### 5.1 `Box` e `style` (R2, R3, R9)

| Entrada | Estilo |
|---|---|
| `<Box />` | `{ flexDirection: 'column' }` |
| `<Box look="row">` | `{ flexDirection: 'row' }` |
| `<Box look="pad-4" style={{ paddingTop: 2 }}>` | `{ flexDirection: 'column', paddingTop: 2, paddingRight: 16, paddingBottom: 16, paddingLeft: 16 }` |
| `<Box look="dark(bg-surface)">` com `setColorScheme('dark')` | `{ flexDirection: 'column', backgroundColor: '#1E1E22' }` |
| `<Box look="hover(bg-raised)">` | `{ flexDirection: 'column' }` (aviso em dev, D166) |
| `<Box look="pad-4" style={{ padding: 2 }}>` | `{ flexDirection: 'column', padding: 2, paddingTop: 16, paddingRight: 16, paddingBottom: 16, paddingLeft: 16 }`: os lados do `look` valem (D167) |

### 5.2 `Text`: padrão e `look` (R14 a R16, R20)

| Entrada | Esquema | Estilo | Props |
|---|---|---|---|
| `<Text>Ok</Text>` | claro | `{ color: '#3B3B42', fontSize: 16 }` | — |
| `<Text>Ok</Text>` | escuro | `{ color: '#C9C9CF', fontSize: 16 }` | — |
| `<Text look="type-lg">` | claro | `{ color: '#3B3B42', fontSize: 18 }` | — |
| `<Text look="type-lg" style={{ fontSize: 10 }}>` | claro | `{ color: '#3B3B42', fontSize: 10 }` | — |
| `<Text look="leading-normal">` | claro | `{ color: '#3B3B42', fontSize: 16, lineHeight: 24 }` | — |
| `<Text look="lines-2">` | claro | `{ color: '#3B3B42', fontSize: 16 }` | `numberOfLines={2}` |
| `<Text look="medium(lines-2) lines-4">`, largura 599 | claro | igual ao padrão | `numberOfLines={4}` |
| `<Text look="medium(lines-2) lines-4">`, largura 700 | claro | igual ao padrão | `numberOfLines={2}` |

### 5.3 Herança (R28 a R31)

| Árvore | Estilo do `Text` |
|---|---|
| `<Pressable look="bg-danger text-on-danger"><Text/></Pressable>`, claro | `{ color: '#FFFFFF', fontSize: 16 }` |
| `<Pressable look="bg-danger text-on-danger"><Text/></Pressable>`, escuro | `{ color: '#450A0A', fontSize: 16 }` |
| `<Box look="text-muted type-lg"><Text look="text-strong"/></Box>`, claro | `{ color: '#141416', fontSize: 18 }` |
| `<Box look="type-lg"><Box look="text-muted"><Text/></Box></Box>`, claro | `{ color: '#6B6B74', fontSize: 18 }` |
| `<Box look="pad-4 bg-surface"><Text/></Box>` | o padrão (`padding` e fundo não são herdados) |
| `<Box style={{ color: 'red' }}><Text/></Box>` | o padrão (o `style` não é herdado, D113) |
| `<Box look="leading-normal"><Text look="type-lg"/></Box>` | `lineHeight: 27` (R20) |
| `<Text look="type-lg">Olá <Text look="weight-bold">mundo</Text></Text>`, claro | o `Text` interno: `{ color: '#3B3B42', fontSize: 18, fontWeight: '700' }` (R19, D164) |
| `<Pressable look="bg-primary text-on-primary press(text-strong)"><Text/></Pressable>`, claro, pressionado | `{ color: '#141416', fontSize: 16 }` (D165) |
| o mesmo, solto | `{ color: '#FFFFFF', fontSize: 16 }` |
| `<Box look="hover(text-strong)"><Text/></Box>` | o padrão: `hover` não vale no `Box` (R12) |

### 5.4 `Pressable` (R21 a R26)

Look: `bg-primary hover(bg-raised) press(bg-primary-hover)`, claro.

| Situação | `backgroundColor` |
|---|---|
| repouso | `'#2563EB'` |
| pressionado, sem evento de hover | `'#1D4FD8'` |
| evento de hover, sem pressionar | `'#FFFFFF'` |
| hover e pressionado | `'#1D4FD8'` |
| solto de novo | `'#2563EB'` |

| Entrada | Resultado |
|---|---|
| `look="disabled(opacity-50)"` com `disabled` | `opacity: 0.5` e `accessibilityState.disabled` verdadeiro |
| `look="disabled(opacity-50)"` sem `disabled` | sem `opacity`; `accessibilityState.disabled` falso |
| `look="focus(border-focus)"` com foco | `borderColor: '#2563EB'` |
| `<Pressable>` sem props | `accessibilityRole` igual a `'button'` |
| `<Pressable accessibilityRole="link">` | `accessibilityRole` igual a `'link'` |
| `<Pressable accessibilityState={{ selected: true }} disabled>` | `{ selected: true, disabled: true }` |
| `<Pressable look="w=20 h=20">` no iOS e na web, depois do layout | `hitSlop` com 12 em cada lado (20 + 24 = 44) |
| o mesmo no Android | `hitSlop` com 14 em cada lado (20 + 28 = 48) |
| `<Pressable look="w=60 h=60">` | nenhum `hitSlop` somado |
| `<Pressable look="w=20 h=20">`, antes do primeiro `onLayout` | nenhum `hitSlop` somado (D170) |
| `<Pressable look="w=20 h=20" hitSlop={4}>`, depois do layout | `hitSlop` igual a `4` (o da pessoa vence, D170) |

### 5.5 Tipos (R32, R33)

| Código | Resultado |
|---|---|
| `<Box look="pad-4" />` | compila |
| `<Box look="pad-17" />` | compila (D126); o aviso é de runtime |
| `<Pressable onPress={1} />` | erro de tipo (`@ts-expect-error`) |
| `ref` num `Box` | recebe `View` |

## 6. Casos de borda e erros

| Caso | Resultado |
|---|---|
| `look` ausente ou vazio | Só a base do componente (R3) |
| `Text` sem pai com texto | Padrão da D112 (R14) |
| Pai com `style` de cor e sem `look` de texto | Não é herdado (R30) |
| `Box` interno sem `look` de texto | Repassa o que herdou (R29) |
| `look` do `Text` define só a cor, pai define o tamanho | Cor do filho e tamanho do pai (R29) |
| `hover(...)` com `Pressable` num celular sem ponteiro | Nunca vale (R22) |
| `hitSlop` da pessoa no `Pressable` | O dela vence (R24, D170) |
| `Pressable` antes do primeiro `onLayout` | Sem `hitSlop` somado (R24) |
| `Text` dentro de `Text` | Herda o texto do de fora; o padrão só vale sem herança (R19) |
| Foco de leitor de tela | Não ativa `focus(...)` (R22, D171) |
| Classe inválida no `look` | O resto vale; aviso só em dev (R6) |
| Pessoa passa `accessibilityRole` ou `role` | O padrão `'button'` não se aplica (R25) |
| Pessoa passa `accessibilityState` com outras chaves | Preservadas; `disabled` segue a prop (R25) |
| `Text` com escala de fonte do sistema maior | Cresce; o alanwind não limita (R17) |
| Estado `press` num `Box` ou `Text` | A camada não vale; aviso em dev (R12, R44) |

## 7. Critérios de aceite

- [ ] Os exemplos das seções 5.1 a 5.5 produzem o resultado indicado (Jest,
      `jest-expo`, D114).
- [ ] `<Box />` sem `look` é flex em coluna (R9) e nenhum papel de
      acessibilidade é forçado (R10).
- [ ] O `style` vence o `look`, propriedade a propriedade (R2).
- [ ] O `Text` sem `look` tem a cor de `text-body` e `fontSize` 16 nos dois
      esquemas (R14).
- [ ] A herança segue a cascata da R29 e não herda `padding*`, fundo, bordas nem
      o `style` (R28, R30).
- [ ] Pressionado: as classes de `press(...)` valem; solto, não. Sem evento de
      hover, `hover(...)` nunca vale (R22).
- [ ] `disabled` liga `disabled(...)` e `accessibilityState.disabled` (R25).
- [ ] Papel `'button'` por padrão, sobrescrevível por `accessibilityRole` ou
      `role` (R25).
- [ ] `hitSlop` completa 44 (iOS e web) ou 48 (Android) sem mudar o tamanho
      visual, e os callbacks da pessoa continuam sendo chamados (R23, R24).
- [ ] O tipo da prop `look` é o do `core`; as props originais mantêm os tipos
      (R32, R33).
- [ ] O autocomplete no editor é conferido à mão e registrado no relatório.

## 8. Ainda não definido

Nada que bloqueie a fase 1: a D163 a D171 resolveram tudo o que era dela. A
D172 permite aprovar esta spec para a fase 1 com o bloco abaixo marcado como
**fases posteriores**; ele volta quando a fase de cada componente começar.

### Fases posteriores (não bloqueiam a fase 1, D172)

- Formato exato do mapa de props do `styled()` (R37).
- Acessibilidade de `Image`, `ScrollView`, `TextInput`, `FlatList`, `Modal`,
  `Switch` e `SafeArea`.
- Comportamento de `Modal` (foco, botão voltar).
- Como `Switch` expõe os estados (ligado, foco, desabilitado) às variantes.
