# Spec: emissor React Native

Status: **rascunho** (estrutura completa; falta o Alan responder a seção 8) ·
Decisões de origem: D14, D15, D25, D26, D27, D35, D37, D45, D49, D57, D59, D60,
D62, D64, D83, D84, D88, D94, D98, D103, D107, D108, D109, D110, D116, D117,
D119, D120, D133, D135, D136, D144

Tradução da IR em objetos de estilo e props do React Native, avaliação das
condições no contexto atual, cache por contexto e configuração por
`configure()`.

## 1. Escopo

Cobre:

- O **contexto de resolução** no React Native: esquema de cor, faixa de tela,
  plataforma e `setColorScheme` (D25, D64, D94, D109).
- A **avaliação das condições** da IR e a aplicação das camadas em ordem (D117,
  D135, D136).
- A **tradução** de cada propriedade de estilo e de props da IR para o React
  Native, inclusive cor, sombra, tipografia e fontes por plataforma (D107, D108,
  D120, D133).
- A **resolução ponta a ponta com cache** (`look` + contexto → estilo e props) e
  o tratamento dos diagnósticos na borda (D15, D84, D109).
- `defineConfig` e `configure()` (D119).

Fica de fora:

- Tokenização, vocabulário, conflito, precedência, centralização e elevação no
  escuro: já resolvidos no `core` (`sintaxe.md`, `funcionamento-interno.md`).
  O emissor NÃO os reimplementa (D82).
- Valores do tema padrão (`tema.md`).
- Componentes `Box`, `Text` e `Pressable`, herança de texto, `style` somado ao
  `look`, área de toque e acessibilidade: `componentes.md`.
- Emissor CSS: a web com `react-native-web` usa os mesmos componentes e esta
  spec, com `platform` igual a `web` (D26). O CSS gerado em build é da
  `emissor-css.md`.
- Plataformas além de `ios`, `android` e `web` (a IR só tem esses átomos).
- Guardar a escolha de `setColorScheme` entre execuções do app (não decidido).

## 2. Definições

| Termo | Significado |
|---|---|
| **Contexto de resolução** | O que, fora do `look`, muda o resultado: esquema, faixa de tela, plataforma, mais o tema na chave do cache (D109). |
| **Esquema** | `light` ou `dark`. Segue o sistema, ou o valor forçado por `setColorScheme` (D25, D64). |
| **Faixa de tela** | `compact` (abaixo de 600), `medium` (a partir de 600) ou `expanded` (a partir de 840), pela largura da janela (D94, `tema.md` 5.8). |
| **Plataforma** | `ios`, `android` ou `web` (`Platform.OS`; `web` é o `react-native-web`). |
| **Estados de interação** | `hover`, `press`, `focus` e `disabled` de **um elemento**. Quem informa é o componente; não fazem parte do contexto (D59, D103, D110). |
| **Avaliar** | Decidir quais camadas da IR valem no contexto e nos estados dados (R7 a R13). |
| **Estilo nativo** | Objeto de propriedades de estilo do React Native, sem arrays nem referências a `StyleSheet`. |
| **Props nativas** | Objeto com as props de componente que a IR pede (`numberOfLines`). |
| **Resolução** | `look` + contexto + estados → estilo nativo + props nativas. |
| **Borda** | O pacote `native`: lê o contexto, mostra diagnósticos em dev e guarda o cache (D84). |

## 3. Regras normativas

### 3.1 Contexto de resolução

- **R1.** O contexto DEVE conter o esquema, a faixa de tela, a plataforma e o
  tamanho da janela (este só para as unidades de tela, P1). Estados de interação
  NÃO fazem parte do contexto (D109, D110).
- **R2.** Sem `setColorScheme`, o esquema DEVE seguir o do sistema e acompanhar
  as mudanças dele (D25, `tema.md` R3).
- **R3.** `setColorScheme('light' | 'dark' | 'system')` DEVE forçar o esquema em
  toda a árvore, sem Provider, e os componentes já montados DEVEM atualizar.
  `'system'` DEVE voltar a seguir o sistema (D64, `tema.md` R4 e C8).
- **R4.** A faixa de tela DEVE ser calculada pela largura da janela: `compact`
  abaixo de 600, `medium` de 600 a 839 e `expanded` a partir de 840 (D94). Os
  valores 599, 600, 839 e 840 DEVEM cair em `compact`, `medium`, `medium` e
  `expanded`.
