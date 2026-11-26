# Spec: tema

Status: **rascunho** (falta uma pergunta na seção 10) · Decisões de origem: D6,
D20, D22, D24, D25, D31 a D35, D43 a D52, D63, D64, D81, D91 a D102, D118,
D119, D127 a D134

Tema padrão da fase 1 (cores, escalas, sombras, fontes, breakpoints), contraste
do tema e formato do `alanwind.config.ts` com atalhos (`define`).

O status é `rascunho` porque a seção 10 ("Ainda não definido") ainda tem uma
pergunta para o Alan. Os valores abaixo são os decididos; onde a decisão não
existe, a seção 10 diz qual é a pergunta.

## 1. Escopo

Esta spec cobre, para a **fase 1**:

- os **valores finais** do tema padrão, em claro e escuro: fundos, textos,
  `primary`, `secondary`, estados, bordas, escalas, sombras, fontes e
  breakpoints;
- as **regras de contraste** do tema e o teste que as verifica;
- o **formato** do `alanwind.config.ts` na fase 1 (só atalhos) e como o app o
  carrega;
- o esquema de cor (segue o sistema; `setColorScheme`).

Fica **de fora** o que está na seção 2 ("Fora da fase 1"). A sintaxe das classes
(`sintaxe.md`) e a IR (`funcionamento-interno.md`) têm spec própria; esta spec
só diz quais **valores** o tema entrega a elas.

## 2. Fora da fase 1

Entra na fase de tema, não na fase 1 (D81, D99, D102, D118):

- **Paleta por tons** de 0 a 100, com tons-âncora definidos pela pessoa e
  tons intermediários calculados (D33, D34).
- **Algoritmo de interpolação** dos tons.
- **Recálculo** de `-soft`, `-hover` e `on-` quando a pessoa troca a cor de um
  papel (D35), e o recálculo do tom de `text-<papel>` para papéis criados por
  ela (D92).
- **Troca de papéis** e papéis novos no `alanwind.config.ts`; trocar escalas
  (espaçamento, raios, tipografia, fonte) e breakpoints.
- Qualquer chave de `defineConfig` além de `define` (D81).
- **Importar e exportar W3C Design Tokens** (D102). O tema é TypeScript puro.
- Valores livres de cor com tons da paleta (`bg=red-40`, D33, D105) dependem da
  paleta e, por isso, também ficam para a fase de tema: na fase 1, cor livre só
  em hex (D118).

Na fase 1, o tema padrão guarda **valores prontos**, inclusive os tons
automáticos de `text-<papel>` já calculados (D99).

## 3. Definições

| Termo | Significado |
|---|---|
| **Papel** | Nome de cor com valores para claro e escuro (`primary`, `warning`...) (D20). |
| **Papel colorido** | `primary`, `secondary`, `success`, `warning`, `danger`, `info`. Tem `-hover`, `-soft` e `on-` (D22, D24, D35). |
| **Fundos** | `bg-page` (app), `bg-surface` (cards), `bg-raised` (elevado). |
| **`on-<papel>`** | Cor de texto com contraste garantido sobre `bg-<papel>` (D18). |
| **`-hover`** | Variação do papel para elemento interativo, mesma ênfase (D24). |
| **`-soft`** | Fundo estático de baixa ênfase (D24). |
| **`text-on-<papel>-soft`** | Cor do texto usado sobre `bg-<papel>-soft` (D91, D131). |
| **`text-<papel>`** | Texto na cor do papel, com tom ajustado se a cor não passar 4,5:1 (D92). Não existe para o `secondary` (D129). |
| **Esquema** | `light` ou `dark`. O padrão segue o sistema (D25). |
| **Faixa de tela** | `compact`, `medium`, `expanded` (D29, D94). |
| **Par exigido** | Par fundo/texto cujo contraste é testado (seção 6). |

Cores são sempre `#RRGGBB` em maiúsculas. Razões de contraste usam a fórmula
WCAG 2 (skill `checar-contraste`).

## 4. Regras normativas

### 4.1 Modelo e esquema

- **R1.** O tema padrão DEVE ser completo: sem configurar nada, existem
  `primary`, `secondary`, `success`, `warning`, `danger`, `info`, fundos,
  textos e bordas, em claro e escuro (D6, D35).
- **R2.** Todo papel DEVE ter valor para claro e para escuro (D20).
- **R3.** O tema padrão DEVE seguir o esquema do sistema (D25).
- **R4.** `setColorScheme('light' | 'dark' | 'system')` DEVE forçar o esquema
  sem exigir Provider (D64).
