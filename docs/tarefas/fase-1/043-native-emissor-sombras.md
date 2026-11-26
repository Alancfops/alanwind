# 043. Native: emissor de `boxShadow`

- **Status**: bloqueada — aguarda `docs/specs/emissor-native.md` sair do
  rascunho e ser aprovada
- **Fase**: 1
- **Branch**: feature/native-emissor-sombras
- **Depende de**: 010
- **Paralelo com**: 041, 042, 044
- **Spec**: `docs/specs/emissor-native.md` seção 1 (sombras);
  `docs/specs/funcionamento-interno.md` R34, R35, seção 5.8
- **Decisões**: D45, D96, D108, D132, D137

## Objetivo
Traduzir a lista `boxShadow` da IR para o `boxShadow` do RN 0.76+ (nova
arquitetura), igual no iOS e no Android (D108).

## Escopo
- Faz: cada `ShadowLayer` (`offsetX`, `offsetY`, `blur`, `spread`, `color`
  com `alpha`) vira uma camada do `boxShadow` do RN, na mesma ordem.
- Não faz: elevação do escuro, troca de fundo e borda (já expandidas pelo
  `core` em camadas comuns, `032`; o emissor não conhece elevação, R35);
  `shadow*`/`elevation` antigos (substituídos pela D108); valores do tema.

## Arquivos permitidos
- Implementador: `packages/native/src/emit/shadow.ts`,
  `packages/native/src/emit/index.ts`.
- QA: `packages/native/test/emit-shadow.test.ts` (Vitest).

## Critérios de aceite
- [ ] Os `boxShadow` das camadas da seção 5.8 da `funcionamento-interno.md`
      (claro: `shadow-md` com duas camadas; escuro: uma) saem exatos e na
      mesma ordem.
- [ ] Nenhuma propriedade `shadowColor`, `shadowOffset` ou `elevation` é
      gerada (D108).

## Casos que o QA deve cobrir
- `boxShadow` de `shadow-sm`, `shadow-md` e `shadow-lg`, claro e escuro
  (valores da tabela 5.7 do `tema.md`, escritos como IR).

## Lacunas que bloqueiam (`emissor-native.md` seção 2)
- Forma da saída: string CSS (`'0 4px 8px rgba(0,0,0,0.08), ...'`) ou lista
  de objetos (`[{ offsetX, offsetY, blurRadius, spreadDistance, color }]`)?
  O RN aceita as duas; a spec ainda não escolheu.
