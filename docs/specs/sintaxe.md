# Spec: sintaxe do look

Status: **rascunho** (estrutura completa, mas "Ainda não definido" tem itens e
há propostas a aprovar; ver seção 11) · Decisões de origem: D7, D13, D15 a
D20, D23, D26 a D31, D33 a D38, D41 a D44, D49, D58, D59, D61 a D63, D66, D77,
D78, D82 a D89, D93 a D98, D100 a D106, D110

Gramática do `look`: tokens, variantes aninháveis, valor livre com `=`,
opacidade, atalhos, vocabulário da fase 1, regra de conflito e diagnósticos.

Convenção deste documento: **(proposta, a aprovar)** marca tudo o que não é
derivação direta de uma decisão registrada. Nada marcado assim vale até o Alan
aprovar. As propostas estão reunidas na seção 11.2.

## 1. Escopo

Cobre:
- O texto da string `look` (e a mesma gramática em `contentLook`, na função
  `look(...)` e no atributo `look` do HTML): como é quebrada em itens, quais
  itens existem e o que cada um significa em termos abstratos.
- O vocabulário de classes e variantes da **fase 1** (D77).
- A regra de conflito entre classes (D58) e a especificidade de cada família.
- Os diagnósticos da sintaxe (código `AW###`, posição, sugestão; D84).

Fica de fora (outras specs):
- Tradução para React Native ou CSS (`emissor-native.md`, `emissor-css.md`).
- Formato da IR e dos diagnósticos como tipos (`ir.md`). Esta spec define
  **quais** diagnósticos existem e **quando**; a seção "Formato exato dos
  diagnósticos" de `ir.md` deve referenciar a tabela da seção 6 daqui.
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
| **posição** | Intervalo `[início, fim)` no texto do `look`: deslocamentos de 0, em unidades UTF-16, `fim` exclusivo (proposta, a aprovar). |
| **diagnóstico** | Registro `{ código, posição, sugestão }` devolvido pela resolução (D84). |

## 3. Regras normativas

### 3.1 Geral

- **R1.** A gramática da seção 4 DEVE valer em todo lugar onde o `look`
  aparece: prop `look` dos componentes, prop `contentLook`, função `look(...)` e
  atributo `look` do HTML (D27, D41, D42). `className` e `class` NÃO DEVEM
  existir como forma alternativa (D27, D42).
- **R2.** Os nomes de classes e variantes DEVEM ser em inglês (D7) e em
  minúsculas. Uma classe com maiúscula (`Pad-4`) NÃO DEVE casar com nenhuma
  classe: gera `AW101` (proposta, a aprovar).
- **R3.** Os itens de um `look` DEVEM ser separados por um ou mais espaços.
  Tabulação e quebra de linha PODEM separar itens como se fossem espaço
  (proposta, a aprovar). Espaços antes do primeiro item, depois do último e
  dentro dos parênteses de uma variante PODEM existir e são ignorados (proposta,
  a aprovar).
- **R4.** Um `look` vazio, ou só com espaços, DEVE resultar em estilo vazio e
  nenhum diagnóstico (proposta, a aprovar).
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
  (D28; código: proposta, a aprovar).
- **R8.** Os nomes de variante da fase 1 são exatamente: `hover`, `press`,
  `focus`, `disabled`, `dark`, `light`, `ios`, `android`, `web`, `native`,
  `medium`, `expanded` (D18, D29, D33, D59, D61, D103). Qualquer outro nome
  seguido de `(` gera `AW004`.
- **R9.** `compact(...)` NÃO DEVE existir como variante: o que não tem variante
  vale para todos os tamanhos de tela (D61). Gera `AW004`.
- **R10.** `motion-safe(...)` está fora da fase 1 (D78) e, nesta fase, gera
  `AW004` com mensagem própria (proposta, a aprovar).
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
  DEVE ser aceita, nunca vale, e gera o aviso `AW202` (proposta, a aprovar).
- **R16.** O nome da variante DEVE vir seguido de `(` colado. Um nome de
  variante sozinho, sem parêntese, gera `AW005`.

### 3.3 Valor livre e opacidade

- **R17.** Valor fora da escala DEVE usar `=` (`w=137`, `pad=10`, `w=50%`).
  Colchetes e parênteses NÃO DEVEM ser usados para isso (D30).
- **R18.** O valor livre DEVE ser: número inteiro sem unidade (px na web, dp no
  nativo); número inteiro com `%`; cor em hex de 3, 6 ou 8 dígitos; ou tom da
  paleta `nome-tom`. NÃO DEVE aceitar `rem`, `em`, `vw` nem `vh` nesta fase
  (D105). Números decimais: ver "Ainda não definido".
- **R19.** O valor livre PODE ser negativo só onde fizer sentido (D105). Nesta
  fase só a família `margin` aceita (D89). Negativo em outra família gera
  `AW008` (proposta, a aprovar).
- **R20.** Margem negativa NÃO DEVE existir na escala: `margin-top--8` gera
  `AW104` com sugestão `margin-top=-8` (D89).