- **R5.** A plataforma DEVE ser `Platform.OS`. Com `react-native-web`, é `web`.
- **R6.** Quando o esquema, a faixa ou a plataforma mudam, as resoluções
  seguintes DEVEM usar o contexto novo. Mudar a largura **dentro da mesma
  faixa** NÃO DEVE mudar nenhum resultado (D109), salvo as unidades de tela
  (P1).

### 3.2 Avaliação das condições

- **R7.** Átomo `scheme` DEVE valer quando o esquema do contexto é igual ao do
  átomo (D103).
- **R8.** Átomo `platform` DEVE valer quando a plataforma do contexto é igual à
  do átomo; `native` DEVE valer em `ios` e em `android`, e não em `web` (D103).
- **R9.** Átomo `screen` DEVE valer quando a largura da janela é **maior ou
  igual** ao `minWidth` do próprio átomo. Vale "a partir de": `medium` também
  vale em `expanded` (D37). O emissor NÃO DEVE consultar o tema nem repetir os
  números 600 e 840 (`funcionamento-interno.md` R5, R18).
- **R10.** Átomo `state` DEVE valer quando o componente informa aquele estado
  como ativo. `hover` DEVE valer só enquanto o componente recebe o evento de
  hover (`onHoverIn`/`onHoverOut`); sem ponteiro, o evento nunca vem e `hover`
  nunca vale, mesmo com `press` ativo (D59, D110).
- **R11.** Uma condição DEVE valer quando **todos** os seus átomos valem; a
  condição vazia DEVE sempre valer (`funcionamento-interno.md` seção 2).
- **R12.** As camadas, de estilo e de props separadamente, DEVEM ser aplicadas
  na ordem da lista: entre as que valem, a posterior vence, propriedade a
  propriedade (D117, D135; `funcionamento-interno.md` R17). O emissor NÃO DEVE
  reordenar nem recalcular precedência, conflito ou centralização (D136, D82).
- **R13.** Um átomo `state` cujo estado o elemento não informa DEVE contar como
  não ativo: a camada não vale. É o caso das variantes de estado em elementos
  que não têm estado (ver `componentes.md`).

### 3.3 Tradução do estilo

- **R14.** Cada declaração da IR DEVE virar a propriedade de estilo do React
  Native **de mesmo nome**, com o valor da tabela da R16. Lados e cantos
  continuam explícitos: o emissor NÃO DEVE usar `padding`, `paddingHorizontal`,
  `paddingVertical`, `margin`, `borderWidth` nem `borderRadius` (D107, D120;
  `funcionamento-interno.md` R12).
- **R15.** O estilo nativo DEVE conter só propriedades declaradas por camadas
  que valem. Sem camada que valha, DEVE ser `{}`. O emissor NÃO DEVE acrescentar
  valor padrão que a IR não traz (D83); o padrão do `Box` e do `Text` é dos
  componentes (D62, D112).
- **R16.** Tradução dos valores:

  | Tipo na IR | Valor no React Native |
  |---|---|
  | `number` (px/dp) | o mesmo número, em dp |
  | `Percent` (`{ unit: 'percent', value }`) | a string `'<value>%'`, ex.: `'50%'`, `'100%'`, `'12.5%'` |
  | `ScreenSize` (`{ unit: 'screen' }`) | largura da janela em `width`, altura em `height` (P1) |
  | `'auto'` (só em margem) | `'auto'` |
  | `ThemedColor` | R17 |
  | `Ratio` (`lineHeight`) | R20 |
  | `fontWeight` 400, 500, 700 | P3 |
  | `ShadowLayer[]` (`boxShadow`) | R18 |
  | `fontFamily` genérica | R21 |

- **R17.** **Cor** (`backgroundColor`, `color`, `borderColor`): o emissor DEVE
  escolher `light` ou `dark` do `ThemedColor` pelo esquema do contexto e, com
  `alpha` igual a 1, DEVE entregar `rgb` como está (`'#2563EB'`). Com `alpha`
  menor que 1, o formato é o da P3 (D31, D104; `funcionamento-interno.md` R30,
  R31).
