# 061. Validação da fase 1 no ShadowPlatinum

- **Status**: pronta (depois da 054 e da 060); as telas são escolhidas pelo
  Alan quando a tarefa começar (D147)
- **Executor**: sessão principal com o Alan (o trabalho fica fora deste
  repositório; os hooks dos agentes não liberam esse caminho)
- **Fase**: 1
- **Branch**: — (no repositório da cópia do ShadowPlatinum, não aqui)
- **Depende de**: 054, 060
- **Paralelo com**: —
- **Spec**: `docs/specs/componentes.md`, `docs/specs/tema.md`
- **Decisões**: D14, D60, D80, D116, D142, D147

## Objetivo
Fechar a fase 1 com uso real: numa **cópia** do ShadowPlatinum em
`~/myProjects/`, atualizada para o Expo SDK 58, trocar `StyleSheet.create` pelo
alanwind (D80), instalado a partir dos pacotes que seriam publicados (D147).

## Escopo
- Faz:
  - Gerar `@alanwind/core` e `@alanwind/native` com `pnpm pack` neste
    repositório e instalar os `.tgz` na cópia, como se viessem do npm (D147).
  - Copiar o repositório; atualizar a cópia para o SDK 58 (D14, D116).
  - Nas telas que o Alan escolher ao começar a tarefa (D147), trocar
    `StyleSheet.create` por `Box`, `Text`, `Pressable` e `look`, com
    `configure(config)` no arquivo de entrada.
  - Listar o que faltou no vocabulário da fase 1.
- Não faz: alterar o app original (D80); publicar no npm.

## Arquivos permitidos
- Nada neste repositório. Achados viram decisões (skill `registrar-decisao`)
  ou tarefas novas.

## Critérios de aceite
- [ ] Os `.tgz` de `pnpm pack` instalam na cópia sem erro e sem referência a
      `workspace:` (prova de que o pacote publicável funciona).
- [ ] A cópia roda no SDK 58 com as telas escolhidas usando só o alanwind.
- [ ] Claro e escuro funcionam nas telas escolhidas.
- [ ] Relatório com o que faltou ou incomodou, para a fase seguinte.

## Casos que o QA deve cobrir
- Checklist visual das telas escolhidas, antes e depois, nos dois esquemas.
