# 060. Playground: tela de validação da fase 1

- **Status**: bloqueada — aguarda as tarefas de componentes e a escolha da tela
  pelo Alan
- **Fase**: 1
- **Branch**: feature/playground-tela-validacao
- **Depende de**: 004, 051, 052, 053
- **Paralelo com**: 054, 055
- **Spec**: `docs/specs/componentes.md`, `docs/specs/emissor-native.md`
  (exemplos)
- **Decisões**: D25, D57, D59, D60, D62, D64

## Objetivo
Reproduzir no `playground-expo` a tela do app do Alan escolhida para a validação
da D60, usando só `Box`, `Text` e `Pressable` com `look`, e um seletor de
esquema com `setColorScheme`.

## Escopo
- Faz: a tela no playground; botão para alternar `light`/`dark`/`system` (D64);
  verificação visual em iOS, Android e web.
- Não faz: mexer no app do Alan (fica fora deste repositório; a validação lado a
  lado com o NativeWind é feita pelo Alan).

## Arquivos permitidos
- Implementador: `apps/playground-expo/**`.
- QA: nenhum arquivo de teste; checklist manual no relatório (capturas nos dois
  esquemas, nas três plataformas).

## Critérios de aceite
- [ ] A tela usa só componentes e `look` do alanwind, sem `StyleSheet` próprio.
- [ ] Claro e escuro funcionam, inclusive forçados com `setColorScheme` (D25,
      D64).
- [ ] Botões mudam ao pressionar (`press(...)`, D59) e o texto herda a cor do
      botão (D57).
- [ ] `expo export --platform web` sem erro.

## Casos que o QA deve cobrir
- Checklist visual: cada critério, em cada plataforma e esquema, com captura.

## Lacunas que bloqueiam
- Qual tela do app do Alan será reproduzida (e quais classes ela precisa: isso
  ajuda a fechar o vocabulário da fase 1).
- Como o app do Alan consome o alanwind antes de publicar (`pnpm pack`, `link`,
  registro privado?).
