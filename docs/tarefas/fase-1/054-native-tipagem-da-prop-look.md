# 054. Native: tipo do `look` nos componentes, em `look()` e em `useLook()`

- **Status**: pronta (depois da 030 e da 051 a 053)
- **Fase**: 1
- **Branch**: feature/native-tipo-look
- **Depende de**: 030, 051, 052, 053
- **Paralelo com**: 055, 060
- **Spec**: `docs/specs/componentes.md` R1, R32, R33, seções 4 e 5.5;
  `docs/specs/emissor-native.md` R40, seção 4 (assinaturas de `look()` e
  `useLook()`); `docs/specs/sintaxe.md` R52
- **Decisões**: D14, D66, D116, D126, D158

## Objetivo
A prop `look` de `Box`, `Text` e `Pressable` e a entrada de `look()` e
`useLook()` usam o tipo da `030`: autocomplete das classes conhecidas e
qualquer `string` aceita, compatível com a Strict TypeScript API do RN 0.88.

## Escopo
- Faz:
  - Trocar `string` pelo tipo da `030` na prop `look` dos três componentes e
    no `input` de `look(input, { context?, states? })` e
    `useLook(input, states?)` (R32, emissor R40, D158).
  - Tipos das props dos três componentes: `ViewProps`, `TextProps` e
    `PressableProps` do RN + `look` (seção 4 da `componentes.md`). A spec
    deixa os nomes exportados para esta tarefa, mas são API pública: estão
    nas "Perguntas" do `README.md`. Sem resposta quando a tarefa começar, os
    tipos ficam internos (não exportados) e o implementador relata.
  - Conferir os tipos das props originais e do `ref` com a Strict
    TypeScript API (R33, seção 3.1 da visão, D14, D116).
- Não faz: mudar o tipo em si (`030`); erro de tipo para classe inválida
  (descartado pela D126); atalhos do `define` no autocomplete.

## Arquivos permitidos
- Implementador: `packages/native/src/components/*.tsx`,
  `packages/native/src/resolve/**` (só assinaturas),
  `packages/native/src/index.ts` (só exports de tipos).
- QA: `packages/native/test/types.test.ts` (Vitest, `expectTypeOf`).

## Critérios de aceite
- [ ] Cada linha da seção 5.5 da `componentes.md` dá o resultado indicado.
- [ ] O tipo da prop `look` e do `input` de `look()` e `useLook()` é o tipo
      da `030`, não `string` puro (R32, D158).
- [ ] Props nativas (`onPress`, `accessibilityRole`, `hitSlop`, `ref`)
      mantêm os tipos originais (R33).
- [ ] `pnpm run typecheck` passa com a Strict TypeScript API do RN 0.88.

## Casos que o QA deve cobrir
- Seção 5.5: `<Box look="pad-4" />` compila; `<Box look="pad-17" />`
  compila (D126); `<Pressable onPress={1} />` é erro
  (`@ts-expect-error`); o `ref` de um `Box` recebe `View`.
- `look('pad-17')` e `useLook('bg-banana')` compilam; o parâmetro de
  `look()` e de `useLook()` tem o tipo da `030` (`expectTypeOf`).
- Os exemplos da `030`, agora na prop de cada componente.
- Observação: o autocomplete no editor é conferido à mão e registrado no
  relatório (critério da seção 7 da `componentes.md`).
