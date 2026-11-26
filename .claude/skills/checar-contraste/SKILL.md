---
name: checar-contraste
description: Use ao definir ou mudar cores do tema do alanwind (papéis, -soft, -hover, on-, fundos, textos, bordas de foco), ao adicionar uma classe de cor, ou ao implementar ou testar o aviso de contraste. Define a fórmula WCAG 2, os limites (4,5:1, 3:1), quais pares conferir nos dois esquemas e como tratar opacidade.
---

# Checar contraste

Acessibilidade por padrão é o diferencial principal do alanwind (D5). O tema
padrão só pode ter pares texto/fundo que passam no **WCAG 2 nível AA**, nos
esquemas claro **e** escuro (seção 5 da visão).

## Fórmula (WCAG 2)

1. Converta cada canal sRGB (0–255) para 0–1: `c = canal / 255`.
2. Linearize: `c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4`.
3. Luminância relativa: `L = 0.2126 * R + 0.7152 * G + 0.0722 * B`.
4. Razão de contraste: `(L_clara + 0.05) / (L_escura + 0.05)`, de 1 a 21.

Use o WCAG 2, que é a norma vigente. Não use o APCA (proposto para o WCAG 3)
como critério de aprovação.

## Limites

| Uso | Mínimo AA |
|---|---|
| Texto normal | **4,5:1** |
| Texto grande (≥ 24 px, ou ≥ 18,66 px em negrito) | 3:1 |
| Componentes de interface e indicadores de foco (`border-focus`, `focus-ring`) contra o fundo vizinho | 3:1 |

O alanwind usa **4,5:1 como regra para todos os pares de texto do tema**, mesmo
que o texto possa ser grande. O 3:1 só vale para bordas de foco e componentes.

## Quais pares conferir

Para **cada papel colorido** (`primary`, `secondary`, `success`, `warning`,
`danger`, `info` e papéis criados pela pessoa), em **claro e escuro**:

| Fundo | Texto | Mínimo |
|---|---|---|
| `bg-<papel>` | `text-on-<papel>` | 4,5 |
| `bg-<papel>-hover` | `text-on-<papel>` | 4,5 (é o que mais arrisca quebrar: no escuro o hover clareia, D22) |
| `bg-<papel>-soft` | texto usado sobre o soft | 4,5 |
| `bg-page`, `bg-surface`, `bg-raised` | `text-<papel>` | 4,5 |

Para os **neutros**, em claro e escuro: `text-strong`, `text-body`,
`text-muted` e `text-link` sobre `bg-page`, `bg-surface` e `bg-raised`
(4,5). `border-focus` sobre os três fundos (3). `text-subtle` (só para
desabilitado) e `border-subtle` (decorativa) ficam **isentos** e o aviso de
contraste não os avalia (`tema.md` R10 e R11, D93, D95, D128).

Atenção ao `warning`: o texto sobre o amarelo é escuro (D47). Se a conta
escolher branco, está errado.

## Opacidade

Cor com alfa (`bg-primary-50`, D31) **não tem contraste próprio**. Primeiro
misture com o fundo de baixo, depois calcule:

`canal_final = alfa * canal_cor + (1 - alfa) * canal_fundo`

Sem saber o fundo de baixo, não dá para garantir o contraste. O aviso de
contraste (D32) só avalia o que está declarado no mesmo `look`.

## Onde isso é aplicado

- **Testes do tema**: um teste que percorre todos os pares acima nos dois
  esquemas e falha se algum ficar abaixo do mínimo. Ao trocar um papel, `-soft`,
  `-hover` e `on-` são recalculados (D35) e o mesmo teste vale.
- **Aviso em desenvolvimento** (D32): fundo e texto declarados no mesmo `look`,
  inclusive cores livres (`bg=#e11d48`).
- **Ao propor uma cor**: mostre ao Alan a razão de cada par, em tabela, com ✅ ou
  ❌, antes de considerar a cor definida.
