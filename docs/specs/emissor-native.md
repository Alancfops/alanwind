# Spec: emissor React Native

Status: **em revisão** (aprovada pelo Alan em 2026-11-26 depois das D175 a
D178; volta a revisão com a D184) ·
Decisões de origem: D14, D15, D25, D26, D27, D35, D37, D45, D49, D57, D59, D60,
D62, D64, D83, D84, D88, D94, D98, D103, D107, D108, D109, D110, D116, D117,
D119, D120, D133, D135, D136, D144, D152 a D162, D175, D176, D178, D184

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
- Anel de foco e acessibilidade dos componentes: `componentes.md`.

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
  tamanho da janela (este para as unidades de tela, R39). Estados de interação
  NÃO fazem parte do contexto (D109, D110).
- **R2.** Sem `setColorScheme`, o esquema DEVE seguir o do sistema e acompanhar
  as mudanças dele (D25, `tema.md` R3). Se o sistema não informa esquema
  (`useColorScheme()` devolve `null` ou `undefined`), o esquema DEVE ser
  `light` (D184).
- **R3.** `setColorScheme('light' | 'dark' | 'system')` DEVE forçar o esquema em
  toda a árvore, sem Provider, e os componentes já montados DEVEM atualizar.
  `'system'` DEVE voltar a seguir o sistema (D64, `tema.md` R4 e C8). O esquema
  forçado DEVE ser um estado próprio do alanwind, igual no iOS, no Android e na
  web; NÃO DEVE usar `Appearance.setColorScheme`, para não mexer em barra de
  status, teclado e alertas (D162).
- **R4.** A faixa de tela DEVE ser calculada pela largura da janela: `compact`
  abaixo de 600, `medium` de 600 a 839 e `expanded` a partir de 840 (D94). Os
  valores 599, 600, 839 e 840 DEVEM cair em `compact`, `medium`, `medium` e
  `expanded`. Os limites 600 e 840 DEVEM vir do tema que o `core` guarda, lidos
  pela camada de contexto da borda; só o emissor é proibido de consultar o tema
  (D153).
- **R5.** A plataforma DEVE ser `Platform.OS`. Com `react-native-web`, é `web`.
- **R6.** Quando o esquema, a faixa ou a plataforma mudam, as resoluções
  seguintes DEVEM usar o contexto novo. Mudar a largura **dentro da mesma
  faixa** NÃO DEVE mudar nenhum resultado (D109), salvo nos `look` com unidade
  de tela (R39).

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
  | `ScreenSize` (`{ unit: 'screen' }`) | largura da janela em `width`, altura em `height` (R39) |
  | `'auto'` (só em margem) | `'auto'` |
  | `ThemedColor` | R17 |
  | `Ratio` (`lineHeight`) | R20 |
  | `fontWeight` 400, 500, 700 | as strings `'400'`, `'500'`, `'700'` (D154) |
  | `ShadowLayer[]` (`boxShadow`) | R18 |
  | `fontFamily` genérica | R21 |

- **R17.** **Cor** (`backgroundColor`, `color`, `borderColor`): o emissor DEVE
  escolher `light` ou `dark` do `ThemedColor` pelo esquema do contexto e, com
  `alpha` igual a 1, DEVE entregar `rgb` como está (`'#2563EB'`). Com `alpha`
  menor que 1, DEVE entregar `rgba(r, g, b, a)`, com `r`, `g` e `b` em decimal
  e `a` igual ao `alpha`, separados por vírgula e espaço:
  `'rgba(37, 99, 235, 0.5)'` (D154, D31, D104; `funcionamento-interno.md` R30,
  R31).
- **R18.** **Sombra**: cada `ShadowLayer` DEVE virar uma camada de `boxShadow`,
  na mesma ordem, igual no iOS, no Android e na web (D108). O emissor NÃO DEVE
  gerar `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius` nem
  `elevation`, e NÃO conhece o conceito de elevação: a do escuro já chega em
  camadas comuns (`funcionamento-interno.md` R35). O `boxShadow` DEVE ser uma
  lista de objetos `{ offsetX, offsetY, blurRadius, spreadDistance, color }`
  (`blur` da IR vira `blurRadius`, `spread` vira `spreadDistance`), com `color`
  no formato da R17 (D155).