- **R5.** Na fase 1, o tema padrão NÃO DEVE calcular tons nem interpolar: os
  valores das seções 5.1 a 5.7 são fixos e finais (D95, D99).
- **R6.** Nomes de papéis NÃO DEVEM terminar em número, para não colidir com a
  opacidade (`bg-primary-50`) (D31). Na fase 1 não há papéis criados pela
  pessoa; a regra vale quando eles existirem.

### 4.2 Cores

- **R7.** Os valores das tabelas 5.1 a 5.4 DEVEM ser exatamente os decididos
  (D50, D51, D46, D52, D91, D95, D128, D130). Alterar um valor exige decisão
  nova.
- **R8.** No `warning`, o texto sobre a cor forte DEVE ser escuro (`on-warning`
  `#3B2A00` nos dois esquemas) (D47, D91).
- **R9.** `text-<papel>` DEVE usar a cor do papel quando ela passa 4,5:1 sobre
  `page`, `surface` e `raised`; se não passar, DEVE usar o tom ajustado
  guardado na tabela 5.5 (D92, D99). Ex.: `text-warning` no claro é `#8A5A00`
  enquanto `bg-warning` continua `#F2B200`. A regra NÃO vale para o `secondary`:
  `text-secondary` NÃO DEVE existir (D129, R30).
- **R10.** `text-subtle` DEVE ser usado só para elementos desabilitados e está
  isento de contraste (D93, D128). A documentação DEVE avisar para não usá-lo em
  texto que a pessoa precisa ler e indicar `text-muted` para texto de apoio
  (D93). O aviso de contraste NÃO DEVE avaliar esse par (D128).
- **R11.** `border-subtle` é decorativa e está isenta de contraste (D95).
- **R12.** Os fundos do escuro DEVEM ser os cinza-grafite da tabela 5.1, para o
  `primary` ser o único destaque colorido (D46, D50, D52).
- **R30.** `text-secondary` NÃO DEVE existir: o `secondary` é neutro e a cor do
  papel não passa como texto (1,1 a 1,5:1). Para texto existem `text-body` e
  `text-muted`. `text-secondary` é classe desconhecida (D129).
- **R31.** O texto sobre um fundo `-soft` DEVE ser escrito
  `text-on-<papel>-soft` (`bg-danger-soft` pede `text-on-danger-soft`), com a
  cor das tabelas 5.2 e 5.3 (D91, D131).

### 4.3 Escalas e breakpoints

- **R13.** Espaçamento (`pad`, `margin`, `gap`) DEVE ser `0` a `16`, em passos
  de 4 px (D43). Tamanho (`w`, `h`, `size`) DEVE usar a mesma escala, mais
  `full` (100%) e `screen` (tela) (D98).
- **R14.** Raios, tipografia, peso, altura de linha e opacidade DEVEM ter os
  valores da seção 5.6 (D44, D49, D98). `round-full` DEVE valer 9999 (D98).
- **R15.** A fonte padrão DEVE ser a do sistema (D49). `font-sans`, `font-serif`
  e `font-mono` DEVEM mapear para as fontes da seção 5.10, sem baixar nenhuma
  fonte (D133).
- **R16.** Faixas de tela: `compact` abaixo de 600, `medium` a partir de 600,
  `expanded` a partir de 840 (D94).

### 4.4 Sombras

- **R17.** No claro, `shadow-sm`, `shadow-md` e `shadow-lg` DEVEM ter as camadas
  da tabela 5.7 (D96). No nativo, DEVEM sair como `boxShadow`, com as mesmas
  camadas (D108).
- **R18.** No escuro, `shadow-*` DEVE clarear o fundo do elemento um nível
  (`bg-page` para `bg-surface`, `bg-surface` para `bg-raised`), adicionar a
  borda fina de largura 1 e cor `#34343A` e uma sombra preta com os valores da
  tabela 5.7. As três classes clareiam o fundo no mesmo um nível: quem já está
  em `bg-raised` fica em `raised`; sem `bg-*`, o ponto de partida é `page`. Quem
  escreve só coloca `shadow-md` (D45, D97, D132).

### 4.5 Contraste

- **R19.** Todos os pares exigidos da seção 6 DEVEM passar em **4,5:1** (texto)
  ou **3:1** (`border-focus`, `border-strong`), em claro e escuro, usando a
  fórmula WCAG 2 (D32, seção 5 da visão).
- **R20.** O tema padrão NÃO DEVE ser publicado com um par exigido abaixo do
  mínimo. O teste da seção 9 (critério C1) DEVE falhar nesse caso.
