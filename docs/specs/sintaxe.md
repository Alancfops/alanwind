# Spec: sintaxe do look

Status: **aprovado** (pelo Alan em 2026-11-26) ·
Decisões de origem: D7, D13, D15 a D20,
D23, D26 a D31, D33 a D38, D41 a D45, D49, D58, D59, D61 a D63, D66, D77, D78,
D82 a D89, D91 a D98, D100 a D106, D110, D117, D118, D122 a D127, D129, D131,
D133 a D140

Gramática do `look`: tokens, variantes aninháveis, valor livre com `=`,
opacidade, atalhos, vocabulário da fase 1, regra de conflito e diagnósticos.

Esta spec não tem mais propostas pendentes: os códigos `AW###`, a leitura do
texto, o valor livre e a estrutura foram aprovados na D127, e as analogias e
códigos que faltavam, nas D138 e D139.

## 1. Escopo

Cobre:
- O texto da string `look` (e a mesma gramática em `contentLook`, na função
  `look(...)` e no atributo `look` do HTML): como é quebrada em itens, quais
  itens existem e o que cada um significa em termos abstratos.
- O vocabulário de classes e variantes da **fase 1** (D77).
- A regra de conflito entre classes (D58), a precedência entre condições
  diferentes (D117) e a especificidade de cada família.
- Os diagnósticos da sintaxe (código `AW###`, posição, sugestão; D84, D127).

Fica de fora (outras specs):
- Tradução para React Native ou CSS (`emissor-native.md`, `emissor-css.md`).
- Formato da IR e dos diagnósticos como tipos (`funcionamento-interno.md`). Esta
  spec define **quais** diagnósticos existem e **quando**; a seção "Formato
  exato dos diagnósticos" de `funcionamento-interno.md` deve referenciar a
  tabela da seção 6 daqui.
- Valores de cor, escalas e papéis do tema padrão (`tema.md`). Aqui só se diz
  como as classes os nomeiam.
- Comportamento dos componentes (`componentes.md`), inclusive herança de texto
  (D57, D113).
- O que é de outra fase: seção 10.

## 2. Definições

| Termo | Significado |
|---|---|
| **look** | A string de classes, valor da prop/atributo `look` (D27). |
| **item** | Um token ou uma variante, separado dos vizinhos por espaço. |
| **token** | Uma classe (`pad-4`), uma classe com valor livre (`w=137`) ou um atalho (`btn`). |
| **classe** | Token da forma `propriedade-valor` do vocabulário (D17). |
| **variante** | `nome(lista)`: agrupa itens sob uma condição (D28). |
| **condição** | O que a variante exige para valer (`hover`, `dark`, `medium`...). |
| **conjunto de condições** | Todas as condições de um item, somadas por E lógico (D86). Item sem variante tem conjunto vazio. |
| **escala** | Inteiros de 0 a 16, em passos de 4 (`pad-4` = 16) (D43). |
| **papel** | Nome semântico de cor do tema (`primary`, `surface`) (D18, D33). |
| **valor livre** | Valor fora da escala, escrito com `=` (D30). |
| **propriedade abstrata** | Chave neutra de plataforma usada nesta spec (`pad.left`, `bg`), não uma propriedade RN ou CSS. Definidas na seção 5. |
| **especificidade** | Nível de uma classe para a regra de conflito (seção 5.9). |
| **posição** | Intervalo `[início, fim)` no texto do `look`: deslocamentos de 0, em unidades UTF-16, `fim` exclusivo (D127). |
| **diagnóstico** | Registro `{ código, posição, sugestão }` devolvido pela resolução (D84). |

## 3. Regras normativas

### 3.1 Geral

- **R1.** A gramática da seção 4 DEVE valer em todo lugar onde o `look`
  aparece: prop `look` dos componentes, prop `contentLook`, função `look(...)` e
  atributo `look` do HTML (D27, D41, D42). `className` e `class` NÃO DEVEM
  existir como forma alternativa (D27, D42).
- **R2.** Os nomes de classes e variantes DEVEM ser em inglês (D7) e em
  minúsculas. Uma classe com maiúscula (`Pad-4`) NÃO DEVE casar com nenhuma
  classe: gera `AW101` (D127).
- **R3.** Os itens de um `look` DEVEM ser separados por um ou mais espaços.
  Tabulação e quebra de linha PODEM separar itens como se fossem espaço (D127).
  Espaços antes do primeiro item, depois do último e dentro dos parênteses de
  uma variante PODEM existir e são ignorados (D127).
- **R4.** Um `look` vazio, ou só com espaços, DEVE resultar em estilo vazio e
  nenhum diagnóstico (D127).
- **R5.** A forma base de uma classe é `propriedade-valor` com hífen (D17).
  Só `w`, `h`, `x` e `y` PODEM ser abreviações; o resto DEVE ser por extenso:
  `pad`, `margin`, `round`, `gap` (D19). Para cada coisa existe uma só forma
  (D18).
- **R6.** A resolução DEVE ser função pura e determinística: mesma entrada
  (look, tema, condições de contexto), mesma saída, inclusive a ordem dos
  diagnósticos (D15).

### 3.2 Variantes

- **R7.** Variante DEVE ser escrita só com parêntese, `nome(lista)` (D28). A
  forma com dois-pontos (`hover:bg-x`) NÃO DEVE existir e gera `AW006`
  (D28, D127).
- **R8.** Os nomes de variante da fase 1 são exatamente: `hover`, `press`,
  `focus`, `disabled`, `dark`, `light`, `ios`, `android`, `web`, `native`,
  `medium`, `expanded` (D18, D29, D33, D59, D61, D103). Qualquer outro nome
  seguido de `(` gera `AW004`.
- **R9.** `compact(...)` NÃO DEVE existir como variante: o que não tem variante
  vale para todos os tamanhos de tela (D61). Gera `AW004`.
- **R10.** `motion-safe(...)` está fora da fase 1 (D78) e, nesta fase, gera
  `AW004` com mensagem própria (D127).
- **R11.** Uma variante PODE conter qualquer item, inclusive outras variantes,
  em qualquer ordem. As condições se somam (E lógico): `dark(hover(x))` e
  `hover(dark(x))` DEVEM produzir resultado idêntico (D86).
- **R12.** `hover(...)` DEVE valer só onde existe ponteiro; `press(...)` DEVE
  valer para o elemento pressionado em todas as plataformas (D59). Como o
  ponteiro é detectado é do emissor (D110).
- **R13.** `focus(...)` DEVE valer para elemento com foco (teclado ou leitor de
  tela); `disabled(...)`, para elemento desabilitado; `light(...)`, só no
  esquema claro; `native(...)`, em iOS e Android juntos (D103).
- **R14.** `medium(...)` DEVE valer a partir da faixa `medium` (largura 600) e
  acima; `expanded(...)`, a partir de `expanded` (840) (D37, D94). Itens sem
  variante de tela valem em todas as faixas, inclusive `compact` (D61).
- **R15.** Uma variante cujas condições são impossíveis juntas (`dark` com
  `light`; duas plataformas entre `ios`, `android` e `web`; `native` com `web`)
  DEVE ser aceita sem erro, gera o aviso `AW202` e é descartada da IR, porque
  nunca valeria (D127, D138).
- **R16.** O nome da variante DEVE vir seguido de `(` colado. Um nome de
  variante sozinho, sem parêntese, gera `AW005`.
- **R53.** Condições redundantes (uma implica a outra) DEVEM ser simplificadas
  em silêncio, sem diagnóstico, para a forma mínima: `ios(native(x))` equivale a
  `ios(x)`; `medium(expanded(x))` equivale a `expanded(x)`. Condições repetidas
  valem como uma (`dark(dark(x))`) (D135).

### 3.3 Valor livre e opacidade

- **R17.** Valor fora da escala DEVE usar `=` (`w=137`, `pad=10`, `w=50%`).
  Colchetes e parênteses NÃO DEVEM ser usados para isso (D30).
- **R18.** O valor livre DEVE ser: número sem unidade (px na web, dp no
  nativo), inteiro ou decimal (R54); número com `%`; ou cor em hex de 3, 6 ou 8
  dígitos. NÃO DEVE aceitar `rem`, `em`, `vw` nem `vh` nesta fase (D105). Tom
  da paleta (`red-40`) NÃO DEVE ser aceito na fase 1: entra com a paleta, na
  fase de tema (D118, D99).
- **R19.** O valor livre PODE ser negativo só onde fizer sentido (D105). Nesta
  fase só a família `margin` aceita (D89). Negativo em outra família gera
  `AW008` (D127).
- **R20.** Margem negativa NÃO DEVE existir na escala: `margin-top--8` gera
  `AW104` com sugestão `margin-top=-8` (D89).
