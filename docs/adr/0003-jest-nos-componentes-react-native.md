# 0003. Jest nos componentes React Native

- **Status**: proposto
- **Data**: 2026-11-25
- **Decisões de origem**: D114 (ajusta a D69)

## Contexto

O ADR 0001 fixou o Vitest como ferramenta de testes do monorepo (D69). Na
rodada 9, que definiu os componentes da fase 1 (`Box`, `Text`, `Pressable`),
surgiu a pergunta de como testar componentes React Native. O pacote `native`
passa a ter componentes, além do código TypeScript puro que já existia no
`core` e nos emissores.

## Decisão

Os testes seguem duas ferramentas, conforme o tipo de código (D114):

- **Vitest** no `core` e nos emissores: código TypeScript puro continua no
  Vitest, inclusive os testes de ouro.
- **Jest** com `jest-expo` e `@testing-library/react-native` no pacote
  `native`, onde ficam os componentes. É o caminho suportado pelo Expo.

## Alternativas consideradas

- **Vitest em tudo**: descartada. Teria uma ferramenta só, mas testar
  componentes React Native no Vitest exige mais configuração e mocks, e os
  testes podem divergir do runtime real.
- **Vitest no código puro e Jest nos componentes** (escolhida): o Jest com
  `jest-expo` é o caminho suportado pelo Expo e fica mais próximo do runtime
  real.

## Consequências

- Este ADR **ajusta parcialmente** o ADR 0001: muda só a ferramenta de teste
  dos componentes React Native. O resto do 0001 continua valendo, inclusive o
  Vitest para o código TypeScript puro. Quando este ADR for aceito, o
  `README.md` desta pasta deve indicar essa relação com o 0001.
- Positivas:
  - Os testes de componentes rodam com a ferramenta suportada pelo Expo, mais
    perto do runtime real.
  - Não é preciso montar configuração e mocks extras para o React Native no
    Vitest.
- Negativas / custos:
  - Duas ferramentas de teste no monorepo, cada uma com sua configuração.
- O que isso obriga a fazer depois:
  - Configurar o Jest (`jest-expo`) apenas no pacote `native`, e o Turborepo
    para rodar os dois conjuntos de testes (D69).
  - Manter o Vitest no `core` e nos emissores, como manda a skill
    `teste-de-ouro`.
  - Ajustar o ADR 0001 só se o Alan decidir substituí-lo; ADR aceito não é
    reescrito.
