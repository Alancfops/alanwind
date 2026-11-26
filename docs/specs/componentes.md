# Spec: componentes

Status: **rascunho** (estrutura completa; falta o Alan responder a seção 8) ·
Decisões de origem: D26, D27, D40, D41, D53, D54, D57, D59, D60, D62, D78, D98,
D103, D107, D110 a D115, D126

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
| **Propriedade de texto** | Propriedade do `StyleMap` herdável (K1): cor do texto, tamanho, peso, altura de linha, alinhamento, família, estilo, decoração e transformação. |
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
  vence o `look`, propriedade a propriedade (D53). O limite com os atalhos do RN
  está na K5.
- **R3.** Um componente sem `look`, ou com `look` vazio, NÃO DEVE acrescentar
  estilo além da base do componente.
- **R4.** O `look` DEVE ser resolvido pela resolução do `native` com o contexto
  atual (esquema, faixa de tela, plataforma) e DEVE ser resolvido de novo
  quando esse contexto mudar (D15, D64; `emissor-native.md` R3, R6).
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
  `flexDirection: 'column'`, que `row` no `look` e o `style` sobrepõem (D62;
  confirmação K6).
- **R10.** `Box` NÃO DEVE forçar papel de acessibilidade (D115).
- **R11.** `Box` DEVE repassar às crianças o texto herdado somado ao que o seu
  `look` declara (R25 a R27).
- **R12.** Variantes de estado (`hover`, `press`, `focus`, `disabled`) no `look`
  de um `Box` não têm estado informado e a camada NÃO vale
  (`emissor-native.md` R13); o aviso em dev está na K4.

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
- **R19.** `Text` DEVE aplicar a R15 também ao texto herdado de outro `Text`
  que o contém (K2), para o padrão da R14 não redefinir o tamanho do texto de
  fora.
- **R20.** O `lineHeight` DEVE ser o tamanho de fonte **final** da R14 vezes o
  `Ratio` da IR: sem `type-*` em lugar nenhum, o tamanho é 16 (D112), então
  `leading-normal` dá 24 (D98, D113; `emissor-native.md` R20).

### 3.4 `Pressable`

- **R21.** `Pressable` DEVE renderizar um `Pressable` do React Native e aceitar
  `style` como objeto ou como função, como o original; o resultado vence o
  `look` (R2, D53).
- **R22.** **Estados** (D59, D103, D110):
  - `press` DEVE valer enquanto o `Pressable` está pressionado;
  - `hover` DEVE valer enquanto chegam os eventos `onHoverIn`/`onHoverOut`, que
    só ocorrem com ponteiro; sem ponteiro, nunca vale, nem pressionado;
  - `focus` DEVE valer com o foco do `Pressable` (`onFocus`/`onBlur`; K9);
  - `disabled` DEVE valer com a prop `disabled` ligada.
- **R23.** O `Pressable` NÃO DEVE perder os callbacks da pessoa
  (`onPressIn`, `onPressOut`, `onHoverIn`, `onHoverOut`, `onFocus`, `onBlur`,
  `onLayout`): DEVE chamá-los além de atualizar o próprio estado.
- **R24.** **Área mínima de toque** (D78, D111): a área de toque DEVE ter pelo
  menos 44 × 44 no iOS e na web e 48 × 48 no Android, aumentada com `hitSlop`,
  **sem mudar o visual**. Em cada eixo, se o tamanho é menor que o mínimo, cada
  lado DEVE receber `ceil((mínimo - tamanho) / 2)`; se já tem o mínimo, nenhum
  `hitSlop` é somado. Antes do layout e com `hitSlop` da pessoa: K8.
- **R25.** **Acessibilidade padrão** (D115):
  - `accessibilityRole` DEVE ser `'button'` por padrão; se a pessoa passar
    `accessibilityRole` ou `role`, o padrão NÃO se aplica;
  - `accessibilityState.disabled` DEVE seguir a prop `disabled`, preservando as
    outras chaves de `accessibilityState` da pessoa;
  - na web, o `Pressable` com foco de teclado DEVE ter indicação visível de foco
    (como se obtém: K7).
- **R26.** O `Pressable` DEVE repassar às crianças o texto herdado somado ao que
  o seu `look` declara, avaliado com o estado atual do `Pressable` (R11, K3).
- **R27.** `tap-target` e `focus-ring` NÃO existem nesta fase (D78).

### 3.5 Herança de texto (D57, D113)

- **R28.** `Box` e `Pressable` DEVEM repassar por contexto as propriedades de
  texto do seu `look` aos `Text` de dentro. Propriedades que não são de texto
  (`padding*`, `backgroundColor`, bordas) NÃO DEVEM ser herdadas.
- **R29.** **Cascata:** um `Box` interno DEVE repassar o que herdou somado ao
  que declara. A classe de texto mais próxima vence **por propriedade**: a cor
  do filho vence a do pai e o tamanho do pai continua valendo.
