# 046. Native: `defineConfig` e `configure()`

- **Status**: pronta (depois da 035 e da 045)
- **Fase**: 1
- **Branch**: feature/native-configure
- **Depende de**: 035, 045
- **Paralelo com**: 030, 050
- **Spec**: `docs/specs/emissor-native.md` R30, R33 a R37, R41, seções 5.7 e
  6; `docs/specs/tema.md` R22, R27, R28, R33, seções 5.9, 7.3 (linhas de
  `defineConfig({})`, `palette` e `configure`) e 8;
  `docs/specs/funcionamento-interno.md` R6
- **Decisões**: D15, D63, D81, D100, D101, D109, D119, D134, D144, D160, D161

## Objetivo
Permitir que o app RN declare os atalhos em `alanwind.config.ts` e os ligue
com uma chamada `configure(config)` no arquivo de entrada, sem plugin de
build.

## Escopo
- Faz:
  - `defineConfig` exportado de `@alanwind/native`, tipado para aceitar só
    `{ define?: Record<string, string> }` na fase 1: outra chave (`palette`,
    `roles`) é erro de tipo (R33, R34, D81, D100).
  - `configure(config)` exportado de `@alanwind/native`: valida o `define`
    com a `034`, mostra em dev os diagnósticos de carga (`AW301`, `AW302`,
    `AW304`) e passa os atalhos válidos à resolução da `045`, que os expande
    antes de resolver (expansão da `035`) (R35). Atalho com erro de carga é
    descartado, e usá-lo num `look` dá `AW101` (R35, D144).
  - Os avisos usam o mecanismo da `045` (`__DEV__`, `console.warn`, D160).
  - `configure` não lê arquivo: o app importa o `alanwind.config.ts` e chama
    a função (R37).
  - Sem `configure`, os atalhos ficam desligados; `defineConfig({})` ou
    nenhuma configuração dá o tema padrão sem atalhos (R36, `tema.md` R28).
  - **Aviso de ausência** (R36, D161): em dev, só quando um `look` traz
    classe desconhecida (`AW101`) e `configure` não foi chamado, com a dica
    de chamá-lo. Um `look` sem `AW101` não gera esse aviso.
  - **Segunda chamada** substitui os atalhos da anterior, sem somar (R41,
    D161).
  - **Chave além de `define`** (possível em JavaScript puro): ignorada, com
    aviso em dev (R41, D161).
  - Trocar a configuração muda o "tema" da chave do cache da `045`, sem
    aproveitar resultados da configuração anterior (R30, D109).
- Não faz: qualquer chave além de `define` com efeito (fase de tema, D81);
  guardar a configuração entre execuções.

## Arquivos permitidos
- Implementador: `packages/native/src/config/**`,
  `packages/native/src/resolve/**` (só a entrada dos atalhos, o aviso de
  ausência e a parte "tema" da chave), `packages/native/src/index.ts`.
- QA: `packages/native/test/config.test.ts` (Vitest),
  `packages/native/test/config.types.test.ts` (tipos, `expectTypeOf`).

## Critérios de aceite
- [ ] Cada linha da seção 5.7 da `emissor-native.md` dá o resultado
      indicado.
- [ ] `defineConfig({ palette: {} })` é erro de tipo (`@ts-expect-error`)
      (R34).
- [ ] Sem `configure`, `look="btn"` dá `AW101` em dev com a dica de chamar
      `configure`; `look="pad-4"` não avisa nada; em produção, nada é
      mostrado (R36).
- [ ] Depois de uma segunda chamada sem `btn`, `btn` não existe mais (R41).
- [ ] Depois de `configure`, um `look` já resolvido com a configuração
      anterior é resolvido de novo, sem reaproveitar o objeto antigo (R30).

## Casos que o QA deve cobrir
- Seção 5.7, linha a linha: `btn` depois de `configure`; `palette` como
  erro de tipo; `btn` e `pad-4` sem `configure`; `configure` duas vezes;
  `configure({ define: {}, palette: {} })` em JavaScript → aviso;
  `define: { a: 'b', b: 'a' }` → `AW301` e `a` dá `AW101`;
  `define: { row: 'pad-4' }` → `AW302`; `define: { Btn: 'pad-4' }` →
  `AW304` (R33 a R37, R41).
- As linhas da seção 7.3 do `tema.md` que passam pelo `configure`:
  `defineConfig({})`, `palette`, app sem `configure`.
- Produção: nenhuma das situações acima mostra aviso (R31, R36).