- **R21.** Famílias que aceitam `=`: `pad`, `margin`, `gap` (e suas formas com
  lado ou eixo), `w`, `h`, `size`, `round` (e suas formas por lado e por
  canto), `type`, `leading`, a espessura de `border` (e suas formas por lado e
  eixo) e a cor de `bg`, `text` e `border` (D127, D123, D125). Família que não
  aceita gera `AW009`.
- **R22.** Cor livre DEVE ser hex (`bg=#e11d48`), com maiúsculas ou minúsculas
  nos dígitos (D105, D127). Na fase 1 não há tom da paleta (D118).
- **R23.** A opacidade em cor livre DEVE usar barra no fim do valor:
  `bg=#e11d48/50` (D104). Os números válidos são os da escala de opacidade: 0,
  25, 50, 75, 100 (D98, D127). Barra em hex de 8 dígitos (`bg=#e11d4880/50`)
  gera `AW008` (D127).
- **R24.** A barra NÃO DEVE existir em classe com papel: `bg-primary/50` gera
  `AW107` com sugestão `bg-primary-50` (D104).
- **R54.** O valor livre numérico PODE ter parte decimal, escrita com ponto e
  com ao menos um dígito antes dele (`w=10.5`, `leading=1.4`, `w=0.5`). Vírgula
  decimal (`w=10,5`) e ponto sem dígito antes (`w=.5`) são erro `AW008`, com
  mensagem própria (D125, D138).

### 3.4 Cor por papel

- **R25.** `bg-` é cor de fundo, `text-` é só cor do texto e `border-` é cor da
  borda quando o próximo segmento é um papel (D23, D95, D123). O tamanho do
  texto usa `type-` (D23).
- **R26.** As classes DEVEM usar papéis, nunca a paleta: `bg-danger` existe,
  `bg-red-600` NÃO DEVE existir (D34). A paleta só entra pelo valor livre, e só
  na fase de tema (D118).
- **R27.** A opacidade de uma cor por papel DEVE ser um sufixo numérico,
  sempre o último segmento: `bg-primary-50`, `text-strong-50` (D31). Os
  valores válidos são 0, 25, 50, 75 e 100 (D98). Outro número gera `AW103`.
- **R28.** O nome de um papel criado pela pessoa NÃO DEVE terminar em número
  (D31). Gera `AW303` ao carregar o tema (efetivo na fase de tema, D81).
- **R29.** Papel inexistente (`bg-banana`) DEVE gerar `AW102` com sugestão
  quando houver nome próximo (D35). Em produção é ignorado sem quebrar o app
  (D35, R46).
- **R30.** Os papéis válidos por prefixo vêm do tema (`tema.md`). Nesta spec
  só se lista o que o tema padrão traz (seção 5.5).
- **R55.** O texto sobre um fundo `-soft` DEVE ser escrito
  `text-on-<papel>-soft`, seguindo o padrão `on-<fundo>`: `bg-danger-soft` pede
  `text-on-danger-soft` (D131).
- **R56.** `text-secondary` NÃO DEVE existir: o `secondary` é neutro e a cor do
  papel não passa como texto. Para texto neutro existem `text-body` e
  `text-muted`. `text-secondary` gera `AW102`, como papel que não existe em
  `text-` (D129, D139). Exceção à D92 só para esse papel.
- **R57.** `border-<papel>` DEVE aceitar todos os papéis do tema
  (`border-primary`, `border-danger`), além de `subtle`, `strong` e `focus`
  (D95, D123). Não existe cor por lado: a cor é uma só para a borda (D123).

### 3.5 Lados, eixos, layout e `center`

- **R31.** Espaçamento e borda DEVEM aceitar lados por extenso: `top`,
  `bottom`, `left`, `right` (`pad-top-2`, `margin-left-4`, `border-top`) (D87,
  D123). `pad`, `margin` e `border` DEVEM aceitar também os eixos `x` (esquerda
  e direita) e `y` (topo e base) (D19, D58, D107, D123). `gap` aceita os eixos
  `gap-x` e `gap-y` (R60).
- **R32.** `start` e `end` como lados NÃO DEVEM existir nesta fase (D87). Não
  confundir com `x-start`, `x-end`, `y-start` e `y-end` (R58), que são de
  alinhamento e não colidem com os lados (D122).
- **R33.** `margin` DEVE aceitar `auto` em todas as formas (`margin-auto`,
  `margin-x-auto`, `margin-top-auto`) (D89, D127).
- **R34.** `center` DEVE centralizar nos dois eixos; `center-x` só na
  horizontal; `center-y` só na vertical. `center-x` e `center-y` se referem à
  tela, não à direção do layout (D38). A tradução para propriedades de layout
  com a direção final é do `core`, na IR (D85, `funcionamento-interno.md`).
- **R58.** O início e o fim de um eixo DEVEM ser escritos `x-start`, `x-end`,
  `y-start` e `y-end`, sempre relativos à tela, como `center-x` e `center-y`
  (D122, D38): `x-start` é o lado esquerdo da tela, `x-end` o direito, `y-start`
  o topo e `y-end` a base, qualquer que seja a direção do layout.
- **R59.** `between` DEVE distribuir a sobra do espaço entre os filhos **no eixo
  principal** do layout (o eixo da direção, não o da tela). `wrap` DEVE deixar
  os filhos quebrarem de linha; sem ele, não quebram. `fill` DEVE ocupar o
  espaço restante no eixo do pai (flex 1) (D122). `between` junto com um
  alinhamento que cai no mesmo eixo (`center-y`, `y-start`, `y-end` em `col`;
  `center-x`, `x-start`, `x-end` em `row`) segue a regra de conflito normal:
  vale a última escrita, com aviso `AW201` (D138). Para esse fim, `between`
  define a propriedade `place.main` (`place.y` em `col`, `place.x` em `row`), no
  nível de `center-x`/`center-y` (D140).
- **R60.** `gap-N` DEVE aplicar o espaço aos dois eixos; `gap-x-N` DEVE aplicar
  o espaço entre colunas e `gap-y-N` entre linhas, sempre relativos à tela,
  qualquer que seja a direção. `gap-x` e `gap-y` aceitam valor livre
  (`gap-x=V`) (D125). `gap-N` é o par `gap.x` + `gap.y` (D139).
- **R61.** `size-full` e `size-screen` DEVEM existir e valer para largura e
  altura juntas, como `size-N` (D125, D98).
- **R62.** Espessura de borda: `border` DEVE valer 1; `border-0`, `border-2` e
  `border-4` DEVEM existir; outros valores só por valor livre (`border=3`)
  (D123). `border-x` e `border-y` e as formas por lado (`border-top`,
  `border-bottom-2`) DEVEM existir, com a mesma escala (D123). Valor numérico
  fora de 0, 2 e 4 na forma de classe (`border-3`) gera `AW103`, com sugestão
  do valor livre (D139).
- **R63.** Raio por lado: `round-top-<tam>`, `round-bottom-<tam>`,
  `round-left-<tam>` e `round-right-<tam>` DEVEM arredondar os dois cantos
  daquele lado. Raio por canto: `round-top-left-<tam>`, `round-top-right-<tam>`,
  `round-bottom-left-<tam>` e `round-bottom-right-<tam>`. `<tam>` é um valor da
  escala de raio (D124, D44). `shadow-none` NÃO DEVE existir na fase 1 (D124).

### 3.6 Conflito entre classes (D58, D82, D117)

- **R35.** Cada classe DEVE ser tratada como o conjunto de propriedades
  abstratas que ela define (`pad-x-2` = `pad.left` e `pad.right`).
- **R36.** Quando duas classes com o **mesmo conjunto de condições** definem a
  mesma propriedade, a de **maior especificidade** DEVE vencer, **qualquer que
  seja a ordem** em que foram escritas (`pad-x-2` vence `pad-4` no eixo x;
  `pad-top` vence `pad-y`, que vence `pad`) (D58).
- **R37.** Entre classes de mesma especificidade na mesma propriedade, DEVE
  vencer a **última escrita** (`bg-primary bg-surface` resulta em `bg-surface`)
  (D58).
- **R38.** A resolução DEVE gerar o aviso `AW201` para cada classe descartada
  por R37 (D58). Isso NÃO DEVE acontecer em R36 (classes de especificidade
  diferente não disputam).
- **R39.** A resolução de conflito DEVE ser feita no `core`, uma só vez; a IR
  entregue aos emissores não tem disputas (D82).
