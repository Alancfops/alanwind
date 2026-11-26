# 034. Core: atalhos (`define`), validação ao carregar

- **Status**: bloqueada — aguarda resposta do Alan sobre o formato dos
  diagnósticos de carregamento (abaixo); depois, depende da 028, 022 e 023
- **Fase**: 1
- **Branch**: feature/core-atalhos-validacao
- **Depende de**: 028 (nomes de variante), 022, 023 (classes usadas nos casos)
- **Paralelo com**: 029, 033
- **Spec**: `docs/specs/tema.md` R22 a R28, R32, seções 5.9, 7.3 e 8;
  `docs/specs/sintaxe.md` R42, R44, R64, seção 6 (`AW301`, `AW302`, `AW304`)
- **Decisões**: D36, D63, D81, D100, D101, D127, D134, D138

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
  - Atalho com classe inexistente dentro é aceito aqui; o erro aparece na
    expansão (`035`, seção 8 do `tema.md`).
- Não faz: expandir atalhos num `look` (`035`); `defineConfig` e `configure`
  (`046`, no `native`, D119); recusar outras chaves de `defineConfig` (R22,
  pelo tipo, na `046`); papéis criados pela pessoa e `AW303` (fase de tema).

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

## Lacunas que bloqueiam
- **Forma do diagnóstico de carregamento.** O `Diagnostic` exige `position`
  relativa ao `look` (R38 da `funcionamento-interno.md`), mas `AW301` a
  `AW304` "referem-se ao texto da definição, não a um `look`" (seção 6 da
  `sintaxe.md`). Para `AW302` e `AW304` o problema está no nome (chave do
  objeto), que não está em texto nenhum. Qual `position` (e `origin`?) esses
  diagnósticos levam, e como identificam o atalho?
- Depois de `AW302` ou `AW304`, o atalho é descartado (como no ciclo) ou
  fica valendo? A spec só diz isso do ciclo.
