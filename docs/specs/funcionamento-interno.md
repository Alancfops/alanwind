# Spec: funcionamento interno (representação intermediária, IR)

Status: **em revisão** (estrutura completa; seção 8 vazia; aguarda o Alan) ·
Decisões de origem: D15, D31, D33, D35, D36, D37, D38, D58, D59, D60, D61, D62,
D65, D74, D78, D82 a D90, D92, D94, D96 a D99, D101, D103 a D108, D110, D117,
D118, D120, D122, D124, D125, D127, D132, D133, D135 a D140

Formato neutro que o `core` produz e os emissores consomem: estilo, props e
diagnósticos, sem conflitos e sem nada específico de plataforma. Contrato
central entre os pacotes (ADR 0002).

Os nomes de tipos e de campos da seção 4 foram aprovados na D120 (as propostas
de formato em bloco), com os ajustes da D135 (`props` com camadas, origem do
diagnóstico) e os nomes da D139 (`PropsIR`, `PropsLayer`, `PropsMap`, `origin`).

## 1. Escopo

Cobre:

- O resultado da resolução de um `look`: parte de estilo, parte de props e lista
  de diagnósticos (D83, D84).
- Como a IR representa condições (variantes), valores (tamanho, cor, opacidade,
  sombra) e o que o `core` já traduz antes de entregar (conflito, precedência
  entre condições, `center-x`, `center-y`, `x-start` e afins, elevação no
  escuro).
- Os campos de um diagnóstico.

Fica de fora:

- Tokenização, gramática e vocabulário das classes: `sintaxe.md`.
- Catálogo de códigos `AW###` e textos das mensagens: `sintaxe.md`.
- Valores do tema padrão (cores, escalas, sombras): `tema.md`.
- Tradução da IR em objetos do React Native ou em CSS: `emissor-native.md` e
  `emissor-css.md`.
- Herança de texto entre componentes, `style` vencendo `look`, `contentLook`:
  `componentes.md` (D53, D57, D113).
- Assinatura da função de resolução e cache (D109).
- Presets: adiados (D90). O vocabulário fica direto no `core`.

## 2. Definições

| Termo | Significado |
|---|---|
| **IR** | Representação intermediária: o dado que sai do `core` e entra nos emissores (D74). |
| **Resultado** (`ResolvedLook`) | O que a resolução de um `look` devolve: estilo + props + diagnósticos (D83, D84). |
| **Camada** (`StyleLayer`, `PropsLayer`) | Um conjunto de declarações (de estilo ou de props) que valem sob uma mesma condição (D135). |
| **Condição** (`Condition`) | Lista de átomos combinados por E lógico. Lista vazia = sempre vale. |
| **Átomo** (`ConditionAtom`) | Uma condição simples: estado, esquema de cor, plataforma ou faixa de tela (D37, D59, D103). |
| **Declaração** | Um par propriedade-valor dentro de uma camada. |
| **Propriedade neutra** | Nome de propriedade da IR. Usa os nomes em camelCase que React Native e CSS têm em comum; não é a saída de nenhum dos dois. |
| **Papel** | Nome de cor do tema (`primary`, `surface`...). Na IR já virou valor (D33). |
| **Direção final** | `row` ou `column` que vale numa condição, depois de somar `row`, `col` e variantes. Sem declaração, é `column` (D62). |
| **Diagnóstico** | Erro ou aviso devolvido junto do resultado (D84). |
| **Borda** | `native`, plugin de build e CDN: quem decide mostrar ou ignorar diagnósticos (D84). |

## 3. Regras normativas

### 3.1 Forma do resultado

- **R1.** A resolução DEVE devolver sempre `ResolvedLook` com as três partes
  presentes (`style`, `props`, `diagnostics`), mesmo vazias (D83, D84).
- **R2.** A resolução NÃO DEVE lançar exceção por causa do conteúdo do `look`,
  seja qual for a string. Entrada inválida vira diagnóstico (D88).
- **R3.** A IR DEVE ser dado puro: objetos, listas, strings e números finitos.
  NÃO DEVE conter funções, classes, `undefined` explícito, referência ao tema
  nem qualquer coisa de plataforma (D15, D74). DEVE sobreviver a uma ida e volta
  por JSON sem mudar.
- **R4.** A resolução DEVE ser determinística: a mesma entrada (`look` e tema)
  produz a mesma IR, inclusive na ordem das camadas e dos diagnósticos (D15).
- **R5.** Os emissores NÃO DEVEM consultar o tema. Todo valor que depende dele
  (cores, escalas, sombras, faixas de tela) já sai resolvido na IR (D74, D82).
- **R6.** Atalhos (`define`) DEVEM ser expandidos antes da resolução. A IR não
  tem noção de atalho (D36, D63, D101).

### 3.2 Conflito

- **R7.** O `core` DEVE aplicar a regra de conflito da D58 uma única vez, antes
  de entregar a IR. Em cada camada de estilo, uma propriedade DEVE aparecer no
  máximo uma vez; em cada camada de props, cada prop também (D82, D135).
- **R8.** Os emissores NÃO DEVEM reimplementar a regra de conflito (D82).
- **R9.** Entre classes de mesma especificidade que disputam a mesma propriedade
  **sob a mesma condição**, DEVE valer a última escrita, e o `core` DEVE
  devolver um diagnóstico de severidade `warning`, com a posição da classe que
  perdeu (D58, D84, D120). Classes em condições diferentes não disputam: no
  exemplo `bg-surface hover(bg-raised)` há duas camadas (D58, D117).
- **R10.** A especificidade vale por lado (`pad-top` vence `pad-y`, que vence
  `pad`) e não depende da ordem de escrita: `pad-4 pad-x-2` e `pad-x-2 pad-4`
  produzem a mesma IR (D58).
- **R11.** A IR NÃO DEVE carregar especificidade nem ordem de escrita das
  classes. Esses dados morrem no `core`, depois de aplicar a regra (D82).