- **R40.** A especificidade de cada família é a da tabela da seção 5.9.
- **R41.** Quando classes com **conjuntos de condições diferentes** definem a
  mesma propriedade e as condições valem **ao mesmo tempo**, vence, nesta ordem
  fixa de critérios (D117, D136):
  1. a que tem **mais** condições (`dark(hover(x))` vence `hover(x)`; quem tem
     condição vence quem não tem, mesmo escrita antes e mesmo que a outra tenha
     especificidade maior: `bg-primary hover(bg-raised)` mostra `bg-raised` no
     hover);
  2. no empate, a de **faixa de tela maior** (sem faixa < `medium` <
     `expanded`), mesmo contra outra condição de tipo diferente
     (`expanded(x)` vence `hover(x)`);
  3. no empate, a última escrita.

  Os critérios formam uma ordem total, sem ciclo: em
  `expanded(x) hover(x) medium(x)`, vale `expanded`. Essa disputa NÃO DEVE
  gerar `AW201`: cada item vale na sua condição. A contagem de condições é
  feita depois da simplificação da R53.

### 3.7 Atalhos

- **R42.** Um atalho DEVE ser declarado no objeto `define` do
  `alanwind.config.ts`, dentro de `defineConfig` (D36, D63, D100). `define()`
  solto no código NÃO DEVE existir (D63).
- **R43.** O atalho `btn` DEVE valer como uma classe (D36): `btn` é um token.
  PODE ser usado dentro de variantes (`hover(btn)`) e DEVE ser expandido no
  lugar (D127).
- **R44.** O conteúdo de um atalho DEVE seguir esta mesma gramática, inclusive
  variantes e outros atalhos (D101). Ciclo entre atalhos DEVE ser erro ao
  carregar o tema (`AW301`). O nome de um atalho NÃO DEVE coincidir com uma
  classe nativa nem com o nome de uma variante: erro de colisão (`AW302`)
  (D101, D134).
- **R45.** Um atalho DEVE expandir no lugar onde foi escrito, e o conflito
  (R36, R37, R41) DEVE valer entre as classes expandidas e as vizinhas como se
  tivessem sido escritas ali (D127).
- **R64.** O nome de um atalho DEVE começar com letra minúscula e aceitar
  minúsculas, dígitos e hífen (`btn`, `card-title`, `btn-2`). Fora disso, é erro
  ao carregar o tema com o código `AW304` (D134, D138).

### 3.8 Diagnósticos e sintaxe quebrada

- **R46.** A resolução DEVE devolver sempre o resultado **mais** a lista de
  diagnósticos (D84). O `core` NÃO DEVE saber se está em desenvolvimento ou
  produção: quem está na borda mostra em dev e ignora em produção (D84, D35).
- **R47.** Entrada inválida NÃO DEVE lançar exceção nem zerar o estilo. Só o
  trecho ruim DEVE ser descartado; o resto do `look` continua valendo (D88).
- **R48.** Todo diagnóstico DEVE ter código `AW###`, posição e, quando houver
  candidato, sugestão (D84). A lista é a da seção 6.
- **R49.** A lista de diagnósticos DEVE sair ordenada por início da posição
  e, em empate, por código (D127).
- **R50.** **Trecho descartado** por erro de sintaxe (D127):
  - parêntese não fechado: da variante (`nome(`) até o fim do `look`;
  - `)` sobrando: só o `)`;
  - variante vazia ou de nome desconhecido: a variante inteira, `nome(...)`,
    com o conteúdo;
  - classe inválida: só o token;
  - em variante com um token inválido, os outros itens dela continuam valendo.
- **R51.** Sugestão, quando houver, DEVE ser o candidato válido mais próximo
  por distância de edição de no máximo 2; em empate, o primeiro em ordem
  alfabética (D127). Sem candidato, não há sugestão.
- **R52.** O tipo do `look` DEVE oferecer autocomplete das classes conhecidas e
  aceitar qualquer `string`, sem template literal estrito. A validação de
  verdade é o diagnóstico em runtime ou build (D126, D20, D66). Valor livre
  (`w=137`) e variantes aninhadas passam pelo tipo como `string`.
- **R65.** Item colado depois de `)` (`hover(bg-raised)pad-4`) DEVE gerar erro
  de falta de espaço (`AW010`), com sugestão de inserir o espaço, e a resolução
  DEVE aplicar os dois itens mesmo assim. A posição é o item colado (`pad-4`)
  (D126, D138).
- **R66.** Erro no conteúdo de um atalho DEVE ter como posição o **nome do
  atalho no `look`** (`btn` em `pad-4 btn`) e trazer um campo de origem com o
  atalho e a posição do trecho dentro do texto do `define` (D135).

## 4. Gramática (EBNF)

A EBNF formaliza as decisões acima; não cria regra nova. Notação: `,`
concatena, `|` alterna, `[ ]` opcional, `{ }` repete zero ou mais vezes,
`( )` agrupa, `" "` é literal, `(* *)` é comentário.

### 4.1 Estrutura do `look`

```ebnf
look         = { ws } , [ item , { sep , item } ] , { ws } ;
sep          = ws1 | "" ;        (* "" só depois de ")": erro, R65 (D126) *)
ws1          = ws , { ws } ;
ws           = " " | "\t" | "\n" | "\r" ;

item         = variant | token ;

variant      = variant-name , "(" , look , ")" ;     (* D28, D86 *)
variant-name = word ;      (* conjunto fechado, seção 5.1 (R8) *)

token        = free-token | class ;

free-token   = family , "=" , free-value ;            (* D30 *)
family       = word ;      (* pad, pad-x, margin-top, w, bg, text... *)

free-value   = number-value | color-value ;           (* D105 *)
number-value = [ "-" ] , integer , [ "." , integer ] , [ "%" ] ;  (* D125 *)
color-value  = hex , [ "/" , opacity ] ;              (* D104, D118 *)
hex          = "#" , ( hexdigit , hexdigit , hexdigit
                     | hexdigit , hexdigit , hexdigit ,
                       hexdigit , hexdigit , hexdigit
                     | hexdigit , hexdigit , hexdigit ,
                       hexdigit , hexdigit , hexdigit ,
                       hexdigit , hexdigit ) ;

class        = word ;      (* inclui atalhos e opacidade por sufixo *)
word         = segment , { "-" , segment } ;
segment      = ( letter | digit ) , { letter | digit } ;

opacity      = "0" | "25" | "50" | "75" | "100" ;     (* D98 *)
integer      = digit , { digit } ;
letter       = "a" | "b" | (* ... *) | "z" ;
digit        = "0" | "1" | (* ... *) | "9" ;
hexdigit     = digit | "a" | (* ... *) | "f" | "A" | (* ... *) | "F" ;
```

Observações sobre a gramática:
- `item` seguido de `item` exige espaço entre eles. Item colado depois de
  `)` (`hover(a)pad-4`) é lido como dois itens, mas gera erro (R65, D126).
- O tom da paleta (`nome-tom`, ex.: `red-40`) não faz parte do `color-value` na
  fase 1 (D118); volta junto com a paleta, na fase de tema.
- A gramática é só **léxica e estrutural**. Se `word` é uma classe existente,
  se o valor está na escala e se o papel existe é decisão do vocabulário
  (seção 5) e do tema; falhar nisso gera diagnóstico `AW1xx`, não erro de
  gramática.
- Um `word` imediatamente seguido de `(` é sempre nome de variante, nunca
  classe (R8).
- O número do `number-value` exige ao menos um dígito antes do ponto
  (`.5` não é válido) e usa ponto, não vírgula (R54).

### 4.2 Forma das classes por família

Segunda camada: o que `class` e `family` podem ser. Os nomes de papel vêm do
tema (R30).

```ebnf
class-form    = layout | spacing | size | color | border | typography
              | round | shadow | opacity-class | shortcut ;

layout        = "row" | "col" | "fill" | "wrap" | "between"
              | "center" | "center-x" | "center-y"
              | "x-start" | "x-end" | "y-start" | "y-end" ;
                                                        (* D18, D38, D122 *)

region        = "x" | "y" | "top" | "bottom" | "left" | "right" ;   (* D87 *)
axis          = "x" | "y" ;
scale         = integer ;           (* semântica: 0 a 16 (D43) *)

spacing       = "pad"    , [ "-" , region ] , "-" , scale
              | "margin" , [ "-" , region ] , "-" , ( scale | "auto" )
              | "gap"    , [ "-" , axis ] , "-" , scale ;   (* D43, D89, D125 *)

size          = ( "w" | "h" | "size" ) , "-" ,
                ( scale | "full" | "screen" ) ;                (* D98, D125 *)

color         = ( "bg" | "text" | "border" ) , "-" , role ,
                [ "-" , opacity ] ;                (* D31, D34, D95, D123 *)
role          = word ;      (* nomes do tema; não termina em número (D31) *)

border        = "border" , [ "-" , region ] , [ "-" , border-width ] ;
border-width  = "0" | "2" | "4" ;      (* D123; sem número, vale 1 *)

typography    = "type"    , "-" , type-size                  (* D49 *)
              | "weight"  , "-" , ( "regular" | "medium" | "bold" )
              | "leading" , "-" , ( "tight" | "normal" | "loose" )
              | "align"   , "-" , ( "left" | "center" | "right" )
              | "font"    , "-" , ( "sans" | "serif" | "mono" )
              | "italic" | "underline" | "upper" | "lower"
              | "lines"   , "-" , integer ;            (* D77, D98, D125 *)
type-size     = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" ;

round         = "round" , [ "-" , round-part ] , "-" , radius ;   (* D44, D124 *)
round-part    = "top" | "bottom" | "left" | "right"
              | "top-left" | "top-right" | "bottom-left" | "bottom-right" ;
radius        = "none" | "sm" | "md" | "lg" | "xl" | "full" ;
shadow        = "shadow" , "-" , ( "sm" | "md" | "lg" ) ;      (* D45, D124 *)
opacity-class = "opacity" , "-" , opacity ;                    (* D98 *)
shortcut      = shortcut-name ;   (* declarado em define (D100); não coincide
                                     com classe nem variante (D101, D134) *)
shortcut-name = lower , { lower | digit | "-" } ;              (* D134 *)
lower         = "a" | "b" | (* ... *) | "z" ;
```

