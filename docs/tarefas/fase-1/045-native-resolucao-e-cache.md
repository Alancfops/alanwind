# 045. Native: resolução ponta a ponta, cache, `look()` e `useLook()`

- **Status**: pronta (depois da 022 a 029, 031 a 033 e 040 a 044)
- **Fase**: 1
- **Branch**: feature/native-resolucao-cache
- **Depende de**: 022 a 029, 031, 032, 033, 040 a 044
- **Paralelo com**: 030, 035
- **Spec**: `docs/specs/emissor-native.md` R6, R15, R20 (tamanho do próprio
  `look`), R23, R25 a R32, R39, R40, seções 4, 5.1, 5.2, 5.4 a 5.6 e 6;
  `docs/specs/componentes.md` R12, R44 (aviso de variante de estado);
  `docs/specs/funcionamento-interno.md` R2, R41, R42; `docs/specs/sintaxe.md`
  R1, R46
- **Decisões**: D15, D26, D27, D35, D84, D88, D109, D152, D157, D158, D159,
  D160, D166, D176

## Objetivo
Juntar `core` e emissor: `look` + contexto + estados → estilo e props do RN,
com cache LRU por faixa de tela, a API pública `look()` e `useLook()`, e os
avisos de desenvolvimento.

## Escopo
- Faz:
  - **Pipeline** (R25): `core` (`look` + tema → IR e diagnósticos),
    avaliação das camadas (`044`) e tradução (`041` a `043`). Mesma entrada
    (`look`, tema, contexto, estados) dá o mesmo resultado (D15).
  - **Tipos** `NativeLook` e `NativeStyle` da seção 4, exportados.
    `NativeStyle` é o subconjunto de `ViewStyle` e `TextStyle` que a R16
    produz. `props` é `{}` sem camada de props que valha (R23).
  - **`lineHeight` na API pública**: o tamanho da fonte é o `fontSize` que o
    próprio `look` resolve no contexto e nos estados dados
    (`type-lg leading-normal` → 27; `type-2xl leading=1.4` → 33.6; R20,
    D157), traduzido pela `042`. Sem `type-*` no `look`, a conta usa 16,
    o tamanho padrão do `Text` (`type-base`): `look('leading-normal')` →
    `lineHeight` 24, sem `fontSize` no estilo (D176, D112).
  - **Resolução interna para os componentes** (não exportada): o mesmo
    resultado, mas com o `lineHeight` ainda como `Ratio` e o `fontSize`
    próprio separado, para a `050` repassar e a `052` multiplicar pelo
    tamanho final (emissor R20, componentes R20). Opção de "elemento sem
    estados" para `Box` e `Text`: se a IR tem átomo `state`, a borda avisa
    em dev, sem código `AW` (componentes R12, R44, D166); a camada já não
    vale pela R13.
  - **API pública** (R40, D158), exportada de `@alanwind/native`:
    - `look(input, { context?, states? })` → `NativeLook`. Sem `context`,
      lê o instantâneo da `040` (esquema e janela naquele momento) e não
      reage a mudanças.
    - `useLook(input, states?)` → `NativeLook`. Usa o hook da `040` e reage
      a `setColorScheme` e à mudança de faixa (e da janela, quando o `look`
      tem unidade de tela). É o que os componentes usam.
    - O tipo do `input` é `string` nesta tarefa; a `054` troca pelo tipo da
      `030`.
  - **Cache** (D109):
    - Chave = texto do `look` + faixa (não a largura) + esquema + plataforma
      + tema (R26). O "tema" na chave é a configuração atual, que a `046`
      troca (R30).
    - Quando a IR do `look` tem unidade de tela, a chave leva também a
      largura e a altura exatas da janela (R39, D152); os demais `look`
      ficam só com a faixa (R6).
    - LRU: passado o limite, sai a combinação usada há mais tempo (R27). O
      limite é uma constante nomeada, exportada para os testes, de valor
      500 (D159).
    - Mesma entrada e mesmo contexto devolvem **o mesmo objeto**, que não é
      alterado depois de guardado (R28).
    - Estados fora da chave: cada entrada guarda o resultado de cada
      combinação de estados já pedida (no máximo 16); mesmos estados dão o
      mesmo objeto (R29, D159).
  - **Diagnósticos** (R31, D160): o `core` devolve; em dev (`__DEV__`), a
    borda mostra com `console.warn`, **um aviso por combinação de `look`,
    código e posição**, quando o `look` entra no cache; em produção, nada.
  - **Sem exceção** (R32, D88): para qualquer string, a resolução não lança;
    o trecho ruim é descartado e o resto vale.