- **R12.** `pad`, `margin` e largura de borda DEVEM sair da IR em lados
  explícitos (`paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft`, e o
  mesmo para margem e borda). A IR NÃO DEVE ter propriedades de eixo nem
  atalhos de lados (`paddingHorizontal`, `padding`), pois a regra de conflito
  por lado exige lados explícitos (D58, D87, D107, D120). Pela mesma razão,
  `gap` DEVE sair como `rowGap` e `columnGap` (D125) e o raio como os quatro
  cantos `borderTopLeftRadius`, `borderTopRightRadius`,
  `borderBottomRightRadius` e `borderBottomLeftRadius` (D124); estender a regra
  a `gap` e ao raio foi aprovado na D139.

### 3.3 Condições e camadas

- **R13.** Cada variante DEVE virar um átomo. Variantes aninhadas somam átomos
  (E lógico), em qualquer ordem de escrita: `dark(hover(x))` e `hover(dark(x))`
  DEVEM produzir IR idêntica (D86).
- **R14.** Uma condição DEVE ser canônica: sem átomos repetidos e com os
  átomos na ordem da tabela de variantes da `sintaxe.md` (5.1): `hover`,
  `press`, `focus`, `disabled`, `dark`, `light`, `ios`, `android`, `web`,
  `native`, `medium`, `expanded`. `press(hover(x))` vira `[hover, press]`. O que
  está escrito sem variante tem condição vazia (D120, D140).
- **R15.** Cada ocorrência de variante DEVE virar a sua própria camada, na ordem
  escrita, **sem fundir** condições iguais (D140). Os itens sem variante formam
  uma só camada, de condição vazia. Não DEVE haver camada com `declarations`
  vazio, tanto no estilo quanto nas props (D135). Um `look` sem declarações tem
  `layers: []`. Duas camadas podem ter a mesma `when`; a posterior vence a
  anterior, e o conflito gera aviso (R9).
- **R16.** A ordem das camadas DEVE reproduzir a precedência da D117 e da D136,
  para que aplicar na ordem da lista (a posterior vence, propriedade a
  propriedade) dê o vencedor certo. A ordem é total, sem ciclo:
  1. menos átomos antes de mais átomos (a camada de condição vazia, se existir,
     vem primeiro; `[hover]` antes de `[hover, dark]`);
  2. com o mesmo número de átomos, a camada sem faixa de tela vem antes da de
     `medium`, que vem antes da de `expanded`, mesmo contra outro tipo de
     átomo (`[hover]` antes de `[medium]`), pois `medium(x) expanded(y)` desfaz
     no tamanho maior (D37, D106, D136);
  3. no mais, a ordem de escrita (a última escrita vem depois).
  Isso vale para as camadas de estilo e para as de props (D135). Em
  `expanded(x) hover(x) medium(x)`, a ordem é `[hover]`, `[medium]`,
  `[expanded]` e vale `expanded`. Como cada ocorrência é uma camada (R15), em
  `hover(bg-raised) press(bg-surface) hover(pad-4)` a ordem é `[hover]`,
  `[press]`, `[hover]` e, com `hover` e `press` ativos, vale `bg-surface`
  (D140).
- **R17.** Os emissores DEVEM aplicar as camadas na ordem da lista: entre as
  camadas cuja condição vale no momento, a posterior vence a anterior,
  propriedade a propriedade (D117, D135).
- **R18.** Átomos de **faixa de tela**: `medium` vale com largura da janela
  `>= 600` e `expanded` com `>= 840` (D94). Valem "a partir de": `medium` também
  vale em `expanded` (D37). O átomo DEVE trazer `minWidth` já preenchido pelo
  `core` (a partir do tema), para os emissores não repetirem os números. Não
  existe átomo para `compact` (D61) nem para faixa exata (D106).
- **R19.** Átomos de **estado**: `hover` vale só onde há ponteiro (D59, D110);
  `press` vale para o elemento pressionado em todas as plataformas (D59);
  `focus` vale com foco e `disabled` com o elemento desabilitado (D103). Quem
  avalia o estado é o emissor.
- **R20.** Átomo de **plataforma**: `ios`, `android` e `web`; `native` vale em
  `ios` e em `android` (D103). Átomo de **esquema**: `dark` e `light` (D103).
  Quem avalia é o emissor.
- **R21.** `motion-safe(...)` NÃO DEVE ter átomo na fase 1 (D78).
- **R44.** Condições redundantes DEVEM ser simplificadas em silêncio, sem
  diagnóstico, para a forma mínima, antes de formar a camada: `ios(native(x))`
  vira a condição `[ios]` e `medium(expanded(x))` vira `[expanded]`. Condições
  impossíveis (`dark` com `light`, `ios` com `web`) seguem a D127: o diagnóstico
  `AW202` (aviso) é devolvido e o trecho é **descartado da IR**: nenhuma camada
  é criada com a condição contraditória (D135, D127, D138).

### 3.4 Centralização e alinhamento

- **R22.** O `core` DEVE traduzir `center`, `center-x`, `center-y`, `x-start`,
  `x-end`, `y-start` e `y-end` em propriedades flex comuns (`justifyContent`,
  `alignItems`); a IR NÃO DEVE guardar a intenção de centralizar ou alinhar
  (D38, D85, D122).
- **R23.** `center` DEVE virar `justifyContent: 'center'` junto com
  `alignItems: 'center'` (D38).
- **R24.** `center-x`, `center-y`, `x-start`, `x-end`, `y-start` e `y-end`
  valem para a **tela**, não para a direção do layout (D38, D122). Com direção
  final `column`, o eixo x é o transversal (`alignItems`) e o eixo y é o
  principal (`justifyContent`); com `row`, é o contrário (D38, D85):

  | Classe | `column` | `row` |
  |---|---|---|
  | `center-x` | `alignItems: 'center'` | `justifyContent: 'center'` |
  | `center-y` | `justifyContent: 'center'` | `alignItems: 'center'` |
  | `x-start` | `alignItems: 'flex-start'` | `justifyContent: 'flex-start'` |
  | `x-end` | `alignItems: 'flex-end'` | `justifyContent: 'flex-end'` |
  | `y-start` | `justifyContent: 'flex-start'` | `alignItems: 'flex-start'` |
  | `y-end` | `justifyContent: 'flex-end'` | `alignItems: 'flex-end'` |

