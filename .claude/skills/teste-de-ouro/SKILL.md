---
name: teste-de-ouro
description: Use ao escrever ou corrigir testes do alanwind que verificam a saída exata do parser, da IR ou dos emissores (dada esta entrada, a saída tem que ser exatamente esta). Define o formato em tabela com Vitest, de onde vem o valor esperado e o que fazer quando um teste de ouro falha.
---

# Teste de ouro

Um teste de ouro afirma: **dada esta entrada, neste contexto, a saída é
exatamente esta**. No alanwind ele é o teste principal, porque o core é feito de
funções puras e determinísticas (D15).

## De onde vem o valor esperado

**Da spec, escrito à mão.** Nunca do resultado atual do código.

- Não use snapshot gerado automaticamente para o comportamento principal: ele
  grava o que o código faz, certo ou errado, e quem atualiza o snapshot acaba
  aprovando o bug.
- Cada caso cita a regra ou o exemplo da spec de onde saiu.
- O agente de QA escreve estes testes **lendo só a spec**, sem olhar a
  implementação.

## Formato

Testes em **tabela** com Vitest: um caso por linha, fácil de ler e de comparar
com a tabela da spec.

```ts
import { describe, expect, it } from 'vitest'
import { resolveLook } from '../src'

// docs/specs/emissor-native.md, seção "Espaçamento"
describe('spacing', () => {
  it.each([
    // look          context              expected
    ['pad-4',        {},                  { padding: 16 }],
    ['pad-x-4',      {},                  { paddingLeft: 16, paddingRight: 16 }],
    ['pad-4 pad-x-2',{},                  { padding: 16, paddingLeft: 8, paddingRight: 8 }], // D58
    ['pad=10',       {},                  { padding: 10 }],                                  // D30
  ])('%s', (look, context, expected) => {
    expect(resolveLook(look, context)).toStrictEqual(expected)
  })
})
```

- Use `toStrictEqual` (igualdade exata), não `toMatchObject` (aceita campos a
  mais).
- O nome do caso é a própria entrada, para a falha mostrar qual `look` quebrou.
- O **contexto** (esquema de cor, largura, plataforma) é explícito em cada caso
  quando muda o resultado.

## O que cobrir

Para cada regra da spec:

1. O caso simples.
2. Dentro de variante (`hover(...)`, `medium(...)`, `dark(...)`).
3. Conflito (D58): genérica + específica, e duas de mesma especificidade.
4. Os dois esquemas de cor, se a saída depende do tema.
5. Os erros: entrada inválida → código de erro esperado (em dev) e comportamento
   em produção (ignorar, D35).

## Organização

- Um arquivo de teste por seção da spec, ao lado do código do pacote:
  `packages/core/test/variants.test.ts`.
- Testes de conformidade entre RN e web (mesmo `look`, resultado equivalente)
  ficam separados, porque dependem dos dois emissores.

## Quando um teste de ouro falha

1. Releia a regra da spec.
2. Se o **código** está errado: corrija o código.
3. Se o **teste** transcreveu a spec errado: corrija o teste, citando a regra.
4. Se a **spec** está errada ou ambígua: **não mude nada sozinho**. Leve ao
   Alan; a correção passa por `registrar-decisao` e `escrever-spec`.

**Nunca** altere o valor esperado só para o teste passar.
