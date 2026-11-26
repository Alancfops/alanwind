# 011. Core: catálogo de diagnósticos

- **Status**: pronta (depois da 010), com ressalva: a ordem no empate e o
  `AW303` aguardam resposta do Alan (abaixo); o resto não depende delas
- **Fase**: 1
- **Branch**: feature/core-diagnosticos
- **Depende de**: 010
- **Paralelo com**: 013, 014, 041, 042, 043
- **Spec**: `docs/specs/sintaxe.md` seção 6, R46, R48, R49, R51;
  `docs/specs/funcionamento-interno.md` R37 a R41
- **Decisões**: D7, D35, D84, D120, D127, D138

## Objetivo
Definir num só lugar os códigos `AW###` (severidade e mensagem) e as funções
que criam e ordenam diagnósticos, para parser, vocabulário, atalhos e conflito
usarem o mesmo catálogo.

## Escopo
- Faz:
  - Catálogo com **todos** os códigos da seção 6 da `sintaxe.md`: `AW001` a
    `AW010`, `AW101` a `AW104`, `AW107`, `AW201`, `AW202`, `AW301` a `AW304`,
    cada um com a severidade da tabela (`error` ou `warning`).
  - Mensagem de cada código **em inglês** (`CLAUDE.md`: mensagens de erro do
    código em inglês), com o mesmo sentido do texto em português da tabela,
    inclusive as mensagens próprias de `AW004` (`compact`, `motion-safe`) e de
    `AW008` (vírgula, ponto inicial, tom da paleta). A mensagem não faz parte
    do contrato (R40).
  - Função que cria um `Diagnostic` (tipo da `010`) a partir do código, da
    posição e da sugestão opcional, com a severidade vinda do catálogo.
  - Função que ordena a lista pela R39/R49.
  - Função de sugestão por distância de edição de no máximo 2, com desempate
    alfabético; sem candidato, sem sugestão (R51). Recebe a lista de
    candidatos; quem chama decide quais são.
- Não faz: decidir quando cada erro acontece (cada tarefa emite o seu); exibir
  aviso no console (borda, `045`); ler dev/produção (R41).

## Arquivos permitidos
- Implementador: `packages/core/src/diagnostics/**`,
  `packages/core/src/index.ts`.
- QA: `packages/core/test/diagnostics.test.ts`.

## Critérios de aceite
- [ ] Todo código da tabela existe no catálogo com a severidade da tabela;
      nenhum código fora dela.
- [ ] `AW201` e `AW202` são `warning`; os demais, `error`.
- [ ] O `core` não lê `__DEV__`, `process.env` nem nada de plataforma (R41).
- [ ] Ordenação e sugestão seguem R39/R49 e R51.

## Casos que o QA deve cobrir
- Tabela código → severidade, copiada da seção 6 da `sintaxe.md`.
- Ordenação: diagnósticos fora de ordem saem por `position.start` crescente;
  o caso de empate segue a resposta à pergunta abaixo.
- Sugestão: `padd-4` → `pad-4`, `hoover` → `hover`, `bg-primry` →
  `bg-primary` (distância ≤ 2); `bg-banana` sem candidato → sem sugestão;
  empate entre dois candidatos → o primeiro em ordem alfabética (R51).
- Os testes NÃO comparam o texto da mensagem (R40).

## Pontos em aberto (aguardam o Alan)
Se a resposta não vier antes, o implementador entrega o resto e deixa só a
regra do empate e o `AW303` para uma PR de ajuste.
- **Ordem no empate de posição**: a `funcionamento-interno.md` R39 diz "mantém
  a ordem em que o `core` achou os problemas" (D120); a `sintaxe.md` R49 diz
  "em empate, por código" (D127). As duas specs aprovadas se contradizem.
- **`AW303`** (papel terminando em número) só é efetivo na fase de tema (D81,
  `sintaxe.md` R28), mas o critério da seção 9 da `sintaxe.md` pede que todo
  código tenha um teste que o provoque. Entra no catálogo da fase 1 sem teste
  que o provoque, ou fica fora até a fase de tema?
