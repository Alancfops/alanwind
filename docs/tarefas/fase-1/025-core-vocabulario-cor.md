# 025. Core: vocabulário de cor (`bg`, `text`, `border-<papel>`)

- **Status**: pronta (depois da 021 e da 013)
- **Fase**: 1
- **Branch**: feature/core-vocabulario-cor
- **Depende de**: 021, 013
- **Paralelo com**: 022, 023, 024, 026, 027
- **Spec**: `docs/specs/sintaxe.md` R21 a R30, R55 a R57, seções 4.2
  (`color` e desambiguação de `border-`), 5.5, 7.2 e 7.6 (linhas de cor);
  `docs/specs/funcionamento-interno.md` R30, R31, seção 5.1;
  `docs/specs/tema.md` R9, R30, R31, seção 7.1
- **Decisões**: D23, D31, D34, D35, D92, D95, D98, D104, D105, D118, D123,
  D129, D131

## Objetivo
Registrar as classes de cor por papel e a cor livre em hex, produzindo
`ThemedColor` (claro e escuro já resolvidos) na IR.

## Escopo
- Faz:
  - `bg-<papel>` para os fundos (`page`, `surface`, `raised`) e os papéis
    coloridos, com `-soft` e `-hover` (tabela 5.5 da `sintaxe.md`).
  - `text-` com `strong`, `body`, `muted`, `subtle`, `link`, `on-<papel>`,
    `on-<papel>-soft` (D131) e `text-<papel>` com o tom da tabela 5.5 do
    `tema.md` (D92). `text-secondary` não existe → `AW102` (R56, D129).
  - `border-<papel>` com `subtle`, `strong`, `focus` e todos os papéis (R57);
    cor única, sem lado (D123). Segue a desambiguação de `border-` da seção
    4.2: lado, eixo, número ou nada é espessura (`027`); o resto é papel.
  - Opacidade por sufixo, sempre o último segmento, com 0, 25, 50, 75 e 100
    (`bg-primary-50`, `bg-primary-hover-50`, `text-strong-50`) → `alpha` nas
    duas cores (R27, R31); outro número → `AW103`.
  - Cor livre `bg=`, `text=`, `border=` em hex de 3, 6 ou 8 dígitos, com
    `/opacidade` da escala: `rgb` maiúsculo, 3 dígitos expandidos, 8 dígitos
    viram `rgb` + `alpha` = byte / 255 sem arredondar; as duas cores iguais
    (R30, R31). Barra com opacidade fora da escala ou em hex de 8 dígitos →
    `AW008` (R23).
  - `AW102` para papel inexistente (`bg-banana`, `bg-red-600`), com sugestão
    (R26, R29); `AW107` para barra em papel (`bg-primary/50`, sugestão
    `bg-primary-50`) (R24).
  - Todas no nível único de especificidade, disputando `bg`, `text` ou
    `border.color` (seção 5.9).
- Não faz: espessura de borda (`027`); tom da paleta (`bg=red-40`, fase de
  tema, D118: o `AW008` é da `020`); aviso de contraste (D32, fora da
  fase 1); elevação no escuro (`032`).

## Arquivos permitidos
- Implementador: `packages/core/src/vocabulary/color.ts`.
- QA: `packages/core/test/vocabulary-color.test.ts`.

## Critérios de aceite
- [ ] Cada classe produz `ThemedColor` com os valores do tema, nos dois
      esquemas (R30).
- [ ] `text-` nunca produz tamanho de texto (D23).
- [ ] Nenhuma cor é copiada para o vocabulário: tudo vem da `013`.

## Casos que o QA deve cobrir
- `sintaxe.md` 7.2: `bg-primary`, `bg-primary-hover`, `bg-primary-soft`,
  `bg-primary-50`, `text-strong-50`, `text-on-primary`,
  `text-on-danger-soft`, `text-danger`, `border-subtle`, `border-danger`,
  `bg=#e11d48`, `bg=#e11d48/50`, `bg=#fff`, `bg=#e11d4880` (traduzidas para
  a IR com os valores do `tema.md`).
- `funcionamento-interno.md` 5.1: `bg-primary-50`, `bg=#e11d48/50`, `bg=#f00`;
  seção 6: `#E1F` → `#EE11FF`; 5.7: `border-danger`, `text-on-danger-soft`.
- `tema.md` 7.1 (via classe): `text-warning` claro `#8A5A00`, escuro
  `#FFD166`; `bg-secondary-hover`, `bg-secondary-soft`,
  `text-on-secondary-soft`; `text-subtle`.
- Erros (seção 7.6): `bg-primry` → `AW102[0,9)` com sugestão `bg-primary`;
  `bg-banana` → `AW102[0,9)` sem sugestão; `text-secondary` →
  `AW102[0,14)`; `bg-primary-30` → `AW103[0,13)`; `bg-primary/50` →
  `AW107[0,13)` com sugestão `bg-primary-50`; `bg=#e11d4880/50` →
  `AW008[0,15)`; `bg=#e11d48/30` → `AW008[0,13)`; `bg-red-600` → `AW102`.
- `pad-4 bg-banana` → `PAD(16)` e `AW102[6,15)` (`funcionamento-interno.md`
  5.9).
