---
name: codigo-limpo
description: Use ao escrever, alterar, refatorar ou revisar código TypeScript do alanwind (packages/ e apps/). Define as regras de Clean Code e Clean Architecture do projeto, a regra de dependência entre pacotes, e como evitar redundância, código morto e arquivos mortos. Também serve de checklist antes de dar uma tarefa de código por concluída.
---

# Código limpo no alanwind

O código deve ser **limpo, simples e sem sobras**. Clean Code e Clean
Architecture são o guia, aplicados com pragmatismo: o alanwind é uma biblioteca,
não um sistema corporativo. Abstração que não resolve um problema real também é
sujeira.

## 1. Arquitetura (Clean Architecture aplicada ao alanwind)

### Camadas

| Camada | No alanwind | Pode conhecer |
|---|---|---|
| **Domínio** (regras do negócio) | `packages/core`: parser, IR, tema, regra de conflito, cálculo de cores | Nada de fora. Só TypeScript puro. |
| **Adaptadores** (traduzem o domínio para um mundo externo) | `packages/native` (emissor RN), `packages/css` (emissor CSS) | `core` |
| **Infra / frameworks** (ponta de entrada) | componentes React/RN, `vite-plugin`, `cdn`, `cli` | `core` e o adaptador que usam |
| **Fachada** | `packages/alanwind` | Só reexporta. Sem lógica. |

### Regra de dependência

**As dependências apontam sempre para dentro, em direção ao `core`.**

- `core` **não importa** de nenhum outro pacote do alanwind, nem de `react`,
  `react-native`, DOM, `node:*` ou qualquer API de plataforma.
- `native` e `css` dependem só de `core`. Um emissor **nunca** importa do outro.
- `vite-plugin` e `cdn` dependem de `css`.
- Se algo do `core` precisar de um recurso de plataforma (ex.: saber o esquema
  de cor), o `core` **define a interface** e a camada de fora **fornece a
  implementação**.

### O contrato entre as camadas é a IR

Parser → IR → emissor. Emissores só conhecem a IR, nunca a string do `look` nem
detalhes do parser. Mudar o parser não pode exigir mudança nos emissores, e
vice-versa (ver `docs/specs/funcionamento-interno.md`).

### Pureza e efeitos nas bordas

- O `core` é feito de **funções puras e determinísticas** (D15): mesma entrada,
  mesma saída, sem estado global escondido.
- Efeitos colaterais (cache, leitura de `useColorScheme`, largura da tela,
  acesso a arquivo, DOM) ficam **na borda**, nos adaptadores e na infra.

### Zero dependências de runtime

Pacotes publicados não têm `dependencies` de terceiros (D20). `react` e
`react-native` entram como `peerDependencies`. Dependências de desenvolvimento
são livres.

## 2. Clean Code

### Nomes
- Identificadores, comentários e mensagens de erro de código **em inglês**, como
  os nomes de classe (D7). A documentação continua em português.
- Nomes dizem **o que é**, não como é feito: `resolveLook`, `parseVariant`,
  `contrastRatio`. Nada de `data`, `info`, `handle`, `temp`, `x2`.
- Booleanos como pergunta: `isDark`, `hasVariant`.
- Use o vocabulário do glossário e das specs (token, variant, role, tone,
  emitter, IR). Um conceito, um nome, em todo o código.

### Funções
- **Uma responsabilidade.** Se precisa de "e" para descrever, divida.
- Curtas e num só nível de abstração.
- **Retorno antecipado** em vez de `if` aninhado.
- Sem parâmetro booleano que muda o comportamento (`emit(ir, true)`). Crie duas
  funções ou use um objeto de opções nomeado.
- Mais de 3 parâmetros vira um objeto.

### Tipos
- `strict` ligado. **Sem `any`**; use `unknown` e estreite o tipo.
- Prefira tipos que tornam estados inválidos impossíveis (uniões discriminadas)
  a checagens em runtime.
- Dados **imutáveis** por padrão (`readonly`, sem mutar argumentos).

### Valores
- **Sem números e cores mágicos.** Escalas, cores e limites vêm do tema ou de
  constantes nomeadas (`MIN_CONTRAST_AA = 4.5`).

### Erros
- Erros com **código e mensagem clara** (ex.: `AW001`), definidos num só lugar.
- Nunca engolir erro em silêncio. Em produção, o comportamento de "ignorar"
  (D35) é uma decisão explícita no código, não um `catch {}` vazio.

### Comentários
- O código explica **o quê**; comentário explica **por quê** (decisão,
  limitação, referência: `// D58: the more specific class wins`).
- Sem comentário que repete o código. Sem código comentado.

## 3. Sem redundância

- **Uma fonte da verdade.** O vocabulário (classes, tokens, escalas) fica
  definido **uma vez** e alimenta parser, tipos, emissores e documentação. Nunca
  copiar uma tabela de valores para outro arquivo.
- **Regra de três**: na primeira repetição, tolere; na terceira, extraia.
  Abstrair cedo demais cria acoplamento pior que a repetição.
- Antes de criar uma função utilitária, **procure se já existe** no pacote ou no
  `core`.
- Sem pasta `utils/` genérica virando depósito. Utilitário mora perto de quem
  usa, ou num módulo com nome do assunto (`color/`, `units/`).

## 4. Sem código morto nem arquivos mortos

- **Apague**, não comente. O git guarda o histórico.
- Nenhuma exportação, função, tipo, variável ou parâmetro sem uso.
- Nenhum arquivo que não é importado por ninguém (nem por testes ou pela
  fachada).
- Nenhuma dependência listada no `package.json` sem uso.
- Ao remover ou substituir algo, **remova também** os testes, tipos, exports e
  docs que só existiam por causa dele.
- Sem `TODO` solto. Se algo ficou para depois, vira tarefa ou entra em
  "Observações" na PR.
- Sem `console.log` de depuração. Avisos de desenvolvimento passam pelo
  mecanismo de aviso do alanwind.
- Ferramentas que garantem isso no CI: `noUnusedLocals` e `noUnusedParameters`
  no TypeScript, regras de não usado do Biome e **Knip** (acha arquivos, exports
  e dependências sem uso).

## 5. Checklist antes de concluir uma tarefa

- [ ] Nenhum import quebra a regra de dependência (seção 1).
- [ ] `core` continua puro, sem API de plataforma.
- [ ] Nenhum valor duplicado de uma fonte da verdade.
- [ ] Nenhum código, export, arquivo ou dependência sem uso (Knip limpo).
- [ ] Tipos estritos, sem `any`.
- [ ] Testes cobrem o comportamento novo, e testes de código removido foram
      removidos.
- [ ] Nomes seguem o glossário e as specs.
- [ ] Nada de código comentado, `console.log` ou `TODO` solto.

## 6. Quando não exagerar

- Não crie interface, classe ou camada "para o futuro". Crie quando houver a
  segunda implementação real.
- Não quebre uma função clara de 15 linhas em cinco de 3 só para ficar
  "pequena".
- Na dúvida entre mais abstrato e mais simples, escolha o mais simples e
  explique na PR.
