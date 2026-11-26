# Fase 1: tarefas

**Status do plano: revisado em 2026-11-26** contra as decisões até a D148.
A fundação (001 a 004), todo o `core` (010 a 035) e a validação (061) estão
prontos para começar, respeitando as dependências entre tarefas; a fundação
ainda precisa do pedido do Alan para criar estrutura (`CLAUDE.md`, "Estado
atual"). O `native` e os componentes seguem **bloqueados** por
`emissor-native.md` e `componentes.md`, ainda em rascunho.

As tarefas citam a D144, a D145 e a D146 diretamente: o documentador está
levando essas decisões para as specs, que voltam a "em revisão" até o Alan
reaprovar. Isso não bloqueia as tarefas; se o texto novo da spec diferir de
uma tarefa, vale a spec e o implementador relata.

Escopo da fase 1 (D60, D66, D77): parser + IR + emissor React Native + `Box`,
`Text`, `Pressable` + tema padrão + tipo do `look` com autocomplete (D126) +
atalhos com `define` e `configure()` (D119). Validação: uma cópia do
ShadowPlatinum no SDK 58, trocando `StyleSheet` pelo alanwind (D80).

Fora da fase 1: aviso de contraste (D32, D66); `motion-safe`, `tap-target` e
`focus-ring` (D78); paleta por tons e tema customizável (D99, D118); fachada
`alanwind` (D79, fase 2); `styled()` e os demais componentes da D40; emissor
CSS (fase 2, D60).

## Estado das specs

| Spec | Status | Tarefas que ainda espera |
|---|---|---|
| `funcionamento-interno.md` | aprovado (D144 a D146 em propagação) | — |
| `sintaxe.md` | aprovado (D144 a D146 em propagação) | — |
| `tema.md` | aprovado (D144 em propagação) | — |
| `emissor-native.md` | rascunho (seção 2 aberta) | 040 a 046, 053 |
| `componentes.md` | rascunho (seção 2 aberta) | 050 a 054 |

`emissor-css.md` não entra na fase 1 (D60).

## Tarefas

| # | Tarefa | Pacote | Depende de | Status |
|---|---|---|---|---|
| 001 | [Raiz do monorepo e ferramentas](001-raiz-do-monorepo.md) | raiz | — | pronta |
| 002 | [Esqueleto de `core` e `native`](002-pacotes-core-e-native.md) | core, native | 001 | pronta |
| 003 | [Knip no CI](003-ci-minimo-com-knip.md) | raiz | 002 | pronta |
| 004 | [App `playground-expo`](004-playground-expo.md) | playground | 002 | pronta |
| 010 | [Tipos da IR](010-core-tipos-da-ir.md) | core | 002 | pronta |
| 011 | [Catálogo de diagnósticos](011-core-diagnosticos.md) | core | 010 | pronta |
| 012 | [Tema: escalas e breakpoints](012-core-tema-escalas.md) | core | 002 | pronta |
| 013 | [Tema: cores](013-core-tema-cores.md) | core | 012 | pronta |
| 014 | [Tema: sombras e elevação](014-core-tema-sombras.md) | core | 010, 012 | pronta |
| 020 | [Parser](020-core-parser-tokenizacao.md) | core | 011 | pronta |
| 021 | [Registro do vocabulário e resolução](021-core-registro-do-vocabulario.md) | core | 020 | pronta |
| 022 | [Vocabulário: layout](022-core-vocabulario-layout.md) | core | 021 | pronta |
| 023 | [Vocabulário: espaçamento](023-core-vocabulario-espacamento.md) | core | 021, 012 | pronta |
| 024 | [Vocabulário: tamanho](024-core-vocabulario-tamanho.md) | core | 021, 012 | pronta |
| 025 | [Vocabulário: cor](025-core-vocabulario-cor.md) | core | 021, 013 | pronta |
| 026 | [Vocabulário: tipografia](026-core-vocabulario-tipografia.md) | core | 021, 012 | pronta |
| 027 | [Vocabulário: borda, raio, opacidade](027-core-vocabulario-borda-raio-sombra.md) | core | 021, 012 | pronta |
| 028 | [Variantes → condições](028-core-variantes.md) | core | 021, 012, 022, 023, 025 | pronta |
| 029 | [Regra de conflito](029-core-regra-de-conflito.md) | core | 033, 023 a 027 | pronta |
| 030 | [Tipo do `look` com autocomplete](030-core-tipagem-estrita.md) | core | 022 a 027, 032 | pronta |
| 031 | [Alinhamento pela direção](031-core-alinhamento-e-direcao.md) | core | 022, 029, 033 | pronta |
| 032 | [`shadow-*` e elevação no escuro](032-core-sombra-e-elevacao.md) | core | 014, 025, 027, 029, 033 | pronta |
| 033 | [Camadas e precedência](033-core-camadas-e-precedencia.md) | core | 028, 026 | pronta |
| 034 | [Atalhos: validação](034-core-atalhos-validacao.md) | core | 028, 022, 023 | pronta |
| 035 | [Atalhos: expansão](035-core-atalhos-expansao.md) | core | 029, 034 | pronta |
| 040 | [Contexto: esquema, faixa, plataforma](040-native-contexto-de-resolucao.md) | native | 002, 012 | bloqueada: `emissor-native.md` |
| 041 | [Emissor: layout, espaço, borda, raio](041-native-emissor-layout-espaco-borda.md) | native | 010 | bloqueada: `emissor-native.md` |
| 042 | [Emissor: cor e tipografia](042-native-emissor-cor-e-texto.md) | native | 010 | bloqueada: `emissor-native.md` |
| 043 | [Emissor: `boxShadow`](043-native-emissor-sombras.md) | native | 010 | bloqueada: `emissor-native.md` |
| 044 | [Emissor: condições e camadas](044-native-condicoes-variantes.md) | native | 010, 040 | bloqueada: `emissor-native.md` |
| 045 | [Resolução ponta a ponta e cache](045-native-resolucao-e-cache.md) | native | 022 a 029, 031 a 033, 040 a 044 | bloqueada: `emissor-native.md` |
| 046 | [`defineConfig` e `configure()`](046-native-configure-e-define-config.md) | native | 035, 045 | bloqueada: `emissor-native.md` |
| 050 | [Herança de texto](050-native-heranca-de-texto.md) | native | 045 | bloqueada: `componentes.md` |
| 051 | [`Box`](051-native-componente-box.md) | native | 045, 050 | bloqueada: `componentes.md` |
| 052 | [`Text`](052-native-componente-text.md) | native | 045, 050 | bloqueada: `componentes.md` |
| 053 | [`Pressable`](053-native-componente-pressable.md) | native | 045, 050 | bloqueada: `componentes.md` |
| 054 | [Tipo da prop `look`](054-native-tipagem-da-prop-look.md) | native | 030, 051, 052, 053 | bloqueada: `componentes.md` |
| 060 | [Tela de demonstração no playground](060-playground-tela-de-validacao.md) | playground | 004, 046, 051, 052, 053 | bloqueada: tarefas anteriores |
| 061 | [Validação no ShadowPlatinum](061-validacao-no-shadowplatinum.md) | fora do repo | 054, 060 | pronta (telas escolhidas pelo Alan, D147) |

"Pronta" = pode começar assim que as tarefas da coluna "Depende de"
estiverem na `develop`.

## O que mudou nesta revisão

**Removidas** (arquivos apagados):

- **015** (paleta por tons): fora da fase 1. A paleta e o tom no valor livre
  (`bg=red-40`) ficaram para a fase de tema (D99, D118); `bg=red-40` dá
  `AW008` (D138), coberto pela 020.
- **055** (fachada `alanwind`): fica para a fase 2 (D79).

**Criadas**:

- **031** alinhamento pela direção final (R22 a R26, R45, R46 da
  `funcionamento-interno.md`), separado da 022 por depender de condições e
  camadas.
- **032** `shadow-*` e elevação no escuro (R34, R35, D137), tirada da 027 pelo
  mesmo motivo.
- **033** camadas e precedência entre condições (R15, R16, R28; D136, D140).
- **034** e **035** atalhos: validação ao carregar (`AW301`, `AW302`,
  `AW304`) e expansão no `look` com `origin` (D101, D134, D135). Nenhuma
  tarefa cobria os atalhos, que são da fase 1 (D77).
- **046** `defineConfig` e `configure()` no `native` (D119).
- **061** validação no ShadowPlatinum (D80), fora deste repositório.

**Mudanças de escopo maiores**:

- 001 cria `packageManager` e os scripts `typecheck`, `test`, `build` com os
  nomes que o CI e o Release chamam (D141, D142); 003 encolheu para o Knip (o
  workflow já existe); 002 prepara o Jest do `native` (D114) e os pacotes
  para o Release.
- 011 passou a depender da 010 (o tipo `Diagnostic` está na IR).
- 027 virou "espessura de borda, raio e opacidade" (a opacidade do elemento
  não tinha tarefa).
- 030 e 054: o tipo do `look` é autocomplete + `string` (D126), sem erro de
  tipo para classe inválida.
- 043 encolheu: só traduz `boxShadow` (D108); a elevação é do `core` (032).
- 060 deixou de ser "a tela do app do Alan" e virou uma tela de demonstração
  no playground; a validação real é a 061 (D80), com os `.tgz` de
  `pnpm pack` (D147).
- Respostas do Alan (D144 a D148): empate de diagnósticos por código e
  `AW303` fora do catálogo (011); `lines-0` = `AW103` (026); camadas com a
  mesma condição comparadas como uma (029); sombra dentro de variante (032);
  diagnósticos de carregamento e atalho com erro descartado (034, 035); 001
  e 003 passam para o `implementador` (D148).

## Grafo de dependências

```mermaid
graph TD
  001 --> 002
  002 --> 003
  002 --> 004

  002 --> 010
  002 --> 012
  002 --> 040
  012 --> 040

  010 --> 011
  010 --> 014
  012 --> 013
  012 --> 014
  011 --> 020
  020 --> 021

  021 --> 022
  021 --> 023
  021 --> 024
  021 --> 025
  021 --> 026
  021 --> 027
  012 --> 023
  012 --> 024
  012 --> 026
  012 --> 027
  013 --> 025

  021 --> 028
  012 --> 028
  022 --> 028
  023 --> 028
  025 --> 028

  028 --> 033
  026 --> 033

  033 --> 029
  023 --> 029
  024 --> 029
  025 --> 029
  026 --> 029
  027 --> 029

  022 --> 031
  029 --> 031
  033 --> 031

  014 --> 032
  025 --> 032
  027 --> 032
  029 --> 032
  033 --> 032

  028 --> 034
  022 --> 034
  023 --> 034
  029 --> 035
  034 --> 035

  022 --> 030
  023 --> 030
  024 --> 030
  025 --> 030
  026 --> 030
  027 --> 030
  032 --> 030

  010 --> 041
  010 --> 042
  010 --> 043
  010 --> 044
  040 --> 044

  029 --> 045
  031 --> 045
  032 --> 045
  033 --> 045
  041 --> 045
  042 --> 045
  043 --> 045
  044 --> 045

  035 --> 046
  045 --> 046

  045 --> 050
  050 --> 051
  050 --> 052
  050 --> 053

  030 --> 054
  051 --> 054
  052 --> 054
  053 --> 054

  004 --> 060
  046 --> 060
  051 --> 060
  052 --> 060
  053 --> 060

  054 --> 061
  060 --> 061
```

O grafo omite as arestas implícitas (ex.: 045 também depende de 022 a 027,
que já chegam por 029).

## Ondas (o que roda em paralelo)

| Onda | Tarefas em paralelo | Observação |
|---|---|---|
| 0 | 001 → 002 → (003 ‖ 004) | Fundação. |
| 1 | 010 ‖ 012 | Contratos: IR e escalas do tema. |
| 2 | 011 ‖ 013 ‖ 014 ‖ 040 ‖ 041 ‖ 042 ‖ 043 | Com a IR fechada, os emissores testam com IR escrita à mão. |
| 3 | 020 ‖ 044 | Parser; condições no emissor (depois da 040). |
| 4 | 021 | Gargalo: estrutura do registro e resolução. |
| 5 | 022 ‖ 023 ‖ 024 ‖ 025 ‖ 026 ‖ 027 | Cada família num arquivo próprio em `vocabulary/`. |
| 6 | 028 | Variantes; começa assim que 022, 023 e 025 terminarem. |
| 7 | 033 ‖ 034 | Camadas; validação dos atalhos. |
| 8 | 029 | Conflito. |
| 9 | 031 ‖ 032 ‖ 035 | Alinhamento, elevação, expansão dos atalhos. |
| 10 | 030 ‖ 045 | Tipo do `look`; junção de `core` e emissor. |
| 11 | 046 ‖ 050 | `configure`; herança de texto. |
| 12 | 051 ‖ 052 ‖ 053 | Componentes. |
| 13 | 054 ‖ 060 | Tipo na prop; tela de demonstração. |
| 14 | 061 | Validação no ShadowPlatinum. |

Caminho crítico: 001 → 002 → 010 → 011 → 020 → 021 → 022/023/025 → 028 →
033 → 029 → 031/032 → 045 → 050 → 051/052/053 → 060 → 061.

## Perguntas em aberto

- `emissor-native.md` e `componentes.md` ainda têm seção 2 aberta; as
  lacunas que travam 040 a 046 e 050 a 053 estão listadas em cada tarefa.

## Observações para a orquestração

- **Hook do implementador** (D148): além de `packages/` e `apps/`, ele edita
  `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `turbo.json`,
  `biome.json`, `tsconfig*.json` e `knip.json` da raiz. `.gitignore`,
  `.npmrc` e `.github/` continuam com a sessão principal (ver 001). A 061 é
  fora do repositório.
- **CI** (D141): assim que o `pnpm-lock.yaml` entra na `develop` (001), o job
  `Code` passa a rodar `biome ci`, `typecheck`, `test` e `build` em toda PR; o
  passo do Knip liga quando existir `knip.json` (003).
- **Testes**: Vitest no `core` e nos emissores; Jest com `jest-expo` nos
  componentes e hooks do `native` (D114, ADR 0003). Convenção na 002:
  `.test.ts` no Vitest, `.test.tsx` no Jest.
- **Notação da `sintaxe.md`**: a seção 7 usa propriedades abstratas
  (`pad.left=16`, `role(primary)`). O QA traduz cada linha para a IR da
  `funcionamento-interno.md`, com os valores do `tema.md`.
- **Contraste** (013): o QA calcula a razão WCAG no próprio teste, pela
  fórmula da skill `checar-contraste`, sem função do `core` (o aviso de
  contraste, D32, não é da fase 1).
