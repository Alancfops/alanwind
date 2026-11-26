# Spec: funcionamento interno (representação intermediária, IR)

Status: **rascunho** (estrutura completa; falta resolver a seção 8) · Decisões
de origem: D15, D31, D33, D35, D36, D37, D38, D58, D59, D60, D61, D62, D65, D74,
D78, D82 a D90, D92, D94, D96 a D99, D101, D103 a D108, D110

Formato neutro que o `core` produz e os emissores consomem: estilo, props e
diagnósticos, sem conflitos e sem nada específico de plataforma. Contrato
central entre os pacotes (ADR 0002).

Os nomes de tipos e de campos da seção 4 são **proposta, a aprovar**: as
decisões fixam o que a IR carrega, não como se chama cada campo.

## 1. Escopo

Cobre:

- O resultado da resolução de um `look`: parte de estilo, parte de props e lista
  de diagnósticos (D83, D84).
- Como a IR representa condições (variantes), valores (tamanho, cor, opacidade,
  sombra) e o que o `core` já traduz antes de entregar (conflito, `center-x`,
  `center-y`, elevação no escuro).
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
| **Camada** (`StyleLayer`) | Um conjunto de declarações de estilo que valem sob uma mesma condição. |
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
  de entregar a IR. Em cada camada, uma propriedade DEVE aparecer no máximo uma
  vez; em `props`, cada prop também (D82).
- **R8.** Os emissores NÃO DEVEM reimplementar a regra de conflito (D82).
- **R9.** Entre classes de mesma especificidade que disputam a mesma propriedade
  **sob a mesma condição**, DEVE valer a última escrita, e o `core` DEVE
  devolver um diagnóstico de severidade `warning`, com a posição da classe que
  perdeu (D58, D84). Classes em condições diferentes não disputam: no exemplo
  `bg-surface hover(bg-raised)` há duas camadas (D58). A posição do aviso (a
  classe que perdeu) é proposta, a aprovar.
- **R10.** A especificidade vale por lado (`pad-top` vence `pad-y`, que vence
  `pad`) e não depende da ordem de escrita: `pad-4 pad-x-2` e `pad-x-2 pad-4`
  produzem a mesma IR (D58).
- **R11.** A IR NÃO DEVE carregar especificidade nem ordem de escrita das
  classes. Esses dados morrem no `core`, depois de aplicar a regra (D82).
- **R12.** `pad`, `margin` e largura de borda DEVEM sair da IR em lados
  explícitos (`paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft`, e o
  mesmo para margem e borda). A IR NÃO DEVE ter propriedades de eixo nem
  atalhos de lados (`paddingHorizontal`, `padding`), pois a regra de conflito
  por lado exige lados explícitos (D58, D87, D107). Estender isto da D107 (que
  fala do emissor RN) à própria IR é proposta, a aprovar.

### 3.3 Condições e camadas

- **R13.** Cada variante DEVE virar um átomo. Variantes aninhadas somam átomos
  (E lógico), em qualquer ordem de escrita: `dark(hover(x))` e `hover(dark(x))`
  DEVEM produzir IR idêntica (D86).
- **R14.** Uma condição DEVE ser canônica: sem átomos repetidos e ordenada por
  tipo de átomo na ordem `platform`, `scheme`, `screen`, `state` (a ordem é
  proposta, a aprovar). O que está escrito sem variante tem condição vazia.
- **R15.** A IR DEVE ter uma camada por condição distinta, sem camada com
  `declarations` vazio. Um `look` sem declarações tem `layers: []`.
- **R16.** A camada de condição vazia, se existir, DEVE vir primeiro. Entre
  camadas que só diferem no átomo de faixa de tela, a faixa menor DEVE vir antes
  da maior (`medium` antes de `expanded`), pois `medium(x) expanded(y)` desfaz
  no tamanho maior (D37, D106).
- **R17.** Os emissores DEVEM aplicar as camadas na ordem da lista: entre as
  camadas cuja condição vale no momento, a posterior vence a anterior,
  propriedade a propriedade. Para a ordem entre condições que não se enquadram
  na R16, ver a seção 8, item 1.
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

### 3.4 Centralização

- **R22.** O `core` DEVE traduzir `center`, `center-x` e `center-y` em
  propriedades flex comuns (`justifyContent`, `alignItems`); a IR NÃO DEVE
  guardar a intenção de centralizar (D38, D85).
