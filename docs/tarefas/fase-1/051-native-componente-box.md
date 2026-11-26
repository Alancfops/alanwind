# 051. Native: componente `Box`

- **Status**: pronta (depois da 045 e da 050)
- **Fase**: 1
- **Branch**: feature/native-box
- **Depende de**: 045, 050
- **Paralelo com**: 052, 053
- **Spec**: `docs/specs/componentes.md` R1 a R12, seções 5.1 e 6;
  `docs/specs/emissor-native.md` R13, R40
- **Decisões**: D26, D27, D53, D57, D62, D84, D113, D114, D115, D158, D166,
  D167, D168, D177

## Objetivo
`<Box look="...">`: um `View` do RN com o `look` resolvido, sempre flex em
coluna, somando ao `style` da pessoa e repassando texto aos filhos.

## Escopo
- Faz:
  - Renderiza um `View` (R8); aceita todas as props de `View` e repassa o
    `ref` (R1).
  - **Base do componente**: `flexDirection: 'column'` explícito, abaixo do
    `look` e do `style`; `row` no `look` e o `style` sobrepõem (R9, D62,
    D168).
  - Estilo final = base + estilo do `look` + `style` da pessoa, nessa ordem;
    achatado, o `style` vence o `look` propriedade a propriedade (R2, D53).
    O `style` NÃO é normalizado: `style={{ padding: 2 }}` não vence os lados
    do `look` (R2, D167).
  - `look` ausente ou vazio: só a base (R3).
  - As propriedades de texto do `look` (as nove da R31) vão **só** para o
    contexto da `050`, nunca para o `style` do `View` (D177).
  - `look` resolvido pelo `useLook` (pela resolução interna da `045`), com o
    contexto atual e resolvido de novo quando ele muda (R4, D158).
  - Props do `look` aplicadas; a prop explícita da pessoa vence (R5).
  - Sem estados: variantes de estado não valem (emissor R13) e a borda avisa
    em dev, sem código `AW`, pela opção "sem estados" da `045` (R12, D166).
  - Repassa o texto pelo contexto da `050` (R11).
  - Nenhum `accessibilityRole` padrão (R10, D115); funciona via
    `react-native-web` (R7, D26).
- Não faz: tipo da prop com autocomplete (`054`); estados de interação (só
  no `Pressable`); o aviso da D167 no `README.md` do pacote (`056`, D178).

## Arquivos permitidos
- Implementador: `packages/native/src/components/Box.tsx`,
  `packages/native/src/index.ts`.
- QA: `packages/native/test/Box.test.tsx` (Jest, `jest-expo` e
  `@testing-library/react-native`, D114, R34).

## Critérios de aceite
- [ ] O aviso de variante de estado (D166) sai uma vez por `look` e posição da
      variante (D181).
- [ ] `<Box look="lines-2">` não passa `numberOfLines` e avisa em dev (D180).
- [ ] Cada linha da seção 5.1 da `componentes.md` dá o estilo achatado
      exato (`StyleSheet.flatten`).
- [ ] `<Box />` sem `look` é `{ flexDirection: 'column' }` e não tem
      `accessibilityRole` (R9, R10).
- [ ] O `ref` chega ao `View` (R1).
- [ ] `<Box look="hover(bg-raised)">` avisa em dev e não avisa em produção
      (R12).
- [ ] O texto do `look` chega ao contexto da `050` (R11) e não aparece no
      `style` do `View`: `<Box look="text-muted type-lg">` tem estilo
      `{ flexDirection: 'column' }` (D177).

## Casos que o QA deve cobrir
- Seção 5.1, linha a linha: `<Box />`; `look="row"`; `look="pad-4"` com
  `style={{ paddingTop: 2 }}`; `look="dark(bg-surface)"` com
  `setColorScheme('dark')`; `look="hover(bg-raised)"` (aviso, D166);
  `look="pad-4"` com `style={{ padding: 2 }}` (D167).
- O que o `Box` põe no contexto da `050`, lido por um consumidor mínimo no
  teste (sem o `Text` da `052`): `look="text-muted type-lg"` repassa cor e
  tamanho; `pad-4 bg-surface` não repassa nada; `style={{ color: 'red' }}`
  não repassa; `hover(text-strong)` não repassa; `Box` dentro de `Box` soma
  o herdado ao próprio (R11, R28 a R30). As árvores completas da seção 5.3
  ficam com a `055`.
- `<Box look="dark(bg-surface)">` montado em claro e trocado para escuro
  com `setColorScheme` (R4).