Desambiguação de `border-`: se o segmento após `border` é um lado, um eixo
(`x`, `y`), uma espessura (número) ou nada, é espessura; caso contrário, é papel
de cor. Por isso um papel de borda NÃO DEVE se chamar `top`, `bottom`, `left`,
`right` (D127), nem `x` ou `y` (D139).

## 5. Vocabulário da fase 1

A coluna "Significa" descreve o efeito abstrato, não a tradução RN ou CSS
(`emissor-native.md`, `emissor-css.md`). `N` é um inteiro da escala (0 a 16).

### 5.1 Variantes (D28)

| Variante | Condição | D |
|---|---|---|
| `hover(...)` | Existe ponteiro e ele está sobre o elemento | D59, D110 |
| `press(...)` | Elemento pressionado, em todas as plataformas | D59 |
| `focus(...)` | Elemento com foco (teclado ou leitor de tela) | D103 |
| `disabled(...)` | Elemento desabilitado | D103 |
| `dark(...)` | Esquema escuro | D18, D33 |
| `light(...)` | Esquema claro (exceção; par do `dark`) | D103 |
| `ios(...)` | Plataforma iOS | D18 |
| `android(...)` | Plataforma Android | D18 |
| `web(...)` | Plataforma web | D18 |
| `native(...)` | iOS e Android juntos (oposto de `web`) | D103 |
| `medium(...)` | Largura a partir de 600 (`medium` e acima) | D29, D37, D94 |
| `expanded(...)` | Largura a partir de 840 | D29, D37, D94 |

Não existem: `compact(...)` (D61), `motion-safe(...)` nesta fase (D78) e a
forma `nome:classe` (D28).

### 5.2 Layout

| Classe | Significa | D |
|---|---|---|
| `row` | Filhos em linha | D18, D62 |
| `col` | Filhos em coluna (é o padrão do `Box`) | D18, D62 |
| `center` | Centraliza nos dois eixos da tela | D38 |
| `center-x` | Centraliza na horizontal da tela | D38 |
| `center-y` | Centraliza na vertical da tela | D38 |
| `x-start` | Encosta no lado esquerdo da tela | D122 |
| `x-end` | Encosta no lado direito da tela | D122 |
| `y-start` | Encosta no topo da tela | D122 |
| `y-end` | Encosta na base da tela | D122 |
| `between` | Distribui a sobra do espaço entre os filhos, no eixo principal | D122 |
| `wrap` | Filhos quebram de linha (sem ele, não quebram) | D122 |
| `fill` | Ocupa o espaço restante no eixo do pai (flex 1) | D18, D122 |
| `gap-N` | Espaço entre filhos nos dois eixos, `N` × 4 | D43 |
| `gap-x-N`, `gap-y-N` | Espaço entre colunas / entre linhas, relativos à tela | D125 |
| `gap=V`, `gap-x=V`, `gap-y=V` | Valor livre (R21) | D30, D125 |

### 5.3 Espaçamento (escala de 0 a 16, passos de 4, D43)

| Classe | Significa | D |
|---|---|---|
| `pad-N` | Espaço interno nos quatro lados | D43 |
| `pad-x-N` | Espaço interno à esquerda e à direita | D43, D58, D107 |
| `pad-y-N` | Espaço interno acima e abaixo | D43, D58, D107 |
| `pad-top-N`, `pad-bottom-N`, `pad-left-N`, `pad-right-N` | Espaço interno de um lado | D87 |
| `margin-N`, `margin-x-N`, `margin-y-N`, `margin-<lado>-N` | Espaço externo, mesmas formas de `pad` | D43, D87 |
| `margin-auto`, `margin-x-auto`, `margin-y-auto`, `margin-<lado>-auto` | Margem automática, em todas as formas | D89, D127 |
| `pad=V`, `pad-x=V`, `pad-top=V`, `margin=V`... | Valor livre (R17, R18) | D30, D105 |
| `margin-top=-8` | Margem negativa: só por valor livre | D89 |

Exemplos de escala: `pad-0` = 0, `pad-1` = 4, `pad-4` = 16, `pad-16` = 64.

### 5.4 Tamanho (D98)

| Classe | Significa | D |
|---|---|---|
| `w-N` | Largura, `N` × 4 (`w-10` = 40) | D98 |
| `h-N` | Altura, `N` × 4 | D98 |
| `size-N` | Largura e altura iguais, `N` × 4 | D98 |
| `w-full`, `h-full` | 100% da largura ou da altura do pai | D98 |
| `w-screen`, `h-screen` | Largura ou altura da tela | D98 |
| `size-full`, `size-screen` | Largura e altura juntas, 100% do pai / da tela | D125 |
| `w=V`, `h=V`, `size=V` | Valor livre: `w=137`, `w=50%`, `w=10.5` | D30, D98, D105, D125 |

### 5.5 Cor por papel (D34, D95)

| Prefixo | Pinta | Papéis do tema padrão | D |
|---|---|---|---|
| `bg-` | Fundo | `page`, `surface`, `raised`; `primary`, `secondary`, `success`, `warning`, `danger`, `info`; variações `-soft` e `-hover` conforme o tema | D22, D24, D46 a D52, D91, D95 |
| `text-` | Texto | `strong`, `body`, `muted`, `subtle`, `link`; `on-<papel>`; `on-<papel>-soft`; `<papel>` colorido (`text-danger`), exceto `secondary` | D18, D47, D92, D95, D129, D131 |
| `border-` | Cor da borda | `subtle`, `strong`, `focus` e todos os papéis do tema (`border-primary`, `border-danger`) | D95, D123 |

Notas:
- `text-subtle` é só para desabilitado (D93); `text-muted` para apoio.
- Opacidade por sufixo: `bg-primary-50`, `text-strong-50` (R27). Combinada
  com variação: `bg-primary-hover-50` (o sufixo é o último segmento).
- Cor livre: `bg=#e11d48`, `bg=#e11d48/50` (R22, R23); vale também em `text=` e
  `border=` (R21). Tons da paleta (`bg=red-40`) só na fase de tema (D118).
- Texto sobre `-soft`: `text-on-<papel>-soft` (`text-on-danger-soft`) (D131).
- `text-secondary` não existe (D129); use `text-body` ou `text-muted`.
- `border-<papel>` não tem cor por lado (D123).
- Que papéis aceitam `-soft`, `-hover` e `on-` é do tema (`tema.md`).

### 5.6 Borda

| Classe | Significa | D |
|---|---|---|
| `border-subtle`, `border-strong`, `border-focus`, `border-<papel>` | Cor da borda | D95, D123 |
| `border` | Espessura 1 nos quatro lados | D123 |
| `border-0`, `border-2`, `border-4` | Espessura 0, 2 ou 4 nos quatro lados | D123 |
| `border=V` | Espessura livre nos quatro lados (`border=3`) | D123, D30 |
| `border-x`, `border-y` | Espessura 1 à esquerda e à direita / em cima e embaixo | D123 |
| `border-x-N`, `border-y-N` | Espessura `N` (0, 2 ou 4) no eixo | D123 |
| `border-top`, `border-bottom`, `border-left`, `border-right` | Espessura 1 de um lado | D87, D123 |
| `border-<lado>-N` | Espessura `N` (0, 2 ou 4) de um lado (`border-bottom-2`) | D87, D123 |

A cor da borda e a espessura são propriedades distintas (`border.color` e
`border.width.*`). Não há cor por lado (D123).

### 5.7 Tipografia

