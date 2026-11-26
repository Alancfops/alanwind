# 053. Native: componente `Pressable`

- **Status**: pronta (depois da 045 e da 050)
- **Fase**: 1
- **Branch**: feature/native-pressable
- **Depende de**: 045, 050
- **Paralelo com**: 051, 052
- **Spec**: `docs/specs/componentes.md` R1 a R7, R21 a R27, seções 5.4 e 6;
  `docs/specs/emissor-native.md` R10, R13, R24, seção 4
  (`InteractionStates`)
- **Decisões**: D26, D27, D53, D57, D59, D78, D103, D110, D111, D113, D114,
  D115, D158, D165, D169, D170, D171

## Objetivo
`<Pressable look="...">`: o `Pressable` do RN com as variantes de estado
ligadas, área mínima de toque, acessibilidade por padrão e repasse de texto
aos filhos.

## Escopo
- Faz:
  - Renderiza um `Pressable` do RN; todas as props e o `ref` (R1). `style`
    como objeto ou como função, como o original; o resultado vence o `look`
    (R21, R2).
  - **Estados** passados ao `useLook` como `InteractionStates` (R22, emissor
    R10):
    - `press` enquanto pressionado (`onPressIn`/`onPressOut`);
    - `hover` só entre `onHoverIn` e `onHoverOut`; sem ponteiro, nunca vale,
      nem pressionado (D59, D110);
    - `focus` só por `onFocus`/`onBlur` (teclado e web); o foco de leitor de
      tela não ativa `focus(...)` (D171);
    - `disabled` com a prop `disabled` ligada (D103).
  - **Callbacks da pessoa** (`onPressIn`, `onPressOut`, `onHoverIn`,
    `onHoverOut`, `onFocus`, `onBlur`, `onLayout`) continuam sendo chamados,
    além de atualizar o estado (R23).
  - **Área mínima de toque** com `hitSlop`, sem mudar o visual (R24, D111,
    D170): mínimo 44 × 44 no iOS e na web, 48 × 48 no Android. Em cada eixo,
    se o tamanho medido no `onLayout` é menor que o mínimo, cada lado recebe
    `ceil((mínimo - tamanho) / 2)`; se já tem o mínimo, nada. Antes do
    primeiro `onLayout`, nenhum `hitSlop`. Se a pessoa passar `hitSlop`, o
    dela vence.
  - **Acessibilidade** (R25, D115):
    - `accessibilityRole` `'button'` por padrão; se a pessoa passar
      `accessibilityRole` ou `role`, o padrão não se aplica;
    - `accessibilityState.disabled` segue a prop `disabled`, preservando as
      outras chaves de `accessibilityState` da pessoa;
    - na web, o outline de foco do navegador não é removido e não há anel
      próprio; `focus(...)` personaliza (D169).
  - **Repasse de texto** pela `050`, com o `look` avaliado nos estados
    atuais: `press(text-on-primary)` chega ao `Text` filho enquanto
    pressionado (R26, D165).
- Não faz: tipo da prop com autocomplete (`054`); `tap-target` e
  `focus-ring` (fora da fase 1, R27, D78).

## Arquivos permitidos
- Implementador: `packages/native/src/components/Pressable.tsx`,
  `packages/native/src/index.ts`.
- QA: `packages/native/test/Pressable.test.tsx` (Jest, `jest-expo` e
  `@testing-library/react-native`, D114, R34).

## Critérios de aceite
- [ ] As duas tabelas da seção 5.4 da `componentes.md` dão o resultado
      indicado, linha a linha.
- [ ] Sem evento de hover, `hover(...)` nunca vale, nem pressionado (R22).
- [ ] O foco de acessibilidade (sem `onFocus`) não ativa `focus(...)`
      (R22, D171).
- [ ] Os sete callbacks da R23 da pessoa são chamados.
- [ ] `hitSlop` só depois do primeiro `onLayout`; o tamanho visual não muda;
      o `hitSlop` da pessoa vence (R24).
- [ ] Nenhum estilo de `outline*` é gerado pelo componente sem `focus(...)`
      no `look` (R25, D169).
- [ ] Com `press` ativo, o contexto da `050` leva a parte de texto de
      `press(...)`; solto, não (R26).

## Casos que o QA deve cobrir
- Seção 5.4, `bg-primary hover(bg-raised) press(bg-primary-hover)`:
  repouso `'#2563EB'`; pressionado sem hover `'#1D4FD8'`; hover sem
  pressionar `'#FFFFFF'`; hover e pressionado `'#1D4FD8'`; solto de novo
  `'#2563EB'` (R22).
- Seção 5.4, segunda tabela: `disabled(opacity-50)` com e sem `disabled`;
  `focus(border-focus)` com foco; papel padrão e `accessibilityRole="link"`;
  `accessibilityState={{ selected: true }}` com `disabled`; `w=20 h=20` no
  iOS, na web (12 por lado) e no Android (14 por lado); `w=60 h=60`
  (nenhum); antes do primeiro `onLayout` (nenhum); `hitSlop={4}` (vale 4)
  (R24, R25).
- `role="link"` sem `accessibilityRole` → o padrão não se aplica (R25).
- Callback `onPressIn` da pessoa chamado e `press(...)` aplicado no mesmo
  toque (R23).
- Contexto da `050` com `bg-primary text-on-primary press(text-strong)`:
  pressionado → `#141416`; solto → `#FFFFFF` (R26). A árvore com `Text`
  real fica com a `055`.