- **R23.** `center` DEVE virar `justifyContent: 'center'` junto com
  `alignItems: 'center'` (D38).
- **R24.** `center-x` e `center-y` valem para a **tela**, não para a direção do
  layout (D38). Com direção final `column`:
  `center-x` DEVE virar `alignItems: 'center'` e `center-y` DEVE virar
  `justifyContent: 'center'`. Com direção final `row`: `center-x` DEVE virar
  `justifyContent: 'center'` e `center-y` DEVE virar `alignItems: 'center'`
  (D38, D85).
- **R25.** Sem `row`/`col`, a direção final é `column` (D62). O `core` DEVE usar
  a direção que vale em cada condição, inclusive a trazida por variante como
  `medium(row)` (D85).
- **R26.** Quando uma condição muda a direção, a camada dessa condição DEVE
  trazer a tradução para a nova direção. A propriedade que a camada anterior
  definiu e que a nova direção não define DEVE receber nessa camada o valor
  inicial (`alignItems: 'stretch'`, `justifyContent: 'flex-start'`); sem isso, o
  valor da camada base continuaria valendo e a classe passaria a valer nos dois
  eixos. O valor inicial é proposta, a aprovar; a necessidade vem da D38.

### 3.5 Props

- **R27.** Classes que viram prop do componente, e não estilo, DEVEM ir para
  `props`, não para `style` (D83). Na fase 1: `lines-N` DEVE virar
  `numberOfLines: N`. O emissor só traduz (o emissor CSS traduz para o
  equivalente em CSS na web).
- **R28.** `props` é plano, sem condições. Acrescentar uma prop é acrescentar um
  campo em `PropsIR` e atualizar esta spec (D83). Prop dentro de variante: ver a
  seção 8, item 4.

### 3.6 Valores

- **R29.** **Tamanho** (`width`, `height`) e **espaço** (`padding*`, `margin*`,
  `gap`): número = px na web e dp no nativo; `{ unit: 'percent' }` para
  porcentagem; `w-full`/`h-full` DEVEM virar 100% (`percent` 100); `w-screen` e
  `h-screen` DEVEM virar `{ unit: 'screen' }` (largura ou altura da tela, pela
  propriedade); `'auto'` só em margem (D89, D98, D105). `size-N` DEVE virar
  `width` e `height`. Margem negativa é número negativo (D89).
- **R30.** **Cor** (`backgroundColor`, `color`, `borderColor`): o valor DEVE ser
  um `ThemedColor`, com a cor do claro e a do escuro já resolvidas (D33, D99).
  Um papel DEVE virar as duas cores do papel (incluindo `-soft`, `-hover`, `on-`
  e o tom automático de `text-<papel>`, D92). Uma cor livre (`bg=#e11d48`,
  `bg=red-40`) DEVE ter as duas cores iguais. Assim, `dark(bg=red-20)` só
  sobrepõe a camada base, como exceção (D103). Resolver o papel para o par, e
  não por camadas de esquema, é proposta, a aprovar.
- **R31.** `rgb` DEVE ser `#RRGGBB` com letras maiúsculas; hex de 3 dígitos
  DEVE ser expandido para 6. A opacidade (D31, D104) DEVE ir em `alpha`, de 0 a
  1, nas duas cores: `bg-primary-50` e `bg=#e11d48/50` têm `alpha: 0.5`. Hex de
  8 dígitos DEVE virar `rgb` + `alpha` igual ao byte dividido por 255, sem
  arredondar (D105).
- **R32.** `opacity-N` (opacidade do elemento) DEVE virar `opacity` de 0 a 1
  (`opacity-50` = `0.5`) (D98).
- **R33.** **Altura de linha**: `leading-*` DEVE virar um `Ratio`
  (`{ unit: 'ratio', value }`; `leading-normal` = 1.5), **sem** multiplicar
  pelo `type-*`: o tamanho final pode vir da herança de texto, que o `core` não
  vê (D98, D57). O emissor calcula `fontSize * value`.
- **R34.** **Sombra**: `shadow-*` DEVE virar `boxShadow`, uma lista de camadas
  de sombra, na ordem da D96 (`shadow-md`: primeiro `0 4px 8px a 8%`, depois
  `0 1px 2px a 6%`), com `spread` 0 e cor preta com a opacidade em `alpha`. As
  camadas do claro DEVEM ficar numa camada de estilo com o átomo de esquema
  `light` (D96, D108).
