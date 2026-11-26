# Spec: emissor React Native

Status: **rascunho, só o já decidido** · Decisões de origem: D14, D15, D45, D57,
D59, D60, D62, D64, D107 a D110, D116, D117, D119, D120, D133, D135, D136

Tradução da IR em objetos de estilo e props do React Native, com cache por
contexto.

## 1. Já definido

- **Alvo de referência: Expo SDK 58** (React Native 0.88, react-native-web 0.21,
  Node.js 22.13+); os tipos devem funcionar com a Strict TypeScript API do RN
  (D14, seção 3.1). Suporte: só o SDK atual enquanto 0.x; atual e anterior a
  partir da 1.0 (D116).
- **Resolução em runtime, com cache** (D15). A chave do cache inclui a string do
  `look` e o contexto (tema, esquema claro/escuro, largura da tela). Build fica
  como otimização futura.
- Faz parte da **fase 1** (D60).
- **Estados**: `hover(...)` só onde há ponteiro; `press(...)` vira o estado
  `pressed` (D59).
- **Herança de texto por contexto** (D57): `Box` e `Pressable` repassam
  `text-*`, `type-*`, `weight-*` e afins aos `Text` filhos; o `look` do próprio
  `Text` vence o herdado.
- **Layout padrão**: `Box` é sempre flex em coluna (D62).
- **Sombras** com `boxShadow`, igual no iOS e no Android, com as camadas da D96
  (D108). No escuro, a elevação clareia o fundo e adiciona borda fina (D97).
- **Eixos expandidos**: `pad-x-4` → `paddingLeft` + `paddingRight`; `margin-y-2`
  → `marginTop` + `marginBottom` (D107).
- **Cache**: chave = `look` + faixa de tela (não a largura exata) + esquema de
  cor + plataforma + tema; LRU de ~500 entradas (D109).
- **Ponteiro**: `hover(...)` vale enquanto chega o evento de hover
  (`onHoverIn`/`onHoverOut`); sem ponteiro, nunca vale (D110).
- **Esquema de cor**: segue o sistema e pode ser forçado com `setColorScheme`
  sem Provider (D64).
- Texto respeita a **escala de fonte do sistema** (seção 5 da visão).
- **Camadas**: o emissor aplica as camadas de estilo **e as de props** na ordem
  da lista; entre as que valem no momento, a posterior vence, propriedade a
  propriedade. A precedência (com condição vence sem condição, mais condições
  vencem menos, faixa maior vence) já está na ordem da IR e o emissor não a
  reimplementa (D117, D135, `funcionamento-interno.md`).
- **Fontes por plataforma** (D133): `fontFamily` genérica da IR vira
  `font-sans` = San Francisco no iOS e Roboto no Android; `font-serif` =
  Georgia no iOS e `serif` no Android; `font-mono` = Menlo no iOS e
  `monospace` no Android. Nenhuma fonte é baixada.
- **Configuração no RN** (D119): `defineConfig` e `configure` vêm de
  `@alanwind/native`; o app chama `configure(config)` uma vez, no arquivo de
  entrada. Sem a chamada, os atalhos ficam desligados, com aviso em dev.

## 2. Ainda não definido

- Tradução exata de cada classe para propriedades do RN.
- Tradução das props da IR (D83) para props do RN (ex.: `lines-2` →
  `numberOfLines`). A área mínima de toque é do `Pressable`, não de uma classe
  (D78).
- Comportamento de classes web-only no nativo (matriz de suporte ainda é
  proposta).

