# 031. Core: alinhamento pela direção final

- **Status**: pronta (depois da 022, 029 e 033)
- **Fase**: 1
- **Branch**: feature/core-alinhamento-direcao
- **Depende de**: 022, 029, 033
- **Paralelo com**: 032, 035
- **Spec**: `docs/specs/funcionamento-interno.md` R22 a R26, R45, R46, seções
  5.5 e 6; `docs/specs/sintaxe.md` R34, R58, R59, linhas de `between` da
  seção 7.4
- **Decisões**: D38, D62, D85, D117, D120, D122, D135, D138, D140

## Objetivo
Traduzir no `core` as classes de alinhamento relativas à tela em
`justifyContent`/`alignItems`, pela direção que vale em cada condição, para
que os emissores só recebam propriedades flex comuns.

## Escopo
- Faz:
  - `center-x`, `center-y`, `x-start`, `x-end`, `y-start`, `y-end` traduzidos
    pela tabela da R24: em `column`, x é `alignItems` e y é `justifyContent`;
    em `row`, o contrário. Sem `row`/`col`, a direção é `column` (R25, D62).
  - Direção trazida por variante (`col medium(row) center-x`): a camada da
    condição que muda a direção traz a tradução nova e o valor inicial
    (`alignItems: 'stretch'`, `justifyContent: 'flex-start'`) no que a nova
    direção não define (R26).
  - Alinhamento numa condição e direção em outra (`dark(center-x)
    medium(row)`): camada combinada `[dark, medium]` com a tradução certa, que
    vence as de uma condição (R45).
  - `between` (`place.main`) mapeado para `place.y` em `col` e `place.x` em
    `row`, no nível de `center-x`/`center-y`; junto com um alinhamento no
    mesmo eixo, conflito normal pela `029`: vale a última escrita, com
    `AW201` (R46, R59, D138, D140).
  - A IR não guarda a intenção de alinhar (R22).
- Não faz: `center`, `between` sozinho, `wrap`, `fill`, `row`, `col` (já
  produzidos pela `022`); tradução para RN (`041`).

## Arquivos permitidos
- Implementador: `packages/core/src/resolve/alignment.ts`,
  `packages/core/src/vocabulary/layout.ts` (só para ligar as classes à
  tradução).
- QA: `packages/core/test/alignment.test.ts`.

## Critérios de aceite
- [ ] Toda linha da seção 5.5 da `funcionamento-interno.md` produz a IR exata,
      inclusive os quatro blocos com variante (`col medium(row) center-x`,
      `col medium(row) center-y`, `col medium(row) center`,
      `dark(center-x) medium(row)`).
- [ ] `center-x` em `row` e em `col` centraliza na horizontal da tela (D38).
- [ ] Nenhum emissor precisa saber a direção para alinhar (R22).

## Casos que o QA deve cobrir
- Tabela 5.5: `center-x`, `center-y`, `col center-x`, `row center-x`,
  `row center-y`, `x-start`, `x-end`, `y-start`, `row x-end`, `row y-start`.
- Os quatro blocos de código da seção 5.5, com as camadas por inteiro.
- Conflito (seção 6 da `funcionamento-interno.md` e 7.4 da `sintaxe.md`):
  `between center-y` (coluna) → vale `center-y`, `AW201[0,7)`;
  `center-y between` (coluna) → vale `between`, `AW201[0,8)`.
- `row between` → `justifyContent: 'space-between'` (sem conflito).
