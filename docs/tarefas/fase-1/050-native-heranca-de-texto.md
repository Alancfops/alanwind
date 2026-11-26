# 050. Native: herança de texto em cascata

- **Status**: pronta (depois da 045)
- **Fase**: 1
- **Branch**: feature/native-heranca-texto
- **Depende de**: 045
- **Paralelo com**: 030, 046
- **Spec**: `docs/specs/componentes.md` R11, R19, R26, R28 a R31, seções 2
  ("Propriedade de texto", "Texto herdado"), 5.3 e 6;
  `docs/specs/emissor-native.md` R20
- **Decisões**: D57, D113, D157, D163, D164, D165

## Objetivo
Mecanismo (contexto React) pelo qual `Box`, `Pressable` e `Text` repassam as
propriedades de texto do seu `look` aos `Text` de dentro, em cascata, com a
mais próxima vencendo por propriedade.

## Escopo
- Faz:
  - O contexto de texto herdado e as funções para separar a parte de texto
    do resultado da resolução interna da `045` e para combinar herdado +
    próprio.
  - **Propriedades herdáveis**, exatamente: `color`, `fontSize`,
    `fontWeight`, `lineHeight`, `textAlign`, `fontFamily`, `fontStyle`,
    `textDecorationLine` e `textTransform`. `numberOfLines` NÃO é herdado
    (R31, D163). Nada fora da lista (`padding*`, `backgroundColor`, bordas)
    é herdado (R28).
  - **Cascata** (R29, D113): quem repassa entrega o que herdou somado ao que
    o próprio `look` declara; a declaração mais próxima vence **por
    propriedade** (a cor do filho vence a do pai; o tamanho do pai
    continua).
  - **`lineHeight`** segue no contexto como `Ratio`, sem multiplicar: o
    `Text` multiplica pelo tamanho final (`052`, componentes R20, emissor
    R20). Assim `<Box look="leading-normal"><Text look="type-lg"/></Box>`
    dá 27, e não 24.
  - **Estado do pai** (R26, D165): a parte de texto repassada é a do `look`
    do pai já avaliado com os estados atuais dele; quem chama (`053`) passa
    os estados.
  - Só o `look` é herdado; o `style` escrito à mão não (R30, D113).
  - Os três componentes repassam: `Box` (R11), `Pressable` (R26) e `Text`
    (R19, D164). A ligação em cada componente é da `051`, `053` e `052`.
- Não faz: os componentes em si (`051` a `053`); o visual padrão do `Text`
  e o cálculo final do `lineHeight` (`052`, D112).

## Arquivos permitidos
- Implementador: `packages/native/src/text-inheritance/**`.
- QA: `packages/native/test/text-inheritance.test.tsx` (Jest, D114; com
  componentes de teste mínimos que usam o contexto, sem depender da 051 a
  053).

## Critérios de aceite
- [ ] Cada uma das nove propriedades da R31 passa do pai ao filho;
      `numberOfLines` não passa (R31).
- [ ] A declaração mais próxima vence só na propriedade que declara (R29).
- [ ] `padding*`, `backgroundColor` e larguras de borda não passam (R28).
- [ ] O `style` do pai não é herdado (R30).
- [ ] `lineHeight` chega ao filho como `Ratio`, não como número (R20).
- [ ] Com estados passados pelo pai, a parte de texto de `press(...)` passa
      só com `press` ativo (R26).

## Casos que o QA deve cobrir
- Pai `bg-danger text-on-danger`, filho sem `look` → cor `on-danger`
  (`#FFFFFF` claro, `#450A0A` escuro) (R28, seção 5.3).
- Pai `text-muted type-lg`, filho `text-strong` → `#141416`, tamanho 18
  (R29).
- Dois níveis: `type-lg` > `text-muted` > filho → `#6B6B74`, 18 (R29).
- Pai `pad-4 bg-surface` → nada passa (R28).
- Pai com `style={{ color: 'red' }}` e sem `look` de texto → nada passa
  (R30).
- Pai `lines-2` → `numberOfLines` não passa (R31, D163).
- Pai `leading-normal` → o filho recebe o `Ratio` 1.5 (R20).
- Pai `bg-primary text-on-primary press(text-strong)` com `press` ativo →
  `#141416`; inativo → `#FFFFFF` (R26, D165).
- Pai com `hover(text-strong)` e sem estados → nada de `hover` passa
  (componentes R12).