- **R21.** Cor com alfa (`bg-primary-50`) NÃO tem contraste próprio; o teste
  NÃO DEVE avaliá-la sem o fundo de baixo (skill `checar-contraste`).

### 4.6 Configuração (`alanwind.config.ts`)

- **R22.** Na fase 1, o `alanwind.config.ts` DEVE aceitar só
  `defineConfig({ define: { ... } })` (D81, D100). Outra chave NÃO DEVE ser
  aceita (D81).
- **R23.** O valor de cada atalho DEVE ser uma string de classes, com variantes
  (`hover(...)`) permitidas (D101).
- **R24.** Um atalho PODE usar outros atalhos (D101) e PODE ser usado dentro de
  uma variante (`hover(btn)`), expandido no lugar (D127).
- **R25.** Ciclo entre atalhos (`a` usa `b` e `b` usa `a`, direta ou
  indiretamente) DEVE ser erro ao carregar o tema, com o código `AW301` (D101,
  D127).
- **R26.** O nome de um atalho NÃO DEVE coincidir com uma classe nativa do
  vocabulário nem com o nome de uma variante; DEVE ser erro de colisão ao
  carregar o tema, com o código `AW302` (D101, D127, D134).
- **R27.** Os atalhos DEVEM ficar só no `alanwind.config.ts`. NÃO DEVE existir
  `define()` solto no código (D63, D100).
- **R28.** Sem arquivo de configuração, DEVE valer o tema padrão (D35, D81).
- **R29.** Classe ou papel inexistente (ex.: `bg-banana`) DEVE gerar diagnóstico
  com sugestão, que a borda mostra em dev e ignora em produção, sem quebrar o
  app (D35, D84).
- **R32.** O nome de um atalho DEVE começar com letra minúscula e aceitar
  minúsculas, dígitos e hífen (`btn`, `card-title`, `btn-2`). Fora disso, é erro
  ao carregar o tema (D134). O código desse erro está na `sintaxe.md`
  (seção 11.1, item 1).
- **R33.** No React Native, `defineConfig` e `configure` DEVEM vir de
  `@alanwind/native` na fase 1. O app DEVE chamar `configure(config)` uma vez,
  no arquivo de entrada. Sem a chamada, os atalhos ficam desligados, com aviso
  em dev (D119, D15). Não há plugin de build nessa etapa.

## 5. Formato: valores do tema padrão

### 5.1 Fundos, textos e bordas neutras (D50, D51, D95, D128)

| Token | Claro | Escuro | Origem |
|---|---|---|---|
| `bg-page` | `#F6F6F8` | `#141416` | D50, D51 |
| `bg-surface` | `#FFFFFF` | `#1E1E22` | D50, D51 |
| `bg-raised` | `#FFFFFF` | `#28282D` | D50, D128 |
| `text-strong` | `#141416` | `#F2F2F4` | D50, D51 |
| `text-body` | `#3B3B42` | `#C9C9CF` | D50, D51 |
| `text-muted` | `#6B6B74` | `#8E8E96` | D50, D51 |
| `text-subtle` | `#A1A1AA` | `#5C5C64` | D93, D128 |
| `text-link` | `#1D4FD8` | `#8AB4FF` | D95 |
| `border-subtle` | `#E3E3E8` | `#34343A` | D95 |
| `border-strong` | `#8E8E96` | `#74747E` | D95 |
| `border-focus` | `#2563EB` | `#8AB4FF` | D95 |

`text-muted` é o "apoio" da D50 e da D51; `text-strong` é o "forte" e
`text-body` o "corpo". No claro, `bg-raised` é igual ao `bg-surface`: a elevação
vem da sombra (D51, D128). `text-subtle` é só para desabilitado e fica isento do
contraste de 4,5:1 (2,2 a 2,8:1; D93, D128).

### 5.2 `primary` e `secondary` (D46, D52, D95, D130)

Claro:

| Papel | `bg-<papel>` | `text-on-<papel>` | `-hover` | `-soft` | `text-on-<papel>-soft` |
|---|---|---|---|---|---|
| `primary` | `#2563EB` | `#FFFFFF` | `#1D4FD8` | `#E1EAFD` | `#1E3FA8` |
| `secondary` | `#E9E9EE` | `#25252B` | `#DCDCE2` | `#F1F1F4` | `#3B3B42` |

Escuro:

| Papel | `bg-<papel>` | `text-on-<papel>` | `-hover` | `-soft` | `text-on-<papel>-soft` |
|---|---|---|---|---|---|
| `primary` | `#8AB4FF` | `#0A1F4D` | `#A6C6FF` | `#14306B` | `#B3CCFF` |
| `secondary` | `#34343A` | `#F2F2F4` | `#3E3E45` | `#232328` | `#C9C9CF` |

