# 033. Core: camadas e precedência entre condições

- **Status**: pronta (depois da 028 e da 026)
- **Fase**: 1
- **Branch**: feature/core-camadas-precedencia
- **Depende de**: 028, 026 (`lines-N`, usado nos casos de props)
- **Paralelo com**: 024, 027, 034
- **Spec**: `docs/specs/funcionamento-interno.md` R15 a R17, R28, seções 5.3,
  5.4, 5.6 e 6; `docs/specs/sintaxe.md` R41, seção 7.7
- **Decisões**: D37, D106, D117, D135, D136, D140

## Objetivo
Montar as camadas de estilo e de props a partir das condições da `028`, na
ordem total da D136, para que aplicar a lista em ordem (a posterior vence)
dê o vencedor certo.

## Escopo
- Faz:
  - Cada ocorrência de variante vira a sua camada, na ordem escrita, sem
    fundir condições iguais; os itens sem variante formam uma camada de
    condição vazia; nenhuma camada vazia (R15, D140).
  - Ordem total (R16, D136): 1) menos átomos antes de mais átomos; 2) com o
    mesmo número, sem faixa de tela antes de `medium`, antes de `expanded`,
    mesmo contra outro tipo de átomo; 3) no mais, a ordem de escrita.
  - O mesmo para as camadas de `props` (R28): `medium(lines-2) lines-4` dá
    duas camadas.
- Não faz: conflito dentro da mesma condição (`029`); avaliar a condição
  (`044`); alinhamento com direção (`031`).

## Arquivos permitidos
- Implementador: `packages/core/src/resolve/layers.ts`.
- QA: `packages/core/test/layers.test.ts`.

## Critérios de aceite
- [ ] Os blocos das seções 5.3, 5.4 e 5.6 da `funcionamento-interno.md` saem
      exatamente iguais.
- [ ] `hover(bg-raised) bg-primary` e `bg-primary hover(bg-raised)` produzem
      IR igual (critério da seção 7 da spec).
- [ ] Nenhuma camada vazia, nem de estilo nem de props (R15).

## Casos que o QA deve cobrir
- 5.3: `hover(bg-raised) press(bg-surface) hover(pad-4)` (três camadas, sem
  fusão); `press(hover(bg-raised))`.
- 5.4: `pad-2 medium(pad-4) expanded(pad-6)` e a ordem inversa (mesma IR);
  tabela de ordem (`hover(bg-raised) bg-primary`,
  `dark(hover(bg-raised)) hover(bg-surface)`, `pad-x-2 medium(pad-4)`,
  `medium(lines-2) lines-4`).
- 5.6: `medium(lines-2) lines-4`.
- Seção 6: `expanded(x) hover(x) medium(x)` na ordem `[hover]`, `[medium]`,
  `[expanded]`.
- `sintaxe.md` 7.7: cada linha, avaliada por um auxiliar **no próprio teste**
  que aplica as camadas cuja condição vale no contexto dado, em ordem (R17).
  Ele não é código de produção; o emissor real é a `044`.
