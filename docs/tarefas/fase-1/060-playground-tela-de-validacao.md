# 060. Playground: tela de demonstração da fase 1

- **Status**: pronta (depois da 004, 046 e 051 a 053)
- **Fase**: 1
- **Branch**: feature/playground-tela-demonstracao
- **Depende de**: 004, 046, 051, 052, 053
- **Paralelo com**: 054, 055
- **Spec**: `docs/specs/componentes.md`, `docs/specs/tema.md` seção 5.9
  (exemplo de `alanwind.config.ts`)
- **Decisões**: D25, D57, D59, D62, D64, D67, D111, D112, D119

## Objetivo
Uma tela no `playground-expo` que exercita a fase 1 nas três plataformas:
`Box`, `Text` e `Pressable` com `look`, atalhos via `configure`, e um seletor
de esquema com `setColorScheme`.

## Escopo
- Faz:
  - `alanwind.config.ts` do app com os atalhos do exemplo da seção 5.9 do
    `tema.md` e `configure(config)` no arquivo de entrada (D119).
  - Uma tela usando só componentes e `look` do alanwind: cartão (`card`),
    botões (`btn`, `press(...)`, `hover(...)`, `disabled`), texto herdado do
    botão, `medium(row)`.
  - Botões para `setColorScheme('light' | 'dark' | 'system')` (D64).
- Não faz: a validação no ShadowPlatinum (`061`, D80).

## Arquivos permitidos
- Implementador: `apps/playground-expo/**`.
- QA: nenhum arquivo de teste; checklist manual no relatório (capturas nos dois
  esquemas, nas três plataformas).

## Critérios de aceite
- [ ] A tela usa só componentes e `look` do alanwind, sem `StyleSheet`.
- [ ] Claro e escuro funcionam, inclusive forçados com `setColorScheme` (D25,
      D64).
- [ ] Botões mudam ao pressionar (`press(...)`, D59) e o texto herda a cor do
      botão (D57).
- [ ] O layout muda de coluna para linha a partir de 600 de largura (web).
- [ ] `expo export --platform web` sem erro.

## Casos que o QA deve cobrir
- Checklist visual: cada critério, em cada plataforma e esquema, com captura.
