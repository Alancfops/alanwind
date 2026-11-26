# 046. Native: `defineConfig` e `configure()`

- **Status**: bloqueada — aguarda `docs/specs/emissor-native.md` sair do
  rascunho e ser aprovada
- **Fase**: 1
- **Branch**: feature/native-configure
- **Depende de**: 035, 045
- **Paralelo com**: 030, 050
- **Spec**: `docs/specs/tema.md` R22, R27, R28, R33, seções 5.9, 7.3 (linhas
  de `defineConfig({})`, `palette` e `configure`) e 8;
  `docs/specs/emissor-native.md` seção 1 (configuração no RN)
- **Decisões**: D15, D63, D81, D100, D119

## Objetivo
Permitir que o app RN declare os atalhos em `alanwind.config.ts` e os ligue
com uma chamada `configure(config)` no arquivo de entrada, sem plugin de
build.

## Escopo
- Faz:
  - `defineConfig` exportado de `@alanwind/native`, tipado para aceitar só
    `{ define?: Record<string, string> }` na fase 1 (R22): outra chave é erro
    de tipo.
  - `configure(config)` exportado de `@alanwind/native`: valida o `define`
    com a `034`, mostra em dev os diagnósticos de carregamento e passa os
    atalhos válidos para a resolução da `045` (expansão pela `035`).
  - Sem a chamada, os atalhos ficam desligados, com aviso em dev (R33, D119);
    `defineConfig({})` ou sem arquivo → tema padrão, sem atalhos (R28).
  - A troca de configuração invalida o cache da `045` (o tema faz parte da
    chave, D109).
- Não faz: ler o arquivo sozinho (o app importa e chama `configure`, D119);
  qualquer chave além de `define` (fase de tema, D81).

## Arquivos permitidos
- Implementador: `packages/native/src/config/**`,
  `packages/native/src/resolve/**` (só a entrada dos atalhos),
  `packages/native/src/index.ts`.
- QA: `packages/native/test/config.test.ts` (Vitest),
  `packages/native/test/config.types.test.ts` (tipos, `expectTypeOf`).

## Critérios de aceite
- [ ] Depois de `configure(defineConfig(...))` com
      `define: { btn: 'bg-primary pad-4' }`, `btn` resolve como
      `bg-primary pad-4`.
- [ ] `defineConfig({ palette: {} })` é erro de tipo (`@ts-expect-error`).
- [ ] Sem `configure`, `btn` não expande e há aviso em dev; em produção, nada
      é mostrado.
- [ ] Um `define` com ciclo mostra `AW301` em dev e o atalho em ciclo não gera
      estilo.

## Casos que o QA deve cobrir
- As linhas da seção 7.3 do `tema.md` que passam pelo `configure`:
  `defineConfig({})`, `palette`, app sem `configure`.
- Um caso de cada código de carregamento (`AW301`, `AW302`, `AW304`) chegando
  ao aviso de dev.

## Lacunas que bloqueiam
- Quando sai o aviso de "sem `configure`": uma vez na primeira resolução, ou
  só quando um `look` usa um nome que seria atalho (que hoje vira `AW101`)?
- O mesmo mecanismo de aviso em dev da `045`.
