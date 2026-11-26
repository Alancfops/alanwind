# 034. Core: atalhos (`define`), validação ao carregar

- **Status**: pronta (depois da 028, 022 e 023)
- **Fase**: 1
- **Branch**: feature/core-atalhos-validacao
- **Depende de**: 028 (nomes de variante), 022, 023 (classes usadas nos casos)
- **Paralelo com**: 029, 033
- **Spec**: `docs/specs/tema.md` R22 a R28, R32, seções 5.9, 7.3 e 8;
  `docs/specs/sintaxe.md` R42, R44, R64, seção 6 (`AW301`, `AW302`, `AW304`)
- **Decisões**: D36, D63, D81, D100, D101, D127, D134, D135, D138, D144

## Objetivo
Validar, de forma pura, o objeto `define` do `alanwind.config.ts` antes de
qualquer `look` usar os atalhos: ciclos, colisão de nome e formato do nome.

## Escopo
- Faz:
  - Função pura que recebe o objeto `define` (nome → string de classes) e
    devolve os atalhos válidos e os diagnósticos de carregamento.
  - `AW301` para ciclo direto, de si mesmo ou indireto (R25, R44); o atalho em
    ciclo não gera estilo (seção 8 do `tema.md`).
  - `AW302` para nome igual a uma classe nativa ou a uma variante (R26, R44).
  - `AW304` para nome fora do formato: começa com letra minúscula e só tem
    minúsculas, dígitos e hífen (R32, R64).
  - Forma dos diagnósticos de carregamento (D144): trazem o nome do atalho e a
    posição dentro do texto dele, como o `origin` da D135. O formato exato do
    campo segue a spec atualizada pelo documentador.
  - Atalho com `AW301`, `AW302` ou `AW304` é **descartado**: não entra na
    lista de atalhos válidos, e usá-lo num `look` dá `AW101` (D144; o `AW101`
    sai na `035`, que não acha o nome).
  - Atalho com classe inexistente dentro é aceito aqui; o erro aparece na
    expansão (`035`, seção 8 do `tema.md`).
- Não faz: expandir atalhos num `look` (`035`); `defineConfig` e `configure`
  (`046`, no `native`, D119); recusar outras chaves de `defineConfig` (R22,
  pelo tipo, na `046`); papéis criados pela pessoa e `AW303` (fora da fase 1,
  D144).

## Arquivos permitidos
- Implementador: `packages/core/src/shortcuts/**`,
  `packages/core/src/index.ts`.
- QA: `packages/core/test/shortcuts-validation.test.ts`.

## Critérios de aceite
- [ ] Cada linha da seção 7.3 do `tema.md` que é só do `core` dá o resultado
      indicado (C6), inclusive os três ciclos, as três colisões e o nome fora
      do formato.
- [ ] A função não lança exceção para nenhuma entrada.
- [ ] A lista de classes e variantes usada na colisão vem do registro da
      `021` (sem lista copiada).

## Casos que o QA deve cobrir
- Válidos: `{ btn: 'bg-primary pad-4' }`,
  `{ btn: 'bg-primary hover(bg-primary-hover)' }`,
  `{ a: 'pad-4', b: 'a round-md' }`,
  `{ 'card-title': 'type-lg', 'btn-2': 'pad-4' }`, `{}`.
- Ciclos: `{ a: 'b', b: 'a' }`, `{ a: 'a' }`,
  `{ a: 'b pad-2', b: 'c', c: 'a' }` → `AW301`.
- Colisão: `{ row: 'pad-4' }`, `{ 'pad-4': 'row' }`, `{ hover: 'pad-4' }` →
  `AW302`.
- Formato: `{ Btn: 'pad-4' }` → `AW304`; nome começando com dígito ou hífen →
  `AW304`.
- Em todos os erros: o diagnóstico traz o nome do atalho, e o atalho não está
  na lista de válidos (D144). Os outros atalhos do mesmo `define` continuam
  válidos (`{ row: 'pad-4', btn: 'bg-primary' }` → só `btn` fica).
- As posições dentro do texto conferidas pelos exemplos da spec atualizada
  (D144); se a spec ainda não tiver exemplo de posição, o QA confere só código
  e nome do atalho e relata.