| Classe | Significa | D |
|---|---|---|
| `type-xs`, `type-sm`, `type-base`, `type-lg`, `type-xl`, `type-2xl`, `type-3xl` | Tamanho do texto (12, 14, 16, 18, 20, 24, 30) | D23, D49 |
| `weight-regular`, `weight-medium`, `weight-bold` | Peso (400, 500, 700) | D77, D98 |
| `leading-tight`, `leading-normal`, `leading-loose` | Altura de linha, multiplica o `type-*` (1.25, 1.5, 1.75) | D77, D98 |
| `align-left`, `align-center`, `align-right` | Alinhamento do texto | D77, D125 |
| `font-sans`, `font-serif`, `font-mono` | Família de fonte do sistema (valores por plataforma: `tema.md`) | D77, D125, D133 |
| `italic` | Itálico | D77 |
| `underline` | Sublinhado | D77 |
| `upper` | Texto em maiúsculas | D77 |
| `lower` | Texto em minúsculas | D77 |
| `lines-N` | Limita o texto a `N` linhas; **vai para a parte de props da IR**, que também tem condição (`medium(lines-2) lines-4`); `N` inteiro maior ou igual a 1 | D77, D83, D127, D135 |
| `type=V` | Valor livre de tamanho (R21) | D30, D127 |
| `leading=V` | Valor livre de altura de linha, aceita decimal (`leading=1.4`) | D125 |

### 5.8 Raio, sombra e opacidade

| Classe | Significa | D |
|---|---|---|
| `round-none`, `round-sm`, `round-md`, `round-lg`, `round-xl` | Raio 0, 4, 8, 12, 16 nos quatro cantos | D44 |
| `round-full` | Totalmente redondo (9999) | D44, D98 |
| `round-top-<tam>`, `round-bottom-<tam>`, `round-left-<tam>`, `round-right-<tam>` | Raio nos dois cantos daquele lado | D124 |
| `round-top-left-<tam>`, `round-top-right-<tam>`, `round-bottom-left-<tam>`, `round-bottom-right-<tam>` | Raio de um canto | D124 |
| `shadow-sm`, `shadow-md`, `shadow-lg` | Elevação. No escuro eleva o fundo sozinho (D97, D132) | D45, D96, D97 |
| `opacity-0`, `opacity-25`, `opacity-50`, `opacity-75`, `opacity-100` | Opacidade do elemento | D98 |
| `round=V` | Valor livre de raio, nos quatro cantos (R21) | D30, D127 |

`shadow-none` não existe na fase 1 (D124).

### 5.9 Especificidade para a regra de conflito (D58)

A especificidade só compara classes que definem a **mesma propriedade** com o
**mesmo conjunto de condições**. Nível maior vence (R36). Para conjuntos de
condições diferentes, vale a R41. A tabela é derivada da D58; as linhas de
`size`, `center` e espessura da borda são por analogia (D127), e as das classes
novas (`x-start`, `border-x`, raio, `gap-x`) seguem a mesma analogia (D139).

| Família | Nível 1 | Nível 2 | Nível 3 |
|---|---|---|---|
| Espaço interno | `pad` (4 lados) | `pad-x`, `pad-y` (2 lados) | `pad-top`, `pad-bottom`, `pad-left`, `pad-right` (1 lado) |
| Espaço externo | `margin` | `margin-x`, `margin-y` | `margin-top`, `margin-bottom`, `margin-left`, `margin-right` |
| Tamanho | `size` (largura e altura) | `w`, `h` | — |
| Posição na tela | `center` (eixos x e y) | `center-x`, `x-start`, `x-end` (eixo x); `center-y`, `y-start`, `y-end` (eixo y) | — |
| Espessura da borda | `border` (4 lados) | `border-x`, `border-y` | `border-<lado>` |
| Raio | `round` (4 cantos) | `round-top`, `round-bottom`, `round-left`, `round-right` | `round-top-left`, `round-top-right`, `round-bottom-left`, `round-bottom-right` |
| Espaço entre filhos | `gap` (x e y) | `gap-x`, `gap-y` | — |
| Qualquer outra | Nível único: `bg`, `text`, `border-<papel>`, `type`, `weight`, `leading`, `align`, `font`, `italic`, `underline`, `upper`/`lower`, `lines`, `shadow`, `opacity`, `row`/`col`, `fill`, `wrap` | — | — |

Notas:
- Valor livre tem a especificidade da família: `pad=10` é nível 1; `pad-x=10`,
  nível 2.
- `bg-primary`, `bg-primary-50`, `bg-primary-hover` e `bg=#fff` disputam a
  mesma propriedade (`bg`), todos no mesmo nível.
- `upper` e `lower` disputam a mesma propriedade (`case`).
- A vitória é **por propriedade**: `pad-4 pad-x-2` dá 8 à esquerda e à direita
  e 16 em cima e embaixo.
- Classes de mesma especificidade que se sobrepõem têm sempre o mesmo conjunto
  de propriedades; por isso `AW201` só aparece em empate total.

### 5.10 Propriedades abstratas usadas nos exemplos

`direction`, `place.x`, `place.y`, `place.main`, `wrap`, `fill`, `gap.x`,
`gap.y`, `pad.top|bottom|left|right`, `margin.top|bottom|left|right`, `width`,
`height`, `bg`, `text`, `border.color`, `border.width.top|bottom|left|right`,
`type`, `weight`, `leading`, `align`, `font`, `italic`, `underline`, `case`,
`round.top-left|top-right|bottom-left|bottom-right`, `shadow`, `opacity`. Na
parte de props: `lines`. O nome `place.main` (de `between`; D140) e a divisão
de `gap` e `round` em propriedades são notação desta spec (D139).

## 6. Diagnósticos

Os códigos, textos, severidades e sugestões abaixo foram aprovados na D127. A
D84 fixou: código `AW###`, posição e sugestão. A D138 acrescentou `AW010` e
`AW304` e ampliou o `AW008`.

Severidade: **erro** = o trecho foi descartado; **aviso** = o trecho vale, mas
é suspeito. Posição `[início, fim)` (seção 2). `{x}` é o texto citado.

| Código | Sev. | Quando | Mensagem | Sugestão | D |
|---|---|---|---|---|---|
| `AW001` | erro | Parêntese `(` sem `)` | `Variante {nome} não foi fechada com ")".` | `{nome}(...)` fechada | D88 |
| `AW002` | erro | `)` sem `(` | `")" sem abertura correspondente.` | remover o `)` | D88 |
| `AW003` | erro | Variante vazia, `nome()` | `A variante {nome} está vazia.` | remover ou preencher | D88 |
| `AW004` | erro | Nome de variante desconhecido | `Variante {nome} não existe.` (para `compact`: `... o que não tem variante vale para todos os tamanhos.`; para `motion-safe`: `... não está disponível nesta fase.`) | nome válido mais próximo | D61, D78, D88 |
| `AW005` | erro | Nome de variante sem parêntese (`hover` sozinho) | `{nome} é uma variante; use {nome}(...).` | `{nome}(...)` | D28 |
| `AW006` | erro | Forma com dois-pontos, `hover:bg-x` | `Variantes usam parêntese, não ":".` | `hover(bg-x)` | D28 |
| `AW007` | erro | Valor livre malformado: `w=` (vazio), `=50` (sem família), `w==5` | `Valor livre malformado.` | `{família}=valor` | D30, D88 |
| `AW008` | erro | Valor livre inválido: unidade (`rem`, `em`, `vw`, `vh`), texto, negativo fora de `margin`, hex com tamanho errado, opacidade fora da escala, barra com hex de 8 dígitos, vírgula decimal (`w=10,5`), ponto sem dígito antes (`w=.5`), tom da paleta na fase 1 (`bg=red-40`) | `Valor {v} não é aceito em {família}.` (com mensagem própria para vírgula, ponto inicial e paleta) | forma válida mais próxima | D104, D105, D118, D125, D138 |
| `AW009` | erro | `=` em família que não aceita valor livre (`weight=600`) | `{família} não aceita valor livre.` | classe da escala mais próxima | D30 |
| `AW010` | erro | Item colado depois de `)` (`hover(bg-raised)pad-4`); os dois itens valem | `Falta espaço entre {a} e {b}.` | inserir um espaço antes do item | D126, D138 |
| `AW101` | erro | Classe desconhecida (`padd-4`, `Pad-4`, `pad_4`) | `Classe {x} não existe.` | classe mais próxima | D35, D88 |
| `AW102` | erro | Papel de cor inexistente (`bg-banana`, `text-secondary`) | `O papel {papel} não existe em {prefixo}-.` | papel mais próximo | D35, D129 |
| `AW103` | erro | Valor fora da escala (`pad-17`, `type-4xl`, `opacity-30`, `bg-primary-30`, `border-3`) | `{valor} está fora da escala de {família}.` | valor da escala mais próximo ou o valor livre | D43, D98, D123 |
| `AW104` | erro | Margem negativa na escala (`margin-top--8`) | `Margem negativa só por valor livre.` | `margin-top=-8` | D89 |
| `AW107` | erro | Barra em classe com papel (`bg-primary/50`) | `Opacidade em papel usa sufixo, não "/".` | `bg-primary-50` | D31, D104 |
| `AW201` | aviso | Classe descartada por empate de especificidade (R37) | `{descartada} é sobrescrita por {vencedora}.` | remover a descartada | D58 |
| `AW202` | aviso | Condições impossíveis juntas (R15) | `As condições {a} e {b} nunca valem juntas.` | remover uma | D86 |
| `AW301` | erro | Ciclo entre atalhos, ao carregar o tema | `Ciclo entre atalhos: {a} -> {b} -> {a}.` | — | D101 |
| `AW302` | erro | Nome de atalho igual a uma classe ou a uma variante, ao carregar o tema | `O atalho {nome} coincide com uma classe ou variante.` | outro nome | D101, D134 |
| `AW303` | erro | Papel criado terminando em número, ao carregar o tema | `Papel {nome} não pode terminar em número.` | `{nome}` sem o número | D31 |
| `AW304` | erro | Nome de atalho fora do formato (maiúscula, começa com dígito ou hífen), ao carregar o tema | `O nome do atalho {nome} é inválido.` | nome em minúsculas | D134, D138 |

