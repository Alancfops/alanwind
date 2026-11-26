---
name: escrever-spec
description: Use ao criar, completar, revisar ou aprovar uma spec do alanwind em docs/specs/ (sintaxe, IR, tema, emissores, componentes). Define a estrutura da spec, a linguagem normativa (DEVE/NÃO DEVE/PODE), os exemplos que viram testes de ouro, o ciclo de status e o que fazer com lacunas.
---

# Escrever spec

Uma spec diz **o que o sistema faz, com precisão suficiente para implementar e
testar sem adivinhar**. Ela é o contrato entre os agentes: o implementador
codifica a partir dela, o QA testa a partir dela sem ver o código, o revisor
confere o código contra ela.

## Regras

- Toda regra vem de uma **decisão registrada** e cita o número dela (D##).
- **Nunca preencha lacuna inventando.** Se a spec precisa de algo não decidido,
  coloque em "Ainda não definido" e leve a pergunta ao Alan. A resposta vira
  decisão (skill `registrar-decisao`) e só então entra na spec.
- Uma spec descreve **comportamento observável**, não implementação. "O parser
  DEVE rejeitar parêntese não fechado com erro AW001" é spec; "usar uma pilha
  para contar parênteses" não é.

## Estrutura

```markdown
# Spec: <assunto>

Status: <ver ciclo> · Decisões de origem: D.., D..

<uma frase do que a spec cobre>

## 1. Já definido          ← enquanto a spec é rascunho
## 2. Ainda não definido   ← lacunas, perguntas para o Alan
```

Ao avançar do rascunho, a seção "Já definido" é reorganizada nestas partes:

1. **Escopo**: o que cobre e o que fica de fora.
2. **Definições**: termos exatos, alinhados ao glossário.
3. **Regras normativas**: numeradas (`R1`, `R2`...), cada uma com a D## de
   origem.
4. **Gramática ou formato**, quando houver (EBNF para a sintaxe; tipos
   TypeScript para a IR).
5. **Exemplos**: tabelas de entrada → saída esperada. Viram **testes de ouro**
   (skill `teste-de-ouro`).
6. **Casos de borda e erros**: entrada vazia, inválida, conflito, aninhamento,
   código do erro.
7. **Critérios de aceite**: lista objetiva de como saber que a implementação
   está pronta.
8. **Ainda não definido**: deve estar vazia para a spec ser aprovada.

**Formato**: quebre o texto em até 80 colunas (parágrafos e listas), como manda
o `CLAUDE.md`. Tabelas e código não são quebrados.

## Linguagem normativa

| Palavra | Significado |
|---|---|
| **DEVE** | Obrigatório. Violar é bug. |
| **NÃO DEVE** | Proibido. |
| **PODE** | Permitido, opcional. |

Evite "geralmente", "normalmente", "idealmente": o que não é DEVE nem PODE não é
regra.

## Exemplos

- Cada regra importante tem pelo menos um exemplo de entrada e saída exata.
- Inclua exemplos de erro, não só de sucesso.
- O contexto faz parte da entrada quando muda o resultado: esquema
  (claro/escuro), largura da tela, plataforma.

```markdown
| Entrada                 | Contexto       | Saída                                  |
|-------------------------|----------------|----------------------------------------|
| `pad-x-4`               | —              | `paddingLeft: 16, paddingRight: 16`    |
| `bg-primary`            | escuro         | `backgroundColor: '#8AB4FF'`           |
| `hover(`                | —              | erro `AW001` na posição 6              |
```

## Ciclo de status

| Status | Significa |
|---|---|
| **vazio** | Só título e decisões de origem. |
| **rascunho, só o já decidido** | Tem "Já definido" e "Ainda não definido". |
| **em revisão** | Estrutura completa, aguardando o Alan. "Ainda não definido" vazio. |
| **aprovado** | O Alan aprovou. **Só specs aprovadas viram tarefa para os agentes.** |

Se uma decisão nova afetar uma spec aprovada, ela volta para **em revisão**.

Commit, se pedido: `docs(specs): <o que mudou na spec>`.
