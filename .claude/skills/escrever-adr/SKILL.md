---
name: escrever-adr
description: Use quando o Alan pedir um ADR (Architecture Decision Record) do alanwind, ou para transformar decisões do docs/00-visao-e-decisoes.md em ADRs em docs/adr/. Define o modelo, a numeração, a regra de que ADRs só nascem de decisões já registradas e como substituir um ADR.
---

# Escrever ADR

Um ADR registra **uma decisão de arquitetura e o porquê dela**: o contexto, o
que foi escolhido, o que foi descartado e o que isso causa. Ele quase não muda
depois de aceito; quando a decisão muda, um ADR novo substitui o antigo.

## Regra principal

**ADRs só nascem de decisões já registradas** no `docs/00-visao-e-decisoes.md`
(seção 3). Um ADR nunca cria decisão nova. Se, ao escrever, aparecer algo não
decidido, pare e pergunte ao Alan; se ele decidir, registre primeiro com a skill
`registrar-decisao`.

Também não invente motivo nem alternativa. O contexto e as alternativas vêm do
documento de visão e da conversa. Se o porquê não está registrado, pergunte.

## O que vira ADR

Decisões **de arquitetura**: difíceis de reverter, que afetam vários pacotes ou
que alguém vai perguntar "por que foi feito assim?". Um ADR pode reunir várias
D## sobre o mesmo assunto. A lista inicial sugerida está na seção 8, item 2, do
documento de visão.

Não vira ADR: valor de cor, nome de uma classe isolada, detalhe que é spec.

## Arquivo

- Caminho: `docs/adr/NNNN-titulo-em-kebab-case.md`, com 4 dígitos e numeração
  sequencial (`0001-typescript-e-monorepo.md`).
- Número nunca é reaproveitado, nem de ADR rejeitado.
- Ao criar o primeiro ADR, crie também `docs/adr/README.md` com a lista dos ADRs
  (número, título, status). Mantenha essa lista atualizada a cada ADR novo.

**Formato**: quebre o texto em até 80 colunas (parágrafos e listas), como manda
o `CLAUDE.md`. Tabelas e código não são quebrados.

## Modelo

```markdown
# NNNN. Título curto da decisão

- **Status**: proposto | aceito | substituído por [NNNN](NNNN-....md)
- **Data**: AAAA-MM-DD
- **Decisões de origem**: D15, D26

## Contexto
Qual problema ou força levou à decisão. O que estava em jogo.

## Decisão
O que foi decidido, de forma direta e afirmativa ("O alanwind resolve o look em runtime no React Native...").

## Alternativas consideradas
- **Alternativa A**: o que é e por que não foi escolhida.
- **Alternativa B**: ...

## Consequências
- Positivas: ...
- Negativas / custos: ...
- O que isso obriga a fazer depois (specs, testes, outros ADRs).
```

## Ciclo de vida

1. Claude escreve com status **proposto**.
2. O Alan revisa. Aprovado, o status vira **aceito**.
3. Um ADR aceito **não é reescrito**. Se a decisão mudar: registre a nova D##
   (`registrar-decisao`), crie um ADR novo e mude o antigo para
   `substituído por NNNN`. É a única edição permitida num ADR aceito.

Commit, se pedido: `docs(adr): adiciona ADR NNNN sobre <assunto>`.