- **R18.** **Sombra**: cada `ShadowLayer` DEVE virar uma camada de `boxShadow`,
  na mesma ordem, igual no iOS, no Android e na web (D108). O emissor NÃO DEVE
  gerar `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius` nem
  `elevation`, e NÃO conhece o conceito de elevação: a do escuro já chega em
  camadas comuns (`funcionamento-interno.md` R35). A forma é a da P4.
- **R19.** `fontSize`, `textAlign`, `fontStyle`, `textDecorationLine` e
  `textTransform` DEVEM sair com o mesmo valor da IR (D49, D77).
- **R20.** **Altura de linha**: `lineHeight` da IR é um `Ratio`; o estilo nativo
  DEVE trazer `lineHeight` igual a `tamanho da fonte × value`, em dp. O tamanho
  da fonte é o final do texto, depois da herança e do padrão do `Text` (D98,
  D112, D113; `funcionamento-interno.md` R33). Sem tamanho final conhecido,
  quem chama informa o dele; o arredondamento está na P6.
- **R21.** **Família de fonte** (`fontFamily` genérica da IR, D133): o emissor
  DEVE mapear para a fonte do sistema da plataforma, sem baixar nenhuma fonte:

  | Genérica | iOS | Android | Web |
  |---|---|---|---|
  | `sans` | San Francisco | Roboto | pilha `system-ui` |
  | `serif` | Georgia | `serif` | pilha Georgia/serif |
  | `mono` | Menlo | `monospace` | pilha `ui-monospace` |

  Os textos exatos da propriedade `fontFamily` em cada célula estão na P5.
- **R22.** O texto DEVE respeitar a escala de fonte do sistema (seção 5 da
  visão, D115). O emissor NÃO DEVE desligar `allowFontScaling` nem definir
  `maxFontSizeMultiplier`: o comportamento é o padrão do React Native.

### 3.4 Tradução das props

- **R23.** Cada declaração de `props` DEVE virar a prop de mesmo nome do
  componente: `numberOfLines: N` (D83, D77; `funcionamento-interno.md` R27).
  As camadas de props são avaliadas e aplicadas como as de estilo (R7 a R12).
  Sem camada que valha, `props` é `{}`.
- **R24.** A área mínima de toque NÃO é prop da IR: é do `Pressable`
  (D78, D111; `componentes.md`).

### 3.5 Resolução e cache

- **R25.** A resolução DEVE chamar o `core` (`look` + tema → IR), avaliar as
  camadas (R7 a R13) e traduzir (R14 a R23). Mesma entrada (`look`, tema,
  contexto, estados) DEVE dar o mesmo resultado (D15).
- **R26.** A chave do cache DEVE ser: o texto do `look` + a **faixa de tela**
  (não a largura exata) + o esquema + a plataforma + o tema (D109). Mudar
  qualquer parte DEVE mudar a chave; mudar a largura dentro da faixa NÃO DEVE.
- **R27.** O cache DEVE guardar as últimas combinações usadas e descartar a
  usada há mais tempo (LRU) quando passar do limite (D109). O limite DEVE ser
  uma constante nomeada, com o valor da P8, e os testes DEVEM ler a constante.
- **R28.** Mesma entrada e mesmo contexto DEVEM devolver o **mesmo objeto**
  (identidade), vindo do cache. O objeto devolvido NÃO DEVE ser alterado pela
  borda depois de guardado.
- **R29.** Os estados de interação, que mudam por elemento, entram na resolução
  como a P8 definir; a chave da D109 não muda.
- **R30.** Trocar a configuração (`configure`) DEVE passar a usar o tema novo na
  chave, sem aproveitar resultados da configuração anterior (D109, R35).

### 3.6 Diagnósticos na borda

- **R31.** A resolução DEVE pedir ao `core` os diagnósticos e a borda DEVE
  decidir: em desenvolvimento, mostrar pelo mecanismo de aviso do alanwind
  (P9); em produção, ignorar (D35, D84; `funcionamento-interno.md` R41).
- **R32.** A resolução NÃO DEVE lançar exceção por causa do conteúdo do `look`,
  em desenvolvimento ou em produção. Entrada inválida descarta só o trecho ruim
  e o resto vale (D88; `funcionamento-interno.md` R2, R42).

### 3.7 Configuração (D119)