- **R25.** Sem `row`/`col`, a direção final é `column` (D62). O `core` DEVE usar
  a direção que vale em cada condição, inclusive a trazida por variante como
  `medium(row)` (D85).
- **R26.** Quando uma condição muda a direção, a camada dessa condição DEVE
  trazer a tradução para a nova direção. A propriedade que a camada anterior
  definiu e que a nova direção não define DEVE receber nessa camada o valor
  inicial (`alignItems: 'stretch'`, `justifyContent: 'flex-start'`); sem isso, o
  valor da camada base continuaria valendo e a classe passaria a valer nos dois
  eixos (D38, D120).
- **R45.** Quando o alinhamento está numa condição e a direção em outra
  (`dark(center-x) medium(row)`), o `core` DEVE gerar uma camada combinada com
  as duas condições (`[dark, medium]`), com a tradução certa para a direção
  que vale nessa combinação. Ela vence as camadas de uma condição só (D117,
  D135).
- **R46.** `between` DEVE virar `justifyContent: 'space-between'` e não depende
  da direção: vale no eixo principal (D122). `wrap` DEVE virar
  `flexWrap: 'wrap'` e `fill` DEVE virar `flex: 1` (D122). `between` junto com
  um alinhamento que escreve o mesmo `justifyContent` (ou `alignItems`, conforme
  a direção final) é um conflito normal: o `core` aplica a regra da D58, vale a
  última escrita e devolve o aviso de conflito (D138).

### 3.5 Props

- **R27.** Classes que viram prop do componente, e não estilo, DEVEM ir para
  `props`, não para `style` (D83). Na fase 1: `lines-N` DEVE virar
  `numberOfLines: N`. O emissor só traduz (o emissor CSS traduz para o
  equivalente em CSS na web).
- **R28.** `props` tem **camadas com condição**, como o estilo, com a mesma
  precedência (R16, R17, D117): `medium(lines-2) lines-4` funciona e dá duas
  camadas de props. Acrescentar uma prop é acrescentar um campo em `PropsMap` e
  atualizar esta spec (D83, D135).

### 3.6 Valores

- **R29.** **Tamanho** (`width`, `height`) e **espaço** (`padding*`, `margin*`,
  `rowGap`, `columnGap`): número = px na web e dp no nativo, inteiro ou
  decimal (D125); `{ unit: 'percent' }` para porcentagem; `w-full`/`h-full`
  DEVEM virar 100% (`percent` 100); `w-screen` e `h-screen` DEVEM virar
  `{ unit: 'screen' }` (largura ou altura da tela, pela propriedade); `'auto'`
  só em margem (D89, D98, D105). `size-N`, `size-full` e `size-screen` DEVEM
  virar `width` e `height` com o mesmo valor (D98, D125). `gap-N` DEVE virar
  `rowGap` e `columnGap`; `gap-x-N` DEVE virar `columnGap` e `gap-y-N`,
  `rowGap`, relativos à tela (D125). Margem negativa é número negativo (D89).
- **R30.** **Cor** (`backgroundColor`, `color`, `borderColor`): o valor DEVE ser
  um `ThemedColor`, com a cor do claro e a do escuro já resolvidas (D33, D99).
  Um papel DEVE virar as duas cores do papel (incluindo `-soft`, `-hover`,
  `on-`, `on-<papel>-soft` e o tom automático de `text-<papel>`, D92, D131). Uma
  cor livre (`bg=#e11d48`) DEVE ter as duas cores iguais. Assim,
  `dark(bg=#e11d48)` só sobrepõe a camada base, como exceção (D103). Resolver o
  papel para o par, e não por camadas de esquema, foi aprovado na D120. Tom da
  paleta (`bg=red-40`) não existe na fase 1 (D118).
- **R31.** `rgb` DEVE ser `#RRGGBB` com letras maiúsculas; hex de 3 dígitos
  DEVE ser expandido para 6. A opacidade (D31, D104) DEVE ir em `alpha`, de 0 a
  1, nas duas cores: `bg-primary-50` e `bg=#e11d48/50` têm `alpha: 0.5`. Hex de
  8 dígitos DEVE virar `rgb` + `alpha` igual ao byte dividido por 255, sem
  arredondar (D105, D120).
- **R32.** `opacity-N` (opacidade do elemento) DEVE virar `opacity` de 0 a 1
  (`opacity-50` = `0.5`) (D98).
- **R33.** **Altura de linha**: `leading-*` DEVE virar um `Ratio`
  (`{ unit: 'ratio', value }`; `leading-normal` = 1.5; `leading=1.4` =
  `value: 1.4`), **sem** multiplicar pelo `type-*`: o tamanho final pode vir da
  herança de texto, que o `core` não vê (D98, D57, D125). O emissor calcula
  `fontSize * value`.
- **R34.** **Sombra**: `shadow-*` DEVE virar `boxShadow`, uma lista de camadas
  de sombra, na ordem da D96 (`shadow-md`: primeiro `0 4px 8px a 8%`, depois
  `0 1px 2px a 6%`), com `spread` 0 e cor preta com a opacidade em `alpha`. As
  camadas do claro DEVEM ficar numa camada de estilo com o átomo de esquema
  `light` (D96, D108).
