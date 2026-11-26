# 035. Core: atalhos, expansão no `look`

- **Status**: pronta (depois da 029 e da 034)
- **Fase**: 1
- **Branch**: feature/core-atalhos-expansao
- **Depende de**: 029, 034
- **Paralelo com**: 030, 031, 032
- **Spec**: `docs/specs/sintaxe.md` R43 a R45, R66, seção 7.5;
  `docs/specs/funcionamento-interno.md` R6, R38, R49, seção 5.9;
  `docs/specs/tema.md` R23, R24
- **Decisões**: D36, D101, D127, D135, D139, D144

## Objetivo
Expandir os atalhos válidos (da `034`) no lugar onde aparecem no `look`,
antes da resolução, de modo que a IR não saiba que existiram atalhos e que
os erros de dentro do atalho apontem para o nome dele.

## Escopo
- Faz:
  - A resolução da `021` passa a receber os atalhos válidos junto do tema.
  - Expansão no lugar, inclusive dentro de variante (`hover(btn)`) e de
    atalho dentro de atalho (R43, R44, R6).
  - Conflito entre as classes expandidas e as vizinhas como se tivessem sido
    escritas ali (R45): em `btn pad-8`, o `AW201` aponta o nome `btn`
    (`[0,3)`).
  - Erro no conteúdo do atalho: `position` = nome do atalho no `look`, e
    `origin` = `{ shortcut, position }`, com a posição do trecho dentro do
    texto do `define` (R49, R66). Diagnósticos fora de atalho não têm
    `origin`.
- Não faz: validar o `define` (`034`); ler o arquivo de configuração ou
  guardar a configuração (`046`).

## Arquivos permitidos
- Implementador: `packages/core/src/shortcuts/**`,
  `packages/core/src/resolve/**` (só a entrada dos atalhos),
  `packages/core/src/index.ts`.
- QA: `packages/core/test/shortcuts-expansion.test.ts`.

## Critérios de aceite
- [ ] Cada linha da seção 7.5 da `sintaxe.md` dá a saída e os diagnósticos
      exatos.
- [ ] O exemplo `pad-4 btn` com `btn: 'bg-primary pad-17'` da seção 5.9 da
      `funcionamento-interno.md` sai exatamente igual, com o `origin`.
- [ ] A IR de `btn` é igual à IR do texto do atalho escrito no lugar (R6).

## Casos que o QA deve cobrir
Com `btn: 'bg-primary pad-4'`:
- `btn`; `btn hover(bg-primary-hover)`; `hover(btn)`; `btn pad-8` →
  `AW201[0,3)`.

Com `btn: 'bg-primary pad-17'`:
- `pad-4 btn` → `AW103` em `[6,9)` com `origin`
  `{ shortcut: 'btn', position: { start: 11, end: 17 } }`.

Com `a: 'pad-4', b: 'a round-md'` (`tema.md` 7.3):
- `b` → `pad-4 round-md` resolvidos.

Sem atalhos:
- `btn` → `AW101` (nenhum diagnóstico com `origin`).

Com atalho descartado pela `034` (D144):
- `define: { a: 'b', b: 'a' }` e `look` `a pad-4` → `AW101[0,1)` e `PAD(16)`.
- `define: { row: 'pad-4' }` e `look` `row` → vale a classe nativa `row`
  (o atalho foi descartado; a classe continua existindo).

## Observação
- Erro dentro de um atalho usado por outro atalho (`b` usa `a`, erro em `a`):
  a spec não tem exemplo de qual atalho vai no `origin`. Se a implementação
  precisar escolher, o implementador para e relata.