- **R30.** Só o `look` é herdado. O `style` escrito à mão NÃO DEVE ser herdado.
- **R31.** A lista de propriedades herdáveis é a da K1 (proposta: `color`,
  `fontSize`, `fontWeight`, `lineHeight`, `textAlign`, `fontFamily`,
  `fontStyle`, `textDecorationLine`, `textTransform`); `numberOfLines` NÃO é
  herdado.

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
| `<Box look="hover(bg-raised)">` | `{ flexDirection: 'column' }` (K4: aviso em dev) |

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
| `hitSlop` da pessoa no `Pressable` | K8 |
| Classe inválida no `look` | O resto vale; aviso só em dev (R6) |
| Pessoa passa `accessibilityRole` ou `role` | O padrão `'button'` não se aplica (R25) |
| Pessoa passa `accessibilityState` com outras chaves | Preservadas; `disabled` segue a prop (R25) |
| `Text` com escala de fonte do sistema maior | Cresce; o alanwind não limita (R17) |
| Estado `press` num `Box` ou `Text` | A camada não vale (R12; K4) |

## 7. Critérios de aceite

- [ ] Os exemplos das seções 5.1 a 5.5 produzem o resultado indicado (Jest,
      `jest-expo`, D114); os que dependem de pergunta aberta só depois de ela
      ser respondida (K3, K4, K5, K6, K8).
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

Cada item traz as opções e a recomendação do documentador. As respostas viram
decisões (skill `registrar-decisao`) e só então entram nas regras.

### 8.1 Bloqueiam a fase 1

- **K1. Propriedades de texto herdáveis.** A D57 diz "`text-*`, `type-*`,
  `weight-*` e afins". Proposta: as nove propriedades de texto da IR (`color`,
  `fontSize`, `fontWeight`, `lineHeight`, `textAlign`, `fontFamily`,
  `fontStyle`, `textDecorationLine`, `textTransform`); `numberOfLines` não é
  herdado. Recomendação: aceitar a proposta.
- **K2. `Text` dentro de `Text`.** Sem tratamento, o `Text` aninhado aplica o
  padrão da D112 (`type-base`) e redefine o tamanho do pai, ao contrário do CSS.
  Recomendação: o `Text` também repassa o texto herdado por contexto, e o padrão
  só vale quando nada é herdado (é o que a R19 supõe).
- **K3. Texto dentro de variante de estado do pai.** Um `press(text-on-primary)`
  no `Pressable` chega ao `Text` filho enquanto ele está pressionado?
  Recomendação: sim, avaliando as camadas do pai com o estado atual dele
  (igual à web, D57).
- **K4. Variantes de estado em `Box` e `Text`.** Ficam ignoradas com aviso em
  dev, como no `styled()` (D53, item 3)? Qual código de aviso, já que o
  catálogo `AW###` da `sintaxe.md` não cobre isso? Recomendação: ignorar com
  aviso da borda, sem código `AW`.
- **K5. `style` com atalho do RN contra `look` com lados explícitos.** O `look`
  gera `paddingTop` etc. (D107). Um `style={{ padding: 4 }}` não vence um
  `paddingTop` já presente, porque o RN dá precedência ao lado específico; isso
  contraria "o `style` vence" (D53) nesse caso. Opções: (a) documentar a regra
  do RN; (b) normalizar os atalhos do `style`, o que é frágil com `Animated` e
  arrays. Recomendação: (a).
- **K6. `Box` com `flexDirection: 'column'` explícito.** A base fica explícita,
  abaixo do `look` e do `style` (R9), ou depende do padrão do RN? Recomendação:
  explícita, para a D62 ser testável.
- **K7. Foco visível na web (D115, com `focus-ring` fora da fase 1).** Opções:
  (a) só não remover o outline do navegador; (b) desenhar um anel padrão com
  `border-focus`. Recomendação: (a), com `focus(...)` para personalizar.
- **K8. `hitSlop`.** (i) Antes do primeiro `onLayout` não há tamanho:
  recomendação, sem `hitSlop` até o layout. (ii) Com `hitSlop` da pessoa: o dela
  vence, ou vale o maior por lado? Recomendação: o da pessoa vence, como o
  `style` sobre o `look`. A conta da R24 fica como está.
- **K9. Estado `focus` e leitor de tela.** O RN só informa `onFocus`/`onBlur`
  (teclado e web). O foco de leitor de tela (TalkBack, VoiceOver) não vira o
  estado `focus` na fase 1? Recomendação: aceitar essa limitação.

### 8.2 Fases posteriores (não bloqueiam a fase 1)

- **K10. A spec pode ser aprovada para a fase 1 com este bloco aberto?**
  Recomendação: sim, marcado como fases posteriores; as perguntas abaixo
  voltam quando a fase delas começar.
  - Formato exato do mapa de props do `styled()` (R37).
  - Acessibilidade de `Image`, `ScrollView`, `TextInput`, `FlatList`, `Modal`,
    `Switch` e `SafeArea`.
  - Comportamento de `Modal` (foco, botão voltar).
  - Como `Switch` expõe os estados (ligado, foco, desabilitado) às variantes.
