# 055. Pacote fachada `alanwind`

- **Status**: bloqueada — aguarda decisão do Alan sobre a fachada entrar na fase
  1 e sobre o que ela reexporta
- **Fase**: 1 (a confirmar)
- **Branch**: feature/alanwind-fachada
- **Depende de**: 054
- **Paralelo com**: 060
- **Spec**: nenhuma spec cobre a fachada ainda
- **Decisões**: D56, D68

## Objetivo
`npm install alanwind` como porta de entrada, só reexportando (skill
`codigo-limpo`: fachada sem lógica).

## Escopo
- Faz: `packages/alanwind` com `package.json` (`alanwind`), reexportações
  decididas, zero lógica.
- Não faz: publicar no npm (o nome ainda precisa ser conferido, D12, D68).

## Arquivos permitidos
- Implementador: `packages/alanwind/**`.
- QA: `packages/alanwind/test/exports.test.ts`.

## Critérios de aceite
- [ ] O pacote só contém reexportações.
- [ ] Os nomes reexportados batem com a lista decidida.

## Casos que o QA deve cobrir
- Cada export decidido existe e é o mesmo objeto do pacote de origem.

## Lacunas que bloqueiam
- A fachada entra na fase 1? (D60 não a cita; D68 a define.)
- O que ela reexporta: só `@alanwind/native`? Como fica quando chegar o `css` na
  fase 2 (subcaminhos como `alanwind/native`)?
