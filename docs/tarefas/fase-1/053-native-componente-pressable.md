# 053. Native: componente `Pressable`

- **Status**: bloqueada — aguarda `docs/specs/componentes.md` sair do rascunho
  e ser aprovada
- **Fase**: 1
- **Branch**: feature/native-pressable
- **Depende de**: 045, 050
- **Paralelo com**: 051, 052
- **Spec**: `docs/specs/componentes.md` seção 1 (área de toque,
  acessibilidade, herança); `docs/specs/emissor-native.md` seção 1 (estados,
  ponteiro)
- **Decisões**: D26, D27, D53, D57, D59, D78, D103, D110, D111, D113, D114,
  D115

## Objetivo
`<Pressable look="...">`: o `Pressable` do RN com as variantes de estado
ligadas, acessibilidade por padrão e repasse de texto aos filhos.

## Escopo
- Faz:
  - Estados → variantes: pressionado → `press(...)`; evento de hover
    (`onHoverIn`/`onHoverOut`) → `hover(...)`, que nunca vale sem ponteiro
    (D59, D110); foco → `focus(...)`; prop `disabled` → `disabled(...)`
    (D103).
  - Área mínima de toque com `hitSlop`, sem mudar o visual: 44 no iOS e na
    web, 48 no Android (D111).
  - `accessibilityRole='button'` por padrão, trocável pela pessoa;
    `accessibilityState.disabled` ligado à prop `disabled`; foco visível na
    web (D115).
  - Repasse de texto pela `050` (D57).
  - `style` vence o `look` (D53); props e `ref` do `Pressable`.
- Não faz: tipo da prop com autocomplete (`054`); utilitário `tap-target`
  (fora da fase 1, D78).

## Arquivos permitidos
- Implementador: `packages/native/src/components/Pressable.tsx`,
  `packages/native/src/index.ts`.
- QA: `packages/native/test/Pressable.test.tsx` (Jest, D114).

## Critérios de aceite
- [ ] Pressionado: as classes de `press(...)` valem; solto: não (D59).
- [ ] Sem evento de hover, `hover(...)` nunca vale (D110).
- [ ] `disabled` liga `disabled(...)` e `accessibilityState.disabled` (D103,
      D115).
- [ ] Papel `button` por padrão, sobrescrevível (D115).
- [ ] `hitSlop` garante 44 (iOS e web) ou 48 (Android) sem mudar o tamanho
      visual (D111).
- [ ] `<Pressable look="bg-danger text-on-danger"><Text>Ok</Text></Pressable>`
      → texto `on-danger` (D57).

## Casos que o QA deve cobrir
- `bg-primary hover(bg-primary-hover) press(bg-primary-hover)` em repouso,
  pressionado e com hover (D59).
- `disabled(opacity-50)` com `disabled` ligado e desligado.
- `focus(border-focus)` com foco.
- `accessibilityRole` padrão e sobrescrito.
- Um `Pressable` de 20 × 20 no iOS e no Android: `hitSlop` completa 44 e 48.

## Lacunas que bloqueiam (`componentes.md` seção 2)
- Como o `Pressable` expõe os estados para as variantes (o que passa à
  resolução da `045`/`044`).
- Texto dentro de variante de estado do pai (`press(text-on-primary)`) chega
  ao `Text` filho quando o `Pressable` está pressionado? A D57 não diz (ver
  `050`).
- Como fica o foco visível na web (`focus-ring` está fora da fase 1, D78).
- Como o `hitSlop` é calculado quando o tamanho só é conhecido depois do
  layout (`onLayout`?) e quando a pessoa passa o próprio `hitSlop`.