- **R35.** **Elevação automática no escuro** (D97): o `core` DEVE expandir
  `shadow-*` numa camada de estilo com o átomo `scheme: dark`, com declarações
  comuns (`backgroundColor` um nível acima, `borderColor`, largura de borda e
  `boxShadow` discreto). Os emissores NÃO DEVEM conhecer o conceito de
  elevação (D45, D82). Os valores e os casos de borda ficam na seção 8, item 2.
- **R36.** Valores fixos de `StyleMap` (`fontWeight`: 400, 500, 700;
  `borderRadius`: `round-full` = 9999) seguem o tema padrão (D44, D98).

### 3.7 Diagnósticos

- **R37.** Um diagnóstico DEVE ter `code` (`AW###`, do catálogo da
  `sintaxe.md`), `severity` (`error` ou `warning`), `message`, `position` e,
  quando houver, `suggestion` (D84, D35).
- **R38.** `position` DEVE ser `{ start, end }`: deslocamentos de 0 a
  `look.length` (unidades UTF-16) na string `look` original, `end` exclusivo,
  `start <= end`. Para erro dentro de atalho, ver a seção 8, item 6.
- **R39.** `diagnostics` DEVE vir ordenado por `position.start` crescente;
  no empate, mantém a ordem em que o `core` achou os problemas.
- **R40.** `message` é texto livre para pessoas: NÃO faz parte do contrato, e os
  testes de ouro NÃO DEVEM comparar o texto. `suggestion`, quando existir, DEVE
  ser o texto que substitui o trecho de `position` (ex.: a classe sugerida).
  Ambos são proposta, a aprovar.
- **R41.** O `core` NÃO DEVE saber se está em desenvolvimento ou produção: DEVE
  devolver sempre os diagnósticos. Quem filtra é a borda (D84, D35).
- **R42.** Sintaxe malformada, classe desconhecida, variante desconhecida (como
  `compact(...)`, D61) e papel inexistente DEVEM descartar **só o trecho
  afetado** e gerar diagnóstico; o resto do `look` DEVE ser resolvido
  normalmente (D88, D35).

### 3.8 Vocabulário

- **R43.** O vocabulário DEVE ficar direto no `core`, como fonte única do que
  cada classe faz (D83, D90). Acrescentar propriedade neutra, átomo ou prop é
  mudança desta spec (skill `adicionar-utilitario`).

## 4. Formato (proposta, a aprovar)

Tipos TypeScript do contrato. Tudo é `readonly`. A ordem das chaves de um objeto
não importa; a ordem das listas importa (R14, R16, R17, R39).

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

// ---------- props ----------
export interface PropsIR {
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
  readonly gap?: Dimension;

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
  readonly borderRadius?: number;
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
  readonly position: { readonly start: number; readonly end: number };
  readonly suggestion?: string; // texto que substitui o trecho
}
```

Notas sobre o formato:

- `fontFamily` guarda a família genérica; o emissor mapeia para a fonte do
  sistema ou para a que o tema trocar (D49).
- Larguras de borda por lado e `borderColor` único: a cor de borda não tem lados
  no vocabulário decidido (D87 cita lados para a borda, mas só a largura).

## 5. Exemplos

Notação, só para ler: `T(claro, escuro)` = `{ light: { rgb: claro, alpha: 1 },
dark: { rgb: escuro, alpha: 1 } }`; `PAD(n)` = `paddingTop`, `paddingRight`,
`paddingBottom` e `paddingLeft`, todos `n`. Os testes de ouro escrevem os
objetos por inteiro. Códigos `AW###` aparecem como marcador `AW<nome>`, porque o
catálogo é da `sintaxe.md`. Valores de cor: D46, D50, D51, D95. Todos os
exemplos têm `props: {}` e `diagnostics: []`, salvo quando dito.

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

### 5.3 Variante aninhada (R13, R14)

Entrada: `bg-primary dark(hover(bg-primary-hover))` e também
`bg-primary hover(dark(bg-primary-hover))`. As duas DEVEM dar a mesma IR:

```ts
layers: [
  { when: [],
    declarations: { backgroundColor: T('#2563EB', '#8AB4FF') } },
  { when: [
      { kind: 'scheme', scheme: 'dark' },
      { kind: 'state', state: 'hover' },
    ],
    declarations: { backgroundColor: T('#1D4FD8', '#A6C6FF') } },
]
```

### 5.4 Faixas de tela (R16, R18)

