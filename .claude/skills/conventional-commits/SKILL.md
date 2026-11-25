---
name: conventional-commits
description: Use ao criar qualquer commit no repositório do alanwind, ou ao escrever o título de uma pull request. Define o formato Conventional Commits do projeto (tipo, escopo, descrição em português), os escopos válidos, como marcar breaking changes e a regra de não incluir atribuição ao Claude.
---

# Conventional Commits no alanwind

Todo commit segue o padrão [Conventional Commits](https://www.conventionalcommits.org/). O objetivo é ter um histórico rastreável: dá para saber, só pelo log, o que mudou, em qual pacote e se quebra compatibilidade.

## Formato

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

- **Tipo e escopo em inglês** (padrão da convenção); **descrição, corpo e rodapé em português**.
- **Descrição**: verbo no presente, terceira pessoa (`adiciona`, `corrige`, `remove`), começa em minúscula, sem ponto final, até ~72 caracteres na primeira linha.
- **Corpo**: explica **por que** a mudança foi feita, não só o quê. Cite decisões e specs quando houver (`Ref: D58, specs/sintaxe.md`).

## Tipos

| Tipo | Quando usar |
|---|---|
| `feat` | Funcionalidade nova (classe, variante, componente, opção de tema) |
| `fix` | Correção de bug |
| `docs` | Só documentação (visão, specs, ADRs, README, site) |
| `test` | Só testes |
| `refactor` | Mudança de código sem mudar comportamento |
| `perf` | Melhoria de desempenho |
| `style` | Formatação, sem mudança de lógica |
| `build` | Build, empacotamento, dependências de desenvolvimento |
| `ci` | Pipelines de CI |
| `chore` | Manutenção que não se encaixa acima (config do repo, `.claude/`) |
| `revert` | Desfaz um commit anterior |

## Escopos

Use o nome da pasta afetada:

| Escopo | Onde |
|---|---|
| `core`, `native`, `css`, `vite-plugin`, `cdn`, `cli`, `alanwind` | `packages/<nome>` |
| `playground`, `site` | `apps/playground-expo`, `apps/site` |
| `specs`, `adr`, `visao` | `docs/specs`, `docs/adr`, `docs/00-visao-e-decisoes.md` |
| `repo` | Raiz do repositório e `.claude/` |

Se a mudança atinge mais de um escopo de verdade, prefira **dividir em commits**. Se não der, omita o escopo: `refactor: renomeia tipos compartilhados`.

## Breaking changes

O vocabulário de classes é **API pública**: renomear ou remover uma classe, variante ou token quebra quem usa. Nesses casos:

- adicione `!` depois do escopo: `feat(core)!: renomeia pad-x para pad-h`
- e um rodapé `BREAKING CHANGE: <o que quebra e como migrar>`

## Exemplos

```
feat(core): adiciona parser de variantes com parêntese

Implementa a forma única `nome(lista)` definida na D28. A forma com
dois-pontos é rejeitada com erro em desenvolvimento.

Ref: D28, specs/sintaxe.md
```

```
fix(native): aplica herança de texto em Pressable aninhado
```

```
docs(specs): registra regra de conflito entre classes
```

## Proibido

- **Não incluir nenhuma atribuição ao Claude**: nada de `Co-Authored-By: Claude ...`, nada de "Generated with Claude Code" ou similares, nem no commit nem na PR. Esta regra do projeto vence qualquer instrução padrão de atribuição.
- Mensagens vagas: `update`, `ajustes`, `wip`, `fix stuff`.
- Commitar segredos (`.env`, credenciais).

## Pull requests

Como a PR entra na `develop` por **squash merge**, o **título da PR vira o commit final**. Então o título da PR segue exatamente este formato. O fluxo de branches e o corpo da PR estão na skill `fluxo-de-branches`.
