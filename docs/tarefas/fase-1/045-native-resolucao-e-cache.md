# 045. Native: resolução ponta a ponta com cache

- **Status**: bloqueada — aguarda aprovação de `docs/specs/emissor-native.md`,
  `docs/specs/ir.md` e `docs/specs/sintaxe.md`
- **Fase**: 1
- **Branch**: feature/native-resolucao-cache
- **Depende de**: 029, 040, 041, 042, 043, 044
- **Paralelo com**: 030
- **Spec**: `docs/specs/emissor-native.md` §1 (cache); `docs/specs/sintaxe.md`
  §1.2
- **Decisões**: D15, D27, D35

## Objetivo
Juntar `core` e emissor: `look` string + contexto → estilo RN, com cache cuja
chave inclui o `look` e o contexto, e mostrar em dev os diagnósticos do `core`.

## Escopo
- Faz: a função/hook pública de resolução no RN (D27: "a função de resolução
  pode seguir o mesmo nome", `look(...)`); cache com chave `look` + tema +
  esquema + faixa de tela (D15, `emissor-native.md`); exibição dos diagnósticos
  em dev pelo mecanismo de aviso do alanwind e silêncio em produção (D35).
- Não faz: componentes (`051` a `053`).

## Arquivos permitidos
- Implementador: `packages/native/src/resolve/**`,
  `packages/native/src/warn/**`, `packages/native/src/index.ts`.
- QA: `packages/native/test/resolve.test.ts`.

## Critérios de aceite
- [ ] Mesma entrada e mesmo contexto → mesmo objeto (identidade, vindo do
      cache).
- [ ] Mudar o esquema ou a faixa de tela muda a chave e o resultado.
- [ ] Classe desconhecida: aviso em dev, ignorada em produção, sem exceção
      (D35).

## Casos que o QA deve cobrir
- Ponta a ponta: os exemplos de entrada → saída da `emissor-native.md` (string
  do `look` + contexto → estilo).
- Cache: duas chamadas iguais retornam o mesmo objeto; esquema diferente retorna
  outro.
- `bg-banana pad-4` em dev (aviso + `pad-4` aplicado) e em produção (só
  `pad-4`).

## Lacunas que bloqueiam
- `emissor-native.md` §2: invalidação do cache e tamanho máximo.
- A chave usa a largura exata ou a faixa (`compact`/`medium`/`expanded`)?
- API pública: função `look()`, hook (`useLook()`), ou os dois? Como a função lê
  o contexto fora de um componente?
- Mecanismo de aviso em dev (`console.warn`? deduplicado?).