No `secondary-hover`, o texto é o `text-on-secondary` do papel: `#25252B` no
claro e `#F2F2F4` no escuro (D130).

### 5.3 Estados (D91)

Claro:

| Papel | `bg-<papel>` | `text-on-<papel>` | `-hover` | `-soft` | `text-on-<papel>-soft` |
|---|---|---|---|---|---|
| `success` | `#15803D` | `#FFFFFF` | `#116932` | `#DCFCE7` | `#14532D` |
| `warning` | `#F2B200` | `#3B2A00` | `#D99F00` | `#FEF3C7` | `#713F12` |
| `danger` | `#D02424` | `#FFFFFF` | `#B91C1C` | `#FEE2E2` | `#991B1B` |
| `info` | `#0B63B6` | `#FFFFFF` | `#09529A` | `#E0EFFF` | `#0B4A8B` |

Escuro:

| Papel | `bg-<papel>` | `text-on-<papel>` | `-hover` | `-soft` | `text-on-<papel>-soft` |
|---|---|---|---|---|---|
| `success` | `#5FD68E` | `#052E16` | `#7CE2A4` | `#123A22` | `#A7F0C4` |
| `warning` | `#FFD166` | `#3B2A00` | `#FFDD8A` | `#3A2C06` | `#FDE68A` |
| `danger` | `#FF8A80` | `#450A0A` | `#FFA59D` | `#4A1515` | `#FECACA` |
| `info` | `#7CC4FF` | `#04203D` | `#9BD2FF` | `#0E2E4F` | `#B8DCFF` |

O `info` é um azul mais fechado que o `primary`, para um aviso não parecer
botão (D48, D91).

### 5.4 Hover no escuro

O `-hover` clareia no escuro e escurece no claro (D22, D24). Os valores são os
das tabelas 5.2 e 5.3; não há cálculo na fase 1 (D99).

### 5.5 `text-<papel>` com tom automático já calculado (D92, D99)

"Cor do papel" = `bg-<papel>` das tabelas 5.2 e 5.3. Cada célula é o valor
que `text-<papel>` DEVE ter (R9). O `secondary` não está na tabela:
`text-secondary` não existe (D129, R30).

| Papel | Claro | Escuro |
|---|---|---|
| `primary` | `#2563EB` (cor do papel) | `#8AB4FF` (cor do papel) |
| `success` | `#15803D` (cor do papel) | `#5FD68E` (cor do papel) |
| `warning` | `#8A5A00` (tom ajustado, D92) | `#FFD166` (cor do papel) |
| `danger` | `#D02424` (cor do papel) | `#FF8A80` (cor do papel) |
| `info` | `#0B63B6` (cor do papel) | `#7CC4FF` (cor do papel) |

A conferência numérica está na seção 6. Só o `warning` claro precisa de tom
ajustado entre os papéis que passam. Como `bg-raised` no claro é `#FFFFFF`,
igual ao `surface`, as conferências do claro em `raised` são as do `surface`.

### 5.6 Escalas (D43, D44, D49, D98)

| Escala | Classes e valores |
|---|---|
| Espaçamento (`pad`, `margin`, `gap`) | `0` a `16`, passos de 4 px: `pad-0` 0, `pad-1` 4, `pad-4` 16, `pad-16` 64 |
| Tamanho (`w`, `h`, `size`) | mesma escala (`h-10` = 40), mais `full` (100%) e `screen` (tela) |
| Raio | `round-none` 0, `round-sm` 4, `round-md` 8, `round-lg` 12, `round-xl` 16, `round-full` 9999 |
| Tipografia (`type-*`) | `xs` 12, `sm` 14, `base` 16, `lg` 18, `xl` 20, `2xl` 24, `3xl` 30 |
| Peso | `weight-regular` 400, `weight-medium` 500, `weight-bold` 700 |
| Altura de linha (multiplica o `type-*`) | `leading-tight` 1.25, `leading-normal` 1.5, `leading-loose` 1.75 |
| Opacidade do elemento e da cor | `0`, `25`, `50`, `75`, `100` |
| Fonte | a do sistema (D49); famílias na seção 5.10 |

Fora da escala, vale o valor livre com `=` (`w=137`, `w=50%`, `w=10.5`) (D98,
D125).

### 5.7 Sombras (D45, D96, D97, D108, D132)

Claro (cor preta com a opacidade indicada):