- **R35.** **Elevação automática no escuro** (D97, D132, D137): o `core` DEVE
  expandir `shadow-*` numa camada de estilo com o átomo `scheme: dark`, com
  declarações comuns: `backgroundColor` um nível acima, `borderColor` `#34343A`,
  largura de borda 1 nos quatro lados e `boxShadow` preto com **uma só camada**
  (`shadow-sm` 0 1px 2px a 30%; `shadow-md` 0 4px 8px a 35%; `shadow-lg`
  0 12px 24px a 40%). As três classes clareiam o fundo no mesmo um nível: quem
  já está em `bg-raised` fica em `raised`; sem `bg-*`, parte de `page`.
  `backgroundColor` e `borderColor` dessa camada têm as duas cores iguais, como
  cor livre, porque a camada só vale no escuro.
  **O escrito vence** (D137): a elevação só preenche o que falta. Com `bg-*`
  fora de `page`, `surface` e `raised` (`bg-primary`) ou com `dark(bg...)`
  explícito, a camada NÃO DEVE declarar `backgroundColor`; com `border` próprio,
  NÃO DEVE declarar a borda que o `look` já escreve; a sombra discreta continua
  sempre. Os emissores NÃO DEVEM conhecer o conceito de elevação (D45, D82).
- **R36.** Valores fixos de `StyleMap` (`fontWeight`: 400, 500, 700;
  `round-full` = 9999 em cada um dos quatro raios) seguem o tema padrão (D44,
  D98).
- **R47.** **Raio**: `round-*` DEVE virar os quatro raios de canto;
  `round-top-*` e afins, os dois cantos do lado; `round-top-left-*` e afins, um
  canto (D124).
- **R48.** **Família de fonte**: `font-sans`, `font-serif` e `font-mono` DEVEM
  virar `fontFamily` com a família genérica (`'sans'`, `'serif'`, `'mono'`). O
  emissor mapeia para a fonte do sistema de cada plataforma (D120, D133).

### 3.7 Diagnósticos

- **R37.** Um diagnóstico DEVE ter `code` (`AW###`, do catálogo da
  `sintaxe.md`), `severity` (`error` ou `warning`), `message`, `position` e,
  quando houver, `suggestion` (D84, D35).
- **R38.** `position` DEVE ser `{ start, end }`: deslocamentos de 0 a
  `look.length` (unidades UTF-16) na string `look` original, `end` exclusivo,
  `start <= end` (D120). Para erro dentro de atalho, ver a R49.
- **R39.** `diagnostics` DEVE vir ordenado por `position.start` crescente;
  no empate, mantém a ordem em que o `core` achou os problemas (D120).
- **R40.** `message` é texto livre para pessoas: NÃO faz parte do contrato, e os
  testes de ouro NÃO DEVEM comparar o texto. `suggestion`, quando existir, DEVE
  ser o texto que substitui o trecho de `position` (ex.: a classe sugerida).
- **R41.** O `core` NÃO DEVE saber se está em desenvolvimento ou produção: DEVE
  devolver sempre os diagnósticos. Quem filtra é a borda (D84, D35).
- **R42.** Sintaxe malformada, classe desconhecida, variante desconhecida (como
  `compact(...)`, D61) e papel inexistente DEVEM descartar **só o trecho
  afetado** e gerar diagnóstico; o resto do `look` DEVE ser resolvido
  normalmente (D88, D35).
- **R49.** Erro dentro do conteúdo de um atalho DEVE ter como `position` o nome
  do atalho no `look` e trazer `origin`, com o nome do atalho e a posição do
  trecho dentro do texto do `define` (D135). Diagnósticos fora de atalho NÃO
  DEVEM ter `origin`.

### 3.8 Vocabulário

- **R43.** O vocabulário DEVE ficar direto no `core`, como fonte única do que
  cada classe faz (D83, D90). Acrescentar propriedade neutra, átomo ou prop é
  mudança desta spec (skill `adicionar-utilitario`).

## 4. Formato

Tipos TypeScript do contrato (aprovados na D120, com os ajustes da D135). Tudo
é `readonly`. A ordem das chaves de um objeto não importa; a ordem das listas
importa (R14, R16, R17, R39).