- **R19.** `fontSize`, `textAlign`, `fontStyle`, `textDecorationLine` e
  `textTransform` DEVEM sair com o mesmo valor da IR (D49, D77).
- **R20.** **Altura de linha**: `lineHeight` da IR é um `Ratio`; o estilo nativo
  DEVE trazer `lineHeight` igual a `tamanho da fonte × value`, em dp. O tamanho
  da fonte é o final do texto, depois da herança e do padrão do `Text` (D98,
  D112, D113; `funcionamento-interno.md` R33). O produto DEVE ser arredondado
  a duas casas decimais: `type-2xl leading=1.4` dá `33.6` (D157). O tamanho
  final vem de quem chama (os componentes, ver `componentes.md`). Em `look()`
  chamado direto, sem `type-*` no `look` e sem tamanho herdado, a conta DEVE
  usar 16, o tamanho padrão do `Text` (`type-base`, D112):
  `look('leading-normal')` dá `lineHeight: 24` (D176).
- **R21.** **Família de fonte** (`fontFamily` genérica da IR, D133): o emissor
  DEVE mapear para a fonte do sistema da plataforma, sem baixar nenhuma fonte:

  | Genérica | iOS | Android | Web |
  |---|---|---|---|
  | `sans` | `'System'` | `'Roboto'` | `'system-ui, sans-serif'` |
  | `serif` | `'Georgia'` | `'serif'` | `'Georgia, serif'` |
  | `mono` | `'Menlo'` | `'monospace'` | `'ui-monospace, monospace'` |

  Os valores são os textos exatos da propriedade `fontFamily` (D156). A pilha
  da web vale também para o emissor CSS.
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
  uma constante nomeada, de valor 500, e os testes DEVEM ler a constante
  (D109, D159).
- **R28.** Mesma entrada e mesmo contexto DEVEM devolver o **mesmo objeto**
  (identidade), vindo do cache. O objeto devolvido NÃO DEVE ser alterado pela
  borda depois de guardado.
- **R29.** Os estados de interação, que mudam por elemento, NÃO entram na chave
  da D109. Cada entrada do cache DEVE guardar o resultado de cada combinação de
  estados já pedida (no máximo 16: `hover`, `press`, `focus`, `disabled`).
  Mesma entrada, mesmo contexto e mesmos estados DEVEM devolver o mesmo objeto
  (D159).
- **R30.** Trocar a configuração (`configure`) DEVE passar a usar o tema novo na
  chave, sem aproveitar resultados da configuração anterior (D109, R35).
- **R39.** **Unidades de tela** (`w-screen`, `h-screen`, `size-screen`): DEVEM
  usar a **janela** (`useWindowDimensions`), a mesma da faixa. Quando a IR do
  `look` tem unidade de tela, a chave do cache DEVE levar a largura e a altura
  exatas da janela; os demais `look` continuam só com a faixa (D152).
- **R40.** **API pública** (D158, D26, D27): o `native` DEVE exportar
  `look(input, { context?, states? })`, que devolve `NativeLook` (estilo e
  props). Sem `context`, ela DEVE ler o esquema e a janela naquele instante e
  NÃO reage a mudanças. O `native` DEVE exportar também `useLook(input,
  states?)`, que DEVE reagir às mudanças de contexto (esquema, faixa) e é o que
  os componentes usam; é público já na fase 1.

### 3.6 Diagnósticos na borda

- **R31.** A resolução DEVE pedir ao `core` os diagnósticos e a borda DEVE
  decidir: em desenvolvimento, mostrar; em produção, ignorar (D35, D84;
  `funcionamento-interno.md` R41). Dev DEVE ser `__DEV__`; o canal DEVE ser
  `console.warn`; DEVE haver um aviso por combinação de `look`, código e
  posição, mostrado quando o `look` entra no cache (D160).
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
- **R36.** Sem `configure`, os atalhos DEVEM ficar desligados (D119). O aviso
  de ausência DEVE aparecer em dev só quando um `look` traz classe desconhecida
  (`AW101`) sem `configure` chamado, com a dica de chamá-lo (D161).
  `defineConfig({})` ou nenhuma configuração DEVE dar o tema padrão sem atalhos
  (`tema.md` R28).
- **R37.** `configure` NÃO DEVE ler arquivo: o app importa o
  `alanwind.config.ts` e chama a função (D119).