- **R33.** `defineConfig` e `configure` DEVEM ser exportados de
  `@alanwind/native` (D119, `tema.md` R33).
- **R34.** `defineConfig` DEVE aceitar só `{ define?: Record<string, string> }`
  na fase 1. Outra chave (`palette`, `roles`) DEVE ser erro de tipo (D81, D100;
  `tema.md` R22).
- **R35.** `configure(config)` DEVE ser chamado uma vez, no arquivo de entrada
  do app. DEVE validar o `define`, mostrar em dev os diagnósticos de carga
  (`AW301`, `AW302`, `AW304`) e passar os atalhos válidos à resolução, que os
  expande antes de resolver (D101, D134, D144; `funcionamento-interno.md` R6).
  Um atalho com erro de carga é descartado e usá-lo num `look` dá `AW101`.
- **R36.** Sem `configure`, os atalhos DEVEM ficar desligados, com aviso em dev
  (D119; quando o aviso sai: P10). `defineConfig({})` ou nenhuma configuração
  DEVE dar o tema padrão sem atalhos (`tema.md` R28).
- **R37.** `configure` NÃO DEVE ler arquivo: o app importa o
  `alanwind.config.ts` e chama a função (D119).

### 3.8 Classes sem tradução

- **R38.** Na fase 1, todo o vocabulário tem tradução no React Native (variantes
  são condições, não classes). Não há classe exclusiva da web. Quando existir
  uma, a matriz de suporte por plataforma (seção 4 da visão, ainda proposta)
  precisa ser decidida antes de entrar aqui.

## 4. Formato

Tipos TypeScript do contrato. Os **nomes** são provisórios (P7); o
comportamento é o das regras acima.

```ts
export type ScreenBand = 'compact' | 'medium' | 'expanded';

export interface ResolutionContext {
  readonly scheme: 'light' | 'dark';
  /** Derivada da largura da janela (R4). Entra na chave do cache (R26). */
  readonly band: ScreenBand;
  readonly platform: 'ios' | 'android' | 'web';
  /** Janela, em dp. R9 e as unidades de tela (P1). */
  readonly window: { readonly width: number; readonly height: number };
}

/** Informado pelo componente, por elemento (R10). Ausente = não ativo. */
export interface InteractionStates {
  readonly hover?: boolean;
  readonly press?: boolean;
  readonly focus?: boolean;
  readonly disabled?: boolean;
}

export interface NativeLook {
  /** Só propriedades declaradas por camadas que valem (R15). */
  readonly style: NativeStyle;
  /** `{}` se nenhuma camada de props vale (R23). */
  readonly props: { readonly numberOfLines?: number };
}
```

`NativeStyle` é o subconjunto de `ViewStyle` e `TextStyle` do React Native
(Strict TypeScript API, D14) que a tabela da R16 produz.

## 5. Exemplos

Entradas escritas como IR (seções 5 da `funcionamento-interno.md`) ou como
`look`. Contexto padrão dos exemplos: `compact`, `ios`, janela 390 × 844,
estados inativos, salvo quando a coluna diz outra coisa. Cores: D46, D50, D51,
D91, D95.

### 5.1 Tradução de valores (R14 a R23)

