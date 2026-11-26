# 028. Core: variantes viram condições

- **Status**: pronta (depois da 021, 012, 022, 023 e 025), com ressalva:
  segue a D138 em `dark(light(x))` enquanto a linha da `sintaxe.md` 7.3 não
  for corrigida (abaixo)
- **Fase**: 1
- **Branch**: feature/core-variantes
- **Depende de**: 021, 012; 022, 023, 025 (classes usadas nos casos do QA)
- **Paralelo com**: 024, 026, 027, 030
- **Spec**: `docs/specs/sintaxe.md` R8 a R16, R53, seções 5.1 e 7.3, linhas de
  variante da 7.6; `docs/specs/funcionamento-interno.md` R13, R14, R18 a R21,
  R44, seção 6
- **Decisões**: D28, D29, D37, D59, D61, D78, D86, D94, D103, D127, D135,
  D138, D140

## Objetivo
Registrar as 12 variantes da fase 1 e transformar cada variante (aninhada ou
não) numa condição canônica: átomos sem repetição, na ordem fixa, com as
redundâncias simplificadas e as impossíveis descartadas.

## Escopo
- Faz:
  - Registro de `hover`, `press`, `focus`, `disabled`, `dark`, `light`, `ios`,
    `android`, `web`, `native`, `medium`, `expanded` (R8), cada uma com o seu
    átomo (`state`, `scheme`, `platform`, `screen`) (R19, R20).
  - Átomo de tela com `minWidth` vindo dos breakpoints da `012` (600 e 840)
    (R18).
  - Variantes aninhadas somam átomos (E lógico), em qualquer ordem (R13).
  - Forma canônica: sem átomo repetido e na ordem `hover`, `press`, `focus`,
    `disabled`, `dark`, `light`, `ios`, `android`, `web`, `native`, `medium`,
    `expanded` (R14).
  - Simplificação silenciosa: `ios(native(x))` → `[ios]`,
    `medium(expanded(x))` → `[expanded]`, `dark(dark(x))` → `[dark]` (R44,
    R53).
  - Condição impossível (`dark` com `light`; duas plataformas entre `ios`,
    `android` e `web`; `native` com `web`) → `AW202` (aviso) na variante mais
    interna e o trecho **descartado da IR** (R44, D138).
  - `AW004` para nome desconhecido, com mensagem própria para `compact` e
    `motion-safe` (R9, R10, D61, D78), e sugestão (R51). A variante inteira é
    descartada (R50).
- Não faz: formar e ordenar as camadas (`033`); avaliar a condição (emissor,
  `044`).

## Arquivos permitidos
- Implementador: `packages/core/src/vocabulary/variants.ts`,
  `packages/core/src/resolve/conditions.ts`.
- QA: `packages/core/test/variants.test.ts`.

## Critérios de aceite
- [ ] Cada variante gera o átomo da spec; `medium` e `expanded` trazem
      `minWidth` 600 e 840.
- [ ] `dark(hover(x))` e `hover(dark(x))` dão a mesma condição, `[hover,
      dark]`; `press(hover(x))` dá `[hover, press]` (R13, R14).
- [ ] Nenhuma condição impossível chega à IR; o `AW202` sai (R44).

## Casos que o QA deve cobrir
- Condição de cada variante da seção 5.1, sozinha.
- Aninhamento e ordem: `dark(hover(bg-raised))`, `hover(dark(bg-raised))`,
  `press(hover(bg-raised))`, `medium(pad-x-4 hover(bg-raised))`.
- Simplificação: `ios(native(row))` → `[ios]`, sem diagnóstico;
  `medium(expanded(pad-4))` → `[expanded]`; `dark(dark(pad-4))` → `[dark]`.
- Impossíveis: `dark(light(bg-raised))` → `AW202[5,21)`, sem camada;
  `ios(web(row))` → `AW202[4,12)`, sem camada.
- Desconhecidas (seção 7.6): `hoover(pad-2)` → `AW004[0,13)` com sugestão
  `hover`; `compact(row)` → `AW004[0,12)`; `motion-safe(pad-2)` →
  `AW004[0,18)`; `pad-4 compact(row)` → `PAD(16)` e `AW004[6,18)`
  (`funcionamento-interno.md` 5.9).
- `hover(bg-banana pad-2)`: só o token ruim sai; `pad-2` vale sob `[hover]`
  (R50).

## Ponto em aberto (aguarda o Alan)
- A `sintaxe.md` 7.3 (aprovada) mostra `dark(light(bg-raised))` →
  `[dark,light] bg=role(raised)` (declaração presente), mas a D138 e a
  `funcionamento-interno.md` R44 (aprovada) dizem que o trecho é descartado
  da IR. Esta tarefa segue a D138 (sem camada); as linhas de
  `dark(light(bg-raised))` e `ios(web(row))` da 7.3 precisam de correção na
  spec, e o QA testa pela R44.
