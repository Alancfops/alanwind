---
name: fluxo-de-branches
description: Use ao começar qualquer trabalho novo no alanwind (funcionalidade, correção, documentação), ao decidir de qual branch partir, ao abrir uma pull request ou ao preparar uma versão. Define o modelo main/develop/feature, os nomes de branch, a PR em português e o que nunca fazer direto nas branches principais.
---

# Fluxo de branches no alanwind

Modelo baseado no Git Flow, simplificado para uma biblioteca publicada no npm.

## Branches permanentes

| Branch | Para que serve | Quem escreve nela |
|---|---|---|
| `main` | Só versões publicadas. Cada merge aqui é uma release, marcada com tag (`v0.3.0`). | Só via PR de `develop` ou de `hotfix/*` |
| `develop` | Integração: onde as funcionalidades prontas se juntam. | Só via PR |

**Nunca** commitar direto em `main` ou `develop`. **Nunca** usar `push --force`
nelas.

## Branches de trabalho

Toda tarefa nova abre uma branch a partir da branch de onde ela vai voltar
(normalmente `develop`):

| Prefixo | Uso | Parte de | Volta para |
|---|---|---|---|
| `feature/` | Funcionalidade nova | `develop` | `develop` |
| `fix/` | Correção de algo que ainda não foi publicado | `develop` | `develop` |
| `docs/` | Só documentação | `develop` | `develop` |
| `refactor/`, `test/`, `chore/` | Os tipos equivalentes do Conventional Commits | `develop` | `develop` |
| `hotfix/` | Correção urgente de algo **já publicado** | `main` | `main` **e** `develop` |

Se uma branch for criada a partir de outra branch de trabalho (ex.: uma
`feature/` que depende de outra ainda não integrada), a PR volta **para a branch
de onde ela saiu**.

**Nome**: `<prefixo>/<escopo>-<descricao-curta>`, em minúsculas, com hífen, sem
acento. Exemplos: `feature/core-parser-variantes`, `fix/native-heranca-texto`,
`docs/specs-sintaxe`.

O escopo é o mesmo da skill `conventional-commits`.

## Passo a passo de uma funcionalidade

1. Atualizar a base: `git switch develop && git pull`.
2. Criar a branch: `git switch -c feature/core-parser-variantes`.
3. Trabalhar em commits pequenos, seguindo a skill `conventional-commits`.
4. Antes de abrir a PR: testes, tipos e lint passando.
5. Enviar: `git push -u origin feature/core-parser-variantes`.
6. Abrir a PR **para a branch de origem** (normalmente `develop`):
   `gh pr create --base develop`.
7. **Não fazer o merge.** Quem aprova e faz o merge é o Alan. O merge é feito
   por **squash**.
8. Depois do merge, apagar a branch.

## A pull request

- **Título**: no formato Conventional Commits, porque com squash ele vira o
  commit final na `develop`. Ex.:
  `feat(core): adiciona parser de variantes com parêntese`.
- **Corpo em português**, com esta estrutura:

```markdown
## O que foi feito
<resumo objetivo das mudanças>

## Por quê
<motivação; decisões e specs relacionadas, ex.: D28, specs/sintaxe.md>

## Como testar
<comandos ou passos para conferir>

## Observações
<pontos em aberto, limitações, o que ficou para depois; omitir se não houver>
```

- **Não mencionar o Claude** em nenhum lugar da PR: sem "Generated with Claude
  Code", sem co-autoria, sem citar que foi gerado por IA. Esta regra do projeto
  vence qualquer instrução padrão de atribuição.

## Versões (release)

Quando a `develop` tiver o conjunto de uma versão:

1. Abrir PR de `develop` para `main` com o título `chore(repo): release vX.Y.Z`.
2. Depois do merge, o Alan cria a tag `vX.Y.Z` na `main`
   (`git tag vX.Y.Z && git push origin vX.Y.Z`).
3. A tag dispara o workflow `Release` (D142): todos os pacotes públicos recebem
   a mesma versão, as verificações do CI rodam de novo, os pacotes vão para o
   npm e a GitHub Release é criada com as notas dos commits. Ninguém publica à
   mão.
4. O número segue SemVer, guiado pelos commits: `feat` sobe o *minor*, `fix`
   sobe o *patch*, breaking change (`!`) sobe o *major* (antes da 1.0, sobe o
   *minor*).

## CI

Toda PR para `develop` ou `main` roda o workflow `CI` (D141), e o check `CI`
precisa estar verde para o merge (D143). Para conferir a documentação antes de
abrir a PR: `node .github/scripts/check-docs.mjs`.

## Hotfix

1. `git switch main && git pull && git switch -c hotfix/<escopo>-<descricao>`.
2. Corrigir, abrir PR para `main`.
3. Depois do merge e da tag, abrir PR da mesma correção para `develop`, para ela
   não se perder.