- Não faz: componentes (`051` a `053`); atalhos, `configure` e o aviso de
  ausência de `configure` (`046`); o tipo do `look` (`054`).

## Arquivos permitidos
- Implementador: `packages/native/src/resolve/**`,
  `packages/native/src/warn/**`, `packages/native/src/index.ts`.
- QA: `packages/native/test/resolve.test.ts` (Vitest; `look()` com `context`
  explícito), `packages/native/test/use-look.test.tsx` (Jest, `jest-expo`,
  D114; `useLook()`, `look()` sem `context` e avisos com `__DEV__`).

## Critérios de aceite
- [ ] Cada linha das seções 5.1, 5.2 e 5.4 sai exata por `look()` com o
      contexto da linha (padrão: `compact`, `ios`, janela 390 × 844).
- [ ] Cada linha da seção 5.5 (cache) dá o resultado indicado; o teste do
      LRU lê a constante, sem repetir 500 (R27).
- [ ] `look('leading-normal')` → `{ lineHeight: 24 }` (D176).
- [ ] Mesma entrada, mesmo contexto e mesmos estados → mesmo objeto (R28,
      R29).
- [ ] Larguras 700 e 800 dão o mesmo objeto; 599 e 600 não; `h-screen` com
      janela 390 × 844 e 390 × 800 dá objetos diferentes (R26, R39).
- [ ] Seção 5.6: aviso em dev, nada em produção, estilo igual nos dois
      (R31, R32).
- [ ] O mesmo `look` com o mesmo código e posição avisa uma vez (R31).
- [ ] Nenhuma string, inclusive aleatória, faz a resolução lançar (R32).
- [ ] `look()` sem `context` usa o esquema e a janela do momento da chamada:
      uma chamada depois de `setColorScheme('dark')` já sai escura, e nada
      re-renderiza; `useLook()` re-renderiza com o valor novo (R40).
- [ ] A resolução interna devolve o `lineHeight` como `Ratio` e avisa em dev
      com a opção "sem estados" e um átomo `state` (componentes R44).

## Casos que o QA deve cobrir
- Ponta a ponta: seções 5.1, 5.2 e 5.4 da `emissor-native.md` (`look` +
  contexto → estilo e props), inclusive vazio e só espaços → `{}` e `{}`
  (seção 6).
- Seção 5.5, linha a linha, incluindo `limite + 1` combinações e os estados
  `press` ativo e inativo (R26 a R29, R39).
- Seção 5.6: `bg-banana pad-4` e `pad-4 hover(bg-raised` em dev e produção
  (R31, R32, D88).
- Aviso repetido para o mesmo `look`, código e posição → uma vez (seção 6).
- `look('leading-normal')` → `lineHeight` 24; `look('leading-tight')` →
  20; `look('type-lg leading-normal')` → 27 (D176, R20).
- `useLook('bg-primary')` num componente de teste: claro, depois
  `setColorScheme('dark')` → `'#8AB4FF'`; largura de 599 para 600 com
  `medium(row)` (R40, R6).
- `look('bg-primary')` sem `context`, antes e depois de
  `setColorScheme('dark')`: `'#2563EB'` e depois `'#8AB4FF'` (R40).
- Laço com strings aleatórias geradas no próprio teste (sem dependência
  nova): nunca lança (R32).
