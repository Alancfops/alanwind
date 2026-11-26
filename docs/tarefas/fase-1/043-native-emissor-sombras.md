# 043. Native: emissor de sombras por plataforma e esquema

- **Status**: bloqueada — aguarda aprovação de `docs/specs/emissor-native.md` e
  `docs/specs/tema.md` (sombras)
- **Fase**: 1
- **Branch**: feature/native-emissor-sombras
- **Depende de**: 010, 014
- **Paralelo com**: 041, 042, 044
- **Spec**: `docs/specs/emissor-native.md` §1 (sombras); `docs/specs/tema.md`
  §1.5
- **Decisões**: D45

## Objetivo
Traduzir `shadow-*` da IR para propriedades de sombra no iOS, elevação no
Android e o tratamento do tema escuro (fundo mais claro + borda fina + sombra
discreta).

## Escopo
- Faz: a tabela de tradução da spec para `ios`, `android` e `web` (via
  react-native-web), nos dois esquemas.
- Não faz: os valores do tema (`014`).

## Arquivos permitidos
- Implementador: `packages/native/src/emit/shadow.ts`,
  `packages/native/src/emit/index.ts`.
- QA: `packages/native/test/emit-shadow.test.ts`.

## Critérios de aceite
- [ ] `shadow-sm|md|lg` × plataforma × esquema produz o estilo exato da spec.

## Casos que o QA deve cobrir
- As 3 sombras × 3 plataformas × 2 esquemas, da tabela da spec (D45).

## Lacunas que bloqueiam
- Valores exatos (ver `014`).
- RN 0.88 tem `boxShadow` multiplataforma; a spec precisa dizer se usa ele ou
  `shadow*`/`elevation` (a D45 cita "propriedades de sombra no iOS, elevação no
  Android").
- Conflito da sombra escura com um `bg-*` no mesmo `look`.