- **R21.** Famílias que aceitam `=`: `pad`, `margin`, `gap` (e suas formas com
  lado), `w`, `h`, `size`, `round`, `type`, a espessura de `border` e a cor de
  `bg`, `text` e `border` (proposta, a aprovar). Família que não aceita gera
  `AW009`.
- **R22.** Cor livre PODE ser hex (`bg=#e11d48`) ou tom da paleta (`bg=red-40`),
  maiúsculas e minúsculas nos dígitos hex (D33, D105; maiúsculas: proposta, a
  aprovar). O tom é inteiro de 0 a 100 (D33).
- **R23.** A opacidade em cor livre DEVE usar barra no fim do valor:
  `bg=red-40/50`, `bg=#e11d48/50` (D104). Os números válidos são os da escala
  de opacidade: 0, 25, 50, 75, 100 (D98; aplicação à barra: proposta, a
  aprovar). Barra em hex de 8 dígitos (`bg=#e11d4880/50`) gera `AW008`
  (proposta, a aprovar).
- **R24.** A barra NÃO DEVE existir em classe com papel: `bg-primary/50` gera
  `AW107` com sugestão `bg-primary-50` (D104).

### 3.4 Cor por papel

- **R25.** `bg-` é cor de fundo, `text-` é só cor do texto e `border-` é cor da
  borda quando o próximo segmento é um papel (D23, D95). O tamanho do texto usa
  `type-` (D23).
- **R26.** As classes DEVEM usar papéis, nunca a paleta: `bg-danger` existe,
  `bg-red-600` NÃO DEVE existir (D34). A paleta só entra pelo valor livre.
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

### 3.5 Lados, eixos e `center`

- **R31.** Espaçamento e borda DEVEM aceitar lados por extenso: `top`,
  `bottom`, `left`, `right` (`pad-top-2`, `margin-left-4`) (D87). `pad` e
  `margin` DEVEM aceitar também os eixos `x` (esquerda e direita) e `y` (topo
  e base) (D19, D58, D107).
- **R32.** `start` e `end` como lados NÃO DEVEM existir nesta fase (D87).
- **R33.** `margin` DEVE aceitar `auto` na escala (`margin-x-auto`). A
  extensão a todas as formas (`margin-auto`, `margin-top-auto`) é proposta,
  a aprovar (D89 fala em "e afins").
- **R34.** `center` DEVE centralizar nos dois eixos; `center-x` só na
  horizontal; `center-y` só na vertical. `center-x` e `center-y` se referem à
  tela, não à direção do layout (D38). A tradução para propriedades de layout
  com a direção final é do `core`, na IR (D85, `ir.md`).

### 3.6 Conflito entre classes (D58, D82)

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
- **R41.** Como classes com condições diferentes se combinam (`pad-x-2
  medium(pad-4)`, `bg-primary hover(bg-raised)`) não está decidido: ver
  "Ainda não definido". Até lá, a saída desta spec mantém cada item com o seu
  conjunto de condições e NÃO afirma qual vale quando ambos estão ativos.

### 3.7 Atalhos

- **R42.** Um atalho DEVE ser declarado no objeto `define` do
  `alanwind.config.ts`, dentro de `defineConfig` (D36, D63, D100). `define()`
  solto no código NÃO DEVE existir (D63).
- **R43.** O atalho `btn` DEVE valer como uma classe (D36): `btn` é um token.
  PODE ser usado dentro de variantes (`hover(btn)`) (proposta, a aprovar).
- **R44.** O conteúdo de um atalho DEVE seguir esta mesma gramática, inclusive
  variantes e outros atalhos (D101). Ciclo entre atalhos DEVE ser erro ao
  carregar o tema (`AW301`). O nome de um atalho NÃO DEVE coincidir com uma
  classe existente (`AW302`) (D101).
- **R45.** Um atalho DEVE expandir no lugar onde foi escrito, e o conflito
  (R36, R37) DEVE valer entre as classes expandidas e as vizinhas como se
  tivessem sido escritas ali (proposta, a aprovar).

### 3.8 Diagnósticos e sintaxe quebrada

- **R46.** A resolução DEVE devolver sempre o resultado **mais** a lista de
  diagnósticos (D84). O `core` NÃO DEVE saber se está em desenvolvimento ou
  produção: quem está na borda mostra em dev e ignora em produção (D84, D35).
- **R47.** Entrada inválida NÃO DEVE lançar exceção nem zerar o estilo. Só o
  trecho ruim DEVE ser descartado; o resto do `look` continua valendo (D88).
- **R48.** Todo diagnóstico DEVE ter código `AW###`, posição e, quando houver
  candidato, sugestão (D84). A lista é a da seção 6.
- **R49.** A lista de diagnósticos DEVE sair ordenada por início da posição
  e, em empate, por código (proposta, a aprovar).
- **R50.** **Trecho descartado** por erro de sintaxe (proposta, a aprovar):
  - parêntese não fechado: da variante (`nome(`) até o fim do `look`;
  - `)` sobrando: só o `)`;
  - variante vazia ou de nome desconhecido: a variante inteira, `nome(...)`,
    com o conteúdo;
  - classe inválida: só o token;
  - em variante com um token inválido, os outros itens dela continuam valendo.