- **R41.** Uma segunda chamada de `configure` DEVE substituir os atalhos da
  anterior, sem somar. Uma chave além de `define` (possível em JavaScript puro)
  DEVE ser ignorada, com aviso em dev (D161).
- **R42.** **Empacotamento** (D175, D178): o `@alanwind/native` DEVE ser
  publicado só em ESM, sem build CJS, para um app nunca carregar duas cópias do
  estado do módulo (cache, `configure`). O pacote DEVE ter um `README.md` com a
  instalação e dois avisos de uso: o do atalho do React Native no `style`
  (`componentes.md` R2, D167) e o do Jest, em que quem usa Jest DEVE incluir
  `@alanwind/native` no `transformIgnorePatterns`, por ser só ESM.

### 3.8 Classes sem tradução

- **R38.** Na fase 1, todo o vocabulário tem tradução no React Native (variantes
  são condições, não classes). Não há classe exclusiva da web. Quando existir
  uma, a matriz de suporte por plataforma (seção 4 da visão, ainda proposta)
  precisa ser decidida antes de entrar aqui.

## 4. Formato

Tipos TypeScript do contrato, com os nomes da D158 para a API pública; o
comportamento é o das regras acima.

```ts
export type ScreenBand = 'compact' | 'medium' | 'expanded';

export interface ResolutionContext {
  readonly scheme: 'light' | 'dark';
  /** Derivada da largura da janela (R4). Entra na chave do cache (R26). */
  readonly band: ScreenBand;
  readonly platform: 'ios' | 'android' | 'web';
  /** Janela, em dp. R9 e as unidades de tela (R39). */
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

/** API pública (R40, D158). `Look` é o tipo da `030`. */
export function look(
  input: Look,
  options?: {
    readonly context?: ResolutionContext;
    readonly states?: InteractionStates;
  },
): NativeLook;
export function useLook(input: Look, states?: InteractionStates): NativeLook;
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
| `leading-normal`, `look()` direto, sem herança | — | `{ lineHeight: 24 }` (D176) |
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

Valores da D156 (fontes: D133, `tema.md` 5.10 e 7.2).

| `look` | Plataforma | Estilo nativo |
|---|---|---|
| `font-sans` | `ios` | `{ fontFamily: 'System' }` |
| `font-sans` | `android` | `{ fontFamily: 'Roboto' }` |
| `font-sans` | `web` | `{ fontFamily: 'system-ui, sans-serif' }` |
| `font-serif` | `ios` | `{ fontFamily: 'Georgia' }` |
| `font-serif` | `android` | `{ fontFamily: 'serif' }` |
| `font-serif` | `web` | `{ fontFamily: 'Georgia, serif' }` |
| `font-mono` | `ios` | `{ fontFamily: 'Menlo' }` |
| `font-mono` | `android` | `{ fontFamily: 'monospace' }` |
| `font-mono` | `web` | `{ fontFamily: 'ui-monospace, monospace' }` |

### 5.4 Cor com alfa, `fontWeight`, sombra e unidades de tela

| `look` | Contexto | Estilo nativo | Origem |
|---|---|---|---|
| `bg-primary-50` | claro | `{ backgroundColor: 'rgba(37, 99, 235, 0.5)' }` | D154 |
| `bg=#e11d48/50` | qualquer | `{ backgroundColor: 'rgba(225, 29, 72, 0.5)' }` | D154 |
| `weight-bold` | — | `{ fontWeight: '700' }` | D154 |
| `type-2xl leading=1.4` | — | `{ fontSize: 24, lineHeight: 33.6 }` | D157 |
| `bg-surface shadow-md` | claro | `{ backgroundColor: '#FFFFFF', boxShadow: [{ offsetX: 0, offsetY: 4, blurRadius: 8, spreadDistance: 0, color: 'rgba(0, 0, 0, 0.08)' }, { offsetX: 0, offsetY: 1, blurRadius: 2, spreadDistance: 0, color: 'rgba(0, 0, 0, 0.06)' }] }` | D155 |
| `bg-surface shadow-md` | escuro | `{ backgroundColor: '#28282D', borderColor: '#34343A', borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, boxShadow: [{ offsetX: 0, offsetY: 4, blurRadius: 8, spreadDistance: 0, color: 'rgba(0, 0, 0, 0.35)' }] }` | D155 |
| `h-screen` | janela 390 × 844 | `{ height: 844 }` | D152 |
| `size-screen` | janela 390 × 844 | `{ width: 390, height: 844 }` | D152 |
| `h-screen` | janela 390 × 800 | `{ height: 800 }` | D152 |

