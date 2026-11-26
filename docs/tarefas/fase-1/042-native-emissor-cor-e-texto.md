# 042. Native: emissor de cor e tipografia

- **Status**: bloqueada — aguarda `docs/specs/emissor-native.md` sair do
  rascunho e ser aprovada
- **Fase**: 1
- **Branch**: feature/native-emissor-cor-texto
- **Depende de**: 010
- **Paralelo com**: 041, 043, 044
- **Spec**: `docs/specs/emissor-native.md` seção 1 (fontes por plataforma,
  escala de fonte); `docs/specs/funcionamento-interno.md` R30, R31, R33, R48;
  `docs/specs/tema.md` R15, seções 5.10 e 7.2 (fontes)
- **Decisões**: D20, D23, D31, D49, D104, D120, D133

## Objetivo
Traduzir cor (com esquema e alfa) e tipografia da IR para o estilo do RN,
respeitando a escala de fonte do sistema.

## Escopo
- Faz:
  - `backgroundColor`, `color`, `borderColor`: escolher `light` ou `dark` do
    `ThemedColor` pelo esquema atual e aplicar `alpha` (R30, R31).
  - `fontSize`, `fontWeight`, `textAlign`, `fontStyle`, `textDecorationLine`,
    `textTransform`.
  - `lineHeight`: `fontSize * value` do `Ratio` (R33).
  - `fontFamily` genérica → fonte do sistema da plataforma (tabela 5.10 do
    `tema.md`, D133): `sans` = San Francisco (iOS), Roboto (Android), pilha
    `system-ui` (web); `serif` = Georgia, `serif`, pilha Georgia/serif;
    `mono` = Menlo, `monospace`, pilha `ui-monospace`.
- Não faz: herança de texto (`050`); `numberOfLines` (props, `044`/`045`);
  escolher o esquema (`040`).

## Arquivos permitidos
- Implementador: `packages/native/src/emit/color.ts`,
  `packages/native/src/emit/typography.ts`, `packages/native/src/emit/index.ts`.
- QA: `packages/native/test/emit-color.test.ts`,
  `packages/native/test/emit-typography.test.ts` (Vitest).

## Critérios de aceite
- [ ] Cada linha da tabela de tradução produz o estilo exato, nos dois
      esquemas.
- [ ] Cor com `alpha` < 1 sai no formato que a spec definir.
- [ ] As linhas de fonte da seção 7.2 do `tema.md` saem com a fonte certa por
      plataforma.

## Casos que o QA deve cobrir
- IR de `bg-primary` claro (`#2563EB`) e escuro (`#8AB4FF`); `bg-primary-50`;
  `bg=#e11d48/50`; `text-on-warning` (`#3B2A00` nos dois); `type-lg`;
  `type-lg leading-normal` (`lineHeight` 27 = 18 × 1.5); `font-mono` em iOS,
  Android e web.

## Lacunas que bloqueiam (`emissor-native.md` seção 2)
- Formato de saída da cor com alfa (`rgba(...)` ou `#RRGGBBAA`).
- O texto exato de `fontFamily` no RN para "San Francisco" (no RN o iOS usa
  `'System'`?) e das pilhas da web (`system-ui`, Georgia/serif,
  `ui-monospace`): a spec dá o nome da fonte, não o valor da propriedade.
- `lineHeight` quando o `fontSize` vem da herança (`050`) ou do padrão do
  `Text` (`type-base`, D112): quem multiplica?
- Se o alanwind faz algo além do padrão do RN para a escala de fonte do
  sistema (`allowFontScaling`, limite máximo).
