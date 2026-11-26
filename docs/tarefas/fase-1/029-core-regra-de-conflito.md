# 029. Core: regra de conflito entre classes (D58)

- **Status**: pronta (depois da 033 e das famílias 023 a 027)
- **Fase**: 1
- **Branch**: feature/core-regra-de-conflito
- **Depende de**: 033, 023, 024, 025, 026, 027 (famílias usadas nos casos)
- **Paralelo com**: 034
- **Spec**: `docs/specs/sintaxe.md` R35 a R40, seções 5.9 e 7.4;
  `docs/specs/funcionamento-interno.md` R7 a R12, seção 5.2
- **Decisões**: D58, D82, D84, D120, D127, D139, D140, D145

## Objetivo
Aplicar a regra de conflito no `core`, uma vez só, entre classes com o mesmo
conjunto de condições: a mais específica vence; no empate, a última escrita,
com aviso.

## Escopo
- Faz:
  - Comparação por propriedade abstrata (R35): cada classe disputa só as
    propriedades que define; a vitória é por propriedade (`pad-4 pad-x-2`).
  - Nível maior vence, qualquer que seja a ordem, sem aviso (R36, R10).
  - Mesmo nível: vence a última escrita e sai `AW201` (aviso) na posição da
    classe descartada (R37, R38, R9).
  - Vale também entre `style` e `props` (`lines-2 lines-3`) e dentro de
    variante (`hover(bg-primary bg-surface)`).
  - **Camadas com a mesma condição se comparam como uma só** (D145): as
    camadas continuam separadas e na ordem escrita (D140), mas a disputa entre
    elas segue a mesma regra (primeiro a especificidade, depois a última
    escrita). O `core` tira da camada a declaração que perdeu; o aviso segue a
    R37/R38 como se fosse uma camada só (`AW201` no empate). Camada que fica
    sem declaração some (R15).
  - Resultado: em cada camada, cada propriedade aparece no máximo uma vez
    (R7); a IR não carrega especificidade nem ordem (R11).
- Não faz: precedência entre condições diferentes (é a ordem das camadas,
  `033`); `between` com alinhamento (`031`); atalhos (`035`).

## Arquivos permitidos
- Implementador: `packages/core/src/resolve/conflict.ts`.
- QA: `packages/core/test/conflict.test.ts`.

## Critérios de aceite
- [ ] Todos os exemplos da seção 7.4 da `sintaxe.md` (menos as duas linhas de
      `between`, que são da `031`) e da seção 5.2 da
      `funcionamento-interno.md` produzem a saída e os diagnósticos exatos.
- [ ] `pad-4 pad-x-2` e `pad-x-2 pad-4` produzem IR igual (R10).
- [ ] Nenhuma camada repete propriedade (R7).

## Casos que o QA deve cobrir
- `pad-4 pad-x-2`, `pad-x-2 pad-4`, `pad-top-2 pad-y-4 pad-4`,
  `pad-y-4 pad-top-2`, `pad-top-2 pad-y-4` (sem aviso).
- `bg-primary bg-surface` → `bg-surface`, `AW201[0,10)`;
  `bg-surface bg-primary` → `AW201[0,10)`; `bg-primary bg=#fff` →
  `AW201[0,10)`; `pad-x-2 pad-x-4` → `AW201[0,7)`; `row col` →
  `AW201[0,3)`; `pad-4 pad-4` → `AW201` no primeiro (seção 8).
- Analogias (D139): `center center-x` (sem aviso), `gap-4 gap-x-2`,
  `border border-top-2`, `round-top-lg round-md`.
- `hover(bg-primary bg-surface)` → `[hover]` `bg-surface`, `AW201[6,16)`.
- `lines-2 lines-3` → props `numberOfLines: 3`, `AW201[0,7)`.
- `bg-surface hover(bg-primary-hover)`: duas camadas, sem aviso (R9).
- `dark(hover(bg-raised)) hover(dark(bg-surface))` → vale `bg-surface`,
  `AW201[11,20)` (seção 7.4); a primeira camada `[hover, dark]` perde a
  declaração e some (D145, R15).
- `hover(pad-x-2) hover(pad-4)` → com hover, 8 à esquerda e à direita e 16 em
  cima e embaixo (D145): a segunda camada `[hover]` fica só com
  `paddingTop` e `paddingBottom`.
- `hover(pad-x-2) hover(pad-x-4)` → a primeira camada some, `AW201[6,13)`.

## Observação
- O documentador está levando a D145 para as specs (que voltam a "em
  revisão" até o Alan reaprovar). Se o texto novo da spec trouxer exemplo que
  difira desta tarefa (ex.: aviso também na perda por especificidade), vale a
  spec, e o implementador relata.
