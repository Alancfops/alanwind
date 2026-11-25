# Spec: sintaxe do look

Status: **rascunho, só o já decidido** · Decisões de origem: D7, D13, D16 a D19, D23, D27 a D31, D34, D36 a D38, D58, D59, D61, D63

Gramática do `look`: tokens, variantes, valor livre com `=`, opacidade, atalhos e regra de conflito.

## 1. Já definido

### 1.1 Princípios
- Sintaxe **própria**: lembra o Tailwind no espírito, mas com gramática e vocabulário próprios (D13, D17).
- Prática e **fácil de escrever à mão** (D16).
- **Uma só forma óbvia** de escrever cada coisa (D18).
- Nomes **em inglês** (D7).

### 1.2 Onde a sintaxe aparece
- Na prop/atributo **`look`**, em todo lugar: `<Box look="...">` no RN e no React, `<div look="...">` no HTML (D27, D42).
- Na função de resolução, com o mesmo nome: `look('pad-4 bg-surface')` (D27).
- Não existe `className` nem `class` como forma alternativa (D27, D42).

### 1.3 Forma de um token
- Forma base: **`propriedade-valor`** com hífen (`pad-4`, `round-lg`) (D17).
- **Abreviação**: só o que é universal e curto: `w`, `h`, `x`, `y`. O resto fica por extenso: `pad`, `margin`, `round`, `gap` (D19).
- Palavras inteiras e legíveis para layout: `row`, `col`, `center`, `fill` (D18).
- Os tokens de um `look` são separados por espaço.

### 1.4 Variantes
- **Só com parêntese**: `hover(bg-raised shadow-md)`. Não existe a forma com dois-pontos (`hover:bg-x`) (D28).
- Uma variante pode agrupar vários tokens, separados por espaço (D18).
- Variantes de estado: `hover(...)` vale **só onde existe ponteiro**; `press(...)` vale para o elemento pressionado em todas as plataformas (D59).
- Variantes de tamanho de tela: **`medium(...)`** e **`expanded(...)`**. Valem **"a partir de"** (mobile-first): `medium(...)` vale em `medium` e acima (D29, D37).
- **`compact(...)` não existe** como variante: o que não tem variante vale para todos os tamanhos (D61).
- Variantes de plataforma: `ios(...)`, `android(...)`, `web(...)` (D18).
- Variante de esquema de cor: `dark(...)` (D33).
- Variante de acessibilidade: `motion-safe(...)` (D18).

### 1.5 Valor livre
- Valor fora da escala usa **`=`**: `w=137`, `pad=10`, `w=50%` (D30).
- Não usa colchetes nem parêntese (para não conflitar com variantes) (D30).
- Cor livre: `bg=red-40` (tom da paleta) ou `bg=#e11d48` (cor exata) (D33).

### 1.6 Cores nas classes
- `bg-` é cor de fundo; `text-` é **só cor do texto**; o tamanho de texto usa **`type-`** (D23).
- Classes usam **papéis**, não a paleta: existe `bg-danger`, não existe `bg-red-600` (D34).
- **Opacidade** na cor com sufixo numérico: `bg-primary-50` = 50% (D31).
- Nomes de papéis criados pela pessoa **não podem terminar em número** (D31).

### 1.7 Centralização
- `center`: os dois eixos. `center-x`: só horizontal. `center-y`: só vertical (D38).
- `center-x` e `center-y` se referem à **tela**, não à direção do layout: funcionam igual em `row` e `col` (D38).

### 1.8 Atalhos
- Atalhos definidos pela pessoa: `define('btn', 'bg-primary pad-4 round-md')`; depois `btn` vale como uma classe (D36).
- Atalhos são declarados **no arquivo de tema**, não soltos no código (D63).

### 1.9 Conflito entre classes do mesmo `look` (D58)
1. A **mais específica vence a genérica** (`pad-x-2` vence `pad-4` no eixo x; `pad-top` vence `pad-y`, que vence `pad`).
2. Entre classes de mesma especificidade, **vence a última escrita** (`bg-primary bg-surface` → `bg-surface`).
3. Em desenvolvimento, **aviso** quando duas classes de mesma especificidade disputam a mesma propriedade.

### 1.10 Classes inválidas
- Papel inexistente (ex.: `bg-banana`): **aviso ou erro em desenvolvimento, com sugestão**, e **ignorado em produção** sem quebrar o app (D35).
- Tipagem estrita: classes e tokens inválidos viram erro ou aviso, com autocomplete (D20, D66).

## 2. Ainda não definido

- Gramática formal (EBNF) e tokenização exata.
- Aninhamento de variantes (`dark(hover(...))`) e ordem entre elas.
- Opacidade em cor livre (`bg=red-40` + alfa): ambígua com o tom (seção 4 da visão).
- Variantes `focus(...)`, `disabled(...)`, `light(...)` e `native(...)`: aparecem no rascunho do vocabulário, sem decisão própria.
- Faixa exata de tamanho de tela (exceção ao "a partir de", D37).
- Códigos e textos das mensagens de erro.
- Formato exato do `define` no arquivo de tema.
- Vocabulário completo (seção 11 da visão ainda é rascunho, exceto onde há decisão).
