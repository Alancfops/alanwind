---
name: registrar-decisao
description: Use quando o Alan tomar ou confirmar uma decisão sobre o alanwind (sintaxe, tema, API, arquitetura, processo, agentes), ou quando uma decisão antiga for alterada ou substituída. Registra a decisão no docs/00-visao-e-decisoes.md com o próximo número D##, atualiza o histórico e propaga para as specs afetadas.
---

# Registrar decisão

O `docs/00-visao-e-decisoes.md` é a **fonte da verdade** das decisões. ADRs e
specs são derivados dele. Uma decisão que não está lá não existe.

## 1. É mesmo uma decisão?

| Situação | Onde vai |
|---|---|
| O Alan **escolheu ou confirmou** algo ("sim", "pode ser", escolheu uma opção) | Tabela da seção 3, com número D## |
| Foi **sugerido** (por Claude ou outro) e o Alan **não confirmou** | Seção 4, "Propostas ainda não confirmadas" |
| Opinião de **outra pessoa** (ex.: o amigo do Alan) | Seção 12, "Feedback de terceiros" |
| Resposta ambígua (ex.: "acho que sim", "isso era só exemplo") | **Não registrar como decisão.** Perguntar de novo ou anotar como em aberto na seção 4 |

Nunca transformar uma sugestão em decisão por conta própria.

## 2. Registrar

1. Ache o **último D##** da tabela da seção 3 e use o próximo número.
2. Adicione a linha **ao fim da tabela**, no formato:
   ```
   | D76 | **Resumo curto em negrito.** Explicação com o que foi decidido, o motivo dado pelo Alan (se houver) e exemplos de sintaxe quando ajudar. Referências a decisões relacionadas (D58). |
   ```
3. Use as **palavras e o motivo do Alan**. Não invente justificativa. Se o
   motivo não foi dito, não escreva um.

**Formato**: quebre o texto em até 80 colunas (parágrafos e listas), como manda
o `CLAUDE.md`. Tabelas e código não são quebrados.

## 3. Decisão que muda outra

Decisões antigas **não são apagadas**. O histórico importa.

- Na decisão nova, diga o que ela altera: "Ajusta a D29", "Substitui a proposta
  X da seção 4".
- Na decisão antiga, acrescente uma nota curta em itálico:
  `*Ajuste (D61): ...*`.
- Se veio de uma proposta da seção 4, risque a proposta e aponte a decisão:
  `~~**Ordem**: ...~~ **Substituída pela D60**`.

## 4. Histórico (seção 10)

Adicione uma linha ao fim, com **data absoluta** (nunca "hoje" ou "ontem"):

```
- 2026-11-25 (Claude Code): <o que foi decidido, com os números D##>.
```

Várias decisões da mesma conversa podem ir numa linha só.

## 5. Propagar

Depois de registrar, confira o que mais precisa mudar:

- **Specs** (`docs/specs/*.md`): se a decisão afeta uma spec, acrescente o D##
  em "Decisões de origem", coloque a regra em "Já definido" e tire de "Ainda não
  definido" o que ela resolveu. Specs com status "aprovado" voltam para "em
  revisão" (ver skill `escrever-spec`).
- **Vocabulário** (seção 11) e **exemplos** (seção 13): atualize se a decisão
  muda uma classe ou exemplo.
- **Seção 9** ("O que falta"): marque como feito o que a decisão fechou.
- **ADRs**: se já existe ADR sobre o assunto, avise o Alan que ele pode precisar
  ser substituído (skill `escrever-adr`). Não altere ADR aceito sozinho.

## 6. Confirmar

Diga ao Alan, em uma linha por decisão, o número e o resumo registrado, e quais
specs foram atualizadas.

Commit, se pedido: `docs(visao): registra D76 sobre <assunto>` (skill
`conventional-commits`).