Regras dos diagnósticos:
- Posição de erro de classe: o token inteiro (`pad-17` em `[0,6)`). De
  variante: do nome até o fim da variante (ou até o fim do `look` em `AW001`).
- Posição de `AW201`: o token **descartado**. De `AW202`: a variante mais
  interna.
- Posições são sempre relativas ao texto original do `look`, também dentro de
  variantes aninhadas.
- Erro dentro de um atalho: a posição é o **nome do atalho no `look`**, e o
  diagnóstico traz um campo de origem com o atalho e a posição dentro do texto
  do `define` (R66, D135). Formato do campo: `funcionamento-interno.md`.
- Posição de `AW010`: o item colado (`pad-4` em `hover(bg-raised)pad-4`).
- `AW301` a `AW304` pertencem ao carregamento do tema e referem-se ao texto da
  definição, não a um `look` (`tema.md`).
- O contraste (D32) não está na fase 1 (seção 10); seu código será proposto
  quando entrar.

## 7. Exemplos

Notação das saídas (D127; só para esta spec, o formato real é o da IR em
`funcionamento-interno.md`):
- Uma saída é uma lista `[condições] propriedade=valor` separada por espaço.
  Sem prefixo, o item vale sempre. As condições são um conjunto, escritas em
  ordem alfabética (`[dark,hover]`). Isso é só notação desta spec; na IR os
  átomos seguem a ordem da tabela 5.1 (`[hover, dark]`, D140).
- Ordem: primeiro os itens sem condição, depois por condições em ordem
  alfabética; dentro de cada grupo, por nome da propriedade.
- Escalas numéricas saem resolvidas (`pad-4` = 16); escalas nomeadas saem pelo
  nome (`type=lg`, `round.top-left=md`); cores saem como `role(nome)` ou
  `hex(#...)`, com `@N` para a opacidade. Booleanos saem como `true`.
- `props:` marca a parte de props; o que vem depois segue a mesma notação, com
  ou sem `[condições]`. `diag:` lista diagnósticos como `AW###[início,fim)`,
  com a sugestão entre crases quando for parte do teste. Sem `diag:`, a lista é
  vazia.
- Nas tabelas 7.1 a 7.6 a saída **não resolve** qual item vale quando várias
  condições estão ativas; isso é da seção 7.7 (R41).

### 7.1 Classes e escalas

| Entrada | Saída |
|---|---|
| `pad-4` | `pad.bottom=16 pad.left=16 pad.right=16 pad.top=16` |
| `pad-0` | `pad.bottom=0 pad.left=0 pad.right=0 pad.top=0` |
| `pad-16` | `pad.bottom=64 pad.left=64 pad.right=64 pad.top=64` |
| `pad-x-4` | `pad.left=16 pad.right=16` |
| `pad-y-2` | `pad.bottom=8 pad.top=8` |
| `pad-top-2` | `pad.top=8` |
| `margin-left-4` | `margin.left=16` |
| `margin-x-auto` | `margin.left=auto margin.right=auto` |
| `margin-auto` | `margin.bottom=auto margin.left=auto margin.right=auto margin.top=auto` |
| `margin-top-auto` | `margin.top=auto` |
| `margin-top=-8` | `margin.top=-8` |
| `gap-4` | `gap.x=16 gap.y=16` |
| `gap-x-4` | `gap.x=16` |
| `gap-y-2` | `gap.y=8` |
| `row` | `direction=row` |
| `col` | `direction=col` |
| `center` | `place.x=center place.y=center` |
| `center-x` | `place.x=center` |
| `center-y` | `place.y=center` |
| `x-start` | `place.x=start` |
| `x-end` | `place.x=end` |
| `y-start` | `place.y=start` |
| `y-end` | `place.y=end` |
| `between` | `place.main=between` |
| `wrap` | `wrap=true` |
| `fill` | `fill=true` |
| `w-full` | `width=full` |
| `h-screen` | `height=screen` |
| `h-10` | `height=40` |
| `size-10` | `height=40 width=40` |
| `size-full` | `height=full width=full` |
| `size-screen` | `height=screen width=screen` |
| `border` | `border.width.bottom=1 border.width.left=1 border.width.right=1 border.width.top=1` |
| `border-0` | `border.width.bottom=0 border.width.left=0 border.width.right=0 border.width.top=0` |
| `border-2` | `border.width.bottom=2 border.width.left=2 border.width.right=2 border.width.top=2` |
| `border-4` | `border.width.bottom=4 border.width.left=4 border.width.right=4 border.width.top=4` |
| `border-x` | `border.width.left=1 border.width.right=1` |
| `border-y-2` | `border.width.bottom=2 border.width.top=2` |
| `border-top` | `border.width.top=1` |
| `border-bottom-2` | `border.width.bottom=2` |
| `type-lg` | `type=lg` |
| `weight-bold` | `weight=bold` |
| `leading-tight` | `leading=tight` |
| `align-center` | `align=center` |
| `font-mono` | `font=mono` |
| `upper` | `case=upper` |
| `lines-2` | `props: lines=2` |
| `round-md` | `round.bottom-left=md round.bottom-right=md round.top-left=md round.top-right=md` |
| `round-full` | `round.bottom-left=full round.bottom-right=full round.top-left=full round.top-right=full` |
| `round-top-lg` | `round.top-left=lg round.top-right=lg` |
| `round-bottom-md` | `round.bottom-left=md round.bottom-right=md` |
| `round-left-lg` | `round.bottom-left=lg round.top-left=lg` |
| `round-top-left-lg` | `round.top-left=lg` |
| `shadow-md` | `shadow=md` |
| `opacity-50` | `opacity=50` |

### 7.2 Valor livre e cor

| Entrada | Saída |
|---|---|
| `w=137` | `width=137` |
| `w=50%` | `width=50%` |
| `w=10.5` | `width=10.5` |
| `leading=1.4` | `leading=1.4` |
| `pad=10` | `pad.bottom=10 pad.left=10 pad.right=10 pad.top=10` |
| `pad-x=10` | `pad.left=10 pad.right=10` |
| `gap-x=6` | `gap.x=6` |
| `border=3` | `border.width.bottom=3 border.width.left=3 border.width.right=3 border.width.top=3` |
| `bg-primary` | `bg=role(primary)` |
| `bg-primary-hover` | `bg=role(primary-hover)` |
| `bg-primary-soft` | `bg=role(primary-soft)` |
| `bg-primary-50` | `bg=role(primary)@50` |
| `text-strong-50` | `text=role(strong)@50` |
| `text-on-primary` | `text=role(on-primary)` |
| `text-on-danger-soft` | `text=role(on-danger-soft)` |
| `text-danger` | `text=role(danger)` |
| `border-subtle` | `border.color=role(subtle)` |
| `border-danger` | `border.color=role(danger)` |
| `bg=#e11d48` | `bg=hex(#e11d48)` |
| `bg=#e11d48/50` | `bg=hex(#e11d48)@50` |
| `bg=#fff` | `bg=hex(#fff)` |
| `bg=#e11d4880` | `bg=hex(#e11d4880)` |
| `dark(bg=#e11d48)` | `[dark] bg=hex(#e11d48)` |

Cor livre com tom da paleta (`bg=red-40`) não está na fase 1 (D118): ver 11.1.

### 7.3 Variantes

