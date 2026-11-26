# 056. Native: `README.md` do `@alanwind/native`

- **Status**: pronta (depois da 046 e da 051)
- **Fase**: 1
- **Branch**: docs/native-readme
- **Depende de**: 046, 051
- **Paralelo com**: 052, 053, 054, 055, 060
- **Spec**: `docs/specs/componentes.md` R2 (exceção da D167);
  `docs/specs/emissor-native.md` R33, R35 a R37 (`configure` no arquivo de
  entrada)
- **Decisões**: D119, D167, D174, D175, D178

## Objetivo
Dar ao `@alanwind/native` um `README.md`, que vai para o npm, com a
instalação e os dois avisos de uso da D178.

## Escopo
- Faz: `packages/native/README.md` em português (documentação do projeto),
  com 80 colunas (`CLAUDE.md`), contendo:
  - **Instalação**: o pacote, `react` e `react-native` como peers, e a
    chamada `configure(defineConfig(...))` no arquivo de entrada do app,
    importando o `alanwind.config.ts` (R35, R37, D119); sem `configure`, os
    atalhos ficam desligados (R36).
  - **Aviso da D167**: atalhos do RN no `style` (`padding`,
    `paddingHorizontal`, `margin`, `borderWidth`, `borderRadius`) não
    vencem um lado específico vindo do `look`; exemplo
    `<Box look="pad-4" style={{ padding: 2 }}>` da seção 5.1 da
    `componentes.md`, e a saída: escrever o lado (`paddingTop`) no `style`.
  - **Aviso do Jest** (D175, D178): o pacote é só ESM, então quem testa com
    Jest inclui `@alanwind/native` no `transformIgnorePatterns`, com um
    exemplo de configuração com `jest-expo`.
  - Licença MIT (D174).
- Não faz: guia completo de uso ou referência do vocabulário (site, fase 5,
  D9); README do `core`.

## Arquivos permitidos
- Implementador: `packages/native/README.md`.
- QA: nenhum arquivo; conferência no relatório.

## Critérios de aceite
- [ ] `packages/native/README.md` existe e entra no pacote:
      `pnpm --filter @alanwind/native pack --dry-run` o lista.
- [ ] Tem as três partes da D178: instalação, aviso da D167 e aviso do Jest.
- [ ] O exemplo da D167 bate com a linha da seção 5.1 da `componentes.md`.
- [ ] `node .github/scripts/check-docs.mjs` passa (80 colunas).

## Casos que o QA deve cobrir
- Ler o README contra a D167, a D175 e a D178 e as regras R33 a R37 da
  `emissor-native.md`, e registrar no relatório cada divergência.
- O exemplo de `transformIgnorePatterns` não é validado aqui: a prova real é
  na `061`, no ShadowPlatinum (D178).