Entrada: `pad-2 medium(pad-4) expanded(pad-6)`. A mesma saída sai de
`pad-2 expanded(pad-6) medium(pad-4)`:

```ts
layers: [
  { when: [], declarations: PAD(8) },
  { when: [{ kind: 'screen', from: 'medium', minWidth: 600 }],
    declarations: PAD(16) },
  { when: [{ kind: 'screen', from: 'expanded', minWidth: 840 }],
    declarations: PAD(24) },
]
```

### 5.5 `center-x` e `center-y` (R22 a R26)

Sem direção declarada, a direção é `column` (D62).

| `look` | `layers` |
|---|---|
| `center` | `[{ when: [], declarations: { justifyContent: 'center', alignItems: 'center' } }]` |
| `center-x` | `[{ when: [], declarations: { alignItems: 'center' } }]` |
| `center-y` | `[{ when: [], declarations: { justifyContent: 'center' } }]` |
| `col center-x` | `[{ when: [], declarations: { flexDirection: 'column', alignItems: 'center' } }]` |
| `row center-x` | `[{ when: [], declarations: { flexDirection: 'row', justifyContent: 'center' } }]` |
| `row center-y` | `[{ when: [], declarations: { flexDirection: 'row', alignItems: 'center' } }]` |

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

### 5.6 Props (R27, R28)

| `look` | `layers` | `props` | Diagnósticos |
|---|---|---|---|
| `lines-2` | `[]` | `{ numberOfLines: 2 }` | nenhum |
| `type-sm lines-2` | `[{ when: [], declarations: { fontSize: 14 } }]` | `{ numberOfLines: 2 }` | nenhum |
| `lines-2 lines-3` | `[]` | `{ numberOfLines: 3 }` | `warning` `AW<conflito>`, `{ start: 0, end: 7 }` |

### 5.7 Valores (R29 a R36)

| `look` | Declarações |
|---|---|
| `w-full` | `width: { unit: 'percent', value: 100 }` |
| `h-screen` | `height: { unit: 'screen' }` |
| `w=137` | `width: 137` |
| `w=50%` | `width: { unit: 'percent', value: 50 }` |
| `size-10` | `width: 40`, `height: 40` |
| `margin-x-auto` | `marginLeft: 'auto'`, `marginRight: 'auto'` |
| `margin-top=-8` | `marginTop: -8` |
| `border` | `borderTopWidth`, `borderRightWidth`, `borderBottomWidth`, `borderLeftWidth`, todos `1` |
| `round-full` | `borderRadius: 9999` |
| `opacity-50` | `opacity: 0.5` |
| `weight-bold upper` | `fontWeight: 700`, `textTransform: 'uppercase'` |
| `type-lg leading-normal` | `fontSize: 18`, `lineHeight: { unit: 'ratio', value: 1.5 }` |

### 5.8 Erros e descartes (R42)

| `look` | `layers` | Diagnósticos |
|---|---|---|
| `pad-4 hover(bg-raised` | `[{ when: [], declarations: PAD(16) }]` | `error` `AW<parêntese-aberto>`, `{ start: 6, end: 21 }` |
| `pad-4 bg-banana` | `[{ when: [], declarations: PAD(16) }]` | `AW<papel-inexistente>`, `{ start: 6, end: 15 }`, severidade por código na `sintaxe.md` (D35) |
| `pad-4 compact(row)` | `[{ when: [], declarations: PAD(16) }]` | `AW<variante-desconhecida>`, `{ start: 6, end: 18 }` (D61) |

## 6. Casos de borda e erros

| Caso | Resultado |
|---|---|
| `look` vazio, só espaços | `{ style: { layers: [] }, props: {}, diagnostics: [] }` |
| Espaços repetidos entre tokens | Sem efeito na IR; as posições dos diagnósticos continuam sendo da string original (R38) |
| Todo o `look` inválido | `layers: []`, `props: {}` e um diagnóstico por trecho (R42) |
| `dark(bg=red-20)` sobre `bg-primary` | Duas camadas: `[]` (papel) e `[scheme dark]` (cor livre); a segunda sobrepõe no escuro (R30, R17) |
| Mesma propriedade em condições diferentes | Camadas separadas, sem aviso (R9) |
| `dark(hover(x)) hover(dark(y))` | Mesma condição canônica: disputa, vence `y`, aviso (R9, R13) |
| Cor livre com 3 ou 8 dígitos | `#E1F` vira `#EE11FF`; 8 dígitos viram `rgb` + `alpha` (R31) |
| Erro de sintaxe dentro de variante (`hover(bg-raised`) | O trecho todo é descartado; o resto do `look` vale (D88) |
| String qualquer, inclusive aleatória | Nunca lança exceção (R2) |
| Produção | O `core` devolve os mesmos diagnósticos; a borda os ignora (R41) |