| Entrada | Saída |
|---|---|
| `hover(bg-raised shadow-md)` | `[hover] bg=role(raised) shadow=md` |
| `press(opacity-75)` | `[press] opacity=75` |
| `focus(border-focus)` | `[focus] border.color=role(focus)` |
| `disabled(opacity-50)` | `[disabled] opacity=50` |
| `ios(pad-6) android(pad-4)` | `[android] pad.bottom=16 pad.left=16 pad.right=16 pad.top=16 [ios] pad.bottom=24 pad.left=24 pad.right=24 pad.top=24` |
| `native(pad-4)` | `[native] pad.bottom=16 pad.left=16 pad.right=16 pad.top=16` |
| `web(row)` | `[web] direction=row` |
| `col medium(row)` | `direction=col [medium] direction=row` |
| `medium(pad-x-4 hover(bg-raised))` | `[medium] pad.left=16 pad.right=16 [hover,medium] bg=role(raised)` |
| `dark(hover(bg-raised))` | `[dark,hover] bg=role(raised)` |
| `hover(dark(bg-raised))` | `[dark,hover] bg=role(raised)` |
| `bg-primary hover(bg-primary-hover) press(bg-primary-hover)` | `bg=role(primary) [hover] bg=role(primary-hover) [press] bg=role(primary-hover)` |
| `hover(  bg-raised  )` | `[hover] bg=role(raised)` |
| `medium(pad-4) expanded(pad-8)` | `[expanded] pad.bottom=32 pad.left=32 pad.right=32 pad.top=32 [medium] pad.bottom=16 pad.left=16 pad.right=16 pad.top=16` |
| `dark(light(bg-raised))` | nenhuma camada (descartada, D138) e `diag: AW202[5,21)` |
| `ios(web(row))` | nenhuma camada (descartada, D138) e `diag: AW202[4,12)` |
| `ios(native(row))` | `[ios] direction=row` (R53, sem diagnóstico) |
| `medium(expanded(pad-4))` | `[expanded] pad.bottom=16 pad.left=16 pad.right=16 pad.top=16` (R53, sem diagnóstico) |
| `medium(lines-2) lines-4` | `props: lines=4 [medium] lines=2` |

### 7.4 Conflito entre classes (D58)

| Entrada | Saída |
|---|---|
| `pad-4 pad-x-2` | `pad.bottom=16 pad.left=8 pad.right=8 pad.top=16` |
| `pad-x-2 pad-4` | `pad.bottom=16 pad.left=8 pad.right=8 pad.top=16` |
| `pad-top-2 pad-y-4 pad-4` | `pad.bottom=16 pad.left=16 pad.right=16 pad.top=8` |
| `pad-y-4 pad-top-2` | `pad.bottom=16 pad.top=8` |
| `bg-primary bg-surface` | `bg=role(surface)` e `diag: AW201[0,10)` |
| `bg-surface bg-primary` | `bg=role(primary)` e `diag: AW201[0,10)` |
| `bg-primary bg=#fff` | `bg=hex(#fff)` e `diag: AW201[0,10)` |
| `pad-x-2 pad-x-4` | `pad.left=16 pad.right=16` e `diag: AW201[0,7)` |
| `row col` | `direction=col` e `diag: AW201[0,3)` |
| `center center-x` | `place.x=center place.y=center` |
| `gap-4 gap-x-2` | `gap.x=8 gap.y=16` |
| `border border-top-2` | `border.width.bottom=1 border.width.left=1 border.width.right=1 border.width.top=2` |
| `round-top-lg round-md` | `round.bottom-left=md round.bottom-right=md round.top-left=lg round.top-right=lg` |
| `hover(bg-primary bg-surface)` | `[hover] bg=role(surface)` e `diag: AW201[6,16)` |
| `dark(hover(bg-raised)) hover(dark(bg-surface))` | `[dark,hover] bg=role(surface)` e `diag: AW201[11,20)` |
| `lines-2 lines-3` | `props: lines=3` e `diag: AW201[0,7)` |
| `between center-y` (coluna) | `place.y=center` e `diag: AW201[0,7)` |
| `center-y between` (coluna) | `place.y=between` e `diag: AW201[0,8)` |

Nota: em `center center-x`, `center-x` (nível 2) vence `center` (nível 1) em
`place.x`; como o valor é o mesmo, o resultado não muda e não há aviso, porque
os níveis são diferentes (seção 5.9, D127). As linhas com `gap`, `border` e
`round` seguem a mesma lógica por analogia (D139).

### 7.5 Atalhos

Com `defineConfig({ define: { btn: 'bg-primary pad-4' } })`:

| Entrada | Saída |
|---|---|
| `btn` | `bg=role(primary) pad.bottom=16 pad.left=16 pad.right=16 pad.top=16` |
| `btn hover(bg-primary-hover)` | `bg=role(primary) pad.bottom=16 pad.left=16 pad.right=16 pad.top=16 [hover] bg=role(primary-hover)` |
| `hover(btn)` | `[hover] bg=role(primary) pad.bottom=16 pad.left=16 pad.right=16 pad.top=16` |
| `btn pad-8` | `bg=role(primary) pad.bottom=32 pad.left=32 pad.right=32 pad.top=32` e `diag: AW201[0,3)` (R45) |

Com `defineConfig({ define: { btn: 'bg-primary pad-17' } })` (erro dentro do
atalho, R66):

| Entrada | Saída |
|---|---|
| `pad-4 btn` | `bg=role(primary) pad.bottom=16 pad.left=16 pad.right=16 pad.top=16` e `diag: AW103[6,9)`, origem `btn` em `[11,17)` do `define` |

A notação da origem (`origem {atalho} em [início,fim) do define`) vale só para
esta spec; o campo real está em `funcionamento-interno.md`.

### 7.6 Erros e sintaxe quebrada (D88)

| Entrada | Saída |
|---|---|
| `pad-4 hover(bg-raised` | `pad.bottom=16 pad.left=16 pad.right=16 pad.top=16` e `diag: AW001[6,21)` |
| `hover(` | vazia e `diag: AW001[0,6)` |
| `pad-4 hover(bg-raised dark(pad-2)` | `pad.bottom=16 pad.left=16 pad.right=16 pad.top=16` e `diag: AW001[6,33)` |
| `hover(dark(pad-2` | vazia e `diag: AW001[0,16)` |
| `pad-4 bg-raised)` | `bg=role(raised) pad.bottom=16 pad.left=16 pad.right=16 pad.top=16` e `diag: AW002[15,16)` |
| `hover(pad-2))` | `[hover] pad.bottom=8 pad.left=8 pad.right=8 pad.top=8` e `diag: AW002[12,13)` |
| `)` | vazia e `diag: AW002[0,1)` |
| `hover()` | vazia e `diag: AW003[0,7)` |
| `hoover(pad-2)` | vazia e `diag: AW004[0,13)` com sugestão `hover` |
| `compact(row)` | vazia e `diag: AW004[0,12)` |
| `motion-safe(pad-2)` | vazia e `diag: AW004[0,18)` |
| `hover` | vazia e `diag: AW005[0,5)` |
| `hover:bg-raised` | vazia e `diag: AW006[0,15)` com sugestão `hover(bg-raised)` |
| `w=` | vazia e `diag: AW007[0,2)` |
| `=50` | vazia e `diag: AW007[0,3)` |
| `w=10rem` | vazia e `diag: AW008[0,7)` |
| `w=-5` | vazia e `diag: AW008[0,4)` |
| `bg=#12` | vazia e `diag: AW008[0,6)` |
| `bg=#e11d4880/50` | vazia e `diag: AW008[0,15)` |
| `bg=#e11d48/30` | vazia e `diag: AW008[0,13)` |
| `w=10,5` | vazia e `diag: AW008[0,6)` |
| `w=.5` | vazia e `diag: AW008[0,4)` |
| `bg=red-40` | vazia e `diag: AW008[0,9)` |
| `border-3` | vazia e `diag: AW103[0,8)` com sugestão `border=3` |
| `hover(bg-raised)pad-4` | `pad.bottom=16 pad.left=16 pad.right=16 pad.top=16 [hover] bg=role(raised)` e `diag: AW010[16,21)` |
| `weight=600` | vazia e `diag: AW009[0,10)` |
| `padd-4` | vazia e `diag: AW101[0,6)` com sugestão `pad-4` |
| `Pad-4` | vazia e `diag: AW101[0,5)` com sugestão `pad-4` |
| `bg-primry` | vazia e `diag: AW102[0,9)` com sugestão `bg-primary` |
| `bg-banana` | vazia e `diag: AW102[0,9)` sem sugestão |
| `text-secondary` | vazia e `diag: AW102[0,14)` (D129) |
| `pad-17` | vazia e `diag: AW103[0,6)` |
| `bg-primary-30` | vazia e `diag: AW103[0,13)` |
| `opacity-30` | vazia e `diag: AW103[0,10)` |
| `margin-top--8` | vazia e `diag: AW104[0,13)` com sugestão `margin-top=-8` |
| `bg-primary/50` | vazia e `diag: AW107[0,13)` com sugestão `bg-primary-50` |
| `foo bar` | vazia e `diag: AW101[0,3), AW101[4,7)` |
| `pad-4 hover(bg-banana pad-2) bg-primary` | `bg=role(primary) pad.bottom=16 pad.left=16 pad.right=16 pad.top=16 [hover] pad.bottom=8 pad.left=8 pad.right=8 pad.top=8` e `diag: AW102[12,21)` |
| `` (vazio) | vazia, sem diagnóstico |
| `   ` (só espaços) | vazia, sem diagnóstico |

