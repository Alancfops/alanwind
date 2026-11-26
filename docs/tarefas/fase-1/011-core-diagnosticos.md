# 011. Core: catálogo de diagnósticos

- **Status**: pronta (depois da 010)
- **Fase**: 1
- **Branch**: feature/core-diagnosticos
- **Depende de**: 010
- **Paralelo com**: 013, 014, 041, 042, 043
- **Spec**: `docs/specs/sintaxe.md` seção 6, R46, R48, R49, R51;
  `docs/specs/funcionamento-interno.md` R37 a R41
- **Decisões**: D7, D35, D84, D120, D127, D138, D144

## Objetivo
Definir num só lugar os códigos `AW###` (severidade e mensagem) e as funções
que criam e ordenam diagnósticos, para parser, vocabulário, atalhos e conflito
usarem o mesmo catálogo.

## Escopo
- Faz:
  - Catálogo com os códigos da seção 6 da `sintaxe.md` **da fase 1**: `AW001`
    a `AW010`, `AW101` a `AW104`, `AW107`, `AW201`, `AW202`, `AW301`,
    `AW302` e `AW304`, cada um com a severidade da tabela (`error` ou
    `warning`). `AW303` fica reservado e **fora** do catálogo até existir
    criação de papéis (D144).
  - Mensagem de cada código **em inglês** (`CLAUDE.md`: mensagens de erro do
    código em inglês), com o mesmo sentido do texto em português da tabela,
    inclusive as mensagens próprias de `AW004` (`compact`, `motion-safe`) e de
    `AW008` (vírgula, ponto inicial, tom da paleta). A mensagem não faz parte
    do contrato (R40).
  - Função que cria um `Diagnostic` (tipo da `010`) a partir do código, da
    posição, da sugestão opcional e da origem opcional, com a severidade vinda
    do catálogo.
  - Função que ordena a lista por `position.start` crescente e, no empate,
    por código, do menor para o maior (R49, D144).
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
- [ ] Todo código da fase 1 existe no catálogo com a severidade da tabela;
      `AW303` e qualquer código fora da tabela não existem (D144).
- [ ] `AW201` e `AW202` são `warning`; os demais, `error`.
- [ ] O `core` não lê `__DEV__`, `process.env` nem nada de plataforma (R41).
- [ ] Ordenação e sugestão seguem R49 (com D144) e R51.

## Casos que o QA deve cobrir
- Tabela código → severidade, copiada da seção 6 da `sintaxe.md`, sem `AW303`.
- Ordenação: diagnósticos fora de ordem saem por `position.start` crescente;
  dois com o mesmo início saem em ordem de código (ex.: `AW201` antes de
  `AW202`; `AW010` antes de `AW101`) (D144).
- Sugestão: `padd-4` → `pad-4`, `hoover` → `hover`, `bg-primry` →
  `bg-primary` (distância ≤ 2); `bg-banana` sem candidato → sem sugestão;
  empate entre dois candidatos → o primeiro em ordem alfabética (R51).
- Os testes NÃO comparam o texto da mensagem (R40).