```ts
// ---------- resultado ----------
export interface ResolvedLook {
  readonly style: StyleIR;
  readonly props: PropsIR;
  readonly diagnostics: readonly Diagnostic[];
}

// ---------- estilo e condições ----------
export interface StyleIR {
  /** Em ordem de aplicação: a camada posterior vence, por propriedade. */
  readonly layers: readonly StyleLayer[];
}

export interface StyleLayer {
  readonly when: Condition;
  readonly declarations: StyleMap;
}

/** E lógico dos átomos. Lista vazia: sempre vale. Canônica (R14). */
export type Condition = readonly ConditionAtom[];

export type ConditionAtom =
  | {
      readonly kind: 'platform';
      readonly platform: 'ios' | 'android' | 'web' | 'native';
    }
  | { readonly kind: 'scheme'; readonly scheme: 'light' | 'dark' }
  | {
      readonly kind: 'screen';
      readonly from: 'medium' | 'expanded';
      /** Largura mínima da janela, em px/dp. Vem do tema (D94). */
      readonly minWidth: number;
    }
  | {
      readonly kind: 'state';
      readonly state: 'hover' | 'press' | 'focus' | 'disabled';
    };

// ---------- props (camadas com condição, D135) ----------
export interface PropsIR {
  /** Mesma ordem e precedência do estilo (R16, R17). */
  readonly layers: readonly PropsLayer[];
}

export interface PropsLayer {
  readonly when: Condition;
  readonly declarations: PropsMap;
}

export interface PropsMap {
  readonly numberOfLines?: number; // lines-N
}

// ---------- valores ----------
export interface Percent {
  readonly unit: 'percent';
  readonly value: number;
}
export interface ScreenSize {
  readonly unit: 'screen'; // largura ou altura da tela, pela propriedade
}
export interface Ratio {
  readonly unit: 'ratio';
  readonly value: number; // múltiplo do tamanho da fonte
}
export type Dimension = number | Percent; // número = px (web) / dp (nativo)

export interface Color {
  readonly rgb: string; // '#RRGGBB', maiúsculas
  readonly alpha: number; // 0 a 1
}
export interface ThemedColor {
  readonly light: Color;
  readonly dark: Color;
}

export interface ShadowLayer {
  readonly offsetX: number;
  readonly offsetY: number;
  readonly blur: number;
  readonly spread: number;
  readonly color: Color;
}

// ---------- propriedades neutras ----------
export interface StyleMap {
  // layout
  readonly flexDirection?: 'row' | 'column';
  readonly flexWrap?: 'wrap';
  readonly flex?: number; // fill
  readonly justifyContent?:
    | 'flex-start' | 'center' | 'flex-end' | 'space-between';
  readonly alignItems?: 'stretch' | 'flex-start' | 'center' | 'flex-end';
  readonly rowGap?: Dimension; // gap-y (R12, D139)
  readonly columnGap?: Dimension; // gap-x (R12, D139)

  // espaço (sempre por lado, R12)
  readonly paddingTop?: Dimension;
  readonly paddingRight?: Dimension;
  readonly paddingBottom?: Dimension;
  readonly paddingLeft?: Dimension;
  readonly marginTop?: Dimension | 'auto';
  readonly marginRight?: Dimension | 'auto';
  readonly marginBottom?: Dimension | 'auto';
  readonly marginLeft?: Dimension | 'auto';

  // tamanho
  readonly width?: Dimension | ScreenSize;
  readonly height?: Dimension | ScreenSize;

  // cor
  readonly backgroundColor?: ThemedColor;
  readonly color?: ThemedColor; // cor do texto
  readonly borderColor?: ThemedColor;

  // borda, raio, sombra, opacidade
  readonly borderTopWidth?: number;
  readonly borderRightWidth?: number;
  readonly borderBottomWidth?: number;
  readonly borderLeftWidth?: number;
  readonly borderTopLeftRadius?: number; // (R12, D139)
  readonly borderTopRightRadius?: number;
  readonly borderBottomRightRadius?: number;
  readonly borderBottomLeftRadius?: number;
  readonly boxShadow?: readonly ShadowLayer[];
  readonly opacity?: number; // 0 a 1

  // tipografia
  readonly fontSize?: number;
  readonly fontWeight?: 400 | 500 | 700;
  readonly lineHeight?: Ratio;
  readonly textAlign?: 'left' | 'center' | 'right';
  readonly fontFamily?: 'sans' | 'serif' | 'mono';
  readonly fontStyle?: 'italic';
  readonly textDecorationLine?: 'underline';
  readonly textTransform?: 'uppercase' | 'lowercase';
}

// ---------- diagnósticos ----------
export interface Diagnostic {
  readonly code: `AW${number}`; // catálogo na sintaxe.md
  readonly severity: 'error' | 'warning';
  readonly message: string; // texto livre, fora do contrato (R40)
  readonly position: Position;
  readonly suggestion?: string; // texto que substitui o trecho
  /** Só em erro dentro de atalho (R49, D135). */
  readonly origin?: DiagnosticOrigin;
}

export interface Position {
  readonly start: number;
  readonly end: number;
}

export interface DiagnosticOrigin {
  readonly shortcut: string; // nome do atalho
  readonly position: Position; // dentro do texto do define
}
```

Notas sobre o formato:

- `fontFamily` guarda a família genérica; o emissor mapeia para a fonte do
  sistema de cada plataforma (D49, D133) ou para a que o tema trocar.
- Larguras de borda por lado e `borderColor` único: a cor de borda não tem lados
  no vocabulário decidido (D123); só a largura tem.
- `Position` e `DiagnosticOrigin` e o nome do campo `origin` seguem o texto da
  D135 ("campo de origem com o atalho e a posição dentro do texto do `define`");
  os nomes foram aprovados na D139.

## 5. Exemplos

Notação, só para ler: `T(claro, escuro)` = `{ light: { rgb: claro, alpha: 1 },
dark: { rgb: escuro, alpha: 1 } }`; `PAD(n)` = `paddingTop`, `paddingRight`,
`paddingBottom` e `paddingLeft`, todos `n`; `BORDER(n)` = `borderTopWidth`,
`borderRightWidth`, `borderBottomWidth` e `borderLeftWidth`, todos `n`;
`RADIUS(n)` = os quatro raios de canto, todos `n`; `GAP(n)` = `rowGap` e
`columnGap`, ambos `n`. Os testes de ouro escrevem os objetos por inteiro.
Códigos `AW###` aparecem como marcador `AW<nome>`, porque o catálogo é da
`sintaxe.md`. Valores de cor: D46, D50, D51, D95, D128. Todos os exemplos têm
`props: { layers: [] }` e `diagnostics: []`, salvo quando dito.

### 5.1 Estilo simples

| `look` | `layers` |
|---|---|
| `pad-4 bg-surface` | `[{ when: [], declarations: { ...PAD(16), backgroundColor: T('#FFFFFF', '#1E1E22') } }]` |
| `bg-primary-50` | `[{ when: [], declarations: { backgroundColor: primary com alpha 0.5 nas duas cores } }]` |
| `bg=#e11d48/50` | `[{ when: [], declarations: { backgroundColor: { light: { rgb: '#E11D48', alpha: 0.5 }, dark: { rgb: '#E11D48', alpha: 0.5 } } } }]` |
| `bg=#f00` | `rgb: '#FF0000'`, `alpha: 1`, nas duas cores |
| `` (vazio) ou só espaços | `[]` |

### 5.2 Conflito resolvido (R7 a R11)

| `look` | `layers` | Diagnósticos |
|---|---|---|
| `pad-4 pad-x-2` | `[{ when: [], declarations: { paddingTop: 16, paddingBottom: 16, paddingLeft: 8, paddingRight: 8 } }]` | nenhum |
| `pad-x-2 pad-4` | igual ao anterior | nenhum |
| `pad-top-2 pad-y-4` | `[{ when: [], declarations: { paddingTop: 8, paddingBottom: 16 } }]` | nenhum |
| `bg-primary bg-surface` | `[{ when: [], declarations: { backgroundColor: T('#FFFFFF', '#1E1E22') } }]` | `warning` `AW<conflito>`, `position` `{ start: 0, end: 10 }` (o `bg-primary`, que perdeu) |
| `bg-surface hover(bg-primary-hover)` | duas camadas: `[]` com `backgroundColor: T('#FFFFFF', '#1E1E22')` e `[{ kind: 'state', state: 'hover' }]` com `backgroundColor: T('#1D4FD8', '#A6C6FF')` | nenhum (condições diferentes) |
| `gap-4 gap-x-2` | `[{ when: [], declarations: { rowGap: 16, columnGap: 8 } }]` | nenhum |
| `round-top-lg round-md` | `[{ when: [], declarations: { borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomRightRadius: 8, borderBottomLeftRadius: 8 } }]` | nenhum |

