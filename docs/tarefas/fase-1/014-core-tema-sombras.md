# 014. Core: tema padrão, sombras e elevação

- **Status**: pronta (depois da 010 e da 012)
- **Fase**: 1
- **Branch**: feature/core-tema-sombras
- **Depende de**: 010, 012
- **Paralelo com**: 011, 013, 041, 042, 043
- **Spec**: `docs/specs/tema.md` R17, R18, seção 5.7 e as linhas de sombra da
  seção 7.2 (valores); `docs/specs/funcionamento-interno.md` R34, R35
  (formato `ShadowLayer`)
- **Decisões**: D45, D96, D97, D108, D132, D137

## Objetivo
Guardar no tema os valores das sombras do claro e da elevação do escuro, no
formato neutro da IR (`ShadowLayer`, `Color`), sem propriedade de RN ou CSS.

## Escopo
- Faz:
  - claro: `shadow-sm` = `0 1px 2px` a 6%; `shadow-md` = `0 4px 8px` a 8% e
    `0 1px 2px` a 6%, nessa ordem; `shadow-lg` = `0 12px 24px` a 12% e
    `0 4px 8px` a 6%, nessa ordem; cor preta, `spread` 0 (D96);
  - escuro, **uma camada** por classe: `shadow-sm` `0 1px 2px` a 30%,
    `shadow-md` `0 4px 8px` a 35%, `shadow-lg` `0 12px 24px` a 40% (D132,
    D137);
  - borda da elevação: largura 1, cor `#34343A` (D132);
  - os níveis de fundo da elevação: `page` → `surface` → `raised`, e `raised`
    fica em `raised` (D97, D132).
- Não faz: a expansão de `shadow-*` na IR e a regra "o escrito vence" (`032`);
  tradução para RN (`043`).

## Arquivos permitidos
- Implementador: `packages/core/src/theme/shadows/**`,
  `packages/core/src/index.ts`.
- QA: `packages/core/test/theme-shadows.test.ts`.

## Critérios de aceite
- [ ] Cada camada bate com a tabela 5.7, na ordem da D96 (R17, R34).
- [ ] O escuro tem uma só camada por classe (D137).
- [ ] Os valores usam `ShadowLayer`/`Color` da `010` (`alpha` de 0 a 1) e não
      usam nomes de propriedade de RN nem de CSS.
- [ ] O tema é imutável e os valores existem uma vez só.

## Casos que o QA deve cobrir
- Tabela classe × esquema → camadas, copiada da seção 5.7.
- Níveis: `page` → `surface`, `surface` → `raised`, `raised` → `raised`.