| Classe | Camadas |
|---|---|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.06)` |
| `shadow-md` | `0 4px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)` |
| `shadow-lg` | `0 12px 24px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)` |

Escuro (D97, D132):

| Parte | Valor |
|---|---|
| Fundo | um nível acima (`page` para `surface`, `surface` para `raised`); quem já está em `bg-raised` fica em `raised`; sem `bg-*`, parte de `page` |
| Borda fina | largura 1, cor `#34343A` |
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.30)` |
| `shadow-md` | `0 4px 8px rgba(0,0,0,0.35)` |
| `shadow-lg` | `0 12px 24px rgba(0,0,0,0.40)` |

As três classes clareiam o fundo no mesmo um nível; só a sombra muda. Os valores
do escuro são os da D132 tomados literalmente (uma camada por classe); se o
`md` e o `lg` do escuro mantêm também a segunda camada do claro, está em
"Ainda não definido" (P1).

### 5.8 Breakpoints (D94)

| Faixa | Largura |
|---|---|
| `compact` | abaixo de 600 |
| `medium` | a partir de 600 |
| `expanded` | a partir de 840 |

### 5.9 `alanwind.config.ts` na fase 1 (D81, D100, D101, D119, D134)

```ts
import { defineConfig } from '@alanwind/native'

export default defineConfig({
  define: {
    btn: 'bg-primary text-on-primary pad-4 round-md hover(bg-primary-hover)',
    card: 'bg-surface round-lg pad-4 shadow-md',
    'btn-wide': 'btn pad-x-6',
  },
})
```

- A única chave de `defineConfig` na fase 1 é `define`: um objeto de nome
  do atalho para string de classes.
- Depois de definido, `btn` vale como uma classe em qualquer `look` (D36).
- `defineConfig` e `configure` vêm de `@alanwind/native` na fase 1. O app chama
  `configure(config)` uma vez, no arquivo de entrada; sem a chamada, os atalhos
  ficam desligados, com aviso em dev (D119).
- Nome de atalho: letra minúscula primeiro, depois minúsculas, dígitos e hífen
  (D134).

### 5.10 Famílias de fonte do sistema (D133)

Nenhuma fonte é baixada. A classe escolhe a família; a fonte é a do sistema da
plataforma.

| Classe | iOS | Android | Web |
|---|---|---|---|
| `font-sans` | San Francisco | Roboto | pilha `system-ui` |
| `font-serif` | Georgia | `serif` | pilha Georgia/serif |
| `font-mono` | Menlo | `monospace` | pilha `ui-monospace` |

## 6. Contraste: tabela de pares exigidos

Calculado com a fórmula WCAG 2 (skill `checar-contraste`). ✅ passa o mínimo,
❌ não passa. Razões arredondadas a duas casas; o teste compara o valor sem
arredondar. Como `bg-raised` no claro é igual ao `surface` (D128), a coluna
"Claro raised" repete a do `surface`.

### 6.1 `on-<papel>`, `-hover` e `-soft` (mínimo 4,5)

| Par | Claro | Escuro |
|---|---|---|
| `primary` / `text-on-primary` | ✅ 5,17 | ✅ 7,64 |
| `primary-hover` / `text-on-primary` | ✅ 6,64 | ✅ 9,23 |
| `primary-soft` / `text-on-primary-soft` | ✅ 7,46 | ✅ 7,81 |
| `secondary` / `text-on-secondary` | ✅ 12,59 | ✅ 11,06 |
| `secondary-hover` / `text-on-secondary` | ✅ 11,16 | ✅ 9,49 |
| `secondary-soft` / `text-on-secondary-soft` | ✅ 9,86 | ✅ 9,49 |
| `success` / `text-on-success` | ✅ 5,02 | ✅ 8,16 |
| `success-hover` / `text-on-success` | ✅ 6,79 | ✅ 9,42 |
| `success-soft` / `text-on-success-soft` | ✅ 8,30 | ✅ 9,62 |
| `warning` / `text-on-warning` | ✅ 7,35 | ✅ 9,60 |
| `warning-hover` / `text-on-warning` | ✅ 5,87 | ✅ 10,52 |
| `warning-soft` / `text-on-warning-soft` | ✅ 7,79 | ✅ 10,93 |
| `danger` / `text-on-danger` | ✅ 5,30 | ✅ 7,07 |
| `danger-hover` / `text-on-danger` | ✅ 6,47 | ✅ 8,55 |
| `danger-soft` / `text-on-danger-soft` | ✅ 6,80 | ✅ 10,30 |
| `info` / `text-on-info` | ✅ 6,04 | ✅ 8,75 |
| `info-hover` / `text-on-info` | ✅ 7,82 | ✅ 10,21 |
| `info-soft` / `text-on-info-soft` | ✅ 7,59 | ✅ 9,67 |

### 6.2 `text-<papel>` sobre `page`, `surface`, `raised` (mínimo 4,5)

Com o tom da tabela 5.5. O `secondary` não aparece: `text-secondary` não existe
(D129). Para referência, a cor do papel `secondary` sobre os fundos dá 1,1 a
1,5:1, e é por isso que ela não é oferecida como texto.

| `text-<papel>` | Claro page | Claro surface | Claro raised | Escuro page | Escuro surface | Escuro raised |
|---|---|---|---|---|---|---|
| `primary` | ✅ 4,79 | ✅ 5,17 | ✅ 5,17 | ✅ 8,81 | ✅ 7,95 | ✅ 7,02 |
| `success` | ✅ 4,65 | ✅ 5,02 | ✅ 5,02 | ✅ 10,07 | ✅ 9,09 | ✅ 8,03 |
| `warning` | ✅ 5,49 | ✅ 5,93 | ✅ 5,93 | ✅ 12,76 | ✅ 11,52 | ✅ 10,17 |
| `danger` | ✅ 4,91 | ✅ 5,30 | ✅ 5,30 | ✅ 8,06 | ✅ 7,28 | ✅ 6,43 |
| `info` | ✅ 5,60 | ✅ 6,04 | ✅ 6,04 | ✅ 9,81 | ✅ 8,86 | ✅ 7,82 |

Para referência, `warning` claro com a cor do papel (`#F2B200`) daria 1,75 em
`page` e 1,88 em `surface` (❌), e é por isso que o tom `#8A5A00` existe (D92).