| `look` | Esquema | Estilo nativo |
|---|---|---|
| `pad-4 bg-surface` | claro | `{ paddingTop: 16, paddingRight: 16, paddingBottom: 16, paddingLeft: 16, backgroundColor: '#FFFFFF' }` |
| `pad-4 bg-surface` | escuro | o mesmo, com `backgroundColor: '#1E1E22'` |
| `pad-x-2` | — | `{ paddingLeft: 8, paddingRight: 8 }` |
| `margin-x-auto` | — | `{ marginLeft: 'auto', marginRight: 'auto' }` |
| `margin-top=-8` | — | `{ marginTop: -8 }` |
| `w-full` | — | `{ width: '100%' }` |
| `w=50%` | — | `{ width: '50%' }` |
| `w=137` | — | `{ width: 137 }` |
| `w=10.5` | — | `{ width: 10.5 }` |
| `size-10` | — | `{ width: 40, height: 40 }` |
| `gap-4` | — | `{ rowGap: 16, columnGap: 16 }` |
| `gap-x-4` | — | `{ columnGap: 16 }` |
| `border-y-2` | — | `{ borderTopWidth: 2, borderBottomWidth: 2 }` |
| `round-top-lg` | — | `{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }` |
| `opacity-50` | — | `{ opacity: 0.5 }` |
| `fill wrap between` | — | `{ flex: 1, flexWrap: 'wrap', justifyContent: 'space-between' }` |
| `bg-primary` | claro | `{ backgroundColor: '#2563EB' }` |
| `bg-primary` | escuro | `{ backgroundColor: '#8AB4FF' }` |
| `text-on-warning` | claro e escuro | `{ color: '#3B2A00' }` |
| `border-danger` | claro | `{ borderColor: '#D02424' }` |
| `border-danger` | escuro | `{ borderColor: '#FF8A80' }` |
| `type-lg leading-normal` | — | `{ fontSize: 18, lineHeight: 27 }` |
| `type-sm leading-tight` | — | `{ fontSize: 14, lineHeight: 17.5 }` |
| `italic underline upper` | — | `{ fontStyle: 'italic', textDecorationLine: 'underline', textTransform: 'uppercase' }` |
| `align-center` | — | `{ textAlign: 'center' }` |
| `` (vazio) | — | `{}` (props `{}`) |

### 5.2 Condições e camadas (R7 a R13)

| `look` | Contexto e estados | Estilo nativo |
|---|---|---|
| `col medium(row)` | largura 599 | `{ flexDirection: 'column' }` |
| `col medium(row)` | largura 600 | `{ flexDirection: 'row' }` |
| `col medium(row)` | largura 840 | `{ flexDirection: 'row' }` |
| `col medium(row) center-x` | largura 599 | `{ flexDirection: 'column', alignItems: 'center' }` |
| `col medium(row) center-x` | largura 700 | `{ flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch' }` |
| `pad-x-2 medium(pad-4)` | `compact` | `{ paddingLeft: 8, paddingRight: 8 }` |
| `pad-x-2 medium(pad-4)` | `medium` | os quatro lados com 16 |
| `bg-primary hover(bg-raised) press(bg-primary-hover)` | claro, repouso | `{ backgroundColor: '#2563EB' }` |
| (igual) | claro, só `press` | `{ backgroundColor: '#1D4FD8' }` |
| (igual) | claro, só `hover` | `{ backgroundColor: '#FFFFFF' }` |
| (igual) | claro, `hover` e `press` | `{ backgroundColor: '#1D4FD8' }` (a posterior vence) |
| `hover(bg-raised)` | escuro, sem evento de hover, `press` ativo | `{}` (D110) |
| `ios(pad-6)` | `android` | `{}` |
| `ios(pad-6)` | `ios` | os quatro lados com 24 |
| `native(pad-4)` | `ios` ou `android` | os quatro lados com 16 |
| `native(pad-4)` | `web` | `{}` |
| `dark(bg-surface)` | claro | `{}` |
| `dark(bg-surface)` | escuro | `{ backgroundColor: '#1E1E22' }` |
| `disabled(opacity-50)` | `disabled` ativo | `{ opacity: 0.5 }` |
| `disabled(opacity-50)` | `disabled` inativo | `{}` |
| `expanded(bg-primary) hover(bg-raised) medium(bg-surface)` | claro, largura 900, `hover` ativo | `{ backgroundColor: '#2563EB' }` (a faixa maior vence, D136) |
| `medium(lines-2) lines-4` | largura 599 | estilo `{}`, props `{ numberOfLines: 4 }` |
| `medium(lines-2) lines-4` | largura 700 | estilo `{}`, props `{ numberOfLines: 2 }` |
| `lines-2` | — | estilo `{}`, props `{ numberOfLines: 2 }` |

### 5.3 Fontes (R21)

Os textos exatos dependem da P5; aqui só a fonte escolhida (D133, `tema.md`
7.2).

| `look` | Plataforma | Fonte |
|---|---|---|
| `font-sans` | `ios` | San Francisco |
| `font-sans` | `android` | Roboto |
| `font-sans` | `web` | pilha `system-ui` |
| `font-serif` | `ios` | Georgia |
| `font-serif` | `android` | `serif` |
| `font-serif` | `web` | pilha Georgia/serif |
| `font-mono` | `ios` | Menlo |
| `font-mono` | `android` | `monospace` |
| `font-mono` | `web` | pilha `ui-monospace` |