### 5.5 Cache (R26 a R28)

| Chamadas | Resultado |
|---|---|
| `look` igual, mesmo contexto, duas vezes | o mesmo objeto (identidade) |
| `pad-4 medium(row)` com largura 700 e depois 800 | o mesmo objeto (as duas são `medium`) |
| `pad-4 medium(row)` com largura 599 e depois 600 | objetos diferentes (faixas diferentes) |
| `bg-primary` claro e depois escuro | objetos diferentes |
| `bg-primary` em `ios` e depois em `android` | objetos diferentes |
| `limite + 1` combinações diferentes, depois a primeira de novo | a primeira foi descartada: o objeto devolvido é novo, mas igual por valor |
| `bg-primary press(bg-primary-hover)` com `press` ativo, duas vezes | o mesmo objeto (mesmos estados) |
| o mesmo `look`, com `press` ativo e depois sem | objetos diferentes; cada combinação de estados fica guardada (R29) |
| `h-screen` com janela 390 × 844 e depois 390 × 800 | objetos diferentes (a chave leva a janela, R39) |
| `h-screen` com janela 390 × 844 duas vezes | o mesmo objeto |

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
| `look="btn"` sem `configure` | `btn` é `AW101` em dev, com a dica de chamar `configure` (R36); produção ignora |
| `look="pad-4"` sem `configure` | nenhum aviso de ausência (R36) |
| `configure` duas vezes, com `btn` só na primeira | na segunda chamada `btn` não existe mais (R41) |
| `configure({ define: {}, palette: {} })` em JavaScript | `palette` ignorada, com aviso em dev (R41) |
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
| `lineHeight` com `Ratio` | `tamanho da fonte × value`, a duas casas (R20) |
| `leading-*` sem `type-*` nem herança, em `look()` | Tamanho 16 na conta (R20, D176) |
| Pacote carregado em CJS | Não existe build CJS; só ESM (R42, D175) |
| `w-screen`, `h-screen`, `size-screen` | Janela exata na chave do cache (R39) |
| `setColorScheme` | Estado próprio; não chama `Appearance` (R3) |
| `look()` sem `context` | Lê esquema e janela naquele instante; não reage (R40) |
| Aviso repetido para o mesmo `look`, código e posição | Mostrado uma vez (R31) |
| Classe desconhecida, sintaxe quebrada | O resto do `look` vale; aviso só em dev; sem exceção (R31, R32) |
| `configure` não chamado | Atalhos desligados; aviso em dev só com `AW101` (R36) |
| `defineConfig` com chave além de `define` | Erro de tipo (R34) |
| Escala de fonte do sistema maior | O texto cresce; o alanwind não limita (R22) |

## 7. Critérios de aceite

- [ ] Cada linha das tabelas 5.1 a 5.7 produz a saída indicada (testes de
      ouro; entrada: IR escrita à mão para o emissor, `look` para a
      resolução).
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
- [ ] `look()` e `useLook()` existem com as assinaturas da seção 4; `useLook`
      reage a `setColorScheme` e à mudança de faixa (R40).
- [ ] Um aviso por combinação de `look`, código e posição; nenhum em
      produção (R31).
- [ ] `look('leading-normal')` dá `lineHeight: 24` (R20, D176).
- [ ] O pacote `native` sai só em ESM e o `README.md` traz a instalação e os
      avisos do `style` e do Jest (R42, D175, D178).
- [ ] Os tipos exportados funcionam com a Strict TypeScript API do React Native
      0.88 (D14, D116).

## 8. Ainda não definido

Vazio.

O que as D152 a D162 resolveram saiu daqui: unidades de tela e cache (D152),
origem das faixas (D153), formato de cor com alfa e `fontWeight` (D154),
`boxShadow` (D155), `fontFamily` (D156), arredondamento do `lineHeight` (D157),
API pública (D158), estados no cache e limite (D159), aviso em dev (D160),
`configure` (D161) e `setColorScheme` (D162).