### 5.3 Variante aninhada (R13, R14)

Entrada: `bg-primary dark(hover(bg-primary-hover))` e também
`bg-primary hover(dark(bg-primary-hover))`. As duas DEVEM dar a mesma IR, com os
átomos na ordem da tabela de variantes (`hover` antes de `dark`, R14):

```ts
layers: [
  { when: [],
    declarations: { backgroundColor: T('#2563EB', '#8AB4FF') } },
  { when: [
      { kind: 'state', state: 'hover' },
      { kind: 'scheme', scheme: 'dark' },
    ],
    declarations: { backgroundColor: T('#1D4FD8', '#A6C6FF') } },
]
```

Sem fusão (R15, D140): `hover(bg-raised) press(bg-surface) hover(pad-4)` dá
três camadas, na ordem escrita:

```ts
layers: [
  { when: [{ kind: 'state', state: 'hover' }],
    declarations: { backgroundColor: T('#FFFFFF', '#28282D') } },
  { when: [{ kind: 'state', state: 'press' }],
    declarations: { backgroundColor: T('#FFFFFF', '#1E1E22') } },
  { when: [{ kind: 'state', state: 'hover' }],
    declarations: PAD(16) },
]
```

E `press(hover(bg-raised))` dá uma camada com `when` `[hover, press]`.

### 5.4 Faixas de tela e precedência entre condições (R16, R18, D117)

Entrada: `pad-2 medium(pad-4) expanded(pad-6)`. A mesma saída sai de
`pad-2 expanded(pad-6) medium(pad-4)` (a faixa maior vem depois):

```ts
layers: [
  { when: [], declarations: PAD(8) },
  { when: [{ kind: 'screen', from: 'medium', minWidth: 600 }],
    declarations: PAD(16) },
  { when: [{ kind: 'screen', from: 'expanded', minWidth: 840 }],
    declarations: PAD(24) },
]
```

Ordem das camadas pela D117 (a posterior vence quando as condições valem
juntas):

| `look` | Ordem das camadas (condição: declarações) |
|---|---|
| `hover(bg-raised) bg-primary` | `[]`: `bg-primary`; depois `[hover]`: `bg-raised` (condição vence sem condição, mesmo escrita antes) |
| `dark(hover(bg-raised)) hover(bg-surface)` | `[hover]`: `bg-surface`; depois `[hover, dark]`: `bg-raised` (mais átomos vencem) |
| `pad-x-2 medium(pad-4)` | `[]`: `paddingLeft: 8`, `paddingRight: 8`; depois `[medium]`: `PAD(16)` (a condição vence a especificidade da família) |
| `medium(lines-2) lines-4` | props: `[]`: `numberOfLines: 4`; depois `[medium]`: `numberOfLines: 2` |

### 5.5 Alinhamento e direção (R22 a R26, R45, R46)

Sem direção declarada, a direção é `column` (D62).

| `look` | `layers` |
|---|---|
| `center` | `[{ when: [], declarations: { justifyContent: 'center', alignItems: 'center' } }]` |
| `center-x` | `[{ when: [], declarations: { alignItems: 'center' } }]` |
| `center-y` | `[{ when: [], declarations: { justifyContent: 'center' } }]` |
| `col center-x` | `[{ when: [], declarations: { flexDirection: 'column', alignItems: 'center' } }]` |
| `row center-x` | `[{ when: [], declarations: { flexDirection: 'row', justifyContent: 'center' } }]` |
| `row center-y` | `[{ when: [], declarations: { flexDirection: 'row', alignItems: 'center' } }]` |
| `x-start` | `[{ when: [], declarations: { alignItems: 'flex-start' } }]` |
| `x-end` | `[{ when: [], declarations: { alignItems: 'flex-end' } }]` |
| `y-start` | `[{ when: [], declarations: { justifyContent: 'flex-start' } }]` |
| `row x-end` | `[{ when: [], declarations: { flexDirection: 'row', justifyContent: 'flex-end' } }]` |
| `row y-start` | `[{ when: [], declarations: { flexDirection: 'row', alignItems: 'flex-start' } }]` |
| `between` | `[{ when: [], declarations: { justifyContent: 'space-between' } }]` |
| `row between` | `[{ when: [], declarations: { flexDirection: 'row', justifyContent: 'space-between' } }]` |
| `wrap` | `[{ when: [], declarations: { flexWrap: 'wrap' } }]` |
| `fill` | `[{ when: [], declarations: { flex: 1 } }]` |

`col medium(row) center-x` (em coluna no celular, em linha a partir de `medium`;
o `center-x` continua sendo horizontal na tela nos dois casos):

```ts
layers: [
  { when: [],
    declarations: { flexDirection: 'column', alignItems: 'center' } },
  { when: [{ kind: 'screen', from: 'medium', minWidth: 600 }],
    declarations: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'stretch', // desfaz o da camada base (R26)
    } },
]
```

`col medium(row) center-y`:

```ts
layers: [
  { when: [],
    declarations: { flexDirection: 'column', justifyContent: 'center' } },
  { when: [{ kind: 'screen', from: 'medium', minWidth: 600 }],
    declarations: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start', // desfaz o da camada base (R26)
    } },
]
```

`col medium(row) center` (os dois eixos não dependem da direção, então não há
valor a desfazer):

```ts
layers: [
  { when: [],
    declarations: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    } },
  { when: [{ kind: 'screen', from: 'medium', minWidth: 600 }],
    declarations: { flexDirection: 'row' } },
]
```

