# 025. Core: vocabulário de cor

- **Status**: bloqueada — aguarda aprovação de `docs/specs/sintaxe.md` e
  `docs/specs/tema.md`
- **Fase**: 1
- **Branch**: feature/core-vocabulario-cor
- **Depende de**: 021, 013
- **Paralelo com**: 022, 023, 024, 026, 027, 028
- **Spec**: `docs/specs/sintaxe.md` §1.5, §1.6, §1.10; `docs/specs/tema.md`
  §1.2, §1.3
- **Decisões**: D23, D24, D31, D33, D34, D35

## Objetivo
Registrar `bg-`, `text-` e `border-` com papéis, `-soft`, `-hover`, `on-`,
opacidade por sufixo e cor livre, produzindo IR que distingue claro e escuro.

## Escopo
- Faz: `bg-<papel>`, `bg-<papel>-soft`, `bg-<papel>-hover`, `text-on-<papel>`,
  `text-<texto>` (`strong`, `body`, `muted`, `subtle`, `link`),
  `border-<borda>`; opacidade `bg-primary-50` (D31); papel inexistente (D35);
  cor livre `bg=#e11d48` e `bg=red-40` **se entrarem na fase 1**.
- Não faz: paleta nas classes (`bg-red-600` não existe, D34); aviso de contraste
  (D32, fora da fase 1).

## Arquivos permitidos
- Implementador: `packages/core/src/vocabulary/color.ts`.
- QA: `packages/core/test/vocabulary-color.test.ts`.

## Critérios de aceite
- [ ] Cada classe produz a IR da spec, com valor para claro e para escuro (D20).
- [ ] `bg-red-600` → classe desconhecida (D34).
- [ ] `text-` nunca produz tamanho de texto (D23).

## Casos que o QA deve cobrir
- `bg-primary`, `bg-primary-soft`, `bg-primary-hover`, `text-on-primary`,
  `text-muted`, `border-subtle`, nos dois esquemas.
- `bg-primary-50`, `text-strong-50` (D31).
- `bg-banana` → diagnóstico em dev, ignorado em produção (D35).
- `bg-red-600` → desconhecida (D34).
- `bg-primary bg-surface` → `bg-surface` (D58), se a `029` estiver pronta.
- Dentro de variante: `hover(bg-primary-hover)`, `press(bg-primary-hover)`
  (D59), `dark(bg-surface)`.

## Lacunas que bloqueiam
- Opacidade: quais números valem (0–100 qualquer? passos?). `bg-primary-soft-50`
  é válido?
- `text-<papel>` (ex.: `text-danger`, seção 13 da visão) e `border-<papel>`
  existem?
- Cor livre na fase 1: `bg=#e11d48` e `bg=red-40` entram? Opacidade em cor livre
  segue em aberto (seção 4 da visão).
- `text-on-<papel>-soft` ou equivalente para texto sobre `-soft`.
