# 054. Native: tipo da prop `look` nos componentes

- **Status**: bloqueada — aguarda `docs/specs/componentes.md` sair do rascunho
  e ser aprovada
- **Fase**: 1
- **Branch**: feature/native-tipo-look
- **Depende de**: 030, 051, 052, 053
- **Paralelo com**: 060
- **Spec**: `docs/specs/componentes.md` seção 1 (prop `look`);
  `docs/specs/sintaxe.md` R52
- **Decisões**: D14, D66, D116, D126

## Objetivo
A prop `look` de `Box`, `Text` e `Pressable` (e a função de resolução da
`045`) usa o tipo da `030`: autocomplete das classes conhecidas e qualquer
`string` aceita, compatível com a Strict TypeScript API do RN 0.88.

## Escopo
- Faz: trocar `string` pelo tipo da `030` nas props e na função pública;
  conferir os tipos das props originais e do `ref` com a Strict TypeScript API
  (seção 3.1 da visão, D14, D116).
- Não faz: mudar o tipo em si (`030`); erro de tipo para classe inválida
  (descartado pela D126).

## Arquivos permitidos
- Implementador: `packages/native/src/components/*.tsx`,
  `packages/native/src/resolve/**` (só assinaturas).
- QA: `packages/native/test/types.test.ts` (Vitest, `expectTypeOf`).

## Critérios de aceite
- [ ] `<Box look="pad-4" />` e `<Box look="pad-17" />` compilam (D126).
- [ ] O tipo da prop `look` é o tipo da `030`, não `string` puro.
- [ ] Props nativas (`onPress`, `accessibilityRole`, `hitSlop`, `ref`)
      mantêm os tipos originais.

## Casos que o QA deve cobrir
- Os exemplos da `030`, agora na prop de cada componente.
- `@ts-expect-error` para prop nativa com tipo errado (`onPress={1}`),
  provando que a tipagem original continua.
- Observação: o autocomplete no editor é conferido à mão e registrado no
  relatório.
