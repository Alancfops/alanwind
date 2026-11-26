# 026. Core: vocabulário de tipografia

- **Status**: pronta (depois da 021 e da 012), com ressalva: o código de
  `lines-0` aguarda resposta do Alan (abaixo)
- **Fase**: 1
- **Branch**: feature/core-vocabulario-tipografia
- **Depende de**: 021, 012
- **Paralelo com**: 022, 023, 024, 025, 027, 028
- **Spec**: `docs/specs/sintaxe.md` R21, R54, seções 4.2 (`typography`), 5.7,
  5.9, 7.1 e 7.2; `docs/specs/funcionamento-interno.md` R27, R33, R36, R48,
  seções 5.6 e 5.7; `docs/specs/tema.md` R14, R15
- **Decisões**: D23, D49, D77, D83, D98, D120, D125, D127, D133

## Objetivo
Registrar as classes de texto da fase 1, com `lines-N` indo para a parte de
props da IR.

## Escopo
- Faz:
  - `type-xs` a `type-3xl` → `fontSize` (12 a 30) e `type=V` (D49).
  - `weight-regular|medium|bold` → `fontWeight` 400, 500, 700 (R36).
  - `leading-tight|normal|loose` e `leading=V` (com decimal) → `lineHeight`
    como `Ratio`, **sem** multiplicar pelo `type-*` (R33).
  - `align-left|center|right` → `textAlign`.
  - `font-sans|serif|mono` → `fontFamily` genérica (`'sans'`, `'serif'`,
    `'mono'`) (R48); o emissor mapeia por plataforma (`042`).
  - `italic` → `fontStyle`, `underline` → `textDecorationLine`, `upper` e
    `lower` → `textTransform`, disputando a mesma propriedade abstrata `case`
    (seção 5.9).
  - `lines-N`, `N` inteiro ≥ 1 → `props`, `numberOfLines: N`, não `style`
    (R27).
  - Nível único de especificidade para todas (seção 5.9); `AW103` fora da
    escala (`type-4xl`); `AW009` em família sem valor livre (`weight=600`).
- Não faz: herança de texto (`050`); escala de fonte do sistema e mapeamento
  da família por plataforma (`042`); camadas de props com condição (`033`).

## Arquivos permitidos
- Implementador: `packages/core/src/vocabulary/typography.ts`.
- QA: `packages/core/test/vocabulary-typography.test.ts`.

## Critérios de aceite
- [ ] Cada classe produz a IR da seção 5.7 da `funcionamento-interno.md`.
- [ ] `lines-N` aparece só em `props`, nunca em `style` (R27).
- [ ] `leading-*` sai como `Ratio` e não depende de `type-*` (R33).

## Casos que o QA deve cobrir
- `funcionamento-interno.md` 5.7: `weight-bold upper`, `font-mono`,
  `type-lg leading-normal`, `leading=1.4`; 5.6: `lines-2`,
  `type-sm lines-2`.
- `sintaxe.md` 7.1: `type-lg`, `weight-bold`, `leading-tight`,
  `align-center`, `font-mono`, `upper`, `lines-2`; 7.2: `leading=1.4`.
- `type-xs` 12 … `type-3xl` 30; `type-4xl` → `AW103`; `weight=600` →
  `AW009[0,10)`.

## Ponto em aberto (aguarda o Alan)
Se a resposta não vier antes, `lines-0` fica fora desta PR e o implementador
relata.
- `lines-0` (N fora de "inteiro ≥ 1", D127): qual código? A `sintaxe.md` não
  diz (`AW103` é "fora da escala", e `lines` não tem escala).