### 7.7 Precedência entre condições diferentes (D117, D136)

Cada linha diz qual valor vale **quando as condições do contexto estão
ativas ao mesmo tempo** (R41). "Contexto" lista as condições que valem.

| Entrada | Contexto | Valor que vale |
|---|---|---|
| `bg-primary hover(bg-raised)` | nenhuma | `bg=role(primary)` |
| `bg-primary hover(bg-raised)` | hover | `bg=role(raised)` |
| `hover(bg-raised) bg-primary` | hover | `bg=role(raised)` |
| `pad-x-2 medium(pad-4)` | compact | `pad.left=8 pad.right=8` |
| `pad-x-2 medium(pad-4)` | medium | `pad.bottom=16 pad.left=16 pad.right=16 pad.top=16` |
| `dark(hover(bg-raised)) hover(bg-surface)` | dark e hover | `bg=role(raised)` |
| `dark(hover(bg-raised)) hover(bg-surface)` | só hover | `bg=role(surface)` |
| `expanded(pad-8) medium(pad-4)` | largura 900 (medium e expanded) | `pad.bottom=32 pad.left=32 pad.right=32 pad.top=32` |
| `medium(pad-4) expanded(pad-8)` | largura 900 | `pad.bottom=32 pad.left=32 pad.right=32 pad.top=32` |
| `hover(bg-raised) press(bg-primary-hover)` | hover e press | `bg=role(primary-hover)` |
| `press(bg-primary-hover) hover(bg-raised)` | hover e press | `bg=role(raised)` |
| `medium(lines-2) lines-4` | medium | `props: lines=2` |
| `expanded(bg-primary) hover(bg-raised) medium(bg-surface)` | expanded, hover e medium | `bg=role(primary)` |
| `hover(bg-raised) medium(bg-surface)` | hover e medium | `bg=role(surface)` |
| `medium(bg-surface) hover(bg-raised)` | hover e medium | `bg=role(surface)` |

Notas:
- `pad-x-2 medium(pad-4)` em `medium`: a condição vence a especificidade da
  família (critério 1 da R41); `pad-x` não segura o 8 da esquerda e da direita.
- Nas três últimas linhas, o número de condições empata (uma cada); a faixa
  maior vence (critério 2), mesmo contra `hover` escrito depois (D136).
- Nenhuma dessas disputas gera `AW201`.

## 8. Casos de borda e erros

| Caso | Comportamento | Regra |
|---|---|---|
| `look` vazio ou só espaços | Estilo vazio, sem diagnóstico | R4 |
| Várias classes inválidas | Cada uma gera o seu diagnóstico; as válidas valem | R47 |
| Variante com um token inválido dentro | Só o token é descartado; o resto da variante vale | R50 |
| Parêntese não fechado com variante interna fechada | Descarta da variante aberta até o fim; um só `AW001` | R50 |
| Várias variantes abertas (`hover(dark(x`) | Um só `AW001`, na mais externa | R50 |
| Maiúscula (`Pad-4`) | `AW101` | R2 |
| `pad_4`, `pad-4,`, `$`: caractere fora da gramática | Token descartado com `AW101` | R2 |
| Mesma classe repetida (`pad-4 pad-4`) | Empate: vale uma, `AW201` na primeira | R37, R38 |
| Classe de nível maior depois de menor, ou antes | Vence a de nível maior, sem aviso | R36 |
| Mesmo item sob condições diferentes (`bg-primary hover(bg-raised)`) | Ficam os dois, cada um com as suas condições; sem `AW201`; com hover ativo vale o da variante | R41 |
| `dark(dark(x))` | Aceito; condições repetidas valem como uma | R11, R53 |
| `ios(native(x))`, `medium(expanded(x))` | Simplificados em silêncio para `ios(x)` e `expanded(x)` | R53 |
| `dark(light(x))`, `ios(web(x))` | Descartados da IR, `AW202` | R15, D138 |
| `hover(bg-raised)pad-4` | `AW010` com sugestão; aplica os dois itens | R65 |
| `between center-y` (coluna) | Conflito normal: vale o último, com `AW201` | R59 |
| `w=10.5`, `leading=1.4` | Aceitos (decimal com ponto) | R54 |
| `w=10,5`, `w=.5` | Erro `AW008` | R54 |
| `bg=red-40` na fase 1 | Tom da paleta não existe na fase 1: `AW008` | R18, D118 |
| `text-secondary` | `AW102` | R56 |
| `shadow-none` | Fora da fase 1 | R63 |
| `border-3` | `AW103` com sugestão `border=3` | R62 |
| Atalho com nome de classe ou de variante | Erro ao carregar o tema (`AW302`) | R44 |
| Atalho com nome fora do formato | Erro ao carregar o tema (`AW304`) | R64 |
| Ciclo entre atalhos | Erro ao carregar o tema (`AW301`) | R44 |
| Erro dentro de atalho | Posição = nome do atalho no `look`; traz a origem no `define` | R66 |
| `bg-red-600` | `AW102`: `red-600` não é papel | R26, R29 |
| Papel inexistente em produção | Ignorado, sem quebrar | R29, R46 |
| Cor livre sem `on-` | Aceita; o aviso de contraste é futuro | seção 10 |

## 9. Critérios de aceite

- O parser aceita todas as entradas válidas da seção 7 e devolve a saída
  exata da tabela, incluindo a ordem.
- Toda entrada da seção 7.6 devolve o resultado e os diagnósticos exatos da
  tabela (código e posição; sugestão onde indicada).
- Toda linha da seção 7.7 devolve o valor indicado para o contexto dado (R41).
- Nenhuma entrada, por mais quebrada que seja, lança exceção nem zera o estilo
  dos trechos válidos (R47). Isto vale também para entradas geradas
  aleatoriamente (teste de propriedade).
- `dark(hover(x))` e `hover(dark(x))` produzem saídas idênticas para qualquer
  `x` válido (R11).
- Para toda classe de espaçamento, o resultado independe da ordem entre
  `pad`, `pad-x`/`pad-y` e `pad-<lado>` (R36), e `AW201` só aparece em empate
  total (R38).
- Há um teste de ouro por linha das tabelas da seção 7, no formato da skill
  `teste-de-ouro`.
- A resolução é determinística: mesma entrada gera a mesma saída e a mesma
  ordem de diagnósticos (R6, R49).
- Todo código `AW###` da seção 6 tem pelo menos um teste que o provoca.
- A gramática da seção 4 é aceita por um teste que gera entradas a partir dela
  e confere que o parser as lê sem diagnóstico de sintaxe (`AW00x`).
- O tipo do `look` aceita qualquer `string` e oferece autocomplete das classes
  conhecidas (R52, D126).

## 10. Fora da fase 1

| Item | Decisão | Quando |
|---|---|---|
| `motion-safe(...)` | D78, D18 | Fase de acessibilidade |
| Utilitários `tap-target` e `focus-ring` | D78 (a área de toque é do `Pressable`, D111) | Fase de acessibilidade |
| Faixa exata de tamanho de tela | D106; hoje se resolve com `medium(x) expanded(y)` (D37) | Depois |
| Lados `start` e `end` (idiomas da direita para a esquerda) | D87 | Depois |
| `rem`, `em`, `vw`, `vh` no valor livre | D105 | Depois |
| Tons da paleta no valor livre (`bg=red-40`) | D118, D99 | Fase de tema |
| `shadow-none` | D124 | Depois |
| Aviso de contraste (cores livres incluídas) | D32; não marcado para a fase 1 (D66) | A atribuir na divisão em fases |
| Paleta customizável, interpolação e recálculo de `-soft`/`-hover`/`on-` | D99 | Fase de tema |
| Seções de tema além de `define` no `alanwind.config.ts` | D81 | Fase de tema |
| Arquitetura por presets | D90 | Se um dia houver segundo vocabulário |
| Look padrão no `styled()` | D54 | Depois |

## 11. Ainda não definido

Status do documento: **aprovado**. Não há lacunas: as perguntas das rodadas
anteriores foram respondidas nas D136 a D139.

### 11.1 Lacunas (viram pergunta ao Alan)

Nenhuma.

### 11.2 Propostas a aprovar

Nenhuma. O que era consequência por analogia (especificidade das classes novas,
`gap-N` como `gap.x` + `gap.y`, raio em quatro cantos, `AW102` para
`text-secondary`, `AW103` para `border-1`/`border-3`, valor livre em `leading` e
na borda por lado, papel de borda não chamado `x` ou `y`) foi aprovado na D139.
`place.main`, de `between` (R59), foi confirmado na D140, com a especificidade
de `center-x`/`center-y`.