### 5.4 Valores que dependem de perguntas abertas

Os valores abaixo seguem a **recomendação** de cada pergunta e só valem se o
Alan a aceitar. Os testes de ouro correspondentes só nascem depois da resposta.

| `look` | Contexto | Saída (se a recomendação for aceita) | Pergunta |
|---|---|---|---|
| `bg-primary-50` | claro | `{ backgroundColor: 'rgba(37, 99, 235, 0.5)' }` | P3 |
| `bg=#e11d48/50` | qualquer | `{ backgroundColor: 'rgba(225, 29, 72, 0.5)' }` | P3 |
| `weight-bold` | — | `{ fontWeight: '700' }` | P3 |
| `bg-surface shadow-md` | claro | `{ backgroundColor: '#FFFFFF', boxShadow: [{ offsetX: 0, offsetY: 4, blurRadius: 8, spreadDistance: 0, color: 'rgba(0, 0, 0, 0.08)' }, { offsetX: 0, offsetY: 1, blurRadius: 2, spreadDistance: 0, color: 'rgba(0, 0, 0, 0.06)' }] }` | P4 |
| `bg-surface shadow-md` | escuro | `{ backgroundColor: '#28282D', borderColor: '#34343A', borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, boxShadow: [{ offsetX: 0, offsetY: 4, blurRadius: 8, spreadDistance: 0, color: 'rgba(0, 0, 0, 0.35)' }] }` | P4 |
| `h-screen` | janela 390 × 844 | `{ height: 844 }` | P1 |
| `size-screen` | janela 390 × 844 | `{ width: 390, height: 844 }` | P1 |
| `font-sans` | `ios` | `{ fontFamily: 'System' }` | P5 |

### 5.5 Cache (R26 a R28)

| Chamadas | Resultado |
|---|---|
| `look` igual, mesmo contexto, duas vezes | o mesmo objeto (identidade) |
| `pad-4 medium(row)` com largura 700 e depois 800 | o mesmo objeto (as duas são `medium`) |
| `pad-4 medium(row)` com largura 599 e depois 600 | objetos diferentes (faixas diferentes) |
| `bg-primary` claro e depois escuro | objetos diferentes |
| `bg-primary` em `ios` e depois em `android` | objetos diferentes |
| `limite + 1` combinações diferentes, depois a primeira de novo | a primeira foi descartada: o objeto devolvido é novo, mas igual por valor |

### 5.6 Erros e diagnósticos (R31, R32)

| `look` | Ambiente | Estilo nativo | Aviso |
|---|---|---|---|
| `bg-banana pad-4` | dev | os quatro lados com 16 | sim (`AW102`) |
| `bg-banana pad-4` | produção | os quatro lados com 16 | nenhum |
| `pad-4 hover(bg-raised` | dev | os quatro lados com 16 | sim (`AW001`) |
| `pad-4 hover(bg-raised` | produção | os quatro lados com 16 | nenhum |
| qualquer string, inclusive aleatória | dev e produção | nunca lança exceção | conforme o `core` |

### 5.7 Configuração (R33 a R37)

| Entrada | Resultado |
|---|---|
| `configure(defineConfig({ define: { btn: 'bg-primary pad-4' } }))`, depois `look="btn"` | resolve como `bg-primary pad-4` |
| `defineConfig({ palette: {} })` | erro de tipo (`@ts-expect-error`) |
| `look="btn"` sem `configure` | `btn` é `AW101` em dev; produção ignora; o aviso de ausência está na P10 |
| `define: { a: 'b', b: 'a' }` em `configure` | `AW301` em dev; `a` e `b` descartados; usar `a` dá `AW101` |
| `define: { row: 'pad-4' }` | `AW302` em dev; atalho descartado |
| `define: { Btn: 'pad-4' }` | `AW304` em dev; atalho descartado |

## 6. Casos de borda e erros

