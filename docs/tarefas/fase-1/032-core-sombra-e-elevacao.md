# 032. Core: `shadow-*` e elevação no escuro

- **Status**: pronta (depois da 014, 025, 027, 029 e 033)
- **Fase**: 1
- **Branch**: feature/core-sombra-elevacao
- **Depende de**: 014, 025, 027, 029, 033
- **Paralelo com**: 031, 034, 035
- **Spec**: `docs/specs/funcionamento-interno.md` R34, R35, seção 5.8;
  `docs/specs/sintaxe.md` R63 (`shadow-none`), seção 5.8;
  `docs/specs/tema.md` R17, R18, R34, seções 5.7, 7.2 e 8
- **Decisões**: D45, D96, D97, D108, D124, D132, D137, D139, D146, D149

## Objetivo
Registrar `shadow-sm|md|lg` e expandir cada uma, no `core`, numa camada do
claro com a sombra e numa camada do escuro com a elevação (fundo um nível
acima, borda fina, sombra discreta), respeitando o que o `look` já escreve.

## Escopo
- Faz:
  - Registro de `shadow-sm`, `shadow-md`, `shadow-lg` (nível único,
    propriedade abstrata `shadow`); `shadow-none` não existe (R63).
  - Camada `[light]` com `boxShadow` nas camadas do claro, na ordem da D96
    (R34).
  - Camada `[dark]` com `backgroundColor` um nível acima (`page` → `surface`,
    `surface` e `raised` → `raised`; sem `bg-*`, parte de `page`),
    `borderColor` `#34343A`, largura 1 nos quatro lados e `boxShadow` de uma
    camada; `backgroundColor` e `borderColor` com as duas cores iguais (R35).
  - "O escrito vence" (D137): com `bg-*` fora de `page`/`surface`/`raised` ou
    com `dark(bg...)` explícito, a camada `[dark]` não declara
    `backgroundColor`; não declara as propriedades de borda que o `look` já
    escreve (`border-2 border-strong`: nem larguras nem cor); a sombra fica
    sempre.
  - A camada `light` vem antes da `dark` (seção 5.8).
  - **Dentro de variante, herda a condição** (D146, D149): `hover(shadow-md)`
    gera uma camada `[hover, light]` com a sombra do claro e uma
    `[hover, dark]` (átomos na ordem
    da R14) com a elevação do escuro (fundo um nível acima e borda). Conta
    como "já escrito" (D137) o `bg-*` que vale junto com a sombra: o da base
    ou o de uma condição contida na da sombra; um `bg-*` em outra variante
    (`press(...)`) não conta.
  - Valores lidos da `014`.
- Não faz: tradução do `boxShadow` para RN (`043`).

## Arquivos permitidos
- Implementador: `packages/core/src/vocabulary/shadow.ts`,
  `packages/core/src/resolve/elevation.ts`.
- QA: `packages/core/test/shadow-elevation.test.ts`.

## Critérios de aceite
- [ ] O bloco de `bg-surface shadow-md` da seção 5.8 sai exatamente igual.
- [ ] Cada linha da tabela da seção 5.8 sai com a camada `[dark]` indicada.
- [ ] Os emissores não precisam conhecer o conceito de elevação (R35).

## Casos que o QA deve cobrir
- `bg-surface shadow-md` (bloco completo da seção 5.8).
- Tabela 5.8: `shadow-sm`, `bg-page shadow-md`, `bg-raised shadow-lg`,
  `bg-primary shadow-md`, `dark(bg-surface) shadow-md`,
  `border-2 border-strong shadow-md`.
- `tema.md` 7.2: as três sombras do claro e as quatro linhas do escuro.
- `shadow-none` → erro, nada na IR.
- D146/D149: `hover(shadow-md)` → camadas `[hover, light]` (sombra do claro) e
  `[hover, dark]` (fundo `#1E1E22`, partindo de `page`; borda 1 `#34343A`;
  sombra do escuro).
- `bg-surface hover(shadow-md)` → a camada `[hover, dark]` sobe para `raised`
  (`#28282D`): o `bg-*` da base vale junto.
- `hover(bg-primary shadow-md)` → a camada `[hover, dark]` não declara
  `backgroundColor` (o `bg-*` está na mesma condição).
- `press(bg-primary) hover(shadow-md)` → o `bg-primary` não conta: a camada
  `[hover, dark]` parte de `page`.
