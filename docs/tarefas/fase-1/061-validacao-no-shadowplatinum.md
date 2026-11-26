# 061. Validação da fase 1 no ShadowPlatinum

- **Status**: bloqueada — aguarda as outras tarefas e as decisões abaixo
- **Executor**: sessão principal com o Alan (o trabalho fica fora deste
  repositório; os hooks dos agentes não liberam esse caminho)
- **Fase**: 1
- **Branch**: — (no repositório da cópia do ShadowPlatinum, não aqui)
- **Depende de**: 054, 060
- **Paralelo com**: —
- **Spec**: `docs/specs/componentes.md`, `docs/specs/tema.md`
- **Decisões**: D14, D60, D80, D116

## Objetivo
Fechar a fase 1 com uso real: numa **cópia** do ShadowPlatinum em
`~/myProjects/`, atualizada para o Expo SDK 58, trocar `StyleSheet.create` pelo
alanwind (D80).

## Escopo
- Faz: copiar o repositório; atualizar a cópia para o SDK 58 (D14, D116);
  trocar `StyleSheet.create` por `Box`, `Text`, `Pressable` e `look`; listar o
  que faltou no vocabulário da fase 1.
- Não faz: alterar o app original (D80); publicar o alanwind no npm.

## Arquivos permitidos
- Nada neste repositório. Achados viram issues, decisões (skill
  `registrar-decisao`) ou tarefas novas.

## Critérios de aceite
- [ ] A cópia roda no SDK 58 com as telas escolhidas usando só o alanwind.
- [ ] Claro e escuro funcionam nas telas escolhidas.
- [ ] Relatório com o que faltou ou incomodou, para a fase seguinte.

## Casos que o QA deve cobrir
- Checklist visual das telas escolhidas, antes e depois, nos dois esquemas.

## Lacunas que bloqueiam
- Quais telas do ShadowPlatinum serão convertidas (todas ou uma amostra)?
- Como a cópia consome o alanwind antes de publicar: `pnpm pack`, `link`,
  workspace externo ou uma versão `0.x` publicada pelo Release (D142)?