| Caso | Resultado |
|---|---|
| `look` vazio ou só espaços | `style` `{}` e `props` `{}` (R15, R23) |
| Largura exatamente 600 ou 840 | `medium` e `expanded` (R4, R9) |
| Largura muda de 700 para 800 | Mesmo resultado, mesma entrada do cache (R6, R26) |
| `hover(...)` sem evento de hover | Nunca vale, nem com `press` (R10) |
| Variante de estado em elemento sem estado | A camada não vale (R13) |
| `ios(...)` em `web` | Não vale; sem diagnóstico no emissor (R8) |
| `native(...)` em `web` | Não vale (R8) |
| Duas camadas com a mesma propriedade valendo juntas | A posterior vence, propriedade a propriedade (R12) |
| `pad-x-4` | `paddingLeft` e `paddingRight`, nunca `paddingHorizontal` (R14) |
| `shadow-md` | `boxShadow` apenas; nunca `shadow*` nem `elevation` (R18) |
| `Percent` | String com `%` (R16) |
| Cor com alfa 1 | `'#RRGGBB'` como veio da IR (R17) |
| `lineHeight` com `Ratio` | `tamanho da fonte × value` (R20) |
| Classe desconhecida, sintaxe quebrada | O resto do `look` vale; aviso só em dev; sem exceção (R31, R32) |
| `configure` não chamado | Atalhos desligados; aviso em dev (R36) |
| `defineConfig` com chave além de `define` | Erro de tipo (R34) |
| Escala de fonte do sistema maior | O texto cresce; o alanwind não limita (R22) |

## 7. Critérios de aceite

- [ ] Cada linha das tabelas 5.1, 5.2, 5.3 e 5.5 a 5.7 produz a saída indicada
      (testes de ouro; entrada: IR escrita à mão para o emissor, `look` para a
      resolução). As da 5.4 só depois de a pergunta correspondente ser
      respondida.
- [ ] As larguras 599, 600, 839 e 840 caem em `compact`, `medium`, `medium` e
      `expanded` (R4).
- [ ] `setColorScheme('dark')` muda os valores resolvidos, sem Provider, com
      componentes já montados atualizando; `'system'` volta a seguir o sistema
      (R3).
- [ ] O emissor usa o `minWidth` do átomo e não importa o tema nem
      `@alanwind/css`; só tipos de `@alanwind/core` (R9).
- [ ] O estilo nativo nunca contém `padding`, `paddingHorizontal`,
      `paddingVertical`, `margin`, `borderWidth`, `borderRadius`, `shadow*` nem
      `elevation` (R14, R18).
- [ ] Mesma entrada e mesmo contexto devolvem o mesmo objeto; mudar faixa,
      esquema ou plataforma muda a chave; passado o limite (constante lida pelo
      teste), a combinação usada há mais tempo sai (R26 a R28).
- [ ] Para qualquer string, a resolução nunca lança exceção; em produção, nada é
      mostrado (R31, R32).
- [ ] `defineConfig({ palette: {} })` é erro de tipo; depois de
      `configure(defineConfig(...))`, os atalhos resolvem (R34, R35).
- [ ] Cada propriedade da IR vira a de mesmo nome, e nenhuma propriedade fora da
      R14 é gerada (R14, R15).
- [ ] Os tipos exportados funcionam com a Strict TypeScript API do React Native
      0.88 (D14, D116).

## 8. Ainda não definido

Cada item traz as opções e a recomendação do documentador. As respostas viram
decisões (skill `registrar-decisao`) e só então entram nas regras. Sem as
respostas, o status continua **rascunho**.

- **P1. Unidades de tela (`w-screen`, `h-screen`, `size-screen`) e o cache.**
  `{ unit: 'screen' }` vira a largura ou a altura da janela, mas o cache usa a
  faixa, não a largura exata (D109): um resultado guardado na faixa `medium`
  serviria para 700 e 800 com o mesmo número. Opções: (a) a chave leva a janela
  exata só quando a IR do `look` tem unidade de tela; (b) esses `look` não
  entram no cache. "Tela" também precisa de definição: janela
  (`useWindowDimensions`) ou tela inteira (`Dimensions.get('screen')`, que no
  Android inclui a barra de status). Recomendação: (a), com a **janela**, igual
  à R9 da faixa.
- **P2. De onde vêm 600 e 840 para a faixa do contexto.** O emissor não lê o
  tema (R9), mas a chave do cache precisa da faixa antes de resolver. Opções:
  (a) a camada de contexto da borda lê as faixas do tema que o `core` já guarda
  (`tema.md` 5.8), e só o emissor fica proibido de consultar o tema; (b) o
  `native` repete os dois números. Recomendação: (a), para haver uma só fonte.