### 6.3 Textos neutros (mínimo 4,5)

| Texto | Claro page | Claro surface | Claro raised | Escuro page | Escuro surface | Escuro raised |
|---|---|---|---|---|---|---|
| `text-strong` | ✅ 17,05 | ✅ 18,40 | ✅ 18,40 | ✅ 16,46 | ✅ 14,86 | ✅ 13,12 |
| `text-body` | ✅ 10,29 | ✅ 11,11 | ✅ 11,11 | ✅ 11,16 | ✅ 10,08 | ✅ 8,90 |
| `text-muted` | ✅ 4,89 | ✅ 5,28 | ✅ 5,28 | ✅ 5,66 | ✅ 5,11 | ✅ 4,51 |
| `text-link` | ✅ 6,15 | ✅ 6,64 | ✅ 6,64 | ✅ 8,81 | ✅ 7,95 | ✅ 7,02 |
| `text-subtle` | isento (D93, D128) | isento | isento | isento | isento | isento |

`text-muted` no escuro sobre `bg-raised` passa por pouco (4,51, D95): qualquer
ajuste nessa cor ou em `bg-raised` DEVE refazer o teste. `text-subtle` fica fora
do teste (2,2 a 2,8:1, D128).

### 6.4 Bordas (mínimo 3)

| Borda | Claro page | Claro surface | Claro raised | Escuro page | Escuro surface | Escuro raised |
|---|---|---|---|---|---|---|
| `border-focus` | ✅ 4,79 | ✅ 5,17 | ✅ 5,17 | ✅ 8,81 | ✅ 7,95 | ✅ 7,02 |
| `border-strong` | ✅ 3,01 | ✅ 3,25 | ✅ 3,25 | ✅ 3,98 | ✅ 3,59 | ✅ 3,17 |
| `border-subtle` | isento (decorativa, D95) | | | | | |

`border-strong` está na tabela porque a D95 declara mínimo 3 para ela.

## 7. Exemplos (viram testes de ouro)

### 7.1 Valores do tema

