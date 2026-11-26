# Spec: emissor CSS

Status: **rascunho, só o já decidido** · Decisões de origem: D4, D42, D45, D55,
D56, D59, D65, D117, D120, D133, D135, D136

Tradução da IR em CSS, reescrita do `look` em classe gerada e script da CDN.

## 1. Já definido

- **Plugin de build (Vite/PostCSS) para produção**: gera só o CSS usado, antes
  de publicar (D4, D55).
- **`look` no HTML puro**: `<div look="...">` é suportado, como caso de menor
  prioridade (D42).
- **Reescrita no build** (D65): o plugin troca o `look` por uma classe gerada
  (ex.: `class="aw-x7f2"`) no HTML final e o CSS usa essa classe. Funciona com
  variantes agrupadas. No código-fonte só existe `look`.
- **CDN é um script**, não CSS pré-gerado (D55): lê os atributos `look`, gera o
  CSS no navegador e liga aos elementos. Indicado para testes e páginas simples.
  Deve ficar no `<head>` para evitar o "pisca".
- **Instalação por npm** para qualquer projeto com bundler; outros frameworks
  (Vue, Svelte, Astro) usam o atributo `look` com o plugin (D56).
- **Estados**: `hover(...)` vira `:hover` (só onde há ponteiro); `press(...)`
  vira `:active` (D59).
- **Sombras**: `box-shadow`; no escuro, fundo mais claro + borda fina (D45).
- Texto em unidades que respeitam zoom (`rem`) (seção 5 da visão).
- Vem **depois** do emissor RN (D60).
- **Camadas**: as camadas de estilo e as de props chegam em ordem; a precedência
  entre condições (D117, D135) já está na IR e o emissor não a reimplementa.
- **Fontes na web** (D133): `font-sans` = pilha `system-ui`; `font-serif` =
  pilha Georgia/serif; `font-mono` = pilha `ui-monospace`. Nenhuma fonte é
  baixada.

## 2. Ainda não definido

- Formato e estabilidade do nome da classe gerada (hash).
- Como o script da CDN observa mudanças na página (elementos adicionados
  depois).
- Tradução de breakpoints (`medium`, `expanded`) em media queries: larguras
  exatas.
- Tradução de `dark(...)` combinada com `setColorScheme` forçado.
- CSS pré-gerado como extra da CDN (proposta).