- **P3. Formato dos valores de saída.** (i) Cor com alfa menor que 1:
  `rgba(37, 99, 235, 0.5)` ou `#2563EB80`. (ii) `fontWeight`: os valores 400,
  500 e 700 saem como `'400'`, `'500'` e `'700'` ou como número.
  Recomendação: `rgba(r, g, b, a)` (a `tema.md` 5.7 já escreve as sombras assim)
  e `fontWeight` em string, que todas as versões aceitam.
- **P4. Forma do `boxShadow`.** O RN aceita string CSS
  (`'0 4px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)'`) ou lista
  de objetos (`{ offsetX, offsetY, blurRadius, spreadDistance, color }`).
  Recomendação: lista de objetos (sem texto para montar e comparar nos testes
  de ouro; a `color` segue a P3).
- **P5. Texto exato de `fontFamily` no RN e na web.** A D133 dá o nome da fonte,
  não o valor da propriedade. Proposta: `sans` = `'System'` (iOS), `'Roboto'`
  (Android), `'system-ui, sans-serif'` (web); `serif` = `'Georgia'`, `'serif'`,
  `'Georgia, serif'`; `mono` = `'Menlo'`, `'monospace'`,
  `'ui-monospace, monospace'`. A mesma pilha da web serviria à
  `emissor-css.md`. Recomendação: aceitar a proposta; o Alan confirma ou troca.
- **P6. Arredondamento de `lineHeight`.** `tamanho × value` com a escala do tema
  é exato (`type-lg` × 1.5 = 27); com valor livre aparece ruído de ponto
  flutuante (`type-2xl leading=1.4` daria `33.599999999999994`). Opções:
  (a) não arredondar; (b) arredondar a duas casas; (c) arredondar ao inteiro.
  Recomendação: (b).
- **P7. API pública da resolução.** A D26 pede uma função de resolução "para
  quem precisar" e a D27 diz que ela "pode seguir o mesmo nome" (`look(...)`).
  Falta: nome, assinatura e se há hook. Proposta: função `look(input, {
  context?, states? })` que devolve `NativeLook` e, sem `context`, lê o esquema
  e a janela naquele instante (sem reagir a mudanças), e hook
  `useLook(input, states?)`, que reage a mudanças de contexto e é o que os
  componentes usam. Recomendação: aceitar a proposta; o Alan confirma os nomes
  e se o hook é público já na fase 1.
- **P8. Estados de interação e o limite do cache.** Os estados mudam por
  elemento e não estão na chave da D109. Opções: (a) o cache guarda, por chave,
  o resultado de cada combinação de estados já pedida (no máximo 16); (b) os
  estados entram na chave. A D109 diz "~500": a constante vale exatamente 500?
  Recomendação: (a) e 500 entradas por chave da D109.
- **P9. Aviso em dev.** Falta: como a borda sabe que está em dev (`__DEV__`), o
  canal (`console.warn`) e a repetição (uma vez por `look` e código, ou a cada
  resolução). Recomendação: `__DEV__`, `console.warn`, um aviso por combinação
  de `look`, código e posição, mostrado quando o `look` entra no cache.
- **P10. `configure`: aviso de ausência, segunda chamada e chave estranha.**
  (i) A D119 diz "aviso em dev" sem `configure`. Como a borda não sabe quais
  nomes seriam atalhos: (a) um aviso, uma vez, na primeira resolução sem
  `configure` (incomoda quem não usa atalhos); (b) só quando um `look` traz
  classe desconhecida (`AW101`) e não houve `configure`, com a dica de chamar
  `configure`. (ii) Uma segunda chamada substitui os atalhos anteriores ou
  soma? (iii) Em JavaScript puro, uma chave além de `define` é ignorada com
  aviso em dev ou recusada? Recomendação: (i) b, (ii) substitui, (iii) ignora
  com aviso em dev.
- **P11. Como `setColorScheme` força o esquema.** Opções: (a) estado próprio do
  alanwind (vale só para os componentes dele; igual no iOS, no Android e na web
  com `react-native-web`); (b) `Appearance.setColorScheme` do RN (muda também o
  esquema do sistema para o app: barra de status, teclado, alertas; na web
  depende do suporte do `react-native-web`). Recomendação: (a).
