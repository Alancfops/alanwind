# 052. Native: componente `Text`

- **Status**: pronta (depois da 045 e da 050)
- **Fase**: 1
- **Branch**: feature/native-text
- **Depende de**: 045, 050
- **Paralelo com**: 051, 053
- **Spec**: `docs/specs/componentes.md` R1 a R7, R13 a R20, R44, seções 5.2,
  5.3 (linha de `Text` dentro de `Text`) e 6;
  `docs/specs/emissor-native.md` R13, R20, R22
- **Decisões**: D27, D53, D57, D83, D98, D112, D113, D114, D115, D157, D158,
  D164, D166

## Objetivo
`<Text look="...">`: o `Text` do RN com o `look` resolvido, recebendo o texto
herdado, com o próprio `look` vencendo, um visual padrão do tema e o
`lineHeight` calculado sobre o tamanho final.

## Escopo
- Faz:
  - Renderiza um `Text` do RN (R13); todas as props de `Text` e o `ref`
    (R1).
  - **Precedência por propriedade**, da menor para a maior: padrão do
    `Text` (`text-body` e `type-base`), texto herdado (`050`), `look`
    próprio, `style` (R14, R15, D112, D113, D53). O padrão só vale na
    propriedade que nada herdado nem escrito define.
  - **`lineHeight` final** (R20, D157): o `Ratio` (próprio ou herdado) vezes
    o `fontSize` final da precedência acima, arredondado a duas casas, pela
    tradução da `042`. Sem `type-*` em lugar nenhum, o tamanho é 16 e
    `leading-normal` dá 24.
  - **Repasse** (R19, D164): o `Text` também põe no contexto da `050` o
    herdado somado ao que declara (não o padrão). Um `Text` dentro de `Text`
    herda do de fora.
  - `lines-N` → `numberOfLines={N}` (R16); a prop explícita da pessoa vence
    (R5). `numberOfLines` não é repassado (R31 via `050`).
  - Sem estados: variantes de estado não valem e a borda avisa em dev, sem
    código `AW`, pela opção "sem estados" da `045` (R44, D166).
  - Escala de fonte do sistema: NÃO desliga `allowFontScaling` (R17, D115).
  - Nenhum papel de acessibilidade forçado (R18).
  - `look` resolvido pelo `useLook`/resolução interna da `045` com o
    contexto atual, de novo quando ele muda (R4).
- Não faz: tipo da prop com autocomplete (`054`).

## Arquivos permitidos
- Implementador: `packages/native/src/components/Text.tsx`,
  `packages/native/src/index.ts`.
- QA: `packages/native/test/Text.test.tsx` (Jest, `jest-expo` e
  `@testing-library/react-native`, D114, R34).

## Critérios de aceite
- [ ] Cada linha da seção 5.2 da `componentes.md` dá o estilo achatado e as
      props exatos.
- [ ] Sem `look` nem herança: `{ color: '#3B3B42', fontSize: 16 }` claro e
      `{ color: '#C9C9CF', fontSize: 16 }` escuro (R14).
- [ ] Com o contexto da `050` preenchido por um provedor de teste, a
      precedência da R14 vale por propriedade.
- [ ] `lineHeight` sai do tamanho final (R20).
- [ ] `Text` dentro de `Text`: o de dentro herda o de fora (R19).
- [ ] `allowFontScaling` não é `false` e não há `accessibilityRole` (R17,
      R18).
- [ ] `<Text look="press(text-strong)">` avisa em dev, não em produção
      (R44).

## Casos que o QA deve cobrir
- Seção 5.2, linha a linha: padrão claro e escuro; `type-lg`; `type-lg` com
  `style={{ fontSize: 10 }}`; `leading-normal` → `lineHeight` 24;
  `lines-2`; `medium(lines-2) lines-4` com larguras 599 e 700 (R14 a R16,
  R20).
- Seção 5.3, linha de `Text` dentro de `Text`:
  `<Text look="type-lg">Olá <Text look="weight-bold">mundo</Text></Text>`
  → o de dentro com `{ color: '#3B3B42', fontSize: 18, fontWeight: '700' }`
  (R19, D164).
- Com provedor de teste da `050`: herdado `type-lg` sem cor → 18 e
  `#3B3B42` (R14); herdado `leading-normal` com `look="type-lg"` → 27
  (R20).
- `numberOfLines={3}` explícito com `look="lines-2"` → 3 (R5).
- Variante de estado no `Text` (seção 6): camada não vale, aviso em dev.
