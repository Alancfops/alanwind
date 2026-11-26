# 021. Core: registro único do vocabulário e resolução para IR

- **Status**: pronta (depois da 020)
- **Fase**: 1
- **Branch**: feature/core-vocabulario-registro
- **Depende de**: 020
- **Paralelo com**: 013, 014, 041, 042, 043, 044
- **Spec**: `docs/specs/sintaxe.md` R2, R5, R6, R19, R21, R35, R46 a R48, R51,
  seções 4.2, 5.9 e 5.10; `docs/specs/funcionamento-interno.md` R1 a R5, R38,
  R39, R41 a R43, seção 6
- **Decisões**: D15, D35, D58, D74, D82, D83, D84, D88, D90, D120, D127

## Objetivo
Criar a fonte única do vocabulário (skill `adicionar-utilitario`, passo 1) e a
função pura `look` + tema → `ResolvedLook`, ainda sem nenhuma família de
classes. As famílias (`022` a `027`) e as variantes (`028`) só se registram
aqui.

## Escopo
- Faz:
  - A estrutura do registro, com cada família num arquivo próprio em
    `vocabulary/`. Cada classe declara: as propriedades abstratas que define
    (seção 5.10 da `sintaxe.md`) com o nível de especificidade (seção 5.9), se
    vai para `style` ou para `props` (R27 da `funcionamento-interno.md`) e a
    declaração da IR que produz. Cada família declara se aceita `=` e quais
    valores livres aceita (número, `%`, negativo, cor) (R19, R21).
  - Diagnósticos do vocabulário que não dependem de família: `AW101` (classe
    desconhecida, com maiúscula ou com caractere fora da gramática, R2),
    `AW005` (nome de variante sozinho, R16), `AW009` (`=` em família que não
    aceita, R21), `AW008` para negativo fora de `margin` (R19). Sugestão pela
    função da `011`, com os nomes do registro como candidatos (R51).
  - A resolução: árvore da `020` → declarações → `ResolvedLook` com `style`,
    `props` e `diagnostics` sempre presentes (R1), diagnósticos ordenados
    (R39), trecho ruim descartado e o resto resolvido (R42). Sem variante
    nenhuma, os itens formam uma só camada de condição vazia; sem declaração,
    `layers: []` (R15).
  - Assinatura pública: entrada `look` + tema, saída `ResolvedLook`. O nome
    segue a skill `codigo-limpo` (ex.: `resolveLook`). O ponto de entrada para
    os atalhos expandidos fica preparado para a `035`.
- Não faz: nenhuma classe concreta; variantes e camadas (`028`, `033`); regra
  de conflito (`029`); atalhos (`034`, `035`); tipos de autocomplete (`030`).

## Arquivos permitidos
- Implementador: `packages/core/src/vocabulary/index.ts` (e arquivos de
  estrutura do registro em `vocabulary/`), `packages/core/src/resolve/**`,
  `packages/core/src/index.ts`.
- QA: `packages/core/test/resolve-unknown.test.ts`,
  `packages/core/test/resolve-invariants.test.ts`.

## Critérios de aceite
- [ ] `look` vazio ou só espaços → `{ style: { layers: [] }, props:
      { layers: [] }, diagnostics: [] }` (R1, seção 6).
- [ ] Classe desconhecida gera `AW101` com a posição do token e não lança
      exceção (R2, R42).
- [ ] A IR sobrevive a `JSON.parse(JSON.stringify(ir))` e duas chamadas dão o
      mesmo resultado (R3, R4).
- [ ] O `core` não lê dev/produção: os diagnósticos saem sempre (R41).
- [ ] Adicionar uma família nova não exige mexer em parser nem em emissor
      (skill `codigo-limpo`, seção 1).

## Casos que o QA deve cobrir
- Com o registro vazio: `foo bar` → `AW101[0,3)` e `AW101[4,7)`, IR vazia;
  `Pad-4` → `AW101[0,5)`; `pad_4` → `AW101`; `hover` → `AW005[0,5)`.
- Entradas da seção 7.6 que só têm erro de sintaxe (vindas da `020`) chegam
  ao `ResolvedLook` com as mesmas posições.
- Invariantes da seção 7 da `funcionamento-interno.md` com strings
  arbitrárias: nunca lança, posições dentro do `look`, ida e volta por JSON,
  determinismo.
- Os casos com classes concretas (sugestões `padd-4` → `pad-4`, `AW009` em
  `weight=600`, `AW008` em `w=-5`) ficam nas famílias, onde as classes
  existem.
