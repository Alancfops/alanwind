# 050. Native: herança de texto por contexto

- **Status**: bloqueada — aguarda aprovação de `docs/specs/componentes.md` e
  `docs/specs/emissor-native.md`
- **Fase**: 1
- **Branch**: feature/native-heranca-texto
- **Depende de**: 045
- **Paralelo com**: 030
- **Spec**: `docs/specs/componentes.md` §1 (herança de texto);
  `docs/specs/emissor-native.md` §1
- **Decisões**: D57

## Objetivo
Mecanismo (contexto React) pelo qual `Box` e `Pressable` repassam as classes de
texto do seu `look` aos `Text` de dentro, com o `look` do próprio `Text`
vencendo.

## Escopo
- Faz: o contexto de texto herdado e as funções para separar "parte de texto" do
  `look` resolvido (a partir da marcação da IR, `026`) e para combinar herdado +
  próprio.
- Não faz: os componentes em si (`051` a `053`).

## Arquivos permitidos
- Implementador: `packages/native/src/text-inheritance/**`.
- QA: `packages/native/test/text-inheritance.test.tsx`.

## Critérios de aceite
- [ ] Classes de texto de um pai chegam ao `Text` filho (D57).
- [ ] O `look` do `Text` vence o herdado na mesma propriedade (D57).
- [ ] Classes que não são de texto (`pad-4`, `bg-*`) não são herdadas.

## Casos que o QA deve cobrir
- Pai `bg-danger text-on-danger` + `Text` sem `look` → cor `on-danger` (D57).
- Pai `text-muted type-lg` + `Text look="text-strong"` → cor `strong`, tamanho
  `lg` (D57).
- Aninhamento de dois níveis, conforme a spec.

## Lacunas que bloqueiam
- Lista exata das classes herdáveis ("e afins", D57).
- Aninhamento: um `Box` interno sem classe de texto repassa o que herdou do
  `Box` externo? Um `Box` interno com `type-sm` soma ou substitui o herdado?
- O `style` (prop) de texto de um pai também é herdado, ou só o `look`?