- **R51.** Sugestão, quando houver, DEVE ser o candidato válido mais próximo
  por distância de edição de no máximo 2; em empate, o primeiro em ordem
  alfabética (proposta, a aprovar). Sem candidato, não há sugestão.
- **R52.** A tipagem estrita DEVE tornar classes e tokens inválidos erro de
  tipo, com autocomplete (D20, D66). Como a tipagem trata valor livre e
  variantes aninhadas: ver "Ainda não definido".

## 4. Gramática (EBNF)

A EBNF formaliza as decisões acima; não cria regra nova. Notação: `,`
concatena, `|` alterna, `[ ]` opcional, `{ }` repete zero ou mais vezes,
`( )` agrupa, `" "` é literal, `(* *)` é comentário.

### 4.1 Estrutura do `look`

```ebnf
look         = { ws } , [ item , { ws1 , item } ] , { ws } ;
ws1          = ws , { ws } ;
ws           = " " | "\t" | "\n" | "\r" ;

item         = variant | token ;

variant      = variant-name , "(" , look , ")" ;     (* D28, D86 *)
variant-name = word ;      (* conjunto fechado, seção 5.1 (R8) *)

token        = free-token | class ;

free-token   = family , "=" , free-value ;            (* D30 *)
family       = word ;      (* pad, pad-x, margin-top, w, bg, text... *)

free-value   = number-value | color-value ;           (* D105 *)
number-value = [ "-" ] , integer , [ "%" ] ;
color-value  = ( hex | tone ) , [ "/" , opacity ] ;   (* D104 *)
hex          = "#" , ( hexdigit , hexdigit , hexdigit
                     | hexdigit , hexdigit , hexdigit ,
                       hexdigit , hexdigit , hexdigit
                     | hexdigit , hexdigit , hexdigit ,
                       hexdigit , hexdigit , hexdigit ,
                       hexdigit , hexdigit ) ;
tone         = letter , { letter } , "-" , integer ;  (* red-40; 0 a 100 *)

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
  `)` (`hover(a)pad-4`) não é definido (ver "Ainda não definido").
- A gramática é só **léxica e estrutural**. Se `word` é uma classe existente,
  se o valor está na escala e se o papel existe é decisão do vocabulário
  (seção 5) e do tema; falhar nisso gera diagnóstico `AW1xx`, não erro de
  gramática.
- Um `word` imediatamente seguido de `(` é sempre nome de variante, nunca
  classe (R8).
- `tone` e `hex` são distinguidos pelo primeiro caractere (`#`).

### 4.2 Forma das classes por família

Segunda camada: o que `class` e `family` podem ser. Os nomes de papel vêm do
tema (R30).

```ebnf
class-form    = layout | spacing | size | color | border | typography
              | round | shadow | opacity-class | shortcut ;

layout        = "row" | "col" | "fill"
              | "center" | "center-x" | "center-y" ;        (* D18, D38 *)

region        = "x" | "y" | "top" | "bottom" | "left" | "right" ;   (* D87 *)
scale         = integer ;           (* semântica: 0 a 16 (D43) *)

spacing       = "pad"    , [ "-" , region ] , "-" , scale
              | "margin" , [ "-" , region ] , "-" , ( scale | "auto" )
              | "gap"    , "-" , scale ;                     (* D43, D89 *)

size          = ( "w" | "h" ) , "-" , ( scale | "full" | "screen" )
              | "size" , "-" , scale ;                       (* D98 *)

color         = ( "bg" | "text" | "border" ) , "-" , role ,
                [ "-" , opacity ] ;                (* D31, D34, D95 *)
role          = word ;      (* nomes do tema; não termina em número (D31) *)

border        = "border" , [ "-" , side ] , [ "-" , border-width ] ;
side          = "top" | "bottom" | "left" | "right" ;
border-width  = integer ;
              (* proposta, a aprovar: forma e escala, seção 5.6 *)

typography    = "type"    , "-" , type-size                  (* D49 *)
              | "weight"  , "-" , ( "regular" | "medium" | "bold" )
              | "leading" , "-" , ( "tight" | "normal" | "loose" )
              | "align"   , "-" , align-value
              | "font"    , "-" , font-value
              | "italic" | "underline" | "upper" | "lower"
              | "lines"   , "-" , integer ;                  (* D77, D98 *)
type-size     = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" ;
align-value   = "left" | "center" | "right" ;   (* rascunho, seção 11.1 *)
font-value    = "sans" | "serif" | "mono" ;     (* rascunho, seção 11.1 *)

round         = "round" , "-" , ( "none" | "sm" | "md" | "lg"
                                | "xl" | "full" ) ;            (* D44 *)
shadow        = "shadow" , "-" , ( "sm" | "md" | "lg" ) ;      (* D45 *)
opacity-class = "opacity" , "-" , opacity ;                    (* D98 *)
shortcut      = word ;      (* declarado em define (D100); não coincide com
                               nenhuma classe (D101) *)
```

Desambiguação de `border-`: se o segmento após `border` é um lado, uma espessura
(número) ou nada, é espessura; caso contrário, é papel de cor. Por isso um
papel de borda NÃO DEVE se chamar `top`, `bottom`, `left` ou `right`
(proposta, a aprovar).

## 5. Vocabulário da fase 1

A coluna "Significa" descreve o efeito abstrato, não a tradução RN ou CSS
(`emissor-native.md`, `emissor-css.md`). `N` é um inteiro da escala (0 a 16).
Onde a tabela diz "rascunho", o nome vem do rascunho da seção 11 da visão, sem
decisão própria; consta também em "Ainda não definido".

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
| `fill` | Ocupa o espaço restante no pai (significado do rascunho; confirmar) | D18 |
| `gap-N` | Espaço entre filhos, `N` × 4 | D43 |

### 5.3 Espaçamento (escala de 0 a 16, passos de 4, D43)

| Classe | Significa | D |
|---|---|---|
| `pad-N` | Espaço interno nos quatro lados | D43 |
| `pad-x-N` | Espaço interno à esquerda e à direita | D43, D58, D107 |
| `pad-y-N` | Espaço interno acima e abaixo | D43, D58, D107 |
| `pad-top-N`, `pad-bottom-N`, `pad-left-N`, `pad-right-N` | Espaço interno de um lado | D87 |
| `margin-N`, `margin-x-N`, `margin-y-N`, `margin-<lado>-N` | Espaço externo, mesmas formas de `pad` | D43, D87 |
| `margin-x-auto` | Margem automática à esquerda e à direita | D89 |
| `margin-auto`, `margin-y-auto`, `margin-<lado>-auto` | Mesma ideia nas outras formas (proposta, a aprovar) | D89 |
| `pad=V`, `pad-x=V`, `pad-top=V`, `margin=V`... | Valor livre (R17, R18) | D30, D105 |
| `margin-top=-8` | Margem negativa: só por valor livre | D89 |
| `gap=V` | Valor livre para `gap` (proposta, a aprovar, R21) | D30 |

Exemplos de escala: `pad-0` = 0, `pad-1` = 4, `pad-4` = 16, `pad-16` = 64.

### 5.4 Tamanho (D98)

| Classe | Significa | D |
|---|---|---|
| `w-N` | Largura, `N` × 4 (`w-10` = 40) | D98 |
| `h-N` | Altura, `N` × 4 | D98 |
| `size-N` | Largura e altura iguais, `N` × 4 | D98 |
| `w-full`, `h-full` | 100% da largura ou da altura do pai | D98 |
| `w-screen`, `h-screen` | Largura ou altura da tela | D98 |
| `w=V`, `h=V`, `size=V` | Valor livre: `w=137`, `w=50%` | D30, D98, D105 |

### 5.5 Cor por papel (D34, D95)

| Prefixo | Pinta | Papéis do tema padrão | D |
|---|---|---|---|
| `bg-` | Fundo | `page`, `surface`, `raised`; `primary`, `secondary`, `success`, `warning`, `danger`, `info`; variações `-soft` e `-hover` conforme o tema | D22, D24, D46 a D52, D91, D95 |
| `text-` | Texto | `strong`, `body`, `muted`, `subtle`, `link`; `on-<papel>`; `<papel>` colorido (`text-danger`) | D18, D47, D92, D95 |
| `border-` | Cor da borda | `subtle`, `strong`, `focus` | D95 |

Notas:
- `text-subtle` é só para desabilitado (D93); `text-muted` para apoio.
- Opacidade por sufixo: `bg-primary-50`, `text-strong-50` (R27). Combinada
  com variação: `bg-primary-hover-50` (o sufixo é o último segmento).
- Cor livre: `bg=red-40`, `bg=#e11d48`, `bg=red-40/50` (R22, R23); vale também
  em `text=` e `border=` (R21, proposta, a aprovar).
- `border-<papel colorido>` (`border-danger`): não decidido (ver "Ainda não
  definido").
- Que papéis aceitam `-soft`, `-hover` e `on-` é do tema (`tema.md`).

### 5.6 Borda

| Classe | Significa | D |
|---|---|---|
| `border-subtle`, `border-strong`, `border-focus` | Cor da borda | D95 |
| `border` | Espessura 1 nos quatro lados (rascunho; proposta, a aprovar) | D77 |
| `border-2` | Espessura 2 nos quatro lados (rascunho; proposta, a aprovar) | D77 |
| `border-top`, `border-bottom`, `border-left`, `border-right` | Espessura 1 de um lado (proposta, a aprovar) | D87 |
| `border-<lado>-2` | Espessura 2 de um lado (proposta, a aprovar) | D87 |

A cor da borda e a espessura são propriedades distintas (`border.color` e
`border.width.*`).

### 5.7 Tipografia

| Classe | Significa | D |
|---|---|---|
| `type-xs`, `type-sm`, `type-base`, `type-lg`, `type-xl`, `type-2xl`, `type-3xl` | Tamanho do texto (12, 14, 16, 18, 20, 24, 30) | D23, D49 |
| `weight-regular`, `weight-medium`, `weight-bold` | Peso (400, 500, 700) | D77, D98 |
| `leading-tight`, `leading-normal`, `leading-loose` | Altura de linha, multiplica o `type-*` (1.25, 1.5, 1.75) | D77, D98 |
| `align-left`, `align-center`, `align-right` | Alinhamento do texto (valores: rascunho) | D77 |
| `font-sans`, `font-serif`, `font-mono` | Família de fonte (valores: rascunho) | D77 |
| `italic` | Itálico | D77 |
| `underline` | Sublinhado | D77 |
| `upper` | Texto em maiúsculas | D77 |
| `lower` | Texto em minúsculas | D77 |
| `lines-N` | Limita o texto a `N` linhas; **vai para a parte de props da IR**, não de estilo; `N` inteiro maior ou igual a 1 (proposta, a aprovar) | D77, D83 |
| `type=V` | Valor livre de tamanho (proposta, a aprovar, R21) | D30 |

### 5.8 Raio, sombra e opacidade

| Classe | Significa | D |
|---|---|---|
| `round-none`, `round-sm`, `round-md`, `round-lg`, `round-xl` | Raio 0, 4, 8, 12, 16 | D44 |
| `round-full` | Totalmente redondo (9999) | D44, D98 |
| `shadow-sm`, `shadow-md`, `shadow-lg` | Elevação. No escuro eleva o fundo sozinho (D97) | D45, D96, D97 |
| `opacity-0`, `opacity-25`, `opacity-50`, `opacity-75`, `opacity-100` | Opacidade do elemento | D98 |
| `round=V` | Valor livre de raio (proposta, a aprovar, R21) | D30 |

### 5.9 Especificidade para a regra de conflito (D58)

A especificidade só compara classes que definem a **mesma propriedade** com o
**mesmo conjunto de condições**. Nível maior vence (R36). A tabela é derivada
da D58; as linhas marcadas são por analogia (proposta, a aprovar).

| Família | Nível 1 | Nível 2 | Nível 3 |
|---|---|---|---|
| Espaço interno | `pad` (4 lados) | `pad-x`, `pad-y` (2 lados) | `pad-top`, `pad-bottom`, `pad-left`, `pad-right` (1 lado) |
| Espaço externo | `margin` | `margin-x`, `margin-y` | `margin-top`, `margin-bottom`, `margin-left`, `margin-right` |
| Tamanho (proposta) | `size` (largura e altura) | `w`, `h` | — |
| Centralização (proposta) | `center` (eixos x e y) | `center-x`, `center-y` | — |
| Espessura da borda (proposta) | `border` (4 lados) | `border-<lado>` | — |
| Qualquer outra | Nível único: `gap`, `bg`, `text`, `border-<papel>`, `type`, `weight`, `leading`, `align`, `font`, `italic`, `underline`, `upper`/`lower`, `lines`, `round`, `shadow`, `opacity`, `row`/`col`, `fill` | — | — |

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

`direction`, `place.x`, `place.y`, `fill`, `gap`, `pad.top|bottom|left|right`,
`margin.top|bottom|left|right`, `width`, `height`, `bg`, `text`,
`border.color`, `border.width.top|bottom|left|right`, `type`, `weight`,
`leading`, `align`, `font`, `italic`, `underline`, `case`, `round`, `shadow`,
`opacity`. Na parte de props: `lines`.

## 6. Diagnósticos

Todos os códigos, textos e severidades abaixo são **(proposta, a aprovar)**,
inclusive a numeração. A decisão D84 fixa só: código `AW###`, posição e
sugestão.

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
| `AW008` | erro | Valor livre inválido: unidade (`rem`, `em`, `vw`, `vh`), texto, negativo fora de `margin`, hex com tamanho errado, opacidade fora da escala, barra com hex de 8 dígitos | `Valor {v} não é aceito em {família}.` | forma válida mais próxima | D104, D105 |
| `AW009` | erro | `=` em família que não aceita valor livre (`weight=600`) | `{família} não aceita valor livre.` | classe da escala mais próxima | D30 |
| `AW101` | erro | Classe desconhecida (`padd-4`, `Pad-4`, `pad_4`) | `Classe {x} não existe.` | classe mais próxima | D35, D88 |
| `AW102` | erro | Papel de cor inexistente (`bg-banana`) | `O papel {papel} não existe em {prefixo}-.` | papel mais próximo | D35 |
| `AW103` | erro | Valor fora da escala (`pad-17`, `type-4xl`, `opacity-30`, `bg-primary-30`) | `{valor} está fora da escala de {família}.` | valor da escala mais próximo ou o valor livre | D43, D98 |
| `AW104` | erro | Margem negativa na escala (`margin-top--8`) | `Margem negativa só por valor livre.` | `margin-top=-8` | D89 |
| `AW107` | erro | Barra em classe com papel (`bg-primary/50`) | `Opacidade em papel usa sufixo, não "/".` | `bg-primary-50` | D31, D104 |
| `AW201` | aviso | Classe descartada por empate de especificidade (R37) | `{descartada} é sobrescrita por {vencedora}.` | remover a descartada | D58 |
| `AW202` | aviso | Condições impossíveis juntas (R15) | `As condições {a} e {b} nunca valem juntas.` | remover uma | D86 |
| `AW301` | erro | Ciclo entre atalhos, ao carregar o tema | `Ciclo entre atalhos: {a} -> {b} -> {a}.` | — | D101 |
| `AW302` | erro | Nome de atalho igual a uma classe, ao carregar o tema | `O atalho {nome} coincide com uma classe.` | outro nome | D101 |
| `AW303` | erro | Papel criado terminando em número, ao carregar o tema | `Papel {nome} não pode terminar em número.` | `{nome}` sem o número | D31 |

Regras dos diagnósticos:
- Posição de erro de classe: o token inteiro (`pad-17` em `[0,6)`). De
  variante: do nome até o fim da variante (ou até o fim do `look` em `AW001`).
- Posição de `AW201`: o token **descartado**. De `AW202`: a variante mais
  interna.
- Posições são sempre relativas ao texto original do `look`, também dentro de
  variantes aninhadas.
- `AW301` a `AW303` pertencem ao carregamento do tema e referem-se ao texto da
  definição, não a um `look` (`tema.md`).
- O contraste (D32) não está na fase 1 (seção 10); seu código será proposto
  quando entrar.

## 7. Exemplos

Notação das saídas (proposta, a aprovar; só para esta spec, o formato real é o
da IR em `ir.md`):
- Uma saída é uma lista `[condições] propriedade=valor` separada por espaço.
  Sem prefixo, o item vale sempre. As condições são um conjunto, escritas em
  ordem alfabética (`[dark,hover]`).
- Ordem: primeiro os itens sem condição, depois por condições em ordem
  alfabética; dentro de cada grupo, por nome da propriedade.
- Escalas numéricas saem resolvidas (`pad-4` = 16); escalas nomeadas saem pelo
  nome (`type=lg`, `round=md`); cores saem como `role(nome)`, `hex(#...)` ou
  `tone(nome-tom)`, com `@N` para a opacidade.
- `props:` marca a parte de props; `diag:` lista diagnósticos como
  `AW###[início,fim)`, com a sugestão entre crases quando for parte do teste.
  Sem `diag:`, a lista é vazia.

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
| `margin-top=-8` | `margin.top=-8` |
| `gap-4` | `gap=16` |
| `row` | `direction=row` |
| `col` | `direction=col` |
| `center` | `place.x=center place.y=center` |
| `center-x` | `place.x=center` |
| `center-y` | `place.y=center` |
| `w-full` | `width=full` |
| `h-screen` | `height=screen` |
| `h-10` | `height=40` |
| `size-10` | `height=40 width=40` |
| `type-lg` | `type=lg` |
| `weight-bold` | `weight=bold` |
| `leading-tight` | `leading=tight` |
| `upper` | `case=upper` |
| `lines-2` | `props: lines=2` |
| `round-md` | `round=md` |
| `round-full` | `round=full` |
| `shadow-md` | `shadow=md` |
| `opacity-50` | `opacity=50` |

### 7.2 Valor livre e cor

| Entrada | Saída |
|---|---|
| `w=137` | `width=137` |
| `w=50%` | `width=50%` |
| `pad=10` | `pad.bottom=10 pad.left=10 pad.right=10 pad.top=10` |
| `pad-x=10` | `pad.left=10 pad.right=10` |
| `bg-primary` | `bg=role(primary)` |
| `bg-primary-hover` | `bg=role(primary-hover)` |
| `bg-primary-soft` | `bg=role(primary-soft)` |
| `bg-primary-50` | `bg=role(primary)@50` |
| `text-strong-50` | `text=role(strong)@50` |
| `text-on-primary` | `text=role(on-primary)` |
| `text-danger` | `text=role(danger)` |
| `border-subtle` | `border.color=role(subtle)` |
| `bg=red-40` | `bg=tone(red-40)` |
| `bg=red-40/50` | `bg=tone(red-40)@50` |
| `bg=#e11d48` | `bg=hex(#e11d48)` |
| `bg=#e11d48/50` | `bg=hex(#e11d48)@50` |
| `bg=#fff` | `bg=hex(#fff)` |
| `bg=#e11d4880` | `bg=hex(#e11d4880)` |
| `dark(bg=red-20)` | `[dark] bg=tone(red-20)` |

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
| `dark(light(bg-raised))` | `[dark,light] bg=role(raised)` e `diag: AW202[5,21)` |
| `ios(web(row))` | `[ios,web] direction=row` e `diag: AW202[4,12)` |

Nota: `col medium(row)` e `medium(pad-4) expanded(pad-8)` só mostram que os
itens ficam separados por condição. Qual vale quando várias condições estão
ativas ao mesmo tempo é "Ainda não definido" (11.1, item 1).

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
| `hover(bg-primary bg-surface)` | `[hover] bg=role(surface)` e `diag: AW201[6,16)` |
| `dark(hover(bg-raised)) hover(dark(bg-surface))` | `[dark,hover] bg=role(surface)` e `diag: AW201[11,20)` |
| `lines-2 lines-3` | `props: lines=3` e `diag: AW201[0,7)` |

Nota: em `center center-x`, `center-x` (nível 2) vence `center` (nível 1) em
`place.x`; como o valor é o mesmo, o resultado não muda e não há aviso, porque
os níveis são diferentes (proposta, a aprovar, seção 5.9).

### 7.5 Atalhos

Com `defineConfig({ define: { btn: 'bg-primary pad-4' } })`:

| Entrada | Saída |
|---|---|
| `btn` | `bg=role(primary) pad.bottom=16 pad.left=16 pad.right=16 pad.top=16` |
| `btn hover(bg-primary-hover)` | `bg=role(primary) pad.bottom=16 pad.left=16 pad.right=16 pad.top=16 [hover] bg=role(primary-hover)` |
| `btn pad-8` | `bg=role(primary) pad.bottom=32 pad.left=32 pad.right=32 pad.top=32` e `diag: AW201[0,3)` (R45, proposta) |

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
| `bg=red-40/30` | vazia e `diag: AW008[0,12)` |
| `weight=600` | vazia e `diag: AW009[0,10)` |
| `padd-4` | vazia e `diag: AW101[0,6)` com sugestão `pad-4` |
| `Pad-4` | vazia e `diag: AW101[0,5)` com sugestão `pad-4` |
| `bg-primry` | vazia e `diag: AW102[0,9)` com sugestão `bg-primary` |
| `bg-banana` | vazia e `diag: AW102[0,9)` sem sugestão |
| `pad-17` | vazia e `diag: AW103[0,6)` |
| `bg-primary-30` | vazia e `diag: AW103[0,13)` |
| `opacity-30` | vazia e `diag: AW103[0,10)` |
| `margin-top--8` | vazia e `diag: AW104[0,13)` com sugestão `margin-top=-8` |
| `bg-primary/50` | vazia e `diag: AW107[0,13)` com sugestão `bg-primary-50` |
| `foo bar` | vazia e `diag: AW101[0,3), AW101[4,7)` |
| `pad-4 hover(bg-banana pad-2) bg-primary` | `bg=role(primary) pad.bottom=16 pad.left=16 pad.right=16 pad.top=16 [hover] pad.bottom=8 pad.left=8 pad.right=8 pad.top=8` e `diag: AW102[12,21)` |
| `` (vazio) | vazia, sem diagnóstico |
| `   ` (só espaços) | vazia, sem diagnóstico |

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
| Mesmo item sob condições diferentes (`bg-primary hover(bg-raised)`) | Ficam os dois, cada um com as suas condições; sem `AW201` | R41 |
| `dark(dark(x))` | Aceito; condições repetidas valem como uma | R11 (proposta, a aprovar) |
| Atalho com nome de classe | Erro ao carregar o tema (`AW302`) | R44 |
| Ciclo entre atalhos | Erro ao carregar o tema (`AW301`) | R44 |
| `bg-red-600` | `AW102`: `red-600` não é papel | R26, R29 |
| Papel inexistente em produção | Ignorado, sem quebrar | R29, R46 |
| Cor livre sem `on-` | Aceita; o aviso de contraste é futuro | seção 10 |

## 9. Critérios de aceite

- O parser aceita todas as entradas válidas da seção 7 e devolve a saída
  exata da tabela, incluindo a ordem.
- Toda entrada da seção 7.6 devolve o resultado e os diagnósticos exatos da
  tabela (código e posição; sugestão onde indicada).
- Nenhuma entrada, por mais quebrada que seja, lança exceção nem zera o estilo
  dos trechos válidos (R47). Isto vale também para entradas geradas
  aleatoriamente (teste de propriedade).
- `dark(hover(x))` e `hover(dark(x))` produzem saídas idênticas para qualquer
  `x` válido (R11).
- Para toda classe de espaçamento, o resultado independe da ordem entre
  `pad`, `pad-x`/`pad-y` e `pad-<lado>` (R36), e `AW201` só aparece em empate
  total (R38).
- Há um teste de ouro por linha das tabelas da seção 7, no formato da skill
  `teste-de-ouro`. Linhas marcadas como proposta só viram teste depois de
  aprovadas.
- A resolução é determinística: mesma entrada gera a mesma saída e a mesma
  ordem de diagnósticos (R6, R49).
- Todo código `AW###` da seção 6 tem pelo menos um teste que o provoca.
- A gramática da seção 4 é aceita por um teste que gera entradas a partir dela
  e confere que o parser as lê sem diagnóstico de sintaxe (`AW00x`).
- A tipagem rejeita classes fora do vocabulário em tempo de compilação (R52),
  nos casos que a tipagem consegue cobrir (a definir, ver "Ainda não definido").

## 10. Fora da fase 1

| Item | Decisão | Quando |
|---|---|---|
| `motion-safe(...)` | D78, D18 | Fase de acessibilidade |
| Utilitários `tap-target` e `focus-ring` | D78 (a área de toque é do `Pressable`, D111) | Fase de acessibilidade |
| Faixa exata de tamanho de tela | D106; hoje se resolve com `medium(x) expanded(y)` (D37) | Depois |
| Lados `start` e `end` (idiomas da direita para a esquerda) | D87 | Depois |
| `rem`, `em`, `vw`, `vh` no valor livre | D105 | Depois |
| Aviso de contraste (cores livres incluídas) | D32; não marcado para a fase 1 (D66) | A atribuir na divisão em fases |
| Paleta customizável, interpolação e recálculo de `-soft`/`-hover`/`on-` | D99 | Fase de tema |
| Seções de tema além de `define` no `alanwind.config.ts` | D81 | Fase de tema |
| Arquitetura por presets | D90 | Se um dia houver segundo vocabulário |
| Look padrão no `styled()` | D54 | Depois |

## 11. Ainda não definido

Status do documento: **rascunho**. Enquanto 11.1 tiver itens, a spec não vai
para "em revisão". Aprovar as propostas de 11.2 também é necessário.

### 11.1 Lacunas (viram pergunta ao Alan)

1. **Classes com condições diferentes na mesma propriedade.** D58 só trata
   classes sob as mesmas condições. Falta decidir:
   - `bg-primary hover(bg-raised)`: com hover ativo, vale a variante
     (esperado, D59 dá `bg-primary hover(bg-primary-hover)` como exemplo)?
     Isso vale independentemente da ordem de escrita?
   - `pad-x-2 medium(pad-4)`: em `medium`, a especificidade da família
     (`pad-x`) vence a variante, ou a variante vence por ter mais condições?
   - `expanded(pad-8) medium(pad-4)` (ordem invertida) em `expanded`: vale o
     último escrito ou a faixa maior (D106 sugere "a maior")?
2. **Palavras de layout do rascunho sem decisão**: `between`, `start`, `end`,
   `wrap` (e o significado exato de `fill`). `start`/`end` também colidem
   com os lados da D87.
3. **Borda**: forma e escala da espessura (`border`, `border-2`, outros
   valores), `border-x`/`border-y`, cor por lado, e `border-<papel colorido>`
   (`border-danger`).
4. **Raio por canto ou por lado** (`round-top`) e `shadow-none`: existem?
5. **`size-full` e `size-screen`**, e `gap-x`/`gap-y`: existem?
6. **Valores de `align-*` e `font-*`**: D77 decide as famílias; os valores
   (`left|center|right`, `sans|serif|mono`) são só do rascunho da visão.
7. **Paleta na fase 1**: D99 manda a paleta para a fase de tema, mas D77 e D105
   incluem `bg=red-40` na fase 1. Quais nomes e tons de paleta existem no
   tema padrão da fase 1? (A gramática já aceita `nome-tom`.)
8. **Valor livre decimal** (`w=10.5`, `leading` fracionário).
9. **Item colado depois de `)`** (`hover(a)pad-4`): erro, ou lê os dois?
10. **Tipagem**: como o tipo trata valor livre (`w=137`) e variantes
    aninhadas: aceita qualquer `string` nesses casos, valida por template
    literal, ou só o diagnóstico em runtime?

### 11.2 Propostas a aprovar (já escritas no texto)

Cada uma está marcada no texto com "(proposta, a aprovar)":
- Posição `[início, fim)` em unidades UTF-16 (seção 2, seção 6).
- Todos os códigos `AW###`, mensagens, severidades e sugestões da seção 6.
- Tabulação e quebra de linha como separador; espaços dentro dos parênteses
  ignorados (R3); `look` vazio sem diagnóstico (R4).
- Maiúscula em classe é classe desconhecida (R2).
- `motion-safe` gera `AW004` na fase 1 (R10).
- Variantes com condições impossíveis: aceitas, nunca valem, `AW202` (R15).
- Lista de famílias que aceitam `=` (R21) e `AW009` para as demais.
- Negativo fora de `margin` é erro (R19).
- Hex em maiúsculas (R22); barra só com os números da escala de opacidade e
  recusada com hex de 8 dígitos (R23).
- `auto` em todas as formas de `margin` (R33, seção 5.3).
- Atalho dentro de variante e expansão no lugar (R43, R45).
- Ordem dos diagnósticos (R49), trecho descartado por tipo de erro (R50) e
  critério de sugestão por distância de edição até 2 (R51).
- Especificidade por analogia para `size`/`w`/`h`, `center`/`center-x` e
  espessura da borda (seção 5.9).
- Forma e escala da espessura de borda e `lines-N` com `N` maior ou igual a 1
  (seções 5.6 e 5.7).
- Papel de borda não pode se chamar `top`, `bottom`, `left` ou `right`
  (seção 4.2).
- Notação das saídas e ordem de listagem dos exemplos (seção 7).