## 7. Critérios de aceite

- [ ] Os tipos exportados batem campo a campo com a seção 4 aprovada, e cada
      exemplo da seção 5, escrito por inteiro, é aceito pelo tipo
      (`expectTypeOf`); formas inválidas (discriminante errado, campo
      desconhecido) são rejeitadas (`@ts-expect-error`).
- [ ] Todo exemplo da seção 5 produz exatamente a saída indicada (testes de
      ouro; mensagens de diagnóstico não são comparadas, R40).
- [ ] `dark(hover(x))` e `hover(dark(x))` produzem IR igual por `toEqual` (R13).
- [ ] `pad-4 pad-x-2` e `pad-x-2 pad-4` produzem IR igual (R10).
- [ ] Para qualquer `look`, a IR sobrevive a `JSON.parse(JSON.stringify(ir))`
      igual a si mesma, e duas chamadas dão resultado igual (R3, R4).
- [ ] Em nenhuma saída uma camada repete propriedade, há camada vazia ou duas
      camadas com a mesma `when` (R7, R15).
- [ ] Teste com strings arbitrárias e malformadas: nunca lança exceção, e toda
      `position` fica em `0 <= start <= end <= look.length` (R2, R38).
- [ ] Nenhum emissor importa tema nem repete a regra de conflito ou de
      centralização (R5, R8, R22; conferido pelo revisor).
- [ ] O `core` não importa API de plataforma nem lê o modo dev/produção (R41,
      D74).

## 8. Ainda não definido

Lacunas que precisam de decisão do Alan. Nada aqui foi inventado na spec.

1. **Precedência entre camadas de condições diferentes que valem ao mesmo
   tempo.** A D37 e a D106 só fixam faixas de tela (`medium` antes de
   `expanded`, R16) e a base antes de qualquer variante. Não há regra para
   `hover(bg-a) medium(bg-b)`, `dark(bg-a) ios(bg-b)`, nem para uma camada com
   mais átomos contra outra com menos (`[hover]` e `[dark, hover]`). Proposta,
   se o Alan concordar: ordenar por número de átomos (mais átomos depois) e, no
   empate, pela ordem de escrita da primeira variante.
2. **Elevação no escuro (D97).** Faltam: o valor da "sombra bem discreta"; a
   largura da borda fina (só a cor `#34343A` está decidida); de qual nível
   partir quando o `look` não tem `bg-*` (a D97 diz "um nível"); o que fazer
   quando o `look` já tem `bg-*` fora da escala de níveis (`bg-primary`) ou
   `border` próprio, ou um `dark(bg...)` explícito. A mesma lacuna está no
   `tema.md` (R18).
3. **Condições contraditórias ou redundantes.** `ios(web(x))` nunca vale;
   `medium(expanded(x))` equivale a `expanded(x)`; `ios(native(x))` equivale a
   `ios(x)`. A D86 só diz que as condições se somam. Falta decidir se o `core`
   simplifica, mantém como está ou avisa.
4. **Prop dentro de variante.** `medium(lines-2)` ou `ios(lines-2)`: a `props`
   da R28 é plana, sem condições. Falta decidir se vale, se vira diagnóstico ou
   se `props` passa a ter camadas como o estilo.
5. **`start`, `end` e `between` sob direção.** A D85 trata `center-x` e
   `center-y`. Para `start`, `end` e `between` não há decisão sobre qual eixo
   eles seguem (a tela, como `center-x`, ou o eixo do layout).
6. **Posição de diagnóstico dentro de atalho.** Um erro no conteúdo de um atalho
   (`define`, D101) tem posição no arquivo de tema, não no `look`. Falta decidir
   o que `position` aponta (o nome do atalho no `look`?) e se o diagnóstico
   indica a origem.
7. **Centralização numa variante e direção em outra.** `dark(center-x)
   medium(row)`: quando as duas valem, a tradução precisa da direção `row`.
   Falta decidir como (por exemplo, uma camada com a condição somada, o que
   depende do item 1).
