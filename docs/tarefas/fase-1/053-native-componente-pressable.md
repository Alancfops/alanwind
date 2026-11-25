# 053. Native: componente `Pressable`

- **Status**: bloqueada — aguarda aprovação de `docs/specs/componentes.md`
- **Fase**: 1
- **Branch**: feature/native-pressable
- **Depende de**: 045, 050
- **Paralelo com**: 051, 052
- **Spec**: `docs/specs/componentes.md` §1
- **Decisões**: D26, D27, D53, D57, D59

## Objetivo
`<Pressable look="...">`: o `Pressable` do RN com `press(...)` e `hover(...)`
ligados ao estado, acessibilidade por padrão e repasse de texto aos filhos.

## Escopo
- Faz: prop `look`; estado `pressed` → `press(...)`, hover com ponteiro →
  `hover(...)` (D59); papel de botão e área mínima de toque por padrão (D26);
  repasse de texto, incluindo as classes de texto dentro de
  `press(...)`/`hover(...)` (D57); `style` vence o `look` (D53); props e `ref`
  do `Pressable`.
- Não faz: `focus(...)` e `disabled(...)`, se não forem aprovadas para a fase 1.

## Arquivos permitidos
- Implementador: `packages/native/src/components/Pressable.tsx`,
  `packages/native/src/index.ts`.
- QA: `packages/native/test/Pressable.test.tsx`.

## Critérios de aceite
- [ ] Pressionado: as classes de `press(...)` valem; solto: não (D59).
- [ ] Sem ponteiro, `hover(...)` nunca vale (D59).
- [ ] Papel de botão por padrão, sobrescrevível pela pessoa (D26).
- [ ] Área mínima de toque garantida conforme a spec (D26).
- [ ] `<Pressable look="bg-danger text-on-danger"><Text>Ok</Text></Pressable>` →
      texto `on-danger` (D57).

## Casos que o QA deve cobrir
- `bg-primary hover(bg-primary-hover) press(bg-primary-hover)` em repouso,
  pressionado, com hover (D59).
- `press(text-on-primary)` chegando ao `Text` filho quando pressionado (D57).
- `accessibilityRole` padrão e sobrescrito pela pessoa.

## Lacunas que bloqueiam
- Valor da área mínima de toque (44 ou 48 dp? seção 5 da visão diz "44 a 48 dp")
  e como ela é garantida (`minHeight`/`minWidth` ou `hitSlop`).
- `tap-target` é um utilitário separado (D18) ou já vem embutido no `Pressable`?
  A D66 diz que utilitários de acessibilidade não estão marcados para a fase 1.
- Quais props de acessibilidade são padrão além do papel (`componentes.md` §2).
- Como `Pressable` expõe os estados para as variantes (`componentes.md` §2).
