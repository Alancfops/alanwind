# 042. Native: emissor de cor e tipografia

- **Status**: bloqueada — aguarda aprovação de `docs/specs/emissor-native.md` e
  `docs/specs/ir.md`
- **Fase**: 1
- **Branch**: feature/native-emissor-cor-texto
- **Depende de**: 010
- **Paralelo com**: 041, 043, 044
- **Spec**: `docs/specs/emissor-native.md` §1 (escala de fonte do sistema) e
  tabela de tradução (a escrever)
- **Decisões**: D20, D23, D31, D49

## Objetivo
Traduzir declarações de cor (com esquema e opacidade) e de texto para o estilo
do RN, respeitando a escala de fonte do sistema.

## Escopo
- Faz: cor de fundo, texto e borda escolhendo o valor do esquema atual (D20);
  opacidade por sufixo aplicada na cor (D31); tamanho, peso e demais
  propriedades de texto da spec; respeito à escala de fonte do sistema (seção 5
  da visão).
- Não faz: herança de texto (`050`); props que não são estilo (`numberOfLines`),
  salvo se a spec puser no emissor.

## Arquivos permitidos
- Implementador: `packages/native/src/emit/color.ts`,
  `packages/native/src/emit/typography.ts`, `packages/native/src/emit/index.ts`.
- QA: `packages/native/test/emit-color.test.ts`,
  `packages/native/test/emit-typography.test.ts`.

## Critérios de aceite
- [ ] Cada linha da tabela de tradução produz o estilo exato, nos dois esquemas.
- [ ] Opacidade 50 sobre uma cor produz o formato de cor que a spec definir
      (ex.: `rgba` ou hex de 8 dígitos).

## Casos que o QA deve cobrir
- IR de `bg-primary` claro e escuro; `bg-primary-50` (D31); `text-on-warning`
  (D47); `type-lg` (D49).

## Lacunas que bloqueiam
- Formato de saída da cor com alfa.
- Como "respeitar a escala de fonte do sistema" (o `Text` do RN já escala por
  padrão com `allowFontScaling`; falta decidir se o alanwind faz algo além, ex.:
  limite máximo).
- Mapeamento de `font-*` e `weight-*` no RN.
