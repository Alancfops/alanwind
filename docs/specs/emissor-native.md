# Spec: emissor React Native

Status: **rascunho, só o já decidido** · Decisões de origem: D14, D15, D45, D57, D59, D60, D62, D64

Tradução da IR em objetos de estilo e props do React Native, com cache por contexto.

## 1. Já definido

- **Alvo de referência: Expo SDK 58** (React Native 0.88, react-native-web 0.21, Node.js 22.13+); os tipos devem funcionar com a Strict TypeScript API do RN (D14, seção 3.1).
- **Resolução em runtime, com cache** (D15). A chave do cache inclui a string do `look` e o contexto (tema, esquema claro/escuro, largura da tela). Build fica como otimização futura.
- Faz parte da **fase 1** (D60).
- **Estados**: `hover(...)` só onde há ponteiro; `press(...)` vira o estado `pressed` (D59).
- **Herança de texto por contexto** (D57): `Box` e `Pressable` repassam `text-*`, `type-*`, `weight-*` e afins aos `Text` filhos; o `look` do próprio `Text` vence o herdado.
- **Layout padrão**: `Box` é sempre flex em coluna (D62).
- **Sombras** (D45): propriedades de sombra no iOS, elevação no Android; no escuro, a elevação aparece por fundo mais claro + borda fina.
- **Esquema de cor**: segue o sistema e pode ser forçado com `setColorScheme` sem Provider (D64).
- Texto respeita a **escala de fonte do sistema** (seção 5 da visão).

## 2. Ainda não definido

- Tradução exata de cada classe para propriedades do RN.
- Como tratar classes que viram props e não estilo (`lines-2`, `tap-target`).
- Comportamento de classes web-only no nativo (matriz de suporte ainda é proposta).
- Estratégia de invalidação do cache e tamanho máximo.
- Política de suporte de versões (SDK atual e anterior?).
