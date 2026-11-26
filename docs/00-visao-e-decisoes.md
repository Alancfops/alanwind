# alanwind: visão e decisões (documento vivo)

Última atualização: 2026-11-25 · Status: **fase de conversa, antes de specs,
ADRs e agentes**

Este documento registra a ideia e o que já foi decidido. Separa com clareza o
que o Alan **decidiu** do que foi **proposto e ainda precisa de confirmação**.
Ele serve também como ponto de partida quando o Alan continuar o trabalho no
Claude Code (skills, agentes e orquestração), depois que o escopo estiver
fechado.

Materiais de apoio: ideias de outras libs em `01-referencias-e-ideias.md`;
comparação de sintaxe com Tailwind para compartilhar com um amigo, em um doc
separado (https://claude.ai/artifact/B56dibQGS9wticzyqFsoHD). Esse doc de
comparação foi escrito antes das decisões D25 a D31 e usa `class` e variantes
com dois-pontos em alguns trechos; o Alan decidiu deixá-lo como está por
enquanto.

---

## 1. Origem e motivação

- O Alan tem um projeto em React Native que usa **NativeWind** (o Tailwind do
  React Native). Se o NativeWind parar de ser mantido, o app para.
- Um amigo (rigoroso em front-end) sugeriu criar o alanwind, para ter uma camada
  de estilos própria, que o próprio Alan usaria. Esse amigo concorda que **não
  ficar igual ao Tailwind é o melhor caminho**.
- O projeto também serve para **treinar arquitetura, infra e orquestração de
  agentes**: specs, ADRs, CI, múltiplos agentes com papéis diferentes.
- A intenção é **uso real**, não só estudo. A ideia é original, no formato de
  lib/extensão como Tailwind ou Bootstrap, para evitar escrever CSS puro.
- O Alan **não pretende trocar o NativeWind de imediato** (ver D39).
- *Correção (2026-11-25, D80):* o app do Alan usado na validação, o
  **ShadowPlatinum**, hoje usa `StyleSheet.create` e Expo SDK 54; o NativeWind
  já tinha sido removido dele. A motivação (ter uma camada de estilos própria e
  independente) continua a mesma.

## 2. Tese e posicionamento

> *A styling layer for web and React Native, from one theme and one syntax of
> its own: accessible by default, good-looking without configuration, and fully
> under your control.*

Pontos centrais:
- **Independência**: você controla a camada de estilos.
- **Acessibilidade por padrão** (diferencial principal).
- **Bonito sem configurar** (tema padrão bem desenhado), com atenção especial ao
  **tema escuro**.
- **Web e mobile** com o mesmo tema e a mesma sintaxe.
- **Sintaxe com identidade própria**, prática e fácil de aprender. Nas palavras
  do Alan: sem identidade própria, nem faz sentido criar o alanwind. Analogia
  que orienta: **Ruby e Python** se parecem no jeito de escrever e funcionar,
  mas a sintaxe é diferente.

**Posicionamento (D21)**: o alanwind **não compete em "ser Tailwind"**, até
porque já existem outros que fazem isso. Ele é uma **alternativa com seus
próprios diferenciais**.

## 3. Decisões tomadas pelo Alan

| # | Decisão |
|---|---------|
| D1 | Uso real, com ideia original. Formato de lib/extensão, na linha de Tailwind e Bootstrap. |
| D2 | O desenvolvimento será feito **com agentes**, para treinar arquitetura, infra e orquestração. Antes dos agentes: specs, ADRs e documentação. |
| D3 | Linguagem: **TypeScript**. *Motivo (2026-11-25): tipagem estrita e autocomplete, que permitem tratar classes e tokens inválidos como erro de tipo (D20, D66).* |
| D4 | Primeiras entregas: **plugin de build (Vite/PostCSS)** e **CDN** (para web). *Ajuste (D55): a CDN deixa de ser "CSS pré-gerado" e passa a ser um script que lê o `look`.* |
| D5 | Diferencial **A, acessibilidade e boas práticas por padrão**, aprovado. |
| D6 | Diferencial **C, bonito sem configurar** (tema padrão cuidadoso), considerado interessante. |
| D7 | Nomes de classes **em inglês** (não em português). |
| D8 | **Web e mobile** desde a concepção. O alanwind não será só mobile. |
| D9 | Terá um **site de documentação** com modelos/templates prontos e guias de como usar e como conectar ao projeto, nos moldes de Tailwind e Bootstrap. |
| D10 | Ainda sem escrever visão formal, ADRs ou specs: seguir conversando para definir mais coisas antes. |
| D11 | Estilo do site e da marca: **minimalista e direto, mas bonito**. |
| D12 | *Ajuste (D121): o nome alanwind passou a ser definitivo.* **Nome: alanwind, mantido como nome de trabalho (provisório).** Pode ser revisto antes de publicar. |
| D13 | **Sintaxe própria.** Pode lembrar o Tailwind em espírito, mas com gramática e vocabulário próprios, para ter identidade. |
| D14 | **Alvo de referência: Expo SDK 58** (versão mais atual que o Alan usa no projeto). |
| D15 | **React Native resolve as classes em runtime** (com cache). Build fica como otimização futura. |
| D16 | **Princípio da sintaxe**: prática como o Tailwind, funcional e **fácil de aprender para quem escreve à mão**. |
| D17 | **Sintaxe em meio-termo aprovada**: base prática e fácil de pegar (`propriedade-valor` com hífen), puxada para uma **identidade própria** do alanwind. A identidade é requisito, não detalhe. |
| D18 | **Fontes de identidade aprovadas**: (1) cores por **papel semântico** (`bg-primary`, `bg-surface`, `text-muted`), com pares de contraste garantido (`bg-primary text-on-primary`); (2) **utilitários de acessibilidade prontos** (`tap-target`, `focus-ring`, `motion-safe(...)`); (3) **vocabulário de palavras inteiras e legíveis** (`pad-4`, `round-lg`, `row`, `center`, `fill`); (4) **agrupamento de variantes** (`hover(bg-surface-2 shadow-md)`); (5) **variantes de plataforma** (`ios(...)`, `android(...)`, `web(...)`). Regra de ouro: uma só forma óbvia de escrever cada coisa. **Observações (verificadas na pesquisa):** o agrupamento de variantes já existe no UnoCSS, e variantes de plataforma já existem no NativeWind, no Uniwind e em outras libs. Os itens 4 e 5 são, portanto, ergonomia, e não diferenciais isolados. |
| D19 | **Regra de abreviação**: abrevia-se **só o que é universal e curto** (`w`, `h`, `x`, `y`); o resto fica por extenso (`pad`, `margin`, `round`, `gap`). Motivo do Alan: assim a sintaxe não fica idêntica à do Tailwind. Um amigo do Alan, rigoroso em front-end, gostou de `pad` em vez de `p`. |
| D20 | **Ideias de outras libs aprovadas** (detalhes em `01-referencias-e-ideias.md`): **zero dependências de runtime**; **tokens semânticos com modo claro/escuro embutido**; **tipagem estrita** (classes e tokens inválidos viram erro ou aviso, com autocomplete). **MCP do alanwind**: aprovado, mas **só será aplicado quando o alanwind estiver funcionando corretamente**. *Motivo da regra de zero dependências (2026-11-25): **independência**, a mesma motivação do projeto: não depender de bibliotecas de terceiros que podem parar de ser mantidas.* |
| D21 | **Posicionamento**: o alanwind **não compete em ser Tailwind**; é uma **alternativa com seus próprios diferenciais** (independência, acessibilidade por padrão, sintaxe própria, web e mobile num só vocabulário). |
| D22 | **Cores**: o Alan gosta de **cores escuras**. Os papéis de cor terão **versões suaves (`-soft`)** e **estados embutidos (`-hover`)**, de modo que o efeito de passar o mouse **clareie no tema escuro** (e escureça no claro) sem quem usa precisar pensar nisso. |
| D23 | **`type-` confirmado** como prefixo de tamanho de texto (`type-lg`). `text-` fica só para cor do texto. |
| D24 | **Separação entre `-hover` e `-soft`**: `-hover` é um **estado** de elemento interativo, com a mesma ênfase, um pouco mais claro no escuro ou mais escuro no claro (ex.: botão primário). `-soft` é um **fundo de baixa ênfase estático**, usado em avisos, selos, etiquetas, destaques e item selecionado, e **não precisa ser botão**. Os dois podem se combinar em elementos interativos, como `hover(bg-primary-soft)` num botão fantasma ou item de lista. |
| D25 | **Tema padrão segue o sistema** do usuário (claro/escuro), com o **tema escuro muito bem cuidado** (é o tema "de vitrine", usado no site de documentação). |
| D26 | **API principal no React Native: componentes do alanwind**, com a função de resolução por baixo (disponível para quem precisar) e um helper `styled()` para componentes de terceiros. Os mesmos componentes funcionam na web via react-native-web. Os componentes são o lugar de colocar a **acessibilidade por padrão** (por exemplo, `Pressable` com papel de botão e área mínima de toque). *Atualização: a frase anterior sobre usar `class` no HTML foi substituída pela D42 (`look` em todo lugar).* |
| D27 | **Nome da prop de estilo: `look`** (em vez de `className`, "muito Tailwind"). Ex.: `<Box look="row center gap-4 pad-4">`. A função de resolução pode seguir o mesmo nome (`look('pad-4 bg-surface')`). |
| D28 | **Variantes só com parêntese, uma única forma**: `hover(bg-raised shadow-md)`, `ios(pad-6)`, `medium(row)`. Não existe a forma com dois-pontos (`hover:bg-x`). |
| D29 | **Breakpoints: `compact`, `medium`, `expanded`** (inspirados nas classes de tamanho de janela do Material Design), usados como variantes: `medium(row)`. |
| D30 | **Valor livre (fora da escala) com sinal de igual**: `w=137`, `pad=10`, `w=50%`. Não usa colchetes nem parêntese (evita conflito com as variantes). |
| D31 | **Opacidade (alfa) na cor com sufixo numérico**: `bg-primary-50`, `text-strong-50`. Argumento do Alan: como o número fica junto do resto do nome, não há confusão com valor negativo, e é mais curto e prático. Regra de proteção: **nomes de papéis de cor criados pela pessoa não podem terminar em número**, para não colidir com a opacidade. |
| D32 | **Aviso de contraste (funcionalidade futura, aprovada)**: em desenvolvimento, o alanwind **avisa quando o fundo e o texto declarados no mesmo `look` não passam no contraste (AA, 4,5:1)**. Cobre especialmente as cores livres (`bg=red-96`), que não têm o par `on-` garantido. O Alan confirmou que o aviso vale para esse caso. |
| D33 | **Modelo de cores em duas camadas, confirmado.** (1) **Paleta base** no arquivo de tema: tons de **0 a 100** (0 = preto, 100 = branco), em que a pessoa define só alguns tons-âncora e os intermediários são calculados. (2) **Papéis** que apontam para um tom da paleta, com um valor para o claro e outro para o escuro. Três caminhos de uso: **papel pronto** (`bg-danger`), **trocar a cor do papel** no tema (muda em todo o projeto) e **valor livre sem papel** (`bg=red-96` para um tom da paleta, `bg=#e11d48` para cor exata, com tom diferente no escuro por `dark(bg=red-20)`). |
| D34 | **A paleta base não é usada direto nas classes**: não existe `bg-red-600` (estilo Tailwind). A paleta só alimenta os papéis e os valores livres com `=`. Motivo: empurrar para os papéis, manter a identidade, evitar conflito com a opacidade numérica (D31) e preservar a garantia de contraste. |
| D35 | **Tema padrão completo e soma com a configuração da pessoa.** Sem configurar nada, `danger`, `primary`, `secondary`, `success`, `warning`, `info`, fundos, textos e bordas já existem, com claro, escuro, `-soft`, `-hover` e o par `on-` (reforça D6). Configurar um papel **substitui só aquele papel**, e os demais continuam do padrão; os estados `-soft`, `-hover` e `on-` dele são **recalculados** a partir da cor nova, e o aviso de contraste (D32) sinaliza se algum par não passar. Papel inexistente (ex.: `bg-banana`): **aviso ou erro em desenvolvimento, com sugestão** (pela tipagem estrita, D20), e **ignorado em produção** sem quebrar o app. |
| D36 | *Formato atualizado pela D100.* **Atalhos definidos pelo usuário (o equivalente ao `@apply` do Tailwind) com `define`**: `define('btn', 'bg-primary pad-4 round-md')`, e depois `btn` vale como uma classe. |
| D37 | **Variantes de tamanho valem "a partir de" (mobile-first)**: `medium(row)` vale em `medium` **e acima** (`expanded`), como no CSS e no Tailwind. Ex.: `col medium(row)` fica em coluna no celular e em linha no tablet e no computador. Faixa exata fica como exceção, com forma própria a definir depois, se for preciso. |
| D38 | **Três formas de `center`**: `center` centraliza nos **dois eixos**; `center-x` só na **horizontal**; `center-y` só na **vertical**. `center-x` e `center-y` valem sempre para a **tela** (horizontal e vertical), e **não** para a direção do layout, então funcionam igual em `row` e em `col` (evita a confusão do "eixo principal" do CSS). |
| D39 | **Escopo do projeto**: implementar **tudo o que foi conversado, aos poucos (em fases)**. Quando isso estiver terminado, o Alan **para**, e o que surgir depois são **ideias futuras e correção de bugs**. O Alan **não pretende trocar o NativeWind de imediato**. |
| D40 | **Lista de componentes**: `Box`, `Text`, `Pressable`, `Image`, `ScrollView`, `TextInput`, `FlatList`, `Modal`, `Switch` e `SafeArea`. O que vier depois disso é **adicional**. |
| D41 | **`contentLook` e `styled()`**: componentes com uma segunda área de estilo (`ScrollView`, `FlatList` e parecidos) aceitam a prop **`contentLook`** para o `contentContainerStyle`. O `look` mexe no `style` principal. Componentes de terceiros entram por `styled(Componente)`, e depois se usa `<Componente look="..." />`. |
| D42 | **`look` em todo lugar, inclusive no HTML puro**: `<Box look="...">` no React Native e no React na web, e `<div look="...">` no HTML puro. No HTML puro, o plugin de build (ou um script pequeno da CDN) lê o atributo `look`, gera o CSS e liga ao elemento. Não existe `class` como segunda forma (reforça "uma só forma", D18). Custo conhecido: `look` não é atributo padrão do HTML (navegadores ignoram, mas validadores podem reclamar). O Alan acha que quase ninguém usa HTML puro hoje, mas pediu para **manter o suporte** mesmo assim, como caso de menor prioridade. |
| D43 | **Escala de espaçamento: de `pad-0` até `pad-16`**, em passos de 4 (`pad-1` = 4 px, `pad-4` = 16 px, `pad-16` = 64 px). Vale para a família de espaçamento (`pad`, `margin`, `gap`). |
| D44 | **Raios**: `round-none` = 0, `round-sm` = 4, `round-md` = 8, `round-lg` = 12, `round-xl` = 16, `round-full` = totalmente redondo (pílula ou círculo). |
| D45 | *Ajuste (D108): no nativo, as sombras usam `boxShadow`.* **Sombras com tratamento próprio por tema**: `shadow-sm`, `shadow-md` e `shadow-lg`. No **tema claro**, sombra de verdade (mais suave no `sm`, mais forte no `lg`). No **tema escuro**, onde sombra escura some no fundo escuro, a elevação aparece por um **fundo um pouco mais claro que o da base (`bg-raised`) mais uma borda fina**, com sombra bem discreta. Cada emissor traduz (`box-shadow` na web; iOS e Android no nativo). |
| D46 | **`primary` vibrante, em azul elétrico** (opção C da comparação). Valores ilustrativos: claro `#2563EB` com texto branco; escuro `#8AB4FF` com texto escuro `#0A1F4D`; `-soft` claro `#E1EAFD` (texto `#1E3FA8`) e escuro `#14306B` (texto `#B3CCFF`). Os **fundos do tema escuro são neutros e escuros**, para o `primary` ser o destaque. Valores finais saem do tema padrão. |
| D47 | **Cores de semáforo = papéis de estado**: `success` (verde), `warning` (amarelo) e `danger` (vermelho), mais o `info`. Cada um segue o modelo de papéis (claro/escuro, `-soft`, `-hover`, par `on-`). **No `warning` (amarelo), o texto sobre a cor forte é escuro**, não branco, porque branco sobre amarelo não passa em 4,5:1; o `text-on-warning` é escolhido automaticamente. |
| D48 | **`info` em azul** (o Alan escolheu o azul, e não o ciano que foi sugerido). Como o `primary` também é azul, a versão `-soft` do `info` e o botão `primary` ficam da mesma família; para evitar que um aviso pareça um botão, a ideia associada é que **avisos `info` tragam um ícone** (ver seção 4). |
| D49 | **Tipografia do tema padrão**: tamanhos `type-xs` 12, `type-sm` 14, `type-base` 16, `type-lg` 18, `type-xl` 20, `type-2xl` 24, `type-3xl` 30. **Fonte padrão: a do próprio sistema** (zero dependências, sem baixar fonte), com troca possível no tema. |
| D50 | **Fundo do tema escuro: cinza-grafite** (opção B). O Alan notou que é o que a maioria dos temas escuros mostra hoje. Valores ilustrativos: página `#141416`, card (`bg-surface`) `#1E1E22`, elevado (`bg-raised`) `#28282D`, borda `#34343A`, textos `#F2F2F4` (forte), `#C9C9CF` (corpo), `#8E8E96` (apoio). |
| D51 | **Fundos do tema claro, derivados do escuro** (o Alan respondeu "a mesmo" à pergunta que juntava `secondary` e fundos claros; registrado como aceito, e dá para rever). Valores ilustrativos: página `#F6F6F8`, card branco `#FFFFFF`, borda `#E3E3E8`, textos `#141416` (forte), `#3B3B42` (corpo), `#6B6B74` (apoio). A elevação no claro vem da **sombra** (D45). |
| D52 | **`secondary` neutro** (opção A). É a ação de menor peso (ex.: "Cancelar" ao lado de "Continuar") e deixa o `primary` como único destaque colorido. Valores ilustrativos: claro `#E9E9EE` com texto `#25252B`; escuro `#34343A` com texto `#F2F2F4`. Quem quiser um `secondary` colorido troca no tema. |
| D53 | **Comportamento do `styled()`**: (1) **o `style` vence o `look`** quando os dois conflitam (o `look` é a base, o `style` escrito à mão é mais específico); (2) componentes com mais de uma área de estilo usam um **mapa de props** no `styled()`, por exemplo `styled(Lista, { contentContainerStyle: 'contentLook' })`; (3) variantes de estado (`hover`, pressionado) em componentes de terceiros só funcionam se o componente informar o estado, senão são **ignoradas com aviso em desenvolvimento**; (4) os tipos do componente original e o `ref` são preservados. |
| D54 | **Look padrão no `styled()` (extra, para depois)**: `styled(Botao, 'round-md pad-4')` definiria um visual de base que o `look` de quem usa soma por cima. O Alan achou a ideia **bacana** e quer que fique anotada, mas ela entra **como extra**, numa fase posterior. |
| D55 | **CDN = script; plugin de build = produção.** Um CSS pré-gerado sozinho **não consegue ler o `look`** (o `hover(bg-raised shadow-md)` tem espaço e parênteses). Por isso a CDN é um **script pequeno** que lê os atributos `look` da página, gera o CSS no navegador e liga aos elementos (parecido com o "Play CDN" do Tailwind), indicado para **testar e para páginas simples**. Para **produção**, o caminho é o plugin de build, que gera só o CSS usado antes de publicar. O script deve ficar no `<head>` para evitar o "pisca" do visual. Isso ajusta a D4. |
| D56 | **Instalação também por comando (npm)**, além da CDN, e **não só para quem usa React**: `npm install alanwind` serve para qualquer projeto com bundler. Os **componentes** (`Box`, `Text`, etc.) são para React e React Native. Outros frameworks (Vue, Svelte, Astro) ou HTML com Vite usam o **atributo `look`** com o **plugin de build**. Sem npm, vale a CDN (D55). |
| D57 | **Herança de texto por contexto.** No React Native, a cor e o tamanho do texto não passam do pai para o `<Text>` filho. Por isso `Box` e `Pressable` **repassam por contexto** as classes de texto (`text-*`, `type-*`, `weight-*` e afins) aos `Text` de dentro. Assim `<Pressable look="bg-danger text-on-danger"><Text>Ok</Text></Pressable>` funciona igual na web e no RN, e o par `bg-x text-on-x` vale no elemento pai. O `look` do próprio `Text` vence o herdado. |
| D58 | **Regra de conflito entre classes do mesmo `look`**: (1) a **mais específica vence a genérica** (`pad-x-2` vence `pad-4` no eixo x; `pad-top` vence `pad-y`, que vence `pad`); (2) entre classes de mesma especificidade, **vence a última escrita** (`bg-primary bg-surface` resulta em `bg-surface`); (3) em desenvolvimento, **aviso** quando duas classes de mesma especificidade disputam a mesma propriedade. Os dois emissores (CSS e RN) seguem a mesma regra. |
| D59 | **`hover(...)` e `press(...)` separados.** `hover(...)` vale **só onde existe ponteiro** (mouse ou trackpad, na web e em dispositivos com ponteiro) e é ignorado no toque. `press(...)` vale para o **elemento pressionado** em todas as plataformas (`:active` na web, estado `pressed` no RN). Corrige a ideia anterior de `hover` virar pressionado no celular. Ex.: `bg-primary hover(bg-primary-hover) press(bg-primary-hover)`. |
| D60 | **Fase 1 começa pelo React Native**: parser + representação intermediária (IR) + **emissor RN** + componentes `Box`, `Text` e `Pressable` + tema padrão. Validação com uso real: uma tela do app do Alan rodando com o alanwind ao lado do NativeWind. O **emissor de CSS vem logo depois**. Substitui a proposta de ordem "CSS primeiro" da seção 4. *Ajuste (D80): a validação passa a ser numa cópia do ShadowPlatinum, trocando `StyleSheet` por alanwind.* |
| D61 | **`compact(...)` removido.** Como as variantes de tela valem "a partir de" (D37), o que é escrito sem variante já vale para todos os tamanhos, inclusive o menor. As variantes de tela são só **`medium(...)` e `expanded(...)`**. O nome `compact` continua existindo como nome da faixa (na doc e no tema), mas não como variante. Ajusta a D29. |
| D62 | **`Box` é sempre flex em coluna**, na web e no React Native. `row` muda para linha. Assim o mesmo `look` produz o mesmo layout nas duas plataformas, e `center-x`/`center-y` (D38) têm tradução previsível. |
| D63 | **Atalhos (`define`, D36) ficam no arquivo de tema**, numa seção própria do `alanwind.config.ts`. Build, runtime e autocomplete leem do mesmo lugar. Não existe `define()` solto no código. |
| D64 | **Forçar o tema sem provider.** Além de seguir o sistema (D25), o alanwind oferece uma função para escolher o esquema, no formato `setColorScheme('light' \| 'dark' \| 'system')`, que funciona **sem envolver o app num Provider**. |
| D65 | **No HTML puro, o plugin de build reescreve o `look`** por uma classe gerada (ex.: `class="aw-x7f2"`) no HTML final, e o CSS usa essa classe. Funciona com qualquer variante agrupada (`hover(bg-raised shadow-md)`). No código-fonte continua existindo só o `look` (D42). O script da CDN (D55) faz o equivalente no navegador. |
| D66 | **Tipagem estrita entra na fase 1**, junto com o núcleo da D60: autocomplete e erro de tipo para classes e tokens inválidos desde o início (D20). Aviso de contraste, utilitários de acessibilidade e tema customizável **não** foram marcados para a fase 1 e serão distribuídos na divisão em fases. |
| D67 | **Monorepo com `packages/` e `apps/`.** Libs publicáveis ficam em `packages/` (`core`, `native`, `css`, `vite-plugin`, `cdn`, `cli`). O que roda e não é publicado fica em `apps/` (`playground-expo` para testar no RN, `site` para a documentação). Estrutura completa na seção 14. |
| D68 | **Nomes no npm: `alanwind` + `@alanwind/*`.** O pacote `alanwind` é a porta de entrada (D56) e reexporta o principal; os pacotes internos são publicados com escopo (`@alanwind/core`, `@alanwind/native`, `@alanwind/vite-plugin`…). O nome continua provisório (D12), então a disponibilidade no npm precisa ser conferida antes de publicar. |
| D69 | *Ajuste (D114): componentes RN são testados com Jest (`jest-expo`).* **Ferramentas de desenvolvimento**: pnpm workspaces, Turborepo (cache de build e testes), Vitest (testes), tsup (geração dos pacotes) e Biome (lint e formatação). São só ferramentas de desenvolvimento; a regra de zero dependências de runtime (D20) continua valendo para os pacotes publicados. |
| D70 | **Organização de `docs/`**: este arquivo (`00-visao-e-decisoes.md`) vira o índice da visão; `01-referencias-e-ideias.md` guarda as referências; `02-fases.md` guarda a divisão em fases; ADRs numerados em `docs/adr/` (`0001-typescript-monorepo.md`…); specs em `docs/specs/` (`sintaxe.md`, `tema.md`, `componentes.md`…). |
| D71 | **Time inicial de agentes, por função**: planejador (desde o início), implementador, QA, revisor e documentador. Sem divisão em "backend"/"frontend": o alanwind é uma biblioteca, e o agente de frontend só entra na fase 5 (site). Detalhes na seção 7. |
| D72 | **Skills**: as do projeto são montadas pelo Claude sob pedido do Alan, uma por vez, com explicação. Skills de código e de commit são do próprio Alan. Candidatas na seção 7. |
| D73 | **Fluxo de git**: duas skills do Alan, `conventional-commits` e `fluxo-de-branches` (em `.claude/skills/`). Commits em Conventional Commits, com tipo e escopo em inglês e descrição em português. Branches `main` (releases com tag), `develop` (integração) e `feature/`, `fix/`, `docs/`, `hotfix/` etc. PR para a branch de origem, corpo em português, **squash merge** feito pelo Alan. **Sem nenhuma atribuição ao Claude** em commits e PRs. |
| D74 | **Qualidade de código**: skill do Alan `codigo-limpo` (em `.claude/skills/`). Clean Code e Clean Architecture com pragmatismo: `core` é o domínio puro e sem API de plataforma; emissores são adaptadores; componentes, plugin, CDN e CLI são a borda; dependências apontam sempre para o `core`, e a IR é o contrato entre as camadas. Sem redundância (uma fonte da verdade, regra de três), sem código morto e sem arquivos mortos (Knip no CI). Identificadores e comentários do código em inglês; documentação em português. Confirma a proposta de regras de dependência da seção 14. |
| D75 | **Skills do alanwind são a fonte principal; skills externas são consulta e validação.** Agentes e tarefas seguem as skills de `.claude/skills/` do projeto. Skills instaladas globalmente (ex.: do pacote *superpowers*: `writing-plans`, `test-driven-development`, `requesting-code-review`, `brainstorming`) servem como **referência** ao montar as do projeto e como **validação** (segunda checagem), nunca como substitutas. Em conflito, vale a skill do alanwind. |
| D76 | **Agentes criados em `.claude/agents/`**: `planejador`, `implementador`, `qa`, `revisor` e `documentador`, cada um com as skills do projeto ligadas e os plugins externos (*superpowers*, *code-review*) como consulta e validação (D75). Tarefas do planejador ficam em `docs/tarefas/fase-N/`. Subagentes não falam com o Alan; devolvem perguntas no relatório, e a sessão principal orquestra. O `CLAUDE.md` da raiz resume convenções, skills, agentes e o fluxo de uma tarefa. |
| D77 | **Vocabulário da fase 1**: layout, espaçamento, cores por papel, `type-*`, borda, raio e sombra, **mais** tamanho (`w`, `h`, `size`), valor livre com `=` (D30), tipografia completa (`weight-*`, `leading-*`, `align-*`, `font-*`, `italic`/`underline`/`upper`/`lower`, `lines-N`) e atalhos com `define` (D36, D63). |
| D78 | **Acessibilidade na fase 1**: só a área mínima de toque, **embutida no `Pressable`** (D26), sem utilitário `tap-target` separado nesta fase. `motion-safe(...)` fica para a fase de acessibilidade. |
| D79 | **Fachada `alanwind` fica para depois** (fase 2, quando houver mais de um pacote para reexportar). Na fase 1, o app importa direto de `@alanwind/native`. |
| D80 | **Validação da fase 1 no ShadowPlatinum** (github.com/Alancfops/ShadowPlatinum): o repositório é **copiado** para `~/myProjects/`, a cópia é **atualizada para o Expo SDK 58** (alvo da D14) e o `StyleSheet.create` é trocado pelo alanwind. O app original não é alterado. Ajusta a D60, que falava em comparar com o NativeWind. |
| D81 | **Arquivo de tema na fase 1 só com atalhos**: `alanwind.config.ts` existe na fase 1 apenas para os atalhos (`define`, D63). Trocar papéis, paleta e escalas (D35) continua para a fase de tema. |
| D82 | **Regra de conflito aplicada no `core`, uma vez só.** O `core` resolve as disputas da D58 e entrega aos emissores uma IR já sem conflitos. Os emissores não reimplementam a regra, então ficam iguais por construção. |
| D83 | **A IR separa estilo de props.** Classes que viram prop do componente, e não estilo (ex.: `lines-2` → `numberOfLines`), vão numa parte própria da IR. O `core` continua sendo a fonte única do que cada classe faz; o emissor só traduz. |
| D84 | **Diagnósticos devolvidos pelo `core`; a borda decide.** A resolução sempre devolve o resultado **mais** uma lista de diagnósticos (código `AW###`, posição, sugestão). O `core` não sabe se está em desenvolvimento ou produção: quem está na borda (`native`, plugin, CDN) mostra os avisos em dev e os ignora em produção (D35). Preserva a pureza do `core` (D15). |
| D85 | **`center-x`/`center-y` traduzidos no `core` com a direção final.** O `core` conhece a direção (`row`/`col`, inclusive sob condições como `medium(row)`) e converte `center-x`/`center-y` nas propriedades flex certas para cada condição. Os emissores recebem propriedades flex comuns, sem lógica de eixo duplicada. |
| D86 | **Variantes podem ser aninhadas, em qualquer ordem.** `dark(hover(bg-raised))` e `hover(dark(bg-raised))` são equivalentes: as condições se somam (E lógico). |
| D87 | **Lados com `top`, `bottom`, `left` e `right`** no espaçamento e na borda (`pad-top-2`, `margin-left-4`), coerente com palavras inteiras (D18). Suporte a idiomas da direita para a esquerda (`start`/`end`) fica para depois. |
| D88 | **Sintaxe quebrada: ignora só o trecho ruim.** Em `pad-4 hover(bg-raised`, o `pad-4` continua valendo e só o trecho malformado é descartado; em dev, diagnóstico com posição (D84). O app nunca perde todo o estilo por um erro. |
| D89 | **Margem `auto` na escala; negativa só com valor livre.** `margin-x-auto` existe. Margem negativa só por `=` (`margin-top=-8`), porque é caso raro e um `-` na escala confundiria com o hífen da sintaxe. |
| D90 | **Arquitetura por presets adiada.** Não entra na fase 1: o vocabulário fica direto no `core`, como fonte única. Se um dia houver um segundo vocabulário, ele vira preset. Coerente com não criar abstração para o futuro (D74). |
| D91 | **Cores de estado do tema padrão aprovadas.** Claro (cor / on / soft / texto do soft / hover): `success` #15803D / #FFFFFF / #DCFCE7 / #14532D / #116932; `warning` #F2B200 / #3B2A00 / #FEF3C7 / #713F12 / #D99F00; `danger` #D02424 / #FFFFFF / #FEE2E2 / #991B1B / #B91C1C; `info` #0B63B6 / #FFFFFF / #E0EFFF / #0B4A8B / #09529A. Escuro: `success` #5FD68E / #052E16 / #123A22 / #A7F0C4 / #7CE2A4; `warning` #FFD166 / #3B2A00 / #3A2C06 / #FDE68A / #FFDD8A; `danger` #FF8A80 / #450A0A / #4A1515 / #FECACA / #FFA59D; `info` #7CC4FF / #04203D / #0E2E4F / #B8DCFF / #9BD2FF. Todos os pares (cor/on, hover/on, soft/texto) passam 4,5:1; o menor é 5,02 (`success` claro). O `info` é um azul mais fechado que o `primary`, para não parecer botão (D48). |
| D92 | *Ajuste (D129): não vale para o `secondary`; `text-secondary` não existe.* **`text-<papel>` com tom automático.** `text-<papel>` usa a cor do papel quando ela passa 4,5:1 sobre os fundos (`page`, `surface`, `raised`); se não passa, o alanwind escolhe um tom mais escuro (claro) ou mais claro (escuro) da mesma cor. Vale para papéis criados pela pessoa (D35). Ex.: `text-warning` no claro vira #8A5A00 (5,49:1), enquanto `bg-warning` continua #F2B200. |
| D93 | **`text-subtle` só para elementos desabilitados**, que o WCAG isenta de contraste. A documentação avisa para não usar em texto que a pessoa precisa ler; para texto de apoio, use `text-muted`. |
| D94 | **Breakpoints: `medium` a partir de 600 e `expanded` a partir de 840** (valores do Material Design, de onde vieram os nomes, D29). Abaixo de 600 é a faixa `compact`. |
| D95 | **Cores neutras e de marca finais.** Os valores ilustrativos de `primary` (D46), `secondary` (D52), fundos e textos (D50, D51) passam a ser finais. Novos: `text-link` claro #1D4FD8 / escuro #8AB4FF (6,15 / 7,02); `border-focus` #2563EB / #8AB4FF (4,79 / 7,02, mínimo 3); `border-strong` #8E8E96 / #74747E (3,01 / 3,17, mínimo 3); `border-subtle` #E3E3E8 / #34343A (decorativa); `primary-hover` #1D4FD8 / #A6C6FF (6,64 / 9,23 com o `on-`). `text-muted` no escuro sobre `bg-raised` passa justo (4,51). |
| D96 | **Sombras do tema claro, suaves e em camadas**: `shadow-sm` = 0 1px 2px a 6%; `shadow-md` = 0 4px 8px a 8% + 0 1px 2px a 6%; `shadow-lg` = 0 12px 24px a 12% + 0 4px 8px a 6% (cor preta com a opacidade indicada). |
| D97 | **No escuro, `shadow-*` eleva o fundo sozinho**: clareia o fundo do elemento um nível (`bg-page` → `bg-surface` → `bg-raised`), adiciona a borda fina #34343A e uma sombra bem discreta. Quem escreve só coloca `shadow-md`. Detalha a D45. |
| D98 | **Escalas restantes do tema padrão.** Tamanho (`w`, `h`, `size`): mesma escala do espaçamento, passos de 4, de 0 a 16 (`h-10` = 40), mais `w-full`/`h-full` (100%) e `w-screen`/`h-screen` (tela); fora da escala, valor livre (`w=137`, `w=50%`). Peso: `weight-regular` 400, `weight-medium` 500, `weight-bold` 700. Altura de linha (multiplica o `type-*`): `leading-tight` 1.25, `leading-normal` 1.5, `leading-loose` 1.75. Opacidade do elemento: `opacity-0`, `-25`, `-50`, `-75`, `-100`; a opacidade da cor (D31) usa os mesmos números. `round-full` = 9999. |
| D99 | **Algoritmo da paleta só na fase de tema.** Na fase 1, o tema padrão guarda os valores prontos (D91, D95), inclusive os tons automáticos de `text-<papel>` (D92), já calculados. Paleta por tons, interpolação e recálculo de `-soft`/`-hover`/`on-` (D33, D35) entram junto com o tema customizável. |
| D100 | **Formato dos atalhos**: objeto `define` dentro de `defineConfig` no `alanwind.config.ts`. Ex.: `export default defineConfig({ define: { btn: 'bg-primary text-on-primary pad-4 round-md' } })`. Substitui a forma de chamada `define('btn', ...)` usada como exemplo na D36. |
| D101 | **Conteúdo dos atalhos**: podem ter variantes (`hover(...)`) e usar outros atalhos. Ciclo entre atalhos (`a` usa `b`, `b` usa `a`) é erro ao carregar o tema. O nome de um atalho não pode coincidir com uma classe existente. |
| D102 | **Formato W3C Design Tokens adiado.** O tema fica em TypeScript puro; importar e exportar no formato W3C pode vir com o theme builder do site. |
| D103 | **Variantes `focus(...)`, `disabled(...)`, `light(...)` e `native(...)` confirmadas.** `focus` = elemento com foco (teclado ou leitor de tela); `disabled` = elemento desabilitado; `light` = exceção só no tema claro (par do `dark`); `native` = iOS e Android juntos (oposto de `web`). |
| D104 | **Opacidade em cor livre com barra**: `bg=red-40/50`, `bg=#e11d48/50`. A barra só existe no valor livre; nos papéis continua o sufixo (`bg-primary-50`, D31). Resolve a ambiguidade entre tom e opacidade. |
| D105 | *Ajuste (D118): tons da paleta (`red-40`) só na fase de tema; na fase 1, só hex.* **O que vale no valor livre (`=`)**: número sem unidade = px na web e dp no nativo (`w=137`); negativo onde fizer sentido (`margin-top=-8`, D89); porcentagem (`w=50%`); cores em hex de 3, 6 ou 8 dígitos e tons da paleta (`red-40`), com opacidade por barra (D104). Sem `rem`, `em`, `vw`, `vh` nesta fase. |
| D106 | **Faixa exata de tamanho de tela adiada.** Fora da fase 1; o caso se resolve com `medium(x) expanded(y)`, que desfaz no tamanho maior (D37). |
| D107 | **Classes de eixo expandidas em lados explícitos.** No emissor RN, `pad-x-4` vira `paddingLeft` + `paddingRight` e `margin-y-2` vira `marginTop` + `marginBottom`, sem `paddingHorizontal`/`paddingVertical`. Bate com os lados da D87, com a saída do emissor CSS e com a regra de conflito (D58). |
| D108 | *Ajuste (D155): o `boxShadow` sai como lista de objetos.* **Sombras no nativo com `boxShadow`** (RN 0.76+, nova arquitetura, padrão no SDK 58): mesma sintaxe do CSS, igual no iOS e no Android, com as camadas da D96. Ajusta a D45, que falava em `shadow*` no iOS e `elevation` no Android. |
| D109 | **Cache da resolução: faixa de tela + limite LRU.** A chave usa a faixa (`compact`/`medium`/`expanded`, D94), não a largura exata, mais o esquema de cor, a plataforma e o tema. Guarda as últimas ~500 combinações e descarta as mais antigas. |
| D110 | **Ponteiro detectado pelo evento de hover.** `hover(...)` vale enquanto o componente recebe o evento de hover (`onHoverIn`/`onHoverOut`), que só acontece com mouse ou trackpad (web, iPad com trackpad, Android com mouse). Sem ponteiro, o evento nunca vem e o `hover` nunca vale (D59). |
| D111 | **Área mínima de toque por plataforma, com `hitSlop`.** O `Pressable` garante 44 no iOS e na web (Apple e WCAG) e 48 no Android (Material), aumentando a área de toque com `hitSlop`, sem mudar o visual. Detalha a D78. |
| D112 | **Visual padrão do `Text`: `text-body` + `type-base`.** Sem cor ou tamanho herdado ou escrito, o `Text` usa a cor de corpo do tema (muda sozinha no escuro) e 16. Bonito sem configurar (D6). |
| D113 | **Herança de texto em cascata, como no CSS.** Um `Box` interno repassa o que herdou, somado ao que declara. A classe de texto mais próxima vence **por propriedade** (a cor do filho vence a do pai, mas o tamanho do pai continua). Só o `look` é herdado; o `style` escrito à mão não. Detalha a D57. |
| D114 | **Testes: Vitest no `core` e nos emissores, Jest nos componentes.** O pacote `native`, com componentes, usa `jest-expo` + `@testing-library/react-native`, o caminho suportado pelo Expo. Código TypeScript puro continua no Vitest. Ajusta a D69. |
| D115 | **Acessibilidade padrão dos componentes da fase 1.** `Pressable`: `accessibilityRole='button'` por padrão (a pessoa pode trocar), `accessibilityState.disabled` ligado à prop `disabled` e foco visível na web, além da área de toque (D111). `Box` e `Text` não forçam papel (são genéricos); o `Text` respeita a escala de fonte do sistema. |
| D116 | **Política de versões do Expo**: enquanto o alanwind estiver em 0.x, só o SDK atual (hoje o 58; muda quando sair um novo). A partir da 1.0, o atual e o anterior. |
| D117 | *Ajuste (D136): ordem fixa de critérios, sem ciclo.* **Precedência entre condições diferentes: vence a mais específica.** Quando a mesma propriedade aparece com condições que valem ao mesmo tempo: com condição vence sem condição (`bg-primary hover(bg-raised)` mostra `bg-raised` no hover, mesmo escrito antes); mais condições vencem menos (`dark(hover(...))` vence `hover(...)`); entre faixas de tela, a maior vence; no empate, a última escrita. Complementa a D58, que cobre classes sem condição. |
| D118 | **Tons da paleta fora da fase 1.** Na fase 1, cor livre só em hex (`bg=#e11d48`, `bg=#e11d48/50`). `bg=red-40` entra junto com a paleta, na fase de tema (D99). Ajusta a D105 e resolve a contradição entre D99 e D105. |
| D119 | **Config no RN por `configure()`.** `defineConfig` e `configure` vêm de `@alanwind/native` na fase 1; o app chama `configure(config)` uma vez, no arquivo de entrada. Sem plugin de build, coerente com o runtime da D15. Sem a chamada, os atalhos ficam desligados, com aviso em dev. |
| D120 | *Ajuste (D135): `props` passa a ter camadas com condição.* **Propostas de formato da IR aprovadas em bloco** (as 12 da `docs/specs/funcionamento-interno.md`): estilo como lista ordenada de camadas, cada uma com uma condição (átomos combinados por E, em ordem canônica); cor sempre com o par `{light, dark}` já resolvido no valor; lados explícitos já na IR (estende a D107 ao `core`); o `core` desfaz `center-x`/`center-y` com valores iniciais quando a direção muda numa camada; elevação do escuro expandida pelo `core` sob a condição `dark`; aviso de conflito aponta a classe que perdeu; diagnósticos com posição `[início, fim)` em UTF-16, ordenados por posição; hex de 3 dígitos expandido e de 8 dígitos convertido em alfa; `fontFamily` genérica (`sans`/`serif`/`mono`) mapeada pelo emissor; `lines-N` em `props`; nomes de tipos e campos como na spec. |
| D121 | **Nome definitivo: alanwind.** Deixa de ser nome provisório (ajusta a D12). Antes de publicar, ainda é preciso conferir se `alanwind` e o escopo `@alanwind` estão livres no npm (D68). |
| D122 | **Layout: alinhamento, `between`, `wrap` e `fill`.** Início e fim de um eixo com `x-start`, `x-end`, `y-start`, `y-end`, sempre relativos à tela, como `center-x`/`center-y` (D38), e sem colidir com os lados da D87. `between` distribui a sobra entre os filhos no eixo principal. `wrap` deixa os filhos quebrarem de linha (sem ele, não quebram). `fill` ocupa o espaço restante no eixo do pai (flex 1). |
| D123 | **Borda: espessura, lados e cor.** `border` = 1, `border-0`, `border-2` e `border-4`; outros valores por valor livre (`border=3`). Existem `border-x`/`border-y` e as formas por lado (`border-top`, `border-bottom-2`). A cor aceita todos os papéis do tema (`border-primary`, `border-danger`), além de `subtle`, `strong` e `focus` (D95). Sem cor por lado. |
| D124 | **Raio por lado e por canto; sem `shadow-none`.** Por lado: `round-top-lg`, `round-bottom-md`, `round-left-*`, `round-right-*` (os dois cantos daquele lado). Por canto: `round-top-left-lg` etc. `shadow-none` fica fora da fase 1. |
| D125 | **Extras de tamanho, `gap` por eixo, decimal e texto.** `size-full` e `size-screen` existem (largura e altura juntas, D98). `gap-x-N` (entre colunas) e `gap-y-N` (entre linhas), relativos à tela, com valor livre (`gap-x=V`). Valor livre aceita decimal com ponto e dígito antes dele (`w=10.5`, `leading=1.4`, `0.5`); vírgula é erro. Confirmados `align-left\|center\|right` e `font-sans\|serif\|mono` (D77). |
| D126 | **Item colado depois de `)` e tipagem do `look`.** `hover(bg-raised)pad-4` gera erro de falta de espaço com sugestão, mas aplica os dois itens. O tipo do `look` oferece autocomplete das classes conhecidas e aceita qualquer `string`; a validação real é o diagnóstico em runtime/build (sem template literal estrito). |
| D127 | **Propostas da `docs/specs/sintaxe.md` (seção 11.2) aprovadas em bloco**: diagnósticos (códigos `AW###`, mensagens, severidades, posição `[início, fim)` em UTF-16, ordem, trecho descartado e sugestão por distância de edição até 2); leitura do texto (tab e quebra de linha como separador, espaços dentro de `()` ignorados, `look` vazio sem aviso, maiúscula = classe desconhecida, `motion-safe` com `AW004`, variante impossível aceita com `AW202`); valor livre e cor (famílias que aceitam `=` e `AW009`, negativo só em `margin`, hex em maiúsculas, barra só com a escala de opacidade e recusada em hex de 8 dígitos, `auto` em todas as formas de `margin`); estrutura (atalho dentro de variante expandido no lugar, especificidade por analogia, `lines-N` com N ≥ 1, papel de borda não pode se chamar como um lado, notação das saídas). |
| D128 | **Neutros do tema que faltavam.** `bg-raised` no claro = `#FFFFFF`, igual ao `surface`; a elevação vem da sombra (D51). `text-subtle` (só desabilitado, D93): claro `#A1A1AA`, escuro `#5C5C64` (2,2 a 2,8:1, isento do 4,5:1 por ser desabilitado; o aviso de contraste ignora esse par). |
| D129 | **`text-secondary` não existe.** O `secondary` é neutro e a cor do papel não passa como texto (1,1 a 1,5:1); para texto já existem `text-body` e `text-muted`. `text-secondary` é classe desconhecida. Exceção à D92 para esse papel. |
| D130 | **`secondary-hover` e `secondary-soft`.** Hover: claro `#DCDCE2` (texto `#25252B`, 11,16:1), escuro `#3E3E45` (texto `#F2F2F4`, 9,49:1). Soft: claro `#F1F1F4` com texto `#3B3B42` (9,86:1), escuro `#232328` com texto `#C9C9CF` (9,49:1). Completa a D35 para o `secondary`. |
| D131 | **Texto sobre `-soft`: `text-on-<papel>-soft`.** Segue o padrão `on-<fundo>`: `bg-danger-soft` pede `text-on-danger-soft`, com a cor da D91. |
| D132 | *Ajuste (D137): uma camada só por classe; o escrito vence.* **Elevação no escuro com valores.** Borda de 1 (`#34343A`). Sombra preta com as camadas do claro e mais opacidade: `shadow-sm` 0 1px 2px a 30%; `shadow-md` 0 4px 8px a 35%; `shadow-lg` 0 12px 24px a 40%. As três clareiam o fundo no mesmo um nível; quem já está em `bg-raised` fica em `raised`; sem `bg-*`, parte de `page`. Detalha a D97. |
| D133 | **Famílias de fonte do sistema.** `font-sans`: San Francisco (iOS), Roboto (Android), pilha `system-ui` (web). `font-serif`: Georgia (iOS), `serif` (Android), pilha Georgia/serif (web). `font-mono`: Menlo (iOS), `monospace` (Android), pilha `ui-monospace` (web). Nenhuma fonte para baixar. Detalha a D49 e a D77. |
| D134 | **Nome de atalho (`define`)**: começa com letra minúscula e aceita minúsculas, dígitos e hífen (`btn`, `card-title`, `btn-2`). Não pode repetir o nome de uma classe nativa nem de uma variante (erro de colisão). Detalha a D101. |
| D135 | **Lacunas da IR fechadas.** Condições redundantes são simplificadas em silêncio para a forma mínima (`ios(native(x))` → `[ios]`, `medium(expanded(x))` → `[expanded]`); as impossíveis seguem a D127 (`AW202`). `props` passa a ter camadas com condição, como o estilo e com a mesma precedência (D117): `medium(lines-2) lines-4` funciona. Erro dentro de atalho aponta o nome do atalho no `look` e traz um campo de origem com o atalho e a posição dentro do texto do `define`. Centralização numa variante e direção em outra (`dark(center-x) medium(row)`): o `core` gera uma camada combinada (`[dark, medium]`) com a tradução certa, que vence pela D117. Ajusta a D120 (`props` deixa de ser plana). |
| D136 | **Precedência entre condições em ordem fixa, sem ciclo.** 1) mais condições vence; 2) faixa de tela maior vence (sem faixa < `medium` < `expanded`), mesmo contra outro tipo de condição; 3) última escrita. Em `expanded(x) hover(x) medium(x)`, vale `expanded`. Ajusta a D117, que podia formar ciclo. |
| D137 | **Elevação no escuro: uma camada de sombra e o escrito vence.** Cada `shadow-*` do escuro tem só a camada listada na D132 (o texto "camadas do claro" não vale). A elevação só preenche o que falta: `bg-*` fora de `page`/`surface`/`raised` ou `dark(bg...)` explícito mantêm o fundo escrito; `border` próprio mantém a borda escrita; a sombra discreta continua. Ajusta a D132 e detalha a D97. |
| D138 | **Diagnósticos que faltavam.** `between` com alinhamento no mesmo eixo segue a regra de conflito normal (D58, com aviso). Novos códigos: `AW010` (erro) para item colado depois de `)`, com posição no item colado (D126); `AW304` (erro, ao carregar o tema) para nome de atalho fora do formato (D134). `w=10,5`, `w=.5` e `bg=red-40` na fase 1 usam `AW008`, com mensagem própria. Condição impossível (`dark(light(x))`) é descartada da IR; fica só o `AW202`. |
| D139 | **Analogias e nomes da IR aprovados.** `x-start`/`x-end`/`y-start`/`y-end` com a especificidade de `center-x`/`center-y`; `border-x`/`border-y`, raio por lado e canto e `gap-x`/`gap-y` mais específicos que a forma geral; na IR, `gap` vira `rowGap` + `columnGap` e o raio vira quatro cantos; `border-1`/`border-3` dão `AW103`; `text-secondary` dá `AW102`; `leading` e a borda por lado aceitam valor livre; papel de borda não pode se chamar `x` ou `y`. Nomes: `PropsIR` com `layers`, `PropsLayer`, `PropsMap`, campo `origin` (`shortcut` + `position`) no diagnóstico, camada `light` antes da `dark` na elevação. |
| D140 | **Últimos detalhes da IR.** Cada ocorrência de variante vira sua própria camada, na ordem escrita, sem fundir condições iguais (`hover(bg-raised) press(bg-surface) hover(pad-4)`: vale `bg-surface`), para a última escrita valer sempre (D136). Os átomos de uma condição ficam na ordem da tabela de variantes (hover, press, focus, disabled, dark, light, ios, android, web, native, medium, expanded): `press(hover(x))` vira `[hover, press]`. `between` usa a propriedade abstrata `place.main` (`place.x` em linha, `place.y` em coluna), com a especificidade de `center-x`/`center-y`. |
| D141 | **CI pronto desde já, para docs e código.** O workflow `CI` roda em toda PR e push para `develop` e `main`. A parte de documentação roda sempre e confere as regras do `CLAUDE.md`: 80 colunas, links e specs citadas que existem, `D##` registrada. A parte de código liga sozinha quando o monorepo existir (`pnpm-lock.yaml`): Biome, tipos, testes, build e Knip (D69, D74). Um check agregado `CI` resume os dois. |
| D142 | **CD: tag manual e versão única.** Depois do merge `develop` → `main`, o Alan cria a tag `vX.Y.Z` na `main`. O workflow `Release` confere que a tag está na `main`, põe essa versão em todos os pacotes públicos (`alanwind` e `@alanwind/*`), roda as mesmas verificações do CI, publica no npm com provenance e cria a GitHub Release com notas geradas dos commits. Autenticação: secret `NPM_TOKEN` na primeira publicação; depois, trusted publishing (OIDC) sem token. Detalha a D73. |
| D143 | **Branches protegidas.** `main` e `develop` só recebem merge por PR, com o check `CI` verde obrigatório, sem push direto e sem force push. O merge continua sendo do Alan (D73). |
| D144 | **Diagnósticos: desempate, catálogo e erros do tema.** Dois diagnósticos na mesma posição saem em ordem de código, do menor para o maior (vale a R49 da sintaxe; a R39 da IR se ajusta). `AW303` fica reservado e fora do catálogo da fase 1, até existir criação de papéis. `lines-0` dá `AW103`. Os erros ao carregar o tema (`AW301`, `AW302`, `AW304`) trazem o nome do atalho e a posição dentro do texto dele, como o `origin` da D135. O atalho com qualquer um deles é descartado, e usá-lo num `look` dá `AW101`. |
| D145 | **Camadas com a mesma condição se comparam como uma só.** Primeiro vale a especificidade (D58), depois a última escrita. O `core` tira da camada a declaração que perdeu, com `AW201`. Em `hover(pad-x-2) hover(pad-4)`, no hover fica 8 à esquerda e à direita e 16 em cima e embaixo. Detalha a D140. |
| D146 | *Ajuste (D149): a sombra do claro fica em `[<condição>, light]`.* **`shadow-*` dentro de variante herda a condição.** `hover(shadow-md)` gera `[hover]` com a sombra e `[dark,hover]` com a elevação do escuro (fundo um nível acima e borda). Conta como "já escrito" (D137) o `bg-*` que vale junto: o da base ou o de uma condição contida na da sombra. Um `bg-*` em outra variante (`press`) não conta. |
| D147 | **Validação no ShadowPlatinum com pacote local.** A cópia do app (D80) instala os `.tgz` gerados por `pnpm pack`, como se viessem do npm, para testar o que será publicado. O Alan escolhe as telas quando chegar a tarefa 061. |
| D148 | **Hook do implementador libera as configs da raiz.** Além de `packages/` e `apps/`, o implementador pode editar só a lista exata de arquivos de config da raiz (`package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `turbo.json`, `biome.json`, `tsconfig*.json`, `knip.json`). `.github/`, `.claude/` e `docs/` continuam bloqueados. |
| D149 | **Sombra do claro em variante e aviso de camada.** Em variante, a sombra do claro fica na camada `[<condição>, light]`, como sem variante (R34): `hover(shadow-md)` gera `[hover, light]` com a sombra e `[hover, dark]` com a elevação do escuro. Ajusta a D146. O `AW201` da D145 só aparece no empate de especificidade (R38): `hover(pad-x-2) hover(pad-4)` não avisa e `hover(pad-4) hover(pad-2)` avisa. |
| D150 | **Node de desenvolvimento do monorepo: 22.18 ou superior.** O `engines.node` da raiz pede `>=22.18`, porque o `tsup` 9 exige essa versão para rodar. O Node 22.13+ da seção 3.1 continua sendo o de quem usa o alanwind (Expo SDK 58); a mudança vale só para desenvolver o repositório. |
| D151 | **Scripts de `.github/scripts/` seguem o mesmo padrão do Biome.** Sem exceção no `biome.json`: 80 colunas e imports organizados, como o resto do código. Os scripts existentes são reformatados. |
| D152 | **Unidades de tela e cache.** `w-screen`, `h-screen` e `size-screen` usam a **janela** (`useWindowDimensions`), como a faixa. Quando a IR do `look` tem unidade de tela, a chave do cache (D109) leva a janela exata; os demais `look` continuam só com a faixa. |
| D153 | **Faixas do contexto vêm do tema.** A camada de contexto da borda do `native` lê as faixas (600 e 840) do tema que o `core` guarda; só o emissor fica proibido de consultar o tema. Uma só fonte para os números. |
| D154 | **Formato dos valores de saída no RN.** Cor com alfa menor que 1 sai como `rgba(r, g, b, a)` (como as sombras da `tema.md`); `fontWeight` sai como string (`'400'`, `'500'`, `'700'`). |
| D155 | **`boxShadow` como lista de objetos.** O emissor RN gera `boxShadow` como lista de `{ offsetX, offsetY, blurRadius, spreadDistance, color }`, com `color` no formato da D154. Ajusta a forma da D108. |
| D156 | **Pilhas de `fontFamily`.** `sans` = `'System'` (iOS), `'Roboto'` (Android), `'system-ui, sans-serif'` (web); `serif` = `'Georgia'`, `'serif'`, `'Georgia, serif'`; `mono` = `'Menlo'`, `'monospace'`, `'ui-monospace, monospace'`. A pilha da web serve também ao emissor CSS. Detalha a D133. |
| D157 | **`lineHeight` arredondado a duas casas.** `tamanho × razão` é arredondado a duas casas decimais, para tirar o ruído de ponto flutuante do valor livre (`type-2xl leading=1.4` = 33.6). |
| D158 | **API pública de resolução: `look()` e `useLook()`.** `look(input, { context?, states? })` devolve o estilo e as props; sem `context`, lê o esquema e a janela naquele instante, sem reagir a mudanças. `useLook(input, states?)` reage às mudanças de contexto, é o que os componentes usam e é público já na fase 1. Detalha a D26 e a D27. |
| D159 | **Estados de interação no cache.** Cada entrada do cache (D109) guarda o resultado de cada combinação de estados já pedida (no máximo 16). O limite do cache é exatamente 500 entradas. |
| D160 | **Aviso em dev no `native`.** Dev é `__DEV__`; o canal é `console.warn`; um aviso por combinação de `look`, código e posição, mostrado quando o `look` entra no cache. |
| D161 | **`configure`: aviso, segunda chamada e chave estranha.** O aviso de ausência de `configure` (D119) só aparece quando um `look` traz classe desconhecida (`AW101`) sem `configure` chamado, com a dica de chamá-lo. Uma segunda chamada substitui os atalhos anteriores. Chave além de `define` (em JavaScript puro) é ignorada com aviso em dev. |
| D162 | **`setColorScheme` com estado próprio.** Forçar o esquema muda só um estado do alanwind, igual no iOS, no Android e na web; não usa `Appearance.setColorScheme`, para não mexer em barra de status, teclado e alertas. |
| D163 | **Propriedades de texto herdáveis.** Herdam (D57): `color`, `fontSize`, `fontWeight`, `lineHeight`, `textAlign`, `fontFamily`, `fontStyle`, `textDecorationLine` e `textTransform`. `numberOfLines` não é herdado. |
| D164 | **`Text` dentro de `Text` herda.** O `Text` também repassa o texto herdado por contexto; o padrão da D112 só vale quando nada é herdado, como no CSS. |
| D165 | **Texto em variante de estado do pai chega ao filho.** `press(text-on-primary)` no `Pressable` vale para o `Text` filho enquanto o pai está pressionado: as camadas do pai são avaliadas com o estado atual dele (D57). |
| D166 | **Variantes de estado em `Box` e `Text` são ignoradas.** `hover`, `press`, `focus` e `disabled` em `Box` e `Text` são ignorados com aviso da borda em dev, sem código `AW`, como no `styled()` (D53). |
| D167 | **Atalho do RN no `style` segue a regra do RN.** Um `style={{ padding: 4 }}` não vence um `paddingTop` do `look`, porque o RN dá precedência ao lado específico. Fica documentado, sem normalizar o `style`. Exceção conhecida à D53. |
| D168 | **Base explícita do `Box`.** O `Box` aplica `flexDirection: 'column'` explícito, abaixo do `look` e do `style`, para a D62 ser testável. |
| D169 | **Foco visível na web pelo navegador.** Na fase 1, os componentes não removem o outline do navegador (D115); `focus(...)` personaliza. Sem anel padrão próprio. |
| D170 | **`hitSlop` do `Pressable`.** Sem `hitSlop` até o primeiro `onLayout`. Se a pessoa passar `hitSlop`, o dela vence, como o `style` sobre o `look`. |
| D171 | **Foco de leitor de tela fora do estado `focus`.** Na fase 1, o estado `focus` vem só de `onFocus`/`onBlur` (teclado e web); o foco do TalkBack/VoiceOver não ativa `focus(...)`. |
| D172 | **`componentes.md` aprovável com fases posteriores abertas.** A spec pode ser aprovada para a fase 1 com o mapa de props do `styled()`, a acessibilidade de `Image`, `ScrollView`, `TextInput`, `FlatList`, `Modal`, `Switch` e `SafeArea`, o `Modal` e os estados do `Switch` marcados como fases posteriores. |
| D173 | **Bloqueio de hook: o agente para e relata.** Quando um hook de restrição impedir a tarefa, o agente não contorna (redirecionamento, `tee`, script inline, worktree fora do projeto): para e relata. O hook do implementador e do QA passa a bloquear escrita de arquivo pelo `Bash`; arquivos se escrevem só com `Write`/`Edit`. |
| D174 | **Licença MIT.** O repositório e os pacotes publicados usam a licença MIT (`LICENSE` na raiz e `license: "MIT"` em cada `package.json`). |
| D175 | **`@alanwind/native` só em ESM.** O `native` é publicado só em ESM, para um app nunca carregar duas cópias do estado do módulo (cache, `configure`). O `core`, sem estado, pode sair em ESM e CJS. |

### 3.1 Alvo técnico de referência (Expo SDK 58)

Conforme a documentação do Expo: SDK 58 usa **React Native 0.88**,
**react-native-web 0.21** e exige **Node.js 22.13 ou superior** (para
desenvolver o monorepo, 22.18+, D150). A *Strict TypeScript API* do React
Native passou a ser o padrão, então os tipos do alanwind devem funcionar bem
com ela. O React Native tem cerca de seis releases
por ano, e o Expo acompanha esse ritmo, então a lib precisa de uma **política de
suporte** (por exemplo, SDK atual e o anterior).

### 3.2 Como o runtime funciona (D15)

- O app renderiza um componente e chama o alanwind com a string de classes.
- Uma função **pura** lê a string, consulta o tema e devolve um **objeto de
  estilo** do React Native (por exemplo
  `{ padding: 16, backgroundColor: '#...' }`).
- Um **cache** (chave: string de classes + contexto, como tema, modo
  claro/escuro e largura da tela) guarda o resultado. A segunda vez que a mesma
  string aparece, a resposta vem pronta.
- Requisito: a função é **determinística** (mesma entrada, mesma saída). Isso
  permite rodar o mesmo código em build mais tarde, como otimização, sem mudar a
  API.
- Na web, o CSS continua sendo gerado em build, como no Tailwind.

### 3.3 Componentes (D26, D40, D41, D53): esforço estimado

| Parte | Esforço | Observação |
|---|---|---|
| `Box`, `Text`, `Image`, `TextInput`, `SafeArea` | Baixo | Lê o `look`, resolve o estilo e soma ao `style` que a pessoa passar (o `style` vence, D53). |
| `ScrollView`, `FlatList` | Médio | Além do `look`, aceitam `contentLook` (D41). A `FlatList` tem mais props e mais casos de uso. |
| `Pressable`, `Switch` | Médio | Ligam os estados (pressionado, foco, desabilitado, ligado) às variantes como `hover(...)`. |
| `Modal` | Médio | Precisa cuidar de foco, fechar com o botão voltar e acessibilidade. |
| Tipos em TypeScript | Médio | Aceitar todas as props do componente original e repassar o `ref`. |
| Tema e modo escuro | Médio | Reagir ao esquema de cor e ao tamanho da tela. |
| Componentes de terceiros | Médio | Helper `styled(Componente)` com mapa de props (D53). O look padrão (D54) fica para depois. |

É bem mais simples e estável do que transformar `className` no build com Babel,
e combina com a decisão de runtime.

## 4. Propostas ainda não confirmadas

Direções sugeridas na conversa, sem decisão do Alan:

- **Comando de configuração `npx alanwind init`** (consequência da D56): um
  comando que prepara o projeto sozinho (cria o arquivo de tema e liga o plugin
  de build), no estilo do `init` de outras libs. Faz parte do pacote `cli` já
  previsto. Ideia do alanwind, ainda sem decisão.
- **Ícone nos avisos `info`** (consequência da D48): o `info` azul e o `primary`
  azul são da mesma família, então o componente de aviso deveria trazer um ícone
  para não parecer um botão. Ideia do alanwind, ainda sem decisão.
- ~~**Opacidade em cor livre (em aberto)**~~ **Decidida pela D104.** com
  qualquer tom, `bg=red-40-50` fica ambíguo (o último número é tom ou
  opacidade?). Opções levantadas: barra (`bg=red-40/50`), proibir opacidade em
  cor livre (usar hex de 8 dígitos) ou classe separada. O Alan comentou que o 96
  do exemplo era só ilustrativo; a decisão ainda não foi tomada.
- **CSS pré-gerado como extra da CDN**: um arquivo de CSS cobrindo só as classes
  simples (sem variantes agrupadas), além do script da D55. Opcional.
- **Arquitetura "um core, dois emissores"**: o core lê a classe e gera uma
  representação intermediária (IR) neutra. Um emissor gera **CSS** (web) e outro
  gera **objetos de estilo do React Native**.
- ~~**Arquitetura por presets**~~ **Adiada pela D90.**
- ~~**Ordem**: core + IR + emissor CSS primeiro~~ **Substituída pela D60**
  (React Native primeiro, CSS logo depois).
- **Desenhar o subconjunto portátil a partir do React Native**, que é o alvo
  mais restritivo.
- **Matriz de suporte** em três níveis: *core* (funciona nas duas plataformas),
  *web-only* e *native-only*, com aviso claro quando uma classe é usada na
  plataforma errada.
- **Tabela de tradução de variantes**: `hover` vira `:hover` na web e estado
  `pressed` no nativo (no celular não existe hover);
  `compact`/`medium`/`expanded` viram media query ou breakpoint por largura;
  `dark` vira `prefers-color-scheme` ou `useColorScheme`.
- **Tokens do tema numa única fonte da verdade**, alimentando os dois emissores;
  considerar o formato W3C Design Tokens.
- ~~**Monorepo pnpm**~~ **Decidido** (D67 a D69, estrutura na seção 14).
- **Geração sob demanda (JIT)** na web: escaneia os arquivos e gera só o que é
  usado (inclusive o atributo `look`, D42).
- **Entrega em três camadas**: (1) fundação, com core, emissor CSS e site
  mínimo; (2) mobile, com emissor RN e abas de React Native na doc; (3) vitrine,
  com galeria de templates, playground, theme builder e extensão de VS Code.
- Outras ideias de `01-referencias-e-ideias.md` ainda sem decisão: inspetor para
  depuração, trocar tema sem providers, otimizações de desempenho (cache por
  contexto, atualização de tema sem re-render).

## 5. Acessibilidade: princípios iniciais (candidatos a ADR)

- Paleta padrão só com combinações texto/fundo que passam no contraste **WCAG AA
  (4,5:1)**, validado por teste automático (isso vale para os dois temas, claro
  e escuro, e para os estados `-soft` e `-hover`; o hover mais claro é o que
  mais arrisca quebrar o par com o texto).
- **Aviso de contraste em desenvolvimento** para combinações declaradas no mesmo
  `look` (D32).
- **Foco visível** sempre, e o framework nunca remove o outline.
- Animações respeitam **reduzir movimento** (`prefers-reduced-motion` na web,
  `AccessibilityInfo` no RN).
- **Área de toque mínima** (cerca de 44 px na web e 44 a 48 dp no nativo).
- Texto em unidades que respeitam zoom e escala de fonte do sistema (`rem` na
  web, escala de fonte no RN).
- Fora do escopo do framework: HTML semântico e `aria-*`/props de
  acessibilidade, que são do usuário. A doc deve orientar.

## 6. Site de documentação (ideias)

- **Hospedagem: em aberto.** O Alan comentou que pensa em usar o **GitHub
  Pages**, mas pediu para **deixar para decidir depois**, quando ele avaliar
  melhor como isso vai funcionar. Nada decidido. Ponto a lembrar quando voltar
  ao assunto: o GitHub Pages só serve site estático, e em
  `usuario.github.io/alanwind` o caminho base muda os links e os arquivos (um
  domínio próprio evita isso).
- **Estilo (D11)**: minimalista e direto, mas bonito. Pouco ruído, hierarquia
  clara, exemplos logo de cara. O próprio visual é a demonstração do "bonito sem
  configurar", com o tema escuro como vitrine (D25). O site **herda o tema
  padrão da lib** (D43 a D52), então as decisões de cor, raio e sombra valem
  para ele também.
- **Docs**: getting started por ambiente (npm com Vite ou Next, CDN, Expo/React
  Native), referência de utilitários com exemplo ao vivo e saída gerada, guias
  de tema, variantes, modo escuro e acessibilidade, página de migração "vindo do
  NativeWind/Tailwind" (como a sintaxe é própria, vale incluir uma tabela de
  equivalências e, mais tarde, um codemod).
- **Galeria de templates**: blocos copiáveis (botões, formulários, cards,
  navbar, login, listas), cada um com aba Web e aba React Native e selo de
  acessibilidade validado por teste.
- **Playground**: web primeiro; React Native depois (via `react-native-web` ou
  Expo Snack).
- **Theme builder** (opcional): escolher cores e espaçamentos e baixar o
  `alanwind.config`.
- **Doc gerada a partir do código** (tokens e utilitários numa única fonte) e
  **exemplos da doc rodando como testes no CI**.
- Ferramenta sugerida: Astro Starlight ou Docusaurus no começo, migrando o
  visual para o próprio alanwind aos poucos (dogfooding). Hospedagem gratuita é
  possível (GitHub Pages, Vercel, Netlify), a escolher depois.

## 7. Agentes planejados (para treinar orquestração)

**Time inicial (D71)**: os agentes são divididos **por função no fluxo** (e,
quando for treinar paralelismo, por fronteira da arquitetura), não em "backend"
e "frontend", porque o alanwind é uma biblioteca.

| Agente | Papel | Pode editar |
|---|---|---|
| **Planejador** | Quebra uma fase em tarefas pequenas a partir das specs, no formato padrão de tarefa. Entra **desde o início**. | Só `docs/` |
| **Implementador** | Escreve o código de uma tarefa. Pode haver um por pacote (core, native) para treinar paralelismo. | Só o pacote da tarefa |
| **QA** | Escreve testes **a partir da spec, sem ver o código** (caixa-preta), tenta quebrar o parser, roda conformidade RN × web e checa acessibilidade. | Só arquivos de teste |
| **Revisor** | Confere o diff contra spec, ADRs, convenções e zero dependências. Devolve aprovado ou lista de problemas. | Nada |
| **Documentador** | Mantém specs e doc de uso em sincronia com o código; aponta decisões que não chegaram na spec. | Só `docs/` |

Ficam para depois: agente de frontend (só na fase 5, site), infra/CI e segurança
(começam como skills, se precisar).

**Skills (D72)**: as skills do projeto são montadas pelo Claude **quando o Alan
pedir uma por vez**, sempre com explicação de como funcionam. Candidatas:
`registrar-decisao`, `escrever-adr`, `escrever-spec`, `adicionar-utilitario`,
`teste-de-ouro`, `checar-contraste`. Skills de código e de commit são **do
próprio Alan**.

Lista anterior de ideias (substituída pela tabela acima): arquiteto/planejador ·
implementadores por módulo · escritor de testes · revisor · verificador
independente · agente de docs · infra/CI · segurança/dependências · agente de
ADR.

Aprendizados que o Alan quer treinar: contratos claros entre agentes,
paralelizar só o que é independente, loops de revisão com critério objetivo,
controle de contexto.

**Plano do Alan**: a conversa sobre quais skills e agentes criar acontece **no
Claude Code, depois que o escopo estiver pronto**. Este documento é a base para
isso. O **MCP do alanwind** entra depois que a lib estiver funcionando
corretamente (D20).

## 8. Artefatos a produzir antes dos agentes

1. Visão de 1 página.
2. ADRs iniciais: TS + monorepo; arquitetura IR + emissores; matriz de suporte
   por plataforma; runtime no React Native; API por componentes (D26, D40, D41,
   D53, D54); `look` em todo lugar (D42); distribuição por npm e CDN (D55, D56);
   princípios de acessibilidade; **gramática da sintaxe própria** (variantes,
   breakpoints, valor livre, opacidade, `define`, `center`); **modelo de cores**
   (paleta por tons + papéis, D33 a D35); zero dependências; tokens semânticos;
   **tema padrão** (D43 a D52).
3. Divisão do escopo (D39) **em fases**, com a lista de utilitários e
   componentes de cada fase.
4. Specs: sintaxe das classes, tema/config, saída por plataforma, CLI.
5. Estratégia de testes, com testes de ouro ("dado este input, a saída tem que
   ser exatamente esta").
6. `CLAUDE.md`/`AGENTS.md` com as convenções do repositório.

## 9. O que falta para fechar o escopo

Em ordem de prioridade:

1. ~~Fechar o modelo de cores~~ **Feito** (D33 a D35).
2. ~~Fechar a sintaxe~~ **Feito** (D36 a D38).
3. ~~Tema padrão~~ **Quase fechado** (D43 a D52). **Falta só** o detalhe fino:
   valores exatos das sombras, cores de
   `border-strong`/`border-focus`/`text-link`, e a conferência final de
   contraste de cada par (trabalho de spec e de teste automático).
4. ~~Escopo~~ **Definido** (D39). Falta **dividir em fases** (o que vem
   primeiro).
5. ~~Detalhes da API~~ **Feito no nível de decisão** (D40 a D42, D53 a D56). O
   que sobra é detalhe de spec (formato exato do mapa de props do `styled()`,
   como o script da CDN observa mudanças na página).
6. **Revisão do amigo**: o Alan pediu para **não mandar agora**. Fica para
   quando ele quiser; o feedback entra na seção 12.

Pode esperar:
- **Hospedagem do site de documentação** (o Alan pensa em GitHub Pages, decisão
  adiada; ver seção 6).
- **Política de suporte** de navegadores. (Versões do Expo: decidido na D116.)
- **Disponibilidade do nome**: a busca web não achou nenhum projeto chamado
  alanwind, mas isso não confirma. Checar `npm view alanwind` e
  `npm view @alanwind/core` (404 = livre), o GitHub e um domínio antes de
  publicar. O sufixo "-wind" é bem usado por projetos pequenos (miniwind,
  digiwind, litewind) e remete ao Tailwind, o que pode causar confusão de busca
  e de marca. Alternativas levantadas, caso o nome mude: alankit, alanstyle,
  alanui, alantokens, alanform.
- Licença.
- Política de versionamento (o vocabulário de classes é uma API pública).

## 10. Histórico

- 2026-11-25: conversa inicial. Definidos motivação, tese, TypeScript, inglês,
  web + mobile, primeiras entregas e ideia do site de docs.
- 2026-11-25: definido o estilo do site e da marca (minimalista, direto e
  bonito, D11).
- 2026-11-25: pesquisa de nome; alanwind mantido como nome provisório (D12).
- 2026-11-25: decidida a sintaxe própria (D13) e o alvo de referência Expo SDK
  58 (D14).
- 2026-11-25: decidido runtime no React Native (D15) e o princípio de sintaxe
  prática e fácil de aprender (D16).
- 2026-11-25: aprovado o meio-termo da sintaxe, com identidade como requisito
  (D17), e as cinco fontes de identidade (D18). Definida a lista do que falta
  para fechar o escopo; conversa de skills e agentes fica para o Claude Code.
- 2026-11-25: decidida a regra de abreviação (D19). Iniciado o rascunho do
  vocabulário base (seção 11).
- 2026-11-25: pesquisa de outras libs (`01-referencias-e-ideias.md`). Aprovados
  zero dependências, tokens semânticos, tipagem estrita e MCP para depois (D20),
  e o posicionamento como alternativa com diferenciais próprios (D21). Rascunho
  de cor, tipografia, borda, raio e sombra.
- 2026-11-25: decididos os papéis de cor com versões suaves e estados de hover
  embutidos, pela preferência do Alan por cores escuras (D22). Corrigida uma
  afirmação anterior: variantes de plataforma já existem em outras libs. Criado
  doc de comparação com Tailwind para compartilhar.
- 2026-11-25: confirmado o prefixo `type-` (D23) e a separação entre `-hover`
  (estado) e `-soft` (baixa ênfase estática, não só para botões) (D24).
- 2026-11-25: decididos o tema que segue o sistema com escuro cuidado (D25), a
  API por componentes (D26) e a prop `look` (D27). O amigo do Alan gostou de
  `pad`.
- 2026-11-25: tratados os elementos parecidos com o Tailwind: variantes só com
  parêntese (D28), breakpoints `compact`/`medium`/`expanded` (D29) e valor livre
  com `=` (D30).
- 2026-11-25: decidida a opacidade com sufixo numérico (D31). Aprovada a ideia
  do aviso de contraste (D32).
- 2026-11-25: fechado o modelo de cores: paleta por tons de 0 a 100 e papéis
  (D33), paleta base fora das classes (D34), tema padrão completo com soma da
  configuração e tratamento de papel inexistente (D35). O aviso de contraste
  passa a cobrir cores livres.
- 2026-11-25: fechada a sintaxe: atalhos com `define` (D36), variantes de
  tamanho "a partir de" (D37) e três formas de `center` (D38).
- 2026-11-25: o Alan mencionou o GitHub Pages para o site e em seguida pediu
  para deixar a hospedagem **em aberto**, decidindo depois. Registrado como
  pendente, sem decisão.
- 2026-11-25: definido o escopo (tudo o que foi conversado, em fases; depois só
  ideias futuras e bugs; sem trocar o NativeWind de imediato) (D39). Resumo para
  o amigo adiado a pedido do Alan.
- 2026-11-25: fechada a API: lista de componentes (D40), `contentLook` e
  `styled()` (D41) e `look` em todo lugar, inclusive no HTML puro (D42),
  corrigindo a menção a `class` na D26.
- 2026-11-25: início do tema padrão: espaçamento até `pad-16` (D43), raios
  (D44), sombras com tratamento próprio no escuro (D45), `primary` vibrante em
  azul elétrico, opção C (D46) e semáforo com `warning` de texto escuro (D47).
- 2026-11-25: tema padrão quase fechado: `info` em azul, contra a sugestão do
  ciano (D48), tamanhos de `type-` e fonte do sistema (D49), fundo escuro
  cinza-grafite (D50), fundos claros (D51) e `secondary` neutro (D52).
- 2026-11-25: detalhes da API: o `style` vence o `look` e mapa de props no
  `styled()` (D53), look padrão no `styled()` como extra bacana para depois
  (D54), CDN como script e plugin de build para produção, ajustando a D4 (D55) e
  instalação por npm além da CDN, para qualquer projeto com bundler (D56).
- 2026-11-25 (Claude Code): primeira rodada de revisão. Decididos a herança de
  texto por contexto (D57), a regra de conflito entre classes (D58),
  `hover(...)` separado de `press(...)` (D59) e a fase 1 começando pelo React
  Native (D60).
- 2026-11-25 (Claude Code): segunda rodada. Removido `compact(...)` como
  variante (D61), `Box` sempre flex em coluna (D62), atalhos no arquivo de tema
  (D63) e troca de tema sem provider (D64).
- 2026-11-25 (Claude Code): terceira rodada. Plugin reescreve o `look` por
  classe gerada no HTML (D65) e tipagem estrita na fase 1 (D66). Opacidade em
  cor livre ficou em aberto (seção 4). Próximo passo escolhido: dividir o escopo
  em fases.
- 2026-11-25 (Claude Code): documento movido para `docs/`. Decididos o monorepo
  com `packages/` e `apps/` (D67), os nomes no npm (D68), as ferramentas de
  desenvolvimento (D69) e a organização de `docs/` (D70). Estrutura registrada
  na seção 14.
- 2026-11-25 (Claude Code): specs criadas em `docs/specs/` só com o já decidido.
  Definidos o time inicial de agentes por função, com planejador desde o início
  (D71), e o modo de montar skills (D72).
- 2026-11-25 (Claude Code): criadas as skills de git `conventional-commits` e
  `fluxo-de-branches` (D73).
- 2026-11-25 (Claude Code): criada a skill `codigo-limpo` (D74).
- 2026-11-25 (Claude Code): definido que as skills do projeto são a fonte
  principal e as externas servem de consulta e validação (D75).
- 2026-11-25 (Claude Code): repositório criado no GitHub com `main` e `develop`.
  Criadas as skills do projeto `registrar-decisao`, `escrever-adr`,
  `escrever-spec`, `adicionar-utilitario`, `teste-de-ouro` e `checar-contraste`
  (candidatas da D72).
- 2026-11-25 (Claude Code): criados os agentes do projeto e escrito o
  `CLAUDE.md` (D76).
- 2026-11-25 (Claude Code): planejador gerou o rascunho da fase 1 em
  `docs/tarefas/fase-1/` (34 tarefas). Rodada 1 de perguntas: vocabulário da
  fase 1 (D77), área de toque embutida no `Pressable` (D78) e fachada para
  depois (D79). Validação numa cópia do ShadowPlatinum atualizada para o SDK 58
  (D80) e arquivo de tema na fase 1 só com atalhos (D81).
- 2026-11-25 (Claude Code): rodada 2 (IR): conflito resolvido no `core` (D82),
  IR com parte de props (D83), diagnósticos devolvidos e filtrados na borda
  (D84) e `center-x`/`center-y` traduzidos no `core` (D85).
- 2026-11-25 (Claude Code): documentador escreveu os ADRs 0001 e 0002
  (propostos). Rodada 3 (sintaxe): variantes aninhadas (D86), lados
  `top`/`bottom`/`left`/`right` (D87), sintaxe quebrada ignora só o trecho ruim
  (D88) e margem `auto` na escala, negativa só com `=` (D89). Registrados os
  motivos de D3 (tipagem estrita) e D20 (independência), e presets adiados
  (D90).
- 2026-11-25 (Claude Code): o Alan aceitou os ADRs 0001 (TypeScript e monorepo)
  e 0002 (core, IR e emissores).
- 2026-11-25 (Claude Code): rodada 4 (tema): cores de estado aprovadas com
  contraste conferido (D91), tom automático em `text-<papel>` (D92),
  `text-subtle` só para desabilitado (D93) e breakpoints 600/840 (D94).
- 2026-11-25 (Claude Code): rodada 5 (tema): cores neutras finais e novas (D95),
  sombras do claro (D96), elevação automática no escuro (D97) e escalas de
  tamanho, peso, linha, opacidade e `round-full` (D98).
- 2026-11-25 (Claude Code): rodada 6 (tema): algoritmo da paleta só na fase de
  tema (D99), atalhos como objeto `define` (D100), atalhos com variantes e
  aninhamento sem ciclos (D101) e W3C Design Tokens adiado (D102).
- 2026-11-25 (Claude Code): rodada 7 (sintaxe): variantes `focus`, `disabled`,
  `light` e `native` (D103), opacidade em cor livre com barra (D104), conteúdo
  do valor livre (D105) e faixa exata adiada (D106).
- 2026-11-25 (Claude Code): rodada 8 (emissor RN): eixos expandidos em lados
  explícitos (D107), `boxShadow` no nativo (D108), cache por faixa de tela com
  LRU (D109) e `hover` pelo evento de hover (D110).
- 2026-11-25 (Claude Code): rodada 9 (componentes): área de toque por plataforma
  com `hitSlop` (D111), visual padrão do `Text` (D112), herança em cascata
  (D113) e Jest nos componentes RN (D114).
- 2026-11-25 (Claude Code): acessibilidade padrão dos componentes da fase 1
  (D115) e política de versões do Expo (D116). Disparados os documentadores para
  redigir as specs completas e o ADR 0003.
- 2026-11-25 (Claude Code): onda 1 dos documentadores concluída (sintaxe, IR e
  tema em rascunho; ADR 0003 proposto). Rodada 10: precedência entre condições
  (D117), tons da paleta fora da fase 1 (D118), config por `configure()` (D119)
  e propostas da IR aprovadas (D120).
- 2026-11-25 (Claude Code): o Alan definiu alanwind como nome definitivo (D121).
- 2026-11-26 (Claude Code): rodada 11 (sintaxe): layout (D122), borda (D123),
  raio por lado e canto, sem `shadow-none` (D124), extras de tamanho, `gap`,
  decimal e texto (D125), item colado e tipagem (D126) e propostas da sintaxe
  aprovadas (D127). Conflito entre condições e paleta confirmados como na D117
  e na D118.
- 2026-11-26 (Claude Code): rodada 12 (tema): neutros (D128), sem
  `text-secondary` (D129), `secondary` hover e soft (D130), texto sobre soft
  (D131), elevação no escuro (D132), fontes (D133) e nome de atalho (D134).
  Perguntas soltas da IR fechadas (D135).
- 2026-11-26 (Claude Code): perguntas do documentador após propagar D117–D135:
  precedência sem ciclo (D136), elevação no escuro (D137), diagnósticos que
  faltavam (D138) e analogias e nomes da IR (D139).
- 2026-11-26 (Claude Code): últimos detalhes da IR (D140).
- 2026-11-26 (Claude Code): CI para docs e código (D141), CD por tag com versão
  única (D142) e branches protegidas (D143).
- 2026-11-26 (Claude Code): o Alan aprovou as specs `sintaxe.md`,
  `funcionamento-interno.md` e `tema.md`.
- 2026-11-26 (Claude Code): perguntas do planejador ao revisar as tarefas:
  diagnósticos (D144), camadas com a mesma condição (D145), sombra em variante
  (D146), validação com `pnpm pack` (D147) e configs da raiz no hook (D148).
- 2026-11-26 (Claude Code): sombra do claro em variante e aviso de camada
  (D149). O Alan reaprovou sintaxe, funcionamento interno e tema.
- 2026-11-26 (Claude Code): o Alan aceitou o ADR 0003 (Jest nos componentes
  React Native).
- 2026-11-26 (Claude Code): revisão da tarefa 001: Node 22.18+ para
  desenvolver o monorepo (D150) e scripts de `.github/` sem exceção no Biome
  (D151).
- 2026-11-26 (Claude Code): o Alan aceitou as recomendações do
  documentador para `emissor-native.md` (D152 a D162) e `componentes.md`
  (D163 a D172).
- 2026-11-26 (Claude Code): o Alan aprovou as specs `emissor-native.md` e
  `componentes.md` (esta para a fase 1, D172).
- 2026-11-26 (Claude Code): revisão da tarefa 002: agente para e relata
  quando um hook bloqueia (D173), licença MIT (D174) e `native` só em ESM
  (D175).

## 11. Vocabulário base (rascunho em construção)

Regras: sintaxe `propriedade-valor` com hífen; escala de espaçamento em passos
de 4 (`pad-4` = 16); abreviar só `w`, `h`, `x`, `y` (D19); valor livre com `=`
(D30); variantes só com parêntese (D28). Nada aqui é definitivo até virar spec.

**Variantes** (rascunho)

| Grupo | Variantes |
|---|---|
| Estado | `hover(...)` (só onde há ponteiro), `press(...)` (pressionado, todas as plataformas) (D59), `focus(...)`, `disabled(...)` |
| Esquema de cor | `dark(...)`, `light(...)` (os papéis de cor já mudam sozinhos; estas servem para exceções) |
| Plataforma | `ios(...)`, `android(...)`, `web(...)`, `native(...)` |
| Tamanho de tela (D29, D37, D61) | `medium(...)`, `expanded(...)`; valem "a partir de" (`medium(...)` vale em `medium` e acima). Sem variante = todos os tamanhos. |
| Acessibilidade | `motion-safe(...)` (fora da fase 1, D78) |

Exemplo:
`<Box look="col gap-2 pad-4 medium(row gap-6) bg-surface hover(bg-raised shadow-md)">`

**Layout** (rascunho)

| O que | Classes |
|---|---|
| Direção | `row`, `col` |
| Alinhamento | `center` (dois eixos), `center-x` (horizontal), `center-y` (vertical) (D38); `x-start`, `x-end`, `y-start`, `y-end`, sempre relativos à tela; `between` (distribui a sobra no eixo principal) (D122) |
| Fluxo | `wrap` (quebra de linha), `fill` (ocupa o espaço restante) (D122) |
| Espaço entre filhos | `gap-4`; `gap-x-4` (entre colunas) e `gap-y-4` (entre linhas), relativos à tela (D125) |

**Espaçamento** (D43)

| O que | Classes |
|---|---|
| Escala | `pad-0` a `pad-16`, em passos de 4 (`pad-1` = 4 px, `pad-16` = 64 px) |
| Interno | `pad-4`, `pad-x-4`, `pad-top-2` |
| Externo | `margin-4`, `margin-x-auto` |

**Tamanho** (rascunho)

| O que | Classes |
|---|---|
| Largura e altura | `w-full`, `h-10`, `size-10` (largura e altura iguais), `size-full`, `size-screen` (D125) |
| Valor livre | `w=137`, `pad=10`, `w=50%`, `w=10.5` (decimal com ponto, D125) |

**Atalhos** (D36)

`define: { btn: 'bg-primary pad-4 round-md' }` no `defineConfig` cria o atalho
`btn`, usado como uma classe qualquer. Os atalhos são declarados no
`alanwind.config.ts` (D63, D100); o formato está em `docs/specs/tema.md`.

**Cor** (D46 a D52)

Regra: `bg-` é cor de fundo; `text-` é **só cor do texto** (o tamanho do texto
usa `type-`, D23). Todo papel tem valores para claro e escuro (D20). Todo papel
colorido tem um par `on-` com contraste garantido e variações embutidas `-soft`
e `-hover` (D22, D24). A paleta base não aparece nas classes (D34).

| Grupo | Papéis |
|---|---|
| Fundos | `bg-page` (fundo do app), `bg-surface` (cards), `bg-raised` (elevado, como modais). No escuro: cinza-grafite (D50). No claro: página cinza bem clara e card branco (D51). |
| Marca | `bg-primary` (azul elétrico, D46), `bg-secondary` (cinza neutro, D52), com `text-on-primary`, `text-on-secondary`. `text-secondary` não existe (D129); `secondary-hover` e `secondary-soft` existem (D130). |
| Estados (semáforo, D47) | `bg-success` (verde), `bg-warning` (amarelo, texto escuro por cima), `bg-danger` (vermelho), `bg-info` (azul, D48), com `text-on-success` etc. |
| `-hover` (estado de elemento interativo) | `bg-primary-hover`: mesma ênfase, um pouco mais claro no tema escuro e mais escuro no claro (ex.: botão primário). No celular vira o estado pressionado. |
| `-soft` (baixa ênfase, estático) | `bg-danger-soft`, `bg-primary-soft`: avisos, selos, etiquetas, destaques, item selecionado. Não precisa ser botão. Também pode ser o fundo de hover de um botão fantasma ou item de lista: `hover(bg-primary-soft)`. O texto por cima é `text-on-danger-soft` etc. (D131). |
| Opacidade na cor (D31) | `bg-primary-50`, `text-strong-50` (50 = 50% de opacidade) |
| Cor livre (D33, D118) | `bg=#e11d48` (cor exata, só hex na fase 1); `bg=red-40` (tom da paleta) entra na fase de tema. Sem o par `on-`; o aviso de contraste (D32) cobre. |
| Texto | `text-strong` (títulos), `text-body` (padrão), `text-muted`, `text-subtle`, `text-link` |
| Bordas | `border-subtle`, `border-strong`, `border-focus` e `border-<papel>` (`border-danger`) (D123) |
| Opacidade do elemento | `opacity-50` |

**Tipografia** (D23, D49)

O prefixo `type-` (de "type scale", a escala tipográfica) foi confirmado (D23).
Motivo: no Tailwind, `text-lg` (tamanho) e `text-red-500` (cor) usam o mesmo
prefixo, o que confunde quem está aprendendo.

| O que | Classes |
|---|---|
| Tamanho | `type-xs` 12, `type-sm` 14, `type-base` 16, `type-lg` 18, `type-xl` 20, `type-2xl` 24, `type-3xl` 30 |
| Peso | `weight-regular`, `weight-medium`, `weight-bold` |
| Alinhamento do texto | `align-left`, `align-center`, `align-right` |
| Altura da linha | `leading-tight`, `leading-normal`, `leading-loose` |
| Família | `font-sans`, `font-serif`, `font-mono` (padrão: fonte do sistema) |
| Estilo | `italic`, `underline`, `upper`, `lower` |
| Limite de linhas | `lines-2` (corta o texto em 2 linhas; `numberOfLines` no RN, equivalente em CSS na web) |

Os tamanhos de texto respeitam a escala de fonte do sistema (`rem` na web,
escala de fonte no RN), conforme a seção 5.

**Borda, raio e sombra** (D44, D45)

| O que | Classes |
|---|---|
| Borda | `border` (1), `border-0`, `border-2`, `border-4`, `border=3` (valor livre); `border-x`, `border-y`, `border-top`, `border-bottom-2`; cor com `border-subtle`, `border-danger` etc., sem cor por lado (D123) |
| Raio | `round-none` 0, `round-sm` 4, `round-md` 8, `round-lg` 12, `round-xl` 16, `round-full` (pílula ou círculo); por lado (`round-top-lg`) e por canto (`round-top-left-lg`) (D124) |
| Sombra | `shadow-sm`, `shadow-md`, `shadow-lg` (sem `shadow-none`, D124). No claro: sombra real. No escuro: fundo um nível mais claro, borda fina e sombra discreta, e o que a pessoa escreveu vence (D45, D97, D132, D137). Nativo e web usam `boxShadow` (D108). |

## 12. Feedback de terceiros (separado das decisões)

- **Amigo do Alan (rigoroso em front-end, quem sugeriu a ideia do alanwind)**,
  2026-11-25: gostou de `pad` em vez de `p`; concorda que não ficar igual ao
  Tailwind é o melhor. Revisão mais crítica da sintaxe ainda pendente, **adiada
  a pedido do Alan** (perguntas sugeridas: variantes só com parêntese, nomes de
  breakpoint, papéis de cor, `center`/`center-x`/`center-y`, utilitários de
  acessibilidade, `look` no HTML, CSS gerado).

## 13. Exemplo de tema de cores (modelo aprovado em D33 a D35; valores ilustrativos)

O **modelo** está decidido. Os valores de cor abaixo são **ilustrativos**; os
valores finais virão do tema padrão.

```ts
// alanwind.config.ts (opcional: o tema padrão já traz tudo isto).
// `palette` e `roles` são da fase de tema; na fase 1 só existe `define`
// (D81, D99, D100).
export default defineConfig({
  // Camada 1: paleta base. Tons de 0 (preto) a 100 (branco).
  // A pessoa define só alguns tons-âncora; os demais são calculados.
  palette: {
    red:  { 10: '#410E0B', 20: '#601410', 40: '#B3261E', 80: '#F2B8B5', 90: '#F9DEDC' },
    blue: { 10: '#0A1F4D', 40: '#2563EB', 80: '#8AB4FF', 90: '#E1EAFD' },
  },

  // Camada 2: papéis. É isto que as classes usam.
  roles: {
    danger:  { light: 'red-40',  dark: 'red-80'  },
    primary: { light: 'blue-40', dark: 'blue-80' },
    // Papel próprio (ganha -soft, -hover, on- e modo escuro de graça):
    love:    { light: 'red-40',  dark: 'red-80'  },
  },
})
```

O que o alanwind **gera sozinho** para cada papel (exemplo com `danger`; os tons
de `-soft` e `-hover` são regras propostas, a definir no tema padrão):

| Classe | No claro | No escuro |
|---|---|---|
| `bg-danger` | tom 40 | tom 80 |
| `bg-danger-hover` | um pouco mais escuro | um pouco mais claro |
| `bg-danger-soft` | tom 90 (bem claro) | tom 20 (bem escuro) |
| `text-on-danger` | branco (tom 100) | tom 10 |
| `text-danger` | tom 40 | tom 80 |

Uso nas classes:

```tsx
<Box look="bg-danger-soft pad-4 round-md">
  <Text look="text-danger type-sm">Algo deu errado</Text>
</Box>

<Pressable look="bg-danger text-on-danger hover(bg-danger-hover)">

<Box look="bg=#e11d48 dark(bg=#FF8A80)">   // cor livre em hex, sem mexer no tema
```

## 14. Estrutura do repositório (D67 a D70)

```
alanwind/
├─ docs/
│  ├─ 00-visao-e-decisoes.md   # índice da visão e decisões
│  ├─ 01-referencias-e-ideias.md
│  ├─ 02-fases.md              # divisão do escopo em fases (a fazer)
│  ├─ adr/                     # 0001-....md, 0002-....md
│  └─ specs/                   # sintaxe.md, tema.md, componentes.md...
├─ packages/                   # publicados no npm
│  ├─ alanwind/                # porta de entrada: `npm install alanwind` (D68)
│  ├─ core/                    # @alanwind/core: parser, IR, tema, cache, tipos
│  ├─ native/                  # @alanwind/native: emissor RN + Box, Text, Pressable...
│  ├─ css/                     # @alanwind/css: emissor CSS (fase 2)
│  ├─ vite-plugin/             # @alanwind/vite-plugin (fase 2)
│  ├─ cdn/                     # script da CDN (fase 2)
│  └─ cli/                     # @alanwind/cli: `npx alanwind init` (fase 5)
├─ apps/                       # não publicados
│  ├─ playground-expo/         # app Expo SDK 58 para testar o emissor RN (fase 1)
│  └─ site/                    # site de documentação (fase 5)
├─ CLAUDE.md                   # convenções do repo para os agentes
├─ package.json
├─ pnpm-workspace.yaml
├─ turbo.json
└─ biome.json
```

Regras de dependência entre pacotes (D74, ADR 0002): `core` não depende de
nenhum outro pacote; `native` e `css` dependem só de `core`; `vite-plugin` e
`cdn` dependem de `css`; `alanwind` só reexporta.
