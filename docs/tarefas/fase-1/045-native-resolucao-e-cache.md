# 045. Native: resolução ponta a ponta com cache

- **Status**: bloqueada — aguarda `docs/specs/emissor-native.md` sair do
  rascunho e ser aprovada
- **Fase**: 1
- **Branch**: feature/native-resolucao-cache
- **Depende de**: 022 a 029, 031, 032, 033, 040 a 044
- **Paralelo com**: 030, 035
- **Spec**: `docs/specs/emissor-native.md` seção 1 (cache, D109);
  `docs/specs/funcionamento-interno.md` R2, R41; `docs/specs/sintaxe.md` R1,
  R46
- **Decisões**: D15, D26, D27, D35, D84, D88, D109

## Objetivo
Juntar `core` e emissor: `look` + contexto → estilo e props do RN, com cache
LRU por faixa de tela, e mostrar em dev os diagnósticos do `core`.

## Escopo
- Faz:
  - A função de resolução do RN, disponível para quem precisar (D26), com a
    mesma gramática do `look` (R1 da `sintaxe.md`).
  - Cache com chave = `look` + faixa de tela (não a largura exata) + esquema +
    plataforma + tema, guardando as últimas ~500 combinações e descartando as
    mais antigas (LRU, D109). O limite fica numa constante nomeada, sem
    número mágico.
  - Diagnósticos: em dev, mostrados pelo mecanismo de aviso do alanwind; em
    produção, ignorados, sem exceção (D35, D84, R41).
- Não faz: componentes (`051` a `053`); atalhos e `configure` (`046`).

## Arquivos permitidos
- Implementador: `packages/native/src/resolve/**`,
  `packages/native/src/warn/**`, `packages/native/src/index.ts`.
- QA: `packages/native/test/resolve.test.ts` (Vitest).

## Critérios de aceite
- [ ] Mesma entrada e mesmo contexto → mesmo objeto (identidade, vindo do
      cache).
- [ ] Larguras diferentes na mesma faixa usam a mesma entrada do cache;
      mudar a faixa, o esquema ou a plataforma muda a chave.
- [ ] Passado o limite da constante, a combinação usada há mais tempo sai do
      cache (o teste lê a constante, não repete o número).
- [ ] Classe desconhecida: aviso em dev, ignorada em produção, sem exceção.

## Casos que o QA deve cobrir
- Ponta a ponta: os exemplos de entrada e saída da `emissor-native.md`
  (`look` + contexto → estilo).
- `bg-banana pad-4` em dev (aviso + `pad-4` aplicado) e em produção (só
  `pad-4`).
- `pad-4 hover(bg-raised` → `pad-4` aplicado, aviso em dev (D88).
- Cache: duas chamadas iguais retornam o mesmo objeto; esquema diferente
  retorna outro; larguras 700 e 800 (`medium`) dão o mesmo objeto.

## Lacunas que bloqueiam (`emissor-native.md` seção 2)
- API pública: função `look(...)` (D27 diz "pode seguir o mesmo nome"), hook
  (`useLook()`) ou os dois? Como a função lê o contexto fora de um
  componente?
- Mecanismo de aviso em dev (`console.warn`? deduplicado por `look`?) e como
  a borda sabe que está em dev (`__DEV__`?).
- Limites da faixa para a chave (ver `040`).
- Como entram na resolução os estados de interação, que mudam por elemento e
  não fazem parte da chave da D109.
