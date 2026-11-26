# 020. Core: parser, tokenização e grupos de variante

- **Status**: pronta (depois da 011)
- **Fase**: 1
- **Branch**: feature/core-parser-tokenizacao
- **Depende de**: 011
- **Paralelo com**: 013, 014, 041, 042, 043, 044
- **Spec**: `docs/specs/sintaxe.md` seção 4.1 (EBNF), R3, R4, R7, R16, R17,
  R18, R22, R23, R47, R50, R54, R65; linhas de sintaxe da seção 7.6
- **Decisões**: D15, D28, D30, D86, D88, D104, D105, D118, D125, D126, D127,
  D138

## Objetivo
Transformar a string do `look` numa árvore sintática com posições: itens
separados por espaço, variantes `nome(...)` aninháveis, tokens e valor livre
com `=`, descartando só o trecho malformado. Não conhece o vocabulário.

## Escopo
- Faz:
  - Leitura pela EBNF da seção 4.1: espaço, tab, `\n` e `\r` como separador;
    espaços no começo, no fim e dentro dos parênteses ignorados (R3); `look`
    vazio ou só com espaços → árvore vazia, sem diagnóstico (R4).
  - Variante `nome(lista)` com qualquer item dentro, inclusive outras
    variantes (D86). O nome é só um `word`: saber se a variante existe é da
    `028`.
  - Token: classe (`word`) ou valor livre `família=valor`, com o valor já
    classificado em número (inteiro ou decimal, negativo, com `%`) ou cor hex
    de 3, 6 ou 8 dígitos com `/opacidade` opcional (R17, R18, R22, R23, R54).
  - Posição `[início, fim)` em UTF-16 em cada nó, relativa ao `look` original.
  - Diagnósticos de sintaxe, com o trecho descartado da R50: `AW001`
    (parêntese não fechado: da variante aberta mais externa até o fim, um só),
    `AW002` (`)` sobrando: só o `)`), `AW003` (variante vazia), `AW006`
    (`nome:classe`), `AW007` (`w=`, `=50`, `w==5`), `AW010` (item colado
    depois de `)`; os dois itens valem, R65).
  - `AW008` na parte léxica do valor livre: unidade (`rem`, `em`, `vw`, `vh`)
    ou texto, vírgula decimal (`w=10,5`), ponto sem dígito antes (`w=.5`),
    hex com tamanho errado (`bg=#12`), tom da paleta (`bg=red-40`, D118).
  - Caractere fora da gramática (`pad_4`, `$`): o token segue para o
    vocabulário, que dá `AW101` (seção 8 da spec).
- Não faz: saber se uma classe, família ou variante existe (`021`, `028`);
  `AW004`, `AW005`, `AW009` e os `AW1xx` (`021` e famílias); negativo fora de
  `margin`, opacidade fora da escala e barra em hex de 8 dígitos (dependem da
  família: `021`, `025`); gerar IR.

## Arquivos permitidos
- Implementador: `packages/core/src/parser/**`, `packages/core/src/index.ts`
  (só se a árvore precisar ser pública; senão, fica interna).
- QA: `packages/core/test/parser-syntax.test.ts`.

## Critérios de aceite
- [ ] Os casos de borda da D188 dão o código, a posição e a sugestão
      decididos (`sintaxe.md`, regras dos diagnósticos).
- [ ] As entradas válidas da seção 7 da `sintaxe.md` são lidas sem
      diagnóstico de sintaxe (`AW00x`).
- [ ] Cada linha de sintaxe da seção 7.6 (`AW001`, `AW002`, `AW003`, `AW006`,
      `AW007`, `AW010` e os `AW008` léxicos acima) dá o código e a posição
      exatos.
- [ ] Nenhuma entrada lança exceção, inclusive entradas aleatórias (R47).
- [ ] Toda posição fica em `0 <= início <= fim <= look.length`.
- [ ] Função pura: a mesma entrada dá a mesma saída (D15).

## Casos que o QA deve cobrir
- Válidos: `pad-4`, `row center gap-4 pad-4`, `hover(bg-raised shadow-md)`,
  `hover(  bg-raised  )`, `dark(hover(bg-raised))`, `w=137`, `w=50%`,
  `w=10.5`, `leading=1.4`, `margin-top=-8`, `bg=#e11d48`, `bg=#e11d48/50`,
  `bg=#fff`, `bg=#e11d4880`; tab e quebra de linha como separador.
- Sintaxe da seção 7.6: `pad-4 hover(bg-raised` → `AW001[6,21)`; `hover(` →
  `AW001[0,6)`; `pad-4 hover(bg-raised dark(pad-2)` → `AW001[6,33)`;
  `hover(dark(pad-2` → `AW001[0,16)`; `pad-4 bg-raised)` → `AW002[15,16)`;
  `hover(pad-2))` → `AW002[12,13)`; `)` → `AW002[0,1)`; `hover()` →
  `AW003[0,7)`; `hover:bg-raised` → `AW006[0,15)` com sugestão
  `hover(bg-raised)`; `w=` → `AW007[0,2)`; `=50` → `AW007[0,3)`; `w=10rem` →
  `AW008[0,7)`; `bg=#12` → `AW008[0,6)`; `w=10,5` → `AW008[0,6)`; `w=.5` →
  `AW008[0,4)`; `bg=red-40` → `AW008[0,9)`; `hover(bg-raised)pad-4` →
  `AW010[16,21)` com os dois itens na árvore.
- Vazio e só espaços: árvore vazia, sem diagnóstico (R4).
- Teste de propriedade: entradas geradas a partir da EBNF são lidas sem
  `AW00x` (seção 9 da spec); strings aleatórias nunca lançam exceção. O
  gerador fica no próprio teste.