| Entrada | Contexto | Saída |
|---|---|---|
| `bg-primary` | claro | `#2563EB` |
| `bg-primary` | escuro | `#8AB4FF` |
| `text-on-primary` | claro | `#FFFFFF` |
| `text-on-primary` | escuro | `#0A1F4D` |
| `bg-primary-hover` | claro | `#1D4FD8` |
| `bg-primary-hover` | escuro | `#A6C6FF` |
| `bg-secondary-hover` | claro | `#DCDCE2` |
| `bg-secondary-hover` | escuro | `#3E3E45` |
| `bg-secondary-soft` | claro | `#F1F1F4` |
| `bg-secondary-soft` | escuro | `#232328` |
| `text-on-secondary-soft` | claro | `#3B3B42` |
| `text-on-secondary-soft` | escuro | `#C9C9CF` |
| `bg-warning` | claro | `#F2B200` |
| `text-on-warning` | claro | `#3B2A00` |
| `text-warning` | claro | `#8A5A00` |
| `text-warning` | escuro | `#FFD166` |
| `text-danger` | claro | `#D02424` |
| `bg-danger-soft` | escuro | `#4A1515` |
| `text-on-danger-soft` | claro | `#991B1B` |
| `text-on-danger-soft` | escuro | `#FECACA` |
| `bg-page` | claro | `#F6F6F8` |
| `bg-page` | escuro | `#141416` |
| `bg-raised` | claro | `#FFFFFF` |
| `bg-raised` | escuro | `#28282D` |
| `text-body` | escuro | `#C9C9CF` |
| `text-subtle` | claro | `#A1A1AA` |
| `text-subtle` | escuro | `#5C5C64` |
| `border-focus` | claro | `#2563EB` |
| `border-strong` | escuro | `#74747E` |
| `text-secondary` | qualquer | classe desconhecida (D129) |

### 7.2 Escalas, breakpoints, sombras e fontes

| Entrada | Contexto | Saída |
|---|---|---|
| `pad-4` | — | 16 |
| `gap-16` | — | 64 |
| `h-10` | — | 40 |
| `round-md` | — | 8 |
| `round-full` | — | 9999 |
| `type-3xl` | — | 30 |
| `weight-medium` | — | 500 |
| `leading-loose` | `type-base` | linha 1.75 x 16 |
| `opacity-25` | — | 0.25 |
| `bg-primary-50` | claro | `#2563EB` com 50% de opacidade |
| largura 599 | — | faixa `compact` |
| largura 600 | — | faixa `medium` |
| largura 839 | — | faixa `medium` |
| largura 840 | — | faixa `expanded` |
| `shadow-sm` | claro | `0 1px 2px rgba(0,0,0,0.06)` |
| `shadow-md` | claro | `0 4px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)` |
| `shadow-lg` | claro | `0 12px 24px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)` |
| `shadow-md` em `bg-page` | escuro | fundo `#1E1E22`, borda 1 `#34343A`, sombra `0 4px 8px rgba(0,0,0,0.35)` |
| `shadow-md` em `bg-surface` | escuro | fundo `#28282D`, borda 1 `#34343A`, sombra `0 4px 8px rgba(0,0,0,0.35)` |
| `shadow-sm` em `bg-raised` | escuro | fundo `#28282D`, borda 1 `#34343A`, sombra `0 1px 2px rgba(0,0,0,0.30)` |
| `shadow-lg` sem `bg-*` | escuro | fundo `#1E1E22`, borda 1 `#34343A`, sombra `0 12px 24px rgba(0,0,0,0.40)` |
| `font-sans` | iOS | San Francisco |
| `font-sans` | Android | Roboto |
| `font-sans` | web | pilha `system-ui` |
| `font-serif` | iOS | Georgia |
| `font-serif` | Android | `serif` |
| `font-mono` | iOS | Menlo |
| `font-mono` | Android | `monospace` |
| `font-mono` | web | pilha `ui-monospace` |

### 7.3 Configuração

| Entrada (`alanwind.config.ts`) | Resultado |
|---|---|
| `defineConfig({ define: { btn: 'bg-primary pad-4' } })` | `btn` vale como `bg-primary pad-4` |
| `define: { btn: 'bg-primary hover(bg-primary-hover)' }` | válido (variante dentro de atalho) |
| `define: { a: 'pad-4', b: 'a round-md' }` | válido; `b` = `pad-4 round-md` |
| `define: { 'card-title': 'type-lg', 'btn-2': 'pad-4' }` | válido (letra minúscula, dígitos e hífen) |
| `define: { a: 'b', b: 'a' }` | erro `AW301` (ciclo) ao carregar o tema |
| `define: { a: 'a' }` | erro `AW301` (ciclo) ao carregar o tema |
| `define: { a: 'b pad-2', b: 'c', c: 'a' }` | erro `AW301` (ciclo indireto) |
| `define: { row: 'pad-4' }` | erro `AW302`: nome coincide com a classe `row` |
| `define: { 'pad-4': 'row' }` | erro `AW302`: nome coincide com a classe `pad-4` |
| `define: { hover: 'pad-4' }` | erro `AW302`: nome coincide com a variante `hover` |
| `define: { Btn: 'pad-4' }` | erro ao carregar o tema: nome começa com maiúscula (código na `sintaxe.md`, 11.1) |
| `defineConfig({})` ou sem arquivo | tema padrão, sem atalhos |
| `defineConfig({ palette: {...} })` | não aceito na fase 1 (R22) |
| app sem a chamada `configure(config)` | atalhos desligados, com aviso em dev (R33) |

