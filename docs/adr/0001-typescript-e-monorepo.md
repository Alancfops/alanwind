# 0001. TypeScript e monorepo

- **Status**: aceito
- **Data**: 2026-11-25
- **Decisões de origem**: D3, D20, D67, D68, D69

## Contexto

O alanwind é uma biblioteca de estilo para web e mobile, com vários pacotes
publicáveis (núcleo, emissores, plugin de build, CDN, CLI) e apps que só rodam
(playground e site de documentação). Era preciso fixar a linguagem, a
organização do repositório, os nomes publicados e as ferramentas de
desenvolvimento. O nome "alanwind" continua provisório (D12), então a
disponibilidade no npm ainda precisa ser conferida antes de publicar (D68).

**TypeScript** foi escolhido pela tipagem estrita e pelo autocomplete: é isso
que permite tratar classes e tokens inválidos como erro de tipo (D3, D20, D66).
A regra de **zero dependências de runtime** vem da mesma motivação do projeto, a
**independência**: não depender de bibliotecas de terceiros que podem parar de
ser mantidas (D20, seção 1 da visão).

## Decisão

- **Linguagem**: TypeScript (D3).
- **Monorepo com `packages/` e `apps/`** (D67). Libs publicáveis ficam em
  `packages/` (`core`, `native`, `css`, `vite-plugin`, `cdn`, `cli`, além da
  porta de entrada `alanwind`). O que roda e não é publicado fica em `apps/`
  (`playground-expo` e `site`). A estrutura completa está na seção 14 do
  documento de visão.
- **Nomes no npm: `alanwind` + `@alanwind/*`** (D68). O pacote `alanwind` é a
  porta de entrada e reexporta o principal; os pacotes internos são publicados
  com escopo (`@alanwind/core`, `@alanwind/native`, `@alanwind/vite-plugin`...).
- **Ferramentas de desenvolvimento** (D69): pnpm workspaces, Turborepo (cache de
  build e testes), Vitest (testes), tsup (geração dos pacotes) e Biome (lint e
  formatação).
- **Zero dependências de runtime** nos pacotes publicados (D20). As ferramentas
  da D69 são só de desenvolvimento e não afetam essa regra.

## Alternativas consideradas

As alternativas abaixo foram as opções apresentadas ao Alan na conversa de
2026-11-25 em que D67 a D69 foram decididas; os motivos são os que acompanharam
a opção escolhida.

- **Estrutura (D67)**
  - *Monorepo só com `packages/`* (site e playground junto com as libs):
    descartado para separar o que é publicado do que só roda.
  - *Pacote único* com subpastas (`alanwind/native`, `alanwind/vite`): mais
    simples, mas mistura dependências de React Native e de Vite no mesmo pacote.
- **Nomes no npm (D68)**
  - *Só `@alanwind/*`*, sem pacote `alanwind` solto: descartado porque a D56
    prevê `npm install alanwind` como porta de entrada.
  - *Decidir depois*: descartado; o nome provisório (D12) já fica registrado
    como risco.
- **Ferramentas (D69)**
  - *pnpm puro + Vitest + tsc*, sem Turborepo: menos peças, mas builds e testes
    mais lentos quando o monorepo crescer (sem cache).
  - *Bun workspaces*: mais rápido, porém menos maduro com Expo/Metro, que é o
    alvo principal (D14).

## Consequências

- Positivas:
  - Tipagem estrita de classes e tokens, com autocomplete, fica ao alcance
    (D20).
  - Os pacotes publicados não trazem dependências para quem instala (D20).
  - Os nomes `alanwind` e `@alanwind/*` dão uma porta de entrada única e pacotes
    internos separados (D68).
- Negativas / custos:
  - Zero dependências de runtime obriga a implementar internamente o que seria
    delegado a bibliotecas (D20).
  - O nome é provisório (D12): se mudar, os nomes dos pacotes mudam junto.
  - Disponibilidade dos nomes no npm ainda não conferida (D68).
- O que isso obriga a fazer depois:
  - Conferir os nomes no npm antes de publicar (D68).
  - O revisor confere a regra de zero dependências de runtime em cada diff.
  - Configurar `pnpm-workspace.yaml`, `turbo.json` e `biome.json` conforme a
    seção 14.
  - O ADR 0002 trata da regra de dependência entre os pacotes.
