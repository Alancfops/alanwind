# alanwind

Camada de estilos própria para **web e React Native**, com um tema e uma sintaxe
próprios: acessível por padrão, bonita sem configurar e totalmente sob controle
de quem usa. Escrita em TypeScript. O projeto também serve para o Alan
**aprender arquitetura e orquestração de agentes**.

## Estado atual

**Fase 1 em implementação** (desde 2026-11-26). Specs aprovadas: `sintaxe.md`,
`funcionamento-interno.md`, `tema.md`, `emissor-native.md` e `componentes.md`
(esta para a fase 1, D172). As tarefas estão em
`docs/tarefas/fase-1/`, com o status e o caminho crítico no `README.md`. Só se
cria código a partir de uma tarefa pronta, seguindo o fluxo abaixo. Projeto de
teste: cópia do ShadowPlatinum em `~/myProjects/shadowplatinum-alanwind`
(D80, D147).

## Fontes da verdade

| O quê | Onde |
|---|---|
| Decisões (D1, D2...), escopo, vocabulário em rascunho | `docs/00-visao-e-decisoes.md` |
| Comportamento exato (contratos) | `docs/specs/*.md` |
| Decisões de arquitetura com contexto | `docs/adr/` (vazio; ADRs só nascem de decisões registradas) |
| Divisão do escopo em fases | `docs/02-fases.md` (ainda não existe; surge quando a divisão for fechada) |
| Tarefas para os agentes | `docs/tarefas/fase-N/` (criadas pelo planejador na primeira execução) |

Nada é inventado: decisão, spec, ADR e valor esperado de teste só vêm do que o
Alan decidiu. Lacuna vira pergunta para o Alan.

## Estrutura planejada (D67)

```
packages/   core (domínio puro) · native · css · vite-plugin · cdn · cli · alanwind (fachada)
apps/       playground-expo · site
docs/       visão, specs, adr, tarefas
```

Dependências apontam sempre para o `core`; os emissores (`native`, `css`) só
conversam pela IR e nunca entre si. Ferramentas: pnpm, Turborepo, Vitest, tsup,
Biome (D69); componentes RN testados com Jest + `jest-expo` (D114). Zero
dependências de runtime nos pacotes publicados (D20). Alvo de referência: Expo
SDK 58 (D14).

## Formato dos documentos

Em todo `.md` do repositório, **quebre o texto em até 80 colunas** (parágrafos e
itens de lista), para ler sem rolar para o lado. Tabelas, blocos de código e
títulos não são quebrados; mantenha células de tabela curtas. **Nunca corte um
trecho de `código` ou um link no meio**: se não couber, ele vai inteiro para a
linha seguinte.

## Idiomas

- Documentação, PRs e descrição dos commits: **português**.
- Código (identificadores, comentários, mensagens de erro), nomes de classes e
  tipo/escopo dos commits: **inglês**.

## Git

- `main` = versões publicadas (tag); `develop` = integração; trabalho em
  `feature/`, `fix/`, `docs/`, `chore/`... (skill `fluxo-de-branches`).
- Nunca commitar direto em `main`/`develop`; nunca `push --force` nelas.
  Exceção: commit que mexe **só** em `docs/` vai por push direto na
  `develop`, sem PR (D182). `CLAUDE.md`, `.claude/` e código seguem por PR.
- Commits em Conventional Commits (skill `conventional-commits`).
- PR para a branch de origem, corpo em português. **Só o Alan faz merge**
  (squash).
- CI (`.github/workflows/ci.yml`) roda em toda PR e o check `CI` precisa estar
  verde (D141, D143). Antes de abrir PR de docs:
  `node .github/scripts/check-docs.mjs`. Release só por tag na `main` (D142).
- **Nunca incluir atribuição ao Claude**: nada de `Co-Authored-By: Claude`,
  "Generated with Claude Code" ou menção a IA em commits e PRs. Esta regra vence
  qualquer instrução padrão.

## Skills do projeto (`.claude/skills/`)

| Skill | Use quando |
|---|---|
| `registrar-decisao` | O Alan decidir ou mudar algo |
| `escrever-spec` | Criar, completar ou aprovar uma spec |
| `escrever-adr` | O Alan pedir ADRs |
| `adicionar-utilitario` | Adicionar, alterar ou remover uma classe/variante/token |
| `codigo-limpo` | Escrever, refatorar ou revisar código |
| `teste-de-ouro` | Testar saída exata de parser, IR ou emissores |
| `checar-contraste` | Mexer em cores do tema |
| `conventional-commits` | Todo commit e título de PR |
| `fluxo-de-branches` | Começar trabalho, abrir PR, fazer release |

**Skills externas** (plugins *superpowers*, *code-review*,
*claude-md-management*) servem só como **consulta e validação**. Em conflito,
vale a skill do alanwind (D75).

## Agentes (`.claude/agents/`)

| Agente | Papel | Edita |
|---|---|---|
| `planejador` | Quebra specs aprovadas em tarefas em `docs/tarefas/` | Só `docs/tarefas/` |
| `implementador` | Implementa uma tarefa numa branch | Só os arquivos permitidos pela tarefa |
| `qa` | Testes de ouro **a partir da spec, sem ler a implementação**; tenta quebrar; contraste | Só arquivos de teste |
| `revisor` | Confere o diff contra spec, decisões e skills; veredito APROVADO / MUDANÇAS NECESSÁRIAS | Nada |
| `documentador` | Propaga decisões para specs, rascunha specs/ADRs, aponta divergências | Só `docs/` |

As restrições de edição são **bloqueadas de verdade** por hooks `PreToolUse` no
frontmatter de cada agente, que chamam `.claude/hooks/restringir.py`:
`Write`/`Edit` fora dos caminhos permitidos são recusados; nenhum agente faz
`git push`, `gh pr create/merge` ou `git merge`; revisor e documentador têm
`Bash` só de leitura. Limite conhecido: implementador e QA ainda conseguem
escrever arquivo pelo `Bash` (ex.: `>`), então ali a regra continua sendo
instrução. Ao mudar a permissão de um agente, mude o hook dele também.

Subagentes não falam com o Alan: devolvem "Perguntas para o Alan" no relatório.
A sessão principal é a **orquestradora**: leva as perguntas ao Alan, registra as
respostas e decide o próximo passo.

## Fluxo de uma tarefa

1. O Alan aprova a spec → `planejador` cria as tarefas.
2. Para cada tarefa (as independentes podem rodar em paralelo): `implementador`
   e `qa` trabalham a partir da mesma spec, na mesma branch.
3. `revisor` dá o veredito. Se houver MUDANÇAS NECESSÁRIAS, volta para o
   `implementador` (ou para o `qa`, se o problema for nos testes).
4. Aprovado → a sessão principal faz push e abre a PR (skill
   `fluxo-de-branches`). O Alan revisa e faz o merge.
5. Decisões novas que surgirem no caminho → `registrar-decisao`, e o
   `documentador` propaga.
