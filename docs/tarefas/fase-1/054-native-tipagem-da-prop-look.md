# 054. Native: tipagem estrita da prop `look` nos componentes

- **Status**: bloqueada — aguarda aprovação de `docs/specs/componentes.md` e
  `docs/specs/sintaxe.md` (tipos)
- **Fase**: 1
- **Branch**: feature/native-tipagem-look
- **Depende de**: 030, 051, 052, 053
- **Paralelo com**: 060
- **Spec**: `docs/specs/componentes.md` §1; `docs/specs/sintaxe.md` §1.10
- **Decisões**: D14, D20, D66

## Objetivo
A prop `look` de `Box`, `Text` e `Pressable` (e a função de resolução da `045`)
usa o tipo da `030`: autocomplete e erro de tipo para classe inválida,
compatível com a Strict TypeScript API do RN 0.88.

## Escopo
- Faz: trocar `string` pelo tipo da `030` nas props e na função pública;
  conferir os tipos das props originais e do `ref` com a Strict TypeScript API
  (seção 3.1).
- Não faz: mudar o tipo em si (é da `030`).

## Arquivos permitidos
- Implementador: `packages/native/src/components/*.tsx`,
  `packages/native/src/resolve/**` (só assinaturas).
- QA: `packages/native/test/types.test-d.tsx`.

## Critérios de aceite
- [ ] `<Box look="pad-4" />` compila; `<Box look="pad-17" />` é erro de tipo.
- [ ] Props nativas (`onPress`, `accessibilityRole`, `ref`) mantêm os tipos
      originais.

## Casos que o QA deve cobrir
- Os exemplos aceitos e rejeitados da `030`, agora na prop de cada componente.

## Lacunas que bloqueiam
- As mesmas da `030`.