## 8. Casos de borda e erros

- **Papel inexistente** (`bg-banana`): diagnóstico com sugestão (ex.: o papel
  mais próximo); dev mostra, produção ignora (D35, D84).
- **`text-secondary`**: classe desconhecida; o `secondary` não oferece texto
  colorido (D129).
- **Atalho com ciclo**: erro ao carregar o tema; nenhum estilo é gerado com o
  atalho em ciclo (D101).
- **Atalho com nome igual a classe ou a variante**: erro ao carregar o tema
  (D101, D134).
- **Atalho com nome fora do formato** (maiúscula, começa com dígito ou hífen):
  erro ao carregar o tema (D134).
- **Atalho com classe inexistente dentro**: o atalho é aceito; a classe ruim é
  tratada pela regra de sintaxe quebrada, que ignora só o trecho ruim (D88).
- **Opacidade sobre papel** (`bg-primary-50`): sem contraste próprio (R21).
- **Largura exatamente 600 ou 840**: `medium` e `expanded` respectivamente
  (D94).
- **`text-warning` no claro**: usa `#8A5A00`, nunca `#F2B200` (R9).
- **`text-subtle`**: sem exigência de contraste; texto de apoio DEVE usar
  `text-muted` (D93, D128).
- **`bg-raised` no claro**: igual ao `surface`, `#FFFFFF`; a elevação vem da
  sombra (D128).
- **`shadow-*` num elemento já em `bg-raised`, no escuro**: o fundo fica em
  `raised`; o sombreamento e a borda se mantêm (D132).
- **`configure` não chamado no RN**: atalhos desligados, com aviso em dev
  (D119).

## 9. Critérios de aceite

- **C1. Teste de contraste do tema.** Um teste (Vitest, no `core`) percorre
  todos os pares exigidos da seção 6, em claro e escuro, calcula a razão com a
  fórmula WCAG 2 sem arredondar e falha se algum par ficar abaixo de 4,5
  (textos) ou 3 (`border-focus`, `border-strong`). Pares `text-subtle` e
  `border-subtle` ficam fora. Enquanto houver ❌ na tabela, o teste falha.
- **C2.** O teste do C1 DEVE cobrir `-hover` com o `on-` do mesmo papel nos dois
  esquemas (é o par que mais arrisca quebrar no escuro, D22), inclusive
  `secondary-hover` e `secondary-soft` (D130).
- **C3.** Teste de ouro dos valores: cada linha da seção 7.1 produz a saída
  indicada.
- **C4.** Teste de ouro das escalas, breakpoints, sombras e fontes da seção 7.2.
- **C5.** Teste de `text-<papel>`: para cada papel (exceto `secondary`) e
  esquema, `text-<papel>` é a cor da tabela 5.5; `text-secondary` é classe
  desconhecida (D129).
- **C6.** Teste do config: cada linha da seção 7.3 produz o resultado indicado
  (inclusive os três casos de ciclo, os três de colisão de nome e o de nome fora
  do formato).
- **C7.** Sem arquivo de configuração, o tema padrão é carregado e todos os
  papéis das seções 5.1 a 5.3 existem nos dois esquemas.
- **C8.** `setColorScheme('dark')` muda os valores resolvidos sem Provider.
- **C9.** Nenhum valor das tabelas 5.1 a 5.8 e 5.10 difere do registrado nas
  decisões citadas (conferência manual do revisor).

## 10. Ainda não definido

Perguntas para o Alan. Cada resposta vira decisão (`registrar-decisao`) antes de
entrar na spec. As perguntas P1 a P9 do rascunho anterior foram respondidas nas
D119 e D127 a D134.

- **P1. Segunda camada das sombras do escuro.** A D132 lista, para o escuro,
  uma camada por classe (`shadow-sm` 0 1px 2px a 30%; `shadow-md` 0 4px 8px a
  35%; `shadow-lg` 0 12px 24px a 40%) e diz "com as camadas do claro e mais
  opacidade". No claro, `shadow-md` e `shadow-lg` têm duas camadas (a segunda é
  `0 1px 2px` a 6% no `md` e `0 4px 8px` a 6% no `lg`). No escuro, o `md` e o
  `lg` mantêm só a camada listada, ou também a segunda do claro? Se mantêm, com
  que opacidade? A mesma pergunta está na seção 8, item 1, de
  `funcionamento-interno.md`.