`dark(center-x) medium(row)` (alinhamento numa condição e direção em outra, R45,
D135). Em `dark` sozinho a direção é `column`; em `medium` sozinho não há
alinhamento; com as duas valendo, a direção é `row`, e a camada combinada traz a
tradução certa. As camadas `[dark]` e `[medium]` têm um átomo e a combinada tem
dois, então ela vem por último e vence (R16):

```ts
layers: [
  { when: [{ kind: 'scheme', scheme: 'dark' }],
    declarations: { alignItems: 'center' } },
  { when: [{ kind: 'screen', from: 'medium', minWidth: 600 }],
    declarations: { flexDirection: 'row' } },
  { when: [
      { kind: 'scheme', scheme: 'dark' },
      { kind: 'screen', from: 'medium', minWidth: 600 },
    ],
    declarations: {
      justifyContent: 'center',
      alignItems: 'stretch', // desfaz o do [dark] (R26)
    } },
]
```

### 5.6 Props (R27, R28)

| `look` | `layers` | `props` | Diagnósticos |
|---|---|---|---|
| `lines-2` | `[]` | `{ layers: [{ when: [], declarations: { numberOfLines: 2 } }] }` | nenhum |
| `type-sm lines-2` | `[{ when: [], declarations: { fontSize: 14 } }]` | `{ layers: [{ when: [], declarations: { numberOfLines: 2 } }] }` | nenhum |
| `lines-2 lines-3` | `[]` | `{ layers: [{ when: [], declarations: { numberOfLines: 3 } }] }` | `warning` `AW<conflito>`, `{ start: 0, end: 7 }` |
| `medium(lines-2) lines-4` | `[]` | `{ layers: [{ when: [], declarations: { numberOfLines: 4 } }, { when: [{ kind: 'screen', from: 'medium', minWidth: 600 }], declarations: { numberOfLines: 2 } }] }` | nenhum (condições diferentes) |

### 5.7 Valores (R29 a R36, R47, R48)

| `look` | Declarações |
|---|---|
| `w-full` | `width: { unit: 'percent', value: 100 }` |
| `h-screen` | `height: { unit: 'screen' }` |
| `w=137` | `width: 137` |
| `w=10.5` | `width: 10.5` |
| `w=50%` | `width: { unit: 'percent', value: 50 }` |
| `size-10` | `width: 40`, `height: 40` |
| `size-full` | `width` e `height`: `{ unit: 'percent', value: 100 }` |
| `size-screen` | `width` e `height`: `{ unit: 'screen' }` |
| `gap-4` | `rowGap: 16`, `columnGap: 16` |
| `gap-x-4` | `columnGap: 16` |
| `gap-y-2` | `rowGap: 8` |
| `margin-x-auto` | `marginLeft: 'auto'`, `marginRight: 'auto'` |
| `margin-top=-8` | `marginTop: -8` |
| `border` | `BORDER(1)` |
| `border-0` | `BORDER(0)` |
| `border-y-2` | `borderTopWidth: 2`, `borderBottomWidth: 2` |
| `border=3` | `BORDER(3)` |
| `border-danger` | `borderColor` com o par do `danger` |
| `round-full` | `RADIUS(9999)` |
| `round-md` | `RADIUS(8)` |
| `round-top-lg` | `borderTopLeftRadius: 12`, `borderTopRightRadius: 12` |
| `round-bottom-left-md` | `borderBottomLeftRadius: 8` |
| `opacity-50` | `opacity: 0.5` |
| `weight-bold upper` | `fontWeight: 700`, `textTransform: 'uppercase'` |
| `font-mono` | `fontFamily: 'mono'` |
| `type-lg leading-normal` | `fontSize: 18`, `lineHeight: { unit: 'ratio', value: 1.5 }` |
| `leading=1.4` | `lineHeight: { unit: 'ratio', value: 1.4 }` |
| `text-on-danger-soft` | `color` com o par `on-danger-soft` (D131) |

### 5.8 Elevação no escuro (R34, R35, D132)

`bg-surface shadow-md` (já em `surface`, então a camada do escuro sobe para
`raised`):

```ts
layers: [
  { when: [],
    declarations: { backgroundColor: T('#FFFFFF', '#1E1E22') } },
  { when: [{ kind: 'scheme', scheme: 'light' }],
    declarations: {
      boxShadow: [
        { offsetX: 0, offsetY: 4, blur: 8, spread: 0,
          color: { rgb: '#000000', alpha: 0.08 } },
        { offsetX: 0, offsetY: 1, blur: 2, spread: 0,
          color: { rgb: '#000000', alpha: 0.06 } },
      ],
    } },
  { when: [{ kind: 'scheme', scheme: 'dark' }],
    declarations: {
      backgroundColor: T('#28282D', '#28282D'),
      borderColor: T('#34343A', '#34343A'),
      ...BORDER(1),
      boxShadow: [
        { offsetX: 0, offsetY: 4, blur: 8, spread: 0,
          color: { rgb: '#000000', alpha: 0.35 } },
      ],
    } },
]
```

A camada `light` vem antes da `dark` (as duas têm um átomo e nunca valem
juntas; a ordem só serve para a IR ser determinística).

| `look` | Camada `[scheme dark]` |
|---|---|
| `shadow-sm` (sem `bg-*`, parte de `page`) | `backgroundColor`: `#1E1E22` nas duas cores; borda 1 `#34343A`; sombra `0 1px 2px` preta a 0.30 |
| `bg-page shadow-md` | `backgroundColor`: `#1E1E22`; borda 1 `#34343A`; sombra `0 4px 8px` preta a 0.35 |
| `bg-raised shadow-lg` (já em `raised`, fica em `raised`) | `backgroundColor`: `#28282D`; borda 1 `#34343A`; sombra `0 12px 24px` preta a 0.40 |
| `bg-primary shadow-md` (fora dos níveis: o escrito vence, D137) | sem `backgroundColor`; borda 1 `#34343A`; sombra `0 4px 8px` preta a 0.35 |
| `dark(bg-surface) shadow-md` (`dark(bg...)` explícito vence) | sem `backgroundColor`; borda 1 `#34343A`; sombra `0 4px 8px` preta a 0.35 |
| `border-2 border-strong shadow-md` (borda própria vence) | `backgroundColor`: `#1E1E22`; sem `borderColor` nem larguras de borda; sombra `0 4px 8px` preta a 0.35 |

