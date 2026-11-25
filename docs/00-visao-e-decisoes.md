# alanwind: visão e decisões (documento vivo)

Última atualização: 2026-11-25 · Status: **fase de conversa, antes de specs, ADRs e agentes**

Este documento registra a ideia e o que já foi decidido. Separa com clareza o que o Alan **decidiu** do que foi **proposto e ainda precisa de confirmação**. Ele serve também como ponto de partida quando o Alan continuar o trabalho no Claude Code (skills, agentes e orquestração), depois que o escopo estiver fechado.

Materiais de apoio: ideias de outras libs em `01-referencias-e-ideias.md`; comparação de sintaxe com Tailwind para compartilhar com um amigo, em um doc separado (https://claude.ai/artifact/B56dibQGS9wticzyqFsoHD). Esse doc de comparação foi escrito antes das decisões D25 a D31 e usa `class` e variantes com dois-pontos em alguns trechos; o Alan decidiu deixá-lo como está por enquanto.

---

## 1. Origem e motivação

- O Alan tem um projeto em React Native que usa **NativeWind** (o Tailwind do React Native). Se o NativeWind parar de ser mantido, o app para.
- Um amigo (rigoroso em front-end) sugeriu criar o alanwind, para ter uma camada de estilos própria, que o próprio Alan usaria. Esse amigo concorda que **não ficar igual ao Tailwind é o melhor caminho**.
- O projeto também serve para **treinar arquitetura, infra e orquestração de agentes**: specs, ADRs, CI, múltiplos agentes com papéis diferentes.
- A intenção é **uso real**, não só estudo. A ideia é original, no formato de lib/extensão como Tailwind ou Bootstrap, para evitar escrever CSS puro.
- O Alan **não pretende trocar o NativeWind de imediato** (ver D39).

## 2. Tese e posicionamento

> *A styling layer for web and React Native, from one theme and one syntax of its own: accessible by default, good-looking without configuration, and fully under your control.*

Pontos centrais:
- **Independência**: você controla a camada de estilos.
- **Acessibilidade por padrão** (diferencial principal).
- **Bonito sem configurar** (tema padrão bem desenhado), com atenção especial ao **tema escuro**.
- **Web e mobile** com o mesmo tema e a mesma sintaxe.
- **Sintaxe com identidade própria**, prática e fácil de aprender. Nas palavras do Alan: sem identidade própria, nem faz sentido criar o alanwind. Analogia que orienta: **Ruby e Python** se parecem no jeito de escrever e funcionar, mas a sintaxe é diferente.

**Posicionamento (D21)**: o alanwind **não compete em "ser Tailwind"**, até porque já existem outros que fazem isso. Ele é uma **alternativa com seus próprios diferenciais**.

## 3. Decisões tomadas pelo Alan

| # | Decisão |
|---|---------|
| D1 | Uso real, com ideia original. Formato de lib/extensão, na linha de Tailwind e Bootstrap. |
| D2 | O desenvolvimento será feito **com agentes**, para treinar arquitetura, infra e orquestração. Antes dos agentes: specs, ADRs e documentação. |
| D3 | Linguagem: **TypeScript**. |
| D4 | Primeiras entregas: **plugin de build (Vite/PostCSS)** e **CDN** (para web). *Ajuste (D55): a CDN deixa de ser "CSS pré-gerado" e passa a ser um script que lê o `look`.* |
| D5 | Diferencial **A, acessibilidade e boas práticas por padrão**, aprovado. |
| D6 | Diferencial **C, bonito sem configurar** (tema padrão cuidadoso), considerado interessante. |
| D7 | Nomes de classes **em inglês** (não em português). |
| D8 | **Web e mobile** desde a concepção. O alanwind não será só mobile. |
| D9 | Terá um **site de documentação** com modelos/templates prontos e guias de como usar e como conectar ao projeto, nos moldes de Tailwind e Bootstrap. |
| D10 | Ainda sem escrever visão formal, ADRs ou specs: seguir conversando para definir mais coisas antes. |
| D11 | Estilo do site e da marca: **minimalista e direto, mas bonito**. |
| D12 | **Nome: alanwind, mantido como nome de trabalho (provisório).** Pode ser revisto antes de publicar. |
| D13 | **Sintaxe própria.** Pode lembrar o Tailwind em espírito, mas com gramática e vocabulário próprios, para ter identidade. |
| D14 | **Alvo de referência: Expo SDK 58** (versão mais atual que o Alan usa no projeto). |
| D15 | **React Native resolve as classes em runtime** (com cache). Build fica como otimização futura. |
| D16 | **Princípio da sintaxe**: prática como o Tailwind, funcional e **fácil de aprender para quem escreve à mão**. |
| D17 | **Sintaxe em meio-termo aprovada**: base prática e fácil de pegar (`propriedade-valor` com hífen), puxada para uma **identidade própria** do alanwind. A identidade é requisito, não detalhe. |
| D18 | **Fontes de identidade aprovadas**: (1) cores por **papel semântico** (`bg-primary`, `bg-surface`, `text-muted`), com pares de contraste garantido (`bg-primary text-on-primary`); (2) **utilitários de acessibilidade prontos** (`tap-target`, `focus-ring`, `motion-safe(...)`); (3) **vocabulário de palavras inteiras e legíveis** (`pad-4`, `round-lg`, `row`, `center`, `fill`); (4) **agrupamento de variantes** (`hover(bg-surface-2 shadow-md)`); (5) **variantes de plataforma** (`ios(...)`, `android(...)`, `web(...)`). Regra de ouro: uma só forma óbvia de escrever cada coisa. **Observações (verificadas na pesquisa):** o agrupamento de variantes já existe no UnoCSS, e variantes de plataforma já existem no NativeWind, no Uniwind e em outras libs. Os itens 4 e 5 são, portanto, ergonomia, e não diferenciais isolados. |
| D19 | **Regra de abreviação**: abrevia-se **só o que é universal e curto** (`w`, `h`, `x`, `y`); o resto fica por extenso (`pad`, `margin`, `round`, `gap`). Motivo do Alan: assim a sintaxe não fica idêntica à do Tailwind. Um amigo do Alan, rigoroso em front-end, gostou de `pad` em vez de `p`. |
| D20 | **Ideias de outras libs aprovadas** (detalhes em `01-referencias-e-ideias.md`): **zero dependências de runtime**; **tokens semânticos com modo claro/escuro embutido**; **tipagem estrita** (classes e tokens inválidos viram erro ou aviso, com autocomplete). **MCP do alanwind**: aprovado, mas **só será aplicado quando o alanwind estiver funcionando corretamente**. |
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
| D36 | **Atalhos definidos pelo usuário (o equivalente ao `@apply` do Tailwind) com `define`**: `define('btn', 'bg-primary pad-4 round-md')`, e depois `btn` vale como uma classe. |
| D37 | **Variantes de tamanho valem "a partir de" (mobile-first)**: `medium(row)` vale em `medium` **e acima** (`expanded`), como no CSS e no Tailwind. Ex.: `col medium(row)` fica em coluna no celular e em linha no tablet e no computador. Faixa exata fica como exceção, com forma própria a definir depois, se for preciso. |
| D38 | **Três formas de `center`**: `center` centraliza nos **dois eixos**; `center-x` só na **horizontal**; `center-y` só na **vertical**. `center-x` e `center-y` valem sempre para a **tela** (horizontal e vertical), e **não** para a direção do layout, então funcionam igual em `row` e em `col` (evita a confusão do "eixo principal" do CSS). |
| D39 | **Escopo do projeto**: implementar **tudo o que foi conversado, aos poucos (em fases)**. Quando isso estiver terminado, o Alan **para**, e o que surgir depois são **ideias futuras e correção de bugs**. O Alan **não pretende trocar o NativeWind de imediato**. |
| D40 | **Lista de componentes**: `Box`, `Text`, `Pressable`, `Image`, `ScrollView`, `TextInput`, `FlatList`, `Modal`, `Switch` e `SafeArea`. O que vier depois disso é **adicional**. |
| D41 | **`contentLook` e `styled()`**: componentes com uma segunda área de estilo (`ScrollView`, `FlatList` e parecidos) aceitam a prop **`contentLook`** para o `contentContainerStyle`. O `look` mexe no `style` principal. Componentes de terceiros entram por `styled(Componente)`, e depois se usa `<Componente look="..." />`. |
| D42 | **`look` em todo lugar, inclusive no HTML puro**: `<Box look="...">` no React Native e no React na web, e `<div look="...">` no HTML puro. No HTML puro, o plugin de build (ou um script pequeno da CDN) lê o atributo `look`, gera o CSS e liga ao elemento. Não existe `class` como segunda forma (reforça "uma só forma", D18). Custo conhecido: `look` não é atributo padrão do HTML (navegadores ignoram, mas validadores podem reclamar). O Alan acha que quase ninguém usa HTML puro hoje, mas pediu para **manter o suporte** mesmo assim, como caso de menor prioridade. |
| D43 | **Escala de espaçamento: de `pad-0` até `pad-16`**, em passos de 4 (`pad-1` = 4 px, `pad-4` = 16 px, `pad-16` = 64 px). Vale para a família de espaçamento (`pad`, `margin`, `gap`). |
| D44 | **Raios**: `round-none` = 0, `round-sm` = 4, `round-md` = 8, `round-lg` = 12, `round-xl` = 16, `round-full` = totalmente redondo (pílula ou círculo). |
| D45 | **Sombras com tratamento próprio por tema**: `shadow-sm`, `shadow-md` e `shadow-lg`. No **tema claro**, sombra de verdade (mais suave no `sm`, mais forte no `lg`). No **tema escuro**, onde sombra escura some no fundo escuro, a elevação aparece por um **fundo um pouco mais claro que o da base (`bg-raised`) mais uma borda fina**, com sombra bem discreta. Cada emissor traduz (`box-shadow` na web; iOS e Android no nativo). |
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
| D60 | **Fase 1 começa pelo React Native**: parser + representação intermediária (IR) + **emissor RN** + componentes `Box`, `Text` e `Pressable` + tema padrão. Validação com uso real: uma tela do app do Alan rodando com o alanwind ao lado do NativeWind. O **emissor de CSS vem logo depois**. Substitui a proposta de ordem "CSS primeiro" da seção 4. |
| D61 | **`compact(...)` removido.** Como as variantes de tela valem "a partir de" (D37), o que é escrito sem variante já vale para todos os tamanhos, inclusive o menor. As variantes de tela são só **`medium(...)` e `expanded(...)`**. O nome `compact` continua existindo como nome da faixa (na doc e no tema), mas não como variante. Ajusta a D29. |
| D62 | **`Box` é sempre flex em coluna**, na web e no React Native. `row` muda para linha. Assim o mesmo `look` produz o mesmo layout nas duas plataformas, e `center-x`/`center-y` (D38) têm tradução previsível. |
| D63 | **Atalhos (`define`, D36) ficam no arquivo de tema**, numa seção própria do `alanwind.config.ts`. Build, runtime e autocomplete leem do mesmo lugar. Não existe `define()` solto no código. |
| D64 | **Forçar o tema sem provider.** Além de seguir o sistema (D25), o alanwind oferece uma função para escolher o esquema, no formato `setColorScheme('light' \| 'dark' \| 'system')`, que funciona **sem envolver o app num Provider**. |
| D65 | **No HTML puro, o plugin de build reescreve o `look`** por uma classe gerada (ex.: `class="aw-x7f2"`) no HTML final, e o CSS usa essa classe. Funciona com qualquer variante agrupada (`hover(bg-raised shadow-md)`). No código-fonte continua existindo só o `look` (D42). O script da CDN (D55) faz o equivalente no navegador. |
| D66 | **Tipagem estrita entra na fase 1**, junto com o núcleo da D60: autocomplete e erro de tipo para classes e tokens inválidos desde o início (D20). Aviso de contraste, utilitários de acessibilidade e tema customizável **não** foram marcados para a fase 1 e serão distribuídos na divisão em fases. |
| D67 | **Monorepo com `packages/` e `apps/`.** Libs publicáveis ficam em `packages/` (`core`, `native`, `css`, `vite-plugin`, `cdn`, `cli`). O que roda e não é publicado fica em `apps/` (`playground-expo` para testar no RN, `site` para a documentação). Estrutura completa na seção 14. |
| D68 | **Nomes no npm: `alanwind` + `@alanwind/*`.** O pacote `alanwind` é a porta de entrada (D56) e reexporta o principal; os pacotes internos são publicados com escopo (`@alanwind/core`, `@alanwind/native`, `@alanwind/vite-plugin`…). O nome continua provisório (D12), então a disponibilidade no npm precisa ser conferida antes de publicar. |
| D69 | **Ferramentas de desenvolvimento**: pnpm workspaces, Turborepo (cache de build e testes), Vitest (testes), tsup (geração dos pacotes) e Biome (lint e formatação). São só ferramentas de desenvolvimento; a regra de zero dependências de runtime (D20) continua valendo para os pacotes publicados. |
| D70 | **Organização de `docs/`**: este arquivo (`00-visao-e-decisoes.md`) vira o índice da visão; `01-referencias-e-ideias.md` guarda as referências; `02-fases.md` guarda a divisão em fases; ADRs numerados em `docs/adr/` (`0001-typescript-monorepo.md`…); specs em `docs/specs/` (`sintaxe.md`, `tema.md`, `componentes.md`…). |
| D71 | **Time inicial de agentes, por função**: planejador (desde o início), implementador, QA, revisor e documentador. Sem divisão em "backend"/"frontend": o alanwind é uma biblioteca, e o agente de frontend só entra na fase 5 (site). Detalhes na seção 7. |
| D72 | **Skills**: as do projeto são montadas pelo Claude sob pedido do Alan, uma por vez, com explicação. Skills de código e de commit são do próprio Alan. Candidatas na seção 7. |
| D73 | **Fluxo de git**: duas skills do Alan, `conventional-commits` e `fluxo-de-branches` (em `.claude/skills/`). Commits em Conventional Commits, com tipo e escopo em inglês e descrição em português. Branches `main` (releases com tag), `develop` (integração) e `feature/`, `fix/`, `docs/`, `hotfix/` etc. PR para a branch de origem, corpo em português, **squash merge** feito pelo Alan. **Sem nenhuma atribuição ao Claude** em commits e PRs. |
| D74 | **Qualidade de código**: skill do Alan `codigo-limpo` (em `.claude/skills/`). Clean Code e Clean Architecture com pragmatismo: `core` é o domínio puro e sem API de plataforma; emissores são adaptadores; componentes, plugin, CDN e CLI são a borda; dependências apontam sempre para o `core`, e a IR é o contrato entre as camadas. Sem redundância (uma fonte da verdade, regra de três), sem código morto e sem arquivos mortos (Knip no CI). Identificadores e comentários do código em inglês; documentação em português. Confirma a proposta de regras de dependência da seção 14. |
| D75 | **Skills do alanwind são a fonte principal; skills externas são consulta e validação.** Agentes e tarefas seguem as skills de `.claude/skills/` do projeto. Skills instaladas globalmente (ex.: do pacote *superpowers*: `writing-plans`, `test-driven-development`, `requesting-code-review`, `brainstorming`) servem como **referência** ao montar as do projeto e como **validação** (segunda checagem), nunca como substitutas. Em conflito, vale a skill do alanwind. |

### 3.1 Alvo técnico de referência (Expo SDK 58)

Conforme a documentação do Expo: SDK 58 usa **React Native 0.88**, **react-native-web 0.21** e exige **Node.js 22.13 ou superior**. A *Strict TypeScript API* do React Native passou a ser o padrão, então os tipos do alanwind devem funcionar bem com ela. O React Native tem cerca de seis releases por ano, e o Expo acompanha esse ritmo, então a lib precisa de uma **política de suporte** (por exemplo, SDK atual e o anterior).

### 3.2 Como o runtime funciona (D15)

- O app renderiza um componente e chama o alanwind com a string de classes.
- Uma função **pura** lê a string, consulta o tema e devolve um **objeto de estilo** do React Native (por exemplo `{ padding: 16, backgroundColor: '#...' }`).
- Um **cache** (chave: string de classes + contexto, como tema, modo claro/escuro e largura da tela) guarda o resultado. A segunda vez que a mesma string aparece, a resposta vem pronta.
- Requisito: a função é **determinística** (mesma entrada, mesma saída). Isso permite rodar o mesmo código em build mais tarde, como otimização, sem mudar a API.
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

É bem mais simples e estável do que transformar `className` no build com Babel, e combina com a decisão de runtime.

## 4. Propostas ainda não confirmadas

Direções sugeridas na conversa, sem decisão do Alan:

- **Comando de configuração `npx alanwind init`** (consequência da D56): um comando que prepara o projeto sozinho (cria o arquivo de tema e liga o plugin de build), no estilo do `init` de outras libs. Faz parte do pacote `cli` já previsto. Ideia do alanwind, ainda sem decisão.
- **Ícone nos avisos `info`** (consequência da D48): o `info` azul e o `primary` azul são da mesma família, então o componente de aviso deveria trazer um ícone para não parecer um botão. Ideia do alanwind, ainda sem decisão.
- **Opacidade em cor livre (em aberto)**: com qualquer tom, `bg=red-40-50` fica ambíguo (o último número é tom ou opacidade?). Opções levantadas: barra (`bg=red-40/50`), proibir opacidade em cor livre (usar hex de 8 dígitos) ou classe separada. O Alan comentou que o 96 do exemplo era só ilustrativo; a decisão ainda não foi tomada.
- **CSS pré-gerado como extra da CDN**: um arquivo de CSS cobrindo só as classes simples (sem variantes agrupadas), além do script da D55. Opcional.
- **Arquitetura "um core, dois emissores"**: o core lê a classe e gera uma representação intermediária (IR) neutra. Um emissor gera **CSS** (web) e outro gera **objetos de estilo do React Native**.
- **Arquitetura por presets** (inspirada no UnoCSS): core enxuto e um `preset-default` com o vocabulário do alanwind.
- ~~**Ordem**: core + IR + emissor CSS primeiro~~ **Substituída pela D60** (React Native primeiro, CSS logo depois).
- **Desenhar o subconjunto portátil a partir do React Native**, que é o alvo mais restritivo.
- **Matriz de suporte** em três níveis: *core* (funciona nas duas plataformas), *web-only* e *native-only*, com aviso claro quando uma classe é usada na plataforma errada.
- **Tabela de tradução de variantes**: `hover` vira `:hover` na web e estado `pressed` no nativo (no celular não existe hover); `compact`/`medium`/`expanded` viram media query ou breakpoint por largura; `dark` vira `prefers-color-scheme` ou `useColorScheme`.
- **Tokens do tema numa única fonte da verdade**, alimentando os dois emissores; considerar o formato W3C Design Tokens.
- ~~**Monorepo pnpm**~~ **Decidido** (D67 a D69, estrutura na seção 14).
- **Geração sob demanda (JIT)** na web: escaneia os arquivos e gera só o que é usado (inclusive o atributo `look`, D42).
- **Entrega em três camadas**: (1) fundação, com core, emissor CSS e site mínimo; (2) mobile, com emissor RN e abas de React Native na doc; (3) vitrine, com galeria de templates, playground, theme builder e extensão de VS Code.
- Outras ideias de `01-referencias-e-ideias.md` ainda sem decisão: inspetor para depuração, trocar tema sem providers, otimizações de desempenho (cache por contexto, atualização de tema sem re-render).

## 5. Acessibilidade: princípios iniciais (candidatos a ADR)

- Paleta padrão só com combinações texto/fundo que passam no contraste **WCAG AA (4,5:1)**, validado por teste automático (isso vale para os dois temas, claro e escuro, e para os estados `-soft` e `-hover`; o hover mais claro é o que mais arrisca quebrar o par com o texto).
- **Aviso de contraste em desenvolvimento** para combinações declaradas no mesmo `look` (D32).
- **Foco visível** sempre, e o framework nunca remove o outline.
- Animações respeitam **reduzir movimento** (`prefers-reduced-motion` na web, `AccessibilityInfo` no RN).
- **Área de toque mínima** (cerca de 44 px na web e 44 a 48 dp no nativo).
- Texto em unidades que respeitam zoom e escala de fonte do sistema (`rem` na web, escala de fonte no RN).
- Fora do escopo do framework: HTML semântico e `aria-*`/props de acessibilidade, que são do usuário. A doc deve orientar.

## 6. Site de documentação (ideias)

- **Hospedagem: em aberto.** O Alan comentou que pensa em usar o **GitHub Pages**, mas pediu para **deixar para decidir depois**, quando ele avaliar melhor como isso vai funcionar. Nada decidido. Ponto a lembrar quando voltar ao assunto: o GitHub Pages só serve site estático, e em `usuario.github.io/alanwind` o caminho base muda os links e os arquivos (um domínio próprio evita isso).
- **Estilo (D11)**: minimalista e direto, mas bonito. Pouco ruído, hierarquia clara, exemplos logo de cara. O próprio visual é a demonstração do "bonito sem configurar", com o tema escuro como vitrine (D25). O site **herda o tema padrão da lib** (D43 a D52), então as decisões de cor, raio e sombra valem para ele também.
- **Docs**: getting started por ambiente (npm com Vite ou Next, CDN, Expo/React Native), referência de utilitários com exemplo ao vivo e saída gerada, guias de tema, variantes, modo escuro e acessibilidade, página de migração "vindo do NativeWind/Tailwind" (como a sintaxe é própria, vale incluir uma tabela de equivalências e, mais tarde, um codemod).
- **Galeria de templates**: blocos copiáveis (botões, formulários, cards, navbar, login, listas), cada um com aba Web e aba React Native e selo de acessibilidade validado por teste.
- **Playground**: web primeiro; React Native depois (via `react-native-web` ou Expo Snack).
- **Theme builder** (opcional): escolher cores e espaçamentos e baixar o `alanwind.config`.
- **Doc gerada a partir do código** (tokens e utilitários numa única fonte) e **exemplos da doc rodando como testes no CI**.
- Ferramenta sugerida: Astro Starlight ou Docusaurus no começo, migrando o visual para o próprio alanwind aos poucos (dogfooding). Hospedagem gratuita é possível (GitHub Pages, Vercel, Netlify), a escolher depois.

## 7. Agentes planejados (para treinar orquestração)

**Time inicial (D71)**: os agentes são divididos **por função no fluxo** (e, quando for treinar paralelismo, por fronteira da arquitetura), não em "backend" e "frontend", porque o alanwind é uma biblioteca.

| Agente | Papel | Pode editar |
|---|---|---|
| **Planejador** | Quebra uma fase em tarefas pequenas a partir das specs, no formato padrão de tarefa. Entra **desde o início**. | Só `docs/` |
| **Implementador** | Escreve o código de uma tarefa. Pode haver um por pacote (core, native) para treinar paralelismo. | Só o pacote da tarefa |
| **QA** | Escreve testes **a partir da spec, sem ver o código** (caixa-preta), tenta quebrar o parser, roda conformidade RN × web e checa acessibilidade. | Só arquivos de teste |
| **Revisor** | Confere o diff contra spec, ADRs, convenções e zero dependências. Devolve aprovado ou lista de problemas. | Nada |
| **Documentador** | Mantém specs e doc de uso em sincronia com o código; aponta decisões que não chegaram na spec. | Só `docs/` |

Ficam para depois: agente de frontend (só na fase 5, site), infra/CI e segurança (começam como skills, se precisar).

**Skills (D72)**: as skills do projeto são montadas pelo Claude **quando o Alan pedir uma por vez**, sempre com explicação de como funcionam. Candidatas: `registrar-decisao`, `escrever-adr`, `escrever-spec`, `adicionar-utilitario`, `teste-de-ouro`, `checar-contraste`. Skills de código e de commit são **do próprio Alan**.

Lista anterior de ideias (substituída pela tabela acima): arquiteto/planejador · implementadores por módulo · escritor de testes · revisor · verificador independente · agente de docs · infra/CI · segurança/dependências · agente de ADR.

Aprendizados que o Alan quer treinar: contratos claros entre agentes, paralelizar só o que é independente, loops de revisão com critério objetivo, controle de contexto.

**Plano do Alan**: a conversa sobre quais skills e agentes criar acontece **no Claude Code, depois que o escopo estiver pronto**. Este documento é a base para isso. O **MCP do alanwind** entra depois que a lib estiver funcionando corretamente (D20).

## 8. Artefatos a produzir antes dos agentes

1. Visão de 1 página.
2. ADRs iniciais: TS + monorepo; arquitetura IR + emissores; matriz de suporte por plataforma; runtime no React Native; API por componentes (D26, D40, D41, D53, D54); `look` em todo lugar (D42); distribuição por npm e CDN (D55, D56); princípios de acessibilidade; **gramática da sintaxe própria** (variantes, breakpoints, valor livre, opacidade, `define`, `center`); **modelo de cores** (paleta por tons + papéis, D33 a D35); zero dependências; tokens semânticos; **tema padrão** (D43 a D52).
3. Divisão do escopo (D39) **em fases**, com a lista de utilitários e componentes de cada fase.
4. Specs: sintaxe das classes, tema/config, saída por plataforma, CLI.
5. Estratégia de testes, com testes de ouro ("dado este input, a saída tem que ser exatamente esta").
6. `CLAUDE.md`/`AGENTS.md` com as convenções do repositório.

## 9. O que falta para fechar o escopo

Em ordem de prioridade:

1. ~~Fechar o modelo de cores~~ **Feito** (D33 a D35).
2. ~~Fechar a sintaxe~~ **Feito** (D36 a D38).
3. ~~Tema padrão~~ **Quase fechado** (D43 a D52). **Falta só** o detalhe fino: valores exatos das sombras, cores de `border-strong`/`border-focus`/`text-link`, e a conferência final de contraste de cada par (trabalho de spec e de teste automático).
4. ~~Escopo~~ **Definido** (D39). Falta **dividir em fases** (o que vem primeiro).
5. ~~Detalhes da API~~ **Feito no nível de decisão** (D40 a D42, D53 a D56). O que sobra é detalhe de spec (formato exato do mapa de props do `styled()`, como o script da CDN observa mudanças na página).
6. **Revisão do amigo**: o Alan pediu para **não mandar agora**. Fica para quando ele quiser; o feedback entra na seção 12.

Pode esperar:
- **Hospedagem do site de documentação** (o Alan pensa em GitHub Pages, decisão adiada; ver seção 6).
- **Política de suporte** de versões (SDK atual e anterior?) e navegadores.
- **Disponibilidade do nome**: a busca web não achou nenhum projeto chamado alanwind, mas isso não confirma. Checar `npm view alanwind` e `npm view @alanwind/core` (404 = livre), o GitHub e um domínio antes de publicar. O sufixo "-wind" é bem usado por projetos pequenos (miniwind, digiwind, litewind) e remete ao Tailwind, o que pode causar confusão de busca e de marca. Alternativas levantadas, caso o nome mude: alankit, alanstyle, alanui, alantokens, alanform.
- Licença.
- Política de versionamento (o vocabulário de classes é uma API pública).

## 10. Histórico

- 2026-11-25: conversa inicial. Definidos motivação, tese, TypeScript, inglês, web + mobile, primeiras entregas e ideia do site de docs.
- 2026-11-25: definido o estilo do site e da marca (minimalista, direto e bonito, D11).
- 2026-11-25: pesquisa de nome; alanwind mantido como nome provisório (D12).
- 2026-11-25: decidida a sintaxe própria (D13) e o alvo de referência Expo SDK 58 (D14).
- 2026-11-25: decidido runtime no React Native (D15) e o princípio de sintaxe prática e fácil de aprender (D16).
- 2026-11-25: aprovado o meio-termo da sintaxe, com identidade como requisito (D17), e as cinco fontes de identidade (D18). Definida a lista do que falta para fechar o escopo; conversa de skills e agentes fica para o Claude Code.
- 2026-11-25: decidida a regra de abreviação (D19). Iniciado o rascunho do vocabulário base (seção 11).
- 2026-11-25: pesquisa de outras libs (`01-referencias-e-ideias.md`). Aprovados zero dependências, tokens semânticos, tipagem estrita e MCP para depois (D20), e o posicionamento como alternativa com diferenciais próprios (D21). Rascunho de cor, tipografia, borda, raio e sombra.
- 2026-11-25: decididos os papéis de cor com versões suaves e estados de hover embutidos, pela preferência do Alan por cores escuras (D22). Corrigida uma afirmação anterior: variantes de plataforma já existem em outras libs. Criado doc de comparação com Tailwind para compartilhar.
- 2026-11-25: confirmado o prefixo `type-` (D23) e a separação entre `-hover` (estado) e `-soft` (baixa ênfase estática, não só para botões) (D24).
- 2026-11-25: decididos o tema que segue o sistema com escuro cuidado (D25), a API por componentes (D26) e a prop `look` (D27). O amigo do Alan gostou de `pad`.
- 2026-11-25: tratados os elementos parecidos com o Tailwind: variantes só com parêntese (D28), breakpoints `compact`/`medium`/`expanded` (D29) e valor livre com `=` (D30).
- 2026-11-25: decidida a opacidade com sufixo numérico (D31). Aprovada a ideia do aviso de contraste (D32).
- 2026-11-25: fechado o modelo de cores: paleta por tons de 0 a 100 e papéis (D33), paleta base fora das classes (D34), tema padrão completo com soma da configuração e tratamento de papel inexistente (D35). O aviso de contraste passa a cobrir cores livres.
- 2026-11-25: fechada a sintaxe: atalhos com `define` (D36), variantes de tamanho "a partir de" (D37) e três formas de `center` (D38).
- 2026-11-25: o Alan mencionou o GitHub Pages para o site e em seguida pediu para deixar a hospedagem **em aberto**, decidindo depois. Registrado como pendente, sem decisão.
- 2026-11-25: definido o escopo (tudo o que foi conversado, em fases; depois só ideias futuras e bugs; sem trocar o NativeWind de imediato) (D39). Resumo para o amigo adiado a pedido do Alan.
- 2026-11-25: fechada a API: lista de componentes (D40), `contentLook` e `styled()` (D41) e `look` em todo lugar, inclusive no HTML puro (D42), corrigindo a menção a `class` na D26.
- 2026-11-25: início do tema padrão: espaçamento até `pad-16` (D43), raios (D44), sombras com tratamento próprio no escuro (D45), `primary` vibrante em azul elétrico, opção C (D46) e semáforo com `warning` de texto escuro (D47).
- 2026-11-25: tema padrão quase fechado: `info` em azul, contra a sugestão do ciano (D48), tamanhos de `type-` e fonte do sistema (D49), fundo escuro cinza-grafite (D50), fundos claros (D51) e `secondary` neutro (D52).
- 2026-11-25: detalhes da API: o `style` vence o `look` e mapa de props no `styled()` (D53), look padrão no `styled()` como extra bacana para depois (D54), CDN como script e plugin de build para produção, ajustando a D4 (D55) e instalação por npm além da CDN, para qualquer projeto com bundler (D56).
- 2026-11-25 (Claude Code): primeira rodada de revisão. Decididos a herança de texto por contexto (D57), a regra de conflito entre classes (D58), `hover(...)` separado de `press(...)` (D59) e a fase 1 começando pelo React Native (D60).
- 2026-11-25 (Claude Code): segunda rodada. Removido `compact(...)` como variante (D61), `Box` sempre flex em coluna (D62), atalhos no arquivo de tema (D63) e troca de tema sem provider (D64).
- 2026-11-25 (Claude Code): terceira rodada. Plugin reescreve o `look` por classe gerada no HTML (D65) e tipagem estrita na fase 1 (D66). Opacidade em cor livre ficou em aberto (seção 4). Próximo passo escolhido: dividir o escopo em fases.
- 2026-11-25 (Claude Code): documento movido para `docs/`. Decididos o monorepo com `packages/` e `apps/` (D67), os nomes no npm (D68), as ferramentas de desenvolvimento (D69) e a organização de `docs/` (D70). Estrutura registrada na seção 14.
- 2026-11-25 (Claude Code): specs criadas em `docs/specs/` só com o já decidido. Definidos o time inicial de agentes por função, com planejador desde o início (D71), e o modo de montar skills (D72).
- 2026-11-25 (Claude Code): criadas as skills de git `conventional-commits` e `fluxo-de-branches` (D73).
- 2026-11-25 (Claude Code): criada a skill `codigo-limpo` (D74).
- 2026-11-25 (Claude Code): definido que as skills do projeto são a fonte principal e as externas servem de consulta e validação (D75).

## 11. Vocabulário base (rascunho em construção)

Regras: sintaxe `propriedade-valor` com hífen; escala de espaçamento em passos de 4 (`pad-4` = 16); abreviar só `w`, `h`, `x`, `y` (D19); valor livre com `=` (D30); variantes só com parêntese (D28). Nada aqui é definitivo até virar spec.

**Variantes** (rascunho)

| Grupo | Variantes |
|---|---|
| Estado | `hover(...)` (só onde há ponteiro), `press(...)` (pressionado, todas as plataformas) (D59), `focus(...)`, `disabled(...)` |
| Esquema de cor | `dark(...)`, `light(...)` (os papéis de cor já mudam sozinhos; estas servem para exceções) |
| Plataforma | `ios(...)`, `android(...)`, `web(...)`, `native(...)` |
| Tamanho de tela (D29, D37, D61) | `medium(...)`, `expanded(...)`; valem "a partir de" (`medium(...)` vale em `medium` e acima). Sem variante = todos os tamanhos. |
| Acessibilidade | `motion-safe(...)` |

Exemplo: `<Box look="col gap-2 pad-4 medium(row gap-6) bg-surface hover(bg-raised shadow-md)">`

**Layout** (rascunho)

| O que | Classes |
|---|---|
| Direção | `row`, `col` |
| Alinhamento | `center` (dois eixos), `center-x` (horizontal), `center-y` (vertical), `between`, `start`, `end` (D38) |
| Fluxo | `wrap`, `fill` (ocupa o espaço restante) |
| Espaço entre filhos | `gap-4` |

**Espaçamento** (D43)

| O que | Classes |
|---|---|
| Escala | `pad-0` a `pad-16`, em passos de 4 (`pad-1` = 4 px, `pad-16` = 64 px) |
| Interno | `pad-4`, `pad-x-4`, `pad-top-2` |
| Externo | `margin-4`, `margin-x-auto` |

**Tamanho** (rascunho)

| O que | Classes |
|---|---|
| Largura e altura | `w-full`, `h-10`, `size-10` (largura e altura iguais) |
| Valor livre | `w=137`, `pad=10`, `w=50%` |

**Atalhos** (D36)

`define('btn', 'bg-primary pad-4 round-md')` cria o atalho `btn`, usado como uma classe qualquer. Os atalhos são declarados no arquivo de tema (D63); o formato exato fica para a spec.

**Cor** (D46 a D52)

Regra: `bg-` é cor de fundo; `text-` é **só cor do texto** (o tamanho do texto usa `type-`, D23). Todo papel tem valores para claro e escuro (D20). Todo papel colorido tem um par `on-` com contraste garantido e variações embutidas `-soft` e `-hover` (D22, D24). A paleta base não aparece nas classes (D34).

| Grupo | Papéis |
|---|---|
| Fundos | `bg-page` (fundo do app), `bg-surface` (cards), `bg-raised` (elevado, como modais). No escuro: cinza-grafite (D50). No claro: página cinza bem clara e card branco (D51). |
| Marca | `bg-primary` (azul elétrico, D46), `bg-secondary` (cinza neutro, D52), com `text-on-primary`, `text-on-secondary` |
| Estados (semáforo, D47) | `bg-success` (verde), `bg-warning` (amarelo, texto escuro por cima), `bg-danger` (vermelho), `bg-info` (azul, D48), com `text-on-success` etc. |
| `-hover` (estado de elemento interativo) | `bg-primary-hover`: mesma ênfase, um pouco mais claro no tema escuro e mais escuro no claro (ex.: botão primário). No celular vira o estado pressionado. |
| `-soft` (baixa ênfase, estático) | `bg-danger-soft`, `bg-primary-soft`: avisos, selos, etiquetas, destaques, item selecionado. Não precisa ser botão. Também pode ser o fundo de hover de um botão fantasma ou item de lista: `hover(bg-primary-soft)`. |
| Opacidade na cor (D31) | `bg-primary-50`, `text-strong-50` (50 = 50% de opacidade) |
| Cor livre (D33) | `bg=red-96` (tom 96 do vermelho), `bg=#e11d48` (cor exata). Sem o par `on-`; o aviso de contraste (D32) cobre. |
| Texto | `text-strong` (títulos), `text-body` (padrão), `text-muted`, `text-subtle`, `text-link` |
| Bordas | `border-subtle`, `border-strong`, `border-focus` |
| Opacidade do elemento | `opacity-50` |

**Tipografia** (D23, D49)

O prefixo `type-` (de "type scale", a escala tipográfica) foi confirmado (D23). Motivo: no Tailwind, `text-lg` (tamanho) e `text-red-500` (cor) usam o mesmo prefixo, o que confunde quem está aprendendo.

| O que | Classes |
|---|---|
| Tamanho | `type-xs` 12, `type-sm` 14, `type-base` 16, `type-lg` 18, `type-xl` 20, `type-2xl` 24, `type-3xl` 30 |
| Peso | `weight-regular`, `weight-medium`, `weight-bold` |
| Alinhamento do texto | `align-left`, `align-center`, `align-right` |
| Altura da linha | `leading-tight`, `leading-normal`, `leading-loose` |
| Família | `font-sans`, `font-serif`, `font-mono` (padrão: fonte do sistema) |
| Estilo | `italic`, `underline`, `upper`, `lower` |
| Limite de linhas | `lines-2` (corta o texto em 2 linhas; `numberOfLines` no RN, equivalente em CSS na web) |

Os tamanhos de texto respeitam a escala de fonte do sistema (`rem` na web, escala de fonte no RN), conforme a seção 5.

**Borda, raio e sombra** (D44, D45)

| O que | Classes |
|---|---|
| Borda | `border` (1), `border-2`, mais cor com `border-subtle` etc. |
| Raio | `round-none` 0, `round-sm` 4, `round-md` 8, `round-lg` 12, `round-xl` 16, `round-full` (pílula ou círculo) |
| Sombra | `shadow-sm`, `shadow-md`, `shadow-lg`. No claro: sombra real. No escuro: fundo mais claro (`bg-raised`) mais borda fina, com sombra discreta (D45). Cada emissor traduz: `box-shadow` na web, propriedades de sombra no iOS e elevação no Android. |

## 12. Feedback de terceiros (separado das decisões)

- **Amigo do Alan (rigoroso em front-end, quem sugeriu a ideia do alanwind)**, 2026-11-25: gostou de `pad` em vez de `p`; concorda que não ficar igual ao Tailwind é o melhor. Revisão mais crítica da sintaxe ainda pendente, **adiada a pedido do Alan** (perguntas sugeridas: variantes só com parêntese, nomes de breakpoint, papéis de cor, `center`/`center-x`/`center-y`, utilitários de acessibilidade, `look` no HTML, CSS gerado).

## 13. Exemplo de tema de cores (modelo aprovado em D33 a D35; valores ilustrativos)

O **modelo** está decidido. Os valores de cor abaixo são **ilustrativos**; os valores finais virão do tema padrão.

```ts
// alanwind.config.ts (opcional: o tema padrão já traz tudo isto)
export default defineTheme({
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

O que o alanwind **gera sozinho** para cada papel (exemplo com `danger`; os tons de `-soft` e `-hover` são regras propostas, a definir no tema padrão):

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

<Pressable look="bg-danger text-on-danger hover(bg-danger-hover) tap-target focus-ring">

<Box look="bg=red-96 dark(bg=red-20)">   // tom livre, sem mexer no tema
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

Regras de dependência entre pacotes (proposta, a confirmar num ADR): `core` não depende de nenhum outro pacote; `native` e `css` dependem só de `core`; `vite-plugin` e `cdn` dependem de `css`; `alanwind` só reexporta.
