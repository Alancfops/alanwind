# 040. Native: contexto de resolução (esquema, faixa de tela, plataforma)

- **Status**: pronta (depois da 002 e da 012)
- **Fase**: 1
- **Branch**: feature/native-contexto
- **Depende de**: 002, 012 (breakpoints)
- **Paralelo com**: 011, 013, 014 e as demais tarefas do `core`
- **Spec**: `docs/specs/emissor-native.md` R1 a R6, seções 2, 4 (tipos
  `ScreenBand` e `ResolutionContext`) e 6; `docs/specs/tema.md` R3, R4, R16,
  seções 5.8 e 7.2 (larguras), critério C8
- **Decisões**: D14, D25, D29, D61, D64, D94, D109, D114, D152, D153, D162

## Objetivo
Ler na borda RN o contexto que muda o resultado do `look` (esquema, faixa de
tela, plataforma e janela) e oferecer `setColorScheme` sem Provider.

## Escopo
- Faz:
  - Os tipos `ScreenBand` e `ResolutionContext` da seção 4 da
    `emissor-native.md`, exportados de `@alanwind/native`. As tarefas 041,
    042, 044 e 045 usam esses tipos.
  - Esquema seguindo o sistema e acompanhando as mudanças dele (R2, D25).
  - `setColorScheme('light' | 'dark' | 'system')`, exportado, sem Provider,
    com os componentes já montados atualizando; `'system'` volta a seguir o
    sistema (R3, D64). O esquema forçado é um **estado próprio do alanwind**,
    igual no iOS, no Android e na web; NÃO chama `Appearance.setColorScheme`
    (R3, D162).
  - Faixa de tela pela largura da janela: `compact` abaixo de 600, `medium`
    de 600 a 839, `expanded` a partir de 840 (R4, D94). Os limites 600 e 840
    vêm do tema que o `core` guarda (`012`), lidos por esta camada de
    contexto; não há número repetido aqui (R4, D153).
  - Janela (`width` e `height`, em dp) no contexto, a mesma usada para a
    faixa e para as unidades de tela (R1, R39, D152).
  - Plataforma `ios`, `android` ou `web` via `Platform.OS` (R5).
  - Duas formas de ler o contexto, para a `045` (R40, D158): um
    **instantâneo** (esquema, janela, faixa e plataforma naquele momento, sem
    reagir) e um **hook** que entrega o contexto atual e re-renderiza quando
    o esquema ou a janela mudam (R6; a janela exata é necessária às unidades
    de tela, R39). Os nomes internos ficam com o implementador e não são
    exportados; só `setColorScheme` e os tipos são públicos.
- Não faz: estados de interação (vêm do componente, `044`, `053`, D110);
  avaliar condições da IR (`044`); cache e regra de quando a janela exata
  entra na chave (`045`, R39); guardar a escolha de `setColorScheme` entre
  execuções do app (fora do escopo da spec, seção 1).

## Arquivos permitidos
- Implementador: `packages/native/src/context/**`,
  `packages/native/src/index.ts`.
- QA: `packages/native/test/context.test.tsx` (Jest, `jest-expo`, D114).

## Critérios de aceite
- [ ] Sem chamar `setColorScheme`, o esquema segue o sistema e acompanha a
      mudança dele (R2).
- [ ] `setColorScheme('dark')` força escuro em toda a árvore, sem Provider, e
      componentes já montados atualizam; `'system'` volta ao sistema (R3,
      `tema.md` C8).
- [ ] `setColorScheme` não chama `Appearance.setColorScheme` (R3, D162).
- [ ] Larguras 599, 600, 839 e 840 dão `compact`, `medium`, `medium` e
      `expanded` (R4).
- [ ] Os números 600 e 840 não aparecem em `packages/native/src/context/**`:
      vêm do tema do `core` (R4, D153).
- [ ] O contexto traz `window` com largura e altura da janela (R1).
- [ ] O instantâneo não muda depois de lido; o hook entrega o contexto novo
      quando o esquema ou a janela mudam (R6, R40).
- [ ] Os tipos `ScreenBand` e `ResolutionContext` batem com a seção 4.

## Casos que o QA deve cobrir
- Sistema claro e escuro × `setColorScheme('light' | 'dark' | 'system')`
  (R2, R3).
- `setColorScheme` com `Platform.OS` igual a `ios`, `android` e `web`: o
  mesmo comportamento, sem `Appearance.setColorScheme` (espião no mock, R3,
  D162).
- Larguras 599 → `compact`, 600 → `medium`, 839 → `medium`, 840 →
  `expanded` (R4; seção 6 da `emissor-native.md`).
- Largura de 700 para 800: a faixa continua `medium` (R6).
- `Platform.OS` em `ios`, `android`, `web` (R5).
- Janela 390 × 844 no contexto (exemplos da seção 5.4).