### 5.9 Erros e descartes (R42, R49)

| `look` | `layers` | Diagnósticos |
|---|---|---|
| `pad-4 hover(bg-raised` | `[{ when: [], declarations: PAD(16) }]` | `error` `AW<parêntese-aberto>`, `{ start: 6, end: 21 }` |
| `pad-4 bg-banana` | `[{ when: [], declarations: PAD(16) }]` | `AW<papel-inexistente>`, `{ start: 6, end: 15 }`, severidade por código na `sintaxe.md` (D35) |
| `pad-4 compact(row)` | `[{ when: [], declarations: PAD(16) }]` | `AW<variante-desconhecida>`, `{ start: 6, end: 18 }` (D61) |
| `pad-4 btn`, com `btn: 'bg-primary pad-17'` | `[{ when: [], declarations: { ...PAD(16), backgroundColor: T('#2563EB', '#8AB4FF') } }]` | `AW<fora-da-escala>`, `position` `{ start: 6, end: 9 }`, `origin` `{ shortcut: 'btn', position: { start: 11, end: 17 } }` |

## 6. Casos de borda e erros

| Caso | Resultado |
|---|---|
| `look` vazio, só espaços | `{ style: { layers: [] }, props: { layers: [] }, diagnostics: [] }` |
| Espaços repetidos entre tokens | Sem efeito na IR; as posições dos diagnósticos continuam sendo da string original (R38) |
| Todo o `look` inválido | `layers: []`, `props: { layers: [] }` e um diagnóstico por trecho (R42) |
| `dark(bg=#e11d48)` sobre `bg-primary` | Duas camadas: `[]` (papel) e `[scheme dark]` (cor livre); a segunda sobrepõe no escuro (R30, R17) |
| Mesma propriedade em condições diferentes | Camadas separadas, sem aviso; quando as duas valem, a ordem das camadas (R16) decide, pela D117 e D136 (R9) |
| `expanded(x) hover(x) medium(x)` | Camadas na ordem `[hover]`, `[medium]`, `[expanded]`; com as três valendo, vale `expanded` (R16, D136) |
| `between center-y` (coluna) | Uma declaração de `justifyContent` (a última escrita) e aviso de conflito (R46, D138) |
| `dark(hover(x)) hover(dark(y))` | Duas camadas com a mesma condição `[hover, dark]`, na ordem escrita: vence `y`, com aviso (R9, R13, R15) |
| `hover(bg-raised) press(bg-surface) hover(pad-4)` | Três camadas, sem fusão; com `hover` e `press` ativos vale `bg-surface` (R15, D140) |
| `press(hover(x))` | Condição `[hover, press]` (R14) |
| `ios(native(x))`, `medium(expanded(x))` | Simplificadas em silêncio para `[ios]` e `[expanded]` (R44) |
| `dark(light(x))`, `ios(web(x))` | `AW202` (aviso); o trecho é descartado da IR, sem camada (R44) |
| `medium(lines-2) lines-4` | Props com duas camadas (R28) |
| Cor livre com 3 ou 8 dígitos | `#E1F` vira `#EE11FF`; 8 dígitos viram `rgb` + `alpha` (R31) |
| Erro de sintaxe dentro de variante (`hover(bg-raised`) | O trecho todo é descartado; o resto do `look` vale (D88) |
| Erro dentro de atalho | `position` no nome do atalho; `origin` com o atalho e a posição no `define` (R49) |
| String qualquer, inclusive aleatória | Nunca lança exceção (R2) |
| Produção | O `core` devolve os mesmos diagnósticos; a borda os ignora (R41) |

## 7. Critérios de aceite

- [ ] Os tipos exportados batem campo a campo com a seção 4, e cada exemplo da
      seção 5, escrito por inteiro, é aceito pelo tipo (`expectTypeOf`); formas
      inválidas (discriminante errado, campo desconhecido) são rejeitadas
      (`@ts-expect-error`).
- [ ] Todo exemplo da seção 5 produz exatamente a saída indicada (testes de
      ouro; mensagens de diagnóstico não são comparadas, R40).
- [ ] `dark(hover(x))` e `hover(dark(x))` produzem IR igual por `toEqual` (R13).
- [ ] `pad-4 pad-x-2` e `pad-x-2 pad-4` produzem IR igual (R10).
- [ ] `hover(bg-raised) bg-primary` e `bg-primary hover(bg-raised)` produzem IR
      igual (R16, D117).
- [ ] Para qualquer `look`, a IR sobrevive a `JSON.parse(JSON.stringify(ir))`
      igual a si mesma, e duas chamadas dão resultado igual (R3, R4).
- [ ] Em nenhuma saída uma camada (de estilo ou de props) repete propriedade,
      há camada vazia (R7, R15). Camadas com a mesma `when` são permitidas.
- [ ] Teste com strings arbitrárias e malformadas: nunca lança exceção, e toda
      `position` fica em `0 <= start <= end <= look.length` (R2, R38).
- [ ] Nenhum emissor importa tema nem repete a regra de conflito, de
      precedência ou de centralização (R5, R8, R22; conferido pelo revisor).
- [ ] O `core` não importa API de plataforma nem lê o modo dev/produção (R41,
      D74).

## 8. Ainda não definido

Nenhuma. O que as D117 a D140 resolveram saiu daqui: precedência entre
condições (D117, D136), elevação no escuro (D132, D137), condições redundantes e
impossíveis (D135, D127, D138), prop dentro de variante (D135), `x-start`,
`x-end` e `between` sob direção (D122, D138, D140), posição de erro dentro de
atalho (D135), centralização numa variante com direção em outra (D135), os
nomes novos (D139), a camada por ocorrência de variante e a ordem dos átomos
(D140).
